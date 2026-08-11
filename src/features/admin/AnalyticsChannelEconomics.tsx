import React from 'react';
import { ChannelPerformanceMetric, CampaignAttributionMetric } from '../../services/growthAnalyticsService';
import { Share2, DollarSign, AlertCircle, Sparkles, Megaphone } from 'lucide-react';

interface AnalyticsChannelEconomicsProps {
  channels: ChannelPerformanceMetric[];
  campaigns: CampaignAttributionMetric[];
}

export const AnalyticsChannelEconomics: React.FC<AnalyticsChannelEconomicsProps> = ({ channels, campaigns }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Acquisition Channel Performance & Economics</h3>
            <p className="text-[11px] text-slate-500">Source attribution, qualified lead efficiency, and pipeline contribution</p>
          </div>
        </div>
      </div>

      {/* Notice about spend data */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-2 text-xs">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-slate-600 leading-relaxed text-[11px]">
          <strong className="text-slate-800">Spend Data Notice:</strong> Paid campaign expenditure data (CPL, CPQL, CAC) requires direct ad platform campaign sync inputs. Pipeline value, qualified lead count, and conversion rates below reflect exact operational records in Firestore.
        </div>
      </div>

      {/* Primary Channel Table */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Core Acquisition Channels</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Acquisition Channel</th>
                <th className="py-2.5 px-3 text-right">Total Leads</th>
                <th className="py-2.5 px-3 text-right">Qualified Leads</th>
                <th className="py-2.5 px-3 text-right">Qual Rate</th>
                <th className="py-2.5 px-3 text-right">Won Deals</th>
                <th className="py-2.5 px-3 text-right">Active Pipeline</th>
                <th className="py-2.5 px-3 text-right">Won Revenue</th>
                <th className="py-2.5 px-3 text-right">CPL / CPQL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {channels.map((ch) => (
                <tr key={ch.sourceKey} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{ch.sourceLabel}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">{ch.totalLeads}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{ch.qualifiedLeads}</td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      ch.qualificationRate >= 50
                        ? 'bg-emerald-50 text-emerald-800'
                        : ch.qualificationRate >= 25
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ch.qualificationRate.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                    {ch.wonCount > 0 ? `${ch.wonCount} Closed` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                    {ch.activePipelineValue > 0 ? `$${ch.activePipelineValue.toLocaleString()}` : '$0'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                    {ch.wonRevenue > 0 ? `$${ch.wonRevenue.toLocaleString()}` : '$0'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400 italic text-[11px]">
                    {ch.hasSpendData ? `$${ch.cpl}` : 'Spend Unlinked'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign / UTM Attribution Section */}
      {campaigns.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
            <Megaphone className="w-3.5 h-3.5 text-slate-500" />
            <span>Top Campaign / Content Attribution</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {campaigns.map((cmp, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{cmp.campaignName}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Source: {cmp.source} | Medium: {cmp.medium}
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-slate-900">{cmp.totalLeads} leads ({cmp.qualifiedLeads} qual)</div>
                  {cmp.wonRevenue > 0 ? (
                    <div className="text-emerald-700 font-bold text-[11px]">${cmp.wonRevenue.toLocaleString()} Won</div>
                  ) : (
                    <div className="text-slate-500 text-[11px]">${cmp.activePipelineValue.toLocaleString()} Pipeline</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
