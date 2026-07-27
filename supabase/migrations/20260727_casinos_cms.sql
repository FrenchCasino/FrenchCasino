-- Ajouter les colonnes manquantes pour le CMS Casinos
alter table public.casinos
  add column if not exists frais_retrait text,
  add column if not exists delai_retrait text,
  add column if not exists wager text,
  add column if not exists tags text[],
  add column if not exists points_forts text[],
  add column if not exists badge_text text,
  add column if not exists highlighted boolean default false;
