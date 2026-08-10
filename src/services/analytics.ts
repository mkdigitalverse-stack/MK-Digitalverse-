/**
 * Analytics Service Layer
 * Centralized tracking for user interactions, audit conversions, ROI calculations, and page views.
 */

import { IndustryType } from '../types';
import { SITE_CONFIG } from '../config/site';

export interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, any>;
}

class AnalyticsService {
  private enabled: boolean;

  constructor() {
    this.enabled = SITE_CONFIG.featureFlags.enableAnalytics;
  }

  public trackPageView(pageName: string): void {
    if (!this.enabled) return;
    this.logEvent('page_view', { page_title: pageName, page_location: window.location.href });
  }

  public trackIndustrySwitch(industry: IndustryType): void {
    if (!this.enabled) return;
    this.logEvent('industry_switch', { industry_selected: industry });
  }

  public trackAuditRequest(data: { name?: string; email: string; industry: string; phone?: string }): void {
    if (!this.enabled) return;
    this.logEvent('growth_audit_request', {
      category: 'Lead',
      label: data.industry,
      email: data.email,
      industry: data.industry
    });
  }

  public trackRoiCalculation(data: { industry: string; monthlyRevenueLift: number; netAnnualImpact: number }): void {
    if (!this.enabled) return;
    this.logEvent('roi_calculation', {
      category: 'Engagement',
      label: data.industry,
      value: data.netAnnualImpact,
      monthly_lift: data.monthlyRevenueLift
    });
  }

  public trackCTAClick(ctaLabel: string, section: string): void {
    if (!this.enabled) return;
    this.logEvent('cta_click', { cta_label: ctaLabel, section_origin: section });
  }

  private logEvent(eventName: string, params?: Record<string, any>): void {
    // Development console logger
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] 📊 ${eventName}`, params || '');
    }

    // Google Tag Manager / window.dataLayer support if present
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: eventName,
        ...params
      });
    }
  }
}

export const analytics = new AnalyticsService();
