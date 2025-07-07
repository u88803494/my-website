"use client";

import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { useState } from "react";

import { cn } from "@/utils/cn";

import type { UsageTipsProps } from "../types";

const UsageTips: React.FC<UsageTipsProps> = ({ tips }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="card bg-base-200/50 border-base-300 border">
        <div className="card-body p-4">
          <button
            className="flex w-full items-center justify-between gap-2 text-left"
            onClick={handleToggle}
            type="button"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="text-warning h-5 w-5" />
              <h3 className="text-base-content text-sm font-semibold">分析指南</h3>
            </div>
            {isExpanded ? (
              <ChevronDown className="text-base-content/60 h-4 w-4" />
            ) : (
              <ChevronUp className="text-base-content/60 h-4 w-4" />
            )}
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <ul className="mt-3 space-y-2">
              {tips.map((tip, index) => (
                <li className="text-base-content/80 flex items-start gap-2 text-sm" key={index}>
                  <span className="text-primary mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageTips;
