/**
 * Production Analytics & Tracking Architecture
 * Unified dispatch for Google Analytics 4, Meta Pixel, Google Ads Conversions, and DataLayer events.
 *
 * PRIVACY GUARANTEE: Never transmits PII (names, emails, phone numbers) inside event parameters.
 */

import { IndustryType } from '../types';
import { SITE_CONFIG } from '../config/site';
import { getAttributionData } from '../lib/utm';

export interface AnalyticsEventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

class AnalyticsService {
  private enabled: boolean;
  private gaId: string | undefined;
  private metaPixelId: string | undefined;
  private gAdsConversionId: string | undefined;
  private gAdsConversionLabel: string | undefined;
  private initialized: boolean = false;

  constructor() {
    this.enabled = SITE_CONFIG.featureFlags.enableAnalytics;
    this.gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    this.metaPixelId = import.meta.env.VITE_META_PIXEL_ID;
    this.gAdsConversionId = import.meta.env.VITE_GADS_CONVERSION_ID;
    this.gAdsConversionLabel = import.meta.env.VITE_GADS_CONVERSION_LABEL;

    this.initScripts();
  }

  /**
   * Safe dynamic loader for tracking scripts without blocking rendering.
   */
  private initScripts(): void {
    if (typeof window === 'undefined' || this.initialized || !this.enabled) return;

    // Initialize dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    // GA4 Script Injection
    if (this.gaId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
      document.head.appendChild(script);

      gtag('js', new Date());
      gtag('config', this.gaId, {
        send_page_view: false // We trigger page_view manually
      });
    }

    // Meta Pixel Script Injection
    if (this.metaPixelId) {
      /* eslint-disable */
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      (window as any).fbq('init', this.metaPixelId);
    }

    this.initialized = true;
  }

  /**
   * Track Page Views
   */
  public trackPageView(pageName: string): void {
    if (!this.enabled) return;
    const attribution = getAttributionData();

    this.dispatch('page_view', {
      page_title: pageName,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign
    });

    if (this.metaPixelId && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'PageView');
    }
  }

  /**
   * Primary Conversion: Lead Submission / Audit Request
   */
  public trackAuditRequest(data: { industry: string; organizationName?: string }): void {
    if (!this.enabled) return;
    const attribution = getAttributionData();

    const eventParams = {
      event_category: 'Lead',
      lead_type: 'Growth Audit Request',
      healthcare_category: data.industry,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign
    };

    // GA4 & DataLayer
    this.dispatch('generate_lead', eventParams);
    this.dispatch('contact_form_submit', eventParams);

    // Meta Pixel
    if (this.metaPixelId && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Healthcare Growth Audit',
        content_category: data.industry
      });
    }

    // Google Ads Conversion Trigger
    if (this.gAdsConversionId && this.gAdsConversionLabel && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {
        send_to: `${this.gAdsConversionId}/${this.gAdsConversionLabel}`
      });
    }
  }

  /**
   * Primary Conversion: Discovery Call Booked / Clicked
   */
  public trackDiscoveryCallBooking(sourceSection: string): void {
    if (!this.enabled) return;
    const attribution = getAttributionData();

    const params = {
      event_category: 'Conversion',
      source_section: sourceSection,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign
    };

    this.dispatch('book_discovery_call', params);

    if (this.metaPixelId && typeof (window as any).fbq === 'function') {
      (window as any).fbq('trackCustom', 'BookDiscoveryCall', params);
    }
  }

  /**
   * Micro-conversions
   */
  public trackWhatsAppClick(sourceSection: string): void {
    if (!this.enabled) return;
    this.dispatch('whatsapp_click', {
      event_category: 'MicroConversion',
      channel: 'WhatsApp',
      source_section: sourceSection
    });
  }

  public trackPhoneClick(sourceSection: string): void {
    if (!this.enabled) return;
    this.dispatch('phone_click', {
      event_category: 'MicroConversion',
      channel: 'Phone',
      source_section: sourceSection
    });
  }

  public trackEmailClick(sourceSection: string): void {
    if (!this.enabled) return;
    this.dispatch('email_click', {
      event_category: 'MicroConversion',
      channel: 'Email',
      source_section: sourceSection
    });
  }

  /**
   * Engagement Events
   */
  public trackCTAClick(ctaLabel: string, section: string): void {
    if (!this.enabled) return;
    this.dispatch('cta_click', {
      cta_label: ctaLabel,
      section_origin: section
    });
  }

  public trackIndustrySwitch(industry: IndustryType): void {
    if (!this.enabled) return;
    this.dispatch('service_interest', {
      healthcare_category: industry
    });
  }

  public trackRoiCalculation(data: { industry: string; monthlyRevenueLift: number; netAnnualImpact: number }): void {
    if (!this.enabled) return;
    this.dispatch('roi_calculation', {
      event_category: 'Engagement',
      healthcare_category: data.industry,
      value: data.netAnnualImpact,
      monthly_lift: data.monthlyRevenueLift
    });
  }

  public trackCustomEvent(eventName: string, params?: Record<string, any>): void {
    if (!this.enabled) return;
    this.dispatch(eventName, params);
  }

  /**
   * Internal Event Dispatcher to DataLayer & Console
   */
  private dispatch(eventName: string, params?: Record<string, any>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Event] 📊 ${eventName}`, params || '');
    }

    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: eventName,
        ...params
      });
    }

    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function' && this.gaId) {
      (window as any).gtag('event', eventName, params);
    }
  }
}

export const analytics = new AnalyticsService();
