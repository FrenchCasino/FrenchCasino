-- Migration: Leaderboard RPC function
CREATE OR REPLACE FUNCTION get_top_affiliates_leaderboard()
RETURNS TABLE (
  rank integer,
  ref_code text,
  total_earned numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (row_number() OVER (ORDER BY a.total_earned DESC))::integer as rank,
    CASE 
      WHEN length(a.referral_code) > 4 THEN substring(a.referral_code from 1 for length(a.referral_code)-3) || '***'
      ELSE 'Affilié_' || substring(a.id::text from 1 for 4)
    END as ref_code,
    a.total_earned
  FROM affiliates a
  WHERE a.status = 'active' AND a.total_earned > 0
  ORDER BY a.total_earned DESC
  LIMIT 5;
END;
$$;
