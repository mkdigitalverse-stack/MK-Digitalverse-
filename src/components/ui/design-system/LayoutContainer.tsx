import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  hasBorder?: boolean;
}

export const SectionContainer: React.FC<SectionProps> = ({
  children,
  id,
  hasBorder = true,
  className = '',
  ...props
}) => {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 bg-[#050505] relative ${hasBorder ? 'border-b border-white/10' : ''} overflow-hidden ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 12;
}

export const GridContainer: React.FC<GridProps> = ({
  children,
  cols = 3,
  className = '',
  ...props
}) => {
  const colStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2 gap-8",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
    12: "grid-cols-1 lg:grid-cols-12 gap-8"
  };

  return (
    <div className={`grid ${colStyles[cols]} ${className}`} {...props}>
      {children}
    </div>
  );
};
