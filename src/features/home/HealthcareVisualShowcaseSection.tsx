import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Workflow, 
  Bot, 
  Search, 
  Smartphone, 
  Star, 
  Activity, 
  TrendingUp,
  Layout,
  Users,
  Building2,
  Clock,
  ChevronRight,
  Play
} from 'lucide-react';

interface VisualShowcaseProps {
  onOpenAuditModal: () => void;
}

export const HealthcareVisualShowcaseSection: React.FC<VisualShowcaseProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'trust' | 'website' | 'ai' | 'seo' | 'reviews'>('problem');
  const [activeAiStep, setActiveAiStep] = useState<number>(0);

  return (
    <section id="visual-showcase" className="py-20 md:py-28 bg-[#FAF8F3] text-slate-900 relative overflow-hidden border-t border-amber-900/10">
      
      {/* 🌟 Signature Flowing Gold Ribbon Background SVG Motif */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none">
          <path
            d="M-100,250 C300,50 700,450 1100,150 C1400,300 1600,100 1700,200"
            stroke="url(#showcaseGoldGrad)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="showcaseGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#E6C687" stopOpacity="1" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Growth System Visual Tour</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Every Section Visualized for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">Healthcare Excellence</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold max-w-2xl mx-auto">
            Explore how MK Digitalverse replaces fragmented marketing noise with an end-to-end, visual clinical growth engine.
          </p>
        </div>

        {/* Visual Story Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {[
            { id: 'problem', label: '01. Intake Bottlenecks', icon: <AlertTriangle className="w-4 h-4 text-rose-600" /> },
            { id: 'trust', label: '02. Clinical Authority', icon: <ShieldCheck className="w-4 h-4 text-amber-600" /> },
            { id: 'website', label: '03. Web Platform', icon: <Layout className="w-4 h-4 text-blue-600" /> },
            { id: 'ai', label: '04. 24/7 AI Triage', icon: <Bot className="w-4 h-4 text-purple-600" /> },
            { id: 'seo', label: '05. High-Intent Search', icon: <Search className="w-4 h-4 text-emerald-600" /> },
            { id: 'reviews', label: '06. 5★ Reputation', icon: <Star className="w-4 h-4 text-amber-500" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-amber-300 border border-amber-500/40 shadow-xl scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-50/80 border border-amber-200/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: Problem & Intake Bottlenecks */}
        {activeTab === 'problem' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-amber-200 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>The Common Healthcare Intake Problem</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                High Ad Spend, Low Patient Conversion & After-Hours Intake Leaks
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Most hospitals and clinics waste up to 45% of marketing budgets driving generic clicks to slow websites. Front desks are overwhelmed with unqualified leads while off-hours patient inquiries remain unanswered.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Slow WordPress Templates & Hidden Call Buttons</div>
                    <p className="text-[11px] text-slate-600">80%+ mobile drop-off rate before booking a consultation slot.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">35% Unanswered Leads After 6:00 PM</div>
                    <p className="text-[11px] text-slate-600">Patients searching for urgent care book with faster-responding competitors.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
                alt="Doctor reviewing clinical records and patient intake"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-rose-400 uppercase">Pre-Audit Clinical State</div>
                <div className="text-base font-bold">Inconsistent Patient Intake & Revenue Volatility</div>
                <div className="text-xs text-slate-300 mt-1">MK Growth Audit™ identifies and plugs every intake bottleneck.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Clinical Trust & Brand Authority */}
        {activeTab === 'trust' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-amber-500/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Clinical Trust Architecture™</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Doctor Authority Video Showcases & Prestige Clinical Branding
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Patients choose doctors, not logos. We construct authority profiles, treatment explainer media, and verified outcome showcases that command premium consultation fee confidence.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="font-bold text-amber-400">Doctor Credential Profiles</div>
                  <p className="text-[11px] text-slate-400">Highlights specialized surgical procedures & fellowship achievements.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="font-bold text-amber-400">Empathy-Led Media</div>
                  <p className="text-[11px] text-slate-400">Reduces patient anxiety and prepares them for initial consultation.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=80"
                alt="Senior surgeon discussing treatment with patient in modern clinic"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">2.4x Authority Premium</div>
                <div className="text-base font-bold">Doctor-Centric Trust Positioning</div>
                <div className="text-xs text-slate-300 mt-1">Establishes clinical prestige that eliminates fee resistance.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Next.js Web Platform & Mobile Performance */}
        {activeTab === 'website' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-amber-200 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase font-mono">
                <Layout className="w-3.5 h-3.5" />
                <span>Next.js Web Engine</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sub-Second Mobile Load Times & Frictionless Appointment Booking UI
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Built with enterprise Next.js, Tailwind, and edge CDN routing. Engineered specifically for mobile searchers with 1-click slot selection, doctor filters, and instant WhatsApp booking holds.
              </p>

              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-amber-300">
                  <span>Google Lighthouse Performance Score:</span>
                  <span className="font-bold text-emerald-400">99 / 100 ✓</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Largest Contentful Paint (LCP):</span>
                  <span className="font-bold text-amber-400">0.8s (Ultra-Fast)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                alt="Medical portal on tablet and laptop"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">+185% Appointment Conversion Lift</div>
                <div className="text-base font-bold">Responsive Multi-Device Healthcare Stage</div>
                <div className="text-xs text-slate-300 mt-1">Converts search visitors directly into booked clinic consultations.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 24/7 AI Patient Pre-Qualification & Triage */}
        {activeTab === 'ai' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 text-white border border-amber-500/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase font-mono">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>24/7 AI Triage Assistant</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Instant Qualification & WhatsApp Lead Routing (Sub-30s Response)
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Our conversational AI engages patients day and night, asks specialty-specific diagnostic questions, verifies insurance/fee readiness, and routes pre-screened bookings directly to clinic coordinators.
              </p>

              {/* Interactive AI Chat Flow Simulator */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-purple-950/80 border border-purple-800/40 text-purple-200">
                  🤖 <strong>AI Assistant:</strong> "Hello! I can help you schedule a consultation with Dr. Sharma for IVF or Gynecological care. Which specialty fits your request?"
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-right">
                  👤 <strong>Patient:</strong> "I'd like an IVF consultation this Thursday afternoon."
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800/40 text-emerald-300">
                  ✅ <strong>AI Assistant:</strong> "Slot reserved! Dr. Sharma has a 3:30 PM opening. Routing hold confirmation to your WhatsApp now."
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80"
                alt="Smartphone showing AI medical triage chat"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-purple-400 uppercase">24/7 SLA Compliance</div>
                <div className="text-base font-bold">Zero Missed After-Hours Inquiries</div>
                <div className="text-xs text-slate-300 mt-1">Converts late-night healthcare searches into morning appointments.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SEO & High-Intent Search Capture */}
        {activeTab === 'seo' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-amber-200 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase font-mono">
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>Geo-Targeted Search Capture</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dominating Search Queries for High-Margin Clinical Treatments
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                We capture active patients precisely when they search for specialized procedures (e.g. "Best Orthopedic Surgeon", "Top IVF Center Near Me", "Laser Eye Surgery Clinic").
              </p>

              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-amber-300">
                  <span>Google Search Ranking #1:</span>
                  <span className="font-bold text-emerald-400">"Top IVF Clinic Delhi NCR"</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Organic Patient Search Traffic:</span>
                  <span className="font-bold text-amber-400">+320% Lift in 6 Months</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80"
                alt="Patient searching for doctor options on smartphone"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">3.8x ROAS Search Capture</div>
                <div className="text-base font-bold">Intent-Driven Patient Acquisition</div>
                <div className="text-xs text-slate-300 mt-1">Replaces low-intent social media leads with ready-to-commit searchers.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Reputation & 5-Star Reviews */}
        {activeTab === 'reviews' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 text-white border border-amber-500/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase font-mono">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>5★ Patient Review Engine</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Automated Review Velocity & Google Local Profile Dominance
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Post-consultation automated WhatsApp check-ins prompt satisfied patients to leave verified 5-star Google reviews, driving local profile authority to the top 1% in your region.
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-base">
                  <span>4.9</span>
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
                <span className="text-slate-300 font-mono">480+ Verified Patient Reviews</span>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1000&q=80"
                alt="Patient reviewing hospital recommendations on phone"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">Automated Reputation Growth</div>
                <div className="text-base font-bold">Verified Clinical Trust Signals</div>
                <div className="text-xs text-slate-300 mt-1">Continuous positive review generation protects brand prestige.</div>
              </div>
            </div>
          </div>
        )}

        {/* Section Closing Action CTA */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600">
            Want us to construct this exact growth system for your clinic?
          </p>

          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-slate-900 text-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition-all shadow-2xl cursor-pointer border border-amber-500/30"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Request Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
