import React, { useState, useEffect } from 'react';
import { IndustryType } from '../types';
import { 
  Building2, 
  HeartPulse, 
  Palmtree, 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles,
  Layers,
  BarChart3,
  ChevronDown
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
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/80' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Executive Brand Tagline */}
          <a href="#" className="flex items-center gap-3 group">
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
                Healthcare & Luxury Venues Practice
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide text-zinc-300 uppercase">
            
            {/* Industries Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
                onBlur={() => setTimeout(() => setIndustryDropdownOpen(false), 200)}
                className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none py-1"
              >
                <span>Industries</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${industryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {industryDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 glass-panel rounded-xl p-2 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      onSelectIndustry('healthcare');
                      setIndustryDropdownOpen(false);
                      const el = document.getElementById('industries');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      activeIndustry === 'healthcare' 
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                        : 'hover:bg-white/5 text-zinc-200'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-amber-500/20 text-amber-400">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs uppercase tracking-wider text-white">Healthcare Organizations</div>
                      <div className="text-[11px] text-zinc-400 normal-case">Hospitals, IVF, Dental & Specialty Clinics</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectIndustry('wedding_venues');
                      setIndustryDropdownOpen(false);
                      const el = document.getElementById('industries');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left mt-1 ${
                      activeIndustry === 'wedding_venues' 
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                        : 'hover:bg-white/5 text-zinc-200'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-emerald-500/20 text-emerald-400">
                      <Palmtree className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs uppercase tracking-wider text-white">Luxury Wedding Venues</div>
                      <div className="text-[11px] text-zinc-400 normal-case">Resorts, Banquet Estates & Destinations</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <a href="#capabilities" className="hover:text-white transition-colors">
              Solutions
            </a>
            <a href="#framework" className="hover:text-white transition-colors">
              Frameworks
            </a>
            <a href="#roi-calculator" className="hover:text-white transition-colors text-amber-400">
              ROI Model
            </a>
            <a href="#proof" className="hover:text-white transition-colors">
              Proof
            </a>
            <a href="#partner-vs-agency" className="hover:text-white transition-colors">
              About
            </a>
          </nav>

          {/* Right Action Pill & CTAs */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Quick Industry Switcher */}
            <div className="bg-zinc-950/90 border border-white/10 p-1 rounded-full flex items-center text-[11px] font-semibold">
              <button
                onClick={() => onSelectIndustry('healthcare')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                  activeIndustry === 'healthcare'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <HeartPulse className="w-3 h-3" />
                <span>Healthcare</span>
              </button>
              <button
                onClick={() => onSelectIndustry('wedding_venues')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                  activeIndustry === 'wedding_venues'
                    ? 'bg-emerald-400 text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Palmtree className="w-3 h-3" />
                <span>Venues</span>
              </button>
            </div>

            {/* Book Discovery Call Button */}
            <button
              onClick={onOpenAuditModal}
              className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Book Discovery Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenAuditModal}
              className="px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs uppercase"
            >
              Book Call
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 py-6 mt-3 space-y-4 animate-in slide-in-from-top-4">
          
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Primary Focus</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectIndustry('healthcare');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold ${
                  activeIndustry === 'healthcare'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                Healthcare
              </button>
              <button
                onClick={() => {
                  onSelectIndustry('wedding_venues');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold ${
                  activeIndustry === 'wedding_venues'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Palmtree className="w-4 h-4" />
                Luxury Venues
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-3 font-medium text-slate-300 text-sm">
            <a 
              href="#partner-vs-agency" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-800/60"
            >
              Why Growth Partner
            </a>
            <a 
              href="#industries" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-800/60"
            >
              Industry Deep Dive
            </a>
            <a 
              href="#framework" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-800/60"
            >
              The MK Growth System
            </a>
            <a 
              href="#capabilities" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-800/60"
            >
              Capabilities & Engineering
            </a>
            <a 
              href="#roi-calculator" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold flex items-center justify-between"
            >
              <span>Interactive ROI Calculator</span>
              <BarChart3 className="w-4 h-4" />
            </a>
            <a 
              href="#proof" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-800/60"
            >
              Case Studies & Proof
            </a>
          </nav>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAuditModal();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Request Growth Audit
          </button>
        </div>
      )}
    </header>
  );
};
