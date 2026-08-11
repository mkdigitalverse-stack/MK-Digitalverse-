import React, { useState } from 'react';
import { 
  Search, 
  Award, 
  Bot, 
  Layout, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Workflow,
  Sparkles,
  ChevronRight,
  Compass,
  Code2,
  BarChart3,
  Play,
  X,
  Layers,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';

interface FrameworkProps {
  onOpenAuditModal: () => void;
}

interface BlueprintStage {
  id: number;
  stageName: string;
  title: string;
  subtitle: string;
  ipName: string;
  purpose: string;
  deliverables: string[];
  metrics: string;
  systemAdvantage: string;
}

const BLUEPRINT_STAGES: BlueprintStage[] = [
  {
    id: 1,
    stageName: 'Discover',
    title: 'Market & Catchment Discovery',
    subtitle: 'Identify uncaptured regional patient demand & growth potential',
    ipName: 'Healthcare Catchment Intelligence™',
    purpose: 'Deep analysis of local patient demographics, treatment search volumes, and specialty doctor capacity.',
    deliverables: ['Catchment Demographic Audit', 'Specialty Demand Map', 'Competitor Gap Matrix'],
    metrics: 'Pinpoint 100% of catchment opportunities',
    systemAdvantage: 'Uncovers exact specialty demand in your 15-30 mile primary radius.'
  },
  {
    id: 2,
    stageName: 'Audit',
    title: 'Growth & Intake System Audit',
    subtitle: 'Diagnostic evaluation of patient journey friction & lead leakage',
    ipName: 'Patient Intake Diagnostic™',
    purpose: 'Evaluate website speed, booking form drop-offs, front-desk response times, and doctor authority messaging.',
    deliverables: ['Conversion Bottleneck Audit', 'Response Latency Report', 'Doctor Trust Scorecard'],
    metrics: 'Sub-60s enquiry response benchmark target',
    systemAdvantage: 'Exposes hidden revenue leakage across web, phone, and messaging intake.'
  },
  {
    id: 3,
    stageName: 'Strategy',
    title: 'Growth Roadmap & Unit Economics',
    subtitle: 'Align clinical doctor availability with high-margin treatment demand',
    ipName: 'Healthcare Growth Strategy™',
    purpose: 'Architect predictable patient acquisition budgets, consultation fees, and doctor schedule optimization.',
    deliverables: ['Specialty Unit Economics Model', 'Doctor Capacity Schedule', '365-Day Growth Roadmap'],
    metrics: 'Clear unit ROI per acquired patient',
    systemAdvantage: 'Aligns clinical capacity directly with paid acquisition targets.'
  },
  {
    id: 4,
    stageName: 'Build',
    title: 'Conversion-Focused Web Engine',
    subtitle: 'Deploy sub-second, high-converting healthcare web platform',
    ipName: 'Healthcare Web Conversion Engine™',
    purpose: 'Engineered digital platform featuring doctor profiles, verified care pathways, and interactive slot reservations.',
    deliverables: ['Custom Next.js Web Platform', 'Interactive Appointment Widget', 'Medical Schema & Local SEO'],
    metrics: '+185% increase in visitor-to-appointment conversion',
    systemAdvantage: 'Replaces slow templates with high-trust, sub-second conversion architecture.'
  },
  {
    id: 5,
    stageName: 'Acquire',
    title: 'Precision Geo-Acquisition',
    subtitle: 'Capture high-intent treatment searchers across Google & Meta',
    ipName: 'Precision Geo-Acquisition Engine™',
    purpose: 'Dominant search visibility when treatment-ready patients search for specialized care.',
    deliverables: ['Google Search & Maps Campaigns', 'Meta Visual Care Campaigns', 'Local SEO Map Pack Domination'],
    metrics: '2.5x increase in qualified treatment search traffic',
    systemAdvantage: 'Replaces generic ad spend with strict catchment geo-targeting.'
  },
  {
    id: 6,
    stageName: 'Automate',
    title: '24/7 AI Triage & Follow-Up',
    subtitle: 'Automated enquiry qualification & sub-60 second response',
    ipName: 'AI Patient Qualification Workflow™',
    purpose: 'Instant WhatsApp and CRM qualification that engages patients 24/7 without burdening front-desk teams.',
    deliverables: ['24/7 AI Triage Assistant', 'Automated WhatsApp Nurture', 'CRM Integration'],
    metrics: '< 60 seconds average enquiry response time',
    systemAdvantage: 'Eliminates 40%+ lead drop-off during off-hours and weekends.'
  },
  {
    id: 7,
    stageName: 'Measure',
    title: 'Closed-Loop ROI Intelligence',
    subtitle: 'Track every ad click to verified clinic consultation & revenue',
    ipName: 'Healthcare Growth Index™ Dashboard',
    purpose: 'Executive reporting suite displaying enquiry volume, cost-per-acquired-patient, and doctor schedule fill rates.',
    deliverables: ['Healthcare Growth Index™ Dashboard', 'Attribution Analytics', 'Unit LTV Reports'],
    metrics: '100% closed-loop revenue accountability',
    systemAdvantage: 'Replaces vanity metrics with real booked appointments and net practice growth.'
  },
  {
    id: 8,
    stageName: 'Optimize',
    title: 'Continuous Growth Scaling',
    subtitle: 'Data-driven weekly iterations to scale revenue & regional dominance',
    ipName: 'Predictable Growth Scaling Protocol™',
    purpose: 'Continuous AI marketing optimization, A/B landing page iterations, and multi-location expansion.',
    deliverables: ['Weekly Performance Iterations', 'Multi-Specialty Expansion', 'Quarterly Growth Review'],
    metrics: '15-25% Month-over-Month growth lift',
    systemAdvantage: 'Systematically lowers cost-per-acquisition while scaling patient volume.'
  }
];

export const GrowthFramework: React.FC<FrameworkProps> = ({ onOpenAuditModal }) => {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const activeStage = BLUEPRINT_STAGES.find(s => s.id === activeStageId) || BLUEPRINT_STAGES[0];

  return (
    <section id="growth-system" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Strategic Manifesto */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest mb-6 shadow-xs">
            <Workflow className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Interactive Blueprint</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.15]">
            The Healthcare Growth System™
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            An 8-stage interactive blueprint engineered for sustainable, high-trust digital growth.
          </p>
        </motion.div>

        {/* INTERACTIVE BLUEPRINT STEP BAR (All 8 Stages) */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#8B6B23]">
              8-Stage Blueprint — Select Stage to View Architecture
            </span>
          </div>

          {/* Desktop Connected 8-Stage Nodes */}
          <div className="hidden lg:grid grid-cols-8 gap-2 p-3 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 shadow-2xl relative">
            
            {BLUEPRINT_STAGES.map((stage) => {
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`p-3 rounded-xl transition-all cursor-pointer text-left relative group border ${
                    isActive
                      ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-xl scale-102 z-10'
                      : 'bg-[#050B18] text-slate-200 hover:bg-[#102240] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-bold uppercase ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                      0{stage.id}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                    )}
                  </div>

                  <div className="text-xs font-extrabold truncate text-white">
                    {stage.stageName}
                  </div>
                  <div className={`text-[9px] truncate mt-0.5 ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                    {stage.title}
                  </div>
                </button>
              );
            })}

          </div>

          {/* Mobile Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden gap-2">
            {BLUEPRINT_STAGES.map((stage) => {
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    isActive
                      ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] border-2 border-[#D4AF37] text-white shadow-md'
                      : 'bg-[#0B172A] border-white/10 text-slate-200'
                  }`}
                >
                  <div className="text-[9px] font-mono text-[#D4AF37] font-bold">0{stage.id}</div>
                  <div className="text-xs font-bold truncate">{stage.stageName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Interactive Blueprint Details */}
        <motion.div 
          key={activeStage.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 sm:p-10 border border-[#C5A059]/40 shadow-2xl bg-[#0B172A] text-white relative overflow-hidden mb-16"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Stage Purpose & Deliverables */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#050B18] text-[#D4AF37] border border-[#C5A059]/40 font-mono text-xs font-bold uppercase tracking-wider">
                    Stage 0{activeStage.id} // {activeStage.stageName}
                  </span>
                  <span className="text-xs font-semibold text-[#D4AF37] bg-[#050B18] px-3 py-1 rounded-full border border-[#C5A059]/30">
                    {activeStage.ipName}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
                  {activeStage.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#60A5FA] mt-1">
                  {activeStage.subtitle}
                </p>
              </div>

              {/* Purpose Box */}
              <div className="p-4 rounded-xl bg-[#050B18] border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                  Blueprint Purpose
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                  "{activeStage.purpose}"
                </p>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Stage Deliverables:</span>
                </h4>
                <div className="space-y-2">
                  {activeStage.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 p-2.5 rounded-lg bg-[#050B18] border border-white/10 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Key Metrics & System Advantage */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Target Benchmark Box */}
              <div className="p-5 rounded-2xl bg-[#050B18] border border-[#C5A059]/30 space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider block">
                  TARGET BENCHMARK METRIC
                </span>
                <div className="text-xl font-bold text-white font-display">
                  {activeStage.metrics}
                </div>
              </div>

              {/* System Advantage */}
              <div className="p-5 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/30 space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#60A5FA] uppercase tracking-wider block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span>SYSTEM ADVANTAGE</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeStage.systemAdvantage}
                </p>
              </div>

              {/* Stage Call-to-Action & Navigation Controls */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={onOpenAuditModal}
                  className="w-full btn-gold-primary py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Inquire About Stage 0{activeStage.id}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex gap-2">
                  <button
                    disabled={activeStageId === 1}
                    onClick={() => setActiveStageId(prev => Math.max(1, prev - 1))}
                    className="flex-1 py-2 rounded-xl bg-[#050B18] text-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-[#102240] disabled:opacity-30 transition-all border border-white/10 cursor-pointer"
                  >
                    ← Prev Stage
                  </button>
                  <button
                    disabled={activeStageId === BLUEPRINT_STAGES.length}
                    onClick={() => setActiveStageId(prev => Math.min(BLUEPRINT_STAGES.length, prev + 1))}
                    className="flex-1 py-2 rounded-xl bg-[#050B18] text-[#D4AF37] border border-[#C5A059]/40 font-bold text-xs uppercase tracking-wider hover:bg-[#102240] disabled:opacity-30 transition-all cursor-pointer shadow-md"
                  >
                    Next Stage →
                  </button>
                </div>
              </div>

            </div>

          </div>

        </motion.div>

        {/* High-Impact Closing CTA Banner */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0B172A] text-white text-center max-w-4xl mx-auto shadow-2xl relative border border-[#C5A059]/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050B18] border border-[#C5A059]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Strategic System Deployment</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-3">
            Ready to Build Your Healthcare Growth System™?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            We partner with ambitious healthcare organizations serious about building measurable, long-term business growth.
          </p>

          <button
            onClick={onOpenAuditModal}
            className="btn-gold-primary px-8 py-4 rounded-xl text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0A192F]" />
            <span>Book Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </section>
  );
};
