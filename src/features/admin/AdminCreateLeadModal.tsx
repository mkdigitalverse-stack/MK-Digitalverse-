import React, { useState, useEffect } from 'react';
import { 
  CompleteLeadRecord, 
  LeadPriority, 
  FOLLOW_UP_REMARK_OPTIONS 
} from '../../services/qualification';
import { adminLeadsService, ManualLeadInput } from '../../services/adminLeadsService';
import { 
  X, 
  Plus, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Globe, 
  MapPin, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  DollarSign, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AdminCreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (lead: CompleteLeadRecord) => void;
}

export const AdminCreateLeadModal: React.FC<AdminCreateLeadModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  // Required fields
  const [contactName, setContactName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');

  // Optional qualification fields
  const [website, setWebsite] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [healthcareCategory, setHealthcareCategory] = useState<string>('specialty_clinic');
  const [biggestChallenge, setBiggestChallenge] = useState<string>('');
  const [growthObjective, setGrowthObjective] = useState<string>('');
  const [estimatedOpportunityValue, setEstimatedOpportunityValue] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [leadPriority, setLeadPriority] = useState<LeadPriority>('normal');
  const [nextAction, setNextAction] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');

  // Optional Follow-up Scheduling during creation
  const [shouldScheduleFollowUp, setShouldScheduleFollowUp] = useState<boolean>(false);
  const [nextFollowUpDate, setNextFollowUpDate] = useState<string>('');
  const [nextFollowUpTime, setNextFollowUpTime] = useState<string>('10:00');
  const [nextFollowUpRemark, setNextFollowUpRemark] = useState<string>('Initial Outreach & Qualification Review');

  // UI status
  const [duplicateMatch, setDuplicateMatch] = useState<CompleteLeadRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setDuplicateMatch(null);
      return;
    }
    setContactName('');
    setEmail('');
    setPhone('');
    setOrganizationName('');
    setWebsite('');
    setLocation('');
    setHealthcareCategory('specialty_clinic');
    setBiggestChallenge('');
    setGrowthObjective('');
    setEstimatedOpportunityValue('');
    setCurrency('USD');
    setAssignedTo('');
    setLeadPriority('normal');
    setNextAction('');
    setInternalNotes('');
    setShouldScheduleFollowUp(false);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setNextFollowUpDate(`${tomorrow.getFullYear()}-${mm}-${dd}`);
    setNextFollowUpTime('10:00');
    setNextFollowUpRemark('Call Back Requested');
    setDuplicateMatch(null);
    setErrorMessage(null);
  }, [isOpen]);

  // Live duplicate email check
  useEffect(() => {
    if (email && email.includes('@') && email.length > 5) {
      const match = adminLeadsService.checkDuplicateEmail(email);
      setDuplicateMatch(match);
    } else {
      setDuplicateMatch(null);
    }
  }, [email]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!contactName.trim()) {
      setErrorMessage('Contact Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('A valid Email address is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Phone Number is required.');
      return;
    }
    if (!organizationName.trim()) {
      setErrorMessage('Organization Name is required.');
      return;
    }

    const payload: ManualLeadInput = {
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      organizationName: organizationName.trim(),
      website: website.trim() || undefined,
      location: location.trim() || undefined,
      healthcareCategory: healthcareCategory || undefined,
      biggestChallenge: biggestChallenge.trim() || undefined,
      growthObjective: growthObjective.trim() || undefined,
      estimatedOpportunityValue: estimatedOpportunityValue ? Number(estimatedOpportunityValue) : undefined,
      currency,
      assignedTo: assignedTo.trim() || undefined,
      leadPriority,
      nextAction: nextAction.trim() || undefined,
      internalNotes: internalNotes.trim() || undefined,
      ...(shouldScheduleFollowUp && nextFollowUpDate && nextFollowUpTime ? {
        nextFollowUpDate,
        nextFollowUpTime,
        nextFollowUpRemark
      } : {})
    };

    setIsSubmitting(true);
    try {
      const newLead = await adminLeadsService.createManualLead(payload);
      onCreated(newLead);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create manual lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-lead-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-start justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Admin Manual Intake
            </span>
            <h2 id="create-lead-title" className="text-base font-bold text-white tracking-tight mt-0.5">
              + Add Lead
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Directly onboard a prospective healthcare partner into the sales pipeline.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800 text-xs">
          
          {/* Duplicate Email Warning */}
          {duplicateMatch && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5 shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Duplicate Contact Warning</span>
                <span className="text-[11px] text-amber-800">
                  A lead with email <strong>{email}</strong> already exists in CRM: 
                  {' '}<span className="font-mono font-semibold">{duplicateMatch.visitorData.contactName} ({duplicateMatch.visitorData.organizationName || 'No Org'})</span>. 
                  Proceeding will register an additional sales record.
                </span>
              </div>
            </div>
          )}

          {/* Validation Feedback Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SECTION 1: REQUIRED CONTACT INFORMATION */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>Required Contact & Practice Details</span>
              <span className="text-[10px] text-amber-700 font-mono font-normal">* Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Organization / Clinic Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Orthopedic Hospital"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. contact@apexortho.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: OPTIONAL PRACTICE CONTEXT */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
              Practice Profile & Opportunity
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Healthcare Specialty
                </label>
                <select
                  value={healthcareCategory}
                  onChange={(e) => setHealthcareCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="hospital">Hospital & Health System</option>
                  <option value="specialty_clinic">Specialty Clinic</option>
                  <option value="ivf_fertility">IVF & Fertility Center</option>
                  <option value="dental">Dental Practice</option>
                  <option value="surgical">Surgical Center</option>
                  <option value="diagnostic">Diagnostic & Lab Center</option>
                  <option value="other_healthcare">Other Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Practice Website
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Estimated Value
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={estimatedOpportunityValue}
                  onChange={(e) => setEstimatedOpportunityValue(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={leadPriority}
                  onChange={(e) => setLeadPriority(e.target.value as LeadPriority)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Assigned Growth Partner
                </label>
                <input
                  type="text"
                  placeholder="Growth Partner Name"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Next Action
                </label>
                <input
                  type="text"
                  placeholder="e.g. Initial diagnostic review"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Internal Sales Notes
              </label>
              <textarea
                rows={2}
                placeholder="Initial context, referral details, or special requirements..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          {/* SECTION 3: OPTIONAL IMMEDIATE FOLLOW-UP SCHEDULING */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shouldScheduleFollowUp}
                  onChange={(e) => setShouldScheduleFollowUp(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">
                  Schedule Initial Follow-Up Now
                </span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Optional</span>
            </div>

            {shouldScheduleFollowUp && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 animate-in fade-in duration-100">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    required={shouldScheduleFollowUp}
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Follow-Up Time
                  </label>
                  <input
                    type="time"
                    required={shouldScheduleFollowUp}
                    value={nextFollowUpTime}
                    onChange={(e) => setNextFollowUpTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Remark Option
                  </label>
                  <select
                    value={nextFollowUpRemark}
                    onChange={(e) => setNextFollowUpRemark(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    {FOLLOW_UP_REMARK_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 min-h-[40px] flex items-center space-x-1.5"
            >
              <Plus className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? 'Creating Lead...' : 'Create Lead'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
