/**
 * Growth Audit Application Business Service
 * Encapsulates validation, storage dispatch, and analytics firing for audit submissions.
 */

import { firebaseService, GrowthAuditRecord } from './firebase';
import { analytics } from './analytics';

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

  const record: GrowthAuditRecord = {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone || '',
    organizationName: payload.organizationName || '',
    industry: payload.industry,
    primaryChallenge: payload.primaryChallenge || '',
    createdAt: new Date().toISOString()
  };

  // 1. Dispatch analytics event
  analytics.trackAuditRequest({
    name: payload.fullName,
    email: payload.email,
    industry: payload.industry,
    phone: payload.phone
  });

  // 2. Persist record (Firebase or localStorage fallback)
  const result = await firebaseService.saveAuditRecord(record);

  return {
    success: true,
    message: 'Your Healthcare Growth Audit™ request has been received. Our executive desk will be in touch within 24 hours.',
    recordId: result.id
  };
}
