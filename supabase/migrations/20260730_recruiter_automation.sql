-- Migration: Recruiter Automation & Stats Access

-- 1. Create recruiter_commissions table
CREATE TABLE IF NOT EXISTS public.recruiter_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE CASCADE,
  commission_id uuid REFERENCES public.commissions(id) ON DELETE CASCADE,
  montant numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS for recruiter_commissions
ALTER TABLE public.recruiter_commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Recruiters can view own recruiter commissions" ON public.recruiter_commissions;
CREATE POLICY "Recruiters can view own recruiter commissions" ON public.recruiter_commissions
  FOR SELECT USING (auth.uid() = recruiter_id OR public.is_admin());

-- 2. Add RLS policies on casino_clicks and commissions for team statistics access
DROP POLICY IF EXISTS "Recruiters can view clicks of their team" ON public.casino_clicks;
CREATE POLICY "Recruiters can view clicks of their team" ON public.casino_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = casino_clicks.affiliate_id AND a.recruiter_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Recruiters can view commissions of their team" ON public.commissions;
CREATE POLICY "Recruiters can view commissions of their team" ON public.commissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = commissions.affiliate_id AND a.recruiter_id = auth.uid()
    )
  );

-- 3. Update the handle_new_user trigger to include recruiters in the affiliates table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_referral_code text;
  v_recruiter_id uuid;
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Affilié FrenchCasino'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'affiliate')
  );

  -- Create affiliate record for both affiliates and recruiters
  IF coalesce(new.raw_user_meta_data->>'role', 'affiliate') IN ('affiliate', 'recruiter') THEN
    new_referral_code := 'FR-' || upper(substr(md5(random()::text), 1, 6));
    
    -- Parse recruiter_id safely if it's a valid uuid
    BEGIN
      v_recruiter_id := (new.raw_user_meta_data->>'recruiter_id')::uuid;
    EXCEPTION WHEN others THEN
      v_recruiter_id := null;
    END;
    
    INSERT INTO public.affiliates (
      id, 
      referral_code, 
      status, 
      contact_telegram, 
      contact_whatsapp, 
      contact_phone,
      recruiter_id
    )
    VALUES (
      new.id,
      new_referral_code,
      'pending',
      new.raw_user_meta_data->>'contact_telegram',
      new.raw_user_meta_data->>'contact_whatsapp',
      new.raw_user_meta_data->>'contact_phone',
      v_recruiter_id
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Backfill existing recruiters into affiliates table if they don't have a record
INSERT INTO public.affiliates (id, referral_code, status)
SELECT p.id, 'FR-REC-' || upper(substr(md5(random()::text), 1, 6)), 'active'
FROM public.profiles p
LEFT JOIN public.affiliates a ON a.id = p.id
WHERE p.role = 'recruiter' AND a.id IS NULL;
