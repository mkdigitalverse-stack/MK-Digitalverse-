import React, { useState } from 'react';
import { IndustryType } from '../../types';
import { analytics } from '../../services/analytics';
import { SITE_CONFIG } from '../../config/site';
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
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  MessageCircle
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
    <footer className="bg-[#0A192F] border-t border-[#C5A059]/30 text-slate-300 text-xs font-sans relative overflow-hidden" aria-label="Site Footer">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C5A059]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Brand & Positioning Statement */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#C5A059]/40 p-[1px] shadow-md shrink-0">
              <div className="w-full h-full bg-[#0A192F] rounded-[10px] flex items-center justify-center font-black text-[#D4AF37] text-lg tracking-tighter">
                MK
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display font-extrabold text-base text-white tracking-tight block leading-tight">
                MK Digitalverse
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider block leading-tight mt-0.5">
                DIGITAL GROWTH PARTNER FOR HEALTHCARE
              </span>
            </div>
          </div>

          {/* CTO Brand Statement */}
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            MK Digitalverse is a Digital Growth Partner helping healthcare organizations achieve measurable business growth through strategy, branding, AI-powered systems, high-converting websites, and performance marketing.
          </p>

          {/* Contact Details */}
          <div className="space-y-2.5 pt-1 text-slate-300 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a 
                href={`mailto:${SITE_CONFIG.contact.email}`} 
                onClick={() => analytics.trackEmailClick('Footer')}
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a 
                href={SITE_CONFIG.contact.whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => analytics.trackWhatsAppClick('FooterContact')}
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
              >
                <span>Direct Executive Desk: {SITE_CONFIG.contact.phone}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  WhatsApp Available
                </span>
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{SITE_CONFIG.contact.location}</span>
            </div>
          </div>

          {/* Active Social Media Links */}
          <div className="pt-2 flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Connect:</span>
            <div className="flex items-center gap-2">
              <a
                href={SITE_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#C5A059] hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                title="Follow MK Digitalverse on Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#C5A059] hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                title="Follow MK Digitalverse on Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#C5A059] hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                title="Follow MK Digitalverse on LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#C5A059] hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                title="Subscribe to MK Digitalverse on YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackWhatsAppClick('FooterSocialIcon')}
                className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:text-white hover:border-emerald-400 hover:bg-emerald-600 transition-all cursor-pointer"
                title="Chat with MK Digitalverse on WhatsApp"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Navigation Columns */}
        
        {/* Group 1: Industries */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2 font-display">
            {FOOTER_NAVIGATION.industries.title}
          </h4>
          <ul className="space-y-2 text-slate-300">
            {FOOTER_NAVIGATION.industries.links.map((link, idx) => (
              <li key={idx}>
                {link.isIndustryAction ? (
                  <button
                    onClick={() => {
                      onSelectIndustry(link.isIndustryAction!);
                      const el = document.getElementById('industries');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-[#D4AF37] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <HeartPulse className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
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
          <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2 font-display">
            {FOOTER_NAVIGATION.solutions.title}
          </h4>
          <ul className="space-y-2 text-slate-300">
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
          <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2 font-display">
            {FOOTER_NAVIGATION.frameworks.title}
          </h4>
          <ul className="space-y-2 text-slate-300">
            {FOOTER_NAVIGATION.frameworks.links.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className="hover:text-[#D4AF37] transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Group 4: Company & Insights Newsletter */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2 font-display">
            {FOOTER_NAVIGATION.company.title}
          </h4>
          <ul className="space-y-2 text-slate-300">
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
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Growth Insights</span>
            </h5>
            <p className="text-[11px] text-slate-400 leading-snug">
              Get practical insights on digital growth, AI, branding, and business strategy.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              {subscribed ? (
                <div className="p-2.5 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#D4AF37] text-[11px] flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
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
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-400 text-[11px] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="submit"
                    className="btn-gold-primary px-3 py-2 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer"
                    title="Subscribe to Growth Briefing"
                  >
                    <Send className="w-3.5 h-3.5 text-[#0A192F]" />
                  </button>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

      {/* Bottom Bar & Legal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 relative z-10">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} MK Digitalverse. All rights reserved.</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline">Official Digital Growth Partner.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#privacy-policy" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
          <a href="#terms-of-service" className="hover:text-slate-200 transition-colors">Terms of Engagement</a>
          <a href="#accessibility" className="hover:text-slate-200 transition-colors">Accessibility Statement</a>
        </div>
      </div>

    </footer>
  );
};
