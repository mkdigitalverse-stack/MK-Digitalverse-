import React, { useState } from 'react';
import { HEALTHCARE_DECISION_JOURNEY } from '../../theme/designTokens';
import { ArrowRight, HelpCircle, MessageSquare, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

interface JourneyProps {
  onOpenAuditModal: () => void;
}

export const HealthcareDecisionJourney: React.FC<JourneyProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'dialogue' | 'outcomes'>('questions');

  return (
    <section id="decision-journey" className="py-20 md:py-28 bg-[#FFFFFF] text-[#0B1220] relative overflow-hidden border-b border-slate-200">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-light-grid pointer-events-none opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF4FF] border border-[#1877F2]/20 text-[#1877F2] text-xs font-bold uppercase tracking-widest shadow-sm">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Executive Buyer Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0B1220] tracking-tight leading-[1.15]">
            The Healthcare <span className="text-[#1E3A8A]">Decision Journey</span>
          </h2>

          <p className="text-base sm:text-lg text-[#526071] leading-relaxed font-normal">
            We structure every digital touchpoint to answer executive business questions transparently—helping healthcare leaders make confident growth decisions.
          </p>

          {/* Buyer Personas List */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-[#526071] font-mono mr-2">Designed for Healthcare Leaders:</span>
            {HEALTHCARE_DECISION_JOURNEY.buyerPersonas.map((persona, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-[#F7F9FC] border border-slate-200 text-[#0B1220] text-xs font-semibold">
                {persona}
              </span>
            ))}
          </div>
        </div>

        {/* Boardroom Test Callout */}
        <div className="mb-12 p-6 rounded-2xl bg-[#EEF4FF] border border-[#1877F2]/20 flex items-start sm:items-center gap-4 text-left shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#1877F2] uppercase font-bold tracking-wider">The Boardroom Test</div>
            <p className="text-xs sm:text-sm text-[#0B1220] font-semibold italic">
              "{HEALTHCARE_DECISION_JOURNEY.boardroomTest}"
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-[#F7F9FC] border border-slate-200">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'questions' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-[#526071] hover:text-[#0B1220]'
              }`}
            >
              6 Executive Questions
            </button>
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dialogue' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-[#526071] hover:text-[#0B1220]'
              }`}
            >
              Consulting Dialogue
            </button>
            <button
              onClick={() => setActiveTab('outcomes')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'outcomes' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-[#526071] hover:text-[#0B1220]'
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
              <div key={q.num} className="p-6 rounded-2xl bg-[#FFFFFF] border border-slate-200 shadow-sm space-y-3 hover:border-[#1877F2]/40 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#EEF4FF] border border-[#1877F2]/20 text-[#1877F2] font-mono text-xs font-bold flex items-center justify-center">
                    {q.num}
                  </span>
                  <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-[#1877F2] transition-colors" />
                </div>
                <h3 className="text-base font-bold text-[#0B1220] group-hover:text-[#1877F2] transition-colors">
                  {q.question}
                </h3>
                <p className="text-xs text-[#526071] leading-relaxed border-t border-slate-100 pt-3">
                  <strong className="text-[#1877F2] block text-[10px] uppercase font-mono mb-1">Our Transparent Answer:</strong>
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
              <div key={idx} className="p-5 rounded-2xl bg-[#F7F9FC] border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-[#1E3A8A] font-semibold">
                  <MessageSquare className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  <span>Healthcare Visitor Thinks:</span>
                  <strong className="text-[#0B1220] italic">"{item.thought}"</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-[#EEF4FF] border border-[#1877F2]/20 text-xs text-[#0B1220] flex items-start gap-2 font-medium">
                  <span className="text-[#1877F2] font-bold shrink-0">MK Responds →</span>
                  <span>{item.response}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Outcome Reframing */}
        {activeTab === 'outcomes' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-center text-xs text-[#526071] font-mono mb-6">
              "Healthcare leaders don't need marketing jargon—they need measurable business outcomes."
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HEALTHCARE_DECISION_JOURNEY.featureToOutcomeReframings.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#FFFFFF] border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#526071] uppercase tracking-wider block">Instead of:</span>
                    <div className="line-through text-[#526071] text-xs font-semibold">{item.feature}</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block font-bold">We Say & Deliver:</span>
                    <p className="text-xs text-[#0B1220] font-semibold leading-relaxed">{item.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Conversion Path CTA with CTA Orange Theme */}
        <div className="mt-16 text-center space-y-4">
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-[#FF6B00] hover:bg-[#E66000] text-white font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-xl shadow-orange-950/20 cursor-pointer"
          >
            <span>Book Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </section>
  );
};
