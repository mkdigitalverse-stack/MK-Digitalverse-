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
          ? 'bg-[#0A0D14]/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-2xl shadow-black/50' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Positioning Tagline */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-600 p-[1px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
              <div className="w-full h-full bg-[#0A0D14] rounded-[11px] flex items-center justify-center">
                <span className="font-display font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
                  MK
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white tracking-tight group-hover:text-amber-400 transition-colors">
                  MK DIGITALVERSE
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Growth Partner
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden md:block">
                Healthcare & Luxury Venues Strategy
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            
            {/* Industries Dropdown / Selector */}
            <div className="relative">
              <button 
                onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
                onBlur={() => setTimeout(() => setIndustryDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none"
              >
                <span>Industries</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${industryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {industryDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 glass-panel rounded-xl p-2 shadow-2xl border border-slate-700/60 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      onSelectIndustry('healthcare');
                      setIndustryDropdownOpen(false);
                      const el = document.getElementById('industries');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      activeIndustry === 'healthcare' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'hover:bg-slate-800/60 text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-amber-500/20 text-amber-400">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Healthcare Systems</div>
                      <div className="text-xs text-slate-400">Hospitals, Clinics, IVF</div>
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
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'hover:bg-slate-800/60 text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-emerald-500/20 text-emerald-400">
                      <Palmtree className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Luxury Wedding Venues</div>
                      <div className="text-xs text-slate-400">Resorts, Venues, Estates</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <a href="#partner-vs-agency" className="hover:text-white transition-colors">
              Why Growth Partner
            </a>
            <a href="#framework" className="hover:text-white transition-colors">
              Growth System
            </a>
            <a href="#capabilities" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#roi-calculator" className="hover:text-white transition-colors flex items-center gap-1 text-amber-400 font-semibold">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>ROI Calculator</span>
            </a>
            <a href="#proof" className="hover:text-white transition-colors">
              Impact & Proof
            </a>
          </nav>

          {/* Right Action Pill & CTA */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Quick Industry Pill Switcher */}
            <div className="bg-slate-900/90 border border-slate-800 p-1 rounded-full flex items-center text-xs font-semibold">
              <button
                onClick={() => onSelectIndustry('healthcare')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  activeIndustry === 'healthcare'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Healthcare</span>
              </button>
              <button
                onClick={() => onSelectIndustry('wedding_venues')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  activeIndustry === 'wedding_venues'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palmtree className="w-3.5 h-3.5" />
                <span>Venues</span>
              </button>
            </div>

            {/* Audit CTA Button */}
            <button
              onClick={onOpenAuditModal}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Growth Audit</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenAuditModal}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Audit
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
