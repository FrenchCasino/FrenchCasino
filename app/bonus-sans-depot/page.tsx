import React from 'react'
import Link from 'next/link'
import { getCasinos } from '@/lib/data/casinos'
import { CasinoCard } from '@/components/ui/CasinoCard'
import { Gift, ShieldCheck, Sparkles, Filter } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Bonus Sans Dépôt Casino (2026) — Spins Gratuits & Cash Offert',
  description: 'Liste exclusive et vérifiée des meilleurs bonus casino sans dépôt en France pour 2026. Free spins, jetons gratuits et bonus cash sans carte bancaire.',
}

export default async function BonusSansDepotPage() {
  const casinos = await getCasinos();
  const casinosBonusSansDepot = casinos.filter(c => c.bonusSansDepot !== null)

  return (
    <>
      <PageHero
        badgeIcon={<Gift className="w-4 h-4 text-purple-400" />}
        badgeText="Offres Gratuites Sans Dépôt 2026"
        title={
          <>
            Bonus Casino <span className="text-gradient-purple">Sans Dépôt Exclusifs</span>
          </>
        }
        description={
          <>
            <p>
              Découvrez notre sélection rigoureusement testée de bonus gratuits attribués dès l&apos;inscription. Jouez aux machines à sous ou aux jeux de table sans risquer votre propre argent.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700"><ShieldCheck className="w-4 h-4 text-emerald" /> Vérifié par notre équipe</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">• 100% Gratuits & Sans Engagement</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">• Retrait des gains selon conditions de wager</span>
        </div>
      </PageHero>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">

      {/* Liste des Casinos avec Bonus Sans Dépôt */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
            {casinosBonusSansDepot.length} Offres Disponibles Immédiatement
          </h2>
          <span className="text-xs font-medium text-slate-400 bg-surface-card px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gold" />
            Trié par Note de Fiabilité
          </span>
        </div>

        <div className="space-y-4">
          {casinosBonusSansDepot.map((casino, idx) => (
            <CasinoCard key={casino.id} casino={casino} rank={idx + 1} />
          ))}
        </div>
      </div>

      {/* Explications & Conseils */}
      <div className="glass-panel p-8 rounded-2xl border border-surface-border space-y-4 text-sm text-slate-300">
        <h3 className="font-display font-bold text-lg text-white">
          Comment fonctionne un bonus sans dépôt ?
        </h3>
        <p className="leading-relaxed">
          Un bonus sans dépôt est une offre promotionnelle accordée par un établissement de jeux en ligne permettant à un nouveau joueur de recevoir des crédits de jeu ou des tours gratuits (Free Spins) immédiatement après la confirmation de son compte, sans avoir à verser le moindre euro.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-surface/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-white text-xs block">1. Inscription rapide</span>
            <span className="text-xs text-slate-400">Créez votre compte via nos liens sécurisés pour valider l&apos;éligibilité.</span>
          </div>
          <div className="bg-surface/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-white text-xs block">2. Validation Email / SMS</span>
            <span className="text-xs text-slate-400">Confirmez vos coordonnées pour débloquer automatiquement vos crédits offerts.</span>
          </div>
          <div className="bg-surface/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-white text-xs block">3. Retrait des Gains</span>
            <span className="text-xs text-slate-400">Remplissez les conditions de mise (wager) prévues avant de demander votre virement.</span>
          </div>
        </div>
      </div>

    </div>
    </>
  )
}
