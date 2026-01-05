"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";

import ChatMessage from "./ChatMessage";

interface ChatContainerProps {
  messages: UIMessage[];
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div ref={containerRef} className="from-base-100 to-base-200/50 flex-1 overflow-y-auto bg-gradient-to-b p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
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
  );
};

export default ChatContainer;
