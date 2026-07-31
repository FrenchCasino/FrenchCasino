'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Users,
  DollarSign,
  ArrowUpRight,
  Copy,
  Loader2,
  Target,
  Phone,
  Send,
  TrendingUp,
  MousePointerClick,
  CheckCircle2,
  Calendar,
  BarChart3
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { toast } from 'sonner'

export default function RecruiterDashboard() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [recruiterName, setRecruiterName] = useState('')
  const [recruiterLink, setRecruiterLink] = useState('')
  const [activeTab, setActiveTab] = useState<'team' | 'stats' | 'earnings'>('team')
  
  // Data state
  const [team, setTeam] = useState<any[]>([])
  const [teamClicks, setTeamClicks] = useState<any[]>([])
  const [teamComms, setTeamComms] = useState<any[]>([])
  const [recruiterComms, setRecruiterComms] = useState<any[]>([])
  const [recruiterBalance, setRecruiterBalance] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])

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

      // Fetch recruiter affiliate record for balance
      const { data: recAff } = await supabase
        .from('affiliates')
        .select('total_earned')
        .eq('id', user.id)
        .single()
      if (recAff) {
        setRecruiterBalance(Number(recAff.total_earned) || 0)
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

        const affiliateIds = affiliates.map(a => a.id)
        if (affiliateIds.length > 0) {
          // Fetch clicks for team
          const { data: clicks } = await supabase
            .from('casino_clicks')
            .select('*')
            .in('affiliate_id', affiliateIds)
          if (clicks) setTeamClicks(clicks)

          // Fetch commissions for team
          const { data: comms } = await supabase
            .from('commissions')
            .select('*')
            .in('affiliate_id', affiliateIds)
          if (comms) setTeamComms(comms)

          // Process chart data (last 7 days)
          const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - i)
            return d.toISOString().split('T')[0]
          }).reverse()

          const formattedChartData = last7Days.map(day => {
            const dayClicks = clicks?.filter(c => c.created_at.startsWith(day)).length || 0
            const dayComms = comms?.filter(c => c.created_at.startsWith(day) && (c.statut === 'validated' || c.statut === 'paid'))
            const dayCommsAmount = dayComms?.reduce((acc, c) => acc + (Number(c.montant) || 0), 0) || 0
            return {
              day: new Date(day).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
              clics: dayClicks,
              commissions: dayCommsAmount
            }
          })
          setChartData(formattedChartData)
        }
      }

      // Fetch recruiter commissions (15% details)
      const { data: recCommsData } = await supabase
        .from('recruiter_commissions')
        .select(`
          id,
          montant,
          created_at,
          affiliates (
            profiles!affiliates_id_fkey (
              full_name
            )
          )
        `)
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false })
      if (recCommsData) setRecruiterComms(recCommsData)

      setLoading(false)
    }

    loadRecruiterData()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Lien copié dans le presse-papiers !')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-gold animate-spin" />
    </div>
  )

  // Calculations for stats
  const totalClicksCount = teamClicks.length
  const totalCommissionsCount = teamComms.filter(c => c.statut === 'validated' || c.statut === 'paid').length
  const conversionRate = totalClicksCount > 0 ? ((totalCommissionsCount / totalClicksCount) * 100).toFixed(1) : '0'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Espace Manager / Recruteur</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Bonjour, {recruiterName}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Gérez, motivez et développez votre réseau d'affiliés.</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="bg-surface p-4 rounded-xl border border-slate-800 text-right min-w-[150px]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Gains Équipe</span>
            <span className="text-2xl font-bold font-mono text-gradient-gold">{totalTeamEarnings.toLocaleString()} €</span>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-gold/20 bg-gold/5 text-right min-w-[150px]">
            <span className="text-[10px] text-gold uppercase tracking-wider block">Mes Gains (15%)</span>
            <span className="text-2xl font-bold font-mono text-gold">{recruiterBalance.toLocaleString()} €</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'team'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mon Équipe</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'stats'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistiques</span>
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'earnings'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Historique des gains</span>
        </button>
      </div>

      {/* TAB CONTENT: TEAM */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* L'Équipe */}
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" /> Liste des Affiliés
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
                  onClick={() => copyToClipboard(recruiterLink)}
                  className="text-slate-400 hover:text-white"
                  title="Copier le lien"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gold/20 bg-gold/5 space-y-4">
              <h3 className="font-display font-bold text-lg text-gold flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Rémunération automatique
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                En tant que Manager, vous touchez automatiquement **15% de commission** sur chaque commission générée et validée par vos affiliés directs.
              </p>
              <p className="text-xs text-slate-400 bg-black/40 p-3 rounded-lg border border-slate-800">
                Vos gains s'accumulent directement sur votre solde recruteur. Vos demandes de retrait et informations bancaires sont à renseigner auprès de l'Administrateur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0f0f15]/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Clics de l'équipe</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <MousePointerClick className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl font-bold font-mono text-white">{totalClicksCount}</h4>
                <p className="text-[11px] text-slate-500 mt-1">Clics totaux redirigés</p>
              </div>
            </div>

            <div className="bg-[#0f0f15]/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Taux conversion</span>
                <div className="p-2 rounded-lg bg-emerald/10 text-emerald">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl font-bold font-mono text-white">{conversionRate} %</h4>
                <p className="text-[11px] text-slate-500 mt-1">Clics convertis en commissions</p>
              </div>
            </div>

            <div className="bg-[#0f0f15]/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Commissions Équipe</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl font-bold font-mono text-white">{totalCommissionsCount}</h4>
                <p className="text-[11px] text-slate-500 mt-1">Nombre total d'inscriptions payantes</p>
              </div>
            </div>

            <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 hover:border-gold/30 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gold font-bold uppercase tracking-wider">Gains Manager (15%)</span>
                <div className="p-2 rounded-lg bg-gold/10 text-gold">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl font-bold font-mono text-gold">{recruiterBalance} €</h4>
                <p className="text-[11px] text-slate-400 mt-1">Vos gains de parrainage 15%</p>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold" /> Performance de l'Équipe (7 derniers jours)
            </h3>
            {chartData.length > 0 ? (
              <div className="h-80 w-full font-mono text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClics" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorComms" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="day" stroke="#6b7280" tickLine={false} />
                    <YAxis stroke="#6b7280" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f0f15', borderColor: '#1f2937', color: '#fff', borderRadius: '12px' }}
                      labelClassName="text-slate-400 font-bold"
                    />
                    <Area type="monotone" dataKey="clics" name="Clics" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorClics)" />
                    <Area type="monotone" dataKey="commissions" name="Gains Équipe (€)" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorComms)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500 text-sm">
                Aucune donnée d'activité disponible pour le moment.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: EARNINGS HISTORY */}
      {activeTab === 'earnings' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold" /> Historique des Gains (15%)
            </h3>
            <span className="bg-gold/10 text-gold text-xs px-2.5 py-1 rounded-full font-bold">
              Solde : {recruiterBalance} €
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-surface/50 font-mono text-[10px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Affilié parrainé</th>
                  <th className="p-3 text-right">Commission d'origine</th>
                  <th className="p-3 text-right">Votre Gain (15%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recruiterComms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Vous n'avez pas encore d'historique de gains de parrainage.
                    </td>
                  </tr>
                ) : recruiterComms.map((item: any) => {
                  const originComm = (item.montant / 0.15);
                  return (
                    <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                      <td className="p-3 font-mono text-slate-400 text-xs">
                        {new Date(item.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">
                          {item.affiliates?.profiles?.full_name || 'Affilié'}
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-400">
                        {originComm.toFixed(2)} €
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-gold">
                        + {Number(item.montant).toFixed(2)} €
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
