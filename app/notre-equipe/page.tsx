import React from 'react'
import { ShieldCheck, Award, Heart } from 'lucide-react'

export const metadata = {
  title: 'À Propos de Notre Équipe — FrenchCasino',
  description: 'Découvrez qui se cache derrière FrenchCasino. Notre équipe d\'experts comparateurs passionnés d\'iGaming et de transparence.',
}

export default function NotreEquipePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-purple-500/30 text-center space-y-4">
        <h1 className="font-display text-4xl font-extrabold text-white">
          À Propos de <span className="text-gradient-gold">FrenchCasino</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Depuis plusieurs années, FrenchCasino s&apos;est imposé comme le portail d&apos;information et d&apos;affiliation référence pour la communauté des joueurs francophones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <ShieldCheck className="w-8 h-8 text-gold" />
          <h2 className="font-display font-bold text-lg text-white">Notre Mission</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Dénicher les meilleurs établissements de jeu, éliminer les casinos frauduleux et vous offrir des conditions de bonus négociées qu&apos;aucun autre guide ne propose.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <Award className="w-8 h-8 text-primary-light" />
          <h2 className="font-display font-bold text-lg text-white">Notre Indépendance</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Toutes nos revues reposent sur des tests réels financés sur nos propres fonds. Aucun casino ne peut acheter sa place dans notre classement.
          </p>
        </div>
      </div>
    </div>
  )
}
