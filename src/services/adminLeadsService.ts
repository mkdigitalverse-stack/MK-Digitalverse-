/**
 * Admin Lead Management Service
 * Handles authenticated admin workspace operations, real-time Supabase queries for /leads,
 * and updates to qualification / workflow fields and lead activities.
 */

import { User as SupabaseUser, RealtimeChannel } from '@supabase/supabase-js';

import { supabase, getSupabaseClient } from './supabase';
import { 
  CompleteLeadRecord, 
  VisitorLeadData, 
  InternalQualificationData, 
  QualificationEngine,
  OpportunityStage,
  STAGE_PROBABILITIES,
  LeadPriority,
  FOLLOW_UP_REMARK_OPTIONS,
  FollowUpRemarkOption
} from './qualification';
import { combineDateAndTime, formatFollowUpDateTime } from '../utils/followUpTime';

/**
 * Validates whether a string is a valid RFC 4122 UUID.
 */
export function isValidUuid(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str.trim());
}

/**
 * Generates an RFC 4122 compliant UUID v4 string.
 */
export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const AUTHORIZED_ADMIN_EMAIL = 'mkdigitalverse@gmail.com';

export const VALID_PIPELINE_STAGES = [
  'new',
  'contacted',
  'qualified',
  'discovery',
  'proposal',
  'negotiations',
  'won',
  'lost'
] as const;

export type ValidPipelineStage = typeof VALID_PIPELINE_STAGES[number];

export type AdminAuthUser = SupabaseUser & {
  displayName?: string | null;
};

export type Unsubscribe = () => void;

export interface LeadActivity {
  id?: string;
  type: 
    | 'stage_change' 
    | 'contacted' 
    | 'contact_made' 
    | 'discovery_scheduled' 
    | 'discovery_completed' 
    | 'audit_completed' 
    | 'proposal_sent' 
    | 'negotiations' 
    | 'negotiation' 
    | 'follow_up' 
    | 'follow_up_scheduled' 
    | 'follow_up_rescheduled'
    | 'follow_up_cancelled'
    | 'won' 
    | 'lost' 
    | 'note' 
    | 'note_added' 
    | 'lead_created'
    | 'value_updated' 
    | 'status_change';
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ManualLeadInput {
  contactName: string;
  email: string;
  phone: string;
  organizationName: string;
  website?: string;
  location?: string;
  healthcareCategory?: string;
  biggestChallenge?: string;
  growthObjective?: string;
  estimatedOpportunityValue?: number;
  currency?: string;
  assignedTo?: string;
  leadPriority?: LeadPriority;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  nextFollowUpRemark?: string;
  nextAction?: string;
  internalNotes?: string;
}

class AdminLeadsService {
  private activeActivityListeners = new Map<string, Set<(activity: LeadActivity) => void>>();

  /**
   * Evaluates if an authenticated Supabase user has authorized administrator status
   * by verifying credentials against public.profiles in the database.
   *
   * The user is recognized as an administrator ONLY when:
   * 1. Authenticated user's email matches the authorized admin email for this project.
   * 2. The database profile record has role = 'admin'.
   * 3. The database profile record has active = true.
   */
  public async checkAdminPermission(user: SupabaseUser | AdminAuthUser | null): Promise<boolean> {
    if (!user || !user.email) return false;

    // 1. Project-authorized admin email check
    const userEmail = user.email.toLowerCase().trim();
    if (userEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      console.warn(`[AdminLeadsService] User ${user.email} is not the authorized project admin.`);
      return false;
    }

    // 2. Database verification against public.profiles table
    if (!supabase) {
      console.warn('[AdminLeadsService] Supabase client is not configured; cannot verify public.profiles.');
      return false;
    }

    try {
      // Query profile by user.id in public.profiles
      const { data: profileById, error: idError } = await supabase
        .from('profiles')
        .select('id, email, role, active')
        .eq('id', user.id)
        .maybeSingle();

      if (idError) {
        console.warn('[AdminLeadsService] Profiles query by ID warning:', idError.message);
      }

      let profile = profileById;

      // Fallback query by email if profile was keyed by email
      if (!profile && userEmail) {
        const { data: profileByEmail, error: emailError } = await supabase
          .from('profiles')
          .select('id, email, role, active')
          .eq('email', userEmail)
          .maybeSingle();

        if (emailError) {
          console.warn('[AdminLeadsService] Profiles query by email warning:', emailError.message);
        }
        profile = profileByEmail;
      }

      if (!profile) {
        console.warn('[AdminLeadsService] Profile not found in public.profiles for user ID:', user.id);
        return false;
      }

      // 3. Must have role = 'admin' AND active = true in database
      const hasAdminRole = profile.role === 'admin';
      const isActive = profile.active === true;

      return Boolean(hasAdminRole && isActive);
    } catch (e) {
      console.error('[AdminLeadsService] Profiles verification exception:', e);
      return false;
    }
  }

  /**
   * Subscribes to Supabase auth state changes with database profile verification.
   * Uses supabase.auth.onAuthStateChange and verifies against public.profiles.
   */
  public subscribeToAuthState(
    callback: (user: AdminAuthUser | null, isAdmin: boolean) => void
  ): Unsubscribe {
    if (!supabase) {
      callback(null, false);
      return () => {};
    }

    const formatAdminUser = (user: SupabaseUser): AdminAuthUser => ({
      ...user,
      displayName:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.display_name ||
        user.email?.split('@')[0] ||
        'Admin',
    });

    let isSubscribed = true;

    // 1. Immediate initial check from existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (!isSubscribed) return;
      if (error) {
        console.warn('[AdminLeadsService] Initial getSession warning:', error.message);
        callback(null, false);
        return;
      }
      const user = session?.user ?? null;
      if (!user) {
        callback(null, false);
      } else {
        const adminUser = formatAdminUser(user);
        const isAdmin = await this.checkAdminPermission(user);
        if (isSubscribed) {
          callback(adminUser, isAdmin);
        }
      }
    }).catch((err) => {
      if (isSubscribed) {
        console.warn('[AdminLeadsService] Initial getSession note:', err);
        callback(null, false);
      }
    });

    // 2. Continuous real-time subscription to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isSubscribed) return;
        const user = session?.user ?? null;
        if (!user) {
          callback(null, false);
        } else {
          const adminUser = formatAdminUser(user);
          const isAdmin = await this.checkAdminPermission(user);
          if (isSubscribed) {
            callback(adminUser, isAdmin);
          }
        }
      }
    );

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }

  /**
   * Triggers Google OAuth Sign-In for Admin users via Supabase.
   * Uses supabase.auth.signInWithOAuth({ provider: 'google', ... })
   */
  public async signInWithGoogle(): Promise<void> {
    const client = getSupabaseClient();
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/admin`
      : undefined;

    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data?.url && typeof window !== 'undefined') {
      window.location.assign(data.url);
    }
  }

  /**
   * Signs out current Admin session via Supabase.
   * Uses supabase.auth.signOut()
   */
  public async signOut(): Promise<void> {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('[AdminLeadsService] Supabase signOut note:', error.message);
        throw error;
      }
    }
  }

  private leadListeners: Set<(leads: CompleteLeadRecord[]) => void> = new Set();
  private cachedLeads: CompleteLeadRecord[] = [];
  private pollIntervalId: any = null;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      try {
        const cachedJson = localStorage.getItem('mk_leads_cache_v2');
        if (cachedJson) {
          const parsed = JSON.parse(cachedJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.cachedLeads = parsed;
          }
        }
      } catch (_) {}
    }
  }

  /**
   * Adapts a raw Supabase database row (snake_case) or Firestore document (camelCase)
   * into the standard CompleteLeadRecord domain model expected by all Admin CRM components.
   */
  public mapRowToCompleteLeadRecord(raw: Record<string, any>): CompleteLeadRecord {
    const leadId = String(raw.id || raw.leadId || '');

    const visitorData: VisitorLeadData = {
      contactName: raw.contact_name ?? raw.name ?? raw.contactName ?? 'Anonymous',
      email: raw.email || '',
      phone: raw.phone || '',
      organizationName: raw.organization_name ?? raw.organizationName ?? '',
      website: raw.website || '',
      location: raw.location || '',
      healthcareCategory: raw.healthcare_category ?? raw.healthcareCategory ?? '',
      biggestChallenge: raw.biggest_challenge ?? raw.biggestChallenge ?? '',
      growthObjective: raw.growth_objective ?? raw.growthObjective ?? '',
      investmentReadiness: raw.investment_readiness ?? raw.investmentReadiness ?? '',
      leadType: raw.lead_type ?? raw.leadType ?? 'contact_enquiry',
      utm_source: raw.utm_source ?? raw.utmSource ?? '',
      utm_medium: raw.utm_medium ?? raw.utmMedium ?? '',
      utm_campaign: raw.utm_campaign ?? raw.utmCampaign ?? '',
      utm_content: raw.utm_content ?? raw.utmContent ?? '',
      utm_term: raw.utm_term ?? raw.utmTerm ?? '',
      gclid: raw.gclid || '',
      fbclid: raw.fbclid || '',
      landingPage: raw.landing_page ?? raw.landingPage ?? '',
      referrer: raw.referrer || ''
    };

    // Evaluate default qualification on-the-fly if missing
    const defaultEval = QualificationEngine.evaluateLead(visitorData);

    // 1:1 mapping: public.leads.status is the single source of truth for the pipeline stage
    const rawStatus = String(raw.status || 'new').toLowerCase().trim();
    const opportunityStage: OpportunityStage = (VALID_PIPELINE_STAGES as readonly string[]).includes(rawStatus)
      ? (rawStatus as OpportunityStage)
      : 'new';

    const estValRaw = raw.estimated_opportunity_value ?? raw.estimatedOpportunityValue;
    const estVal = typeof estValRaw === 'number' ? estValRaw : (estValRaw !== undefined && estValRaw !== null && !isNaN(Number(estValRaw)) ? Number(estValRaw) : undefined);

    const prob = STAGE_PROBABILITIES[opportunityStage] ?? 0.05;
    const weightedVal = estVal !== undefined ? Math.round(estVal * prob) : undefined;

    const fitScoreRaw = raw.fit_score ?? raw.fitScore;
    const fitScore = typeof fitScoreRaw === 'number' ? fitScoreRaw : (fitScoreRaw !== undefined && fitScoreRaw !== null && !isNaN(Number(fitScoreRaw)) ? Number(fitScoreRaw) : defaultEval.fitScore);

    // Explicitly parse follow-up fields: distinguish valid timestamp vs null (explicitly cleared) vs undefined (omitted)
    let parsedNextFollowUpAt: string | undefined = undefined;
    const rawFollowUp = raw.next_follow_up_at !== undefined ? raw.next_follow_up_at : raw.nextFollowUpAt;
    if (typeof rawFollowUp === 'string' && rawFollowUp.trim() !== '') {
      const parsedDate = new Date(rawFollowUp.trim());
      if (!isNaN(parsedDate.getTime())) {
        parsedNextFollowUpAt = parsedDate.toISOString();
      }
    }

    const rawRemark = raw.next_follow_up_remark ?? raw.nextFollowUpRemark;
    const parsedNextFollowUpRemark = (typeof rawRemark === 'string' && rawRemark.trim() !== '')
      ? rawRemark.trim()
      : undefined;

    const rawNote = raw.next_follow_up_note ?? raw.nextFollowUpNote;
    const parsedNextFollowUpNote = (typeof rawNote === 'string' && rawNote.trim() !== '')
      ? rawNote.trim()
      : undefined;

    let parsedLastContactedAt: string | undefined = undefined;
    const rawContacted = raw.last_contacted_at !== undefined ? raw.last_contacted_at : raw.lastContactedAt;
    if (typeof rawContacted === 'string' && rawContacted.trim() !== '') {
      const parsedDate = new Date(rawContacted.trim());
      if (!isNaN(parsedDate.getTime())) {
        parsedLastContactedAt = parsedDate.toISOString();
      }
    }

    const qualification: InternalQualificationData = {
      fitStatus: raw.fit_status ?? raw.fitStatus ?? defaultEval.fitStatus,
      leadPriority: raw.lead_priority ?? raw.leadPriority ?? defaultEval.leadPriority,
      intentLevel: raw.intent_level ?? raw.intentLevel ?? defaultEval.intentLevel,
      growthStage: raw.growth_stage ?? raw.growthStage ?? defaultEval.growthStage,
      healthcareCategoryNormalized: raw.healthcare_category_normalized ?? raw.healthcareCategoryNormalized ?? defaultEval.healthcareCategoryNormalized,
      challengeCategory: raw.challenge_category ?? raw.challengeCategory ?? defaultEval.challengeCategory,
      fitScore,
      derivedLeadSource: (raw.derived_lead_source === 'admin_manual' || raw.derivedLeadSource === 'admin_manual' || raw.utm_source === 'admin_manual') ? 'admin_manual' : (raw.derived_lead_source ?? raw.derivedLeadSource ?? defaultEval.derivedLeadSource),
      organizationSize: raw.organization_size ?? raw.organizationSize ?? undefined,
      locationsCount: raw.locations_count ?? raw.locationsCount ?? undefined,
      doctorCount: raw.doctor_count ?? raw.doctorCount ?? undefined,
      currentMarketingStatus: raw.current_marketing_status ?? raw.currentMarketingStatus ?? undefined,
      existingWebsite: raw.existing_website ?? raw.existingWebsite ?? undefined,
      currentLeadSource: raw.current_lead_source ?? raw.currentLeadSource ?? undefined,
      monthlyMarketingReadiness: raw.monthly_marketing_readiness ?? raw.monthlyMarketingReadiness ?? undefined,
      internalNotes: raw.internal_notes ?? raw.internalNotes ?? '',
      assignedTo: raw.assigned_to ?? raw.assignedTo ?? 'Unassigned',
      nextFollowUpAt: parsedNextFollowUpAt,
      nextFollowUpRemark: parsedNextFollowUpRemark,
      nextFollowUpNote: parsedNextFollowUpNote,
      lastContactedAt: parsedLastContactedAt,
      qualificationReviewedAt: raw.qualification_reviewed_at ?? raw.qualificationReviewedAt ?? undefined,
      opportunityStage,
      
      estimatedOpportunityValue: estVal,
      currency: raw.currency || 'USD',
      weightedPipelineValue: weightedVal,
      stageProbability: prob,
      stageEnteredAt: raw.stage_entered_at ?? raw.stageEnteredAt ?? raw.created_at ?? raw.createdAt,
      stageChangedAt: raw.stage_changed_at ?? raw.stageChangedAt ?? raw.created_at ?? raw.createdAt,
      nextAction: raw.next_action ?? raw.nextAction ?? '',
      lastUpdatedBy: raw.last_updated_by ?? raw.lastUpdatedBy ?? '',

      discoveryDate: raw.discovery_date ?? raw.discoveryDate ?? undefined,
      decisionMaker: raw.decision_maker ?? raw.decisionMaker ?? undefined,
      decisionTimeline: raw.decision_timeline ?? raw.decisionTimeline ?? undefined,

      proposalStatus: raw.proposal_status ?? raw.proposalStatus ?? 'not_started',
      proposalValue: typeof (raw.proposal_value ?? raw.proposalValue) === 'number' ? (raw.proposal_value ?? raw.proposalValue) : undefined,
      proposalSentAt: raw.proposal_sent_at ?? raw.proposalSentAt ?? undefined,
      proposalFollowUpAt: raw.proposal_follow_up_at ?? raw.proposalFollowUpAt ?? undefined,

      negotiationStatus: raw.negotiation_status ?? raw.negotiationStatus ?? undefined,
      expectedDecisionDate: raw.expected_decision_date ?? raw.expectedDecisionDate ?? undefined,
      negotiationNotes: raw.negotiation_notes ?? raw.negotiationNotes ?? undefined,

      wonDate: raw.won_date ?? raw.wonDate ?? undefined,
      finalContractValue: typeof (raw.final_contract_value ?? raw.finalContractValue) === 'number' ? (raw.final_contract_value ?? raw.finalContractValue) : undefined,

      lostDate: raw.lost_date ?? raw.lostDate ?? undefined,
      lostReason: raw.lost_reason ?? raw.lostReason ?? undefined,
      lostNotes: raw.lost_notes ?? raw.lostNotes ?? undefined
    };

    const status: CompleteLeadRecord['status'] = opportunityStage as CompleteLeadRecord['status'];

    return {
      leadId,
      status,
      createdAt: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
      updatedAt: raw.updated_at ?? raw.updatedAt ?? raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
      notificationStatus: raw.notification_status ?? raw.notificationStatus,
      visitorData,
      qualification
    };
  }

  /**
   * Refreshes the leads list from Supabase and notifies active listeners.
   */
  public async refreshLeads(): Promise<CompleteLeadRecord[]> {
    if (!supabase) return this.cachedLeads;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[AdminLeadsService] Supabase leads query error:', error.message);
        throw error;
      }

      const remoteRecords: CompleteLeadRecord[] = (data || []).map((row) => this.mapRowToCompleteLeadRecord(row));
      
      // State Reconciliation:
      // Reconcile each remote lead by ID against existing confirmed records in memory and localStorage.
      // 1. Build an index of local confirmed records
      const localMap = new Map<string, CompleteLeadRecord>();
      for (const l of this.cachedLeads) {
        if (l && l.leadId) localMap.set(l.leadId, l);
      }
      if (typeof localStorage !== 'undefined') {
        try {
          const cachedJson = localStorage.getItem('mk_leads_cache_v2');
          if (cachedJson) {
            const parsed = JSON.parse(cachedJson);
            if (Array.isArray(parsed)) {
              for (const l of parsed) {
                if (l && l.leadId && !localMap.has(l.leadId)) {
                  localMap.set(l.leadId, l);
                }
              }
            }
          }
        } catch (_) {}
      }

      const reconciledMap = new Map<string, CompleteLeadRecord>();

      for (const remote of remoteRecords) {
        const local = localMap.get(remote.leadId);
        if (local) {
          const remoteTime = new Date(remote.updatedAt).getTime();
          const localTime = new Date(local.updatedAt).getTime();

          // Reject demonstrably older records when reliable version information proves they are stale:
          // A local record WINS ONLY if localTime is strictly newer than remoteTime (i.e. local mutation happened after remote snapshot)
          if (localTime > remoteTime) {
            reconciledMap.set(local.leadId, local);
          } else {
            // Confirmed Supabase row is the source of truth after successful mutations (remoteTime >= localTime).
            // Do NOT merge stale follow-up fields back into a newer record.
            // If the database returned NULL for next_follow_up_at, it is truly unscheduled.
            
            // Retain client-only qualification values if remote omitted them:
            if (local.qualification.estimatedOpportunityValue !== undefined && remote.qualification.estimatedOpportunityValue === undefined) {
              remote.qualification.estimatedOpportunityValue = local.qualification.estimatedOpportunityValue;
              remote.qualification.weightedPipelineValue = Math.round(
                local.qualification.estimatedOpportunityValue * (STAGE_PROBABILITIES[remote.qualification.opportunityStage] ?? 0.05)
              );
            }
            if ((!remote.qualification.assignedTo || remote.qualification.assignedTo === 'Unassigned') && (local.qualification.assignedTo && local.qualification.assignedTo !== 'Unassigned')) {
              remote.qualification.assignedTo = local.qualification.assignedTo;
            }
            if (!remote.qualification.nextAction && local.qualification.nextAction) {
              remote.qualification.nextAction = local.qualification.nextAction;
            }
            if (!remote.qualification.internalNotes && local.qualification.internalNotes) {
              remote.qualification.internalNotes = local.qualification.internalNotes;
            }
            reconciledMap.set(remote.leadId, remote);
          }
        } else {
          reconciledMap.set(remote.leadId, remote);
        }
      }

      // Preserve any un-queried local leads (e.g. offline created manual leads pending sync)
      for (const [id, local] of localMap.entries()) {
        if (!reconciledMap.has(id)) {
          reconciledMap.set(id, local);
        }
      }

      const records = Array.from(reconciledMap.values());
      // Sort by created_at descending to maintain standard pipeline ordering
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      this.cachedLeads = records;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('mk_leads_cache_v2', JSON.stringify(records));
        }
      } catch (_) {}

      this.leadListeners.forEach((listener) => {
        try {
          listener(records);
        } catch (lErr) {
          console.error('[AdminLeadsService] Listener notification error:', lErr);
        }
      });
      return records;
    } catch (err) {
      console.warn('[AdminLeadsService] Leads fetch note:', err);
      if (typeof localStorage !== 'undefined') {
        try {
          const cachedJson = localStorage.getItem('mk_leads_cache_v2');
          if (cachedJson) {
            const parsed = JSON.parse(cachedJson);
            if (Array.isArray(parsed) && parsed.length > 0) {
              this.cachedLeads = parsed;
              return parsed;
            }
          }
        } catch (_) {}
      }
      throw err;
    }
  }

  /**
   * Subscribes to leads from Supabase PostgreSQL for authorized admins.
   * Performs an initial query and provides a safe subscription callback API
   * so existing Admin CRM views continue operating seamlessly.
   * Realtime channels will be integrated in Phase 3.
   */
  public subscribeToLeads(
    onData: (leads: CompleteLeadRecord[]) => void,
    onError: (errorMessage: string) => void
  ): Unsubscribe {
    if (!supabase) {
      onError('Supabase client is not configured.');
      return () => {};
    }

    this.leadListeners.add(onData);

    // Deliver cached leads immediately if available
    if (this.cachedLeads.length > 0) {
      onData(this.cachedLeads);
    }

    // Execute initial fetch
    this.refreshLeads().catch((err: any) => {
      onError(err?.message || 'Failed to fetch leads from Supabase');
    });

    // Light background sync interval (30s) while view is mounted
    if (!this.pollIntervalId) {
      this.pollIntervalId = setInterval(() => {
        if (this.leadListeners.size > 0) {
          this.refreshLeads().catch(() => {});
        }
      }, 30000);
    }

    return () => {
      this.leadListeners.delete(onData);
      if (this.leadListeners.size === 0 && this.pollIntervalId) {
        clearInterval(this.pollIntervalId);
        this.pollIntervalId = null;
      }
    };
  }

  /**
   * Updates lead qualification, priority, status, pipeline, and internal sales notes in Supabase.
   */
  public async updateLead(
    leadId: string,
    updates: Partial<InternalQualificationData> & { status?: CompleteLeadRecord['status'] }
  ): Promise<CompleteLeadRecord> {
    if (!leadId) {
      throw new Error('Lead ID is required for update.');
    }

    // 1. Determine and validate target stage if provided
    let targetStage: ValidPipelineStage | undefined = undefined;
    const stageCandidate = updates.status !== undefined ? updates.status : updates.opportunityStage;
    if (stageCandidate !== undefined) {
      const raw = String(stageCandidate).toLowerCase().trim();
      if (!VALID_PIPELINE_STAGES.includes(raw as any)) {
        throw new Error(
          `Invalid pipeline stage "${stageCandidate}". Valid stages are: ${VALID_PIPELINE_STAGES.join(', ')}`
        );
      }
      targetStage = raw as ValidPipelineStage;
    }

    if (!supabase || !isValidUuid(leadId)) {
      const existing = this.cachedLeads.find(l => l.leadId === leadId);
      if (existing) {
        if (supabase && !isValidUuid(leadId)) {
          console.warn(`[AdminLeadsService] Lead ID "${leadId}" is not a valid UUID; updating local cache only.`);
        }
        const timestamp = new Date().toISOString();
        const effectiveStage = targetStage || existing.status;
        const updatedRecord: CompleteLeadRecord = {
          ...existing,
          status: effectiveStage,
          updatedAt: timestamp,
          qualification: {
            ...existing.qualification,
            opportunityStage: effectiveStage,
            ...(updates.nextFollowUpAt !== undefined ? { nextFollowUpAt: updates.nextFollowUpAt || undefined } : {}),
            ...(updates.nextFollowUpRemark !== undefined ? { nextFollowUpRemark: updates.nextFollowUpRemark || undefined } : {}),
            ...(updates.nextFollowUpNote !== undefined ? { nextFollowUpNote: updates.nextFollowUpNote || undefined } : {}),
            ...(updates.lastContactedAt !== undefined ? { lastContactedAt: updates.lastContactedAt || undefined } : {}),
            ...(updates.nextAction !== undefined ? { nextAction: updates.nextAction || '' } : {}),
            ...(updates.assignedTo !== undefined ? { assignedTo: updates.assignedTo } : {}),
            ...(updates.leadPriority !== undefined ? { leadPriority: updates.leadPriority } : {}),
            ...(updates.internalNotes !== undefined ? { internalNotes: updates.internalNotes } : {}),
            ...(updates.estimatedOpportunityValue !== undefined ? { 
              estimatedOpportunityValue: updates.estimatedOpportunityValue,
              weightedPipelineValue: Math.round(updates.estimatedOpportunityValue * (STAGE_PROBABILITIES[effectiveStage] ?? 0.05))
            } : {})
          }
        };
        this.cachedLeads = this.cachedLeads.map(l => l.leadId === leadId ? updatedRecord : l);
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('mk_leads_cache_v2', JSON.stringify(this.cachedLeads));
          }
        } catch (_) {}
        this.leadListeners.forEach(listener => { try { listener(this.cachedLeads); } catch (_) {} });
        return updatedRecord;
      }
      if (!supabase) throw new Error('Supabase client is not configured.');
      throw new Error(`Lead update failed: No record found with ID "${leadId}".`);
    }

    const timestamp = new Date().toISOString();

    // 2. Map payload: public.leads.status is the single source of truth for pipeline stage
    const mappedPayload: Record<string, any> = {
      updated_at: timestamp
    };

    if (targetStage !== undefined) {
      mappedPayload.status = targetStage;
      mappedPayload.stage_changed_at = timestamp;
    }
    if (updates.nextFollowUpAt !== undefined) {
      mappedPayload.next_follow_up_at = updates.nextFollowUpAt ? new Date(updates.nextFollowUpAt).toISOString() : null;
    }
    if (updates.lastContactedAt !== undefined) {
      mappedPayload.last_contacted_at = updates.lastContactedAt ? new Date(updates.lastContactedAt).toISOString() : null;
    }
    if (updates.nextFollowUpRemark !== undefined) {
      mappedPayload.next_follow_up_remark = updates.nextFollowUpRemark ? updates.nextFollowUpRemark.trim() : null;
    }
    if (updates.nextFollowUpNote !== undefined) {
      mappedPayload.next_follow_up_note = updates.nextFollowUpNote ? updates.nextFollowUpNote.trim() : null;
    }
    if (updates.nextAction !== undefined) {
      mappedPayload.next_action = updates.nextAction ? updates.nextAction.trim() : null;
    }
    if (updates.estimatedOpportunityValue !== undefined) {
      mappedPayload.estimated_opportunity_value = updates.estimatedOpportunityValue !== null && !isNaN(Number(updates.estimatedOpportunityValue)) ? Number(updates.estimatedOpportunityValue) : null;
    }
    if (updates.currency !== undefined) {
      mappedPayload.currency = updates.currency;
    }
    if (updates.assignedTo !== undefined) {
      const trimmed = updates.assignedTo ? updates.assignedTo.trim() : '';
      mappedPayload.assigned_to = (trimmed && isValidUuid(trimmed)) ? trimmed : null;
    }
    if (updates.leadPriority !== undefined) {
      mappedPayload.lead_priority = updates.leadPriority;
    }
    if (updates.internalNotes !== undefined) {
      mappedPayload.internal_notes = updates.internalNotes;
    }

    try {
      // 3. Execute UPDATE against the confirmed lead UUID and verify row update with .select('*').single()
      let data: any = null;
      const res = await supabase
        .from('leads')
        .update(mappedPayload)
        .eq('id', leadId)
        .select('*')
        .single();

      if (res.error) {
        // If optional extended columns are missing on remote table, fallback gracefully
        if (res.error.message?.includes('column') || (res.error as any).code === '42703') {
          const fallbackPayload: Record<string, any> = { 
            updated_at: timestamp,
            status: targetStage,
            next_follow_up_at: updates.nextFollowUpAt !== undefined ? (updates.nextFollowUpAt ? new Date(updates.nextFollowUpAt).toISOString() : null) : undefined,
            next_follow_up_remark: updates.nextFollowUpRemark !== undefined ? (updates.nextFollowUpRemark ? updates.nextFollowUpRemark.trim() : null) : undefined,
            next_follow_up_note: updates.nextFollowUpNote !== undefined ? (updates.nextFollowUpNote ? updates.nextFollowUpNote.trim() : null) : undefined,
            last_contacted_at: updates.lastContactedAt !== undefined ? (updates.lastContactedAt ? new Date(updates.lastContactedAt).toISOString() : null) : undefined,
            next_action: updates.nextAction !== undefined ? (updates.nextAction ? updates.nextAction.trim() : null) : undefined
          };
          Object.keys(fallbackPayload).forEach(k => fallbackPayload[k] === undefined && delete fallbackPayload[k]);

          const fallbackRes = await supabase
            .from('leads')
            .update(fallbackPayload)
            .eq('id', leadId)
            .select('*')
            .single();

          if (fallbackRes.error) {
            if (fallbackRes.error.message?.includes('column') || (fallbackRes.error as any).code === '42703') {
              const minimalPayload: Record<string, any> = { updated_at: timestamp };
              if (targetStage !== undefined) minimalPayload.status = targetStage;
              if (updates.nextFollowUpAt !== undefined) {
                minimalPayload.next_follow_up_at = updates.nextFollowUpAt ? new Date(updates.nextFollowUpAt).toISOString() : null;
              }
              const minimalRes = await supabase
                .from('leads')
                .update(minimalPayload)
                .eq('id', leadId)
                .select('*')
                .single();
              if (minimalRes.error) {
                console.error('[AdminLeadsService] Error updating lead in Supabase minimal fallback:', minimalRes.error.message);
                throw new Error(`Database update failed: ${minimalRes.error.message}`);
              }
              data = minimalRes.data;
            } else {
              console.error('[AdminLeadsService] Error updating lead in Supabase fallback:', fallbackRes.error.message);
              throw new Error(`Database update failed: ${fallbackRes.error.message}`);
            }
          } else {
            data = fallbackRes.data;
          }
        } else {
          console.error('[AdminLeadsService] Error updating lead in Supabase:', res.error.message);
          throw new Error(`Database update failed: ${res.error.message}`);
        }
      } else {
        data = res.data;
      }

      if (!data) {
        throw new Error(`Lead update failed: No record found with ID "${leadId}" or update was not permitted by security policies.`);
      }

      // 4. Verify the database write: ensure data.status matches requested stage
      if (targetStage !== undefined) {
        const returnedStatus = String(data.status || '').toLowerCase().trim();
        if (returnedStatus !== targetStage) {
          throw new Error(
            `Pipeline stage verification failed: requested "${targetStage}" but database returned "${data.status ?? 'null'}".`
          );
        }
      }

      // 5. Map returned verified database row into domain model
      const updatedRecord = this.mapRowToCompleteLeadRecord(data);

      // Preserve application-layer qualification calculations in memory
      if (typeof updates.estimatedOpportunityValue === 'number') {
        updatedRecord.qualification.estimatedOpportunityValue = updates.estimatedOpportunityValue;
        const prob = STAGE_PROBABILITIES[updatedRecord.qualification.opportunityStage] ?? 0.05;
        updatedRecord.qualification.weightedPipelineValue = Math.round(updates.estimatedOpportunityValue * prob);
      }
      if (updates.currency) {
        updatedRecord.qualification.currency = updates.currency;
      }
      if (updates.nextAction) {
        updatedRecord.qualification.nextAction = updates.nextAction;
      }
      if (updates.assignedTo !== undefined) {
        updatedRecord.qualification.assignedTo = updates.assignedTo;
      }
      if (updates.internalNotes !== undefined) {
        updatedRecord.qualification.internalNotes = updates.internalNotes;
      }
      if (updates.lastContactedAt !== undefined) {
        updatedRecord.qualification.lastContactedAt = updates.lastContactedAt || undefined;
      }
      if (updates.nextFollowUpAt !== undefined) {
        updatedRecord.qualification.nextFollowUpAt = updates.nextFollowUpAt || undefined;
      }
      if (updates.nextFollowUpRemark !== undefined) {
        updatedRecord.qualification.nextFollowUpRemark = updates.nextFollowUpRemark || undefined;
      }
      if (updates.nextFollowUpNote !== undefined) {
        updatedRecord.qualification.nextFollowUpNote = updates.nextFollowUpNote || undefined;
      }
      if (updates.leadPriority !== undefined) {
        updatedRecord.qualification.leadPriority = updates.leadPriority;
      }
      if (updates.fitStatus !== undefined) {
        updatedRecord.qualification.fitStatus = updates.fitStatus;
      }
      if (updates.intentLevel !== undefined) {
        updatedRecord.qualification.intentLevel = updates.intentLevel;
      }
      if (updates.growthStage !== undefined) {
        updatedRecord.qualification.growthStage = updates.growthStage;
      }
      if (typeof updates.fitScore === 'number') {
        updatedRecord.qualification.fitScore = updates.fitScore;
      }

      // 6. Update cached leads and notify listeners
      this.cachedLeads = this.cachedLeads.map((lead) =>
        lead.leadId === leadId ? updatedRecord : lead
      );

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('mk_leads_cache_v2', JSON.stringify(this.cachedLeads));
        }
      } catch (_) {}

      this.leadListeners.forEach((listener) => {
        try {
          listener(this.cachedLeads);
        } catch (_) {}
      });

      return updatedRecord;
    } catch (error: any) {
      console.error('[AdminLeadsService] Lead update exception:', error);
      throw error;
    }
  }

  /**
   * ADM-09: Schedules a new follow-up for a lead.
   * Persists next_follow_up_at to Supabase, logs a follow_up_scheduled activity,
   * updates the confirmed database state and local cache, and notifies listeners.
   */
  public async scheduleFollowUp(
    leadId: string,
    payload: {
      date: string;
      time: string;
      remark: string;
      note?: string;
      actor?: string;
    }
  ): Promise<CompleteLeadRecord> {
    if (!payload.date || !payload.time) {
      throw new Error('Both Date and Time are required to schedule a follow-up.');
    }
    if (!payload.remark || !payload.remark.trim()) {
      throw new Error('Follow-up remark is required.');
    }

    const isoDateTime = combineDateAndTime(payload.date, payload.time);
    const remark = payload.remark.trim();
    const note = payload.note?.trim() || '';

    // 1. Update lead record in database
    const updatedLead = await this.updateLead(leadId, {
      nextFollowUpAt: isoDateTime,
      nextFollowUpRemark: remark,
      nextFollowUpNote: note || undefined,
      nextAction: remark
    });

    // 2. Add audit activity log
    const formattedDt = formatFollowUpDateTime(isoDateTime);
    await this.addActivity(leadId, {
      type: 'follow_up_scheduled',
      description: `Follow-Up Scheduled: ${remark}${note ? ` — ${note}` : ''} (${formattedDt})`,
      actor: payload.actor || updatedLead.qualification.assignedTo || 'Growth Partner',
      metadata: {
        nextFollowUpAt: isoDateTime,
        remark,
        note: note || undefined
      }
    });

    return updatedLead;
  }

  /**
   * ADM-09: Re-schedules an existing follow-up for a lead.
   * Records previous schedule and new schedule in an auditable activity history entry,
   * updates next_follow_up_at, and refreshes confirmed database state.
   */
  public async rescheduleFollowUp(
    leadId: string,
    payload: {
      previousFollowUpAt?: string;
      previousRemark?: string;
      date: string;
      time: string;
      remark: string;
      note?: string;
      actor?: string;
    }
  ): Promise<CompleteLeadRecord> {
    if (!payload.date || !payload.time) {
      throw new Error('Both New Date and New Time are required to reschedule a follow-up.');
    }
    if (!payload.remark || !payload.remark.trim()) {
      throw new Error('Reschedule reason/remark is required.');
    }

    const newIsoDateTime = combineDateAndTime(payload.date, payload.time);
    const remark = payload.remark.trim();
    const note = payload.note?.trim() || '';

    // 1. Update lead record in database
    const updatedLead = await this.updateLead(leadId, {
      nextFollowUpAt: newIsoDateTime,
      nextFollowUpRemark: remark,
      nextFollowUpNote: note || undefined,
      nextAction: remark
    });

    // 2. Add single auditable reschedule activity entry
    const prevFormatted = payload.previousFollowUpAt ? formatFollowUpDateTime(payload.previousFollowUpAt) : 'None';
    const newFormatted = formatFollowUpDateTime(newIsoDateTime);

    await this.addActivity(leadId, {
      type: 'follow_up',
      description: `Follow-Up Re-scheduled to ${newFormatted}. Reason: ${remark}${note ? ` (${note})` : ''} [Previous: ${prevFormatted}]`,
      actor: payload.actor || updatedLead.qualification.assignedTo || 'Growth Partner',
      metadata: {
        previousFollowUpAt: payload.previousFollowUpAt || undefined,
        previousRemark: payload.previousRemark || undefined,
        nextFollowUpAt: newIsoDateTime,
        remark,
        note: note || undefined
      }
    });

    return updatedLead;
  }

  /**
   * ADM-09: Cancels currently scheduled follow-up.
   * Sets next_follow_up_at = null, preserves past history, and records activity.
   */
  public async cancelFollowUp(
    leadId: string,
    previousFollowUpAt?: string,
    actor?: string
  ): Promise<CompleteLeadRecord> {
    const updatedLead = await this.updateLead(leadId, {
      nextFollowUpAt: null as any,
      nextFollowUpRemark: null as any,
      nextFollowUpNote: null as any
    });

    const prevFormatted = previousFollowUpAt ? formatFollowUpDateTime(previousFollowUpAt) : 'Scheduled Date';
    await this.addActivity(leadId, {
      type: 'note',
      description: `Follow-Up Cancelled (was scheduled for ${prevFormatted}). Lead moved to Unscheduled.`,
      actor: actor || updatedLead.qualification.assignedTo || 'Growth Partner',
      metadata: {
        cancelledFollowUpAt: previousFollowUpAt || undefined
      }
    });

    return updatedLead;
  }

  /**
   * ADM-09 / ADM-10A: Marks lead contacted immediately.
   * Updates last_contacted_at, advances stage to CONTACTED if currently NEW. Persists.
   */
  public async markContacted(
    leadId: string,
    actor?: string
  ): Promise<CompleteLeadRecord> {
    const nowIso = new Date().toISOString();
    const existing = this.cachedLeads.find(l => l.leadId === leadId);
    const updates: any = {
      lastContactedAt: nowIso
    };
    const shouldAdvance = existing && (existing.status === 'new' || existing.qualification.opportunityStage === 'new');
    if (shouldAdvance) {
      updates.status = 'contacted';
      updates.opportunityStage = 'contacted';
    }

    const updatedLead = await this.updateLead(leadId, updates);

    await this.addActivity(leadId, {
      type: 'contacted',
      description: `Growth Partner recorded direct outreach / contact made with lead.${shouldAdvance ? ' Advanced stage from NEW to CONTACTED.' : ''}`,
      actor: actor || updatedLead.qualification.assignedTo || 'Growth Partner',
      metadata: {
        contactedAt: nowIso,
        stageAdvanced: Boolean(shouldAdvance)
      }
    });

    return updatedLead;
  }

  /**
   * ADM-09: Manually creates a new lead inside the Admin CRM.
   * Enters the canonical pipeline at stage "new".
   * Supports duplicate email warning check, optional initial follow-up, and audit history.
   */
  public async createManualLead(input: ManualLeadInput): Promise<CompleteLeadRecord> {
    // 1. Validation
    if (!input.contactName?.trim()) throw new Error('Contact Name is required.');
    if (!input.email?.trim() || !input.email.includes('@')) throw new Error('A valid Email address is required.');
    if (!input.phone?.trim()) throw new Error('Phone Number is required.');
    if (!input.organizationName?.trim()) throw new Error('Organization Name is required.');

    const timestamp = new Date().toISOString();
    const sanitizedEmail = input.email.toLowerCase().trim();
    const sanitizedName = input.contactName.trim();

    let initialFollowUpIso: string | undefined = undefined;
    if (input.nextFollowUpDate && input.nextFollowUpTime) {
      initialFollowUpIso = combineDateAndTime(input.nextFollowUpDate, input.nextFollowUpTime);
    }

    const payload: Record<string, any> = {
      name: sanitizedName,
      contact_name: sanitizedName,
      email: sanitizedEmail,
      phone: input.phone.trim(),
      organization: input.organizationName.trim(),
      organization_name: input.organizationName.trim(),
      website: input.website?.trim() || '',
      location: input.location?.trim() || '',
      healthcare_category: input.healthcareCategory?.trim() || '',
      biggest_challenge: input.biggestChallenge?.trim() || '',
      growth_objective: input.growthObjective?.trim() || '',
      status: 'new',
      stage_entered_at: timestamp,
      stage_changed_at: timestamp,
      lead_type: 'contact_enquiry',
      utm_source: 'admin_manual',
      created_at: timestamp,
      updated_at: timestamp
    };

    if (input.estimatedOpportunityValue) {
      payload.estimated_opportunity_value = input.estimatedOpportunityValue;
    }
    if (input.currency) {
      payload.currency = input.currency;
    }
    if (input.assignedTo) {
      const trimmed = input.assignedTo.trim();
      if (trimmed && isValidUuid(trimmed)) {
        payload.assigned_to = trimmed;
      }
    }
    if (input.leadPriority) {
      payload.lead_priority = input.leadPriority;
    }
    if (input.nextAction) {
      payload.next_action = input.nextAction.trim();
    }
    if (input.internalNotes) {
      payload.internal_notes = input.internalNotes.trim();
    }
    if (initialFollowUpIso) {
      payload.next_follow_up_at = initialFollowUpIso;
      if (input.nextFollowUpRemark) {
        payload.next_follow_up_remark = input.nextFollowUpRemark.trim();
      }
    }

    let createdRecord: CompleteLeadRecord;

    if (supabase) {
      let data: any = null;
      let insertError: any = null;

      const res = await supabase
        .from('leads')
        .insert(payload)
        .select('*')
        .single();

      if (res.error) {
        // If optional extended columns fail on remote (code 42703 / column not found), retry with base schema columns
        if (res.error.message?.includes('column') || (res.error as any).code === '42703') {
          console.warn('[AdminLeadsService] Retrying lead creation with canonical base columns:', res.error.message);
          const basePayload: Record<string, any> = {
            name: sanitizedName,
            contact_name: sanitizedName,
            email: sanitizedEmail,
            phone: input.phone.trim(),
            organization: input.organizationName.trim(),
            organization_name: input.organizationName.trim(),
            website: input.website?.trim() || '',
            location: input.location?.trim() || '',
            healthcare_category: input.healthcareCategory?.trim() || '',
            biggest_challenge: input.biggestChallenge?.trim() || '',
            growth_objective: input.growthObjective?.trim() || '',
            status: 'new',
            lead_type: 'contact_enquiry',
            utm_source: 'admin_manual',
            created_at: timestamp,
            updated_at: timestamp
          };
          if (initialFollowUpIso) {
            basePayload.next_follow_up_at = initialFollowUpIso;
          }

          const fallbackRes = await supabase
            .from('leads')
            .insert(basePayload)
            .select('*')
            .single();

          if (fallbackRes.error) {
            insertError = fallbackRes.error;
          } else {
            data = fallbackRes.data;
          }
        } else if (res.error.message?.includes('policy') || (res.error as any).code === '42501') {
          // Table RLS insert denied for this role; use submit_public_lead RPC (SECURITY DEFINER)
          console.warn('[AdminLeadsService] Table insert denied by policy; attempting submit_public_lead RPC:', res.error.message);
          try {
            const rpcRecord = {
              name: sanitizedName,
              contact_name: sanitizedName,
              email: sanitizedEmail,
              phone: input.phone.trim(),
              organization_name: input.organizationName.trim(),
              website: input.website?.trim() || '',
              location: input.location?.trim() || '',
              healthcare_category: input.healthcareCategory?.trim() || '',
              biggest_challenge: input.biggestChallenge?.trim() || '',
              growth_objective: input.growthObjective?.trim() || '',
              lead_type: 'contact_enquiry',
              utm_source: 'admin_manual',
              created_at: timestamp,
              updated_at: timestamp
            };
            let rpcRes = await supabase.rpc('submit_public_lead', { payload: rpcRecord });
            if (rpcRes.error && (rpcRes.error.message?.includes('payload') || rpcRes.error.code === '42883')) {
              rpcRes = await supabase.rpc('submit_public_lead', { lead_data: rpcRecord });
            }
            if (!rpcRes.error && rpcRes.data) {
              const rpcData = rpcRes.data;
              const returnedId = (rpcData && typeof rpcData === 'object' && 'id' in rpcData)
                ? String((rpcData as any).id)
                : String(rpcData);
              if (isValidUuid(returnedId)) {
                const fetchRes = await supabase.from('leads').select('*').eq('id', returnedId).single();
                if (fetchRes.data) {
                  data = fetchRes.data;
                  insertError = null;
                }
              }
            } else {
              insertError = rpcRes.error || res.error;
            }
          } catch (rpcErr: any) {
            insertError = rpcErr || res.error;
          }
        } else {
          insertError = res.error;
        }
      } else {
        data = res.data;
      }

      if (insertError || !data) {
        const errorMsg = insertError?.message || 'Database insert returned no row';
        console.error('[AdminLeadsService] Database lead creation failed:', errorMsg);
        throw new Error(`Database lead creation failed: ${errorMsg}`);
      }

      // Confirmed database row returned by Supabase with its genuine database UUID
      createdRecord = this.mapRowToCompleteLeadRecord(data);
    } else {
      // Offline/mock development mode: use a valid RFC 4122 UUID v4
      const localUuid = generateUuid();
      createdRecord = this.mapRowToCompleteLeadRecord({ ...payload, id: localUuid });
    }

    // Apply manual qualification attributes
    createdRecord.updatedAt = timestamp;
    createdRecord.qualification.derivedLeadSource = 'admin_manual';
    createdRecord.qualification.opportunityStage = 'new';
    createdRecord.qualification.stageProbability = 0.05;
    createdRecord.qualification.stageEnteredAt = timestamp;
    createdRecord.qualification.stageChangedAt = timestamp;

    if (typeof input.estimatedOpportunityValue === 'number') {
      createdRecord.qualification.estimatedOpportunityValue = input.estimatedOpportunityValue;
      createdRecord.qualification.weightedPipelineValue = Math.round(input.estimatedOpportunityValue * 0.05);
    }
    if (input.currency) createdRecord.qualification.currency = input.currency;
    if (input.assignedTo) createdRecord.qualification.assignedTo = input.assignedTo;
    if (input.leadPriority) createdRecord.qualification.leadPriority = input.leadPriority;
    if (input.nextAction) createdRecord.qualification.nextAction = input.nextAction;
    if (input.internalNotes) createdRecord.qualification.internalNotes = input.internalNotes;
    if (initialFollowUpIso) {
      createdRecord.qualification.nextFollowUpAt = initialFollowUpIso;
      createdRecord.qualification.nextFollowUpRemark = input.nextFollowUpRemark || 'Initial Follow-Up';
    }

    // Add to cached leads at position 0
    this.cachedLeads = [createdRecord, ...this.cachedLeads.filter(l => l.leadId !== createdRecord.leadId)];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mk_leads_cache_v2', JSON.stringify(this.cachedLeads));
      }
    } catch (_) {}

    // Notify subscribers
    this.leadListeners.forEach((l) => {
      try { l(this.cachedLeads); } catch (_) {}
    });

    // Record creation activity (ADM-10: lead_created type with source = admin_manual)
    await this.addActivity(createdRecord.leadId, {
      type: 'lead_created',
      description: 'Lead manually registered by Admin in CRM workspace.',
      actor: input.assignedTo || 'Growth Partner',
      metadata: { source: 'admin_manual' }
    });

    if (initialFollowUpIso) {
      const formattedDt = formatFollowUpDateTime(initialFollowUpIso);
      await this.addActivity(createdRecord.leadId, {
        type: 'follow_up_scheduled',
        description: `Follow-Up Scheduled: ${input.nextFollowUpRemark || 'Initial Follow-Up'} (${formattedDt})`,
        actor: input.assignedTo || 'Growth Partner',
        metadata: {
          nextFollowUpAt: initialFollowUpIso,
          remark: input.nextFollowUpRemark || 'Initial Follow-Up'
        }
      });
    }

    return createdRecord;
  }

  /**
   * Helper to detect duplicate lead by email, phone, or organization + contact.
   */
  public checkDuplicateLead(params: {
    email?: string;
    phone?: string;
    contactName?: string;
    organizationName?: string;
  }): CompleteLeadRecord | null {
    const emailClean = (params.email || '').toLowerCase().trim();
    const phoneDigits = (params.phone || '').replace(/\D/g, '');
    const contactClean = (params.contactName || '').toLowerCase().trim();
    const orgClean = (params.organizationName || '').toLowerCase().trim();

    return this.cachedLeads.find((l) => {
      // 1. Email check (exact match)
      if (emailClean && emailClean.includes('@')) {
        const leadEmail = (l.visitorData.email || '').toLowerCase().trim();
        if (leadEmail && leadEmail === emailClean) return true;
      }
      // 2. Phone check (numeric digits match with minimum 7 digits)
      if (phoneDigits && phoneDigits.length >= 7) {
        const leadPhoneDigits = (l.visitorData.phone || '').replace(/\D/g, '');
        if (leadPhoneDigits && leadPhoneDigits.length >= 7) {
          if (leadPhoneDigits.endsWith(phoneDigits) || phoneDigits.endsWith(leadPhoneDigits)) {
            return true;
          }
        }
      }
      // 3. Organization + Contact Name check
      if (contactClean && orgClean && contactClean.length > 2 && orgClean.length > 2) {
        const leadContact = (l.visitorData.contactName || '').toLowerCase().trim();
        const leadOrg = (l.visitorData.organizationName || '').toLowerCase().trim();
        if (leadContact === contactClean && leadOrg === orgClean) {
          return true;
        }
      }
      return false;
    }) || null;
  }

  /**
   * Helper to detect duplicate email among existing leads.
   */
  public checkDuplicateEmail(email: string): CompleteLeadRecord | null {
    return this.checkDuplicateLead({ email });
  }

  /**
   * ADM-07: Canonical pipeline stage transition for an authenticated admin.
   * Validates target stage against VALID_PIPELINE_STAGES, writes status: newStage to public.leads,
   * verifies database write return, updates local cache, and notifies all active UI subscribers.
   */
  public async updateLeadStage(leadId: string, newStage: string): Promise<CompleteLeadRecord> {
    if (!leadId) {
      throw new Error('Lead ID is required for pipeline stage update.');
    }
    const normalized = String(newStage || '').toLowerCase().trim();
    if (!VALID_PIPELINE_STAGES.includes(normalized as any)) {
      throw new Error(
        `Invalid pipeline stage "${newStage}". Valid stages are: ${VALID_PIPELINE_STAGES.join(', ')}`
      );
    }
    return this.updateLead(leadId, {
      status: normalized as ValidPipelineStage,
      opportunityStage: normalized as OpportunityStage
    });
  }

  /**
   * Adapts a raw Supabase database row (snake_case) or record
   * into the standard LeadActivity domain model expected by all Admin CRM components.
   */
  public mapRowToLeadActivity(row: Record<string, any>): LeadActivity {
    return {
      id: String(row.id || ''),
      type: (row.type as LeadActivity['type']) || 'note_added',
      description: String(row.description || ''),
      actor: String(row.actor || 'Growth Partner'),
      timestamp: row.created_at || row.timestamp || new Date().toISOString(),
      metadata: row.metadata && typeof row.metadata === 'object' ? row.metadata : undefined
    };
  }

  private notifyLocalActivityListeners(leadId: string, activity: LeadActivity): void {
    const listeners = this.activeActivityListeners.get(leadId);
    if (listeners && listeners.size > 0) {
      listeners.forEach((listener) => {
        try {
          listener(activity);
        } catch (_) {}
      });
    }
  }

  /**
   * Logs an activity to Supabase public.lead_activities table.
   * Preserves leadId, type, description, actor, created_at, and metadata.
   */
  public async addActivity(leadId: string, activity: Omit<LeadActivity, 'id' | 'timestamp'>): Promise<void> {
    if (!supabase) {
      console.warn('[AdminLeadsService] Supabase client is not configured; cannot record activity.');
      return;
    }

    if (!isValidUuid(leadId)) {
      console.warn(`[AdminLeadsService] Cannot persist activity for non-UUID leadId "${leadId}" to database.`);
      const mockActivity: LeadActivity = {
        id: generateUuid(),
        type: activity.type,
        description: activity.description,
        actor: activity.actor || 'Growth Partner',
        timestamp: new Date().toISOString(),
        metadata: activity.metadata
      };
      this.notifyLocalActivityListeners(leadId, mockActivity);
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const insertPayload = {
        lead_id: leadId,
        type: activity.type,
        description: activity.description,
        actor: activity.actor || 'Growth Partner',
        created_at: timestamp,
        metadata: activity.metadata || {}
      };

      const { data, error } = await supabase
        .from('lead_activities')
        .insert(insertPayload)
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('[AdminLeadsService] Failed to record activity in Supabase:', error.message);
      } else if (data) {
        // Immediate local dispatch to active lead listeners (with duplicate protection)
        const mapped = this.mapRowToLeadActivity(data);
        this.notifyLocalActivityListeners(leadId, mapped);
      }
    } catch (e: any) {
      console.warn('[AdminLeadsService] Failed to record activity:', e?.message || e);
    }
  }

  /**
   * Subscribes to lead activities from Supabase PostgreSQL + Realtime.
   * Loads initial activities using order('created_at', { ascending: false })
   * and listens for real-time changes (INSERT, UPDATE, DELETE) on public.lead_activities.
   */
  public subscribeToActivities(
    leadId: string,
    onData: (activities: LeadActivity[]) => void,
    onError: (err: string) => void
  ): Unsubscribe {
    if (!supabase) {
      onError('Supabase client is not configured.');
      return () => {};
    }

    let localActivities: LeadActivity[] = [];
    let isDisposed = false;
    let channel: RealtimeChannel | null = null;

    const emitSorted = () => {
      if (isDisposed) return;
      // Stable descending sort: newest activities first, matching existing timeline view
      const sorted = [...localActivities].sort((a, b) => {
        const timeDiff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (timeDiff !== 0) return timeDiff;
        return (b.id || '').localeCompare(a.id || '');
      });
      onData(sorted);
    };

    // Internal listener for instant local optimistic updates from this client
    const handleLocalActivity = (act: LeadActivity) => {
      if (isDisposed) return;
      const existingIdx = localActivities.findIndex((a) => a.id === act.id);
      if (existingIdx >= 0) {
        localActivities[existingIdx] = act;
      } else {
        localActivities.push(act);
      }
      emitSorted();
    };

    if (!this.activeActivityListeners.has(leadId)) {
      this.activeActivityListeners.set(leadId, new Set());
    }
    this.activeActivityListeners.get(leadId)!.add(handleLocalActivity);

    // 1. Initial query from Supabase public.lead_activities
    (async () => {
      try {
        const { data, error } = await supabase
          .from('lead_activities')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false });

        if (isDisposed) return;
        if (error) {
          console.warn('[AdminLeadsService] Initial lead_activities query note:', error.message);
          onError(error.message);
          return;
        }

        if (data) {
          const fetched = data.map((row) => this.mapRowToLeadActivity(row));
          const activityMap = new Map<string, LeadActivity>();

          // Merge with any items that might have already arrived in memory
          localActivities.forEach((act) => {
            if (act.id) activityMap.set(act.id, act);
          });
          fetched.forEach((act) => {
            if (act.id) activityMap.set(act.id, act);
          });

          localActivities = Array.from(activityMap.values());
          emitSorted();
        }
      } catch (err: any) {
        if (!isDisposed) {
          console.warn('[AdminLeadsService] Activities fetch error:', err);
          onError(err?.message || 'Failed to fetch lead activities');
        }
      }
    })();

    // 2. Real-time subscription to public.lead_activities for this lead
    const channelName = `activities-lead-${leadId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_activities',
          filter: `lead_id=eq.${leadId}`
        },
        (payload) => {
          if (isDisposed) return;

          if (payload.eventType === 'INSERT') {
            const newAct = this.mapRowToLeadActivity(payload.new);
            // Duplicate protection: verify activity ID is not already present
            const existingIdx = localActivities.findIndex((a) => a.id === newAct.id);
            if (existingIdx >= 0) {
              localActivities[existingIdx] = newAct;
            } else {
              localActivities.push(newAct);
            }
            emitSorted();
          } else if (payload.eventType === 'UPDATE') {
            const updatedAct = this.mapRowToLeadActivity(payload.new);
            const existingIdx = localActivities.findIndex((a) => a.id === updatedAct.id);
            if (existingIdx >= 0) {
              localActivities[existingIdx] = updatedAct;
            } else {
              localActivities.push(updatedAct);
            }
            emitSorted();
          } else if (payload.eventType === 'DELETE') {
            const deletedId = String(payload.old?.id || '');
            if (deletedId) {
              localActivities = localActivities.filter((a) => a.id !== deletedId);
              emitSorted();
            }
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' && err) {
          console.warn('[AdminLeadsService] Realtime channel status note:', err);
        }
      });

    // 3. Subscription cleanup
    return () => {
      isDisposed = true;
      const listeners = this.activeActivityListeners.get(leadId);
      if (listeners) {
        listeners.delete(handleLocalActivity);
        if (listeners.size === 0) {
          this.activeActivityListeners.delete(leadId);
        }
      }
      if (channel && supabase) {
        Promise.resolve(supabase.removeChannel(channel)).catch((err) => {
          console.warn('[AdminLeadsService] Cleanup removing realtime channel warning:', err);
        });
      }
    };
  }
}

export const adminLeadsService = new AdminLeadsService();
