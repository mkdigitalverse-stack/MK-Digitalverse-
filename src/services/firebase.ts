import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, collection, doc, setDoc, getDocFromServer } from 'firebase/firestore';
import defaultFirebaseConfig from '../../firebase-applet-config.json';

export type LeadType = 'growth_audit' | 'discovery_call' | 'contact_enquiry';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export interface LeadSubmission {
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
  // Attribution fields
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

export interface NewsletterSubmission {
  email: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

class FirebaseManager {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private auth: Auth | null = null;
  private isInitialized: boolean = false;
  private initError: string | null = null;
  private lastSubmissionTimes: Map<string, number> = new Map();

  constructor() {
    this.initLazy();
  }

  private initLazy() {
    try {
      const baseConfig = (defaultFirebaseConfig && typeof defaultFirebaseConfig === 'object') ? defaultFirebaseConfig as Record<string, any> : {};
      const windowConfig = (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__) ? (window as any).__FIREBASE_CONFIG__ : {};

      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || windowConfig.apiKey || baseConfig.apiKey;
      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || windowConfig.projectId || baseConfig.projectId || 'lucky-rarity-nx6pd';
      const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || windowConfig.authDomain || baseConfig.authDomain || `${projectId}.firebaseapp.com`;
      const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || windowConfig.storageBucket || baseConfig.storageBucket || `${projectId}.firebasestorage.app`;
      const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || windowConfig.messagingSenderId || baseConfig.messagingSenderId || '1057468511510';
      const appId = import.meta.env.VITE_FIREBASE_APP_ID || windowConfig.appId || baseConfig.appId || '1:1057468511510:web:d8af4f981113d0155e8c37';
      const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || windowConfig.firestoreDatabaseId || baseConfig.firestoreDatabaseId || 'ai-studio-mkdigitalverse-9b462cc3-c171-4ef9-aed1-5975fbff2307';

      const config = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        firestoreDatabaseId
      };

      if (config.apiKey && config.projectId) {
        if (!getApps().length) {
          this.app = initializeApp(config);
        } else {
          this.app = getApps()[0];
        }
        this.db = getFirestore(this.app, config.firestoreDatabaseId || undefined);
        this.auth = getAuth(this.app);
        this.isInitialized = true;
        this.initError = null;
        this.testConnection();
      } else {
        this.initError = 'Firebase configuration is missing. Please ensure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are set, or firebase-applet-config.json is present.';
        console.warn('[FirebaseManager]', this.initError);
      }
    } catch (err: any) {
      this.initError = err?.message || String(err);
      console.warn('[FirebaseManager] Firebase initialization note:', this.initError);
    }
  }

  private async testConnection() {
    if (!this.db) return;
    try {
      await getDocFromServer(doc(this.db, 'test', 'connection'));
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }

  public isReady(): boolean {
    return this.isInitialized && this.db !== null;
  }

  public getInitError(): string | null {
    return this.initError;
  }

  public isAuthConfigured(): boolean {
    return this.auth !== null;
  }

  public getDb(): Firestore | null {
    return this.db;
  }

  public getAuth(): Auth | null {
    return this.auth;
  }

  private handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: this.auth?.currentUser?.uid || null,
        email: this.auth?.currentUser?.email || null,
        emailVerified: this.auth?.currentUser?.emailVerified || null,
      },
      operationType,
      path
    };
    console.error('[Firestore Error]', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  /**
   * Persists a lead to Firestore /leads collection with local storage fallback.
   */
  public async submitLead(payload: LeadSubmission): Promise<{ success: boolean; leadId: string; source: 'firestore' | 'offline_queue' }> {
    // 1. Sanitize input strings
    const sanitizedName = payload.contactName.trim().slice(0, 100);
    const sanitizedEmail = payload.email.trim().toLowerCase().slice(0, 120);
    
    // Cooldown check for duplicate submission (10 seconds)
    const now = Date.now();
    const lastTime = this.lastSubmissionTimes.get(sanitizedEmail) || 0;
    if (now - lastTime < 10000) {
      const existingId = `lead_${now}`;
      return { success: true, leadId: existingId, source: 'offline_queue' };
    }
    this.lastSubmissionTimes.set(sanitizedEmail, now);

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    const fullLeadData = {
      contactName: sanitizedName,
      email: sanitizedEmail,
      phone: payload.phone ? payload.phone.trim().slice(0, 30) : '',
      organizationName: payload.organizationName ? payload.organizationName.trim().slice(0, 120) : '',
      website: payload.website ? payload.website.trim().slice(0, 200) : '',
      location: payload.location ? payload.location.trim().slice(0, 100) : '',
      healthcareCategory: payload.healthcareCategory ? payload.healthcareCategory.trim().slice(0, 100) : '',
      biggestChallenge: payload.biggestChallenge ? payload.biggestChallenge.trim().slice(0, 1000) : '',
      growthObjective: payload.growthObjective ? payload.growthObjective.trim().slice(0, 1000) : '',
      investmentReadiness: payload.investmentReadiness ? payload.investmentReadiness.trim().slice(0, 100) : '',
      leadType: payload.leadType,
      status: 'new' as LeadStatus,
      utm_source: payload.utm_source || '',
      utm_medium: payload.utm_medium || '',
      utm_campaign: payload.utm_campaign || '',
      utm_content: payload.utm_content || '',
      utm_term: payload.utm_term || '',
      gclid: payload.gclid || '',
      fbclid: payload.fbclid || '',
      landingPage: payload.landingPage || '',
      referrer: payload.referrer || '',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Always preserve locally in local retry queue
    try {
      const existingQueue = JSON.parse(localStorage.getItem('mk_leads_queue') || '[]');
      existingQueue.push({ leadId, data: fullLeadData });
      localStorage.setItem('mk_leads_queue', JSON.stringify(existingQueue));
    } catch (e) {
      console.warn('[FirebaseManager] Local storage save note:', e);
    }

    // Write to Firestore if configured
    if (this.isReady() && this.db) {
      try {
        const leadRef = doc(this.db, 'leads', leadId);
        await setDoc(leadRef, fullLeadData);

        // Clear item from local queue on successful sync
        try {
          const queue = JSON.parse(localStorage.getItem('mk_leads_queue') || '[]');
          const updatedQueue = queue.filter((item: any) => item.leadId !== leadId);
          localStorage.setItem('mk_leads_queue', JSON.stringify(updatedQueue));
        } catch (_) {}

        // Trigger server-side notification worker asynchronously
        fetch('/api/notifications/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            leadType: fullLeadData.leadType,
            contactName: fullLeadData.contactName,
            organizationName: fullLeadData.organizationName,
            email: fullLeadData.email,
            phone: fullLeadData.phone,
            website: fullLeadData.website,
            healthcareCategory: fullLeadData.healthcareCategory,
            biggestChallenge: fullLeadData.biggestChallenge,
            growthObjective: fullLeadData.growthObjective,
            investmentReadiness: fullLeadData.investmentReadiness
          })
        }).catch(err => console.warn('[FirebaseManager] Async notification server call note:', err));

        return { success: true, leadId, source: 'firestore' };
      } catch (error) {
        console.warn('[FirebaseManager] Firestore lead save error, preserved in local queue:', error);
        return { success: true, leadId, source: 'offline_queue' };
      }
    }

    return { success: true, leadId, source: 'offline_queue' };
  }

  /**
   * Persists a newsletter subscriber to Firestore /subscribers collection.
   */
  public async submitSubscriber(payload: NewsletterSubmission): Promise<{ success: boolean; subId: string; source: 'firestore' | 'offline_queue' }> {
    const sanitizedEmail = payload.email.trim().toLowerCase().slice(0, 120);
    const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    const fullData = {
      email: sanitizedEmail,
      source: payload.source || 'footer_subscription',
      utm_source: payload.utm_source || '',
      utm_medium: payload.utm_medium || '',
      utm_campaign: payload.utm_campaign || '',
      subscribedAt: timestamp
    };

    try {
      const existing = JSON.parse(localStorage.getItem('mk_subscribers') || '[]');
      existing.push(fullData);
      localStorage.setItem('mk_subscribers', JSON.stringify(existing));
    } catch (e) {
      console.warn('[FirebaseManager] Local subscriber queue note:', e);
    }

    if (this.isReady() && this.db) {
      try {
        const subRef = doc(this.db, 'subscribers', subId);
        await setDoc(subRef, fullData);
        return { success: true, subId, source: 'firestore' };
      } catch (error) {
        console.warn('[FirebaseManager] Firestore subscriber save note:', error);
        return { success: true, subId, source: 'offline_queue' };
      }
    }

    return { success: true, subId, source: 'offline_queue' };
  }
}

export const firebaseManager = new FirebaseManager();
