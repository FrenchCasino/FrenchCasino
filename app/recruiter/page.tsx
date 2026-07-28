'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, DollarSign, ArrowUpRight, Copy, Loader2, Target, Phone, Send } from 'lucide-react'

export default function RecruiterDashboard() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [recruiterName, setRecruiterName] = useState('')
  const [recruiterLink, setRecruiterLink] = useState('')
  const [team, setTeam] = useState<any[]>([])
  
  // Totals
  const [totalTeamEarnings, setTotalTeamEarnings] = useState(0)

  useEffect(() => {
    async function loadRecruiterData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/connexion'
        return
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        if (profile.role !== 'recruiter' && profile.role !== 'admin') {
          window.location.href = '/dashboard'
          return
        }
        setRecruiterName(profile.full_name || 'Recruteur')
        setRecruiterLink(`${window.location.origin}/inscription?ref=${user.id}`)
      }

      // Fetch assigned affiliates
      const { data: affiliates } = await supabase
        .from('affiliates')
        .select(`
          *,
          profiles!affiliates_id_fkey (
            full_name,
            email,
            role
          )
        `)
        .eq('recruiter_id', user.id)

      if (affiliates) {
        setTeam(affiliates)
        const total = affiliates.reduce((acc, a) => acc + (Number(a.total_earned) || 0), 0)
        setTotalTeamEarnings(total)
      }

      setLoading(false)
    }

    loadRecruiterData()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-gold animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Espace Manager / Recruteur</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Bonjour, {recruiterName}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Gérez, motivez et développez votre réseau d'affiliés.</p>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate-800 text-right min-w-[200px]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Gains Générés (Équipe)</span>
          <span className="text-2xl font-bold font-mono text-gradient-gold">{totalTeamEarnings.toLocaleString()} €</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* L'Équipe */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" /> Mon Équipe
            </h3>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded font-bold">
              {team.length} Affiliés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-surface/50 font-mono text-[10px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Affilié</th>
                  <th className="p-3">Contact Rapide</th>
                  <th className="p-3 text-center">Statut</th>
                  <th className="p-3 text-right">Gains Générés</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {team.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Vous n'avez pas encore d'affiliés dans votre équipe.
                    </td>
                  </tr>
                ) : team.map(member => (
                  <tr key={member.id} className="hover:bg-surface/30 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{member.profiles?.full_name || 'Inconnu'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{member.profiles?.email}</div>
                    </td>
                    <td className="p-3 space-y-1">
                      {member.contact_telegram && (
                        <a href={`https://t.me/${member.contact_telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline">
                          <Send className="w-3 h-3" /> {member.contact_telegram}
                        </a>
                      )}
                      {member.contact_whatsapp && (
                        <div className="flex items-center gap-1 text-[11px] text-green-400">
                          <Phone className="w-3 h-3" /> {member.contact_whatsapp}
                        </div>
                      )}
                      {!member.contact_telegram && !member.contact_whatsapp && (
                        <span className="text-[11px] text-slate-500">Non renseigné</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        member.status === 'active' ? 'bg-emerald/20 text-emerald' : 
                        member.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-gold">
                      {(Number(member.total_earned) || 0).toLocaleString()} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outils & Aide */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Mon Lien de Recrutement</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Partagez ce lien à vos prospects. Grâce à ce lien unique, tout affilié qui s'inscrira sera **automatiquement ajouté à votre équipe** et vous toucherez une commission sur ses performances.
            </p>
            <div className="flex items-center gap-2 bg-[#0a0a0f] p-3 rounded-xl border border-slate-700">
              <span className="text-xs font-mono text-gold truncate flex-1">{recruiterLink}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(recruiterLink)}
                className="text-slate-400 hover:text-white"
                title="Copier le lien"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gold/20 bg-gold/5 space-y-4">
            <h3 className="font-display font-bold text-lg text-gold flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Rémunération
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              En tant que Manager, vous touchez un pourcentage de Master CPA sur les bénéfices générés par l'ensemble de votre équipe. 
            </p>
            <p className="text-xs text-slate-400 bg-black/40 p-3 rounded-lg border border-slate-800">
              Le calcul de votre commission et vos paiements mensuels sont gérés en direct par l'Administrateur FrenchCasino.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
