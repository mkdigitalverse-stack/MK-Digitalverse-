import React, { useState } from 'react';
import { CompleteLeadRecord, OpportunityStage } from '../../services/qualification';
import { 
  FollowUpAutomationEngine, 
  EvaluatedOpportunity, 
  PipelineHealthSummary 
} from '../../services/followUpAutomation';
import { adminLeadsService } from '../../services/adminLeadsService';
import { 
  Calendar, 
  AlertCircle, 
  Clock, 
  User, 
  Building2, 
  Tag, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Check,
  Zap,
  PhoneCall,
  RotateCcw,
  CalendarX
} from 'lucide-react';
import { 
  formatFollowUpDate, 
  formatFollowUpTime, 
  formatFollowUpDateTime,
  getDateInputValue
} from '../../utils/followUpTime';
import { AdminScheduleFollowUpModal } from './AdminScheduleFollowUpModal';

interface AdminFollowUpsViewProps {
  leads: CompleteLeadRecord[];
  onSelectLead: (lead: CompleteLeadRecord) => void;
  onLeadUpdated?: (lead: CompleteLeadRecord) => void;
}

export const AdminFollowUpsView: React.FC<AdminFollowUpsViewProps> = ({
  leads,
  onSelectLead,
  onLeadUpdated
}) => {
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [activeScheduleLead, setActiveScheduleLead] = useState<{ lead: CompleteLeadRecord; mode: 'schedule' | 'reschedule' } | null>(null);
  const [leadToCancel, setLeadToCancel] = useState<CompleteLeadRecord | null>(null);

  const now = new Date();
  const healthSummary: PipelineHealthSummary = FollowUpAutomationEngine.calculatePipelineHealth(leads, now);

  const activeLeads = leads.filter(l => {
    const s = String(l.status || l.qualification.opportunityStage || 'new').toLowerCase().trim();
    return s !== 'won' && s !== 'lost';
  });

  const overdue: EvaluatedOpportunity[] = [];
  const dueToday: EvaluatedOpportunity[] = [];
  const stale: EvaluatedOpportunity[] = [];
  const upcoming: EvaluatedOpportunity[] = [];
  const unscheduled: EvaluatedOpportunity[] = [];

  activeLeads.forEach(lead => {
    const evalResult = FollowUpAutomationEngine.evaluateOpportunity(lead, now);
    switch (evalResult.classification) {
      case 'OVERDUE':
        overdue.push(evalResult);
        break;
      case 'DUE_TODAY':
        dueToday.push(evalResult);
        break;
      case 'STALE_OPPORTUNITY':
        stale.push(evalResult);
        break;
      case 'UPCOMING':
        upcoming.push(evalResult);
        break;
      case 'NO_FOLLOW_UP':
      default:
        unscheduled.push(evalResult);
        break;
    }
  });

  // Sort groups logically
  overdue.sort((a, b) => new Date(a.lead.qualification.nextFollowUpAt!).getTime() - new Date(b.lead.qualification.nextFollowUpAt!).getTime());
  dueToday.sort((a, b) => new Date(a.lead.qualification.nextFollowUpAt!).getTime() - new Date(b.lead.qualification.nextFollowUpAt!).getTime());
  stale.sort((a, b) => b.daysSinceLastActivity - a.daysSinceLastActivity);
  upcoming.sort((a, b) => new Date(a.lead.qualification.nextFollowUpAt!).getTime() - new Date(b.lead.qualification.nextFollowUpAt!).getTime());
  unscheduled.sort((a, b) => (b.lead.qualification.fitScore || 0) - (a.lead.qualification.fitScore || 0));

  const groups = [
    {
      id: 'overdue',
      priority: 'PRIORITY 1',
      title: 'OVERDUE FOLLOW-UPS',
      count: overdue.length,
      items: overdue,
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      headerBg: 'bg-red-950 text-red-100 border-red-900',
      icon: AlertCircle,
      desc: 'Immediate action required — scheduled target date has passed.'
    },
    {
      id: 'dueToday',
      priority: 'PRIORITY 2',
      title: 'DUE TODAY',
      count: dueToday.length,
      items: dueToday,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      headerBg: 'bg-amber-950 text-amber-100 border-amber-900',
      icon: Clock,
      desc: 'High priority follow-ups scheduled for today.'
    },
    {
      id: 'stale',
      priority: 'PRIORITY 3',
      title: 'STALE OPPORTUNITIES (7+ DAYS INACTIVE)',
      count: stale.length,
      items: stale,
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
      headerBg: 'bg-orange-950 text-orange-100 border-orange-900',
      icon: Flame,
      desc: 'Active opportunities with no recorded sales activity for 7 or more days.'
    },
    {
      id: 'upcoming',
      priority: 'PRIORITY 4',
      title: 'UPCOMING FOLLOW-UPS',
      count: upcoming.length,
      items: upcoming,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      headerBg: 'bg-emerald-950 text-emerald-100 border-emerald-900',
      icon: Calendar,
      desc: 'Scheduled future engagements and milestone check-ins.'
    },
    {
      id: 'unscheduled',
      priority: 'PRIORITY 5',
      title: 'UNSCHEDULED / NO FOLLOW-UP',
      count: unscheduled.length,
      items: unscheduled,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      headerBg: 'bg-slate-900 text-slate-100 border-slate-800',
      icon: Tag,
      desc: 'Active pipeline leads currently missing a scheduled follow-up target date.'
    }
  ];

  const handleMarkContacted = async (lead: CompleteLeadRecord) => {
    try {
      setUpdatingLeadId(lead.leadId);
      const updated = await adminLeadsService.markContacted(lead.leadId, lead.qualification.assignedTo || 'Growth Partner');
      onLeadUpdated?.(updated);
      setActionSuccessMessage(`Contact logged for ${lead.visitorData.organizationName || lead.visitorData.contactName}`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to mark lead contacted:', err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleCancelFollowUp = (lead: CompleteLeadRecord) => {
    setLeadToCancel(lead);
  };

  const handleConfirmCancel = async () => {
    if (!leadToCancel) return;
    const lead = leadToCancel;
    try {
      setUpdatingLeadId(lead.leadId);
      const updated = await adminLeadsService.cancelFollowUp(
        lead.leadId,
        lead.qualification.nextFollowUpAt,
        lead.qualification.assignedTo || 'Growth Partner'
      );
      onLeadUpdated?.(updated);
      setActionSuccessMessage(`Follow-up cancelled for ${lead.visitorData.organizationName || lead.visitorData.contactName}`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Failed to cancel follow-up:', err);
    } finally {
      setUpdatingLeadId(null);
      setLeadToCancel(null);
    }
  };

  const handleSaveSchedule = async (
    leadId: string,
    payload: { date: string; time: string; remark: string; note?: string }
  ) => {
    const lead = leads.find(l => l.leadId === leadId);
    const updated = await adminLeadsService.scheduleFollowUp(leadId, {
      ...payload,
      actor: lead?.qualification.assignedTo || 'Growth Partner'
    });
    onLeadUpdated?.(updated);
    setActionSuccessMessage('Follow-up scheduled successfully.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleSaveReschedule = async (
    leadId: string,
    payload: { previousFollowUpAt?: string; previousRemark?: string; date: string; time: string; remark: string; note?: string }
  ) => {
    const lead = leads.find(l => l.leadId === leadId);
    const updated = await adminLeadsService.rescheduleFollowUp(leadId, {
      ...payload,
      actor: lead?.qualification.assignedTo || 'Growth Partner'
    });
    onLeadUpdated?.(updated);
    setActionSuccessMessage('Follow-up re-scheduled successfully.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleQuickSchedule = async (lead: CompleteLeadRecord, daysFromNow: number) => {
    try {
      setUpdatingLeadId(lead.leadId);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysFromNow);
      targetDate.setHours(10, 0, 0, 0); // Default to 10:00 AM
      const isoDate = targetDate.toISOString();

      const updated = await adminLeadsService.scheduleFollowUp(lead.leadId, {
        date: getDateInputValue(isoDate),
        time: '10:00',
        remark: 'Follow-Up Scheduled',
        actor: lead.qualification.assignedTo || 'Growth Partner'
      });
      onLeadUpdated?.(updated);
      setActionSuccessMessage(`Follow-up scheduled for ${formatFollowUpDate(isoDate)}`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to schedule follow-up:', err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  return (
    <div className="space-y-8 pb-8">

      {/* Action Notification Banner */}
      {actionSuccessMessage && (
        <div className="bg-emerald-900 text-emerald-100 px-4 py-3 rounded-lg flex items-center justify-between border border-emerald-700 shadow-md animate-fade-in">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* PIPELINE HEALTH & REVENUE OPS SUMMARY BANNER */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/80">
                Revenue Operations Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-Time Health Status</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <span>Pipeline Health Diagnostic</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                healthSummary.status === 'healthy' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                healthSummary.status === 'needs_attention' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                'bg-red-950 text-red-300 border-red-800'
              }`}>
                {healthSummary.status.replace('_', ' ')}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{healthSummary.statusMessage}</p>
          </div>

          <div className="flex items-center space-x-6 shrink-0 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Health Score</span>
              <span className={`text-2xl font-mono font-extrabold ${
                healthSummary.healthScore >= 80 ? 'text-emerald-400' :
                healthSummary.healthScore >= 60 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {healthSummary.healthScore}/100
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Active Pipe</span>
              <span className="text-2xl font-mono font-extrabold text-white">
                {healthSummary.totalActiveCount}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-bold text-red-400 uppercase block">Overdue Follow-ups</span>
            <span className="text-xl font-mono font-bold text-white mt-0.5 block">{healthSummary.overdueCount}</span>
            <span className="text-[10px] text-slate-500 block">Past scheduled date</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-bold text-orange-400 uppercase block">Stale Opportunities</span>
            <span className="text-xl font-mono font-bold text-white mt-0.5 block">{healthSummary.staleCount}</span>
            <span className="text-[10px] text-slate-500 block">7+ days without activity</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Unscheduled</span>
            <span className="text-xl font-mono font-bold text-white mt-0.5 block">{healthSummary.unscheduledCount}</span>
            <span className="text-[10px] text-slate-500 block">Missing target date</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-bold text-amber-400 uppercase block">High Pipeline Risk</span>
            <span className="text-xl font-mono font-bold text-white mt-0.5 block">{healthSummary.highRiskCount}</span>
            <span className="text-[10px] text-slate-500 block">Require Growth Partner intervention</span>
          </div>
        </div>
      </div>

      {/* 5 PRIORITIZED SECTIONS */}
      {groups.map((group) => {
        const Icon = group.icon;
        return (
          <div key={group.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Group Header */}
            <div className={`p-4 border-b flex items-center justify-between ${group.headerBg}`}>
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
                      {group.priority}
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">{group.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${group.badgeColor}`}>
                      {group.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{group.desc}</p>
                </div>
              </div>
            </div>

            {/* Items Queue */}
            {group.items.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                No opportunities currently in this follow-up queue category.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {group.items.map((item) => {
                  const lead = item.lead;
                  const isUpdating = updatingLeadId === lead.leadId;

                  return (
                    <div
                      key={lead.leadId}
                      className="p-4 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      {/* Left: Lead Overview & Next Action */}
                      <div className="space-y-2 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-amber-900 flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{lead.visitorData.organizationName || 'Healthcare Provider'}</span>
                          </span>

                          {lead.visitorData.healthcareCategory && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                              {lead.visitorData.healthcareCategory}
                            </span>
                          )}

                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 uppercase font-mono font-bold">
                            Stage: {lead.qualification.opportunityStage || 'new'}
                          </span>

                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                            lead.qualification.fitStatus === 'high_fit' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                            lead.qualification.fitStatus === 'medium_fit' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            'bg-slate-100 text-slate-800 border-slate-300'
                          }`}>
                            Fit: {lead.qualification.fitScore || 0}/100
                          </span>

                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                            item.riskLevel === 'high' ? 'bg-red-100 text-red-900 border-red-300' :
                            item.riskLevel === 'medium' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            Risk: {item.riskLevel}
                          </span>
                        </div>

                        {/* Contact Person */}
                        <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                          <span>{lead.visitorData.contactName}</span>
                          <span className="text-xs font-mono font-normal text-slate-500">
                            ({lead.visitorData.email} {lead.visitorData.phone ? `• ${lead.visitorData.phone}` : ''})
                          </span>
                        </div>

                        {/* Financials & Days Inactive */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-mono">
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Est. Value</span>
                            <span className="font-bold text-slate-900">
                              ${(lead.qualification.estimatedOpportunityValue || 0).toLocaleString()} USD
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Weighted Pipe</span>
                            <span className="font-bold text-amber-700">
                              ${(lead.qualification.weightedPipelineValue || 0).toLocaleString()} USD
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Last Activity</span>
                            <span className={`font-bold ${
                              item.daysSinceLastActivity >= 7 ? 'text-red-700' :
                              item.daysSinceLastActivity >= 3 ? 'text-amber-700' :
                              'text-emerald-700'
                            }`}>
                              {item.daysSinceLastActivity === 0 ? 'Today' : `${item.daysSinceLastActivity} days ago`}
                            </span>
                          </div>
                        </div>

                        {/* Derived Next Action */}
                        <div className="text-xs bg-amber-50/90 border border-amber-200 p-2.5 rounded-lg text-amber-950 font-medium">
                          <span className="font-bold text-[10px] text-amber-800 uppercase block tracking-wider">Next Action:</span>
                          {item.derivedNextAction}
                        </div>
                      </div>

                      {/* Right: Quick Actions & Schedule */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                        
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold lg:text-right">Assigned Growth Partner</span>
                          <span className="font-semibold text-slate-800 text-xs flex items-center space-x-1 lg:justify-end">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.qualification.assignedTo || 'Unassigned'}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold lg:text-right">Follow-Up Schedule</span>
                          <span className="font-mono font-bold text-xs text-slate-900 lg:text-right block">
                            {lead.qualification.nextFollowUpAt
                              ? formatFollowUpDateTime(lead.qualification.nextFollowUpAt)
                              : 'Unscheduled'}
                          </span>
                          {lead.qualification.nextFollowUpRemark && (
                            <span className="text-[11px] font-medium text-amber-800 lg:text-right block">
                              {lead.qualification.nextFollowUpRemark}
                            </span>
                          )}
                        </div>

                        {/* Direct Quick Actions */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {lead.qualification.nextFollowUpAt ? (
                            <>
                              <button
                                disabled={isUpdating}
                                onClick={() => setActiveScheduleLead({ lead, mode: 'reschedule' })}
                                className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors flex items-center space-x-1"
                                title="Re-schedule this follow-up"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Re-schedule</span>
                              </button>
                              <button
                                disabled={isUpdating}
                                onClick={() => handleCancelFollowUp(lead)}
                                className="px-2 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded text-[11px] font-semibold border border-slate-200 transition-colors flex items-center space-x-1"
                                title="Cancel follow-up"
                              >
                                <CalendarX className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            </>
                          ) : (
                            <button
                              disabled={isUpdating}
                              onClick={() => setActiveScheduleLead({ lead, mode: 'schedule' })}
                              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors flex items-center space-x-1"
                              title="Schedule a follow-up date and time"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Schedule</span>
                            </button>
                          )}

                          {/* Mark Contacted Button */}
                          <button
                            disabled={isUpdating}
                            onClick={() => handleMarkContacted(lead)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-bold border border-slate-300 transition-colors flex items-center space-x-1"
                            title="Record contact made today"
                          >
                            <PhoneCall className="w-3 h-3 text-slate-600" />
                            <span>Contacted</span>
                          </button>

                          {/* Full Manage Lead Button */}
                          <button
                            onClick={() => onSelectLead(lead)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold shadow-xs transition-colors flex items-center space-x-1"
                          >
                            <span>Manage</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Cancellation Confirmation Dialog (ADM-09) */}
      {leadToCancel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <CalendarX className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">Cancel Follow-Up</h3>
                <p className="text-xs text-slate-700 mt-1 font-semibold">
                  Cancel the currently scheduled follow-up?
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  The lead will be moved to <strong>Unscheduled</strong>. Historical activity and notes will be preserved.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLeadToCancel(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Keep Follow-Up
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule / Re-Schedule Modal (ADM-09) */}
      {activeScheduleLead && (
        <AdminScheduleFollowUpModal
          isOpen={true}
          lead={activeScheduleLead.lead}
          mode={activeScheduleLead.mode}
          onClose={() => setActiveScheduleLead(null)}
          onSaveSchedule={handleSaveSchedule}
          onSaveReschedule={handleSaveReschedule}
        />
      )}
    </div>
  );
};
