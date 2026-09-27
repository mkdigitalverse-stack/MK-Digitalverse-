import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  X
} from 'lucide-react';
import {
  InvoiceRecord,
  ClientRecord,
  InvoiceStatus,
  CurrencyCode,
  SUPPORTED_CURRENCIES
} from '../../types/finance';
import { FinanceExportService } from '../../services/financeExportService';

interface AdminInvoicesViewProps {
  invoices: InvoiceRecord[];
  clients: ClientRecord[];
  onOpenCreateInvoice: () => void;
  onRecordPaymentForInvoice: (invoice: InvoiceRecord) => void;
  onRefresh: () => void;
}

export const AdminInvoicesView: React.FC<AdminInvoicesViewProps> = ({
  invoices,
  clients,
  onOpenCreateInvoice,
  onRecordPaymentForInvoice,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const numMatch = inv.invoiceNumber.toLowerCase().includes(q);
        const titleMatch = inv.title.toLowerCase().includes(q);
        const clientMatch = (inv.clientName || '').toLowerCase().includes(q);
        const orgMatch = (inv.organizationName || '').toLowerCase().includes(q);
        if (!numMatch && !titleMatch && !clientMatch && !orgMatch) return false;
      }

      if (statusFilter !== 'all' && inv.calculatedStatus !== statusFilter) {
        return false;
      }

      if (currencyFilter !== 'all' && inv.currencyCode !== currencyFilter) {
        return false;
      }

      return true;
    });
  }, [invoices, searchQuery, statusFilter, currencyFilter]);

  const currenciesPresent = useMemo(() => {
    return Array.from(new Set(invoices.map(i => i.currencyCode)));
  }, [invoices]);

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>PAID</span>
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            <span>PARTIALLY PAID</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3" />
            <span>OVERDUE</span>
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span>SENT</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            <span>CANCELLED</span>
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
            <span>DRAFT</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Invoices & Receivables Ledger</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Formal client billing. Balances and payment statuses are derived dynamically from verified payment records.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => FinanceExportService.exportInvoices(filteredInvoices)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors min-h-[38px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Invoices CSV</span>
            </button>

            <button
              onClick={onOpenCreateInvoice}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice number, client, org, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Statuses ({invoices.length})</option>
              <option value="overdue">Overdue</option>
              <option value="sent">Sent / Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Fully Paid</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
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

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3.5 font-mono text-[11px]">Invoice #</th>
                <th className="py-3 px-3.5">Client & Organization</th>
                <th className="py-3 px-3.5">Title / Service</th>
                <th className="py-3 px-3.5">Issue / Due Date</th>
                <th className="py-3 px-3.5 text-right font-mono">Total Billed</th>
                <th className="py-3 px-3.5 text-right font-mono text-emerald-800">Paid</th>
                <th className="py-3 px-3.5 text-right font-mono text-blue-900">Outstanding</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-xs text-slate-600">No invoices match the selected criteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Create your first client invoice using the button above.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const symbol = SUPPORTED_CURRENCIES.find(c => c.code === inv.currencyCode)?.symbol || `${inv.currencyCode} `;
                  const hasOutstanding = inv.amountOutstanding > 0.01;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900">{inv.organizationName}</div>
                        <div className="text-[11px] text-slate-500">{inv.clientName}</div>
                      </td>
                      <td className="py-3 px-3.5 max-w-[200px] truncate" title={inv.title}>
                        {inv.title}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap text-[11px] text-slate-600 font-mono">
                        <div>Issued: {inv.issueDate}</div>
                        <div className={inv.calculatedStatus === 'overdue' ? 'text-red-600 font-bold' : 'text-slate-400'}>
                          Due: {inv.dueDate}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-semibold whitespace-nowrap">
                        {symbol}{inv.amountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                        {symbol}{inv.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-blue-900 whitespace-nowrap">
                        {symbol}{inv.amountOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(inv.calculatedStatus)}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {hasOutstanding && inv.status !== 'cancelled' && (
                            <button
                              onClick={() => onRecordPaymentForInvoice(inv)}
                              title="Record client payment against this invoice"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors flex items-center space-x-1"
                            >
                              <DollarSign className="w-3 h-3" />
                              <span>Pay</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-700 tracking-wider">
                  COMMERCIAL INVOICE
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedInvoice.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Client</span>
                  <div className="font-bold text-slate-900">{selectedInvoice.organizationName}</div>
                  <div className="text-slate-500 text-[11px]">{selectedInvoice.clientName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
                  <div>{getStatusBadge(selectedInvoice.calculatedStatus)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Issue Date</span>
                  <div className="font-mono text-slate-700">{selectedInvoice.issueDate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Due Date</span>
                  <div className="font-mono text-slate-700">{selectedInvoice.dueDate}</div>
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{selectedInvoice.currencyCode} {selectedInvoice.amountSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({selectedInvoice.taxRate}%):</span>
                  <span className="font-mono">{selectedInvoice.currencyCode} {selectedInvoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-1.5">
                  <span>Total Amount Billed:</span>
                  <span className="font-mono">{selectedInvoice.currencyCode} {selectedInvoice.amountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 pt-1">
                  <span>Payments Received ({selectedInvoice.paymentsCount}):</span>
                  <span className="font-mono">{selectedInvoice.currencyCode} {selectedInvoice.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-blue-900 border-t border-slate-100 pt-1.5">
                  <span>Outstanding Balance:</span>
                  <span className="font-mono">{selectedInvoice.currencyCode} {selectedInvoice.amountOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Notes</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              {selectedInvoice.amountOutstanding > 0.01 && (
                <button
                  onClick={() => {
                    const inv = selectedInvoice;
                    setSelectedInvoice(null);
                    onRecordPaymentForInvoice(inv);
                  }}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Record Payment Now
                </button>
              )}
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
