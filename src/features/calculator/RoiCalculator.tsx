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
    <section id="roi-calculator" className="py-20 md:py-28 bg-[#050505] relative border-b border-white/10 overflow-hidden">
      
      {/* Background Glow Ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Healthcare Growth Assessment</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Patient Growth Opportunity Calculator
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            Estimate your uncaptured patient revenue potential and identify intake bottlenecks across your practice or clinical network.
          </p>
        </div>

        {/* Calculator Main Glass Panel */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/15 shadow-2xl bg-[#09090b] relative overflow-hidden">
          
          {/* Top Bar: Action & Model Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Healthcare Growth System™ Calculator</span>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset to default benchmark values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Baseline</span>
              </button>

              <span className="text-[11px] font-mono font-bold text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">
                Model: Clinical Triage v1.8
              </span>
            </div>
          </div>

          {/* Interactive Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Inputs Column */}
            <div className="lg:col-span-6 space-y-7 bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-white/10">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Step 1: Input Baseline Practice Metrics</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">Live Simulation</span>
              </div>

              {/* Healthcare Tailored Sliders */}
              <div className="space-y-6">
                {/* Slider 1: Monthly Patient Enquiries */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Monthly Patient Enquiries</span>
                    </label>
                    <span className="font-bold text-amber-400 font-mono text-sm">
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
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>20 / mo</span>
                    <span>500 / mo</span>
                    <span>1,000 / mo</span>
                  </div>
                </div>

                {/* Slider 2: Conversion Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>Current Consultation Booking Rate</span>
                    </label>
                    <span className="font-bold text-zinc-300 font-mono text-sm">
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
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>2% (Low Intake)</span>
                    <span>10% (Average)</span>
                    <span>25% (High)</span>
                  </div>
                </div>

                {/* Slider 3: Average Case / Treatment Value */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Average Treatment / Case Value</span>
                    </label>
                    <span className="font-bold text-emerald-400 font-mono text-sm">
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
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>₹20,000</span>
                    <span>₹10 Lakhs</span>
                    <span>₹25 Lakhs</span>
                  </div>
                </div>

                {/* Slider 4: Patient Repeat Multiplier */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Patient LTV / Care Cycle Multiplier</span>
                    </label>
                    <span className="font-bold text-cyan-400 font-mono text-sm">
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
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>1.0x (Single Visit)</span>
                    <span>1.5x (Recurring)</span>
                    <span>2.0x (High LTV)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-start gap-2.5 text-[11px] text-zinc-400">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Adjusting these parameters recalculates estimated uncaptured patient appointments and potential revenue expansion in real time.
                </span>
              </div>

            </div>

            {/* Right Output & Strategic Insights Card */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Primary Growth Metric Highlight Card */}
              <div className="bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Estimated Annual Growth Potential</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-mono text-[10px] font-bold">
                    +{opportunityData.conversionLiftPercentage}% Efficiency
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                    +{formatINR(opportunityData.annualRevenueGrowth)}
                  </div>
                  <span className="text-xs text-zinc-400 block mt-1">
                    Potential Uncaptured Annual Patient Revenue Opportunity
                  </span>
                </div>

                {/* Comparative Metric Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Current Baseline</span>
                    <div className="text-sm font-bold text-zinc-200">
                      {formatINR(opportunityData.currentAnnualRevenue)}
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {opportunityData.currentAnnualConversions} appointments / yr
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block">Optimized Intake</span>
                    <div className="text-sm font-bold text-emerald-300">
                      {formatINR(opportunityData.projectedAnnualRevenue)}
                    </div>
                    <span className="text-[10px] text-emerald-400/80">
                      {opportunityData.projectedAnnualConversions} appointments / yr
                    </span>
                  </div>
                </div>

                {/* Conversion Rate Benchmark Bar */}
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-300">Intake Conversion Efficiency:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {hcInputs.conversionRate}% → {opportunityData.projectedConversionRate}%
                  </span>
                </div>

                {/* STRATEGIC INTERPRETATION CARD */}
                <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Strategic Growth Diagnosis:</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {opportunityData.interpretationText}
                  </p>
                </div>

                {/* Action CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={onOpenAuditModal}
                    className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer bg-amber-400 text-black hover:bg-amber-300"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      Request a Healthcare Growth Audit™
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onOpenAuditModal}
                    className="w-full py-3 rounded-xl bg-zinc-900 text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 hover:text-white transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book a Discovery Call</span>
                  </button>
                </div>

              </div>

              {/* Disclaimer Notice */}
              <div className="text-[11px] text-zinc-500 font-mono text-center leading-relaxed">
                * Note: Estimates are based on aggregated benchmarks from 50+ client audits across India. Actual revenue expansion depends on practice specialty, local market positioning, and intake execution.
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

