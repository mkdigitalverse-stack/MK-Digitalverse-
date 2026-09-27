/**
 * Lead Reports & Acquisition Intelligence Engine
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-04: Sales & Business Reporting System — Lead Reports
 * 
 * Provides deep operational insights into:
 * - Lead acquisition channels & multi-touch attribution
 * - Lead quality, fit status, and intent level distribution
 * - Healthcare challenge categories & clinical growth objectives
 * - Response velocity and follow-up SLA compliance
 * - Detailed lead attribution audit table with CSV export integration
 */

import { CompleteLeadRecord, FitStatus, IntentLevel, HealthcareCategoryNormalized } from './qualification';
import { ReportingDateContext, ReportingDateService } from './reportingDateService';
import { FollowUpAutomationEngine } from './followUpAutomation';

export interface LeadQualityDistribution {
  highFit: number;
  mediumFit: number;
  lowFit: number;
  unreviewed: number;
  highFitPercentage: number;
  qualificationRate: number;
}

export interface IntentDistribution {
  highIntent: number;
  interested: number;
  exploratory: number;
}

export interface AttributionRecord {
  id: string;
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  landingPage: string;
  totalLeads: number;
  qualifiedLeads: number;
  qualificationRate: number;
  wonCount: number;
  activeValue: number;
}

export interface SlaResponseVelocity {
  contactedCount: number;
  uncontactedCount: number;
  contactedRate: number;
  onTrackCount: number;
  dueTodayCount: number;
  overdueCount: number;
  unscheduledCount: number;
  avgDaysInPipeline: number;
}

export interface ChallengeBreakdownItem {
  key: string;
  label: string;
  count: number;
  percentage: number;
}

export interface LeadReportSummary {
  dateContext: ReportingDateContext;
  totalLeadsInPeriod: number;
  quality: LeadQualityDistribution;
  intent: IntentDistribution;
  attribution: AttributionRecord[];
  topChallenges: ChallengeBreakdownItem[];
  topGrowthObjectives: { objective: string; count: number; percentage: number }[];
  categories: { key: HealthcareCategoryNormalized; label: string; count: number; percentage: number }[];
  velocity: SlaResponseVelocity;
}

export const CHALLENGE_LABELS: Record<string, string> = {
  patient_acquisition: 'Patient & Procedure Volume Acquisition',
  website_conversion: 'Website & Landing Page Conversion',
  lead_quality: 'Inquiry Quality & High Deductible Fit',
  visibility: 'Local SEO & Healthcare Search Visibility',
  reputation: 'Doctor Reputation & Clinical Trust',
  appointment_conversion: 'Reception / WhatsApp Booking Conversion',
  automation: 'Patient Follow-up & EHR Automation',
  strategy: 'Strategic Healthcare Brand Positioning',
  multiple: 'Multiple Cross-Functional Growth Challenges'
};

export class LeadReportingService {
  /**
   * Generates the comprehensive Lead Reports summary for the specified date context.
   */
  public static generateLeadReport(
    allLeads: CompleteLeadRecord[],
    dateContext: ReportingDateContext
  ): LeadReportSummary {
    const isAllTime = dateContext.period === 'all';
    const leads = isAllTime
      ? allLeads
      : ReportingDateService.filterRecordsByRange(allLeads, dateContext.currentRange);

    const totalLeads = leads.length;
    const now = new Date();

    // 1. Quality & Fit Distribution
    let highFit = 0;
    let mediumFit = 0;
    let lowFit = 0;
    let unreviewed = 0;

    leads.forEach(l => {
      const fit = l.qualification?.fitStatus;
      if (fit === 'high_fit') highFit++;
      else if (fit === 'medium_fit') mediumFit++;
      else if (fit === 'low_fit') lowFit++;
      else unreviewed++;
    });

    const highFitPercentage = totalLeads > 0 ? Math.round((highFit / totalLeads) * 100) : 0;
    const qualifiedLeadsCount = highFit + mediumFit;
    const qualificationRate = totalLeads > 0 ? Math.round((qualifiedLeadsCount / totalLeads) * 100) : 0;

    const quality: LeadQualityDistribution = {
      highFit,
      mediumFit,
      lowFit,
      unreviewed,
      highFitPercentage,
      qualificationRate
    };

    // 2. Intent Distribution
    let highIntent = 0;
    let interested = 0;
    let exploratory = 0;

    leads.forEach(l => {
      const intent = l.qualification?.intentLevel;
      if (intent === 'high_intent') highIntent++;
      else if (intent === 'interested') interested++;
      else exploratory++;
    });

    const intent: IntentDistribution = {
      highIntent,
      interested,
      exploratory
    };

    // 3. Attribution Records (Aggregated by Source + Medium + Campaign)
    const attrMap = new Map<string, AttributionRecord>();

    leads.forEach(lead => {
      const source = lead.visitorData?.utm_source || lead.qualification?.derivedLeadSource || 'direct';
      const medium = lead.visitorData?.utm_medium || (source === 'direct' ? 'none' : 'organic');
      const campaign = lead.visitorData?.utm_campaign || lead.visitorData?.utm_content || 'Default / None';
      const referrer = lead.visitorData?.referrer || 'Direct Ingestion';
      const landingPage = lead.visitorData?.landingPage || '/';

      const key = `${source}__${medium}__${campaign}`;

      if (!attrMap.has(key)) {
        attrMap.set(key, {
          id: key,
          source,
          medium,
          campaign,
          referrer,
          landingPage,
          totalLeads: 0,
          qualifiedLeads: 0,
          qualificationRate: 0,
          wonCount: 0,
          activeValue: 0
        });
      }

      const rec = attrMap.get(key)!;
      rec.totalLeads += 1;

      const isQual = lead.qualification?.fitStatus === 'high_fit' || 
        lead.qualification?.fitStatus === 'medium_fit' ||
        ['qualified', 'discovery', 'proposal', 'negotiations', 'won'].includes(lead.status);

      if (isQual) rec.qualifiedLeads += 1;
      if (lead.status === 'won') rec.wonCount += 1;
      else if (lead.status !== 'lost') {
        rec.activeValue += (lead.qualification?.estimatedOpportunityValue || 0);
      }
    });

    const attribution = Array.from(attrMap.values()).map(r => ({
      ...r,
      qualificationRate: r.totalLeads > 0 ? Math.round((r.qualifiedLeads / r.totalLeads) * 100) : 0
    })).sort((a, b) => b.totalLeads - a.totalLeads);

    // 4. Challenges Breakdown
    const challengeMap = new Map<string, number>();
    leads.forEach(l => {
      const ch = l.qualification?.challengeCategory || l.visitorData?.biggestChallenge || 'multiple';
      challengeMap.set(ch, (challengeMap.get(ch) || 0) + 1);
    });

    const topChallenges: ChallengeBreakdownItem[] = Array.from(challengeMap.entries())
      .map(([key, count]) => ({
        key,
        label: CHALLENGE_LABELS[key] || key.replace(/_/g, ' '),
        count,
        percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // 5. Growth Objectives Breakdown
    const objectiveMap = new Map<string, number>();
    leads.forEach(l => {
      const obj = l.visitorData?.growthObjective || l.qualification?.growthStage || 'Scaling Healthcare Practice';
      const cleanObj = obj.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      objectiveMap.set(cleanObj, (objectiveMap.get(cleanObj) || 0) + 1);
    });

    const topGrowthObjectives = Array.from(objectiveMap.entries())
      .map(([objective, count]) => ({
        objective,
        count,
        percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // 6. Healthcare Categories
    const categoryMap = new Map<HealthcareCategoryNormalized, number>();
    leads.forEach(l => {
      const cat = (l.qualification?.healthcareCategoryNormalized || 'other_healthcare') as HealthcareCategoryNormalized;
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });

    const categories = Array.from(categoryMap.entries())
      .map(([key, count]) => ({
        key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        count,
        percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // 7. Response Velocity & SLA Compliance
    let contactedCount = 0;
    let onTrackCount = 0;
    let dueTodayCount = 0;
    let overdueCount = 0;
    let unscheduledCount = 0;
    let totalDays = 0;

    leads.forEach(lead => {
      const isContacted = lead.status !== 'new' || !!lead.qualification?.lastContactedAt;
      if (isContacted) contactedCount++;

      if (lead.status !== 'won' && lead.status !== 'lost') {
        const evalRes = FollowUpAutomationEngine.evaluateOpportunity(lead, now);
        if (evalRes.classification === 'OVERDUE') overdueCount++;
        else if (evalRes.classification === 'DUE_TODAY') dueTodayCount++;
        else onTrackCount++;

        if (!lead.qualification?.nextFollowUpAt) unscheduledCount++;
        totalDays += evalRes.daysSinceLastActivity;
      }
    });

    const activeCount = leads.filter(l => l.status !== 'won' && l.status !== 'lost').length;
    const velocity: SlaResponseVelocity = {
      contactedCount,
      uncontactedCount: totalLeads - contactedCount,
      contactedRate: totalLeads > 0 ? Math.round((contactedCount / totalLeads) * 100) : 0,
      onTrackCount,
      dueTodayCount,
      overdueCount,
      unscheduledCount,
      avgDaysInPipeline: activeCount > 0 ? Math.round(totalDays / activeCount) : 0
    };

    return {
      dateContext,
      totalLeadsInPeriod: totalLeads,
      quality,
      intent,
      attribution,
      topChallenges,
      topGrowthObjectives,
      categories,
      velocity
    };
  }
}
