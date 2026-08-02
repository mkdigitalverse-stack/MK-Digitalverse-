import React from 'react';
import { IndustryType } from '../types';
import { INDUSTRY_DATA } from '../data/content';
import { 
  HeartPulse, 
  Palmtree, 
  Building2, 
  Sparkles, 
  Activity, 
  Crown, 
  Castle, 
  Check, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface IndustryProps {
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export const IndustrySolutions: React.FC<IndustryProps> = ({
  activeIndustry,
  onSelectIndustry,
  onOpenAuditModal
}) => {
  const data = INDUSTRY_DATA[activeIndustry];

  const renderVerticalIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5 text-amber-400" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-amber-400" />;
      case 'Palmtree': return <Palmtree className="w-5 h-5 text-emerald-400" />;
      case 'Castle': return <Castle className="w-5 h-5 text-emerald-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-emerald-400" />;
      default: return <ShieldCheck className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="industries" className="py-20 md:py-28 bg-[#0A0D14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
            <span>Core Industry Specialization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Tailored Growth Systems for Your Exact Industry
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            We don't do generalist work. Our systems are built around the unique unit economics, buying psychology, and qualification workflows of Healthcare and Luxury Venues.
          </p>

          {/* Industry Tab Buttons */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => onSelectIndustry('healthcare')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeIndustry === 'healthcare'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Healthcare Solutions</span>
            </button>

            <button
              onClick={() => onSelectIndustry('wedding_venues')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeIndustry === 'wedding_venues'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palmtree className="w-4 h-4" />
              <span>Luxury Venue Systems</span>
            </button>
          </div>
        </div>

        {/* Audience Pill Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-2">Target Segments:</span>
          {data.targetAudience.map((audience, idx) => (
            <span 
              key={idx}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                activeIndustry === 'healthcare'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              }`}
            >
              {audience}
            </span>
          ))}
        </div>

        {/* Verticals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {data.verticals.map((vert) => (
            <div 
              key={vert.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  {renderVerticalIcon(vert.iconName)}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {vert.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {vert.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Proven Impact Benchmark
                </span>
                <span className={`text-sm font-bold block mt-0.5 ${
                  activeIndustry === 'healthcare' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {vert.keyMetric}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Core Industry Growth Pillars */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 mb-16">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white">
              The 4 Core Pillars of Our {data.title}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Every layer is integrated to maximize conversion and operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.growthPillars.map((pillar, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className={`p-2.5 rounded-lg shrink-0 mt-1 ${
                  activeIndustry === 'healthcare' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {pillar.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40">
                    <TrendingUp className="w-3 h-3" />
                    <span>{pillar.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Industry Metric Proof Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.metrics.map((m, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <div className={`text-3xl sm:text-4xl font-display font-extrabold mb-1 ${
                activeIndustry === 'healthcare' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {m.value}
              </div>
              <div className="text-sm font-bold text-white">{m.label}</div>
              <div className="text-xs text-slate-400 mt-1">{m.subtext}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
