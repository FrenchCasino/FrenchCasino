-- Migration initiale FrenchCasino V2
-- Extension pour générer des UUIDs
create extension if not exists "uuid-ossp";

-- 1. Profils utilisateurs (lié à auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'affiliate' check (role in ('affiliate', 'admin')),
  created_at timestamptz default now()
);

-- 2. Affiliés
create table if not exists public.affiliates (
  id uuid primary key references public.profiles(id) on delete cascade,
  referral_code text unique not null,
  parent_affiliate_id uuid references public.affiliates(id),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  commission_rate numeric not null default 0.30,
  total_earned numeric not null default 0,
  iban_holder text,
  iban text,
  bic text,
  created_at timestamptz default now()
);

-- 3. Casinos référencés
create table if not exists public.casinos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  licence text,
  note_fiabilite numeric default 4.5,
  description text,
  bonus_sans_depot text,
  bonus_depot text,
  lien_affilie text not null,
  ordre_classement int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 4. Liens de suivi par affilié
create table if not exists public.referral_links (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates(id) on delete cascade,
  code text unique not null,
  clicks_count int default 0,
  conversions_count int default 0,
  created_at timestamptz default now()
);

-- 5. Clics trackés
create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  referral_link_id uuid references public.referral_links(id) on delete cascade,
  converted boolean default false,
  created_at timestamptz default now()
);

-- 6. Commissions
create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates(id) on delete cascade,
  montant numeric not null,
  statut text not null default 'pending' check (statut in ('pending', 'validated', 'paid')),
  periode text,
  created_at timestamptz default now()
);

-- 7. Demandes de paiement
create table if not exists public.payout_requests (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates(id) on delete cascade,
  montant_demande numeric not null,
  statut text not null default 'pending' check (statut in ('pending', 'approved', 'rejected', 'paid')),
  created_at timestamptz default now(),
  processed_at timestamptz
);

-- 8. Tickets de support (tchat)
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references public.affiliates(id) on delete cascade,
  sujet text,
  statut text not null default 'open' check (statut in ('open', 'answered', 'closed')),
  created_at timestamptz default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete cascade,
  sender_id uuid references public.profiles(id),
  message text not null,
  created_at timestamptz default now()
);

-- Activer RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.affiliates enable row level security;
alter table public.casinos enable row level security;
alter table public.referral_links enable row level security;
alter table public.clicks enable row level security;
alter table public.commissions enable row level security;
alter table public.payout_requests enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;

-- Function helper pour vérifier si l'utilisateur est admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- POLITIQUES RLS

-- Profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id or public.is_admin());
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id or public.is_admin());

-- Affiliates
create policy "Affiliates can view own record" on public.affiliates
  for select using (auth.uid() = id or public.is_admin());
create policy "Affiliates can update own record" on public.affiliates
  for update using (auth.uid() = id or public.is_admin());
create policy "Affiliates can insert own record" on public.affiliates
  for insert with check (auth.uid() = id or public.is_admin());

-- Casinos (lecture publique, écriture réservée aux admins)
create policy "Casinos public select" on public.casinos
  for select using (true);
create policy "Casinos admin insert" on public.casinos
  for insert with check (public.is_admin());
create policy "Casinos admin update" on public.casinos
  for update using (public.is_admin());
create policy "Casinos admin delete" on public.casinos
  for delete using (public.is_admin());

-- Referral Links
create policy "Affiliates view own referral links" on public.referral_links
  for select using (affiliate_id = auth.uid() or public.is_admin());
create policy "Affiliates create own referral links" on public.referral_links
  for insert with check (affiliate_id = auth.uid() or public.is_admin());

-- Clicks (Public insert pour tracking, lecture affilié/admin)
create policy "Clicks public insert" on public.clicks
  for insert with check (true);
create policy "Clicks affiliate/admin select" on public.clicks
  for select using (
    exists (
      select 1 from public.referral_links rl
      where rl.id = clicks.referral_link_id and (rl.affiliate_id = auth.uid() or public.is_admin())
    )
  );

-- Commissions
create policy "Commissions affiliate select" on public.commissions
  for select using (affiliate_id = auth.uid() or public.is_admin());

-- Payout Requests
create policy "Payouts affiliate select" on public.payout_requests
  for select using (affiliate_id = auth.uid() or public.is_admin());
create policy "Payouts affiliate insert" on public.payout_requests
  for insert with check (affiliate_id = auth.uid());
create policy "Payouts admin update" on public.payout_requests
  for update using (public.is_admin());

-- Tickets & Ticket Messages
create policy "Tickets affiliate select" on public.tickets
  for select using (affiliate_id = auth.uid() or public.is_admin());
create policy "Tickets affiliate insert" on public.tickets
  for insert with check (affiliate_id = auth.uid());
create policy "Tickets admin update" on public.tickets
  for update using (public.is_admin());

create policy "Ticket messages select" on public.ticket_messages
  for select using (
    exists (
      select 1 from public.tickets t
      where t.id = ticket_messages.ticket_id and (t.affiliate_id = auth.uid() or public.is_admin())
    )
  );
create policy "Ticket messages insert" on public.ticket_messages
  for insert with check (
    exists (
      select 1 from public.tickets t
      where t.id = ticket_messages.ticket_id and (t.affiliate_id = auth.uid() or public.is_admin())
    )
  );

-- Trigger auto-création profile sur auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Affilié FrenchCasino'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'affiliate')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
