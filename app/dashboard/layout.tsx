'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Link as LinkIcon,
  BarChart3,
  DollarSign,
  CreditCard,
  Lock,
  MessageSquare,
  Users,
  LogOut,
  Globe,
  Bell,
  ChevronDown,
  ShieldCheck
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/connexion')
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 flex flex-col font-sans antialiased">
      
      {/* SaaS Application Top Navigation Bar */}
      <header className="h-16 border-b border-surface-border/80 bg-surface/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
        
        {/* App Logo & Status */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-900 border border-primary-light/40 flex items-center justify-center shadow-purple-glow">
              <span className="text-base">🎰</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                French<span className="text-gradient-gold">Casino</span>
                <span className="text-[9px] uppercase font-mono text-emerald bg-emerald/10 border border-emerald/30 px-1.5 py-0.2 rounded font-bold">
                  App Affilié
                </span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span>Serveurs Supabase & Realtime 100% Opérationnels</span>
          </div>
        </div>

        {/* Right Application Tools */}
        <div className="flex items-center gap-3">
          
          {/* Virement Express Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-surface-card px-3.5 py-1.5 rounded-xl border border-gold/30">
            <span className="text-[11px] text-slate-400 font-medium">Solde Réseau :</span>
            <span className="text-sm font-bold font-mono text-gradient-gold">1 420.00 €</span>
          </div>

          {/* Return to Public Website */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Site Vitrine Public</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900 border border-red-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>

        </div>

      </header>

      {/* Main SaaS Web App Shell Body */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6">
        {children}
      </main>

    </div>
  )
}
