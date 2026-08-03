-- Ajout de la colonne allowed_countries à la table casinos
ALTER TABLE public.casinos
ADD COLUMN IF NOT EXISTS allowed_countries TEXT[] DEFAULT '{}';
