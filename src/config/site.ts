/**
 * MK Digitalverse Site & Brand Configuration (DS-01)
 * Centralized site metadata, contact details, social channels, and feature flags.
 */

export const SITE_CONFIG = {
  name: 'MK Digitalverse',
  tagline: 'Digital Growth Partner for Healthcare Organizations',
  description: 'MK Digitalverse is a Digital Growth Partner helping healthcare organizations achieve measurable business growth through strategy, branding, AI-powered systems, high-converting websites, and performance marketing.',
  url: 'https://mkdigitalverse.com',
  domain: 'mkdigitalverse.com',
  contact: {
    email: 'mkdigitalverse@gmail.com',
    executiveHours: 'Mon–Sat, 9 AM – 7 PM IST',
    location: 'India • Serving Clients Globally',
    phoneLabel: 'Direct Executive Desk'
  },
  socials: {
    linkedin: 'https://linkedin.com/company/mkdigitalverse',
    instagram: 'https://instagram.com/mkdigitalverse',
    youtube: 'https://youtube.com/@mkdigitalverse'
  },
  frameworks: {
    healthcare: 'Healthcare Growth System™',
    audit: 'Healthcare Growth Audit™',
    index: 'Healthcare Growth Index™',
    playbook: 'Implementation Playbook™'
  },
  featureFlags: {
    enableFirebasePersistence: false, // Set to true when Firebase is fully configured
    enableAnalytics: true,
    enableDesignSystemRoute: true,
    enableRoiCalculator: true
  }
};
