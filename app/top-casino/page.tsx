import React from 'react'
import Link from 'next/link'
import { CASINOS_MOCK, METHODOLOGIE_NOTATION } from '@/lib/data/casinos'
import { CasinoCard } from '@/components/ui/CasinoCard'
import { Award, ShieldCheck, Check, Star, Lock, Zap } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export const metadata = {
  title: 'Classement des Casinos en Ligne les Plus Fiables (2026) — FrenchCasino',
  description: 'Classement de fiabilité des casinos en ligne en France. Analyse des licences officielles, rapidité des retraits et transparence de la grille de notation.',
}

export default function TopCasinoPage() {
  return (
    <>
      <PageHero
        badgeIcon={<Award className="w-4 h-4 text-gold" />}
        badgeText="Sélection exclusive & indépendante"
        title={
          <>
            French Casino · Top Casinos <span className="text-gradient-gold">2026</span>
          </>
        }
        description={
          <>
            <p className="text-sm uppercase tracking-wider text-gold mb-6 font-bold">Sélection premium · Joueurs FR · Indépendant</p>
            <p>
              Chaque année, French Casino analyse des dizaines de plateformes pour établir un classement fiable, transparent et 100 % indépendant des meilleurs casinos en ligne pour les joueurs français.
            </p>
            <p>
              Pour figurer dans notre Top 2026, chaque site répond à des critères stricts : bonus attractifs, retraits rapides, support réactif, sécurité renforcée — basé sur des tests réels.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">🎁 Bonus attractifs</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">⚡ Retraits rapides</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">🔒 Sécurité renforcée</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">📱 Mobile first</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">⭐ Tests réels</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">🛡️ Sites vérifiés</span>
          <span className="flex items-center gap-2 text-sm text-slate-200 bg-surface-card px-4 py-2 rounded-full border border-slate-700">🇫🇷 FR acceptés</span>
        </div>
      </PageHero>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-12">



      {/* Classement Liste & Podium */}
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Le Podium <span className="text-gradient-gold">2026</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            L'élite des casinos en ligne en France. Testés, audités et validés par nos experts pour des retraits ultra-rapides et une fiabilité sans faille.
          </p>
        </div>

        {/* PODIUM UI */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 sm:gap-6 px-4 pt-10">
          
          {/* Rang 2 (Argent) */}
          <div className="order-2 md:order-1 flex-1 max-w-[280px] w-full flex flex-col items-center">
            <div className="group w-full glass-panel border border-slate-700/50 bg-gradient-to-t from-slate-800/40 to-slate-800/10 p-6 rounded-t-3xl relative transform md:translate-y-8 shadow-[0_0_30px_rgba(148,163,184,0.1)] hover:-translate-y-0 hover:shadow-[0_0_40px_rgba(148,163,184,0.25)] transition-all duration-500">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full border-4 border-[#0a0a0f] flex flex-col items-center justify-center shadow-lg shadow-slate-400/30 animate-[float_4s_ease-in-out_infinite_0.5s] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <span className="text-2xl drop-shadow-md">🥈</span>
                <span className="text-[10px] font-bold text-slate-800 tracking-wider drop-shadow-sm">2ND</span>
              </div>
              <div className="mt-8 text-center space-y-3">
                <h3 className="font-display font-bold text-xl text-white">{CASINOS_MOCK[1].name}</h3>
                <div className="flex justify-center items-center gap-1 text-slate-300 bg-slate-800/50 px-3 py-1 rounded-full text-xs font-semibold mx-auto w-fit border border-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {CASINOS_MOCK[1].noteFiabilite}/5
                </div>
                <div className="pt-3 border-t border-slate-700/50">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Bonus de Bienvenue</span>
                  <span className="font-bold text-sm text-white">{CASINOS_MOCK[1].bonusDepot}</span>
                </div>
                <a href={CASINOS_MOCK[1].lienAffilie} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full py-2.5 bg-slate-300 hover:bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors">Jouer</a>
              </div>
            </div>
          </div>

          {/* Rang 1 (Or) */}
          <div className="order-1 md:order-2 flex-1 max-w-[320px] w-full flex flex-col items-center z-10">
            <div className="group w-full glass-panel border-2 border-gold/60 bg-gradient-to-t from-amber-900/50 to-amber-900/10 p-6 sm:p-8 rounded-t-3xl relative shadow-[0_0_60px_rgba(251,191,36,0.2)] hover:-translate-y-4 hover:shadow-[0_0_80px_rgba(251,191,36,0.4)] transition-all duration-500">
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-gold to-yellow-300 rounded-full border-4 border-[#0a0a0f] flex flex-col items-center justify-center shadow-xl shadow-gold/50 animate-float group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <span className="text-4xl drop-shadow-md">👑</span>
                <span className="text-xs font-black text-amber-950 mt-1 tracking-widest drop-shadow-sm">1ER</span>
              </div>
              <div className="mt-10 text-center space-y-4">
                <div className="inline-block px-3 py-1 bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-widest rounded-full mb-1">№ 1 — Meilleur casino FR 2026</div>
                <h3 className="font-display font-black text-2xl text-white">{CASINOS_MOCK[0].name}</h3>
                <div className="flex justify-center items-center gap-1 text-gold bg-gold/10 px-4 py-1.5 rounded-full text-sm font-bold mx-auto w-fit border border-gold/20">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  {CASINOS_MOCK[0].noteFiabilite}/5
                </div>
                <div className="pt-4 border-t border-gold/20">
                  <span className="block text-[10px] uppercase tracking-wider text-amber-400/80 mb-1">Offre Exclusive</span>
                  <span className="font-extrabold text-base text-gold">{CASINOS_MOCK[0].bonusDepot}</span>
                  {CASINOS_MOCK[0].bonusSansDepot && (
                    <span className="block text-xs font-semibold text-emerald mt-1">+ {CASINOS_MOCK[0].bonusSansDepot}</span>
                  )}
                </div>
                <a href={CASINOS_MOCK[0].lienAffilie} target="_blank" rel="noopener noreferrer" className="mt-6 block w-full py-3.5 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-gold-glow animate-pulse-glow hover:animate-none transition-all transform hover:scale-105 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] duration-300">Récupérer le Bonus</a>
              </div>
            </div>
          </div>

          {/* Rang 3 (Bronze) */}
          <div className="order-3 md:order-3 flex-1 max-w-[280px] w-full flex flex-col items-center">
            <div className="group w-full glass-panel border border-orange-700/40 bg-gradient-to-t from-orange-950/50 to-slate-800/80 p-6 rounded-t-3xl relative transform md:translate-y-12 shadow-[0_0_30px_rgba(194,65,12,0.15)] hover:translate-y-4 hover:shadow-[0_0_40px_rgba(194,65,12,0.3)] transition-all duration-500">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-4 border-[#0a0a0f] flex flex-col items-center justify-center shadow-lg shadow-orange-500/30 animate-[float_4s_ease-in-out_infinite_1s] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <span className="text-2xl drop-shadow-md">🥉</span>
                <span className="text-[10px] font-bold text-orange-950 tracking-wider drop-shadow-sm">3EME</span>
              </div>
              <div className="mt-8 text-center space-y-3">
                <h3 className="font-display font-bold text-xl text-white">{CASINOS_MOCK[2].name}</h3>
                <div className="flex justify-center items-center gap-1 text-orange-300 bg-orange-900/30 px-3 py-1 rounded-full text-xs font-semibold mx-auto w-fit border border-orange-800/50">
                  <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  {CASINOS_MOCK[2].noteFiabilite}/5
                </div>
                <div className="pt-3 border-t border-slate-700/50">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Bonus de Bienvenue</span>
                  <span className="font-bold text-sm text-white">{CASINOS_MOCK[2].bonusDepot}</span>
                </div>
                <a href={CASINOS_MOCK[2].lienAffilie} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors">Jouer</a>
              </div>
            </div>
          </div>
          
        </div>

        {/* Le Reste du Classement */}
        <div className="space-y-6 pt-10">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Suite du classement — Rang 4 à 15
          </h2>

          <div className="space-y-4">
            {CASINOS_MOCK.slice(3, 15).map((casino, idx) => (
              <CasinoCard key={casino.id} casino={casino} rank={idx + 4} />
            ))}
          </div>
        </div>

        {/* Classement bonus inscription */}
        <div className="space-y-6 pt-10">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Classement bonus inscription — Rang 16
          </h2>

          <div className="space-y-4">
            {CASINOS_MOCK.slice(15).map((casino, idx) => (
              <CasinoCard key={casino.id} casino={casino} rank={idx + 16} />
            ))}
          </div>
        </div>
      </div>

      {/* Grille de Méthodologie */}
      <div className="space-y-6 mt-16 pt-8 border-t border-slate-800">
        <div className="flex items-center justify-between pb-4">
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

    </div>
    </>
  )
}
