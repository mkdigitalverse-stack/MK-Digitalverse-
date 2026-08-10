import React, { useState } from 'react';
import { IndustryType, AuditFormData } from '../../types';
import { INDUSTRY_DATA } from '../../data/content';
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
  HeartPulse, 
  Palmtree, 
  Lock,
  Sparkles
} from 'lucide-react';

interface GrowthAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndustry: IndustryType;
}

export const GrowthAuditModal: React.FC<GrowthAuditModalProps> = ({
  isOpen,
  onClose,
  initialIndustry
}) => {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<AuditFormData>({
    industry: initialIndustry,
    vertical: INDUSTRY_DATA[initialIndustry].verticals[0].title,
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    monthlyRevenue: '₹5 Lakhs - ₹15 Lakhs / month',
    primaryGoal: 'Scale qualified patient/booking inquiries',
    currentBottleneck: 'Unqualified leads & low website conversion'
  });

  if (!isOpen) return null;

  const handleIndustrySelect = (ind: IndustryType) => {
    setFormData({
      ...formData,
      industry: ind,
      vertical: INDUSTRY_DATA[ind].verticals[0].title
    });
  };

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
          industry: formData.industry,
          primaryChallenge: formData.currentBottleneck
        });
      } catch (err) {
        console.error('Audit submission error:', err);
      }
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 bg-[#09090b] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Executive Strategy Audit</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Request Your Healthcare Growth Strategy Blueprint
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Step {step} of 3 • Custom scoping for Healthcare Organizations
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Form Steps */}
            <form onSubmit={handleNext} className="space-y-6">
              
              {/* Step 1: Industry Focus & Bottleneck */}
              {step === 1 && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                      1. Healthcare Organization Vertical
                    </label>
                    <select
                      value={formData.vertical}
                      onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-white/40"
                    >
                      {INDUSTRY_DATA['healthcare'].verticals.map((v) => (
                        <option key={v.id} value={v.title}>
                          {v.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                      2. Current Primary Bottleneck
                    </label>
                    <select
                      value={formData.currentBottleneck}
                      onChange={(e) => setFormData({ ...formData, currentBottleneck: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-white/40"
                    >
                      <option>Unqualified patient inquiries & low website conversion</option>
                      <option>High cost per acquisition on Google Search & Meta ads</option>
                      <option>Dependence on traditional doctor referrals & word-of-mouth</option>
                      <option>Slow lead response time & after-hours intake drop-off</option>
                    </select>
                  </div>

                </div>
              )}

              {/* Step 2: Contact Details */}
              {step === 2 && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                      Organization / Brand Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Hospital Network / Blossom Fertility Clinic"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                      Your Full Name & Role *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Rajesh Sharma (Managing Director)"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          placeholder="name@organization.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-white/40"
                        />
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
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Step 3: Scale & Growth Goals */}
              {step === 3 && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                      Estimated Monthly Marketing/Growth Budget Range
                    </label>
                    <select
                      value={formData.monthlyRevenue}
                      onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-white/40"
                    >
                      <option>₹2.5 Lakhs - ₹5 Lakhs / month</option>
                      <option>₹5 Lakhs - ₹15 Lakhs / month</option>
                      <option>₹15 Lakhs - ₹50 Lakhs / month</option>
                      <option>₹50 Lakhs+ Enterprise / Multi-location</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                      Primary 12-Month Target Growth Goal
                    </label>
                    <select
                      value={formData.primaryGoal}
                      onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-white/40"
                    >
                      <option>Scale qualified patient/booking inquiries by 2x-3x</option>
                      <option>Increase average contract / treatment case value by 20%+</option>
                      <option>Expand to new geographical catchment zones</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-3 text-xs text-zinc-400">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Non-disclosure guaranteed. Your business metrics remain 100% confidential.</span>
                  </div>

                </div>
              )}

              {/* Confidence Layer Indicators (PMI-01) */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 font-medium border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Responds within 1 business day</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Healthcare growth specialists</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>No-obligation Discovery Call</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Confidential executive review</span>
                </div>
              </div>

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between pt-2">

                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 text-xs font-semibold hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/10 flex items-center gap-2 ml-auto cursor-pointer"
                >
                  <span>{step === 3 ? 'Submit Audit Request' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Submission Confirmation Screen (PMI-01 Success Experience) */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>✔ Request Received</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Growth Audit Request Confirmed
              </h3>
              <p className="text-xs text-zinc-300 mt-2 max-w-md mx-auto">
                Thank you, <strong className="text-amber-400">{formData.contactName}</strong>. We have logged your request for <strong className="text-white">{formData.organizationName}</strong>.
              </p>
            </div>

            {/* What Happens Next Card */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 text-left text-xs text-zinc-300 space-y-3 max-w-md mx-auto">
              <div className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] border-b border-white/10 pb-2">
                What Happens Next:
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>We'll review your healthcare organization's profile and current digital channels.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>A Senior Growth Strategist will contact you at <strong className="text-amber-400">{formData.email}</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>You'll receive your meeting confirmation and customized Growth Audit outline.</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all active:scale-95 shadow-xl shadow-amber-500/10 cursor-pointer"
            >
              Return to Platform
            </button>
          </div>
        )}


      </div>
    </div>
  );
};
