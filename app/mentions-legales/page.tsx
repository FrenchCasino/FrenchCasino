import React from 'react'

import { PageHero } from '@/components/ui/PageHero'
import { Scale, MapPin, Mail, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'Mentions Légales — FrenchCasino',
  description: 'Informations légales, conditions générales d\'utilisation et informations sur l\'éditeur du site FrenchCasino.',
}

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        title="Mentions Légales"
        description={
          <>
            <p>Informations légales et conditions générales d&apos;utilisation du site FrenchCasino.</p>
          </>
        }
      />
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8 text-slate-300">
        
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-gold" />
              1. Éditeur du site
            </h2>
            <p className="leading-relaxed">
              Le site <strong>FrenchCasino</strong> (ci-après dénommé « le Site ») est un portail indépendant d&apos;information et de comparaison dédié à l&apos;industrie de l&apos;iGaming. 
              <br/><br/>
              Conformément aux dispositions de l&apos;article 6 III-1 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN), il est précisé que le site est édité par la structure <strong>French Casino</strong>. 
            </p>
            <ul className="space-y-2 mt-4 text-sm bg-surface p-4 rounded-xl border border-slate-800">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500"/> Siège Social : (Non communiqué publiquement pour des raisons de confidentialité)</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500"/> Contact : contact@frenchcasino.net</li>
            </ul>
          </section>

          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white">2. Hébergement</h2>
            <p className="leading-relaxed">
              L&apos;hébergement du site est assuré par <strong>Vercel Inc.</strong>, situé au 340 S Lemon Ave #4133 Walnut, CA 91789, États-Unis.
            </p>
          </section>

          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white">3. Avertissement sur les jeux d&apos;argent</h2>
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-200 text-sm leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                <ShieldAlert className="w-5 h-5" />
                Interdit aux mineurs
              </div>
              <p>
                L&apos;accès à ce site et l&apos;utilisation des services de jeux d&apos;argent en ligne qui y sont répertoriés sont <strong>strictement interdits aux personnes mineures</strong> de moins de 18 ans. 
              </p>
              <p>
                FrenchCasino n&apos;est pas un opérateur de jeux en ligne. Nous ne prenons aucun pari et n&apos;encaissons aucun dépôt. Notre rôle est strictement informatif. Il relève de la responsabilité de chaque utilisateur de s&apos;assurer que la législation de son pays de résidence l&apos;autorise à jouer sur des casinos en ligne.
              </p>
            </div>
          </section>

          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white">4. Propriété intellectuelle</h2>
            <p className="leading-relaxed">
              La structure générale du site FrenchCasino, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété exclusive de l&apos;éditeur ou de ses partenaires. Toute représentation et/ou reproduction et/ou exploitation partielle ou totale de ce site, par quelque procédé que ce soit, sans l&apos;autorisation expresse et préalable de l&apos;éditeur est strictement interdite.
            </p>
          </section>
          
          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white">5. Responsabilité</h2>
            <p className="leading-relaxed">
              Les informations proposées sur le site FrenchCasino sont fournies à titre indicatif et général. L&apos;éditeur met tout en œuvre pour diffuser des informations exactes et mises à jour, mais ne saurait garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations diffusées sur le site. Par conséquent, l&apos;utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
            </p>
          </section>

        </div>
      </div>
    </>
  )
}
