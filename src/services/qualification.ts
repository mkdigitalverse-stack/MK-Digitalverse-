/**
 * Lead Qualification & Conversion Intelligence Foundation Service
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER
 * 
 * Provides transparent, deterministic rules-based evaluation for healthcare business enquiries.
 * Separates Visitor-Provided Data, Internal Qualification Data, and System Data.
 */

import { LeadType } from './firebase';

// 1. VISITOR-PROVIDED DATA INTERFACE
export interface VisitorLeadData {
  contactName: string;
  email: string;
  phone?: string;
  organizationName?: string;
  website?: string;
  location?: string;
  healthcareCategory?: string;
  biggestChallenge?: string;
  growthObjective?: string;
  investmentReadiness?: string;
  leadType: LeadType;
  // Raw Attribution
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  landingPage?: string;
  referrer?: string;
}

// 2. INTERNAL QUALIFICATION ENUMS / TYPES
export type FitStatus = 'unreviewed' | 'high_fit' | 'medium_fit' | 'low_fit';
export type LeadPriority = 'low' | 'normal' | 'high' | 'urgent';
export type IntentLevel = 'exploratory' | 'interested' | 'high_intent';
export type GrowthStage = 
  | 'needs_strategy' 
  | 'needs_visibility' 
  | 'needs_acquisition' 
  | 'needs_conversion' 
  | 'needs_automation' 
  | 'needs_full_growth_system';

export type HealthcareCategoryNormalized = 
  | 'hospital' 
  | 'specialty_clinic' 
  | 'ivf_fertility' 
  | 'dental' 
  | 'surgical' 
  | 'diagnostic' 
  | 'other_healthcare';

export type ChallengeCategory = 
  | 'visibility' 
  | 'trust' 
  | 'patient_acquisition' 
  | 'lead_quality' 
  | 'website_conversion' 
  | 'appointment_conversion' 
  | 'reputation' 
  | 'automation' 
  | 'strategy' 
  | 'multiple';

export type OpportunityStage = 'new' | 'contacted' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'none';
export type DerivedLeadSource = 'organic' | 'google_ads' | 'meta_ads' | 'linkedin' | 'direct' | 'referral' | 'unknown';

export type ProposalStatus = 'not_started' | 'draft' | 'sent' | 'viewed' | 'revision_requested' | 'accepted' | 'declined';
export type LostReason = 'budget' | 'timing' | 'internal_decision' | 'competitor' | 'no_response' | 'not_a_fit' | 'scope' | 'other';

export const STAGE_PROBABILITIES: Record<string, number> = {
  new: 0.05,
  contacted: 0.10,
  qualified: 0.25,
  discovery: 0.40,
  proposal: 0.65,
  negotiation: 0.80,
  won: 1.00,
  lost: 0.00,
  none: 0.05
};

// 3. INTERNAL QUALIFICATION DATA INTERFACE
export interface InternalQualificationData {
  fitStatus: FitStatus;
  leadPriority: LeadPriority;
  intentLevel: IntentLevel;
  growthStage: GrowthStage;
  healthcareCategoryNormalized: HealthcareCategoryNormalized;
  challengeCategory: ChallengeCategory;
  fitScore: number; // 0 - 100
  derivedLeadSource: DerivedLeadSource;
  
  // Optional Sales & Organization Profile Fields (Defaults to null/undefined)
  organizationSize?: string;
  locationsCount?: string;
  doctorCount?: string;
  currentMarketingStatus?: string;
  existingWebsite?: string;
  currentLeadSource?: string;
  monthlyMarketingReadiness?: string;
  internalNotes?: string;
  assignedTo?: string;
  nextFollowUpAt?: string;
  lastContactedAt?: string;
  qualificationReviewedAt?: string;
  opportunityStage: OpportunityStage;

  // Phase F-06 Sales Pipeline & Opportunity Fields
  estimatedOpportunityValue?: number;
  currency?: string;
  weightedPipelineValue?: number;
  stageProbability?: number;
  stageEnteredAt?: string;
  stageChangedAt?: string;
  nextAction?: string;
  lastUpdatedBy?: string;

  // Discovery
  discoveryDate?: string;
  decisionMaker?: string;
  decisionTimeline?: string;

  // Proposal
  proposalStatus?: ProposalStatus;
  proposalValue?: number;
  proposalSentAt?: string;
  proposalFollowUpAt?: string;

  // Negotiation
  negotiationStatus?: string;
  expectedDecisionDate?: string;
  negotiationNotes?: string;

  // Outcome
  wonDate?: string;
  finalContractValue?: number;
  lostDate?: string;
  lostReason?: LostReason;
  lostNotes?: string;
}

// 4. FULL BUSINESS LEAD RECORD (COMBINED SCHEMA)
export interface CompleteLeadRecord {
  // System Metadata
  leadId: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;
  notificationStatus?: 'pending' | 'sent' | 'failed';
  
  // Visitor Data
  visitorData: VisitorLeadData;
  
  // Internal Qualification Data
  qualification: InternalQualificationData;
}

// 5. QUALIFICATION ENGINE IMPLEMENTATION
export class QualificationEngine {

  /**
   * Normalizes raw healthcare category string into recognized healthcare sector taxonomy.
   */
  public static normalizeHealthcareCategory(rawCategory?: string): HealthcareCategoryNormalized {
    if (!rawCategory) return 'other_healthcare';
    const cat = rawCategory.toLowerCase();

    if (cat.includes('hospital') || cat.includes('medical center') || cat.includes('health system')) {
      return 'hospital';
    }
    if (cat.includes('ivf') || cat.includes('fertility') || cat.includes('reproductive')) {
      return 'ivf_fertility';
    }
    if (cat.includes('dental') || cat.includes('orthodontic') || cat.includes('oral')) {
      return 'dental';
    }
    if (cat.includes('surgical') || cat.includes('surgery') || cat.includes('operating')) {
      return 'surgical';
    }
    if (cat.includes('diagnostic') || cat.includes('pathology') || cat.includes('imaging') || cat.includes('lab')) {
      return 'diagnostic';
    }
    if (cat.includes('clinic') || cat.includes('specialty') || cat.includes('dermatology') || cat.includes('cardiology')) {
      return 'specialty_clinic';
    }

    return 'other_healthcare';
  }

  /**
   * Categorizes the primary business challenge based on textual indicators.
   */
  public static categorizeChallenge(challengeText?: string, objectiveText?: string): ChallengeCategory {
    const text = `${challengeText || ''} ${objectiveText || ''}`.toLowerCase();

    if (text.includes('patient') || text.includes('acquisition') || text.includes('volume') || text.includes('lead')) {
      return 'patient_acquisition';
    }
    if (text.includes('visibility') || text.includes('brand') || text.includes('reach') || text.includes('awareness')) {
      return 'visibility';
    }
    if (text.includes('trust') || text.includes('reputation') || text.includes('reviews') || text.includes('rating')) {
      return 'trust';
    }
    if (text.includes('conversion') || text.includes('website') || text.includes('landing')) {
      return 'website_conversion';
    }
    if (text.includes('appointment') || text.includes('booking') || text.includes('schedule')) {
      return 'appointment_conversion';
    }
    if (text.includes('automation') || text.includes('crm') || text.includes('follow') || text.includes('system')) {
      return 'automation';
    }
    if (text.includes('strategy') || text.includes('direction') || text.includes('growth partner')) {
      return 'strategy';
    }

    return 'multiple';
  }

  /**
   * Determines growth stage requirement based on enquiry data.
   */
  public static determineGrowthStage(challengeCat: ChallengeCategory, leadType: LeadType): GrowthStage {
    if (leadType === 'growth_audit') return 'needs_full_growth_system';
    
    switch (challengeCat) {
      case 'visibility':
        return 'needs_visibility';
      case 'patient_acquisition':
      case 'lead_quality':
        return 'needs_acquisition';
      case 'website_conversion':
      case 'appointment_conversion':
        return 'needs_conversion';
      case 'automation':
        return 'needs_automation';
      case 'strategy':
      default:
        return 'needs_strategy';
    }
  }

  /**
   * Derives channel lead source from raw UTM and referrer data.
   */
  public static deriveLeadSource(utmSource?: string, gclid?: string, fbclid?: string, referrer?: string): DerivedLeadSource {
    if (gclid || (utmSource && utmSource.toLowerCase().includes('google'))) return 'google_ads';
    if (fbclid || (utmSource && (utmSource.toLowerCase().includes('facebook') || utmSource.toLowerCase().includes('meta')))) return 'meta_ads';
    if (utmSource && utmSource.toLowerCase().includes('linkedin')) return 'linkedin';
    
    if (referrer) {
      const ref = referrer.toLowerCase();
      if (ref.includes('google.com') || ref.includes('bing.com')) return 'organic';
      if (ref.includes('linkedin.com') || ref.includes('t.co')) return 'referral';
    }

    if (utmSource) return 'organic';

    return 'direct';
  }

  /**
   * Transparent Weighted Scoring Algorithm (Total: 100 Points)
   * 
   * Factor Breakdown:
   * 1. Healthcare Category Fit  (Max 25 pts)
   * 2. Growth Need & Challenge Clarity (Max 20 pts)
   * 3. Commercial Readiness    (Max 20 pts)
   * 4. Intent & Enquiry Depth  (Max 20 pts)
   * 5. Digital Maturity & Scale (Max 15 pts)
   */
  public static calculateFitScore(lead: VisitorLeadData): {
    totalScore: number;
    breakdown: {
      categoryPoints: number;
      clarityPoints: number;
      readinessPoints: number;
      intentPoints: number;
      maturityPoints: number;
    };
  } {
    let categoryPoints = 15; // default baseline
    const normalizedCategory = this.normalizeHealthcareCategory(lead.healthcareCategory);
    
    if (['hospital', 'specialty_clinic', 'ivf_fertility', 'surgical'].includes(normalizedCategory)) {
      categoryPoints = 25;
    } else if (['dental', 'diagnostic'].includes(normalizedCategory)) {
      categoryPoints = 20;
    }

    // 2. Growth Need & Challenge Clarity (Max 20)
    let clarityPoints = 5;
    const challengeLen = (lead.biggestChallenge || '').length;
    const objectiveLen = (lead.growthObjective || '').length;

    if (challengeLen > 50 || objectiveLen > 50) {
      clarityPoints = 20;
    } else if (challengeLen > 10 || objectiveLen > 10) {
      clarityPoints = 14;
    }

    // 3. Commercial Readiness (Max 20)
    let readinessPoints = 10;
    const readinessStr = (lead.investmentReadiness || '').toLowerCase();
    if (readinessStr.includes('growth') || readinessStr.includes('10k') || readinessStr.includes('high') || readinessStr.includes('scale')) {
      readinessPoints = 20;
    } else if (readinessStr.includes('moderate') || readinessStr.includes('medium') || readinessStr.includes('5k')) {
      readinessPoints = 15;
    }

    // 4. Intent & Enquiry Depth (Max 20)
    let intentPoints = 12;
    if (lead.leadType === 'growth_audit') {
      intentPoints = 20;
    } else if (lead.leadType === 'discovery_call') {
      intentPoints = 17;
    }

    // 5. Digital Maturity & Scale (Max 15)
    let maturityPoints = 5;
    if (lead.organizationName && lead.website && lead.phone) {
      maturityPoints = 15;
    } else if (lead.organizationName || lead.website) {
      maturityPoints = 10;
    }

    const totalScore = Math.min(100, categoryPoints + clarityPoints + readinessPoints + intentPoints + maturityPoints);

    return {
      totalScore,
      breakdown: {
        categoryPoints,
        clarityPoints,
        readinessPoints,
        intentPoints,
        maturityPoints
      }
    };
  }

  /**
   * Full Lead Evaluation & Qualification Assignment.
   */
  public static evaluateLead(lead: VisitorLeadData): InternalQualificationData {
    const { totalScore } = this.calculateFitScore(lead);

    let fitStatus: FitStatus = 'medium_fit';
    if (totalScore >= 75) fitStatus = 'high_fit';
    else if (totalScore < 50) fitStatus = 'low_fit';

    let intentLevel: IntentLevel = 'interested';
    if (lead.leadType === 'growth_audit' || totalScore >= 75) {
      intentLevel = 'high_intent';
    } else if (lead.leadType === 'contact_enquiry' && totalScore < 50) {
      intentLevel = 'exploratory';
    }

    let leadPriority: LeadPriority = 'normal';
    if (fitStatus === 'high_fit' && intentLevel === 'high_intent') {
      leadPriority = 'urgent';
    } else if (fitStatus === 'high_fit') {
      leadPriority = 'high';
    } else if (fitStatus === 'low_fit') {
      leadPriority = 'low';
    }

    const normalizedCategory = this.normalizeHealthcareCategory(lead.healthcareCategory);
    const challengeCategory = this.categorizeChallenge(lead.biggestChallenge, lead.growthObjective);
    const growthStage = this.determineGrowthStage(challengeCategory, lead.leadType);
    const derivedLeadSource = this.deriveLeadSource(lead.utm_source, lead.gclid, lead.fbclid, lead.referrer);

    return {
      fitStatus,
      leadPriority,
      intentLevel,
      growthStage,
      healthcareCategoryNormalized: normalizedCategory,
      challengeCategory,
      fitScore: totalScore,
      derivedLeadSource,
      opportunityStage: 'none'
    };
  }
}
