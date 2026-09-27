import React, { useState, useMemo } from 'react';
import { CompleteLeadRecord } from '../../services/qualification';
import {
  ReportingPeriod,
  ReportingDateService,
  ReportingDateContext
} from '../../services/reportingDateService';
import {
  LeadReportingService,
  LeadReportSummary
} from '../../services/leadReportingService';
import { exportLeadsToCsv } from '../../services/leadExportService';
import { AdminReportingDateSelector } from './AdminReportingDateSelector';
import {
  FileSpreadsheet,
  Download,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Building,
  Target,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface AdminLeadReportsViewProps {
  leads: CompleteLeadRecord[];
}

export const AdminLeadReportsView: React.FC<AdminLeadReportsViewProps> = ({ leads }) => {
  const [period, setPeriod] = useState<ReportingPeriod>('this_month');
  const [customStart, setCustomStart] = useState<string | undefined>();
  const [customEnd, setCustomEnd] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Date context
  const dateContext: ReportingDateContext = useMemo(() => {
    return ReportingDateService.resolveDateContext(period, customStart, customEnd);
  }, [period, customStart, customEnd]);

  // Lead report data
  const summary: LeadReportSummary = useMemo(() => {
    return LeadReportingService.generateLeadReport(leads, dateContext);
  }, [leads, dateContext]);

  const handleChangePeriod = (newPeriod: ReportingPeriod, start?: string, end?: string) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setCustomStart(start);
      setCustomEnd(end);
    } else {
      setCustomStart(undefined);
      setCustomEnd(undefined);
    }
  };

  // Filtered attribution table rows based on local search
  const filteredAttribution = useMemo(() => {
    if (!searchQuery) return summary.attribution;
    const q = searchQuery.toLowerCase();
    return summary.attribution.filter(
      r =>
        r.source.toLowerCase().includes(q) ||
        r.medium.toLowerCase().includes(q) ||
        r.campaign.toLowerCase().includes(q) ||
        r.referrer.toLowerCase().includes(q)
    );
  }, [summary.attribution, searchQuery]);

  // Handle Export
  const handleExport = () => {
    const isAllTime = dateContext.period === 'all';
    const periodLeads = isAllTime
      ? leads
      : ReportingDateService.filterRecordsByRange(leads, dateContext.currentRange);

    const safeLabel = dateContext.period.replace(/_/g, '-');
    exportLeadsToCsv(periodLeads, 'filtered', `lead-reports-${safeLabel}`);

    setExportFeedback(`Exported ${periodLeads.length} leads matching ${dateContext.currentRange.label}`);
    setTimeout(() => setExportFeedback(null), 4000);
  };

  const { quality, intent, velocity, topChallenges, topGrowthObjectives, categories } = summary;

  return (
    <div className="space-y-6">

      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider">
              Lead Operations • ADM-04
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Lead Reports & Acquisition Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Traffic attribution, clinical fit distribution, inquiry intent, and response velocity diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <AdminReportingDateSelector
            dateContext={dateContext}
            onChangePeriod={handleChangePeriod}
          />

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors min-h-[36px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Lead Report</span>
          </button>
        </div>
      </div>

      {exportFeedback && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            TOTAL INTAKE
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {summary.totalLeadsInPeriod}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">In selected period</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
            PRE-QUALIFICATION RATE
          </span>
          <div className="text-2xl font-bold font-mono text-purple-900">
            {quality.qualificationRate}%
          </div>
          <span className="text-[11px] text-purple-700/80 block mt-1">
            {quality.highFit + quality.mediumFit} qualified leads
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
            FIRST-CONTACT RATE
          </span>
          <div className="text-2xl font-bold font-mono text-blue-900">
            {velocity.contactedRate}%
          </div>
          <span className="text-[11px] text-blue-700/80 block mt-1">
            {velocity.contactedCount} contacted · {velocity.uncontactedCount} pending
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            HIGH-INTENT INQUIRIES
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-900">
            {intent.highIntent}
          </div>
          <span className="text-[11px] text-emerald-700/80 block mt-1">
            {summary.totalLeadsInPeriod > 0 ? Math.round((intent.highIntent / summary.totalLeadsInPeriod) * 100) : 0}% of inquiries
          </span>
        </div>
      </div>

      {/* 3. Deep Breakdowns Grid: Fit Distribution & Response Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lead Fit & Quality Distribution */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Lead Quality & Fit Distribution</h2>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs text-slate-500">
            Automated qualification scoring assessing healthcare organization size, budget readiness, and clinical alignment.
          </p>

          <div className="space-y-2 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">High Enterprise Fit</span>
                <span className="font-mono text-slate-700 font-bold">{quality.highFit} ({quality.highFitPercentage}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${quality.highFitPercentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Medium Fit</span>
                <span className="font-mono text-slate-700 font-bold">
                  {quality.mediumFit} ({summary.totalLeadsInPeriod > 0 ? Math.round((quality.mediumFit / summary.totalLeadsInPeriod) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{
                    width: `${summary.totalLeadsInPeriod > 0 ? Math.round((quality.mediumFit / summary.totalLeadsInPeriod) * 100) : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Low Fit / Single Provider</span>
                <span className="font-mono text-slate-700 font-bold">
                  {quality.lowFit} ({summary.totalLeadsInPeriod > 0 ? Math.round((quality.lowFit / summary.totalLeadsInPeriod) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-slate-400 h-2 rounded-full"
                  style={{
                    width: `${summary.totalLeadsInPeriod > 0 ? Math.round((quality.lowFit / summary.totalLeadsInPeriod) * 100) : 0}%`
                  }}
                />
              </div>
            </div>

            {quality.unreviewed > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">Pending Manual Review</span>
                  <span className="font-mono text-slate-500 font-bold">{quality.unreviewed}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Response Velocity & Follow-Up SLA Adherence */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Outreach Velocity & SLA Compliance</h2>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-slate-500">
            Monitoring response times, task scheduling, and follow-up SLA adherence on active healthcare opportunities.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">ON TRACK</span>
              <span className="text-lg font-bold font-mono text-slate-900">{velocity.onTrackCount}</span>
              <span className="text-[10px] text-slate-500 block">Within SLA window</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">DUE TODAY</span>
              <span className="text-lg font-bold font-mono text-slate-900">{velocity.dueTodayCount}</span>
              <span className="text-[10px] text-slate-500 block">Touches scheduled</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[10px] font-bold text-rose-800 uppercase block">OVERDUE</span>
              <span className="text-lg font-bold font-mono text-rose-900">{velocity.overdueCount}</span>
              <span className="text-[10px] text-rose-700 block">Requires immediate call</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-600 uppercase block">UNSCHEDULED</span>
              <span className="text-lg font-bold font-mono text-slate-900">{velocity.unscheduledCount}</span>
              <span className="text-[10px] text-slate-500 block">No next action set</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Challenges & Growth Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stated Challenges */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Top Stated Clinical Challenges</h2>
          <p className="text-xs text-slate-500 mb-3">
            Primary bottlenecks reported by healthcare leaders in the consultation intake.
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {topChallenges.map((ch, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <span className="text-slate-800">{ch.label}</span>
                <span className="font-mono text-slate-900 font-bold">{ch.count} ({ch.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Objectives */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Clinical Growth Objectives</h2>
          <p className="text-xs text-slate-500 mb-3">
            Strategic targets healthcare groups are seeking to achieve.
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {topGrowthObjectives.map((obj, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <span className="text-slate-800">{obj.objective}</span>
                <span className="font-mono text-slate-900 font-bold">{obj.count} ({obj.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Attribution Detail Table */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Lead Attribution Audit Log</h2>
            <p className="text-xs text-slate-500">
              Granular source, campaign, and conversion rate attribution by inquiry batch.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search source, campaign, medium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">UTM Source</th>
                <th className="py-2.5 px-3">Medium</th>
                <th className="py-2.5 px-3">Campaign</th>
                <th className="py-2.5 px-3 text-right">Total Leads</th>
                <th className="py-2.5 px-3 text-right">Qualified</th>
                <th className="py-2.5 px-3 text-right">Pre-Qual %</th>
                <th className="py-2.5 px-3 text-right">Won Clients</th>
                <th className="py-2.5 px-3 text-right">Active Deal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttribution.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">
                    No attribution records matching the current filter and date range.
                  </td>
                </tr>
              ) : (
                filteredAttribution.map((attr) => (
                  <tr key={attr.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {attr.source}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {attr.medium}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {attr.campaign}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      {attr.totalLeads}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-purple-900 font-medium">
                      {attr.qualifiedLeads}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {attr.qualificationRate}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-bold">
                      {attr.wonCount}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-900 font-semibold">
                      ${attr.activeValue.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
