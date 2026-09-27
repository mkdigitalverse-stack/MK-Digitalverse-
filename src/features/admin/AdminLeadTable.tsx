import React, { useState, useRef, useEffect } from 'react';
import { CompleteLeadRecord, LeadPriority, FitStatus, OpportunityStage } from '../../services/qualification';
import { 
  ChevronRight, 
  ChevronDown,
  Building2, 
  MapPin,
  Download,
  X,
  CheckSquare,
  Square,
  Check
} from 'lucide-react';

interface AdminLeadTableProps {
  leads: CompleteLeadRecord[];
  onSelectLead: (lead: CompleteLeadRecord) => void;
  isLoading?: boolean;
  selectedLeadIds?: Set<string>;
  onToggleSelectLead?: (leadId: string) => void;
  onSelectAllVisible?: () => void;
  onClearSelection?: () => void;
  onExportSelected?: () => void;
}

export const AdminLeadTable: React.FC<AdminLeadTableProps> = ({
  leads,
  onSelectLead,
  isLoading = false,
  selectedLeadIds = new Set(),
  onToggleSelectLead,
  onSelectAllVisible,
  onClearSelection,
  onExportSelected
}) => {
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const selectedCount = selectedLeadIds.size;
  const isAllVisibleSelected = leads.length > 0 && leads.every(lead => selectedLeadIds.has(lead.leadId));
  const isSomeVisibleSelected = leads.length > 0 && leads.some(lead => selectedLeadIds.has(lead.leadId)) && !isAllVisibleSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeVisibleSelected;
    }
  }, [isSomeVisibleSelected]);

  const toggleExpandCard = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCardIds(prev => ({
      ...prev,
      [leadId]: !prev[leadId]
    }));
  };

  const renderPriorityBadge = (priority: LeadPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping mr-1.5" />
            URGENT
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            HIGH
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            NORMAL
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
            LOW
          </span>
        );
    }
  };

  const renderFitBadge = (fit: FitStatus, score: number) => {
    let color = 'bg-slate-100 text-slate-700 border-slate-200';
    if (score >= 75) color = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
    else if (score >= 50) color = 'bg-blue-50 text-blue-800 border-blue-200';
    else color = 'bg-gray-50 text-gray-600 border-gray-200';

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${color} font-mono`}>
        {score}/100
      </span>
    );
  };

  const renderStatusBadge = (status: CompleteLeadRecord['status']) => {
    const statusMap: Record<OpportunityStage, { label: string; style: string }> = {
      new: { label: 'New', style: 'bg-blue-600 text-white font-semibold' },
      contacted: { label: 'Contacted', style: 'bg-amber-100 text-amber-900 border border-amber-300 font-medium' },
      qualified: { label: 'Qualified', style: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium' },
      discovery: { label: 'Discovery', style: 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-medium' },
      proposal: { label: 'Proposal', style: 'bg-purple-100 text-purple-900 border border-purple-300 font-medium' },
      negotiations: { label: 'Negotiations', style: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold' },
      won: { label: 'Won', style: 'bg-teal-100 text-teal-900 border border-teal-300 font-bold' },
      lost: { label: 'Lost', style: 'bg-slate-100 text-slate-600 border border-slate-300 font-medium' }
    };

    const item = statusMap[status] || { label: status, style: 'bg-gray-100 text-gray-700' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${item.style}`}>
        {item.label}
      </span>
    );
  };

  const renderLeadTypeLabel = (type: string) => {
    switch (type) {
      case 'growth_audit':
        return <span className="text-amber-900 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">Growth Audit™</span>;
      case 'discovery_call':
        return <span className="text-blue-900 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">Discovery Call</span>;
      default:
        return <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">Contact Enquiry</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (_) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-600 font-medium">Loading leads intelligence dataset...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">No healthcare leads found</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No records match the active filter criteria or no submissions have been recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* BULK SELECTION ACTION BAR (Always visible when items selected) */}
      {selectedCount > 0 && (
        <div className="bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-bold text-xs font-mono">
              {selectedCount}
            </span>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white">
                {selectedCount} lead{selectedCount > 1 ? 's' : ''} selected
              </span>
              <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">
                ({leads.length} currently visible in view)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onSelectAllVisible && !isAllVisibleSelected && (
              <button
                type="button"
                onClick={onSelectAllVisible}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 font-medium transition-colors min-h-[36px]"
              >
                Select all visible ({leads.length})
              </button>
            )}

            {onExportSelected && (
              <button
                type="button"
                onClick={onExportSelected}
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors min-h-[36px]"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>Export Selected ({selectedCount})</span>
              </button>
            )}

            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors min-h-[36px]"
                title="Clear row selection"
              >
                <X className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAIN TABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* DESKTOP TABLE VIEW (Visible on lg: 1024px+) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                {/* Row Selection Checkbox Header */}
                <th className="py-3 px-3 w-10 text-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      ref={headerCheckboxRef}
                      checked={isAllVisibleSelected}
                      onChange={onSelectAllVisible}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                      title={isAllVisibleSelected ? 'Deselect all visible leads' : 'Select all visible leads'}
                      aria-label="Select all visible leads"
                    />
                  </div>
                </th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Lead Type</th>
                <th className="py-3 px-4">Fit Score</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {leads.map((lead) => {
                const isSelected = selectedLeadIds.has(lead.leadId);

                return (
                  <tr
                    key={lead.leadId}
                    onClick={() => onSelectLead(lead)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-amber-50/50 hover:bg-amber-50/80' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Checkbox Column */}
                    <td 
                      className="py-3 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelectLead?.(lead.leadId);
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer pointer-events-none"
                          aria-label={`Select lead ${lead.visitorData.contactName}`}
                        />
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderPriorityBadge(lead.qualification.leadPriority)}
                    </td>

                    {/* Contact Name & Email */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                        {lead.visitorData.contactName}
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono truncate max-w-[150px]">
                        {lead.visitorData.email}
                      </div>
                    </td>

                    {/* Organization */}
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <div className="truncate max-w-[160px]">
                        {lead.visitorData.organizationName || 'Not specified'}
                      </div>
                      {lead.visitorData.location && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {lead.visitorData.location}
                        </div>
                      )}
                    </td>

                    {/* Healthcare Sector */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 capitalize">
                      {lead.visitorData.healthcareCategory || 'Healthcare'}
                    </td>

                    {/* Lead Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderLeadTypeLabel(lead.visitorData.leadType)}
                    </td>

                    {/* Fit Score */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderFitBadge(lead.qualification.fitStatus, lead.qualification.fitScore)}
                    </td>

                    {/* Stage (Single source of truth: public.leads.status) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderStatusBadge(lead.status)}
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4 whitespace-nowrap capitalize text-slate-500 text-[11px]">
                      {(lead.qualification.derivedLeadSource || 'direct').replace('_', ' ')}
                    </td>

                    {/* Created At */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px] font-mono">
                      {formatDate(lead.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-semibold transition-colors min-h-[32px]"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE & TABLET RESPONSIVE CARD VIEW (Visible below lg: <1024px) */}
        <div className="block lg:hidden divide-y divide-slate-100">
          {leads.map((lead) => {
            const isExpanded = expandedCardIds[lead.leadId] ?? false;
            const isSelected = selectedLeadIds.has(lead.leadId);

            return (
              <div
                key={lead.leadId}
                onClick={() => onSelectLead(lead)}
                className={`p-3.5 sm:p-4 transition-colors cursor-pointer space-y-3 ${
                  isSelected ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Top Row: Checkbox, Priority Badge, Lead Type & Stage Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    {/* Mobile Card Checkbox with minimum 44px tap target */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelectLead?.(lead.leadId);
                      }}
                      className="p-1.5 -ml-1 text-slate-400 hover:text-amber-600 focus:outline-none flex items-center justify-center min-h-[44px] min-w-[44px]"
                      aria-label={isSelected ? `Deselect ${lead.visitorData.contactName}` : `Select ${lead.visitorData.contactName}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer pointer-events-none"
                      />
                    </button>
                    {renderPriorityBadge(lead.qualification.leadPriority)}
                    {renderLeadTypeLabel(lead.visitorData.leadType)}
                  </div>
                  {renderStatusBadge(lead.status)}
                </div>

                {/* Main Info: Contact Name & Organization */}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {lead.visitorData.contactName}
                  </h4>
                  <p className="text-xs font-semibold text-amber-900">
                    {lead.visitorData.organizationName || 'Healthcare Provider'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span className="truncate">{lead.visitorData.email}</span>
                    {lead.visitorData.phone && (
                      <>
                        <span>•</span>
                        <span className="shrink-0">{lead.visitorData.phone}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Key Metrics Strip: Fit Score & Estimated Value & Created */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Fit Score</span>
                    <span className="font-bold font-mono text-slate-800">
                      {lead.qualification.fitScore || 0}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Value</span>
                    <span className="font-bold font-mono text-slate-900 truncate block">
                      ${(lead.qualification.estimatedOpportunityValue || 25000).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Submitted</span>
                    <span className="font-mono text-slate-600 block text-[11px]">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Expandable Secondary Details (Accordion Toggle) */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 text-xs space-y-2 bg-slate-50/50 p-2.5 rounded-lg text-slate-700">
                    {lead.visitorData.location && (
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Location: <strong>{lead.visitorData.location}</strong></span>
                      </div>
                    )}

                    {lead.visitorData.healthcareCategory && (
                      <div>
                        Sector: <strong>{lead.visitorData.healthcareCategory}</strong>
                      </div>
                    )}

                    {lead.visitorData.biggestChallenge && (
                      <div>
                        Challenge: <span className="text-slate-600 italic">"{lead.visitorData.biggestChallenge}"</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                      <span>Source: <strong className="capitalize">{(lead.qualification.derivedLeadSource || 'direct').replace('_', ' ')}</strong></span>
                      <span>Intent: <strong>{lead.qualification.intentLevel || 'Medium'}</strong></span>
                    </div>
                  </div>
                )}

                {/* Bottom Actions Row: Minimum 44px touch targets */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => toggleExpandCard(lead.leadId, e)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium py-2 px-1 flex items-center space-x-1 min-h-[44px]"
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Less info' : 'More details'}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLead(lead);
                    }}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-colors min-h-[44px]"
                  >
                    <span>View & Manage</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
