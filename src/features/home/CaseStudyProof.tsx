import React, { useState } from 'react';
import { IndustryType } from '../../types';
import { 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Building2, 
  HeartPulse, 
  Castle, 
  Quote, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  MessageSquare, 
  Presentation, 
  Users, 
  ChevronRight,
  AlertTriangle,
  Workflow,
  BarChart3,
  Check,
  BadgeCheck
} from 'lucide-react';

interface ProofProps {
  onOpenAuditModal: () => void;
}

export interface ClientPartnerLogo {
  id: string;
  name: string;
  category: string;
  industry: IndustryType;
  location: string;
}

export interface FeaturedCaseStudy {
  id: string;
  industry: IndustryType;
  badge: string;
  clientName: string;
  headline: string;
  challenge: string;
  strategy: string;
  implementation: string[];
  outcomes: {
    metric: string;
    label: string;
    trend: string;
  }[];
  quote: {
    text: string;
    author: string;
    role: string;
    location: string;
  };
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  organization: string;
  industry: IndustryType;
  avatarText: string;
  content: string;
  metricHighlight: string;
  verified: boolean;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  category: string;
  description: string;
}

export interface SpeakingItem {
  id: string;
  event: string;
  topic: string;
  location: string;
  date: string;
  audience: string;
}

export interface SocialProofSnippet {
  id: string;
  platform: 'WhatsApp' | 'LinkedIn' | 'Google Review' | 'Client Email';
  sender: string;
  role: string;
  message: string;
  date: string;
}

const CLIENT_PARTNERS: ClientPartnerLogo[] = [
  { id: '1', name: 'Apex Multi-Specialty Hospital', category: 'Hospital Network', industry: 'healthcare', location: 'Delhi NCR' },
  { id: '2', name: 'Blossoms Fertility & IVF Institute', category: 'IVF & Fertility Chain', industry: 'healthcare', location: 'Mumbai' },
  { id: '3', name: 'Divine Cosmetic & Dental Care', category: 'Specialty Dental Group', industry: 'healthcare', location: 'Bengaluru' },
  { id: '4', name: 'Zenith Surgical & Ortho Center', category: 'Specialty Surgical Group', industry: 'healthcare', location: 'Hyderabad' },
  { id: '5', name: 'Nova Diagnostic Labs & Imaging', category: 'Diagnostic & Pathology Chain', industry: 'healthcare', location: 'Chennai' },
  { id: '6', name: 'Aura Wellness & Dermatology', category: 'Aesthetic & Wellness Group', industry: 'healthcare', location: 'Pune' }
];

const FEATURED_CASE_STUDIES: FeaturedCaseStudy[] = [
  {
    id: 'fertility_clinic_case',
    industry: 'healthcare',
    badge: 'Healthcare Case Study',
    clientName: 'Multi-Centre IVF & Fertility Institute',
    headline: 'Scaling Verified Patient Inquiries by +280% While Lowering CAC by 52%',
    challenge: 'The clinic relied on high-volume generic social media ads that produced hundreds of low-intent leads, overwhelming clinical coordinators and resulting in a high consultation no-show rate.',
    strategy: 'Deployed an empathy-first clinical trust architecture featuring doctor authority video showcases, interactive fertility assessment quizzes, and instant AI patient pre-qualification triage.',
    implementation: [
      'Sub-second Next.js clinical web platform',
      '24/7 AI conversational triage routing to clinical coordinators',
      'Hyper-local Google Search & Maps high-intent campaign capture',
      'Automated WhatsApp appointment hold & reminder engine'
    ],
    outcomes: [
      { metric: '+280%', label: 'Verified Consultations', trend: 'In 90 Days' },
      { metric: '-52%', label: 'Cost Per Acquired Patient', trend: 'Optimized CAC' },
      { metric: '88%', label: 'Consultation Show-Up Rate', trend: 'Pre-Qualified' }
    ],
    quote: {
      text: 'MK Digitalverse transformed our entire online patient intake. Our clinical coordinators now spend 100% of their time talking to qualified, ready-to-commit couples.',
      author: 'Dr. A. Sharma',
      role: 'Medical Director & Founder',
      location: 'Delhi NCR'
    }
  },
  {
    id: 'hospital_network_case',
    industry: 'healthcare',
    badge: 'Multi-Specialty Hospital Case Study',
    clientName: 'Apex Multi-Specialty Hospital Network',
    headline: 'Adding ₹4.2 Cr in Elective Surgery Pipeline Across 4 Hospital Locations',
    challenge: 'A growing multi-specialty hospital network experienced high patient drop-off on their outdated legacy website, alongside 30-minute delays in routing digital consultation requests.',
    strategy: 'Re-architected their digital infrastructure into a Next.js web platform paired with centralized 24/7 AI Triage that automatically categorizes patient intent by specialty and urgency.',
    implementation: [
      'Multi-location Next.js portal with instant doctor slot booking',
      'AI Triage engine with instant WhatsApp routing to hospital desks',
      'Specialty Search Engine Dominance for Orthopedics & Cardiology',
      'Real-time executive intake analytics via Healthcare Growth Index™'
    ],
    outcomes: [
      { metric: '₹4.2 Cr', label: 'Incremental Elective Pipeline', trend: 'Year 1 Impact' },
      { metric: '<30s', label: 'Average Response Time', trend: '24/7 AI Triage' },
      { metric: '3.4x', label: 'Inquiry-to-Appointment Lift', trend: 'Conversion' }
    ],
    quote: {
      text: 'The 24/7 AI triage and doctor authority portals positioned our hospital as the top regional choice for orthopedic and surgical procedures. The intake speed is unmatched.',
      author: 'Dr. R. Kapoor',
      role: 'Managing Director & CMO',
      location: 'Delhi NCR'
    }
  }
];

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    author: 'Dr. A. Sharma',
    role: 'Medical Director & Chief IVF Specialist',
    organization: 'Blossoms Fertility Institute',
    industry: 'healthcare',
    avatarText: 'AS',
    content: 'Unlike agencies that just send lead counts, MK Digitalverse engineered a system that delivers pre-screened patients. Our consultation pipeline has never been healthier.',
    metricHighlight: '+280% Patient Growth',
    verified: true
  },
  {
    id: 't2',
    author: 'Dr. R. Kapoor',
    role: 'Managing Director & CMO',
    organization: 'Apex Multi-Specialty Hospital Network',
    industry: 'healthcare',
    avatarText: 'RK',
    content: 'The 24/7 AI triage changed the game for us. Patient enquiries are answered in under 30 seconds, and our intake team only deals with serious treatment consultations.',
    metricHighlight: '₹4.2 Cr Elective Lift',
    verified: true
  },
  {
    id: 't3',
    author: 'Dr. K. Mehta',
    role: 'Founder & Chief Cosmetic Surgeon',
    organization: 'Divine Cosmetic & Dental Chain',
    industry: 'healthcare',
    avatarText: 'KM',
    content: 'The authority profiling and sub-second web platform positioned us as the premier cosmetic surgical group in our region. Our consultation fee authority jumped overnight.',
    metricHighlight: '3.5x Fee Realization',
    verified: true
  }
];

const AWARDS: AwardItem[] = [
  {
    id: 'a1',
    title: 'Excellence in Digital Healthcare Growth',
    issuer: 'Healthcare Marketing Excellence Summit',
    year: '2025',
    category: 'Industry Award',
    description: 'Recognized for pioneering AI-driven patient triage and high-trust clinical intake architectures in India.'
  },
  {
    id: 'a2',
    title: 'Best AI Patient Triage System Architecture',
    issuer: 'Digital Health & Medical Tech Guild',
    year: '2025',
    category: 'Excellence Award',
    description: 'Awarded for delivering sub-second response times and 24/7 patient pre-qualification across hospital networks.'
  }
];

const SPEAKING_EVENTS: SpeakingItem[] = [
  {
    id: 's1',
    event: 'National Healthcare Marketing Summit 2025',
    topic: 'Keynote: Replacing Lead Volume with AI Patient Triage Engines',
    location: 'New Delhi',
    date: 'November 2025',
    audience: '250+ Hospital Directors & CMOs'
  },
  {
    id: 's2',
    event: 'Asia Healthcare Leaders Forum 2026',
    topic: 'Masterclass: Building Clinical Trust Architecture for High-Margin Specialties',
    location: 'Mumbai',
    date: 'January 2026',
    audience: '180+ Clinic Founders & Medical Group CEOs'
  }
];

const SOCIAL_PROOF: SocialProofSnippet[] = [
  {
    id: 'sp1',
    platform: 'WhatsApp',
    sender: 'Dr. R. Kapoor',
    role: 'Managing Director, Apex Hospital',
    message: '"Just checking the dashboard—we logged 42 pre-qualified appointment requests this week alone. The WhatsApp triage bot is doing wonders for our front desk!"',
    date: '3 days ago'
  },
  {
    id: 'sp2',
    platform: 'LinkedIn',
    sender: 'Dr. S. Nair',
    role: 'Chief Radiologist, Nova Diagnostics',
    message: '"The new web platform and local search dominance campaign doubled our diagnostic scan bookings within 60 days. Phenomenal engineering."',
    date: '1 week ago'
  }
];

export const CaseStudyProof: React.FC<ProofProps> = ({ onOpenAuditModal }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(FEATURED_CASE_STUDIES[0].id);

  const activeCase = FEATURED_CASE_STUDIES.find(c => c.id === selectedCaseId) || FEATURED_CASE_STUDIES[0];

  return (
    <section id="proof" className="py-20 md:py-28 bg-[#050505] relative border-b border-white/10 overflow-hidden">
      
      {/* Background Radial Ambiance */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Repositioning & Evidence Center Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Layer Evidence Center</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Why Businesses Trust MK Digitalverse
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            We measure our partnership success purely by bottom-line patient intake and appointment growth. Explore real evidence of performance, clinical authority, and industry recognition across India.
          </p>
        </div>

        {/* LAYER 1: Client & Partner Brand Logos Strip */}
        <div className="mb-20">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              Trusted By Leading Healthcare Organizations & Specialty Clinics Across India
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CLIENT_PARTNERS.map((client) => (
              <div 
                key={client.id}
                className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 flex flex-col items-center justify-center text-center hover:border-white/20 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 mb-2 group-hover:border-amber-400/30 transition-colors">
                  {client.industry === 'healthcare' ? (
                    <Building2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Castle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="text-xs font-bold text-zinc-200 line-clamp-1">{client.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{client.location}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LAYER 2: Featured Detailed Case Studies Dashboard */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Deep-Dive Performance Analysis
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Growth Transformation
              </h3>
            </div>

            {/* Industry Case Selector Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-950 border border-white/10">
              {FEATURED_CASE_STUDIES.map((cs) => {
                const isActive = cs.id === selectedCaseId;
                return (
                  <button
                    key={cs.id}
                    onClick={() => setSelectedCaseId(cs.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      isActive
                        ? cs.industry === 'healthcare'
                          ? 'bg-amber-400 text-black shadow-lg'
                          : 'bg-emerald-400 text-black shadow-lg'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cs.industry === 'healthcare' ? (
                      <HeartPulse className="w-3.5 h-3.5" />
                    ) : (
                      <Castle className="w-3.5 h-3.5" />
                    )}
                    <span>{cs.clientName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Case Study Panel */}
          <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/15 shadow-2xl bg-[#09090b] relative overflow-hidden">
            
            <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  activeCase.industry === 'healthcare'
                    ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                    : 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
                }`}>
                  {activeCase.badge}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Client: <strong className="text-white font-semibold">{activeCase.clientName}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <BadgeCheck className="w-4 h-4" />
                <span>Verified Audit Outcomes</span>
              </div>
            </div>

            <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-8 tracking-tight">
              {activeCase.headline}
            </h4>

            {/* 4-Step Analytical Grid: Challenge -> Strategy -> Implementation -> Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Step 1: Challenge */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-red-500/20 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-red-400">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>1. Bottleneck</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">Problem</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mt-2">
                    {activeCase.challenge}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                  Pre-Audit Condition
                </div>
              </div>

              {/* Step 2: Strategy */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-amber-500/20 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Workflow className="w-4 h-4" />
                      <span>2. Growth Strategy</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">Plan</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mt-2">
                    {activeCase.strategy}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                  Architectural Blueprint
                </div>
              </div>

              {/* Step 3: Implementation */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-white/10 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>3. Deliverables</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">Execution</span>
                  </div>
                  <ul className="space-y-1.5 mt-2">
                    {activeCase.implementation.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                  Deployed Engine
                </div>
              </div>

              {/* Step 4: Outcomes */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>4. Business Outcomes</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">Impact</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    {activeCase.outcomes.map((out, idx) => (
                      <div key={idx} className="p-2 rounded bg-zinc-900 border border-white/5">
                        <div className="text-base font-extrabold text-amber-400">{out.metric}</div>
                        <div className="text-[10px] font-medium text-zinc-300">{out.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-emerald-400 font-bold">
                  Verified Bottom-Line Impact
                </div>
              </div>

            </div>

            {/* Testimonial Quote Banner */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-white/10 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Quote className="w-8 h-8 text-zinc-800 shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="text-sm text-zinc-200 italic font-medium">
                  "{activeCase.quote.text}"
                </p>
                <div className="text-xs text-zinc-400">
                  <strong className="text-white font-semibold">{activeCase.quote.author}</strong> — {activeCase.quote.role}, {activeCase.quote.location}
                </div>
              </div>
              <button
                onClick={onOpenAuditModal}
                className="px-5 py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shrink-0"
              >
                Request Similar Growth System →
              </button>
            </div>

          </div>
        </div>

        {/* LAYER 3: Measurable Outcomes Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-1">
              Proven Performance Benchmarks
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Aggregated Partner Metrics
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 text-center space-y-2">
              <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400 w-fit mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">+185%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Avg Appointment Conversion Lift</div>
              <p className="text-[11px] text-zinc-500 leading-normal">Measured in first 90 days after Next.js deployment.</p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 text-center space-y-2">
              <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400 w-fit mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">&lt; 30s</div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">24/7 AI Triage Velocity</div>
              <p className="text-[11px] text-zinc-500 leading-normal">Average instant response time day and night.</p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 text-center space-y-2">
              <div className="p-3 rounded-xl bg-cyan-400/10 text-cyan-400 w-fit mx-auto">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">3.8x</div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Return on Ad Spend (ROAS)</div>
              <p className="text-[11px] text-zinc-500 leading-normal">High-intent search capture targeting active intent.</p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 text-center space-y-2">
              <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400 w-fit mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">98%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Intake SLA Compliance</div>
              <p className="text-[11px] text-zinc-500 leading-normal">Sub-60 second AI response rate for after-hours patient queries.</p>
            </div>
          </div>
        </div>

        {/* LAYER 4: Verified Client Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
              Leadership Endorsements
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              What Partner Leadership Says
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="p-6 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-[10px] font-bold font-mono text-amber-400">
                      {t.metricHighlight}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Client</span>
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-amber-400/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {t.avatarText}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{t.author}</div>
                    <div className="text-[11px] text-zinc-400">{t.role}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{t.organization}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LAYER 5: Awards & Keynote Speaking Recognition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Awards & Recognition Column */}
          <div className="p-8 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider block">
                  External Validation
                </span>
                <h4 className="text-xl font-bold text-white">Recognition & Accreditation</h4>
              </div>
            </div>

            <div className="space-y-4">
              {AWARDS.map((award) => (
                <div key={award.id} className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{award.title}</span>
                    <span className="font-mono text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                      {award.year}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-medium">{award.issuer}</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{award.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Speaking Engagements Column */}
          <div className="p-8 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider block">
                  Thought Leadership
                </span>
                <h4 className="text-xl font-bold text-white">Seminars & Keynote Engagements</h4>
              </div>
            </div>

            <div className="space-y-4">
              {SPEAKING_EVENTS.map((event) => (
                <div key={event.id} className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{event.event}</span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                      {event.date}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-amber-300">{event.topic}</div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span>Location: {event.location}</span>
                    <span>Audience: {event.audience}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* LAYER 6: Social Proof & Direct Client Feedback */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1">
              Authentic Direct Feedback
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Real-Time Partner Communication
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {SOCIAL_PROOF.map((sp) => (
              <div key={sp.id} className="p-5 rounded-xl bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{sp.platform} Message</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{sp.date}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  {sp.message}
                </p>
                <div className="text-[11px] text-zinc-400 font-semibold text-right">
                  — {sp.sender}, <span className="font-normal text-zinc-500">{sp.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LAYER 7: Strategic Bottom Call to Action */}
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-950 border border-white/15 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400"></div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next Steps</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white mb-3 tracking-tight">
            Ready to Become Our Next Success Story?
          </h3>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Schedule a 1-on-1 strategic growth consultation to evaluate your current digital architecture, intake capacity, and growth opportunities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAuditModal}
              className="px-8 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuditModal}
              className="px-8 py-4 rounded-xl bg-zinc-900 text-zinc-200 border border-white/10 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center gap-2"
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
