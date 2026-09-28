import React from 'react';
import {
  LayoutDashboard,
  LayoutGrid,
  Users,
  CalendarClock,
  Mail,
  MessageSquare,
  Smartphone,
  FileCode2,
  BarChart3,
  DollarSign,
  TrendingDown,
  Percent,
  FileSpreadsheet,
  LineChart,
  Target,
  Share2,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  ShieldCheck,
  Lock,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { CompleteLeadRecord } from '../../services/qualification';
import { FollowUpAutomationEngine } from '../../services/followUpAutomation';

export type AdminViewTab =
  | 'overview'
  | 'pipeline'
  | 'database'
  | 'followups'
  | 'notifications'
  | 'analytics'
  | 'conversion'
  | 'marketing'
  | 'sales_reports'
  | 'revenue_reports'
  | 'lead_reports'
  | 'finance_contracts'
  | 'finance_invoices'
  | 'finance_payments'
  | 'report_expenses'
  | 'finance_clients';

interface AdminSidebarProps {
  activeTab: AdminViewTab;
  onSelectTab: (tab: AdminViewTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
  leads: CompleteLeadRecord[];
  onReturnHome: () => void;
  onOpenComingSoon: (featureName: string, category: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
  leads,
  onReturnHome,
  onOpenComingSoon
}) => {
  const now = new Date();

  // Compute live badges
  const activeOpportunitiesCount = leads.filter(
    (l) => l.qualification.opportunityStage !== 'won' && l.qualification.opportunityStage !== 'lost'
  ).length;

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  const overdueFollowUpsCount = leads.filter((lead) => {
    const isClosed = lead.status === 'won' || lead.status === 'lost';
    if (isClosed) return false;
    const evalRes = FollowUpAutomationEngine.evaluateOpportunity(lead, now);
    return evalRes.classification === 'OVERDUE';
  }).length;

  interface NavItem {
    id: AdminViewTab | string;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    isComingSoon?: boolean;
    category: string;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navSections: NavSection[] = [
    {
      title: 'DASHBOARD',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: LayoutDashboard,
          category: 'Dashboard'
        },
        {
          id: 'pipeline',
          label: 'Pipeline',
          icon: LayoutGrid,
          badge: activeOpportunitiesCount > 0 ? activeOpportunitiesCount : undefined,
          badgeColor: 'bg-amber-500 text-white',
          category: 'Dashboard'
        },
        {
          id: 'database',
          label: 'Leads',
          icon: Users,
          badge: newLeadsCount > 0 ? `${newLeadsCount} new` : undefined,
          badgeColor: 'bg-blue-600 text-white',
          category: 'Dashboard'
        },
        {
          id: 'followups',
          label: 'Follow-ups',
          icon: CalendarClock,
          badge: overdueFollowUpsCount > 0 ? overdueFollowUpsCount : undefined,
          badgeColor: 'bg-red-600 text-white',
          category: 'Dashboard'
        }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        {
          id: 'comm_email',
          label: 'Email',
          icon: Mail,
          isComingSoon: true,
          category: 'Communication'
        },
        {
          id: 'comm_whatsapp',
          label: 'WhatsApp',
          icon: MessageSquare,
          isComingSoon: true,
          category: 'Communication'
        },
        {
          id: 'comm_sms',
          label: 'SMS',
          icon: Smartphone,
          isComingSoon: true,
          category: 'Communication'
        },
        {
          id: 'comm_templates',
          label: 'Templates',
          icon: FileCode2,
          isComingSoon: true,
          category: 'Communication'
        }
      ]
    },
    {
      title: 'FINANCE & CASH FLOW',
      items: [
        {
          id: 'revenue_reports',
          label: 'Finance Overview',
          icon: DollarSign,
          category: 'Finance'
        },
        {
          id: 'finance_contracts',
          label: 'Contracts & Milestones',
          icon: Layers,
          category: 'Finance'
        },
        {
          id: 'finance_invoices',
          label: 'Invoices & Billing',
          icon: FileSpreadsheet,
          category: 'Finance'
        },
        {
          id: 'finance_payments',
          label: 'Income & Payments',
          icon: DollarSign,
          category: 'Finance'
        },
        {
          id: 'report_expenses',
          label: 'Expenses',
          icon: TrendingDown,
          category: 'Finance'
        },
        {
          id: 'finance_clients',
          label: 'Client Accounts',
          icon: Users,
          category: 'Finance'
        }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        {
          id: 'sales_reports',
          label: 'Sales Reports',
          icon: BarChart3,
          category: 'Reports'
        },
        {
          id: 'lead_reports',
          label: 'Lead Reports',
          icon: FileSpreadsheet,
          category: 'Reports'
        }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          icon: LineChart,
          category: 'Insights'
        },
        {
          id: 'conversion',
          label: 'Conversion',
          icon: Target,
          category: 'Insights'
        },
        {
          id: 'marketing',
          label: 'Marketing Performance',
          icon: Share2,
          category: 'Insights'
        }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          badge: overdueFollowUpsCount > 0 ? 'Alert' : undefined,
          badgeColor: 'bg-red-500 text-white',
          category: 'System'
        },
        {
          id: 'sys_settings',
          label: 'Settings',
          icon: Settings,
          isComingSoon: true,
          category: 'System'
        }
      ]
    }
  ];

  const handleItemClick = (item: NavItem) => {
    if (item.isComingSoon) {
      onOpenComingSoon(item.label, item.category);
    } else {
      onSelectTab(item.id as AdminViewTab);
    }
    // Always close mobile navigation drawer upon selection
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out lg:static ${
          isOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsedDesktop ? 'lg:w-20' : 'lg:w-64'}`}
        aria-label="Admin Navigation"
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 flex items-center justify-center shrink-0 shadow-inner">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            {(!isCollapsedDesktop || isOpenMobile) && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-white text-xs tracking-tight truncate">MK DIGITALVERSE</span>
                <span className="text-[10px] text-amber-400 font-mono tracking-wider">CRM SYSTEM</span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Collapse/Expand button on desktop */}
          <button
            type="button"
            onClick={onToggleCollapseDesktop}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label={isCollapsedDesktop ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsedDesktop ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsedDesktop ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {(!isCollapsedDesktop || isOpenMobile) && (
                <h3 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {section.title}
                </h3>
              )}
              {isCollapsedDesktop && !isOpenMobile && (
                <div className="h-px bg-slate-800 my-2 mx-1" />
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item)}
                      title={isCollapsedDesktop && !isOpenMobile ? `${item.label} ${item.isComingSoon ? '(Coming Soon)' : ''}` : undefined}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors group relative ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                          : item.isComingSoon
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-amber-400'
                              : item.isComingSoon
                              ? 'text-slate-400 group-hover:text-slate-300'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        {(!isCollapsedDesktop || isOpenMobile) && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {(!isCollapsedDesktop || isOpenMobile) && (
                        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                          {item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                item.badgeColor || 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {item.isComingSoon && (
                            <span className="text-[9px] font-mono uppercase text-slate-400 bg-slate-800/80 px-1 py-0.5 rounded border border-slate-700/50">
                              Soon
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <button
            type="button"
            onClick={onReturnHome}
            className={`w-full flex items-center ${
              isCollapsedDesktop && !isOpenMobile ? 'justify-center px-1' : 'space-x-2 px-2.5'
            } py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700/50`}
            title="Return to Public Website"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            {(!isCollapsedDesktop || isOpenMobile) && (
              <span className="truncate">Public Website</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
