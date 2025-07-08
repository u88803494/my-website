"use client";

import { ArrowUpCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  return (
    <button
      aria-label="回到頂部"
      className={cn(
        "fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/50 shadow-md transition-opacity duration-300",
        "hover:bg-white/70 hover:shadow-lg focus:outline-none",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={handleClick}
      tabIndex={0}
      type="button"
    >
      <ArrowUpCircle
        aria-hidden="true"
        className="h-7 w-7 text-slate-400 transition-colors duration-200 hover:text-slate-600"
      />
    </button>
  );
};

export default ScrollToTopButton;
