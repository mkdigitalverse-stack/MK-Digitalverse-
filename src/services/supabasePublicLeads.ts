/**
 * Supabase Public Lead Submission Service
 *
 * Dedicated service for handling public marketing lead submissions (Growth Audit,
 * Discovery Calls, Contact Inquiries) using Supabase.
 *
 * Method:
 * 1. Calls submit_public_lead(payload jsonb) RPC (SECURITY DEFINER).
 * 2. Preserves offline local queue (mk_leads_queue) if network/client is unconfigured or submission fails.
 * 3. Asynchronously invokes server notification processor (/api/notifications/process).
 */

import { supabase } from './supabase';
import { LeadSubmission, LeadStatus } from '../types/crm';

export interface SubmitPublicLeadResult {
  success: boolean;
  leadId: string;
  source: 'supabase_rpc' | 'supabase_table' | 'offline_queue';
  error?: string;
}

// In-memory cooldown tracking to prevent rapid duplicate double-clicks
const lastSubmissionTimes = new Map<string, number>();

/**
 * Sanitizes and submits a public marketing lead to Supabase.
 */
export async function submitPublicLead(
  payload: LeadSubmission
): Promise<SubmitPublicLeadResult> {
  // 1. Sanitize input strings exactly matching established validation limits
  const sanitizedName = payload.contactName.trim().slice(0, 100);
  const sanitizedEmail = payload.email.trim().toLowerCase().slice(0, 120);
  const phone = payload.phone ? payload.phone.trim().slice(0, 30) : '';
  const organizationName = payload.organizationName ? payload.organizationName.trim().slice(0, 120) : '';
  const website = payload.website ? payload.website.trim().slice(0, 200) : '';
  const location = payload.location ? payload.location.trim().slice(0, 100) : '';
  const healthcareCategory = payload.healthcareCategory ? payload.healthcareCategory.trim().slice(0, 100) : '';
  const biggestChallenge = payload.biggestChallenge ? payload.biggestChallenge.trim().slice(0, 1000) : '';
  const growthObjective = payload.growthObjective ? payload.growthObjective.trim().slice(0, 1000) : '';
  const investmentReadiness = payload.investmentReadiness ? payload.investmentReadiness.trim().slice(0, 100) : '';

  // Cooldown check for duplicate submission (10 seconds)
  const now = Date.now();
  const lastTime = lastSubmissionTimes.get(sanitizedEmail) || 0;
  if (now - lastTime < 10000) {
    const existingId = `lead_${now}`;
    return {
      success: false,
      leadId: existingId,
      source: 'offline_queue',
      error: 'A submission with this email was recently processed. Please wait a few moments before trying again.'
    };
  }

  // Client-side tracking identifier for local queue and notification correlation
  const clientTrackingId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // Full snake_case payload for Supabase public.leads table & submit_public_lead RPC.
  // Note: 'id' is deliberately omitted to allow PostgreSQL to generate a valid UUID
  // via default gen_random_uuid() and prevent 22P02 type errors.
  const supabaseLeadRecord: Record<string, unknown> = {
    name: sanitizedName,
    contact_name: sanitizedName,
    email: sanitizedEmail,
    phone,
    organization_name: organizationName,
    website,
    location,
    healthcare_category: healthcareCategory,
    biggest_challenge: biggestChallenge,
    growth_objective: growthObjective,
    investment_readiness: investmentReadiness,
    lead_type: payload.leadType,
    status: 'new' as LeadStatus,
    utm_source: payload.utm_source || '',
    utm_medium: payload.utm_medium || '',
    utm_campaign: payload.utm_campaign || '',
    utm_content: payload.utm_content || '',
    utm_term: payload.utm_term || '',
    gclid: payload.gclid || '',
    fbclid: payload.fbclid || '',
    landing_page: payload.landingPage || '',
    referrer: payload.referrer || '',
    created_at: timestamp,
    updated_at: timestamp
  };

  // Preserve in local storage retry queue for offline resilience
  try {
    const existingQueue = JSON.parse(localStorage.getItem('mk_leads_queue') || '[]');
    existingQueue.push({ leadId: clientTrackingId, data: supabaseLeadRecord });
    localStorage.setItem('mk_leads_queue', JSON.stringify(existingQueue));
  } catch (e) {
    console.warn('[SupabasePublicLeads] Local storage save note:', e);
  }

  // Trigger internal notifications asynchronously only after database confirmation
  const triggerNotification = (assignedLeadId: string) => {
    fetch('/api/notifications/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: assignedLeadId,
        leadType: payload.leadType,
        contactName: sanitizedName,
        organizationName,
        email: sanitizedEmail,
        phone,
        website,
        healthcareCategory,
        biggestChallenge,
        growthObjective,
        investmentReadiness
      })
    }).catch(err => console.warn('[SupabasePublicLeads] Async notification server call note:', err));
  };

  const removeFromLocalQueue = () => {
    try {
      const queue = JSON.parse(localStorage.getItem('mk_leads_queue') || '[]');
      const updatedQueue = queue.filter((item: { leadId: string }) => item.leadId !== clientTrackingId);
      localStorage.setItem('mk_leads_queue', JSON.stringify(updatedQueue));
    } catch (_) {}
  };

  let lastErrorMessage = '';

  // Attempt Supabase submission if client is configured
  if (supabase) {
    // Definitive Method: submit_public_lead() RPC (SECURITY DEFINER)
    // Directly invokes the PostgreSQL function: submit_public_lead(payload jsonb)
    try {
      let rpcRes = await supabase.rpc('submit_public_lead', {
        payload: supabaseLeadRecord
      });

      // If the parameter was defined as lead_data in PostgreSQL, try lead_data parameter
      if (rpcRes.error && (rpcRes.error.message?.includes('payload') || rpcRes.error.message?.includes('parameter') || rpcRes.error.code === '42883')) {
        const altRes = await supabase.rpc('submit_public_lead', {
          lead_data: supabaseLeadRecord
        });
        if (!altRes.error) {
          rpcRes = altRes;
        }
      }

      if (!rpcRes.error) {
        lastSubmissionTimes.set(sanitizedEmail, Date.now());
        removeFromLocalQueue();

        const data = rpcRes.data;
        const returnedId = (data && typeof data === 'object' && 'id' in data)
          ? String((data as { id: unknown }).id)
          : (typeof data === 'string' && data ? data : clientTrackingId);

        triggerNotification(returnedId);
        return { success: true, leadId: returnedId, source: 'supabase_rpc' };
      }

      lastErrorMessage = rpcRes.error.message || 'Lead submission failed.';
      console.error('[SupabasePublicLeads] submit_public_lead RPC error:', rpcRes.error.message);
    } catch (rpcEx: any) {
      lastErrorMessage = rpcEx?.message || String(rpcEx);
      console.error('[SupabasePublicLeads] submit_public_lead RPC exception:', rpcEx);
    }
  } else {
    lastErrorMessage = 'Supabase client is not configured in this environment.';
  }

  // Preserved in offline local queue on failure
  return {
    success: false,
    leadId: clientTrackingId,
    source: 'offline_queue',
    error: lastErrorMessage || 'Unable to complete lead submission. Saved to offline queue.'
  };
}
