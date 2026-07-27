'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, ArrowRight, AlertCircle, LayoutDashboard, Target, ShieldCheck } from 'lucide-react'

function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'affiliate'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Configuration visuelle selon le type
  let title = "Espace Affilié"
  let subTitle = "Connectez-vous pour accéder à vos statistiques et liens"
  let Icon = LayoutDashboard
  let iconColor = "text-purple-400"
  let btnClass = "bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 shadow-purple-glow text-white"
  let bgBlur = "bg-primary/10"
  
  if (type === 'admin') {
    title = "Espace Administrateur"
    subTitle = "Accès sécurisé réservé à la gestion du site"
    Icon = ShieldCheck
    iconColor = "text-emerald"
    btnClass = "bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white border border-emerald/50"
    bgBlur = "bg-emerald/10"
  } else if (type === 'recruiter') {
    title = "Espace Recruteur"
    subTitle = "Gérez votre équipe d'affiliés et vos performances"
    Icon = Target
    iconColor = "text-gold"
    btnClass = "bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-400 hover:to-gold shadow-gold-glow text-black font-extrabold"
    bgBlur = "bg-gold/10"
  }

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

    // On respecte le choix du formulaire (type) si l'utilisateur y a le droit
    if (type === 'admin' && profile?.role === 'admin') {
      window.location.href = '/admin'
    } else if (type === 'recruiter' && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      window.location.href = '/recruiter'
    } else if (type === 'affiliate') {
      window.location.href = '/dashboard'
    } else {
      // Fallback par défaut selon le rôle
      if (profile?.role === 'admin') window.location.href = '/admin'
      else if (profile?.role === 'recruiter') window.location.href = '/recruiter'
      else window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className={`w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-surface-border relative overflow-hidden shadow-2xl`}>
        <div className={`absolute top-0 right-0 w-40 h-40 blur-[50px] rounded-full pointer-events-none ${bgBlur}`} />

        <div className="text-center space-y-2 relative z-10">
          <div className="flex justify-center mb-4">
             <div className={`w-12 h-12 rounded-2xl bg-surface border border-slate-700 flex items-center justify-center shadow-lg`}>
               <Icon className={`w-6 h-6 ${iconColor}`} />
             </div>
          </div>
          
          <h1 className="font-display font-bold text-2xl text-white pt-2">
            Connexion {title}
          </h1>
          <p className="text-xs text-slate-400">
            {subTitle}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 relative z-10">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full bg-surface border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-slate-500 transition-colors"
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
                className="w-full bg-surface border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-slate-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${btnClass}`}
          >
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-400 relative z-10">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-gold hover:underline font-semibold">
            S'inscrire
          </Link>
          <div className="mt-4 pt-4">
             <Link href="/" className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
               ← Retour à l'accueil
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    }>
      <ConnexionForm />
    </Suspense>
  )
}
