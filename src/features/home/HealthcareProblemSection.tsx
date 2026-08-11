import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Zap, 
  Sparkles,
  RefreshCw,
  Layers,
  ArrowDown
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProblemSectionProps {
  onOpenAuditModal: () => void;
}

export const HealthcareProblemSection: React.FC<ProblemSectionProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<'disconnected' | 'integrated'>('integrated');

  const disconnectedSteps = [
    { label: "Marketing", status: "Isolated Ad Spend", gap: "No catchment verification" },
    { label: "Website", status: "Static Template", gap: "High drop-off, no doctor authority" },
    { label: "Leads", status: "Unqualified Calls", gap: "Mixed intent, missed phone calls" },
    { label: "Follow-up", status: "Manual & Delayed", gap: "40%+ lead drop-off after hours" },
    { label: "Appointments", status: "Unpredictable Pipeline", gap: "High no-show rates" }
  ];

  const integratedSteps = [
    { label: "Strategy", detail: "Clinical Capacity & Unit Economics", highlight: "#C5A059" },
    { label: "Brand", detail: "Doctor Authority & High Trust", highlight: "#1E3A8A" },
    { label: "Website", detail: "Sub-second Web Conversion Platform", highlight: "#1877F2" },
    { label: "Acquisition", detail: "High-Intent Geo-Search & Catchment Ads", highlight: "#C5A059" },
    { label: "AI Systems", detail: "24/7 Sub-60s Qualification & Nurture", highlight: "#1877F2" },
    { label: "Measurement", detail: "Closed-Loop Healthcare Growth Index™", highlight: "#D4AF37" }
  ];

  return (
    <section id="growth-problem" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      
      {/* Background Subtle Grid */}
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
            <AlertTriangle className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Root Cause Diagnosis</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            The Healthcare Growth Challenge:{' '}
            <span className="gold-text-gradient">Why Traditional Marketing Fails.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Most healthcare organizations don't fail due to lack of clinical expertise. They plateau because their acquisition infrastructure is fragmented, slow, and disconnected.
          </p>

          {/* Feature Image Section directly below heading */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#050B18]">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80"
                alt="Healthcare Growth Challenge and Medical Data Diagnostics"
                referrerPolicy="no-referrer"
                className="w-full h-[220px] sm:h-[300px] object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold text-[#D4AF37] uppercase font-mono">Systemic Friction Diagnosis</span>
                  <span className="text-slate-300 hidden sm:inline">• Traditional Marketing vs Integrated Intake</span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  Critical Growth Bottleneck
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editorial Split Layout: Problem Statement + Interactive Comparison System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          
          {/* Left: Editorial Narrative & Diagnosis */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-6 rounded-2xl bg-[#0B172A]/90 border border-[#C5A059]/30 shadow-2xl space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-[#050B18] text-[#D4AF37] border border-[#C5A059]/40 flex items-center justify-center font-bold shadow-md">
                <Activity className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-display font-bold text-white">
                Systemic Friction vs. Seamless Growth Architecture
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                When marketing agencies manage ads in isolation, website forms sit on static WordPress themes, and front-desk staff manually handle enquiries hours later—patients drop off at every gap.
              </p>

              <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 text-xs space-y-2">
                <div className="font-bold text-[#D4AF37] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>The MK Digitalverse Rule:</span>
                </div>
                <p className="text-slate-300 italic">
                  "Fixing ads alone cannot heal an unintegrated intake pipeline. You must connect the entire patient acquisition system."
                </p>
              </div>

              {/* View Switcher Controls */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('disconnected')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'disconnected'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'bg-[#050B18] text-slate-300 border border-white/10 hover:border-[#C5A059]/30'
                  }`}
                >
                  Disconnected Activity
                </button>
                <button
                  onClick={() => setActiveTab('integrated')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'integrated'
                      ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-sm'
                      : 'bg-[#050B18] text-slate-300 border border-white/10 hover:border-[#C5A059]/30'
                  }`}
                >
                  Integrated System
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Animated Visual Comparison Diagram */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0A192F] text-white border border-[#C5A059]/40 shadow-2xl relative overflow-hidden">
              
              {/* Header Indicator */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${activeTab === 'disconnected' ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    {activeTab === 'disconnected' ? 'DISCONNECTED ACTIVITY' : 'INTEGRATED GROWTH SYSTEM™'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-white/10">
                  {activeTab === 'disconnected' ? '5 Fragmented Silos' : '6 Interconnected Layers'}
                </span>
              </div>

              {/* Dynamic View: Disconnected vs Integrated */}
              {activeTab === 'disconnected' ? (
                <div className="py-6 space-y-4">
                  <p className="text-xs text-rose-300 font-mono">
                    ⚠️ System Gaps Visible: Data and patients lost between steps.
                  </p>

                  <div className="space-y-3">
                    {disconnectedSteps.map((step, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative"
                      >
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                              0{idx + 1}. {step.label}
                            </div>
                            <div className="text-xs text-rose-200 mt-0.5">
                              {step.status}
                            </div>
                          </div>
                        </div>

                        <div className="px-3 py-1 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30 self-start sm:self-center">
                          GAP: {step.gap}
                        </div>

                        {/* Broken Connector Line */}
                        {idx < disconnectedSteps.length - 1 && (
                          <div className="hidden sm:block absolute -bottom-3.5 left-6 text-rose-500 font-mono text-xs z-10">
                            ✕ [Connection Broken]
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  <p className="text-xs text-emerald-400 font-mono">
                    ✓ Continuous Automated Workflow: Sub-60s patient intake & high-trust care pathways.
                  </p>

                  {/* Connected Nodes Workflow */}
                  <div className="relative space-y-3">
                    
                    {/* Flowing Gold Line Background Accent */}
                    <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-gradient-to-b from-[#C5A059] via-[#1877F2] to-[#D4AF37] pointer-events-none" />

                    {integratedSteps.map((step, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.09 }}
                        className="p-4 rounded-2xl bg-slate-900/90 border border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative ml-2 pl-10 group hover:border-[#D4AF37] transition-all"
                      >
                        {/* Connected Node Bullet */}
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0A192F] border-2 border-[#D4AF37] flex items-center justify-center shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>

                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono flex items-center gap-2">
                              <span>Step 0{idx + 1}</span>
                              <span className="text-white">•</span>
                              <span className="text-white">{step.label}</span>
                            </div>
                            <div className="text-xs text-slate-300 mt-0.5 font-medium">
                              {step.detail}
                            </div>
                          </div>
                        </div>

                        <div className="px-3 py-1 rounded bg-[#1877F2]/20 text-[#60A5FA] text-[10px] font-mono font-bold border border-[#1877F2]/40 flex items-center gap-1 self-start sm:self-center">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>System Connected</span>
                        </div>
                      </motion.div>
                    ))}

                  </div>
                </div>
              )}

              {/* Bottom System Banner */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-300">
                  {activeTab === 'disconnected' ? 'Fragmented marketing creates friction.' : 'The integrated system aligns strategy, brand, web, AI & ROI.'}
                </span>
                <button
                  onClick={onOpenAuditModal}
                  className="btn-gold-primary px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shrink-0"
                >
                  Book Discovery Call
                </button>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
