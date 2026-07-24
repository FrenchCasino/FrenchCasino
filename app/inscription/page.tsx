'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function InscriptionPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'affiliate',
        },
      },
    })

    if (error) {
      setErrorMsg(error.message || 'Erreur lors de la création du compte.')
      setLoading(false)
      return
    }

    // Notification Telegram Admin
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_affiliate',
          message: `Email : <b>${email}</b>\nNom : <b>${fullName}</b>\n\nConnectez-vous à l'espace Admin pour valider ce compte.`
        })
      })
    } catch (e) {
      console.error("Telegram error:", e)
    }

    setSuccessMsg('Compte affilié créé avec succès ! Un e-mail de confirmation vous a été envoyé.')
    setLoading(false)
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-gold/30 relative overflow-hidden shadow-2xl">
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
            Rejoindre le Réseau d&apos;Affiliation
          </h1>
          <p className="text-xs text-slate-400">
            Commencez à générer des commissions à partir de 30% RevShare
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald/20 border border-emerald/40 text-emerald text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nom Complet ou Pseudo</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full bg-surface border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre.email@domaine.fr"
                className="w-full bg-surface border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                className="w-full bg-surface border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : 'Créer Mon Compte Affilié'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Déjà un compte ?{' '}
          <Link href="/connexion" className="text-primary-light hover:underline font-semibold">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}
