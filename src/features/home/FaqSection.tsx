import React, { useState, useMemo } from 'react';
import { 
  FAQ_DATA, 
  FaqCategories, 
  FaqCategoryKey, 
  FaqItem 
} from '../../data/faqs';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Building2, 
  HeartPulse, 
  Compass, 
  CreditCard, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  MessageSquare,
  X,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface FaqSectionProps {
  onOpenAuditModal?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenAuditModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategoryKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('gen-1');

  // Filter FAQs based on selected category and search input
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      
      if (!query) return matchesCategory;

      const matchesQuery = 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)));

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Icon lookup for category tabs
  const renderCategoryIcon = (key: FaqCategoryKey | 'all') => {
    switch (key) {
      case 'general':
        return <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />;
      case 'healthcare':
        return <HeartPulse className="w-3.5 h-3.5 text-[#D4AF37]" />;
      case 'process':
        return <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />;
      case 'pricing_engagement':
        return <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />;
    }
  };

  return (
    <section id="faq-section" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B23]">
              Executive FAQ & Knowledge Base
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            Clarity & <span className="gold-text-gradient">Strategic Transparency</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Everything you need to know about partnering with MK Digitalverse as your dedicated Healthcare Digital Growth Partner.
          </p>
        </div>

        {/* Search Bar & Quick Filter Container */}
        <div className="mb-10 space-y-6">
          
          {/* Search Input Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D4AF37]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search growth questions (e.g., Healthcare Audit, AI Triage, Retainer)..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#0B172A] border border-[#C5A059]/40 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categorization Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            
            {/* All Tab */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                selectedCategory === 'all'
                  ? 'bg-[#C5A059] text-[#0A192F] border-[#C5A059] shadow-md scale-105'
                  : 'bg-[#0B172A] text-slate-200 border-[#C5A059]/30 hover:border-[#D4AF37] hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-current" />
              <span>All Questions ({FAQ_DATA.length})</span>
            </button>

            {/* Category Items */}
            {FaqCategories.ALL.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const categoryCount = FAQ_DATA.filter(item => item.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#C5A059] text-[#0A192F] border-[#C5A059] shadow-md scale-105'
                      : 'bg-[#0B172A] text-slate-200 border-[#C5A059]/30 hover:border-[#D4AF37] hover:text-white'
                  }`}
                >
                  {renderCategoryIcon(cat.key)}
                  <span>{cat.label} ({categoryCount})</span>
                </button>
              );
            })}

          </div>

        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 bg-[#0B172A] overflow-hidden ${
                    isOpen ? 'border-[#D4AF37] shadow-2xl bg-[#0B172A]' : 'border-[#C5A059]/30 hover:border-[#C5A059]/60'
                  }`}
                >
                  <h3>
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      id={`faq-btn-${faq.id}`}
                      className="w-full p-6 text-left flex items-start justify-between gap-4 font-bold text-white text-base sm:text-lg hover:text-[#D4AF37] transition-colors focus:outline-none cursor-pointer font-display"
                    >
                      <span className="leading-snug flex items-center gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${isOpen ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                        <span>{faq.question}</span>
                      </span>
                      <div className={`p-2 rounded-lg bg-[#050B18] border border-[#C5A059]/30 shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#C5A059]/20 text-[#D4AF37] border-[#D4AF37]' : 'text-slate-400'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${faq.id}`}
                      className="px-6 py-5 text-sm sm:text-base text-slate-800 leading-relaxed border-t border-[#C5A059]/30 bg-[#FDFBF7]"
                    >
                      <p className="mb-4 text-slate-700 leading-relaxed font-normal">{faq.answer}</p>
                      
                      {faq.tags && faq.tags.length > 0 && (
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                          <span className="text-[10px] font-mono text-[#8B6B23] uppercase font-bold">Focus Area:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {faq.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-0.5 rounded-md bg-[#F5F2EB] border border-[#C5A059]/40 text-[10px] font-mono text-[#8B6B23]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#0B172A] border border-[#C5A059]/40 space-y-3">
              <HelpCircle className="w-8 h-8 text-[#D4AF37] mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white">No questions matched your search criteria</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Try searching for broader terms like "Healthcare", "Audit", or "Retainer", or browse our categories above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-bold text-[#D4AF37] underline cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>

        {/* Executive CTA Card */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 text-center relative overflow-hidden shadow-2xl text-white">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050B18] border border-[#C5A059]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Direct Executive Access</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-snug">
              Didn’t find the exact answer for your clinic’s growth bottleneck?
            </h3>

            <p className="text-sm text-slate-200 leading-relaxed">
              Every hospital, fertility centre, and medical practice has unique operational friction. Schedule a 1-on-1 strategic growth consultation with our leadership team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <button
                onClick={onOpenAuditModal}
                className="btn-gold-primary w-full sm:w-auto px-9 py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#0A192F]" />
                <span>Book Strategic Discovery Call</span>
                <ArrowRight className="w-4 h-4 text-[#0A192F]" />
              </button>

              <button
                onClick={onOpenAuditModal}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#050B18] hover:bg-[#0F203C] text-white font-bold text-xs uppercase tracking-wider transition-all border border-[#C5A059]/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span>Request Growth Audit™</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-300 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>100% Confidential</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Zero Sales Pressure</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
