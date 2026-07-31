-- Migration: Add secure function to resolve affiliate ID from referral code
CREATE OR REPLACE FUNCTION public.get_affiliate_id_by_ref(p_ref text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id
  FROM public.affiliates
  WHERE referral_code = p_ref OR referral_code = 'FR-' || p_ref
  LIMIT 1;
  
  RETURN v_id;
END;
$$;
