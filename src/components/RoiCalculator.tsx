import React, { useState } from 'react';
import { IndustryType } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  HeartPulse, 
  Palmtree, 
  ArrowRight,
  Sparkles,
  Calculator
} from 'lucide-react';

interface CalculatorProps {
  initialIndustry: IndustryType;
  onOpenAuditModal: () => void;
}

export const RoiCalculator: React.FC<CalculatorProps> = ({
  initialIndustry,
  onOpenAuditModal
}) => {
  const [industry, setIndustry] = useState<IndustryType>(initialIndustry);
  
  // Healthcare defaults vs Wedding Venue defaults (in INR Lakhs or thousands)
  const [monthlyInquiries, setMonthlyInquiries] = useState<number>(
    initialIndustry === 'healthcare' ? 150 : 50
  );
  const [averageValue, setAverageValue] = useState<number>(
    initialIndustry === 'healthcare' ? 120000 : 800000
  );
  const [currentConversionRate, setCurrentConversionRate] = useState<number>(8);

  // Switch defaults when industry changes
  const handleIndustryChange = (ind: IndustryType) => {
    setIndustry(ind);
    if (ind === 'healthcare') {
      setMonthlyInquiries(150);
      setAverageValue(120000);
      setCurrentConversionRate(8);
    } else {
      setMonthlyInquiries(50);
      setAverageValue(800000);
      setCurrentConversionRate(10);
    }
  };

  // Calculations
  const currentMonthlyConversions = Math.round((monthlyInquiries * currentConversionRate) / 100);
  const currentMonthlyRevenue = currentMonthlyConversions * averageValue;
  const currentAnnualRevenue = currentMonthlyRevenue * 12;

  // MK Digitalverse Projected Lift:
  // Pre-qualification & conversion optimization increases effective conversion by ~1.65x
  const projectedConversionRate = Math.min(Math.round(currentConversionRate * 1.65 * 10) / 10, 35);
  const projectedMonthlyConversions = Math.round((monthlyInquiries * projectedConversionRate) / 100);
  const projectedMonthlyRevenue = projectedMonthlyConversions * averageValue;
  const projectedAnnualRevenue = projectedMonthlyRevenue * 12;

  const annualRevenueGrowth = projectedAnnualRevenue - currentAnnualRevenue;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <section id="roi-calculator" className="py-20 md:py-28 bg-[#050505] relative border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive ROI Projection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Calculate Your Projected Revenue Lift
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300">
            Compare the revenue impact of deploying an integrated MK Digitalverse growth system against ad-hoc agency marketing.
          </p>
        </div>

        {/* Main Calculator Box */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/10 shadow-2xl bg-[#09090b]">
          
          {/* Industry Selector */}
          <div className="flex justify-center mb-8">
            <div className="p-1.5 rounded-2xl bg-zinc-950 border border-white/10 inline-flex items-center gap-2">
              <button
                onClick={() => handleIndustryChange('healthcare')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  industry === 'healthcare'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span>Healthcare Growth Model</span>
              </button>

              <button
                onClick={() => handleIndustryChange('wedding_venues')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  industry === 'wedding_venues'
                    ? 'bg-emerald-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Palmtree className="w-4 h-4" />
                <span>Luxury Venue Model</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Inputs Controls */}
            <div className="lg:col-span-6 space-y-8 bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-white/10">
              
              {/* Slider 1: Monthly Inquiries */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-zinc-200">
                    {industry === 'healthcare' ? 'Monthly Patient Inquiries' : 'Monthly Venue Inquiries'}
                  </label>
                  <span className="font-bold text-amber-400 text-base">
                    {monthlyInquiries.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={1000}
                  step={10}
                  value={monthlyInquiries}
                  onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Slider 2: Average Value */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-zinc-200">
                    {industry === 'healthcare' ? 'Avg Patient Lifetime / Case Value' : 'Avg Booking Contract Value'}
                  </label>
                  <span className="font-bold text-emerald-400 text-base">
                    {formatCurrency(averageValue)}
                  </span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={2500000}
                  step={20000}
                  value={averageValue}
                  onChange={(e) => setAverageValue(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slider 3: Current Conversion Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-zinc-200">
                    Current Lead-to-Customer Conversion Rate
                  </label>
                  <span className="font-bold text-zinc-300 text-base">
                    {currentConversionRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={currentConversionRate}
                  onChange={(e) => setCurrentConversionRate(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                />
              </div>

            </div>

            {/* Right Output Projections Card */}
            <div className="lg:col-span-6 bg-zinc-950 p-8 rounded-2xl border border-white/10 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Projected MK Digitalverse Annual Revenue Lift
                </span>
                <h3 className="text-3xl font-display font-extrabold text-white">
                  +{formatCurrency(annualRevenueGrowth)}
                </h3>
                <span className="text-xs text-zinc-400">
                  Estimated Additional Annual Revenue Growth
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase block">Current Baseline</span>
                  <div className="text-base font-bold text-zinc-300 mt-1">
                    {formatCurrency(currentAnnualRevenue)}
                  </div>
                  <span className="text-[10px] text-zinc-500">Annual Revenue</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase block">MK Partner Engine</span>
                  <div className="text-base font-bold text-emerald-300 mt-1">
                    {formatCurrency(projectedAnnualRevenue)}
                  </div>
                  <span className="text-[10px] text-emerald-400/80">Projected Annual</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-300">Conversion Rate Benchmark</span>
                <span className="text-amber-400 font-bold">{currentConversionRate}% → {projectedConversionRate}%</span>
              </div>

              <button
                onClick={onOpenAuditModal}
                className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book Discovery Call & Claim Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
