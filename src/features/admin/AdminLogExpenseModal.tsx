import React, { useState } from 'react';
import {
  X,
  TrendingDown,
  AlertCircle,
  Building,
  Tag,
  Repeat
} from 'lucide-react';
import {
  ExpenseRecord,
  ExpenseCategory,
  EXPENSE_CATEGORY_LABELS,
  CurrencyCode,
  SUPPORTED_CURRENCIES
} from '../../types/finance';

interface AdminLogExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const AdminLogExpenseModal: React.FC<AdminLogExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('advertising');
  const [amount, setAmount] = useState('');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('INR');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendor, setVendor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Expense title is required.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Expense amount must be greater than zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        category,
        amount: numAmount,
        currencyCode,
        expenseDate,
        vendor: vendor.trim() || undefined,
        paymentMethod: paymentMethod || undefined,
        isRecurring,
        recurringPeriod: isRecurring ? recurringPeriod : undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to log expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-rose-700 tracking-wider">
              OPERATIONAL OUTFLOW
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Log Business Cost / Expense
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
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Expense Title / Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Google Ads Healthcare Campaign, Vercel Hosting, Copywriter..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Category & Vendor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-medium"
              >
                {Object.entries(EXPENSE_CATEGORY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Vendor / Service Provider
              </label>
              <input
                type="text"
                placeholder="e.g. Google LLC, OpenAI, Freelancer..."
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Amount & Currency */}
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
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Amount Spent <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Date & Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expense Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Method Used
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-medium"
              >
                <option value="credit_card">Corporate Credit Card</option>
                <option value="bank_transfer">Company Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="paypal">PayPal</option>
                <option value="wire">Wire Transfer</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Recurring Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Recurring Expense?</span>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded focus:ring-0"
              />
            </div>
            {isRecurring && (
              <div className="pt-2 border-t border-slate-200 flex items-center space-x-2">
                <span className="text-slate-500">Billing Cycle:</span>
                <select
                  value={recurringPeriod}
                  onChange={(e) => setRecurringPeriod(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded p-1 text-xs"
                >
                  <option value="monthly">Monthly Subscription</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly License</option>
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Notes / Tax Reference
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Invoice # from vendor, receipt reference..."
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Logging...' : 'Log Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
