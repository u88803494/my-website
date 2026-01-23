"use client";

import type { UIMessage } from "ai";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { SCROLL_BOTTOM_THRESHOLD } from "../constants";
import ChatMessage from "./ChatMessage";

interface ChatContainerProps {
  messages: UIMessage[];
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const t = useTranslations("AIChat");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if user is at/near bottom (within threshold)
  const checkIfAtBottom = useCallback(() => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < SCROLL_BOTTOM_THRESHOLD;
  }, []);

  // Handle scroll events to track user position
  const handleScroll = useCallback(() => {
    setIsAtBottom(checkIfAtBottom());
  }, [checkIfAtBottom]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Smart auto-scroll: only scroll if user is already at bottom
  useEffect(() => {
    if (isAtBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  if (messages.length === 0) {
    return (
      <div className="text-base-content/60 from-base-100 to-base-200/50 flex flex-1 flex-col items-center justify-center bg-gradient-to-b">
        <div className="mb-6 text-7xl opacity-80" aria-hidden="true">
          💬
        </div>
        <h2 className="mb-3 text-2xl font-bold">{t("emptyStateTitle")}</h2>
        <p className="text-center text-sm">
          {t("emptyStateDescription")}
          <br />
          {t("emptyStateSubDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-label={t("ariaChatHistory")}
        aria-live="polite"
        aria-busy={isLoading}
        className="from-base-100 to-base-200/50 absolute inset-0 overflow-y-auto bg-gradient-to-b p-4"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => {
            const isLastAssistantMessage = message.role === "assistant" && index === messages.length - 1;
            return <ChatMessage key={message.id} message={message} isStreaming={isLastAssistantMessage && isLoading} />;
          })}
          {isLoading && (
            <div className="chat chat-start" aria-label={t("ariaLoadingMessage")}>
              <div className="chat-image avatar">
                <div className="bg-secondary flex h-11 w-11 items-center justify-center rounded-full shadow-sm">
                  <span className="loading loading-dots loading-sm text-secondary-content" aria-hidden="true" />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-secondary shadow-sm">
                <span className="loading loading-dots loading-sm" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button - shown when user has scrolled up */}
      {!isAtBottom && messages.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="btn btn-circle btn-sm btn-primary absolute right-4 bottom-4 shadow-lg"
          aria-label={t("scrollToBottom")}
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default ChatContainer;
