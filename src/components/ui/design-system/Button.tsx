import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#050505] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-[11px] rounded-lg gap-1.5 min-h-[36px]",
    md: "px-5 py-2.5 text-xs rounded-xl gap-2 min-h-[44px]",
    lg: "px-7 py-3.5 text-xs rounded-xl gap-2.5 min-h-[48px]",
    xl: "px-8 py-4 text-xs sm:text-sm rounded-2xl gap-3 min-h-[52px]"
  };

  const variantStyles = {
    primary: "bg-amber-400 text-black hover:bg-amber-300 shadow-xl shadow-amber-500/10",
    secondary: "bg-emerald-400 text-black hover:bg-emerald-300 shadow-xl shadow-emerald-500/10",
    outline: "bg-transparent text-zinc-200 border border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white",
    ghost: "bg-zinc-900 text-zinc-300 border border-white/10 hover:bg-zinc-800 hover:text-white",
    text: "bg-transparent text-zinc-400 hover:text-amber-400 p-0 shadow-none hover:bg-transparent min-h-0",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
