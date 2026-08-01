'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Globe, Target, LayoutDashboard, Shield } from 'lucide-react'

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/connexion')
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Recruiter SaaS Top Navigation Bar */}
      <header className="h-16 border-b border-amber-900/40 bg-amber-950/20 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo & Recruiter Badge */}
        <div className="flex items-center gap-4">
          <Link href="/recruiter" className="flex items-center gap-2">
            <span className="font-display font-extrabold text-base text-white">
              French<span className="text-gradient-gold">Casino</span>
              <span className="text-[10px] uppercase font-mono text-amber-400 bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.5 rounded ml-1.5 font-bold">
                Espace Recruteur
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-800/30 text-[11px] text-amber-200">
            <Target className="w-3.5 h-3.5 text-gold" />
            <span>Gestion d'Équipe & Recrutement Réseau</span>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3">
          
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold text-purple-300 hover:text-white bg-purple-900/30 border border-purple-800 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Affilié</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold text-red-300 hover:text-white bg-red-900/30 border border-red-800 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Site Vitrine</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900 border border-red-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>

        </div>

      </header>

      {/* Main Recruiter Body */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6">
        {children}
      </main>

    </div>
  )
}
