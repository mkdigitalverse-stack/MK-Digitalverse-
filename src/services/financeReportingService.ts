/**
 * Financial Reporting & Cash Management Intelligence Engine
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-05B: Financial Implementation
 * 
 * Strict Multi-Currency Isolation & Reporting Rules:
 * - Realized Income = SUM(valid payments) by payment_date
 * - Billed Revenue = SUM(valid invoices) by issue_date (cancelled excluded)
 * - Expenses = SUM(expenses) by expense_date
 * - Net Cash Flow = Realized Income - Expenses
 * - Multi-currency totals are NEVER aggregated into one fake number.
 *   Currencies (INR, AED, USD, QAR, SAR, OMR, KWD) are grouped independently.
 */

import { InvoiceRecord, PaymentRecord, ExpenseRecord, FinancialReportingSummary, CurrencyFinancialSummary, ExpenseCategory, CurrencyCode, SUPPORTED_CURRENCIES } from '../types/finance';
import { ReportingDateContext } from './reportingDateService';

export class FinanceReportingService {
  /**
   * Generates a multi-currency financial report respecting date filters.
   */
  public static generateReport(
    invoices: InvoiceRecord[],
    payments: PaymentRecord[],
    expenses: ExpenseRecord[],
    dateContext: ReportingDateContext
  ): FinancialReportingSummary {
    const { currentRange } = dateContext;
    const startStr = currentRange.start.toISOString().split('T')[0];
    const endStr = currentRange.end.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter by financial event dates
    const periodInvoices = invoices.filter(i => {
      if (dateContext.period === 'all') return true;
      return i.issueDate >= startStr && i.issueDate <= endStr;
    });

    const periodPayments = payments.filter(p => {
      if (dateContext.period === 'all') return p.status === 'completed';
      return p.paymentDate >= startStr && p.paymentDate <= endStr && p.status === 'completed';
    });

    const periodExpenses = expenses.filter(e => {
      if (dateContext.period === 'all') return true;
      return e.expenseDate >= startStr && e.expenseDate <= endStr;
    });

    // Detect all active currencies present in transactions
    const currencySet = new Set<CurrencyCode>();
    invoices.forEach(i => currencySet.add(i.currencyCode || 'INR'));
    payments.forEach(p => currencySet.add(p.currencyCode || 'INR'));
    expenses.forEach(e => currencySet.add(e.currencyCode || 'INR'));

    // Default to at least INR if empty
    if (currencySet.size === 0) currencySet.add('INR');

    const currencies = Array.from(currencySet);
    const byCurrency: Record<CurrencyCode, CurrencyFinancialSummary> = {};
    const expensesByCategory: Record<CurrencyCode, Record<ExpenseCategory, number>> = {};

    currencies.forEach(curr => {
      const currSymbol = SUPPORTED_CURRENCIES.find(c => c.code === curr)?.symbol || `${curr} `;

      const currPayments = periodPayments.filter(p => (p.currencyCode || 'INR') === curr);
      const currInvoices = periodInvoices.filter(i => (i.currencyCode || 'INR') === curr);
      const currExpenses = periodExpenses.filter(e => (e.currencyCode || 'INR') === curr);

      const realizedIncome = currPayments.reduce((acc, p) => acc + p.amount, 0);
      const billedAmount = currInvoices
        .filter(i => i.status !== 'cancelled')
        .reduce((acc, i) => acc + i.amountTotal, 0);

      const totalExpenses = currExpenses.reduce((acc, e) => acc + e.amount, 0);
      const netCashFlow = Math.round((realizedIncome - totalExpenses) * 100) / 100;

      // Outstanding receivables (across all uncancelled invoices for this currency)
      const allActiveInvoicesForCurr = invoices.filter(
        i => (i.currencyCode || 'INR') === curr && i.status !== 'cancelled'
      );
      const outstandingReceivables = allActiveInvoicesForCurr.reduce(
        (acc, i) => acc + i.amountOutstanding,
        0
      );

      // Overdue receivables
      const overdueReceivables = allActiveInvoicesForCurr
        .filter(i => i.dueDate < todayStr && i.amountOutstanding > 0.01)
        .reduce((acc, i) => acc + i.amountOutstanding, 0);

      byCurrency[curr] = {
        currencyCode: curr,
        symbol: currSymbol,
        realizedIncome: Math.round(realizedIncome * 100) / 100,
        billedAmount: Math.round(billedAmount * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        netCashFlow,
        outstandingReceivables: Math.round(outstandingReceivables * 100) / 100,
        overdueReceivables: Math.round(overdueReceivables * 100) / 100,
        invoicesCount: currInvoices.length,
        paymentsCount: currPayments.length,
        expensesCount: currExpenses.length
      };

      // Categorize expenses
      const catMap: Record<ExpenseCategory, number> = {
        advertising: 0,
        software_tools: 0,
        contractors: 0,
        payroll: 0,
        operations: 0,
        equipment: 0,
        travel: 0,
        professional_services: 0,
        payment_fees: 0,
        other: 0
      };
      currExpenses.forEach(exp => {
        catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
      });
      expensesByCategory[curr] = catMap;
    });

    const overdueCount = invoices.filter(
      i => i.dueDate < todayStr && i.amountOutstanding > 0.01 && i.status !== 'cancelled'
    ).length;

    return {
      periodLabel: currentRange.label,
      dateRange: currentRange,
      hasMultipleCurrencies: currencies.length > 1,
      currencies,
      byCurrency,
      expensesByCategory,
      totalInvoicesCount: periodInvoices.length,
      totalPaymentsCount: periodPayments.length,
      totalExpensesCount: periodExpenses.length,
      overdueInvoicesCount: overdueCount
    };
  }

  /**
   * Helper to format currency numbers cleanly with symbols
   */
  public static formatAmount(amount: number, currencyCode: CurrencyCode): string {
    const symbol = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)?.symbol || `${currencyCode} `;
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
