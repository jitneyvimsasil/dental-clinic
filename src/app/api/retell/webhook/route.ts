import { NextRequest, NextResponse } from "next/server";
import { verifyRetellSignature } from "@/lib/security/verify-retell-signature";

// Call-lifecycle events (call_started/call_ended/call_analyzed, etc.) from
// RetellAI's agent-level webhook. Logging only for now — a second
// async-trigger point gets added in Phase 3 alongside the Supabase Database
// Webhook on appointments INSERT.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-retell-signature");

  if (!verifyRetellSignature(rawBody, signature, process.env.RETELL_API_KEY)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { event?: string; call?: { call_id?: string } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  console.log("Retell call event:", body.event, body.call?.call_id);

  return new NextResponse(null, { status: 204 });
}
