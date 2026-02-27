import type { ChatMessage } from "@/lib/types";
import { AlertCircle } from "lucide-react";

interface ChatBubbleProps {
  message: ChatMessage;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1");
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const content = isUser ? message.content : stripMarkdown(message.content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : message.isError
              ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-md"
              : "bg-muted text-foreground rounded-bl-md"
        }`}
      >
        {message.isError && (
          <AlertCircle className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
        )}
        <span className="whitespace-pre-wrap">{content}</span>
      </div>
    </div>
  );
}
