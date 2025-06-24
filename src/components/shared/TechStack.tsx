import React from 'react';

interface TechStackProps {
  techStack: string[];
  variant?: 'primary' | 'secondary' | 'accent' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const TechStack: React.FC<TechStackProps> = ({ 
  techStack, 
  variant = 'primary', 
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const badgeSize = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : '';
  
  return (
    <div className={className}>
      {showLabel && (
        <span className="font-semibold text-sm text-gray-600 mb-2 block">技術棧</span>
      )}
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech, idx) => (
          <div
            key={idx}
            className={`badge badge-${variant} badge-outline ${badgeSize}`}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack; 