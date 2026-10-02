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
  ChevronDown,
  ShieldAlert,
  LayoutGrid,
  ListFilter,
  Plus
} from 'lucide-react';

interface AdminPipelineBoardProps {
  leads: CompleteLeadRecord[];
  onSelectLead: (lead: CompleteLeadRecord) => void;
  onUpdateStage: (leadId: string, newStage: OpportunityStage) => Promise<void>;
  onOpenAddLead?: () => void;
}

const STAGES: { id: OpportunityStage; title: string; color: string; bg: string; border: string; headerBg: string }[] = [
  { id: 'new', title: 'NEW', color: 'text-blue-700', bg: 'bg-blue-50/50', border: 'border-blue-200', headerBg: 'bg-blue-100/80 text-blue-900 border-blue-200' },
  { id: 'contacted', title: 'CONTACTED', color: 'text-amber-700', bg: 'bg-amber-50/50', border: 'border-amber-200', headerBg: 'bg-amber-100/80 text-amber-900 border-amber-200' },
  { id: 'qualified', title: 'QUALIFIED', color: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'border-emerald-200', headerBg: 'bg-emerald-100/80 text-emerald-900 border-emerald-200' },
  { id: 'discovery', title: 'DISCOVERY', color: 'text-indigo-700', bg: 'bg-indigo-50/50', border: 'border-indigo-200', headerBg: 'bg-indigo-100/80 text-indigo-900 border-indigo-200' },
  { id: 'proposal', title: 'PROPOSAL', color: 'text-purple-700', bg: 'bg-purple-50/50', border: 'border-purple-200', headerBg: 'bg-purple-100/80 text-purple-900 border-purple-200' },
  { id: 'negotiations', title: 'NEGOTIATIONS', color: 'text-rose-700', bg: 'bg-rose-50/50', border: 'border-rose-200', headerBg: 'bg-rose-100/80 text-rose-900 border-rose-200' },
  { id: 'won', title: 'WON', color: 'text-teal-700', bg: 'bg-teal-50/50', border: 'border-teal-200', headerBg: 'bg-teal-100/80 text-teal-900 border-teal-200' },
  { id: 'lost', title: 'LOST', color: 'text-slate-600', bg: 'bg-slate-100/50', border: 'border-slate-200', headerBg: 'bg-slate-200/80 text-slate-800 border-slate-300' },
];

const STAGE_SEQUENCE: OpportunityStage[] = [
  'new',
  'contacted',
  'qualified',
  'discovery',
  'proposal',
  'negotiations',
  'won'
];

export const AdminPipelineBoard: React.FC<AdminPipelineBoardProps> = ({
  leads,
  onSelectLead,
  onUpdateStage,
  onOpenAddLead
}) => {
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);
  const [stageError, setStageError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'stack'>('board');
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    new: true,
    contacted: true,
    qualified: true,
    discovery: true,
    proposal: true,
    negotiations: true,
    won: false,
    lost: false
  });

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  // Executive pipeline calculations
  const activeLeads = leads.filter(l => (l.status || l.qualification.opportunityStage) !== 'won' && (l.status || l.qualification.opportunityStage) !== 'lost');
  const wonLeads = leads.filter(l => (l.status || l.qualification.opportunityStage) === 'won');

  const totalPipelineVal = activeLeads.reduce((sum, l) => sum + (l.qualification.estimatedOpportunityValue || 0), 0);
  const totalWeightedVal = activeLeads.reduce((sum, l) => sum + (l.qualification.weightedPipelineValue || 0), 0);
  const wonVal = wonLeads.reduce((sum, l) => sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0), 0);

  const healthSummary = FollowUpAutomationEngine.calculatePipelineHealth(leads);

  const handleStageChange = async (leadId: string, newStage: OpportunityStage) => {
    setMovingLeadId(leadId);
    setStageError(null);
    try {
      await onUpdateStage(leadId, newStage);
    } catch (err: any) {
      const msg = err?.message || 'Failed to update pipeline stage';
      setStageError(msg);
      console.error('[AdminPipelineBoard] Stage update error:', err);
    } finally {
      setMovingLeadId(null);
    }
  };

  const handleQuickAdvance = async (item: CompleteLeadRecord) => {
    const currentStage = item.status || item.qualification.opportunityStage || 'new';
    const currIdx = STAGE_SEQUENCE.indexOf(currentStage);
    if (currIdx >= 0 && currIdx < STAGE_SEQUENCE.length - 1) {
      const nextStage = STAGE_SEQUENCE[currIdx + 1];
      await handleStageChange(item.leadId, nextStage);
    }
  };

  const handleQuickMarkContacted = async (item: CompleteLeadRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setMovingLeadId(item.leadId);
    setStageError(null);
    try {
      await onUpdateStage(item.leadId, 'contacted');
      await adminLeadsService.addActivity(item.leadId, {
        type: 'contacted',
        description: 'Lead marked contacted via Sales Pipeline Board quick action',
        actor: item.qualification.assignedTo || 'Growth Partner'
      });
    } catch (err: any) {
      setStageError(err?.message || 'Failed to mark lead as contacted');
    } finally {
      setMovingLeadId(null);
    }
  };

  // Render a lead card used in both board and stacked modes
  const renderLeadCard = (item: CompleteLeadRecord) => {
    const evalOpp = FollowUpAutomationEngine.evaluateOpportunity(item);
    const estValue = item.qualification.estimatedOpportunityValue || 0;
    const currentStage = item.status || item.qualification.opportunityStage || 'new';
    const nextStageIdx = STAGE_SEQUENCE.indexOf(currentStage);
    const canAdvance = nextStageIdx >= 0 && nextStageIdx < STAGE_SEQUENCE.length - 1;

    return (
      <div
        key={item.leadId}
        className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs hover:shadow-md transition-all space-y-2.5 relative group"
      >
        {/* Top Row: Organization & Lead Priority */}
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-700 uppercase">
              <Building2 className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-[180px]">
                {item.visitorData.organizationName || 'Private Practice'}
              </span>
            </div>
            <h4
              onClick={() => onSelectLead(item)}
              className="text-xs font-bold text-slate-900 truncate hover:text-amber-700 transition-colors cursor-pointer mt-0.5"
            >
              {item.visitorData.contactName}
            </h4>
          </div>

          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
              item.qualification.leadPriority === 'urgent'
                ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                : item.qualification.leadPriority === 'high'
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {item.qualification.leadPriority}
          </span>
        </div>

        {/* Opportunity Financials & Sector */}
        <div className="bg-slate-50/80 rounded p-2 border border-slate-100 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] uppercase text-slate-400 font-bold">Est. Value</span>
            <span className="font-bold text-slate-900">
              {estValue > 0 ? `$${estValue.toLocaleString()}` : '$25,000'}
            </span>
          </div>

          {item.visitorData.healthcareCategory && (
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 border-t border-slate-200/40">
              <span className="truncate max-w-[130px]">{item.visitorData.healthcareCategory}</span>
              <span className="font-semibold text-slate-700 font-mono">
                Fit: {item.qualification.fitScore || 0}/100
              </span>
            </div>
          )}
        </div>

        {/* Automation Follow-up Status */}
        {evalOpp.classification !== 'NO_FOLLOW_UP' && (
          <div className="flex items-center justify-between text-[10px] pt-0.5">
            <span
              className={`font-semibold flex items-center space-x-1 ${
                evalOpp.classification === 'OVERDUE'
                  ? 'text-red-700'
                  : evalOpp.classification === 'DUE_TODAY'
                  ? 'text-amber-700'
                  : 'text-slate-500'
              }`}
            >
              <Calendar className="w-3 h-3 shrink-0" />
              <span>
                {evalOpp.classification === 'OVERDUE'
                  ? `${Math.max(1, Math.floor((new Date().getTime() - new Date(item.qualification.nextFollowUpAt || item.createdAt).getTime()) / (1000 * 3600 * 24)))}d Overdue`
                  : evalOpp.classification === 'DUE_TODAY'
                  ? 'Due Today'
                  : 'Follow-up Set'}
              </span>
            </span>

            {/* Quick Contact Action if in New stage */}
            {currentStage === 'new' && (
              <button
                type="button"
                onClick={(e) => handleQuickMarkContacted(item, e)}
                disabled={movingLeadId === item.leadId}
                className="text-[10px] text-amber-700 hover:text-amber-900 font-bold flex items-center space-x-0.5 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded transition-colors"
                title="Mark contacted now"
              >
                <PhoneCall className="w-2.5 h-2.5" />
                <span>Mark Contacted</span>
              </button>
            )}
          </div>
        )}

        {/* Action Controls: Stage Selector & Forward Advance */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => onSelectLead(item)}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Detail
          </button>

          {/* Move Stage Selector */}
          <select
            value={item.status || item.qualification.opportunityStage || 'new'}
            onChange={(e) => handleStageChange(item.leadId, e.target.value as OpportunityStage)}
            disabled={movingLeadId === item.leadId}
            className="text-[10px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 rounded px-1.5 py-1 border border-slate-300 focus:outline-none cursor-pointer flex-1 truncate min-h-[32px]"
            aria-label={`Change stage for ${item.visitorData.contactName}`}
          >
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                Move: {s.title}
              </option>
            ))}
          </select>

          {/* Advance Stage One-Click Button */}
          {canAdvance && (
            <button
              type="button"
              onClick={() => handleQuickAdvance(item)}
              disabled={movingLeadId === item.leadId}
              title={`Advance to ${STAGE_SEQUENCE[nextStageIdx + 1].toUpperCase()}`}
              className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold shrink-0 shadow-2xs min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors"
              aria-label={`Advance to next stage`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Pipeline Stage Error Banner */}
      {stageError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{stageError}</span>
          </div>
          <button
            type="button"
            onClick={() => setStageError(null)}
            className="text-red-600 hover:text-red-900 font-bold px-2 py-0.5 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Toolbar: View Mode Toggle & Executive Metrics */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Sales Pipeline Lifecycle
          </h2>
          <p className="text-[11px] text-slate-500">
            {activeLeads.length} active opportunities • ${totalPipelineVal.toLocaleString()} pipeline value
          </p>
        </div>

        {/* View Mode Toggle and + Add Lead */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {onOpenAddLead && (
            <button
              type="button"
              onClick={onOpenAddLead}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition-all min-h-[34px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Lead</span>
            </button>
          )}

          {/* View Mode Toggle (Kanban Board vs Stacked Cards) */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'board'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('stack')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'stack'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Compact Stack</span>
          </button>
        </div>
      </div>
    </div>

      {/* Executive Sales Pipeline Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <TrendingUp className="w-3 h-3 text-blue-600" />
            <span>ACTIVE PIPE</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
            ${totalPipelineVal.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">{activeLeads.length} Opportunities</div>
        </div>

        <div>
          <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <PieChart className="w-3 h-3 text-amber-600" />
            <span>WEIGHTED</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-amber-900 mt-0.5">
            ${totalWeightedVal.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-700/80">Stage Weighted</div>
        </div>

        <div>
          <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <Award className="w-3 h-3 text-emerald-600" />
            <span>WON REVENUE</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-emerald-900 mt-0.5">
            ${wonVal.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700">{wonLeads.length} Signed</div>
        </div>

        <div>
          <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <AlertCircle className={`w-3 h-3 ${healthSummary.overdueCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
            <span>OVERDUE</span>
          </div>
          <div className={`text-sm sm:text-base font-bold font-mono mt-0.5 ${healthSummary.overdueCount > 0 ? 'text-red-700' : 'text-slate-900'}`}>
            {healthSummary.overdueCount}
          </div>
          <div className="text-[10px] text-slate-500">Need immediate action</div>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <ShieldAlert className="w-3 h-3 text-amber-600" />
            <span>HEALTH SCORE</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
            {healthSummary.healthScore}/100
          </div>
          <div className="text-[10px] text-slate-500 truncate">{healthSummary.statusMessage}</div>
        </div>
      </div>

      {/* MODE 1: KANBAN BOARD VIEW (Desktop Optimized, Horizontal Scroll) */}
      {viewMode === 'board' && (
        <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300">
          <div className="inline-flex min-w-full space-x-3.5 items-start py-1 px-1">
            {STAGES.map((stage) => {
              const stageLeads = leads.filter((l) => (l.status || l.qualification.opportunityStage || 'new') === stage.id);
              const stageTotalVal = stageLeads.reduce((sum, l) => {
                if (stage.id === 'won') {
                  return sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0);
                }
                return sum + (l.qualification.estimatedOpportunityValue || 0);
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
                      <span>${stageTotalVal.toLocaleString()}</span>
                      <span className="font-mono text-[10px]">{stageLeads.length} Opps</span>
                    </div>
                  </div>

                  {/* Cards Stream */}
                  <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[160px]">
                    {stageLeads.length === 0 ? (
                      <div className="h-24 flex items-center justify-center text-center text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-lg bg-white/40">
                        No opportunities
                      </div>
                    ) : (
                      stageLeads.map((item) => renderLeadCard(item))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: COMPACT STACKED VIEW (Mobile Friendly, No giant horizontal drag) */}
      {viewMode === 'stack' && (
        <div className="space-y-3">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => (l.status || l.qualification.opportunityStage || 'new') === stage.id);
            const isExpanded = expandedStages[stage.id] ?? false;
            const stageTotalVal = stageLeads.reduce((sum, l) => {
              if (stage.id === 'won') {
                return sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0);
              }
              return sum + (l.qualification.estimatedOpportunityValue || 0);
            }, 0);

            return (
              <div
                key={stage.id}
                className={`rounded-xl border ${stage.border} ${stage.bg} overflow-hidden shadow-2xs transition-all`}
              >
                {/* Accordion Stage Header */}
                <button
                  type="button"
                  onClick={() => toggleStage(stage.id)}
                  className={`w-full p-3.5 flex items-center justify-between text-left transition-colors ${stage.headerBg}`}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-xs uppercase tracking-wider">{stage.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/90 font-mono font-bold text-slate-900">
                      {stageLeads.length}
                    </span>
                    {stageTotalVal > 0 && (
                      <span className="text-[11px] font-mono text-slate-700 font-semibold hidden sm:inline">
                        • ${stageTotalVal.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-semibold text-slate-600">
                      {Math.round((STAGE_PROBABILITIES[stage.id] || 0) * 100)}% prob
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </button>

                {/* Expanded Stage Leads */}
                {isExpanded && (
                  <div className="p-3 space-y-2.5 bg-white/60 border-t border-slate-200/60">
                    {stageLeads.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No opportunities currently in this stage.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {stageLeads.map((item) => renderLeadCard(item))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
