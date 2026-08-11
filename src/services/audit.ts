/**
 * Growth Audit Application Business Service
 * Encapsulates validation, storage dispatch, and analytics firing for audit submissions.
 */

import { firebaseService, GrowthAuditRecord } from './firebase';
import { analytics } from './analytics';
import { getAttributionData } from '../lib/utm';

export interface SubmitAuditPayload {
  fullName: string;
  email: string;
  phone?: string;
  organizationName?: string;
  industry: string;
  primaryChallenge?: string;
}

export async function submitGrowthAudit(payload: SubmitAuditPayload): Promise<{
  success: boolean;
  message: string;
  recordId?: string;
}> {
  if (!payload.email || !payload.email.includes('@')) {
    throw new Error('Please provide a valid work or practice email address.');
  }

  const attribution = getAttributionData();

  const record: GrowthAuditRecord = {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone || '',
    organizationName: payload.organizationName || '',
    industry: payload.industry,
    primaryChallenge: payload.primaryChallenge || '',
    createdAt: new Date().toISOString(),
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    landingPage: attribution.landingPage,
    referrer: attribution.referrer
  };

  // 1. Dispatch privacy-compliant analytics event
  analytics.trackAuditRequest({
    industry: payload.industry,
    organizationName: payload.organizationName
  });

  // 2. Persist record (Firebase or localStorage fallback)
  const result = await firebaseService.saveAuditRecord(record);

  return {
    success: true,
    message: 'Your Healthcare Growth Audit™ request has been received. Our executive desk will be in touch within 24 hours.',
    recordId: result.id
  };
}
