/**
 * Growth Analytics & Intelligence Engine (G-07)
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER
 * 
 * Provides deterministic, real-time analytics, funnel conversion metrics,
 * channel attribution analysis, healthcare segment performance matrices,
 * and diagnostic recommendations directly derived from F-05 through F-09
 * Revenue Operations operational lead records.
 */

import { 
  CompleteLeadRecord, 
  OpportunityStage, 
  FitStatus, 
  HealthcareCategoryNormalized, 
  DerivedLeadSource,
  STAGE_PROBABILITIES
} from './qualification';
import { FollowUpAutomationEngine } from './followUpAutomation';

// --- ANALYTICS INTERFACES ---

export interface FunnelStageMetric {
  stageKey: string;
  stageName: string;
  count: number;
  percentageOfTotal: number;
  dropoffRate: number;
  value: number;
}

export interface FunnelSummary {
  totalVisitorsEstimated: number; // Based on captured leads or explicit inputs
  totalLeads: number;
  qualifiedLeads: number;
  discoveryCount: number;
  opportunityCount: number;
  proposalCount: number;
  wonCount: number;
  lostCount: number;
  
  // Rates
  qualificationRate: number; // (Qualified / Total) * 100
  discoveryBookingRate: number; // (Discovery / Qualified) * 100
  opportunityCreationRate: number; // (Opportunity / Qualified) * 100
  proposalRate: number; // (Proposal / Opportunity) * 100
  winRate: number; // (Won / (Won + Lost)) * 100
  
  // Stages breakdown list
  stages: FunnelStageMetric[];
}

export interface ChannelPerformanceMetric {
  sourceKey: DerivedLeadSource | string;
  sourceLabel: string;
  totalLeads: number;
  qualifiedLeads: number;
  opportunitiesCount: number;
  wonCount: number;
  qualificationRate: number;
  activePipelineValue: number;
  weightedPipelineValue: number;
  wonRevenue: number;
  
  // Economics (Null if spend unavailable)
  hasSpendData: boolean;
  estimatedSpend: number | null;
  cpl: number | null;
  cpql: number | null;
  cac: number | null;
  roas: number | null;
}

export interface HealthcareSegmentMetric {
  categoryKey: HealthcareCategoryNormalized;
  categoryLabel: string;
  totalLeads: number;
  qualifiedLeads: number;
  discoveryCount: number;
  opportunityCount: number;
  proposalCount: number;
  wonCount: number;
  qualificationRate: number;
  winRate: number;
  activePipelineValue: number;
  weightedPipelineValue: number;
  wonRevenue: number;
  avgContractValue: number;
}

export interface CampaignAttributionMetric {
  campaignName: string;
  source: string;
  medium: string;
  totalLeads: number;
  qualifiedLeads: number;
  wonCount: number;
  activePipelineValue: number;
  wonRevenue: number;
}

export interface OperationalHealthSummary {
  totalLeads: number;
  activeLeadsCount: number;
  overdueFollowUpsCount: number;
  dueTodayFollowUpsCount: number;
  staleOpportunitiesCount: number; // >= 7 days inactive
  unscheduledFollowUpsCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  healthScore: number; // 0 - 100
  contactedRate: number; // % of leads contacted
  avgDaysInStage: number;
}

export interface RevenueMetricsSummary {
  activePipelineValue: number;
  weightedPipelineValue: number;
  proposalValue: number;
  wonRevenueValue: number;
  avgDealSize: number;
  recurringRevenueEst: number; // Monthly recurring revenue projection
}

export interface DiagnosticRecommendation {
  id: string;
  severity: 'urgent' | 'warning' | 'info' | 'positive';
  category: 'targeting' | 'outreach' | 'discovery' | 'proposal' | 'operations' | 'scaling';
  title: string;
  observation: string;
  hypothesis: string;
  action: string;
  affectedMetric: string;
}

export interface ExecutiveGrowthIntelligence {
  funnel: FunnelSummary;
  revenue: RevenueMetricsSummary;
  channels: ChannelPerformanceMetric[];
  segments: HealthcareSegmentMetric[];
  campaigns: CampaignAttributionMetric[];
  operational: OperationalHealthSummary;
  diagnostics: DiagnosticRecommendation[];
  generatedAt: string;
}

// --- CATEGORY LABELS MAP ---
export const CATEGORY_LABELS: Record<HealthcareCategoryNormalized, string> = {
  hospital: 'Multi-Specialty Hospitals',
  specialty_clinic: 'Specialty Clinics',
  ivf_fertility: 'IVF & Fertility Centers',
  dental: 'Dental Chains & Practices',
  surgical: 'Surgical & Operating Centers',
  diagnostic: 'Diagnostic & Pathology Centers',
  other_healthcare: 'Other Healthcare Organizations'
};

export const SOURCE_LABELS: Record<string, string> = {
  organic: 'Organic Search (SEO)',
  google_ads: 'Google Search Ads (PPC)',
  meta_ads: 'Meta Ads (FB/IG)',
  linkedin: 'LinkedIn B2B',
  direct: 'Direct Traffic',
  referral: 'Referral / Partner',
  unknown: 'Direct / Unattributed'
};

// --- SERVICE IMPLEMENTATION ---

export class GrowthAnalyticsService {

  /**
   * Generates the complete executive growth intelligence payload from live leads.
   */
  public static generateIntelligence(leads: CompleteLeadRecord[]): ExecutiveGrowthIntelligence {
    const now = new Date();

    const funnel = this.calculateFunnel(leads);
    const revenue = this.calculateRevenue(leads);
    const channels = this.calculateChannelPerformance(leads);
    const segments = this.calculateSegmentPerformance(leads);
    const campaigns = this.calculateCampaignAttribution(leads);
    const operational = this.calculateOperationalHealth(leads, now);
    const diagnostics = this.generateDiagnostics(funnel, operational, channels, segments);

    return {
      funnel,
      revenue,
      channels,
      segments,
      campaigns,
      operational,
      diagnostics,
      generatedAt: now.toISOString()
    };
  }

  /**
   * Calculates complete conversion funnel metrics.
   */
  public static calculateFunnel(leads: CompleteLeadRecord[]): FunnelSummary {
    const totalLeads = leads.length;

    // A lead is considered qualified if fitStatus is high/medium fit OR if stage is beyond new/contacted
    const qualifiedLeads = leads.filter(l => 
      l.qualification.fitStatus === 'high_fit' || 
      l.qualification.fitStatus === 'medium_fit' ||
      ['qualified', 'discovery', 'proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')
    ).length;

    const discoveryCount = leads.filter(l => 
      ['discovery', 'proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')
    ).length;

    const opportunityCount = leads.filter(l => 
      ['qualified', 'discovery', 'proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')
    ).length;

    const proposalCount = leads.filter(l => 
      ['proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')
    ).length;

    const wonCount = leads.filter(l => l.qualification.opportunityStage === 'won').length;
    const lostCount = leads.filter(l => l.qualification.opportunityStage === 'lost').length;

    // Rates
    const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
    const discoveryBookingRate = qualifiedLeads > 0 ? (discoveryCount / qualifiedLeads) * 100 : 0;
    const opportunityCreationRate = qualifiedLeads > 0 ? (opportunityCount / qualifiedLeads) * 100 : 0;
    const proposalRate = opportunityCount > 0 ? (proposalCount / opportunityCount) * 100 : 0;
    const winRate = (wonCount + lostCount) > 0 ? (wonCount / (wonCount + lostCount)) * 100 : 0;

    // Detailed Stage Breakdown
    const stageKeys: { key: OpportunityStage; name: string }[] = [
      { key: 'new', name: 'New Inquiries' },
      { key: 'contacted', name: 'Contacted / Engaged' },
      { key: 'qualified', name: 'Qualified Opportunities' },
      { key: 'discovery', name: 'Discovery Diagnoses' },
      { key: 'proposal', name: 'Proposals Submitted' },
      { key: 'negotiation', name: 'In Negotiation' },
      { key: 'won', name: 'Closed Won Clients' }
    ];

    const stages: FunnelStageMetric[] = stageKeys.map((s, idx) => {
      const count = leads.filter(l => l.qualification.opportunityStage === s.key).length;
      const percentageOfTotal = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
      
      const val = leads
        .filter(l => l.qualification.opportunityStage === s.key)
        .reduce((sum, l) => {
          if (s.key === 'won') return sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0);
          if (s.key === 'proposal') return sum + (l.qualification.proposalValue || l.qualification.estimatedOpportunityValue || 0);
          return sum + (l.qualification.estimatedOpportunityValue || 0);
        }, 0);

      // Dropoff calculation from previous stage
      let dropoffRate = 0;
      if (idx > 0) {
        const prevCount = stages[idx - 1]?.count || totalLeads;
        if (prevCount > 0) {
          dropoffRate = Math.max(0, ((prevCount - count) / prevCount) * 100);
        }
      }

      return {
        stageKey: s.key,
        stageName: s.name,
        count,
        percentageOfTotal,
        dropoffRate,
        value: val
      };
    });

    return {
      totalVisitorsEstimated: totalLeads * 12, // Standard baseline multiplier estimation if web analytics not linked
      totalLeads,
      qualifiedLeads,
      discoveryCount,
      opportunityCount,
      proposalCount,
      wonCount,
      lostCount,
      qualificationRate,
      discoveryBookingRate,
      opportunityCreationRate,
      proposalRate,
      winRate,
      stages
    };
  }

  /**
   * Calculates overall revenue and pipeline values.
   */
  public static calculateRevenue(leads: CompleteLeadRecord[]): RevenueMetricsSummary {
    const activeLeads = leads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');
    const wonLeads = leads.filter(l => l.qualification.opportunityStage === 'won');
    const proposalLeads = leads.filter(l => l.qualification.opportunityStage === 'proposal' || l.qualification.opportunityStage === 'negotiation');

    const activePipelineValue = activeLeads.reduce((sum, l) => sum + (l.qualification.estimatedOpportunityValue || 0), 0);
    const weightedPipelineValue = activeLeads.reduce((sum, l) => sum + (l.qualification.weightedPipelineValue || 0), 0);
    const proposalValue = proposalLeads.reduce((sum, l) => sum + (l.qualification.proposalValue || l.qualification.estimatedOpportunityValue || 0), 0);
    const wonRevenueValue = wonLeads.reduce((sum, l) => sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0), 0);

    const avgDealSize = wonLeads.length > 0 
      ? wonRevenueValue / wonLeads.length 
      : (activeLeads.length > 0 ? activePipelineValue / activeLeads.length : 0);

    // Projected Monthly Recurring Revenue assuming 12-month average client retainers
    const recurringRevenueEst = wonLeads.length > 0 ? wonRevenueValue / 12 : 0;

    return {
      activePipelineValue,
      weightedPipelineValue,
      proposalValue,
      wonRevenueValue,
      avgDealSize,
      recurringRevenueEst
    };
  }

  /**
   * Aggregates performance by acquisition channel (derivedLeadSource).
   */
  public static calculateChannelPerformance(leads: CompleteLeadRecord[]): ChannelPerformanceMetric[] {
    const sources: DerivedLeadSource[] = ['organic', 'google_ads', 'meta_ads', 'linkedin', 'direct', 'referral', 'unknown'];

    return sources.map(source => {
      const channelLeads = leads.filter(l => (l.qualification.derivedLeadSource || 'unknown') === source);
      const totalLeads = channelLeads.length;

      const qualifiedLeads = channelLeads.filter(l => 
        l.qualification.fitStatus === 'high_fit' || 
        l.qualification.fitStatus === 'medium_fit' ||
        ['qualified', 'discovery', 'proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')
      ).length;

      const opportunitiesCount = channelLeads.filter(l => 
        ['qualified', 'discovery', 'proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')
      ).length;

      const wonLeads = channelLeads.filter(l => l.qualification.opportunityStage === 'won');
      const wonCount = wonLeads.length;

      const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

      const activeLeads = channelLeads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');
      const activePipelineValue = activeLeads.reduce((sum, l) => sum + (l.qualification.estimatedOpportunityValue || 0), 0);
      const weightedPipelineValue = activeLeads.reduce((sum, l) => sum + (l.qualification.weightedPipelineValue || 0), 0);
      const wonRevenue = wonLeads.reduce((sum, l) => sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0), 0);

      return {
        sourceKey: source,
        sourceLabel: SOURCE_LABELS[source] || source,
        totalLeads,
        qualifiedLeads,
        opportunitiesCount,
        wonCount,
        qualificationRate,
        activePipelineValue,
        weightedPipelineValue,
        wonRevenue,
        // Crucial Rule: Do not fabricate spend data
        hasSpendData: false,
        estimatedSpend: null,
        cpl: null,
        cpql: null,
        cac: null,
        roas: null
      };
    }).filter(ch => ch.totalLeads > 0 || ['organic', 'google_ads', 'meta_ads'].includes(ch.sourceKey));
  }

  /**
   * Aggregates performance by Healthcare Category taxonomy.
   */
  public static calculateSegmentPerformance(leads: CompleteLeadRecord[]): HealthcareSegmentMetric[] {
    const categories: HealthcareCategoryNormalized[] = [
      'hospital',
      'specialty_clinic',
      'ivf_fertility',
      'dental',
      'surgical',
      'diagnostic',
      'other_healthcare'
    ];

    return categories.map(cat => {
      const segLeads = leads.filter(l => (l.qualification.healthcareCategoryNormalized || 'other_healthcare') === cat);
      const totalLeads = segLeads.length;

      const qualifiedLeads = segLeads.filter(l => 
        l.qualification.fitStatus === 'high_fit' || 
        l.qualification.fitStatus === 'medium_fit' ||
        ['qualified', 'discovery', 'proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')
      ).length;

      const discoveryCount = segLeads.filter(l => ['discovery', 'proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')).length;
      const opportunityCount = segLeads.filter(l => ['qualified', 'discovery', 'proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')).length;
      const proposalCount = segLeads.filter(l => ['proposal', 'negotiation', 'won'].includes(l.qualification.opportunityStage || '')).length;
      
      const wonLeads = segLeads.filter(l => l.qualification.opportunityStage === 'won');
      const lostCount = segLeads.filter(l => l.qualification.opportunityStage === 'lost').length;
      const wonCount = wonLeads.length;

      const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
      const winRate = (wonCount + lostCount) > 0 ? (wonCount / (wonCount + lostCount)) * 100 : 0;

      const activeLeads = segLeads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');
      const activePipelineValue = activeLeads.reduce((sum, l) => sum + (l.qualification.estimatedOpportunityValue || 0), 0);
      const weightedPipelineValue = activeLeads.reduce((sum, l) => sum + (l.qualification.weightedPipelineValue || 0), 0);
      const wonRevenue = wonLeads.reduce((sum, l) => sum + (l.qualification.finalContractValue || l.qualification.estimatedOpportunityValue || 0), 0);
      const avgContractValue = wonCount > 0 ? wonRevenue / wonCount : (activeLeads.length > 0 ? activePipelineValue / activeLeads.length : 0);

      return {
        categoryKey: cat,
        categoryLabel: CATEGORY_LABELS[cat] || cat,
        totalLeads,
        qualifiedLeads,
        discoveryCount,
        opportunityCount,
        proposalCount,
        wonCount,
        qualificationRate,
        winRate,
        activePipelineValue,
        weightedPipelineValue,
        wonRevenue,
        avgContractValue
      };
    });
  }

  /**
   * Aggregates performance by Campaign (UTM Campaign / Content).
   */
  public static calculateCampaignAttribution(leads: CompleteLeadRecord[]): CampaignAttributionMetric[] {
    const campaignMap = new Map<string, CampaignAttributionMetric>();

    leads.forEach(lead => {
      const campaignName = lead.visitorData.utm_campaign || lead.visitorData.utm_content || 'Direct / Organic Unlabelled';
      const source = lead.visitorData.utm_source || lead.qualification.derivedLeadSource || 'direct';
      const medium = lead.visitorData.utm_medium || 'organic';

      const key = `${campaignName}__${source}`;

      if (!campaignMap.has(key)) {
        campaignMap.set(key, {
          campaignName,
          source,
          medium,
          totalLeads: 0,
          qualifiedLeads: 0,
          wonCount: 0,
          activePipelineValue: 0,
          wonRevenue: 0
        });
      }

      const item = campaignMap.get(key)!;
      item.totalLeads += 1;

      const isQualified = lead.qualification.fitStatus === 'high_fit' || 
        lead.qualification.fitStatus === 'medium_fit' ||
        ['qualified', 'discovery', 'proposal', 'negotiation', 'won'].includes(lead.qualification.opportunityStage || '');

      if (isQualified) item.qualifiedLeads += 1;

      if (lead.qualification.opportunityStage === 'won') {
        item.wonCount += 1;
        item.wonRevenue += (lead.qualification.finalContractValue || lead.qualification.estimatedOpportunityValue || 0);
      } else if (lead.qualification.opportunityStage !== 'lost') {
        item.activePipelineValue += (lead.qualification.estimatedOpportunityValue || 0);
      }
    });

    return Array.from(campaignMap.values())
      .sort((a, b) => b.totalLeads - a.totalLeads)
      .slice(0, 10);
  }

  /**
   * Evaluates pipeline operational health, risk, and SLA follow-up statuses.
   */
  public static calculateOperationalHealth(leads: CompleteLeadRecord[], now: Date): OperationalHealthSummary {
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');
    const activeLeadsCount = activeLeads.length;

    let overdueFollowUpsCount = 0;
    let dueTodayFollowUpsCount = 0;
    let staleOpportunitiesCount = 0;
    let unscheduledFollowUpsCount = 0;
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;

    let totalDaysInStage = 0;

    activeLeads.forEach(lead => {
      const evalResult = FollowUpAutomationEngine.evaluateOpportunity(lead, now);
      
      if (evalResult.classification === 'OVERDUE') overdueFollowUpsCount++;
      if (evalResult.classification === 'DUE_TODAY') dueTodayFollowUpsCount++;
      if (evalResult.daysSinceLastActivity >= 7) staleOpportunitiesCount++;
      if (!lead.qualification.nextFollowUpAt) unscheduledFollowUpsCount++;

      if (evalResult.riskLevel === 'high') highRiskCount++;
      else if (evalResult.riskLevel === 'medium') mediumRiskCount++;
      else lowRiskCount++;

      totalDaysInStage += evalResult.daysSinceLastActivity;
    });

    const contactedCount = leads.filter(l => l.qualification.opportunityStage !== 'new' || l.qualification.lastContactedAt).length;
    const contactedRate = totalLeads > 0 ? (contactedCount / totalLeads) * 100 : 0;
    const avgDaysInStage = activeLeadsCount > 0 ? Math.round(totalDaysInStage / activeLeadsCount) : 0;

    // Health Score (0-100)
    let healthScore = 100;
    if (activeLeadsCount > 0) {
      const overduePenalty = (overdueFollowUpsCount / activeLeadsCount) * 40;
      const stalePenalty = (staleOpportunitiesCount / activeLeadsCount) * 30;
      const unscheduledPenalty = (unscheduledFollowUpsCount / activeLeadsCount) * 20;
      healthScore = Math.max(0, Math.round(100 - overduePenalty - stalePenalty - unscheduledPenalty));
    }

    return {
      totalLeads,
      activeLeadsCount,
      overdueFollowUpsCount,
      dueTodayFollowUpsCount,
      staleOpportunitiesCount,
      unscheduledFollowUpsCount,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      healthScore,
      contactedRate,
      avgDaysInStage
    };
  }

  /**
   * Generates actionable diagnostic recommendations based on rule-based funnel analysis.
   */
  public static generateDiagnostics(
    funnel: FunnelSummary, 
    operational: OperationalHealthSummary,
    channels: ChannelPerformanceMetric[],
    segments: HealthcareSegmentMetric[]
  ): DiagnosticRecommendation[] {
    const list: DiagnosticRecommendation[] = [];

    // Rule 1: High Inquiries, Low Qualification Rate
    if (funnel.totalLeads >= 5 && funnel.qualificationRate < 35) {
      list.push({
        id: 'diag_low_qualification',
        severity: 'warning',
        category: 'targeting',
        title: 'Low Pre-Qualification Rate Detected',
        observation: `Only ${funnel.qualificationRate.toFixed(1)}% of total incoming leads meet healthcare qualification criteria.`,
        hypothesis: 'Traffic targeting may be attracting non-decision makers or general patient queries rather than hospital directors and clinic owners.',
        action: 'Review ad negative keyword lists, refine landing page messaging match, and verify pre-qualification form fields.',
        affectedMetric: 'Qualification Rate'
      });
    }

    // Rule 2: High Qualified Leads, Low Discovery Conversion
    if (funnel.qualifiedLeads >= 3 && funnel.discoveryBookingRate < 40) {
      list.push({
        id: 'diag_low_discovery',
        severity: 'urgent',
        category: 'outreach',
        title: 'Discovery Call Booking Drop-Off',
        observation: `Only ${funnel.discoveryBookingRate.toFixed(1)}% of qualified leads advance to the Discovery Diagnosis stage.`,
        hypothesis: 'Growth Partner response time after intake may be delayed, or initial outreach script lacks direct diagnostic value.',
        action: 'Enforce immediate 15-minute follow-up SLA on urgent leads and position initial outreach around the Healthcare Growth Audit™.',
        affectedMetric: 'Discovery Booking Rate'
      });
    }

    // Rule 3: Proposal to Won Conversion Bottleneck
    if (funnel.proposalCount >= 2 && funnel.winRate < 25) {
      list.push({
        id: 'diag_low_win_rate',
        severity: 'warning',
        category: 'proposal',
        title: 'Proposal Conversion Bottleneck',
        observation: `Win rate on submitted proposals is currently ${funnel.winRate.toFixed(1)}%.`,
        hypothesis: 'Prospects may encounter decision friction around commercial terms, ROI timelines, or competitive alternatives during negotiation.',
        action: 'Review proposal presentation decks, reinforce ROI projections, and schedule follow-up reviews within 48 hours of proposal dispatch.',
        affectedMetric: 'Win Rate'
      });
    }

    // Rule 4: Operational Risk Alert (Overdue or Stale Opportunities)
    if (operational.overdueFollowUpsCount > 0 || operational.staleOpportunitiesCount > 0) {
      list.push({
        id: 'diag_operational_risk',
        severity: operational.overdueFollowUpsCount > 2 ? 'urgent' : 'warning',
        category: 'operations',
        title: 'Pipeline Follow-Up SLA Slippage',
        observation: `${operational.overdueFollowUpsCount} overdue follow-up tasks and ${operational.staleOpportunitiesCount} stale opportunities (7+ days inactive) detected.`,
        hypothesis: 'Sales follow-up capacity is constrained or follow-ups are not being logged in the Admin workspace.',
        action: 'Open Follow-Up Queue tab immediately, clear overdue tasks, and assign clear next-action dates for all active opportunities.',
        affectedMetric: 'Follow-Up Response Time'
      });
    }

    // Rule 5: High-Performing Top Sector Identification
    const topSegment = [...segments].sort((a, b) => b.wonRevenue - a.wonRevenue)[0];
    if (topSegment && (topSegment.wonCount > 0 || topSegment.activePipelineValue > 0)) {
      list.push({
        id: 'diag_top_sector',
        severity: 'positive',
        category: 'scaling',
        title: `High Revenue Potential: ${topSegment.categoryLabel}`,
        observation: `${topSegment.categoryLabel} leads represent the highest pipeline value ($${topSegment.activePipelineValue.toLocaleString()}) and closed revenue ($${topSegment.wonRevenue.toLocaleString()}).`,
        hypothesis: 'Value proposition and offer framing resonate strongly with this specific healthcare sector.',
        action: 'Scale targeted Google Search PPC campaigns and produce dedicated sector case studies for this category.',
        affectedMetric: 'Pipeline Expansion'
      });
    }

    // Default positive indicator if overall health is balanced
    if (list.length === 0 || operational.healthScore >= 80) {
      list.push({
        id: 'diag_healthy_system',
        severity: 'positive',
        category: 'scaling',
        title: 'Revenue Operations System Operating Efficiently',
        observation: `Overall pipeline health score is ${operational.healthScore}/100 with active stage progression.`,
        hypothesis: 'Lead qualification, response speed, and stage progression align with operational targets.',
        action: 'Maintain current campaign settings and monitor channel conversion rates for budget scaling opportunities.',
        affectedMetric: 'Pipeline Velocity'
      });
    }

    return list;
  }
}
