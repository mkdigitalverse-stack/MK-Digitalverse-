import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, HelpCircle, RefreshCw, BarChart2 } from 'lucide-react';
import { READINESS_ASSESSMENT_QUESTIONS } from '../../theme/designTokens';

interface AssessmentProps {
  onOpenAuditModal: () => void;
}

export const HealthcareReadinessAssessment: React.FC<AssessmentProps> = ({ onOpenAuditModal }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalQuestions = READINESS_ASSESSMENT_QUESTIONS.length;
  const currentQ = READINESS_ASSESSMENT_QUESTIONS[currentStep];

  const handleSelectOption = (weight: number) => {
    const updated = { ...answers, [currentQ.id]: weight };
    setAnswers(updated);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const totalScore: number = (Object.values(answers) as number[]).reduce((acc: number, curr: number) => acc + curr, 0);
  const maxScore = totalQuestions * 3;
  const scorePercentage = Math.round((totalScore / maxScore) * 100);

  const getAssessmentTier = (score: number) => {
    if (score >= 12) {
      return {
        rating: "High Growth Velocity",
        color: "text-[#D4AF37]",
        borderColor: "border-[#C5A059]/40",
        bgColor: "bg-[#050B18]",
        summary: "Your healthcare organization has strong digital foundations. A Healthcare Growth Audit™ will unlock high-yield optimizations in conversion rates and patient lifetime value.",
        nextStep: "Request Audit for Optimization"
      };
    } else if (score >= 6) {
      return {
        rating: "Moderate Growth Potential",
        color: "text-[#D4AF37]",
        borderColor: "border-[#C5A059]/40",
        bgColor: "bg-[#050B18]",
        summary: "Your organization has foundational assets but suffers from conversion leakages and unmanaged patient touchpoints. Implementing the Healthcare Growth System™ will scale predictable enquiry volume.",
        nextStep: "Request Strategic Growth Audit™"
      };
    } else {
      return {
        rating: "Significant Growth Opportunity",
        color: "text-[#D4AF37]",
        borderColor: "border-[#C5A059]/40",
        bgColor: "bg-[#050B18]",
        summary: "Your digital presence is underperforming relative to your clinical capabilities. A custom strategy will build a predictable digital growth engine for your organization.",
        nextStep: "Request Growth Blueprint Audit™"
      };
    }
  };

  const tier = getAssessmentTier(totalScore);

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  return (
    <section id="readiness-assessment" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] border-b border-[#0A192F]/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
            <BarChart2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Interactive Diagnostic</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0A192F] tracking-tight">
            Healthcare Growth Readiness Assessment™
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Answer 5 strategic questions to evaluate your organization's digital acquisition maturity and uncover immediate growth opportunities.
          </p>

          {/* Feature Image Section directly below heading */}
          <div className="pt-3 max-w-3xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#050B18]">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
                alt="Digital Healthcare Diagnostic Assessment and Patient Acquisition Maturity Evaluation"
                referrerPolicy="no-referrer"
                className="w-full h-[200px] sm:h-[260px] object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md flex items-center justify-between gap-2 text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="font-bold text-[#D4AF37] uppercase font-mono">Digital Acquisition Maturity Quiz</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  5 Diagnostic Steps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl relative overflow-hidden">
          
          {!isCompleted ? (
            <div className="space-y-8">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span className="text-[#D4AF37] font-bold uppercase">Question 0{currentStep + 1} of 0{totalQuestions}</span>
                  <span>{currentQ.category}</span>
                </div>
                <div className="w-full h-1.5 bg-[#050B18] rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug font-display">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.weight)}
                    className="w-full p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 hover:border-[#D4AF37] hover:bg-[#0F203C] transition-all duration-150 text-left text-xs sm:text-sm text-slate-200 flex items-center justify-between group cursor-pointer shadow-md"
                  >
                    <span className="font-medium pr-4">{opt.text}</span>
                    <span className="w-6 h-6 rounded-full border border-[#C5A059]/40 group-hover:border-[#D4AF37] group-hover:bg-[#0B172A] flex items-center justify-center shrink-0 transition-all text-[#D4AF37] text-xs">
                      →
                    </span>
                  </button>
                ))}
              </div>

              {/* Confidence Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>100% Confidential & Executive-Ready</span>
                </div>
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-8 text-center py-4">
              <div className="space-y-3">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${tier.bgColor} ${tier.borderColor} ${tier.color} text-xs font-bold uppercase tracking-wider border`}>
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Readiness Score: {scorePercentage}%</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Assessment Result: <span className={tier.color}>{tier.rating}</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
                  {tier.summary}
                </p>
              </div>

              {/* Metric Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
                <div className="p-3.5 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Growth Score</div>
                  <div className="text-lg font-bold font-mono text-white">{totalScore} / {maxScore}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Readiness Tier</div>
                  <div className={`text-xs font-bold ${tier.color}`}>{tier.rating.split(' ')[0]}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Next Recommendation</div>
                  <div className="text-xs font-bold text-[#D4AF37]">Growth Audit™</div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onOpenAuditModal}
                  className="btn-gold-primary w-full sm:w-auto px-8 py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Healthcare Growth Audit™</span>
                  <ArrowRight className="w-4 h-4 text-[#0A192F]" />
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#050B18] hover:bg-[#0F203C] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#C5A059]/40"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                "Your information is kept strictly confidential. No obligations."
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
