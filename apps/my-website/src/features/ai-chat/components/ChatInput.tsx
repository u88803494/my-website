"use client";

import { Send } from "lucide-react";
import { useRef, useState } from "react";

import { IME_KEYCODE, TEXTAREA_MAX_HEIGHT, UI_STRINGS } from "../constants";

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
    if (e.nativeEvent.isComposing || e.keyCode === IME_KEYCODE) {
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
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
        placeholder={UI_STRINGS.inputPlaceholder}
        aria-label={UI_STRINGS.ariaMessageInput}
        className="max-h-52 min-h-12 flex-1 resize-none border-0 bg-transparent px-2 py-3 text-base focus:outline-none"
        disabled={isLoading || disabled}
        rows={1}
      />
      <button
        type="submit"
        aria-label={UI_STRINGS.ariaSendMessage}
        aria-busy={isLoading}
        className="btn btn-primary rounded-xl shadow-sm transition-all hover:shadow-md"
        disabled={!input.trim() || isLoading || disabled}
      >
        {isLoading ? <span className="loading loading-spinner loading-sm" /> : <Send className="h-5 w-5" />}
      </button>
    </form>
  );
};

export default ChatInput;
