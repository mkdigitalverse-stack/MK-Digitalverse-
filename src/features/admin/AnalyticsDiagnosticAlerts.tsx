import React from 'react';
import { DiagnosticRecommendation } from '../../services/growthAnalyticsService';
import { Lightbulb, AlertTriangle, CheckCircle, Info, Flame, ArrowRight } from 'lucide-react';

interface AnalyticsDiagnosticAlertsProps {
  diagnostics: DiagnosticRecommendation[];
}

export const AnalyticsDiagnosticAlerts: React.FC<AnalyticsDiagnosticAlertsProps> = ({ diagnostics }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Executive Diagnostic & Optimization Engine</h3>
            <p className="text-[11px] text-slate-500">Automated growth hypotheses, pipeline bottleneck analysis, and recommended actions</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {diagnostics.length} Active Insights
        </span>
      </div>

      {/* Diagnostics List */}
      <div className="space-y-3">
        {diagnostics.map((diag) => {
          let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
          let icon = <Info className="w-4 h-4 text-slate-500 shrink-0" />;

          if (diag.severity === 'urgent') {
            badgeStyle = 'bg-red-50 text-red-800 border-red-200';
            icon = <Flame className="w-4 h-4 text-red-600 shrink-0" />;
          } else if (diag.severity === 'warning') {
            badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
          } else if (diag.severity === 'positive') {
            badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            icon = <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />;
          }

          return (
            <div key={diag.id} className={`p-4 rounded-xl border ${badgeStyle} space-y-2`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {icon}
                  <h4 className="font-bold text-xs tracking-tight">{diag.title}</h4>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-current/10 shrink-0">
                  {diag.category}
                </span>
              </div>

              <div className="text-xs space-y-1.5 leading-relaxed">
                <div>
                  <strong className="opacity-90">Observation:</strong> {diag.observation}
                </div>
                <div>
                  <strong className="opacity-90">Hypothesis:</strong> {diag.hypothesis}
                </div>
                <div className="p-2 rounded bg-white/90 border border-current/10 font-medium flex items-center space-x-1.5 text-slate-900 mt-1">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>Recommended Action:</strong> {diag.action}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
