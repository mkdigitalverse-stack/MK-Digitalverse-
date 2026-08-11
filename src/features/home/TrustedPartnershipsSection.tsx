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
  HeartPulse, 
  ChevronRight
} from 'lucide-react';

interface TrustedPartnershipsProps {
  onOpenAuditModal: () => void;
}

interface PartnerLogo {
  id: string;
  name: string;
  category: 'hospital' | 'ivf' | 'surgical' | 'diagnostics';
  categoryLabel: string;
  tagline: string;
  location: string;
  metric: string;
  metricLabel: string;
  svgIcon: React.ReactNode;
}

export const TrustedPartnershipsSection: React.FC<TrustedPartnershipsProps> = ({ onOpenAuditModal }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'hospital' | 'ivf' | 'surgical' | 'diagnostics'>('all');
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);

  const partners: PartnerLogo[] = [
    {
      id: 'p1',
      name: 'APEX HEALTHCARE INSTITUTE',
      category: 'hospital',
      categoryLabel: 'Multi-Specialty Hospital Network',
      tagline: 'Tertiary Care & Surgical Excellence',
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
      category: 'ivf',
      categoryLabel: 'Specialty IVF & Maternity Alliance',
      tagline: 'Embryology & Reproductive Medicine',
      location: 'Gurugram • Bangalore',
      metric: '3.4x',
      metricLabel: 'High-Intent Search Consultation Lift',
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
      name: 'ST. JUDE MEDICAL FOUNDATION',
      category: 'hospital',
      categoryLabel: 'Regional Medical Alliance',
      tagline: 'Integrated Clinical & Emergency Services',
      location: 'Hyderabad • Chennai',
      metric: '< 30s',
      metricLabel: '24/7 AI Patient Triage Response',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <rect x="16" y="6" width="8" height="28" rx="2" />
          <rect x="6" y="16" width="28" height="8" rx="2" />
        </svg>
      )
    },
    {
      id: 'p4',
      name: 'LUMINA SURGICAL & ORTHOPEDIC',
      category: 'surgical',
      categoryLabel: 'Advanced Surgical Center',
      tagline: 'Precision Joint Replacement Institute',
      location: 'Pune • Ahmedabad',
      metric: '4.9 ★',
      metricLabel: 'Clinical Review Authority Score',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M12 6L28 6L34 16L20 34L6 16L12 6Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <line x1="12" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="1.5" />
          <line x1="28" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 'p5',
      name: 'MOUNT SINAI SPECIALTY CLINICS',
      category: 'diagnostics',
      categoryLabel: 'Multi-Specialty Diagnostics & Care',
      tagline: 'State-of-the-Art Radiology & Oncology',
      location: 'Kolkata • Chandigarh',
      metric: '0.8s',
      metricLabel: 'Mobile Web Load Performance',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 4L34 32H6L20 4Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="20" cy="22" r="4" />
        </svg>
      )
    },
    {
      id: 'p6',
      name: 'VERITAS DERMATOLOGY & AESTHETICS',
      category: 'surgical',
      categoryLabel: 'Cosmetic Surgery & Skin Institute',
      tagline: 'Premium Non-Invasive Rejuvenation',
      location: 'Mumbai • South Delhi',
      metric: '100%',
      metricLabel: 'Data Privacy Compliant',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 6C12.3 6 6 12.3 6 20C6 27.7 12.3 34 20 34C27.7 34 34 27.7 34 20C34 12.3 27.7 6 20 6ZM20 29C15 29 11 25 11 20C11 15 15 11 20 11C25 11 29 15 29 20C29 25 25 29 20 29Z" />
        </svg>
      )
    },
    {
      id: 'p7',
      name: 'APOLLO DENTAL SPECIALTY GROUP',
      category: 'surgical',
      categoryLabel: 'Multi-Location Dental Specialty',
      tagline: 'Implantology & Orthodontic Care',
      location: 'Bengaluru • Hyderabad',
      metric: '62%',
      metricLabel: 'Reduction in Appointment No-Shows',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <path d="M12 8C8 8 6 12 6 18C6 26 10 34 14 34C17 34 18 30 20 30C22 30 23 34 26 34C30 34 34 26 34 18C34 12 32 8 28 8C24 8 22 12 20 12C18 12 16 8 12 8Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      id: 'p8',
      name: 'CAREPULSE DIAGNOSTICS NETWORK',
      category: 'diagnostics',
      categoryLabel: 'Regional Diagnostics & Pathology',
      tagline: 'Automated Health Check Packages',
      location: 'Delhi NCR • Lucknow',
      metric: '4.5x',
      metricLabel: 'Checkup Package Conversion Growth',
      svgIcon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
          <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M12 20H17L20 12L24 28L27 20H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  const filteredPartners = activeCategory === 'all' 
    ? partners 
    : partners.filter(p => p.category === activeCategory);

  return (
    <section id="trusted-partnerships" className="py-20 md:py-28 bg-[#F7F9FC] text-[#0B1220] relative overflow-hidden border-b border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#EEF4FF] border border-[#1877F2]/20 shadow-xs">
            <Crown className="w-4 h-4 text-[#1877F2]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1877F2]">
              Trusted Partnerships & Social Proof
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0B1220] tracking-tight leading-[1.12]">
            Trusted by Leading <span className="text-[#1E3A8A]">Healthcare Organizations</span>
          </h2>

          <p className="text-base sm:text-lg text-[#526071] leading-relaxed font-normal max-w-2xl mx-auto">
            From multi-specialty hospital networks to high-growth specialty clinics and IVF centers, our growth systems power industry leaders.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {[
            { id: 'all', label: 'All Organizations', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'hospital', label: 'Hospitals & Networks', icon: <HeartPulse className="w-3.5 h-3.5" /> },
            { id: 'ivf', label: 'IVF & Maternity', icon: <Stethoscope className="w-3.5 h-3.5" /> },
            { id: 'surgical', label: 'Surgical & Clinics', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'diagnostics', label: 'Diagnostics & Labs', icon: <Activity className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                activeCategory === tab.id
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md scale-105'
                  : 'bg-white text-[#526071] border-slate-200 hover:border-[#1877F2]/40 hover:text-[#0B1220]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Clean Grayscale-to-Color Healthcare Logo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {filteredPartners.map((partner) => {
            const isHovered = hoveredPartner === partner.id;

            return (
              <div
                key={partner.id}
                onMouseEnter={() => setHoveredPartner(partner.id)}
                onMouseLeave={() => setHoveredPartner(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between cursor-pointer shadow-xs ${
                  isHovered
                    ? 'bg-white border-[#1877F2] shadow-md -translate-y-1.5'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#526071] bg-[#F7F9FC] px-2.5 py-1 rounded-md border border-slate-200">
                    {partner.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-[#1877F2] font-semibold">
                    {partner.location}
                  </span>
                </div>

                {/* Logo & Brand Identity */}
                <div className="space-y-4 my-2">
                  <div className={`transition-all duration-300 flex items-center justify-center p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 ${
                    isHovered 
                      ? 'text-[#1877F2] scale-105 border-[#1877F2]/30 bg-[#EEF4FF]' 
                      : 'text-slate-400 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'
                  }`}>
                    {partner.svgIcon}
                  </div>

                  <div className="text-center">
                    <h3 className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors ${
                      isHovered ? 'text-[#1E3A8A]' : 'text-[#0B1220]'
                    }`}>
                      {partner.name}
                    </h3>
                    <p className="text-[11px] text-[#526071] mt-1 line-clamp-1">
                      {partner.tagline}
                    </p>
                  </div>
                </div>

                {/* Performance Outcome Metric */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-[#1877F2] font-mono">
                      {partner.metric}
                    </div>
                    <div className="text-[10px] text-[#526071] font-medium">
                      {partner.metricLabel}
                    </div>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isHovered ? 'bg-[#1877F2] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Social Proof Key Badges */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1877F2] font-mono">50+</div>
              <div className="text-xs text-[#0B1220] font-semibold">Healthcare Deployments</div>
              <div className="text-[10px] text-[#526071]">Hospitals, Specialty Clinics & Groups</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">100%</div>
              <div className="text-xs text-[#0B1220] font-semibold">Data Privacy Compliant</div>
              <div className="text-[10px] text-[#526071]">Protected Lead Architecture</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1877F2] font-mono">0.8s</div>
              <div className="text-xs text-[#0B1220] font-semibold">Average Web Load Speed</div>
              <div className="text-[10px] text-[#526071]">Sub-Second Mobile Booking Experience</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] font-mono">3.2x</div>
              <div className="text-xs text-[#0B1220] font-semibold">Consultation Conversion Lift</div>
              <div className="text-[10px] text-[#526071]">Measured Within First 90 Days</div>
            </div>
          </div>
        </div>

        {/* Partnership Action Callout */}
        <div className="mt-14 text-center space-y-4">
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-[#FF6B00] hover:bg-[#E66000] text-white font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Book Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </section>
  );
};
