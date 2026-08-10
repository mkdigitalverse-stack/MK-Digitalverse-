import React, { useState } from 'react';
import { DESIGN_TOKENS, DESIGN_MANIFESTO, DESIGN_PHILOSOPHY, VISUAL_LANGUAGE_SYSTEM, SIGNATURE_BRAND_EXPERIENCE, PREMIUM_MICRO_INTERACTIONS, RIGHT_FIT_PRINCIPLE, BRAND_EXPERIENCE_STANDARDS, THE_TRUST_PYRAMID, HEALTHCARE_DECISION_JOURNEY, TECHNICAL_EXCELLENCE_AND_SEO, COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING, BRAND_DESIGN_SYSTEM_V1, WEBSITE_VISUAL_SYSTEM_V1, DESIGN_SYSTEM_V2_DES02, MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES, TWELVE_GLOBAL_MANDATES } from '../../theme/designTokens';
import { Button } from '../../components/ui/design-system/Button';
import { Card } from '../../components/ui/design-system/Card';
import { Input, Textarea, Select, Checkbox } from '../../components/ui/design-system/FormControls';
import { Badge } from '../../components/ui/design-system/Badge';
import { Heading, Text } from '../../components/ui/design-system/Typography';
import { SectionContainer, GridContainer } from '../../components/ui/design-system/LayoutContainer';
import { ModalDialog } from '../../components/ui/design-system/ModalDialog';
import { AccordionItem, TabGroup, StatCard, TimelineStep } from '../../components/ui/design-system/AccordionItem';
import { 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Copy, 
  Layers, 
  Palette, 
  Type, 
  Box, 
  Sliders, 
  Layout, 
  Activity, 
  ShieldCheck, 
  Mail, 
  HeartPulse, 
  Castle, 
  Zap, 
  BarChart3, 
  Search, 
  HelpCircle,
  Eye
} from 'lucide-react';

interface DesignSystemPageProps {
  onBackToHome: () => void;
}

export const DesignSystemPage: React.FC<DesignSystemPageProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState('healthcare');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Copy hex or token value to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const toggleLoading = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans pb-28 pt-24 selection:bg-amber-400 selection:text-black">
      
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <div>
              <span className="text-sm font-display font-bold text-white tracking-tight block">
                MK Digitalverse Design System
              </span>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                DS-01 Architecture Specs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
              v1.8 Active System
            </span>
            <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
              Preview Modal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-20">
        
        {/* Hero Title Banner */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel bg-gradient-to-r from-zinc-950 via-[#0a0a0f] to-zinc-950 border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <Badge variant="amber" icon={<Layers className="w-3.5 h-3.5" />}>
              Internal System Guide & Design Tokens
            </Badge>

            <Heading level="displayLg">
              Design System & Component Library (DS-01)
            </Heading>

            <Text variant="bodyLarge" muted>
              The central visual operating system for MK Digitalverse. Standardizing typography scale, 8px spatial grid, neutral color surfaces, domain accent tokens, and accessible UI primitives.
            </Text>

            {/* Jump Navigation Chips */}
            <div className="flex items-center gap-2 pt-4 flex-wrap text-xs">
              <a href="#tokens-color" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-amber-400/40 text-zinc-300 hover:text-white transition-all">
                Colors
              </a>
              <a href="#tokens-typography" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-amber-400/40 text-zinc-300 hover:text-white transition-all">
                Typography
              </a>
              <a href="#tokens-buttons" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-amber-400/40 text-zinc-300 hover:text-white transition-all">
                Buttons
              </a>
              <a href="#tokens-forms" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-amber-400/40 text-zinc-300 hover:text-white transition-all">
                Forms
              </a>
              <a href="#tokens-cards" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-amber-400/40 text-zinc-300 hover:text-white transition-all">
                Cards & Elevation
              </a>
              <a href="#tokens-grid" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-amber-400/40 text-zinc-300 hover:text-white transition-all">
                8px Grid Scale
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 0: DESIGN PHILOSOPHY & MANIFESTO (DP-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-amber-500/20 relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">Phase 1 — Design Philosophy (DP-01)</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">{DESIGN_PHILOSOPHY.identity}</span>
          </div>

          <blockquote className="p-5 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-zinc-200 italic text-sm leading-relaxed">
            "{DESIGN_MANIFESTO}"
          </blockquote>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Strategy</div>
              <div className="text-lg font-bold text-amber-400">{DESIGN_PHILOSOPHY.formula.strategy}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Trust</div>
              <div className="text-lg font-bold text-amber-400">{DESIGN_PHILOSOPHY.formula.trust}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Simplicity</div>
              <div className="text-lg font-bold text-zinc-300">{DESIGN_PHILOSOPHY.formula.simplicity}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Innovation</div>
              <div className="text-lg font-bold text-zinc-300">{DESIGN_PHILOSOPHY.formula.innovation}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Motion</div>
              <div className="text-lg font-bold text-zinc-300">{DESIGN_PHILOSOPHY.formula.motion}</div>
            </div>
          </div>
        </section>

        {/* SECTION 0.5: VISUAL LANGUAGE SYSTEM (VLS-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 2 — Visual Language System (VLS-01)</h3>
            </div>
            <span className="text-xs font-mono text-amber-400">{VISUAL_LANGUAGE_SYSTEM.themeName}</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed italic">
            "A premium brand is recognized before it's read." — Positioned as a <strong className="text-amber-400 font-semibold">{VISUAL_LANGUAGE_SYSTEM.positioning}</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Inspiration & Personality Mix</h4>
              <ul className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
                {Object.entries(VISUAL_LANGUAGE_SYSTEM.inspirationMix).map(([brand, ratio]) => (
                  <li key={brand} className="flex justify-between">
                    <span className="capitalize text-zinc-400">{brand}:</span>
                    <span className="text-white">{ratio}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Border Radius Standard</h4>
              <ul className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
                {Object.entries(VISUAL_LANGUAGE_SYSTEM.radiusRules).map(([elem, rule]) => (
                  <li key={elem} className="flex justify-between">
                    <span className="capitalize text-zinc-400">{elem}:</span>
                    <span className="text-white">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">The One Rule & Container</h4>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong className="text-white font-semibold">Max Width:</strong> {VISUAL_LANGUAGE_SYSTEM.containerMaxWidth}
              </p>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong className="text-white font-semibold">Rule:</strong> {VISUAL_LANGUAGE_SYSTEM.theOneRule}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 text-center text-xs font-mono text-zinc-300">
            {VISUAL_LANGUAGE_SYSTEM.visualFormula}
          </div>
        </section>

        {/* SECTION 0.8: SIGNATURE BRAND EXPERIENCE (SBE-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-cyan-500/20 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 3 — Signature Brand Experience (SBE-01)</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">"{SIGNATURE_BRAND_EXPERIENCE.philosophy}"</span>
          </div>

          {/* Strategic Journey Map */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span>Digital Growth Experience Journey Map</span>
              <span className="text-[10px] text-cyan-400 font-mono">(CTO Decision Architecture)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SIGNATURE_BRAND_EXPERIENCE.journeyMap.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Step 0{idx + 1} • {step.section}</div>
                  <div className="text-xs text-zinc-200 font-medium">"{step.question}"</div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Cards & Progression */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">Strategic Decision Progression</h4>
              <div className="flex flex-wrap items-center gap-2">
                {SIGNATURE_BRAND_EXPERIENCE.progression.map((item, idx) => (
                  <React.Fragment key={item}>
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-semibold">{item}</span>
                    {idx < SIGNATURE_BRAND_EXPERIENCE.progression.length - 1 && (
                      <span className="text-zinc-600 text-xs">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed pt-2 border-t border-white/5">
                {SIGNATURE_BRAND_EXPERIENCE.notebookStyle}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">Signature Insight Cards Widget Preview</h4>
              <div className="grid grid-cols-2 gap-2">
                {SIGNATURE_BRAND_EXPERIENCE.insightCards.map((card, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-xs font-bold text-amber-400 font-mono">{card.metric}</div>
                    <div className="text-[10px] text-zinc-300 font-medium">{card.label}</div>
                    <div className="text-[9px] text-zinc-500 font-mono">{card.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 0.9: PREMIUM MICRO-INTERACTIONS & UX POLISH (PMI-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-emerald-500/20 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 4 — Premium Micro-Interactions & UX Polish (PMI-01)</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">"{PREMIUM_MICRO_INTERACTIONS.principle}"</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Motion Timing Standards */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Motion Timing Standards</h4>
              <ul className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
                {Object.entries(PREMIUM_MICRO_INTERACTIONS.timings).map(([key, value]) => (
                  <li key={key} className="flex justify-between border-b border-white/5 pb-1">
                    <span className="capitalize text-zinc-400">{key}:</span>
                    <span className="text-white font-bold">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confidence Indicators (CTO Layer) */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Confidence Layer Indicators</h4>
              <div className="space-y-2">
                {PREMIUM_MICRO_INTERACTIONS.confidenceIndicators.map((indicator, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-zinc-200 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Experience Specification */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Discovery Call Success Pattern</h4>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-bold text-emerald-400">{PREMIUM_MICRO_INTERACTIONS.successExperience.header}</div>
                <div className="space-y-1">
                  {PREMIUM_MICRO_INTERACTIONS.successExperience.steps.map((step, idx) => (
                    <div key={idx} className="text-[10px] text-zinc-300 font-mono">{step}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center text-xs font-mono text-zinc-300">
            {PREMIUM_MICRO_INTERACTIONS.finalRule}
          </div>
        </section>

        {/* SECTION 0.95: THE RIGHT-FIT PRINCIPLE & PARTNERSHIP PHILOSOPHY (RFP-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-amber-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 5 — The Right-Fit Principle (RFP-01)</h3>
            </div>
            <span className="text-xs font-mono text-amber-400">Core Operating Principle</span>
          </div>

          <blockquote className="p-5 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-zinc-100 font-medium text-sm leading-relaxed">
            "{RIGHT_FIT_PRINCIPLE.statement}"
          </blockquote>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* We're a Great Fit If You... */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/20 space-y-3">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Great Fit Criteria</span>
              </h4>
              <ul className="space-y-2 text-zinc-200">
                {RIGHT_FIT_PRINCIPLE.fitCriteria.greatFit.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* We May Not Be the Right Fit If You... */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-red-500/20 space-y-3">
              <h4 className="font-bold text-red-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Not the Right Fit Criteria</span>
              </h4>
              <ul className="space-y-2 text-zinc-300">
                {RIGHT_FIT_PRINCIPLE.fitCriteria.notFit.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Subtlety Rule & CTA Framing */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold uppercase">
              <span>Subtlety Rule</span>
              <span>CTA Reframing</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white">Rule:</strong> {RIGHT_FIT_PRINCIPLE.subtletyRule}
            </p>
            <p className="text-zinc-300 leading-relaxed font-mono text-[11px]">
              <strong className="text-amber-400 font-sans">Primary CTA Reframing:</strong> "{RIGHT_FIT_PRINCIPLE.ctaFraming}"
            </p>
          </div>
        </section>

        {/* SECTION 0.99: BRAND EXPERIENCE STANDARDS (BES-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-blue-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 6 — Brand Experience Standards (BES-01)</h3>
            </div>
            <span className="text-xs font-mono text-blue-400">12 Core Operating Principles</span>
          </div>

          {/* Positioning Statement v1.0 */}
          <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase text-blue-400">Positioning Statement (v1.0 Locked)</div>
            <p className="text-zinc-100 text-sm font-medium leading-relaxed">
              "{BRAND_EXPERIENCE_STANDARDS.positioningStatementV1}"
            </p>
          </div>

          {/* 12 Core Principles Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">12 Brand Experience Principles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BRAND_EXPERIENCE_STANDARDS.twelvePrinciples.map((item) => (
                <div key={item.num} className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/5 space-y-1 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-400 font-bold">Principle {item.num}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-zinc-400 leading-snug">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Test Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-zinc-900 to-blue-950/60 border border-blue-400/20 text-center space-y-1">
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">The Executive Test</div>
            <div className="text-xs text-zinc-200 font-semibold">"{BRAND_EXPERIENCE_STANDARDS.executiveTest}"</div>
          </div>
        </section>

        {/* SECTION 1.0: THE TRUST PYRAMID & READINESS ASSESSMENT (TPRA-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-teal-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 7 — The Trust Pyramid & Readiness Assessment (TPRA-01)</h3>
            </div>
            <span className="text-xs font-mono text-teal-400">Trust Score 7/7 Audit Standard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* The 5 Layers of Trust */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-teal-400 uppercase tracking-wider text-[11px]">The 5 Layers of Executive Trust</h4>
              <div className="space-y-2">
                {THE_TRUST_PYRAMID.layers.map((layer) => (
                  <div key={layer.level} className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-teal-400 font-bold">Layer {layer.level}</span>
                      <span className="text-zinc-300 font-bold">{layer.title}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">{layer.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Library Architecture & 7/7 Checklist */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
                <h4 className="font-bold text-teal-400 uppercase tracking-wider text-[11px]">The Trust Library Architecture</h4>
                <div className="flex flex-wrap gap-1.5">
                  {THE_TRUST_PYRAMID.trustLibraryFolders.map((folder, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-white/10 text-zinc-300 text-[10px] font-mono">
                      📁 {folder}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
                <h4 className="font-bold text-teal-400 uppercase tracking-wider text-[11px]">Internal Page Audit: 7/7 Trust Score Checklist</h4>
                <div className="space-y-1.5">
                  {THE_TRUST_PYRAMID.trustScore7Checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                      <span className="text-teal-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1.01: THE HEALTHCARE DECISION JOURNEY (HDJ-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-blue-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 8 — The Healthcare Decision Journey (HDJ-01)</h3>
            </div>
            <span className="text-xs font-mono text-blue-400">Executive Buyer Architecture</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-zinc-900 to-blue-950/60 border border-blue-400/20 text-center space-y-1">
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">The Boardroom Test</div>
            <div className="text-xs text-zinc-200 font-semibold italic">"{HEALTHCARE_DECISION_JOURNEY.boardroomTest}"</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* 6 Executive Decision Questions */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">6 Executive Decision Questions</h4>
              <div className="space-y-2">
                {HEALTHCARE_DECISION_JOURNEY.decisionQuestions.map((q) => (
                  <div key={q.num} className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-blue-400 font-bold">{q.num}</span>
                      <span className="text-white font-bold">{q.question}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">{q.response}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature to Outcome Reframings & Target Buyer Personas */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
                <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">Executive Buyer Personas</h4>
                <div className="flex flex-wrap gap-1.5">
                  {HEALTHCARE_DECISION_JOURNEY.buyerPersonas.map((persona, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono font-medium">
                      👤 {persona}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Feature-to-Outcome Language Reframings</h4>
                <div className="space-y-2">
                  {HEALTHCARE_DECISION_JOURNEY.featureToOutcomeReframings.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-[11px]">
                      <div className="text-zinc-500 line-through text-[10px] font-mono">{item.feature}</div>
                      <div className="text-emerald-400 font-medium">→ {item.outcome}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>





        {/* SECTION 1.02: WEB-04 SEO, PERFORMANCE & TECHNICAL EXCELLENCE (TE-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-emerald-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 9 — WEB-04 SEO, Performance & Technical Excellence (TE-01)</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">5-Year Scalability Platform Architecture</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-emerald-950/60 border border-emerald-400/20 text-center space-y-1">
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">The 5-Year Technical Standard</div>
            <div className="text-xs text-zinc-200 font-semibold italic">"{TECHNICAL_EXCELLENCE_AND_SEO.fiveYearVision}"</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Core Web Vitals Targets */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Core Web Vitals Engineering Targets</h4>
              <div className="space-y-2">
                {TECHNICAL_EXCELLENCE_AND_SEO.coreWebVitalsTargets.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{item.metric}</div>
                      <div className="text-[10px] text-zinc-400">{item.priority}</div>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold text-sm">{item.target}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 10 Technical Pillars Preview */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">10 Technical Architecture Pillars</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {TECHNICAL_EXCELLENCE_AND_SEO.tenPillars.slice(0, 6).map((pillar) => (
                  <div key={pillar.num} className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-[10px]">
                    <span className="text-cyan-400 font-mono font-bold">{pillar.num}.</span> <span className="text-zinc-200 font-medium">{pillar.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1.03: WEB-05 COMPONENT SYSTEM & DESIGN ENGINEERING (CSDE-01) */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-violet-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Phase 10 — WEB-05 Component System & Design Engineering (CSDE-01)</h3>
            </div>
            <span className="text-xs font-mono text-violet-400">The 80% Component Reuse Rule</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/60 via-zinc-900 to-purple-950/60 border border-violet-400/20 text-center space-y-1">
            <div className="text-[10px] font-mono text-violet-400 font-bold uppercase">The 80% Rule Principle</div>
            <div className="text-xs text-zinc-200 font-semibold italic">"{COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.eightyPercentRule}"</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* 6-Level Design Hierarchy */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
              <h4 className="font-bold text-violet-400 uppercase tracking-wider text-[11px]">6-Level Design System Hierarchy</h4>
              <div className="space-y-2">
                {COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.designHierarchy.map((item) => (
                  <div key={item.level} className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-violet-400 font-bold">LEVEL 0{item.level}</span>
                      <span className="text-white font-bold">{item.name}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Folder Structure & Animations */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
                <h4 className="font-bold text-violet-400 uppercase tracking-wider text-[11px]">Feature-Based Component Architecture</h4>
                <div className="space-y-1 font-mono text-[10px]">
                  {COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.folderStructure.map((path, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-zinc-950 text-zinc-300">
                      📁 {path}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-3">
                <h4 className="font-bold text-pink-400 uppercase tracking-wider text-[11px]">Centralized Motion Animations</h4>
                <div className="space-y-1.5">
                  {COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.centralizedAnimations.map((anim, idx) => (
                    <div key={idx} className="p-2 rounded bg-zinc-950 flex items-center justify-between text-[11px]">
                      <span className="text-white font-bold">{anim.name}</span>
                      <span className="text-pink-400 font-mono text-[10px]">{anim.class} ({anim.duration})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1.04: BRAND DESIGN SYSTEM V1.0 (PREMIUM HEALTHCARE VISUAL IDENTITY) */}
        <section className="p-8 rounded-3xl bg-slate-900 border border-amber-500/40 text-white space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200">Phase 11 — Brand Design System v1.0 (Premium Healthcare Visual Identity)</h3>
            </div>
            <span className="text-xs font-mono text-amber-400">80% Visual / 20% Text Philosophy</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Visual Identity Philosophy</div>
            <div className="text-xs text-amber-100 font-semibold italic">"{BRAND_DESIGN_SYSTEM_V1.philosophy}"</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Palette & Mood */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Primary Colors & Canvas</h4>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-amber-50 text-slate-900 font-mono text-[10px]">
                  <strong>Canvas:</strong> Warm Ivory, Soft Cream (#FAF8F5)
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/30 font-mono text-[10px]">
                  <strong>Primary Accent:</strong> Champagne Gold (#D4AF37)
                </div>
                <div className="p-2.5 rounded-lg bg-blue-950 text-blue-100 font-mono text-[10px]">
                  <strong>Secondary Accent:</strong> Deep Corporate Navy (#0B192C)
                </div>
              </div>
            </div>

            {/* Visual Storytelling Mapping */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Visual Storytelling Mappings</h4>
              <div className="space-y-1.5">
                {BRAND_DESIGN_SYSTEM_V1.visualStorytellingIcons.slice(0, 5).map((item, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900 border border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-bold">{item.concept}</span>
                    <span className="text-zinc-300 font-mono text-[10px]">→ {item.visual}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Text Rules & CTAs */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Consultative CTAs & Copy Rules</h4>
              <div className="space-y-1.5">
                <div className="text-[10px] text-zinc-400 font-mono">Hook: {BRAND_DESIGN_SYSTEM_V1.textRules.hook}</div>
                {BRAND_DESIGN_SYSTEM_V1.consultativeCTAs.slice(0, 3).map((cta, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900 text-amber-200 text-[10px] font-bold">
                    ✓ "{cta}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1.05: WEBSITE VISUAL SYSTEM V1.0 (60-30-10 & PATIENT ACQUISITION JOURNEY) */}
        <section className="p-8 rounded-3xl bg-slate-950 border border-amber-500/40 text-white space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200">Phase 12 — Website Visual System v1.0 (The 60-30-10 Rule & Patient Journey)</h3>
            </div>
            <span className="text-xs font-mono text-amber-400">40% Visual / 60% Content Balance</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-400/20 text-center space-y-1">
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Visual Purpose Philosophy</div>
            <div className="text-xs text-amber-100 font-semibold italic">"{WEBSITE_VISUAL_SYSTEM_V1.philosophy}"</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* The 60-30-10 Rule */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">The 60-30-10 Rule Breakdown</h4>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-amber-400 font-bold text-[10px]">60% CLEAN LAYOUT & WHITE SPACE</div>
                  <div className="text-[10px] text-slate-300">{WEBSITE_VISUAL_SYSTEM_V1.rule60_30_10.cleanLayout}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-amber-400 font-bold text-[10px]">30% PREMIUM IMAGERY & GLASSMORPHISM</div>
                  <div className="text-[10px] text-slate-300">{WEBSITE_VISUAL_SYSTEM_V1.rule60_30_10.premiumImagery}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-amber-400 font-bold text-[10px]">10% MOTION & LOOPING VIDEO</div>
                  <div className="text-[10px] text-slate-300">{WEBSITE_VISUAL_SYSTEM_V1.rule60_30_10.motionAndVideo}</div>
                </div>
              </div>
            </div>

            {/* Patient Acquisition Journey Steps */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Patient Acquisition Journey Animation</h4>
              <div className="space-y-1.5">
                {WEBSITE_VISUAL_SYSTEM_V1.patientAcquisitionJourney.map((step) => (
                  <div key={step.step} className="p-2 rounded bg-slate-950 border border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-bold">{step.icon} Step {step.step}: {step.title}</span>
                    <span className="text-amber-400 font-mono text-[10px]">{step.metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1.06: DES-02 MK DIGITALVERSE DESIGN SYSTEM V2.0 */}
        <section className="p-8 rounded-3xl bg-slate-900 border border-amber-500/40 text-white space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200">Phase 13 — DES-02 | MK Digitalverse Design System v2.0</h3>
            </div>
            <span className="text-xs font-mono text-amber-400">Apple × Stripe × Linear × Mayo Clinic × McKinsey</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Core Motto</div>
            <div className="text-xs text-amber-100 font-semibold italic">"{DESIGN_SYSTEM_V2_DES02.coreMotto}"</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Color & Motif */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Warm Ivory & Gold Ribbon</h4>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Backgrounds use Warm Ivory (#FAF8F3). The flowing gold ribbon motif seamlessly guides the eye across sections to symbolize connected healthcare growth systems.
              </p>
            </div>

            {/* Layout Formulas */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">6 Alternating Layout Formulas</h4>
              <div className="space-y-1 text-[10px]">
                {DESIGN_SYSTEM_V2_DES02.sectionFormulas.slice(0, 4).map((f) => (
                  <div key={f.layout} className="p-1.5 rounded bg-slate-900 text-amber-200">
                    <strong>{f.layout}:</strong> {f.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Micro-Animations & Final Principle */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Micro-Animations & Gold Sweep</h4>
              <p className="text-slate-300 text-[10px]">
                Includes gold highlight button sweep, counter animations, and connected system architecture node diagrams.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 1.07: MASTER DESIGN SYSTEM IMPLEMENTATION BLUEPRINT (PHASES 1-7) */}
        <section className="p-8 rounded-3xl bg-slate-950 border border-amber-500/40 text-white space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200">Phase 14 — Master Design System Implementation Blueprint (Phases 1-7)</h3>
            </div>
            <span className="text-xs font-mono text-amber-400">Growth Systems &gt; Marketing Services</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">System Execution Rule</div>
            <div className="text-xs text-amber-100 font-semibold italic">"{MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES.title}"</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES.phases.map((p) => (
              <div key={p.phase} className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-amber-400 font-bold">PHASE 0{p.phase}</span>
                  <span className="text-white font-bold">{p.name}</span>
                </div>
                <p className="text-[11px] text-slate-300">{p.desc}</p>
                <div className="text-[10px] font-mono text-amber-300">Rule: {p.rule}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 1.08: 12 GLOBAL DESIGN SYSTEM MANDATES */}
        <section className="p-8 rounded-3xl bg-slate-900 border border-amber-500/40 text-white space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200">Phase 15 — 12 Global Design System Implementation Mandates</h3>
            </div>
            <span className="text-xs font-mono text-amber-400">100% Website-Wide Enforcement</span>
          </div>

          <p className="text-xs text-slate-300 font-mono italic p-3 rounded-xl bg-slate-950 border border-white/10">
            "{TWELVE_GLOBAL_MANDATES.developerDirective}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {TWELVE_GLOBAL_MANDATES.mandates.map((m) => (
              <div key={m.id} className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                <div className="font-mono text-amber-400 font-bold text-[10px]">MANDATE 0{m.id}</div>
                <div className="font-bold text-white text-[11px]">{m.name}</div>
                <p className="text-[10px] text-slate-400 leading-normal">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="tokens-color" className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <Heading level="h2" className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <span>1. Color Token System</span>
              </Heading>
              <Text variant="bodySmall" muted>
                Strict neutral surface scale paired with domain-specific functional accents.
              </Text>
            </div>
            <span className="text-xs font-mono text-zinc-500">WCAG AA Compliant</span>
          </div>

          {/* Brand Accents */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Brand & Industry Accents</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(DESIGN_TOKENS.colors.brand).map(([key, item]) => (
                <div
                  key={key}
                  onClick={() => handleCopy(item.hex)}
                  className="p-4 rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/30 transition-all cursor-pointer group space-y-2"
                >
                  <div
                    className="h-14 rounded-xl border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-black"
                    style={{ backgroundColor: item.hex }}
                  >
                    {copiedToken === item.hex ? <Check className="w-4 h-4 text-black" /> : null}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white capitalize block">{key}</span>
                    <span className="text-[10px] font-mono text-zinc-400 block">{item.hex}</span>
                    <span className="text-[10px] text-zinc-500 block truncate">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neutral Scale */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Neutral Surface Scale (950 to 50)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-3">
              {Object.entries(DESIGN_TOKENS.colors.neutral).map(([step, item]) => (
                <div
                  key={step}
                  onClick={() => handleCopy(item.hex)}
                  className="p-3 rounded-xl bg-zinc-950 border border-white/10 hover:border-white/30 transition-all cursor-pointer space-y-1.5"
                >
                  <div
                    className="h-10 rounded-lg border border-white/10"
                    style={{ backgroundColor: item.hex }}
                  />
                  <div className="text-center">
                    <span className="text-xs font-mono font-bold text-white block">{step}</span>
                    <span className="text-[9px] font-mono text-zinc-500 block">{item.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Semantic Feedback Tokens</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(DESIGN_TOKENS.colors.semantic).map(([semKey, item]) => (
                <div key={semKey} className={`p-4 rounded-xl ${item.bg} border ${item.border} space-y-1`}>
                  <span className={`text-xs font-bold capitalize ${item.text} block`}>{semKey} Token</span>
                  <span className="text-[11px] font-mono text-zinc-300 block">{item.hex}</span>
                  <span className="text-[10px] text-zinc-400 block">Applied in alert badges, validation text, and state metrics.</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: TYPOGRAPHY SYSTEM */}
        <section id="tokens-typography" className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <Heading level="h2" className="flex items-center gap-2">
                <Type className="w-5 h-5 text-amber-400" />
                <span>2. Typography Scale System</span>
              </Heading>
              <Text variant="bodySmall" muted>
                Primary Body: Plus Jakarta Sans • Display Headings: Outfit • Monospace Metadata: SFMono.
              </Text>
            </div>
          </div>

          <div className="space-y-6 bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-white/10">
            {Object.entries(DESIGN_TOKENS.typography.scale).map(([typeKey, item]) => (
              <div key={typeKey} className="pb-6 border-b border-white/5 last:border-0 last:pb-0 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                  <span className="font-bold uppercase">{typeKey}</span>
                  <span className="text-zinc-500">{item.description}</span>
                </div>
                <div className={item.fontSize}>
                  MK Digitalverse Revenue Growth System
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  Class: <code className="text-zinc-300">{item.fontSize}</code> • Line Height: <code className="text-zinc-300">{item.lineHeight}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: BUTTON SYSTEM */}
        <section id="tokens-buttons" className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <Heading level="h2" className="flex items-center gap-2">
                <Box className="w-5 h-5 text-amber-400" />
                <span>3. Button Matrix & Action Controls</span>
              </Heading>
              <Text variant="bodySmall" muted>
                Unified button primitive with 6 variants, 4 sizes, icon alignment, and loading states.
              </Text>
            </div>
            <Button size="sm" variant="ghost" onClick={toggleLoading}>
              Simulate Loading
            </Button>
          </div>

          {/* Variants Showcase */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Button Variants</h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" isLoading={buttonLoading} rightIcon={<Sparkles className="w-4 h-4" />}>
                Primary Amber
              </Button>
              <Button variant="secondary" isLoading={buttonLoading} rightIcon={<HeartPulse className="w-4 h-4" />}>
                Secondary Emerald
              </Button>
              <Button variant="outline" isLoading={buttonLoading}>
                Outline Glass
              </Button>
              <Button variant="ghost" isLoading={buttonLoading}>
                Ghost Neutral
              </Button>
              <Button variant="danger" isLoading={buttonLoading}>
                Danger State
              </Button>
              <Button variant="text" isLoading={buttonLoading}>
                Text Link Action
              </Button>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pt-4 border-t border-white/5">
              Size Hierarchy (sm → xl)
            </h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary">Small (36px)</Button>
              <Button size="md" variant="primary">Medium (44px)</Button>
              <Button size="lg" variant="primary">Large (48px)</Button>
              <Button size="xl" variant="primary">Extra Large (52px)</Button>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pt-4 border-t border-white/5">
              Disabled States
            </h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" disabled>Primary Disabled</Button>
              <Button variant="outline" disabled>Outline Disabled</Button>
            </div>
          </div>
        </section>

        {/* SECTION 4: FORM CONTROLS */}
        <section id="tokens-forms" className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <Heading level="h2" className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>4. Form Controls & Validation States</span>
              </Heading>
              <Text variant="bodySmall" muted>
                Consistent inputs, textareas, selects, and checkboxes with error and success feedback.
              </Text>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <Input
                label="Standard Input"
                placeholder="e.g. Healthcare Growth Audit"
                helperText="Enter your target practice name"
              />

              <Input
                label="Input with Left Icon"
                leftIcon={<Mail className="w-4 h-4" />}
                placeholder="doctor@clinic.com"
                helperText="We send diagnostic reports to this email"
              />

              <Input
                label="Validation Error State"
                value="invalid-email-address"
                readOnly
                errorMessage="Please enter a valid medical practice email address"
              />

              <Input
                label="Validation Success State"
                value="dr.sharma@apollo.com"
                readOnly
                successMessage="Domain verified. Ready for Growth Audit™ generation."
              />
            </div>

            <div className="space-y-5">
              <Select
                label="Select Dropdown"
                options={[
                  { value: 'healthcare', label: 'Hospitals & Healthcare Organizations' }
                ]}
                helperText="Choose your operational industry sector"
              />

              <Textarea
                label="Textarea Area"
                rows={3}
                placeholder="Describe your current patient intake or growth bottlenecks..."
                helperText="Provide context for our strategic analysis"
              />

              <div className="space-y-3 pt-2">
                <Checkbox
                  label="Accept Diagnostic Data Sharing"
                  description="Allow MK Digitalverse to process baseline metrics confidentially."
                  defaultChecked
                />
                <Checkbox
                  label="Receive Monthly Healthcare Growth Index™ Briefing"
                  description="Executive summary delivered on the 1st of every month."
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: BADGES & CHIPS */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Heading level="h2">5. Badges & Status Indicators</Heading>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Healthcare Practice
              </Badge>
              <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Clinical Practice
              </Badge>
              <Badge variant="cyan" icon={<BarChart3 className="w-3.5 h-3.5" />}>
                AI System Active
              </Badge>
              <Badge variant="purple" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Growth Partner
              </Badge>
              <Badge variant="neutral">
                Standard Tag
              </Badge>
              <Badge variant="outline">
                Outline Pill
              </Badge>
            </div>
          </div>
        </section>

        {/* SECTION 6: CARDS & ELEVATION */}
        <section id="tokens-cards" className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <Heading level="h2" className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-amber-400" />
                <span>6. Card Surface Variants & Elevation</span>
              </Heading>
              <Text variant="bodySmall" muted>
                Shared corner radii, border treatment, and glassmorphic surface backdrop filters.
              </Text>
            </div>
          </div>

          <GridContainer cols={3}>
            <Card variant="glass">
              <Badge variant="amber" className="mb-3">Glass Surface</Badge>
              <Heading level="h3" className="mb-2">Glass Panel Card</Heading>
              <Text variant="bodySmall" muted>
                Uses backdrop blur filter with 1px border. Default container for feature modules and calculators.
              </Text>
            </Card>

            <Card variant="interactive" hoverEffect>
              <Badge variant="emerald" className="mb-3">Interactive Hover</Badge>
              <Heading level="h3" className="mb-2">Hover Lift Card</Heading>
              <Text variant="bodySmall" muted>
                Translates Y -2px on hover with gold glow border. Used for clickable industry or service cards.
              </Text>
            </Card>

            <Card variant="metric">
              <Badge variant="cyan" className="mb-3">Metric Card</Badge>
              <Heading level="h3" className="mb-2">Gradient Metric Base</Heading>
              <Text variant="bodySmall" muted>
                High-contrast vertical gradient for displaying numbers, HGI™ metrics, and case study outcomes.
              </Text>
            </Card>
          </GridContainer>
        </section>

        {/* SECTION 7: INTERACTIVE COMPONENTS */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <Heading level="h2" className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>7. Interactive Modules (Accordions, Tabs, Timelines)</span>
              </Heading>
              <Text variant="bodySmall" muted>
                Complex UI primitives used in FAQ, ROI calculator, and Implementation Playbooks.
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Tabs & Stat Card Demo */}
            <div className="space-y-6 p-6 rounded-2xl bg-zinc-950 border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Tab Switcher Component</h4>
              <TabGroup
                tabs={[
                  { id: 'healthcare', label: 'Healthcare', icon: <HeartPulse className="w-3.5 h-3.5" /> },
                  { id: 'specialties', label: 'Specialty Clinics', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                  { id: 'systems', label: 'AI Systems', icon: <Zap className="w-3.5 h-3.5" /> }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />

              <div className="pt-2">
                <StatCard
                  value="₹2.4 Cr"
                  label="Annual Revenue Lift"
                  sublabel="Average uncaptured patient opportunity identified per audit"
                  trend="+165% Intake Efficiency"
                  icon={<BarChart3 className="w-5 h-5" />}
                />
              </div>
            </div>

            {/* Accordion Demo */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Accordion Primitive Demo</h4>
              <AccordionItem title="What is a Digital Growth Partner?" defaultOpen badge="Core FAQ">
                A Digital Growth Partner takes complete end-to-end accountability for revenue expansion—building custom web infrastructure, deploying AI pre-qualification engines, and optimizing intake pipelines.
              </AccordionItem>

              <AccordionItem title="How does the Healthcare Growth Audit™ work?">
                The audit evaluates patient intake drop-off, search authority, and doctor profiling to generate an actionable expansion blueprint.
              </AccordionItem>
            </div>

          </div>

          {/* Timeline Steps Demo */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/10 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Implementation Playbook™ Timeline</h4>
            <div className="space-y-2">
              <TimelineStep
                stepNumber="01"
                title="Phase 1: Diagnostic Intake Audit (Days 1–5)"
                description="Comprehensive triage of existing inquiry sources, doctor profiling, and CRM routing to map leakage."
              />
              <TimelineStep
                stepNumber="02"
                title="Phase 2: Growth Infrastructure Deployment (Days 6–15)"
                description="Engineering custom web platform, 24/7 AI intake concierge, and high-converting patient triage funnels."
              />
              <TimelineStep
                stepNumber="03"
                title="Phase 3: Launch & Demand Scaling (Days 16–21)"
                description="Activating Search Engine Dominance campaigns and real-time executive HGI™ reporting dashboard."
                isLast
              />
            </div>
          </div>
        </section>

        {/* SECTION 8: SPACING & GRID */}
        <section id="tokens-grid" className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Heading level="h2">8. 8px Spatial Grid & Border Radii</Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">8px Spacing Scale</h4>
              <div className="space-y-2 font-mono text-xs">
                {DESIGN_TOKENS.spacing.map((sp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-white/5">
                    <span className="text-zinc-300">{sp.label}</span>
                    <div className="h-3 bg-amber-400 rounded-sm" style={{ width: sp.value }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Border Radius Language</h4>
              <div className="space-y-3 font-mono text-xs">
                {DESIGN_TOKENS.radii.map((rad, idx) => (
                  <div key={idx} className={`p-4 bg-zinc-900 border border-white/15 ${rad.class} flex items-center justify-between`}>
                    <span className="text-white font-bold">{rad.name} ({rad.value})</span>
                    <span className="text-zinc-500 text-[10px]">{rad.class}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Triggered Preview Modal */}
      <ModalDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Design System Modal Dialog Primitive"
        subtitle="Accessible dialog component with backdrop blur and focus trap."
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed">
            This modal primitive inherits design tokens for typography, padding (24px), border radii (24px), and glassmorphism styling.
          </p>
          <Input label="Test Input Inside Modal" placeholder="Enter test data..." />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Close</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm Action</Button>
          </div>
        </div>
      </ModalDialog>

    </div>
  );
};
