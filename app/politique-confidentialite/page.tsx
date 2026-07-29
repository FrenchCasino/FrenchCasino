import React from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { Shield, Eye, Lock, Cookie } from 'lucide-react'

export const metadata = {
  title: 'Politique de Confidentialité — FrenchCasino',
  description: 'Protection de vos données personnelles, utilisation des cookies et respect des principes RGPD appliqués sur FrenchCasino.',
}

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero
        title="Politique de Confidentialité"
        description={
          <>
            <p>Notre engagement envers la protection de vos données personnelles et votre vie privée.</p>
          </>
        }
      />
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8 text-slate-300">
        
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary-light" />
              1. Collecte et protection des données
            </h2>
            <p className="leading-relaxed">
              Chez <strong>French Casino</strong>, le respect de votre vie privée est une priorité absolue. Nous nous engageons à protéger vos données personnelles conformément aux réglementations en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD).
              Les seules données personnelles que nous collectons sont celles que vous nous fournissez volontairement lors de la création d&apos;un compte affilié, ou lorsque vous nous contactez.
            </p>
          </section>

          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Eye className="w-6 h-6 text-emerald" />
              2. Utilisation de vos informations
            </h2>
            <p className="leading-relaxed">
              Les données que nous sommes susceptibles de recueillir (adresse email, informations de profil affilié) sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Assurer le bon fonctionnement de votre espace membre et de vos outils d&apos;affiliation.</li>
              <li>Vous verser vos commissions via les informations bancaires ou cryptos renseignées.</li>
              <li>Améliorer votre expérience sur le site et vous informer des mises à jour importantes.</li>
              <li>Assurer la sécurité de la plateforme contre la fraude et les abus.</li>
            </ul>
          </section>

          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Cookie className="w-6 h-6 text-amber-500" />
              3. Utilisation des Cookies
            </h2>
            <p className="leading-relaxed">
              Le site FrenchCasino utilise des cookies pour améliorer votre navigation, mesurer notre audience et mémoriser vos préférences (comme le choix du mode sombre/clair). 
              Ces cookies ne contiennent aucune donnée personnelle sensible et vous pouvez à tout moment configurer votre navigateur pour les bloquer ou les supprimer.
            </p>
          </section>

          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-400" />
              4. Partage et sécurité
            </h2>
            <p className="leading-relaxed">
              Nous <strong>ne vendons, ne louons et ne partageons jamais</strong> vos informations personnelles à des tiers à des fins de prospection commerciale. 
              Vos données sont stockées sur des serveurs sécurisés équipés des dernières technologies de chiffrement pour empêcher tout accès non autorisé.
            </p>
          </section>
          
          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl text-white">5. Vos Droits (RGPD)</h2>
            <p className="leading-relaxed">
              Conformément à la réglementation européenne, vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données. Pour exercer ce droit, il vous suffit d&apos;envoyer une demande depuis votre espace membre ou de nous contacter à l&apos;adresse suivante : <strong>contact@frenchcasino.net</strong>.
            </p>
          </section>

        </div>
      </div>
    </>
  )
}
