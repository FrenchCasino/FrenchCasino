import React from 'react'
import Link from 'next/link'
import { CASINOS_MOCK, METHODOLOGIE_NOTATION } from '@/lib/data/casinos'
import { CasinoCard } from '@/components/ui/CasinoCard'
import { Award, ShieldCheck, Check, Star, Lock, Zap } from 'lucide-react'

export const metadata = {
  title: 'Classement des Casinos en Ligne les Plus Fiables (2026) — FrenchCasino',
  description: 'Classement de fiabilité des casinos en ligne en France. Analyse des licences officielles, rapidité des retraits et transparence de la grille de notation.',
}

export default function TopCasinoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-gold/30 bg-gradient-hero space-y-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4 text-gold" />
          Indice de Fiabilité & Certifications 2026
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          Classement Officiel des <span className="text-gradient-gold">Casinos en Ligne les Plus Fiables</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Chaque établissement présent dans notre palmarès est soumis à une évaluation rigoureuse : validité des licences de jeu, audits des taux de retour aux joueurs (RTP) et retraits validés en moins de 24h.
        </p>
      </div>

      {/* Grille de Méthodologie */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-gold" />
            Méthodologie Transparente de Notation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {METHODOLOGIE_NOTATION.map((item, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 inline-block">
                Poids : {item.poids}
              </span>
              <h3 className="font-bold text-white text-sm">{item.critere}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Classement Liste */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-white">
          Palmarès Général des Casinos Recommandés
        </h2>

        <div className="space-y-4">
          {CASINOS_MOCK.map((casino, idx) => (
            <CasinoCard key={casino.id} casino={casino} rank={idx + 1} />
          ))}
        </div>
      </div>

    </div>
  )
}
