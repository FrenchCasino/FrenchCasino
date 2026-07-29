import React from 'react'
import { ShieldCheck, Award, Heart, Facebook } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export const metadata = {
  title: 'À Propos de Notre Équipe — FrenchCasino',
  description: 'Découvrez qui se cache derrière FrenchCasino. Notre équipe d\'experts comparateurs passionnés d\'iGaming et de transparence.',
}

export default function NotreEquipePage() {
  return (
    <>
      <PageHero
        title={
          <>
            À Propos de <span className="text-gradient-gold">FrenchCasino</span>
          </>
        }
        description={
          <>
            <p>
              Depuis plusieurs années, FrenchCasino s&apos;est imposé comme le portail d&apos;information et d&apos;affiliation référence pour la communauté des joueurs francophones.
            </p>
          </>
        }
      />
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">

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

        <div className="glass-panel p-6 rounded-2xl border border-[#1877F2]/30 space-y-3 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 transition-colors md:col-span-2 flex flex-col items-center text-center">
          <Facebook className="w-10 h-10 text-[#1877F2]" />
          <h2 className="font-display font-bold text-lg text-white">Rejoignez la Communauté !</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Suivez nos dernières actualités, découvrez les nouveaux casinos exclusifs et échangez avec d&apos;autres passionnés directement sur notre page Facebook.
          </p>
          <div className="pt-2">
            <a href="https://www.facebook.com/profile.php?id=61581513551107" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#1865CE] text-white font-bold transition-all shadow-lg shadow-[#1877F2]/20">
              <Facebook className="w-5 h-5 fill-current" />
              Suivre FrenchCasino
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
