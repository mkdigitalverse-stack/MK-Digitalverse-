import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  User, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  TrendingUp, 
  Building2, 
  HeartHandshake, 
  Mic, 
  FileText,
  Target,
  BarChart2,
  Stethoscope,
  Globe
} from 'lucide-react';

interface AboutPageProps {
  onOpenAuditModal: () => void;
  onNavigateToSolutions?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ 
  onOpenAuditModal,
  onNavigateToSolutions
}) => {
  return (
    <div className="bg-[#FDFBF7] text-[#0A192F] min-h-screen pt-24 pb-20">
      {/* ========================================================= */}
      {/* 01. HERO / BANNER                                         */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-[#0A192F] text-white relative overflow-hidden border-b border-[#C5A059]/30">
        <div className="absolute inset-0 bg-navy-grid pointer-events-none opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B172A] border border-[#C5A059]/40 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ABOUT MK DIGITALVERSE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Digital Growth Partner for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059]">
              Healthcare Organizations.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            We replace fragmented marketing tactics with an integrated, high-converting digital growth system engineered around healthcare trust, medical authority, and measurable revenue expansion.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAuditModal}
              className="btn-gold-primary px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0A192F]" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4 text-[#0A192F]" />
            </button>

            {onNavigateToSolutions && (
              <button
                onClick={onNavigateToSolutions}
                className="px-7 py-4 rounded-full bg-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all border border-[#C5A059]/40 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Solutions</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 02. WHY WE EXIST                                          */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 border-b border-[#0A192F]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest">
                <Target className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Our Purpose</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-tight">
                Why We Exist: <br />
                <span className="gold-text-gradient">Beyond the Traditional Agency Model</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
                Traditional marketing agencies sell isolated, tactical deliverables—basic ad management, generic social posts, or template websites with zero conversion strategy.
              </p>

              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                MK Digitalverse was founded to break this cycle. As a dedicated Digital Growth Partner, we take complete end-to-end accountability for revenue expansion. We combine strategy, brand positioning, enterprise web platforms, AI pre-qualification engines, and performance marketing into one unified operating system built specifically for Healthcare Organizations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#C5A059]/30 space-y-1">
                  <div className="text-xs font-bold font-mono text-[#8B6B23] uppercase">TRADITIONAL AGENCIES</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fragmented tactics, vanity metrics, and no connection to patient show-up rates.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A192F] text-white border border-[#C5A059]/40 space-y-1 shadow-md">
                  <div className="text-xs font-bold font-mono text-[#D4AF37] uppercase">MK DIGITALVERSE</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Integrated growth systems, doctor authority, AI intake triage, and measurable revenue.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-3xl bg-[#0A192F] text-white border border-[#C5A059]/40 shadow-2xl relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>CORE OPERATING PHILOSOPHY</span>
                </div>

                <blockquote className="text-lg sm:text-2xl font-display font-semibold text-white leading-relaxed italic border-l-4 border-[#D4AF37] pl-5">
                  "Every digital investment should contribute to measurable business growth. We don't measure success by the number of websites built, campaigns launched, or posts published—we measure success by the business growth our clients achieve because they partnered with MK Digitalverse."
                </blockquote>

                <div className="pt-2 flex items-center gap-3 border-t border-white/10 text-xs text-slate-300 font-mono">
                  <span>Muid Khan • Founder & Strategic Growth Director</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 03. FOUNDER & LEADERSHIP                                  */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#0A192F]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
              <User className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Leadership & Strategic Direction</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight">
              15+ Years of Specialized <span className="gold-text-gradient">Growth Expertise</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Bridging digital marketing, healthcare brand transformation, and AI-driven business systems.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-[#0A192F] text-white border border-[#C5A059]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Portrait Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#050B18] group">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                  alt="Muid Khan - Founder & Strategic Growth Director at MK Digitalverse"
                  className="w-full h-[400px] sm:h-[480px] object-cover object-top group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md space-y-1 text-white">
                  <div className="text-xl font-extrabold font-display">Muid Khan</div>
                  <div className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-wider">
                    Founder & Strategic Growth Partner
                  </div>
                  <div className="text-[11px] text-slate-300 pt-1">
                    MK Digitalverse • Healthcare Growth Advisory
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                  FOUNDER BACKGROUND & VISION
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Muid Khan
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  Over the last 15+ years, Muid Khan has advised and built digital growth systems for high-trust organizations. Driven by the philosophy that healthcare marketing requires deep empathy, medical authority, and rigorous unit economics, Muid founded MK Digitalverse as a specialized Healthcare Growth Consultancy.
                </p>
              </div>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>15+ Years Digital Track Record</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Proven record across search acquisition, positioning, and digital platform engineering.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Healthcare Focus</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Dedicated focus on hospitals, specialty clinics, IVF centres, and medical organizations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Systems Architecture</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Integrating brand positioning, web engineering, CRM, and AI into one seamless engine.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>AI Business Integration</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Deploying intelligent patient triage and automated follow-up workflows.
                  </p>
                </div>
              </div>

              <blockquote className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 text-slate-200 text-xs font-semibold italic">
                "In healthcare, trust is the ultimate currency. Our job is to bridge clinical doctor excellence with modern digital accessibility so patients find the care they need."
              </blockquote>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 04. AREAS OF EXPERTISE                                    */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 border-b border-[#0A192F]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest">
              <Cpu className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Core Capabilities & Disciplines</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight">
              Areas of <span className="gold-text-gradient">Specialized Expertise</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              An end-to-end multi-disciplinary growth framework designed specifically for healthcare organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Healthcare Growth Strategy',
                icon: TrendingUp,
                desc: 'Comprehensive growth roadmaps aligning patient acquisition targets with clinical capacity and market expansion.'
              },
              {
                title: 'Brand Positioning & Authority',
                icon: ShieldCheck,
                desc: 'Establishing doctor authority and clinical differentiation that commands patient trust and premium positioning.'
              },
              {
                title: 'Conversion-Focused Websites',
                icon: Globe,
                desc: 'Custom-built, high-performing healthcare platforms engineered for mobile speed, clear UX, and appointment conversions.'
              },
              {
                title: 'AI-Powered Business Systems',
                icon: Cpu,
                desc: 'Intelligent enquiry pre-qualification, automated triage, and 24/7 lead response workflows.'
              },
              {
                title: 'Performance Marketing',
                icon: Target,
                desc: 'Data-driven paid search and social acquisition campaigns connecting search intent directly to qualified patient enquiries.'
              },
              {
                title: 'Search Engine Optimization (SEO)',
                icon: BarChart2,
                desc: 'Hyper-targeted local and regional search authority for high-value treatments, procedures, and specialties.'
              },
              {
                title: 'Patient Acquisition & Conversion',
                icon: Stethoscope,
                desc: 'Streamlining intake touchpoints to minimize drop-offs and maximize qualified consultation show-up rates.'
              },
              {
                title: 'Reputation & Review Systems',
                icon: Award,
                desc: 'Ethical review generation and reputation management frameworks amplifying doctor and clinical trust.'
              },
              {
                title: 'Unit Economics & Analytics',
                icon: Building2,
                desc: 'End-to-end attribution connecting marketing investment with cost-per-acquired-patient and lifetime value.'
              }
            ].map((exp, idx) => (
              <div 
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C5A059]/30 shadow-xs hover:shadow-lg hover:border-[#C5A059] transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EB] border border-[#C5A059]/40 flex items-center justify-center text-[#8B6B23]">
                    <exp.icon className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-[#0A192F]">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 05. RECOGNITION, AWARDS & INDUSTRY PRESENCE              */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#0A192F]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Recognition & Industry Presence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight">
              Industry Recognition & <span className="gold-text-gradient">Thought Leadership</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Verified accreditations, executive briefings, and industry presentation archives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#C5A059]/30 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F5F2EB] border border-[#C5A059]/40 flex items-center justify-center text-[#8B6B23]">
                <Award className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#0A192F]">
                Healthcare Digital Excellence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Recognized for engineering high-converting web architectures and clinical trust frameworks.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-[#8B6B23] uppercase">
                [ VERIFIED INDUSTRY ACCREDITATION ]
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#C5A059]/30 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F5F2EB] border border-[#C5A059]/40 flex items-center justify-center text-[#8B6B23]">
                <Mic className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#0A192F]">
                Executive Seminars & Keynotes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Conducting leadership briefings on patient pre-qualification, doctor branding, and healthcare AI systems.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-[#8B6B23] uppercase">
                [ EXECUTIVE BRIEFING ARCHIVE ]
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#C5A059]/30 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F5F2EB] border border-[#C5A059]/40 flex items-center justify-center text-[#8B6B23]">
                <FileText className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#0A192F]">
                Published Growth Frameworks
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Authoring the Healthcare Growth System™ blueprint for clinical practices and hospital networks.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-[#8B6B23] uppercase">
                [ PROPRIETARY METHODOLOGY ]
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 06. PARTNERSHIP PHILOSOPHY                                */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 border-b border-[#0A192F]/10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest">
            <HeartHandshake className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Partnership Philosophy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight">
            Selective Strategic <span className="gold-text-gradient">Alignment</span>
          </h2>

          <p className="text-base sm:text-xl text-slate-700 max-w-3xl mx-auto font-normal leading-relaxed">
            MK Digitalverse isn't the right partner for every healthcare organization. We deliberately restrict our active partnerships to ensure dedicated executive bandwidth, rigorous strategic focus, and zero regional client conflicts.
          </p>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#0A192F] text-white border border-[#C5A059]/40 shadow-xl max-w-3xl mx-auto text-left space-y-4">
            <div className="text-xs font-mono font-bold text-[#D4AF37] uppercase">WHO WE ARE BUILT FOR:</div>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Hospitals, IVF Centres, Specialty Clinics, and Dental Networks serious about long-term growth.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Organizations looking for an end-to-end partner rather than managing cheap freelancers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Leadership teams that value medical authority, unit economics, and data-backed patient acquisition.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 07. FINAL CALL TO ACTION                                 */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-navy-grid pointer-events-none opacity-40" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Ready to Build a Predictable <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059]">
              Patient Growth Engine?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Schedule a confidential Strategic Discovery Call to evaluate your current acquisition bottlenecks and explore partnership fit.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAuditModal}
              className="btn-gold-primary px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0A192F]" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4 text-[#0A192F]" />
            </button>

            {onNavigateToSolutions && (
              <button
                onClick={onNavigateToSolutions}
                className="px-7 py-4 rounded-full bg-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all border border-[#C5A059]/40 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Solutions</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
