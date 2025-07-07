"use client";

import { Lightbulb } from "lucide-react";

import type { UsageTipsProps } from "../types";

const UsageTips: React.FC<UsageTipsProps> = ({ tips }) => {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="card bg-base-200/50 border-base-300 border">
        <div className="card-body p-4">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="text-warning h-5 w-5" />
            <h3 className="text-base-content text-sm font-semibold">使用提示</h3>
          </div>

          <ul className="space-y-2">
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
  );
};

export default UsageTips;
