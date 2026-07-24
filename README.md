# 🎰 FrenchCasino V2

Bienvenue sur le dépôt officiel de **FrenchCasino V2**, le comparateur de casinos en ligne et plate-forme d'affiliation nouvelle génération.

---

## 🛠 Stack Technique

- **Framework** : Next.js 14+ (App Router, TypeScript, React 18)
- **Base de Données & Auth** : Supabase (Postgres, Auth, RLS, Storage, Realtime)
- **Styling** : Tailwind CSS + Glassmorphism Custom + Icons Lucide
- **Animations** : Framer Motion (Compteurs Jackpot, transitions glassmorphism)
- **Graphiques** : Recharts
- **Déploiement** : Vercel
- **CI/CD** : GitHub Actions

---

## 🚀 Installation & Lancement Local

### 1. Prérequis
- Node.js 18.x ou supérieur
- npm ou pnpm
- Supabase CLI

### 2. Cloner et Installer les dépendances
```bash
git clone https://github.com/FrenchCasino/FrenchCasino.git
cd FrenchCasino
npm install
```

### 3. Configuration des Variables d'Environnement
Copier le fichier d'exemple et renseigner vos clés Supabase :
```bash
cp .env.local.example .env.local
```

Contenu de `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://pxbngvmnfsxvbmvxnbsq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2
SUPABASE_SERVICE_ROLE_KEY=<récupérer dans Supabase → Settings → API>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Application des Migrations Supabase
```bash
supabase login
supabase link --project-ref pxbngvmnfsxvbmvxnbsq
supabase db push
```
*(Alternative : copiez le contenu de `supabase/migrations/20260724_initial_schema.sql` directement dans l'Éditeur SQL de votre dashboard Supabase).*

### 5. Démarrer le Serveur de Développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📁 Arborescence du Projet

```
├── app/
│   ├── (public)
│   │   ├── page.tsx (Accueil hero, jackpot, top 3, bonus)
│   │   ├── bonus-sans-depot/page.tsx
│   │   ├── bonus-depot/page.tsx
│   │   ├── top-casino/page.tsx (Classement & Grille de fiabilité)
│   │   ├── casino/[slug]/page.tsx (Avis détaillé)
│   │   ├── actus/page.tsx (La voix du casino)
│   │   ├── litige/page.tsx (Médiation)
│   │   ├── notre-equipe/page.tsx
│   │   ├── devenir-affilie/page.tsx (Landing Affiliation)
│   │   ├── jeu-responsable/page.tsx (Conformité -18 / Joueurs Info Service)
│   │   ├── mentions-legales/page.tsx
│   │   └── politique-confidentialite/page.tsx
│   ├── connexion/page.tsx
│   ├── inscription/page.tsx
│   ├── dashboard/page.tsx (Espace Affilié)
│   └── admin/page.tsx (Espace Admin)
├── components/
│   ├── layout/ (Header, Footer, ResponsibleGamingBanner)
│   └── ui/ (CasinoCard, JackpotCounter)
├── lib/
│   ├── data/casinos.ts (Data mock de référence & grille de notation)
│   └── supabase/ (client.ts, server.ts, middleware.ts)
├── supabase/
│   └── migrations/20260724_initial_schema.sql
```

---

## 🔒 Sécurité & Conformité

- **Bandeau Jeu Responsable** : Visible en permanance dans le footer sur toutes les pages avec le numéro gratuit **Joueurs Info Service (09 74 75 13 13)** et rappel d'interdiction aux mineurs (-18).
- **Row Level Security (RLS)** : Seuls les affiliés propriétaires ont accès à leurs données (`auth.uid() = affiliate_id`). Les données sensibles (IBAN/BIC) sont masquées dans l'UI.
