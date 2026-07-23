"use client";

import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { Phone, PhoneOff, Loader2 } from "lucide-react";

// Same Web Call wiring proved out on /dev/retell-test — real deployed
// create-web-call route, real RetellAI SDK — now with the connecting/
// talking/ended UI states a visitor actually needs, instead of a bare
// test button.
type CallState = "idle" | "connecting" | "active" | "ended" | "error";

export function CallPanel() {
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
        throw new Error(body.error ?? "Failed to start the call.");
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
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-8 text-center">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
          state === "active"
            ? agentTalking
              ? "bg-primary text-primary-foreground animate-pulse"
              : "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {state === "connecting" ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : state === "active" ? (
          <Phone className="w-6 h-6" />
        ) : (
          <PhoneOff className="w-6 h-6" />
        )}
      </div>

      <div>
        <p className="text-sm font-medium">
          {state === "idle" && "Talk to Aya"}
          {state === "connecting" && "Connecting…"}
          {state === "active" && (agentTalking ? "Aya is talking…" : "Listening…")}
          {state === "ended" && "Call ended"}
          {state === "error" && "Couldn't connect"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {state === "idle" && "Speak with our AI receptionist to book an appointment."}
          {state === "active" && "Say what you need — she can check availability and book you in."}
        </p>
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </div>

      {state === "idle" || state === "ended" || state === "error" ? (
        <button
          onClick={startCall}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Phone className="w-4 h-4" />
          Start Call
        </button>
      ) : (
        <button
          onClick={endCall}
          disabled={state === "connecting"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm bg-destructive text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          <PhoneOff className="w-4 h-4" />
          {state === "connecting" ? "Connecting…" : "End Call"}
        </button>
      )}
    </div>
  );
}
