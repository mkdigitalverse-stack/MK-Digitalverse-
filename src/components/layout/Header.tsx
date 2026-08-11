import React, { useState, useEffect } from 'react';
import { IndustryType } from '../../types';
import { SITE_CONFIG } from '../../config/site';
import { 
  HeartPulse, 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  Target,
  Award,
  Cpu,
  Code2,
  Zap,
  Building2,
  Users,
  ShieldCheck,
  BarChart2,
  Info
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
  const [activeDropdown, setActiveDropdown] = useState<'solutions' | 'about' | null>(null);

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
          ? 'bg-[#050B18]/90 backdrop-blur-xl border-b border-[#C5A059]/30 py-3 shadow-2xl shadow-black/50' 
          : 'bg-[#050B18]/75 backdrop-blur-md border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <a 
            href="#" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-xl p-1"
            aria-label="MK Digitalverse Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A192F] to-[#1E3A8A] p-[1.5px] shadow-md shadow-slate-900/40 group-hover:scale-105 transition-all shrink-0">
              <div className="w-full h-full bg-[#050B18] rounded-[10px] flex items-center justify-center border border-[#C5A059]/30">
                <span className="font-display font-black text-lg text-[#D4AF37] tracking-tight">
                  MK
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display font-extrabold text-base text-white tracking-tight group-hover:text-[#D4AF37] transition-colors leading-tight">
                MK Digitalverse
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider block leading-tight mt-0.5">
                DIGITAL GROWTH PARTNER FOR HEALTHCARE
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links - LOCKED TO ONLY: Solutions, About, Contact */}
          <nav className="hidden lg:flex items-center gap-8 font-display text-sm font-semibold text-slate-200">
            
            <a 
              href="#capabilities" 
              className="hover:text-[#D4AF37] transition-colors py-2 min-h-[44px] flex items-center cursor-pointer"
            >
              Solutions
            </a>

            <a 
              href="#/about" 
              className="hover:text-[#D4AF37] transition-colors py-2 min-h-[44px] flex items-center cursor-pointer"
            >
              About
            </a>

            <a 
              href="#faq" 
              className="hover:text-[#D4AF37] transition-colors py-2 min-h-[44px] flex items-center cursor-pointer"
            >
              Contact
            </a>

          </nav>

          {/* Right Desktop Call-to-Action */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenAuditModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B18] font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-900/30 border border-[#C5A059]/40 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 min-h-[44px]"
            >
              <span>Book Discovery Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenAuditModal}
              className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#050B18] font-bold text-xs uppercase tracking-wider min-h-[44px] flex items-center justify-center cursor-pointer shadow-md"
            >
              Book Call
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#0B1730] border border-white/15 text-white hover:bg-[#102240] min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
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
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-[#050B18]/98 backdrop-blur-2xl z-50 border-t border-[#C5A059]/20 px-6 py-8 overflow-y-auto flex flex-col justify-between animate-in fade-in slide-in-from-top-4 duration-200 text-white">
          
          <div className="space-y-6">
            <nav className="flex flex-col gap-3 font-display text-base font-bold text-slate-100">
              <a 
                href="#capabilities" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 rounded-xl hover:bg-[#0B1730] border border-transparent hover:border-[#C5A059]/30 flex items-center justify-between min-h-[48px]"
              >
                <span>Solutions</span>
                <span className="text-xs text-[#D4AF37] font-mono">01</span>
              </a>

              <a 
                href="#/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 rounded-xl hover:bg-[#0B1730] border border-transparent hover:border-[#C5A059]/30 flex items-center justify-between min-h-[48px]"
              >
                <span>About</span>
                <span className="text-xs text-[#D4AF37] font-mono">02</span>
              </a>

              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 rounded-xl hover:bg-[#0B1730] border border-transparent hover:border-[#C5A059]/30 flex items-center justify-between min-h-[48px]"
              >
                <span>Contact</span>
                <span className="text-xs text-[#D4AF37] font-mono">03</span>
              </a>
            </nav>
          </div>

          {/* Mobile Drawer CTA & Social Channels */}
          <div className="pt-6 border-t border-[#C5A059]/20 space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuditModal();
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#050B18] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl min-h-[48px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#050B18]" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Social Media Links */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#C5A059] hover:bg-[#C5A059]/20 transition-all"
                title="Follow MK Digitalverse on Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#C5A059] hover:bg-[#C5A059]/20 transition-all"
                title="Follow MK Digitalverse on Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#C5A059] hover:bg-[#C5A059]/20 transition-all"
                title="Follow MK Digitalverse on LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#C5A059] hover:bg-[#C5A059]/20 transition-all"
                title="Subscribe to MK Digitalverse on YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:text-white hover:border-emerald-400 hover:bg-emerald-600 transition-all"
                title="Chat with MK Digitalverse on WhatsApp"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[10px] text-[#D4AF37] text-center font-mono font-bold uppercase tracking-wider">
              DIGITAL GROWTH PARTNER FOR HEALTHCARE
            </p>
          </div>

        </div>
      )}
    </header>
  );
};
