import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  ClientRecord,
  InvoiceRecord,
  InvoiceStatus,
  CurrencyCode,
  SUPPORTED_CURRENCIES
} from '../../types/finance';
import { financeService } from '../../services/financeService';

interface AdminCreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<
    InvoiceRecord,
    'id' | 'createdAt' | 'updatedAt' | 'amountPaid' | 'amountOutstanding' | 'calculatedStatus' | 'paymentsCount'
  >) => Promise<void>;
  clients: ClientRecord[];
  initialClient?: ClientRecord | null;
}

export const AdminCreateInvoiceModal: React.FC<AdminCreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clients,
  initialClient
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>('');
  const [amountSubtotal, setAmountSubtotal] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('0');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('INR');
  const [status, setStatus] = useState<InvoiceStatus>('sent');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate next invoice number and set default due date (+15 days)
  useEffect(() => {
    if (isOpen) {
      financeService.generateNextInvoiceNumber('MK').then(num => {
        setInvoiceNumber(num);
      });

      const today = new Date();
      const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
      setDueDate(in15Days.toISOString().split('T')[0]);

      if (initialClient) {
        setClientId(initialClient.id);
        setCurrencyCode(initialClient.currencyCode);
      } else if (clients.length > 0 && !clientId) {
        setClientId(clients[0].id);
        setCurrencyCode(clients[0].currencyCode);
      }
    }
  }, [isOpen, initialClient, clients]);

  // Sync currency when client changes
  useEffect(() => {
    if (clientId) {
      const selected = clients.find(c => c.id === clientId);
      if (selected) {
        setCurrencyCode(selected.currencyCode);
      }
    }
  }, [clientId, clients]);

  if (!isOpen) return null;

  const subtotal = parseFloat(amountSubtotal) || 0;
  const tax = parseFloat(taxRate) || 0;
  const taxAmount = Math.round((subtotal * (tax / 100)) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientId) {
      setErrorMessage('Please select a client account.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Invoice title is required.');
      return;
    }
    if (subtotal <= 0) {
      setErrorMessage('Invoice subtotal must be greater than zero.');
      return;
    }
    if (!dueDate) {
      setErrorMessage('Due date is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        clientId,
        invoiceNumber: invoiceNumber.trim(),
        title: title.trim(),
        issueDate,
        dueDate,
        amountSubtotal: subtotal,
        taxRate: tax,
        taxAmount,
        amountTotal: total,
        currencyCode,
        status,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create invoice');
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
              NEW BILLING RECEIVABLE
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Create Commercial Client Invoice
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
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

          {/* Invoice Number & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
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
          </div>

          {/* Title / Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Invoice Title / Engagement Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Healthcare Growth Partner Retainer — October 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Subtotal & Tax */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subtotal Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amountSubtotal}
                onChange={(e) => setAmountSubtotal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tax Rate (%) (e.g. 18% GST or 0%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Mathematical Summary Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">{currencyCode} {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax Amount:</span>
              <span className="font-mono">{currencyCode} {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
              <span>Total Invoice Amount:</span>
              <span className="font-mono">{currencyCode} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Initial Invoice Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-medium"
            >
              <option value="sent">Sent (Active Billing)</option>
              <option value="draft">Draft (Internal Review)</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Invoice Terms / Payment Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Payment due within 15 days via Wire Transfer or PayPal to payments@mkdigitalverse.com..."
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
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
