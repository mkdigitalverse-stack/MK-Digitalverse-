import React, { useState } from 'react';
import { 
  Building2, 
  HeartPulse, 
  Stethoscope, 
  Baby, 
  Smile, 
  Activity, 
  Syringe, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Workflow
} from 'lucide-react';

interface IndustryProps {
  onOpenAuditModal: () => void;
}

export interface HealthcareSegment {
  id: string;
  title: string;
  badge: string;
  icon: any;
  image: string;
  altText: string;
  description: string;
  growthFocus: string[];
  outcomeMetric: string;
}

const HEALTHCARE_SEGMENTS: HealthcareSegment[] = [
  {
    id: 'hospitals',
    title: 'Hospitals',
    badge: 'Multi-Specialty & Tertiary Care',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    altText: 'Modern multi-specialty hospital facility and patient reception',
    description: 'Unified growth systems for multi-specialty hospital networks. We streamline department-wise patient acquisition, doctor authority positioning, and digital intake routing.',
    growthFocus: [
      'Department-specific patient acquisition funnels',
      'Doctor & specialist authority portals',
      'Centralized digital intake & 24/7 AI triage'
    ],
    outcomeMetric: 'Predictable bed capacity & consultation volume'
  },
  {
    id: 'specialty-clinics',
    title: 'Specialty Clinics',
    badge: 'Super-Specialty Practice Groups',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    altText: 'Doctor patient consultation in a modern specialty clinic',
    description: 'High-trust acquisition for Cardiology, Orthopedics, Neurology, Gastro, Oncology, and specialty practices seeking high-value case consultation growth.',
    growthFocus: [
      'Procedure-focused search & social campaigns',
      'Pre-consultation patient trust architecture',
      'High-converting appointment scheduling engines'
    ],
    outcomeMetric: '2.4x higher consultation acceptance rate'
  },
  {
    id: 'ivf-fertility',
    title: 'IVF & Fertility Institutes',
    badge: 'Reproductive Medicine & Embryology',
    icon: Baby,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    altText: 'Warm, compassionate fertility clinic consultation and patient care',
    description: 'Sensitive, empathetic positioning and high-trust enquiry systems designed specifically for couples seeking IVF, ICSI, and fertility care.',
    growthFocus: [
      'Empathetic, trust-first digital storytelling',
      'Private 24/7 AI enquiry pre-qualification',
      'Higher consultation conversion from initial enquiry'
    ],
    outcomeMetric: '+185% increase in qualified IVF consultations'
  },
  {
    id: 'dental-groups',
    title: 'Dental Groups',
    badge: 'Multi-Location Dental Chains',
    icon: Smile,
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    altText: 'Modern dental practice room with advanced diagnostic technology',
    description: 'Scalable acquisition and automated booking infrastructure for implants, aligners, full-mouth rehabilitation, and multi-location dental chains.',
    growthFocus: [
      'High-value dental treatment acquisition (Implants & Aligners)',
      'Automated appointment reminder & review loops',
      'Multi-location catchment search dominance'
    ],
    outcomeMetric: '3.5x return on ad spend across treatment lines'
  },
  {
    id: 'diagnostic-networks',
    title: 'Diagnostic Networks',
    badge: 'Imaging & Pathology Centers',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    altText: 'Advanced diagnostic imaging and lab testing equipment',
    description: 'Volume-driven search campaigns and frictionless online booking systems for MRI, CT, PET, path labs, and preventive health package networks.',
    growthFocus: [
      'Geo-targeted local search & Maps dominance',
      'Instant WhatsApp booking & report access routing',
      'B2C health check package growth'
    ],
    outcomeMetric: 'Sub-60s booking response time'
  },
  {
    id: 'surgical-centers',
    title: 'Surgical Centers',
    badge: 'Ambulatory & Day-Care Surgery',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    altText: 'State of the art surgical facility operating suite',
    description: 'Precision patient acquisition for minimally invasive, laparoscopic, bariatric, and day-care surgical procedures.',
    growthFocus: [
      'High-intent surgical intent search capture',
      'Surgical care pathway transparency & trust badging',
      'Automated pre-surgery consultation scheduling'
    ],
    outcomeMetric: 'Reduced surgical consultation drop-off'
  },
  {
    id: 'cosmetic-aesthetic',
    title: 'Cosmetic & Aesthetic Clinics',
    badge: 'Dermatology & Aesthetic Medicine',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    altText: 'Luxury aesthetic dermatology clinic consultation',
    description: 'Luxury aesthetic positioning, high-converting social acquisition, and authority building for premium dermatology and cosmetic surgery clinics.',
    growthFocus: [
      'Premium brand positioning & price objection elimination',
      'Visual case study & transformation portfolios',
      'VIP consultation booking and deposit workflows'
    ],
    outcomeMetric: 'Command premium consultation fees effortlessly'
  }
];

export const IndustrySolutions: React.FC<IndustryProps> = ({ onOpenAuditModal }) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('hospitals');
  const selectedSegment = HEALTHCARE_SEGMENTS.find(s => s.id === selectedSegmentId) || HEALTHCARE_SEGMENTS[0];

  return (
    <section id="healthcare-segments" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Workflow className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Healthcare Segments We Serve</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            Custom Growth Systems Tailored for <span className="gold-text-gradient">Your Healthcare Category.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every healthcare category has distinct patient trust dynamics, decision timelines, and consultation friction points. We build tailored growth infrastructure for each segment.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {HEALTHCARE_SEGMENTS.map((seg) => {
            const isSelected = seg.id === selectedSegmentId;
            const IconComp = seg.icon;
            return (
              <button
                key={seg.id}
                onClick={() => setSelectedSegmentId(seg.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#16437E] via-[#123668] to-[#0A2246] text-white border-2 border-[#D4AF37] shadow-lg'
                    : 'bg-[#0B172A] text-slate-300 border-white/10 hover:border-[#C5A059]/40 hover:text-white'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D4AF37]' : 'text-[#C5A059]'}`} />
                <span>{seg.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Segment Feature Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl mb-14">
          
          {/* Left Column: Image & Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-xl bg-[#050B18] group">
              <img
                src={selectedSegment.image}
                alt={selectedSegment.altText}
                className="w-full h-[300px] sm:h-[360px] object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent opacity-90" />
              
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#050B18]/90 border border-[#C5A059]/40 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                {selectedSegment.badge}
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#050B18]/90 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs text-white">
                <span className="font-mono text-slate-300">Target Outcome:</span>
                <span className="font-bold text-[#D4AF37]">{selectedSegment.outcomeMetric}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                Segment Strategy — {selectedSegment.title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-display">
                {selectedSegment.title} Growth Engine
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed mt-3 font-normal">
                {selectedSegment.description}
              </p>
            </div>

            {/* Growth Focus Highlights */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core System Interventions:
              </h4>
              <div className="space-y-2.5">
                {selectedSegment.growthFocus.map((focus, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#050B18] border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-200">{focus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA button */}
            <div className="pt-2">
              <button
                onClick={onOpenAuditModal}
                className="btn-gold-primary px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Request Growth Plan for {selectedSegment.title}</span>
                <ArrowRight className="w-4 h-4 text-[#0A192F]" />
              </button>
            </div>
          </div>

        </div>

        {/* Grid of All 7 Segments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HEALTHCARE_SEGMENTS.map((seg) => {
            const IconComp = seg.icon;
            return (
              <div
                key={seg.id}
                onClick={() => setSelectedSegmentId(seg.id)}
                className={`p-5 rounded-2xl bg-[#0B172A] border transition-all cursor-pointer space-y-3 group ${
                  seg.id === selectedSegmentId
                    ? 'border-[#D4AF37] shadow-xl ring-1 ring-[#D4AF37]'
                    : 'border-white/10 hover:border-[#C5A059]/50 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#050B18] border border-[#C5A059]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {seg.badge.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors font-display">
                    {seg.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {seg.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium group-hover:text-slate-200">View Growth Model</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
