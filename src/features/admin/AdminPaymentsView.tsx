import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2,
  AlertTriangle,
  RotateCcw,
  XCircle
} from 'lucide-react';
import {
  PaymentRecord,
  PAYMENT_METHOD_LABELS,
  SUPPORTED_CURRENCIES,
  PaymentMethod,
  PaymentStatus
} from '../../types/finance';
import { FinanceExportService } from '../../services/financeExportService';

interface AdminPaymentsViewProps {
  payments: PaymentRecord[];
  onOpenRecordPayment: () => void;
  onRefresh: () => void;
  onUpdatePaymentStatus?: (paymentId: string, status: PaymentStatus) => Promise<void>;
}

export const AdminPaymentsView: React.FC<AdminPaymentsViewProps> = ({
  payments,
  onOpenRecordPayment,
  onRefresh,
  onUpdatePaymentStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const clientMatch = (p.clientName || '').toLowerCase().includes(q);
        const orgMatch = (p.organizationName || '').toLowerCase().includes(q);
        const invMatch = (p.invoiceNumber || '').toLowerCase().includes(q);
        const refMatch = (p.referenceNumber || '').toLowerCase().includes(q);
        if (!clientMatch && !orgMatch && !invMatch && !refMatch) return false;
      }

      if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) {
        return false;
      }

      if (currencyFilter !== 'all' && p.currencyCode !== currencyFilter) {
        return false;
      }

      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [payments, searchQuery, methodFilter, currencyFilter, statusFilter]);

  const currenciesPresent = useMemo(() => {
    return Array.from(new Set(payments.map(p => p.currencyCode)));
  }, [payments]);

  const handleStatusChange = async (paymentId: string, targetStatus: PaymentStatus) => {
    if (!onUpdatePaymentStatus) return;
    const actionLabel = targetStatus === 'refunded' ? 'refund' : 'reverse';
    if (!window.confirm(`Are you sure you want to mark this payment as ${actionLabel.toUpperCase()}? This will deduct the amount from realized income and restore the client's invoice outstanding balance.`)) {
      return;
    }

    try {
      setProcessingId(paymentId);
      await onUpdatePaymentStatus(paymentId, targetStatus);
    } catch (err: any) {
      alert(`Status update failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>COMPLETED</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <RotateCcw className="w-2.5 h-2.5" />
            <span>REFUNDED</span>
          </span>
        );
      case 'reversed':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-2.5 h-2.5" />
            <span>REVERSED</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getMethodBadge = (method: PaymentMethod) => {
    if (method === 'paypal') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <span className="font-bold">PayPal</span>
          <span className="text-[10px] opacity-75">(Intl)</span>
        </span>
      );
    }
    if (method === 'bank_transfer' || method === 'wire') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
          <Building2 className="w-3 h-3 text-slate-500" />
          <span>{method === 'wire' ? 'Wire Transfer' : 'Bank Transfer'}</span>
        </span>
      );
    }
    if (method === 'upi') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <span>UPI</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
        <CreditCard className="w-3 h-3 text-slate-400" />
        <span>{PAYMENT_METHOD_LABELS[method] || method}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Income & Realized Payments Ledger</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified incoming cash payments. Supports domestic rails (UPI, Bank Transfer) and international channels (PayPal, Wire).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => FinanceExportService.exportPayments(filteredPayments)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors min-h-[38px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Payments CSV</span>
            </button>

            <button
              onClick={onOpenRecordPayment}
              className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search client, org, invoice #, or PayPal / UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Payment Methods</option>
              <option value="paypal">PayPal (Primary International)</option>
              <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="wire">SWIFT Wire Transfer</option>
              <option value="upi">UPI (India)</option>
              <option value="razorpay">Razorpay</option>
              <option value="credit_card">Credit / Debit Card</option>
              <option value="check">Cheque</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Statuses ({payments.length})</option>
              <option value="completed">Completed (Valid Income)</option>
              <option value="refunded">Refunded (Excluded from Income)</option>
              <option value="reversed">Reversed (Excluded from Income)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Currency:</span>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Currencies</option>
              {currenciesPresent.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3.5 font-mono text-[11px]">Payment Date</th>
                <th className="py-3 px-3.5">Client & Healthcare Organization</th>
                <th className="py-3 px-3.5">Invoice Link</th>
                <th className="py-3 px-3.5">Payment Method</th>
                <th className="py-3 px-3.5 font-mono">Reference / Tx ID</th>
                <th className="py-3 px-3.5 text-right font-mono text-emerald-800">Gross Amount</th>
                <th className="py-3 px-3.5 text-right font-mono text-slate-500">Gateway Fee</th>
                <th className="py-3 px-3.5 text-right font-mono text-slate-900 font-bold">Net Settlement</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <DollarSign className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-xs text-slate-600">No payment records found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Record client payments or PayPal settlements using the button above.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const symbol = SUPPORTED_CURRENCIES.find(c => c.code === p.currencyCode)?.symbol || `${p.currencyCode} `;
                  const isVoid = p.status === 'refunded' || p.status === 'reversed';

                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/70 transition-colors ${isVoid ? 'opacity-65 bg-slate-50/40' : ''}`}>
                      <td className="py-3 px-3.5 font-mono whitespace-nowrap text-slate-700">
                        {p.paymentDate}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900">{p.organizationName}</div>
                        <div className="text-[11px] text-slate-500">{p.clientName}</div>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px]">
                        {p.invoiceNumber ? (
                          <span className="text-slate-900 font-semibold">{p.invoiceNumber}</span>
                        ) : (
                          <span className="text-slate-400 italic">Direct Client Income</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {getMethodBadge(p.paymentMethod)}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[11px] whitespace-nowrap text-slate-600">
                        {p.referenceNumber || '—'}
                      </td>
                      <td className={`py-3 px-3.5 text-right font-mono font-bold whitespace-nowrap ${
                        isVoid ? 'text-slate-400 line-through' : 'text-emerald-700'
                      }`}>
                        {symbol}{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-slate-500 whitespace-nowrap">
                        {p.feeAmount > 0 ? (
                          <span>-{symbol}{p.feeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className={`py-3 px-3.5 text-right font-mono font-bold whitespace-nowrap ${
                        isVoid ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}>
                        {symbol}{p.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        {p.status === 'completed' && onUpdatePaymentStatus && (
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleStatusChange(p.id, 'refunded')}
                              disabled={processingId === p.id}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                              title="Mark as refunded"
                            >
                              Refund
                            </button>
                            <button
                              onClick={() => handleStatusChange(p.id, 'reversed')}
                              disabled={processingId === p.id}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 transition-colors"
                              title="Mark as reversed"
                            >
                              Reverse
                            </button>
                          </div>
                        )}
                        {p.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(p.id, 'completed')}
                            disabled={processingId === p.id}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
                            title="Restore to completed"
                          >
                            Restore
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
