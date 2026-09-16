/**
 * Supabase Public Lead Submission Service
 *
 * Dedicated service for handling public marketing lead submissions (Growth Audit,
 * Discovery Calls, Contact Inquiries) using Supabase.
 *
 * Preferred Method:
 * 1. Calls submit_public_lead() RPC if available.
 * 2. Falls back to public.leads table insert.
 * 3. Preserves offline local queue (mk_leads_queue) if network/client is unconfigured.
 * 4. Asynchronously invokes server notification processor (/api/notifications/process).
 */

import { supabase } from './supabase';
import { LeadSubmission, LeadStatus } from './firebase';

export interface SubmitPublicLeadResult {
  success: boolean;
  leadId: string;
  source: 'supabase_rpc' | 'supabase_table' | 'offline_queue';
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
    return { success: true, leadId: existingId, source: 'offline_queue' };
  }
  lastSubmissionTimes.set(sanitizedEmail, now);

  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // Full snake_case payload for Supabase public.leads table & submit_public_lead RPC
  const supabaseLeadRecord = {
    id: leadId,
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
    existingQueue.push({ leadId, data: supabaseLeadRecord });
    localStorage.setItem('mk_leads_queue', JSON.stringify(existingQueue));
  } catch (e) {
    console.warn('[SupabasePublicLeads] Local storage save note:', e);
  }

  // Trigger internal notifications asynchronously
  const triggerNotification = () => {
    fetch('/api/notifications/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId,
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
      const updatedQueue = queue.filter((item: { leadId: string }) => item.leadId !== leadId);
      localStorage.setItem('mk_leads_queue', JSON.stringify(updatedQueue));
    } catch (_) {}
  };

  // Attempt Supabase submission if client is configured
  if (supabase) {
    // 1. Preferred Method: submit_public_lead() RPC
    try {
      // Provide both parameter naming conventions (prefixed and un-prefixed) so the RPC
      // resolves regardless of whether PostgreSQL parameter signature uses p_ prefixes.
      const rpcArgs: Record<string, unknown> = {
        p_contact_name: sanitizedName,
        p_email: sanitizedEmail,
        p_phone: phone,
        p_organization_name: organizationName,
        p_website: website,
        p_location: location,
        p_healthcare_category: healthcareCategory,
        p_biggest_challenge: biggestChallenge,
        p_growth_objective: growthObjective,
        p_investment_readiness: investmentReadiness,
        p_lead_type: payload.leadType,
        p_utm_source: payload.utm_source || '',
        p_utm_medium: payload.utm_medium || '',
        p_utm_campaign: payload.utm_campaign || '',
        p_utm_content: payload.utm_content || '',
        p_utm_term: payload.utm_term || '',
        p_gclid: payload.gclid || '',
        p_fbclid: payload.fbclid || '',
        p_landing_page: payload.landingPage || '',
        p_referrer: payload.referrer || '',
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
        utm_source: payload.utm_source || '',
        utm_medium: payload.utm_medium || '',
        utm_campaign: payload.utm_campaign || '',
        utm_content: payload.utm_content || '',
        utm_term: payload.utm_term || '',
        gclid: payload.gclid || '',
        fbclid: payload.fbclid || '',
        landing_page: payload.landingPage || '',
        referrer: payload.referrer || '',
        payload: supabaseLeadRecord,
        lead_data: supabaseLeadRecord
      };

      const { data: rpcData, error: rpcError } = await supabase.rpc('submit_public_lead', rpcArgs);

      if (!rpcError) {
        removeFromLocalQueue();
        triggerNotification();
        const returnedId = (rpcData && typeof rpcData === 'object' && 'id' in rpcData)
          ? String((rpcData as { id: unknown }).id)
          : (typeof rpcData === 'string' ? rpcData : leadId);

        return { success: true, leadId: returnedId, source: 'supabase_rpc' };
      }

      console.warn('[SupabasePublicLeads] submit_public_lead RPC warning, falling back to public.leads insert:', rpcError.message);
    } catch (rpcEx) {
      console.warn('[SupabasePublicLeads] submit_public_lead RPC call note:', rpcEx);
    }

    // 2. Secondary Method: Direct insert into public.leads table
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('leads')
        .insert(supabaseLeadRecord)
        .select('id')
        .maybeSingle();

      if (!insertError) {
        removeFromLocalQueue();
        triggerNotification();
        const returnedId = insertData?.id ? String(insertData.id) : leadId;
        return { success: true, leadId: returnedId, source: 'supabase_table' };
      }

      console.warn('[SupabasePublicLeads] public.leads insert warning, lead queued locally:', insertError.message);
    } catch (tableEx) {
      console.warn('[SupabasePublicLeads] public.leads table insert note:', tableEx);
    }
  }

  // 3. Fallback: Preserved in offline local queue
  triggerNotification();
  return { success: true, leadId, source: 'offline_queue' };
}
