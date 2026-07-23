import { NextRequest, NextResponse } from "next/server";
import { createPatientSchema } from "@/lib/booking-schema";
import { createServiceClient } from "@/lib/supabase/service";
import { isRateLimited, clientIp } from "@/lib/security/rate-limit";

// Replaces the old direct-to-n8n intake webhook — IntakeForm.tsx posts
// here instead, keeping the exact IntakeResponse shape ({success,
// message, error?}) it already expects so the form component needs no
// changes. Lead capture only — the form has no slot-selection UI, so this
// creates/updates a patient record for staff to follow up on via the
// dashboard, it doesn't book an appointment.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (isRateLimited(`intake:${ip}`, RATE_LIMIT.max, RATE_LIMIT.windowMs)) {
    return NextResponse.json(
      { success: false, message: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = createPatientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the form and try again." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const supabase = createServiceClient();

  try {
    const { data: existing } = await supabase
      .from("patients")
      .select("id")
      .eq("phone", input.phone)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("patients")
        .update({
          name: input.name,
          email: input.email,
          treatment: input.treatment,
          insurance: input.insurance || null,
          urgency: input.urgency,
        })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("patients").insert({
        name: input.name,
        phone: input.phone,
        email: input.email,
        treatment: input.treatment,
        insurance: input.insurance || null,
        is_new_patient: input.isNewPatient,
        urgency: input.urgency,
      });
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll be in touch shortly to confirm your appointment.",
    });
  } catch (err) {
    console.error("Intake submission failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or call us directly." },
      { status: 500 }
    );
  }
}
