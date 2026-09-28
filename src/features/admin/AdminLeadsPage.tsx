import React, { useState, useEffect, useMemo } from 'react';
import { CompleteLeadRecord, OpportunityStage } from '../../services/qualification';
import { adminLeadsService, AdminAuthUser } from '../../services/adminLeadsService';
import { GrowthAnalyticsService } from '../../services/growthAnalyticsService';
import { AdminSidebar, AdminViewTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminLeadFilters, FilterState } from './AdminLeadFilters';
import { AdminLeadTable } from './AdminLeadTable';
import { AdminPipelineBoard } from './AdminPipelineBoard';
import { AdminFollowUpsView } from './AdminFollowUpsView';
import { AdminNotificationCenter } from './AdminNotificationCenter';
import { AdminGrowthAnalyticsView } from './AdminGrowthAnalyticsView';
import { AnalyticsFunnelCard } from './AnalyticsFunnelCard';
import { AnalyticsChannelEconomics } from './AnalyticsChannelEconomics';
import { AnalyticsSegmentMatrix } from './AnalyticsSegmentMatrix';
import { AnalyticsDiagnosticAlerts } from './AnalyticsDiagnosticAlerts';
import { AdminLeadDetailModal } from './AdminLeadDetailModal';
import { AdminSalesReportsView } from './AdminSalesReportsView';
import { AdminLeadReportsView } from './AdminLeadReportsView';
import { exportLeadsToCsv } from '../../services/leadExportService';
import { ClientRecord, InvoiceRecord, PaymentRecord, ExpenseRecord } from '../../types/finance';
import { financeService } from '../../services/financeService';
import { AdminFinanceOverviewView } from './AdminFinanceOverviewView';
import { AdminInvoicesView } from './AdminInvoicesView';
import { AdminPaymentsView } from './AdminPaymentsView';
import { AdminExpensesView } from './AdminExpensesView';
import { AdminClientsView } from './AdminClientsView';
import { AdminCreateInvoiceModal } from './AdminCreateInvoiceModal';
import { AdminRecordPaymentModal } from './AdminRecordPaymentModal';
import { AdminCreateClientModal } from './AdminCreateClientModal';
import { AdminLogExpenseModal } from './AdminLogExpenseModal';
import { 
  ShieldCheck, 
  Lock, 
  AlertOctagon, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  X, 
  Clock, 
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  Download
} from 'lucide-react';

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
  const [currentUser, setCurrentUser] = useState<AdminAuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [leads, setLeads] = useState<CompleteLeadRecord[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState<boolean>(true);
  const [leadFetchError, setLeadFetchError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminViewTab>('overview');
  const [isOpenMobileNav, setIsOpenMobileNav] = useState<boolean>(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState<boolean>(false);
  const [comingSoonModal, setComingSoonModal] = useState<{ featureName: string; category: string } | null>(null);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [exportFeedback, setExportFeedback] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [selectedLead, setSelectedLead] = useState<CompleteLeadRecord | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Finance Domain State
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState<boolean>(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState<boolean>(false);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState<boolean>(false);
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState<boolean>(false);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<InvoiceRecord | null>(null);
  const [activeClientForAction, setActiveClientForAction] = useState<ClientRecord | null>(null);
  const [clientFromLeadData, setClientFromLeadData] = useState<any | null>(null);

  const loadFinanceData = async () => {
    try {
      const [fetchedClients, fetchedInvoices, fetchedPayments, fetchedExpenses] = await Promise.all([
        financeService.getClients(),
        financeService.getInvoices(),
        financeService.getPayments(),
        financeService.getExpenses()
      ]);
      setClients(fetchedClients);
      setInvoices(fetchedInvoices);
      setPayments(fetchedPayments);
      setExpenses(fetchedExpenses);
    } catch (err) {
      console.warn('[AdminLeadsPage] Failed to fetch finance data:', err);
    }
  };

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

  // Load finance records when admin is verified
  useEffect(() => {
    if (isAdmin) {
      loadFinanceData();
    }
  }, [isAdmin]);

  // Handle ESC key for modals and drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (comingSoonModal) setComingSoonModal(null);
        if (isOpenMobileNav) setIsOpenMobileNav(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [comingSoonModal, isOpenMobileNav]);

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
    adminLeadsService.refreshLeads();
    loadFinanceData().finally(() => setIsRefreshing(false));
  };

  const handleCreateInvoice = async (invoiceInput: any) => {
    await financeService.createInvoice(invoiceInput);
    await loadFinanceData();
  };

  const handleRecordPayment = async (paymentInput: any) => {
    await financeService.recordPayment(paymentInput);
    await loadFinanceData();
  };

  const handleCreateClient = async (clientInput: any) => {
    await financeService.createClient(clientInput);
    await loadFinanceData();
  };

  const handleLogExpense = async (expenseInput: any) => {
    await financeService.createExpense(expenseInput);
    await loadFinanceData();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await financeService.deleteExpense(expenseId);
    await loadFinanceData();
  };

  const handleConvertToClientFromLead = (leadRecord: CompleteLeadRecord) => {
    setClientFromLeadData({
      leadId: leadRecord.leadId,
      name: leadRecord.visitorData.contactName,
      organizationName: leadRecord.visitorData.organizationName,
      email: leadRecord.visitorData.email,
      phone: leadRecord.visitorData.phone,
      healthcareCategory: leadRecord.qualification.healthcareCategoryNormalized || leadRecord.visitorData.healthcareCategory
    });
    setIsCreateClientOpen(true);
  };

  const handleSaveLead = async (leadId: string, updates: any) => {
    const updatedLead = await adminLeadsService.updateLead(leadId, updates);
    setLeads(prevLeads =>
      prevLeads.map(l => (l.leadId === leadId ? updatedLead : l))
    );
  };

  const handleUpdateStage = async (leadId: string, newStage: OpportunityStage) => {
    const targetLead = leads.find(l => l.leadId === leadId);
    const estVal = targetLead?.qualification.estimatedOpportunityValue || 0;
    const oldStage = targetLead?.qualification.opportunityStage || 'new';
    
    const updatedRecord = await adminLeadsService.updateLead(leadId, { 
      opportunityStage: newStage,
      estimatedOpportunityValue: estVal
    });

    setLeads(prevLeads =>
      prevLeads.map(l => (l.leadId === leadId ? updatedRecord : l))
    );

    if (oldStage !== newStage) {
      await adminLeadsService.addActivity(leadId, {
        type: 'stage_change',
        description: `Moved stage from ${oldStage.toUpperCase()} to ${newStage.toUpperCase()}`,
        actor: targetLead?.qualification.assignedTo || 'Growth Partner'
      });
    }
  };

  // 3. Filter and Sort Leads for Database view
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const contactMatch = item.visitorData.contactName.toLowerCase().includes(q);
        const orgMatch = (item.visitorData.organizationName || '').toLowerCase().includes(q);
        const emailMatch = item.visitorData.email.toLowerCase().includes(q);
        const challengeMatch = (item.visitorData.biggestChallenge || '').toLowerCase().includes(q);
        if (!contactMatch && !orgMatch && !emailMatch && !challengeMatch) return false;
      }

      if (filters.status !== 'all' && item.status !== filters.status) return false;
      if (filters.priority !== 'all' && item.qualification.leadPriority !== filters.priority) return false;
      if (filters.fitStatus !== 'all' && item.qualification.fitStatus !== filters.fitStatus) return false;
      if (filters.intentLevel !== 'all' && item.qualification.intentLevel !== filters.intentLevel) return false;
      if (filters.healthcareCategory !== 'all' && item.visitorData.healthcareCategory !== filters.healthcareCategory) return false;
      if (filters.leadType !== 'all' && item.visitorData.leadType !== filters.leadType) return false;
      if (filters.leadSource !== 'all' && item.qualification.derivedLeadSource !== filters.leadSource) return false;

      if (filters.dateRange !== 'all') {
        const createdDate = new Date(item.createdAt);
        const now = new Date();
        if (filters.dateRange === 'today') {
          const isSameDay = createdDate.toDateString() === now.toDateString();
          if (!isSameDay) return false;
        } else if (filters.dateRange === '7days') {
          const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 7 || diffDays < 0) return false;
        } else if (filters.dateRange === '30days') {
          const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 30 || diffDays < 0) return false;
        } else if (filters.dateRange === 'this_month') {
          const isThisMonth = createdDate.getFullYear() === now.getFullYear() && createdDate.getMonth() === now.getMonth();
          if (!isThisMonth) return false;
        } else if (filters.dateRange === 'prev_month') {
          const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          const isPrevMonth = createdDate.getFullYear() === prevYear && createdDate.getMonth() === prevMonth;
          if (!isPrevMonth) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'fitScore':
          return b.qualification.fitScore - a.qualification.fitScore;
        case 'priority': {
          const priorityWeights = { urgent: 4, high: 3, normal: 2, low: 1 };
          return (priorityWeights[b.qualification.leadPriority] || 0) - (priorityWeights[a.qualification.leadPriority] || 0);
        }
        case 'followUp': {
          const dateA = a.qualification.nextFollowUpAt ? new Date(a.qualification.nextFollowUpAt).getTime() : Infinity;
          const dateB = b.qualification.nextFollowUpAt ? new Date(b.qualification.nextFollowUpAt).getTime() : Infinity;
          return dateA - dateB;
        }
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [leads, filters]);

  // Memoized intelligence metrics for reporting tabs
  const intelligence = useMemo(() => {
    return GrowthAnalyticsService.generateIntelligence(leads);
  }, [leads]);

  // 3b. Row-Level Selection Handlers (ADM-03)
  const handleToggleSelectLead = (leadId: string) => {
    setSelectedLeadIds(prev => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredLeads.map(l => l.leadId);
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedLeadIds.has(id));
    if (allSelected) {
      setSelectedLeadIds(prev => {
        const next = new Set(prev);
        visibleIds.forEach(id => next.delete(id));
        return next;
      });
    } else {
      setSelectedLeadIds(prev => {
        const next = new Set(prev);
        visibleIds.forEach(id => next.add(id));
        return next;
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedLeadIds(new Set());
  };

  // 3c. Lead Operations: CSV Exports (ADM-03)
  const handleExportFiltered = () => {
    const filterParts: string[] = [];
    if (filters.status !== 'all') filterParts.push(filters.status);
    if (filters.priority !== 'all') filterParts.push(filters.priority);
    if (filters.healthcareCategory !== 'all') filterParts.push(filters.healthcareCategory);
    if (filters.dateRange !== 'all') filterParts.push(filters.dateRange);
    if (filters.searchQuery) filterParts.push(filters.searchQuery.slice(0, 10));

    const summary = filterParts.length > 0 ? filterParts.join('_') : 'filtered';
    const result = exportLeadsToCsv(filteredLeads, 'filtered', summary);
    if (result.success) {
      setExportFeedback({
        message: `Successfully exported ${result.rowCount} filtered leads to ${result.fileName}`,
        type: 'success'
      });
      setTimeout(() => setExportFeedback(null), 5000);
    }
  };

  const handleExportSelected = () => {
    const selectedLeads = leads.filter(l => selectedLeadIds.has(l.leadId));
    if (selectedLeads.length === 0) return;
    const result = exportLeadsToCsv(selectedLeads, 'selected');
    if (result.success) {
      setExportFeedback({
        message: `Successfully exported ${result.rowCount} selected leads to ${result.fileName}`,
        type: 'success'
      });
      setTimeout(() => setExportFeedback(null), 5000);
    }
  };

  const handleExportAll = () => {
    const result = exportLeadsToCsv(leads, 'all');
    if (result.success) {
      setExportFeedback({
        message: `Successfully exported all ${result.rowCount} database leads to ${result.fileName}`,
        type: 'success'
      });
      setTimeout(() => setExportFeedback(null), 5000);
    }
  };

  // 4. Loading & Auth Guards
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-white tracking-tight">Verifying Admin Credentials...</h2>
          <p className="text-xs text-slate-400 font-mono">Authenticating with Google Workspace</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">MK DIGITALVERSE</h2>
            <p className="text-xs text-amber-400 font-mono uppercase tracking-wider">Restricted Growth Partner Console</p>
            <p className="text-xs text-slate-400 mt-2">
              Sign in with your authorized admin account (<strong>mkdigitalverse@gmail.com</strong>) to access the lead intelligence CRM.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {currentUser && !isAdmin && (
            <div className="p-3 bg-amber-950/60 border border-amber-800 text-amber-200 text-xs rounded-xl space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Unauthorized Account</span>
              </div>
              <p className="text-[11px] opacity-90">
                Logged in as <strong>{currentUser.email}</strong>, which is not an active admin.
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/10 transition-all min-h-[44px]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In with Google Admin</span>
            </button>

            {currentUser && (
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors min-h-[44px]"
              >
                Sign Out & Switch Account
              </button>
            )}

            <button
              onClick={onReturnHome}
              className="w-full flex items-center justify-center space-x-1.5 py-2 text-xs text-slate-400 hover:text-white transition-colors pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      <div className="flex-1 flex w-full">
        {/* Responsive Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isOpenMobileNav}
          onCloseMobile={() => setIsOpenMobileNav(false)}
          isCollapsedDesktop={isCollapsedDesktop}
          onToggleCollapseDesktop={() => setIsCollapsedDesktop(!isCollapsedDesktop)}
          leads={leads}
          onReturnHome={onReturnHome}
          onOpenComingSoon={(featureName, category) => setComingSoonModal({ featureName, category })}
        />

        {/* Main Content Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <AdminHeader
            user={currentUser}
            activeTab={activeTab}
            onRefresh={handleRefresh}
            onLogout={handleSignOut}
            onToggleMobileNav={() => setIsOpenMobileNav(!isOpenMobileNav)}
            isOpenMobileNav={isOpenMobileNav}
            isRefreshing={isRefreshing}
          />

          {/* Main Scrollable View Area */}
          <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
            
            {/* Lead Fetch Error Banner */}
            {leadFetchError && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Database Retrieval Note</span>
                </div>
                <div className="font-mono text-[11px] opacity-90">{leadFetchError}</div>
              </div>
            )}

            {/* TAB 1: OVERVIEW (Operational Dashboard) */}
            {activeTab === 'overview' && (
              <AdminOverviewView
                leads={leads}
                onSelectLead={setSelectedLead}
                onNavigateTo={setActiveTab}
                onUpdateStage={handleUpdateStage}
              />
            )}

            {/* TAB 2: PIPELINE BOARD & STACK */}
            {activeTab === 'pipeline' && (
              <AdminPipelineBoard
                leads={leads}
                onSelectLead={setSelectedLead}
                onUpdateStage={handleUpdateStage}
              />
            )}

            {/* TAB 3: LEADS DATABASE & TABLE */}
            {activeTab === 'database' && (
              <div className="space-y-4">
                {exportFeedback && (
                  <div className="p-3 sm:p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{exportFeedback.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExportFeedback(null)}
                      className="p-1 text-emerald-700 hover:text-emerald-900 rounded-md hover:bg-emerald-100 transition-colors"
                      aria-label="Dismiss export notice"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <AdminLeadFilters
                  filters={filters}
                  onChangeFilters={setFilters}
                  onResetFilters={() => setFilters(initialFilters)}
                  totalFiltered={filteredLeads.length}
                  totalCount={leads.length}
                  selectedCount={selectedLeadIds.size}
                  onExportFiltered={handleExportFiltered}
                  onExportAll={handleExportAll}
                  onExportSelected={handleExportSelected}
                />

                <AdminLeadTable
                  leads={filteredLeads}
                  onSelectLead={setSelectedLead}
                  isLoading={isLoadingLeads}
                  selectedLeadIds={selectedLeadIds}
                  onToggleSelectLead={handleToggleSelectLead}
                  onSelectAllVisible={handleSelectAllVisible}
                  onClearSelection={handleClearSelection}
                  onExportSelected={handleExportSelected}
                />
              </div>
            )}

            {/* TAB 4: FOLLOW-UPS QUEUE */}
            {activeTab === 'followups' && (
              <AdminFollowUpsView
                leads={leads}
                onSelectLead={setSelectedLead}
              />
            )}

            {/* TAB 5: NOTIFICATION CENTER */}
            {activeTab === 'notifications' && (
              <AdminNotificationCenter leads={leads} />
            )}

            {/* TAB 6: GROWTH ANALYTICS */}
            {activeTab === 'analytics' && (
              <AdminGrowthAnalyticsView leads={leads} />
            )}

            {/* TAB 7: CONVERSION FUNNEL (INSIGHTS) */}
            {activeTab === 'conversion' && (
              <div className="space-y-6">
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Conversion Funnel Diagnostics</h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Tracking prospective healthcare partners through discovery diagnosis, proposal submission, commercial negotiation, and signed onboarding.
                  </p>
                  <AnalyticsFunnelCard funnel={intelligence.funnel} />
                </div>
                <AnalyticsDiagnosticAlerts diagnostics={intelligence.diagnostics} />
              </div>
            )}

            {/* TAB 8: MARKETING PERFORMANCE (INSIGHTS) */}
            {activeTab === 'marketing' && (
              <div className="space-y-6">
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Marketing Channel Attribution</h2>
                  <p className="text-xs text-slate-500 mb-4">
                    CAC economics, channel yield, and pipeline conversion rates across organic, Google Ads, Meta Ads, and LinkedIn.
                  </p>
                  <AnalyticsChannelEconomics channels={intelligence.channels} campaigns={intelligence.campaigns} />
                </div>
              </div>
            )}

            {/* TAB 9: SALES REPORTS (REPORTS) */}
            {activeTab === 'sales_reports' && (
              <AdminSalesReportsView leads={leads} />
            )}

            {/* TAB 10: FINANCE OVERVIEW */}
            {activeTab === 'revenue_reports' && (
              <AdminFinanceOverviewView
                invoices={invoices}
                payments={payments}
                expenses={expenses}
                clients={clients}
                onRefresh={loadFinanceData}
                onOpenCreateInvoice={() => {
                  setActiveClientForAction(null);
                  setIsCreateInvoiceOpen(true);
                }}
                onOpenRecordPayment={() => {
                  setActivePaymentInvoice(null);
                  setActiveClientForAction(null);
                  setIsRecordPaymentOpen(true);
                }}
                onOpenLogExpense={() => setIsLogExpenseOpen(true)}
                onSelectTab={setActiveTab}
              />
            )}

            {/* TAB 11: INVOICES & RECEIVABLES */}
            {activeTab === 'finance_invoices' && (
              <AdminInvoicesView
                invoices={invoices}
                clients={clients}
                onOpenCreateInvoice={() => {
                  setActiveClientForAction(null);
                  setIsCreateInvoiceOpen(true);
                }}
                onRecordPaymentForInvoice={(inv) => {
                  setActivePaymentInvoice(inv);
                  setActiveClientForAction(null);
                  setIsRecordPaymentOpen(true);
                }}
                onRefresh={loadFinanceData}
              />
            )}

            {/* TAB 12: INCOME & PAYMENTS */}
            {activeTab === 'finance_payments' && (
              <AdminPaymentsView
                payments={payments}
                onOpenRecordPayment={() => {
                  setActivePaymentInvoice(null);
                  setActiveClientForAction(null);
                  setIsRecordPaymentOpen(true);
                }}
                onRefresh={loadFinanceData}
              />
            )}

            {/* TAB 13: EXPENSES */}
            {activeTab === 'report_expenses' && (
              <AdminExpensesView
                expenses={expenses}
                onOpenLogExpense={() => setIsLogExpenseOpen(true)}
                onDeleteExpense={handleDeleteExpense}
                onRefresh={loadFinanceData}
              />
            )}

            {/* TAB 14: CLIENT ACCOUNTS */}
            {activeTab === 'finance_clients' && (
              <AdminClientsView
                clients={clients}
                invoices={invoices}
                payments={payments}
                onOpenCreateClient={() => {
                  setClientFromLeadData(null);
                  setIsCreateClientOpen(true);
                }}
                onOpenCreateInvoiceForClient={(c) => {
                  setActiveClientForAction(c);
                  setIsCreateInvoiceOpen(true);
                }}
                onOpenRecordPaymentForClient={(c) => {
                  setActiveClientForAction(c);
                  setActivePaymentInvoice(null);
                  setIsRecordPaymentOpen(true);
                }}
                onRefresh={loadFinanceData}
              />
            )}

            {/* TAB 15: LEAD REPORTS (REPORTS) */}
            {activeTab === 'lead_reports' && (
              <AdminLeadReportsView leads={leads} />
            )}

            {/* Lead Detail Slide-over / Modal */}
            <AdminLeadDetailModal
              lead={selectedLead}
              onClose={() => setSelectedLead(null)}
              onSaveLead={handleSaveLead}
              onConvertToClient={handleConvertToClientFromLead}
            />

            {/* Finance Modals */}
            <AdminCreateInvoiceModal
              isOpen={isCreateInvoiceOpen}
              onClose={() => {
                setIsCreateInvoiceOpen(false);
                setActiveClientForAction(null);
              }}
              onSubmit={handleCreateInvoice}
              clients={clients}
              initialClient={activeClientForAction}
            />

            <AdminRecordPaymentModal
              isOpen={isRecordPaymentOpen}
              onClose={() => {
                setIsRecordPaymentOpen(false);
                setActivePaymentInvoice(null);
                setActiveClientForAction(null);
              }}
              onSubmit={handleRecordPayment}
              clients={clients}
              invoices={invoices}
              initialInvoice={activePaymentInvoice}
              initialClient={activeClientForAction}
            />

            <AdminCreateClientModal
              isOpen={isCreateClientOpen}
              onClose={() => {
                setIsCreateClientOpen(false);
                setClientFromLeadData(null);
              }}
              onSubmit={handleCreateClient}
              initialData={clientFromLeadData}
            />

            <AdminLogExpenseModal
              isOpen={isLogExpenseOpen}
              onClose={() => setIsLogExpenseOpen(false)}
              onSubmit={handleLogExpense}
            />

          </main>

          {/* Workspace Footer */}
          <footer className="bg-white border-t border-slate-200 py-3.5 px-4 sm:px-6 text-center text-[11px] text-slate-500 shrink-0">
            MK Digitalverse Sales Pipeline & Lead Intelligence System • Confidential Executive Workspace
          </footer>
        </div>
      </div>

      {/* ROADMAP / COMING SOON MODAL (For unintegrated communication & financial modules) */}
      {comingSoonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-700 tracking-wider">
                    {comingSoonModal.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {comingSoonModal.featureName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setComingSoonModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs text-slate-600 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Scheduled for Implementation (ADM-03)</span>
              </div>
              <p>
                The <strong>{comingSoonModal.featureName}</strong> system is mapped in the MK Digitalverse CRM architecture. Core underlying data pipelines and secure webhooks are ready to connect in the upcoming deployment phase.
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setComingSoonModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors min-h-[40px]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
