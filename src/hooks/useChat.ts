"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

const SESSION_KEY = "serene-dental-chat-session";
const MESSAGES_KEY = "serene-dental-chat-messages";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  content:
    "Hi! I'm the Serene Dental virtual assistant. I can help you book appointments, check availability, or answer questions about our services. How can I help you today?",
  role: "assistant",
  timestamp: new Date(),
};

function getOrCreateSessionId(): string {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored) return stored;
  const id = uuidv4();
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

function loadMessages(): ChatMessage[] {
  try {
    const stored = sessionStorage.getItem(MESSAGES_KEY);
    if (!stored) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(stored) as ChatMessage[];
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    // sessionStorage full or unavailable — ignore
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  // Persist messages to sessionStorage on change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        content: trimmed,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        if (!sessionIdRef.current) {
          sessionIdRef.current = getOrCreateSessionId();
        }
        const result = await sendChatMessage(sessionIdRef.current, trimmed);

        if ("error" in result) {
          setMessages((prev) => [
            ...prev,
            {
              id: uuidv4(),
              content: result.error,
              role: "assistant",
              timestamp: new Date(),
              isError: true,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: uuidv4(),
              content: result.output,
              role: "assistant",
              timestamp: new Date(),
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            content: "Something went wrong. Please try again.",
            role: "assistant",
            timestamp: new Date(),
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { messages, isLoading, sendMessage };
}
