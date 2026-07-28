'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Suspense } from 'react'

function InscriptionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contactTelegram, setContactTelegram] = useState('')
  const [contactWhatsapp, setContactWhatsapp] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    const supabase = createClient()
    const signUpData: any = {
      full_name: fullName,
      role: 'affiliate',
      contact_telegram: contactTelegram,
      contact_whatsapp: contactWhatsapp,
      contact_phone: contactPhone,
    }
    if (ref) signUpData.recruiter_id = ref

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: signUpData,
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
            <img src="/logo.png" alt="French Casino Partners" className="h-10 sm:h-12 w-auto mx-auto object-contain" />
          </Link>
          <h1 className="font-display font-bold text-xl text-white pt-2">
            Rejoindre le Réseau d&apos;Affiliation
          </h1>
          <p className="text-xs text-slate-400">
            Commencez à générer des commissions de 20€ à 70€ par joueur parrainé
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Téléphone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="Ex: 06 12 34 56 78"
                className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Telegram</label>
              <input
                type="text"
                value={contactTelegram}
                onChange={e => setContactTelegram(e.target.value)}
                placeholder="@pseudo"
                className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">WhatsApp</label>
              <input
                type="text"
                value={contactWhatsapp}
                onChange={e => setContactWhatsapp(e.target.value)}
                placeholder="Numéro WhatsApp"
                className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
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

export default function InscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gold border-t-transparent animate-spin"></div>
      </div>
    }>
      <InscriptionForm />
    </Suspense>
  )
}
