import React from 'react';

export type BadgeVariant = 'amber' | 'emerald' | 'cyan' | 'purple' | 'neutral' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'amber',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border transition-all";

  const variantStyles = {
    amber: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    emerald: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    cyan: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
    purple: "bg-purple-400/10 text-purple-300 border-purple-400/20",
    neutral: "bg-white/5 text-zinc-300 border-white/10",
    outline: "bg-transparent text-zinc-300 border-white/20"
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
