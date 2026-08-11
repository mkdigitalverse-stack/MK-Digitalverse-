import React from 'react';
import { CompleteLeadRecord } from '../../services/qualification';
import { FollowUpAutomationEngine } from '../../services/followUpAutomation';
import { Users, CheckCircle2, FileText, Trophy, Clock, PieChart, AlertCircle, Flame, CalendarX } from 'lucide-react';

interface AdminKpiMetricsProps {
  leads: CompleteLeadRecord[];
}

export const AdminKpiMetrics: React.FC<AdminKpiMetricsProps> = ({ leads }) => {
  const now = new Date();

  // 1. Total Opportunities
  const totalLeads = leads.length;

  // 2. Active Opportunities (not won, not lost)
  const activeLeads = leads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');
  const activeCount = activeLeads.length;

  // 3. Qualified Opportunities (qualified, discovery, proposal, negotiation)
  const qualifiedCount = leads.filter(l => ['qualified', 'discovery', 'proposal', 'negotiation'].includes(l.qualification.opportunityStage || '')).length;

  // 4. Proposal Value
  const proposalLeads = leads.filter(l => l.qualification.opportunityStage === 'proposal');
  const proposalValue = proposalLeads.reduce((sum, l) => sum + (l.qualification.proposalValue || l.qualification.estimatedOpportunityValue || 0), 0);

  // 5. Weighted Pipeline Value across active opportunities
  const weightedPipelineValue = activeLeads.reduce((sum, l) => sum + (l.qualification.weightedPipelineValue || 0), 0);

  // 6. Won Value
  const wonLeads = leads.filter(l => l.qualification.opportunityStage === 'won');
  const wonValue = wonLeads.reduce((sum, l) => sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0), 0);

  // 7. Follow-Up Automation Metrics
  let overdueCount = 0;
  let staleCount = 0;
  let unscheduledCount = 0;

  activeLeads.forEach(lead => {
    const evalResult = FollowUpAutomationEngine.evaluateOpportunity(lead, now);
    if (evalResult.classification === 'OVERDUE') overdueCount++;
    if (evalResult.daysSinceLastActivity >= 7) staleCount++;
    if (!lead.qualification.nextFollowUpAt) unscheduledCount++;
  });

  const cards = [
    {
      label: 'TOTAL OPPORTUNITIES',
      value: totalLeads,
      icon: Users,
      color: 'text-slate-800 bg-slate-100 border-slate-200',
      badge: `${totalLeads} Total`
    },
    {
      label: 'ACTIVE PIPELINE',
      value: activeCount,
      icon: Clock,
      color: 'text-blue-800 bg-blue-50 border-blue-200',
      badge: 'In Progress'
    },
    {
      label: 'QUALIFIED LEADS',
      value: qualifiedCount,
      icon: CheckCircle2,
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      badge: 'Vetted Pipeline'
    },
    {
      label: 'PROPOSAL VALUE',
      value: `$${proposalValue.toLocaleString()}`,
      icon: FileText,
      color: 'text-purple-800 bg-purple-50 border-purple-200',
      badge: `${proposalLeads.length} Proposals`
    },
    {
      label: 'WEIGHTED PIPELINE',
      value: `$${weightedPipelineValue.toLocaleString()}`,
      icon: PieChart,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
      badge: 'Stage Weighted'
    },
    {
      label: 'WON PARTNERSHIPS',
      value: `$${wonValue.toLocaleString()}`,
      icon: Trophy,
      color: 'text-teal-800 bg-teal-50 border-teal-200',
      badge: `${wonLeads.length} Closed`
    },
    {
      label: 'OVERDUE FOLLOW-UPS',
      value: overdueCount,
      icon: AlertCircle,
      color: overdueCount > 0 ? 'text-red-800 bg-red-50 border-red-200' : 'text-slate-700 bg-slate-50 border-slate-200',
      badge: overdueCount > 0 ? 'Urgent Action' : 'On Schedule'
    },
    {
      label: 'STALE (7+ DAYS INACTIVE)',
      value: staleCount,
      icon: Flame,
      color: staleCount > 0 ? 'text-orange-900 bg-orange-50 border-orange-200' : 'text-slate-700 bg-slate-50 border-slate-200',
      badge: staleCount > 0 ? 'Re-engage' : 'Active Engagement'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`p-3 rounded-xl border ${card.color} shadow-2xs transition-all hover:shadow-xs flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold tracking-wider uppercase opacity-80 truncate">{card.label}</span>
              <IconComponent className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-lg font-bold tracking-tight font-mono">{card.value}</span>
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/80 border border-current/10 truncate">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
