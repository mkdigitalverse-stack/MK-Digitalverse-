import React, { useState, useEffect } from 'react';
import { 
  CompleteLeadRecord, 
  FitStatus, 
  LeadPriority, 
  IntentLevel, 
  GrowthStage, 
  OpportunityStage, 
  ProposalStatus, 
  LostReason, 
  STAGE_PROBABILITIES 
} from '../../services/qualification';
import { adminLeadsService, LeadActivity } from '../../services/adminLeadsService';
import { 
  X, 
  Save, 
  Clock, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  PieChart, 
  Layers, 
  Handshake, 
  ThumbsUp, 
  ThumbsDown,
  Activity,
  Plus,
  Send,
  History
} from 'lucide-react';

interface AdminLeadDetailModalProps {
  lead: CompleteLeadRecord | null;
  onClose: () => void;
  onSaveLead: (leadId: string, updates: any) => Promise<void>;
}

export const AdminLeadDetailModal: React.FC<AdminLeadDetailModalProps> = ({
  lead,
  onClose,
  onSaveLead
}) => {
  if (!lead) return null;

  // Editable Form State
  const [status, setStatus] = useState<CompleteLeadRecord['status']>(lead.status);
  const [fitStatus, setFitStatus] = useState<FitStatus>(lead.qualification.fitStatus);
  const [leadPriority, setLeadPriority] = useState<LeadPriority>(lead.qualification.leadPriority);
  const [intentLevel, setIntentLevel] = useState<IntentLevel>(lead.qualification.intentLevel);
  const [growthStage, setGrowthStage] = useState<GrowthStage>(lead.qualification.growthStage);
  const [opportunityStage, setOpportunityStage] = useState<OpportunityStage>(lead.qualification.opportunityStage || 'new');
  const [assignedTo, setAssignedTo] = useState<string>(lead.qualification.assignedTo || '');
  const [nextFollowUpAt, setNextFollowUpAt] = useState<string>(lead.qualification.nextFollowUpAt || '');
  const [lastContactedAt, setLastContactedAt] = useState<string>(lead.qualification.lastContactedAt || '');
  const [internalNotes, setInternalNotes] = useState<string>(lead.qualification.internalNotes || '');
  const [fitScore, setFitScore] = useState<number>(lead.qualification.fitScore);

  // F-06 Pipeline & Sales State
  const [estimatedOpportunityValue, setEstimatedOpportunityValue] = useState<number>(lead.qualification.estimatedOpportunityValue || 0);
  const [currency, setCurrency] = useState<string>(lead.qualification.currency || 'USD');
  const [nextAction, setNextAction] = useState<string>(lead.qualification.nextAction || '');

  // Discovery
  const [discoveryDate, setDiscoveryDate] = useState<string>(lead.qualification.discoveryDate || '');
  const [decisionMaker, setDecisionMaker] = useState<string>(lead.qualification.decisionMaker || '');
  const [decisionTimeline, setDecisionTimeline] = useState<string>(lead.qualification.decisionTimeline || '');

  // Proposal
  const [proposalStatus, setProposalStatus] = useState<ProposalStatus>(lead.qualification.proposalStatus || 'not_started');
  const [proposalValue, setProposalValue] = useState<number>(lead.qualification.proposalValue || 0);
  const [proposalSentAt, setProposalSentAt] = useState<string>(lead.qualification.proposalSentAt || '');
  const [proposalFollowUpAt, setProposalFollowUpAt] = useState<string>(lead.qualification.proposalFollowUpAt || '');

  // Negotiation
  const [negotiationStatus, setNegotiationStatus] = useState<string>(lead.qualification.negotiationStatus || '');
  const [expectedDecisionDate, setExpectedDecisionDate] = useState<string>(lead.qualification.expectedDecisionDate || '');
  const [negotiationNotes, setNegotiationNotes] = useState<string>(lead.qualification.negotiationNotes || '');

  // Outcome
  const [wonDate, setWonDate] = useState<string>(lead.qualification.wonDate || '');
  const [finalContractValue, setFinalContractValue] = useState<number>(lead.qualification.finalContractValue || 0);

  const [lostDate, setLostDate] = useState<string>(lead.qualification.lostDate || '');
  const [lostReason, setLostReason] = useState<LostReason | ''>(lead.qualification.lostReason || '');
  const [lostNotes, setLostNotes] = useState<string>(lead.qualification.lostNotes || '');

  // Activity Timeline State
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [newActivityNote, setNewActivityNote] = useState<string>('');
  const [isAddingActivity, setIsAddingActivity] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setStatus(lead.status);
    setFitStatus(lead.qualification.fitStatus);
    setLeadPriority(lead.qualification.leadPriority);
    setIntentLevel(lead.qualification.intentLevel);
    setGrowthStage(lead.qualification.growthStage);
    setOpportunityStage(lead.qualification.opportunityStage || 'new');
    setAssignedTo(lead.qualification.assignedTo || '');
    setNextFollowUpAt(lead.qualification.nextFollowUpAt || '');
    setLastContactedAt(lead.qualification.lastContactedAt || '');
    setInternalNotes(lead.qualification.internalNotes || '');
    setFitScore(lead.qualification.fitScore);

    setEstimatedOpportunityValue(lead.qualification.estimatedOpportunityValue || 0);
    setCurrency(lead.qualification.currency || 'USD');
    setNextAction(lead.qualification.nextAction || '');

    setDiscoveryDate(lead.qualification.discoveryDate || '');
    setDecisionMaker(lead.qualification.decisionMaker || '');
    setDecisionTimeline(lead.qualification.decisionTimeline || '');

    setProposalStatus(lead.qualification.proposalStatus || 'not_started');
    setProposalValue(lead.qualification.proposalValue || 0);
    setProposalSentAt(lead.qualification.proposalSentAt || '');
    setProposalFollowUpAt(lead.qualification.proposalFollowUpAt || '');

    setNegotiationStatus(lead.qualification.negotiationStatus || '');
    setExpectedDecisionDate(lead.qualification.expectedDecisionDate || '');
    setNegotiationNotes(lead.qualification.negotiationNotes || '');

    setWonDate(lead.qualification.wonDate || '');
    setFinalContractValue(lead.qualification.finalContractValue || 0);

    setLostDate(lead.qualification.lostDate || '');
    setLostReason(lead.qualification.lostReason || '');
    setLostNotes(lead.qualification.lostNotes || '');

    setSaveSuccess(false);
    setErrorMessage(null);

    // Subscribe to activity timeline subcollection
    const unsub = adminLeadsService.subscribeToActivities(
      lead.leadId,
      (fetched) => setActivities(fetched),
      (err) => console.warn('Activities subcollection subscription error:', err)
    );

    return () => unsub();
  }, [lead]);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      await onSaveLead(lead.leadId, {
        status,
        fitStatus,
        leadPriority,
        intentLevel,
        growthStage,
        opportunityStage,
        assignedTo,
        nextFollowUpAt,
        lastContactedAt,
        internalNotes,
        fitScore,
        estimatedOpportunityValue,
        currency,
        nextAction,
        discoveryDate,
        decisionMaker,
        decisionTimeline,
        proposalStatus,
        proposalValue,
        proposalSentAt,
        proposalFollowUpAt,
        negotiationStatus,
        expectedDecisionDate,
        negotiationNotes,
        wonDate,
        finalContractValue,
        lostDate,
        lostReason: lostReason || undefined,
        lostNotes,
        qualificationReviewedAt: new Date().toISOString()
      });

      // Log activity if stage changed
      if (opportunityStage !== lead.qualification.opportunityStage) {
        await adminLeadsService.addActivity(lead.leadId, {
          type: 'stage_change',
          description: `Opportunity stage updated from ${lead.qualification.opportunityStage || 'new'} to ${opportunityStage}`,
          actor: assignedTo || 'Growth Partner'
        });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update lead record');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCustomActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityNote.trim()) return;

    setIsAddingActivity(true);
    try {
      await adminLeadsService.addActivity(lead.leadId, {
        type: 'note_added',
        description: newActivityNote.trim(),
        actor: assignedTo || 'Growth Partner'
      });
      setNewActivityNote('');
    } catch (err) {
      console.error('Failed to log activity note:', err);
    } finally {
      setIsAddingActivity(false);
    }
  };

  const handleMarkContactedNow = async () => {
    const nowIso = new Date().toISOString();
    setLastContactedAt(nowIso);
    if (status === 'new') {
      setStatus('contacted');
    }
    if (opportunityStage === 'new') {
      setOpportunityStage('contacted');
    }
    await adminLeadsService.addActivity(lead.leadId, {
      type: 'contacted',
      description: 'Contact made with healthcare practice lead',
      actor: assignedTo || 'Growth Partner'
    });
  };

  const handleQuickDiscovery = async () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setDiscoveryDate(todayStr);
    setOpportunityStage('discovery');
    await adminLeadsService.addActivity(lead.leadId, {
      type: 'discovery_scheduled',
      description: `Discovery session scheduled for ${todayStr}`,
      actor: assignedTo || 'Growth Partner'
    });
  };

  const handleQuickAudit = async () => {
    setOpportunityStage('discovery');
    await adminLeadsService.addActivity(lead.leadId, {
      type: 'audit_completed',
      description: 'Healthcare Growth Audit & Diagnosis completed for practice',
      actor: assignedTo || 'Growth Partner'
    });
  };

  const handleQuickProposal = async () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setProposalStatus('sent');
    setProposalSentAt(todayStr);
    setOpportunityStage('proposal');
    const val = proposalValue || estimatedOpportunityValue || 25000;
    if (!proposalValue) setProposalValue(val);
    await adminLeadsService.addActivity(lead.leadId, {
      type: 'proposal_sent',
      description: `Proposal sent with contract value $${val.toLocaleString()}`,
      actor: assignedTo || 'Growth Partner'
    });
  };

  const handleQuickNegotiation = async () => {
    setOpportunityStage('negotiation');
    await adminLeadsService.addActivity(lead.leadId, {
      type: 'negotiation',
      description: 'Entered commercial negotiation & contract terms discussion',
      actor: assignedTo || 'Growth Partner'
    });
  };

  const handleQuickWon = async () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const val = finalContractValue || proposalValue || estimatedOpportunityValue || 25000;
    setWonDate(todayStr);
    setFinalContractValue(val);
    setOpportunityStage('won');
    setStatus('won');
    await adminLeadsService.addActivity(lead.leadId, {
      type: 'won',
      description: `Opportunity Closed Won! Final Contract Value: $${val.toLocaleString()}`,
      actor: assignedTo || 'Growth Partner'
    });
  };

  const handleQuickLost = async () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const reason = lostReason || 'budget';
    setLostDate(todayStr);
    setLostReason(reason);
    setOpportunityStage('lost');
    setStatus('lost');
    await adminLeadsService.addActivity(lead.leadId, {
      type: 'lost',
      description: `Opportunity Closed Lost. Reason: ${reason}`,
      actor: assignedTo || 'Growth Partner'
    });
  };

  const stageEnteredAt = lead.qualification.stageEnteredAt || lead.createdAt;
  const daysInStage = Math.max(0, Math.floor((new Date().getTime() - new Date(stageEnteredAt).getTime()) / (1000 * 3600 * 24)));
  const stageProb = STAGE_PROBABILITIES[opportunityStage] ?? 0.05;
  const weightedValue = Math.round((estimatedOpportunityValue || 0) * stageProb);

  // Follow-up status calculation
  const getFollowUpStatusBadge = () => {
    if (!nextFollowUpAt) {
      return <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">No follow-up scheduled</span>;
    }

    try {
      const target = new Date(nextFollowUpAt).getTime();
      const now = new Date().getTime();
      const diffHours = (target - now) / (1000 * 3600);

      if (diffHours < 0) {
        return <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded">Overdue</span>;
      }
      if (diffHours <= 24) {
        return <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">Due Today</span>;
      }
      return <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Upcoming</span>;
    } catch (_) {
      return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Opportunity Workspace</span>
              <span className="text-xs text-slate-400 font-mono">#{lead.leadId}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {lead.visitorData.contactName}
            </h2>
            <p className="text-xs text-slate-300">
              {lead.visitorData.organizationName ? `${lead.visitorData.organizationName} • ` : ''}
              {lead.visitorData.healthcareCategory || 'Healthcare Business'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">

          {/* Feedback Banners */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Opportunity record updated successfully in Firestore database.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Sales Actions Toolbar */}
          <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Sales Pipeline Execution Shortcuts
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-Click Life-Cycle Actions</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={handleMarkContactedNow}
                className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg font-medium transition-colors flex items-center space-x-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mark Contacted</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDiscovery}
                className="px-2.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg font-medium transition-colors flex items-center space-x-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Discovery</span>
              </button>

              <button
                type="button"
                onClick={handleQuickAudit}
                className="px-2.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg font-medium transition-colors flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Growth Audit</span>
              </button>

              <button
                type="button"
                onClick={handleQuickProposal}
                className="px-2.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-lg font-medium transition-colors flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Send Proposal</span>
              </button>

              <button
                type="button"
                onClick={handleQuickNegotiation}
                className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg font-medium transition-colors flex items-center space-x-1"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Negotiation</span>
              </button>

              <button
                type="button"
                onClick={handleQuickWon}
                className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold transition-colors flex items-center space-x-1"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Won</span>
              </button>

              <button
                type="button"
                onClick={handleQuickLost}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-medium transition-colors flex items-center space-x-1"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Mark Lost</span>
              </button>
            </div>
          </div>

          {/* SECTION 1 — PIPELINE & FINANCIAL CONTROLS */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Pipeline & Financial Controls
                </h3>
              </div>
              {getFollowUpStatusBadge()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Opportunity Stage */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Opportunity Stage</label>
                <select
                  value={opportunityStage}
                  onChange={(e) => {
                    const newStg = e.target.value as OpportunityStage;
                    setOpportunityStage(newStg);
                    if (['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].includes(newStg)) {
                      setStatus(newStg as any);
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="new">1. NEW (5%)</option>
                  <option value="contacted">2. CONTACTED (10%)</option>
                  <option value="qualified">3. QUALIFIED (25%)</option>
                  <option value="discovery">4. DISCOVERY (40%)</option>
                  <option value="proposal">5. PROPOSAL (65%)</option>
                  <option value="negotiation">6. NEGOTIATION (80%)</option>
                  <option value="won">7. WON (100%)</option>
                  <option value="lost">8. LOST (0%)</option>
                </select>
              </div>

              {/* Estimated Value */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estimated Opportunity Value</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs font-bold">$</span>
                  <input
                    type="number"
                    value={estimatedOpportunityValue || ''}
                    onChange={(e) => setEstimatedOpportunityValue(parseFloat(e.target.value) || 0)}
                    placeholder="25000"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED (AED)</option>
                </select>
              </div>
            </div>

            {/* Stage Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/80 p-2.5 rounded-lg border border-amber-500/15">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Stage Probability</span>
                <span className="font-bold text-slate-800 font-mono">{Math.round(stageProb * 100)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Weighted Pipeline</span>
                <span className="font-bold text-amber-800 font-mono">${weightedValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Stage Entered</span>
                <span className="text-slate-700">{new Date(stageEnteredAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Days in Stage</span>
                <span className="font-bold text-slate-900">{daysInStage} Days</span>
              </div>
            </div>
          </div>

          {/* SECTION 2 — SALES & FOLLOW-UP CONTROLS */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Sales & Growth Partner Assignment</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Assigned To */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assigned Growth Partner</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Growth Partner Name"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Next Follow-Up */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Next Follow-Up Date</label>
                <input
                  type="datetime-local"
                  value={nextFollowUpAt ? nextFollowUpAt.slice(0, 16) : ''}
                  onChange={(e) => setNextFollowUpAt(e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Lead Priority */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={leadPriority}
                  onChange={(e) => setLeadPriority(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Next Action */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Next Action Required</label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g. Schedule discovery call with Chief Medical Officer"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-600">
              <div>
                Last Contacted:{' '}
                <strong>
                  {lastContactedAt ? new Date(lastContactedAt).toLocaleString() : 'Never'}
                </strong>
              </div>
              <button
                type="button"
                onClick={handleMarkContactedNow}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-medium transition-colors border border-amber-300/60"
              >
                Mark Contacted Now
              </button>
            </div>
          </div>

          {/* SECTION 3 — ACTIVITY & AUDIT TIMELINE */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  Internal Activity & Audit Timeline
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{activities.length} Recorded Events</span>
            </div>

            {/* Add Custom Note Form */}
            <form onSubmit={handleAddCustomActivity} className="flex gap-2">
              <input
                type="text"
                value={newActivityNote}
                onChange={(e) => setNewActivityNote(e.target.value)}
                placeholder="Add meeting note, call log, or sales update..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={isAddingActivity || !newActivityNote.trim()}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center space-x-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log Note</span>
              </button>
            </form>

            {/* Timeline Stream */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {/* Default Lead Genesis Event */}
              <div className="flex items-start space-x-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div className="flex-1 bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                    <span className="font-bold text-amber-400">Lead Received & Evaluated</span>
                    <span>{new Date(lead.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300">
                    Lead submitted via website ({lead.visitorData.leadType}). Fit Score: {lead.qualification.fitScore}/100 ({lead.qualification.fitStatus}).
                  </p>
                </div>
              </div>

              {activities.map((act, idx) => {
                const typeColors: Record<string, string> = {
                  stage_change: 'text-amber-400 bg-amber-950/60 border-amber-800',
                  contacted: 'text-blue-400 bg-blue-950/60 border-blue-800',
                  contact_made: 'text-blue-400 bg-blue-950/60 border-blue-800',
                  discovery_scheduled: 'text-indigo-400 bg-indigo-950/60 border-indigo-800',
                  discovery_completed: 'text-indigo-300 bg-indigo-950/80 border-indigo-700',
                  audit_completed: 'text-sky-400 bg-sky-950/60 border-sky-800',
                  proposal_sent: 'text-purple-400 bg-purple-950/60 border-purple-800',
                  negotiation: 'text-rose-400 bg-rose-950/60 border-rose-800',
                  follow_up: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
                  follow_up_scheduled: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
                  won: 'text-teal-300 bg-teal-950/80 border-teal-700',
                  lost: 'text-slate-400 bg-slate-900 border-slate-700',
                  note: 'text-amber-300 bg-slate-900 border-slate-700',
                  note_added: 'text-amber-300 bg-slate-900 border-slate-700'
                };
                const tagStyle = typeColors[act.type] || 'text-slate-300 bg-slate-900 border-slate-800';

                return (
                  <div key={act.id || idx} className="flex items-start space-x-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div className="flex-1 bg-slate-950 p-2.5 rounded border border-slate-800">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1 gap-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-200">{act.actor}</span>
                          <span className={`px-1.5 py-0.2 rounded border uppercase font-semibold text-[9px] ${tagStyle}`}>
                            {act.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-slate-400">{new Date(act.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300">{act.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4 — DISCOVERY WORKSPACE */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Discovery Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Discovery Date</label>
                <input
                  type="date"
                  value={discoveryDate ? discoveryDate.slice(0, 10) : ''}
                  onChange={(e) => setDiscoveryDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Key Decision Maker</label>
                <input
                  type="text"
                  value={decisionMaker}
                  onChange={(e) => setDecisionMaker(e.target.value)}
                  placeholder="e.g. Dr. Vance (Managing Director)"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Decision Timeline</label>
                <input
                  type="text"
                  value={decisionTimeline}
                  onChange={(e) => setDecisionTimeline(e.target.value)}
                  placeholder="e.g. Q3 2026 / 30 Days"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5 — PROPOSAL WORKSPACE */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Proposal Tracking</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Proposal Status</label>
                <select
                  value={proposalStatus}
                  onChange={(e) => setProposalStatus(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                >
                  <option value="not_started">Not Started</option>
                  <option value="draft">Drafting</option>
                  <option value="sent">Proposal Sent</option>
                  <option value="viewed">Viewed by Client</option>
                  <option value="revision_requested">Revision Requested</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Proposal Value ($)</label>
                <input
                  type="number"
                  value={proposalValue || ''}
                  onChange={(e) => setProposalValue(parseFloat(e.target.value) || 0)}
                  placeholder="35000"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date Sent</label>
                <input
                  type="date"
                  value={proposalSentAt ? proposalSentAt.slice(0, 10) : ''}
                  onChange={(e) => setProposalSentAt(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Proposal Follow-Up</label>
                <input
                  type="date"
                  value={proposalFollowUpAt ? proposalFollowUpAt.slice(0, 10) : ''}
                  onChange={(e) => setProposalFollowUpAt(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6 — NEGOTIATION WORKSPACE */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <Handshake className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Negotiation & Commercials</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Negotiation Status / Terms</label>
                <input
                  type="text"
                  value={negotiationStatus}
                  onChange={(e) => setNegotiationStatus(e.target.value)}
                  placeholder="e.g. Terms Under Review / Payment Structure"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expected Decision Date</label>
                <input
                  type="date"
                  value={expectedDecisionDate ? expectedDecisionDate.slice(0, 10) : ''}
                  onChange={(e) => setExpectedDecisionDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Negotiation Notes</label>
              <textarea
                rows={2}
                value={negotiationNotes}
                onChange={(e) => setNegotiationNotes(e.target.value)}
                placeholder="Specific commercial conditions, scope adjustments, or agreement terms..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* SECTION 7 — OUTCOME WORKSPACE (WON / LOST) */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Outcome & Closure</h3>
              </div>
            </div>

            {/* Won Fields */}
            <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-lg space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-900">
                <ThumbsUp className="w-4 h-4 text-teal-600" />
                <span>Closed Won Partner Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Won Date</label>
                  <input
                    type="date"
                    value={wonDate ? wonDate.slice(0, 10) : ''}
                    onChange={(e) => setWonDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Final Contract Value ($)</label>
                  <input
                    type="number"
                    value={finalContractValue || ''}
                    onChange={(e) => setFinalContractValue(parseFloat(e.target.value) || 0)}
                    placeholder="30000"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Lost Fields */}
            <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <ThumbsDown className="w-4 h-4 text-slate-600" />
                <span>Closed Lost Reason & Notes</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lost Date</label>
                  <input
                    type="date"
                    value={lostDate ? lostDate.slice(0, 10) : ''}
                    onChange={(e) => setLostDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lost Reason</label>
                  <select
                    value={lostReason}
                    onChange={(e) => setLostReason(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                  >
                    <option value="">Select Lost Reason</option>
                    <option value="budget">Budget Constraints</option>
                    <option value="timing">Timing / Postponed</option>
                    <option value="internal_decision">Internal Decision / Reorganization</option>
                    <option value="competitor">Chosen Competitor</option>
                    <option value="no_response">Unresponsive / Ghosted</option>
                    <option value="not_a_fit">Not a Strategic Fit</option>
                    <option value="scope">Scope Mismatch</option>
                    <option value="other">Other Reason</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lost Feedback / Notes</label>
                <textarea
                  rows={2}
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  placeholder="Record lost cause or feedback for future re-engagement..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* SECTION A — CONTACT DETAILS */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Original Visitor Profile</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Contact Name</span>
                <span className="font-semibold text-slate-900">{lead.visitorData.contactName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Email Address</span>
                <a href={`mailto:${lead.visitorData.email}`} className="text-amber-700 font-mono hover:underline truncate block">
                  {lead.visitorData.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Phone Number</span>
                {lead.visitorData.phone ? (
                  <a href={`tel:${lead.visitorData.phone}`} className="text-slate-800 font-mono hover:underline">
                    {lead.visitorData.phone}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION B — ORGANIZATION PROFILE */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Organization Profile</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Organization Name</span>
                <span className="font-semibold text-slate-900">{lead.visitorData.organizationName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Healthcare Category</span>
                <span className="font-medium text-slate-800">{lead.visitorData.healthcareCategory || 'Healthcare'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="text-slate-800">{lead.visitorData.location || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Website</span>
                {lead.visitorData.website ? (
                  <a
                    href={lead.visitorData.website.startsWith('http') ? lead.visitorData.website : `https://${lead.visitorData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 font-mono hover:underline inline-flex items-center truncate max-w-[150px]"
                  >
                    {lead.visitorData.website}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION C — GROWTH NEED & CHALLENGES */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Enquiry Intent & Objectives</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Biggest Challenge</span>
                <p className="text-slate-800 bg-white p-2.5 rounded border border-slate-200 leading-relaxed mt-0.5">
                  {lead.visitorData.biggestChallenge || 'No challenge description provided'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Growth Objective</span>
                <p className="text-slate-800 bg-white p-2.5 rounded border border-slate-200 leading-relaxed mt-0.5">
                  {lead.visitorData.growthObjective || 'No objective provided'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION D — INTERNAL TEAM NOTES */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Internal Sales & Strategy Notes</h3>
              </div>
              <span className="text-[10px] text-slate-400">Admin Only • Protected</span>
            </div>
            <textarea
              rows={4}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Record internal discovery notes, meeting summaries, decision drivers, key stakeholders..."
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

        </div>

        {/* Modal Footer / Save Action */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Created: <strong>{new Date(lead.createdAt).toLocaleString()}</strong>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Saving...' : 'Save Opportunity Record'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
