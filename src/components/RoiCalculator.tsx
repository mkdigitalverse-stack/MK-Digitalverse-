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
  
  // Healthcare defaults vs Wedding Venue defaults
  const [monthlyInquiries, setMonthlyInquiries] = useState<number>(
    initialIndustry === 'healthcare' ? 120 : 45
  );
  const [averageValue, setAverageValue] = useState<number>(
    initialIndustry === 'healthcare' ? 2500 : 12000
  );
  const [currentConversionRate, setCurrentConversionRate] = useState<number>(8);

  // Switch defaults when industry changes
  const handleIndustryChange = (ind: IndustryType) => {
    setIndustry(ind);
    if (ind === 'healthcare') {
      setMonthlyInquiries(120);
      setAverageValue(2500);
      setCurrentConversionRate(8);
    } else {
      setMonthlyInquiries(45);
      setAverageValue(12000);
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
  const growthMultiplier = (projectedAnnualRevenue / Math.max(currentAnnualRevenue, 1)).toFixed(1);

  return (
    <section id="roi-calculator" className="py-20 md:py-28 bg-[#070A0F] relative border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Financial Model</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Calculate Your Projected Revenue Growth
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            See the direct financial impact of deploying an integrated MK Digitalverse growth system vs. traditional marketing.
          </p>
        </div>

        {/* Main Calculator Box */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
          
          {/* Industry Selector */}
          <div className="flex justify-center mb-8">
            <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 inline-flex items-center gap-2">
              <button
                onClick={() => handleIndustryChange('healthcare')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  industry === 'healthcare'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span>Healthcare Model</span>
              </button>

              <button
                onClick={() => handleIndustryChange('wedding_venues')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  industry === 'wedding_venues'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palmtree className="w-4 h-4" />
                <span>Luxury Venue Model</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Inputs Controls */}
            <div className="lg:col-span-6 space-y-8 bg-slate-950/60 p-6 sm:p-8 rounded-2xl border border-slate-800">
              
              {/* Slider 1: Monthly Inquiries */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-200">
                    {industry === 'healthcare' ? 'Monthly Patient Inquiries' : 'Monthly Venue Tour Inquiries'}
                  </label>
                  <span className="font-bold text-amber-400 text-base">
                    {monthlyInquiries.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={industry === 'healthcare' ? 20 : 10}
                  max={industry === 'healthcare' ? 1000 : 300}
                  step={industry === 'healthcare' ? 10 : 5}
                  value={monthlyInquiries}
                  onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Low Volume</span>
                  <span>Enterprise Volume</span>
                </div>
              </div>

              {/* Slider 2: Value per Patient / Booking */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-200">
                    {industry === 'healthcare' ? 'Avg Patient Lifetime / Case Value' : 'Avg Venue Booking Contract Value'}
                  </label>
                  <span className="font-bold text-emerald-400 text-base">
                    ${averageValue.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={industry === 'healthcare' ? 500 : 2000}
                  max={industry === 'healthcare' ? 25000 : 50000}
                  step={industry === 'healthcare' ? 500 : 1000}
                  value={averageValue}
                  onChange={(e) => setAverageValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Standard Specialty</span>
                  <span>Ultra-High Ticket</span>
                </div>
              </div>

              {/* Slider 3: Current Conversion Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-200">
                    Current Inquiry-to-Customer Conversion Rate
                  </label>
                  <span className="font-bold text-slate-300 text-base">
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
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
              </div>

            </div>

            {/* Right Output Projections Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 p-8 rounded-2xl border border-slate-700/80 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Projected MK Digitalverse Growth Lift
                </span>
                <h3 className="text-3xl font-display font-extrabold text-white">
                  +${annualRevenueGrowth.toLocaleString()}
                </h3>
                <span className="text-xs text-slate-400">
                  Estimated Additional Annual Revenue Growth
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Current Model</span>
                  <div className="text-lg font-bold text-slate-300 mt-1">
                    ${currentAnnualRevenue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">Annual Revenue</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase block">MK Partner Engine</span>
                  <div className="text-lg font-bold text-emerald-300 mt-1">
                    ${projectedAnnualRevenue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400/80">Projected Annual</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Conversion Rate Improvement</span>
                <span className="text-amber-400 font-bold">{currentConversionRate}% → {projectedConversionRate}%</span>
              </div>

              <button
                onClick={onOpenAuditModal}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Claim This Growth Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
