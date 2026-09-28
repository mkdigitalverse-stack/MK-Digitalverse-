/**
 * Contracts & Contract Milestones Domain Types
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-06: Client Portal & Contract Milestones
 * 
 * Source-of-truth invariants:
 * - CRM Lead is a prospect; Client is a commercial relationship; Contract is a commercial agreement.
 * - Contract value is planned commercial value, NOT realized revenue or cash received.
 * - Invoices and payments calculate billing and cash received; contracts derive these figures.
 * - Milestones track project delivery & commercial scheduling; completing a milestone does NOT automatically create an invoice.
 */

import { CurrencyCode } from './finance';

export type ContractType =
  | 'retainer'
  | 'project'
  | 'milestone_project'
  | 'one_time'
  | 'subscription'
  | 'custom';

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  retainer: 'Monthly Healthcare Retainer',
  project: 'Fixed-Scope Project',
  milestone_project: 'Milestone-Based Engagement',
  one_time: 'One-Time Strategy / Audit',
  subscription: 'Growth Partnership Subscription',
  custom: 'Custom Commercial Agreement'
};

export type ContractStatus =
  | 'draft'
  | 'pending_signature'
  | 'active'
  | 'paused'
  | 'completed'
  | 'terminated'
  | 'expired'
  | 'cancelled';

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: 'Draft (Internal)',
  pending_signature: 'Pending Signature / Approval',
  active: 'Active & In Execution',
  paused: 'Temporarily Paused',
  completed: 'Successfully Completed',
  terminated: 'Terminated Early',
  expired: 'Contract Term Expired',
  cancelled: 'Cancelled'
};

export type BillingFrequency =
  | 'one_time'
  | 'monthly'
  | 'quarterly'
  | 'half_yearly'
  | 'annual'
  | 'milestone'
  | 'custom';

export const BILLING_FREQUENCY_LABELS: Record<BillingFrequency, string> = {
  one_time: 'Single Invoice / One-Time',
  monthly: 'Monthly Retainer Billing',
  quarterly: 'Quarterly Billing Cycle',
  half_yearly: 'Semi-Annual Billing Cycle',
  annual: 'Annual Upfront / Term',
  milestone: 'Billed Per Milestone Completion',
  custom: 'Custom Commercial Milestones'
};

export type MilestoneStatus =
  | 'not_started'
  | 'in_progress'
  | 'blocked'
  | 'completed'
  | 'cancelled';

export const MILESTONE_STATUS_LABELS: Record<MilestoneStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  blocked: 'Blocked / Pending Client',
  completed: 'Completed & Delivered',
  cancelled: 'Cancelled'
};

// 1. CONTRACT RECORD
export interface ContractRecord {
  id: string;
  clientId: string;
  clientName?: string;
  organizationName?: string;
  leadId?: string | null;
  contractNumber: string; // e.g. MK-C-2026-001
  title: string;
  contractType: ContractType;
  status: ContractStatus;
  description?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  currencyCode: CurrencyCode;
  contractValue: number;
  billingFrequency: BillingFrequency;
  paymentTermsDays: number;
  autoRenew: boolean;
  renewalDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Dynamically derived from Milestones & Linked Invoices (Zero Hard-Coded Duplication)
  milestonesCount: number;
  completedMilestonesCount: number;
  overallProgressPercent: number;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  unbilledContractValue: number;
  isOverdue: boolean;
}

// 2. CONTRACT MILESTONE RECORD
export interface ContractMilestoneRecord {
  id: string;
  contractId: string;
  title: string;
  description?: string;
  sequenceNumber: number;
  status: MilestoneStatus;
  startDate?: string;
  dueDate?: string;
  completedAt?: string | null;
  completionPercentage: number;
  milestoneValue?: number;
  currencyCode?: CurrencyCode;
  billingType?: string;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Derived Operational Flags
  isOverdue: boolean;
}

// 3. CONTRACT ACTIVITY / AUDIT TRAIL
export interface ContractActivityRecord {
  id: string;
  contractId: string;
  type: string;
  description: string;
  actor?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// 4. CLIENT PORTAL SECURE VIEW (STRICTLY NO INTERNAL SALES / MARGIN DATA)
export interface ClientPortalViewData {
  organizationName: string;
  contactName: string;
  email: string;
  contracts: Array<{
    id: string;
    contractNumber: string;
    title: string;
    contractType: string;
    status: ContractStatus;
    startDate?: string;
    endDate?: string;
    currencyCode: CurrencyCode;
    contractValue: number;
    overallProgressPercent: number;
    milestones: Array<{
      id: string;
      title: string;
      sequenceNumber: number;
      status: MilestoneStatus;
      dueDate?: string;
      completedAt?: string | null;
      completionPercentage: number;
    }>;
    invoices: Array<{
      invoiceNumber: string;
      title: string;
      issueDate: string;
      dueDate: string;
      amountTotal: number;
      amountPaid: number;
      amountOutstanding: number;
      currencyCode: CurrencyCode;
      status: string;
    }>;
  }>;
}
