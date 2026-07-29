-- Migration: Système d'Avis des Joueurs sur les Casinos

CREATE TABLE IF NOT EXISTS public.casino_reviews (
  id uuid primary key default gen_random_uuid(),
  casino_slug text not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text not null,
  user_name text not null,
  ip_hash text,
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz default now()
);

-- Index pour optimiser les requêtes sur une page casino
CREATE INDEX IF NOT EXISTS idx_casino_reviews_slug ON public.casino_reviews(casino_slug);

-- Activer RLS
ALTER TABLE public.casino_reviews ENABLE ROW LEVEL SECURITY;

-- 1. Lecture: Tout le monde peut voir les avis publiés (ou l'Admin peut tout voir)
CREATE POLICY "Public can view published reviews" ON public.casino_reviews
  FOR SELECT USING (status = 'published' OR public.is_admin());

-- 2. Insertion: Tout le monde peut insérer un avis (Anti-spam géré par l'API via Cookie/IP)
CREATE POLICY "Public can insert reviews" ON public.casino_reviews
  FOR INSERT WITH CHECK (true);

-- 3. Mise à jour / Suppression : Réservé à l'Admin
CREATE POLICY "Admin can update reviews" ON public.casino_reviews
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete reviews" ON public.casino_reviews
  FOR DELETE USING (public.is_admin());
