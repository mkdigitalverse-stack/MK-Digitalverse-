import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  Plus,
  Search,
  FileSpreadsheet,
  Trash2,
  Calendar,
  Building,
  Tag,
  Repeat
} from 'lucide-react';
import {
  ExpenseRecord,
  ExpenseCategory,
  EXPENSE_CATEGORY_LABELS,
  SUPPORTED_CURRENCIES
} from '../../types/finance';
import { FinanceExportService } from '../../services/financeExportService';

interface AdminExpensesViewProps {
  expenses: ExpenseRecord[];
  onOpenLogExpense: () => void;
  onDeleteExpense: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export const AdminExpensesView: React.FC<AdminExpensesViewProps> = ({
  expenses,
  onOpenLogExpense,
  onDeleteExpense,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = exp.title.toLowerCase().includes(q);
        const vendorMatch = (exp.vendor || '').toLowerCase().includes(q);
        const notesMatch = (exp.notes || '').toLowerCase().includes(q);
        if (!titleMatch && !vendorMatch && !notesMatch) return false;
      }

      if (categoryFilter !== 'all' && exp.category !== categoryFilter) {
        return false;
      }

      if (currencyFilter !== 'all' && exp.currencyCode !== currencyFilter) {
        return false;
      }

      return true;
    });
  }, [expenses, searchQuery, categoryFilter, currencyFilter]);

  const currenciesPresent = useMemo(() => {
    return Array.from(new Set(expenses.map(e => e.currencyCode)));
  }, [expenses]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this expense record from the ledger?')) return;
    try {
      setIsDeleting(id);
      await onDeleteExpense(id);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Business Expenses & Operating Costs</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Operational outflows, ad spend (Google/Meta), software SaaS tools, contractor payroll, and payment processing fees.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => FinanceExportService.exportExpenses(filteredExpenses)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors min-h-[38px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Expenses CSV</span>
            </button>

            <button
              onClick={onOpenLogExpense}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, vendor, or expense notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {Object.entries(EXPENSE_CATEGORY_LABELS).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Currency:</span>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Currencies</option>
              {currenciesPresent.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3.5 font-mono text-[11px]">Expense Date</th>
                <th className="py-3 px-3.5">Title / Description</th>
                <th className="py-3 px-3.5">Category</th>
                <th className="py-3 px-3.5">Vendor</th>
                <th className="py-3 px-3.5 text-right font-mono text-rose-800">Amount</th>
                <th className="py-3 px-3.5">Payment Method</th>
                <th className="py-3 px-3.5 text-center">Recurring</th>
                <th className="py-3 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <TrendingDown className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-xs text-slate-600">No expense records found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Log operational costs or vendor bills using the button above.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((e) => {
                  const symbol = SUPPORTED_CURRENCIES.find(c => c.code === e.currencyCode)?.symbol || `${e.currencyCode} `;
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono whitespace-nowrap text-slate-700">
                        {e.expenseDate}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900">{e.title}</div>
                        {e.notes && <div className="text-[11px] text-slate-400 truncate max-w-xs">{e.notes}</div>}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {EXPENSE_CATEGORY_LABELS[e.category] || e.category}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-600 font-medium">
                        {e.vendor || '—'}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-rose-700 whitespace-nowrap">
                        {symbol}{e.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap capitalize text-slate-600">
                        {e.paymentMethod?.replace('_', ' ') || '—'}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {e.isRecurring ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <Repeat className="w-2.5 h-2.5" />
                            <span className="capitalize">{e.recurringPeriod || 'Monthly'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">One-time</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(e.id)}
                          disabled={isDeleting === e.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
