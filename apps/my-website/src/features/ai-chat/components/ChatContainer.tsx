"use client";

import type { UIMessage } from "ai";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import ChatMessage from "./ChatMessage";

interface ChatContainerProps {
  messages: UIMessage[];
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if user is at/near bottom (within 100px threshold)
  const checkIfAtBottom = useCallback(() => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
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
        <div className="mb-6 text-7xl opacity-80">💬</div>
        <h2 className="mb-3 text-2xl font-bold">開始對話</h2>
        <p className="text-center text-sm">
          輸入訊息開始與 AI 助手對話
          <br />
          支援多種 AI 模型切換
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="from-base-100 to-base-200/50 absolute inset-0 overflow-y-auto bg-gradient-to-b p-4"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => {
            const isLastAssistantMessage = message.role === "assistant" && index === messages.length - 1;
            return <ChatMessage key={message.id} message={message} isStreaming={isLastAssistantMessage && isLoading} />;
          })}
          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="bg-secondary flex h-11 w-11 items-center justify-center rounded-full shadow-sm">
                  <span className="loading loading-dots loading-sm text-secondary-content" />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-secondary shadow-sm">
                <span className="loading loading-dots loading-sm" />
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
          aria-label="跳到底部"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ChatContainer;
