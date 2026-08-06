import React from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'
import { FAQSchema, FAQItem } from '@/components/schema/FAQSchema'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Max Bet Casino : La règle de la mise maximale expliquée (2026)',
  description: 'Comprenez la règle du Max Bet sous bonus au casino en ligne. Pourquoi les casinos limitent les mises à 5€ et comment éviter de voir ses gains annulés.',
  alternates: {
    canonical: 'https://frenchcasino.net/max-bet-casino',
  }
}

const faqs: FAQItem[] = [
  {
    question: "Quelle est la limite de Max Bet standard ?",
    answer: "Sur 95% des casinos en ligne, la mise maximale autorisée sous bonus (Max Bet) est de 5€ par tour de machine à sous ou par main de jeu de table."
  },
  {
    question: "Que se passe-t-il si je dépasse le Max Bet par erreur ?",
    answer: "Même s'il s'agit d'une erreur humaine, le casino considérera cela comme une violation des termes et conditions. Vos gains liés au bonus seront confisqués lors de la demande de retrait."
  },
  {
    question: "L'achat de bonus (Bonus Buy) est-il soumis au Max Bet ?",
    answer: "Absolument ! Si vous achetez un bonus à 100€ sur une machine à sous, cela compte comme un spin de 100€. Si le Max Bet est de 5€, c'est une violation directe."
  }
]

export default function MaxBetCasinoPage() {
  return (
    <>
      <PageHero
        badgeIcon={<AlertCircle className="w-4 h-4 text-gold" />}
        badgeText="Le piège n°1 des bonus"
        title={
          <span className="text-3xl sm:text-4xl md:text-5xl leading-tight">
            La règle du <span className="text-gradient-gold">Max Bet</span>
          </span>
        }
        description="Une simple erreur de mise peut vous coûter des milliers d'euros de gains. Apprenez tout sur la mise maximale autorisée sous bonus."
      />

      <article className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 relative mb-12">
          <div className="prose prose-invert prose-purple max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h3:text-xl prose-h3:text-slate-200 prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-slate-300 prose-li:my-2 prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-strong:font-bold">
            <h2>Qu'est-ce que la règle du Max Bet ?</h2>
            <p>La règle du <strong>Max Bet</strong> (ou mise maximale) est une condition imposée par presque tous les casinos en ligne lorsqu'un joueur accepte un bonus. Elle définit le montant maximum que vous avez le droit de parier en une seule fois (par spin, par main, ou par tour).</p>
            <p>Dans la grande majorité des cas, cette limite est fixée à <strong>5€ ou 5$</strong>.</p>

            <h2>Pourquoi les casinos imposent-ils un Max Bet ?</h2>
            <p>Cette règle n'existe pas pour vous frustrer, mais pour protéger le casino contre une faillite mathématique. Sans Max Bet, un joueur pourrait prendre un bonus de 1000€, faire un seul pari de 2000€ (dépôt + bonus) sur la Roulette. S'il gagne, il repart avec 4000€. S'il perd, ce n'est "que" la moitié de son argent. Le Max Bet oblige le joueur à lisser son risque dans le temps, donnant à l'avantage maison (RTP) le temps de s'exprimer.</p>

            <h2>Les erreurs les plus fréquentes liées au Max Bet</h2>
            <ul>
              <li><strong>L'Achat de Bonus (Bonus Buy) :</strong> C'est l'erreur n°1. Acheter des tours gratuits sur des jeux comme Sweet Bonanza coûte souvent 100x votre mise de base. Si vous jouez à 0,20€, le bonus buy coûte 20€. Puisque 20€ {'>'} 5€, c'est une violation du Max Bet.</li>
              <li><strong>Le bouton "Bet Max" :</strong> Cliquer par inadvertance sur le bouton "Mise Maximale" présent sur beaucoup de vieilles machines à sous.</li>
              <li><strong>L'option "Double" (Gamble) :</strong> Sur des jeux comme Book of Dead, l'option pour doubler ses gains (Gamble) compte comme une mise. Si vous tentez de doubler un gain de 10€, vous misez 10€ (infraction).</li>
            </ul>

            <h2>Comment les casinos vérifient-ils ?</h2>
            <p>Ne pensez pas pouvoir passer entre les mailles du filet. Les casinos ne vérifient pas vos mises en temps réel. Ils le font <strong>lorsque vous demandez un retrait</strong>.</p>
            <p>Le service financier lance un script automatisé qui scanne l'intégralité de vos spins. Si le script détecte un seul pari de 5,01€ au lieu de 5,00€, le retrait est bloqué, le bonus annulé, et les gains confisqués.</p>

            <h2>Y a-t-il des casinos sans Max Bet ?</h2>
            <p>Oui, mais ils sont rares. Certains casinos de très haut vol ou 100% Crypto (comme Stake pour les VIPs) ne fixent pas de Max Bet sur certains bonus, ou proposent des offres de cashback pur (qui sont dépourvues de conditions de mise).</p>
            
            <div className="mt-8 text-center">
              <Link href="/top-casino" className="inline-block px-8 py-4 bg-gold text-slate-900 font-bold rounded-xl hover:bg-gold/90 transition-colors">
                Découvrir nos casinos avec les bonus les plus clairs
              </Link>
            </div>
          </div>
        </div>

        {/* Section FAQ */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-2xl text-white mb-6">Questions Fréquentes (FAQ)</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="font-display font-bold text-white text-base">
                  {faq.question}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

      </article>

      {/* SCHEMAS JSON-LD SEO */}
      <BreadcrumbSchema 
        items={[
          { name: "Accueil", url: "https://frenchcasino.net/" },
          { name: "Max Bet", url: "https://frenchcasino.net/max-bet-casino" }
        ]} 
      />
      <FAQSchema items={faqs} />
    </>
  )
}
