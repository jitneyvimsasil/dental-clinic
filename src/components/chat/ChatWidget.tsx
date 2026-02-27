"use client";

import { useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { useChat } from "@/hooks/useChat";
import { MessageCircle } from "lucide-react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat panel — always mounted, visibility toggled */}
      <div
        className={`absolute bottom-16 right-0 w-[380px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ChatPanel onClose={() => setIsOpen(false)} chat={chat} isOpen={isOpen} />
      </div>

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-muted text-muted-foreground shadow-md rotate-0"
            : "bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "scale-90" : "scale-100"
          }`}
        />
      </button>

      {/* Tooltip (only when closed) */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-3 pointer-events-none">
          <div className="bg-foreground text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with us
          </div>
        </div>
      )}
    </div>
  );
}
