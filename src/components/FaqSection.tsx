import React, { useState } from 'react';
import { FAQS } from '../data/content';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 bg-[#050505] relative border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Executive FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Clarity & Strategic Transparency
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-300">
            Key details regarding our proprietary growth systems, pricing engagement models, and engagement terms.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all bg-[#09090b]"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white text-base hover:text-amber-300 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-zinc-300 leading-relaxed border-t border-white/10 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
