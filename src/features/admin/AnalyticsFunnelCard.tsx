import React from 'react';
import { FunnelSummary } from '../../services/growthAnalyticsService';
import { Filter, ArrowDown, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

interface AnalyticsFunnelCardProps {
  funnel: FunnelSummary;
}

export const AnalyticsFunnelCard: React.FC<AnalyticsFunnelCardProps> = ({ funnel }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">End-to-End Revenue Funnel Velocity</h3>
            <p className="text-[11px] text-slate-500">Stage-by-stage conversion tracking from inquiry to closed-won partner</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono font-medium">
            Total Inquiries: {funnel.totalLeads}
          </span>
          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 font-mono font-bold">
            Closed Won: {funnel.wonCount}
          </span>
        </div>
      </div>

      {/* Key Conversion Rates Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pre-Qualification Rate</div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono text-slate-900">{funnel.qualificationRate.toFixed(1)}%</span>
            <span className="text-[10px] text-slate-500">{funnel.qualifiedLeads}/{funnel.totalLeads} Leads</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/60">
          <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">Discovery Booking Rate</div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono text-blue-900">{funnel.discoveryBookingRate.toFixed(1)}%</span>
            <span className="text-[10px] text-blue-700">{funnel.discoveryCount}/{funnel.qualifiedLeads} Qualified</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200/60">
          <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">Proposal Rate</div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono text-purple-900">{funnel.proposalRate.toFixed(1)}%</span>
            <span className="text-[10px] text-purple-700">{funnel.proposalCount}/{funnel.opportunityCount} Opps</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Proposal Win Rate</div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono text-emerald-900">{funnel.winRate.toFixed(1)}%</span>
            <span className="text-[10px] text-emerald-700">{funnel.wonCount} Closed Won</span>
          </div>
        </div>
      </div>

      {/* Visual Stages Hierarchy */}
      <div className="space-y-2">
        {funnel.stages.map((stg, idx) => {
          const maxCount = Math.max(funnel.totalLeads, 1);
          const barWidthPercent = Math.max(8, Math.round((stg.count / maxCount) * 100));

          return (
            <div key={stg.stageKey} className="group relative">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center border border-slate-200 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{stg.stageName}</span>
                </div>
                <div className="flex items-center space-x-3 font-mono">
                  <span className="text-slate-600 font-bold">{stg.count} leads</span>
                  <span className="text-slate-400 text-[11px]">({stg.percentageOfTotal.toFixed(1)}%)</span>
                  {stg.value > 0 && (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                      ${stg.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    stg.stageKey === 'won'
                      ? 'bg-emerald-500'
                      : stg.stageKey === 'proposal' || stg.stageKey === 'negotiation'
                      ? 'bg-purple-500'
                      : stg.stageKey === 'qualified' || stg.stageKey === 'discovery'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              {/* Step Dropoff Indicator */}
              {idx < funnel.stages.length - 1 && stg.dropoffRate > 0 && (
                <div className="flex items-center justify-end text-[10px] text-slate-400 space-x-1 py-0.5 pr-1">
                  <ArrowDown className="w-2.5 h-2.5 text-slate-300" />
                  <span>{stg.dropoffRate.toFixed(1)}% step drop-off</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
