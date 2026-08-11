import React from 'react';
import { Bot, Database, Workflow, Network, Users, TrendingUp, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface AiSectionProps {
  onOpenAuditModal: () => void;
}

export const AiAutomationSection: React.FC<AiSectionProps> = ({ onOpenAuditModal }) => {
  const systemFlow = [
    {
      step: "01",
      title: "AI Intelligence",
      subtitle: "24/7 Patient Triage & NLP",
      icon: Bot,
      color: "bg-[#050B18] text-[#D4AF37]",
      description: "Smart natural language triage pre-qualifying patient symptoms and treatment intent in real time."
    },
    {
      step: "02",
      title: "Data Attribution",
      subtitle: "Closed-Loop Analytics",
      icon: Database,
      color: "bg-[#050B18] text-[#D4AF37]",
      description: "Mapping search intent and ad touchpoints directly to verified patient records and unit economics."
    },
    {
      step: "03",
      title: "Automation Workflows",
      subtitle: "Sub-60s Instant Response",
      icon: Workflow,
      color: "bg-[#050B18] text-[#D4AF37]",
      description: "Automated WhatsApp, SMS, and email confirmation loops that eliminate after-hours enquiry drop-off."
    },
    {
      step: "04",
      title: "CRM Integration",
      subtitle: "Front-Desk Alignment",
      icon: Network,
      color: "bg-[#050B18] text-[#D4AF37]",
      description: "Direct lead routing into healthcare CRM platforms with doctor appointment schedule synchronization."
    },
    {
      step: "05",
      title: "Patient Journey",
      subtitle: "High-Trust Experience",
      icon: Users,
      color: "bg-[#050B18] text-[#D4AF37]",
      description: "Frictionless pre-consultation orientation, doctor bio briefs, and verified appointment holds."
    },
    {
      step: "06",
      title: "Predictable Growth",
      subtitle: "Scalable Revenue Engine",
      icon: TrendingUp,
      color: "bg-[#050B18] text-[#D4AF37]",
      description: "Continuous AI bid optimization and conversion rate improvements lowering acquisition cost."
    }
  ];

  return (
    <section id="ai-automation" className="py-20 md:py-28 bg-[#050B18] text-white relative border-b border-[#C5A059]/20 overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#1877F2]/15 via-[#C5A059]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-navy-grid pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B172A] border border-[#C5A059]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-md">
            <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AI & Automation Infrastructure</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
            System Architecture:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059]">Intelligence Across the Entire Patient Journey.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            We don't use AI as a novelty gimmick. We engineer connected automation architecture that captures, qualifies, routes, and nurtures every incoming patient enquiry automatically.
          </p>
        </div>

        {/* Enterprise System Flow Banner & Animated Connected Pathway */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl mb-14 relative overflow-hidden">
          
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
              Enterprise Technology Architecture Sequence
            </span>
            
            {/* Horizontal Connected Step Bar */}
            <div className="mt-4 p-3 rounded-2xl bg-[#050B18] border border-[#C5A059]/30 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono font-bold">
              <span className="px-3 py-1 rounded-lg bg-[#1877F2]/20 text-[#60A5FA] border border-[#1877F2]/40 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[#D4AF37]" /> AI
              </span>
              <span className="text-slate-500 font-extrabold">→</span>
              <span className="px-3 py-1 rounded-lg bg-[#0B172A] text-slate-200 border border-white/10">DATA</span>
              <span className="text-slate-500 font-extrabold">→</span>
              <span className="px-3 py-1 rounded-lg bg-[#1877F2]/20 text-[#60A5FA] border border-[#1877F2]/40">AUTOMATION</span>
              <span className="text-slate-500 font-extrabold">→</span>
              <span className="px-3 py-1 rounded-lg bg-[#0B172A] text-slate-200 border border-white/10">CRM</span>
              <span className="text-slate-500 font-extrabold">→</span>
              <span className="px-3 py-1 rounded-lg bg-[#1877F2]/20 text-[#60A5FA] border border-[#1877F2]/40">PATIENT JOURNEY</span>
              <span className="text-slate-500 font-extrabold">→</span>
              <span className="px-3 py-1 rounded-lg bg-[#C5A059]/20 text-[#D4AF37] border border-[#C5A059]/50 font-extrabold">GROWTH</span>
            </div>
          </div>

          {/* Connected Node Sequence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            
            {systemFlow.map((node, idx) => {
              const IconComp = node.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#050B18] border border-[#C5A059]/30 space-y-3 hover:border-[#D4AF37] transition-all group relative overflow-hidden shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${node.color} border border-[#C5A059]/40 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D4AF37] px-2.5 py-1 rounded-full bg-[#0B172A] border border-[#C5A059]/30">
                      Phase {node.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {node.title}
                    </h3>
                    <div className="text-[11px] font-mono text-[#60A5FA] font-semibold mt-0.5">
                      {node.subtitle}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 font-normal">
                      {node.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Outcome Callout */}
        <div className="p-8 rounded-2xl bg-[#0B172A] border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">
              Zero Unattended Enquiries. 24/7 Response Speed.
            </h4>
            <p className="text-xs text-slate-200 max-w-xl">
              Eliminate after-hours enquiry leakage and improve consultation conversion rates with automated AI triage.
            </p>
          </div>

          <button
            onClick={onOpenAuditModal}
            className="btn-gold-primary px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Explore AI Systems Blueprint</span>
            <ArrowRight className="w-4 h-4 text-[#0A192F]" />
          </button>
        </div>

      </div>
    </section>
  );
};

