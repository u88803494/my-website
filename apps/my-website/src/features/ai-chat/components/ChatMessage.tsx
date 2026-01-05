"use client";

import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: UIMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  // Extract text content from parts
  const textContent = message.parts
    ?.filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n");

  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full shadow-sm ${
            isUser ? "bg-primary" : "bg-secondary"
          }`}
        >
          {isUser ? (
            <User className="text-primary-content h-5 w-5" />
          ) : (
            <Bot className="text-secondary-content h-5 w-5" />
          )}
        </div>
      </div>
      <div className="chat-header mb-1 opacity-70">{isUser ? "你" : "AI 助手"}</div>
      <div
        className={`chat-bubble whitespace-pre-wrap ${
          isUser ? "chat-bubble-primary shadow-md" : "chat-bubble-secondary shadow-sm"
        }`}
      >
        {textContent || "..."}
      </div>
    </div>
  );
};

export default ChatMessage;
