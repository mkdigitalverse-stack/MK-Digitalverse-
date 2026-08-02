import React, { useState } from 'react';
import { IndustryType, AuditFormData } from '../types';
import { INDUSTRY_DATA } from '../data/content';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  HeartPulse, 
  Palmtree, 
  Building2,
  Calendar,
  Lock,
  PhoneCall,
  Mail,
  User,
  ShieldCheck
} from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndustry: IndustryType;
}

export const GrowthAuditModal: React.FC<ModalProps> = ({
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
    monthlyRevenue: '$50,000 - $150,000',
    primaryGoal: 'Scale qualified patient/booking inquiries',
    currentBottleneck: 'Unqualified leads & low website conversion'
  });

  if (!isOpen) return null;

  const handleIndustrySelect = (ind: IndustryType) => {
    setFormData(prev => ({
      ...prev,
      industry: ind,
      vertical: INDUSTRY_DATA[ind].verticals[0].title
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 bg-[#0A0D14] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            
            {/* Modal Title */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Confidential Growth Audit</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Request Your Growth Strategy Blueprint
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Step {step} of 3 • Custom scoping for {formData.industry === 'healthcare' ? 'Healthcare Organizations' : 'Luxury Wedding Venues'}
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              
              {/* STEP 1: Industry & Vertical */}
              {step === 1 && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      1. Primary Industry Sector
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleIndustrySelect('healthcare')}
                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          formData.industry === 'healthcare'
                            ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <HeartPulse className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">Healthcare</div>
                          <div className="text-[10px] text-slate-400">Hospitals & Clinics</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleIndustrySelect('wedding_venues')}
                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          formData.industry === 'wedding_venues'
                            ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Palmtree className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">Luxury Venues</div>
                          <div className="text-[10px] text-slate-400">Resorts & Estates</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      2. Sub-Category / Vertical
                    </label>
                    <select
                      value={formData.vertical}
                      onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                    >
                      {INDUSTRY_DATA[formData.industry].verticals.map((v) => (
                        <option key={v.id} value={v.title}>
                          {v.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      3. Current Primary Bottleneck
                    </label>
                    <select
                      value={formData.currentBottleneck}
                      onChange={(e) => setFormData({ ...formData, currentBottleneck: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                    >
                      <option>Unqualified leads & low website conversion</option>
                      <option>High cost per acquisition on Google/Meta ads</option>
                      <option>Outdated website failing to project premium brand trust</option>
                      <option>Slow lead response times & missed weekend inquiries</option>
                      <option>Lack of predictable revenue pipeline</option>
                    </select>
                  </div>

                </div>
              )}

              {/* STEP 2: Organization & Contact Info */}
              {step === 2 && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Organization / Brand Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apollo Wellness Institute or Royal Heritage Resort"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Your Full Name & Role *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Rajesh Kumar (Managing Director)"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          placeholder="name@organization.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        Direct Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <PhoneCall className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: Goals & Schedule */}
              {step === 3 && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      Estimated Monthly Marketing/Growth Budget Range
                    </label>
                    <select
                      value={formData.monthlyRevenue}
                      onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                    >
                      <option>$2,500 - $5,000 / month</option>
                      <option>$5,000 - $15,000 / month</option>
                      <option>$15,000 - $50,000 / month</option>
                      <option>$50,000+ Enterprise / Multi-location</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      Primary 12-Month Target Growth Goal
                    </label>
                    <select
                      value={formData.primaryGoal}
                      onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                    >
                      <option>Scale qualified patient/booking inquiries by 2x-3x</option>
                      <option>Increase average contract / treatment case value by 20%+</option>
                      <option>Deploy AI automated qualification to reduce response times</option>
                      <option>Dominate regional search rankings and brand authority</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Non-disclosure guaranteed. Your business metrics remain 100% confidential.</span>
                  </div>

                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg flex items-center gap-2 ml-auto"
                >
                  <span>{step === 3 ? 'Submit Audit Request' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        ) : (
          /* Submission Confirmation Screen */
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                Growth Audit Request Received
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Thank you, <strong className="text-amber-400">{formData.contactName}</strong>. Our Senior Growth Architect for {formData.industry === 'healthcare' ? 'Healthcare' : 'Luxury Venues'} is reviewing <strong className="text-white">{formData.organizationName}</strong>'s profile.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs text-slate-300 space-y-2 max-w-md mx-auto">
              <div className="font-bold text-slate-200 border-b border-slate-800 pb-2">Audit Reservation Summary:</div>
              <div>• Sector: <span className="text-emerald-400 font-semibold">{formData.vertical}</span></div>
              <div>• Priority Goal: <span className="text-slate-200">{formData.primaryGoal}</span></div>
              <div>• Next Action: We will email your custom audit report to <span className="text-amber-400 font-semibold">{formData.email}</span> within 24 hours.</div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all"
            >
              Return to Website
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
