import React from 'react';
import { FAQS } from '../data/content';

export const SeoStructuredData: React.FC = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'MK Digitalverse',
    'url': 'https://mkdigitalverse.com',
    'logo': 'https://mkdigitalverse.com/logo.png',
    'description': 'Premier Digital Growth Partner for Healthcare Organizations and Luxury Wedding Venues.',
    'knowsAbout': [
      'Healthcare Patient Acquisition',
      'Hospital Marketing Systems',
      'Luxury Wedding Venue Growth',
      'AI Lead Pre-Qualification',
      'High-Converting Web Development',
      'Performance Marketing'
    ],
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'IN'
    },
    'sameAs': [
      'https://linkedin.com/company/mkdigitalverse',
      'https://instagram.com/mkdigitalverse'
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQS.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://mkdigitalverse.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Healthcare Growth',
        'item': 'https://mkdigitalverse.com#healthcare'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Luxury Venues',
        'item': 'https://mkdigitalverse.com#wedding_venues'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
