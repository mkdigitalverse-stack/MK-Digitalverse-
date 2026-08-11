import React from 'react';
import { HealthcareSegmentMetric } from '../../services/growthAnalyticsService';
import { Building2, Stethoscope, PieChart, Layers } from 'lucide-react';

interface AnalyticsSegmentMatrixProps {
  segments: HealthcareSegmentMetric[];
}

export const AnalyticsSegmentMatrix: React.FC<AnalyticsSegmentMatrixProps> = ({ segments }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Healthcare Segment Performance Matrix</h3>
            <p className="text-[11px] text-slate-500">Comparative conversion, pipeline value, and deal size by healthcare category taxonomy</p>
          </div>
        </div>
      </div>

      {/* Table Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3">Healthcare Category</th>
              <th className="py-2.5 px-3 text-right">Total Leads</th>
              <th className="py-2.5 px-3 text-right">Qualified</th>
              <th className="py-2.5 px-3 text-right">Qual Rate</th>
              <th className="py-2.5 px-3 text-right">Discovery</th>
              <th className="py-2.5 px-3 text-right">Won Deals</th>
              <th className="py-2.5 px-3 text-right">Active Pipeline</th>
              <th className="py-2.5 px-3 text-right">Won Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {segments.map((seg) => (
              <tr key={seg.categoryKey} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center space-x-2">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{seg.categoryLabel}</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">{seg.totalLeads}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{seg.qualifiedLeads}</td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                    seg.qualificationRate >= 50
                      ? 'bg-emerald-50 text-emerald-800'
                      : seg.qualificationRate >= 25
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {seg.qualificationRate.toFixed(0)}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">{seg.discoveryCount}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                  {seg.wonCount > 0 ? `${seg.wonCount} Closed` : '—'}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                  {seg.activePipelineValue > 0 ? `$${seg.activePipelineValue.toLocaleString()}` : '$0'}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                  {seg.wonRevenue > 0 ? `$${seg.wonRevenue.toLocaleString()}` : '$0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
