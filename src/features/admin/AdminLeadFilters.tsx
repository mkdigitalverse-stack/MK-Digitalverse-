import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Download,
  Check,
  FileSpreadsheet
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  status: string;
  priority: string;
  fitStatus: string;
  intentLevel: string;
  healthcareCategory: string;
  leadType: string;
  leadSource: string;
  dateRange: 'all' | 'today' | '7days' | '30days' | 'this_month' | 'prev_month';
  sortBy: 'newest' | 'oldest' | 'fitScore' | 'priority' | 'followUp';
}

interface AdminLeadFiltersProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalCount: number;
  selectedCount?: number;
  onExportFiltered?: () => void;
  onExportAll?: () => void;
  onExportSelected?: () => void;
}

export const AdminLeadFilters: React.FC<AdminLeadFiltersProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalFiltered,
  totalCount,
  selectedCount = 0,
  onExportFiltered,
  onExportAll,
  onExportSelected
}) => {
  const [isOpenMobileFilters, setIsOpenMobileFilters] = useState<boolean>(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close export dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    }
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    onChangeFilters({ ...filters, [key]: value });
  };

  const activeFilterCount = [
    filters.status !== 'all',
    filters.priority !== 'all',
    filters.fitStatus !== 'all',
    filters.intentLevel !== 'all',
    filters.healthcareCategory !== 'all',
    filters.leadType !== 'all',
    filters.leadSource !== 'all',
    filters.dateRange !== 'all',
    Boolean(filters.searchQuery)
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs mb-6 space-y-3">
      {/* Top Row: Search Input, Mobile Filter Toggle, Export Dropdown, Sort Selector, Reset */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleTextChange}
            placeholder="Search leads by name, organization, email..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 min-h-[40px]"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center space-x-2 shrink-0 justify-between md:justify-end flex-wrap gap-y-2">
          {/* Mobile Filter Toggle Button (Visible below lg) */}
          <button
            type="button"
            onClick={() => setIsOpenMobileFilters(!isOpenMobileFilters)}
            className={`lg:hidden inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors min-h-[40px] ${
              activeFilterCount > 0 || isOpenMobileFilters
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            {isOpenMobileFilters ? (
              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          {/* Export Dropdown Menu */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition-colors min-h-[40px]"
              aria-haspopup="true"
              aria-expanded={isExportMenuOpen}
              title="Export leads to CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Export Leads</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    CSV Export Options
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    RFC-4180 CSV with UTF-8 BOM
                  </div>
                </div>

                {/* Option 1: Export Filtered */}
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportFiltered?.();
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-amber-50/70 transition-colors flex items-start space-x-2.5 group"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-amber-900 flex items-center justify-between">
                      <span>Export Filtered Leads</span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold">
                        {totalFiltered}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {activeFilterCount > 0 ? 'Matches active search and filters' : 'All visible viewable records'}
                    </p>
                  </div>
                </button>

                {/* Option 2: Export Selected */}
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportSelected?.();
                  }}
                  className={`w-full text-left px-3 py-2.5 transition-colors flex items-start space-x-2.5 group ${
                    selectedCount > 0 
                      ? 'hover:bg-amber-50/70 cursor-pointer' 
                      : 'opacity-40 cursor-not-allowed bg-slate-50/50'
                  }`}
                >
                  <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-amber-900 flex items-center justify-between">
                      <span>Export Selected</span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold">
                        {selectedCount}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {selectedCount > 0 ? `Export only the ${selectedCount} selected rows` : 'Check rows in table first'}
                    </p>
                  </div>
                </button>

                {/* Option 3: Export All Leads */}
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportAll?.();
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-amber-50/70 transition-colors flex items-start space-x-2.5 group border-t border-slate-100"
                >
                  <Download className="w-4 h-4 text-slate-500 group-hover:text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-amber-900 flex items-center justify-between">
                      <span>Export All Database Leads</span>
                      <span className="bg-slate-200 text-slate-800 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold">
                        {totalCount}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Complete database snapshot (bypasses filters)
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 min-h-[40px]">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSelectChange('sortBy', e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
              aria-label="Sort leads by"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="fitScore">Highest Fit Score</option>
              <option value="priority">Highest Priority</option>
              <option value="followUp">Next Follow-up</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center px-2.5 py-2 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50/70 hover:bg-amber-100/70 rounded-lg border border-amber-200 transition-colors min-h-[40px]"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner on Mobile/Tablet */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <span>
          Showing <strong>{totalFiltered}</strong> of <strong>{totalCount}</strong> leads
        </span>
        {activeFilterCount > 0 && (
          <span className="text-amber-800 font-medium font-mono text-[10px]">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </span>
        )}
      </div>

      {/* Filter Options Grid: Visible on desktop (lg+), or toggled on mobile */}
      <div
        className={`${
          isOpenMobileFilters ? 'block' : 'hidden lg:block'
        } pt-2.5 border-t border-slate-100`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              STATUS
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleSelectChange('status', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="discovery">Discovery</option>
              <option value="proposal">Proposal</option>
              <option value="negotiations">Negotiations</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              PRIORITY
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleSelectChange('priority', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 focus:bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Fit Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              FIT LEVEL
            </label>
            <select
              value={filters.fitStatus}
              onChange={(e) => handleSelectChange('fitStatus', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 focus:bg-white"
            >
              <option value="all">All Fit Levels</option>
              <option value="high_fit">High Fit (70%+)</option>
              <option value="medium_fit">Medium Fit</option>
              <option value="low_fit">Low Fit</option>
              <option value="unreviewed">Unreviewed</option>
            </select>
          </div>

          {/* Intent Level */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              INTENT
            </label>
            <select
              value={filters.intentLevel}
              onChange={(e) => handleSelectChange('intentLevel', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 focus:bg-white"
            >
              <option value="all">All Intent</option>
              <option value="high">High Intent</option>
              <option value="medium">Medium Intent</option>
              <option value="low">Low Intent</option>
            </select>
          </div>

          {/* Healthcare Category */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              SECTOR
            </label>
            <select
              value={filters.healthcareCategory}
              onChange={(e) => handleSelectChange('healthcareCategory', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 focus:bg-white"
            >
              <option value="all">All Sectors</option>
              <option value="dental">Dental Practice</option>
              <option value="physiotherapy">Physiotherapy</option>
              <option value="cosmetic_surgery">Cosmetic Surgery</option>
              <option value="specialty_clinic">Specialty Clinic</option>
              <option value="hospital">Hospital Group</option>
              <option value="telehealth">Telehealth / Digital</option>
              <option value="mental_health">Mental Health</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="dermatology">Dermatology</option>
              <option value="general_practice">General Practice</option>
            </select>
          </div>

          {/* Lead Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              TYPE
            </label>
            <select
              value={filters.leadType}
              onChange={(e) => handleSelectChange('leadType', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 focus:bg-white"
            >
              <option value="all">All Types</option>
              <option value="growth_audit">Growth Audit™</option>
              <option value="discovery_call">Discovery Call</option>
              <option value="contact_enquiry">General Contact</option>
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              SOURCE
            </label>
            <select
              value={filters.leadSource}
              onChange={(e) => handleSelectChange('leadSource', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 focus:bg-white"
            >
              <option value="all">All Sources</option>
              <option value="organic">Organic</option>
              <option value="google_ads">Google Ads</option>
              <option value="meta_ads">Meta Ads</option>
              <option value="linkedin">LinkedIn</option>
              <option value="direct">Direct</option>
              <option value="referral">Referral</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              TIMEFRAME
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleSelectChange('dateRange', e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 focus:bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="prev_month">Previous Month</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
