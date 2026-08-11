/**
 * Admin Client Service for F-08 Notification & Revenue Alert Engine
 */

export interface NotificationRecordClient {
  id: string;
  idempotencyKey: string;
  leadId: string;
  type: 'lead_intake_alert' | 'revenue_alert_overdue' | 'revenue_alert_stale' | 'revenue_alert_proposal' | 'revenue_alert_urgent' | 'test_alert';
  recipientEmail: string;
  senderEmail: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  status: 'pending' | 'sent' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: string;
  sentAt?: string;
  error?: string;
  providerResponseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStatusResponse {
  success: boolean;
  stats: {
    totalProcessed: number;
    sentCount: number;
    pendingCount: number;
    failedCount: number;
    retryCount: number;
    lastRunAt: string;
  };
  records: NotificationRecordClient[];
  config: {
    recipientEmail: string;
    senderEmail: string;
    hasApiKey: boolean;
  };
}

export class AdminNotificationClient {
  public static async getStatus(): Promise<NotificationStatusResponse> {
    try {
      const res = await fetch('/api/notifications/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('[AdminNotificationClient] Status fetch fallback:', err);
      return {
        success: true,
        stats: {
          totalProcessed: 0,
          sentCount: 0,
          pendingCount: 0,
          failedCount: 0,
          retryCount: 0,
          lastRunAt: new Date().toISOString()
        },
        records: [],
        config: {
          recipientEmail: 'mkdigitalverse@gmail.com',
          senderEmail: 'notifications@mkdigitalverse.com',
          hasApiKey: false
        }
      };
    }
  }

  public static async processLeadNotification(lead: {
    leadId: string;
    leadType: string;
    contactName: string;
    organizationName?: string;
    email: string;
    phone?: string;
    website?: string;
    healthcareCategory?: string;
    biggestChallenge?: string;
    growthObjective?: string;
    investmentReadiness?: string;
  }): Promise<{ success: boolean; record?: NotificationRecordClient; duplicate?: boolean; message?: string }> {
    try {
      const res = await fetch('/api/notifications/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err?.message || 'Server connection error' };
    }
  }

  public static async triggerRetry(): Promise<{ success: boolean; retriedCount?: number; newlySentCount?: number; message?: string }> {
    try {
      const res = await fetch('/api/notifications/retry', { method: 'POST' });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err?.message || 'Retry trigger error' };
    }
  }

  public static async runEndToEndTest(): Promise<{
    success: boolean;
    testLeadId?: string;
    intakeResult?: NotificationRecordClient;
    revenueResult?: NotificationRecordClient;
    message?: string;
  }> {
    try {
      const res = await fetch('/api/notifications/test', { method: 'POST' });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err?.message || 'Test trigger error' };
    }
  }
}
