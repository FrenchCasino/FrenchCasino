import React from 'react'
import Link from 'next/link'
import { getCasinos } from '@/lib/data/casinos'
import { CasinoCard } from '@/components/ui/CasinoCard'
import { Gift, ShieldCheck, Sparkles, Filter } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Bonus Sans Dépôt Casino (2026) — Spins Gratuits & Cash',
  description: 'Liste exclusive et vérifiée des meilleurs bonus casino sans dépôt en France pour 2026. Free spins, jetons gratuits et cash offerts sans carte bancaire.',
  alternates: {
    canonical: 'https://frenchcasino.net/bonus-sans-depot',
  }
}

export default async function BonusSansDepotPage() {
  const casinos = await getCasinos();
  const casinosBonusSansDepot = casinos
    .filter(c => {
      if (!c.bonusSansDepot) return false;
      const text = c.bonusSansDepot.trim().toLowerCase();
      return text !== '' && text !== 'aucun' && text !== 'non' && text !== 'n/a' && text !== '-';
    })
    .slice(0, 10);

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

      {/* SECTION EXPLICATIONS SEO ET FAQ */}
      <section className="max-w-4xl mx-auto border-t border-slate-800 pt-16 pb-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl font-extrabold text-white">
            Tout savoir sur les Bonus Casino Sans Dépôt en France
          </h2>
          <p className="text-slate-400 text-xs">
            Comprendre les règles et conditions pour en tirer le meilleur parti.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <p>
            Un <strong>bonus casino sans dépôt</strong> est une offre promotionnelle idéale pour les nouveaux inscrits. Elle permet de tester les fonctionnalités d'une plateforme de jeux en ligne sans engager son propre capital. Ces bonus se présentent généralement sous forme de <strong>spins gratuits (free spins)</strong> à utiliser sur des machines à sous sélectionnées, ou de <strong>crédits cash offerts</strong> utilisables sur l'ensemble du catalogue du casino.
          </p>
          <p>
            Bien que ces bonus soient gratuits, ils sont généralement soumis à un <strong>Wager (exigence de mise)</strong>. Par exemple, si vous gagnez 10€ avec vos spins gratuits et que le wager est de 30x, vous devrez miser un total de 300€ avant de pouvoir effectuer un retrait.
          </p>
        </div>

        <div className="space-y-6 pt-6">
          <h3 className="font-display font-bold text-white text-lg text-center">Foire Aux Questions — Bonus Gratuits</h3>
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm">Combien peut-on gagner avec un bonus sans dépôt ?</h4>
              <p className="text-slate-400 text-xs">Les gains issus d'un bonus sans dépôt sont souvent plafonnés par le casino (généralement entre 50€ et 100€) afin de limiter leurs risques financiers.</p>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm">Faut-il valider son identité pour retirer ces gains ?</h4>
              <p className="text-slate-400 text-xs">Oui, pour retirer tout gain issu d'un bonus sans dépôt, vous devez soumettre vos documents de vérification d'identité (KYC) prévus par la réglementation.</p>
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
                "name": "Combien peut-on gagner avec un bonus sans dépôt ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Les gains maximums retirables à partir d'un bonus sans dépôt sont généralement limités par les casinos partenaires à un montant compris entre 50€ et 100€."
                }
              },
              {
                "@type": "Question",
                "name": "Faut-il valider son identité pour retirer ces gains ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Oui, conformément aux licences de jeux de hasard, vous devez valider votre compte joueur (KYC) avec une pièce d'identité et un justificatif de domicile pour pouvoir retirer vos gains."
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
