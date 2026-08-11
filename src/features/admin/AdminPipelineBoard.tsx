import React, { useState } from 'react';
import { CompleteLeadRecord, OpportunityStage, STAGE_PROBABILITIES } from '../../services/qualification';
import { FollowUpAutomationEngine } from '../../services/followUpAutomation';
import { adminLeadsService } from '../../services/adminLeadsService';
import { 
  DollarSign, 
  Clock, 
  User, 
  Building2, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  TrendingUp, 
  PieChart, 
  Award, 
  AlertCircle,
  PhoneCall,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface AdminPipelineBoardProps {
  leads: CompleteLeadRecord[];
  onSelectLead: (lead: CompleteLeadRecord) => void;
  onUpdateStage: (leadId: string, newStage: OpportunityStage) => Promise<void>;
}

const STAGES: { id: OpportunityStage; title: string; color: string; bg: string; border: string; headerBg: string }[] = [
  { id: 'new', title: 'NEW', color: 'text-blue-700', bg: 'bg-blue-50/50', border: 'border-blue-200', headerBg: 'bg-blue-100/80 text-blue-900 border-blue-200' },
  { id: 'contacted', title: 'CONTACTED', color: 'text-amber-700', bg: 'bg-amber-50/50', border: 'border-amber-200', headerBg: 'bg-amber-100/80 text-amber-900 border-amber-200' },
  { id: 'qualified', title: 'QUALIFIED', color: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'border-emerald-200', headerBg: 'bg-emerald-100/80 text-emerald-900 border-emerald-200' },
  { id: 'discovery', title: 'DISCOVERY', color: 'text-indigo-700', bg: 'bg-indigo-50/50', border: 'border-indigo-200', headerBg: 'bg-indigo-100/80 text-indigo-900 border-indigo-200' },
  { id: 'proposal', title: 'PROPOSAL', color: 'text-purple-700', bg: 'bg-purple-50/50', border: 'border-purple-200', headerBg: 'bg-purple-100/80 text-purple-900 border-purple-200' },
  { id: 'negotiation', title: 'NEGOTIATION', color: 'text-rose-700', bg: 'bg-rose-50/50', border: 'border-rose-200', headerBg: 'bg-rose-100/80 text-rose-900 border-rose-200' },
  { id: 'won', title: 'WON', color: 'text-teal-700', bg: 'bg-teal-50/50', border: 'border-teal-200', headerBg: 'bg-teal-100/80 text-teal-900 border-teal-200' },
  { id: 'lost', title: 'LOST', color: 'text-slate-600', bg: 'bg-slate-100/50', border: 'border-slate-200', headerBg: 'bg-slate-200/80 text-slate-800 border-slate-300' },
];

const STAGE_SEQUENCE: OpportunityStage[] = ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'negotiation', 'won'];

export const AdminPipelineBoard: React.FC<AdminPipelineBoardProps> = ({
  leads,
  onSelectLead,
  onUpdateStage
}) => {
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);

  // Executive pipeline calculations
  const activeLeads = leads.filter(l => (l.qualification.opportunityStage || 'new') !== 'lost');
  const totalPipelineVal = activeLeads.reduce((sum, l) => {
    if (l.qualification.opportunityStage === 'won') {
      return sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0);
    }
    return sum + (l.qualification.estimatedOpportunityValue || 0);
  }, 0);

  const totalWeightedVal = activeLeads.reduce((sum, l) => {
    if (l.qualification.opportunityStage === 'won') {
      return sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0);
    }
    return sum + (l.qualification.weightedPipelineValue || 0);
  }, 0);

  const wonLeads = leads.filter(l => l.qualification.opportunityStage === 'won');
  const wonVal = wonLeads.reduce((sum, l) => sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0), 0);

  const healthSummary = FollowUpAutomationEngine.calculatePipelineHealth(leads);

  const handleStageChange = async (leadId: string, newStage: OpportunityStage) => {
    setMovingLeadId(leadId);
    try {
      await onUpdateStage(leadId, newStage);
    } finally {
      setMovingLeadId(null);
    }
  };

  const handleQuickAdvance = async (item: CompleteLeadRecord) => {
    const currentStage = item.qualification.opportunityStage || 'new';
    const currIdx = STAGE_SEQUENCE.indexOf(currentStage);
    if (currIdx >= 0 && currIdx < STAGE_SEQUENCE.length - 1) {
      const nextStage = STAGE_SEQUENCE[currIdx + 1];
      await handleStageChange(item.leadId, nextStage);
    }
  };

  const handleQuickMarkContacted = async (item: CompleteLeadRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setMovingLeadId(item.leadId);
    try {
      const nowIso = new Date().toISOString();
      await adminLeadsService.updateLead(item.leadId, {
        lastContactedAt: nowIso,
        opportunityStage: item.qualification.opportunityStage === 'new' ? 'contacted' : item.qualification.opportunityStage
      });
      await adminLeadsService.addActivity(item.leadId, {
        type: 'contacted',
        description: 'Lead marked contacted via Sales Pipeline Board quick action',
        actor: item.qualification.assignedTo || 'Growth Partner'
      });
    } finally {
      setMovingLeadId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Executive Sales Pipeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>ACTIVE PIPELINE</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900 mt-0.5">${totalPipelineVal.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500">{activeLeads.length} Total Opportunities</div>
        </div>

        <div>
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <PieChart className="w-3.5 h-3.5 text-amber-600" />
            <span>WEIGHTED PIPELINE</span>
          </div>
          <div className="text-base font-bold font-mono text-amber-900 mt-0.5">${totalWeightedVal.toLocaleString()}</div>
          <div className="text-[10px] text-amber-700/80">Probability Weighted</div>
        </div>

        <div>
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>CLOSED WON REVENUE</span>
          </div>
          <div className="text-base font-bold font-mono text-emerald-900 mt-0.5">${wonVal.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-700 font-medium">{wonLeads.length} Signed Partners</div>
        </div>

        <div>
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <AlertCircle className={`w-3.5 h-3.5 ${healthSummary.overdueCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
            <span>OVERDUE FOLLOW-UPS</span>
          </div>
          <div className={`text-base font-bold font-mono mt-0.5 ${healthSummary.overdueCount > 0 ? 'text-red-700' : 'text-slate-900'}`}>
            {healthSummary.overdueCount}
          </div>
          <div className="text-[10px] text-slate-500">{healthSummary.staleCount} Stale Opps</div>
        </div>

        <div>
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>PIPELINE HEALTH</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{healthSummary.healthScore}/100</div>
          <div className="text-[10px] text-slate-500">{healthSummary.statusMessage}</div>
        </div>
      </div>

      {/* Stage Columns Container */}
      <div className="w-full overflow-x-auto pb-6">
        <div className="inline-flex min-w-full space-x-4 items-start py-1 px-1">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter(l => (l.qualification.opportunityStage || 'new') === stage.id);
            const stageTotalVal = stageLeads.reduce((sum, l) => {
              if (stage.id === 'won') {
                return sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0);
              }
              return sum + (l.qualification.estimatedOpportunityValue || 0);
            }, 0);

            const stageWeightedVal = stageLeads.reduce((sum, l) => {
              if (stage.id === 'won') {
                return sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0);
              }
              return sum + (l.qualification.weightedPipelineValue || 0);
            }, 0);

            const probabilityPct = Math.round((STAGE_PROBABILITIES[stage.id] || 0) * 100);

            return (
              <div
                key={stage.id}
                className={`w-72 shrink-0 rounded-xl border ${stage.border} ${stage.bg} flex flex-col max-h-[calc(100vh-250px)] shadow-xs`}
              >
                {/* Stage Header */}
                <div className={`p-3 rounded-t-xl border-b flex flex-col space-y-1 ${stage.headerBg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs uppercase tracking-wider">{stage.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 font-mono font-bold">
                        {stageLeads.length}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold opacity-80">{probabilityPct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium pt-1 opacity-90 border-t border-current/10">
                    <span>Est: ${stageTotalVal.toLocaleString()}</span>
                    <span className="font-mono text-[10px]" title="Weighted Pipeline Value">
                      Wtd: ${stageWeightedVal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Cards Stream */}
                <div className="p-2 space-y-3 overflow-y-auto flex-1 min-h-[160px]">
                  {stageLeads.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-center text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-lg bg-white/40">
                      No opportunities in stage
                    </div>
                  ) : (
                    stageLeads.map((item) => {
                      const evalOpp = FollowUpAutomationEngine.evaluateOpportunity(item);
                      const estValue = item.qualification.estimatedOpportunityValue || 0;
                      const nextStageIdx = STAGE_SEQUENCE.indexOf(item.qualification.opportunityStage || 'new');
                      const canAdvance = nextStageIdx >= 0 && nextStageIdx < STAGE_SEQUENCE.length - 1;

                      return (
                        <div
                          key={item.leadId}
                          className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs hover:shadow-md transition-all space-y-2.5 relative group"
                        >
                          {/* Top Row: Organization & Lead Priority */}
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-700 uppercase">
                                <Building2 className="w-3 h-3 text-amber-600 shrink-0" />
                                <span className="truncate max-w-[130px]">
                                  {item.visitorData.organizationName || 'Private Practice'}
                                </span>
                              </div>
                              <button
                                onClick={() => onSelectLead(item)}
                                className="text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors text-left block mt-0.5 line-clamp-1"
                              >
                                {item.visitorData.contactName}
                              </button>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                item.qualification.leadPriority === 'urgent' ? 'bg-red-100 text-red-800 border border-red-200' :
                                item.qualification.leadPriority === 'high' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {item.qualification.leadPriority}
                              </span>
                            </div>
                          </div>

                          {/* Sector & Fit Score */}
                          <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                            <span className="text-[10px] text-slate-500 capitalize truncate max-w-[120px]">
                              {item.visitorData.healthcareCategory || item.qualification.healthcareCategoryNormalized.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                              Fit: {item.qualification.fitScore}/100
                            </span>
                          </div>

                          {/* Financial Value Box */}
                          <div className="bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between text-xs">
                            <div>
                              <span className="text-[9px] text-slate-400 block uppercase font-semibold">
                                {stage.id === 'won' ? 'Contract Value' : 'Est Value'}
                              </span>
                              <span className="font-bold font-mono text-slate-900">
                                {stage.id === 'won' 
                                  ? `$${(item.qualification.finalContractValue || estValue).toLocaleString()}`
                                  : (estValue > 0 ? `$${estValue.toLocaleString()}` : '$0')
                                }
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-slate-400 block uppercase font-semibold">Weighted</span>
                              <span className="font-mono text-[11px] font-semibold text-amber-800">
                                ${(item.qualification.weightedPipelineValue || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Follow-up / Risk Badge */}
                          <div className="flex items-center justify-between text-[10px]">
                            {evalOpp.classification === 'OVERDUE' && (
                              <span className="font-bold text-red-700 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-red-600" />
                                <span>OVERDUE</span>
                              </span>
                            )}
                            {evalOpp.classification === 'DUE_TODAY' && (
                              <span className="font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
                                DUE TODAY
                              </span>
                            )}
                            {evalOpp.classification === 'STALE_OPPORTUNITY' && (
                              <span className="font-bold text-slate-700 bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">
                                STALE ({evalOpp.daysSinceLastActivity}d)
                              </span>
                            )}
                            {evalOpp.classification === 'UPCOMING' && (
                              <span className="font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                Follow-up Set
                              </span>
                            )}
                            {evalOpp.classification === 'NO_FOLLOW_UP' && (
                              <span className="text-slate-400 italic">No follow-up set</span>
                            )}

                            <div className="flex items-center space-x-1 truncate max-w-[100px] text-slate-500" title={item.qualification.assignedTo || 'Unassigned'}>
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.qualification.assignedTo || 'Unassigned'}</span>
                            </div>
                          </div>

                          {/* Next Action Pill if available */}
                          {evalOpp.derivedNextAction && (
                            <div className="text-[10px] bg-amber-50 text-amber-900 p-1.5 rounded border border-amber-200/60 font-medium">
                              <strong className="block text-[9px] uppercase text-amber-800">Next Action:</strong>
                              <p className="line-clamp-1">{evalOpp.derivedNextAction}</p>
                            </div>
                          )}

                          {/* Proposal Status Badge if applicable */}
                          {item.qualification.proposalStatus && item.qualification.proposalStatus !== 'not_started' && (
                            <div className="flex items-center justify-between text-[10px] bg-purple-50 text-purple-900 px-2 py-1 rounded border border-purple-200 font-medium">
                              <span>Proposal: <strong className="uppercase">{item.qualification.proposalStatus}</strong></span>
                              {item.qualification.proposalValue && (
                                <span className="font-mono font-bold">${item.qualification.proposalValue.toLocaleString()}</span>
                              )}
                            </div>
                          )}

                          {/* Quick Sales Controls */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 gap-1">
                            {/* Contact Lead Quick Action */}
                            <button
                              type="button"
                              onClick={(e) => handleQuickMarkContacted(item, e)}
                              disabled={movingLeadId === item.leadId}
                              title="Mark Contacted Now"
                              className="text-[10px] p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 flex items-center space-x-0.5 shrink-0"
                            >
                              <PhoneCall className="w-3 h-3 text-slate-600" />
                            </button>

                            {/* Move Stage Selector */}
                            <select
                              value={item.qualification.opportunityStage || 'new'}
                              onChange={(e) => handleStageChange(item.leadId, e.target.value as OpportunityStage)}
                              disabled={movingLeadId === item.leadId}
                              className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded px-1.5 py-1 border border-slate-300 focus:outline-none cursor-pointer flex-1 truncate"
                            >
                              {STAGES.map(s => (
                                <option key={s.id} value={s.id}>Move: {s.title}</option>
                              ))}
                            </select>

                            {/* Advance Stage One-Click Button */}
                            {canAdvance && (
                              <button
                                type="button"
                                onClick={() => handleQuickAdvance(item)}
                                disabled={movingLeadId === item.leadId}
                                title="Advance to Next Stage"
                                className="text-[10px] p-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold shrink-0 shadow-2xs"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Details Button */}
                            <button
                              onClick={() => onSelectLead(item)}
                              className="text-[10px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded px-2 py-1 transition-colors shrink-0"
                            >
                              Details
                            </button>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
