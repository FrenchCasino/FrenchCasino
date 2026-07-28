-- Migration: Security Fixes pour combler les failles RLS critiques

-- 1. Sécurité des profils (empêcher un utilisateur de s'octroyer le rôle admin)
CREATE OR REPLACE FUNCTION public.check_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Si l'utilisateur n'est pas admin, on bloque la modification du champ 'role'
  IF NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Sécurité: Vous ne pouvez pas modifier votre propre rôle.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_profile_security ON public.profiles;
CREATE TRIGGER enforce_profile_security
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.check_profile_update();


-- 2. Sécurité des affiliés (empêcher la modification de son propre statut et de ses gains)
CREATE OR REPLACE FUNCTION public.check_affiliate_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Si l'utilisateur n'est pas admin, on bloque la modification des champs sensibles
  IF NOT public.is_admin() THEN
    IF NEW.status IS DISTINCT FROM OLD.status OR
       NEW.commission_rate IS DISTINCT FROM OLD.commission_rate OR
       NEW.total_earned IS DISTINCT FROM OLD.total_earned OR
       NEW.parent_affiliate_id IS DISTINCT FROM OLD.parent_affiliate_id
    THEN
      RAISE EXCEPTION 'Sécurité: Vous ne pouvez pas modifier vos paramètres financiers ou votre statut.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_affiliate_security ON public.affiliates;
CREATE TRIGGER enforce_affiliate_security
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW
  EXECUTE PROCEDURE public.check_affiliate_update();


-- 3. Sécurité des requêtes de paiement (forcer le statut 'pending' lors de la création par un affilié)
CREATE OR REPLACE FUNCTION public.check_payout_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Un affilié ne peut pas créer une demande déjà approuvée ou payée
  IF NOT public.is_admin() THEN
    NEW.statut := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_payout_security ON public.payout_requests;
CREATE TRIGGER enforce_payout_security
  BEFORE INSERT ON public.payout_requests
  FOR EACH ROW
  EXECUTE PROCEDURE public.check_payout_insert();


-- 4. Correction du bug Admin: Autoriser l'insertion et modification des commissions
DROP POLICY IF EXISTS "Commissions admin insert" ON public.commissions;
CREATE POLICY "Commissions admin insert" ON public.commissions
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Commissions admin update" ON public.commissions;
CREATE POLICY "Commissions admin update" ON public.commissions
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Commissions admin delete" ON public.commissions;
CREATE POLICY "Commissions admin delete" ON public.commissions
  FOR DELETE USING (public.is_admin());
