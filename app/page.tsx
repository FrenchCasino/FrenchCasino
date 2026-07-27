import React from 'react'
import Link from 'next/link'
import { CASINOS_MOCK, METHODOLOGIE_NOTATION } from '@/lib/data/casinos'
import { CasinoCard } from '@/components/ui/CasinoCard'
import { JackpotCounter } from '@/components/ui/JackpotCounter'
import {
  ShieldCheck,
  Gift,
  Zap,
  Award,
  ArrowRight,
  TrendingUp,
  Users,
  CheckCircle2,
  Lock,
  Sparkles,
  DollarSign
} from 'lucide-react'

export default function HomePage() {
  const top3Casinos = CASINOS_MOCK.slice(0, 3)

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-hero border-b border-surface-border/50">
        
        {/* Glow Spheres en fond */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-gold/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Badge Premium Top */}
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card/80 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase shadow-gold-glow animate-pulse-glow">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Guide Officiel Casinos FR · 2026</span>
              </div>
            </div>

            {/* Titre Impactant H1 */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Bienvenue sur <span className="text-gradient-purple">French</span> <span className="text-gradient-gold">Casino</span>
            </h1>

            {/* Paragraphe d'accroche original SEO */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Le guide premium des casinos en ligne francophones. Uniquement des plateformes 100% sécurisées, avec les meilleurs bonus, les retraits les plus rapides et un accompagnement expert pour les joueurs FR.
            </p>

            {/* CTAs d'Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/bonus-sans-depot"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-primary to-purple-700 hover:from-primary-hover hover:to-purple-800 shadow-purple-glow hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5 text-purple-200" />
                <span>Voir les Bonus Sans Dépôt</span>
              </Link>

              <Link
                href="/top-casino"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-gold hover:text-white bg-surface-card hover:bg-surface border border-gold/40 hover:border-gold shadow-gold-glow transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5 text-gold" />
                <span>Top Casinos 2026</span>
              </Link>
            </div>

            {/* Petits checks sous le bouton */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 pt-6 text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald" /> Sites 100% vérifiés</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Retraits rapides</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-400" /> Support francophone</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-slate-400" /> 18+ Jeu responsable</span>
            </div>

            {/* Compteur Jackpot Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-surface-border/60">
              <div className="p-4 rounded-xl glass-panel text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-gradient-gold block">
                  <JackpotCounter end={1450000} suffix="€" />
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Bonus Négociés pour nos Joueurs
                </span>
              </div>

              <div className="p-4 rounded-xl glass-panel text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-gradient-purple block">
                  <JackpotCounter end={12450} suffix="+" />
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Joueurs Accompagnés
                </span>
              </div>

              <div className="p-4 rounded-xl glass-panel text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald block">
                  <JackpotCounter end={100} suffix="%" />
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Casinos Vérifiés & Licenciés
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION TOP 3 CASINOS DU MOIS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-surface-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>Sélection Officielle 2026</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Top 3 des Casinos en Ligne les Plus Fiables
            </h2>
          </div>
          <Link
            href="/top-casino"
            className="text-xs sm:text-sm font-semibold text-primary-light hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Voir le classement complet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {top3Casinos.map((casino, idx) => (
            <CasinoCard key={casino.id} casino={casino} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* 3. SECTION BONUS SANS DÉPÔT EN VEDETTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-primary/30 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-surface-card to-slate-900">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="badge-purple px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-purple-300" />
                Exclusivité FrenchCasino
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white">
                Profitez des Bonus Sans Dépôt : Testez sans risquer votre argent
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Nous négocions directement auprès des établissements de jeu des tours gratuits (Free Spins) et des crédits cash offerts dès la création de votre compte. Aucun dépôt requis pour démarrer.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald" />
                  <span>Validation de compte instantanée</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald" />
                  <span>Gains retirables sous conditions lisibles</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link
                href="/bonus-sans-depot"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-primary hover:from-purple-500 hover:to-primary-hover shadow-purple-glow transition-all text-center"
              >
                Explorer la liste des Bonus Sans Dépôt →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION MÉTHODOLOGIE DE NOTATION TRANSPARENTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">Notre Rigueur</span>
          <h2 className="font-display text-3xl font-extrabold text-white">
            Comment Nous Évaluons Chaque Casino
          </h2>
          <p className="text-slate-400 text-sm">
            Notre grille de notation repose sur 5 piliers intransigeants pour garantir une expérience de jeu 100% sécurisée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {METHODOLOGIE_NOTATION.map((item, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-surface-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-extrabold font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 inline-block">
                  {item.poids}
                </span>
                <h3 className="font-display font-bold text-white text-base">
                  {item.critere}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BANNIÈRE LANDING RECRUTEMENT AFFILIÉ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-surface-card to-purple-950/60 p-8 sm:p-12 border border-gold/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="badge-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-gold" />
                Programme d&apos;Affiliation Exclusif
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Vous possédez une communauté ou un site web ? Devenez Affilié FrenchCasino.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Taux de commission préférentiel de <strong>20€ à 70€ par membre parrainé</strong>, paiements mensuels rapides par virement IBAN ou Crypto, tableau de bord détaillé et liens de suivi instantanés.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/devenir-affilie"
                  className="px-6 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all"
                >
                  S&apos;inscrire comme Affilié
                </Link>
                <Link
                  href="/connexion"
                  className="px-6 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all"
                >
                  Connexion Espace Membre
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-gold/20 text-center space-y-1">
                <span className="text-2xl font-bold text-gradient-gold block">20€ à 70€</span>
                <span className="text-xs text-slate-400">Par membre parrainé</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gold/20 text-center space-y-1">
                <span className="text-2xl font-bold text-gradient-purple block">Paiements</span>
                <span className="text-xs text-slate-400">IBAN / BIC & Crypto</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gold/20 text-center space-y-1">
                <span className="text-2xl font-bold text-emerald block">Tracking 100%</span>
                <span className="text-xs text-slate-400">Transparence Clics</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gold/20 text-center space-y-1">
                <span className="text-2xl font-bold text-white block">Tchat Live</span>
                <span className="text-xs text-slate-400">Support Dédié</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
