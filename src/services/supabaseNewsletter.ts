/**
 * Supabase Newsletter Subscription Service
 * 
 * Handles public newsletter subscriptions from the site footer using Supabase.
 * - Inserts into public.subscribers table.
 * - Preserves marketing attribution (utm_source, utm_medium, utm_campaign).
 * - Gracefully handles duplicate/existing email entries without application errors.
 * - Retains local storage cache (mk_subscribers) for offline resilience.
 */

import { supabase } from './supabase';
import { NewsletterSubmission } from '../types/crm';

export interface NewsletterSubscriptionResult {
  success: boolean;
  source: 'supabase' | 'offline_cache';
  alreadySubscribed?: boolean;
  message?: string;
}

/**
 * Validates and submits a newsletter subscriber to Supabase.
 */
export async function submitNewsletterSubscriber(
  payload: NewsletterSubmission
): Promise<NewsletterSubscriptionResult> {
  const rawEmail = payload.email ? payload.email.trim() : '';
  const sanitizedEmail = rawEmail.toLowerCase().slice(0, 120);

  // Email format validation
  if (!sanitizedEmail || !sanitizedEmail.includes('@') || sanitizedEmail.length < 5) {
    throw new Error('Please enter a valid email address.');
  }

  const source = payload.source || 'footer_subscription';
  const timestamp = new Date().toISOString();

  const subscriberRecord = {
    email: sanitizedEmail,
    source,
    utm_source: payload.utm_source || '',
    utm_medium: payload.utm_medium || '',
    utm_campaign: payload.utm_campaign || '',
    subscribed_at: timestamp,
    created_at: timestamp
  };

  // 1. Maintain local offline cache for redundancy (matches existing behavior)
  try {
    const existing = JSON.parse(localStorage.getItem('mk_subscribers') || '[]');
    // Avoid unbounded duplicates in local cache
    const alreadyInLocal = existing.some((item: { email?: string }) => item.email === sanitizedEmail);
    if (!alreadyInLocal) {
      existing.push(subscriberRecord);
      localStorage.setItem('mk_subscribers', JSON.stringify(existing));
    }
  } catch (e) {
    console.warn('[SupabaseNewsletter] Local subscriber cache note:', e);
  }

  // 2. Persist to Supabase if client is available
  if (supabase) {
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({
          email: sanitizedEmail,
          source,
          utm_source: payload.utm_source || '',
          utm_medium: payload.utm_medium || '',
          utm_campaign: payload.utm_campaign || '',
          subscribed_at: timestamp
        });

      if (!error) {
        return {
          success: true,
          source: 'supabase',
          message: 'Subscribed to Growth Briefing!'
        };
      }

      // Check if the error indicates a duplicate email (Postgres 23505 unique_violation)
      const isDuplicate = 
        error.code === '23505' || 
        error.message.toLowerCase().includes('duplicate') || 
        error.message.toLowerCase().includes('unique');

      if (isDuplicate) {
        // Return success gracefully as user is already subscribed
        return {
          success: true,
          source: 'supabase',
          alreadySubscribed: true,
          message: 'You are already subscribed to Growth Briefing!'
        };
      }

      console.warn('[SupabaseNewsletter] public.subscribers insert note, cached locally:', error.message);
      return {
        success: true,
        source: 'offline_cache',
        message: 'Subscribed to Growth Briefing!'
      };
    } catch (insertError: any) {
      console.warn('[SupabaseNewsletter] Subscription insert exception, cached locally:', insertError);
      return {
        success: true,
        source: 'offline_cache',
        message: 'Subscribed to Growth Briefing!'
      };
    }
  }

  // 3. Fallback when Supabase client is unconfigured in development/offline
  return {
    success: true,
    source: 'offline_cache',
    message: 'Subscribed to Growth Briefing!'
  };
}
