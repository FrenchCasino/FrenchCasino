import React from 'react'
import Link from 'next/link'
import { TrendingUp, DollarSign, Users, ShieldCheck, CheckCircle2, ArrowRight, Zap, Award } from 'lucide-react'

export const metadata = {
  title: 'Programme d\'Affiliation Casino — Gagnez de 20€ à 70€ / Joueur | FrenchCasino',
  description: 'Rejoignez le réseau d\'affiliation casino N°1 en France. Taux de commission de 20€ à 70€ par joueur parrainé, paiements rapides IBAN & Crypto, liens de suivi instantanés et parrainage de sous-affiliés.',
}

export default function DevenirAffiliePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Affiliation */}
      <div className="rounded-3xl glass-panel p-8 sm:p-14 border border-gold/40 bg-gradient-to-br from-purple-950/60 via-surface-card to-slate-900 text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-gold" />
          Programme d&apos;Affiliation Partenaire 2026
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white leading-tight">
          Monétisez Votre Audience avec des <span className="text-gradient-gold">Commissions Fixes (CPA)</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Que vous soyez créateur de contenu, streamer, webmaster ou influenceur, profitez d&apos;un partenariat direct avec les meilleurs casinos certifiés. Gagnez de <strong>20€ à 70€ par membre parrainé</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/inscription"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all"
          >
            Créer un Compte Affilié Gratuit →
          </Link>
          <Link
            href="/connexion"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 transition-all"
          >
            Déjà Membre ? Connexion
          </Link>
        </div>
      </div>

      {/* Les Avantages du Réseau */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-light">Pourquoi Nous Rejoindre</span>
          <h2 className="font-display text-3xl font-extrabold text-white">
            Un Dashboard Conçu pour Vos Performances
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-gold/10 text-gold w-fit border border-gold/20">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Commissions Élevées</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Rémunération garantie de 20€ à 70€ par joueur sur les casinos partenaires.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Paiements Flexibles</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Demandez le virement de vos commissions sur votre compte IBAN / BIC ou portefeuille Crypto dès 100€ de solde.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-emerald/10 text-emerald w-fit border border-emerald/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Système de Parrainage</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Recrutez de nouveaux affiliés via votre lien unique (`parent_affiliate_id`) et touchez des commissions sur leurs résultats.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
