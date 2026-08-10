import React, { useState } from 'react';
import { IndustryType } from '../../types';
import { 
  HeartPulse, 
  Castle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Globe2,
  Linkedin,
  Instagram,
  Youtube,
  Send
} from 'lucide-react';

interface FooterProps {
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export interface FooterNavLink {
  label: string;
  href: string;
  isIndustryAction?: IndustryType;
  badge?: string;
}

export const FOOTER_NAVIGATION = {
  industries: {
    title: 'Healthcare Organizations',
    links: [
      { label: 'Hospitals & Medical Networks', href: '#industries', isIndustryAction: 'healthcare' as IndustryType },
      { label: 'IVF & Fertility Institutes', href: '#industries', isIndustryAction: 'healthcare' as IndustryType },
      { label: 'Dental & Orthodontic Chains', href: '#industries', isIndustryAction: 'healthcare' as IndustryType },
      { label: 'Cosmetic & Aesthetic Clinics', href: '#industries', isIndustryAction: 'healthcare' as IndustryType },
      { label: 'Diagnostic & Pathology Labs', href: '#industries', isIndustryAction: 'healthcare' as IndustryType },
      { label: 'Specialty Surgical Centers', href: '#industries', isIndustryAction: 'healthcare' as IndustryType }
    ]
  },
  solutions: {
    title: 'Solutions',
    links: [
      { label: 'Healthcare Growth Strategy', href: '#capabilities' },
      { label: 'Brand Positioning', href: '#capabilities' },
      { label: 'Conversion-Focused Websites ⭐', href: '#capabilities', badge: 'Flagship' },
      { label: 'AI-Powered Business Systems', href: '#capabilities' },
      { label: 'Performance Marketing', href: '#capabilities' }
    ]
  },
  frameworks: {
    title: 'Growth System™',
    links: [
      { label: 'Healthcare Growth System™', href: '#growth-system' },
      { label: 'Healthcare Growth Audit™', href: '#growth-system' },
      { label: 'Healthcare Growth Index™', href: '#growth-system' },
      { label: 'Implementation Playbook™', href: '#growth-system' }
    ]
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About MK Digitalverse', href: '#why-mk' },
      { label: 'Insights & Case Studies', href: '#case-studies' },
      { label: 'Executive FAQ', href: '#faq' },
      { label: 'Design System (DS-01)', href: '#/design-system' },
      { label: 'Privacy Policy', href: '#privacy-policy' },
      { label: 'Terms of Engagement', href: '#terms-of-service' }
    ]
  }
};

export const Footer: React.FC<FooterProps> = ({ onSelectIndustry, onOpenAuditModal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-zinc-400 text-xs font-sans relative overflow-hidden" aria-label="Site Footer">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Banner CTA (Aligned with Hero Theme) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/10 relative z-10">
        <div className="relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#0d0d14] to-zinc-950 border border-amber-400/30 shadow-2xl">
          
          {/* Ambient Radial Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* SVG Ribbon Motif Accent */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
              <path
                d="M-50,150 C200,50 500,250 800,100 C1000,0 1200,200 1300,150"
                stroke="url(#footerCtaGoldGrad)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="footerCtaGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#E6C687" stopOpacity="1" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="space-y-3 text-center lg:text-left relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-white/10 shadow-inner backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">
                National Growth Practice
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-semibold text-amber-400">
                Healthcare Organizations
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
              Ready to deploy an integrated{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                patient growth engine?
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
              Transform patient intake friction and appointment conversion with a diagnostic Healthcare Growth Audit™.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto shrink-0 relative z-10">
            <button
              onClick={onOpenAuditModal}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={onOpenAuditModal}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-zinc-900 text-zinc-200 font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 hover:text-white transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Request Growth Audit™</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Brand & Positioning Statement (Lg: 4 columns) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/20 p-[1px] shadow-md">
              <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center font-black text-white text-lg tracking-tighter">
                MK
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-base text-white tracking-tight block">
                MK DIGITALVERSE
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                Digital Growth Partner
              </span>
            </div>
          </div>

          {/* CTO Brand Statement (Exact match) */}
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            MK Digitalverse is a Digital Growth Partner helping healthcare organizations achieve measurable business growth through strategy, branding, AI-powered systems, high-converting websites, and performance marketing.
          </p>

          {/* Contact Details */}
          <div className="space-y-2.5 pt-1 text-zinc-300 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="mailto:mkdigitalverse@gmail.com" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                mkdigitalverse@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Executive Desk: Mon–Sat, 9 AM – 7 PM IST</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>India • Serving Clients Globally</span>
            </div>
          </div>

          {/* Active Social Media Links */}
          <div className="pt-2 flex items-center gap-3">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Connect:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://linkedin.com/company/mkdigitalverse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-amber-400/50 hover:bg-amber-400/10 transition-all"
                title="Follow MK Digitalverse on LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/mkdigitalverse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all"
                title="Follow MK Digitalverse on Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@mkdigitalverse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-400/50 hover:bg-red-400/10 transition-all"
                title="Subscribe to MK Digitalverse on YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Navigation Columns (Lg: 5 columns total) */}
        
        {/* Group 1: Industries */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2">
            {FOOTER_NAVIGATION.industries.title}
          </h4>
          <ul className="space-y-2 text-zinc-400">
            {FOOTER_NAVIGATION.industries.links.map((link, idx) => (
              <li key={idx}>
                {link.isIndustryAction ? (
                  <button
                    onClick={() => {
                      onSelectIndustry(link.isIndustryAction!);
                      const el = document.getElementById('industries');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    {link.isIndustryAction === 'healthcare' ? (
                      <HeartPulse className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Castle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <span>{link.label}</span>
                  </button>
                ) : (
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Group 2: Solutions */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2">
            {FOOTER_NAVIGATION.solutions.title}
          </h4>
          <ul className="space-y-2 text-zinc-400">
            {FOOTER_NAVIGATION.solutions.links.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Group 3: Frameworks */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2">
            {FOOTER_NAVIGATION.frameworks.title}
          </h4>
          <ul className="space-y-2 text-zinc-400">
            {FOOTER_NAVIGATION.frameworks.links.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className="hover:text-amber-300 transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Group 4: Company & Insights Newsletter (Lg: 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2">
            {FOOTER_NAVIGATION.company.title}
          </h4>
          <ul className="space-y-2 text-zinc-400">
            {FOOTER_NAVIGATION.company.links.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Strategic Insights Subscription Box */}
          <div className="pt-4 space-y-2">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Growth Insights</span>
            </h5>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Get practical insights on digital growth, AI, branding, and business strategy.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              {subscribed ? (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Subscribed to Growth Briefing!</span>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="executive@clinic.com"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/15 text-white placeholder-zinc-500 text-[11px] focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-amber-400 text-black font-bold text-[11px] hover:bg-amber-300 transition-all shrink-0 cursor-pointer"
                    title="Subscribe to Growth Briefing"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

      {/* Bottom Bar & Legal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 relative z-10">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} MK Digitalverse. All rights reserved.</span>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <span className="hidden sm:inline">Official Digital Growth Partner.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#privacy-policy" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
          <a href="#terms-of-service" className="hover:text-zinc-300 transition-colors">Terms of Engagement</a>
          <a href="#accessibility" className="hover:text-zinc-300 transition-colors">Accessibility Statement</a>
        </div>
      </div>

    </footer>
  );
};
