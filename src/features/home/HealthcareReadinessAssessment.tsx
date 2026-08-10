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
        color: "text-emerald-400",
        borderColor: "border-emerald-500/30",
        bgColor: "bg-emerald-500/10",
        summary: "Your healthcare organization has strong digital foundations. A Healthcare Growth Audit™ will unlock high-yield optimizations in conversion rates and patient lifetime value.",
        nextStep: "Request Audit for Optimization"
      };
    } else if (score >= 6) {
      return {
        rating: "Moderate Growth Potential",
        color: "text-amber-400",
        borderColor: "border-amber-500/30",
        bgColor: "bg-amber-500/10",
        summary: "Your organization has foundational assets but suffers from conversion leakages and unmanaged patient touchpoints. Implementing the Healthcare Growth System™ will scale predictable enquiry volume.",
        nextStep: "Request Strategic Growth Audit™"
      };
    } else {
      return {
        rating: "Significant Growth Opportunity",
        color: "text-cyan-400",
        borderColor: "border-cyan-500/30",
        bgColor: "bg-cyan-500/10",
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
    <section id="readiness-assessment" className="py-20 md:py-28 bg-zinc-950 border-t border-white/10 relative overflow-hidden">
      {/* Blueprint Grid Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Interactive Diagnostic</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Healthcare Growth Readiness Assessment™
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
            Answer 5 strategic questions to evaluate your organization's digital acquisition maturity and uncover immediate growth opportunities.
          </p>
        </div>

        {/* Diagnostic Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-2xl relative overflow-hidden">
          
          {!isCompleted ? (
            <div className="space-y-8">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <span className="text-cyan-400 font-bold uppercase">Question 0{currentStep + 1} of 0{totalQuestions}</span>
                  <span>{currentQ.category}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.weight)}
                    className="w-full p-4 rounded-xl bg-zinc-950 border border-white/10 hover:border-cyan-400/50 hover:bg-zinc-900/80 transition-all duration-150 text-left text-xs sm:text-sm text-zinc-200 flex items-center justify-between group cursor-pointer"
                  >
                    <span className="font-medium pr-4">{opt.text}</span>
                    <span className="w-6 h-6 rounded-full border border-white/20 group-hover:border-cyan-400 group-hover:bg-cyan-400/10 flex items-center justify-center shrink-0 transition-all text-cyan-400 text-xs">
                      →
                    </span>
                  </button>
                ))}
              </div>

              {/* Confidence Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Confidential & Executive-Ready</span>
                </div>
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
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
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${tier.bgColor} ${tier.borderColor} ${tier.color} text-xs font-bold uppercase tracking-wider`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Readiness Score: {scorePercentage}%</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Assessment Result: <span className={tier.color}>{tier.rating}</span>
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
                  {tier.summary}
                </p>
              </div>

              {/* Metric Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Growth Score</div>
                  <div className="text-lg font-bold font-mono text-white">{totalScore} / {maxScore}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Readiness Tier</div>
                  <div className={`text-xs font-bold ${tier.color}`}>{tier.rating.split(' ')[0]}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Next Recommendation</div>
                  <div className="text-xs font-bold text-cyan-400">Growth Audit™</div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onOpenAuditModal}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Healthcare Growth Audit™</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              <div className="text-[10px] text-zinc-400 font-mono">
                "Your information is kept strictly confidential. No obligations."
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
