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
  const [activeTab, setActiveTab] = useState<'team' | 'stats' | 'earnings' | 'payout'>('team')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d')
  const [payoutAmount, setPayoutAmount] = useState('200')
  const [payoutSuccess, setPayoutSuccess] = useState(false)
  const [payoutsList, setPayoutsList] = useState<any[]>([])
  const [soldeDisponible, setSoldeDisponible] = useState(0)
  const [filteredClicksCount, setFilteredClicksCount] = useState(0)
  const [filteredCommsCount, setFilteredCommsCount] = useState(0)
  
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
          try {
            const res = await fetch('/api/recruiter/team-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ affiliateIds, recruiterId: user.id })
            })
            if (res.ok) {
              const data = await res.json()
              setTeamClicks(data.clicks || [])
              setTeamComms(data.commissions || [])
            }
          } catch (e) {
            console.error('Error fetching team data', e)
          }
        }
      }

      // Fetch Payouts
      const { data: payouts } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('affiliate_id', user.id)
      if (payouts) setPayoutsList(payouts)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Lien copié dans le presse-papiers !')
  }


  // Dynamic filter for stats & chart
  useEffect(() => {
    if (loading) return
    const now = new Date()
    let filteredC = teamClicks
    let filteredCo = teamComms

    if (timeRange === '7d') {
      const limit = new Date()
      limit.setDate(now.getDate() - 7)
      filteredC = teamClicks.filter(c => new Date(c.created_at) >= limit)
      filteredCo = teamComms.filter(c => new Date(c.created_at) >= limit)
    } else if (timeRange === '30d') {
      const limit = new Date()
      limit.setDate(now.getDate() - 30)
      filteredC = teamClicks.filter(c => new Date(c.created_at) >= limit)
      filteredCo = teamComms.filter(c => new Date(c.created_at) >= limit)
    }

    setFilteredClicksCount(filteredC.length)
    setFilteredCommsCount(filteredCo.filter(c => c.statut === 'validated' || c.statut === 'paid').length)

    const rangeDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 15
    const chart = []
    for (let i = rangeDays - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      const dayStart = new Date(date)
      dayStart.setHours(0,0,0,0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23,59,59,999)

      const dayClicks = teamClicks.filter(c => {
        const d = new Date(c.created_at)
        return d >= dayStart && d <= dayEnd
      }).length

      const dayComms = teamComms.filter(c => {
        const d = new Date(c.created_at)
        return d >= dayStart && d <= dayEnd && (c.statut === 'validated' || c.statut === 'paid')
      }).reduce((acc, curr) => acc + Number(curr.montant), 0)

      chart.push({
        day: dateStr,
        clics: dayClicks,
        commissions: dayComms
      })
    }
    setChartData(chart)

    // Calculate soldeDisponible
    let totalPaidOrPending = 0
    payoutsList.forEach(p => {
      if (p.statut !== 'rejected') {
        totalPaidOrPending += Number(p.montant_demande)
      }
    })
    setSoldeDisponible(Math.max(0, recruiterBalance - totalPaidOrPending))

  }, [timeRange, teamClicks, teamComms, payoutsList, recruiterBalance, loading])

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(payoutAmount)
    if (amount < 200) {
      toast.error('Le montant minimum de retrait est de 200 €.')
      return
    }
    if (amount > soldeDisponible) {
      toast.error('Fonds insuffisants.')
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('payout_requests').insert([{
      affiliate_id: user.id,
      montant_demande: amount,
      statut: 'pending'
    }])

    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payout_request',
          message: `Demande de paiement Recruteur
Montant : <b>${amount} €</b>
Connectez-vous pour valider le virement.`
        })
      })
    } catch (err) {}

    setSoldeDisponible(prev => prev - amount)
    setPayoutSuccess(true)
    const { data: payouts } = await supabase.from('payout_requests').select('*').eq('affiliate_id', user.id)
    if (payouts) setPayoutsList(payouts)
    setTimeout(() => setPayoutSuccess(false), 4000)
  }

  // Calculations for stats
  const conversionRate = filteredClicksCount > 0 ? ((filteredCommsCount / filteredClicksCount) * 100).toFixed(1) : '0'
  const currentDay = new Date().getDate()
  const isPayoutWindow = currentDay >= 15 && currentDay <= 20
  const canRequestPayout = isPayoutWindow && soldeDisponible >= 200

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-gold animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 sm:p-6 rounded-2xl border border-surface-border">
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
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-hide snap-x">
        <button
          onClick={() => setActiveTab('team')}
          className={`whitespace-nowrap px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 snap-start ${
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
          className={`whitespace-nowrap px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 snap-start ${
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
          className={`whitespace-nowrap px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 snap-start ${
            activeTab === 'earnings'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Historique des gains</span>
        </button>
        <button
          onClick={() => setActiveTab('payout')}
          className={`whitespace-nowrap px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 snap-start ${
            activeTab === 'payout'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Paiements</span>
        </button>
      </div>

      {/* TAB CONTENT: TEAM */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* L'Équipe */}
          <div className="md:col-span-2 glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" /> Liste des Affiliés
              </h3>
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded font-bold">
                {team.length} Affiliés
              </span>
            </div>

            <div className="overflow-x-auto w-full -mx-4 sm:mx-0 px-4 sm:px-0">
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
            <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
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

            <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-gold/20 bg-gold/5 space-y-4">
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
                <h4 className="text-2xl font-bold font-mono text-white">{filteredClicksCount}</h4>
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
                <h4 className="text-2xl font-bold font-mono text-white">{filteredCommsCount}</h4>
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
          <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gold" /> Performance de l'Équipe
              </h3>
              <div className="flex bg-[#0f0f15] rounded-lg p-0.5 border border-slate-800 self-start sm:self-auto shrink-0">
                  {(['7d', '30d', 'all'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        timeRange === range
                          ? 'bg-gold text-black shadow-gold-glow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {range === '7d' ? '7j' : range === '30d' ? '30j' : 'Tout'}
                    </button>
                  ))}
              </div>
            </div>
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
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold" /> Historique des Gains (15%)
            </h3>
            <span className="bg-gold/10 text-gold text-xs px-2.5 py-1 rounded-full font-bold">
              Solde : {recruiterBalance} €
            </span>
          </div>

          <div className="overflow-x-auto w-full -mx-4 sm:mx-0 px-4 sm:px-0">
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

      {/* TAB CONTENT: PAYOUT */}
      {activeTab === 'payout' && (
        <div className="space-y-6">
          <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-gold/30 space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">Demande de Retrait (Recruteur)</h3>
              <p className="text-xs text-slate-400">Solde minimum requis : 200.00 € (Votre solde actuel : {soldeDisponible.toFixed(2)} €)</p>
            </div>

            {payoutSuccess && (
              <div className="p-4 rounded-xl bg-emerald/20 border border-emerald/40 text-emerald text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Demande de virement de {payoutAmount}€ soumise avec succès !</span>
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant à retirer (€)</label>
                <input
                  type="number"
                  min="200"
                  max={soldeDisponible > 0 ? soldeDisponible : 200}
                  required
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Mode de Paiement</label>
                <select className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold">
                  <option value="iban">Virement Bancaire (IBAN en ligne)</option>
                  <option value="crypto">USDT / Crypto Wallet</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!canRequestPayout}
                className={`w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  canRequestPayout 
                    ? 'text-black bg-gold hover:bg-gold-light shadow-gold-glow' 
                    : 'text-slate-400 bg-slate-800/80 cursor-not-allowed border border-slate-700'
                }`}
              >
                {canRequestPayout ? 'Confirmer la Demande' : (soldeDisponible < 200 && isPayoutWindow) ? 'Solde insuffisant' : 'Paiements fermés'}
              </button>
              
              {!isPayoutWindow && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-start gap-2">
                  <p>Les soldes disponibles peuvent être retirés uniquement <strong>entre le 15 et le 20 du mois</strong>.</p>
                </div>
              )}
            </form>
          </div>

          <div className="max-w-xl mx-auto glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="font-display font-bold text-sm text-white">Vos Retraits</h4>
            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[9px] uppercase">
                    <th className="pb-2">Date</th>
                    <th className="pb-2 text-right">Montant</th>
                    <th className="pb-2 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {payoutsList.length === 0 ? (
                    <tr><td colSpan={3} className="py-4 text-center text-slate-500">Aucun retrait.</td></tr>
                  ) : payoutsList.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 text-slate-300 font-mono">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="py-2.5 text-right text-white font-mono font-semibold">{p.montant_demande} €</td>
                      <td className="py-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          p.statut === 'paid' ? 'bg-emerald/20 text-emerald' : 
                          p.statut === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'
                        }`}>{p.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
