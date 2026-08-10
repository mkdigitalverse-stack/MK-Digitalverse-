export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategoryKey;
  tags?: string[];
}

export type FaqCategoryKey = 
  | 'general' 
  | 'healthcare' 
  | 'process' 
  | 'pricing_engagement';

export interface FaqCategory {
  key: FaqCategoryKey;
  label: string;
  description: string;
  iconName: string;
}

export class FaqCategories {
  static readonly ALL: FaqCategory[] = [
    {
      key: 'general',
      label: 'General & Positioning',
      description: 'Understanding our Digital Growth Partner model vs traditional agencies.',
      iconName: 'Building2'
    },
    {
      key: 'healthcare',
      label: 'Healthcare Growth',
      description: 'Patient acquisition, clinical trust building, and AI triage systems.',
      iconName: 'HeartPulse'
    },
    {
      key: 'process',
      label: 'Audit & Process',
      description: 'Onboarding timelines, growth audits, and success measurement.',
      iconName: 'Compass'
    },
    {
      key: 'pricing_engagement',
      label: 'Pricing & Engagement',
      description: 'Partnership structures, custom plans, and target business fits.',
      iconName: 'CreditCard'
    }
  ];
}

export const FAQ_DATA: FaqItem[] = [
  // General
  {
    id: 'gen-1',
    category: 'general',
    question: 'What is a Digital Growth Partner, and how does it differ from a traditional marketing agency?',
    answer: 'Traditional marketing agencies sell isolated, tactical deliverables—such as basic ad management, generic social media posts, or template websites with no conversion strategy. As a Digital Growth Partner, MK Digitalverse takes complete end-to-end accountability for your revenue expansion. We build custom growth infrastructure, deploy AI pre-qualification engines, engineer enterprise web platforms, and run targeted performance acquisition campaigns tied directly to qualified patient enquiries, consultation show-up rates, and revenue growth.',
    tags: ['agency', 'growth partner', 'strategy']
  },
  {
    id: 'gen-2',
    category: 'general',
    question: 'Why do you specialize exclusively in Healthcare organizations?',
    answer: 'Healthcare is a high-ticket, decision-heavy sector that demands deep domain expertise. Patient acquisition requires clinical trust, medical ethics, patient privacy compliance, and genuine empathy. Generalist agencies apply generic e-commerce or lead-generation templates that fail in clinical markets. We bring battle-tested, healthcare-specific growth playbooks engineered specifically for hospitals, multi-specialty clinics, IVF centres, dental practices, diagnostic labs, cosmetic clinics, and wellness centres.',
    tags: ['specialization', 'healthcare']
  },
  {
    id: 'gen-3',
    category: 'general',
    question: 'How does MK Digitalverse work alongside our existing clinical coordinators or internal team?',
    answer: 'We operate as a high-level strategic and technical growth engine for your organization. If you have an in-house marketing coordinator or front-desk intake team, we empower them by automating patient pre-qualification, setting up CRM lead routing, and providing real-time intake analytics. We eliminate administrative friction so your clinical staff can focus 100% on patient care and consultations.',
    tags: ['internal team', 'collaboration', 'operations']
  },

  // Healthcare
  {
    id: 'hc-1',
    category: 'healthcare',
    question: 'How do you help hospitals and medical clinics attract more high-value patients?',
    answer: 'We architect patient-centric growth systems engineered to build clinical authority. Rather than driving low-intent traffic, we build specialized patient acquisition funnels featuring doctor trust profiling, interactive consultation quizzes, 24/7 AI intake triage, and hyper-targeted Google Search authority campaigns. This ensures your medical coordinators only spend time with pre-qualified patients seeking specific treatments.',
    tags: ['patient acquisition', 'clinic growth', 'medical marketing']
  },
  {
    id: 'hc-2',
    category: 'healthcare',
    question: 'Can you optimize or re-engineer our existing clinic website?',
    answer: 'Yes. Most clinic websites suffer from slow load times, poor mobile UX, and lack of clear patient triage. We perform a comprehensive Healthcare Growth Audit™ to identify intake bottlenecks, then re-architect your digital platform with zero operational downtime—transforming your website into a high-converting patient acquisition asset.',
    tags: ['website optimization', 'growth audit', 'conversion rate']
  },
  {
    id: 'hc-3',
    category: 'healthcare',
    question: 'Do you help improve Google Search visibility and local clinic reputation?',
    answer: 'Over 80% of patient journeys begin on Google Search. We deploy localized Search Engine Dominance campaigns, doctor-specific schema markup, and automated post-consultation review generation systems that position your practice as the top trusted authority in your geographic area.',
    tags: ['google search', 'seo', 'local reputation']
  },
  {
    id: 'hc-4',
    category: 'healthcare',
    question: 'What is included in the Healthcare Growth Audit™?',
    answer: 'The Healthcare Growth Audit™ is a diagnostic review of your practice’s digital intake efficiency, online search authority, competitive positioning, and inquiry-to-appointment conversion drop-offs. You receive a strategic blueprint mapping out uncaptured patient revenue opportunities and immediate action items.',
    tags: ['healthcare growth audit', 'diagnostic', 'blueprint']
  },
  {
    id: 'hc-5',
    category: 'healthcare',
    question: 'How does 24/7 AI Triage handle patient enquiries after hours?',
    answer: 'Our conversational AI Triage system engages prospective patients in under 30 seconds via web or WhatsApp. It screens treatment intent, answers common clinical FAQs, gathers basic health history, and routes qualified consultation holds directly to your front-desk CRM.',
    tags: ['ai triage', 'whatsapp', 'after-hours']
  },

  // Process
  {
    id: 'proc-1',
    category: 'process',
    question: 'What happens during a Discovery Call with MK Digitalverse?',
    answer: 'During our 30-minute Discovery Call, we analyze your current patient enquiry volume, appointment conversion bottlenecks, and growth targets. If there is a mutual strategic fit, we present a customized Growth Blueprint detailing the exact technical infrastructure, timeline, and projected ROI required to reach your goals.',
    tags: ['discovery call', 'growth blueprint', 'strategy']
  },
  {
    id: 'proc-2',
    category: 'process',
    question: 'How long does onboarding and system deployment take?',
    answer: 'Our rapid implementation methodology typically completes system architecture, web platform re-engineering, and AI integration within 3 to 4 weeks. Performance patient acquisition campaigns and lead triage pipelines go live immediately following platform deployment.',
    tags: ['onboarding', 'timeline', 'implementation']
  },
  {
    id: 'proc-3',
    category: 'process',
    question: 'How do you measure and report growth success?',
    answer: 'We measure success by bottom-line business metrics—specifically Cost Per Acquired Patient (CAC), Inquiry-to-Consultation Show-Up Rate, and Total Incremental Treatment Revenue. Partners receive an executive real-time dashboard displaying full visibility into pipeline health.',
    tags: ['metrics', 'roi', 'executive dashboard']
  },

  // Pricing & Engagement
  {
    id: 'price-1',
    category: 'pricing_engagement',
    question: 'How do your client engagements work?',
    answer: 'We operate on a structured Growth Partnership model combining an initial System Buildout Phase (architecting your web platform, AI pre-qualification engines, and conversion funnels) followed by a monthly Growth Management Retainer (ongoing CRO, campaign optimization, and pipeline scaling).',
    tags: ['engagement model', 'partnership', 'retainer']
  },
  {
    id: 'price-2',
    category: 'pricing_engagement',
    question: 'Do you offer customized growth plans for multi-location clinic groups and hospital networks?',
    answer: 'Yes. Engagements are tailored to your operating scale. Whether you manage a single specialized clinic, a multi-city hospital network, or a chain of IVF/Dental centers, we configure multi-location routing and centralized executive reporting.',
    tags: ['custom plans', 'multi-location', 'scaling']
  },
  {
    id: 'price-3',
    category: 'pricing_engagement',
    question: 'What types of healthcare organizations are the best fit for MK Digitalverse?',
    answer: 'We achieve maximum impact with ambitious Healthcare Practices (Hospitals, Multi-Specialty Clinics, IVF Centres, Dental Chains, Cosmetic & Wellness Clinics, Diagnostic Networks) generating or aiming for ₹1 Cr to ₹50 Cr+ in annual revenue, who value predictable patient acquisition systems over trial-and-error marketing experiments.',
    tags: ['target profile', 'ideal client', 'revenue scale']
  }
];

