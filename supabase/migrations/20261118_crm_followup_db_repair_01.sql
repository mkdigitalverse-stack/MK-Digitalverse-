-- ==============================================================================
-- MK DIGITALVERSE — CRM FOLLOW-UP SCHEDULING DATABASE REPAIR
-- Task ID: CRM-FOLLOWUP-DB-REPAIR-01
-- ==============================================================================
-- Forward-only, idempotent production schema reconciliation for public.leads.
--
-- Authoritative schema reference:
--   supabase/migrations/20261002_adm10_leads_fields.sql
--
-- Purpose:
--   Adds the missing ADM-10 follow-up scheduling and pipeline columns to
--   public.leads and refreshes the PostgREST schema cache so follow-up
--   scheduling, rescheduling, cancellation (SQL NULL), and last-contacted
--   tracking persist cleanly.
--
-- Safety guarantees:
--   - Does NOT drop or recreate public.leads
--   - Does NOT delete or mutate existing lead rows or UUID primary keys
--   - Does NOT modify existing columns (id, status, assigned_to, lead_priority,
--     internal_notes, etc.)
--   - Does NOT alter RLS policies or submit_public_lead() RPC
--   - Safe to execute against fresh, partial, or already-reconciled databases
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

-- Non-destructive supporting indexes for follow-up queue ordering and stage filters
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up_at ON public.leads (next_follow_up_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);

-- Refresh PostgREST schema cache immediately after DDL changes
NOTIFY pgrst, 'reload schema';

-- ==============================================================================
-- POST-EXECUTION VERIFICATION QUERIES (run separately in Supabase SQL Editor):
--
-- 1. Confirm all follow-up & ADM-10 columns exist with expected types:
--
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name = 'leads'
--   AND column_name IN (
--     'next_follow_up_at',
--     'next_follow_up_remark',
--     'next_follow_up_note',
--     'last_contacted_at',
--     'next_action',
--     'estimated_opportunity_value',
--     'currency',
--     'stage_entered_at',
--     'stage_changed_at'
--   )
-- ORDER BY column_name;
--
-- 2. Confirm existing lead count is preserved:
-- SELECT COUNT(*) AS total_leads FROM public.leads;
-- ==============================================================================
