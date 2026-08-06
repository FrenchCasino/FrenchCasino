'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ResponsibleGamingBanner } from './ResponsibleGamingBanner'
import { ShieldCheck, HeartHandshake, FileText, Scale, Facebook } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  // Ne pas afficher le footer public sur l'application Dashboard et Admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="w-full bg-surface border-t border-surface-border text-slate-400 mt-20">
      
      {/* Bannière Jeu Responsable intégrée au Footer */}
      <ResponsibleGamingBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Col 1 & 2: Branding & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-900 border border-primary-light/30 flex items-center justify-center shadow-purple-glow">
                <span className="text-lg">🎰</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                French<span className="text-gradient-gold">Casino</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-4">
              FrenchCasino est le guide comparateur N°1 de la communauté francophone. Nous analysons de manière indépendante les casinos en ligne les plus fiables (licences, délais de retrait, qualité du service client) et négocions des bonus sans dépôt et bonus de bienvenue exclusifs.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald" />
              <span>Transparence & Rédaction 100% Indépendante</span>
            </div>
            <div className="pt-4">
              <a href="https://www.facebook.com/profile.php?id=61581513551107" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 text-[#1877F2] transition-colors text-sm font-medium">
                <Facebook className="w-4 h-4" />
                Rejoignez-nous sur Facebook
              </a>
            </div>
          </div>

          {/* Col 3: Offres & Bonus */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Offres & Bonus
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/bonus-sans-depot" className="hover:text-gold transition-colors">
                  Bonus Sans Dépôt 🎁
                </Link>
              </li>
              <li>
                <Link href="/bonus-depot" className="hover:text-gold transition-colors">
                  Bonus de Dépôt
                </Link>
              </li>
              <li>
                <Link href="/top-casino" className="hover:text-gold transition-colors">
                  Classement Fiabilité 2026
                </Link>
              </li>
              <li>
                <Link href="/devenir-affilie" className="hover:text-primary-light transition-colors font-medium text-purple-300">
                  Programme d&apos;Affiliation 🔥
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Assistance */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Assistance & Infos
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/litige" className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-400">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Médiation / Litige</span>
                </Link>
              </li>
              <li>
                <Link href="/actus" className="hover:text-white transition-colors">
                  La Voix du Casino (Blog)
                </Link>
              </li>
              <li>
                <Link href="/notre-equipe" className="hover:text-white transition-colors">
                  À Propos de l&apos;Équipe
                </Link>
              </li>
              <li>
                <Link href="/jeu-responsable" className="hover:text-gold transition-colors">
                  Aide & Addiction
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Guides & SEO (Silo) */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Guides & Astuces
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/wager-casino" className="hover:text-gold transition-colors">
                  Le Wager Casino
                </Link>
              </li>
              <li>
                <Link href="/retrait-rapide" className="hover:text-gold transition-colors">
                  Retrait Rapide
                </Link>
              </li>
              <li>
                <Link href="/max-bet-casino" className="hover:text-gold transition-colors">
                  Règle du Max Bet
                </Link>
              </li>
              <li>
                <Link href="/casino-sans-kyc" className="hover:text-gold transition-colors">
                  Casino sans KYC
                </Link>
              </li>
              <li>
                <Link href="/casino-fiable" className="hover:text-gold transition-colors">
                  Casino Fiable
                </Link>
              </li>
              <li>
                <Link href="/methodologie" className="hover:text-gold transition-colors">
                  Notre Méthodologie
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 6: Conformité Légale */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Mentions Légales
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/mentions-legales" className="hover:text-slate-200 transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-slate-200 transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/jeu-responsable" className="hover:text-slate-200 transition-colors">
                  Charte Jeu Responsable
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-8 border-t border-surface-border/50 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong>Avertissement Légal :</strong> FrenchCasino est un site d&apos;information et de comparaison indépendant. Les jeux d&apos;argent sont strictement interdits aux mineurs de moins de 18 ans. Les bonus et offres présentés sont soumis aux termes et conditions de chaque opérateur respectif (licences Malte MGA, Curaçao eGaming, Anjouan, etc.). FrenchCasino ne constitue pas un opérateur de jeux en ligne direct. Vérifiez toujours la législation en vigueur dans votre juridiction avant d&apos;effectuer un dépôt.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} FrenchCasino <Link href="/admin" className="hover:text-slate-300 transition-colors">V2</Link>. Tous droits réservés.</span>
            <span className="font-mono text-[10px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">
              Développé avec Next.js 14 & Supabase
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
