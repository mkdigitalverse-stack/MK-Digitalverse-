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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        if (!user) {
          callback(null, false);
        } else {
          const adminUser = formatAdminUser(user);
          const isAdmin = await this.checkAdminPermission(user);
          callback(adminUser, isAdmin);
        }
      }
    );

    return () => {
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
      ? `${window.location.origin}${window.location.pathname}`
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

    const rawOppCandidate = raw.opportunity_stage ?? raw.opportunityStage ?? raw.stage ?? raw.status;
    const normalizedStage = typeof rawOppCandidate === 'string'
      ? rawOppCandidate.toLowerCase().trim()
      : '';
    const VALID_STAGES: OpportunityStage[] = ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost'];
    const opportunityStage: OpportunityStage = VALID_STAGES.includes(normalizedStage as OpportunityStage)
      ? (normalizedStage as OpportunityStage)
      : 'new';

    const estValRaw = raw.estimated_opportunity_value ?? raw.estimatedOpportunityValue;
    const estVal = typeof estValRaw === 'number' ? estValRaw : (estValRaw !== undefined && estValRaw !== null && !isNaN(Number(estValRaw)) ? Number(estValRaw) : undefined);

    const rawProb = raw.stage_probability ?? raw.stageProbability;
    const prob = typeof rawProb === 'number'
      ? rawProb
      : (rawProb !== undefined && rawProb !== null && !isNaN(Number(rawProb))
          ? Number(rawProb)
          : (STAGE_PROBABILITIES[opportunityStage] ?? 0.05));

    const rawWeighted = raw.weighted_pipeline_value ?? raw.weightedPipelineValue;
    const weightedVal = typeof rawWeighted === 'number' 
      ? rawWeighted 
      : (rawWeighted !== undefined && rawWeighted !== null && !isNaN(Number(rawWeighted))
          ? Number(rawWeighted)
          : (estVal !== undefined ? Math.round(estVal * prob) : undefined));

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

    const rawStatusNormalized = typeof raw.status === 'string' ? raw.status.toLowerCase().trim() : '';
    const VALID_STATUSES: CompleteLeadRecord['status'][] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
    const status: CompleteLeadRecord['status'] = VALID_STATUSES.includes(rawStatusNormalized as CompleteLeadRecord['status'])
      ? (rawStatusNormalized as CompleteLeadRecord['status'])
      : (VALID_STATUSES.includes(opportunityStage as any) ? (opportunityStage as CompleteLeadRecord['status']) : 'new');

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
  ): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const timestamp = new Date().toISOString();
    const mappedPayload: Record<string, any> = {
      updated_at: timestamp
    };

    if (updates.status !== undefined) mappedPayload.status = updates.status;
    if (updates.fitStatus !== undefined) mappedPayload.fit_status = updates.fitStatus;
    if (updates.leadPriority !== undefined) mappedPayload.lead_priority = updates.leadPriority;
    if (updates.intentLevel !== undefined) mappedPayload.intent_level = updates.intentLevel;
    if (updates.growthStage !== undefined) mappedPayload.growth_stage = updates.growthStage;
    if (updates.assignedTo !== undefined) mappedPayload.assigned_to = updates.assignedTo;
    if (updates.nextFollowUpAt !== undefined) mappedPayload.next_follow_up_at = updates.nextFollowUpAt;
    if (updates.lastContactedAt !== undefined) mappedPayload.last_contacted_at = updates.lastContactedAt;
    if (updates.internalNotes !== undefined) mappedPayload.internal_notes = updates.internalNotes;
    if (updates.qualificationReviewedAt !== undefined) mappedPayload.qualification_reviewed_at = updates.qualificationReviewedAt;
    if (typeof updates.fitScore === 'number') mappedPayload.fit_score = updates.fitScore;

    // Normalize target stage if provided
    const targetStage: OpportunityStage | undefined = updates.opportunityStage
      ? (typeof updates.opportunityStage === 'string'
          ? (updates.opportunityStage as string).toLowerCase().trim() as OpportunityStage
          : updates.opportunityStage)
      : undefined;

    // F-06 Pipeline & Sales Updates
    if (targetStage !== undefined) {
      mappedPayload.opportunity_stage = targetStage;
      mappedPayload.stage_changed_at = timestamp;
      if (!updates.stageEnteredAt) {
        mappedPayload.stage_entered_at = timestamp;
      }
      const stageProb = updates.stageProbability ?? (STAGE_PROBABILITIES[targetStage] ?? 0.05);
      mappedPayload.stage_probability = stageProb;

      // Sync status with opportunity stage ensuring database constraints are respected
      if (['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].includes(targetStage)) {
        mappedPayload.status = targetStage;
      } else if (targetStage === 'discovery') {
        mappedPayload.status = 'qualified';
      } else if (targetStage === 'negotiation') {
        mappedPayload.status = 'proposal';
      }
    } else if (updates.status !== undefined) {
      const normalizedStatus = updates.status.toLowerCase().trim();
      if (['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].includes(normalizedStatus)) {
        mappedPayload.opportunity_stage = normalizedStatus;
      }
    }

    if (updates.estimatedOpportunityValue !== undefined) {
      mappedPayload.estimated_opportunity_value = updates.estimatedOpportunityValue;
      const prob = updates.stageProbability ?? (targetStage ? (STAGE_PROBABILITIES[targetStage] ?? 0.05) : 0.05);
      mappedPayload.weighted_pipeline_value = Math.round((updates.estimatedOpportunityValue || 0) * prob);
    }

    if (updates.currency !== undefined) mappedPayload.currency = updates.currency;
    if (updates.weightedPipelineValue !== undefined) mappedPayload.weighted_pipeline_value = updates.weightedPipelineValue;
    if (updates.stageProbability !== undefined) mappedPayload.stage_probability = updates.stageProbability;
    if (updates.stageEnteredAt !== undefined) mappedPayload.stage_entered_at = updates.stageEnteredAt;
    if (updates.stageChangedAt !== undefined) mappedPayload.stage_changed_at = updates.stageChangedAt;
    if (updates.nextAction !== undefined) mappedPayload.next_action = updates.nextAction;
    if (updates.lastUpdatedBy !== undefined) mappedPayload.last_updated_by = updates.lastUpdatedBy;

    if (updates.discoveryDate !== undefined) mappedPayload.discovery_date = updates.discoveryDate;
    if (updates.decisionMaker !== undefined) mappedPayload.decision_maker = updates.decisionMaker;
    if (updates.decisionTimeline !== undefined) mappedPayload.decision_timeline = updates.decisionTimeline;

    if (updates.proposalStatus !== undefined) mappedPayload.proposal_status = updates.proposalStatus;
    if (updates.proposalValue !== undefined) mappedPayload.proposal_value = updates.proposalValue;
    if (updates.proposalSentAt !== undefined) mappedPayload.proposal_sent_at = updates.proposalSentAt;
    if (updates.proposalFollowUpAt !== undefined) mappedPayload.proposal_follow_up_at = updates.proposalFollowUpAt;

    if (updates.negotiationStatus !== undefined) mappedPayload.negotiation_status = updates.negotiationStatus;
    if (updates.expectedDecisionDate !== undefined) mappedPayload.expected_decision_date = updates.expectedDecisionDate;
    if (updates.negotiationNotes !== undefined) mappedPayload.negotiation_notes = updates.negotiationNotes;

    if (updates.wonDate !== undefined) mappedPayload.won_date = updates.wonDate;
    if (updates.finalContractValue !== undefined) mappedPayload.final_contract_value = updates.finalContractValue;

    if (updates.lostDate !== undefined) mappedPayload.lost_date = updates.lostDate;
    if (updates.lostReason !== undefined) mappedPayload.lost_reason = updates.lostReason;
    if (updates.lostNotes !== undefined) mappedPayload.lost_notes = updates.lostNotes;

    try {
      const { error } = await supabase
        .from('leads')
        .update(mappedPayload)
        .eq('id', leadId);

      if (error) {
        console.error('[AdminLeadsService] Error updating lead in Supabase:', error.message);
        throw new Error(error.message);
      }

      // Optimistically update cached leads and notify listeners
      this.cachedLeads = this.cachedLeads.map((lead) => {
        if (lead.leadId === leadId) {
          const effectiveStage = targetStage || (updates.status && ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].includes(updates.status as OpportunityStage) ? (updates.status as OpportunityStage) : undefined) || lead.qualification.opportunityStage || 'new';
          const stageProb = updates.stageProbability ?? (STAGE_PROBABILITIES[effectiveStage] ?? 0.05);
          const estVal = typeof updates.estimatedOpportunityValue === 'number'
            ? updates.estimatedOpportunityValue
            : lead.qualification.estimatedOpportunityValue;
          const weightedVal = typeof updates.weightedPipelineValue === 'number'
            ? updates.weightedPipelineValue
            : (estVal !== undefined ? Math.round(estVal * stageProb) : undefined);

          let nextStatus: CompleteLeadRecord['status'] = lead.status;
          if (targetStage) {
            if (['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].includes(targetStage)) {
              nextStatus = targetStage as CompleteLeadRecord['status'];
            } else if (targetStage === 'discovery') {
              nextStatus = 'qualified';
            } else if (targetStage === 'negotiation') {
              nextStatus = 'proposal';
            }
          } else if (updates.status) {
            nextStatus = updates.status;
          }

          const updatedQual: InternalQualificationData = {
            ...lead.qualification,
            ...updates,
            opportunityStage: effectiveStage,
            stageProbability: stageProb,
            weightedPipelineValue: weightedVal,
            stageChangedAt: targetStage ? timestamp : (lead.qualification.stageChangedAt || timestamp),
            stageEnteredAt: updates.stageEnteredAt || lead.qualification.stageEnteredAt || timestamp
          };
          return {
            ...lead,
            status: nextStatus,
            updatedAt: timestamp,
            qualification: updatedQual
          };
        }
        return lead;
      });
      this.leadListeners.forEach((listener) => {
        try {
          listener(this.cachedLeads);
        } catch (_) {}
      });

      // Synchronize in background
      this.refreshLeads().catch(() => {});
    } catch (error: any) {
      console.error('[AdminLeadsService] Lead update exception:', error);
      throw error;
    }
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
