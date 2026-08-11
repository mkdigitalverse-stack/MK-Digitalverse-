import React, { useState, useEffect } from 'react';
import { AdminNotificationClient, NotificationStatusResponse, NotificationRecordClient } from '../../services/adminNotificationClient';
import { CompleteLeadRecord } from '../../services/qualification';
import { FollowUpAutomationEngine } from '../../services/followUpAutomation';
import { Mail, CheckCircle2, AlertTriangle, RefreshCw, Send, Shield, Zap, Server, Key, Terminal, FileCode2, Clock, RotateCcw, Flame } from 'lucide-react';

interface AdminNotificationCenterProps {
  leads: CompleteLeadRecord[];
}

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({ leads }) => {
  const [statusData, setStatusData] = useState<NotificationStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<NotificationRecordClient | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');

  const fetchStatus = async () => {
    setIsRefreshing(true);
    setErrorMessage(null);
    try {
      const data = await AdminNotificationClient.getStatus();
      setStatusData(data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to fetch notification server status');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Compute Revenue Alert Triggers from current leads
  const now = new Date();
  const activeLeads = leads.filter(l => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost');

  const overdueLeads = activeLeads.filter(lead => {
    const evalRes = FollowUpAutomationEngine.evaluateOpportunity(lead, now);
    return evalRes.classification === 'OVERDUE';
  });

  const staleLeads = activeLeads.filter(lead => {
    const evalRes = FollowUpAutomationEngine.evaluateOpportunity(lead, now);
    return evalRes.daysSinceLastActivity >= 7;
  });

  const urgentUncontactedLeads = activeLeads.filter(lead => {
    return lead.status === 'new' && (lead.qualification.leadPriority === 'urgent' || lead.qualification.leadPriority === 'high');
  });

  const handleRunTest = async () => {
    setIsTestRunning(true);
    setTestSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await AdminNotificationClient.runEndToEndTest();
      if (res.success) {
        setTestSuccessMessage(`E2E Test Succeeded! Lead Alert ID: ${res.intakeResult?.id || 'N/A'}, Revenue Alert ID: ${res.revenueResult?.id || 'N/A'}`);
        await fetchStatus();
      } else {
        setErrorMessage(res.message || 'E2E Test execution failed');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error executing test');
    } finally {
      setIsTestRunning(false);
    }
  };

  const handleRetryFailed = async () => {
    setIsRefreshing(true);
    try {
      const res = await AdminNotificationClient.triggerRetry();
      if (res.success) {
        setTestSuccessMessage(`Retry sequence complete. ${res.newlySentCount || 0} alerts successfully dispatched.`);
        await fetchStatus();
      } else {
        setErrorMessage(res.message || 'Retry execution failed');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Retry error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBatchProcessLeadAlerts = async () => {
    setIsRefreshing(true);
    setTestSuccessMessage(null);
    let processed = 0;

    for (const lead of leads.slice(0, 10)) {
      const res = await AdminNotificationClient.processLeadNotification({
        leadId: lead.leadId,
        leadType: lead.visitorData.leadType,
        contactName: lead.visitorData.contactName,
        organizationName: lead.visitorData.organizationName,
        email: lead.visitorData.email,
        phone: lead.visitorData.phone,
        website: lead.visitorData.website,
        healthcareCategory: lead.visitorData.healthcareCategory,
        biggestChallenge: lead.visitorData.biggestChallenge,
        growthObjective: lead.visitorData.growthObjective,
        investmentReadiness: lead.visitorData.investmentReadiness
      });
      if (res.success) processed++;
    }

    setTestSuccessMessage(`Batch processing completed for ${processed} lead intake alerts.`);
    await fetchStatus();
    setIsRefreshing(false);
  };

  const filteredRecords = (statusData?.records || []).filter(r => {
    if (filterType === 'sent') return r.status === 'sent';
    if (filterType === 'failed') return r.status === 'failed' || r.status === 'retrying';
    if (filterType === 'pending') return r.status === 'pending';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              Phase F-08 Production
            </span>
            <span className="text-xs font-mono text-slate-400">Server Infrastructure Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-amber-400" />
            <span>Server-Side Notification & Revenue Alert Infrastructure</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Handles Firestore-triggered lead intake notifications, pipeline revenue alerts, exponential backoff retries, idempotency protection, and server credential isolation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunTest}
            disabled={isTestRunning}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all disabled:opacity-50"
          >
            {isTestRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Run E2E Test Dispatch</span>
          </button>

          <button
            onClick={handleBatchProcessLeadAlerts}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-2xs transition-all"
          >
            <Send className="w-4 h-4 text-emerald-400" />
            <span>Queue Pending Lead Alerts</span>
          </button>

          <button
            onClick={fetchStatus}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Refresh Server Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Success / Error Messages */}
      {testSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testSuccessMessage}</span>
          </div>
          <button onClick={() => setTestSuccessMessage(null)} className="text-xs text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-xs text-red-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Queue Dispatched</span>
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {statusData?.stats.sentCount || 0}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
              Sent / Idempotent
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending / Retrying</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {(statusData?.stats.pendingCount || 0) + (statusData?.stats.retryCount || 0)}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
              In Backoff Loop
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Failed Dispatches</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {statusData?.stats.failedCount || 0}
            </span>
            {(statusData?.stats.failedCount || 0) > 0 ? (
              <button
                onClick={handleRetryFailed}
                className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-900 border border-red-300 rounded hover:bg-red-200 transition-colors flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry All</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                Zero Failures
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Email Transport</span>
            <Key className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-800 truncate">
              {statusData?.config.hasApiKey ? 'Transactional API' : 'Production Sandbox Logger'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded">
              {statusData?.config.recipientEmail || 'mkdigitalverse@gmail.com'}
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Operations Live Alerts Bar */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Revenue Operations & Pipeline Alert Triggers</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-white/80 px-2.5 py-1 rounded-md border border-amber-200">
            Automated Server Thresholds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Overdue Follow-Ups</div>
              <div className="text-[11px] text-slate-500">Requires instant sales contact</div>
            </div>
            <span className="text-lg font-bold font-mono text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg">
              {overdueLeads.length}
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Stale Opportunities (7+ Days)</div>
              <div className="text-[11px] text-slate-500">Inactive active pipeline accounts</div>
            </div>
            <span className="text-lg font-bold font-mono text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-lg">
              {staleLeads.length}
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Urgent Uncontacted Leads</div>
              <div className="text-[11px] text-slate-500">New high priority enquiries</div>
            </div>
            <span className="text-lg font-bold font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
              {urgentUncontactedLeads.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Audit Logs Table & Detail Modal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Controls Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Transactional Dispatch Audit Log & Queue
            </h3>
            <span className="text-[10px] font-mono text-slate-500">({filteredRecords.length} Records)</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-200/60 p-1 rounded-lg border border-slate-300/60">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('sent')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${filterType === 'sent' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Sent
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${filterType === 'pending' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterType('failed')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${filterType === 'failed' ? 'bg-red-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Failed / Retry
            </button>
          </div>
        </div>

        {/* Table Content */}
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Mail className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-medium">No notification records match the active filter.</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Run the E2E Test Dispatch above or submit a test form on the public website to generate live server notifications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Alert Type</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Created / Sent At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        rec.status === 'sent' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        rec.status === 'retrying' ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse' :
                        rec.status === 'pending' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {rec.status === 'sent' && <CheckCircle2 className="w-3 h-3" />}
                        {rec.status === 'failed' && <AlertTriangle className="w-3 h-3" />}
                        <span>{rec.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-semibold text-slate-900">
                      {rec.type}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {rec.recipientEmail}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {rec.subject}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {rec.attempts} / {rec.maxAttempts}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                      {rec.sentAt ? new Date(rec.sentAt).toLocaleTimeString() : new Date(rec.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-800 hover:underline inline-flex items-center space-x-1"
                      >
                        <FileCode2 className="w-3 h-3" />
                        <span>Envelope</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slideover / Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 font-mono">Notification Envelope & Audit Details</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded-md"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl space-y-1">
                <div><span className="text-amber-400">Record ID:</span> {selectedRecord.id}</div>
                <div><span className="text-amber-400">Idempotency Key:</span> {selectedRecord.idempotencyKey}</div>
                <div><span className="text-amber-400">Provider Ref:</span> {selectedRecord.providerResponseId || 'N/A'}</div>
                <div><span className="text-amber-400">Status:</span> {selectedRecord.status.toUpperCase()} (Attempts: {selectedRecord.attempts})</div>
              </div>

              {selectedRecord.error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs font-medium">
                  <strong>Error Log:</strong> {selectedRecord.error}
                </div>
              )}

              <div className="space-y-1">
                <div className="font-bold text-slate-700">Envelope Headers</div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1">
                  <div><strong>From:</strong> {selectedRecord.senderEmail}</div>
                  <div><strong>To:</strong> {selectedRecord.recipientEmail}</div>
                  <div><strong>Subject:</strong> {selectedRecord.subject}</div>
                  <div><strong>Lead ID:</strong> {selectedRecord.leadId}</div>
                  <div><strong>Created:</strong> {selectedRecord.createdAt}</div>
                  {selectedRecord.sentAt && <div><strong>Sent At:</strong> {selectedRecord.sentAt}</div>}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-700">Plain Text Body Content</div>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-xl text-[11px] overflow-x-auto whitespace-pre-wrap font-mono">
                  {selectedRecord.bodyText}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
