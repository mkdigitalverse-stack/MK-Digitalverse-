/**
 * Financial Export Engine
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-05B: Financial Implementation
 * 
 * Strict Read-Only Export Architecture:
 * - RFC-4180 compliant CSV formatting with UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
 * - Accurate financial source data export (Invoices, Payments, Expenses)
 * - Quotes escaping, null safety, and human-readable formats
 */

import { InvoiceRecord, PaymentRecord, ExpenseRecord, PAYMENT_METHOD_LABELS, EXPENSE_CATEGORY_LABELS } from '../types/finance';

function escapeCsvField(value: any): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function triggerDownload(csvContent: string, filename: string) {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export class FinanceExportService {
  /**
   * Export Invoices to CSV
   */
  public static exportInvoices(invoices: InvoiceRecord[], periodLabel: string = 'All') {
    const headers = [
      'Invoice Number',
      'Client Contact',
      'Organization',
      'Title',
      'Issue Date',
      'Due Date',
      'Subtotal',
      'Tax Rate (%)',
      'Tax Amount',
      'Total Amount',
      'Amount Paid',
      'Outstanding Balance',
      'Currency',
      'Status',
      'Payments Count',
      'Notes'
    ];

    const rows = invoices.map(inv => [
      inv.invoiceNumber,
      inv.clientName || '',
      inv.organizationName || '',
      inv.title,
      inv.issueDate,
      inv.dueDate,
      inv.amountSubtotal.toFixed(2),
      inv.taxRate.toFixed(2),
      inv.taxAmount.toFixed(2),
      inv.amountTotal.toFixed(2),
      inv.amountPaid.toFixed(2),
      inv.amountOutstanding.toFixed(2),
      inv.currencyCode,
      inv.calculatedStatus.toUpperCase(),
      inv.paymentsCount,
      inv.notes || ''
    ]);

    const csv = [headers.map(escapeCsvField).join(','), ...rows.map(r => r.map(escapeCsvField).join(','))].join('\r\n');
    const safeDate = new Date().toISOString().split('T')[0];
    triggerDownload(csv, `mk_digitalverse_invoices_${safeDate}.csv`);
  }

  /**
   * Export Payments to CSV
   */
  public static exportPayments(payments: PaymentRecord[], periodLabel: string = 'All') {
    const headers = [
      'Payment Date',
      'Client Contact',
      'Organization',
      'Invoice Number',
      'Gross Amount',
      'Fee Amount (PayPal/Gateway)',
      'Net Amount',
      'Currency',
      'Payment Method',
      'Reference / Tx ID',
      'Status',
      'Notes'
    ];

    const rows = payments.map(p => [
      p.paymentDate,
      p.clientName || '',
      p.organizationName || '',
      p.invoiceNumber || 'Direct Client Payment',
      p.amount.toFixed(2),
      p.feeAmount.toFixed(2),
      p.netAmount.toFixed(2),
      p.currencyCode,
      PAYMENT_METHOD_LABELS[p.paymentMethod] || p.paymentMethod,
      p.referenceNumber || '',
      p.status.toUpperCase(),
      p.notes || ''
    ]);

    const csv = [headers.map(escapeCsvField).join(','), ...rows.map(r => r.map(escapeCsvField).join(','))].join('\r\n');
    const safeDate = new Date().toISOString().split('T')[0];
    triggerDownload(csv, `mk_digitalverse_payments_${safeDate}.csv`);
  }

  /**
   * Export Expenses to CSV
   */
  public static exportExpenses(expenses: ExpenseRecord[], periodLabel: string = 'All') {
    const headers = [
      'Expense Date',
      'Title',
      'Category',
      'Vendor',
      'Amount',
      'Currency',
      'Payment Method',
      'Recurring',
      'Recurring Period',
      'Receipt URL',
      'Notes'
    ];

    const rows = expenses.map(e => [
      e.expenseDate,
      e.title,
      EXPENSE_CATEGORY_LABELS[e.category] || e.category,
      e.vendor || '',
      e.amount.toFixed(2),
      e.currencyCode,
      e.paymentMethod || '',
      e.isRecurring ? 'YES' : 'NO',
      e.recurringPeriod || '',
      e.receiptUrl || '',
      e.notes || ''
    ]);

    const csv = [headers.map(escapeCsvField).join(','), ...rows.map(r => r.map(escapeCsvField).join(','))].join('\r\n');
    const safeDate = new Date().toISOString().split('T')[0];
    triggerDownload(csv, `mk_digitalverse_expenses_${safeDate}.csv`);
  }
}
