/**
 * UTM & Lead Attribution Utility
 * Captures, stores, and supplies campaign attribution parameter tracking across the user session.
 */

export interface AttributionData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  gclid: string;
  fbclid: string;
  landingPage: string;
  referrer: string;
  capturedAt: string;
}

const STORAGE_KEY = 'mk_attribution_data';

export function initUtmCapture(): AttributionData {
  if (typeof window === 'undefined') {
    return getDefaultAttributionData();
  }

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const existing = getAttributionData();

    // Check if new UTM parameters exist in current URL
    const hasNewParams =
      searchParams.has('utm_source') ||
      searchParams.has('utm_medium') ||
      searchParams.has('utm_campaign') ||
      searchParams.has('gclid') ||
      searchParams.has('fbclid');

    if (hasNewParams || !existing.landingPage) {
      const freshData: AttributionData = {
        utm_source: searchParams.get('utm_source') || existing.utm_source || 'direct',
        utm_medium: searchParams.get('utm_medium') || existing.utm_medium || 'none',
        utm_campaign: searchParams.get('utm_campaign') || existing.utm_campaign || 'none',
        utm_content: searchParams.get('utm_content') || existing.utm_content || 'none',
        utm_term: searchParams.get('utm_term') || existing.utm_term || 'none',
        gclid: searchParams.get('gclid') || existing.gclid || '',
        fbclid: searchParams.get('fbclid') || existing.fbclid || '',
        landingPage: existing.landingPage || window.location.href,
        referrer: existing.referrer || document.referrer || 'direct',
        capturedAt: existing.capturedAt || new Date().toISOString()
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
      return freshData;
    }

    return existing;
  } catch (err) {
    console.warn('[Attribution] Failed to process attribution data:', err);
    return getDefaultAttributionData();
  }
}

export function getAttributionData(): AttributionData {
  if (typeof window === 'undefined') {
    return getDefaultAttributionData();
  }

  try {
    const sessionVal = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (sessionVal) {
      return JSON.parse(sessionVal) as AttributionData;
    }
  } catch (e) {
    // Fallback to default
  }

  return getDefaultAttributionData();
}

function getDefaultAttributionData(): AttributionData {
  return {
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
    utm_content: 'none',
    utm_term: 'none',
    gclid: '',
    fbclid: '',
    landingPage: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : 'direct',
    capturedAt: new Date().toISOString()
  };
}
