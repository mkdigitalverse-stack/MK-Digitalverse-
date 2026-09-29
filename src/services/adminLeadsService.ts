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
  STAGE_PROBABILITIES
} from './qualification';

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
    | 'won' 
    | 'lost' 
    | 'note' 
    | 'note_added' 
    | 'value_updated' 
    | 'status_change';
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, any>;
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

    const qualification: InternalQualificationData = {
      fitStatus: raw.fit_status ?? raw.fitStatus ?? defaultEval.fitStatus,
      leadPriority: raw.lead_priority ?? raw.leadPriority ?? defaultEval.leadPriority,
      intentLevel: raw.intent_level ?? raw.intentLevel ?? defaultEval.intentLevel,
      growthStage: raw.growth_stage ?? raw.growthStage ?? defaultEval.growthStage,
      healthcareCategoryNormalized: raw.healthcare_category_normalized ?? raw.healthcareCategoryNormalized ?? defaultEval.healthcareCategoryNormalized,
      challengeCategory: raw.challenge_category ?? raw.challengeCategory ?? defaultEval.challengeCategory,
      fitScore,
      derivedLeadSource: raw.derived_lead_source ?? raw.derivedLeadSource ?? defaultEval.derivedLeadSource,
      organizationSize: raw.organization_size ?? raw.organizationSize ?? undefined,
      locationsCount: raw.locations_count ?? raw.locationsCount ?? undefined,
      doctorCount: raw.doctor_count ?? raw.doctorCount ?? undefined,
      currentMarketingStatus: raw.current_marketing_status ?? raw.currentMarketingStatus ?? undefined,
      existingWebsite: raw.existing_website ?? raw.existingWebsite ?? undefined,
      currentLeadSource: raw.current_lead_source ?? raw.currentLeadSource ?? undefined,
      monthlyMarketingReadiness: raw.monthly_marketing_readiness ?? raw.monthlyMarketingReadiness ?? undefined,
      internalNotes: raw.internal_notes ?? raw.internalNotes ?? '',
      assignedTo: raw.assigned_to ?? raw.assignedTo ?? 'Unassigned',
      nextFollowUpAt: raw.next_follow_up_at ?? raw.nextFollowUpAt ?? undefined,
      lastContactedAt: raw.last_contacted_at ?? raw.lastContactedAt ?? undefined,
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

      const records: CompleteLeadRecord[] = (data || []).map((row) => this.mapRowToCompleteLeadRecord(row));
      this.cachedLeads = records;
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
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }

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

    const timestamp = new Date().toISOString();

    // 2. Map payload: public.leads.status is the SINGLE SOURCE OF TRUTH in the database.
    // Send ONLY real columns existing on public.leads.
    // DO NOT include opportunity_stage, stage_changed_at, stage_entered_at,
    // stage_probability, estimated_opportunity_value, or weighted_pipeline_value.
    const mappedPayload: Record<string, any> = {
      updated_at: timestamp
    };

    if (targetStage !== undefined) {
      // 1:1 mapping directly into public.leads.status
      mappedPayload.status = targetStage;
    }

    try {
      // 3. Execute UPDATE against the correct lead ID and verify row update with .select('*').single()
      const { data, error } = await supabase
        .from('leads')
        .update(mappedPayload)
        .eq('id', leadId)
        .select('*')
        .single();

      if (error) {
        console.error('[AdminLeadsService] Error updating lead in Supabase:', error.message);
        throw new Error(`Database update failed: ${error.message}`);
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
        updatedRecord.qualification.lastContactedAt = updates.lastContactedAt;
      }
      if (updates.nextFollowUpAt !== undefined) {
        updatedRecord.qualification.nextFollowUpAt = updates.nextFollowUpAt;
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

      // 5. Update cached leads and notify listeners
      this.cachedLeads = this.cachedLeads.map((lead) =>
        lead.leadId === leadId ? updatedRecord : lead
      );

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
