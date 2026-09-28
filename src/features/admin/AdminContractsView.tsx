import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Building2,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import {
  ContractRecord,
  ContractStatus,
  ContractType,
  CONTRACT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS
} from '../../types/contracts';
import { ClientRecord, SUPPORTED_CURRENCIES, CurrencyCode } from '../../types/finance';
import { ContractExportService } from '../../services/contractExportService';

interface AdminContractsViewProps {
  contracts: ContractRecord[];
  clients: ClientRecord[];
  onOpenCreateContract: () => void;
  onSelectContract: (contract: ContractRecord) => void;
  onOpenClientPortal: (client: ClientRecord) => void;
  onRefresh: () => void;
}

export const AdminContractsView: React.FC<AdminContractsViewProps> = ({
  contracts,
  clients,
  onOpenCreateContract,
  onSelectContract,
  onOpenClientPortal,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const numMatch = c.contractNumber.toLowerCase().includes(q);
        const titleMatch = c.title.toLowerCase().includes(q);
        const clientMatch = (c.clientName || '').toLowerCase().includes(q);
        const orgMatch = (c.organizationName || '').toLowerCase().includes(q);
        if (!numMatch && !titleMatch && !clientMatch && !orgMatch) return false;
      }

      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }

      if (typeFilter !== 'all' && c.contractType !== typeFilter) {
        return false;
      }

      if (currencyFilter !== 'all' && c.currencyCode !== currencyFilter) {
        return false;
      }

      return true;
    });
  }, [contracts, searchQuery, statusFilter, typeFilter, currencyFilter]);

  // Operational metrics
  const activeContractsCount = useMemo(() => {
    return contracts.filter(c => c.status === 'active').length;
  }, [contracts]);

  const overdueMilestonesCount = useMemo(() => {
    return contracts.filter(c => c.isOverdue).length;
  }, [contracts]);

  const currenciesPresent = useMemo(() => {
    return Array.from(new Set(contracts.map(c => c.currencyCode)));
  }, [contracts]);

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>ACTIVE</span>
          </span>
        );
      case 'pending_signature':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>PENDING SIGNATURE</span>
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>PAUSED</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <ShieldCheck className="w-3 h-3" />
            <span>COMPLETED</span>
          </span>
        );
      case 'terminated':
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <span>{status.toUpperCase()}</span>
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            <span>EXPIRED</span>
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
    <div className="space-y-5">
      {/* Header with Operational KPI Cards */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded tracking-wider">
                COMMERCIAL AGREEMENTS & DELIVERABLES
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">ADM-06 Production System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Contracts & Delivery Milestones
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured client agreements, project milestones, delivery tracking, and client portal foundations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => ContractExportService.exportContracts(filteredContracts)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors min-h-[38px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenCreateContract}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Contract</span>
            </button>
          </div>
        </div>

        {/* Operational Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              TOTAL CONTRACTS
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">
              {contracts.length}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              ACTIVE CONTRACTS
            </span>
            <span className="text-lg font-bold font-mono text-emerald-950 mt-0.5 block">
              {activeContractsCount}
            </span>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              PENDING SIGNATURE
            </span>
            <span className="text-lg font-bold font-mono text-amber-950 mt-0.5 block">
              {contracts.filter(c => c.status === 'pending_signature').length}
            </span>
          </div>

          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
              OVERDUE TERM / MILESTONES
            </span>
            <span className="text-lg font-bold font-mono text-rose-950 mt-0.5 block">
              {overdueMilestonesCount}
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contract #, title, client, or org..."
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
              <option value="all">All Statuses ({contracts.length})</option>
              <option value="active">Active</option>
              <option value="pending_signature">Pending Signature</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Engagement Types</option>
              <option value="retainer">Monthly Retainer</option>
              <option value="project">Fixed-Scope Project</option>
              <option value="milestone_project">Milestone Engagement</option>
              <option value="one_time">One-Time Audit</option>
              <option value="subscription">Subscription</option>
              <option value="custom">Custom Agreement</option>
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

      {/* Contracts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3.5 font-mono text-[11px]">Contract #</th>
                <th className="py-3 px-3.5">Healthcare Partner & Org</th>
                <th className="py-3 px-3.5">Engagement Title & Type</th>
                <th className="py-3 px-3.5">Term (Start - End)</th>
                <th className="py-3 px-3.5 text-right font-mono">Contract Value</th>
                <th className="py-3 px-3.5 text-center">Milestones Progress</th>
                <th className="py-3 px-3.5 text-right font-mono text-emerald-800">Billed / Paid</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-xs text-slate-600">No contract records found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Create a commercial contract using the button above or onboard a won lead.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((c) => {
                  const symbol = SUPPORTED_CURRENCIES.find(curr => curr.code === c.currencyCode)?.symbol || `${c.currencyCode} `;
                  const clientObj = clients.find(cl => cl.id === c.clientId);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {c.contractNumber}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900">{c.organizationName}</div>
                        <div className="text-[11px] text-slate-500">{c.clientName}</div>
                      </td>
                      <td className="py-3 px-3.5 max-w-[220px]">
                        <div className="font-semibold text-slate-900 truncate" title={c.title}>{c.title}</div>
                        <div className="text-[11px] text-slate-500">{CONTRACT_TYPE_LABELS[c.contractType] || c.contractType}</div>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        <div>Start: {c.startDate || 'Immediate'}</div>
                        <div className={c.isOverdue ? 'text-red-600 font-bold' : 'text-slate-400'}>
                          End: {c.endDate || 'Ongoing'}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {symbol}{c.contractValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono text-[11px] font-bold text-slate-800">
                            {c.completedMilestonesCount}/{c.milestonesCount} ({c.overallProgressPercent}%)
                          </span>
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${c.overallProgressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono whitespace-nowrap text-[11px]">
                        <div className="text-slate-900 font-semibold">
                          Billed: {symbol}{c.totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-emerald-700">
                          Paid: {symbol}{c.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onSelectContract(c)}
                            title="Open contract workspace and milestones"
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold transition-colors flex items-center space-x-1"
                          >
                            <Layers className="w-3 h-3" />
                            <span>Milestones</span>
                          </button>

                          {clientObj && (
                            <button
                              onClick={() => onOpenClientPortal(clientObj)}
                              title="Preview secure Client Portal view"
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
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
    </div>
  );
};
