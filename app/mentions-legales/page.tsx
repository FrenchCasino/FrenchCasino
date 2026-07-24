import React from 'react'

export const metadata = {
  title: 'Mentions Légales — FrenchCasino',
  description: 'Informations légales, éditeur du site, hébergement Vercel et termes d\'utilisation du service FrenchCasino.',
}

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-300 text-sm leading-relaxed">
      <h1 className="font-display text-3xl font-extrabold text-white">Mentions Légales</h1>
      
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="font-bold text-white text-lg">1. Éditeur du site</h2>
        <p>
          Le site web <strong>FrenchCasino</strong> (accessible à l&apos;adresse d&apos;exploitation en cours) est un guide indépendant d&apos;information et de comparaison spécialisé dans les jeux d&apos;argent et les bonus d&apos;affiliation.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="font-bold text-white text-lg">2. Hébergement</h2>
        <p>
          Le site est hébergé par la société <strong>Vercel Inc.</strong><br />
          Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA.<br />
          Site web : vercel.com
        </p>
      </div>
    </div>
  )
}
