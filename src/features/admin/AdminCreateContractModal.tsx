import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  ContractRecord,
  ContractType,
  ContractStatus,
  BillingFrequency,
  CONTRACT_TYPE_LABELS,
  BILLING_FREQUENCY_LABELS
} from '../../types/contracts';
import { ClientRecord, CurrencyCode, SUPPORTED_CURRENCIES } from '../../types/finance';
import { contractService } from '../../services/contractService';

interface AdminCreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<
    ContractRecord,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'milestonesCount'
    | 'completedMilestonesCount'
    | 'overallProgressPercent'
    | 'totalBilled'
    | 'totalPaid'
    | 'totalOutstanding'
    | 'unbilledContractValue'
    | 'isOverdue'
  >) => Promise<void>;
  clients: ClientRecord[];
  initialClient?: ClientRecord | null;
  initialLeadId?: string | null;
}

export const AdminCreateContractModal: React.FC<AdminCreateContractModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clients,
  initialClient,
  initialLeadId
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [contractNumber, setContractNumber] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [contractType, setContractType] = useState<ContractType>('retainer');
  const [status, setStatus] = useState<ContractStatus>('draft');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('INR');
  const [contractValue, setContractValue] = useState<string>('');
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('monthly');
  const [paymentTermsDays, setPaymentTermsDays] = useState<number>(15);
  const [autoRenew, setAutoRenew] = useState<boolean>(false);
  const [renewalDate, setRenewalDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      contractService.generateNextContractNumber('MK-C').then(num => {
        setContractNumber(num);
      });

      if (initialClient) {
        setClientId(initialClient.id);
        setCurrencyCode(initialClient.currencyCode);
      } else if (clients.length > 0 && !clientId) {
        setClientId(clients[0].id);
        setCurrencyCode(clients[0].currencyCode);
      }

      const today = new Date();
      const inOneYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      setEndDate(inOneYear.toISOString().split('T')[0]);
    }
  }, [isOpen, initialClient, clients]);

  useEffect(() => {
    if (clientId) {
      const selected = clients.find(c => c.id === clientId);
      if (selected) {
        setCurrencyCode(selected.currencyCode);
      }
    }
  }, [clientId, clients]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientId) {
      setErrorMessage('Please select a client account.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Contract title is required.');
      return;
    }
    const numVal = parseFloat(contractValue) || 0;
    if (numVal < 0) {
      setErrorMessage('Contract value cannot be negative.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        clientId,
        leadId: initialLeadId || null,
        contractNumber: contractNumber.trim(),
        title: title.trim(),
        contractType,
        status,
        description: description.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        currencyCode,
        contractValue: numVal,
        billingFrequency,
        paymentTermsDays,
        autoRenew,
        renewalDate: autoRenew && renewalDate ? renewalDate : undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-700 tracking-wider">
              COMMERCIAL AGREEMENT
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Create Commercial Contract
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Account */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Client Account <span className="text-red-500">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="">Select client partner...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.organizationName} — {c.name} ({c.currencyCode})
                </option>
              ))}
            </select>
          </div>

          {/* Number & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contract Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contract Type <span className="text-red-500">*</span>
              </label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as ContractType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              >
                {Object.entries(CONTRACT_TYPE_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Contract Title / Engagement Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Healthcare Digital Growth Partnership — 2026/2027"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Value & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block font-semibold text-slate-700 mb-1">
                Currency <span className="text-red-500">*</span>
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

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Agreed Contract Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Billing Frequency & Payment Terms */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Billing Frequency
              </label>
              <select
                value={billingFrequency}
                onChange={(e) => setBillingFrequency(e.target.value as BillingFrequency)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              >
                {Object.entries(BILLING_FREQUENCY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Terms (Days)
              </label>
              <input
                type="number"
                min="0"
                value={paymentTermsDays}
                onChange={(e) => setPaymentTermsDays(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Term Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                End Date (Term)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Auto-renew Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Auto-Renewal Clause?</span>
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded focus:ring-0"
              />
            </div>
            {autoRenew && (
              <div className="pt-2 border-t border-slate-200 flex items-center space-x-2">
                <span className="text-slate-500">Renewal Notice Date:</span>
                <input
                  type="date"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  className="bg-white border border-slate-200 rounded p-1 text-xs font-mono"
                />
              </div>
            )}
          </div>

          {/* Description & Scope */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              High-Level Engagement Scope / Deliverables
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Growth marketing, SEO architecture, conversion rate optimization, patient acquisition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {isSubmitting ? 'Creating...' : 'Create Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
