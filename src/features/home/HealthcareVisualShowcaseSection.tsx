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

  return (
    <section id="visual-showcase" className="py-20 md:py-28 bg-[#FFFFFF] text-[#0B1220] relative overflow-hidden border-b border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#1877F2]/20 text-[#1877F2] text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#1877F2]" />
            <span>Interactive Visual System Tour</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0B1220] tracking-tight leading-[1.15]">
            Visualizing <span className="text-[#1E3A8A]">Healthcare Growth Systems</span>
          </h2>

          <p className="text-base sm:text-lg text-[#526071] leading-relaxed font-normal max-w-2xl mx-auto">
            Explore how MK Digitalverse replaces fragmented marketing tactics with an end-to-end, high-converting clinical growth platform.
          </p>
        </div>

        {/* Visual Story Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {[
            { id: 'problem', label: '01. Intake Bottlenecks', icon: <AlertTriangle className="w-4 h-4 text-rose-600" /> },
            { id: 'trust', label: '02. Clinical Authority', icon: <ShieldCheck className="w-4 h-4 text-[#1877F2]" /> },
            { id: 'website', label: '03. Web Platform', icon: <Layout className="w-4 h-4 text-[#1877F2]" /> },
            { id: 'ai', label: '04. 24/7 AI Triage', icon: <Bot className="w-4 h-4 text-purple-600" /> },
            { id: 'seo', label: '05. High-Intent Search', icon: <Search className="w-4 h-4 text-emerald-600" /> },
            { id: 'reviews', label: '06. 5★ Reputation', icon: <Star className="w-4 h-4 text-amber-500" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                activeTab === tab.id
                  ? 'bg-[#1E3A8A] text-white border border-[#1E3A8A] shadow-md scale-102'
                  : 'bg-[#F7F9FC] text-[#526071] hover:bg-slate-100 hover:text-[#0B1220] border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: Problem & Intake Bottlenecks */}
        {activeTab === 'problem' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F7F9FC] border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>The Common Intake Bottleneck</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
                High Ad Spend, Low Patient Conversion & After-Hours Intake Leaks
              </h3>

              <p className="text-sm text-[#526071] leading-relaxed">
                Most hospitals and clinics waste up to 45% of marketing budgets driving generic clicks to slow websites. Front desks are overwhelmed while off-hours patient inquiries remain unanswered.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</div>
                  <div>
                    <div className="text-xs font-bold text-[#0B1220]">Slow WordPress Templates & Hidden Phone Numbers</div>
                    <p className="text-[11px] text-[#526071]">80%+ mobile drop-off rate before booking a consultation slot.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</div>
                  <div>
                    <div className="text-xs font-bold text-[#0B1220]">35% Unanswered Leads After 6:00 PM</div>
                    <p className="text-[11px] text-[#526071]">Patients searching for care book with faster-responding competitors.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
                alt="Doctor reviewing clinical records and patient intake"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/40 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-rose-400 uppercase">Pre-Audit Clinical State</div>
                <div className="text-base font-bold">Inconsistent Patient Intake & Revenue Volatility</div>
                <div className="text-xs text-slate-300 mt-1">Healthcare Growth Audit™ identifies and plugs every intake leak.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Clinical Trust & Brand Authority */}
        {activeTab === 'trust' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0A192F] text-white border border-white/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/30 text-blue-300 text-xs font-bold uppercase font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1877F2]" />
                <span>Clinical Trust Architecture™</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Doctor Authority Video Showcases & Prestige Clinical Branding
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Patients choose doctors, not logos. We construct authority profiles, treatment explainer media, and verified outcome showcases that command premium consultation fee confidence.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <div className="font-bold text-blue-300">Doctor Credential Profiles</div>
                  <p className="text-[11px] text-slate-400">Highlights specialized surgical procedures & fellowship achievements.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <div className="font-bold text-blue-300">Empathy-Led Media</div>
                  <p className="text-[11px] text-slate-400">Reduces patient anxiety and prepares them for initial consultation.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/20 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=80"
                alt="Senior surgeon discussing treatment with patient in modern clinic"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/95 via-[#0A192F]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-blue-300 uppercase">2.4x Authority Premium</div>
                <div className="text-base font-bold">Doctor-Centric Trust Positioning</div>
                <div className="text-xs text-slate-300 mt-1">Establishes clinical prestige that eliminates fee resistance.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Next.js Web Platform & Mobile Performance */}
        {activeTab === 'website' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F7F9FC] border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF4FF] border border-[#1877F2]/20 text-[#1877F2] text-xs font-bold uppercase font-mono">
                <Layout className="w-3.5 h-3.5" />
                <span>Conversion-Focused Web Engine</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
                Sub-Second Mobile Load Times & Frictionless Booking UI
              </h3>

              <p className="text-sm text-[#526071] leading-relaxed">
                Built with enterprise Next.js, Tailwind, and edge CDN routing. Engineered specifically for mobile searchers with 1-click slot selection, doctor filters, and instant WhatsApp booking holds.
              </p>

              {/* Web Visual Storytelling Mockup */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-mono text-[11px] text-[#1877F2] font-bold">
                  <span>Browser Engine: https://clinic.example.com</span>
                  <span>SSL 256-Bit</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
                  <div className="p-2 rounded bg-[#EEF4FF] text-[#1E3A8A]">Doctor Search</div>
                  <div className="p-2 rounded bg-[#EEF4FF] text-[#1E3A8A]">Select Time Slot</div>
                  <div className="p-2 rounded bg-emerald-100 text-emerald-800">Confirmed Hold</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                alt="Medical portal on tablet and laptop"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">+185% Appointment Conversion Lift</div>
                <div className="text-base font-bold">Responsive Multi-Device Healthcare Stage</div>
                <div className="text-xs text-slate-300 mt-1">Converts search visitors directly into booked clinic consultations.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 24/7 AI Patient Pre-Qualification & Triage */}
        {activeTab === 'ai' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0A192F] text-white border border-white/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase font-mono">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Business Systems Workflow</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI qualification & WhatsApp Lead Routing
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Simple automated workflow: <strong className="text-white">Patient Enquiry → Qualification → Follow-up → Appointment → Measurement</strong>.
              </p>

              {/* AI Visual Workflow Pipeline */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-slate-800 text-slate-200">
                  <span>1. Patient Enquiry</span>
                  <span className="text-blue-300 font-bold">00:01s</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-purple-950 border border-purple-800/40 text-purple-200">
                  <span>2. Qualification Protocol</span>
                  <span className="text-purple-300 font-bold">Auto Triage</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-800 text-slate-200">
                  <span>3. Follow-Up Routing</span>
                  <span className="text-emerald-300 font-bold">WhatsApp API</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-emerald-950 border border-emerald-800/40 text-emerald-300 font-bold">
                  <span>4. Confirmed Appointment</span>
                  <span>In Clinic</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/20 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80"
                alt="Smartphone showing AI medical triage chat"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-purple-300 uppercase">24/7 SLA Compliance</div>
                <div className="text-base font-bold">Zero Missed After-Hours Inquiries</div>
                <div className="text-xs text-slate-300 mt-1">Converts late-night healthcare searches into morning appointments.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SEO & High-Intent Search Capture */}
        {activeTab === 'seo' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F7F9FC] border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase font-mono">
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>Performance Marketing Analytics</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
                High-Intent Acquisition Visual Pipeline
              </h3>

              <p className="text-sm text-[#526071] leading-relaxed">
                Simplified analytics visualization: <strong className="text-[#0B1220]">Reach → Qualified Enquiries → Appointments → Growth</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[#526071] text-[10px]">1. Total Reach</div>
                  <div className="text-base font-extrabold text-[#0B1220]">125,000+</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[#526071] text-[10px]">2. Qualified Enquiries</div>
                  <div className="text-base font-extrabold text-[#1877F2]">1,850</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[#526071] text-[10px]">3. Appointments Booked</div>
                  <div className="text-base font-extrabold text-emerald-600">620</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[#526071] text-[10px]">4. Net Business Growth</div>
                  <div className="text-base font-extrabold text-[#1E3A8A]">3.8x ROI</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80"
                alt="Patient searching for doctor options on smartphone"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">3.8x ROAS Search Capture</div>
                <div className="text-base font-bold">Intent-Driven Patient Acquisition</div>
                <div className="text-xs text-slate-300 mt-1">Replaces low-intent social clicks with ready-to-commit searchers.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Reputation & 5-Star Reviews */}
        {activeTab === 'reviews' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0A192F] text-white border border-white/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase font-mono">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>5★ Patient Review Engine</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Automated Review Velocity & Local Google Profile Dominance
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Post-consultation automated check-ins prompt satisfied patients to leave verified 5-star Google reviews, driving local profile authority to the top 1% in your region.
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

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/20 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1000&q=80"
                alt="Patient reviewing hospital recommendations on phone"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="text-xs font-mono font-bold text-blue-300 uppercase">Automated Reputation Growth</div>
                <div className="text-base font-bold">Verified Clinical Trust Signals</div>
                <div className="text-xs text-slate-300 mt-1">Continuous positive review generation protects brand prestige.</div>
              </div>
            </div>
          </div>
        )}

        {/* Section Closing Action CTA */}
        <div className="mt-16 text-center space-y-4">
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#FF6B00] hover:bg-[#E66000] text-white font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Book Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </section>
  );
};
