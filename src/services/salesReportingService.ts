/**
 * Sales & Business Reporting Intelligence Engine
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-04: Sales & Business Reporting System
 * 
 * Answers the 10 Core Business Questions:
 * 1. How many leads are entering the CRM?
 * 2. Where are leads in the sales pipeline? (Canonical 8 stages)
 * 3. How efficiently are leads moving through the pipeline?
 * 4. How many leads become clients? (Won count & win rates)
 * 5. Where are leads dropping out? (Lost stage drop-offs & lost reasons)
 * 6. Which sources generate leads?
 * 7. Which sources generate qualified opportunities?
 * 8. Which sources generate won clients?
 * 9. How is sales performance changing over time?
 * 10. How much active pipeline exists? (PIPELINE VALUE != REVENUE)
 */

import { CompleteLeadRecord, OpportunityStage } from './qualification';
import { ReportingDateContext, ReportingDateService, PercentageChangeResult } from './reportingDateService';

export interface SalesReportKpi {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  secondaryLabel?: string;
  previousValue: number | null;
  change: PercentageChangeResult;
  tooltip?: string;
}

export interface CanonicalStageMetric {
  stageKey: OpportunityStage;
  stageLabel: string;
  count: number;
  percentageOfTotal: number;
  estimatedValue: number;
  dropoffToNext: number; // % drop-off to next sequential stage
  conversionToNext: number; // % conversion to next stage
  avgDaysInStage?: number;
}

export interface LostAnalysisMetric {
  totalLost: number;
  lostRate: number; // (lost / (won + lost)) * 100
  byReason: { reason: string; count: number; percentage: number }[];
  byOriginalSource: { source: string; count: number }[];
}

export interface SourceSalesMetric {
  sourceKey: string;
  sourceLabel: string;
  totalLeads: number;
  qualifiedLeads: number;
  qualificationRate: number;
  activeOpportunities: number;
  wonCount: number;
  winRate: number;
  activePipelineValue: number;
  wonRevenue: number;
}

export interface HealthcareSpecialtySalesMetric {
  categoryKey: string;
  categoryLabel: string;
  totalLeads: number;
  qualifiedLeads: number;
  wonCount: number;
  winRate: number;
  activePipelineValue: number;
  wonRevenue: number;
}

export interface SalesTimeSeriesPoint {
  dateLabel: string;
  timestamp: number;
  totalLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
}

export interface SalesReportSummary {
  dateContext: ReportingDateContext;
  totalLeadsInPeriod: number;
  totalLeadsInCRM: number;
  
  // Executive Overview KPIs
  kpis: {
    totalLeads: SalesReportKpi;
    newLeads: SalesReportKpi;
    qualifiedLeads: SalesReportKpi;
    activePipeline: SalesReportKpi;
    wonLeads: SalesReportKpi;
    lostLeads: SalesReportKpi;
  };

  // Pipeline Values (Explicitly distinguishing Active Pipeline vs Realized Revenue)
  activePipelineValue: number;
  weightedPipelineValue: number;
  wonContractValue: number;

  // Pipeline Stages (Canonical 8 stages)
  stages: CanonicalStageMetric[];
  
  // Overall Efficiency & Win Rates
  overallQualificationRate: number;
  overallWinRate: number; // Won / (Won + Lost)
  pipelineVelocityHealth: number;

  // Lost Analysis
  lostAnalysis: LostAnalysisMetric;

  // Source Attribution
  sourcePerformance: SourceSalesMetric[];

  // Healthcare Specialty Breakdown
  specialtyPerformance: HealthcareSpecialtySalesMetric[];

  // Time Series Trend
  timeSeries: SalesTimeSeriesPoint[];
}

export const CANONICAL_STAGE_ORDER: { key: OpportunityStage; label: string; description: string }[] = [
  { key: 'new', label: 'New Inquiry', description: 'Fresh inbound patient inquiry / enterprise lead' },
  { key: 'contacted', label: 'Contacted', description: 'First contact attempt initiated by growth partner' },
  { key: 'qualified', label: 'Qualified', description: 'Pre-qualified healthcare business opportunity' },
  { key: 'discovery', label: 'Discovery', description: 'Healthcare Growth Audit & diagnosis call scheduled/held' },
  { key: 'proposal', label: 'Proposal', description: 'Growth strategy roadmap and commercial proposal sent' },
  { key: 'negotiations', label: 'Negotiations', description: 'Commercial terms, SLA, and scope finalization' },
  { key: 'won', label: 'Won', description: 'Signed healthcare client partner agreement' },
  { key: 'lost', label: 'Lost', description: 'Closed lost or disqualified opportunity' }
];

export const SOURCE_DISPLAY_NAMES: Record<string, string> = {
  organic: 'Organic Search (SEO)',
  google_ads: 'Google Search Ads (PPC)',
  meta_ads: 'Meta Ads (FB/IG)',
  linkedin: 'LinkedIn B2B',
  direct: 'Direct Traffic',
  referral: 'Referral / Strategic Partner',
  unknown: 'Direct / Unattributed'
};

export const HEALTHCARE_CATEGORY_DISPLAY: Record<string, string> = {
  hospital: 'Multi-Specialty Hospitals',
  specialty_clinic: 'Specialty Clinics',
  ivf_fertility: 'IVF & Fertility Centers',
  dental: 'Dental Chains & Clinics',
  surgical: 'Surgical & Operating Centers',
  diagnostic: 'Diagnostic & Pathology Centers',
  other_healthcare: 'Other Healthcare Organizations'
};

export class SalesReportingService {
  /**
   * Generates the complete, audited Sales & Business Report from actual CRM leads.
   * Adheres strictly to:
   * - PIPELINE VALUE != REVENUE
   * - public.leads.status as the canonical pipeline status
   * - Zero fabricated statistics
   */
  public static generateSalesReport(
    allLeads: CompleteLeadRecord[],
    dateContext: ReportingDateContext
  ): SalesReportSummary {
    const isAllTime = dateContext.period === 'all';

    // 1. Filter leads for current period and comparison period
    const currentLeads = isAllTime 
      ? allLeads 
      : ReportingDateService.filterRecordsByRange(allLeads, dateContext.currentRange);

    const previousLeads = (!isAllTime && dateContext.previousRange)
      ? ReportingDateService.filterRecordsByRange(allLeads, dateContext.previousRange)
      : [];

    // 2. Compute Executive KPIs
    const kpis = this.calculateExecutiveKpis(currentLeads, previousLeads, dateContext);

    // 3. Compute Pipeline Stage Distribution (All 8 stages)
    const stages = this.calculateStageDistribution(currentLeads);

    // 4. Lost & Drop-off Analysis
    const lostAnalysis = this.calculateLostAnalysis(currentLeads);

    // 5. Source Attribution & Performance
    const sourcePerformance = this.calculateSourcePerformance(currentLeads);

    // 6. Specialty Segment Performance
    const specialtyPerformance = this.calculateSpecialtyPerformance(currentLeads);

    // 7. Time Series Progression Trend
    const timeSeries = this.calculateTimeSeries(currentLeads, dateContext);

    // 8. Pipeline Values (Strictly separated)
    const activeLeads = currentLeads.filter(l => l.status !== 'won' && l.status !== 'lost');
    const wonLeads = currentLeads.filter(l => l.status === 'won');

    const activePipelineValue = activeLeads.reduce(
      (sum, l) => sum + (l.qualification?.estimatedOpportunityValue || 0),
      0
    );
    const weightedPipelineValue = activeLeads.reduce(
      (sum, l) => sum + (l.qualification?.weightedPipelineValue || 0),
      0
    );
    const wonContractValue = wonLeads.reduce(
      (sum, l) => sum + (l.qualification?.finalContractValue || l.qualification?.estimatedOpportunityValue || 0),
      0
    );

    // Overall Rates
    const totalCurrent = currentLeads.length;
    const qualifiedCount = currentLeads.filter(l => 
      ['qualified', 'discovery', 'proposal', 'negotiations', 'won'].includes(l.status) ||
      l.qualification?.fitStatus === 'high_fit' ||
      l.qualification?.fitStatus === 'medium_fit'
    ).length;

    const wonCount = wonLeads.length;
    const lostCount = currentLeads.filter(l => l.status === 'lost').length;

    const overallQualificationRate = totalCurrent > 0 ? (qualifiedCount / totalCurrent) * 100 : 0;
    const closedCount = wonCount + lostCount;
    const overallWinRate = closedCount > 0 ? (wonCount / closedCount) * 100 : 0;

    return {
      dateContext,
      totalLeadsInPeriod: currentLeads.length,
      totalLeadsInCRM: allLeads.length,
      kpis,
      activePipelineValue,
      weightedPipelineValue,
      wonContractValue,
      stages,
      overallQualificationRate,
      overallWinRate,
      pipelineVelocityHealth: Math.min(100, Math.round(overallQualificationRate * 0.5 + overallWinRate * 0.5)),
      lostAnalysis,
      sourcePerformance,
      specialtyPerformance,
      timeSeries
    };
  }

  /**
   * Calculates the 6 standard Executive KPI cards with valid prior period comparisons.
   */
  private static calculateExecutiveKpis(
    currentLeads: CompleteLeadRecord[],
    previousLeads: CompleteLeadRecord[],
    dateContext: ReportingDateContext
  ): SalesReportSummary['kpis'] {
    const hasPriorData = dateContext.period !== 'all' && previousLeads.length > 0;

    // Helper to evaluate pipeline stage canonical status
    const getStage = (lead: CompleteLeadRecord): OpportunityStage => {
      const s = lead.status as string;
      return (s === 'negotiation' ? 'negotiations' : s) as OpportunityStage;
    };

    // 1. Total Leads
    const currentTotal = currentLeads.length;
    const prevTotal = hasPriorData ? previousLeads.length : null;
    const totalChange = ReportingDateService.calculatePercentageChange(currentTotal, prevTotal);

    // 2. New Leads
    const currentNew = currentLeads.filter(l => getStage(l) === 'new').length;
    const prevNew = hasPriorData ? previousLeads.filter(l => getStage(l) === 'new').length : null;
    const newChange = ReportingDateService.calculatePercentageChange(currentNew, prevNew);

    // 3. Qualified Leads
    const isQual = (l: CompleteLeadRecord) =>
      ['qualified', 'discovery', 'proposal', 'negotiations', 'won'].includes(getStage(l)) ||
      l.qualification?.fitStatus === 'high_fit' ||
      l.qualification?.fitStatus === 'medium_fit';

    const currentQual = currentLeads.filter(isQual).length;
    const prevQual = hasPriorData ? previousLeads.filter(isQual).length : null;
    const qualChange = ReportingDateService.calculatePercentageChange(currentQual, prevQual);

    // 4. Active Pipeline
    const isActive = (l: CompleteLeadRecord) => getStage(l) !== 'won' && getStage(l) !== 'lost';
    const currentActive = currentLeads.filter(isActive).length;
    const prevActive = hasPriorData ? previousLeads.filter(isActive).length : null;
    const activeChange = ReportingDateService.calculatePercentageChange(currentActive, prevActive);

    const activePipelineValue = currentLeads
      .filter(isActive)
      .reduce((sum, l) => sum + (l.qualification?.estimatedOpportunityValue || 0), 0);

    // 5. Won Clients
    const currentWon = currentLeads.filter(l => getStage(l) === 'won').length;
    const prevWon = hasPriorData ? previousLeads.filter(l => getStage(l) === 'won').length : null;
    const wonChange = ReportingDateService.calculatePercentageChange(currentWon, prevWon);

    // 6. Lost Opportunities
    const currentLost = currentLeads.filter(l => getStage(l) === 'lost').length;
    const prevLost = hasPriorData ? previousLeads.filter(l => getStage(l) === 'lost').length : null;
    const lostChange = ReportingDateService.calculatePercentageChange(currentLost, prevLost);

    return {
      totalLeads: {
        id: 'total_leads',
        label: 'TOTAL LEADS',
        value: currentTotal,
        formattedValue: currentTotal.toLocaleString(),
        secondaryLabel: 'Incoming healthcare inquiries',
        previousValue: prevTotal,
        change: totalChange
      },
      newLeads: {
        id: 'new_leads',
        label: 'NEW INQUIRIES',
        value: currentNew,
        formattedValue: currentNew.toLocaleString(),
        secondaryLabel: 'Pending initial contact review',
        previousValue: prevNew,
        change: newChange
      },
      qualifiedLeads: {
        id: 'qualified_leads',
        label: 'QUALIFIED OPPORTUNITIES',
        value: currentQual,
        formattedValue: currentQual.toLocaleString(),
        secondaryLabel: 'High & medium enterprise fit',
        previousValue: prevQual,
        change: qualChange
      },
      activePipeline: {
        id: 'active_pipeline',
        label: 'ACTIVE PIPELINE',
        value: currentActive,
        formattedValue: currentActive.toLocaleString(),
        secondaryLabel: `$${activePipelineValue.toLocaleString()} estimated deal value`,
        previousValue: prevActive,
        change: activeChange,
        tooltip: 'Active opportunities in progression (Pipeline Value ≠ Realized Revenue)'
      },
      wonLeads: {
        id: 'won_leads',
        label: 'CLOSED WON',
        value: currentWon,
        formattedValue: currentWon.toLocaleString(),
        secondaryLabel: 'Signed client partners',
        previousValue: prevWon,
        change: wonChange
      },
      lostLeads: {
        id: 'lost_leads',
        label: 'CLOSED LOST',
        value: currentLost,
        formattedValue: currentLost.toLocaleString(),
        secondaryLabel: 'Disqualified or churned',
        previousValue: prevLost,
        change: lostChange
      }
    };
  }

  /**
   * Calculates metrics for all 8 canonical pipeline stages.
   */
  private static calculateStageDistribution(leads: CompleteLeadRecord[]): CanonicalStageMetric[] {
    const totalLeads = leads.length;

    const sequentialKeys: OpportunityStage[] = [
      'new',
      'contacted',
      'qualified',
      'discovery',
      'proposal',
      'negotiations',
      'won'
    ];

    // Compute counts for each canonical stage
    const stageCounts: Record<OpportunityStage, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      discovery: 0,
      proposal: 0,
      negotiations: 0,
      won: 0,
      lost: 0
    };

    const stageValues: Record<OpportunityStage, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      discovery: 0,
      proposal: 0,
      negotiations: 0,
      won: 0,
      lost: 0
    };

    leads.forEach(lead => {
      let rawStatus = lead.status as OpportunityStage;
      if ((rawStatus as any) === 'negotiation') rawStatus = 'negotiations';
      if (stageCounts[rawStatus] !== undefined) {
        stageCounts[rawStatus]++;
        const val = rawStatus === 'won'
          ? (lead.qualification?.finalContractValue || lead.qualification?.estimatedOpportunityValue || 0)
          : (lead.qualification?.estimatedOpportunityValue || 0);
        stageValues[rawStatus] += val;
      } else {
        stageCounts.new++;
      }
    });

    return CANONICAL_STAGE_ORDER.map((stageItem, index) => {
      const count = stageCounts[stageItem.key];
      const estimatedValue = stageValues[stageItem.key];
      const percentageOfTotal = totalLeads > 0 ? (count / totalLeads) * 100 : 0;

      let conversionToNext = 0;
      let dropoffToNext = 0;

      // For sequential stages (new -> contacted -> qualified -> discovery -> proposal -> negotiations -> won)
      if (index < sequentialKeys.length - 1 && stageItem.key !== 'lost') {
        const nextKey = sequentialKeys[index + 1];
        const nextCount = stageCounts[nextKey];
        if (count > 0) {
          conversionToNext = Math.min(100, Math.round((nextCount / count) * 100));
          dropoffToNext = Math.max(0, 100 - conversionToNext);
        }
      }

      return {
        stageKey: stageItem.key,
        stageLabel: stageItem.label,
        count,
        percentageOfTotal: Math.round(percentageOfTotal * 10) / 10,
        estimatedValue,
        conversionToNext,
        dropoffToNext
      };
    });
  }

  /**
   * Calculates lost opportunities analysis, reasons, and drop-off points.
   */
  private static calculateLostAnalysis(leads: CompleteLeadRecord[]): LostAnalysisMetric {
    const lostLeads = leads.filter(l => l.status === 'lost');
    const wonCount = leads.filter(l => l.status === 'won').length;
    const closedCount = wonCount + lostLeads.length;

    const lostRate = closedCount > 0 ? (lostLeads.length / closedCount) * 100 : 0;

    // Reason map
    const reasonMap = new Map<string, number>();
    const sourceMap = new Map<string, number>();

    lostLeads.forEach(lead => {
      const reason = lead.qualification?.lostReason || 'Unspecified / Timing';
      const cleanReason = reason.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      reasonMap.set(cleanReason, (reasonMap.get(cleanReason) || 0) + 1);

      const source = lead.visitorData?.utm_source || lead.qualification?.derivedLeadSource || 'direct';
      const sourceName = SOURCE_DISPLAY_NAMES[source] || source;
      sourceMap.set(sourceName, (sourceMap.get(sourceName) || 0) + 1);
    });

    const byReason = Array.from(reasonMap.entries())
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: lostLeads.length > 0 ? Math.round((count / lostLeads.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    const byOriginalSource = Array.from(sourceMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalLost: lostLeads.length,
      lostRate: Math.round(lostRate * 10) / 10,
      byReason,
      byOriginalSource
    };
  }

  /**
   * Aggregates sales metrics by acquisition source.
   */
  private static calculateSourcePerformance(leads: CompleteLeadRecord[]): SourceSalesMetric[] {
    const sourceMap = new Map<string, SourceSalesMetric>();

    // Seed common sources
    const commonSources = ['organic', 'google_ads', 'meta_ads', 'linkedin', 'direct', 'referral'];
    commonSources.forEach(s => {
      sourceMap.set(s, {
        sourceKey: s,
        sourceLabel: SOURCE_DISPLAY_NAMES[s] || s,
        totalLeads: 0,
        qualifiedLeads: 0,
        qualificationRate: 0,
        activeOpportunities: 0,
        wonCount: 0,
        winRate: 0,
        activePipelineValue: 0,
        wonRevenue: 0
      });
    });

    leads.forEach(lead => {
      const rawSource = lead.qualification?.derivedLeadSource || lead.visitorData?.utm_source || 'unknown';
      const sourceKey = sourceMap.has(rawSource) ? rawSource : (rawSource === 'unknown' ? 'unknown' : 'direct');

      if (!sourceMap.has(sourceKey)) {
        sourceMap.set(sourceKey, {
          sourceKey,
          sourceLabel: SOURCE_DISPLAY_NAMES[sourceKey] || sourceKey,
          totalLeads: 0,
          qualifiedLeads: 0,
          qualificationRate: 0,
          activeOpportunities: 0,
          wonCount: 0,
          winRate: 0,
          activePipelineValue: 0,
          wonRevenue: 0
        });
      }

      const item = sourceMap.get(sourceKey)!;
      item.totalLeads += 1;

      const isQualified = ['qualified', 'discovery', 'proposal', 'negotiations', 'won'].includes(lead.status) ||
        lead.qualification?.fitStatus === 'high_fit' ||
        lead.qualification?.fitStatus === 'medium_fit';

      if (isQualified) item.qualifiedLeads += 1;

      if (lead.status === 'won') {
        item.wonCount += 1;
        item.wonRevenue += (lead.qualification?.finalContractValue || lead.qualification?.estimatedOpportunityValue || 0);
      } else if (lead.status !== 'lost') {
        item.activeOpportunities += 1;
        item.activePipelineValue += (lead.qualification?.estimatedOpportunityValue || 0);
      }
    });

    // Compute rates
    return Array.from(sourceMap.values())
      .map(item => {
        const qualificationRate = item.totalLeads > 0 ? (item.qualifiedLeads / item.totalLeads) * 100 : 0;
        const closedCount = item.wonCount + leads.filter(l => 
          (l.qualification?.derivedLeadSource === item.sourceKey) && l.status === 'lost'
        ).length;
        const winRate = closedCount > 0 ? (item.wonCount / closedCount) * 100 : 0;

        return {
          ...item,
          qualificationRate: Math.round(qualificationRate * 10) / 10,
          winRate: Math.round(winRate * 10) / 10
        };
      })
      .filter(item => item.totalLeads > 0 || ['organic', 'google_ads', 'meta_ads'].includes(item.sourceKey))
      .sort((a, b) => b.totalLeads - a.totalLeads);
  }

  /**
   * Aggregates sales metrics by Healthcare Category.
   */
  private static calculateSpecialtyPerformance(leads: CompleteLeadRecord[]): HealthcareSpecialtySalesMetric[] {
    const categoryKeys = [
      'hospital',
      'specialty_clinic',
      'ivf_fertility',
      'dental',
      'surgical',
      'diagnostic',
      'other_healthcare'
    ];

    return categoryKeys.map(catKey => {
      const segLeads = leads.filter(l => (l.qualification?.healthcareCategoryNormalized || 'other_healthcare') === catKey);
      const totalLeads = segLeads.length;

      const qualifiedLeads = segLeads.filter(l => 
        ['qualified', 'discovery', 'proposal', 'negotiations', 'won'].includes(l.status) ||
        l.qualification?.fitStatus === 'high_fit' ||
        l.qualification?.fitStatus === 'medium_fit'
      ).length;

      const wonLeads = segLeads.filter(l => l.status === 'won');
      const lostCount = segLeads.filter(l => l.status === 'lost').length;
      const closedCount = wonLeads.length + lostCount;
      const winRate = closedCount > 0 ? (wonLeads.length / closedCount) * 100 : 0;

      const activeLeads = segLeads.filter(l => l.status !== 'won' && l.status !== 'lost');
      const activePipelineValue = activeLeads.reduce(
        (sum, l) => sum + (l.qualification?.estimatedOpportunityValue || 0),
        0
      );
      const wonRevenue = wonLeads.reduce(
        (sum, l) => sum + (l.qualification?.finalContractValue || l.qualification?.estimatedOpportunityValue || 0),
        0
      );

      return {
        categoryKey: catKey,
        categoryLabel: HEALTHCARE_CATEGORY_DISPLAY[catKey] || catKey,
        totalLeads,
        qualifiedLeads,
        wonCount: wonLeads.length,
        winRate: Math.round(winRate * 10) / 10,
        activePipelineValue,
        wonRevenue
      };
    }).sort((a, b) => b.totalLeads - a.totalLeads);
  }

  /**
   * Calculates time series data points for trends over the selected reporting period.
   */
  private static calculateTimeSeries(
    leads: CompleteLeadRecord[],
    dateContext: ReportingDateContext
  ): SalesTimeSeriesPoint[] {
    const isMonthly = ['this_year', 'prev_year', 'all'].includes(dateContext.period);
    const timeMap = new Map<string, SalesTimeSeriesPoint>();

    // Helper to generate key
    const getKeyAndLabel = (d: Date): { key: string; label: string; timestamp: number } => {
      if (isMonthly) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const timestamp = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
        return { key, label, timestamp };
      } else {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timestamp = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        return { key, label, timestamp };
      }
    };

    leads.forEach(lead => {
      if (!lead.createdAt) return;
      const d = new Date(lead.createdAt);
      if (isNaN(d.getTime())) return;

      const { key, label, timestamp } = getKeyAndLabel(d);
      if (!timeMap.has(key)) {
        timeMap.set(key, {
          dateLabel: label,
          timestamp,
          totalLeads: 0,
          qualifiedLeads: 0,
          wonLeads: 0
        });
      }

      const point = timeMap.get(key)!;
      point.totalLeads += 1;

      const isQualified = ['qualified', 'discovery', 'proposal', 'negotiations', 'won'].includes(lead.status) ||
        lead.qualification?.fitStatus === 'high_fit' ||
        lead.qualification?.fitStatus === 'medium_fit';

      if (isQualified) point.qualifiedLeads += 1;
      if (lead.status === 'won') point.wonLeads += 1;
    });

    return Array.from(timeMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }
}
