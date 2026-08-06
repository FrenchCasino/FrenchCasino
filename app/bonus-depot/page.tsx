import React from 'react'
import { getCasinos } from '@/lib/data/casinos'
import { CasinoCard } from '@/components/ui/CasinoCard'
import { Zap, ShieldCheck, Filter } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Meilleurs Bonus de Dépôt Casino (2026) — Packages de Bienvenue',
  description: 'Sélection des plus gros bonus de dépôt casino en France. Bonus sans wager, cashback et packages de bienvenue négociés pour nos joueurs.',
  alternates: {
    canonical: 'https://frenchcasino.net/bonus-depot',
  }
}

export default async function BonusDepotPage() {
  const allCasinos = await getCasinos();
  const casinosBonusDepot = allCasinos
    .filter(c => {
      if (!c.bonusDepot) return false;
      const text = c.bonusDepot.trim().toLowerCase();
      return text !== '' && text !== 'aucun' && text !== 'non' && text !== 'n/a' && text !== '-';
    })
    .slice(0, 10);
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

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">

      {/* Liste des Casinos avec Bonus Dépôt */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
            {casinosBonusDepot.length} Offres Partenaires Certifiées
          </h2>
          <span className="text-xs font-medium text-slate-400 bg-surface-card px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gold" />
            Filtrer par montant du bonus
          </span>
        </div>

        <div className="space-y-4">
          {casinosBonusDepot.map((casino, idx) => (
            <CasinoCard key={casino.id} casino={casino} rank={idx + 1} />
          ))}
        </div>
      </div>

      {/* SECTION EXPLICATIONS SEO ET FAQ */}
      <section className="max-w-4xl mx-auto border-t border-slate-800 pt-16 pb-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl font-extrabold text-white">
            Optimiser ses gains avec un Bonus de Dépôt Casino
          </h2>
          <p className="text-slate-400 text-xs">
            Comment fonctionnent les packages de bienvenue et les conditions de wager.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <p>
            Le <strong>bonus de premier dépôt</strong> est le moyen le plus populaire utilisé par les casinos en ligne pour attirer les nouveaux joueurs. Généralement, le casino double (100%) ou triple (200%) votre premier versement d'argent réel, et y ajoute parfois des spins gratuits (free spins).
          </p>
          <p>
            Il est important de distinguer les bonus collants (sticky) des bonus non collants (non-sticky/parachute). Un <strong>bonus parachute</strong> vous permet de jouer d'abord avec votre argent réel. Si vous gagnez sans entamer votre solde bonus, vous pouvez annuler le bonus et retirer vos gains immédiatement sans avoir à remplir les conditions de wager !
          </p>
        </div>

        <div className="space-y-6 pt-6">
          <h3 className="font-display font-bold text-white text-lg text-center">Foire Aux Questions — Bonus de Dépôt</h3>
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm">Qu'est-ce qu'un bonus sans wager (sans exigence de mise) ?</h4>
              <p className="text-slate-400 text-xs">Un bonus sans wager signifie que vous pouvez retirer les gains générés par le bonus immédiatement, sans avoir à jouer la somme un certain nombre de fois.</p>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm">Quel est le dépôt minimum pour bénéficier d'un bonus de bienvenue ?</h4>
              <p className="text-slate-400 text-xs">Le dépôt minimum est généralement fixé à 10€ ou 20€ selon le casino partenaire et la méthode de paiement utilisée.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DONNÉES STRUCTURÉES JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Qu'est-ce qu'un bonus sans wager ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Un bonus sans wager vous permet de retirer vos gains immédiatement sans restriction de mise."
                }
              },
              {
                "@type": "Question",
                "name": "Quel est le dépôt minimum pour bénéficier d'un bonus de bienvenue ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Le dépôt minimum requis est de 10€ ou 20€ en fonction des conditions générales de chaque casino."
                }
              }
            ]
          })
        }}
      />

    </div>
    </>
  )
}
