import React from 'react';
import { IndustryType } from '../types';
import { 
  HeartPulse, 
  Palmtree, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Lock, 
  Layers, 
  BarChart3,
  Globe2
} from 'lucide-react';

interface FooterProps {
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectIndustry, onOpenAuditModal }) => {
  return (
    <footer className="bg-[#05070B] border-t border-slate-800 text-slate-400 text-xs">
      
      {/* Top CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl glass-panel bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Globe2 className="w-4 h-4" />
              <span>Digital Growth Partner</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Ready to build an integrated revenue engine?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Transform your patient acquisition or venue booking model with MK Digitalverse.
            </p>
          </div>

          <button
            onClick={onOpenAuditModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shrink-0 shadow-lg"
          >
            Request Growth Audit
          </button>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-emerald-500 p-[1px]">
              <div className="w-full h-full bg-[#0A0D14] rounded-[7px] flex items-center justify-center font-black text-amber-400 text-lg">
                MK
              </div>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              MK DIGITALVERSE
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            MK Digitalverse is a premier Digital Growth Partner. We architect integrated business growth systems for healthcare organizations and luxury wedding venues.
          </p>

          <div className="space-y-2 text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="mailto:mkdigitalverse@gmail.com" className="hover:text-white transition-colors">
                mkdigitalverse@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Partner Desk: Available via Audit Request</span>
            </div>
          </div>
        </div>

        {/* Industry Solutions */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">
            Industry Systems
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => onSelectIndustry('healthcare')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-amber-400" />
                <span>Healthcare Acquisition</span>
              </button>
            </li>
            <li><a href="#industries" className="hover:text-white transition-colors">Hospitals & Health Systems</a></li>
            <li><a href="#industries" className="hover:text-white transition-colors">IVF & Fertility Centres</a></li>
            <li><a href="#industries" className="hover:text-white transition-colors">Cosmetic & Dental Clinics</a></li>
            <li>
              <button onClick={() => onSelectIndustry('wedding_venues')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 pt-2">
                <Palmtree className="w-3.5 h-3.5 text-emerald-400" />
                <span>Luxury Wedding Venues</span>
              </button>
            </li>
            <li><a href="#industries" className="hover:text-white transition-colors">Destination Resorts</a></li>
            <li><a href="#industries" className="hover:text-white transition-colors">Heritage Estates & Farms</a></li>
          </ul>
        </div>

        {/* Growth Architecture */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">
            Capabilities
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#capabilities" className="hover:text-white transition-colors">Growth Strategy & Positioning</a></li>
            <li><a href="#capabilities" className="hover:text-white transition-colors">Next.js Web Engineering</a></li>
            <li><a href="#capabilities" className="hover:text-white transition-colors">AI Patient & Lead Triage</a></li>
            <li><a href="#capabilities" className="hover:text-white transition-colors">Performance Growth Marketing</a></li>
            <li><a href="#capabilities" className="hover:text-white transition-colors">Reputation & Review Engines</a></li>
            <li><a href="#roi-calculator" className="hover:text-white transition-colors">Interactive ROI Modeling</a></li>
          </ul>
        </div>

        {/* Platform Roadmap */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
            <span>Platform Modules</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Future
            </span>
          </h4>
          <ul className="space-y-2 text-slate-500">
            <li className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-600" />
              <span>Partner Growth Portal</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-600" />
              <span>Healthcare Directory & SaaS</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-600" />
              <span>AI Lead Automation Engine</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-600" />
              <span>CRM & Razorpay Connectors</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} MK Digitalverse. All rights reserved. Official Digital Growth Partner.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Growth Engagement</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Security Standards</a>
        </div>
      </div>

    </footer>
  );
};
