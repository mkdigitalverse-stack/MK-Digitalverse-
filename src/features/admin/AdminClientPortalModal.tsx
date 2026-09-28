import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Layers,
  Lock,
  ExternalLink,
  Info
} from 'lucide-react';
import { ClientRecord, SUPPORTED_CURRENCIES } from '../../types/finance';
import { ClientPortalViewData } from '../../types/contracts';
import { contractService } from '../../services/contractService';

interface AdminClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientRecord | null;
}

export const AdminClientPortalModal: React.FC<AdminClientPortalModalProps> = ({
  isOpen,
  onClose,
  client
}) => {
  const [portalData, setPortalData] = useState<ClientPortalViewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && client) {
      setIsLoading(true);
      contractService.getClientPortalData(client.id)
        .then(data => setPortalData(data))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, client]);

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Portal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">
              MK
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded tracking-wider flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SECURE CLIENT PORTAL</span>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">Authenticated Partner Session</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {client.organizationName}
              </h2>
              <p className="text-xs text-slate-300">
                Primary Partner Contact: {client.name} ({client.email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Notice Banner */}
        <div className="bg-emerald-50/80 px-5 py-2.5 border-b border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900 shrink-0">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              <strong>Zero-Leakage Client Access:</strong> Internal pipeline scores, discovery notes, internal expenses, and profit margins are strictly filtered from this view.
            </span>
          </div>
        </div>

        {/* Portal Scrollable Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading partner workspace...
            </div>
          ) : !portalData || portalData.contracts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-xs text-slate-700">No active contracts assigned to this portal account</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Contracts and milestones created in the CRM will appear here for the partner.
              </p>
            </div>
          ) : (
            portalData.contracts.map((c) => {
              const symbol = SUPPORTED_CURRENCIES.find(curr => curr.code === c.currencyCode)?.symbol || `${c.currencyCode} `;

              return (
                <div key={c.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5">
                  {/* Contract Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{c.contractNumber}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-600 capitalize font-medium">{c.contractType.replace('_', ' ')}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{c.title}</h3>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Term: {c.startDate || 'Immediate'} – {c.endDate || 'Ongoing'}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                      <span className="font-mono text-base font-bold text-slate-900">
                        {symbol}{c.contractValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{c.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Milestones Delivery Roadmap */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-slate-600" />
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Deliverables & Milestone Progress ({c.overallProgressPercent}%)
                        </h4>
                      </div>
                      <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${c.overallProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    {c.milestones.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No milestones defined for this contract yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {c.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                              m.status === 'completed'
                                ? 'bg-emerald-50/60 border-emerald-200'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <span className="font-mono text-[10px] text-slate-400 font-bold">
                                #{m.sequenceNumber}
                              </span>
                              <span className={`font-semibold ${m.status === 'completed' ? 'text-emerald-950 font-bold' : 'text-slate-800'}`}>
                                {m.title}
                              </span>
                            </div>

                            <div className="flex items-center space-x-3 font-mono text-[11px]">
                              {m.dueDate && (
                                <span className="text-slate-500">Due: {m.dueDate}</span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                m.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {m.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Commercial Invoices & Statement */}
                  {c.invoices.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Commercial Invoices & Billing
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {c.invoices.map((inv) => (
                          <div
                            key={inv.invoiceNumber}
                            className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <div className="font-bold font-mono text-slate-900">{inv.invoiceNumber} — {inv.title}</div>
                              <div className="text-[11px] text-slate-500 font-mono">Issued: {inv.issueDate} • Due: {inv.dueDate}</div>
                            </div>

                            <div className="flex items-center space-x-4 font-mono">
                              <div className="text-right">
                                <div className="font-bold text-slate-900">
                                  {symbol}{inv.amountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                                {inv.amountOutstanding > 0 ? (
                                  <div className="text-[10px] text-blue-700 font-semibold">
                                    Balance: {symbol}{inv.amountOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-emerald-700 font-semibold">
                                    Paid in Full
                                  </div>
                                )}
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                inv.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {inv.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Client Portal Simulation • Authenticated as <strong>{client.name}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
