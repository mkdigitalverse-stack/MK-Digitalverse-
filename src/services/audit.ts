/**
 * Growth Audit Application Business Service
 * Encapsulates validation, central lead persistence, and analytics firing for audit submissions.
 */

import { firebaseManager, LeadSubmission } from './firebase';
import { analytics } from './analytics';
import { getAttributionData } from '../lib/utm';

export interface SubmitAuditPayload {
  fullName: string;
  email: string;
  phone?: string;
  organizationName?: string;
  industry: string;
  primaryChallenge?: string;
  growthObjective?: string;
  investmentReadiness?: string;
}

export async function submitGrowthAudit(payload: SubmitAuditPayload): Promise<{
  success: boolean;
  message: string;
  recordId?: string;
}> {
  if (!payload.fullName || payload.fullName.trim().length < 2) {
    throw new Error('Please enter your full name.');
  }

  if (!payload.email || !payload.email.includes('@')) {
    throw new Error('Please provide a valid work or practice email address.');
  }

  const attribution = getAttributionData();

  const leadPayload: LeadSubmission = {
    contactName: payload.fullName,
    email: payload.email,
    phone: payload.phone || '',
    organizationName: payload.organizationName || '',
    healthcareCategory: payload.industry || 'Healthcare Practice',
    biggestChallenge: payload.primaryChallenge || '',
    growthObjective: payload.growthObjective || '',
    investmentReadiness: payload.investmentReadiness || '',
    leadType: 'growth_audit',
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    gclid: attribution.gclid,
    fbclid: attribution.fbclid,
    landingPage: attribution.landingPage,
    referrer: attribution.referrer
  };

  // 1. Dispatch conversion analytics event
  analytics.trackAuditRequest({
    industry: payload.industry,
    organizationName: payload.organizationName
  });

  // 2. Persist lead via central Firestore /leads collection with offline fallback
  const result = await firebaseManager.submitLead(leadPayload);

  return {
    success: true,
    message: 'Your Healthcare Growth Audit™ request has been received. Our team will review the information and contact you regarding the next step.',
    recordId: result.leadId
  };
}

export async function submitDiscoveryCall(payload: {
  fullName: string;
  email: string;
  phone?: string;
  organizationName?: string;
  healthcareCategory?: string;
  growthObjective?: string;
}): Promise<{
  success: boolean;
  message: string;
  recordId?: string;
}> {
  if (!payload.fullName || payload.fullName.trim().length < 2) {
    throw new Error('Please enter your full name.');
  }

  if (!payload.email || !payload.email.includes('@')) {
    throw new Error('Please provide a valid work email address.');
  }

  const attribution = getAttributionData();

  const leadPayload: LeadSubmission = {
    contactName: payload.fullName,
    email: payload.email,
    phone: payload.phone || '',
    organizationName: payload.organizationName || '',
    healthcareCategory: payload.healthcareCategory || 'Healthcare Organization',
    growthObjective: payload.growthObjective || '',
    leadType: 'discovery_call',
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    gclid: attribution.gclid,
    fbclid: attribution.fbclid,
    landingPage: attribution.landingPage,
    referrer: attribution.referrer
  };

  analytics.trackCustomEvent('discovery_call_booking', {
    organizationName: payload.organizationName
  });

  const result = await firebaseManager.submitLead(leadPayload);

  return {
    success: true,
    message: 'Your discovery call request has been received. Our team will review the details and follow up regarding the next step.',
    recordId: result.leadId
  };
}

export async function submitContactEnquiry(payload: {
  fullName: string;
  email: string;
  phone?: string;
  organizationName?: string;
  message?: string;
}): Promise<{
  success: boolean;
  message: string;
  recordId?: string;
}> {
  if (!payload.fullName || payload.fullName.trim().length < 2) {
    throw new Error('Please enter your full name.');
  }

  if (!payload.email || !payload.email.includes('@')) {
    throw new Error('Please provide a valid work email address.');
  }

  const attribution = getAttributionData();

  const leadPayload: LeadSubmission = {
    contactName: payload.fullName,
    email: payload.email,
    phone: payload.phone || '',
    organizationName: payload.organizationName || '',
    biggestChallenge: payload.message || '',
    leadType: 'contact_enquiry',
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    gclid: attribution.gclid,
    fbclid: attribution.fbclid,
    landingPage: attribution.landingPage,
    referrer: attribution.referrer
  };

  analytics.trackCustomEvent('contact_form_submission', {
    organizationName: payload.organizationName
  });

  const result = await firebaseManager.submitLead(leadPayload);

  return {
    success: true,
    message: 'Your enquiry has been received. Our team will review the details and get back to you.',
    recordId: result.leadId
  };
}
