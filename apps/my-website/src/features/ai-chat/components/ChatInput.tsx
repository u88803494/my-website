"use client";

import { Send } from "lucide-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, disabled = false }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading && !disabled) {
      onSend(trimmedInput);
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't submit during IME composition (e.g., Zhuyin/注音 input)
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 ring-base-300 focus-within:ring-primary/30 flex items-end gap-2 rounded-2xl p-2 shadow-lg ring-1 transition-all focus-within:ring-2"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="輸入訊息... (Shift+Enter 換行)"
        className="max-h-52 min-h-12 flex-1 resize-none border-0 bg-transparent px-2 py-3 text-base focus:outline-none"
        disabled={isLoading || disabled}
        rows={1}
      />
      <button
        type="submit"
        className="btn btn-primary rounded-xl shadow-sm transition-all hover:shadow-md"
        disabled={!input.trim() || isLoading || disabled}
      >
        {isLoading ? <span className="loading loading-spinner loading-sm" /> : <Send className="h-5 w-5" />}
      </button>
    </form>
  );
};

export default ChatInput;
