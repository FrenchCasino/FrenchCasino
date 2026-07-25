import React from 'react'
import { CASINOS_MOCK } from '@/lib/data/casinos'
import { CasinoCard } from '@/components/ui/CasinoCard'
import { Zap, ShieldCheck, Filter } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export const metadata = {
  title: 'Meilleurs Bonus de Dépôt Casino (2026) — Packages de Bienvenue Exclusifs',
  description: 'Sélection des plus gros bonus de dépôt casino en France. Bonus SANS WAGER, cashback et packages de bienvenue jusqu\'à 2000€ négociés.',
}

export default function BonusDepotPage() {
  return (
    <>
      <PageHero
        badgeIcon={<Zap className="w-4 h-4 text-gold" />}
        badgeText="Offres de Bienvenue Négociées"
        title={
          <>
            Meilleurs Bonus de <span className="text-gradient-gold">Dépôt Casino 2026</span>
          </>
        }
        description={
          <>
            <p>
              Boostez votre solde initial dès votre premier versement. Découvrez nos offres partenaires jusqu&apos;à 200% de bonus et nos casinos exclusifs SANS WAGER.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">⭐ Sélection spéciale offres Sans Wager (Cresus, etc.)</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">• Retraits prioritaires</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">• Dépôts Crypto & CB Sécurisés</span>
        </div>
      </PageHero>

      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-12 space-y-10">

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
    </>
  )
}
