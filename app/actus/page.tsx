import React from 'react'
import Link from 'next/link'
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export const metadata = {
  title: 'La Voix du Casino — Actualités iGaming & Guides Stratégiques (2026)',
  description: 'Blog officiel de FrenchCasino : analyses des nouvelles machines à sous, conseils wager, guides crypto et stratégies de jeu.',
}

const ARTICLES_MOCK = [
  {
    id: 1,
    title: "Comment fonctionne le Wager et comment le compléter sans perdre son solde ?",
    slug: "comprendre-wager-bonus-casino",
    date: "22 Juillet 2026",
    readTime: "5 min de lecture",
    category: "Guide Stratégique",
    excerpt: "Comprendre les exigences de mise (wager 30x, 40x) est indispensable pour réussir à retirer vos gains issus de bonus de bienvenue."
  },
  {
    id: 2,
    title: "Les Meilleurs Casinos Crypto 2026 : Pourquoi privilégier Bitcoin & USDT ?",
    slug: "meilleurs-casinos-crypto-2026",
    date: "18 Juillet 2026",
    readTime: "4 min de lecture",
    category: "Tendances iGaming",
    excerpt: "Retraits instantanés en moins de 15 minutes, absence de frais bancaires et anonymat relatif : découvrez notre comparatif crypto."
  },
  {
    id: 3,
    title: "Médiation Casino : Que faire en cas de problème de retrait de vos gains ?",
    slug: "guide-mediation-litige-casino",
    date: "10 Juillet 2026",
    readTime: "6 min de lecture",
    category: "Sécurité & Droits",
    excerpt: "Un guide étape par étape pour contacter le support, monter un dossier solide et solliciter notre médiateur FrenchCasino."
  }
]

export default function ActusPage() {
  return (
    <>
      <PageHero
        badgeIcon={<Newspaper className="w-4 h-4 text-gold" />}
        badgeText="La Voix du Casino"
        title={
          <>
            Actualités & <span className="text-gradient-gold">Guides iGaming</span>
          </>
        }
        description={
          <>
            <p>
              Analyses de stratégies, nouveautés réglementaires et astuces pour optimiser vos sessions de jeu.
            </p>
          </>
        }
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTICLES_MOCK.map((article) => (
          <div key={article.id} className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-gold uppercase tracking-wider bg-gold/10 px-2.5 py-1 rounded-md border border-gold/20 inline-block">
                {article.category}
              </span>
              <h2 className="font-display font-bold text-lg text-white group-hover:text-gold transition-colors">
                {article.title}
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
