import { IndustryData, ComparisonPoint, FrameworkStage, CapabilityItem, CaseStudy } from '../types';

export const INDUSTRY_DATA: Record<'healthcare', IndustryData> = {
  healthcare: {
    id: 'healthcare',
    title: 'Healthcare Growth Systems',
    headline: 'Helping Healthcare Organizations Achieve Measurable Business Growth',
    ipName: 'Healthcare Growth System™',
    tagline: 'Predictable Patient Acquisition & Clinical Reputation Engineering',
    description: 'We partner with healthcare organizations to build end-to-end patient growth engines. From high-trust digital clinical experiences to AI-driven lead qualification and performance marketing.',
    targetAudience: [
      'Hospitals & Health Systems',
      'Multi-Specialty Clinics',
      'Dental Specialty Clinics',
      'IVF & Fertility Centres',
      'Diagnostic & Imaging Networks',
      'Cosmetic & Plastic Surgery Clinics',
      'Premium Wellness & Longevity Centres'
    ],
    challenges: [
      {
        title: 'Inquiry & Intake Friction',
        description: 'Over 35% of prospective patient calls and web leads drop off due to slow manual response during busy clinical hours.',
        impact: 'Heavy ad spend waste and uncaptured patient lifetime value.'
      },
      {
        title: 'Weak Pre-Consultation Trust',
        description: 'Generic templates fail to showcase doctor expertise or clinical case outcomes, leaving patients hesitant to commit.',
        impact: 'High consultation no-show rates and price sensitivity.'
      },
      {
        title: 'Unoptimized Digital Funnels',
        description: 'Patient acquisition relies on disconnected ads without real-time triage, pre-qualification, or instant slot booking.',
        impact: 'High cost-per-acquired-patient and stagnant clinic growth.'
      }
    ],
    verticals: [
      {
        id: 'hospitals',
        title: 'Hospitals & Medical Groups',
        description: 'Multi-specialty patient routing, doctor authority profiles, and high-volume appointment funnels.',
        keyMetric: '+140% Verified Appointments',
        iconName: 'Building2'
      },
      {
        id: 'ivf',
        title: 'IVF & Fertility Centres',
        description: 'Empathy-first consultation funnels, emotional trust architecture, and high-LTV patient acquisition.',
        keyMetric: '3.8x Qualified Consultation Rate',
        iconName: 'HeartPulse'
      },
      {
        id: 'cosmetic',
        title: 'Cosmetic & Dental Clinics',
        description: 'Visual patient transformation showcases, private VIP booking funnels, and high-ticket treatment workflows.',
        keyMetric: '62% Reduction in No-Shows',
        iconName: 'Sparkles'
      },
      {
        id: 'diagnostics',
        title: 'Diagnostic Labs & Networks',
        description: 'Corporate tie-up engines, automated test package booking, and frictionless home collection funnels.',
        keyMetric: '4.5x Package Conversions',
        iconName: 'Activity'
      }
    ],
    growthPillars: [
      {
        title: 'High-Trust Clinical Web Engine',
        description: 'HIPAA-compliant, ultra-fast web platforms engineered around patient intent, medical credibility, and instant triage.',
        impact: 'Converts cold visitors into verified clinical inquiries.'
      },
      {
        title: 'AI Patient Qualification & Routing',
        description: 'Intelligent AI triage workflows that qualify patient intent 24/7, filter non-serious inquiries, and route directly to clinical coordinators.',
        impact: 'Saves 35+ operational hours weekly while boosting conversion.'
      },
      {
        title: 'Hyper-Local & Intent Marketing',
        description: 'Laser-targeted local SEO, geo-fenced Google Search ads, and specialty-focused social acquisition channels.',
        impact: 'Dominates top-of-funnel medical search in your region.'
      },
      {
        title: 'Reputation & LTV Retention System',
        description: 'Automated patient review generation, post-treatment care flows, and multi-specialty cross-referral engines.',
        impact: 'Establishes top-tier clinical authority and repeat patient visits.'
      }
    ],
    metrics: [
      { label: 'Average Patient Acquisition Growth', value: '+185%', subtext: 'In first 6 months of implementation' },
      { label: 'Cost Per Qualified Inquiry', value: '-42%', subtext: 'Through AI pre-qualification filters' },
      { label: 'No-Show Rate Reduction', value: '55%', subtext: 'Automated SMS/WhatsApp confirmation workflows' },
      { label: 'Annual Revenue Impact', value: '$2.4M+', subtext: 'Average added value per healthcare client' }
    ]
  }
};

export const COMPARISON_MATRIX: ComparisonPoint[] = [
  {
    dimension: 'Core Positioning',
    traditionalAgency: 'Vendor executing disconnected tactics (posting, generic ads, simple pages)',
    mkGrowthPartner: 'Strategic Digital Growth Partner building end-to-end business revenue systems'
  },
  {
    dimension: 'Primary Focus',
    traditionalAgency: 'Vanity metrics like impressions, clicks, followers, and basic web traffic',
    mkGrowthPartner: 'Measurable ROI, verified patient appointments, and scalable unit economics'
  },
  {
    dimension: 'Industry Expertise',
    traditionalAgency: 'Generic templates applied across dozens of unrelated industries',
    mkGrowthPartner: 'Deep specialization exclusively in Healthcare Organizations'
  },
  {
    dimension: 'Technology Infrastructure',
    traditionalAgency: 'Outdated WordPress templates, slow page speeds, basic static contact forms',
    mkGrowthPartner: 'Enterprise Next.js web engines, custom AI qualification systems & automated routing'
  },
  {
    dimension: 'Lead Qualification',
    traditionalAgency: 'Floods sales team with unvetted leads, tire-kickers, and low-budget inquiries',
    mkGrowthPartner: 'AI-driven pre-qualification funnels that filter for budget, timeline, and intent'
  },
  {
    dimension: 'Accountability & Reporting',
    traditionalAgency: 'Monthly PDF exports with vague marketing jargon and no bottom-line clarity',
    mkGrowthPartner: 'Transparent real-time growth dashboards tied directly to pipeline value & revenue'
  }
];

export const FRAMEWORK_STAGES: FrameworkStage[] = [
  {
    id: 1,
    title: 'Stage 1: Healthcare Growth Audit™',
    subtitle: 'Diagnose Opportunities & Intake Bottlenecks',
    description: 'We perform a forensic diagnostic audit of your entire digital footprint and intake funnel—pinpointing revenue leaks, ad capital waste, and response delays before building your growth strategy.',
    deliverables: ['Healthcare Growth Audit™ Report', 'Intake Leak & Bottleneck Map', 'Unit Economics Benchmark', 'Opportunity Matrix'],
    icon: 'Search',
    techStack: ['Audit Diagnostics', 'Funnel Analytics', 'Unit Economics']
  },
  {
    id: 2,
    title: 'Stage 2: Growth Strategy',
    subtitle: 'Build a Measurable Growth Roadmap',
    description: 'We construct an actionable 12-month growth roadmap tailored specifically to your organization’s revenue targets, specialty capacity, and local market opportunity.',
    deliverables: ['Measurable Growth Blueprint', 'Specialty Capacity Roadmap', 'Patient LTV Projection', 'Resource Allocation Model'],
    icon: 'Target',
    techStack: ['Strategic Modeling', 'Growth Architecture', 'Capacity Planning']
  },
  {
    id: 3,
    title: 'Stage 3: Brand Positioning',
    subtitle: 'Build Trust Before the First Consultation',
    description: 'We engineer high-trust clinical authority profiles and narrative positioning that showcase doctor expertise, case outcomes, and institution prestige—eliminating price resistance.',
    deliverables: ['Clinical Trust Architecture™', 'Doctor & Specialist Authority Portals', 'Patient Trust Proof Showcase', 'Prestige Brand Positioning'],
    icon: 'Award',
    techStack: ['Authority Messaging', 'Clinical Storytelling', 'Brand Systems']
  },
  {
    id: 4,
    title: 'Stage 4: Conversion-Focused Websites ⭐',
    subtitle: 'Flagship Digital Platform for Patient Conversion',
    description: 'We design and develop high-performing enterprise Next.js web platforms that build immediate credibility, streamline navigation, and convert visitors into qualified patient enquiries.',
    deliverables: ['Enterprise Next.js Web Engine™', 'Interactive Appointment & Slot Schedulers', 'Sub-Second Page Load Speeds (Core Web Vitals 95+)', 'Medical SEO & Schema Markup'],
    icon: 'Code2',
    techStack: ['Next.js App Router', 'React', 'Tailwind CSS', 'TypeScript', 'SEO Schema']
  },
  {
    id: 5,
    title: 'Stage 5: AI-Powered Business Systems',
    subtitle: 'Automate Workflows & Operational Efficiency',
    description: 'We deploy 24/7 conversational AI agents that triage incoming patient inquiries in under 30 seconds, pre-qualify intent, and route ready-to-book leads directly to staff WhatsApp and CRM.',
    deliverables: ['24/7 AI Triage & Routing Engine™', 'Instant Lead Qualification Sequences', 'WhatsApp & SMS Coordinator Alerts', 'EHR & CRM Real-Time Integration'],
    icon: 'Bot',
    techStack: ['Gemini AI Triage', 'WhatsApp Cloud API', 'CRM Integration', 'Webhooks']
  },
  {
    id: 6,
    title: 'Stage 6: Performance Marketing',
    subtitle: 'Generate Predictable, Qualified Enquiries',
    description: 'We execute data-driven acquisition campaigns across Google Search, Google Maps, and Meta channels to capture active patients searching for specialized treatment.',
    deliverables: ['Precision Geo-Funnel Engine™', 'Top-3 Google Search Dominance', 'Geo-Targeted High-Intent Campaigns', 'Local SEO & Reputation Engine'],
    icon: 'TrendingUp',
    techStack: ['Google Ads Search/Maps', 'Meta Ads Manager', 'Local SEO Schema']
  },
  {
    id: 7,
    title: 'Stage 7: Measurement & Continuous Optimization',
    subtitle: 'Track Performance & Continuous Improvement',
    description: 'We track bottom-line revenue, verified patient appointments, and acquisition costs in real-time, executing weekly data-driven optimizations for long-term sustainable growth.',
    deliverables: ['Healthcare Growth Index™ (HGI™) Dashboard', 'Real-Time Revenue & CAC Attribution', 'Weekly Conversion Rate Optimization', 'Sustainable Scale Strategy'],
    icon: 'BarChart3',
    techStack: ['Custom Analytics API', 'HGI™ Tracking', 'Unit Economics Analytics']
  }
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'strategy',
    pillarNumber: '01',
    title: 'Healthcare Growth Strategy',
    purpose: 'Develop a clear roadmap for measurable and sustainable business growth.',
    shortDesc: 'A rigorous diagnostic approach that aligns unit economics with market opportunity before executing campaigns.',
    fullDesc: 'We evaluate your organization’s entire acquisition model—from initial intake friction to patient lifetime value or treatment package size. We construct a bespoke growth blueprint tailored specifically to your financial targets.',
    icon: 'Target',
    framework: 'Healthcare Growth Audit™',
    industryApplicability: 'healthcare',
    features: ['Unit Economics & LTV Modeling', 'Patient Intake Leak Diagnosis', 'Competitive Market Gap Analysis', 'Custom Revenue Blueprinting'],
    businessOutcome: 'Eliminates ad capital waste and establishes clear unit economics for scalable expansion.',
    outcomes: [
      'Pinpoint exact revenue loss points across phone & web intake',
      'Establish baseline patient LTV and treatment package profitability',
      'Construct actionable 12-month growth roadmap'
    ]
  },
  {
    id: 'brand',
    pillarNumber: '02',
    title: 'Brand Positioning',
    purpose: 'Build trust, authority, and a differentiated healthcare brand.',
    shortDesc: 'Position your doctors or medical practice as the premier choice in your region, creating immediate trust.',
    fullDesc: 'We engineer high-trust brand systems that highlight clinical excellence, doctor credentials, and facility prestige. By positioning your institution as a category authority, we reduce price resistance and increase appointment conversion.',
    icon: 'Award',
    framework: 'Clinical Trust Architecture™',
    industryApplicability: 'healthcare',
    features: ['Doctor & Specialist Authority Portals', 'Clinical Case Showcase Systems', 'Hospital Narrative Engineering', 'Prestige Patient Psychological Mapping'],
    businessOutcome: 'Commands fee authority and drives 2.4x higher consultation acceptance.',
    outcomes: [
      'Eliminate price sensitivity before sales conversations begin',
      'Position specialists as regional medical key opinion leaders',
      'Build overwhelming trust with prospective patients'
    ]
  },
  {
    id: 'conversion_websites',
    pillarNumber: '03 ⭐ Flagship Capability',
    title: 'Conversion-Focused Websites ⭐',
    purpose: 'Design and develop high-performing websites that build trust, improve patient experience, and convert visitors into qualified patient enquiries.',
    shortDesc: 'Sub-second digital flagships engineered for high-intent booking UI, doctor showcases, and effortless patient conversion.',
    fullDesc: 'Conversion-Focused Websites are the digital cornerstone of the Healthcare Growth System™. Built on custom enterprise Next.js architecture, they deliver sub-second load times, interactive specialist finders, seamless appointment flows, and deep medical SEO schema to maximize visitor conversion.',
    icon: 'Code2',
    framework: 'Enterprise Next.js Web Engine™',
    industryApplicability: 'healthcare',
    features: ['Next.js App Router Architecture', 'Sub-Second Core Web Vitals (95+ Rating)', 'Interactive Patient Consultation & Slot Schedulers', 'Medical & Clinical SEO Schema Markup'],
    businessOutcome: 'Converts cold website visitors into verified clinical patient enquiries at +185% higher efficiency.',
    outcomes: [
      'Sub-second page load speeds across all mobile and desktop devices',
      'Interactive patient booking pathways with zero friction',
      'Dominant top-3 organic search ranking for high-ticket medical specialties'
    ]
  },
  {
    id: 'ai_systems',
    pillarNumber: '04',
    title: 'AI-Powered Business Systems',
    purpose: 'Automate repetitive processes, improve lead handling, and increase operational efficiency.',
    shortDesc: 'Instant, intelligent qualification engines that engage prospects day or night and route qualified leads to staff.',
    fullDesc: 'Our conversational AI agents handle incoming patient inquiries in under 30 seconds, qualifying clinical intent, budget, and specialty needs before routing ready-to-book leads directly to staff WhatsApp and CRM.',
    icon: 'Cpu',
    framework: 'AI Triage & Routing Engine™',
    industryApplicability: 'healthcare',
    features: ['24/7 Smart Conversational Triage', 'Patient Intent & Specialty Pre-Screening', 'Instant WhatsApp & SMS Routing', 'EHR & CRM Real-Time Sync'],
    businessOutcome: 'Responds in under 30 seconds 24/7 and reduces cost per acquired patient by up to 45%.',
    outcomes: [
      '100% instant response rate day or night',
      'Automated filtering of tire-kickers and non-serious inquiries',
      'Direct WhatsApp consultation hold generated automatically'
    ]
  },
  {
    id: 'performance_marketing',
    pillarNumber: '05',
    title: 'Performance Marketing',
    purpose: 'Generate qualified patient enquiries through data-driven campaigns and continuous optimization.',
    shortDesc: 'Search-intent Google campaigns and geo-fenced Meta funnels designed for measurable revenue.',
    fullDesc: 'We execute hyper-targeted acquisition campaigns designed to capture active patients searching for specialized treatments. Fully integrated with real-time analytics dashboards.',
    icon: 'Zap',
    framework: 'Precision Geo-Funnel Engine™',
    industryApplicability: 'healthcare',
    features: ['Google Search & Maps Domination', 'Meta (Instagram) High-Intent Ads', 'Hyper-Local Geo-Fenced Targeting', 'Real-Time Revenue Attribution Dashboards'],
    businessOutcome: 'Delivers predictable, high-margin patient acquisition with an average 3.8x ROAS.',
    outcomes: [
      'Own top 3 Google Search positions for high-ticket medical services',
      'Reach target households within a 25km clinic radius',
      'Real-time executive tracking of cost-per-acquired-patient'
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'fertility_clinic_growth',
    clientCategory: 'Multi-Centre IVF & Fertility Institute',
    industry: 'healthcare',
    title: 'Scaling Qualified Patient Inquiries by 280% for Premium IVF Specialist Group',
    challenge: 'The clinic was relying on generic social ads that generated high lead volume but low intent, overwhelming clinical coordinators with unqualified inquiries.',
    solution: 'Designed a high-trust digital platform with interactive fertility consultation quizzes, AI qualification triage, and hyper-targeted Google Search campaigns.',
    results: [
      { metric: '+280%', label: 'Increase in Verified Consultations' },
      { metric: '-52%', label: 'Lower Cost Per Qualified Patient' },
      { metric: '88%', label: 'Show-Up Rate for Scheduled Visits' }
    ],
    quote: {
      text: 'MK Digitalverse transformed our entire online patient funnel. Our clinical staff now only speaks with serious couples ready for consultation.',
      author: 'Dr. A. Sharma',
      role: 'Medical Director & Founder'
    }
  },
  {
    id: 'hospital_network_growth',
    clientCategory: 'Apex Multi-Specialty Hospital Network',
    industry: 'healthcare',
    title: 'Adding ₹4.2 Cr in Elective Surgery Pipeline Across 4 Hospital Locations',
    challenge: 'A growing hospital network experienced high patient drop-off on their legacy website, alongside 30-minute delays in routing digital consultation requests.',
    solution: 'Re-architected their digital infrastructure into a Next.js web platform paired with centralized 24/7 AI Triage that automatically categorizes patient intent by specialty.',
    results: [
      { metric: '₹4.2 Cr', label: 'Incremental Elective Pipeline' },
      { metric: '<30s', label: 'Average Intake Response Time' },
      { metric: '3.4x', label: 'Inquiry-to-Appointment Lift' }
    ],
    quote: {
      text: 'The 24/7 AI triage and doctor authority portals positioned our hospital as the top regional choice for surgical procedures. The intake speed is unmatched.',
      author: 'Dr. R. Kapoor',
      role: 'Managing Director & CMO'
    }
  }
];

export const FAQS = [
  {
    question: 'How is MK Digitalverse different from a traditional marketing agency?',
    answer: 'Traditional agencies sell generic, tactical services like posting on social media, running basic ad campaigns, or designing static templates. MK Digitalverse operates as a Digital Growth Partner. We design, deploy, and manage complete business growth systems tailored specifically to Healthcare Organizations — combining strategy, enterprise web platforms, AI pre-qualification, performance marketing, and analytics tied directly to revenue.'
  },
  {
    question: 'Why do you specialize exclusively in Healthcare Organizations?',
    answer: 'High-ticket, decision-heavy industries like Healthcare require deep domain understanding. Patient acquisition requires clinical trust, medical compliance, authority profiling, and empathy. Broad agencies apply generic templates; we bring battle-tested playbooks engineered specifically for hospitals, clinics, IVF centres, dental groups, and diagnostic networks.'
  },
  {
    question: 'How does the AI Patient Qualification system work?',
    answer: 'When a prospective patient lands on your digital platform, our custom AI pre-qualification system engages them with conversational micro-questions (e.g. specialty needed, treatment urgency, preferred location). It filters out non-serious inquiries, answers common clinical FAQs 24/7, and instantly routes qualified leads directly to your patient care team via WhatsApp, SMS, or CRM.'
  },
  {
    question: 'How quickly can we expect measurable business results?',
    answer: 'Our initial Phase 1 Audit and Phase 2 Platform deployment typically complete within 3–4 weeks. Once performance campaigns and AI systems go live in Phase 3 & 4, our partners typically see an immediate uptick in qualified patient inquiries within the first 14 days, with full momentum and compounding ROI achieved within 60–90 days.'
  },
  {
    question: 'Do you work on monthly retainers or performance project engagements?',
    answer: 'We partner on a strategic growth basis combining an initial system implementation phase followed by a performance growth management retainer. This ensures complete alignment — our success is measured directly by your patient volume, consultation show-up rates, and overall healthcare organization revenue growth.'
  }
];
