import { IndustryData, ComparisonPoint, FrameworkStage, CapabilityItem, CaseStudy } from '../types';

export const INDUSTRY_DATA: Record<'healthcare' | 'wedding_venues', IndustryData> = {
  healthcare: {
    id: 'healthcare',
    title: 'Healthcare Growth Systems',
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
  },

  wedding_venues: {
    id: 'wedding_venues',
    title: 'Luxury Wedding Venues & Resorts',
    tagline: 'High-Value Booking Engine & Premium Brand Positioning',
    description: 'We position luxury wedding properties, destination resorts, and high-end venues to attract ultra-qualified wedding couples and premium event planners with predictable booking systems.',
    targetAudience: [
      'Luxury Wedding Venues',
      'Five-Star & Heritage Resorts',
      'Premium Banquet Halls',
      'Destination Wedding Properties',
      'Luxury Farmhouses & Estates'
    ],
    verticals: [
      {
        id: 'destination',
        title: 'Destination Wedding Resorts',
        description: 'Immersive virtual site tours, multi-day wedding package showcases, and global bride-to-be acquisition.',
        keyMetric: '$180K+ Avg Booking Value Funnels',
        iconName: 'Palmtree'
      },
      {
        id: 'luxury_estates',
        title: 'Luxury Estates & Venues',
        description: 'High-converting interactive brochures, dates-availability checkers, and high-net-worth inquiry funnels.',
        keyMetric: '4.2x Prime-Date Bookings',
        iconName: 'Castle'
      },
      {
        id: 'banquets',
        title: 'Premium Banquet Collections',
        description: 'Corporate event & luxury wedding dual-engine routing, floorplan visualizers, and instant pricing guides.',
        keyMetric: '+210% Site Tour Requests',
        iconName: 'Crown'
      }
    ],
    growthPillars: [
      {
        title: 'Immersive Cinematic Web Platform',
        description: 'Aesthetic, high-converting digital venue experiences featuring interactive floor plans, date inquiry widgets, and video tours.',
        impact: 'Captures emotional desire and justifies premium pricing.'
      },
      {
        title: 'Bride & Planner AI Pre-Qualification',
        description: 'Smart inquiry funnels that filter by guest count, budget threshold, target wedding date, and wedding planner involvement.',
        impact: 'Eliminates tire-kickers and delivers high-intent leads to your sales team.'
      },
      {
        title: 'High-Ticket Social & Search Campaigns',
        description: 'Omnichannel performance campaigns targeted at newly engaged couples, luxury event planners, and high-income demographics.',
        impact: 'Fills open prime weekend dates 12–18 months in advance.'
      },
      {
        title: 'Venue Tour & Proposal Automation',
        description: 'Automated site-visit scheduling, personalized proposal generation, and SMS date-hold reminders.',
        impact: 'Closes site visits into signed venue contracts 2.5x faster.'
      }
    ],
    metrics: [
      { label: 'Prime Weekend Dates Occupancy', value: '94%', subtext: 'Booked 12+ months in advance' },
      { label: 'Average Contract Value Increase', value: '+32%', subtext: 'Through premium digital positioning' },
      { label: 'Qualified Site Tour Conversion', value: '48%', subtext: 'Inquiries converting to in-person tours' },
      { label: 'Marketing ROI Multiple', value: '8.4x', subtext: 'Direct venue revenue generated vs ad spend' }
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
    mkGrowthPartner: 'Measurable ROI, verified patient appointments, and high-value venue contracts'
  },
  {
    dimension: 'Industry Expertise',
    traditionalAgency: 'Generic templates applied across dozens of unrelated industries',
    mkGrowthPartner: 'Deep specialization exclusively in Healthcare and Luxury Wedding Venues'
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
    title: 'Phase 1: Strategic Blueprint & Growth Audit',
    subtitle: 'Market Positioning & Unit Economics Analysis',
    description: 'We audit your current digital footprint, analyze competitor positioning, define target customer economics, and build your bespoke growth architecture.',
    deliverables: ['Competitor Gap Matrix', 'Patient / Bride Persona Mapping', 'Growth Funnel Architecture', 'ROI & Capacity Benchmark'],
    icon: 'Compass',
    techStack: ['Market Analytics', 'Audience Intelligence', 'Growth Modeling']
  },
  {
    id: 2,
    title: 'Phase 2: High-Converting Digital Web Platform',
    subtitle: 'Ultra-Sleek Enterprise Web Engineering',
    description: 'We build a high-speed, SEO-first digital flagship designed to establish immediate trust, showcase authority, and convert traffic into qualified inquiries.',
    deliverables: ['Next.js App Router Architecture', 'Clinical/Venue Storytelling Layouts', 'Interactive Tour/Booking Modules', 'SEO Schema & Core Web Vitals 95+'],
    icon: 'Layout',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Vercel']
  },
  {
    id: 3,
    title: 'Phase 3: AI Qualification & Lead Automation Engine',
    subtitle: 'Smart Routing & Frictionless Booking Workflows',
    description: 'We deploy AI-powered conversational systems that engage visitors 24/7, pre-qualify budget and intent, and seamlessly book consultations or site tours.',
    deliverables: ['AI Pre-Qualification Bots', 'Real-time SMS & WhatsApp Alerts', 'CRM & Calendar Integration', 'Automated Reminder Sequences'],
    icon: 'Bot',
    techStack: ['Firebase', 'AI Intent Triage', 'CRM Sync', 'WhatsApp API']
  },
  {
    id: 4,
    title: 'Phase 4: Precision Acquisition Marketing',
    subtitle: 'Multi-Channel Performance & Authority Campaigns',
    description: 'We engineer high-intent Google Search, Meta Social, and Local SEO campaigns designed to capture high-value patients and luxury venue bookers.',
    deliverables: ['High-Intent Search Campaigns', 'Geo-Targeted Social Funnels', 'Reputation & Review Growth Engine', 'Retargeting Ecosystem'],
    icon: 'TrendingUp',
    techStack: ['Google Ads (Search & Maps)', 'Meta Ads Manager', 'Local SEO Schema']
  },
  {
    id: 5,
    title: 'Phase 5: Scale, Revenue Analytics & LTV Optimization',
    subtitle: 'Data-Driven Optimization & Expansion',
    description: 'We continuously analyze pipeline metrics, test conversion variables, optimize ad spend performance, and implement patient/client retention funnels.',
    deliverables: ['Real-Time Growth Dashboard', 'A/B Conversion Rate Optimization', 'Cross-Specialty Referral Loops', 'Executive Strategy Reviews'],
    icon: 'BarChart3',
    techStack: ['Analytics Engine', 'Conversion Testing', 'LTV Automation']
  }
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'strategy',
    title: 'Growth Strategy & Brand Architecture',
    shortDesc: 'Position your organization as the undisputed leader in your region or sector.',
    fullDesc: 'We craft comprehensive positioning strategies, value propositions, and messaging frameworks that differentiate your brand from local competitors and justify premium pricing.',
    icon: 'Target',
    industryApplicability: 'both',
    features: ['Market Positioning Matrix', 'Customer Journey Mapping', 'Unit Economics & ROI Planning', 'Brand Messaging Standards'],
    businessOutcome: 'Elevates market perception and increases average contract/treatment value.'
  },
  {
    id: 'web_development',
    title: 'High-Converting Web Platforms',
    shortDesc: 'Custom-engineered, high-speed digital engines built for maximum conversion and search rank.',
    fullDesc: 'We build enterprise-grade web applications using modern, modular tech stacks. Focused on speed, accessibility, SEO schema, and intuitive user paths.',
    icon: 'Code2',
    industryApplicability: 'both',
    features: ['Next.js / React Architecture', 'Core Web Vitals 95+ Performance', 'Interactive Booking & Quiz Funnels', 'Comprehensive Structured Data SEO'],
    businessOutcome: 'Converts 3x to 5x more website traffic into verified business inquiries.'
  },
  {
    id: 'ai_systems',
    title: 'AI Patient & Booking Qualification',
    shortDesc: 'Automate lead triage 24/7 so your team only spends time on high-value prospects.',
    fullDesc: 'Our AI qualification engines instantly answer common patient/bride questions, gather essential budget and timeline details, and schedule appointments automatically.',
    icon: 'Cpu',
    industryApplicability: 'both',
    features: ['24/7 Smart Conversational Triage', 'Budget & Intent Pre-Screening', 'Automated SMS/WhatsApp Instant Response', 'Direct EHR / CRM Synchronization'],
    businessOutcome: 'Eliminates cold lead chasing and lowers cost per acquired patient/booking by up to 45%.'
  },
  {
    id: 'performance_marketing',
    title: 'Performance Growth Marketing',
    shortDesc: 'Data-backed Google Search, Meta, and Local SEO campaigns engineered for revenue.',
    fullDesc: 'We run high-precision, search-intent campaigns targeting high-ticket treatments (IVF, Implant, Cosmetic) or prime wedding venue searches in your geographic zone.',
    icon: 'Zap',
    industryApplicability: 'both',
    features: ['Google Search & Maps Domination', 'Meta (Instagram/FB) Visual Acquisition', 'Hyper-Local Geo-Fenced Ads', 'A/B Creative & Landing Page Testing'],
    businessOutcome: 'Generates predictable, qualified lead volume month after month.'
  },
  {
    id: 'reputation_system',
    title: 'Reputation & LTV Retention Engines',
    shortDesc: 'Turn satisfied patients and venue clients into organic brand advocates.',
    fullDesc: 'Automated review generation workflows and post-service follow-up sequences that systematically build 5-star Google ratings and referral networks.',
    icon: 'ShieldCheck',
    industryApplicability: 'both',
    features: ['Automated Review Request Workflows', 'Private Feedback Escalation Paths', 'Patient Re-engagement Loops', 'Referral & Review Widgets'],
    businessOutcome: 'Builds dominant local search rankings and organic word-of-mouth momentum.'
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
    id: 'destination_wedding_resort',
    clientCategory: 'Luxury Heritage Resort & Destination Venue',
    industry: 'wedding_venues',
    title: 'Achieving 96% Prime Weekend Occupancy & $2.2M Annual Booking Growth',
    challenge: 'A high-end 5-star venue was losing prime dates to competitor properties due to a outdated website and slow inquiry response times.',
    solution: 'Engineered a cinematic web platform with interactive venue date checker, 3D site walkthroughs, and automated instant venue proposal delivery.',
    results: [
      { metric: '96%', label: 'Prime Weekend Dates Booked' },
      { metric: '3.8x', label: 'Inquiry-to-Site-Tour Conversion' },
      { metric: '$2.2M', label: 'Incremental Venue Booking Value' }
    ],
    quote: {
      text: 'The positioning and automated tour scheduling built by MK Digitalverse allowed us to increase venue pricing by 25% while booking out our peak dates a year early.',
      author: 'R. Malhotra',
      role: 'Head of Hospitality & Weddings'
    }
  }
];

export const FAQS = [
  {
    question: 'How is MK Digitalverse different from a traditional marketing agency?',
    answer: 'Traditional agencies sell generic, tactical services like posting on social media, running basic ad campaigns, or designing static templates. MK Digitalverse operates as a Digital Growth Partner. We design, deploy, and manage complete business growth systems tailored specifically to Healthcare and Luxury Wedding Venues — combining strategy, enterprise web platforms, AI pre-qualification, performance marketing, and analytics tied directly to revenue.'
  },
  {
    question: 'Why do you specialize exclusively in Healthcare and Luxury Wedding Venues?',
    answer: 'High-ticket, decision-heavy industries like Healthcare and Luxury Venues require deep domain understanding. Patient acquisition requires clinical trust, HIPAA/medical compliance, and empathy. Venue booking requires emotional positioning, high contract value qualification, and dates management. Broad agencies apply generic templates; we bring battle-tested playbooks engineered for these exact industries.'
  },
  {
    question: 'How does the AI Patient / Lead Qualification system work?',
    answer: 'When a prospective patient or wedding couple lands on your digital platform, our custom AI pre-qualification system engages them with conversational micro-questions (e.g. specialty needed, guest count, estimated budget, preferred timeline). It filters out non-serious inquiries, answers common FAQs 24/7, and instantly routes qualified leads directly to your sales or patient care team via WhatsApp, SMS, or CRM.'
  },
  {
    question: 'How quickly can we expect measurable business results?',
    answer: 'Our initial Phase 1 Audit and Phase 2 Platform deployment typically complete within 3–4 weeks. Once performance campaigns and AI systems go live in Phase 3 & 4, our partners typically see an immediate uptick in qualified inquiries within the first 14 days, with full momentum and compounding ROI achieved within 60–90 days.'
  },
  {
    question: 'Do you work on monthly retainers or performance project engagements?',
    answer: 'We partner on a strategic growth basis combining an initial system implementation phase followed by a performance growth management retainer. This ensures complete alignment — our success is measured directly by your patient volume, venue booking rates, and overall revenue growth.'
  }
];
