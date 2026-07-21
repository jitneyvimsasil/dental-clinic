import { NextRequest, NextResponse } from "next/server";
import { verifyRetellSignature } from "@/lib/security/verify-retell-signature";
import { createServiceClient } from "@/lib/supabase/service";
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

// Single dispatch endpoint for every RetellAI custom function
// (check_availability / lookup_patient / create_patient / book_appointment).
// One URL, one signature check, one place to log every call — simpler to
// secure and instrument than four separate routes.
//
// RetellAI expects a 200-299 response whose body becomes the function
// result text fed back to the LLM. Expected business outcomes (an
// already-taken slot, a validation issue) are returned as 200 with a
// descriptive message so the conversation can continue gracefully, rather
// than triggering RetellAI's retry-then-fail behavior on repeated requests
// that would just fail identically. Only signature verification failure
// gets a real 401 — that's a genuine security rejection, not a
// conversational outcome.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-retell-signature");

  if (!verifyRetellSignature(rawBody, signature, process.env.RETELL_API_KEY)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { name?: string; args?: unknown };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request body." });
  }

  const supabase = createServiceClient();

  try {
    switch (body.name) {
      case "check_availability": {
        const input = checkAvailabilitySchema.parse(body.args ?? {});
        const slots = await checkAvailability(supabase, input);
        return NextResponse.json({ slots });
      }
      case "lookup_patient": {
        const input = lookupPatientSchema.parse(body.args ?? {});
        const patient = await lookupPatient(supabase, input);
        return NextResponse.json({ patient });
      }
      case "create_patient": {
        const input = createPatientSchema.parse(body.args ?? {});
        const patient = await createPatient(supabase, input);
        return NextResponse.json({ patient });
      }
      case "book_appointment": {
        const input = bookAppointmentSchema.parse(body.args ?? {});
        const appointment = await bookAppointment(supabase, input);
        return NextResponse.json({ appointment });
      }
      default:
        return NextResponse.json({ error: `Unknown function: ${body.name}` });
    }
  } catch (err) {
    if (err instanceof SlotUnavailableError) {
      return NextResponse.json({
        error: "slot_unavailable",
        message: "That time slot was just taken. Please offer the caller another available slot.",
      });
    }
    console.error("Retell function call failed:", body.name, err);
    return NextResponse.json({
      error: "internal_error",
      message: "Something went wrong on our end handling that request.",
    });
  }
}
