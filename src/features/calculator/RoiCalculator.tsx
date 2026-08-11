import React, { useState } from 'react';
import { 
  calculateHealthcareOpportunity, 
  formatINR, 
  HealthcareInputs
} from '../../lib/calculations/growthOpportunity';
import { 
  HeartPulse, 
  ArrowRight, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle, 
  RotateCcw, 
  BarChart3, 
  Users, 
  AlertCircle
} from 'lucide-react';

interface CalculatorProps {
  onOpenAuditModal: () => void;
}

export const RoiCalculator: React.FC<CalculatorProps> = ({
  onOpenAuditModal
}) => {
  // Healthcare Inputs State
  const [hcInputs, setHcInputs] = useState<HealthcareInputs>({
    monthlyInquiries: 150,
    conversionRate: 8,
    averageCaseValue: 120000,
    repeatMultiplier: 1.2
  });

  // Reset to default baseline values
  const handleReset = () => {
    setHcInputs({
      monthlyInquiries: 150,
      conversionRate: 8,
      averageCaseValue: 120000,
      repeatMultiplier: 1.2
    });
  };

  // Perform Calculation using external calculation module
  const opportunityData = calculateHealthcareOpportunity(hcInputs);

  return (
    <section id="roi-calculator" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest mb-4 shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Interactive Healthcare Growth Assessment</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight">
            Patient Growth <span className="gold-text-gradient">Opportunity Calculator</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Estimate your uncaptured patient revenue potential and identify intake bottlenecks across your practice or clinical network.
          </p>

          {/* Feature Image Section directly below heading */}
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#050B18]">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                alt="Interactive Clinical Revenue Forecasting and Patient Growth Opportunity Simulator"
                referrerPolicy="no-referrer"
                className="w-full h-[220px] sm:h-[280px] object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="font-bold text-[#D4AF37] uppercase font-mono">Patient Intake Volume Simulation</span>
                  <span className="text-slate-300 hidden sm:inline">• Live Revenue Lift Modeling</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  Interactive Simulator v1.8
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Main Panel */}
        <div className="rounded-2xl p-6 sm:p-10 border border-[#C5A059]/40 shadow-2xl bg-[#0B172A] relative overflow-hidden">
          
          {/* Top Bar: Action & Model Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm font-bold text-white uppercase tracking-wider font-display">Healthcare Growth System™ Calculator</span>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-[#050B18] hover:bg-[#0F203C] text-slate-200 border border-[#C5A059]/40 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset to default benchmark values"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Reset Baseline</span>
              </button>

              <span className="text-[11px] font-mono font-bold text-[#D4AF37] bg-[#050B18] px-3 py-1.5 rounded-lg border border-[#C5A059]/40">
                Model: Clinical Triage v1.8
              </span>
            </div>
          </div>

          {/* Interactive Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Inputs Column */}
            <div className="lg:col-span-6 space-y-7 bg-[#050B18] p-6 sm:p-8 rounded-2xl border border-[#C5A059]/30">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-display">
                  <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Step 1: Input Baseline Practice Metrics</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Live Simulation</span>
              </div>

              {/* Healthcare Tailored Sliders */}
              <div className="space-y-6">
                {/* Slider 1: Monthly Patient Enquiries */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Monthly Patient Enquiries</span>
                    </label>
                    <span className="font-bold text-[#D4AF37] font-mono text-sm">
                      {hcInputs.monthlyInquiries.toLocaleString()} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={1000}
                    step={10}
                    value={hcInputs.monthlyInquiries}
                    onChange={(e) => setHcInputs({ ...hcInputs, monthlyInquiries: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>20 / mo</span>
                    <span>500 / mo</span>
                    <span>1,000 / mo</span>
                  </div>
                </div>

                {/* Slider 2: Conversion Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-white flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Current Consultation Booking Rate</span>
                    </label>
                    <span className="font-bold text-[#D4AF37] font-mono text-sm">
                      {hcInputs.conversionRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={25}
                    step={1}
                    value={hcInputs.conversionRate}
                    onChange={(e) => setHcInputs({ ...hcInputs, conversionRate: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>2% (Low Intake)</span>
                    <span>10% (Average)</span>
                    <span>25% (High)</span>
                  </div>
                </div>

                {/* Slider 3: Average Case / Treatment Value */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-white flex items-center gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Average Treatment / Case Value</span>
                    </label>
                    <span className="font-bold text-[#D4AF37] font-mono text-sm">
                      {formatINR(hcInputs.averageCaseValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={2500000}
                    step={20000}
                    value={hcInputs.averageCaseValue}
                    onChange={(e) => setHcInputs({ ...hcInputs, averageCaseValue: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>₹20,000</span>
                    <span>₹10 Lakhs</span>
                    <span>₹25 Lakhs</span>
                  </div>
                </div>

                {/* Slider 4: Patient Repeat Multiplier */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Patient LTV / Care Cycle Multiplier</span>
                    </label>
                    <span className="font-bold text-[#D4AF37] font-mono text-sm">
                      {hcInputs.repeatMultiplier}x LTV
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={2.0}
                    step={0.1}
                    value={hcInputs.repeatMultiplier}
                    onChange={(e) => setHcInputs({ ...hcInputs, repeatMultiplier: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>1.0x (Single Visit)</span>
                    <span>1.5x (Recurring)</span>
                    <span>2.0x (High LTV)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B172A] border border-[#C5A059]/30 flex items-start gap-2.5 text-[11px] text-slate-300 shadow-sm">
                <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  Adjusting these parameters recalculates estimated uncaptured patient appointments and potential revenue expansion in real time.
                </span>
              </div>

            </div>

            {/* Right Output & Strategic Insights Card */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Primary Growth Metric Highlight Card */}
              <div className="bg-[#050B18] p-6 sm:p-8 rounded-2xl border border-[#C5A059]/40 space-y-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 font-display">
                    <TrendingUp className="w-4 h-4" />
                    <span>Estimated Annual Growth Potential</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0B172A] text-[#D4AF37] border border-[#C5A059]/40 font-mono text-[10px] font-bold">
                    +{opportunityData.conversionLiftPercentage}% Efficiency
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                    +{formatINR(opportunityData.annualRevenueGrowth)}
                  </div>
                  <span className="text-xs text-slate-300 block mt-1">
                    Potential Uncaptured Annual Patient Revenue Opportunity
                  </span>
                </div>

                {/* Comparative Metric Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#0B172A] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Baseline</span>
                    <div className="text-sm font-bold text-white">
                      {formatINR(opportunityData.currentAnnualRevenue)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {opportunityData.currentAnnualConversions} appointments / yr
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B172A] border border-[#C5A059]/40 space-y-1">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">Optimized Intake</span>
                    <div className="text-sm font-bold text-white">
                      {formatINR(opportunityData.projectedAnnualRevenue)}
                    </div>
                    <span className="text-[10px] text-[#D4AF37]">
                      {opportunityData.projectedAnnualConversions} appointments / yr
                    </span>
                  </div>
                </div>

                {/* Conversion Rate Benchmark Bar */}
                <div className="p-3.5 rounded-xl bg-[#0B172A] border border-white/10 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Intake Conversion Efficiency:</span>
                  <span className="text-[#D4AF37] font-mono font-bold">
                    {hcInputs.conversionRate}% → {opportunityData.projectedConversionRate}%
                  </span>
                </div>

                {/* STRATEGIC INTERPRETATION CARD */}
                <div className="p-4 rounded-xl bg-[#0B172A] border border-[#C5A059]/30 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-display">
                    <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span>Strategic Growth Diagnosis:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {opportunityData.interpretationText}
                  </p>
                </div>

                {/* Action CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={onOpenAuditModal}
                    className="btn-gold-primary w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#0A192F]" />
                    <span>
                      Request Healthcare Growth Audit™
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#0A192F]" />
                  </button>

                  <button
                    onClick={onOpenAuditModal}
                    className="w-full py-3 rounded-xl bg-[#0B172A] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#0F203C] transition-all border border-[#C5A059]/40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book a Strategic Discovery Call</span>
                  </button>
                </div>

              </div>

              {/* Disclaimer Notice */}
              <div className="text-[11px] text-slate-400 font-mono text-center leading-relaxed">
                * Note: Estimates are based on aggregated benchmarks from 50+ client audits across India. Actual revenue expansion depends on practice specialty, local market positioning, and intake execution.
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
