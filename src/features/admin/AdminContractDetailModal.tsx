import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  History,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Check,
  Edit2
} from 'lucide-react';
import {
  ContractRecord,
  ContractMilestoneRecord,
  ContractActivityRecord,
  ContractStatus,
  MilestoneStatus,
  CONTRACT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
  MILESTONE_STATUS_LABELS
} from '../../types/contracts';
import { InvoiceRecord, ClientRecord, SUPPORTED_CURRENCIES } from '../../types/finance';
import { contractService } from '../../services/contractService';
import { ContractExportService } from '../../services/contractExportService';

interface AdminContractDetailModalProps {
  contract: ContractRecord | null;
  onClose: () => void;
  onRefresh: () => void;
  onOpenCreateMilestone: (contract: ContractRecord) => void;
  onOpenCreateInvoiceForContract: (contract: ContractRecord) => void;
  onOpenClientPortal: (client: ClientRecord) => void;
  clients: ClientRecord[];
  invoices: InvoiceRecord[];
}

export const AdminContractDetailModal: React.FC<AdminContractDetailModalProps> = ({
  contract,
  onClose,
  onRefresh,
  onOpenCreateMilestone,
  onOpenCreateInvoiceForContract,
  onOpenClientPortal,
  clients,
  invoices
}) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'finance' | 'audit'>('milestones');
  const [milestones, setMilestones] = useState<ContractMilestoneRecord[]>([]);
  const [activities, setActivities] = useState<ContractActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  const client = useMemo(() => {
    if (!contract) return null;
    return clients.find(c => c.id === contract.clientId) || null;
  }, [contract, clients]);

  const loadContractData = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const [fetchedMilestones, fetchedActivities] = await Promise.all([
        contractService.getMilestones(contract.id),
        contractService.getContractActivities(contract.id)
      ]);
      setMilestones(fetchedMilestones);
      setActivities(fetchedActivities);
    } catch (e) {
      console.warn('[AdminContractDetailModal] Load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContractData();
  }, [contract]);

  if (!contract) return null;

  const symbol = SUPPORTED_CURRENCIES.find(curr => curr.code === contract.currencyCode)?.symbol || `${contract.currencyCode} `;

  const handleStatusChange = async (newStatus: ContractStatus) => {
    try {
      setIsUpdatingStatus(true);
      await contractService.updateContractStatus(contract.id, newStatus, 'Executive Admin');
      await loadContractData();
      onRefresh();
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleToggleMilestoneCompleted = async (milestone: ContractMilestoneRecord) => {
    const nextStatus: MilestoneStatus = milestone.status === 'completed' ? 'in_progress' : 'completed';
    await contractService.updateMilestone(
      milestone.id,
      { status: nextStatus },
      'Executive Admin'
    );
    await loadContractData();
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded tracking-wider">
                {CONTRACT_TYPE_LABELS[contract.contractType] || contract.contractType}
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-xs text-slate-300">{contract.contractNumber}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {contract.title}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {contract.organizationName} • {contract.clientName}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Status Selector */}
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium">Status:</span>
              <select
                value={contract.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as ContractStatus)}
                className="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="draft" className="bg-slate-900 text-white">Draft</option>
                <option value="pending_signature" className="bg-slate-900 text-white">Pending Signature</option>
                <option value="active" className="bg-slate-900 text-white">Active</option>
                <option value="paused" className="bg-slate-900 text-white">Paused</option>
                <option value="completed" className="bg-slate-900 text-white">Completed</option>
                <option value="terminated" className="bg-slate-900 text-white">Terminated</option>
                <option value="expired" className="bg-slate-900 text-white">Expired</option>
                <option value="cancelled" className="bg-slate-900 text-white">Cancelled</option>
              </select>
            </div>

            {client && (
              <button
                onClick={() => onOpenClientPortal(client)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
                title="Preview client view"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portal Preview</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex space-x-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('milestones')}
              className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
                activeTab === 'milestones'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Milestones Roadmap ({milestones.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
                activeTab === 'finance'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Commercial Terms & Invoicing</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
                activeTab === 'audit'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit History ({activities.length})</span>
            </button>
          </div>

          {activeTab === 'milestones' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => ContractExportService.exportMilestones(milestones, contract.contractNumber)}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-200/60"
              >
                <FileSpreadsheet className="w-3 h-3 text-slate-500" />
                <span>Export Milestones CSV</span>
              </button>

              <button
                onClick={() => onOpenCreateMilestone(contract)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Milestone</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          
          {/* TAB 1: MILESTONES ROADMAP */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              {/* Overall Progress Banner */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                    <span>Overall Delivery Progress</span>
                    <span className="font-mono text-emerald-700">({contract.overallProgressPercent}%)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {contract.completedMilestonesCount} of {contract.milestonesCount} milestones completed and delivered.
                  </p>
                </div>

                <div className="w-full sm:w-60 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${contract.overallProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Milestones List */}
              {milestones.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-medium text-xs text-slate-700">No delivery milestones defined yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Structure the client agreement into phases, deliverables, or billing milestones.
                  </p>
                  <button
                    onClick={() => onOpenCreateMilestone(contract)}
                    className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add First Milestone</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {milestones.map((m) => {
                    const isCompleted = m.status === 'completed';
                    const isBlocked = m.status === 'blocked';

                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200/80'
                            : isBlocked
                            ? 'bg-amber-50/40 border-amber-200/80'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            {/* Complete Toggle Checkbox */}
                            <button
                              onClick={() => handleToggleMilestoneCompleted(m)}
                              className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors border ${
                                isCompleted
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'bg-white border-slate-300 hover:border-slate-400 text-transparent'
                              }`}
                              title={isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>

                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400">
                                  #{m.sequenceNumber}
                                </span>
                                <h3 className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                  {m.title}
                                </h3>
                                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                                  isCompleted ? 'bg-emerald-100 text-emerald-800' :
                                  isBlocked ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {MILESTONE_STATUS_LABELS[m.status] || m.status}
                                </span>
                              </div>

                              {m.description && (
                                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                                  {m.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                                {m.dueDate && (
                                  <div className={m.isOverdue ? 'text-red-600 font-bold' : ''}>
                                    Due: {m.dueDate}
                                  </div>
                                )}
                                {m.completedAt && (
                                  <div className="text-emerald-700">
                                    Delivered: {new Date(m.completedAt).toLocaleDateString()}
                                  </div>
                                )}
                                {m.milestoneValue ? (
                                  <div className="font-bold text-slate-800">
                                    Value: {symbol}{m.milestoneValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </div>
                                ) : null}
                                {m.invoiceNumber && (
                                  <div className="text-blue-700 font-semibold">
                                    Invoice: {m.invoiceNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 sm:self-center shrink-0">
                            <span className="font-mono text-xs font-bold text-slate-800">
                              {m.completionPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMMERCIAL TERMS & INVOICING */}
          {activeTab === 'finance' && (
            <div className="space-y-5 text-xs">
              {/* Financial Reconciliation Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    CONTRACT VALUE
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                    {symbol}{contract.contractValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-slate-400">Total agreed engagement value</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    BILLED AMOUNT
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                    {symbol}{contract.totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-slate-400">Invoices issued to client</span>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    PAID (REALIZED)
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-950 mt-1 block">
                    {symbol}{contract.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-emerald-700/80">Cash received in bank</span>
                </div>

                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                    OUTSTANDING AR
                  </span>
                  <span className="text-lg font-bold font-mono text-blue-950 mt-1 block">
                    {symbol}{contract.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-blue-700/80">Unpaid invoice balance</span>
                </div>
              </div>

              {/* Commercial Terms Parameters */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Commercial Agreement Parameters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Billing Frequency</span>
                    <span className="font-semibold text-slate-800 capitalize">{contract.billingFrequency.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Payment Terms</span>
                    <span className="font-semibold text-slate-800 font-mono">Net {contract.paymentTermsDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Auto-Renewal</span>
                    <span className="font-semibold text-slate-800">{contract.autoRenew ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Term Start Date</span>
                    <span className="font-mono text-slate-800">{contract.startDate || 'Immediate'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Term End Date</span>
                    <span className="font-mono text-slate-800">{contract.endDate || 'Ongoing / Indefinite'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Unbilled Contract Value</span>
                    <span className="font-mono font-bold text-amber-800">
                      {symbol}{contract.unbilledContractValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {contract.notes && (
                  <div className="pt-2 border-t border-slate-200 text-slate-600">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Agreement Notes</span>
                    <p className="leading-relaxed text-[11px]">{contract.notes}</p>
                  </div>
                )}
              </div>

              {/* Invoicing Action */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Issue Commercial Invoice for this Contract</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Generate an invoice linked to this agreement or specific completed milestones.
                  </p>
                </div>
                <button
                  onClick={() => onOpenCreateInvoiceForContract(contract)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Create Contract Invoice</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT HISTORY */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No activity logged for this contract yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {activities.map((a) => (
                    <div key={a.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">{a.description}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Actor: {a.actor || 'System'} • {new Date(a.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">
                        {a.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-mono">
            Contract ID: #{contract.id.slice(0, 8)}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
