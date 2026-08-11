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
    console.error('[MK Digitalverse] Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-md w-full bg-navy-900/90 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl text-center relative z-10">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h1 className="font-heading text-2xl font-bold text-white mb-2">
              System Recovery Mode
            </h1>
            
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              We encountered a temporary interface state anomaly. Your data is secure. Please reload or return to the main growth portal.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-accent-blue hover:bg-blue-600 font-semibold text-white transition-all text-sm shadow-lg shadow-accent-blue/20"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-navy-800 hover:bg-navy-700 border border-white/10 font-semibold text-zinc-300 transition-all text-sm"
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
