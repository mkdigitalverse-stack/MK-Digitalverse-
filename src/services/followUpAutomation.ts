/**
 * Revenue Operations & Follow-Up Automation Engine
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER
 * 
 * Centralized service to evaluate active opportunity follow-ups, stale status,
 * derived next-actions, pipeline risk, pipeline health indicators, and notification events.
 */

import { CompleteLeadRecord } from './qualification';

export type FollowUpClassification = 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING' | 'NO_FOLLOW_UP' | 'STALE_OPPORTUNITY';
export type ActivityStatus = 'active' | 'attention' | 'stale';
export type PipelineRiskLevel = 'low' | 'medium' | 'high';
export type PipelineHealthStatus = 'healthy' | 'needs_attention' | 'at_risk';

export interface EvaluatedOpportunity {
  lead: CompleteLeadRecord;
  classification: FollowUpClassification;
  activityStatus: ActivityStatus;
  daysSinceLastActivity: number;
  derivedNextAction: string;
  riskLevel: PipelineRiskLevel;
  riskReasons: string[];
}

export interface PipelineHealthSummary {
  status: PipelineHealthStatus;
  totalActiveCount: number;
  overdueCount: number;
  dueTodayCount: number;
  staleCount: number;
  unscheduledCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  healthScore: number; // 0-100
  statusMessage: string;
}

export interface NotificationEvent {
  type: 'follow_up_overdue' | 'opportunity_stale' | 'proposal_follow_up_due' | 'high_priority_lead_uncontacted';
  leadId: string;
  organizationName: string;
  contactName: string;
  assignedTo: string;
  details: string;
  timestamp: string;
}

export class FollowUpAutomationEngine {

  /**
   * Calculates days since last meaningful activity on an opportunity.
   */
  public static calculateDaysSinceLastActivity(lead: CompleteLeadRecord, now: Date = new Date()): number {
    const dates: number[] = [];
    
    if (lead.qualification.lastContactedAt) {
      dates.push(new Date(lead.qualification.lastContactedAt).getTime());
    }
    if (lead.qualification.stageChangedAt) {
      dates.push(new Date(lead.qualification.stageChangedAt).getTime());
    }
    if (lead.qualification.stageEnteredAt) {
      dates.push(new Date(lead.qualification.stageEnteredAt).getTime());
    }
    if (lead.updatedAt) {
      dates.push(new Date(lead.updatedAt).getTime());
    }
    if (lead.createdAt) {
      dates.push(new Date(lead.createdAt).getTime());
    }

    const maxActivityTimestamp = dates.length > 0 ? Math.max(...dates) : new Date(lead.createdAt).getTime();
    const diffMs = now.getTime() - maxActivityTimestamp;
    return Math.max(0, Math.floor(diffMs / (1000 * 3600 * 24)));
  }

  /**
   * Derives default activity status:
   * 0-2 days = Active
   * 3-6 days = Attention
   * 7+ days = Stale
   */
  public static getActivityStatus(daysInactive: number): ActivityStatus {
    if (daysInactive >= 7) return 'stale';
    if (daysInactive >= 3) return 'attention';
    return 'active';
  }

  /**
   * Derives sensible next action if Growth Partner hasn't entered one.
   */
  public static deriveNextAction(lead: CompleteLeadRecord): string {
    if (lead.qualification.nextAction && lead.qualification.nextAction.trim().length > 0) {
      return lead.qualification.nextAction.trim();
    }

    const stage = lead.qualification.opportunityStage || 'new';
    switch (stage) {
      case 'new':
        return 'Initial Outreach & Qualification Review';
      case 'contacted':
        return 'Schedule Initial Discovery Call';
      case 'qualified':
        return 'Conduct Healthcare Growth Audit & Discovery';
      case 'discovery':
        return 'Prepare Custom Growth Strategy & Proposal';
      case 'proposal':
        return 'Follow up on Proposal Review';
      case 'negotiation':
        return 'Finalize Scope & Commercial Terms';
      case 'won':
        return 'Initiate Client Onboarding & Partnership Kickoff';
      case 'lost':
        return 'Archive Opportunity & Schedule Future Nurture';
      default:
        return 'Initial Outreach';
    }
  }

  /**
   * Evaluates classification for an individual lead:
   * OVERDUE, DUE_TODAY, STALE_OPPORTUNITY, UPCOMING, NO_FOLLOW_UP
   */
  public static evaluateOpportunity(lead: CompleteLeadRecord, now: Date = new Date()): EvaluatedOpportunity {
    const stage = lead.qualification.opportunityStage || 'new';
    const isClosed = stage === 'won' || stage === 'lost';

    const daysInactive = this.calculateDaysSinceLastActivity(lead, now);
    const activityStatus = isClosed ? 'active' : this.getActivityStatus(daysInactive);
    const derivedNextAction = this.deriveNextAction(lead);

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = startOfToday + (24 * 3600 * 1000) - 1;

    let classification: FollowUpClassification = 'NO_FOLLOW_UP';

    const fAt = lead.qualification.nextFollowUpAt;
    if (fAt) {
      try {
        const fTime = new Date(fAt).getTime();
        if (fTime < startOfToday) {
          classification = 'OVERDUE';
        } else if (fTime >= startOfToday && fTime <= endOfToday) {
          classification = 'DUE_TODAY';
        } else {
          classification = 'UPCOMING';
        }
      } catch (_) {
        classification = 'NO_FOLLOW_UP';
      }
    }

    // Check if stale (active opportunity, no activity for 7+ days)
    if (!isClosed && daysInactive >= 7 && classification !== 'OVERDUE' && classification !== 'DUE_TODAY') {
      classification = 'STALE_OPPORTUNITY';
    }

    // Risk calculation
    const riskReasons: string[] = [];
    let riskLevel: PipelineRiskLevel = 'low';

    if (!isClosed) {
      if (classification === 'OVERDUE') {
        riskReasons.push('Follow-up is overdue');
      }
      if (daysInactive >= 7) {
        riskReasons.push('Inactive for 7+ days (stale)');
      }
      if (!fAt) {
        riskReasons.push('No next follow-up date scheduled');
      }

      if (classification === 'OVERDUE' || daysInactive >= 7 || !fAt) {
        riskLevel = 'high';
      } else if (daysInactive >= 3 || (stage === 'proposal' && daysInactive >= 4)) {
        riskLevel = 'medium';
        if (daysInactive >= 3) riskReasons.push('Limited recent activity (3-6 days)');
      } else {
        riskLevel = 'low';
        riskReasons.push('Active follow-up scheduled with recent engagement');
      }
    }

    return {
      lead,
      classification,
      activityStatus,
      daysSinceLastActivity: daysInactive,
      derivedNextAction,
      riskLevel,
      riskReasons
    };
  }

  /**
   * Calculates summary and health metrics across all active pipeline opportunities.
   */
  public static calculatePipelineHealth(leads: CompleteLeadRecord[], now: Date = new Date()): PipelineHealthSummary {
    const activeLeads = leads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');
    const totalActiveCount = activeLeads.length;

    if (totalActiveCount === 0) {
      return {
        status: 'healthy',
        totalActiveCount: 0,
        overdueCount: 0,
        dueTodayCount: 0,
        staleCount: 0,
        unscheduledCount: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        healthScore: 100,
        statusMessage: 'Pipeline is clear. All active opportunities are up to date.'
      };
    }

    let overdueCount = 0;
    let dueTodayCount = 0;
    let staleCount = 0;
    let unscheduledCount = 0;
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;

    activeLeads.forEach(lead => {
      const evalResult = this.evaluateOpportunity(lead, now);
      if (evalResult.classification === 'OVERDUE') overdueCount++;
      if (evalResult.classification === 'DUE_TODAY') dueTodayCount++;
      if (evalResult.classification === 'STALE_OPPORTUNITY' || evalResult.daysSinceLastActivity >= 7) staleCount++;
      if (!lead.qualification.nextFollowUpAt) unscheduledCount++;

      if (evalResult.riskLevel === 'high') highRiskCount++;
      else if (evalResult.riskLevel === 'medium') mediumRiskCount++;
      else lowRiskCount++;
    });

    const highRiskRatio = highRiskCount / totalActiveCount;
    let status: PipelineHealthStatus = 'healthy';
    let statusMessage = 'Pipeline operations healthy. High engagement and on-time follow-ups.';

    if (overdueCount >= 3 || highRiskRatio > 0.40) {
      status = 'at_risk';
      statusMessage = `Pipeline requires urgent attention: ${overdueCount} overdue follow-ups and ${staleCount} stale opportunities.`;
    } else if (overdueCount > 0 || highRiskRatio > 0.20 || staleCount > 0) {
      status = 'needs_attention';
      statusMessage = `Pipeline needs attention: ${overdueCount} overdue and ${staleCount} stale items detected.`;
    }

    const healthScore = Math.max(0, Math.min(100, Math.round(100 - (overdueCount * 15) - (staleCount * 10) - (unscheduledCount * 5))));

    return {
      status,
      totalActiveCount,
      overdueCount,
      dueTodayCount,
      staleCount,
      unscheduledCount,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      healthScore,
      statusMessage
    };
  }

  /**
   * Detects server-side notification events for Revenue Operations.
   */
  public static detectNotificationEvents(leads: CompleteLeadRecord[], now: Date = new Date()): NotificationEvent[] {
    const events: NotificationEvent[] = [];
    const activeLeads = leads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');

    activeLeads.forEach(lead => {
      const evalResult = this.evaluateOpportunity(lead, now);
      const orgName = lead.visitorData.organizationName || lead.visitorData.contactName || 'Healthcare Lead';
      const assigned = lead.qualification.assignedTo || 'Unassigned';

      if (evalResult.classification === 'OVERDUE') {
        events.push({
          type: 'follow_up_overdue',
          leadId: lead.leadId,
          organizationName: orgName,
          contactName: lead.visitorData.contactName,
          assignedTo: assigned,
          details: `Follow-up scheduled for ${new Date(lead.qualification.nextFollowUpAt!).toLocaleDateString()} is overdue.`,
          timestamp: now.toISOString()
        });
      }

      if (evalResult.daysSinceLastActivity >= 7) {
        events.push({
          type: 'opportunity_stale',
          leadId: lead.leadId,
          organizationName: orgName,
          contactName: lead.visitorData.contactName,
          assignedTo: assigned,
          details: `No sales activity recorded in ${evalResult.daysSinceLastActivity} days.`,
          timestamp: now.toISOString()
        });
      }

      if (lead.qualification.opportunityStage === 'proposal' && lead.qualification.proposalFollowUpAt) {
        try {
          const pDate = new Date(lead.qualification.proposalFollowUpAt).getTime();
          if (pDate <= now.getTime()) {
            events.push({
              type: 'proposal_follow_up_due',
              leadId: lead.leadId,
              organizationName: orgName,
              contactName: lead.visitorData.contactName,
              assignedTo: assigned,
              details: `Proposal follow-up date reached for $${(lead.qualification.proposalValue || lead.qualification.estimatedOpportunityValue || 0).toLocaleString()} proposal.`,
              timestamp: now.toISOString()
            });
          }
        } catch (_) {}
      }

      if (lead.qualification.leadPriority === 'urgent' && lead.status === 'new' && !lead.qualification.lastContactedAt) {
        events.push({
          type: 'high_priority_lead_uncontacted',
          leadId: lead.leadId,
          organizationName: orgName,
          contactName: lead.visitorData.contactName,
          assignedTo: assigned,
          details: `Urgent priority lead received and uncontacted.`,
          timestamp: now.toISOString()
        });
      }
    });

    return events;
  }
}
