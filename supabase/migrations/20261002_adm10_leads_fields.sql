-- ==============================================================================
-- MK DIGITALVERSE — ADM-10 LEADS SCHEMA EXTENSION & FOLLOW-UP PERSISTENCE
-- ==============================================================================
-- Adds canonical columns for manual lead management, follow-up scheduling,
-- and qualification attribution to public.leads.
-- ==============================================================================

ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_follow_up_remark text,
  ADD COLUMN IF NOT EXISTS next_follow_up_note text,
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_action text,
  ADD COLUMN IF NOT EXISTS estimated_opportunity_value numeric,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS assigned_to text,
  ADD COLUMN IF NOT EXISTS lead_priority text DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS stage_entered_at timestamptz,
  ADD COLUMN IF NOT EXISTS stage_changed_at timestamptz;

-- Index for follow-up date querying and queue ordering
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up_at ON public.leads (next_follow_up_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
