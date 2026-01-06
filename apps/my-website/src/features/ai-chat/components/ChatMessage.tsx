"use client";

import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";
import { memo, useMemo } from "react";

import { UI_STRINGS } from "../constants";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = memo(({ message, isStreaming = false }) => {
  const isUser = message.role === "user";

  // Extract text content from parts (memoized to prevent recalculation)
  const textContent = useMemo(
    () =>
      message.parts
        ?.filter((part): part is { type: "text"; text: string } => part.type === "text")
        .map((part) => part.text)
        .join("\n") || "",
    [message.parts],
  );

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
      <div className="chat-header mb-1 opacity-70">{isUser ? UI_STRINGS.userLabel : UI_STRINGS.assistantLabel}</div>
      <div
        className={`chat-bubble max-w-none ${
          isUser ? "chat-bubble-primary shadow-md" : "bg-slate-700 text-slate-100 shadow-sm"
        }`}
      >
        {textContent ? (
          isUser ? (
            <span className="whitespace-pre-wrap">{textContent}</span>
          ) : (
            <MarkdownRenderer content={textContent} isStreaming={isStreaming} />
          )
        ) : (
          UI_STRINGS.emptyContentFallback
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
