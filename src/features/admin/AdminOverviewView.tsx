import React from 'react';
import {
  CompleteLeadRecord,
  OpportunityStage,
  STAGE_PROBABILITIES
} from '../../services/qualification';
import { FollowUpAutomationEngine } from '../../services/followUpAutomation';
import {
  Users,
  Sparkles,
  CheckCircle2,
  Clock,
  Trophy,
  XCircle,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  Calendar,
  Building2,
  ChevronRight,
  TrendingUp,
  FileText,
  Handshake,
  DollarSign,
  Activity,
  Check
} from 'lucide-react';
import { AdminViewTab } from './AdminSidebar';

interface AdminOverviewViewProps {
  leads: CompleteLeadRecord[];
  onSelectLead: (lead: CompleteLeadRecord) => void;
  onNavigateTo: (tab: AdminViewTab) => void;
  onUpdateStage: (leadId: string, newStage: OpportunityStage) => Promise<void>;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  leads,
  onSelectLead,
  onNavigateTo,
  onUpdateStage
}) => {
  const now = new Date();

  // 1. KEY METRICS CALCULATION
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new');
  const qualifiedLeads = leads.filter(
    (l) =>
      ['qualified', 'discovery', 'proposal', 'negotiations', 'won'].includes(
        l.qualification.opportunityStage || ''
      )
  );
  const activeOpportunities = leads.filter(
    (l) => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost'
  );
  const wonLeads = leads.filter((l) => l.qualification.opportunityStage === 'won');
  const lostLeads = leads.filter((l) => l.qualification.opportunityStage === 'lost');

  const wonRevenue = wonLeads.reduce(
    (sum, l) => sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0),
    0
  );

  const activePipelineValue = activeOpportunities.reduce(
    (sum, l) => sum + (l.qualification.estimatedOpportunityValue || 0),
    0
  );

  // 2. PIPELINE STAGE SUMMARY DATA
  const STAGE_ORDER: { id: OpportunityStage; label: string; color: string; barColor: string }[] = [
    { id: 'new', label: 'New', color: 'text-blue-700 bg-blue-50 border-blue-200', barColor: 'bg-blue-500' },
    { id: 'contacted', label: 'Contacted', color: 'text-amber-700 bg-amber-50 border-amber-200', barColor: 'bg-amber-500' },
    { id: 'qualified', label: 'Qualified', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500' },
    { id: 'discovery', label: 'Discovery', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', barColor: 'bg-indigo-500' },
    { id: 'proposal', label: 'Proposal', color: 'text-purple-700 bg-purple-50 border-purple-200', barColor: 'bg-purple-500' },
    { id: 'negotiations', label: 'Negotiations', color: 'text-rose-700 bg-rose-50 border-rose-200', barColor: 'bg-rose-500' },
    { id: 'won', label: 'Won', color: 'text-teal-700 bg-teal-50 border-teal-200', barColor: 'bg-teal-600' },
    { id: 'lost', label: 'Lost', color: 'text-slate-600 bg-slate-100 border-slate-200', barColor: 'bg-slate-400' }
  ];

  const pipelineStagesData = STAGE_ORDER.map((stage) => {
    const stageLeads = leads.filter((l) => (l.qualification.opportunityStage || 'new') === stage.id);
    const value = stageLeads.reduce((sum, l) => {
      if (stage.id === 'won') {
        return sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0);
      }
      return sum + (l.qualification.estimatedOpportunityValue || 0);
    }, 0);
    const count = stageLeads.length;
    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
    return {
      ...stage,
      count,
      value,
      percentage
    };
  });

  // 3. PRIORITY ACTIONS / NEEDS ATTENTION (Actual CRM Data)
  interface PriorityItem {
    id: string;
    lead: CompleteLeadRecord;
    category: 'OVERDUE' | 'NEW_AWAITING_CONTACT' | 'DUE_TODAY' | 'PROPOSAL_RESPONSE' | 'NEGOTIATION';
    title: string;
    description: string;
    priorityBadge: string;
    priorityColor: string;
    urgency: number; // Higher number = more urgent
  }

  const priorityItems: PriorityItem[] = [];

  activeOpportunities.forEach((lead) => {
    const evalRes = FollowUpAutomationEngine.evaluateOpportunity(lead, now);
    const stage = lead.qualification.opportunityStage || 'new';

    if (evalRes.classification === 'OVERDUE') {
      const targetMs = lead.qualification.nextFollowUpAt ? new Date(lead.qualification.nextFollowUpAt).getTime() : 0;
      const daysOverdue = targetMs > 0 ? Math.max(1, Math.floor((now.getTime() - targetMs) / (1000 * 3600 * 24))) : 1;

      priorityItems.push({
        id: `overdue-${lead.leadId}`,
        lead,
        category: 'OVERDUE',
        title: `Overdue Follow-up: ${lead.visitorData.organizationName || lead.visitorData.contactName}`,
        description: `Target date was ${new Date(lead.qualification.nextFollowUpAt!).toLocaleDateString()} (${daysOverdue} days overdue).`,
        priorityBadge: 'OVERDUE',
        priorityColor: 'bg-red-100 text-red-800 border-red-200',
        urgency: 100 + daysOverdue
      });
    } else if (stage === 'new') {
      priorityItems.push({
        id: `new-${lead.leadId}`,
        lead,
        category: 'NEW_AWAITING_CONTACT',
        title: `New Inquiry Awaiting Initial Contact: ${lead.visitorData.contactName}`,
        description: `${lead.visitorData.organizationName || 'Practice'} • Objective: ${lead.visitorData.growthObjective || 'Growth strategy'}`,
        priorityBadge: 'NEW LEAD',
        priorityColor: 'bg-blue-100 text-blue-800 border-blue-200',
        urgency: 90
      });
    } else if (evalRes.classification === 'DUE_TODAY') {
      priorityItems.push({
        id: `today-${lead.leadId}`,
        lead,
        category: 'DUE_TODAY',
        title: `Follow-up Due Today: ${lead.visitorData.organizationName || lead.visitorData.contactName}`,
        description: `Scheduled engagement: ${evalRes.derivedNextAction}`,
        priorityBadge: 'DUE TODAY',
        priorityColor: 'bg-amber-100 text-amber-900 border-amber-200',
        urgency: 80
      });
    } else if (stage === 'proposal') {
      priorityItems.push({
        id: `prop-${lead.leadId}`,
        lead,
        category: 'PROPOSAL_RESPONSE',
        title: `Proposal Decision Pending: ${lead.visitorData.organizationName || lead.visitorData.contactName}`,
        description: `Proposal value: $${(lead.qualification.proposalValue || lead.qualification.estimatedOpportunityValue || 0).toLocaleString()} USD. Follow up on executive review.`,
        priorityBadge: 'PROPOSAL',
        priorityColor: 'bg-purple-100 text-purple-800 border-purple-200',
        urgency: 70
      });
    } else if (stage === 'negotiations') {
      priorityItems.push({
        id: `neg-${lead.leadId}`,
        lead,
        category: 'NEGOTIATION',
        title: `Active Contract Negotiations: ${lead.visitorData.organizationName || lead.visitorData.contactName}`,
        description: `Final terms discussion pending for ${(lead.qualification.decisionMaker || lead.visitorData.contactName)}.`,
        priorityBadge: 'NEGOTIATIONS',
        priorityColor: 'bg-rose-100 text-rose-800 border-rose-200',
        urgency: 60
      });
    }
  });

  // Sort by urgency descending
  priorityItems.sort((a, b) => b.urgency - a.urgency);
  const topPriorityItems = priorityItems.slice(0, 5);

  // 4. RECENT ACTIVITY PREVIEW (Derived from real leads and updates)
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">

      {/* SECTION 1 — KEY METRICS (Responsive Grid: 2 cols on mobile, 3 cols on tablet, 6 on desktop) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Operational Key Metrics
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Real-time Snapshot</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {/* Total Leads */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL LEADS</span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">{totalLeads}</div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">All time submissions</div>
          </div>

          {/* New Leads */}
          <div className="p-3.5 bg-white rounded-xl border border-blue-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between text-blue-700 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">NEW LEADS</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-900">{newLeads.length}</div>
            <div className="text-[10px] text-blue-600 mt-1 truncate">Awaiting first outreach</div>
          </div>

          {/* Qualified Leads */}
          <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between text-emerald-700 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">QUALIFIED</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-900">{qualifiedLeads.length}</div>
            <div className="text-[10px] text-emerald-600 mt-1 truncate">Pre-vetted pipeline</div>
          </div>

          {/* Active Opportunities */}
          <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between text-amber-700 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">ACTIVE PIPE</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-900">{activeOpportunities.length}</div>
            <div className="text-[10px] text-amber-700 font-mono mt-1 truncate">
              ${activePipelineValue.toLocaleString()}
            </div>
          </div>

          {/* Won Partnerships */}
          <div className="p-3.5 bg-white rounded-xl border border-teal-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between text-teal-700 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">CLOSED WON</span>
              <Trophy className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-teal-900">{wonLeads.length}</div>
            <div className="text-[10px] text-teal-700 font-mono mt-1 truncate font-semibold">
              ${wonRevenue.toLocaleString()}
            </div>
          </div>

          {/* Lost */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">CLOSED LOST</span>
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-700">{lostLeads.length}</div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">Terminal archive</div>
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3: SPLIT GRID — PIPELINE SUMMARY & PRIORITY ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / TOP: PIPELINE DISTRIBUTION SUMMARY (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pipeline Stage Distribution</h3>
              <p className="text-xs text-slate-500">Live breakdown across all 8 pipeline milestones</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTo('pipeline')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors p-1"
            >
              <span>Full Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pipeline Stage Visual Bars */}
          <div className="space-y-2.5">
            {pipelineStagesData.map((stg) => (
              <div key={stg.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-800 text-xs">{stg.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">({Math.round((STAGE_PROBABILITIES[stg.id] || 0) * 100)}% prob)</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="font-bold text-slate-800">{stg.count} leads</span>
                    {stg.value > 0 && (
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        • ${stg.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Track */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${stg.barColor}`}
                    style={{ width: `${Math.min(100, Math.max(stg.count > 0 ? 5 : 0, stg.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Forward Pipeline Flow Helper */}
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/60 text-[10px] text-slate-600 flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-800 uppercase">Forward Flow:</span>
            <span>New</span>
            <span>→</span>
            <span>Contacted</span>
            <span>→</span>
            <span>Qualified</span>
            <span>→</span>
            <span>Discovery</span>
            <span>→</span>
            <span>Proposal</span>
            <span>→</span>
            <span className="font-bold text-rose-700">Negotiations</span>
            <span>→</span>
            <span className="font-bold text-teal-700">Won</span>
          </div>
        </div>

        {/* RIGHT: PRIORITY ACTIONS / "NEEDS ATTENTION" (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Needs Attention</h3>
                <p className="text-xs text-slate-500">{priorityItems.length} actionable items</p>
              </div>
            </div>
            {priorityItems.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Action Required
              </span>
            )}
          </div>

          {/* List of Priority Actions */}
          {topPriorityItems.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">All caught up!</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                No overdue follow-ups, uncontacted inquiries, or pending stage reviews at this moment.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {topPriorityItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectLead(item.lead)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${item.priorityColor}`}
                    >
                      {item.priorityBadge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.lead.qualification.opportunityStage || 'new'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                    <span>{item.lead.visitorData.contactName}</span>
                    <span className="font-semibold text-amber-700 group-hover:underline flex items-center space-x-0.5">
                      <span>View & Respond</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}

              {priorityItems.length > 5 && (
                <button
                  type="button"
                  onClick={() => onNavigateTo('followups')}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-amber-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                  View all {priorityItems.length} priority items in Follow-up Queue →
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* SECTION 4 — RECENT ACTIVITY STREAM & QUICK ACCESS */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-slate-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Lead Submissions & Activity</h3>
              <p className="text-xs text-slate-500">Latest business submissions recorded in CRM</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTo('database')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors p-1"
          >
            <span>All Leads Database</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No leads recorded in the system yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentLeads.map((lead) => (
              <div
                key={lead.leadId}
                onClick={() => onSelectLead(lead)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-start sm:items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                    {lead.visitorData.contactName.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {lead.visitorData.contactName}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate hidden md:inline">
                        {lead.visitorData.organizationName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">
                      {lead.visitorData.email} • {lead.visitorData.healthcareCategory || 'Healthcare'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 text-xs">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                      lead.qualification.opportunityStage === 'won'
                        ? 'bg-teal-100 text-teal-800'
                        : lead.qualification.opportunityStage === 'lost'
                        ? 'bg-slate-100 text-slate-600'
                        : lead.qualification.opportunityStage === 'negotiations'
                        ? 'bg-rose-100 text-rose-800'
                        : lead.qualification.opportunityStage === 'proposal'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {lead.qualification.opportunityStage || 'new'}
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
