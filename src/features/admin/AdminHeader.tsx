import React from 'react';
import { Menu, RefreshCw, LogOut, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { AdminAuthUser } from '../../services/adminLeadsService';
import { AdminViewTab } from './AdminSidebar';

interface AdminHeaderProps {
  user: AdminAuthUser | null;
  activeTab: AdminViewTab;
  onRefresh: () => void;
  onLogout: () => void;
  onToggleMobileNav: () => void;
  isOpenMobileNav: boolean;
  isRefreshing?: boolean;
}

const TAB_TITLES: Record<AdminViewTab, { title: string; category: string }> = {
  overview: { title: 'Overview', category: 'Dashboard' },
  pipeline: { title: 'Sales Pipeline', category: 'Dashboard' },
  database: { title: 'Lead Database', category: 'Dashboard' },
  followups: { title: 'Follow-Up Queue', category: 'Dashboard' },
  notifications: { title: 'Notification Center', category: 'System' },
  analytics: { title: 'Growth Analytics', category: 'Insights' },
  conversion: { title: 'Conversion Funnel', category: 'Insights' },
  marketing: { title: 'Marketing Attribution', category: 'Insights' },
  sales_reports: { title: 'Sales Performance', category: 'Reports' },
  revenue_reports: { title: 'Revenue Breakdown', category: 'Reports' },
  lead_reports: { title: 'Lead Intelligence', category: 'Reports' }
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  activeTab,
  onRefresh,
  onLogout,
  onToggleMobileNav,
  isOpenMobileNav,
  isRefreshing = false
}) => {
  const currentNav = TAB_TITLES[activeTab] || { title: 'Admin CRM', category: 'Dashboard' };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="w-full px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Mobile Hamburger & Active View Breadcrumb */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {/* Hamburger button visible below lg (<1024px) */}
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="lg:hidden p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            aria-label={isOpenMobileNav ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpenMobileNav}
            aria-controls="admin-sidebar"
          >
            <Menu className="w-5 h-5 text-amber-400" />
          </button>

          {/* Title & Breadcrumb */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
              <span className="hidden sm:inline uppercase">{currentNav.category}</span>
              <span className="hidden sm:inline" aria-hidden="true">/</span>
              <span className="text-amber-400 font-bold uppercase truncate">{currentNav.title}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {currentNav.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions, Refresh, User Profile, Sign Out */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* User Email Pill */}
          {user && (
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="text-xs font-medium text-slate-200 truncate max-w-[180px]">
                {user.displayName || user.email}
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Growth Admin</span>
            </div>
          )}

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/80 flex items-center space-x-1.5 text-xs font-medium"
            title="Refresh database"
            aria-label="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-300'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 border border-red-800/50 text-xs font-medium transition-colors flex items-center space-x-1.5"
            title="Sign out of Admin CRM"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
};
