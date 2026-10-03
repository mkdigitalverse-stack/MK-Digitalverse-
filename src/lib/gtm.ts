/**
 * MK DIGITALVERSE — GOOGLE TAG MANAGER CORE CONFIGURATION & UTILITIES
 *
 * GLOBAL TRACKING NOTICE:
 * Google Tag Manager is installed at the application/document level (index.html).
 * Do not paste the GTM "<head>" or "<body>" snippets into individual pages or components.
 * Every new route automatically inherits the global GTM implementation.
 *
 * CANONICAL GTM CONTAINER ID: GTM-KMHLT7VV
 */

export const GTM_CONTAINER_ID = 'GTM-KMHLT7VV';

declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

/**
 * PII Filter Check
 * Strict enforcement: Never push sensitive information to Google Tag Manager dataLayer.
 */
const FORBIDDEN_PII_KEYS = [
  'email',
  'phone',
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
  'access_token',
  'service_role',
  'medical',
  'patient',
  'diagnosis',
  'prescription',
  'ssn',
  'aadhaar'
];

export function sanitizeDataLayerPayload(payload: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(payload)) {
    const lowerKey = key.toLowerCase();
    const isPiiKey = FORBIDDEN_PII_KEYS.some((forbidden) => lowerKey.includes(forbidden));

    if (isPiiKey) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        console.warn(`[GTM Security Warning] Blocked PII attribute "${key}" from dataLayer dispatch.`);
      }
      continue;
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeDataLayerPayload(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Push an event safely to Google Tag Manager dataLayer
 * Guarantees dataLayer existence, PII filtering, and non-blocking execution.
 */
export function pushToDataLayer(event: string, parameters: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer = window.dataLayer || [];
    const cleanParams = sanitizeDataLayerPayload(parameters);

    window.dataLayer.push({
      event,
      ...cleanParams
    });
  } catch (err) {
    console.warn('[GTM] Non-blocking dataLayer push error:', err);
  }
}
