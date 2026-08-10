import React from 'react';

export type CardVariant = 'glass' | 'standard' | 'interactive' | 'framework' | 'metric' | 'caseStudy';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  padding = 'md',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = "rounded-2xl transition-all duration-300 relative overflow-hidden";

  const paddingStyles = {
    none: "p-0",
    sm: "p-4 sm:p-5",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10"
  };

  const variantStyles = {
    glass: "glass-panel bg-[#09090b]/80 border border-white/10 shadow-xl",
    standard: "bg-zinc-950 border border-white/10 shadow-md",
    interactive: "glass-panel bg-[#09090b]/90 border border-white/15 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/5 cursor-pointer",
    framework: "bg-zinc-950 border border-white/10 hover:border-amber-400/40 transition-all",
    metric: "bg-gradient-to-b from-zinc-950 to-zinc-900 border border-white/10 shadow-lg",
    caseStudy: "glass-panel bg-[#09090b] border border-white/15 hover:border-emerald-500/30"
  };

  const hoverStyle = hoverEffect ? "hover:-translate-y-1 hover:shadow-2xl" : "";

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
