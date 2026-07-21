import { NextResponse } from "next/server";
import Retell from "retell-sdk";

// The browser can't hold RETELL_API_KEY, so this route calls RetellAI's
// management API server-side to mint a short-lived Web Call session and
// returns only the access token the client SDK needs — the API key itself
// never reaches client JS, same principle as every other secret in this
// project. Retell({}) picks up RETELL_API_KEY from the environment
// automatically (matches the SDK's documented default).
export async function POST() {
  const agentId = process.env.RETELL_AGENT_ID;

  if (!process.env.RETELL_API_KEY || !agentId) {
    return NextResponse.json(
      { error: "Voice call is not configured yet." },
      { status: 500 }
    );
  }

  try {
    const client = new Retell();
    const call = await client.call.createWebCall({ agent_id: agentId });

    return NextResponse.json({
      accessToken: call.access_token,
      callId: call.call_id,
    });
  } catch (err) {
    console.error("Failed to create Retell web call:", err);
    return NextResponse.json(
      { error: "Could not start the call. Please try again." },
      { status: 502 }
    );
  }
}
