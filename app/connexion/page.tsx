'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, UserCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message || 'Identifiants incorrects.')
      setLoading(false)
      return
    }

    // Récupération rôle utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user?.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Profile error:", profileError)
    }

    setLoading(false)

    router.refresh()
    if (profile?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-surface-border relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-900 border border-primary-light/30 flex items-center justify-center shadow-purple-glow">
              <span className="text-xl">🎰</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">
              French<span className="text-gradient-gold">Casino</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-xl text-white pt-2">
            Espace Membre Affilié & Admin
          </h1>
          <p className="text-xs text-slate-400">
            Connectez-vous pour accéder à vos liens, commissions et statistiques
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="affilie@frenchcasino.net"
                className="w-full bg-surface border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Mot de passe</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 shadow-purple-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Pas encore affilié ?{' '}
          <Link href="/inscription" className="text-gold hover:underline font-semibold">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  )
}
