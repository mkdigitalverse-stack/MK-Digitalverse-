import React from 'react';

export type HeadingLevel = 'displayXl' | 'displayLg' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'div';
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 'h2',
  as,
  className = '',
  ...props
}) => {
  const levelStyles = {
    displayXl: "text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1]",
    displayLg: "text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]",
    h1: "text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-snug",
    h2: "text-xl sm:text-2xl font-display font-bold text-white tracking-tight leading-snug",
    h3: "text-lg sm:text-xl font-display font-bold text-white leading-normal",
    h4: "text-base font-display font-semibold text-white leading-normal",
    h5: "text-xs font-mono font-bold uppercase tracking-widest text-amber-400"
  };

  const Component = as || (level === 'displayXl' || level === 'displayLg' ? 'h1' : level);

  return (
    <Component className={`${levelStyles[level]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export type TextVariant = 'bodyLarge' | 'bodyRegular' | 'bodySmall' | 'caption' | 'label';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  muted?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'bodyRegular',
  muted = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    bodyLarge: "text-base sm:text-lg leading-relaxed",
    bodyRegular: "text-sm sm:text-base leading-relaxed",
    bodySmall: "text-xs sm:text-sm leading-normal",
    caption: "text-[11px] font-mono leading-normal",
    label: "text-[10px] font-bold uppercase tracking-widest leading-none"
  };

  const textColor = muted ? "text-zinc-400" : "text-zinc-200";

  return (
    <p className={`${variantStyles[variant]} ${textColor} ${className}`} {...props}>
      {children}
    </p>
  );
};
