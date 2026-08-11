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
  PhoneCall
} from 'lucide-react';

interface AdminFollowUpsViewProps {
  leads: CompleteLeadRecord[];
  onSelectLead: (lead: CompleteLeadRecord) => void;
}

export const AdminFollowUpsView: React.FC<AdminFollowUpsViewProps> = ({
  leads,
  onSelectLead
}) => {
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const now = new Date();
  const healthSummary: PipelineHealthSummary = FollowUpAutomationEngine.calculatePipelineHealth(leads, now);

  const activeLeads = leads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');

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
      const nowIso = new Date().toISOString();
      await adminLeadsService.updateLead(lead.leadId, {
        lastContactedAt: nowIso,
        status: lead.status === 'new' ? 'contacted' : lead.status
      });
      await adminLeadsService.addActivity(lead.leadId, {
        type: 'contact_made',
        description: 'Growth Partner recorded direct outreach / contact made with client.',
        actor: lead.qualification.assignedTo || 'Growth Partner'
      });
      setActionSuccessMessage(`Contact logged for ${lead.visitorData.organizationName || lead.visitorData.contactName}`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to mark lead contacted:', err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleQuickSchedule = async (lead: CompleteLeadRecord, daysFromNow: number) => {
    try {
      setUpdatingLeadId(lead.leadId);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysFromNow);
      targetDate.setHours(10, 0, 0, 0); // Default to 10:00 AM
      const isoDate = targetDate.toISOString();

      await adminLeadsService.updateLead(lead.leadId, {
        nextFollowUpAt: isoDate
      });
      await adminLeadsService.addActivity(lead.leadId, {
        type: 'follow_up_scheduled',
        description: `Follow-up quick-scheduled for ${targetDate.toLocaleDateString()} 10:00 AM`,
        actor: lead.qualification.assignedTo || 'Growth Partner'
      });
      setActionSuccessMessage(`Follow-up scheduled for ${targetDate.toLocaleDateString()}`);
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
                          <span className="text-[10px] text-slate-400 block uppercase font-bold lg:text-right">Target Date</span>
                          <span className="font-mono font-bold text-xs text-slate-900 lg:text-right block">
                            {lead.qualification.nextFollowUpAt
                              ? new Date(lead.qualification.nextFollowUpAt).toLocaleDateString()
                              : 'Not Scheduled'}
                          </span>
                        </div>

                        {/* Direct Quick Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {/* Mark Contacted Button */}
                          <button
                            disabled={isUpdating}
                            onClick={() => handleMarkContacted(lead)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-bold border border-slate-300 transition-colors flex items-center space-x-1"
                            title="Record contact made today"
                          >
                            <PhoneCall className="w-3 h-3 text-slate-600" />
                            <span>Mark Contacted</span>
                          </button>

                          {/* Quick Schedule Options */}
                          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 p-1 rounded">
                            <span className="text-[9px] font-bold uppercase text-slate-400 px-1">Schedule:</span>
                            <button
                              disabled={isUpdating}
                              onClick={() => handleQuickSchedule(lead, 0)}
                              className="px-1.5 py-0.5 text-[10px] font-bold bg-white hover:bg-amber-50 text-amber-800 rounded border border-slate-200 shadow-2xs"
                            >
                              Today
                            </button>
                            <button
                              disabled={isUpdating}
                              onClick={() => handleQuickSchedule(lead, 1)}
                              className="px-1.5 py-0.5 text-[10px] font-bold bg-white hover:bg-amber-50 text-amber-800 rounded border border-slate-200 shadow-2xs"
                            >
                              Tomorrow
                            </button>
                            <button
                              disabled={isUpdating}
                              onClick={() => handleQuickSchedule(lead, 3)}
                              className="px-1.5 py-0.5 text-[10px] font-bold bg-white hover:bg-amber-50 text-amber-800 rounded border border-slate-200 shadow-2xs"
                            >
                              +3d
                            </button>
                            <button
                              disabled={isUpdating}
                              onClick={() => handleQuickSchedule(lead, 7)}
                              className="px-1.5 py-0.5 text-[10px] font-bold bg-white hover:bg-amber-50 text-amber-800 rounded border border-slate-200 shadow-2xs"
                            >
                              +7d
                            </button>
                          </div>

                          {/* Full Manage Lead Button */}
                          <button
                            onClick={() => onSelectLead(lead)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors flex items-center space-x-1"
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
    </div>
  );
};
