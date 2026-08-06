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
          </div>

          {/* Expert Profile: Le Fondateur */}
          <div className="glass-panel p-8 rounded-3xl border border-gold/20 relative overflow-hidden mt-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 rounded-full bg-surface-dark border-2 border-gold/50 shadow-gold-glow flex items-center justify-center shrink-0 overflow-hidden">
                <span className="text-5xl">👤</span>
              </div>
              <div className="text-center md:text-left space-y-3">
                <h2 className="font-display font-bold text-2xl text-white">Le Fondateur</h2>
                <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-xs font-bold tracking-wider uppercase">
                  Testeur Principal & Expert iGaming
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Passionné par l'industrie des jeux d'argent depuis plus de 10 ans, le Fondateur de FrenchCasino a d'abord été joueur avant de devenir analyste. Frustré par le manque de transparence des comparateurs traditionnels, il a créé ce portail avec une règle stricte : <strong>tester chaque casino en conditions réelles</strong> (dépôt, jeu sous bonus, retrait). 
                </p>
                <p className="text-slate-400 leading-relaxed text-sm">
                  C'est lui qui rédige et valide personnellement 100% des avis détaillés présents sur la plateforme, garantissant l'intégrité de notre ligne éditoriale.
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="glass-panel p-6 rounded-2xl border border-[#1877F2]/30 space-y-3 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 transition-colors flex flex-col items-center text-center mt-12">
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Le Fondateur",
              "jobTitle": "Expert iGaming & Testeur Principal",
              "url": "https://frenchcasino.net/notre-equipe",
              "worksFor": {
                "@type": "Organization",
                "name": "FrenchCasino"
              }
            })
          }}
        />
      </>
  )
}
