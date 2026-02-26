import type { IntakeFormData, IntakeResponse } from "./types";
import { MAX_MESSAGE_LENGTH } from "./types";

const N8N_BASE = process.env.NEXT_PUBLIC_N8N_BASE_URL;
const INTAKE_PATH = process.env.NEXT_PUBLIC_INTAKE_WEBHOOK_PATH;
const CHAT_WEBHOOK_ID = process.env.NEXT_PUBLIC_CHAT_WEBHOOK_ID;

const FORM_TIMEOUT_MS = 15_000;
const CHAT_TIMEOUT_MS = 30_000;
const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

let requestTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(
    (t) => now - t < RATE_LIMIT.windowMs
  );
  if (requestTimestamps.length >= RATE_LIMIT.maxRequests) return true;
  requestTimestamps.push(now);
  return false;
}

export async function submitIntakeForm(
  data: IntakeFormData
): Promise<IntakeResponse> {
  if (!N8N_BASE || !INTAKE_PATH) {
    return { success: false, message: "Webhook URL not configured", error: "config" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);

  try {
    const response = await fetch(`${N8N_BASE}${INTAKE_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
        error: `HTTP ${response.status}`,
      };
    }

    const result = await response.json();
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        message: "Request timed out. Please try again.",
        error: "timeout",
      };
    }
    return {
      success: false,
      message: "Unable to connect. Please check your internet and try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
  signal?: AbortSignal
): Promise<{ output: string } | { error: string }> {
  if (!N8N_BASE || !CHAT_WEBHOOK_ID) {
    return { error: "Chat not configured" };
  }

  if (!message.trim()) {
    return { error: "Message cannot be empty" };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` };
  }

  if (isRateLimited()) {
    return { error: "Too many messages. Please wait a moment." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const response = await fetch(
      `${N8N_BASE}/webhook/${CHAT_WEBHOOK_ID}/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId,
          chatInput: message,
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { error: `Request failed: ${response.status}` };
    }

    const data = await response.json();
    const result = Array.isArray(data) ? data[0] : data;
    return { output: result.output || result.text || String(result) };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      return { error: "Request timed out. Please try again." };
    }
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
