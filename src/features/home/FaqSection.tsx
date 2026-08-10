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
  const [isHoveredCta, setIsHoveredCta] = useState<boolean>(false);

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
        return <Building2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'healthcare':
        return <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />;
      case 'process':
        return <Compass className="w-3.5 h-3.5 text-cyan-400" />;
      case 'pricing_engagement':
        return <CreditCard className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <section id="faq-section" className="py-20 md:py-28 bg-[#050505] relative border-t border-white/10 overflow-hidden">
      
      {/* Background Radial Glow Effects (Identical to Hero Theme) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30"></div>

      {/* Gold Ribbon SVG Background Accent (Hero Signature Motif) */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none">
          <path
            d="M-100,100 C300,300 600,-50 1000,200 C1300,350 1500,100 1600,250"
            stroke="url(#faqGoldRibbon)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="faqGoldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#E6C687" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header - Hero Badge & Hero Gradient Typography */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-white/10 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">
              Executive FAQ & Knowledge Base
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-semibold text-amber-400">
              Strategic Transparency
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
            Clarity, Systems &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
              Strategic Transparency
            </span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Everything you need to know about partnering with MK Digitalverse as your dedicated Digital Growth Partner.
          </p>
        </div>

        {/* Search Bar & Quick Filter Container */}
        <div className="mb-10 space-y-6">
          
          {/* Search Input Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search growth questions (e.g., Healthcare Audit, AI Concierge, Retainer)..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-zinc-950/90 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all shadow-inner backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categorization Tabs (Hero Theme Styling) */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            
            {/* All Tab */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-black border-amber-400 shadow-xl shadow-amber-500/10 scale-105'
                  : 'bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-black" />
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
                      ? 'bg-amber-400 text-black border-amber-400 shadow-xl shadow-amber-500/10 scale-105'
                      : 'bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {renderCategoryIcon(cat.key)}
                  <span>{cat.label} ({categoryCount})</span>
                </button>
              );
            })}

          </div>

        </div>

        {/* Accordion FAQ List (Glass Cards with Amber Glow) */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 bg-zinc-950/80 backdrop-blur-md overflow-hidden ${
                    isOpen ? 'border-amber-400/50 shadow-2xl shadow-amber-500/10 bg-zinc-900/90' : 'border-white/10 hover:border-amber-400/30'
                  }`}
                >
                  <h3>
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      id={`faq-btn-${faq.id}`}
                      className="w-full p-6 text-left flex items-start justify-between gap-4 font-bold text-white text-base sm:text-lg hover:text-amber-300 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="leading-snug flex items-center gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${isOpen ? 'text-amber-400' : 'text-emerald-400'}`} />
                        <span>{faq.question}</span>
                      </span>
                      <div className={`p-2 rounded-lg bg-zinc-900 border border-white/10 shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-amber-400/20 text-amber-300 border-amber-400/40' : 'text-zinc-400'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${faq.id}`}
                      className="px-6 pb-6 text-sm sm:text-base text-zinc-300 leading-relaxed border-t border-white/10 pt-4 animate-in fade-in duration-200"
                    >
                      <p className="mb-4 text-zinc-200 leading-relaxed">{faq.answer}</p>
                      
                      {faq.tags && faq.tags.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Focus Area:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {faq.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-amber-500/20 text-[10px] font-mono text-amber-300"
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
            <div className="p-12 text-center rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3 backdrop-blur-md">
              <HelpCircle className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white">No questions matched your search criteria</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try searching for broader terms like "Healthcare", "Audit", or "Retainer", or browse our categories above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-bold text-amber-400 underline cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>

        {/* Executive CTA Card (Exact Hero Section Theme Styling) */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#0d0d14] to-zinc-950 border border-amber-400/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Executive Access</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-snug">
              Didn’t find the exact answer for your clinic’s growth bottleneck?
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Every hospital, fertility centre, and medical practice has unique operational friction. Schedule a 1-on-1 strategic growth consultation with our leadership team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <button
                onClick={onOpenAuditModal}
                onMouseEnter={() => setIsHoveredCta(true)}
                onMouseLeave={() => setIsHoveredCta(false)}
                className="relative overflow-hidden w-full sm:w-auto px-9 py-4 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
              >
                <span
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ${
                    isHoveredCta ? 'translate-x-full' : '-translate-x-full'
                  }`}
                />
                <PhoneCall className="w-4 h-4 text-black relative z-10" />
                <span className="relative z-10">Book Executive Growth Call</span>
                <ArrowRight className="w-4 h-4 text-black relative z-10" />
              </button>

              <button
                onClick={onOpenAuditModal}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-zinc-900 text-zinc-200 font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 hover:text-white transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Request Growth Audit™</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Confidential</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Sales Pressure</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

