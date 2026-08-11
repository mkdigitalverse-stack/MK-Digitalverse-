import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Play, 
  Building2, 
  Monitor, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Sparkles,
  ExternalLink,
  MessageSquare,
  Mic,
  BarChart2
} from 'lucide-react';

interface ClientProofHubProps {
  onOpenAuditModal: () => void;
}

type ProofTab = 'case-studies' | 'websites' | 'testimonials' | 'logos' | 'speaking-awards';

export const ClientProofHub: React.FC<ClientProofHubProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<ProofTab>('case-studies');
  const [activeVideoModal, setActiveVideoModal] = useState<{ title: string; subtitle: string } | null>(null);

  return (
    <section id="proof-evidence" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] border-b border-[#0A192F]/10 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Proof & Media Integration Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            Evidence, Proof & <span className="gold-text-gradient">Clinical Growth Results.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            A structured evidence repository showcasing real growth frameworks, website platform mockups, leadership briefings, and production asset layouts for client partnerships.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-white/10 pb-6">
          <button
            onClick={() => setActiveTab('case-studies')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'case-studies'
                ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-lg font-extrabold'
                : 'bg-[#0B172A] text-slate-200 border-white/10 hover:border-[#C5A059]/50 hover:bg-[#0F203C]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Case Study Frameworks</span>
          </button>

          <button
            onClick={() => setActiveTab('websites')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'websites'
                ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-lg font-extrabold'
                : 'bg-[#0B172A] text-slate-200 border-white/10 hover:border-[#C5A059]/50 hover:bg-[#0F203C]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Web Platform Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'testimonials'
                ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-lg font-extrabold'
                : 'bg-[#0B172A] text-slate-200 border-white/10 hover:border-[#C5A059]/50 hover:bg-[#0F203C]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Video & Client Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('logos')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'logos'
                ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-lg font-extrabold'
                : 'bg-[#0B172A] text-slate-200 border-white/10 hover:border-[#C5A059]/50 hover:bg-[#0F203C]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Partner Networks</span>
          </button>

          <button
            onClick={() => setActiveTab('speaking-awards')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'speaking-awards'
                ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-lg font-extrabold'
                : 'bg-[#0B172A] text-slate-200 border-white/10 hover:border-[#C5A059]/50 hover:bg-[#0F203C]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Speaking & Recognition</span>
          </button>
        </div>

        {/* Tab 1: Case Studies */}
        {activeTab === 'case-studies' && (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <span className="text-[11px] font-mono text-slate-300 bg-[#0B172A] px-3.5 py-1.5 rounded-full border border-[#C5A059]/30 shadow-sm">
                Note: Numerical metrics represent illustrative system benchmarks based on MK Digitalverse growth frameworks.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase">Specialty Clinic Network</span>
                  <span className="text-[10px] font-mono text-slate-400">[Illustrative Benchmark]</span>
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  3.8x ROI & High-Intent Consultation Stream
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deployed precision geo-targeting and automated AI enquiry qualification to eliminate low-intent inquiry spam and double consultation bookings.
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold font-mono">3.8x Benchmark ROI</span>
                  <button onClick={onOpenAuditModal} className="text-[#D4AF37] hover:text-white font-bold flex items-center gap-1 cursor-pointer">
                    <span>Inspect System</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase">IVF & Reproductive Health</span>
                  <span className="text-[10px] font-mono text-slate-400">[Illustrative Benchmark]</span>
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  +185% Patient Enquiry Conversion
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Empathetic web platform with sub-second page loads, automated WhatsApp consultation holds, and confidential enquiry intake.
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold font-mono">+185% Benchmark Intake</span>
                  <button onClick={onOpenAuditModal} className="text-[#D4AF37] hover:text-white font-bold flex items-center gap-1 cursor-pointer">
                    <span>Inspect System</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase">Multi-Location Dental Group</span>
                  <span className="text-[10px] font-mono text-slate-400">[Illustrative Benchmark]</span>
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  Top-3 Regional Local Search Dominance
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Local Catchment SEO and Google Maps pack optimization across 4 locations to capture high-value implant searchers.
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold font-mono">Top-3 Map Rank</span>
                  <button onClick={onOpenAuditModal} className="text-[#D4AF37] hover:text-white font-bold flex items-center gap-1 cursor-pointer">
                    <span>Inspect System</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Healthcare Web Platform Showcase */}
        {activeTab === 'websites' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B172A] border border-[#C5A059]/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050B18] border border-[#C5A059]/30 text-[#D4AF37] text-xs font-mono font-bold">
                  <span>Conversion-Focused Website Architecture</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  Conversion-Focused Healthcare Website Showcase
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Digital experiences designed to build patient trust, simplify the patient journey, and turn more qualified visitors into enquiries. Engineered with sub-second page performance, zero layout shift, interactive slot reservation widgets, doctor authority showcase, and instant WhatsApp enquiry routing.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#050B18] border border-[#C5A059]/30 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Core Web Vitals</span>
                    <span className="text-sm font-bold text-emerald-400">98 / 100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050B18] border border-[#C5A059]/30 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Page Load Speed</span>
                    <span className="text-sm font-bold text-[#D4AF37]">&lt; 0.8s</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050B18] border border-[#C5A059]/30 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Conversion Benchmark</span>
                    <span className="text-sm font-bold text-emerald-400">+185%</span>
                  </div>
                </div>
              </div>

              {/* Browser Mockup Visual */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#050B18]">
                  <div className="bg-[#050B18] px-4 py-2 border-b border-white/10 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-[10px] font-mono text-slate-300 bg-[#0B172A] px-3 py-0.5 rounded-full mx-auto border border-white/10">
                      https://client.mkdigitalverse.com/preview
                    </div>
                  </div>
                  <div className="p-4 relative">
                    <img
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                      alt="Healthcare Web Platform Mockup"
                      className="w-full h-56 object-cover rounded-xl border border-white/10 brightness-90"
                    />
                    <div className="absolute inset-x-8 bottom-8 p-3 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md text-xs font-bold text-white flex items-center justify-between">
                      <span>Interactive Slot Booking Active</span>
                      <span className="text-[#D4AF37] font-mono text-[10px]">✔ Sub-60s Response</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Video & Client Feedback */}
        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase">Video Briefing Placeholder</span>
                <span className="text-[10px] text-slate-400 font-mono">[Ready for Client Video]</span>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-[#050B18] aspect-video border border-white/10 flex items-center justify-center group">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80"
                  alt="Video Testimonial Placeholder"
                  className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => setActiveVideoModal({
                    title: 'Executive Healthcare Growth Case Video',
                    subtitle: 'Video testimonial layout ready for custom client media recording.'
                  })}
                  className="w-14 h-14 rounded-full bg-[#050B18] text-[#D4AF37] border border-[#C5A059] flex items-center justify-center shadow-2xl relative z-10 hover:bg-[#0B172A] transition-all cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5 text-[#D4AF37]" />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white font-display">
                Specialty Hospital Growth Transformation Briefing
              </h4>
              <p className="text-xs text-slate-300">
                Placeholder layout for real video interview, doctor feedback, or hospital executive testimonial.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase">Executive Feedback Card</span>
                <span className="text-[10px] text-slate-400 font-mono">[Production Asset Layout]</span>
              </div>
              <blockquote className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/20 text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "The MK Digitalverse Growth Framework gave our clinical organization a clear, measurable patient acquisition system without relying on guesswork."
              </blockquote>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-[#050B18] text-[#D4AF37] border border-[#C5A059]/40 font-bold flex items-center justify-center text-xs">
                  MD
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Clinical Managing Director</div>
                  <div className="text-[11px] text-slate-400">Specialty Medical Center Partner</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Partner Networks / Logos */}
        {activeTab === 'logos' && (
          <div className="p-8 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 text-center space-y-6 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050B18] border border-[#C5A059]/30 text-xs font-mono text-[#D4AF37]">
              <span>Partner & Client Logo Grid [Asset Placeholder Architecture]</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Clean layout structured for hospital logos, specialty practice badges, and medical association memberships.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
              {['Specialty Hospital', 'Fertility Institute', 'Dental Group', 'Diagnostic Network'].map((name, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/20 text-slate-200 text-xs font-bold font-mono hover:border-[#C5A059]">
                  {name} Partner Logo
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Speaking & Awards */}
        {activeTab === 'speaking-awards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase">
                <Mic className="w-4 h-4 text-[#D4AF37]" />
                <span>Healthcare Industry Keynote & Seminars</span>
              </div>
              <h3 className="text-base font-bold text-white font-display">
                Healthcare Digital Leadership Speaking Sessions
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Keynote presentations and strategy workshops conducted for healthcare leaders on digital trust, AI intake automation, and clinical brand positioning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B172A] border border-[#C5A059]/30 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Recognition & Certifications</span>
              </div>
              <h3 className="text-base font-bold text-white font-display">
                Growth Excellence Standards
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Built on 15+ years of digital marketing experience, verified technical architecture, and Core Web Vitals optimization.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Video Modal Popup */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B172A] border border-[#C5A059]/40 rounded-2xl max-w-2xl w-full p-6 text-white relative shadow-2xl space-y-4">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#050B18] text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-mono">
              <Play className="w-4 h-4 fill-current" />
              <span>{activeVideoModal.title}</span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video border border-white/10 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=80"
                alt="Video Player Container"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/50">
                <div className="w-16 h-16 rounded-full bg-[#050B18] border border-[#C5A059] text-[#D4AF37] flex items-center justify-center shadow-2xl mb-3 animate-pulse">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <div className="text-sm font-bold text-white">Client Video Asset Placeholder Container</div>
                <p className="text-xs text-slate-300 max-w-md mt-1">
                  {activeVideoModal.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Media Container Ready for Production Video</span>
              <button
                onClick={() => {
                  setActiveVideoModal(null);
                  onOpenAuditModal();
                }}
                className="btn-gold-primary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Book Strategic Discovery Call
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
