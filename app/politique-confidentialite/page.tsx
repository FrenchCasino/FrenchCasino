import React from 'react'

import { PageHero } from '@/components/ui/PageHero'

export const metadata = {
  title: 'Politique de Confidentialité — FrenchCasino',
  description: 'Protection de vos données personnelles, cookies et principes RGPD appliqués sur FrenchCasino.',
}

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero
        title="Politique de Confidentialité"
        description={
          <>
            <p>Protection de vos données personnelles, cookies et principes RGPD appliqués sur FrenchCasino.</p>
          </>
        }
      />
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6 text-slate-300 text-sm leading-relaxed">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <p>
          Chez FrenchCasino, la protection de vos données personnelles est primordiale. Nous ne collectons que les informations strictement nécessaires à la fourniture de nos services (gestion de compte affilié, suivi des clics et support). Vos données ne sont jamais revendues à des tiers.
        </p>
      </div>
    </div>
    </>
  )
}
