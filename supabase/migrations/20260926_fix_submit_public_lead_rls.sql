-- ==============================================================================
-- MK DIGITALVERSE - PUBLIC LEAD SUBMISSION SECURITY DEFINER RPC & RLS CONFIGURATION
-- ==============================================================================
-- This migration ensures that public web visitors (role: anon) can safely submit
-- marketing leads through the secure ingestion gateway RPC 'submit_public_lead()'
-- without granting direct, unrestricted INSERT access to the public.leads table.
-- ==============================================================================

-- 1. Ensure public.leads table has Row Level Security ENABLED
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 2. Verify Admin Access Policies on public.leads
-- Authenticated admins can view, update, and manage leads based on profile role.
DO $$
BEGIN
  -- Recreate admin select policy if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' AND policyname = 'Admins can view all leads'
  ) THEN
    CREATE POLICY "Admins can view all leads" ON public.leads
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.active = true
        )
      );
  END IF;

  -- Recreate admin update policy if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' AND policyname = 'Admins can update leads'
  ) THEN
    CREATE POLICY "Admins can update leads" ON public.leads
      FOR UPDATE
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

  -- Recreate admin insert policy if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' AND policyname = 'Admins can insert leads'
  ) THEN
    CREATE POLICY "Admins can insert leads" ON public.leads
      FOR INSERT
      TO authenticated
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

-- 3. Provide the Primary Ingestion RPC: submit_public_lead(p_name text, ...)
-- SECURITY DEFINER allows execution as function owner (postgres/supabase_admin),
-- securely bypassing table-level RLS on public.leads while strictly validating input.
CREATE OR REPLACE FUNCTION public.submit_public_lead(
  p_name text,
  p_contact_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_organization_name text DEFAULT NULL,
  p_website text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_healthcare_category text DEFAULT NULL,
  p_biggest_challenge text DEFAULT NULL,
  p_growth_objective text DEFAULT NULL,
  p_investment_readiness text DEFAULT NULL,
  p_lead_type text DEFAULT 'contact_enquiry',
  p_utm_source text DEFAULT NULL,
  p_utm_medium text DEFAULT NULL,
  p_utm_campaign text DEFAULT NULL,
  p_utm_content text DEFAULT NULL,
  p_utm_term text DEFAULT NULL,
  p_gclid text DEFAULT NULL,
  p_fbclid text DEFAULT NULL,
  p_landing_page text DEFAULT NULL,
  p_referrer text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lead_id uuid;
  v_effective_name text;
  v_sanitized_email text;
BEGIN
  -- Strict sanitization & validation
  v_effective_name := COALESCE(NULLIF(TRIM(p_contact_name), ''), NULLIF(TRIM(p_name), ''));
  IF v_effective_name IS NULL THEN
    RAISE EXCEPTION 'Contact name is required.';
  END IF;

  v_sanitized_email := LOWER(TRIM(COALESCE(p_email, '')));
  IF v_sanitized_email = '' OR POSITION('@' IN v_sanitized_email) = 0 THEN
    RAISE EXCEPTION 'A valid email address is required.';
  END IF;

  -- Safe insertion into public.leads with fixed initial CRM stage & probability
  INSERT INTO public.leads (
    name,
    contact_name,
    email,
    phone,
    organization_name,
    website,
    location,
    healthcare_category,
    biggest_challenge,
    growth_objective,
    investment_readiness,
    lead_type,
    status,
    opportunity_stage,
    stage_probability,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    gclid,
    fbclid,
    landing_page,
    referrer,
    created_at,
    updated_at
  ) VALUES (
    v_effective_name,
    v_effective_name,
    v_sanitized_email,
    COALESCE(TRIM(p_phone), ''),
    COALESCE(TRIM(p_organization_name), ''),
    COALESCE(TRIM(p_website), ''),
    COALESCE(TRIM(p_location), ''),
    COALESCE(TRIM(p_healthcare_category), ''),
    COALESCE(TRIM(p_biggest_challenge), ''),
    COALESCE(TRIM(p_growth_objective), ''),
    COALESCE(TRIM(p_investment_readiness), ''),
    COALESCE(TRIM(p_lead_type), 'contact_enquiry'),
    'new',
    'new',
    0.05,
    COALESCE(p_utm_source, ''),
    COALESCE(p_utm_medium, ''),
    COALESCE(p_utm_campaign, ''),
    COALESCE(p_utm_content, ''),
    COALESCE(p_utm_term, ''),
    COALESCE(p_gclid, ''),
    COALESCE(p_fbclid, ''),
    COALESCE(p_landing_page, ''),
    COALESCE(p_referrer, ''),
    NOW(),
    NOW()
  )
  RETURNING id INTO v_lead_id;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_lead_id
  );
END;
$$;

-- 4. Overload RPC: submit_public_lead(lead_data jsonb)
-- Enables flexible client invocation with a single structured JSONB payload
CREATE OR REPLACE FUNCTION public.submit_public_lead(lead_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lead_id uuid;
  v_effective_name text;
  v_sanitized_email text;
BEGIN
  v_effective_name := COALESCE(
    NULLIF(TRIM(lead_data->>'contact_name'), ''),
    NULLIF(TRIM(lead_data->>'name'), '')
  );
  IF v_effective_name IS NULL THEN
    RAISE EXCEPTION 'Contact name is required.';
  END IF;

  v_sanitized_email := LOWER(TRIM(COALESCE(lead_data->>'email', '')));
  IF v_sanitized_email = '' OR POSITION('@' IN v_sanitized_email) = 0 THEN
    RAISE EXCEPTION 'A valid email address is required.';
  END IF;

  INSERT INTO public.leads (
    name,
    contact_name,
    email,
    phone,
    organization_name,
    website,
    location,
    healthcare_category,
    biggest_challenge,
    growth_objective,
    investment_readiness,
    lead_type,
    status,
    opportunity_stage,
    stage_probability,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    gclid,
    fbclid,
    landing_page,
    referrer,
    created_at,
    updated_at
  ) VALUES (
    v_effective_name,
    v_effective_name,
    v_sanitized_email,
    COALESCE(TRIM(lead_data->>'phone'), ''),
    COALESCE(TRIM(lead_data->>'organization_name'), ''),
    COALESCE(TRIM(lead_data->>'website'), ''),
    COALESCE(TRIM(lead_data->>'location'), ''),
    COALESCE(TRIM(lead_data->>'healthcare_category'), ''),
    COALESCE(TRIM(lead_data->>'biggest_challenge'), ''),
    COALESCE(TRIM(lead_data->>'growth_objective'), ''),
    COALESCE(TRIM(lead_data->>'investment_readiness'), ''),
    COALESCE(TRIM(lead_data->>'lead_type'), 'contact_enquiry'),
    'new',
    'new',
    0.05,
    COALESCE(lead_data->>'utm_source', ''),
    COALESCE(lead_data->>'utm_medium', ''),
    COALESCE(lead_data->>'utm_campaign', ''),
    COALESCE(lead_data->>'utm_content', ''),
    COALESCE(lead_data->>'utm_term', ''),
    COALESCE(lead_data->>'gclid', ''),
    COALESCE(lead_data->>'fbclid', ''),
    COALESCE(lead_data->>'landing_page', ''),
    COALESCE(lead_data->>'referrer', ''),
    NOW(),
    NOW()
  )
  RETURNING id INTO v_lead_id;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_lead_id
  );
END;
$$;

-- 5. Set function execution privileges:
-- Grant execution strictly to anon and authenticated roles.
REVOKE ALL ON FUNCTION public.submit_public_lead(text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_lead(text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.submit_public_lead(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_lead(jsonb) TO anon, authenticated;
