import React, { useState } from 'react';
import { submitGrowthAudit } from '../../services/audit';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  User, 
  Mail, 
  PhoneCall, 
  Globe,
  MapPin,
  Lock,
  Sparkles,
  TrendingUp,
  Target,
  DollarSign
} from 'lucide-react';

interface GrowthAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndustry?: string;
}

export const GrowthAuditModal: React.FC<GrowthAuditModalProps> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  // Lead Qualification Form State (Section 17 Requirements)
  const [formData, setFormData] = useState({
    // Organization
    organizationName: '',
    website: '',
    healthcareCategory: 'Hospitals',
    location: '',
    
    // Contact
    contactName: '',
    email: '',
    phone: '',

    // Current Situation
    monthlyEnquiries: '50 – 150 enquiries/month',
    acquisitionChannels: 'Google Search & Social Media Ads',
    biggestChallenge: 'Low Digital Visibility & Weak Patient Trust',

    // Growth Objective
    growthObjective: 'Increase qualified enquiries & improve conversion',

    // Investment Readiness
    investmentReadiness: '₹50K–₹1L/month'
  });

  if (!isOpen) return null;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        await submitGrowthAudit({
          fullName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          organizationName: formData.organizationName,
          industry: formData.healthcareCategory,
          primaryChallenge: formData.biggestChallenge,
          growthObjective: formData.growthObjective,
          investmentReadiness: formData.investmentReadiness
        });
      } catch (err) {
        console.error('Audit submission error:', err);
      }
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 bg-[#09090b] overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-[#1877F2]" />
                <span>Executive Lead Qualification</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Request Healthcare Growth System Scoping
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Step {step} of 3 • Tailored Scoping for Healthcare Organizations
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-[#1877F2] h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Form Steps */}
            <form onSubmit={handleNext} className="space-y-6">
              
              {/* Step 1: Organization & Category */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-xs font-bold font-mono text-blue-400 uppercase tracking-wider mb-2">
                    Phase 01: Healthcare Organization Profile
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                      Organization Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Blossom Fertility / Apex Hospital"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                        Website (or Landing Page)
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="e.g. www.hospital.com"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                        Location / Primary Catchment
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="e.g. Mumbai / Multi-location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                      Healthcare Category *
                    </label>
                    <select
                      value={formData.healthcareCategory}
                      onChange={(e) => setFormData({ ...formData, healthcareCategory: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    >
                      <option>Hospitals</option>
                      <option>Specialty Clinics</option>
                      <option>IVF & Fertility Institutes</option>
                      <option>Dental Groups</option>
                      <option>Diagnostic Networks</option>
                      <option>Surgical Centers</option>
                      <option>Cosmetic & Aesthetic Clinics</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Current Situation & Contact */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-xs font-bold font-mono text-blue-400 uppercase tracking-wider mb-2">
                    Phase 02: Current Situation & Key Contact
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                        Your Full Name & Executive Role *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="Dr. / Director Name"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          placeholder="director@hospital.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                      Direct Phone / WhatsApp *
                    </label>
                    <div className="relative">
                      <PhoneCall className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                      Biggest Growth Challenge
                    </label>
                    <select
                      value={formData.biggestChallenge}
                      onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    >
                      <option>Low Digital Visibility & Search Ranking</option>
                      <option>Weak Patient Trust & Unclear Doctor Authority</option>
                      <option>Unpredictable Enquiries & High Ad Spend Waste</option>
                      <option>Disconnected Systems & Slow Front-Desk Follow-Up</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Growth Objectives & Investment Readiness */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-xs font-bold font-mono text-blue-400 uppercase tracking-wider mb-2">
                    Phase 03: Growth Objectives & Investment Readiness
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                      Primary Growth Objective
                    </label>
                    <select
                      value={formData.growthObjective}
                      onChange={(e) => setFormData({ ...formData, growthObjective: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    >
                      <option>Increase qualified enquiries & appointment bookings</option>
                      <option>Improve digital visibility across search & social</option>
                      <option>Build patient trust & doctor authority</option>
                      <option>Improve website consultation conversion rate</option>
                      <option>Automate lead management & AI pre-qualification</option>
                      <option>Scale paid patient acquisition predictably</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                      Investment Readiness (Monthly Growth Budget Target)
                    </label>
                    <select
                      value={formData.investmentReadiness}
                      onChange={(e) => setFormData({ ...formData, investmentReadiness: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    >
                      <option>₹25K–₹50K/month</option>
                      <option>₹50K–₹1L/month</option>
                      <option>₹1L–₹2.5L/month</option>
                      <option>₹2.5L+/month</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-3 text-xs text-zinc-400">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Strict confidentiality guaranteed. All information is handled with healthcare privacy standards.</span>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 text-xs font-semibold hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#E66000] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center gap-2 ml-auto cursor-pointer"
                >
                  <span>{step === 3 ? 'Submit Growth Request' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>✔ Request Received</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Growth Scoping Request Confirmed
              </h3>
              <p className="text-xs text-zinc-300 mt-2 max-w-md mx-auto">
                Thank you, <strong className="text-blue-300">{formData.contactName}</strong>. We have logged your request for <strong className="text-white">{formData.organizationName}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 text-left text-xs text-zinc-300 space-y-3 max-w-md mx-auto">
              <div className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] border-b border-white/10 pb-2">
                What Happens Next:
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Our healthcare growth strategists will review your organization profile.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>We will reach out at <strong className="text-blue-300">{formData.email}</strong> to confirm your Discovery Call schedule.</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full bg-[#FF6B00] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#E66000] transition-all active:scale-95 shadow-xl cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
