import React from 'react';
import { ArrowLeft, Home, Search, Calendar } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome: () => void;
  onOpenAuditModal: () => void;
}

export function NotFoundPage({ onReturnHome, onOpenAuditModal }: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-2xl w-full bg-navy-900/80 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl relative z-10 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Search className="w-3.5 h-3.5" />
          Page Not Found (404)
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Destination Unmapped
        </h1>

        <p className="text-zinc-300 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          The healthcare growth resources or page you are searching for has moved or does not exist. Explore our core strategic growth solutions or return to the main platform.
        </p>

        {/* Quick Links / Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent-blue hover:bg-blue-600 font-semibold text-white shadow-xl shadow-accent-blue/25 transition-all text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Return to Homepage
          </button>

          <button
            onClick={onOpenAuditModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-white/10 font-semibold text-amber-400 transition-all text-sm"
          >
            <Calendar className="w-4 h-4" />
            Book Discovery Call
          </button>
        </div>

        {/* Quick Navigation Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
          <button onClick={onReturnHome} className="hover:text-white transition-colors">Growth System</button>
          <span>•</span>
          <button onClick={onReturnHome} className="hover:text-white transition-colors">Healthcare Segments</button>
          <span>•</span>
          <button onClick={onReturnHome} className="hover:text-white transition-colors">Case Studies</button>
          <span>•</span>
          <button onClick={onReturnHome} className="hover:text-white transition-colors">Capabilities</button>
        </div>
      </div>
    </div>
  );
}
