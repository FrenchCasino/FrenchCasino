'use client'

import React from 'react'
import Link from 'next/link'
import { AlertTriangle, ShieldAlert, PhoneCall } from 'lucide-react'

export function ResponsibleGamingBanner() {
  return (
    <div className="w-full bg-surface-card/90 border-t border-b border-gold/20 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gold/10 border border-gold/30 text-gold flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-xs tracking-wider">
                -18
              </span>
              <span>Jeu Responsable & Prévention</span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Le jeu comporte des risques : endettement, dépendance, isolement. Jouez de manière responsable et avec modération.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <a
            href="tel:0974751313"
            className="flex items-center gap-2 bg-surface border border-slate-700 hover:border-gold/50 text-slate-200 hover:text-gold px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-gold" />
            <span>Joueurs Info Service : <strong className="text-white">09 74 75 13 13</strong></span>
          </a>
          <a
            href="https://www.joueurs-info-service.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-light hover:underline underline-offset-4"
          >
            joueurs-info-service.fr →
          </a>
        </div>
      </div>
    </div>
  )
}
