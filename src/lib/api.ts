import type { IntakeFormData, IntakeResponse } from "./types";

// Both functions used to call n8n directly from the browser via public
// NEXT_PUBLIC_* webhook URLs, with only client-side (trivially bypassable)
// rate limiting — the same exposed-webhook anti-pattern already fixed on
// vim-automations-website's contact form. They now proxy through this
// site's own API routes, which hold every secret server-side and enforce
// rate limiting there instead. Signatures are unchanged so the calling
// components (IntakeForm.tsx, useChat.ts) needed no changes.

const FORM_TIMEOUT_MS = 15_000;
const CHAT_TIMEOUT_MS = 30_000;

export async function submitIntakeForm(data: IntakeFormData): Promise<IntakeResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);

  try {
    const response = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: result?.message ?? "Something went wrong. Please try again.",
        error: `HTTP ${response.status}`,
      };
    }

    return result;
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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return { error: result?.error ?? `Request failed: ${response.status}` };
    }

    return result;
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
