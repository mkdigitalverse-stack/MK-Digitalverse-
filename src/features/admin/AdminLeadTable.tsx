import React from 'react';
import { CompleteLeadRecord, LeadPriority, FitStatus, IntentLevel } from '../../services/qualification';
import { ChevronRight, Calendar, Building2, User, Mail, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

interface AdminLeadTableProps {
  leads: CompleteLeadRecord[];
  onSelectLead: (lead: CompleteLeadRecord) => void;
  isLoading?: boolean;
}

export const AdminLeadTable: React.FC<AdminLeadTableProps> = ({
  leads,
  onSelectLead,
  isLoading = false
}) => {

  const renderPriorityBadge = (priority: LeadPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping mr-1.5" />
            URGENT
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            HIGH
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            NORMAL
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
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
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${color}`}>
        {score} / 100
      </span>
    );
  };

  const renderStatusBadge = (status: CompleteLeadRecord['status']) => {
    const statusMap: Record<CompleteLeadRecord['status'], { label: string; style: string }> = {
      new: { label: 'New', style: 'bg-blue-500 text-white' },
      contacted: { label: 'Contacted', style: 'bg-indigo-100 text-indigo-800 border border-indigo-200' },
      qualified: { label: 'Qualified', style: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
      proposal: { label: 'Proposal', style: 'bg-purple-100 text-purple-800 border border-purple-200' },
      won: { label: 'Won Partner', style: 'bg-amber-100 text-amber-900 border border-amber-200 font-bold' },
      lost: { label: 'Lost', style: 'bg-gray-100 text-gray-500 border border-gray-200' }
    };

    const item = statusMap[status] || { label: status, style: 'bg-gray-100 text-gray-700' };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.style}`}>
        {item.label}
      </span>
    );
  };

  const renderLeadTypeLabel = (type: string) => {
    switch (type) {
      case 'growth_audit':
        return <span className="text-amber-800 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 text-[11px]">Growth Audit™</span>;
      case 'discovery_call':
        return <span className="text-blue-800 font-medium bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60 text-[11px]">Discovery Call</span>;
      default:
        return <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">Contact Enquiry</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-600 font-medium">Querying Firestore /leads intelligence dataset...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">No healthcare enquiries found</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No records match the selected filter criteria or no submissions have been recorded in the Firestore database yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Organization</th>
              <th className="py-3 px-4">Sector</th>
              <th className="py-3 px-4">Lead Type</th>
              <th className="py-3 px-4">Fit Score</th>
              <th className="py-3 px-4">Intent</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {leads.map((lead) => (
              <tr
                key={lead.leadId}
                onClick={() => onSelectLead(lead)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                {/* Priority */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {renderPriorityBadge(lead.qualification.leadPriority)}
                </td>

                {/* Contact */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {lead.visitorData.contactName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate max-w-[160px]">
                    {lead.visitorData.email}
                  </div>
                </td>

                {/* Organization */}
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-800 truncate max-w-[150px]">
                    {lead.visitorData.organizationName || 'N/A'}
                  </div>
                  {lead.visitorData.location && (
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {lead.visitorData.location}
                    </div>
                  )}
                </td>

                {/* Sector */}
                <td className="py-3 px-4 whitespace-nowrap text-slate-600">
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

                {/* Intent */}
                <td className="py-3 px-4 whitespace-nowrap capitalize text-slate-600 font-medium">
                  {lead.qualification.intentLevel.replace('_', ' ')}
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {renderStatusBadge(lead.status)}
                </td>

                {/* Source */}
                <td className="py-3 px-4 whitespace-nowrap capitalize text-slate-500 text-[11px]">
                  {lead.qualification.derivedLeadSource.replace('_', ' ')}
                </td>

                {/* Created At */}
                <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                  {formatDate(lead.createdAt)}
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLead(lead);
                    }}
                    className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-medium transition-colors"
                  >
                    Manage
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card Layout (Below lg) */}
      <div className="block lg:hidden divide-y divide-slate-100">
        {leads.map((lead) => (
          <div
            key={lead.leadId}
            onClick={() => onSelectLead(lead)}
            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {renderPriorityBadge(lead.qualification.leadPriority)}
                {renderLeadTypeLabel(lead.visitorData.leadType)}
              </div>
              {renderStatusBadge(lead.status)}
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">{lead.visitorData.contactName}</h4>
              <p className="text-xs text-slate-600">{lead.visitorData.organizationName || 'No organization specified'}</p>
              <p className="text-xs text-slate-400 font-mono">{lead.visitorData.email}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <span>Fit Score: <strong>{lead.qualification.fitScore}/100</strong></span>
                <span>•</span>
                <span className="capitalize">{lead.qualification.derivedLeadSource.replace('_', ' ')}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLead(lead);
                }}
                className="text-amber-800 font-medium hover:underline text-xs inline-flex items-center"
              >
                View Detail
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
