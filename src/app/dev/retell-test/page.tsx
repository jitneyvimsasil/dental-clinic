"use client";

import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

// Minimal standalone page to prove the RetellAI Web Call wiring end-to-end
// (real deployed API routes, real secret verification, real Supabase
// writes) before this logic moves into the polished floating widget in
// Phase 5. Not linked from anywhere in the marketing site.
type CallState = "idle" | "connecting" | "active" | "ended" | "error";

export default function RetellTestPage() {
  const clientRef = useRef<RetellWebClient | null>(null);
  const [state, setState] = useState<CallState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [agentTalking, setAgentTalking] = useState(false);

  useEffect(() => {
    const client = new RetellWebClient();
    clientRef.current = client;

    client.on("call_started", () => setState("active"));
    client.on("call_ended", () => setState("ended"));
    client.on("agent_start_talking", () => setAgentTalking(true));
    client.on("agent_stop_talking", () => setAgentTalking(false));
    client.on("error", (message: string) => {
      setError(message);
      setState("error");
      client.stopCall();
    });

    return () => {
      client.stopCall();
    };
  }, []);

  async function startCall() {
    setError(null);
    setState("connecting");
    try {
      const res = await fetch("/api/retell/create-web-call", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to create call.");
      }
      const { accessToken } = await res.json();
      await clientRef.current?.startCall({ accessToken });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  function endCall() {
    clientRef.current?.stopCall();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center space-y-6">
        <h1 className="text-xl font-semibold">RetellAI Web Call Test</h1>
        <p className="text-sm text-muted-foreground">
          Status: <span className="font-medium">{state}</span>
          {state === "active" && agentTalking && " — Aya is talking"}
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}

        {state === "idle" || state === "ended" || state === "error" ? (
          <button
            onClick={startCall}
            className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-primary-foreground"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            disabled={state === "connecting"}
            className="px-5 py-2.5 rounded-lg font-semibold bg-destructive text-white disabled:opacity-50"
          >
            {state === "connecting" ? "Connecting…" : "End Call"}
          </button>
        )}
      </div>
    </main>
  );
}
