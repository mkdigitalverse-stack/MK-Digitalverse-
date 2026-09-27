import React, { useState, useMemo } from 'react';
import { CompleteLeadRecord, OpportunityStage } from '../../services/qualification';
import {
  ReportingPeriod,
  ReportingDateService,
  ReportingDateContext
} from '../../services/reportingDateService';
import {
  SalesReportingService,
  SalesReportSummary,
  CANONICAL_STAGE_ORDER
} from '../../services/salesReportingService';
import { exportLeadsToCsv } from '../../services/leadExportService';
import { AdminReportingDateSelector } from './AdminReportingDateSelector';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  Download,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

interface AdminSalesReportsViewProps {
  leads: CompleteLeadRecord[];
}

export const AdminSalesReportsView: React.FC<AdminSalesReportsViewProps> = ({ leads }) => {
  // Global reporting period state (defaults to 'this_month' with safe calendar boundary)
  const [period, setPeriod] = useState<ReportingPeriod>('this_month');
  const [customStart, setCustomStart] = useState<string | undefined>();
  const [customEnd, setCustomEnd] = useState<string | undefined>();
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Compute resolved date context
  const dateContext: ReportingDateContext = useMemo(() => {
    return ReportingDateService.resolveDateContext(period, customStart, customEnd);
  }, [period, customStart, customEnd]);

  // Compute full sales report summary
  const report: SalesReportSummary = useMemo(() => {
    return SalesReportingService.generateSalesReport(leads, dateContext);
  }, [leads, dateContext]);

  // Handle changing reporting period
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

  // Export filtered leads for current reporting period
  const handleExportReportLeads = () => {
    const isAllTime = dateContext.period === 'all';
    const leadsInPeriod = isAllTime
      ? leads
      : ReportingDateService.filterRecordsByRange(leads, dateContext.currentRange);

    const safeLabel = dateContext.period.replace(/_/g, '-');
    exportLeadsToCsv(leadsInPeriod, 'filtered', `sales-report-${safeLabel}`);

    setExportFeedback(`Exported ${leadsInPeriod.length} leads matching ${dateContext.currentRange.label}`);
    setTimeout(() => setExportFeedback(null), 4000);
  };

  const { kpis, stages, sourcePerformance, specialtyPerformance, timeSeries, lostAnalysis } = report;

  // Max value for time series chart scale
  const maxChartVal = Math.max(
    1,
    ...timeSeries.map(p => Math.max(p.totalLeads, p.qualifiedLeads, p.wonLeads))
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Header Toolbar with Title, Period Selector, and Export Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider">
              CRM Intelligence • ADM-04
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Sales & Pipeline Performance Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic, audited pipeline analytics derived directly from <code className="text-slate-700 font-mono text-[11px]">public.leads.status</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Global Reporting Date Selector */}
          <AdminReportingDateSelector
            dateContext={dateContext}
            onChangePeriod={handleChangePeriod}
          />

          {/* Export Action */}
          <button
            type="button"
            onClick={handleExportReportLeads}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors min-h-[36px]"
            title="Download CSV export of leads in this reporting period"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Period Leads</span>
          </button>
        </div>
      </div>

      {/* Export Feedback notification */}
      {exportFeedback && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* 2. Mandatory Business Governance Banner (PIPELINE VALUE != REVENUE) */}
      <div className="flex items-start gap-3 p-3.5 sm:p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900">
            Accounting Rule: Active Pipeline Value ≠ Realized Revenue
          </span>
          <p className="text-slate-600 leading-relaxed">
            Active pipeline figures represent probability-weighted prospective deal estimates. Realized income is recognized exclusively upon signed partner onboarding and payment confirmation in the ADM-05 finance module.
          </p>
        </div>
      </div>

      {/* 3. Executive KPI Cards (Grid of 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: TOTAL LEADS */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpis.totalLeads.label}</span>
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {kpis.totalLeads.formattedValue}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            {kpis.totalLeads.change.hasValidComparison ? (
              <span className={`inline-flex items-center gap-0.5 font-medium ${
                kpis.totalLeads.change.direction === 'up' ? 'text-emerald-700' :
                kpis.totalLeads.change.direction === 'down' ? 'text-rose-700' : 'text-slate-500'
              }`}>
                {kpis.totalLeads.change.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                {kpis.totalLeads.change.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                {kpis.totalLeads.change.formattedText}
              </span>
            ) : (
              <span className="text-slate-400">No prior period</span>
            )}
            <span className="text-slate-400 truncate text-[10px]">in period</span>
          </div>
        </div>

        {/* KPI 2: NEW LEADS */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpis.newLeads.label}</span>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-blue-900">
              {kpis.newLeads.formattedValue}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            {kpis.newLeads.change.hasValidComparison ? (
              <span className={`inline-flex items-center gap-0.5 font-medium ${
                kpis.newLeads.change.direction === 'up' ? 'text-blue-700' : 'text-slate-500'
              }`}>
                {kpis.newLeads.change.formattedText}
              </span>
            ) : (
              <span className="text-slate-400">No prior period</span>
            )}
            <span className="text-slate-400 text-[10px]">in intake</span>
          </div>
        </div>

        {/* KPI 3: QUALIFIED LEADS */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpis.qualifiedLeads.label}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-purple-900">
              {kpis.qualifiedLeads.formattedValue}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-purple-700">
              {report.overallQualificationRate.toFixed(1)}% rate
            </span>
            {kpis.qualifiedLeads.change.hasValidComparison && (
              <span className="text-slate-500 text-[10px]">
                {kpis.qualifiedLeads.change.formattedText}
              </span>
            )}
          </div>
        </div>

        {/* KPI 4: ACTIVE PIPELINE */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpis.activePipeline.label}</span>
              <Layers className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-900">
              {kpis.activePipeline.formattedValue}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-mono font-medium text-amber-800 text-[10px]">
              ${report.activePipelineValue.toLocaleString()}
            </span>
            <span className="text-slate-400 text-[10px]">est. value</span>
          </div>
        </div>

        {/* KPI 5: CLOSED WON */}
        <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">{kpis.wonLeads.label}</span>
              <Award className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-900">
              {kpis.wonLeads.formattedValue}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-emerald-700">
              {report.overallWinRate.toFixed(1)}% win rate
            </span>
            {kpis.wonLeads.change.hasValidComparison && (
              <span className="text-emerald-700 text-[10px]">
                {kpis.wonLeads.change.formattedText}
              </span>
            )}
          </div>
        </div>

        {/* KPI 6: CLOSED LOST */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpis.lostLeads.label}</span>
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-800">
              {kpis.lostLeads.formattedValue}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              {lostAnalysis.lostRate}% drop rate
            </span>
            {kpis.lostLeads.change.hasValidComparison && (
              <span className="text-slate-500 text-[10px]">
                {kpis.lostLeads.change.formattedText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Sales Progression Over Time (Trend Graph) */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Sales Ingestion & Conversion Timeline</h2>
            <p className="text-xs text-slate-500">
              Tracking inquiries entering the CRM versus qualified opportunities and signed partners over time.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span>Total Leads</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
              <span>Qualified</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Won</span>
            </span>
          </div>
        </div>

        {timeSeries.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
            <BarChart3 className="w-6 h-6 mb-1 text-slate-300" />
            <span>No leads recorded in selected period ({dateContext.currentRange.label})</span>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Visual SVG Bar Timeline */}
            <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2 px-1 border-b border-slate-100 overflow-x-auto">
              {timeSeries.map((pt, i) => {
                const totalH = Math.max(4, Math.round((pt.totalLeads / maxChartVal) * 140));
                const qualH = Math.max(2, Math.round((pt.qualifiedLeads / maxChartVal) * 140));
                const wonH = Math.max(0, Math.round((pt.wonLeads / maxChartVal) * 140));

                return (
                  <div key={i} className="flex-1 min-w-[36px] flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap z-20">
                      {pt.dateLabel}: {pt.totalLeads} leads · {pt.qualifiedLeads} qual · {pt.wonLeads} won
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5 h-36">
                      <div
                        style={{ height: `${totalH}px` }}
                        className="w-2 sm:w-2.5 bg-blue-500/80 rounded-t group-hover:bg-blue-600 transition-colors"
                        title={`Total: ${pt.totalLeads}`}
                      />
                      <div
                        style={{ height: `${qualH}px` }}
                        className="w-2 sm:w-2.5 bg-purple-500/80 rounded-t group-hover:bg-purple-600 transition-colors"
                        title={`Qualified: ${pt.qualifiedLeads}`}
                      />
                      {wonH > 0 && (
                        <div
                          style={{ height: `${wonH}px` }}
                          className="w-2 sm:w-2.5 bg-emerald-500/80 rounded-t group-hover:bg-emerald-600 transition-colors"
                          title={`Won: ${pt.wonLeads}`}
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono rotate-0 truncate max-w-full text-center">
                      {pt.dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. Canonical 8-Stage Pipeline Distribution & Progression Efficiency */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Canonical Pipeline Distribution & Stage Progression (8 Stages)
            </h2>
            <p className="text-xs text-slate-500">
              Strict database source-of-truth status tracking from <code className="font-mono text-slate-700">public.leads.status</code>.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Total Open Deal Value: <span className="font-mono font-bold text-slate-900">${report.activePipelineValue.toLocaleString()}</span>
          </div>
        </div>

        {/* 8-Stage Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {stages.map((st, idx) => {
            const isTerminal = st.stageKey === 'won' || st.stageKey === 'lost';
            const badgeBg =
              st.stageKey === 'won' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              st.stageKey === 'lost' ? 'bg-slate-50 border-slate-200 text-slate-700' :
              st.stageKey === 'new' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              st.stageKey === 'contacted' ? 'bg-amber-50 border-amber-200 text-amber-800' :
              st.stageKey === 'qualified' ? 'bg-purple-50 border-purple-200 text-purple-800' :
              st.stageKey === 'discovery' ? 'bg-indigo-50 border-indigo-200 text-indigo-800' :
              st.stageKey === 'proposal' ? 'bg-violet-50 border-violet-200 text-violet-800' :
              'bg-rose-50 border-rose-200 text-rose-800';

            return (
              <div
                key={st.stageKey}
                className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${badgeBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                      {st.stageLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="text-xl font-bold font-mono mt-0.5">
                    {st.count}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {st.percentageOfTotal}% of total
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-black/5 text-[10px] space-y-0.5">
                  <div className="font-mono truncate font-medium">
                    ${st.estimatedValue.toLocaleString()}
                  </div>
                  {!isTerminal && idx < 6 && (
                    <div className="text-[9px] text-slate-600 flex items-center justify-between">
                      <span>Conv to next:</span>
                      <span className="font-semibold">{st.conversionToNext}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drop-off / Lost Analysis Callout */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs">
            <span className="font-bold text-slate-800 block mb-1">
              Pipeline Drop-off & Loss Diagnostics
            </span>
            <p className="text-slate-600 mb-2">
              Where prospective healthcare partners drop out during the sales cycle:
            </p>
            {lostAnalysis.totalLost === 0 ? (
              <span className="text-slate-500 text-xs">Zero lost opportunities recorded in this period.</span>
            ) : (
              <div className="space-y-1.5">
                {lostAnalysis.byReason.slice(0, 4).map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-700">{r.reason}</span>
                    <span className="font-mono text-slate-900 font-semibold">{r.count} ({r.percentage}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs">
            <span className="font-bold text-slate-800 block mb-1">
              Stage Velocity & Pipeline Health
            </span>
            <p className="text-slate-600 mb-2">
              Stage progression efficiency across discovery, proposal, and commercial negotiations:
            </p>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Qualification Rate (Intake → Opp):</span>
                <span className="font-mono font-bold text-slate-900">{report.overallQualificationRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Overall Win Rate (Won / Closed):</span>
                <span className="font-mono font-bold text-emerald-800">{report.overallWinRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Active Deals Pending Decision:</span>
                <span className="font-mono font-bold text-amber-800">
                  {stages.find(s => s.stageKey === 'proposal')?.count || 0} proposals · {stages.find(s => s.stageKey === 'negotiations')?.count || 0} negotiations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Lead Source Attribution Performance Matrix */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Lead Source Channel Performance</h2>
            <p className="text-xs text-slate-500">
              Evaluating which channels generate leads, qualified opportunities, and signed healthcare partners.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Acquisition Channel</th>
                <th className="py-2.5 px-3 text-right">Total Leads</th>
                <th className="py-2.5 px-3 text-right">Qualified</th>
                <th className="py-2.5 px-3 text-right">Pre-Qual Rate</th>
                <th className="py-2.5 px-3 text-right">Active Opps</th>
                <th className="py-2.5 px-3 text-right">Won Clients</th>
                <th className="py-2.5 px-3 text-right">Win Rate</th>
                <th className="py-2.5 px-3 text-right">Active Pipeline Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sourcePerformance.map((src) => (
                <tr key={src.sourceKey} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {src.sourceLabel}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                    {src.totalLeads}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-purple-900 font-medium">
                    {src.qualifiedLeads}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {src.qualificationRate}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-900">
                    {src.activeOpportunities}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-bold">
                    {src.wonCount}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {src.winRate}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-900 font-semibold">
                    ${src.activePipelineValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Healthcare Specialty Segment Performance Matrix */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900">Healthcare Specialty Sector Yield</h2>
          <p className="text-xs text-slate-500">
            Performance across multi-specialty hospitals, fertility clinics, dental practices, and surgical centers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {specialtyPerformance.map((sec) => (
            <div key={sec.categoryKey} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs mb-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sec.categoryLabel}</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                  {sec.totalLeads} leads
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/70 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Qualified Opps:</span>
                  <span className="font-mono font-semibold text-purple-900">{sec.qualifiedLeads}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Signed Partners:</span>
                  <span className="font-mono font-semibold text-emerald-800">{sec.wonCount}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Active Pipeline:</span>
                  <span className="font-mono font-semibold text-slate-900">${sec.activePipelineValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
