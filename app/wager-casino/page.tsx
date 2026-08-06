import React from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'
import { FAQSchema, FAQItem } from '@/components/schema/FAQSchema'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Wager Casino : Tout comprendre sur les exigences de mise (2026)',
  description: "Découvrez ce qu'est le wager au casino en ligne, comment le calculer facilement et nos astuces pour le compléter afin de retirer vos gains de bonus.",
  alternates: {
    canonical: 'https://frenchcasino.net/wager-casino',
  }
}

const faqs: FAQItem[] = [
  {
    question: "Qu'est-ce qu'un wager au casino ?",
    answer: "Le wager (ou exigence de mise) est le montant total qu'un joueur doit miser avant de pouvoir retirer les gains issus d'un bonus. Par exemple, un wager x30 sur un bonus de 100€ signifie qu'il faut miser 3000€ en tout."
  },
  {
    question: "Quelle est la différence entre un wager sticky et non-sticky ?",
    answer: "Un wager 'non-sticky' s'applique uniquement au montant du bonus. Vous jouez d'abord votre argent réel et pouvez retirer à tout moment. Un 'sticky' s'applique au dépôt + bonus, vous bloquant jusqu'à la fin du wager."
  },
  {
    question: "Peut-on annuler un wager en cours ?",
    answer: "Oui, la plupart des casinos permettent d'annuler un bonus actif. Cependant, vous perdrez le montant du bonus et tous les gains générés grâce à celui-ci."
  }
]

export default function WagerCasinoPage() {
  return (
    <>
      <PageHero
        badgeIcon={<BookOpen className="w-4 h-4 text-gold" />}
        badgeText="Guide Expert SEO"
        title={
          <span className="text-3xl sm:text-4xl md:text-5xl leading-tight">
            Comprendre le <span className="text-gradient-gold">Wager</span> au Casino
          </span>
        }
        description="Le guide ultime pour déjouer les pièges des exigences de mise, calculer votre wager et retirer vos gains rapidement."
      />

      <article className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 relative mb-12">
          <div className="prose prose-invert prose-purple max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h3:text-xl prose-h3:text-slate-200 prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-slate-300 prose-li:my-2 prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-strong:font-bold">
            <h2>Définition : Qu'est-ce que le wager ?</h2>
            <p>Dans l'univers du casino en ligne, le terme <strong>wager</strong> (souvent traduit par "exigences de mise" ou "conditions de mise") est omniprésent. Il représente le nombre de fois que vous devez jouer le montant d'un bonus avant que celui-ci ne soit converti en argent réel retirable.</p>
            <p>Les casinos offrent des bonus généreux pour attirer de nouveaux joueurs, mais le wager est leur assurance : il évite que les joueurs ne s'inscrivent, prennent le bonus, et le retirent immédiatement sans jamais jouer.</p>

            <h2>Comment calculer son Wager facilement ?</h2>
            <p>Le calcul est simple. La formule dépend si le casino applique le wager uniquement sur le bonus, ou sur le dépôt + bonus.</p>
            <h3>1. Le Wager sur le Bonus uniquement (Idéal)</h3>
            <p>Si vous déposez 100€ et recevez 100€ de bonus avec un wager de x30 sur le bonus :</p>
            <ul>
              <li>Montant à miser : 100€ (Bonus) x 30 = <strong>3 000€</strong>.</li>
            </ul>
            
            <h3>2. Le Wager sur le Dépôt + Bonus (À éviter si possible)</h3>
            <p>Si le casino impose un wager x30 sur le montant total :</p>
            <ul>
              <li>Montant à miser : (100€ + 100€) x 30 = <strong>6 000€</strong>.</li>
            </ul>

            <h2>Wager Non-Sticky vs Wager Sticky</h2>
            <p>C'est la différence la plus importante à connaître avant de déposer :</p>
            <ul>
              <li><strong>Le bonus Non-Sticky (Parachute) :</strong> Vous jouez d'abord avec votre argent réel. Si vous gagnez gros, vous pouvez annuler votre solde bonus et retirer vos gains immédiatement, sans avoir à compléter le wager. Le wager ne s'active que si votre solde d'argent réel tombe à zéro.</li>
              <li><strong>Le bonus Sticky :</strong> Votre dépôt et votre bonus sont liés. Vous ne pouvez absolument rien retirer tant que l'exigence de mise n'est pas remplie à 100%.</li>
            </ul>

            <h2>Les 3 règles d'or pour réussir son wager</h2>
            <ol>
              <li><strong>Vérifiez la règle de la mise maximale :</strong> La plupart des casinos interdisent de miser plus de 5€ par tour tant qu'un bonus est actif (Max Bet rule).</li>
              <li><strong>Jouez aux Machines à sous :</strong> Les slots contribuent généralement à 100% au wager. Les jeux de table (Blackjack, Roulette) ou le Live Casino ne contribuent souvent qu'à 10% ou 5%, voire 0%.</li>
              <li><strong>Vérifiez les jeux interdits :</strong> Lisez les Termes et Conditions. Certaines machines à sous (très volatiles ou avec des RTP très élevés) sont exclues de la progression du wager.</li>
            </ol>
            
            <div className="mt-8 text-center">
              <Link href="/top-casino" className="inline-block px-8 py-4 bg-gold text-slate-900 font-bold rounded-xl hover:bg-gold/90 transition-colors">
                Voir les casinos avec les meilleurs Wagers
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
          { name: "Wager Casino", url: "https://frenchcasino.net/wager-casino" }
        ]} 
      />
      <FAQSchema items={faqs} />
    </>
  )
}
