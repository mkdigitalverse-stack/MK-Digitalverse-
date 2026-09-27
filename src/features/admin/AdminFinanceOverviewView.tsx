import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  InvoiceRecord,
  PaymentRecord,
  ExpenseRecord,
  ClientRecord,
  CurrencyCode,
  SUPPORTED_CURRENCIES
} from '../../types/finance';
import { FinanceReportingService } from '../../services/financeReportingService';
import { AdminReportingDateSelector } from './AdminReportingDateSelector';
import { ReportingDateContext, ReportingDateService, ReportingPeriod } from '../../services/reportingDateService';
import { FinanceExportService } from '../../services/financeExportService';

interface AdminFinanceOverviewViewProps {
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  clients: ClientRecord[];
  onRefresh: () => void;
  onOpenCreateInvoice: () => void;
  onOpenRecordPayment: () => void;
  onOpenLogExpense: () => void;
  onSelectTab: (tab: any) => void;
}

export const AdminFinanceOverviewView: React.FC<AdminFinanceOverviewViewProps> = ({
  invoices,
  payments,
  expenses,
  clients,
  onRefresh,
  onOpenCreateInvoice,
  onOpenRecordPayment,
  onOpenLogExpense,
  onSelectTab
}) => {
  const [period, setPeriod] = useState<ReportingPeriod>('30days');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('ALL');

  const dateContext: ReportingDateContext = useMemo(() => {
    return ReportingDateService.resolveDateContext(period, customStart, customEnd);
  }, [period, customStart, customEnd]);

  const report = useMemo(() => {
    return FinanceReportingService.generateReport(invoices, payments, expenses, dateContext);
  }, [invoices, payments, expenses, dateContext]);

  // Filter or active currency list
  const activeCurrencies = useMemo(() => {
    if (selectedCurrency !== 'ALL' && report.byCurrency[selectedCurrency]) {
      return [selectedCurrency];
    }
    return report.currencies;
  }, [selectedCurrency, report]);

  const handleExportSummary = () => {
    FinanceExportService.exportInvoices(invoices, dateContext.currentRange.label);
    FinanceExportService.exportPayments(payments, dateContext.currentRange.label);
    FinanceExportService.exportExpenses(expenses, dateContext.currentRange.label);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded tracking-wider">
                CONFIDENTIAL • EXECUTIVE FINANCE
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">{dateContext.currentRange.label}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Finance & Business Cash Flow Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Realized bank income, client receivables, and operational expenses for MK Digitalverse healthcare partnerships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenRecordPayment}
              className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>

            <button
              onClick={onOpenCreateInvoice}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </button>

            <button
              onClick={onOpenLogExpense}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>

            <button
              onClick={handleExportSummary}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors min-h-[38px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onRefresh}
              title="Refresh ledger"
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date Filter Component */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <AdminReportingDateSelector
            period={period}
            onChangePeriod={setPeriod}
            customStartDate={customStart}
            customEndDate={customEnd}
            onChangeCustomStartDate={setCustomStart}
            onChangeCustomEndDate={setCustomEnd}
          />

          {/* Currency Filter / Selector */}
          {report.currencies.length > 1 && (
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-slate-500 font-medium">Currency View:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-mono font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              >
                <option value="ALL">All Currencies (Separated)</option>
                {report.currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Currency & Accounting Guardrail Notice */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-300/60 rounded-xl flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-950">
            Multi-Currency Separation & Realized Cash Flow Guarantee
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Per MK Digitalverse financial protocol, multi-currency balances are kept strictly separated without artificial FX conversions. 
            <strong> Realized Income</strong> reflects confirmed bank/PayPal collections. <strong> Pipeline Value is prospective and never treated as revenue.</strong>
          </p>
        </div>
      </div>

      {/* Currency-Separated Financial Metric Cards */}
      {activeCurrencies.map(curr => {
        const data = report.byCurrency[curr] || {
          currencyCode: curr,
          symbol: `${curr} `,
          realizedIncome: 0,
          billedAmount: 0,
          totalExpenses: 0,
          netCashFlow: 0,
          outstandingReceivables: 0,
          overdueReceivables: 0,
          invoicesCount: 0,
          paymentsCount: 0,
          expensesCount: 0
        };

        const isPositiveCashFlow = data.netCashFlow >= 0;

        return (
          <div key={curr} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Currency Section Header */}
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                <h2 className="text-sm font-bold text-slate-900 font-mono">
                  {curr} Portfolio ({SUPPORTED_CURRENCIES.find(c => c.code === curr)?.label || curr})
                </h2>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {data.paymentsCount} payments • {data.invoicesCount} invoices • {data.expensesCount} expenses
              </div>
            </div>

            {/* Metric KPI Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
              {/* 1. Realized Income */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider">REALIZED INCOME</span>
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold font-mono text-emerald-950 truncate">
                  {data.symbol}{data.realizedIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-emerald-700/80">Cash collected in bank</div>
              </div>

              {/* 2. Billed Amount */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider">BILLED (INVOICED)</span>
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 truncate">
                  {data.symbol}{data.billedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-500">Commercial billings issued</div>
              </div>

              {/* 3. Cash Expenses */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-1">
                <div className="flex items-center justify-between text-rose-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider">CASH EXPENSES</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div className="text-xl font-bold font-mono text-rose-950 truncate">
                  {data.symbol}{data.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-rose-700/80">Operational outflows</div>
              </div>

              {/* 4. Net Cash Flow */}
              <div className={`p-3.5 rounded-xl border space-y-1 ${
                isPositiveCashFlow 
                  ? 'bg-teal-50/60 border-teal-200/80 text-teal-900' 
                  : 'bg-amber-50/60 border-amber-200/80 text-amber-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider">NET CASH FLOW</span>
                  {isPositiveCashFlow ? (
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>
                <div className="text-xl font-bold font-mono truncate">
                  {data.symbol}{data.netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] opacity-80">Income minus expenses</div>
              </div>

              {/* 5. Outstanding Receivables */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
                <div className="flex items-center justify-between text-blue-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider">OUTSTANDING AR</span>
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-xl font-bold font-mono text-blue-950 truncate">
                  {data.symbol}{data.outstandingReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-blue-700/80">Uncollected client invoices</div>
              </div>

              {/* 6. Overdue Receivables */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-300 space-y-1">
                <div className="flex items-center justify-between text-amber-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider">OVERDUE AR</span>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <div className="text-xl font-bold font-mono text-amber-950 truncate">
                  {data.symbol}{data.overdueReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-amber-800">Past invoice due date</div>
              </div>
            </div>

            {/* Expense Categories Breakdown for this currency */}
            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Expense Distribution ({curr})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {Object.entries(report.expensesByCategory[curr] || {}).map(([cat, amt]) => {
                  if (amt === 0) return null;
                  return (
                    <div key={cat} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="text-[10px] text-slate-500 truncate capitalize">
                        {cat.replace('_', ' ')}
                      </div>
                      <div className="font-mono font-bold text-slate-800 mt-0.5">
                        {data.symbol}{amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Quick Navigation Cards to Ledger Views */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onSelectTab('finance_invoices')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer transition-all hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Invoices & Receivables</span>
            <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage billing, send payment links, track unpaid balances, and review due dates.
          </p>
          <div className="text-xs font-semibold text-slate-900 mt-3 flex items-center space-x-1">
            <span>View Invoices ({invoices.length})</span>
            <span>→</span>
          </div>
        </div>

        <div
          onClick={() => onSelectTab('finance_payments')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer transition-all hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Income & Payments Ledger</span>
            <DollarSign className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Record client cash receipts, PayPal transactions, bank transfers, and gateway settlements.
          </p>
          <div className="text-xs font-semibold text-slate-900 mt-3 flex items-center space-x-1">
            <span>View Payments ({payments.length})</span>
            <span>→</span>
          </div>
        </div>

        <div
          onClick={() => onSelectTab('finance_expenses')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer transition-all hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Expense Management</span>
            <TrendingDown className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track advertising costs, SaaS tools, contractor payroll, and operating overhead.
          </p>
          <div className="text-xs font-semibold text-slate-900 mt-3 flex items-center space-x-1">
            <span>View Expenses ({expenses.length})</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
