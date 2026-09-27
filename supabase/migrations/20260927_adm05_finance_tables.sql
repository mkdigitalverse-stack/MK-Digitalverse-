-- ==============================================================================
-- MK DIGITALVERSE - ADM-05B FINANCE & BUSINESS MONEY MANAGEMENT SCHEMA
-- ==============================================================================
-- This migration provisions the production database tables, constraints, indexes,
-- and strict Row Level Security (RLS) policies for:
-- 1. public.clients     (Commercial Client Directory & Healthcare Accounts)
-- 2. public.invoices    (Commercial Receivables & Billing Records)
-- 3. public.payments    (Realized Cash Income & Transaction Ledgers with PayPal support)
-- 4. public.expenses    (Business Costs, Operational Outflows, & Vendor Expenses)
-- ==============================================================================

-- 0. Generic updated_at trigger function if not already present
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. CLIENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  healthcare_category TEXT,
  billing_address TEXT,
  tax_identifier TEXT, -- GSTIN / Tax ID / VAT
  currency_code TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'churned')),
  contract_start_date DATE,
  contract_end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_clients_lead_id ON public.clients(lead_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_currency ON public.clients(currency_code);

DROP TRIGGER IF EXISTS set_clients_updated_at ON public.clients;
CREATE TRIGGER set_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 2. INVOICES TABLE (EXPECTED MONEY / RECEIVABLES)
-- ==============================================================================
-- CRITICAL: amount_paid is intentionally NOT stored as an independently editable
-- field here. It is computed from valid payments linked to this invoice.
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  amount_subtotal NUMERIC(14, 2) NOT NULL CHECK (amount_subtotal >= 0),
  tax_rate NUMERIC(5, 2) DEFAULT 0.00 CHECK (tax_rate >= 0),
  tax_amount NUMERIC(14, 2) DEFAULT 0.00 CHECK (tax_amount >= 0),
  amount_total NUMERIC(14, 2) NOT NULL CHECK (amount_total >= 0),
  currency_code TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON public.invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_currency ON public.invoices(currency_code);

DROP TRIGGER IF EXISTS set_invoices_updated_at ON public.invoices;
CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 3. PAYMENTS TABLE (REALIZED CASH INCOME & SETTLEMENTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  fee_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (fee_amount >= 0),
  currency_code TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL CHECK (payment_method IN (
    'paypal',
    'bank_transfer',
    'wire',
    'upi',
    'razorpay',
    'credit_card',
    'check',
    'cash',
    'other'
  )),
  reference_number TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'refunded', 'reversed')),
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON public.payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON public.payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_method ON public.payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_currency ON public.payments(currency_code);

-- ==============================================================================
-- 4. EXPENSES TABLE (BUSINESS OUTFLOWS & VENDOR COSTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'advertising',
    'software_tools',
    'contractors',
    'payroll',
    'operations',
    'equipment',
    'travel',
    'professional_services',
    'payment_fees',
    'other'
  )),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency_code TEXT NOT NULL DEFAULT 'INR',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor TEXT,
  payment_method TEXT CHECK (payment_method IN (
    'paypal',
    'credit_card',
    'bank_transfer',
    'wire',
    'upi',
    'cash',
    'other'
  )),
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_period TEXT CHECK (recurring_period IN ('monthly', 'quarterly', 'yearly')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_currency ON public.expenses(currency_code);

DROP TRIGGER IF EXISTS set_expenses_updated_at ON public.expenses;
CREATE TRIGGER set_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS across all financial tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 5A. Clients Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Admins manage clients') THEN
    CREATE POLICY "Admins manage clients" ON public.clients
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

-- 5B. Invoices Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Admins manage invoices') THEN
    CREATE POLICY "Admins manage invoices" ON public.invoices
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

-- 5C. Payments Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Admins manage payments') THEN
    CREATE POLICY "Admins manage payments" ON public.payments
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

-- 5D. Expenses Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'expenses' AND policyname = 'Admins manage expenses') THEN
    CREATE POLICY "Admins manage expenses" ON public.expenses
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
