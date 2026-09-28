-- ==============================================================================
-- MK DIGITALVERSE - ADM-06 CONTRACTS & MILESTONES MANAGEMENT SCHEMA
-- ==============================================================================
-- Provisions the commercial agreement and project delivery milestone tables:
-- 1. public.contracts            (Commercial Contracts & Agreements)
-- 2. public.contract_milestones   (Delivery & Commercial Milestones)
-- 3. public.contract_activities   (Audit Trail & Status Transition History)
-- 4. public.client_portal_access  (Secure Client Portal Authentication Foundation)
-- 5. Safe extension: invoices.contract_id (Nullable, Backwards-Compatible)
-- ==============================================================================

-- ==============================================================================
-- 1. CONTRACTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  contract_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  contract_type TEXT NOT NULL CHECK (contract_type IN (
    'retainer',
    'project',
    'milestone_project',
    'one_time',
    'subscription',
    'custom'
  )),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',
    'pending_signature',
    'active',
    'paused',
    'completed',
    'terminated',
    'expired',
    'cancelled'
  )),
  description TEXT,
  start_date DATE,
  end_date DATE,
  currency_code TEXT NOT NULL DEFAULT 'INR',
  contract_value NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (contract_value >= 0),
  billing_frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_frequency IN (
    'one_time',
    'monthly',
    'quarterly',
    'half_yearly',
    'annual',
    'milestone',
    'custom'
  )),
  payment_terms_days INTEGER NOT NULL DEFAULT 15 CHECK (payment_terms_days >= 0),
  auto_renew BOOLEAN NOT NULL DEFAULT false,
  renewal_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON public.contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_lead_id ON public.contracts(lead_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_type ON public.contracts(contract_type);
CREATE INDEX IF NOT EXISTS idx_contracts_currency ON public.contracts(currency_code);

DROP TRIGGER IF EXISTS set_contracts_updated_at ON public.contracts;
CREATE TRIGGER set_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 2. CONTRACT MILESTONES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contract_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sequence_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN (
    'not_started',
    'in_progress',
    'blocked',
    'completed',
    'cancelled'
  )),
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  completion_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  milestone_value NUMERIC(14, 2) DEFAULT 0.00 CHECK (milestone_value >= 0),
  currency_code TEXT,
  billing_type TEXT DEFAULT 'standard',
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_milestones_contract_id ON public.contract_milestones(contract_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON public.contract_milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_due_date ON public.contract_milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_milestones_invoice_id ON public.contract_milestones(invoice_id);

DROP TRIGGER IF EXISTS set_milestones_updated_at ON public.contract_milestones;
CREATE TRIGGER set_milestones_updated_at
  BEFORE UPDATE ON public.contract_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 3. CONTRACT ACTIVITIES (AUDIT TRAIL)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contract_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  actor TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contract_activities_contract_id ON public.contract_activities(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_activities_created_at ON public.contract_activities(created_at);

-- ==============================================================================
-- 4. CLIENT PORTAL ACCESS FOUNDATION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.client_portal_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  portal_token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_portal_access_client_id ON public.client_portal_access(client_id);
CREATE INDEX IF NOT EXISTS idx_portal_access_token ON public.client_portal_access(portal_token);

-- ==============================================================================
-- 5. SAFE EXTENSION: INVOICES.CONTRACT_ID (BACKWARDS COMPATIBLE)
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'contract_id'
  ) THEN
    ALTER TABLE public.invoices 
    ADD COLUMN contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_invoices_contract_id ON public.invoices(contract_id);
  END IF;
END $$;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_portal_access ENABLE ROW LEVEL SECURITY;

-- 6A. Contracts Admin Policy
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contracts' AND policyname = 'Admins manage contracts') THEN
    CREATE POLICY "Admins manage contracts" ON public.contracts
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      );
  END IF;
END $$;

-- 6B. Milestones Admin Policy
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contract_milestones' AND policyname = 'Admins manage contract milestones') THEN
    CREATE POLICY "Admins manage contract milestones" ON public.contract_milestones
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      );
  END IF;
END $$;

-- 6C. Contract Activities Admin Policy
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contract_activities' AND policyname = 'Admins manage contract activities') THEN
    CREATE POLICY "Admins manage contract activities" ON public.contract_activities
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      );
  END IF;
END $$;

-- 6D. Client Portal Access Admin Policy
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'client_portal_access' AND policyname = 'Admins manage portal access') THEN
    CREATE POLICY "Admins manage portal access" ON public.client_portal_access
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      );
  END IF;
END $$;
