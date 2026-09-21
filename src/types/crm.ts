/**
 * Shared CRM & Marketing Domain Types
 * 
 * Database-agnostic interfaces and type definitions for marketing lead intake,
 * lifecycle statuses, attribution parameters, and newsletter subscriptions.
 */

export type LeadType = 'growth_audit' | 'discovery_call' | 'contact_enquiry';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export interface LeadSubmission {
  contactName: string;
  email: string;
  phone?: string;
  organizationName?: string;
  website?: string;
  location?: string;
  healthcareCategory?: string;
  biggestChallenge?: string;
  growthObjective?: string;
  investmentReadiness?: string;
  leadType: LeadType;
  // Attribution & tracking fields
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  landingPage?: string;
  referrer?: string;
}

export interface NewsletterSubmission {
  email: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}
