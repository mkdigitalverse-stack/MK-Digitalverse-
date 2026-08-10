import React, { useState, useEffect } from 'react';
import { IndustryType } from '../../types';
import { 
  HeartPulse, 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Target,
  Award,
  Cpu,
  Code2,
  Zap,
  BarChart3
} from 'lucide-react';

interface HeaderProps {
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeIndustry,
  onSelectIndustry,
  onOpenAuditModal
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'solutions' | 'frameworks' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeDropdowns = () => setActiveDropdown(null);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-black/80' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Executive Brand Tagline */}
          <a 
            href="#" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl p-1"
            aria-label="MK Digitalverse Home"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 p-[1px] group-hover:border-white/30 transition-all">
              <div className="w-full h-full bg-[#050505] rounded-[11px] flex items-center justify-center">
                <span className="font-display font-black text-lg text-white tracking-tight">
                  MK
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-white tracking-tight group-hover:text-amber-400 transition-colors">
                  MK DIGITALVERSE
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                  Growth Partner
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium hidden md:block">
                Healthcare Practice
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
            
            {/* Solutions Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')}
                onBlur={() => setTimeout(closeDropdowns, 200)}
                className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus:text-amber-400 py-2 min-h-[44px]"
                aria-expanded={activeDropdown === 'solutions'}
                aria-haspopup="true"
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'solutions' ? 'rotate-180 text-amber-400' : ''}`} />
              </button>

              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 mt-2 w-80 glass-panel rounded-2xl p-2.5 shadow-2xl border border-white/15 bg-[#09090b] z-50">
                  <a
                    href="#capabilities"
                    onClick={closeDropdowns}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 text-zinc-200 transition-colors"
                  >
                    <Target className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-white">Healthcare Growth Strategy</div>
                      <div className="text-[10px] text-zinc-400 normal-case">Measurable revenue growth roadmap</div>
                    </div>
                  </a>

                  <a
                    href="#capabilities"
                    onClick={closeDropdowns}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 text-zinc-200 transition-colors"
                  >
                    <Award className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-white">Brand Positioning</div>
                      <div className="text-[10px] text-zinc-400 normal-case">Clinical authority & high trust</div>
                    </div>
                  </a>

                  <a
                    href="#capabilities"
                    onClick={closeDropdowns}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-400/10 border border-amber-400/30 text-amber-300 transition-colors bg-amber-500/5"
                  >
                    <Code2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-1">
                        <span>Conversion-Focused Websites</span>
                        <Sparkles className="w-3 h-3 text-amber-400" />
                      </div>
                      <div className="text-[10px] text-amber-200/80 normal-case">Flagship Next.js conversion engine</div>
                    </div>
                  </a>

                  <a
                    href="#capabilities"
                    onClick={closeDropdowns}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 text-zinc-200 transition-colors"
                  >
                    <Cpu className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-white">AI-Powered Business Systems</div>
                      <div className="text-[10px] text-zinc-400 normal-case">24/7 lead triage & operational efficiency</div>
                    </div>
                  </a>

                  <a
                    href="#capabilities"
                    onClick={closeDropdowns}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 text-zinc-200 transition-colors"
                  >
                    <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-white">Performance Marketing</div>
                      <div className="text-[10px] text-zinc-400 normal-case">Data-driven patient enquiry campaigns</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <a href="#growth-system" className="hover:text-white transition-colors py-2 min-h-[44px] flex items-center">
              Growth System™
            </a>

            <a href="#roi-calculator" className="hover:text-white transition-colors py-2 min-h-[44px] flex items-center">
              ROI Model
            </a>

            <a href="#case-studies" className="hover:text-white transition-colors py-2 min-h-[44px] flex items-center">
              Insights
            </a>
            
            <a href="#why-mk" className="hover:text-white transition-colors py-2 min-h-[44px] flex items-center">
              About
            </a>

            <a href="#faq" className="hover:text-white transition-colors py-2 min-h-[44px] flex items-center">
              Contact
            </a>
          </nav>

          {/* Right Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Book Discovery Call Button */}
            <button
              onClick={onOpenAuditModal}
              className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-md flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Book Discovery Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenAuditModal}
              className="px-3.5 py-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider min-h-[44px] flex items-center justify-center"
            >
              Book Call
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-[#050505]/95 backdrop-blur-2xl z-50 border-t border-white/10 px-6 py-8 overflow-y-auto flex flex-col justify-between animate-in fade-in slide-in-from-top-4 duration-200">
          
          <div className="space-y-6">
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2 font-display text-base font-bold text-zinc-200">
              <a 
                href="#capabilities" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-white/5 flex items-center justify-between min-h-[44px]"
              >
                <span>Solutions</span>
                <span className="text-xs text-amber-400 font-mono">01</span>
              </a>

              <a 
                href="#roi-calculator" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center justify-between min-h-[44px]"
              >
                <span>Interactive ROI Model</span>
                <BarChart3 className="w-4 h-4" />
              </a>

              <a 
                href="#case-studies" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-white/5 flex items-center justify-between min-h-[44px]"
              >
                <span>Insights & Proof</span>
                <span className="text-xs text-amber-400 font-mono">02</span>
              </a>

              <a 
                href="#why-mk" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-white/5 flex items-center justify-between min-h-[44px]"
              >
                <span>About</span>
                <span className="text-xs text-amber-400 font-mono">03</span>
              </a>

              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-white/5 flex items-center justify-between min-h-[44px]"
              >
                <span>Contact</span>
                <span className="text-xs text-amber-400 font-mono">04</span>
              </a>
            </nav>

          </div>

          {/* Sticky Drawer CTA */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuditModal();
              }}
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl min-h-[48px]"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-zinc-500 text-center font-mono uppercase tracking-wider">
              Strategic Digital Growth Partner
            </p>
          </div>

        </div>
      )}
    </header>
  );
};
