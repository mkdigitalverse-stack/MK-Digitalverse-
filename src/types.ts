export type IndustryType = 'healthcare';

export interface IndustryVertical {
  id: string;
  title: string;
  description: string;
  keyMetric: string;
  iconName: string;
}

export interface IndustryChallenge {
  title: string;
  description: string;
  impact: string;
}

export interface IndustryData {
  id: IndustryType;
  title: string;
  headline: string;
  ipName: string;
  tagline: string;
  description: string;
  targetAudience: string[];
  challenges: IndustryChallenge[];
  verticals: IndustryVertical[];
  growthPillars: {
    title: string;
    description: string;
    impact: string;
  }[];
  metrics: {
    label: string;
    value: string;
    subtext: string;
  }[];
}

export interface ComparisonPoint {
  dimension: string;
  traditionalAgency: string;
  mkGrowthPartner: string;
}

export interface FrameworkStage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  icon: string;
  techStack: string[];
}

export interface CapabilityItem {
  id: string;
  pillarNumber: string;
  title: string;
  purpose: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  framework: string;
  industryApplicability: IndustryType[] | 'healthcare';
  features: string[];
  businessOutcome: string;
  outcomes: string[];
}

export interface CaseStudy {
  id: string;
  clientCategory: string;
  industry: IndustryType;
  title: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    label: string;
  }[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
}

export interface AuditFormData {
  industry: IndustryType;
  vertical: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  monthlyRevenue: string;
  primaryGoal: string;
  currentBottleneck: string;
}
