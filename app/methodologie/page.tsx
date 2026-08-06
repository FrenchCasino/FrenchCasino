import React from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'
import { FAQSchema, FAQItem } from '@/components/schema/FAQSchema'
import { Microscope } from 'lucide-react'
import { METHODOLOGIE_NOTATION } from '@/lib/data/casinos'
import Link from 'next/link'

export const metadata = {
  title: 'Notre Méthodologie : Comment nous testons les casinos en ligne',
  description: 'Découvrez en toute transparence comment l\'équipe de FrenchCasino teste, évalue et classe les casinos en ligne. Nos critères stricts et notre processus d\'audit.',
  alternates: {
    canonical: 'https://frenchcasino.net/methodologie',
  }
}

const faqs: FAQItem[] = [
  {
    question: "Les casinos paient-ils pour être bien classés ?",
    answer: "Non. Bien que nous percevions une commission d'affiliation si vous vous inscrivez via nos liens (ce qui fait vivre le site), notre classement est basé à 100% sur nos critères stricts. Si un casino refuse de payer un joueur de manière injustifiée, il est banni du site, peu importe les accords commerciaux."
  },
  {
    question: "Testez-vous vraiment les casinos en argent réel ?",
    answer: "Oui, c'est la base de notre méthodologie. Nous déposons de l'argent réel de manière anonyme, testons le support client, jouons avec et sans bonus, et effectuons des demandes de retrait pour vérifier les délais réels."
  },
  {
    question: "Mettez-vous à jour vos avis ?",
    answer: "Notre équipe repasse sur chaque fiche casino tous les mois. Si un casino change ses conditions générales (baisse des limites de retrait, augmentation du wager), sa note est immédiatement revue à la baisse."
  }
]

export default function MethodologiePage() {
  return (
    <>
      <PageHero
        badgeIcon={<Microscope className="w-4 h-4 text-gold" />}
        badgeText="Transparence Totale"
        title={
          <span className="text-3xl sm:text-4xl md:text-5xl leading-tight">
            Notre <span className="text-gradient-gold">Méthodologie</span> d'Évaluation
          </span>
        }
        description="Parce que la confiance se gagne. Découvrez comment nous séparons les casinos d'exception des arnaques."
      />

      <article className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 relative mb-12">
          <div className="prose prose-invert prose-purple max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h3:text-xl prose-h3:text-slate-200 prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-slate-300 prose-li:my-2 prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-strong:font-bold">
            <h2>L'importance d'un avis indépendant</h2>
            <p>Le marché du casino en ligne francophone est inondé de sites promettant monts et merveilles. Malheureusement, beaucoup de comparateurs se contentent de lister les casinos qui paient les meilleures commissions, sans jamais les tester. Chez <strong>FrenchCasino</strong>, nous avons pris le parti de l'honnêteté et de l'intégrité.</p>

            <h2>Notre Processus de Test en 4 Étapes</h2>
            <p>Chaque casino listé sur notre site subit un audit complet d'une durée minimale de deux semaines :</p>
            <ol>
              <li><strong>Vérification Légale :</strong> Nous épluchons le registre de la licence (Curaçao, MGA), vérifions la société mère et l'historique de ses autres marques. S'il y a des plaintes non résolues sur des forums anglophones, le processus s'arrête ici.</li>
              <li><strong>Le Test du Dépôt Anonyme :</strong> Un de nos testeurs crée un compte sans utiliser de lien affilié, fait un dépôt en crypto et un dépôt par carte, et accepte le bonus de bienvenue.</li>
              <li><strong>L'Épreuve du Wager et du Support :</strong> Nous posons des questions complexes au support (Live Chat) à 2h du matin pour vérifier leur efficacité, et nous épluchons les T&C (Termes et Conditions) à la recherche de clauses abusives (limite de gain sous bonus, frais cachés).</li>
              <li><strong>Le Test du Retrait :</strong> Nous demandons un retrait pour vérifier la procédure KYC et chronométrer le temps réel de paiement.</li>
            </ol>

            <h2>Nos Critères de Notation Pondérés</h2>
            <p>Notre algorithme de notation est précis et mathématique, voici les critères que nous évaluons :</p>
            <ul>
              {METHODOLOGIE_NOTATION.map((critere, idx) => (
                <li key={idx}>
                  <strong>{critere.critere} ({critere.poids}) :</strong> {critere.description}
                </li>
              ))}
            </ul>

            <h2>Notre liste noire (Blacklist)</h2>
            <p>Nous n'hésitons pas à blacklister publiquement un casino si nous constatons l'une de ces infractions graves :</p>
            <ul>
              <li>Refus de paiement de gains légitimes (sans motif valable).</li>
              <li>Modification des Termes et Conditions <em>après</em> qu'un joueur ait gagné.</li>
              <li>Utilisation de jeux piratés ou de faux serveurs (RTP manipulé).</li>
              <li>Spam intensif et appels téléphoniques harcelants.</li>
            </ul>
            
            <div className="mt-8 text-center">
              <Link href="/top-casino" className="inline-block px-8 py-4 bg-gold text-slate-900 font-bold rounded-xl hover:bg-gold/90 transition-colors">
                Découvrir le Top 10 issu de nos tests
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
          { name: "Méthodologie", url: "https://frenchcasino.net/methodologie" }
        ]} 
      />
      <FAQSchema items={faqs} />
    </>
  )
}
