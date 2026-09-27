import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  AlertCircle,
  Building2,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  ClientRecord,
  InvoiceRecord,
  PaymentMethod,
  PAYMENT_METHOD_LABELS,
  CurrencyCode,
  SUPPORTED_CURRENCIES
} from '../../types/finance';

interface AdminRecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    clientId: string;
    invoiceId?: string | null;
    paymentDate: string;
    amount: number;
    feeAmount: number;
    currencyCode: CurrencyCode;
    paymentMethod: PaymentMethod;
    referenceNumber?: string;
    notes?: string;
  }) => Promise<void>;
  clients: ClientRecord[];
  invoices: InvoiceRecord[];
  initialInvoice?: InvoiceRecord | null;
  initialClient?: ClientRecord | null;
}

export const AdminRecordPaymentModal: React.FC<AdminRecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clients,
  invoices,
  initialInvoice,
  initialClient
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<string>('');
  const [feeAmount, setFeeAmount] = useState<string>('0');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('INR');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initial selections when opening
  useEffect(() => {
    if (initialInvoice) {
      setClientId(initialInvoice.clientId);
      setInvoiceId(initialInvoice.id);
      setCurrencyCode(initialInvoice.currencyCode);
      setAmount(initialInvoice.amountOutstanding.toString());
    } else if (initialClient) {
      setClientId(initialClient.id);
      setCurrencyCode(initialClient.currencyCode);
    } else if (clients.length > 0 && !clientId) {
      setClientId(clients[0].id);
      setCurrencyCode(clients[0].currencyCode);
    }
  }, [initialInvoice, initialClient, clients]);

  // When selected invoice changes, lock currency to invoice currency
  useEffect(() => {
    if (invoiceId) {
      const inv = invoices.find(i => i.id === invoiceId);
      if (inv) {
        setCurrencyCode(inv.currencyCode);
        if (!amount || Number(amount) <= 0) {
          setAmount(inv.amountOutstanding.toString());
        }
      }
    }
  }, [invoiceId, invoices]);

  if (!isOpen) return null;

  // Invoices eligible for this client with remaining balance
  const clientInvoices = invoices.filter(
    i => i.clientId === clientId && i.status !== 'cancelled' && i.amountOutstanding > 0.01
  );

  const selectedInvoice = invoices.find(i => i.id === invoiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientId) {
      setErrorMessage('Please select a client account.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Payment amount must be greater than zero.');
      return;
    }

    if (selectedInvoice && numAmount > selectedInvoice.amountOutstanding + 0.01) {
      setErrorMessage(
        `Payment amount exceeds the invoice outstanding balance (${selectedInvoice.currencyCode} ${selectedInvoice.amountOutstanding.toLocaleString()}).`
      );
      return;
    }

    const numFee = parseFloat(feeAmount) || 0;
    if (numFee < 0) {
      setErrorMessage('Fee amount cannot be negative.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        clientId,
        invoiceId: invoiceId || null,
        paymentDate,
        amount: numAmount,
        feeAmount: numFee,
        currencyCode,
        paymentMethod,
        referenceNumber: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 tracking-wider">
              REALIZED CASH INCOME
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Record Client Payment / Settlement
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
          {/* Client Account Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Client Account <span className="text-red-500">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setInvoiceId('');
              }}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="">Select a healthcare client partner...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.organizationName} — {c.name} ({c.currencyCode})
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Linkage (Optional / Direct) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Link to Invoice (Optional)
            </label>
            <select
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-mono focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="">No Invoice Link (Direct Client Payment)</option>
              {clientInvoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.title} (Due: {inv.dueDate} • Outstanding: {inv.currencyCode} {inv.amountOutstanding.toLocaleString()})
                </option>
              ))}
            </select>
            {selectedInvoice && (
              <p className="text-[11px] text-blue-700 mt-1 font-mono">
                Currency locked to invoice ({selectedInvoice.currencyCode}). Remaining: {selectedInvoice.currencyCode} {selectedInvoice.amountOutstanding.toLocaleString()}
              </p>
            )}
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
                disabled={Boolean(invoiceId)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-mono font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-hidden disabled:opacity-75"
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Gross Client Payment <span className="text-red-500">*</span>
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

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Channel / Method <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-medium"
              >
                <option value="paypal">PayPal (Primary International Rail)</option>
                <option value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                <option value="wire">SWIFT Wire Transfer</option>
                <option value="upi">UPI (India)</option>
                <option value="razorpay">Razorpay</option>
                <option value="credit_card">Credit / Debit Card</option>
                <option value="check">Cheque</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Reference & PayPal Fee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {paymentMethod === 'paypal' ? 'PayPal Tx / Order ID' : 'Reference / UTR / Check #'}
              </label>
              <input
                type="text"
                placeholder={paymentMethod === 'paypal' ? 'e.g. 9X7281920B718291A' : 'UTR or transaction reference'}
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gateway Processing Fee (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-600 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {paymentMethod === 'paypal' && (
            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 space-y-0.5">
              <span className="font-semibold block">PayPal Settlement Protocol:</span>
              <p className="text-blue-800">
                The full gross payment ({currencyCode} {amount || '0'}) will credit the client invoice. PayPal processing fees are treated as an operating cost and do NOT reduce the client's invoice credit.
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Settlement Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Client wire transfer received into HDFC bank account..."
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
