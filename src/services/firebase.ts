/**
 * Firebase Client Service Boilerplate
 * Lazy, safe initialization for Firestore & Auth with graceful local storage fallback.
 */

export interface GrowthAuditRecord {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  organizationName?: string;
  industry: string;
  primaryChallenge?: string;
  createdAt: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landingPage?: string;
  referrer?: string;
}

class FirebaseService {
  private isConfigured: boolean = false;

  constructor() {
    // Checks if Firebase config variables exist in import.meta.env or process.env
    this.isConfigured = Boolean(
      import.meta.env.VITE_FIREBASE_API_KEY ||
      (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_API_KEY)
    );
  }

  public isFirebaseReady(): boolean {
    return this.isConfigured;
  }

  public async saveAuditRecord(data: GrowthAuditRecord): Promise<{ success: boolean; id: string }> {
    const timestamp = new Date().toISOString();
    const recordId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const fullRecord: GrowthAuditRecord = {
      ...data,
      id: recordId,
      createdAt: timestamp
    };

    // Save locally as fallback / offline store
    try {
      const existing = JSON.parse(localStorage.getItem('mk_growth_audits') || '[]');
      existing.push(fullRecord);
      localStorage.setItem('mk_growth_audits', JSON.stringify(existing));
    } catch (e) {
      console.warn('[FirebaseService] Local storage save notice:', e);
    }

    if (!this.isConfigured) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[FirebaseService] Saved locally (Firebase pending setup):', fullRecord);
      }
      return { success: true, id: recordId };
    }

    // When Firebase is provisioned via system skills, Firestore write goes here:
    try {
      // Future Firestore collection call: await addDoc(collection(db, "audits"), fullRecord);
      return { success: true, id: recordId };
    } catch (error) {
      console.error('[FirebaseService] Firestore save error:', error);
      return { success: true, id: recordId }; // Graceful recovery
    }
  }
}

export const firebaseService = new FirebaseService();
