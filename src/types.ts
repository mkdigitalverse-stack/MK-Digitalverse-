export type IndustryType = 'healthcare' | 'wedding_venues';

export interface IndustryVertical {
  id: string;
  title: string;
  description: string;
  keyMetric: string;
  iconName: string;
}

export interface IndustryData {
  id: IndustryType;
  title: string;
  tagline: string;
  description: string;
  targetAudience: string[];
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
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  industryApplicability: IndustryType[] | 'both';
  features: string[];
  businessOutcome: string;
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
