import React from 'react';
import { ShieldCheck, LogOut, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { AdminAuthUser } from '../../services/adminLeadsService';

interface AdminHeaderProps {
  user: AdminAuthUser | null;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  onRefresh,
  onLogout,
  isRefreshing = false
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Workspace Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 flex items-center justify-center shadow-inner">
            <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-100 tracking-tight text-base">MK DIGITALVERSE</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock className="w-3 h-3 mr-1" />
                Secure Admin Workspace
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Healthcare Lead Management Intelligence</p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-medium text-slate-200">{user.displayName || user.email}</span>
              <span className="text-[10px] text-slate-400">Authorized Admin</span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 title='Refresh leads list'"
            aria-label="Refresh leads"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 border border-red-800/50 text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
};
