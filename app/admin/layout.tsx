'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Globe, Users, LayoutDashboard } from 'lucide-react'

export default function AdminLayout({
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
    <div className="min-h-screen bg-[#06050a] text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Admin SaaS Top Navigation Bar */}
      <header className="h-16 border-b border-red-900/40 bg-red-950/20 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-display font-extrabold text-base text-white">
              French<span className="text-gradient-gold">Casino</span>
              <span className="text-[10px] uppercase font-mono text-red-400 bg-red-950 border border-red-800 px-1.5 py-0.2 rounded ml-1.5">
                Admin Console
              </span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-300 hover:text-white bg-purple-900/30 border border-purple-800 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Affilié</span>
          </Link>

          <Link
            href="/recruiter"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 hover:text-white bg-amber-900/30 border border-amber-800 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Recruteur</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Site Vitrine</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white bg-red-950 border border-red-900 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>

      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6">
        {children}
      </main>

    </div>
  )
}
