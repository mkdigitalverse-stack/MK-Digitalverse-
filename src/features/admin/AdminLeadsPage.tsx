import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { CompleteLeadRecord, OpportunityStage } from '../../services/qualification';
import { adminLeadsService } from '../../services/adminLeadsService';
import { AdminHeader } from './AdminHeader';
import { AdminKpiMetrics } from './AdminKpiMetrics';
import { AdminLeadFilters, FilterState } from './AdminLeadFilters';
import { AdminLeadTable } from './AdminLeadTable';
import { AdminPipelineBoard } from './AdminPipelineBoard';
import { AdminFollowUpsView } from './AdminFollowUpsView';
import { AdminNotificationCenter } from './AdminNotificationCenter';
import { AdminGrowthAnalyticsView } from './AdminGrowthAnalyticsView';
import { AdminLeadDetailModal } from './AdminLeadDetailModal';
import { ShieldCheck, Lock, AlertOctagon, ArrowLeft, RefreshCw, LayoutGrid, Table, CalendarClock, Bell, LineChart } from 'lucide-react';

interface AdminLeadsPageProps {
  onReturnHome: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  status: 'all',
  priority: 'all',
  fitStatus: 'all',
  intentLevel: 'all',
  healthcareCategory: 'all',
  leadType: 'all',
  leadSource: 'all',
  dateRange: 'all',
  sortBy: 'newest'
};

export const AdminLeadsPage: React.FC<AdminLeadsPageProps> = ({ onReturnHome }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [leads, setLeads] = useState<CompleteLeadRecord[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState<boolean>(true);
  const [leadFetchError, setLeadFetchError] = useState<string | null>(null);

  const [activeViewTab, setActiveViewTab] = useState<'pipeline' | 'database' | 'followups' | 'notifications' | 'analytics'>('pipeline');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedLead, setSelectedLead] = useState<CompleteLeadRecord | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 1. Subscribe to Auth State
  useEffect(() => {
    setIsAuthChecking(true);
    const unsubscribe = adminLeadsService.subscribeToAuthState((user, adminStatus) => {
      setCurrentUser(user);
      setIsAdmin(adminStatus);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Leads when authorized
  useEffect(() => {
    if (!isAdmin) {
      setLeads([]);
      setIsLoadingLeads(false);
      return;
    }

    setIsLoadingLeads(true);
    setLeadFetchError(null);

    const unsubscribe = adminLeadsService.subscribeToLeads(
      (data) => {
        setLeads(data);
        setIsLoadingLeads(false);
        setIsRefreshing(false);
      },
      (err) => {
        setLeadFetchError(err);
        setIsLoadingLeads(false);
        setIsRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await adminLeadsService.signInWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Google Sign-In failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await adminLeadsService.signOut();
    } catch (_) {}
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLeadFetchError(null);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSaveLead = async (leadId: string, updates: any) => {
    await adminLeadsService.updateLead(leadId, updates);
  };

  const handleUpdateStage = async (leadId: string, newStage: OpportunityStage) => {
    const targetLead = leads.find(l => l.leadId === leadId);
    const estVal = targetLead?.qualification.estimatedOpportunityValue || 0;
    const oldStage = targetLead?.qualification.opportunityStage || 'new';
    
    await adminLeadsService.updateLead(leadId, { 
      opportunityStage: newStage,
      estimatedOpportunityValue: estVal
    });

    if (oldStage !== newStage) {
      await adminLeadsService.addActivity(leadId, {
        type: 'stage_change',
        description: `Moved stage from ${oldStage.toUpperCase()} to ${newStage.toUpperCase()}`,
        actor: targetLead?.qualification.assignedTo || 'Growth Partner'
      });
    }
  };

  // 3. Filter and Sort Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // Search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const nameMatch = item.visitorData.contactName.toLowerCase().includes(q);
        const emailMatch = item.visitorData.email.toLowerCase().includes(q);
        const orgMatch = (item.visitorData.organizationName || '').toLowerCase().includes(q);
        const phoneMatch = (item.visitorData.phone || '').toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !orgMatch && !phoneMatch) return false;
      }

      // Status
      if (filters.status !== 'all' && item.status !== filters.status) return false;

      // Priority
      if (filters.priority !== 'all' && item.qualification.leadPriority !== filters.priority) return false;

      // Fit Status
      if (filters.fitStatus !== 'all' && item.qualification.fitStatus !== filters.fitStatus) return false;

      // Intent
      if (filters.intentLevel !== 'all' && item.qualification.intentLevel !== filters.intentLevel) return false;

      // Healthcare Category
      if (filters.healthcareCategory !== 'all' && item.qualification.healthcareCategoryNormalized !== filters.healthcareCategory) return false;

      // Lead Type
      if (filters.leadType !== 'all' && item.visitorData.leadType !== filters.leadType) return false;

      // Lead Source
      if (filters.leadSource !== 'all' && item.qualification.derivedLeadSource !== filters.leadSource) return false;

      // Date Range
      if (filters.dateRange !== 'all') {
        const createdMs = new Date(item.createdAt).getTime();
        const nowMs = new Date().getTime();
        const diffDays = (nowMs - createdMs) / (1000 * 3600 * 24);

        if (filters.dateRange === 'today' && diffDays > 1) return false;
        if (filters.dateRange === '7days' && diffDays > 7) return false;
        if (filters.dateRange === '30days' && diffDays > 30) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return a.createdAt.localeCompare(b.createdAt);
        case 'fitScore':
          return b.qualification.fitScore - a.qualification.fitScore;
        case 'priority': {
          const pOrder: Record<string, number> = { urgent: 4, high: 3, normal: 2, low: 1 };
          return (pOrder[b.qualification.leadPriority] || 0) - (pOrder[a.qualification.leadPriority] || 0);
        }
        case 'followUp': {
          const aDate = a.qualification.nextFollowUpAt ? new Date(a.qualification.nextFollowUpAt).getTime() : Infinity;
          const bDate = b.qualification.nextFollowUpAt ? new Date(b.qualification.nextFollowUpAt).getTime() : Infinity;
          return aDate - bDate;
        }
        case 'newest':
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [leads, filters]);

  // Loading state
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-slate-400">Authenticating admin workspace security permissions...</p>
      </div>
    );
  }

  // Unauthenticated View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-white">
        
        {/* Top Navbar */}
        <div className="p-4 border-b border-slate-900 flex items-center justify-between">
          <button
            onClick={onReturnHome}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>
          <div className="flex items-center space-x-1.5 text-xs text-amber-400">
            <Lock className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">ADMIN PORTAL</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md w-full mx-auto px-4 py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-300 p-0.5 mx-auto mb-6 shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            MK Digitalverse Lead Intelligence
          </h1>
          <p className="text-xs text-slate-400 mb-8 leading-relaxed">
            Secure internal operational workspace for reviewing, qualifying, and managing healthcare growth partner enquiries.
          </p>

          {authError && (
            <div className="mb-6 p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-lg text-xs font-medium">
              {authError}
            </div>
          )}

          <button
            onClick={handleSignIn}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
            </svg>
            <span>Sign In with Google</span>
          </button>

          <p className="text-[11px] text-slate-500 mt-6">
            Access strictly restricted to authorized MK Digitalverse team administrators.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-900 text-center text-[10px] text-slate-600">
          MK DIGITALVERSE INTERNAL LEAD MANAGEMENT INFRASTRUCTURE
        </div>

      </div>
    );
  }

  // Authenticated but Unauthorized View
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Access Denied</h2>
          <p className="text-xs text-slate-400">
            The signed-in account (<strong className="text-slate-200">{currentUser.email}</strong>) is authenticated but does not possess administrator permissions in Firestore.
          </p>
          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={handleSignOut}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Sign Out & Try Another Account
            </button>
            <button
              onClick={onReturnHome}
              className="w-full py-2 text-slate-400 hover:text-white text-xs"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin Interface View
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <AdminHeader
        user={currentUser}
        onRefresh={handleRefresh}
        onLogout={handleSignOut}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Workspace Sub-Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              MK Digitalverse Sales Pipeline & Lead Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time sales pipeline, qualification intelligence, and follow-up workspace for healthcare growth partnerships.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between md:justify-end">
            {/* View Mode Switcher */}
            <div className="bg-slate-200/80 p-1 rounded-xl flex items-center space-x-1 border border-slate-300/60 shadow-2xs">
              <button
                onClick={() => setActiveViewTab('pipeline')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeViewTab === 'pipeline'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Sales Pipeline</span>
              </button>

              <button
                onClick={() => setActiveViewTab('database')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeViewTab === 'database'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Lead Database</span>
              </button>

              <button
                onClick={() => setActiveViewTab('followups')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeViewTab === 'followups'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <CalendarClock className="w-3.5 h-3.5" />
                <span>Follow-Up Queue</span>
              </button>

              <button
                onClick={() => setActiveViewTab('notifications')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeViewTab === 'notifications'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notification Center</span>
              </button>

              <button
                onClick={() => setActiveViewTab('analytics')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeViewTab === 'analytics'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Analytics & Intelligence</span>
              </button>
            </div>

            <button
              onClick={onReturnHome}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium shadow-2xs transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
          </div>
        </div>

        {/* Lead Fetch Error Banner */}
        {leadFetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium space-y-1">
            <div className="font-bold">Firestore Lead Retrieval Note</div>
            <div className="font-mono text-[11px] opacity-90">{leadFetchError}</div>
          </div>
        )}

        {/* KPI Summary Metrics */}
        <AdminKpiMetrics leads={leads} />

        {/* Active View Content */}
        {activeViewTab === 'pipeline' && (
          <AdminPipelineBoard
            leads={leads}
            onSelectLead={setSelectedLead}
            onUpdateStage={handleUpdateStage}
          />
        )}

        {activeViewTab === 'database' && (
          <>
            <AdminLeadFilters
              filters={filters}
              onChangeFilters={setFilters}
              onResetFilters={() => setFilters(initialFilters)}
              totalFiltered={filteredLeads.length}
              totalCount={leads.length}
            />

            <AdminLeadTable
              leads={filteredLeads}
              onSelectLead={setSelectedLead}
              isLoading={isLoadingLeads}
            />
          </>
        )}

        {activeViewTab === 'followups' && (
          <AdminFollowUpsView
            leads={leads}
            onSelectLead={setSelectedLead}
          />
        )}

        {activeViewTab === 'notifications' && (
          <AdminNotificationCenter leads={leads} />
        )}

        {activeViewTab === 'analytics' && (
          <AdminGrowthAnalyticsView leads={leads} />
        )}

        {/* Lead Detail Slide-over / Modal */}
        <AdminLeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSaveLead={handleSaveLead}
        />

      </main>

      {/* Workspace Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-[11px] text-slate-500 mt-12">
        MK Digitalverse Sales Pipeline & Lead Management System • Confidential Internal Workspace
      </footer>

    </div>
  );
};

