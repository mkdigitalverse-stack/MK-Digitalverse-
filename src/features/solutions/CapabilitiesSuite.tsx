import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Layout, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  Workflow,
  Search,
  Users,
  ShieldCheck,
  Zap,
  BarChart3,
  Calendar,
  Phone,
  MessageSquare,
  Check,
  Clock,
  Activity,
  Globe,
  Award,
  Lock,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CapabilitiesProps {
  onOpenAuditModal: () => void;
}

export const CapabilitiesSuite: React.FC<CapabilitiesProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<string>('growth-strategy');

  // Interactive Website Mockup State
  const [activePage, setActivePage] = useState<'home' | 'specialist' | 'booking'>('home');
  const [bookingStep, setBookingStep] = useState<number>(1);

  // AI Workflow Active Node Pulse Index
  const [workflowNode, setWorkflowNode] = useState<number>(0);

  // Performance Marketing Dashboard Filter
  const [timeRange, setTimeRange] = useState<'month' | 'quarter'>('month');

  return (
    <section id="capabilities" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Full-Spectrum Healthcare Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            Strategy + Technology + Execution.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Five strategic capabilities designed to build market leadership, patient trust, and predictable business growth.
          </p>

          {/* Feature Image Section directly below heading */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#050B18]">
              <img
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80"
                alt="Strategy Technology and Execution Triad for Healthcare Growth"
                referrerPolicy="no-referrer"
                className="w-full h-[220px] sm:h-[300px] object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="font-bold text-[#D4AF37] uppercase font-mono">Core Capability Triad</span>
                  <span className="text-slate-300 hidden sm:inline">• Patient Acquisition & Digital Infrastructure</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  Full-Spectrum Integration
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Capability Selection Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
          {[
            { id: 'growth-strategy', num: '01', title: 'Healthcare Growth Strategy', icon: Target },
            { id: 'brand-positioning', num: '02', title: 'Brand Positioning', icon: ShieldCheck },
            { id: 'conversion-websites', num: '03', title: 'Conversion Websites', icon: Layout },
            { id: 'ai-systems', num: '04', title: 'AI Business Systems', icon: Bot },
            { id: 'performance-marketing', num: '05', title: 'Performance Marketing', icon: TrendingUp }
          ].map((item) => {
            const isSelected = activeTab === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-4 sm:p-5 rounded-2xl text-left transition-all border cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-xl scale-102 z-10'
                    : 'bg-[#0B172A] text-slate-200 border-white/10 hover:border-[#C5A059]/40 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                    Pillar {item.num}
                  </span>
                  <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-[#C5A059]'}`} />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold leading-tight">
                  {item.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CAPABILITY 1: HEALTHCARE GROWTH STRATEGY                      */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'growth-strategy' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-10 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                  Strategic Growth & Unit Economics
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Healthcare Growth Strategy
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  A comprehensive roadmap aligning clinical doctor capacity with patient demand. We analyze your 15–30 mile catchment area, model unit economics, and target high-margin treatment pathways.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#050B18] border border-white/10 flex items-start gap-3 text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white">Catchment Radius & Demographic Mapping</span>
                      <span className="text-slate-300">Uncovers precise regional demand for specialized procedures.</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#050B18] border border-white/10 flex items-start gap-3 text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white">Doctor Capacity Alignment</span>
                      <span className="text-slate-300">Ensures marketing volume matches clinical availability.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#050B18] text-white flex items-center justify-between border border-[#C5A059]/40">
                  <span className="text-xs font-mono font-bold uppercase text-[#D4AF37]">Business Outcome:</span>
                  <span className="text-xs font-bold text-white">Clear Market Leadership & Growth Targets</span>
                </div>
              </div>

              {/* Visual: Strategic Blueprint Matrix Diagram */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#050B18] text-white border border-[#C5A059]/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                  <span className="text-[#D4AF37] font-bold">GROWTH MATRIX DIAGRAM</span>
                  <span className="text-slate-300">Catchment Analysis</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-[#0B172A] border border-white/10 space-y-1">
                    <span className="text-[#D4AF37] text-[10px] block font-bold">01 DEMOGRAPHICS</span>
                    <span className="font-bold text-white block">350,000 Household Catchment</span>
                    <span className="text-[10px] text-slate-300">High Treatment Affordability</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B172A] border border-white/10 space-y-1">
                    <span className="text-[#D4AF37] text-[10px] block font-bold">02 CAPACITY</span>
                    <span className="font-bold text-white block">8 Specialist Doctors</span>
                    <span className="text-[10px] text-slate-300">45 Weekly Consultation Slots</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B172A] border border-white/10 space-y-1">
                    <span className="text-[#D4AF37] text-[10px] block font-bold">03 COMPETITION</span>
                    <span className="font-bold text-white block">Uncaptured Search Demand</span>
                    <span className="text-[10px] text-slate-300">14 Key Specialty Terms</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B172A] border border-[#C5A059]/40 space-y-1">
                    <span className="text-[#D4AF37] text-[10px] block font-bold">04 UNIT ROI</span>
                    <span className="font-bold text-emerald-400 block">4.2x LTV Return</span>
                    <span className="text-[10px] text-amber-300">Predictable Growth Engine</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CAPABILITY 2: BRAND POSITIONING                               */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'brand-positioning' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-10 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                  Clinical Trust Architecture
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Brand Positioning & Clinical Authority
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  Patients don't buy healthcare marketing—they choose clinical authority. We engineer high-trust brand architecture, doctor credentialing portals, and empathetic care pathways that eliminate patient anxiety before consultation.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#050B18] border border-white/10 flex items-start gap-3 text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white">Doctor Authority Profiles</span>
                      <span className="text-slate-300">Showcases specialist credentials, clinical distinctions, and patient success stories.</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#050B18] border border-white/10 flex items-start gap-3 text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white">Verified Reputation Architecture</span>
                      <span className="text-slate-300">Systematic patient review collection and clinical outcome showcases.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#050B18] text-white flex items-center justify-between border border-[#C5A059]/40">
                  <span className="text-xs font-mono font-bold uppercase text-[#D4AF37]">Business Outcome:</span>
                  <span className="text-xs font-bold text-white">2.4x Higher Consultation Acceptance Rate</span>
                </div>
              </div>

              {/* Visual: Asymmetric Authority Card */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#050B18] text-white border border-[#C5A059]/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-white">DOCTOR AUTHORITY SHOWCASE</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">Verified Specialist</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B172A] border border-white/10 flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80"
                    alt="Doctor Specialist Profile"
                    className="w-16 h-16 rounded-xl object-cover border border-[#C5A059]/40 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">Senior Clinical Director</h4>
                    <p className="text-xs text-amber-300 font-mono mt-0.5">Specialist Fellow • 18+ Yrs Experience</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-2">
                      <span className="bg-[#050B18] px-2 py-0.5 rounded border border-white/10">4,500+ Procedures</span>
                      <span className="bg-[#050B18] px-2 py-0.5 rounded border border-white/10">99.4% Trust Rating</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <div className="p-3 rounded-lg bg-[#0B172A] border border-white/10 text-center">
                    <span className="text-amber-300 font-bold block text-sm">4.9 / 5.0</span>
                    <span className="text-[10px] text-slate-300">Patient Reputation Index</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B172A] border border-white/10 text-center">
                    <span className="text-emerald-400 font-bold block text-sm">Top 1%</span>
                    <span className="text-[10px] text-slate-300">Regional Authority Ranking</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CAPABILITY 3: CONVERSION-FOCUSED WEBSITES                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'conversion-websites' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-10 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                  High-Converting Web Architecture
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Conversion-Focused Websites
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  Digital web experiences designed to build patient trust, simplify the patient journey, and turn more qualified visitors into confirmed consultation enquiries.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#050B18] border border-white/10 text-xs text-white flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Sub-second load speed with 95+ Core Web Vitals</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050B18] border border-white/10 text-xs text-white flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Interactive slot reservation & WhatsApp holds</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#050B18] text-white flex items-center justify-between border border-[#C5A059]/40">
                  <span className="text-xs font-mono font-bold uppercase text-[#D4AF37]">Business Outcome:</span>
                  <span className="text-xs font-bold text-white">+185% Patient Conversion Rate</span>
                </div>
              </div>

              {/* REQUIREMENT #9: Interactive Browser / Device Mockup */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-[#050B18] border border-[#C5A059]/40 shadow-2xl overflow-hidden">
                  
                  {/* Browser Bar */}
                  <div className="px-4 py-3 bg-[#0B172A] border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <div className="bg-[#050B18] px-4 py-1 rounded-full text-[10px] font-mono text-slate-300 border border-white/10 flex items-center gap-1.5">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                      <span>https://stjude-specialtyclinic.org/consultation</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      ⚡ 0.28s Load
                    </span>
                  </div>

                  {/* Browser Content Area */}
                  <div className="p-5 text-white space-y-4 bg-[#050B18]">
                    
                    {/* Simulated Page Navigation Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                      <div className="font-bold font-display text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        <span>ST. JUDE HEALTHCARE</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-300">
                        <button onClick={() => setActivePage('home')} className={`hover:text-white cursor-pointer ${activePage === 'home' ? 'text-[#D4AF37] font-bold underline' : ''}`}>Specialties</button>
                        <button onClick={() => setActivePage('specialist')} className={`hover:text-white cursor-pointer ${activePage === 'specialist' ? 'text-[#D4AF37] font-bold underline' : ''}`}>Doctors</button>
                        <button onClick={() => setActivePage('booking')} className={`hover:text-white cursor-pointer ${activePage === 'booking' ? 'text-[#D4AF37] font-bold underline' : ''}`}>Book Consultation</button>
                      </div>
                    </div>

                    {/* Page View: Home / Doctors / Booking */}
                    {activePage === 'home' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[#0B172A] border border-[#C5A059]/30 space-y-2">
                          <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">REGIONAL CENTER OF EXCELLENCE</span>
                          <h4 className="text-base font-bold text-white">Leading Specialty Care & Advanced Consultations</h4>
                          <p className="text-xs text-slate-300">Verified doctor expertise, transparent care pathways, and immediate booking.</p>
                          
                          {/* Animated Appointment CTA Highlight */}
                          <div className="pt-2">
                            <motion.button 
                              onClick={() => setActivePage('booking')}
                              whileHover={{ scale: 1.02 }}
                              animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 15px rgba(212,175,55,0.6)", "0 0 0px rgba(212,175,55,0)"] }}
                              transition={{ duration: 2.5, repeat: Infinity }}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#0A192F] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Reserve Specialty Consultation</span>
                            </motion.button>
                          </div>
                        </div>

                        {/* Patient Journey Indicators */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                          <div className="p-2 rounded bg-[#0B172A] border border-white/5">
                            <span className="text-emerald-400 font-bold block">STEP 1</span>
                            <span className="text-slate-300">Select Specialty</span>
                          </div>
                          <div className="p-2 rounded bg-[#0B172A] border border-white/5">
                            <span className="text-emerald-400 font-bold block">STEP 2</span>
                            <span className="text-slate-300">Choose Doctor</span>
                          </div>
                          <div className="p-2 rounded bg-[#0B172A] border border-white/5">
                            <span className="text-emerald-400 font-bold block">STEP 3</span>
                            <span className="text-slate-300">Instant Hold</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePage === 'booking' && (
                      <div className="p-4 rounded-xl bg-[#0B172A] border border-[#C5A059]/40 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-[#D4AF37]">
                          <span>INTERACTIVE SLOT SCHEDULER</span>
                          <span>STEP {bookingStep} OF 2</span>
                        </div>
                        {bookingStep === 1 ? (
                          <div className="space-y-3 text-xs">
                            <div className="p-2.5 rounded bg-[#050B18] border border-white/10 flex items-center justify-between">
                              <span className="text-slate-200">Doctor: Dr. A. Vance, Cardiology</span>
                              <span className="text-emerald-400 font-bold font-mono">Available Today</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <button onClick={() => setBookingStep(2)} className="p-2 rounded bg-[#1877F2]/30 border border-[#C5A059]/40 text-center font-mono text-xs font-bold text-white hover:bg-[#1877F2] cursor-pointer">02:30 PM</button>
                              <button onClick={() => setBookingStep(2)} className="p-2 rounded bg-[#050B18] border border-white/10 text-center font-mono text-xs text-slate-300 hover:border-white/30 cursor-pointer">04:00 PM</button>
                              <button onClick={() => setBookingStep(2)} className="p-2 rounded bg-[#050B18] border border-white/10 text-center font-mono text-xs text-slate-300 hover:border-white/30 cursor-pointer">05:15 PM</button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                            <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                            <div className="text-xs font-bold text-white">Consultation Slot Hold Confirmed!</div>
                            <p className="text-[10px] text-emerald-300 font-mono">Instant WhatsApp confirmation dispatched.</p>
                            <button onClick={() => { setBookingStep(1); setActivePage('home'); }} className="text-[10px] text-slate-400 underline cursor-pointer">Reset Preview</button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CAPABILITY 4: AI-POWERED BUSINESS SYSTEMS                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'ai-systems' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-10 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                  24/7 Enquiry Qualification Engine
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  AI-Powered Business Systems
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  Living workflow that captures, qualifies, and follows up with patient enquiries in sub-60 seconds.
                </p>

                {/* Requirement #10 Notice */}
                <div className="p-3.5 rounded-xl bg-[#050B18] border border-[#C5A059]/30 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-[#D4AF37] block">Operational Scope Clarity:</span>
                  <p className="italic text-[11px] text-slate-300">
                    Automates administrative intake & appointment scheduling. Zero clinical diagnosis or medical decision-making.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#050B18] text-white flex items-center justify-between border border-[#C5A059]/40">
                  <span className="text-xs font-mono font-bold uppercase text-[#D4AF37]">Business Outcome:</span>
                  <span className="text-xs font-bold text-white">&lt; 60s Response & Zero Lead Leakage</span>
                </div>
              </div>

              {/* REQUIREMENT #10: Living Workflow */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#050B18] text-white border border-[#C5A059]/40 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-white uppercase font-mono">LIVING WORKFLOW ENGINE</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">Active Automation</span>
                </div>

                {/* Workflow Nodes: Healthcare Blue for Activity, Gold for Transitions */}
                <div className="space-y-2.5 text-xs font-mono">
                  {[
                    { title: "1. Patient Enquiry", desc: "Web form / WhatsApp message", color: "#1877F2" },
                    { title: "2. AI-Assisted Qualification", desc: "Treatment fit & catchment screening", color: "#1877F2" },
                    { title: "3. Follow-up", desc: "< 60s automated WhatsApp / SMS response", color: "#C5A059" },
                    { title: "4. Appointment", desc: "Specialty slot reservation hold", color: "#1877F2" },
                    { title: "5. CRM Integration", desc: "Sync to front-desk schedule", color: "#1877F2" },
                    { title: "6. Measurement", desc: "Closed-loop Healthcare Growth Index™", color: "#D4AF37" }
                  ].map((node, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 5 }}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        workflowNode === idx 
                          ? 'bg-[#1877F2]/30 border-[#D4AF37] shadow-lg text-white' 
                          : 'bg-[#0B172A] border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                          style={{ backgroundColor: node.color }} 
                        />
                        <div>
                          <div className="font-bold text-white">{node.title}</div>
                          <div className="text-[10px] text-slate-300">{node.desc}</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#050B18] font-mono text-amber-300 border border-white/10">
                        {node.color === '#C5A059' || node.color === '#D4AF37' ? 'Transition' : 'System'}
                      </span>
                    </motion.div>
                  ))}
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CAPABILITY 5: PERFORMANCE MARKETING                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'performance-marketing' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-10 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                  Demand Generation & Patient Acquisition
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Performance Marketing
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  Data-driven acquisition campaigns across Google Search, Maps, and Meta targeting treatment-seeking households in your catchment zone.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#050B18] border border-white/10 text-xs text-white flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Dominant placement for high-value treatment keywords</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#050B18] text-white flex items-center justify-between border border-[#C5A059]/40">
                  <span className="text-xs font-mono font-bold uppercase text-[#D4AF37]">Business Outcome:</span>
                  <span className="text-xs font-bold text-white">Predictable Patient Enquiry Stream</span>
                </div>
              </div>

              {/* REQUIREMENT #11: Executive Growth Dashboard */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#050B18] text-white border border-[#C5A059]/40 shadow-2xl space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-white">EXECUTIVE GROWTH DASHBOARD</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setTimeRange('month')} className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${timeRange === 'month' ? 'bg-[#D4AF37] text-[#050B18] font-bold' : 'bg-[#0B172A] text-slate-300'}`}>30 Days</button>
                    <button onClick={() => setTimeRange('quarter')} className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${timeRange === 'quarter' ? 'bg-[#D4AF37] text-[#050B18] font-bold' : 'bg-[#0B172A] text-slate-300'}`}>90 Days</button>
                  </div>
                </div>

                {/* Reach → Qualified Enquiries → Appointments → Growth KPI Funnel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#0B172A] border border-white/10">
                    <span className="text-slate-300 text-[10px] block">REACH</span>
                    <span className="text-base font-bold text-white mt-0.5 block">{timeRange === 'month' ? '128,400' : '385,000'}</span>
                    <span className="text-[9px] text-emerald-400">Target Radius</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B172A] border border-white/10">
                    <span className="text-slate-300 text-[10px] block">ENQUIRIES</span>
                    <span className="text-base font-bold text-[#D4AF37] mt-0.5 block">{timeRange === 'month' ? '412' : '1,240'}</span>
                    <span className="text-[9px] text-emerald-400">High-Intent</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B172A] border border-white/10">
                    <span className="text-slate-300 text-[10px] block">APPOINTMENTS</span>
                    <span className="text-base font-bold text-white mt-0.5 block">{timeRange === 'month' ? '284' : '850'}</span>
                    <span className="text-[9px] text-emerald-400">Confirmed</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B172A] border border-[#C5A059]/40">
                    <span className="text-[#D4AF37] text-[10px] block">GROWTH</span>
                    <span className="text-base font-bold text-emerald-400 mt-0.5 block">{timeRange === 'month' ? '+38%' : '+44%'}</span>
                    <span className="text-[9px] text-amber-300">Net Revenue Lift</span>
                  </div>
                </div>

                {/* Animated Chart SVG Line */}
                <div className="p-4 rounded-xl bg-[#0B172A] border border-white/10 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-300">
                    <span>Patient Consultation Growth Trend</span>
                    <span className="text-emerald-400 font-bold">↑ 4.2x ROI</span>
                  </div>
                  <div className="h-16 w-full">
                    <svg className="w-full h-full" viewBox="0 0 300 50">
                      <motion.path
                        d="M 0 45 C 50 40, 100 30, 150 20 C 200 15, 250 8, 300 2"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </svg>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
