-- Ajouter la colonne visible_affiliate à la table casinos
ALTER TABLE public.casinos ADD COLUMN IF NOT EXISTS visible_affiliate boolean DEFAULT true;
