import React from 'react'
import { CASINOS_MOCK } from '@/lib/data/casinos'
import { CasinoCard } from '@/components/ui/CasinoCard'
import { Zap, ShieldCheck, Filter } from 'lucide-react'

export const metadata = {
  title: 'Meilleurs Bonus de Dépôt Casino (2026) — Packages de Bienvenue Exclusifs',
  description: 'Sélection des plus gros bonus de dépôt casino en France. Bonus SANS WAGER, cashback et packages de bienvenue jusqu\'à 2000€ négociés.',
}

export default function BonusDepotPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-gold/30 bg-gradient-to-r from-slate-900 via-surface-card to-purple-950/40 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-4 h-4 text-gold" />
          Offres de Bienvenue Négociées
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          Meilleurs Bonus de <span className="text-gradient-gold">Dépôt Casino 2026</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Boostez votre solde initial dès votre premier versement. Découvrez nos offres partenaires jusqu&apos;à 200% de bonus et nos casinos exclusifs SANS WAGER.
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 border-t border-surface-border">
          <span className="flex items-center gap-1.5 text-gold font-semibold">
            ⭐ Sélection spéciale offres Sans Wager (Cresus, etc.)
          </span>
          <span>• Retraits prioritaires</span>
          <span>• Dépôts Crypto & CB Sécurisés</span>
        </div>
      </div>

      {/* Liste des Casinos avec Bonus Dépôt */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
            {CASINOS_MOCK.length} Offres Partenaires Certifiées
          </h2>
          <span className="text-xs font-medium text-slate-400 bg-surface-card px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gold" />
            Filtrer par montant du bonus
          </span>
        </div>

        <div className="space-y-4">
          {CASINOS_MOCK.map((casino, idx) => (
            <CasinoCard key={casino.id} casino={casino} rank={idx + 1} />
          ))}
        </div>
      </div>

    </div>
  )
}
