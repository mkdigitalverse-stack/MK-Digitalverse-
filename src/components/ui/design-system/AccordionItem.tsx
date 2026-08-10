import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
  badge
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`glass-panel rounded-2xl border transition-all duration-300 bg-[#09090b] overflow-hidden ${
      isOpen ? 'border-amber-400/40 shadow-xl shadow-amber-500/5' : 'border-white/10 hover:border-white/20'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-white text-base hover:text-amber-300 transition-colors focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span>{title}</span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-mono uppercase">
              {badge}
            </span>
          )}
        </div>
        <div className={`p-1.5 rounded-lg bg-zinc-900 border border-white/10 shrink-0 transition-transform duration-300 ${
          isOpen ? 'rotate-180 bg-amber-400/10 text-amber-400 border-amber-400/30' : 'text-zinc-400'
        }`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 text-sm text-zinc-300 leading-relaxed border-t border-white/10 pt-4 animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabGroupProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  activeTab,
  onChange
}) => {
  return (
    <div className="p-1.5 rounded-2xl bg-zinc-950 border border-white/10 inline-flex items-center gap-1.5 flex-wrap">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  sublabel,
  icon,
  trend
}) => {
  return (
    <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">{label}</span>
        {icon && <div className="p-2 rounded-lg bg-white/5 text-amber-400">{icon}</div>}
      </div>
      <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
        {value}
      </div>
      {sublabel && <p className="text-xs text-zinc-400">{sublabel}</p>}
      {trend && (
        <span className="inline-block text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
          {trend}
        </span>
      )}
    </div>
  );
};

export interface TimelineStepProps {
  stepNumber: string | number;
  title: string;
  description: string;
  isLast?: boolean;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  stepNumber,
  title,
  description,
  isLast = false
}) => {
  return (
    <div className="flex items-start gap-4 relative">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-extrabold text-sm flex items-center justify-center shrink-0">
          {stepNumber}
        </div>
        {!isLast && <div className="w-0.5 h-12 bg-white/10 my-2" />}
      </div>
      <div className="space-y-1 pt-1 pb-6">
        <h4 className="text-base font-bold text-white">{title}</h4>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
