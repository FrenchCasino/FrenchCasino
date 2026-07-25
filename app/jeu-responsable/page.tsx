import React from 'react'
import { ShieldAlert, PhoneCall, HeartHandshake, AlertTriangle, CheckCircle2 } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export const metadata = {
  title: 'Jeu Responsable & Aide aux Joueurs — FrenchCasino',
  description: 'Charte d\'engagement pour le jeu responsable. Prévention de la dépendance, numéros d\'aide gratuits et conseils pour garder le contrôle.',
}

export default function JeuResponsablePage() {
  return (
    <>
      <PageHero
        badgeIcon={<ShieldAlert className="w-4 h-4 text-gold" />}
        badgeText="Protection des joueurs & Interdiction aux mineurs (-18)"
        title={
          <>
            Charte de <span className="text-gradient-gold">Jeu Responsable</span>
          </>
        }
        description={
          <>
            <p>
              Chez FrenchCasino, nous considérons que le jeu en ligne doit impérativement rester un divertissement récréatif. Les jeux d&apos;argent et de hasard comportent des risques réels d&apos;endettement, de dépendance psychologique et d&apos;isolement social.
            </p>
          </>
        }
      />
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8 pb-12 space-y-8">

      {/* Numéro d'urgence Joueurs Info Service */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-4">
        <div className="flex items-center gap-3 text-red-400 font-bold text-lg">
          <PhoneCall className="w-6 h-6" />
          <span>Besoin d&apos;aide ou d&apos;écoute anonyme ?</span>
        </div>
        <p className="text-slate-300 text-sm">
          Si vous sentez que le jeu prend une place excessive dans votre quotidien ou que vous rencontrez des difficultés financières, contactez sans attendre :
        </p>
        <div className="bg-surface p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Joueurs Info Service (Appel gratuit & anonyme)</span>
            <span className="text-2xl font-bold text-white font-mono">09 74 75 13 13</span>
          </div>
          <a
            href="https://www.joueurs-info-service.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Consulter le site officiel →
          </a>
        </div>
      </div>
    </div>
    </>
  )
}
