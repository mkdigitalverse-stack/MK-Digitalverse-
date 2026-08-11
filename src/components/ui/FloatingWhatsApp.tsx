import React, { useState } from 'react';
import { SITE_CONFIG } from '../../config/site';
import { analytics } from '../../services/analytics';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [dismissedTooltip, setDismissedTooltip] = useState(false);

  const handleClick = () => {
    analytics.trackWhatsAppClick('FloatingButton');
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 pointer-events-auto">
      
      {/* Expandable Desktop Tooltip / Badge */}
      {!dismissedTooltip && (
        <div 
          className={`hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#050B18]/95 border border-[#C5A059]/40 shadow-2xl backdrop-blur-xl text-white text-xs font-sans transition-all duration-300 transform origin-right ${
            isHovered ? 'opacity-100 translate-x-0 scale-100' : 'opacity-90 translate-x-1 scale-98'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-bold text-white text-[11px] leading-tight">
              Executive WhatsApp Desk
            </span>
            <span className="text-[10px] text-slate-300 leading-tight">
              Instant Healthcare Inquiry Response
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDismissedTooltip(true);
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close message tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={SITE_CONFIG.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contact MK Digitalverse on WhatsApp"
        title="Chat with MK Digitalverse on WhatsApp"
        className="relative group w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] p-[2px] shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#050B18] flex items-center justify-center"
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping duration-1000 pointer-events-none opacity-40 group-hover:opacity-0" />

        {/* Inner Button Canvas */}
        <div className="w-full h-full bg-[#075E54] group-hover:bg-[#128C7E] rounded-full flex items-center justify-center transition-colors">
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white/20 stroke-[2]" />
        </div>

        {/* Online Status Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#050B18] shadow-sm" />
      </a>

    </div>
  );
};
