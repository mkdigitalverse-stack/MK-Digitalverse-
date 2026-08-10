import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Crown, 
  Activity, 
  Stethoscope, 
  Hotel, 
  HeartPulse, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface TrustedPartnershipsProps {
  onOpenAuditModal: () => void;
}

interface PartnerLogo {
  id: string;
  name: string;
  category: 'healthcare' | 'clinic' | 'luxury' | 'network';
  categoryLabel: string;
  tagline: string;
  location: string;
  metric: string;
  metricLabel: string;
  svgIcon: React.ReactNode;
}

export const TrustedPartnershipsSection: React.FC<TrustedPartnershipsProps> = ({ onOpenAuditModal }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'healthcare' | 'clinic' | 'luxury' | 'network'>('all');
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);

  const partners: PartnerLogo[] = [
    {
      id: 'p1',
      name: 'APEX HEALTHCARE INSTITUTE',
      category: 'healthcare',
      categoryLabel: 'Multi-Specialty Hospital Network',
      tagline: 'Leading Tertiary Care & Surgical Excellence',
      location: 'New Delhi • Mumbai',
      metric: '+185%',
      metricLabel: 'Qualified Patient Consultations',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 4L4 12V28L20 36L36 28V12L20 4ZM20 8.8L31.2 14.4V25.6L20 31.2L8.8 25.6V14.4L20 8.8Z" />
          <path d="M18 14H22V18H26V22H22V26H18V22H14V18H18V14Z" />
        </svg>
      )
    },
    {
      id: 'p2',
      name: 'NOVA FERTILITY & REPRODUCTIVE',
      category: 'clinic',
      categoryLabel: 'Specialty IVF & Maternity Alliance',
      tagline: 'Advanced Embryology & Reproductive Medicine',
      location: 'Gurugram • Bangalore',
      metric: '3.4x',
      metricLabel: 'High-Intent Search Lead ROAS',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M20 4V10M20 30V36M4 20H10M30 20H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'p3',
      name: 'AURELIA LUXURY WELLNESS & SPA',
      category: 'luxury',
      categoryLabel: '5-Star Resort & Holistic Sanctuary',
      tagline: 'Exclusive Executive Rejuvenation',
      location: 'Udaipur • Goa',
      metric: '98%',
      metricLabel: 'VIP Slot Occupancy Rate',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 2L24.5 13.5L37 14.2L27.5 22.2L30.5 34.5L20 28L9.5 34.5L12.5 22.2L3 14.2L15.5 13.5L20 2Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="18" r="3" />
        </svg>
      )
    },
    {
      id: 'p4',
      name: 'ST. JUDE MEDICAL ALLIANCE',
      category: 'network',
      categoryLabel: 'Regional Medical Foundation',
      tagline: 'Integrated Clinical & Emergency Services',
      location: 'Hyderabad • Chennai',
      metric: '< 30s',
      metricLabel: '24/7 AI Patient Triage SLA',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <rect x="16" y="6" width="8" height="28" rx="2" />
          <rect x="6" y="16" width="28" height="8" rx="2" />
        </svg>
      )
    },
    {
      id: 'p5',
      name: 'LUMINA SURGICAL & ORTHOPEDIC',
      category: 'clinic',
      categoryLabel: 'Advanced Surgical Center',
      tagline: 'Precision Robotic Joint Replacement',
      location: 'Pune • Ahmedabad',
      metric: '4.9 ★',
      metricLabel: 'Google Review Authority Score',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M12 6L28 6L34 16L20 34L6 16L12 6Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <line x1="12" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="1.5" />
          <line x1="28" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 'p6',
      name: 'THE GRAND HERITAGE PAVILION',
      category: 'luxury',
      categoryLabel: 'Luxury Convention & Event Estate',
      tagline: 'High-End Galas & Corporate Summit Venue',
      location: 'Jaipur • New Delhi',
      metric: '+210%',
      metricLabel: 'High-Ticket Inquiries Converted',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M6 34V16L20 6L34 16V34H26V22H14V34H6Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M20 6V14" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'p7',
      name: 'MOUNT SINAI SPECIALTY CLINICS',
      category: 'healthcare',
      categoryLabel: 'Multi-Specialty Diagnostics & Care',
      tagline: 'State-of-the-Art Radiology & Oncology',
      location: 'Kolkata • Chandigarh',
      metric: '0.8s',
      metricLabel: 'Mobile Web LCP Load Speed',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 4L34 32H6L20 4Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="20" cy="22" r="4" />
        </svg>
      )
    },
    {
      id: 'p8',
      name: 'VERITAS DERMATOLOGY & AESTHETICS',
      category: 'clinic',
      categoryLabel: 'Cosmetic Surgery & Skin Institute',
      tagline: 'Premium Non-Invasive Rejuvenation',
      location: 'Mumbai • South Delhi',
      metric: '100%',
      metricLabel: 'HIPAA & Data Privacy Compliant',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 6C12.3 6 6 12.3 6 20C6 27.7 12.3 34 20 34C27.7 34 34 27.7 34 20C34 12.3 27.7 6 20 6ZM20 29C15 29 11 25 11 20C11 15 15 11 20 11C25 11 29 15 29 20C29 25 25 29 20 29Z" />
        </svg>
      )
    }
  ];

  const filteredPartners = activeCategory === 'all' 
    ? partners 
    : partners.filter(p => p.category === activeCategory);

  return (
    <section id="trusted-partnerships" className="py-20 md:py-28 bg-[#070709] text-white relative overflow-hidden border-t border-white/10">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Signature Flowing Gold Ribbon Line */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none">
          <path
            d="M-50,150 C350,350 650,-50 1050,200 C1350,300 1550,100 1650,200"
            stroke="url(#partnerGoldGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="partnerGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#E6C687" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-white/10 shadow-inner backdrop-blur-md">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">
              Trusted Partnerships & Social Proof
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-semibold text-amber-400">
              Healthcare & Luxury
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
            Trusted by Premier <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Healthcare Institutions & Luxury Venues</span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal max-w-2xl mx-auto">
            From multi-specialty hospital chains to high-end surgical centers and luxury hospitality venues, our growth engines power industry leaders.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {[
            { id: 'all', label: 'All Organizations', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'healthcare', label: 'Hospital Networks', icon: <HeartPulse className="w-3.5 h-3.5" /> },
            { id: 'clinic', label: 'Specialty Clinics & IVF', icon: <Stethoscope className="w-3.5 h-3.5" /> },
            { id: 'luxury', label: 'Luxury Venues & Hospitality', icon: <Hotel className="w-3.5 h-3.5" /> },
            { id: 'network', label: 'Regional Alliances', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                activeCategory === tab.id
                  ? 'bg-amber-400 text-black border-amber-400 shadow-xl shadow-amber-500/10 scale-105'
                  : 'bg-zinc-950/80 text-zinc-400 border-white/10 hover:border-amber-400/40 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Grayscale Logo Grid with Gold Micro-Interactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {filteredPartners.map((partner) => {
            const isHovered = hoveredPartner === partner.id;

            return (
              <div
                key={partner.id}
                onMouseEnter={() => setHoveredPartner(partner.id)}
                onMouseLeave={() => setHoveredPartner(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between cursor-pointer ${
                  isHovered
                    ? 'bg-zinc-900/90 border-amber-400/60 shadow-2xl shadow-amber-500/10 -translate-y-1.5'
                    : 'bg-zinc-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-md border border-white/5">
                    {partner.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold">
                    {partner.location}
                  </span>
                </div>

                {/* Logo & Brand Identity */}
                <div className="space-y-4 my-2">
                  <div className={`transition-all duration-300 flex items-center justify-center p-4 rounded-xl bg-zinc-900/50 border border-white/5 ${
                    isHovered 
                      ? 'text-amber-400 scale-105 border-amber-500/30 bg-amber-500/10' 
                      : 'text-zinc-500 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'
                  }`}>
                    {partner.svgIcon}
                  </div>

                  <div className="text-center">
                    <h3 className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors ${
                      isHovered ? 'text-amber-300' : 'text-zinc-200'
                    }`}>
                      {partner.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                      {partner.tagline}
                    </p>
                  </div>
                </div>

                {/* Performance Outcome Metric */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-amber-400 font-mono">
                      {partner.metric}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-medium">
                      {partner.metricLabel}
                    </div>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isHovered ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-500'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Social Proof Key Badges */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#0e0e14] to-zinc-950 border border-amber-400/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">50+</div>
              <div className="text-xs text-zinc-300 font-semibold">Healthcare & Venue Deployments</div>
              <div className="text-[10px] text-zinc-500">Across India & International Hubs</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">100%</div>
              <div className="text-xs text-zinc-300 font-semibold">Data Privacy & HIPAA Compliant</div>
              <div className="text-[10px] text-zinc-500">Protected Clinical Lead Architecture</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">0.8s</div>
              <div className="text-xs text-zinc-300 font-semibold">Average Edge Web Load SLA</div>
              <div className="text-[10px] text-zinc-500">Sub-Second Mobile Booking UI</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">3.2x</div>
              <div className="text-xs text-zinc-300 font-semibold">Average Consultation Conversion Lift</div>
              <div className="text-[10px] text-zinc-500">Measured Within First 90 Days</div>
            </div>
          </div>
        </div>

        {/* Partnership Action Callout */}
        <div className="mt-14 text-center space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
            Elevate your healthcare or luxury organization's digital position
          </p>
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Inquire About Strategic Partnership</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
