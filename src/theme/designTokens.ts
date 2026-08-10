/**
 * MK Digitalverse Design System Tokens (DS-01)
 * Operating System for Design Rules, Colors, Typography, Spacing, & Elevation
 */

export const DESIGN_TOKENS = {
  // 1. Typography System
  typography: {
    fonts: {
      sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      display: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      serif: "'Playfair Display', Georgia, serif",
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
    scale: {
      displayXl: {
        fontSize: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight",
        lineHeight: "leading-[1.1]",
        description: "Hero display headline"
      },
      displayLg: {
        fontSize: "text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight",
        lineHeight: "leading-[1.15]",
        description: "Primary section heading"
      },
      h1: {
        fontSize: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight",
        lineHeight: "leading-snug",
        description: "Feature block title"
      },
      h2: {
        fontSize: "text-xl sm:text-2xl font-bold tracking-tight",
        lineHeight: "leading-snug",
        description: "Card & module header"
      },
      h3: {
        fontSize: "text-lg sm:text-xl font-bold",
        lineHeight: "leading-normal",
        description: "Sub-card header"
      },
      h4: {
        fontSize: "text-base font-semibold",
        lineHeight: "leading-normal",
        description: "Minor group title"
      },
      h5: {
        fontSize: "text-sm font-semibold uppercase tracking-wider",
        lineHeight: "leading-normal",
        description: "Eyebrow / label header"
      },
      bodyLarge: {
        fontSize: "text-base sm:text-lg",
        lineHeight: "leading-relaxed",
        description: "Lead paragraphs"
      },
      bodyRegular: {
        fontSize: "text-sm sm:text-base",
        lineHeight: "leading-relaxed",
        description: "Standard body text"
      },
      bodySmall: {
        fontSize: "text-xs sm:text-sm",
        lineHeight: "leading-normal",
        description: "Supporting card copy"
      },
      caption: {
        fontSize: "text-[11px] font-mono",
        lineHeight: "leading-normal",
        description: "Technical metadata & timestamps"
      },
      label: {
        fontSize: "text-[10px] font-bold uppercase tracking-widest",
        lineHeight: "leading-none",
        description: "Pills, badges & tags"
      }
    }
  },

  // 2. Color System
  colors: {
    brand: {
      navy: { hex: "#050505", label: "Dark Canvas Base" },
      royal: { hex: "#09090b", label: "Glass Card Base" },
      amber: { hex: "#fbbf24", label: "Healthcare Primary Accent" },
      emerald: { hex: "#34d399", label: "Secondary Practice Accent" },
      cyan: { hex: "#22d3ee", label: "Systems & Data Accent" },
      gold: { hex: "#f59e0b", label: "Premium / Luxury Accent" }
    },
    neutral: {
      950: { hex: "#050505", label: "Background Void" },
      900: { hex: "#09090b", label: "Elevated Surface" },
      800: { hex: "#18181b", label: "Border / Subtle Surface" },
      700: { hex: "#27272a", label: "Muted Divider" },
      600: { hex: "#3f3f46", label: "Secondary Border" },
      500: { hex: "#71717a", label: "Muted Text / Metadata" },
      400: { hex: "#a1a1aa", label: "Body Text Secondary" },
      300: { hex: "#d4d4d8", label: "Body Text Primary" },
      200: { hex: "#e4e4e7", label: "High Contrast Text" },
      100: { hex: "#f4f4f5", label: "Surface Highlight" },
      50: { hex: "#fafafa", label: "Pure Highlighting" }
    },
    semantic: {
      success: { hex: "#10b981", bg: "bg-emerald-950/60", border: "border-emerald-500/30", text: "text-emerald-400" },
      warning: { hex: "#f59e0b", bg: "bg-amber-950/60", border: "border-amber-500/30", text: "text-amber-400" },
      danger: { hex: "#f43f5e", bg: "bg-rose-950/60", border: "border-rose-500/30", text: "text-rose-400" },
      info: { hex: "#06b6d4", bg: "bg-cyan-950/60", border: "border-cyan-500/30", text: "text-cyan-400" }
    }
  },

  // 3. Spacing Scale (8px Grid Rules)
  spacing: [
    { value: "4px", class: "p-1 gap-1", label: "3xs (4px)" },
    { value: "8px", class: "p-2 gap-2", label: "2xs (8px)" },
    { value: "12px", class: "p-3 gap-3", label: "xs (12px)" },
    { value: "16px", class: "p-4 gap-4", label: "sm (16px)" },
    { value: "24px", class: "p-6 gap-6", label: "md (24px)" },
    { value: "32px", class: "p-8 gap-8", label: "lg (32px)" },
    { value: "48px", class: "p-12 gap-12", label: "xl (48px)" },
    { value: "64px", class: "p-16 gap-16", label: "2xl (64px)" },
    { value: "80px", class: "p-20 gap-20", label: "3xl (80px)" },
    { value: "96px", class: "p-24 gap-24", label: "4xl (96px)" },
    { value: "120px", class: "py-30 gap-30", label: "5xl (120px)" }
  ],

  // 4. Border Radius Scale
  radii: [
    { name: "sm", value: "8px", class: "rounded-lg" },
    { name: "md", value: "12px", class: "rounded-xl" },
    { name: "lg", value: "16px", class: "rounded-2xl" },
    { name: "xl", value: "24px", class: "rounded-3xl" },
    { name: "full", value: "9999px", class: "rounded-full" }
  ],

  // 5. Elevation & Shadow Levels
  elevation: {
    small: "shadow-md shadow-black/40",
    medium: "shadow-xl shadow-black/60",
    large: "shadow-2xl shadow-black/80"
  },

  // 6. Motion Rules
  motion: {
    duration: {
      fast: "150ms",
      normal: "250ms",
      slow: "350ms"
    },
    easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  },

  // 7. Grid & Breakpoints
  grid: {
    desktop: "grid-cols-12 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    tablet: "grid-cols-8 gap-6 px-6",
    mobile: "grid-cols-4 gap-4 px-4"
  }
};

export const DESIGN_MANIFESTO = "We don't design websites to impress visitors. We design digital experiences that build trust, communicate expertise, and help healthcare organizations make confident growth decisions.";

export const DESIGN_PHILOSOPHY = {
  identity: "Healthcare Digital Growth Consultancy Platform",
  goldenRule: "Would a hospital CEO feel confident booking a meeting after seeing this page?",
  formula: {
    strategy: "40%",
    trust: "25%",
    simplicity: "15%",
    innovation: "10%",
    motion: "10%"
  },
  personality: [
    "Strategic", "Premium", "Professional", "Calm", 
    "Intelligent", "Modern", "Confident", "Trustworthy", 
    "Minimal", "Purposeful"
  ]
};

export const VISUAL_LANGUAGE_SYSTEM = {
  themeName: "Strategic Minimalism",
  positioning: "Premium Healthcare Business Consultancy",
  inspirationMix: {
    apple: "40% (Whitespace & Focus)",
    stripe: "25% (Clean Product Storytelling)",
    linear: "20% (Premium Minimalism)",
    mckinsey: "10% (Executive Credibility)",
    healthcare: "5% (Clinical Trust & Authority)"
  },
  colors: {
    primary: "Deep Navy (Trust & Leadership)",
    secondary: "Professional Blue (Innovation & Healthcare)",
    accent: "Amber/Gold (Action, Energy, CTA Only)",
    neutrals: "11-step Grayscale (950 to 50 for Calm UI)"
  },
  radiusRules: {
    buttons: "12px (rounded-xl)",
    cards: "20px (rounded-2xl)",
    inputs: "12px (rounded-xl)",
    dialogs: "24px (rounded-3xl)"
  },
  layoutRhythm: [
    "Whitespace",
    "Headline",
    "Supporting Copy",
    "Visual / Interactive Demo",
    "CTA",
    "Whitespace"
  ],
  containerMaxWidth: "1280px (max-w-7xl)",
  cardSpecs: {
    style: "Large, airy, soft 20px radius, thin 1px border, minimal shadow",
    rule: "One message, one CTA, one purpose per card"
  },
  visualFormula: "Trust + Whitespace + Typography + Healthcare Focus + Business Strategy + Subtle Motion = Premium Experience",
  theOneRule: "One Hero, One Primary Message, One Primary CTA, One Story, One Conversion Goal"
};

export const SIGNATURE_BRAND_EXPERIENCE = {
  philosophy: "Look how clearly we think.",
  progression: ["Confidence", "Clarity", "Trust", "Authority", "Action"],
  heroSignature: "Split layout: Strategic executive narrative on left + Healthcare Growth Dashboard on right",
  signatureBackgrounds: "Blueprint-inspired line grids, minimal dot matrices, soft subtle geometric patterns",
  insightCards: [
    { metric: "+42%", label: "Patient Enquiries", status: "Active Growth" },
    { metric: "3.8%", label: "Website Conversion", status: "Industry Peak" },
    { metric: "4.9★", label: "Reputation Score", status: "Verified Trust" },
    { metric: "High", label: "Growth Opportunity", status: "Strategic Target" }
  ],
  notebookStyle: "Subtle blueprint grid overlays, flow diagrams, structured annotations, executive working document aesthetic",
  journeyMap: [
    { section: "Hero", question: "Can you help us grow?" },
    { section: "Industry Challenges & Solutions", question: "Do you understand our problems?" },
    { section: "Growth System™ Framework", question: "How do you solve them?" },
    { section: "Growth Capabilities", question: "What capabilities make it possible?" },
    { section: "Differentiation & Case Studies", question: "Why should we trust you?" },
    { section: "Growth Assessment Calculator", question: "What opportunity are we missing?" },
    { section: "Executive FAQs", question: "What concerns should be addressed?" },
    { section: "Discovery Call CTA", question: "What's the next step?" }
  ]
};

export const PREMIUM_MICRO_INTERACTIONS = {
  principle: "The best interaction is the one users don't notice—but appreciate.",
  timings: {
    hover: "150–200 ms",
    buttonPress: "100 ms",
    cards: "200–250 ms",
    modal: "250–300 ms",
    pageTransition: "300–400 ms"
  },
  confidenceIndicators: [
    "Typically responds within one business day.",
    "Healthcare-focused growth specialists.",
    "No-obligation Discovery Call.",
    "Your information is kept confidential."
  ],
  navigationRules: {
    stickyHeader: "Transparent over hero → Solid surface with subtle shadow on scroll (200-300ms smooth transition)",
    activeHighlight: "Subtle underline, accent border, or refined opacity shift"
  },
  ctaRules: {
    default: "Deep Navy / Solid Primary Surface",
    hover: "Translate Y -2px, soft elevation, smooth color transition",
    click: "Scale down (0.98), instant tactile feedback",
    loading: "Inline spinner replacement, prevent duplicate submissions"
  },
  successExperience: {
    header: "✔ Your request has been received.",
    steps: [
      "1. We'll review your healthcare organization's profile.",
      "2. A Senior Growth Strategist will analyze your digital ecosystem.",
      "3. You'll receive your meeting confirmation and tailored audit outline."
    ]
  },
  finalRule: "Every click should increase confidence. Every scroll should reduce uncertainty. Every page should make the next step feel obvious."
};

export const RIGHT_FIT_PRINCIPLE = {
  statement: "Our goal isn't to work with the most healthcare organizations. Our goal is to partner with the right healthcare organizations—those committed to building measurable, sustainable business growth.",
  partnershipPhilosophy: "MK Digitalverse isn't the right partner for every healthcare organization. We partner with organizations that are serious about building measurable, long-term business growth through strategy, technology, and continuous improvement.",
  ctaFraming: "Let's see if we're the right growth partner for your organization.",
  subtletyRule: "Avoid overusing the word 'Premium'. Let visitors conclude quality through sophisticated design, executive-level language, clear strategic thinking, and a selective partnership process.",
  fitCriteria: {
    greatFit: [
      "Want predictable patient growth.",
      "Value strategy before execution.",
      "Are committed to long-term business growth.",
      "Want to build a trusted healthcare brand.",
      "Are ready to invest in systems that scale."
    ],
    notFit: [
      "Need a one-time website with no growth plan.",
      "Are only looking for the lowest-cost provider.",
      "Expect instant results without a long-term strategy.",
      "View marketing as isolated tasks instead of a business growth system."
    ]
  },
  copyReframings: {
    hero: "Helping ambitious healthcare organizations build measurable, long-term business growth.",
    about: "We believe meaningful growth comes from strategy, consistency, and long-term partnerships—not short-term marketing campaigns.",
    solutions: "Our growth capabilities are designed for healthcare organizations committed to sustainable growth, stronger patient relationships, and continuous improvement."
  }
};

export const BRAND_EXPERIENCE_STANDARDS = {
  positioningStatementV1: "MK Digitalverse is a Digital Growth Partner helping ambitious healthcare organizations achieve measurable, long-term business growth through strategy, brand positioning, conversion-focused websites, AI-powered business systems, and performance marketing.",
  experienceFormula: "Strategic Thinking + Healthcare Expertise + Premium Design + Structured Systems + Educational Content + Long-Term Partnership = Business Growth",
  executiveTest: "Would a hospital CEO feel confident sharing this with their leadership team?",
  twelvePrinciples: [
    { num: "01", title: "Business Growth Over Marketing", desc: "We never sell isolated tactics. We deliver measurable business growth." },
    { num: "02", title: "Partnership Over Projects", desc: "We seek long-term growth partners whose success defines our outcome." },
    { num: "03", title: "Selective Positioning", desc: "Selective partnership for healthcare organizations serious about growth." },
    { num: "04", title: "Strategy Before Execution", desc: "Deep strategic alignment precedes design, code, and campaigns." },
    { num: "05", title: "Clarity Over Complexity", desc: "Executive simplicity that healthcare leaders understand in seconds." },
    { num: "06", title: "Trust Before Conversion", desc: "Understand → Educate → Build Trust → Demonstrate Expertise → Invite Conversation." },
    { num: "07", title: "Premium Through Restraint", desc: "Confidence expressed through clean design and structured thinking." },
    { num: "08", title: "One Clear Message Per Page", desc: "Singular focus per view to eliminate distraction and friction." },
    { num: "09", title: "Educate, Don't Sell", desc: "Leave every visitor genuinely better informed than when they arrived." },
    { num: "10", title: "The Right-Fit Qualification", desc: "Help organizations determine mutual strategic alignment transparently." },
    { num: "11", title: "Business Purpose for Every Investment", desc: "Every feature, animation, and asset must directly serve growth." },
    { num: "12", title: "The Executive Standard", desc: "Every artifact must pass the Hospital CEO leadership review test." }
  ]
};

export const THE_TRUST_PYRAMID = {
  layers: [
    { level: 5, title: "Partnership", description: "Mutual strategic alignment as long-term Digital Growth Partner" },
    { level: 4, title: "Proof & Results", description: "Trust Library: verified case studies, patient growth metrics, executive testimonials" },
    { level: 3, title: "Authority & Expertise", description: "Healthcare Growth System™, proprietary frameworks, strategic domain mastery" },
    { level: 2, title: "Process & Transparency", description: "Clear 6-stage growth pipeline: Discovery → Audit → Strategy → Implementation → Measurement → Optimization" },
    { level: 1, title: "First Impression (5-Sec)", description: "Who we are, who we serve (Hospitals, Clinics, IVF, Dental, Labs), and measurable outcome" }
  ],
  trustLibraryFolders: [
    "Client Logos", "Testimonials", "Google Reviews", "WhatsApp Reviews",
    "LinkedIn Recommendations", "Awards & Certificates", "Speaking & Media",
    "Growth Results", "Case Studies", "Website Projects", "Brand Systems"
  ],
  trustScore7Checklist: [
    "Is the target healthcare audience immediately clear?",
    "Is the strategic growth outcome immediately clear?",
    "Does the page transparently explain our growth process?",
    "Does the page show verified evidence and results?",
    "Does it demonstrate deep healthcare domain expertise?",
    "Does it systematically reduce perceived executive risk?",
    "Does it make the next strategic step obvious?"
  ]
};

export const READINESS_ASSESSMENT_QUESTIONS = [
  {
    id: "q1",
    question: "Do you have a documented, repeatable patient acquisition strategy?",
    category: "Strategy & Positioning",
    options: [
      { text: "Yes, fully documented and tracked monthly", weight: 3 },
      { text: "Partially, mostly word-of-mouth and ad-hoc campaigns", weight: 1 },
      { text: "No, we rely entirely on walk-ins and referrals", weight: 0 }
    ]
  },
  {
    id: "q2",
    question: "Does your website consistently generate high-intent patient enquiries?",
    category: "Conversion Engine",
    options: [
      { text: "Yes, predictable flow of qualified patient bookings", weight: 3 },
      { text: "Inconsistent, traffic comes but conversion is low", weight: 1 },
      { text: "No, website acts purely as a static digital brochure", weight: 0 }
    ]
  },
  {
    id: "q3",
    question: "Do you actively track enquiry-to-appointment conversion rates?",
    category: "Analytics & Systems",
    options: [
      { text: "Yes, closed-loop analytics from click to consultation", weight: 3 },
      { text: "We track form fills but not actual doctor consultations", weight: 1 },
      { text: "No analytics or conversion tracking in place", weight: 0 }
    ]
  },
  {
    id: "q4",
    question: "Do you actively manage and scale your online healthcare reputation?",
    category: "Reputation & Trust",
    options: [
      { text: "Automated review generation and active sentiment monitoring", weight: 3 },
      { text: "Occasional manual review requests to patients", weight: 1 },
      { text: "Unmanaged reviews or low rating presence", weight: 0 }
    ]
  },
  {
    id: "q5",
    question: "Do you have automated lead follow-up and patient nurture workflows?",
    category: "Automation & Growth",
    options: [
      { text: "Yes, instant WhatsApp/SMS/Email automated response engine", weight: 3 },
      { text: "Manual follow-ups by front desk staff when time permits", weight: 1 },
      { text: "No automated response system", weight: 0 }
    ]
  }
];

export const HEALTHCARE_DECISION_JOURNEY = {
  boardroomTest: "Would this page demonstrate strategic thinking, build confidence, and justify a serious business conversation in a hospital board meeting?",
  buyerPersonas: [
    "Hospital Owner", "Managing Director", "CEO", "Practice Manager", "Marketing Head", "Clinic Founder"
  ],
  decisionQuestions: [
    { num: "Q1", question: "Do you understand healthcare?", response: "Healthcare-first positioning, industry language, and Healthcare Growth System™." },
    { num: "Q2", question: "Can you actually help us?", response: "Growth methodology, verified case studies, patient metrics, and executive testimonials." },
    { num: "Q3", question: "How do you work?", response: "Strategic Discovery Call → Healthcare Growth Audit™ → Growth Roadmap → Implementation." },
    { num: "Q4", question: "Can we trust you?", response: "Awards, speaking engagements, proprietary frameworks, and transparent client reviews." },
    { num: "Q5", question: "Are you the right partner?", response: "Right-fit philosophy, long-term partnership commitment, and selective engagement." },
    { num: "Q6", question: "What's the next step?", response: "Book a Strategic Discovery Call — one clear, low-friction conversion path." }
  ],
  conversationDialogue: [
    { thought: "We need more patients.", response: "Here's why growth stalls and how our system addresses root causes." },
    { thought: "We've tried marketing before.", response: "Here's how our growth partner model is fundamentally different from tactical agencies." },
    { thought: "Can we trust you?", response: "Here's our methodology, proprietary frameworks, and verified healthcare outcomes." },
    { thought: "Is this right for us?", response: "Here's who we work with and our transparent Right-Fit evaluation criteria." },
    { thought: "What happens next?", response: "Book a Strategic Discovery Call to evaluate mutual strategic alignment." }
  ],
  featureToOutcomeReframings: [
    { feature: "AI-powered CRM", outcome: "A structured patient enquiry management system that reduces manual follow-up and improves response consistency." },
    { feature: "Website Redesign", outcome: "A conversion-focused digital experience designed to turn more visitors into qualified patient enquiries." },
    { feature: "SEO & Performance Ads", outcome: "A predictable patient acquisition engine that captures high-intent healthcare search demand." }
  ]
};

export const TECHNICAL_EXCELLENCE_AND_SEO = {
  fiveYearVision: "Will this technical decision still make sense when MK Digitalverse has 500+ clients, multiple digital products, AI tools, a client portal, an LMS, and a Healthcare Growth Platform?",
  technicalMission: "Build India's best-performing healthcare consultancy digital growth platform—technically, structurally, and strategically for decision-makers, search engines, AI search engines, and engineering scalability.",
  coreWebVitalsTargets: [
    { metric: "LCP (Largest Contentful Paint)", target: "< 2.5s", priority: "Critical - High visual perception" },
    { metric: "INP (Interaction to Next Paint)", target: "< 200ms", priority: "Critical - Immediate input response" },
    { metric: "CLS (Cumulative Layout Shift)", target: "< 0.1", priority: "Critical - Zero visual jumpiness" }
  ],
  tenPillars: [
    { num: "01", name: "Information Architecture", desc: "Content Ecosystem with topic clusters and clean URL routing." },
    { num: "02", name: "Topic Clusters", desc: "Authority hubs around Healthcare Digital Growth linking sub-guides." },
    { num: "03", name: "Technical SEO", desc: "Meta, canonicals, Open Graph, Twitter cards, and XML sitemaps." },
    { num: "04", name: "Structured Data (JSON-LD)", desc: "Rich schema for Organization, FAQ, Breadcrumbs, and Services." },
    { num: "05", name: "Core Web Vitals", desc: "Sub-2.5s LCP, sub-200ms INP, and zero CLS layout shift." },
    { num: "06", name: "Performance Standards", desc: "WebP images, lazy loading, font optimization, and code splitting." },
    { num: "07", name: "Accessibility (WCAG 2.2 AA)", desc: "Full keyboard nav, visible focus, ARIA tags, high contrast." },
    { num: "08", name: "Executive Analytics", desc: "Track high-value business events (Discovery Call, Audit Requests)." },
    { num: "09", name: "Security & Trust", desc: "Firestore Security Rules, input validation, and HTTPS encryption." },
    { num: "10", name: "Scalability (5-Year Architecture)", desc: "Pluggable modules for Client Portal, LMS, AI Tools, and CRM." }
  ],
  aeoQuestions: [
    {
      q: "How can a hospital or healthcare organization build predictable patient enquiry growth?",
      a: "By implementing an integrated Healthcare Growth System™ combining brand positioning, conversion-focused digital assets, AI enquiry follow-ups, and closed-loop acquisition analytics."
    },
    {
      q: "Why do traditional clinic websites fail to generate qualified appointments?",
      a: "Most clinic websites act as static brochureware without conversion friction reduction, trust signals, or structured patient enquiry management systems."
    },
    {
      q: "What is a Healthcare Growth Audit™?",
      a: "A comprehensive strategic evaluation analyzing patient acquisition funnels, digital visibility, reputation sentiment, conversion leakage, and operational enquiry follow-ups."
    }
  ]
};

export const COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING = {
  mission: "Build a reusable design and development system so every future page, service, SaaS module, Client Portal, and LMS automatically follows the same design language. Never redesign. Only extend.",
  eightyPercentRule: "Can an existing component be extended to solve this problem? If yes, extend it. Never create duplicate buttons, cards, or layouts.",
  designHierarchy: [
    { level: 1, name: "Design Tokens", desc: "Primitive values for Colors, Typography, Spacing Scale (4,8,12,16,24,32,48,64,96,128), Radius, and Shadows." },
    { level: 2, name: "Base Components", desc: "Atomic UI elements: Primary/Secondary Buttons, Cards, Form Controls, Badges, Icons." },
    { level: 3, name: "Composite Components", desc: "Molecules combining base elements: Hero Header, Testimonial Grid, FAQ Accordion, Framework Diagrams." },
    { level: 4, name: "Page Sections", desc: "Organized functional layouts: HealthcareReadinessAssessment, HealthcareDecisionJourney, RightFitEvaluation." },
    { level: 5, name: "Templates", desc: "Standardized page blueprints: Homepage, ServicePage, CaseStudy, LandingPage, About, Contact." },
    { level: 6, name: "Pages", desc: "Assembled, production-ready views utilizing centralized templates and lazy-loaded components." }
  ],
  folderStructure: [
    "/src/components/ui/design-system",
    "/src/features/home",
    "/src/features/solutions",
    "/src/features/calculator",
    "/src/features/design-system",
    "/src/theme/designTokens.ts"
  ],
  centralizedAnimations: [
    { name: "Fade Up", class: "motion-fade-up", duration: "0.3s ease-out" },
    { name: "Scale Reveal", class: "motion-scale-reveal", duration: "0.25s cubic-bezier" },
    { name: "Stagger Children", class: "motion-stagger-group", duration: "0.1s delay per item" },
    { name: "Hover Lift", class: "hover:-translate-y-1 hover:shadow-2xl", duration: "0.2s transition-all" }
  ]
};

export const BRAND_DESIGN_SYSTEM_V1 = {
  version: "1.0",
  philosophy: "Show the idea. Don't explain the idea. (80% Visual Storytelling, 20% Text)",
  brandPersonality: [
    "Premium", "Strategic", "Intelligent", "Professional", "Trustworthy",
    "Modern", "Clean", "Human-centric", "Results-oriented"
  ],
  colors: {
    backgrounds: ["Warm White (#FAFAFAF0)", "Soft Ivory (#FFFDF9)", "Cream (#FDFBF7)", "Very Light Beige (#F5F2EB)"],
    primaryAccent: "Luxury Gold / Champagne Gold (#D4AF37, #F3E5AB, #E6C687)",
    secondaryAccent: "Deep Navy Blue / Corporate Blue (#0B192C, #1E3A8A)",
    supporting: ["Very Light Healthcare Blue", "Soft Grey", "Off White", "Muted Beige"]
  },
  mood: {
    always: ["Bright", "Open", "Premium", "Minimal", "Luxury", "Confident", "Trustworthy", "Innovative"],
    never: ["Dark/Heavy", "Flashy", "Salesy", "Crowded", "Cheap-looking"]
  },
  backgroundStyles: [
    "Soft clinic blur", "Luxury office blur", "Bright reception area",
    "Medical hallway", "Natural light", "Subtle glow", "Bokeh lighting"
  ],
  heroSubjects: [
    "Doctor", "Clinic Owner", "Hospital Administrator", "Patient",
    "Healthcare Professional", "Digital Dashboard", "3D Infographic Object"
  ],
  visualStorytellingIcons: [
    { concept: "Trust", visual: "Shield icon" },
    { concept: "Growth", visual: "Upward graph" },
    { concept: "Bookings", visual: "Calendar" },
    { concept: "Reviews", visual: "5-Star rating icons" },
    { concept: "Authority", visual: "Doctor credentials badge" },
    { concept: "Visibility", visual: "Search lens icon" },
    { concept: "Automation", visual: "Precision gear / network nodes" },
    { concept: "Revenue", visual: "₹ / $ icon + upward velocity" }
  ],
  infographicDiagrams: [
    "Circular diagrams", "Puzzle pieces", "Flowcharts", "Funnels",
    "Roadmaps", "Growth ladders", "Patient journeys", "Decision trees", "Hub-and-spoke", "Blueprints"
  ],
  textRules: {
    hook: "8–12 words max",
    supportingStatement: "10–20 words max",
    cta: "3–6 words max",
    rule: "If depth is needed, use multi-step carousels or progressive disclosure."
  },
  consultativeCTAs: [
    "Book a Free Growth Audit",
    "Let's Build Your Growth System",
    "Discover What's Holding You Back",
    "Start Growing Smarter",
    "Build a Clinic Patients Choose"
  ]
};

export const WEBSITE_VISUAL_SYSTEM_V1 = {
  version: "1.0",
  philosophy: "Every visual must have a purpose. Show the idea; don't explain with generic text.",
  rule60_30_10: {
    cleanLayout: "60% Clean Layout & Generous White Space",
    premiumImagery: "30% Premium Custom Visuals & Glassmorphic Diagrams",
    motionAndVideo: "10% Subtle Looping Video & Micro-Interactions"
  },
  visualBalanceRatio: "40% Visual / 60% Content",
  patientAcquisitionJourney: [
    { step: "01", title: "Patient Search", desc: "Patient searches 'specialist clinic near me'", icon: "🔍", metric: "High Intent Demand" },
    { step: "02", title: "Website Visit", desc: "Arrives at conversion-focused digital experience", icon: "🌐", metric: "Sub-2.5s LCP" },
    { step: "03", title: "Trust Building", desc: "Sees hospital credentials, reviews, and Healthcare Growth System™", icon: "🛡️", metric: "5-Star Authority" },
    { step: "04", title: "Appointment Booking", desc: "Seamless booking via single Strategic Discovery CTA", icon: "📅", metric: "+45% Conversion" },
    { step: "05", title: "Treatment", desc: "Patient attends consultation with confidence", icon: "🏥", metric: "Qualified Care" },
    { step: "06", title: "Review & Referral", desc: "Automated feedback loop generates reputation velocity", icon: "⭐", metric: "Looping Growth" }
  ],
  heroSectionVisualStandards: [
    { section: "Homepage", visual: "Doctor looking confidently toward a glowing growth dashboard", video: "5-8s looping hospital reception & clinic blur" },
    { section: "Healthcare Services", visual: "Hospital administrator reviewing analytics on a tablet", video: "Cinematic strategy planning & team collaboration" },
    { section: "AI Automation", visual: "Doctor interacting with holographic AI patient management elements", video: "AI enquiry response workflow" },
    { section: "Performance Marketing", visual: "Digital dashboard showing patient growth metrics & ROI", video: "Real-time enquiry stream animation" },
    { section: "Website Development", visual: "Responsive digital platform across desktop, tablet, and mobile", video: "Subtle responsive layout showcase" }
  ],
  avoidList: [
    "Generic handshake stock photos",
    "Overly posed smiling business teams",
    "Cartoon illustrations",
    "Bright neon gradients",
    "Auto-playing videos with sound",
    "Decorative visuals that don't support the message"
  ]
};

export const DESIGN_SYSTEM_V2_DES02 = {
  version: "2.0",
  title: "DES-02 | MK Digitalverse Design System v2.0",
  coreMotto: "Design is not decoration. Design is a business growth tool.",
  visualPersonality: "Apple × Stripe × Linear × Mayo Clinic × McKinsey",
  brandFeelings: {
    yes: ["Premium", "Intelligent", "Strategic", "Trustworthy", "Healthcare-focused", "Modern", "Calm", "Growth-oriented", "Executive"],
    no: ["Marketing agency", "Freelancer", "Website company", "Cheap", "Salesy"]
  },
  colourSystem: {
    background: "Cream White (#FAF8F3) / Warm Ivory",
    accents: "Premium Gold, Champagne Gold, Soft Metallic Gold, Gold Gradient",
    primaryText: "Deep Navy (#0B192C) & Dark Charcoal",
    supporting: ["Healthcare Blue", "Light Grey", "Soft Beige", "Muted Gold"]
  },
  goldRibbonMotif: "Flowing gold ribbon subtly appearing across sections, guiding the eye and symbolizing connected growth systems.",
  sectionFormulas: [
    { layout: "Layout A", name: "Text Left + Visual Right", desc: "Executive messaging paired with glassmorphic growth system visual" },
    { layout: "Layout B", name: "Visual Left + Content Right", desc: "Interactive healthcare analytics paired with key strategic pillars" },
    { layout: "Layout C", name: "Centered Framework", desc: "High-level strategic architecture diagrams and decision trees" },
    { layout: "Layout D", name: "Video Background", desc: "Subtle 6-second looping clinic/reception micro-films" },
    { layout: "Layout E", name: "Infographic", desc: "Patient acquisition journey and connected node workflows" },
    { layout: "Layout F", name: "Executive Dashboard", desc: "Real-time healthcare growth metrics, appointments & ROI" }
  ],
  systemDiagrams: [
    {
      name: "Patient Acquisition System",
      nodes: ["Google Search 🔍", "Website 🌐", "Trust 🛡️", "Appointment 📅", "Treatment 🏥", "Review ⭐", "Referral 🔄"]
    },
    {
      name: "Clinic Growth System",
      nodes: ["SEO & Ads 📈", "Conversion Website 🌐", "CRM & AI Automation 🤖", "Predictable Patient Revenue ₹"]
    }
  ],
  signatureMicroAnimations: [
    "Gold highlight sweeping across CTA buttons on hover",
    "Icons gently lifting or glowing on hover",
    "Dashboard numbers counting up as they enter viewport",
    "Growth lines drawing themselves as users scroll",
    "Cards revealing with soft fade and upward motion",
    "Connection lines animating between growth system modules"
  ],
  finalDesignPrinciple: "Does this make MK Digitalverse look like a premium Digital Growth Partner that builds growth systems for healthcare organizations?"
};

export const MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES = {
  version: "3.0",
  title: "Phased Execution Blueprint — Master Design System Implementation",
  motto: "Growth Systems > Marketing Services",
  phases: [
    {
      phase: 1,
      name: "Freeze Development",
      desc: "Stop ad-hoc visual additions, new animations, images, or sections until global design system alignment is strictly enforced.",
      rule: "Never add isolated elements. Build once in the component library and extend."
    },
    {
      phase: 2,
      name: "Create Master Design System",
      desc: "Standardize Layout (container width, grid, 16-20px radius), Color (Warm Ivory #FAF8F3, Luxury Gold #D4AF37), Typography (Plus Jakarta Sans/Manrope), and Reusable Component Library.",
      rule: "100% tokenized design constants."
    },
    {
      phase: 3,
      name: "Build Visual Asset Library",
      desc: "Organized asset directory architecture: Healthcare, Doctors, Patients, Reception, Hospital, Technology, AI, Growth, Dashboards, Business Meetings, Reviews, Mockups, SEO, CRM, Automation, Videos.",
      rule: "No random stock imagery. Every asset matches the healthcare executive visual identity."
    },
    {
      phase: 4,
      name: "Signature Hero Visuals per Section",
      desc: "Hero (Cinematic hospital loop), About (Founder + strategy discussion), Services (3D growth system illustration), AI (Automation workflow), SEO ('Dentist Near Me' search), Reputation (Google Reviews phone), Website (Responsive multi-device), Marketing (ROI dashboard), Case Studies (Before vs After).",
      rule: "Every section has exactly one signature anchor visual."
    },
    {
      phase: 5,
      name: "One Section = One Story",
      desc: "Tell one visual story per section: Patient searches → Finds clinic → Builds trust → Books appointment → Leaves review.",
      rule: "The visual carries 80% of the message."
    },
    {
      phase: 6,
      name: "Consistency Audit Engine",
      desc: "10-point pre-launch verification checklist across Colors, Typography, Spacing, Icons, Photography, Buttons, Animations, Shadows, Cards, and Executive Feeling.",
      rule: "10/10 PASS required prior to production release."
    },
    {
      phase: 7,
      name: "Build a Signature Experience",
      desc: "Transform perception from 'nice agency website' to 'I've never seen a healthcare growth platform presented like this.'",
      rule: "Establish unmistakable brand recognition before reading the logo."
    }
  ],
  auditChecklistItems: [
    "Same colors?", "Same typography?", "Same spacing?", "Same icon style?",
    "Same photography style?", "Same button style?", "Same animations?",
    "Same shadows?", "Same cards?", "Same premium feeling?"
  ]
};

export const TWELVE_GLOBAL_MANDATES = {
  version: "4.0",
  title: "100% Website-Wide Global Implementation Mandates",
  developerDirective: "Do not build the remaining website section by section. First create a global design system and apply it to every existing and future section. Every section must include at least one premium visual (image, illustration, infographic, or video), subtle motion, consistent spacing, the approved cream/gold/navy color palette, executive-style components, and the same interaction patterns. The goal is for the entire website to feel like one continuous premium experience rather than isolated blocks. No section should look like a template while another looks custom. The visual language must remain consistent from the hero to the footer.",
  mandates: [
    { id: 1, name: "100% Section Imagery", desc: "Every single section contains a signature visual (Problem, Trust, Website, AI, SEO, Reviews, Growth Blueprint, Case Study, CTA)." },
    { id: 2, name: "Cinematic Micro-Films & Video Loops", desc: "Subtle background loops across Hero, About, Growth System, AI, Case Study, and CTA." },
    { id: 3, name: "Glassmorphism & Gold Light Depth", desc: "Glass cards, subtle glow, soft clinic blur, gold metallic light, 16-20px rounded cards with gradient borders." },
    { id: 4, name: "Universal Scroll Motion & Micro-Interactions", desc: "Staggered fade-ins, floating 3D icons, animated graphs, auto-drawing patient journeys, number count-ups." },
    { id: 5, name: "Guided Story Scroll Narrative", desc: "Problem → Reality → Solution → Growth System → Technology → Results → Proof → Partnership." },
    { id: 6, name: "Unified Premium Outline Iconography", desc: "Single outline icon family with uniform stroke, size, and rounded proportions." },
    { id: 7, name: "Strategic 3D & Blueprint Illustrations", desc: "Executive dashboards, 3D healthcare icons, system blueprints, patient maps instead of flat vectors." },
    { id: 8, name: "The Gold Ribbon Continuous Motif", desc: "Flowing gold ribbon line seamlessly connecting sections from top to bottom." },
    { id: 9, name: "Generous Executive White Space", desc: "Spacious padding, un-cramped layouts communicating executive authority." },
    { id: 10, name: "Dynamic Background Progression", desc: "Alternating Cream White (#FAF8F3) → Warm Ivory → Light Beige → Soft Healthcare Blue → Cream Gradient." },
    { id: 11, name: "Interactive Conversion Components", desc: "Hover Cards, Interactive Timelines, Clickable Roadmap, Interactive Dashboards, Before/After Sliders." },
    { id: 12, name: "Micro Details & Button Sweep FX", desc: "Gold light sweeping across buttons on hover, cards lifting 4px, subtle image zoom, number tickers." }
  ]
};







