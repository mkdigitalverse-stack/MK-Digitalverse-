# MK Digitalverse — Analytics & Tracking Architecture

## Global Tracking Notice

> **GLOBAL TRACKING NOTICE:**
> Google Tag Manager is installed at the application/document level (`index.html`).
> Do not paste the GTM `<head>` or `<body>` snippets into individual pages or components.
> Every new route automatically inherits the global GTM implementation.

---

## 1. GTM Container Specification

- **Canonical GTM Container ID:** `GTM-KMHLT7VV`
- **Installation Points:**
  - **Head Script:** `index.html` (inside `<head>`, immediately following character encoding and viewport definitions)
  - **Body Noscript:** `index.html` (immediately following the opening `<body>` tag)
- **Container Duplication Protection:**
  - Installed once at root document level.
  - Never duplicated upon route changes, re-renders, or component lifecycles.
  - SPA routing communicates via `dataLayer.push` events without re-inserting scripts.

---

## 2. Developer Guidelines for Future Pages & Routes

Whenever creating a new page or route (e.g., `/about`, `/contact`, `/solutions`, `/healthcare`, `/insights`, `/blog`, `/case-studies`, `/thank-you`, `/book-a-call`, `/gtm-test`, etc.):

1. **DO NOT** add `<script>` or `<noscript>` GTM tags to page components.
2. **DO NOT** create a second `dataLayer` instance.
3. **DO** dispatch custom events through `analytics` service (`src/services/analytics.ts`) or `pushToDataLayer` (`src/lib/gtm.ts`).
4. **DO** maintain SEO meta tags independently in page components or header config without touching GTM.

---

## 3. DataLayer Conventions & Privacy Guarantee

All events pushed to Google Tag Manager must strictly follow Google's standard schema:

```typescript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'event_name',
  // Non-PII parameters only
});
```

### Strictly Forbidden Data (PII & Healthcare Privacy)
To protect patient confidentiality, healthcare compliance, and CRM integrity, **NEVER** push the following attributes to the dataLayer:
- Contact names / Full names
- Email addresses
- Phone numbers
- Passwords or credentials
- Patient / Medical diagnosis / Clinical notes / Prescriptions
- CRM internal notes, deal values, or personnel assignments
- Supabase credentials, service keys, or tokens

---

## 4. SPA Route Tracking & Admin Isolation

- **Public Marketing Routes:**
  - On route change, a `page_view` event is dispatched to `dataLayer` with `page_title`, `page_location`, and active UTM campaign attribution.
- **Admin CRM Isolation (`/admin`, `#/admin/leads`):**
  - The internal admin workspace is explicitly isolated.
  - Marketing tracking and page view triggers are bypassed when `currentRoute === 'admin-leads'` to prevent contaminating marketing attribution with staff operations.

---

## 5. Public Lead Form Resilience

Tracking is decoupled from lead capture. In `src/services/audit.ts`, analytics dispatch is wrapped in a fail-safe execution block. Even if ad blockers or network failures prevent analytics requests, public enquiry submission, Supabase RPC execution, and lead capture proceed uninterrupted.

---

## 6. Consent Mode Roadmap

MK Digitalverse is prepared for future Google Consent Mode v2 integration. When a formal cookie consent banner is configured, default consent state (`ad_storage: 'denied'`, `analytics_storage: 'denied'`) can be declared prior to GTM initialization.
