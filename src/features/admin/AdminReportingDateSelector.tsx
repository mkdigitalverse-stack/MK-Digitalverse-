import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { ReportingPeriod, ReportingDateContext } from '../../services/reportingDateService';

interface AdminReportingDateSelectorProps {
  dateContext: ReportingDateContext;
  onChangePeriod: (period: ReportingPeriod, customStart?: string, customEnd?: string) => void;
}

const PERIOD_OPTIONS: { id: ReportingPeriod; label: string; group?: string }[] = [
  { id: 'today', label: 'Today', group: 'Quick' },
  { id: '7days', label: 'Last 7 Days', group: 'Quick' },
  { id: '30days', label: 'Last 30 Days', group: 'Quick' },
  { id: 'this_week', label: 'This Week', group: 'Weekly' },
  { id: 'prev_week', label: 'Previous Week', group: 'Weekly' },
  { id: 'this_month', label: 'This Month', group: 'Monthly' },
  { id: 'prev_month', label: 'Previous Month', group: 'Monthly' },
  { id: 'this_year', label: 'This Year', group: 'Annual' },
  { id: 'prev_year', label: 'Previous Year', group: 'Annual' },
  { id: 'custom', label: 'Custom Range', group: 'Custom' },
  { id: 'all', label: 'All Time', group: 'All' }
];

export const AdminReportingDateSelector: React.FC<AdminReportingDateSelectorProps> = ({
  dateContext,
  onChangePeriod
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(dateContext.period === 'custom');
  const [customStart, setCustomStart] = useState(
    dateContext.customStartDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [customEnd, setCustomEnd] = useState(
    dateContext.customEndDate || new Date().toISOString().split('T')[0]
  );

  const activeOption = PERIOD_OPTIONS.find(p => p.id === dateContext.period) || PERIOD_OPTIONS[5]; // Default This Month

  const handleSelect = (id: ReportingPeriod) => {
    if (id === 'custom') {
      setShowCustomPicker(true);
      onChangePeriod('custom', customStart, customEnd);
    } else {
      setShowCustomPicker(false);
      onChangePeriod(id);
    }
    setIsOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      onChangePeriod('custom', customStart, customEnd);
      setShowCustomPicker(false);
    }
  };

  return (
    <div className="relative inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none min-h-[36px]"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2 text-left">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 leading-tight">
                {activeOption.label}
              </span>
              <span className="text-[10px] text-slate-500 font-normal leading-none mt-0.5">
                {dateContext.currentRange.label}
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-1.5 max-h-96 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Reporting Period
              </div>

              <div className="py-1">
                {PERIOD_OPTIONS.map((opt) => {
                  const isSelected = opt.id === dateContext.period;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelect(opt.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-amber-50/70 text-amber-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {dateContext.previousRange && (
                <div className="px-3 py-2 bg-slate-50/60 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700 block mb-0.5">Prior Comparison Period:</span>
                  <span>{dateContext.previousRange.label}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Custom Date Range Inline Controls (When active) */}
      {showCustomPicker && (
        <form onSubmit={handleApplyCustom} className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-xs transition-colors shrink-0"
          >
            Apply
          </button>
        </form>
      )}

      {/* Comparison badge/indicator (Clean metadata, zero-pill) */}
      {dateContext.previousRange && !showCustomPicker && (
        <span className="text-[11px] text-slate-500 hidden md:inline-flex items-center gap-1">
          <span>vs.</span>
          <span className="font-medium text-slate-700">{dateContext.previousRange.label}</span>
        </span>
      )}
    </div>
  );
};
