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
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8 text-slate-300">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <CheckCircle2 className="w-8 h-8 text-emerald" />
            <h2 className="font-display font-bold text-lg text-white">Conseils pour jouer responsable</h2>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald mt-1.5 shrink-0" />
                Fixez-vous un budget strict avant de commencer à jouer et ne le dépassez jamais.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald mt-1.5 shrink-0" />
                Ne jouez jamais pour "refaire vos pertes".
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald mt-1.5 shrink-0" />
                Le jeu ne doit pas être vu comme une source de revenus, mais comme un loisir coûteux.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald mt-1.5 shrink-0" />
                Faites des pauses régulières et ne jouez pas sous l&apos;emprise de l&apos;alcool.
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <h2 className="font-display font-bold text-lg text-white">Signes de dépendance</h2>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                Vous empruntez de l&apos;argent pour pouvoir continuer à jouer.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                Vous mentez à votre entourage sur le temps et l&apos;argent dépensés en ligne.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                Vous négligez vos responsabilités familiales ou professionnelles.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                Vous ressentez un besoin compulsif de jouer pour apaiser l&apos;anxiété.
              </li>
            </ul>
          </div>
        </div>

        {/* Numéro d'urgence Joueurs Info Service */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-4">
          <div className="flex items-center gap-3 text-red-400 font-bold text-lg">
            <PhoneCall className="w-6 h-6" />
            <span>Besoin d&apos;aide ou d&apos;écoute anonyme ?</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Si vous sentez que le jeu prend une place excessive dans votre quotidien ou que vous rencontrez des difficultés financières, contactez sans attendre un service spécialisé. Des professionnels sont à votre écoute pour vous accompagner.
          </p>
          <div className="bg-surface p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Joueurs Info Service (Appel gratuit & anonyme)</span>
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

        <div className="text-center text-sm text-slate-500 pt-8">
          <HeartHandshake className="w-5 h-5 mx-auto mb-2 opacity-50" />
          Prenez soin de vous. Jouer comporte des risques, l&apos;aide est à portée de main.
        </div>
      </div>
    </>
  )
}
