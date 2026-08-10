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
  BarChart3
} from 'lucide-react';

interface FrameworkProps {
  onOpenAuditModal: () => void;
}

interface OperatingStage {
  id: number;
  action: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  purpose: string;
  ipName: string;
  description: string;
  outcomes: string[];
  deliverables: string[];
  techStack: string[];
  impactMetric: string;
  agencyVsSystem: {
    traditional: string;
    system: string;
  };
}

const OPERATING_STAGES: OperatingStage[] = [
  {
    id: 1,
    action: 'Audit',
    title: 'Healthcare Growth Audit™',
    shortTitle: '01 Audit',
    subtitle: 'Diagnose Opportunities & Intake Bottlenecks',
    purpose: 'Diagnose revenue leaks, response delays, and uncaptured market opportunities.',
    ipName: 'Healthcare Growth Audit™',
    description: 'We perform a forensic diagnostic audit of your entire digital footprint and intake funnel—evaluating ad spend waste, response speed bottlenecks, and conversion leaks before building your strategy.',
    outcomes: [
      'Pinpoint revenue loss points across phone, web, and chat intake',
      'Benchmark cost-per-acquired-patient against regional leaders',
      'Establish baseline unit economics and LTV forecasting'
    ],
    deliverables: [
      'Intake Leak Diagnostic Report',
      'Unit Economics & LTV Model',
      'Competitive Position Matrix',
      'Custom Growth Blueprint'
    ],
    techStack: ['Audit Diagnostics', 'Funnel Analytics', 'Unit Economics'],
    impactMetric: '35% Average Ad Waste Saved Immediately',
    agencyVsSystem: {
      traditional: 'Launches ad campaigns immediately without analyzing root-cause intake bottlenecks.',
      system: 'Diagnoses complete unit economics and intake leaks before spending ad capital.'
    }
  },
  {
    id: 2,
    action: 'Strategy',
    title: 'Growth Strategy',
    shortTitle: '02 Strategy',
    subtitle: 'Build a Measurable Growth Roadmap',
    purpose: 'Establish a clear, data-backed strategy for predictable business expansion.',
    ipName: 'Healthcare Growth System™',
    description: 'We construct an actionable 12-month growth roadmap tailored specifically to your organization’s revenue targets, specialty capacity, and local market opportunity.',
    outcomes: [
      'Clear 12-month acquisition and revenue growth roadmap',
      'Alignment between clinical capacity and marketing volume',
      'Targeted unit economics for high-margin specialties'
    ],
    deliverables: [
      'Measurable Growth Blueprint',
      'Specialty Capacity Roadmap',
      'Patient LTV Projection',
      'Resource Allocation Model'
    ],
    techStack: ['Strategic Modeling', 'Growth Architecture', 'Capacity Planning'],
    impactMetric: '100% Alignment with Revenue Targets',
    agencyVsSystem: {
      traditional: 'Pushes random tactical packages without a unified revenue growth strategy.',
      system: 'Builds a bespoke, capacity-aware strategic growth roadmap.'
    }
  },
  {
    id: 3,
    action: 'Position',
    title: 'Brand Positioning',
    shortTitle: '03 Position',
    subtitle: 'Build Trust Before the First Consultation',
    purpose: 'Earn confidence, build prestige, and eliminate price friction before the first consultation.',
    ipName: 'Clinical Trust Architecture™',
    description: 'We engineer high-trust clinical authority profiles and narrative positioning that showcase doctor expertise, case outcomes, and institution prestige—eliminating price resistance.',
    outcomes: [
      'Command premium pricing and consultation fee authority',
      'Build patient confidence prior to in-person clinic visits',
      'Position specialists as regional medical key opinion leaders'
    ],
    deliverables: [
      'Doctor & Specialist Authority Portals',
      'Clinical Case Showcase Engine',
      'Patient Psychological Journey Maps',
      'Prestige Brand Positioning'
    ],
    techStack: ['Authority Messaging', 'Clinical Storytelling', 'Brand Systems'],
    impactMetric: '2.4x Higher Consultation Acceptance Rate',
    agencyVsSystem: {
      traditional: 'Uses generic stock photos and copy-paste templates that dilute trust.',
      system: 'Engineers bespoke clinical authority and luxury prestige to eliminate price objections.'
    }
  },
  {
    id: 4,
    action: 'Convert ⭐',
    title: 'Conversion-Focused Websites ⭐',
    shortTitle: '04 Convert',
    subtitle: 'Flagship Digital Platform for Patient Conversion',
    purpose: 'Convert visitors into qualified patient enquiries through custom enterprise web engineering.',
    ipName: 'Enterprise Next.js Web Engine™',
    description: 'Conversion-Focused Websites are the digital cornerstone of the Healthcare Growth System™. Built on custom Next.js architecture with sub-second page speeds, interactive appointment schedulers, and medical SEO schema.',
    outcomes: [
      'Sub-second page load speeds with 95+ Core Web Vitals',
      'High-converting interactive booking and consultation widgets',
      'Seamless multi-specialty and doctor navigation'
    ],
    deliverables: [
      'Enterprise Next.js Web Engine™',
      'Interactive Slot Booking System',
      'Doctor & Case Study Showcases',
      'Technical SEO & Schema Markup'
    ],
    techStack: ['Next.js App Router', 'React', 'Tailwind CSS', 'TypeScript', 'SEO Schema'],
    impactMetric: '+185% Increase in Patient Conversion',
    agencyVsSystem: {
      traditional: 'Builds slow, bloated WordPress templates with standard contact forms.',
      system: 'Engineers custom Next.js web platforms optimized specifically for appointment conversion.'
    }
  },
  {
    id: 5,
    action: 'Automate',
    title: 'AI-Powered Business Systems',
    shortTitle: '05 Automate',
    subtitle: 'Automate Workflows & Operational Efficiency',
    purpose: 'Automate lead triage, pre-qualify patient intent 24/7, and eliminate manual intake delay.',
    ipName: 'AI Patient Triage & Routing Engine™',
    description: 'Our proprietary conversational AI engages incoming patient enquiries in real-time, qualifies clinical needs, screens treatment intent, and routes ready-to-book consultation holds directly to staff WhatsApp/CRM.',
    outcomes: [
      'Instant <30 second response time to every patient enquiry day or night',
      'Filter out non-serious enquiries and price-shoppers automatically',
      'Direct WhatsApp integration for immediate clinical consultation scheduling'
    ],
    deliverables: [
      '24/7 AI Triage & Routing Engine™',
      'WhatsApp Business API Router',
      'Automated Slot & Specialty Qualification',
      'EHR & Clinic CRM Sync'
    ],
    techStack: ['Gemini AI Triage', 'WhatsApp Cloud API', 'Webhooks & CRM Router'],
    impactMetric: '100% Leads Responded to in <30s',
    agencyVsSystem: {
      traditional: 'Sends raw, unvetted leads via email spreadsheets during office hours only.',
      system: 'Deploys 24/7 AI qualification that filters low-intent leads and routes directly to WhatsApp.'
    }
  },
  {
    id: 6,
    action: 'Acquire',
    title: 'Performance Marketing',
    shortTitle: '06 Acquire',
    subtitle: 'Generate Predictable, Qualified Enquiries',
    purpose: 'Generate predictable, scalable patient demand from high-intent audiences in your region.',
    ipName: 'Precision Geo-Funnel Engine™',
    description: 'We dominate Google Search, Google Maps, and Meta channels with laser-targeted campaigns designed to capture active patients searching for specialized medical care, surgical procedures, and wellness services.',
    outcomes: [
      'Own top 3 Google Search placements for high-value treatment keywords',
      'Geo-fenced social campaigns reaching health-conscious households nearby',
      'Retargeting funnels that bring undecided patients back to book'
    ],
    deliverables: [
      'Medical Search Intent Keyword Matrix',
      'Precision Geo-Fenced Meta Campaigns',
      'Local Map Pack Dominance Engine',
      'Custom Doctor Video & Micro-Content'
    ],
    techStack: ['Google Ads Search/Maps', 'Meta Precision Ads', 'Local SEO Engines'],
    impactMetric: '3.8x ROAS on Qualified Patient Value',
    agencyVsSystem: {
      traditional: 'Runs broad campaigns focused on vanity clicks, impressions, and cheap leads.',
      system: 'Engineers high-intent search and geo-fenced acquisition tied directly to revenue.'
    }
  },
  {
    id: 7,
    action: 'Optimize',
    title: 'Measurement & Continuous Optimization',
    shortTitle: '07 Optimize',
    subtitle: 'Track Performance & Continuous Improvement',
    purpose: 'Continuously optimize unit economics, patient LTV, and market share expansion.',
    ipName: 'Healthcare Growth Index™ (HGI™)',
    description: 'We track bottom-line revenue, verified patient appointments, and acquisition costs in a unified executive dashboard, executing weekly data-driven optimizations for continuous growth.',
    outcomes: [
      'Complete transparency into cost-per-acquired-patient (CAC) and treatment revenue',
      'Weekly iteration cycles to lower acquisition costs over time',
      'Scalable framework to expand to new clinical departments or locations'
    ],
    deliverables: [
      'Healthcare Growth Index™ (HGI™) Dashboard',
      'Patient LTV & Repeat Visit Analytics',
      'Weekly Engineering Optimization',
      'Quarterly Scale Strategy Roadmap'
    ],
    techStack: ['Custom Analytics API', 'Growth Dashboards', 'Unit ROI Tracking'],
    impactMetric: 'Continuous 15-25% MoM Lift',
    agencyVsSystem: {
      traditional: 'Sends confusing PDF reports full of vanity clicks with no revenue accountability.',
      system: 'Provides real-time dashboards tracking verified bookings, acquisition cost, and net ROI.'
    }
  }
];

export const GrowthFramework: React.FC<FrameworkProps> = ({ onOpenAuditModal }) => {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const activeStage = OPERATING_STAGES.find(s => s.id === activeStageId) || OPERATING_STAGES[0];

  const getStageIcon = (action: string) => {
    if (action.includes('Audit')) return <Search className="w-4 h-4" />;
    if (action.includes('Strategy')) return <Compass className="w-4 h-4" />;
    if (action.includes('Position')) return <Award className="w-4 h-4" />;
    if (action.includes('Convert')) return <Code2 className="w-4 h-4 text-amber-400" />;
    if (action.includes('Automate')) return <Bot className="w-4 h-4" />;
    if (action.includes('Acquire')) return <Target className="w-4 h-4" />;
    if (action.includes('Optimize')) return <BarChart3 className="w-4 h-4" />;
    return <Workflow className="w-4 h-4" />;
  };

  return (
    <section id="growth-system" className="py-20 md:py-28 bg-[#050505] relative border-y border-white/10 overflow-hidden">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Strategic Manifesto */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Workflow className="w-3.5 h-3.5 text-amber-400" />
            <span>Proprietary Operating System</span>
          </div>

          {/* Core Philosophy Callout */}
          <blockquote className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 text-amber-300 font-display font-bold text-lg sm:text-xl sm:leading-relaxed mb-6 max-w-2xl mx-auto shadow-inner">
            "Most businesses don't need more marketing. They need a better growth system."
          </blockquote>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            The Healthcare Growth System™
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            We don't launch ad-hoc campaigns or design disconnected websites. We deploy an integrated 6-phase growth operating system engineered to diagnose leaks, automate qualification, and scale high-value revenue predictably.
          </p>
        </div>

        {/* Visual Roadmap Flow Bar (Horizontal Connectors) */}
        <div className="mb-12">
          <div className="text-center mb-4">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">
              Operating System Pipeline — Select Phase to Inspect
            </span>
          </div>

          {/* Desktop Flow Line Container */}
          <div className="hidden lg:flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-white/10 relative">
            {OPERATING_STAGES.map((stage, idx) => {
              const isActive = stage.id === activeStageId;
              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => setActiveStageId(stage.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all relative group ${
                      isActive
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/10 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5 font-semibold'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-black text-amber-400' : 'bg-zinc-900 text-zinc-300'
                    }`}>
                      {getStageIcon(stage.action)}
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] font-mono uppercase tracking-wider opacity-80">
                        {stage.shortTitle.split(' ')[0]}
                      </div>
                      <div className="text-xs">
                        {stage.action}
                      </div>
                    </div>
                  </button>

                  {idx < OPERATING_STAGES.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile / Tablet Responsive Pipeline Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-2.5">
            {OPERATING_STAGES.map((stage) => {
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`p-3 rounded-xl text-left transition-all border flex items-center justify-between min-h-[52px] ${
                    isActive
                      ? 'bg-zinc-900 border-amber-400 text-white shadow-md'
                      : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {getStageIcon(stage.action)}
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-amber-400 font-bold">0{stage.id}</div>
                      <div className="text-xs font-bold text-white">{stage.action}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Breakdown Panel */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/15 shadow-2xl relative bg-[#09090b] mb-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Purpose & Outcomes */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 font-mono text-xs font-bold uppercase tracking-wider">
                    Phase 0{activeStage.id} // {activeStage.action}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/40">
                    Proprietary IP: {activeStage.ipName}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeStage.title}
                </h3>
                <p className="text-sm font-semibold text-amber-400 mt-1">
                  {activeStage.subtitle}
                </p>
              </div>

              {/* Purpose Box */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  Why This Stage Exists (Business Purpose)
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  "{activeStage.purpose}"
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {activeStage.description}
              </p>

              {/* Key Business Outcomes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Strategic Business Outcomes:</span>
                </h4>
                <div className="space-y-2">
                  {activeStage.outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-200 p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Deliverables */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Core System Deliverables:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeStage.deliverables.map((deliv, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-zinc-950 border border-white/10 text-xs font-semibold text-zinc-300">
                      • {deliv}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Comparison & Benchmark Impact */}
            <div className="lg:col-span-5 space-y-6 bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-white/10">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Methodology Shift
                </span>
                <span className="text-xs font-bold text-amber-400">
                  Phase {activeStage.id} Comparison
                </span>
              </div>

              {/* Traditional Agency vs Operating System */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
                    Traditional Agency Approach
                  </span>
                  <p className="text-zinc-400 leading-relaxed">
                    {activeStage.agencyVsSystem.traditional}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    The Healthcare Growth System™
                  </span>
                  <p className="text-emerald-200 font-medium leading-relaxed">
                    {activeStage.agencyVsSystem.system}
                  </p>
                </div>
              </div>

              {/* Primary Benchmark Impact Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                  Measured Benchmark Impact
                </span>
                <div className="text-lg font-bold text-white mt-1">
                  {activeStage.impactMetric}
                </div>
              </div>

              {/* System Navigation Step Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  disabled={activeStageId === 1}
                  onClick={() => setActiveStageId(prev => Math.max(1, prev - 1))}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-40 transition-all border border-white/10"
                >
                  Previous Phase
                </button>
                <button
                  disabled={activeStageId === OPERATING_STAGES.length}
                  onClick={() => setActiveStageId(prev => Math.min(OPERATING_STAGES.length, prev + 1))}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-300 disabled:opacity-40 transition-all shadow-md"
                >
                  Next Phase →
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-4 font-bold text-base">
              01
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Systemic Architecture vs. Random Tactics
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Ad-hoc social posts and isolated ads fail without an integrated pipeline. Every stage of our system feeds into the next, maximizing compound growth.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center mb-4 font-bold text-base">
              02
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Pre-Qualified Intent vs. Low-Quality Leads
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              We deploy AI triage and friction-free intake workflows that screen out tire-kickers before they reach your clinical staff or front-desk intake team.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center mb-4 font-bold text-base">
              03
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Unit Economics & Bottom-Line Accountability
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              We measure performance strictly by cost-per-acquired-patient, appointment conversion, and patient lifetime ROI through real-time executive dashboards.
            </p>
          </div>
        </div>

        {/* High-Impact Closing CTA Banner */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/20 text-center max-w-4xl mx-auto shadow-2xl relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Exclusive System Licensing & Deployment</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-3">
            Ready to Build Your Growth Operating System?
          </h3>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            We cap active client onboarding to maintain senior engineering bandwidth and guaranteed execution standards across India. Request a confidential Growth Audit to evaluate system fit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAuditModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Request a Growth Audit™</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuditModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 text-zinc-200 border border-white/10 font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Book Discovery Call</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
