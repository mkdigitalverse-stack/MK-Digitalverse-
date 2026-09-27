import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import {
  ClientRecord,
  ClientStatus,
  CurrencyCode,
  SUPPORTED_CURRENCIES
} from '../../types/finance';

interface AdminCreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: {
    leadId?: string;
    name?: string;
    organizationName?: string;
    email?: string;
    phone?: string;
    healthcareCategory?: string;
  } | null;
}

export const AdminCreateClientModal: React.FC<AdminCreateClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [healthcareCategory, setHealthcareCategory] = useState('hospital');
  const [billingAddress, setBillingAddress] = useState('');
  const [taxIdentifier, setTaxIdentifier] = useState('');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('INR');
  const [status, setStatus] = useState<ClientStatus>('active');
  const [contractStartDate, setContractStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [contractEndDate, setContractEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.organizationName) setOrganizationName(initialData.organizationName);
      if (initialData.email) setEmail(initialData.email);
      if (initialData.phone) setPhone(initialData.phone);
      if (initialData.healthcareCategory) setHealthcareCategory(initialData.healthcareCategory);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Contact person name is required.');
      return;
    }
    if (!organizationName.trim()) {
      setErrorMessage('Healthcare organization name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Billing contact email is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        leadId: initialData?.leadId || null,
        name: name.trim(),
        organizationName: organizationName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        healthcareCategory: healthcareCategory || undefined,
        billingAddress: billingAddress.trim() || undefined,
        taxIdentifier: taxIdentifier.trim() || undefined,
        currencyCode,
        status,
        contractStartDate: contractStartDate || undefined,
        contractEndDate: contractEndDate || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create client account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-700 tracking-wider">
              {initialData?.leadId ? 'CONVERT LEAD TO CLIENT' : 'NEW CLIENT ACCOUNT'}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {initialData?.leadId ? 'Onboard Won Partner as Client' : 'Add Healthcare Client Partner'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {initialData?.leadId && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Commercial Relationship Creation</span>
              <span className="text-[11px] text-emerald-700">
                Converting this won lead creates a permanent commercial client record while retaining origin lead telemetry. No automatic invoices or payments are fabricated.
              </span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Organization & Contact Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Organization / Hospital <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apollo Hospitals / Care IVF"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Billing Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="accounts@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Healthcare Category & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Healthcare Category
              </label>
              <select
                value={healthcareCategory}
                onChange={(e) => setHealthcareCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-medium capitalize"
              >
                <option value="hospital">Hospital / Medical Center</option>
                <option value="ivf_fertility">IVF & Fertility Center</option>
                <option value="dental">Dental Network</option>
                <option value="surgical">Surgical Specialty</option>
                <option value="specialty_clinic">Specialty Clinic</option>
                <option value="diagnostic">Diagnostic & Pathology</option>
                <option value="other_healthcare">Other Healthcare</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Primary Billing Currency <span className="text-red-500">*</span>
              </label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-mono font-bold focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tax ID & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tax Identifier (GSTIN / VAT / Tax ID)
              </label>
              <input
                type="text"
                placeholder="e.g. 07AAAAA0000A1Z5"
                value={taxIdentifier}
                onChange={(e) => setTaxIdentifier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-medium"
              >
                <option value="active">Active Client</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed Contract</option>
                <option value="churned">Churned</option>
              </select>
            </div>
          </div>

          {/* Contract Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contract Start Date
              </label>
              <input
                type="date"
                value={contractStartDate}
                onChange={(e) => setContractStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contract End Date (Optional)
              </label>
              <input
                type="date"
                value={contractEndDate}
                onChange={(e) => setContractEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Billing Address
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Registered Hospital Address, City, State, Country..."
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Commercial / Engagement Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Growth partner deliverables, retainer terms, primary doctor contact..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Client Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
