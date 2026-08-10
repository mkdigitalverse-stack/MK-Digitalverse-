import React from 'react';
import { IndustryType } from '../../types';
import { 
  HeartPulse, 
  Building2, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  Award,
  Workflow,
  Users,
  Zap,
  BarChart3,
  Layers,
  ChevronRight
} from 'lucide-react';

interface IndustryProps {
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export interface IndustryPanelData {
  id: IndustryType;
  badge: string;
  name: string;
  headline: string;
  subheadline: string;
  systemName: string;
  ipBadge: string;
  accentColor: 'amber' | 'emerald';
  storyIcons: {
    trust: React.ReactNode;
    target: React.ReactNode;
    growth: React.ReactNode;
    system: React.ReactNode;
  };
  challenges: {
    title: string;
    description: string;
    impact: string;
  }[];
  solutionPillars: {
    title: string;
    description: string;
  }[];
  businessOutcomes: {
    title: string;
    description: string;
    metric: string;
  }[];
  subVerticals: string[];
  ctaText: string;
}

const INDUSTRY_PANELS: IndustryPanelData[] = [
  {
    id: 'healthcare',
    badge: 'Healthcare Practice',
    name: 'Healthcare Organizations',
    headline: 'Helping Healthcare Organizations Build Sustainable Patient Growth',
    subheadline: 'We replace fragmented marketing tactics with an integrated patient acquisition and triage system engineered specifically for hospitals, IVF clinics, dental chains, and specialty practices.',
    systemName: 'Healthcare Growth System™',
    ipBadge: 'Proprietary Clinical IP',
    accentColor: 'amber',
    storyIcons: {
      trust: <ShieldCheck className="w-4 h-4 text-amber-400" />,
      target: <Users className="w-4 h-4 text-amber-400" />,
      growth: <TrendingUp className="w-4 h-4 text-amber-400" />,
      system: <Workflow className="w-4 h-4 text-amber-400" />
    },
    challenges: [
      {
        title: 'Low Patient Enquiries',
        description: 'Generic ad spend generated low-intent clicks without capturing patients searching for specialized care.',
        impact: 'High Cost-Per-Acquisition & Wasted Budget'
      },
      {
        title: 'Weak Digital Reputation',
        description: 'Inconsistent clinic branding and lack of structured doctor trust profiles caused patient hesitation.',
        impact: 'Loss of Patients to Regional Competitors'
      },
      {
        title: 'Poor Website Conversion',
        description: 'Slow WordPress templates with hidden phone numbers failed to convert mobile searchers into appointments.',
        impact: '80%+ Mobile Visitor Drop-Off Rate'
      },
      {
        title: 'Manual Enquiry Handling',
        description: 'Slow front-desk response times during off-hours left incoming patient queries unanswered.',
        impact: '35% Unanswered After-Hours Leads'
      }
    ],
    solutionPillars: [
      {
        title: '24/7 AI Triage & Triage Routing',
        description: 'Instant automated patient qualification and direct WhatsApp appointment routing.'
      },
      {
        title: 'Clinical Trust & Reputation Architecture',
        description: 'Doctor authority profiles, video showcases, and verified patient case studies.'
      },
      {
        title: 'Sub-Second Next.js Web Engine',
        description: 'Enterprise mobile booking platform designed for friction-free consultation holds.'
      },
      {
        title: 'Precision Geo-Targeted Search Acquisition',
        description: 'High-intent search capture targeting active patients searching for specialized treatment.'
      }
    ],
    businessOutcomes: [
      {
        title: 'More Qualified Patients',
        description: 'Pre-screened leads matching exact treatment criteria and financial capability.',
        metric: '3.8x ROI'
      },
      {
        title: 'Better Appointment Conversion',
        description: 'Frictionless booking UI converts mobile visitors directly into clinic visits.',
        metric: '+185% Lift'
      },
      {
        title: 'Stronger Clinical Reputation',
        description: 'Established market authority that commands premium consultation fee confidence.',
        metric: '2.4x Authority'
      },
      {
        title: 'Sustainable Business Growth',
        description: 'Predictable patient acquisition model with real-time unit economics tracking.',
        metric: '100% Scalable'
      }
    ],
    subVerticals: [
      'Multi-Specialty Hospitals',
      'IVF & Fertility Clinics',
      'Dental & Cosmetic Chains',
      'Specialty Surgical Centers'
    ],
    ctaText: 'Explore Healthcare Growth Solutions →'
  }
];

export const IndustrySolutions: React.FC<IndustryProps> = ({
  activeIndustry,
  onSelectIndustry,
  onOpenAuditModal
}) => {
  return (
    <section id="industries" className="py-20 md:py-28 bg-[#050505] relative border-b border-white/10 overflow-hidden">
      
      {/* Background Radial Ambiance */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Core Vertical Specialization</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            We Understand Your Business Challenges
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            Generalist agencies sell generic marketing packages. We engineer domain-specific business operating systems tailored specifically to the unit economics, intake bottlenecks, and prestige expectations of your industry.
          </p>
        </div>

        {/* Dynamic Data-Driven Solution Panel (Healthcare) */}
        <div className="space-y-16 mb-20">
          {INDUSTRY_PANELS.map((panel) => {
            const isAmber = panel.accentColor === 'amber';
            const isSelected = activeIndustry === panel.id;

            return (
              <div 
                key={panel.id}
                className={`glass-panel rounded-2xl p-6 sm:p-10 border shadow-2xl bg-[#09090b] relative overflow-hidden transition-all duration-300 ${
                  isSelected 
                    ? isAmber ? 'border-amber-400/50 ring-1 ring-amber-400/20' : 'border-emerald-400/50 ring-1 ring-emerald-400/20'
                    : 'border-white/15 hover:border-white/30'
                }`}
              >
                {/* Panel Top Badge Bar */}
                <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      isAmber 
                        ? 'bg-amber-400/10 text-amber-300 border-amber-400/30' 
                        : 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
                    }`}>
                      {panel.badge}
                    </span>
                    <span className="text-xs font-mono font-semibold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-md border border-white/5">
                      {panel.ipBadge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span>Proprietary System:</span>
                    <span className={`font-bold ${isAmber ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {panel.systemName}
                    </span>
                  </div>
                </div>

                {/* Panel Title & Story Arc Banner */}
                <div className="mb-10">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
                    {panel.headline}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-4xl">
                    {panel.subheadline}
                  </p>

                  {/* Story Arc Visual Roadmap Header */}
                  <div className="mt-8 p-4 rounded-xl bg-zinc-950 border border-white/10 hidden md:flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-red-400 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>1. Business Challenges</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-600" />

                    <div className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider ${
                      isAmber ? 'text-amber-300' : 'text-emerald-300'
                    }`}>
                      <Workflow className={`w-4 h-4 ${isAmber ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span>2. {panel.systemName}</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-600" />

                    <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>3. Measurable Outcomes</span>
                    </div>
                  </div>
                </div>

                {/* 3-Column Storytelling Grid: Problems -> Solution -> Outcomes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
                  
                  {/* Column 1: Business Problems & Friction */}
                  <div className="lg:col-span-4 p-6 rounded-xl bg-zinc-950/90 border border-red-500/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-red-500/20 text-xs font-bold uppercase tracking-wider text-red-400">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Business Challenges</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">01 Input</span>
                      </div>

                      <div className="space-y-3.5">
                        {panel.challenges.map((chal, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-zinc-900/70 border border-white/5 space-y-1">
                            <div className="text-xs font-bold text-white flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                                <span>{chal.title}</span>
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              {chal.description}
                            </p>
                            <div className="text-[10px] font-semibold text-red-300/80 pt-0.5">
                              ↳ {chal.impact}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-white/5 text-[10px] text-zinc-500 font-mono uppercase text-center">
                      Identified in 85%+ of Initial Diagnostics
                    </div>
                  </div>

                  {/* Column 2: Proprietary Solution Framework */}
                  <div className="lg:col-span-4 p-6 rounded-xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white">
                        <span className="flex items-center gap-2">
                          <Workflow className={`w-4 h-4 ${isAmber ? 'text-amber-400' : 'text-emerald-400'}`} />
                          <span>The Operating Solution</span>
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isAmber ? 'bg-amber-950 text-amber-300 border-amber-800/40' : 'bg-emerald-950 text-emerald-300 border-emerald-800/40'
                        }`}>
                          02 Process
                        </span>
                      </div>

                      <div className="space-y-3">
                        {panel.solutionPillars.map((pillar, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-white/5 flex items-start gap-3">
                            <div className={`p-1.5 rounded shrink-0 mt-0.5 ${
                              isAmber ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-400/20 text-emerald-400'
                            }`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{pillar.title}</div>
                              <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">{pillar.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Deployment Timeline:</span>
                      <span className="font-bold text-white">14-21 Business Days</span>
                    </div>
                  </div>

                  {/* Column 3: Measurable Business Outcomes */}
                  <div className="lg:col-span-4 p-6 rounded-xl bg-zinc-950/90 border border-emerald-500/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-500/20 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Business Outcomes</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">03 Result</span>
                      </div>

                      <div className="space-y-3">
                        {panel.businessOutcomes.map((outcome, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-zinc-900/70 border border-white/5 flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold text-white">{outcome.title}</div>
                              <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">{outcome.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono shrink-0 ${
                              isAmber ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                            }`}>
                              {outcome.metric}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-white/5 text-[10px] text-emerald-400 font-mono uppercase text-center font-bold">
                      Verified Across Active Client Audits
                    </div>
                  </div>

                </div>

                {/* Sub-Verticals & Bottom Panel Action CTA */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Segments Pill List */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Sub-Verticals:</span>
                    {panel.subVerticals.map((vert, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-zinc-900 text-[11px] font-medium text-zinc-300 border border-white/5">
                        {vert}
                      </span>
                    ))}
                  </div>

                  {/* Panel CTA Button */}
                  <button
                    onClick={() => {
                      onSelectIndustry(panel.id);
                      onOpenAuditModal();
                    }}
                    className={`px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg ${
                      isAmber
                        ? 'bg-amber-400 text-black hover:bg-amber-300'
                        : 'bg-emerald-400 text-black hover:bg-emerald-300'
                    }`}
                  >
                    <span>{panel.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

        {/* "Why We Specialize" Strategic Statement */}
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-950 border border-white/10 relative overflow-hidden mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Specialization Manifesto</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
              Why We Specialize
            </h3>

            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal max-w-2xl mx-auto">
              "We intentionally focus 100% on healthcare organizations because deep clinical domain expertise leads to better strategy, higher patient trust, and predictable business growth."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
              <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 w-fit">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Clinical Strategy</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We intimately understand patient LTV, insurance workflows, clinical specialty capacity, and doctor authority architecture.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2">
                <div className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400 w-fit">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Healthcare AI Insights</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Our conversational AI models are pre-trained on clinical triage protocols and front-desk appointment workflows out of the box.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2">
                <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400 w-fit">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Measurable Outcomes</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We deploy pre-tested Next.js web engines and geo-fenced acquisition campaigns that eliminate ad waste and drive patient visits.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Section Closing CTA */}
        <div className="text-center space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
            Ready to evaluate your domain growth system?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAuditModal}
              className="px-8 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-2xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuditModal}
              className="px-8 py-4 rounded-xl bg-zinc-900 text-zinc-100 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all border border-white/10 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Request a Growth Audit™</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
