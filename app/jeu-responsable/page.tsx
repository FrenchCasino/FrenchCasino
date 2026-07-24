import React from 'react'
import { ShieldAlert, PhoneCall, HeartHandshake, AlertTriangle, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Jeu Responsable & Aide aux Joueurs — FrenchCasino',
  description: 'Charte d\'engagement pour le jeu responsable. Prévention de la dépendance, numéros d\'aide gratuits et conseils pour garder le contrôle.',
}

export default function JeuResponsablePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-gold/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gold/10 text-gold border border-gold/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white">
              Charte de Jeu Responsable
            </h1>
            <p className="text-xs text-gold uppercase tracking-wider font-semibold">
              Protection des joueurs & Interdiction aux mineurs (-18)
            </p>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Chez FrenchCasino, nous considérons que le jeu en ligne doit impérativement rester un divertissement récréatif. Les jeux d&apos;argent et de hasard comportent des risques réels d&apos;endettement, de dépendance psychologique et d&apos;isolement social.
        </p>
      </div>

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
  )
}
