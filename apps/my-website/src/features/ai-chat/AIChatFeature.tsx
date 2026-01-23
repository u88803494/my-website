"use client";

import { useChat } from "@ai-sdk/react";
import { parseAIErrorMessage } from "@packages/shared/utils";
import { DefaultChatTransport } from "ai";
import { AlertTriangle, MessageSquare, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";

import { ChatContainer, ChatInput, ModelSelector } from "./components";
import { DEFAULT_MODEL_ID, isValidModelId } from "./constants";

const AIChatFeature: React.FC = () => {
  const t = useTranslations("AIChat");
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const modelRef = useRef(selectedModel);
  modelRef.current = selectedModel;

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({
        model: modelRef.current,
      }),
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Parse error for user-friendly display using shared parser
  const parsedError = useMemo(() => {
    if (!error) return null;
    return parseAIErrorMessage(error.message);
  }, [error]);

  const handleSend = useCallback(
    (message: string) => {
      sendMessage({ text: message });
    },
    [sendMessage],
  );

  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const handleModelChange = useCallback((modelId: string) => {
    if (isValidModelId(modelId)) {
      setSelectedModel(modelId);
    }
  }, []);

  return (
    <div className="bg-base-100 flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="navbar border-base-300/50 bg-base-200/80 relative z-20 border-b px-4 backdrop-blur-sm">
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <MessageSquare className="text-primary h-6 w-6" aria-hidden="true" />
            {t("featureTitle")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} disabled={isLoading} />
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="btn btn-ghost btn-sm hover:bg-error/10 hover:text-error transition-all"
              aria-label={t("clearChat")}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatContainer messages={messages} isLoading={isLoading} />

        {/* Error Display */}
        {parsedError && (
          <div role="alert" className={`alert mx-4 mb-2 ${parsedError.isQuotaError ? "alert-warning" : "alert-error"}`}>
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="font-medium">{parsedError.message}</span>
              {parsedError.isQuotaError && <span className="text-sm opacity-80">{t("quotaErrorSuggestion")}</span>}
            </div>
            {parsedError.isRetryable && (
              <button onClick={() => window.location.reload()} className="btn btn-ghost btn-sm gap-1">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {t("retry")}
              </button>
            )}
          </div>
        )}

        {/* Input Area */}
        <div className="border-base-300/50 bg-base-100/80 border-t p-4 pb-6 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChatFeature;
