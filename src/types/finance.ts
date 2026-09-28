/**
 * Finance & Business Money Management Domain Types
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-05B: Financial Implementation
 * 
 * Core principles:
 * - PIPELINE VALUE != REVENUE
 * - Invoices represent expected money; Payments represent realized cash income
 * - Invoices.amount_paid is dynamically derived from valid payments, never an independent manual field
 * - Multi-currency safety: Currencies are tracked explicitly (INR, AED, QAR, SAR, OMR, KWD, USD)
 * - PayPal is the primary international payment channel
 */

export type CurrencyCode = 'INR' | 'AED' | 'QAR' | 'SAR' | 'OMR' | 'KWD' | 'USD' | string;

export const SUPPORTED_CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'INR', label: 'INR (₹) - Indian Rupee', symbol: '₹' },
  { code: 'AED', label: 'AED (د.إ) - UAE Dirham', symbol: 'AED ' },
  { code: 'USD', label: 'USD ($) - US Dollar', symbol: '$' },
  { code: 'QAR', label: 'QAR (ر.ق) - Qatari Riyal', symbol: 'QAR ' },
  { code: 'SAR', label: 'SAR (﷼) - Saudi Riyal', symbol: 'SAR ' },
  { code: 'OMR', label: 'OMR (ر.ع.) - Omani Rial', symbol: 'OMR ' },
  { code: 'KWD', label: 'KWD (د.ك) - Kuwaiti Dinar', symbol: 'KWD ' }
];

export type ClientStatus = 'active' | 'paused' | 'completed' | 'churned';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';

export type PaymentMethod =
  | 'paypal'
  | 'bank_transfer'
  | 'wire'
  | 'upi'
  | 'razorpay'
  | 'credit_card'
  | 'check'
  | 'cash'
  | 'other';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  paypal: 'PayPal (International)',
  bank_transfer: 'Bank Transfer (NEFT/RTGS/IMPS)',
  wire: 'SWIFT International Wire',
  upi: 'UPI (India)',
  razorpay: 'Razorpay',
  credit_card: 'Credit / Debit Card',
  check: 'Cheque / Demand Draft',
  cash: 'Cash',
  other: 'Other'
};

export type PaymentStatus = 'completed' | 'refunded' | 'reversed';

export type ExpenseCategory =
  | 'advertising'
  | 'software_tools'
  | 'contractors'
  | 'payroll'
  | 'operations'
  | 'equipment'
  | 'travel'
  | 'professional_services'
  | 'payment_fees'
  | 'other';

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  advertising: 'Advertising & Marketing (Ads)',
  software_tools: 'Software, SaaS & AI Tools',
  contractors: 'Contractors & Freelancers',
  payroll: 'Payroll & Team Compensation',
  operations: 'Operations, Legal & Office',
  equipment: 'Equipment & Hardware',
  travel: 'Travel & Client Meetings',
  professional_services: 'Accounting & Professional Fees',
  payment_fees: 'Payment Processing Fees (PayPal/Bank)',
  other: 'Other Business Expense'
};

// 1. CLIENT RECORD
export interface ClientRecord {
  id: string;
  leadId?: string | null;
  name: string;
  organizationName: string;
  email: string;
  phone?: string;
  healthcareCategory?: string;
  billingAddress?: string;
  taxIdentifier?: string; // GSTIN / Tax ID
  currencyCode: CurrencyCode;
  status: ClientStatus;
  contractStartDate?: string;
  contractEndDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 2. INVOICE RECORD
export interface InvoiceRecord {
  id: string;
  clientId: string;
  clientName?: string;
  organizationName?: string;
  invoiceNumber: string;
  title: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  amountSubtotal: number;
  taxRate: number;   // e.g. 18.0 for 18% GST
  taxAmount: number;
  amountTotal: number;
  currencyCode: CurrencyCode;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Dynamically Calculated from Payments (Source of Truth)
  amountPaid: number;
  amountOutstanding: number;
  calculatedStatus: InvoiceStatus;
  paymentsCount: number;
}

// 3. PAYMENT RECORD
export interface PaymentRecord {
  id: string;
  invoiceId?: string | null;
  clientId: string;
  clientName?: string;
  organizationName?: string;
  invoiceNumber?: string | null;
  paymentDate: string; // YYYY-MM-DD
  amount: number;      // Gross client payment applied to invoice
  feeAmount: number;   // Gateway / PayPal fee
  netAmount: number;   // amount - feeAmount
  currencyCode: CurrencyCode;
  paymentMethod: PaymentMethod;
  referenceNumber?: string; // Stores PayPal Tx ID, UTR, Wire Ref
  notes?: string;
  status: PaymentStatus;
  recordedBy?: string | null;
  createdAt: string;
}

// 4. EXPENSE RECORD
export interface ExpenseRecord {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currencyCode: CurrencyCode;
  expenseDate: string; // YYYY-MM-DD
  vendor?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  isRecurring: boolean;
  recurringPeriod?: 'monthly' | 'quarterly' | 'yearly';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 5. CLIENT FINANCIAL PROFILE
export interface ClientFinancialProfile {
  client: ClientRecord;
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  currencyCode: CurrencyCode;
}

// 6. FINANCIAL SUMMARY & METRICS
export interface CurrencyFinancialSummary {
  currencyCode: CurrencyCode;
  symbol: string;
  realizedIncome: number;      // Cash in bank from payments
  billedAmount: number;        // Invoiced totals
  totalExpenses: number;       // Cash outflows
  netCashFlow: number;         // Income - Expenses
  outstandingReceivables: number;
  overdueReceivables: number;
  invoicesCount: number;
  paymentsCount: number;
  expensesCount: number;
  totalProcessingFees: number; // Informational: Sum of gateway/PayPal fees
}

export interface FinancialReportingSummary {
  periodLabel: string;
  dateRange: { start: Date; end: Date };
  hasMultipleCurrencies: boolean;
  currencies: CurrencyCode[];
  byCurrency: Record<CurrencyCode, CurrencyFinancialSummary>;
  
  // Category breakdown for expenses
  expensesByCategory: Record<CurrencyCode, Record<ExpenseCategory, number>>;
  
  // Aggregated transaction counts
  totalInvoicesCount: number;
  totalPaymentsCount: number;
  totalExpensesCount: number;
  overdueInvoicesCount: number;
}
