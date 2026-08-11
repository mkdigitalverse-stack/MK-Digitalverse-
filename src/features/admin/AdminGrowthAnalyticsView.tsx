import React, { useMemo } from 'react';
import { CompleteLeadRecord } from '../../services/qualification';
import { GrowthAnalyticsService } from '../../services/growthAnalyticsService';
import { AnalyticsFunnelCard } from './AnalyticsFunnelCard';
import { AnalyticsSegmentMatrix } from './AnalyticsSegmentMatrix';
import { AnalyticsChannelEconomics } from './AnalyticsChannelEconomics';
import { AnalyticsDiagnosticAlerts } from './AnalyticsDiagnosticAlerts';
import { TrendingUp, PieChart, ShieldCheck, DollarSign, Award, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminGrowthAnalyticsViewProps {
  leads: CompleteLeadRecord[];
}

export const AdminGrowthAnalyticsView: React.FC<AdminGrowthAnalyticsViewProps> = ({ leads }) => {

  // Memoized intelligence calculation to prevent unnecessary re-computations
  const intelligence = useMemo(() => {
    return GrowthAnalyticsService.generateIntelligence(leads);
  }, [leads]);

  const { funnel, revenue, channels, segments, campaigns, operational, diagnostics } = intelligence;

  return (
    <div className="space-y-6">
      
      {/* Executive KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ACTIVE PIPELINE</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">${revenue.activePipelineValue.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{operational.activeLeadsCount} Active Opportunities</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WEIGHTED PIPELINE</span>
            <PieChart className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-900">${revenue.weightedPipelineValue.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Probability Weighted</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CLOSED WON REVENUE</span>
            <Award className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-900">${revenue.wonRevenueValue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">{funnel.wonCount} Signed Partners</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PRE-QUAL RATE</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-lg font-bold font-mono text-purple-900">{funnel.qualificationRate.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{funnel.qualifiedLeads} Qualified Leads</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PIPELINE HEALTH</span>
            <div className={`w-2.5 h-2.5 rounded-full ${operational.healthScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">{operational.healthScore}/100</div>
          <div className="text-[10px] text-slate-500 mt-0.5">SLA Compliance</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">OVERDUE TOUCHES</span>
            <AlertCircle className={`w-3.5 h-3.5 ${operational.overdueFollowUpsCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-lg font-bold font-mono ${operational.overdueFollowUpsCount > 0 ? 'text-red-700' : 'text-slate-900'}`}>
            {operational.overdueFollowUpsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{operational.staleOpportunitiesCount} Stale Opps</div>
        </div>
      </div>

      {/* Diagnostics Engine Component */}
      <AnalyticsDiagnosticAlerts diagnostics={diagnostics} />

      {/* Main Grid Layout: Funnel + Channel Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsFunnelCard funnel={funnel} />
        <AnalyticsChannelEconomics channels={channels} campaigns={campaigns} />
      </div>

      {/* Healthcare Segment Matrix */}
      <AnalyticsSegmentMatrix segments={segments} />

    </div>
  );
};
