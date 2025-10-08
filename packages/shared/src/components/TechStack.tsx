import React from "react";

interface TechStackProps {
  className?: string;
  showLabel?: boolean;
  size?: "lg" | "md" | "sm";
  techStack: string[];
  variant?: "accent" | "info" | "primary" | "secondary";
}

const TechStack: React.FC<TechStackProps> = ({
  className = "",
  showLabel = true,
  size = "md",
  techStack,
  variant = "primary",
}) => {
  const badgeSize = size === "sm" ? "badge-sm" : size === "lg" ? "badge-lg" : "";

  return (
    <div className={className}>
      {showLabel && <span className="mb-2 block text-sm font-semibold text-gray-600">技術棧</span>}
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech, idx) => (
          <div className={`badge badge-${variant} badge-outline ${badgeSize}`} key={idx}>
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
