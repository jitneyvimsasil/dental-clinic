// Creates (or updates in place, if RETELL_AGENT_ID is already set) the
// Retell LLM + Agent via the API rather than clicking through the
// dashboard, so the configuration is reproducible and reviewable. Run via
// `npm run setup:retell`.
import { config } from "dotenv";
import Retell from "retell-sdk";
import { TREATMENT_OPTIONS, CLINIC, HOURS } from "../src/lib/constants";

config({ path: ".env.local" });

const DEPLOYED_URL = process.env.DEPLOYED_URL;
if (!DEPLOYED_URL) {
  console.error("Set DEPLOYED_URL (e.g. https://dental-clinic-kohl-five.vercel.app) before running this.");
  process.exit(1);
}

const client = new Retell();

const HOURS_TEXT = HOURS.map((h) => `${h.days}: ${h.hours}`).join("\n");

const GENERAL_PROMPT = `You are Aya, the AI receptionist for ${CLINIC.name}, a family dental clinic in ${CLINIC.address}. Speak warmly and professionally, the way a caring front-desk receptionist would — this is a phone call, so keep responses concise and conversational, not a script being read aloud.

Real business info — use these exact facts, never guess or improvise business hours, phone, or address:
Phone: ${CLINIC.phone}
Email: ${CLINIC.email}
Hours:
${HOURS_TEXT}

Your job on every call:
1. Greet the caller warmly and ask how you can help.
2. Ask for their phone number and call lookup_patient to check if they're already in our system.
3. Ask what brings them in (routine checkup, a specific concern, urgent pain) and judge urgency: emergency, soon, or routine.
4. Call check_availability to find open slots. Offer 2-3 concrete options (day, time, dentist name) rather than asking the caller to name a time themselves.
5. If lookup_patient found nothing, collect their full name, email, and preferred treatment, then call create_patient.
6. Once the caller agrees to a specific slot, call book_appointment with that slot and the patient's id.
7. Read back the confirmed date, time, and dentist clearly, and mention a confirmation email will follow.

Important:
- Never give medical or clinical advice. If asked about symptoms, treatment specifics, medication, or pricing, say the dentist's team will go over that in person at the visit.
- If a slot turns out to be taken when you try to book it, apologize briefly and offer another open slot from the same check_availability results instead of giving up.
- If no slots are available at all, apologize and suggest the caller try again in a few days, or offer to have someone call them back.`;

const GENERAL_TOOLS: Retell.Llm.LlmCreateParams["general_tools"] = [
  {
    type: "custom",
    name: "check_availability",
    speak_during_execution: true,
    speak_after_execution: true,
    description:
      "Check for available dental appointment slots. Call this before offering the caller a booking time.",
    url: `${DEPLOYED_URL}/api/retell/functions`,
    parameters: {
      type: "object",
      properties: {
        fromDate: {
          type: "string",
          description: "Only show slots on or after this ISO 8601 datetime. Omit to search from now.",
        },
        limit: {
          type: "number",
          description: "Max number of slots to return (up to 10). Defaults to 5.",
        },
      },
    },
  },
  {
    type: "custom",
    name: "lookup_patient",
    speak_during_execution: true,
    speak_after_execution: true,
    description: "Look up an existing patient record by phone number.",
    url: `${DEPLOYED_URL}/api/retell/functions`,
    parameters: {
      type: "object",
      required: ["phone"],
      properties: {
        phone: { type: "string", description: "The caller's phone number." },
      },
    },
  },
  {
    type: "custom",
    name: "create_patient",
    speak_during_execution: true,
    speak_after_execution: true,
    description:
      "Create a new patient record. Only call this after lookup_patient confirms the caller isn't already on file.",
    url: `${DEPLOYED_URL}/api/retell/functions`,
    parameters: {
      type: "object",
      required: ["name", "phone", "email", "treatment"],
      properties: {
        name: { type: "string", description: "The patient's full name." },
        phone: { type: "string", description: "The patient's phone number." },
        email: { type: "string", description: "The patient's email address, for the booking confirmation." },
        treatment: {
          type: "string",
          description:
            "The treatment they need — pick the closest match. Use 'Other' if nothing fits (e.g. an extraction).",
          enum: [...TREATMENT_OPTIONS],
        },
        insurance: { type: "string", description: "Insurance provider, if any. Omit if not mentioned." },
        urgency: {
          type: "string",
          enum: ["emergency", "soon", "routine"],
          description: "How urgent the visit is, based on what the caller described.",
        },
      },
    },
  },
  {
    type: "custom",
    name: "book_appointment",
    speak_during_execution: true,
    speak_after_execution: true,
    description: "Book the appointment once a slot and patient are both confirmed.",
    url: `${DEPLOYED_URL}/api/retell/functions`,
    parameters: {
      type: "object",
      required: ["availabilityId", "patientId"],
      properties: {
        availabilityId: {
          type: "string",
          description: "The slotId from check_availability for the slot the caller agreed to.",
        },
        patientId: {
          type: "string",
          description: "The patient's id, from lookup_patient or create_patient.",
        },
        treatmentType: {
          type: "string",
          description: "A short free-text description of what's being booked for (e.g. 'Tooth Extraction').",
        },
      },
    },
  },
  { type: "end_call", name: "end_call", description: "End the call once the booking is confirmed or the caller is done." },
];

async function main() {
  const existingAgentId = process.env.RETELL_AGENT_ID;

  if (existingAgentId) {
    const agent = await client.agent.retrieve(existingAgentId);
    if (agent.response_engine.type !== "retell-llm") {
      throw new Error(`Agent ${existingAgentId} doesn't use a retell-llm response engine — can't update in place.`);
    }
    const llmId = agent.response_engine.llm_id;

    await client.llm.update(llmId, {
      general_prompt: GENERAL_PROMPT,
      general_tools: GENERAL_TOOLS,
    });
    console.log(`Updated existing LLM ${llmId} (agent ${existingAgentId}) in place.`);
    return;
  }

  const llm = await client.llm.create({
    general_prompt: GENERAL_PROMPT,
    model: "claude-4.5-sonnet",
    model_temperature: 0.3,
    general_tools: GENERAL_TOOLS,
  });

  console.log("Created LLM:", llm.llm_id);

  const agent = await client.agent.create({
    response_engine: { type: "retell-llm", llm_id: llm.llm_id },
    voice_id: "retell-Cimo",
    agent_name: "Serene Dental Receptionist (Aya)",
    webhook_url: `${DEPLOYED_URL}/api/retell/webhook`,
  });

  console.log("Created Agent:", agent.agent_id);
  console.log("\nAdd this to .env.local and Vercel:");
  console.log(`RETELL_AGENT_ID=${agent.agent_id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
