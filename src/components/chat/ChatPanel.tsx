"use client";

import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { X, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  onClose: () => void;
  chat: {
    messages: ChatMessage[];
    isLoading: boolean;
    sendMessage: (text: string) => void;
  };
}

export function ChatPanel({ onClose, chat }: ChatPanelProps) {
  const { messages, isLoading, sendMessage } = chat;

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
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-primary-foreground/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <ChatMessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
