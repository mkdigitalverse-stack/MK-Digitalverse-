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
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface AdminCreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (lead: CompleteLeadRecord) => void;
  onViewExisting?: (leadId: string) => void;
}

export const AdminCreateLeadModal: React.FC<AdminCreateLeadModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  onViewExisting
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
  const [nextFollowUpRemark, setNextFollowUpRemark] = useState<string>('Call Back Requested');

  // Duplicate warning modal state
  const [duplicateWarningOpen, setDuplicateWarningOpen] = useState<boolean>(false);
  const [duplicateMatch, setDuplicateMatch] = useState<CompleteLeadRecord | null>(null);

  // UI status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setDuplicateMatch(null);
      setDuplicateWarningOpen(false);
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
    setDuplicateWarningOpen(false);
    setErrorMessage(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const executeLeadCreation = async () => {
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

    // Check for potential duplicate using normalized email, phone, and org + contact
    const foundDuplicate = adminLeadsService.checkDuplicateLead({
      email,
      phone,
      contactName,
      organizationName
    });

    if (foundDuplicate) {
      setDuplicateMatch(foundDuplicate);
      setDuplicateWarningOpen(true);
      return;
    }

    await executeLeadCreation();
  };

  const handleCreateAnyway = async () => {
    setDuplicateWarningOpen(false);
    await executeLeadCreation();
  };

  const handleViewExisting = () => {
    if (duplicateMatch && onViewExisting) {
      onViewExisting(duplicateMatch.leadId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
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
              Add New Lead
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-slate-800 text-xs">
          
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
              <span>Required Details</span>
              <span className="text-[10px] text-amber-700 font-mono font-semibold">* Marked fields are required</span>
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

          {/* SECTION 2: OPTIONAL ORGANIZATION & QUALIFICATION DETAILS */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
              Organization & Practice Profile
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Healthcare Category
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
                  placeholder="https://apexortho.com"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Biggest Growth Challenge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inadequate high-value patient volume"
                  value={biggestChallenge}
                  onChange={(e) => setBiggestChallenge(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Growth Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Expand surgical caseload by 30%"
                  value={growthObjective}
                  onChange={(e) => setGrowthObjective(e.target.value)}
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
                  placeholder="e.g. Dr. K. Mehta"
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
                placeholder="Initial context, referral source details, or specific requirements..."
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
                  Schedule Initial Follow-Up
                </span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Optional</span>
            </div>

            {shouldScheduleFollowUp && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 animate-in fade-in duration-100">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Next Follow-Up Date
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
                    Next Follow-Up Time
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
                    Follow-Up Remark
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
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md transition-colors disabled:opacity-50 min-h-[40px] flex items-center space-x-1.5"
            >
              <Plus className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? 'Creating Lead...' : 'Create Lead'}</span>
            </button>
          </div>

        </form>

        {/* MODAL OVERLAY: DUPLICATE LEAD PROTECTION (ADM-10 Section 4) */}
        {duplicateWarningOpen && duplicateMatch && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
            <div className="bg-white rounded-xl border border-amber-300 shadow-2xl p-5 max-w-md w-full space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Possible Existing Lead
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    A lead with this email/phone already exists.
                  </p>
                </div>
              </div>

              {/* Existing Lead Summary Card */}
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-slate-900">
                  {duplicateMatch.visitorData.contactName}
                </div>
                <div className="text-slate-600">
                  Org: <strong>{duplicateMatch.visitorData.organizationName || 'N/A'}</strong>
                </div>
                <div className="text-slate-600 font-mono text-[11px]">
                  Email: {duplicateMatch.visitorData.email} | Phone: {duplicateMatch.visitorData.phone || 'N/A'}
                </div>
                <div className="text-[11px] text-amber-800 font-semibold pt-1">
                  Stage: <span className="uppercase">{duplicateMatch.status}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                You can view the existing lead, proceed with creating a separate opportunity, or cancel.
              </div>

              {/* Action buttons: [View Existing Lead] [Create Anyway] [Cancel] */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {onViewExisting ? (
                  <button
                    type="button"
                    onClick={handleViewExisting}
                    className="px-2 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors truncate"
                  >
                    View Existing Lead
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDuplicateWarningOpen(false)}
                    className="px-2 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors truncate"
                  >
                    View Lead
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCreateAnyway}
                  disabled={isSubmitting}
                  className="px-2 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold text-center transition-colors truncate"
                >
                  Create Anyway
                </button>

                <button
                  type="button"
                  onClick={() => setDuplicateWarningOpen(false)}
                  className="px-2 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium text-center transition-colors truncate"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
