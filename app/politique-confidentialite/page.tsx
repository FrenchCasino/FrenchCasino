import React from 'react'

export const metadata = {
  title: 'Politique de Confidentialité — FrenchCasino',
  description: 'Protection de vos données personnelles, cookies et principes RGPD appliqués sur FrenchCasino.',
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-300 text-sm leading-relaxed">
      <h1 className="font-display text-3xl font-extrabold text-white">Politique de Confidentialité</h1>
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <p>
          Chez FrenchCasino, la protection de vos données personnelles est primordiale. Nous ne collectons que les informations strictement nécessaires à la fourniture de nos services (gestion de compte affilié, suivi des clics et support). Vos données ne sont jamais revendues à des tiers.
        </p>
      </div>
    </div>
  )
}
