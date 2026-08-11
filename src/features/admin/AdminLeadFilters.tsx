import React from 'react';
import { Search, Filter, ArrowUpDown, X, Calendar } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  status: string;
  priority: string;
  fitStatus: string;
  intentLevel: string;
  healthcareCategory: string;
  leadType: string;
  leadSource: string;
  dateRange: 'all' | 'today' | '7days' | '30days';
  sortBy: 'newest' | 'oldest' | 'fitScore' | 'priority' | 'followUp';
}

interface AdminLeadFiltersProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalCount: number;
}

export const AdminLeadFilters: React.FC<AdminLeadFiltersProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalFiltered,
  totalCount
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    onChangeFilters({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.fitStatus !== 'all' ||
    filters.intentLevel !== 'all' ||
    filters.healthcareCategory !== 'all' ||
    filters.leadType !== 'all' ||
    filters.leadSource !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6 space-y-3">
      {/* Top Row: Search & Sort & Reset */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleTextChange}
            placeholder="Search leads by name, organization, email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-xs font-medium text-slate-600 hidden sm:inline">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSelectChange('sortBy', e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="fitScore">Highest Fit Score</option>
            <option value="priority">Highest Priority</option>
            <option value="followUp">Next Follow-up</option>
          </select>
        </div>

        {/* Filter Count & Reset */}
        <div className="flex items-center justify-between md:justify-end space-x-3 text-xs text-slate-500">
          <span>Showing <strong>{totalFiltered}</strong> of <strong>{totalCount}</strong></span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium hover:underline text-xs"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 border-t border-slate-100">
        
        {/* Status */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">STATUS</label>
          <select
            value={filters.status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">PRIORITY</label>
          <select
            value={filters.priority}
            onChange={(e) => handleSelectChange('priority', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500"
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
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">FIT STATUS</label>
          <select
            value={filters.fitStatus}
            onChange={(e) => handleSelectChange('fitStatus', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500"
          >
            <option value="all">All Fit Levels</option>
            <option value="high_fit">High Fit</option>
            <option value="medium_fit">Medium Fit</option>
            <option value="low_fit">Low Fit</option>
            <option value="unreviewed">Unreviewed</option>
          </select>
        </div>

        {/* Intent Level */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">INTENT</label>
          <select
            value={filters.intentLevel}
            onChange={(e) => handleSelectChange('intentLevel', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500"
          >
            <option value="all">All Intent</option>
            <option value="high_intent">High Intent</option>
            <option value="interested">Interested</option>
            <option value="exploratory">Exploratory</option>
          </select>
        </div>

        {/* Healthcare Sector */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">SECTOR</label>
          <select
            value={filters.healthcareCategory}
            onChange={(e) => handleSelectChange('healthcareCategory', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500"
          >
            <option value="all">All Sectors</option>
            <option value="hospital">Hospital / Health System</option>
            <option value="specialty_clinic">Specialty Clinic</option>
            <option value="ivf_fertility">IVF & Fertility</option>
            <option value="dental">Dental Group</option>
            <option value="surgical">Surgical Center</option>
            <option value="diagnostic">Diagnostic Network</option>
            <option value="other_healthcare">Other Healthcare</option>
          </select>
        </div>

        {/* Lead Type */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">LEAD TYPE</label>
          <select
            value={filters.leadType}
            onChange={(e) => handleSelectChange('leadType', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500"
          >
            <option value="all">All Lead Types</option>
            <option value="growth_audit">Growth Audit™</option>
            <option value="discovery_call">Discovery Call</option>
            <option value="contact_enquiry">Contact Enquiry</option>
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">SOURCE</label>
          <select
            value={filters.leadSource}
            onChange={(e) => handleSelectChange('leadSource', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500"
          >
            <option value="all">All Sources</option>
            <option value="organic">Organic Search</option>
            <option value="google_ads">Google Ads</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="linkedin">LinkedIn</option>
            <option value="direct">Direct</option>
            <option value="referral">Referral</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">DATE RANGE</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleSelectChange('dateRange', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2 py-1.5 focus:border-amber-500 font-medium text-slate-700"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

      </div>
    </div>
  );
};
