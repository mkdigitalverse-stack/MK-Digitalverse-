import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Props;
  declare state: State;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[MK Digitalverse] Admin/runtime exception:', error, errorInfo);
  }

  private sanitizeErrorMessage(msg: string): string {
    if (!msg) return 'An unexpected interface exception occurred.';
    // Strip any possible API keys or tokens
    return msg
      .replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[REDACTED_TOKEN]')
      .replace(/(?:key|secret|password|token)=[a-zA-Z0-9_-]+/gi, '$1=[REDACTED]');
  }

  public render() {
    if (this.state.hasError) {
      const isAdminRoute = typeof window !== 'undefined' && (
        window.location.pathname.toLowerCase().startsWith('/admin') ||
        window.location.pathname.toLowerCase().startsWith('/login') ||
        window.location.hash.toLowerCase().includes('/admin') ||
        window.location.hash.toLowerCase().includes('/login')
      );

      const errorMessage = this.state.error
        ? this.sanitizeErrorMessage(this.state.error.message)
        : 'An unexpected interface exception occurred.';

      return (
        <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-lg w-full bg-navy-900/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl text-center relative z-10 space-y-5">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
                {isAdminRoute ? 'Admin Workspace Recovery' : 'System Recovery Mode'}
              </h1>
              
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {isAdminRoute 
                  ? 'A runtime exception occurred in the admin workspace module. Diagnostic telemetry has been safely recorded in the console.'
                  : 'We encountered a temporary interface state anomaly. Your data is secure. Please reload or return to the main growth portal.'}
              </p>
            </div>

            {isAdminRoute && this.state.error && (
              <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-left font-mono text-[11px] text-red-300 overflow-x-auto">
                <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Diagnostic Signature</div>
                <div className="truncate">{this.state.error.name}: {errorMessage}</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  if (isAdminRoute) {
                    window.location.href = '/admin';
                  } else {
                    window.location.reload();
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-accent-blue hover:bg-blue-600 font-semibold text-white transition-all text-xs sm:text-sm shadow-lg shadow-accent-blue/20"
              >
                <RefreshCw className="w-4 h-4" />
                {isAdminRoute ? 'Retry Admin Login' : 'Reload Page'}
              </button>
              
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-navy-800 hover:bg-navy-700 border border-white/10 font-semibold text-zinc-300 transition-all text-xs sm:text-sm"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
