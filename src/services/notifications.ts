/**
 * Notification Architecture Specification & Utility Module
 * 
 * ARCHITECTURE DIRECTIVE (F-03.1):
 * All internal lead notifications are handled SERVER-SIDE via Firestore triggers
 * (e.g., Firebase Cloud Function on /leads/{leadId} document creation).
 * 
 * The browser client MUST NEVER:
 * - Contain SMTP credentials, email provider API keys, or private service credentials.
 * - Perform direct email dispatch.
 * 
 * Server-side triggers monitor /leads/{leadId} creation, format notifications,
 * dispatch to configured internal recipients, and update server-controlled metadata
 * (notificationStatus, notificationAttempts, lastNotificationAttempt, notificationSentAt).
 */

export interface LeadNotificationPayload {
  leadId: string;
  leadType: 'growth_audit' | 'discovery_call' | 'contact_enquiry';
  contactName: string;
  organizationName?: string;
  email: string;
  phone?: string;
  website?: string;
  location?: string;
  healthcareCategory?: string;
  biggestChallenge?: string;
  growthObjective?: string;
  investmentReadiness?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landingPage?: string;
  referrer?: string;
  createdAt: string;
}

export interface NotificationResult {
  success: boolean;
  leadId: string;
  status: 'sent' | 'pending' | 'failed';
  attempts: number;
  message: string;
}

export class NotificationTemplateFormatter {
  /**
   * Formats clean, executive-friendly plain text notification content for internal alerts.
   */
  public static formatNotificationText(payload: LeadNotificationPayload, recipientEmail: string): { subject: string; body: string } {
    const titles: Record<LeadNotificationPayload['leadType'], string> = {
      growth_audit: 'New Healthcare Growth Audit™ Enquiry',
      discovery_call: 'New Discovery Call Request',
      contact_enquiry: 'New Website Enquiry'
    };

    const subject = `[MK DIGITALVERSE] ${titles[payload.leadType]} - ${payload.organizationName || payload.contactName}`;

    const body = `
==================================================
${titles[payload.leadType].toUpperCase()}
==================================================

CONTACT INFORMATION
--------------------------------------------------
Contact Name  : ${payload.contactName}
Organization  : ${payload.organizationName || 'N/A'}
Email Address : ${payload.email}
Phone Number  : ${payload.phone || 'N/A'}
Website URL   : ${payload.website || 'N/A'}
Location      : ${payload.location || 'N/A'}

BUSINESS DETAILS
--------------------------------------------------
Category/Sector: ${payload.healthcareCategory || 'N/A'}
Biggest Challenge: ${payload.biggestChallenge || 'N/A'}
Growth Objective : ${payload.growthObjective || 'N/A'}
Investment Tier  : ${payload.investmentReadiness || 'N/A'}

MARKETING ATTRIBUTION
--------------------------------------------------
UTM Source   : ${payload.utm_source || 'direct'}
UTM Medium   : ${payload.utm_medium || 'none'}
UTM Campaign : ${payload.utm_campaign || 'none'}
UTM Content  : ${payload.utm_content || 'none'}
UTM Term     : ${payload.utm_term || 'none'}
Landing Page : ${payload.landingPage || 'N/A'}
Referrer     : ${payload.referrer || 'N/A'}

SYSTEM METADATA
--------------------------------------------------
Lead ID      : ${payload.leadId}
Created At   : ${payload.createdAt}
Recipient    : ${recipientEmail}
==================================================
`;

    return { subject, body };
  }
}

