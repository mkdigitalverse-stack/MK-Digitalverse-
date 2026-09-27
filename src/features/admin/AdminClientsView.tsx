import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  FileSpreadsheet,
  DollarSign,
  Eye,
  X,
  ExternalLink,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  ClientRecord,
  InvoiceRecord,
  PaymentRecord,
  ClientFinancialProfile,
  SUPPORTED_CURRENCIES
} from '../../types/finance';

interface AdminClientsViewProps {
  clients: ClientRecord[];
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  onOpenCreateClient: () => void;
  onOpenCreateInvoiceForClient: (client: ClientRecord) => void;
  onOpenRecordPaymentForClient: (client: ClientRecord) => void;
  onRefresh: () => void;
}

export const AdminClientsView: React.FC<AdminClientsViewProps> = ({
  clients,
  invoices,
  payments,
  onOpenCreateClient,
  onOpenCreateInvoiceForClient,
  onOpenRecordPaymentForClient,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);

  // Compute live financial totals per client
  const clientFinancialMap = useMemo(() => {
    const map = new Map<string, { totalBilled: number; totalPaid: number; totalOutstanding: number }>();
    clients.forEach(c => {
      const clientInvoices = invoices.filter(i => i.clientId === c.id && i.status !== 'cancelled');
      const clientPayments = payments.filter(p => p.clientId === c.id && p.status === 'completed');

      const totalBilled = clientInvoices.reduce((sum, i) => sum + i.amountTotal, 0);
      const totalPaid = clientPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalOutstanding = Math.max(0, Math.round((totalBilled - totalPaid) * 100) / 100);

      map.set(c.id, { totalBilled, totalPaid, totalOutstanding });
    });
    return map;
  }, [clients, invoices, payments]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = c.name.toLowerCase().includes(q);
        const orgMatch = c.organizationName.toLowerCase().includes(q);
        const emailMatch = c.email.toLowerCase().includes(q);
        const categoryMatch = (c.healthcareCategory || '').toLowerCase().includes(q);
        if (!nameMatch && !orgMatch && !emailMatch && !categoryMatch) return false;
      }

      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [clients, searchQuery, statusFilter]);

  const selectedClientInvoices = useMemo(() => {
    if (!selectedClient) return [];
    return invoices.filter(i => i.clientId === selectedClient.id);
  }, [selectedClient, invoices]);

  const selectedClientPayments = useMemo(() => {
    if (!selectedClient) return [];
    return payments.filter(p => p.clientId === selectedClient.id);
  }, [selectedClient, payments]);

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Commercial Client Accounts Directory</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Active healthcare partners with commercial agreements. Distinct from sales leads; tracks lifetime value and receivables.
            </p>
          </div>

          <button
            onClick={onOpenCreateClient}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client Account</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client contact, hospital, clinic, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Clients ({clients.length})</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="churned">Churned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3.5">Healthcare Organization & Partner</th>
                <th className="py-3 px-3.5">Contact Details</th>
                <th className="py-3 px-3.5">Healthcare Specialty</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right font-mono">Total Billed</th>
                <th className="py-3 px-3.5 text-right font-mono text-emerald-800">Paid (LTV)</th>
                <th className="py-3 px-3.5 text-right font-mono text-blue-900">Outstanding</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-xs text-slate-600">No client accounts found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Add a commercial partner account or convert a signed lead from the CRM pipeline.</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const fin = clientFinancialMap.get(client.id) || { totalBilled: 0, totalPaid: 0, totalOutstanding: 0 };
                  const symbol = SUPPORTED_CURRENCIES.find(c => c.code === client.currencyCode)?.symbol || `${client.currencyCode} `;

                  return (
                    <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900">{client.organizationName}</div>
                        <div className="text-[11px] text-slate-500">{client.name}</div>
                      </td>
                      <td className="py-3 px-3.5 text-[11px] text-slate-600">
                        <div>{client.email}</div>
                        {client.phone && <div className="text-slate-400">{client.phone}</div>}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap capitalize text-slate-600">
                        {client.healthcareCategory?.replace('_', ' ') || 'Healthcare'}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          client.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          client.status === 'paused' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-semibold whitespace-nowrap">
                        {symbol}{fin.totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                        {symbol}{fin.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-blue-900 whitespace-nowrap">
                        {symbol}{fin.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onOpenCreateInvoiceForClient(client)}
                            title="Issue new invoice for client"
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1"
                          >
                            <FileSpreadsheet className="w-3 h-3 text-slate-500" />
                            <span>Invoice</span>
                          </button>
                          <button
                            onClick={() => onOpenRecordPaymentForClient(client)}
                            title="Record payment from client"
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1"
                          >
                            <DollarSign className="w-3 h-3 text-emerald-600" />
                            <span>Pay</span>
                          </button>
                          <button
                            onClick={() => setSelectedClient(client)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="View client financial profile"
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

      {/* Client Financial Profile Slide-Over / Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-700 tracking-wider">
                  CLIENT FINANCIAL PROFILE
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedClient.organizationName}
                </h3>
                <p className="text-xs text-slate-500">{selectedClient.name} • {selectedClient.email}</p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Financial Lifetime Summary */}
            {(() => {
              const fin = clientFinancialMap.get(selectedClient.id) || { totalBilled: 0, totalPaid: 0, totalOutstanding: 0 };
              const symbol = SUPPORTED_CURRENCIES.find(c => c.code === selectedClient.currencyCode)?.symbol || `${selectedClient.currencyCode} `;
              return (
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">TOTAL BILLED</span>
                    <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                      {symbol}{fin.totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">PAID (LTV)</span>
                    <span className="text-base font-bold font-mono text-emerald-700 mt-0.5 block">
                      {symbol}{fin.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-900 block">OUTSTANDING</span>
                    <span className="text-base font-bold font-mono text-blue-900 mt-0.5 block">
                      {symbol}{fin.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Invoices List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Invoices History ({selectedClientInvoices.length})
              </h4>
              {selectedClientInvoices.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-400 text-center">
                  No invoices issued for this client yet.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedClientInvoices.map(inv => (
                    <div key={inv.id} className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                        <span className="text-slate-500 ml-2">{inv.title}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-slate-900">
                          {inv.currencyCode} {inv.amountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white border border-slate-200">
                          {inv.calculatedStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payments List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Payments History ({selectedClientPayments.length})
              </h4>
              {selectedClientPayments.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-400 text-center">
                  No payments recorded for this client yet.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedClientPayments.map(p => (
                    <div key={p.id} className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-slate-500">{p.paymentDate}</span>
                        <span className="font-medium text-slate-800 ml-2 capitalize">{p.paymentMethod}</span>
                        {p.referenceNumber && <span className="font-mono text-slate-400 ml-2">({p.referenceNumber})</span>}
                      </div>
                      <div className="font-mono font-bold text-emerald-700">
                        {p.currencyCode} {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  const client = selectedClient;
                  setSelectedClient(null);
                  onOpenCreateInvoiceForClient(client);
                }}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Create Invoice
              </button>
              <button
                onClick={() => {
                  const client = selectedClient;
                  setSelectedClient(null);
                  onOpenRecordPaymentForClient(client);
                }}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Record Payment
              </button>
              <button
                onClick={() => setSelectedClient(null)}
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
