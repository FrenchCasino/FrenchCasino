'use client'

import React, { useState } from 'react'
import { Scale, Send, CheckCircle2, AlertCircle } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'

export default function LitigePage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    casinoName: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Notification Telegram Admin
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'litige_player',
          message: `Joueur : <b>${formData.pseudo}</b> (${formData.email})\nCasino : <b>${formData.casinoName}</b>\nSujet : <b>${formData.subject}</b>\n\n<i>${formData.message}</i>`
        })
      })
    } catch (err) {
      console.error('Failed to send litige notification', err)
    }

    setSubmitted(true)
  }

  return (
    <>
      <PageHero
        badgeIcon={<Scale className="w-4 h-4 text-amber-400" />}
        badgeText="Une assistance gratuite pour les joueurs FrenchCasino"
        title={
          <>
            Service de <span className="text-amber-400">Médiation & Litige Casino</span>
          </>
        }
        description={
          <>
            <p>
              Un problème avec la validation d&apos;un retrait ou un blocage injustifié sur un casino partenaire ? Grâce à nos contacts directs auprès de la direction des établissements référencés, nous intervenons pour vous aider à résoudre votre litige dans les plus brefs délais.
            </p>
          </>
        }
      />
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">

      {submitted ? (
        <div className="glass-panel p-8 rounded-2xl border border-emerald/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald/20 text-emerald flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            Demande de médiation transmise avec succès !
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Notre responsable litiges étudiera votre dossier et prendra directement contact avec le manager du casino concerné sous 24 à 48 heures.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="font-display font-bold text-xl text-white">
            Déposer une réclamation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Votre Pseudo Joueur sur le casino *</label>
              <input
                type="text"
                required
                value={formData.pseudo}
                onChange={e => setFormData({...formData, pseudo: e.target.value})}
                placeholder="Ex: HighRoller75"
                className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Votre Adresse Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="Ex: contact@exemple.fr"
                className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nom du Casino Concerné *</label>
              <input
                type="text"
                required
                value={formData.casinoName}
                onChange={e => setFormData({...formData, casinoName: e.target.value})}
                placeholder="Ex: MonteCryptos Royal"
                className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Objet du Litige *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="Ex: Retrait de 500€ en attente depuis 5 jours"
                className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description Détaillée du Problème *</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="Précisez la date de votre dépôt, le montant bloqué et les échanges déjà réalisés avec leur support client..."
              className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer le Dossier de Médiation</span>
          </button>
        </form>
      )}
    </div>
    </>
  )
}
