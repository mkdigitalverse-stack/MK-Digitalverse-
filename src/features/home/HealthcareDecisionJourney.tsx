import React, { useState } from 'react';
import { HEALTHCARE_DECISION_JOURNEY } from '../../theme/designTokens';
import { ArrowRight, HelpCircle, MessageSquare, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

interface JourneyProps {
  onOpenAuditModal: () => void;
}

export const HealthcareDecisionJourney: React.FC<JourneyProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'dialogue' | 'outcomes'>('questions');

  return (
    <section id="decision-journey" className="py-20 md:py-28 bg-zinc-950 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Executive Buyer Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            The Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400">Decision Journey</span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            We structure every digital touchpoint to answer executive business questions transparently—helping healthcare leaders make confident growth decisions.
          </p>

          {/* Buyer Personas List */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-zinc-400 font-mono mr-2">Designed for Healthcare Leaders:</span>
            {HEALTHCARE_DECISION_JOURNEY.buyerPersonas.map((persona, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 text-xs font-medium">
                {persona}
              </span>
            ))}
          </div>
        </div>

        {/* Boardroom Test Callout */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-blue-950/40 border border-blue-500/30 flex items-start sm:items-center gap-4 text-left shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono text-blue-400 uppercase font-bold tracking-wider">The Boardroom Test</div>
            <p className="text-xs sm:text-sm text-zinc-200 font-medium italic">
              "{HEALTHCARE_DECISION_JOURNEY.boardroomTest}"
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-zinc-900 border border-white/10">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'questions' ? 'bg-blue-500 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              6 Executive Questions
            </button>
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dialogue' ? 'bg-blue-500 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Consulting Dialogue
            </button>
            <button
              onClick={() => setActiveTab('outcomes')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'outcomes' ? 'bg-blue-500 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Outcomes Over Features
            </button>
          </div>
        </div>

        {/* Tab 1: 6 Executive Decision Questions */}
        {activeTab === 'questions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HEALTHCARE_DECISION_JOURNEY.decisionQuestions.map((q) => (
              <div key={q.num} className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3 hover:border-blue-500/30 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                    {q.num}
                  </span>
                  <HelpCircle className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {q.question}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                  <strong className="text-blue-400 block text-[10px] uppercase font-mono mb-1">Our Transparent Answer:</strong>
                  {q.response}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Dialogue Conversation Flow */}
        {activeTab === 'dialogue' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {HEALTHCARE_DECISION_JOURNEY.conversationDialogue.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                  <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Healthcare Visitor Thinks:</span>
                  <strong className="text-white italic">"{item.thought}"</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-zinc-200 flex items-start gap-2">
                  <span className="text-blue-400 font-bold shrink-0">MK Responds →</span>
                  <span>{item.response}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Outcome Reframing */}
        {activeTab === 'outcomes' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-center text-xs text-zinc-400 font-mono mb-6">
              "Healthcare leaders don't need marketing jargon—they need measurable business outcomes."
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HEALTHCARE_DECISION_JOURNEY.featureToOutcomeReframings.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-zinc-900 border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Instead of:</span>
                    <div className="line-through text-zinc-400 text-xs font-semibold">{item.feature}</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">We Say & Deliver:</span>
                    <p className="text-xs text-white font-medium leading-relaxed">{item.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Conversion Path CTA with Gold Theme */}
        <div className="mt-16 text-center space-y-4">
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/10 cursor-pointer"
          >
            <span>Book Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
