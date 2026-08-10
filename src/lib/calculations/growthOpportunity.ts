import { IndustryType } from '../../types';

export interface HealthcareInputs {
  monthlyInquiries: number;
  conversionRate: number; // percentage, e.g. 8%
  averageCaseValue: number; // INR
  repeatMultiplier: number; // e.g. 1.2x
}

export interface GrowthOutput {
  industry: IndustryType;
  currentMonthlyConversions: number;
  currentAnnualConversions: number;
  currentAnnualRevenue: number;
  
  projectedConversionRate: number;
  projectedMonthlyConversions: number;
  projectedAnnualConversions: number;
  projectedAnnualRevenue: number;
  
  annualRevenueGrowth: number;
  estimatedMissedOpportunitiesAnnual: number;
  estimatedMissedRevenueAnnual: number;
  
  conversionLiftPercentage: number;
  interpretationText: string;
}

export const formatINR = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export const calculateHealthcareOpportunity = (inputs: HealthcareInputs): GrowthOutput => {
  const { monthlyInquiries, conversionRate, averageCaseValue, repeatMultiplier } = inputs;
  
  const currentMonthlyConversions = Math.round((monthlyInquiries * conversionRate) / 100);
  const currentAnnualConversions = currentMonthlyConversions * 12;
  const effectiveCaseValue = averageCaseValue * repeatMultiplier;
  const currentAnnualRevenue = currentAnnualConversions * effectiveCaseValue;

  // MK Digitalverse Triage & Patient Systems projected lift:
  // Typically improves intake efficiency by 1.6x to 1.8x, capped at realistic max 32%
  const projectedConversionRate = Math.min(Math.round(conversionRate * 1.65 * 10) / 10, 32);
  const projectedMonthlyConversions = Math.round((monthlyInquiries * projectedConversionRate) / 100);
  const projectedAnnualConversions = projectedMonthlyConversions * 12;
  const projectedAnnualRevenue = projectedAnnualConversions * effectiveCaseValue;

  const annualRevenueGrowth = projectedAnnualRevenue - currentAnnualRevenue;
  const estimatedMissedOpportunitiesAnnual = Math.max(0, projectedAnnualConversions - currentAnnualConversions);
  const estimatedMissedRevenueAnnual = estimatedMissedOpportunitiesAnnual * effectiveCaseValue;

  const conversionLiftPercentage = Math.round(((projectedConversionRate - conversionRate) / conversionRate) * 100);

  const interpretationText = `Based on your inputs, your clinic may be missing approximately ${estimatedMissedOpportunitiesAnnual} qualified patient treatments annually due to intake drop-off or delayed after-hours inquiry responses. Implementing 24/7 AI Triage and clinical trust profiling could capture an estimated ${formatINR(annualRevenueGrowth)} in additional annual patient revenue. A Healthcare Growth Audit™ will pinpoint your exact intake friction points.`;

  return {
    industry: 'healthcare',
    currentMonthlyConversions,
    currentAnnualConversions,
    currentAnnualRevenue,
    projectedConversionRate,
    projectedMonthlyConversions,
    projectedAnnualConversions,
    projectedAnnualRevenue,
    annualRevenueGrowth,
    estimatedMissedOpportunitiesAnnual,
    estimatedMissedRevenueAnnual,
    conversionLiftPercentage,
    interpretationText
  };
};
