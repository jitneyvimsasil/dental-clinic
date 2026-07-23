"use client";

import { useState } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { CallPanel } from "./CallPanel";
import { X, Sparkles, MessageCircle, Phone } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  onClose: () => void;
  chat: {
    messages: ChatMessage[];
    isLoading: boolean;
    sendMessage: (text: string) => void;
  };
  isOpen?: boolean;
}

type Mode = "chat" | "call";

export function ChatPanel({ onClose, chat, isOpen }: ChatPanelProps) {
  const { messages, isLoading, sendMessage } = chat;
  const [mode, setMode] = useState<Mode>("chat");

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-2xl shadow-primary/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">
              Serene Dental Assistant
            </p>
            <p className="text-[11px] text-primary-foreground/70">
              Online now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-primary-foreground/10 rounded-full p-0.5 mr-1">
            <button
              onClick={() => setMode("chat")}
              aria-pressed={mode === "chat"}
              aria-label="Switch to chat"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                mode === "chat" ? "bg-primary-foreground text-primary" : "text-primary-foreground/70"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode("call")}
              aria-pressed={mode === "call"}
              aria-label="Switch to call"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                mode === "call" ? "bg-primary-foreground text-primary" : "text-primary-foreground/70"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-primary-foreground/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {mode === "chat" ? (
        <>
          <ChatMessageList messages={messages} isLoading={isLoading} />
          <ChatInput onSend={sendMessage} disabled={isLoading} autoFocus={isOpen} />
        </>
      ) : (
        <CallPanel />
      )}
    </div>
  );
}
