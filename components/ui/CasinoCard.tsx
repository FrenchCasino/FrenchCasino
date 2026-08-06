'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Casino } from '@/lib/data/casinos'
import { Star, ShieldCheck, Zap, Gift, ExternalLink, ChevronRight, Check } from 'lucide-react'
import { FlagIcon } from '@/components/ui/FlagIcon'

interface CasinoCardProps {
  casino: Casino
  rank?: number
}

export function CasinoCard({ casino, rank }: CasinoCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`relative group rounded-2xl glass-panel glass-panel-hover p-5 sm:p-6 transition-all duration-300 ${
      casino.highlighted ? 'border-primary/50 shadow-purple-glow' : 'border-surface-border'
    }`}>
      
      {/* Badge Flottant en haut à droite */}
      {casino.badgeText && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="badge-gold px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
            <Zap className="w-3 h-3 text-gold" />
            {casino.badgeText}
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Infos Casino (Logo, Nom, Note) */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-[240px]">
          {rank && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-dark border border-gold/30 text-gold font-display font-bold text-sm shadow-inner shrink-0">
              #{rank}
            </div>
          )}

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-slate-700/80 p-2 flex items-center justify-center text-center font-bold text-lg text-white shadow-md group-hover:border-primary/50 transition-colors relative overflow-hidden shrink-0">
            {casino.logoUrl && !imgError ? (
              <Image 
                src={casino.logoUrl} 
                alt={`Logo officiel du casino en ligne ${casino.name}`}
                fill
                sizes="(max-width: 768px) 80px, 80px"
                className="object-contain p-1 drop-shadow-md rounded"
                onError={() => setImgError(true)}
                unoptimized={casino.logoUrl.endsWith('.gif')}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-purple-800 to-indigo-950 p-1 rounded">
                <span className="text-lg font-black tracking-widest text-gold drop-shadow-sm uppercase">
                  {casino.name.substring(0, 3)}
                </span>
                <span className="text-[9px] text-slate-300 font-semibold truncate max-w-[60px] uppercase">
                  {casino.name.split(' ')[0]}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Link href={`/casino/${casino.slug}`} className="hover:text-gold transition-colors">
              <h3 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                {casino.name}
                <div className="flex gap-1.5 ml-2 items-center">
                  {casino.allowedCountries?.includes('FR') && <FlagIcon country="FR" />}
                  {casino.allowedCountries?.includes('BE') && <FlagIcon country="BE" />}
                  {casino.allowedCountries?.includes('LU') && <FlagIcon country="LU" />}
                </div>
              </h3>
            </Link>
            
            {/* Note Star & Licence */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                <span>{casino.noteFiabilite.toFixed(1)}</span>
                <span className="text-slate-500 font-normal ml-0.5">/5</span>
              </div>
              <span className="text-slate-400 text-[11px] truncate max-w-[140px]" title={casino.licence}>
                {casino.licence.split(' ')[0]} Verified
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 pt-1">
              {casino.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-slate-700/60 text-slate-300 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section Centre : Offres & Bonus */}
        <div className="flex-1 w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-card/60 p-3.5 rounded-xl border border-surface-border/50">
          
          {/* Bonus Sans Dépôt */}
          <div className="flex flex-col justify-center space-y-1 p-2 rounded-lg bg-surface/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-purple-400" />
              Bonus Sans Dépôt
            </span>
            {casino.bonusSansDepot ? (
              <span className="text-xs sm:text-sm font-bold text-gradient-purple">
                {casino.bonusSansDepot}
              </span>
            ) : (
              <span className="text-xs text-slate-500 italic">
                Non disponible actuellement
              </span>
            )}
          </div>

          {/* Bonus Dépôt */}
          <div className="flex flex-col justify-center space-y-1 p-2 rounded-lg bg-surface/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-gold" />
              Bonus de Dépôt
            </span>
            <span className="text-xs sm:text-sm font-bold text-gradient-gold">
              {casino.bonusDepot}
            </span>
          </div>

          {/* Retraits & Wager */}
          <div className="col-span-1 sm:col-span-2 flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 px-1">
            <span>⚡ Delai Retrait : <strong className="text-slate-200">{casino.delaiRetrait}</strong></span>
            <span>🎯 Wager : <strong className="text-slate-200">{casino.wager}</strong></span>
          </div>
        </div>

        {/* Section Droite : CTA Affilié & Fiche */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center justify-center gap-2 w-full lg:w-48 flex-shrink-0">
          <a
            href={casino.lienAffilie}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="w-full text-center py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 shadow-purple-glow hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Obtenir le Bonus</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <Link
            href={`/casino/${casino.slug}`}
            className="w-full text-center py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-surface-card transition-colors flex items-center justify-center gap-1"
          >
            <span>Avis & Test détaillé</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  )
}
