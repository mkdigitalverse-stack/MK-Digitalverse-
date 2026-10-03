-- ==============================================================================
-- MK DIGITALVERSE — ADM-10 PRODUCTION SCHEMA RECONCILIATION
-- ==============================================================================
-- Authoritative source: supabase/migrations/20261002_adm10_leads_fields.sql
-- Adds only the genuinely missing ADM-10 columns to public.leads.
--
-- Preserves all existing columns, rows, values, UUID generation,
-- and RLS policies. Safe for production execution.
-- ==============================================================================

ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_follow_up_remark text,
  ADD COLUMN IF NOT EXISTS next_follow_up_note text,
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_action text,
  ADD COLUMN IF NOT EXISTS estimated_opportunity_value numeric,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS stage_entered_at timestamptz,
  ADD COLUMN IF NOT EXISTS stage_changed_at timestamptz;

-- Indices for high-performance follow-up queue sorting and status filtering
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up_at ON public.leads (next_follow_up_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);

-- Immediately notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
