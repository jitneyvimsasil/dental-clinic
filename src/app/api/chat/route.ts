import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
import { isRateLimited, clientIp } from "@/lib/security/rate-limit";
import { TREATMENT_OPTIONS, CLINIC, HOURS } from "@/lib/constants";
import { MAX_MESSAGE_LENGTH } from "@/lib/types";
import {
  checkAvailabilitySchema,
  lookupPatientSchema,
  createPatientSchema,
  bookAppointmentSchema,
} from "@/lib/booking-schema";
import {
  checkAvailability,
  lookupPatient,
  createPatient,
  bookAppointment,
  SlotUnavailableError,
} from "@/lib/booking-core";

// Replaces the old direct-to-n8n chat webhook. The client (src/hooks/
// useChat.ts, via src/lib/api.ts's sendChatMessage) only ever sends the
// latest message plus a sessionId, never full history — that contract is
// preserved unchanged so the widget UI needs no changes. Conversation
// history is kept server-side in the chat_sessions table instead (Vercel's
// serverless functions have no reliable in-process memory across turns).
const RATE_LIMIT = { max: 20, windowMs: 10 * 60 * 1000 } as const;
const MAX_TOOL_ITERATIONS = 5;

const HOURS_TEXT = HOURS.map((h) => `${h.days}: ${h.hours}`).join("\n");

const SYSTEM_PROMPT = `You are Aya, the AI assistant for ${CLINIC.name}, a family dental clinic in ${CLINIC.address}, chatting with a visitor on the website. Be warm, helpful, and concise.

Real business info — use these exact facts, never guess or improvise business hours, phone, or address:
Phone: ${CLINIC.phone}
Email: ${CLINIC.email}
Hours:
${HOURS_TEXT}

Your job:
1. Understand what the visitor needs (a booking, a question about services, etc).
2. If they want to book, ask for their phone number and call lookup_patient to check if they're already a patient.
3. Ask what treatment they need and how urgent it is.
4. Call check_availability and offer 2-3 concrete slot options.
5. If lookup_patient found nothing, collect their full name and email, then call create_patient.
6. Once they've picked a slot, call book_appointment.
7. Confirm the booking clearly and mention a confirmation email will follow.

Important:
- Never give medical or clinical advice, treatment specifics, or pricing — say the team will cover that in person or over a call.
- If a slot turns out to be taken, apologize briefly and offer another option instead of giving up.
- Keep replies short and conversational — this is a chat widget, not an essay.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "check_availability",
    description: "Check for available dental appointment slots.",
    input_schema: {
      type: "object",
      properties: {
        fromDate: { type: "string", description: "ISO 8601 datetime to search from. Omit to search from now." },
        limit: { type: "number", description: "Max slots to return (up to 10). Defaults to 5." },
      },
    },
  },
  {
    name: "lookup_patient",
    description: "Look up an existing patient record by phone number.",
    input_schema: {
      type: "object",
      required: ["phone"],
      properties: { phone: { type: "string", description: "The visitor's phone number." } },
    },
  },
  {
    name: "create_patient",
    description: "Create a new patient record. Only after lookup_patient confirms they're not already on file.",
    input_schema: {
      type: "object",
      required: ["name", "phone", "email", "treatment"],
      properties: {
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        treatment: { type: "string", enum: [...TREATMENT_OPTIONS] },
        insurance: { type: "string", description: "Omit if not mentioned." },
        urgency: { type: "string", enum: ["emergency", "soon", "routine"] },
      },
    },
  },
  {
    name: "book_appointment",
    description: "Book the appointment once a slot and patient are both confirmed.",
    input_schema: {
      type: "object",
      required: ["availabilityId", "patientId"],
      properties: {
        availabilityId: { type: "string", description: "The slotId from check_availability." },
        patientId: { type: "string", description: "From lookup_patient or create_patient." },
        treatmentType: { type: "string" },
      },
    },
  },
];

async function executeTool(
  supabase: ReturnType<typeof createServiceClient>,
  name: string,
  input: unknown
): Promise<object> {
  switch (name) {
    case "check_availability":
      return { slots: await checkAvailability(supabase, checkAvailabilitySchema.parse(input)) };
    case "lookup_patient":
      return { patient: await lookupPatient(supabase, lookupPatientSchema.parse(input)) };
    case "create_patient":
      // isNewPatient forced true — same reasoning as the Retell route:
      // this only ever runs for a visitor lookup_patient already missed.
      return {
        patient: await createPatient(
          supabase,
          createPatientSchema.parse({ ...(input as object), isNewPatient: true })
        ),
      };
    case "book_appointment":
      try {
        return {
          appointment: await bookAppointment(
            supabase,
            bookAppointmentSchema.parse({ ...(input as object), source: "web" })
          ),
        };
      } catch (err) {
        if (err instanceof SlotUnavailableError) {
          return { error: "slot_unavailable", message: "That slot was just taken — please offer another one." };
        }
        throw err;
      }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (isRateLimited(`chat:${ip}`, RATE_LIMIT.max, RATE_LIMIT.windowMs)) {
    return NextResponse.json({ error: "Too many messages. Please wait a moment." }, { status: 429 });
  }

  let body: { sessionId?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  const message = body.message?.trim();

  if (!sessionId || !message) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` }, { status: 400 });
  }

  const supabase = createServiceClient();
  const anthropic = new Anthropic();

  try {
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("messages")
      .eq("session_id", sessionId)
      .maybeSingle();

    const history: Anthropic.MessageParam[] = (session?.messages as Anthropic.MessageParam[]) ?? [];
    history.push({ role: "user", content: message });

    let finalText = "";

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: history,
        tools: TOOLS,
      });

      if (response.stop_reason !== "tool_use") {
        finalText = response.content
          .filter((block): block is Anthropic.TextBlock => block.type === "text")
          .map((block) => block.text)
          .join("\n");
        history.push({ role: "assistant", content: response.content });
        break;
      }

      history.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        try {
          const result = await executeTool(supabase, block.name, block.input);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        } catch (err) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify({ error: "Something went wrong running that." }),
            is_error: true,
          });
          console.error("Chat tool execution failed:", block.name, err);
        }
      }
      history.push({ role: "user", content: toolResults });
    }

    if (!finalText) {
      finalText = "Sorry, I'm having trouble with that request. Could you try rephrasing?";
      history.push({ role: "assistant", content: finalText });
    }

    await supabase
      .from("chat_sessions")
      .upsert({ session_id: sessionId, messages: history, updated_at: new Date().toISOString() });

    return NextResponse.json({ output: finalText });
  } catch (err) {
    console.error("Chat request failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
