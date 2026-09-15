/**
 * Admin Lead Management Service
 * Handles authenticated admin workspace operations, real-time Firestore queries for /leads,
 * and updates to qualification / workflow fields.
 */

import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc,
  query, 
  orderBy, 
  getDoc 
} from 'firebase/firestore';
import { User as SupabaseUser } from '@supabase/supabase-js';

import { supabase, getSupabaseClient } from './supabase';
import { firebaseManager, OperationType, FirestoreErrorInfo } from './firebase';
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

  private formatFirestoreError(error: unknown, operationType: OperationType, path: string): string {
    const auth = firebaseManager.getAuth();
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth?.currentUser?.uid || null,
        email: auth?.currentUser?.email || null,
        emailVerified: auth?.currentUser?.emailVerified || null,
      },
      operationType,
      path
    };
    return JSON.stringify(errInfo);
  }

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

  /**
   * Real-time subscription to /leads collection for authorized admins.
   */
  public subscribeToLeads(
    onData: (leads: CompleteLeadRecord[]) => void,
    onError: (errorMessage: string) => void
  ): Unsubscribe {
    const db = firebaseManager.getDb();
    if (!db) {
      onError('Firestore database connection is unavailable.');
      return () => {};
    }

    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const records: CompleteLeadRecord[] = snapshot.docs.map((docSnap) => {
          const raw = docSnap.data();
          const leadId = docSnap.id;

          const visitorData: VisitorLeadData = {
            contactName: raw.contactName || 'Anonymous',
            email: raw.email || '',
            phone: raw.phone || '',
            organizationName: raw.organizationName || '',
            website: raw.website || '',
            location: raw.location || '',
            healthcareCategory: raw.healthcareCategory || '',
            biggestChallenge: raw.biggestChallenge || '',
            growthObjective: raw.growthObjective || '',
            investmentReadiness: raw.investmentReadiness || '',
            leadType: raw.leadType || 'contact_enquiry',
            utm_source: raw.utm_source || '',
            utm_medium: raw.utm_medium || '',
            utm_campaign: raw.utm_campaign || '',
            utm_content: raw.utm_content || '',
            utm_term: raw.utm_term || '',
            gclid: raw.gclid || '',
            fbclid: raw.fbclid || '',
            landingPage: raw.landingPage || '',
            referrer: raw.referrer || ''
          };

          // Evaluate default qualification on-the-fly if missing
          const defaultEval = QualificationEngine.evaluateLead(visitorData);

          const opportunityStage: OpportunityStage = (raw.opportunityStage && ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost'].includes(raw.opportunityStage))
            ? raw.opportunityStage
            : (raw.status && ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].includes(raw.status)) ? (raw.status as OpportunityStage) : 'new';

          const estVal = typeof raw.estimatedOpportunityValue === 'number' ? raw.estimatedOpportunityValue : undefined;
          const prob = typeof raw.stageProbability === 'number' ? raw.stageProbability : (STAGE_PROBABILITIES[opportunityStage] ?? 0.05);
          const weightedVal = typeof raw.weightedPipelineValue === 'number' 
            ? raw.weightedPipelineValue 
            : (estVal !== undefined ? Math.round(estVal * prob) : undefined);

          const qualification: InternalQualificationData = {
            fitStatus: raw.fitStatus || defaultEval.fitStatus,
            leadPriority: raw.leadPriority || defaultEval.leadPriority,
            intentLevel: raw.intentLevel || defaultEval.intentLevel,
            growthStage: raw.growthStage || defaultEval.growthStage,
            healthcareCategoryNormalized: raw.healthcareCategoryNormalized || defaultEval.healthcareCategoryNormalized,
            challengeCategory: raw.challengeCategory || defaultEval.challengeCategory,
            fitScore: typeof raw.fitScore === 'number' ? raw.fitScore : defaultEval.fitScore,
            derivedLeadSource: raw.derivedLeadSource || defaultEval.derivedLeadSource,
            organizationSize: raw.organizationSize || undefined,
            locationsCount: raw.locationsCount || undefined,
            doctorCount: raw.doctorCount || undefined,
            currentMarketingStatus: raw.currentMarketingStatus || undefined,
            existingWebsite: raw.existingWebsite || undefined,
            currentLeadSource: raw.currentLeadSource || undefined,
            monthlyMarketingReadiness: raw.monthlyMarketingReadiness || undefined,
            internalNotes: raw.internalNotes || '',
            assignedTo: raw.assignedTo || 'Unassigned',
            nextFollowUpAt: raw.nextFollowUpAt || undefined,
            lastContactedAt: raw.lastContactedAt || undefined,
            qualificationReviewedAt: raw.qualificationReviewedAt || undefined,
            opportunityStage,
            
            estimatedOpportunityValue: estVal,
            currency: raw.currency || 'USD',
            weightedPipelineValue: weightedVal,
            stageProbability: prob,
            stageEnteredAt: raw.stageEnteredAt || raw.createdAt,
            stageChangedAt: raw.stageChangedAt || raw.createdAt,
            nextAction: raw.nextAction || '',
            lastUpdatedBy: raw.lastUpdatedBy || '',

            discoveryDate: raw.discoveryDate || undefined,
            decisionMaker: raw.decisionMaker || undefined,
            decisionTimeline: raw.decisionTimeline || undefined,

            proposalStatus: raw.proposalStatus || 'not_started',
            proposalValue: typeof raw.proposalValue === 'number' ? raw.proposalValue : undefined,
            proposalSentAt: raw.proposalSentAt || undefined,
            proposalFollowUpAt: raw.proposalFollowUpAt || undefined,

            negotiationStatus: raw.negotiationStatus || undefined,
            expectedDecisionDate: raw.expectedDecisionDate || undefined,
            negotiationNotes: raw.negotiationNotes || undefined,

            wonDate: raw.wonDate || undefined,
            finalContractValue: typeof raw.finalContractValue === 'number' ? raw.finalContractValue : undefined,

            lostDate: raw.lostDate || undefined,
            lostReason: raw.lostReason || undefined,
            lostNotes: raw.lostNotes || undefined
          };

          return {
            leadId,
            status: raw.status || 'new',
            createdAt: raw.createdAt || new Date().toISOString(),
            updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
            notificationStatus: raw.notificationStatus,
            visitorData,
            qualification
          };
        });

        onData(records);
      },
      (error) => {
        const formattedErr = this.formatFirestoreError(error, OperationType.LIST, 'leads');
        onError(formattedErr);
      }
    );
  }

  /**
   * Updates lead qualification, priority, status, pipeline, and internal sales notes.
   */
  public async updateLead(
    leadId: string,
    updates: Partial<InternalQualificationData> & { status?: CompleteLeadRecord['status'] }
  ): Promise<void> {
    const db = firebaseManager.getDb();
    if (!db) {
      throw new Error('Firestore database is not connected.');
    }

    const leadRef = doc(db, 'leads', leadId);
    const timestamp = new Date().toISOString();

    const payload: Record<string, any> = {
      updatedAt: timestamp
    };

    if (updates.status) payload.status = updates.status;
    if (updates.fitStatus) payload.fitStatus = updates.fitStatus;
    if (updates.leadPriority) payload.leadPriority = updates.leadPriority;
    if (updates.intentLevel) payload.intentLevel = updates.intentLevel;
    if (updates.growthStage) payload.growthStage = updates.growthStage;
    if (updates.assignedTo !== undefined) payload.assignedTo = updates.assignedTo;
    if (updates.nextFollowUpAt !== undefined) payload.nextFollowUpAt = updates.nextFollowUpAt;
    if (updates.lastContactedAt !== undefined) payload.lastContactedAt = updates.lastContactedAt;
    if (updates.internalNotes !== undefined) payload.internalNotes = updates.internalNotes;
    if (updates.qualificationReviewedAt !== undefined) payload.qualificationReviewedAt = updates.qualificationReviewedAt;
    if (typeof updates.fitScore === 'number') payload.fitScore = updates.fitScore;

    // F-06 Pipeline & Sales Updates
    if (updates.opportunityStage !== undefined) {
      payload.opportunityStage = updates.opportunityStage;
      payload.stageChangedAt = timestamp;
      if (!updates.stageEnteredAt) {
        payload.stageEnteredAt = timestamp;
      }
      const stageProb = STAGE_PROBABILITIES[updates.opportunityStage] ?? 0.05;
      payload.stageProbability = stageProb;

      // Sync status with opportunity stage if applicable
      if (['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].includes(updates.opportunityStage)) {
        payload.status = updates.opportunityStage;
      }
    }

    if (updates.estimatedOpportunityValue !== undefined) {
      payload.estimatedOpportunityValue = updates.estimatedOpportunityValue;
      const prob = updates.stageProbability ?? (updates.opportunityStage ? (STAGE_PROBABILITIES[updates.opportunityStage] ?? 0.05) : 0.05);
      payload.weightedPipelineValue = Math.round((updates.estimatedOpportunityValue || 0) * prob);
    }

    if (updates.currency !== undefined) payload.currency = updates.currency;
    if (updates.weightedPipelineValue !== undefined) payload.weightedPipelineValue = updates.weightedPipelineValue;
    if (updates.stageProbability !== undefined) payload.stageProbability = updates.stageProbability;
    if (updates.stageEnteredAt !== undefined) payload.stageEnteredAt = updates.stageEnteredAt;
    if (updates.stageChangedAt !== undefined) payload.stageChangedAt = updates.stageChangedAt;
    if (updates.nextAction !== undefined) payload.nextAction = updates.nextAction;
    if (updates.lastUpdatedBy !== undefined) payload.lastUpdatedBy = updates.lastUpdatedBy;

    if (updates.discoveryDate !== undefined) payload.discoveryDate = updates.discoveryDate;
    if (updates.decisionMaker !== undefined) payload.decisionMaker = updates.decisionMaker;
    if (updates.decisionTimeline !== undefined) payload.decisionTimeline = updates.decisionTimeline;

    if (updates.proposalStatus !== undefined) payload.proposalStatus = updates.proposalStatus;
    if (updates.proposalValue !== undefined) payload.proposalValue = updates.proposalValue;
    if (updates.proposalSentAt !== undefined) payload.proposalSentAt = updates.proposalSentAt;
    if (updates.proposalFollowUpAt !== undefined) payload.proposalFollowUpAt = updates.proposalFollowUpAt;

    if (updates.negotiationStatus !== undefined) payload.negotiationStatus = updates.negotiationStatus;
    if (updates.expectedDecisionDate !== undefined) payload.expectedDecisionDate = updates.expectedDecisionDate;
    if (updates.negotiationNotes !== undefined) payload.negotiationNotes = updates.negotiationNotes;

    if (updates.wonDate !== undefined) payload.wonDate = updates.wonDate;
    if (updates.finalContractValue !== undefined) payload.finalContractValue = updates.finalContractValue;

    if (updates.lostDate !== undefined) payload.lostDate = updates.lostDate;
    if (updates.lostReason !== undefined) payload.lostReason = updates.lostReason;
    if (updates.lostNotes !== undefined) payload.lostNotes = updates.lostNotes;

    try {
      await updateDoc(leadRef, payload);
    } catch (error) {
      const errStr = this.formatFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
      throw new Error(errStr);
    }
  }

  /**
   * Logs an activity to the lead's subcollection /leads/{leadId}/activities
   */
  public async addActivity(leadId: string, activity: Omit<LeadActivity, 'id' | 'timestamp'>): Promise<void> {
    const db = firebaseManager.getDb();
    if (!db) return;

    try {
      const activitiesRef = collection(db, 'leads', leadId, 'activities');
      const timestamp = new Date().toISOString();
      await addDoc(activitiesRef, {
        ...activity,
        timestamp
      });
    } catch (e) {
      console.warn('[AdminLeadsService] Failed to record activity:', e);
    }
  }

  /**
   * Subscribes to lead activity subcollection /leads/{leadId}/activities
   */
  public subscribeToActivities(
    leadId: string,
    onData: (activities: LeadActivity[]) => void,
    onError: (err: string) => void
  ): Unsubscribe {
    const db = firebaseManager.getDb();
    if (!db) {
      onError('Database not initialized');
      return () => {};
    }

    const activitiesRef = collection(db, 'leads', leadId, 'activities');
    const q = query(activitiesRef, orderBy('timestamp', 'desc'));

    return onSnapshot(
      q,
      (snap) => {
        const activities: LeadActivity[] = snap.docs.map(docSnap => ({
          id: docSnap.id,
          type: docSnap.data().type || 'note_added',
          description: docSnap.data().description || '',
          actor: docSnap.data().actor || 'Growth Partner',
          timestamp: docSnap.data().timestamp || new Date().toISOString(),
          metadata: docSnap.data().metadata
        }));
        onData(activities);
      },
      (error) => {
        onError(error.message);
      }
    );
  }
}

export const adminLeadsService = new AdminLeadsService();
