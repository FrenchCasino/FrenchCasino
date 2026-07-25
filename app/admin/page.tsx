'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ShieldAlert,
  Users,
  DollarSign,
  CreditCard,
  Plus,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Activity,
  Save,
  Trash2,
  Download,
  Loader2,
  MessageSquare
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboardPage() {
  const [adminTab, setAdminTab] = useState<'kpi' | 'affiliates' | 'casinos' | 'payouts' | 'support' | 'logs'>('kpi')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // State
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [payouts, setPayouts] = useState<any[]>([])
  const [casinos, setCasinos] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  
  const [kpi, setKpi] = useState({
    activeAffiliates: 0,
    pendingAffiliates: 0,
    totalCommissions: 0,
    pendingPayouts: 0,
    pendingPayoutsAmount: 0,
    openTickets: 0,
  })

  // Commission Modal state
  const [commissionModal, setCommissionModal] = useState<{isOpen: boolean, affiliateId: string, affiliateName: string}>({ isOpen: false, affiliateId: '', affiliateName: '' })
  const [commissionAmount, setCommissionAmount] = useState('')
  const [commissionNote, setCommissionNote] = useState('Dépôt Joueur')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Casino Modal state
  const [casinoModal, setCasinoModal] = useState(false)
  const [newCasino, setNewCasino] = useState({
    name: '',
    slug: '',
    lien_affilie: '',
    bonus_depot: '100% jusqu\'à 500€',
    bonus_sans_depot: 'Aucun',
    licence: 'Curaçao',
    remboursement_depot: false,
    commission_conditions: 'Nouveau inscrit seulement',
    minimum_depot: '20€',
    ordre_classement: 1
  })
  const [isSubmittingCasino, setIsSubmittingCasino] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // Load Affiliates with Profiles
      const { data: affData, error: affErr } = await supabase
        .from('affiliates')
        .select(`
          *,
          profiles:id (
            full_name,
            email
          )
        `)
      
      if (affErr) console.error("Error loading affiliates:", affErr)
      else setAffiliates(affData || [])

      // Load Payouts with Affiliate Profile Info
      const { data: payData, error: payErr } = await supabase
        .from('payout_requests')
        .select(`
          *,
          affiliates (
            iban,
            profiles:id (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (payErr) console.error("Error loading payouts:", payErr)
      else setPayouts(payData || [])

      // Load Casinos
      const { data: casData, error: casErr } = await supabase
        .from('casinos')
        .select('*')
        .order('ordre_classement', { ascending: true })
      
      if (casErr) console.error("Error loading casinos:", casErr)
      else setCasinos(casData || [])

      // Load Tickets
      const { data: tksData, error: tksErr } = await supabase
        .from('tickets')
        .select(`
          *,
          affiliates (
            profiles:id (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (tksErr) console.error("Error loading tickets:", tksErr)
      else setTickets(tksData || [])

      // Calculate KPIs
      if (affData && payData && tksData) {
        setKpi({
          activeAffiliates: affData.filter(a => a.status === 'active').length,
          pendingAffiliates: affData.filter(a => a.status === 'pending').length,
          totalCommissions: affData.reduce((acc, a) => acc + (Number(a.total_earned) || 0), 0),
          pendingPayouts: payData.filter(p => p.statut === 'pending').length,
          pendingPayoutsAmount: payData.filter(p => p.statut === 'pending').reduce((acc, p) => acc + (Number(p.montant_demande) || 0), 0),
          openTickets: tksData.filter(t => t.statut === 'open').length,
        })
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Actions Affiliés
  const handleUpdateAffiliateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('affiliates').update({ status: newStatus }).eq('id', id)
    if (!error) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, status: newStatus } : a))
      // Mettre à jour les KPIs locaux si besoin
      setKpi(prev => ({
        ...prev,
        activeAffiliates: newStatus === 'active' ? prev.activeAffiliates + 1 : prev.activeAffiliates - 1,
        pendingAffiliates: newStatus === 'pending' ? prev.pendingAffiliates + 1 : prev.pendingAffiliates - 1
      }))
    } else {
      alert("Erreur lors de la mise à jour du statut")
    }
  }

  const handleUpdateCommissionRate = async (id: string, currentRate: number) => {
    const newRateStr = prompt("Nouveau taux de commission (ex: 0.35 pour 35%)", currentRate.toString())
    if (!newRateStr) return
    const newRate = parseFloat(newRateStr)
    if (isNaN(newRate) || newRate < 0 || newRate > 1) {
      alert("Taux invalide. Doit être entre 0 et 1.")
      return
    }
    const { error } = await supabase.from('affiliates').update({ commission_rate: newRate }).eq('id', id)
    if (!error) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, commission_rate: newRate } : a))
    } else {
      alert("Erreur lors de la mise à jour du taux")
    }
  }

  // Handle Manual Commission Submission
  const handleAddCommission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commissionAmount) return
    
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateId: commissionModal.affiliateId,
          amount: parseFloat(commissionAmount),
          periode: commissionNote
        })
      })
      const data = await res.json()
      if (data.success) {
        alert("Commission ajoutée avec succès !")
        setCommissionModal({ isOpen: false, affiliateId: '', affiliateName: '' })
        setCommissionAmount('')
        loadData() // Recharge les KPIs et Affiliés
      } else {
        alert("Erreur: " + data.error)
      }
    } catch (err) {
      alert("Erreur réseau")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Add Casino
  const handleAddCasino = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCasino.name || !newCasino.slug || !newCasino.lien_affilie) {
      alert("Veuillez remplir les champs obligatoires (Nom, Slug, Lien)")
      return
    }

    setIsSubmittingCasino(true)
    try {
      const { error } = await supabase.from('casinos').insert([{
        ...newCasino,
        is_active: true
      }])

      if (error) {
        if (error.code === '23505') alert("Erreur : Ce Slug existe déjà !")
        else alert("Erreur d'ajout : " + error.message)
      } else {
        alert("Casino ajouté avec succès ! Vos affiliés le voient maintenant.")
        setCasinoModal(false)
        setNewCasino({ name: '', slug: '', lien_affilie: '', bonus_depot: '100% jusqu\'à 500€', bonus_sans_depot: 'Aucun', licence: 'Curaçao', remboursement_depot: false, commission_conditions: 'Nouveau inscrit seulement', minimum_depot: '20€', ordre_classement: 1 })
        loadData()
      }
    } catch (err) {
      alert("Erreur réseau")
    } finally {
      setIsSubmittingCasino(false)
    }
  }

  const handleUpdatePayoutStatus = async (payoutId: string, affiliateEmail: string, affiliateName: string, amount: number, newStatus: string) => {
    if (!confirm(`Confirmez-vous le passage au statut '${newStatus}' pour ce virement de ${amount}€ ?`)) return

    const { error } = await supabase.from('payout_requests').update({ 
      statut: newStatus,
      processed_at: new Date().toISOString()
    }).eq('id', payoutId)

    if (!error) {
      setPayouts(payouts.map(p => p.id === payoutId ? { ...p, statut: newStatus } : p))
      
      // Trigger notification email via notre route API
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'payout',
            email: affiliateEmail,
            name: affiliateName,
            amount: amount,
            status: newStatus
          })
        })
      } catch (err) {
        console.error("Email API Error:", err)
      }
    } else {
      alert("Erreur lors de la mise à jour du paiement")
    }
  }

  // Actions Support Tickets
  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    const { error } = await supabase.from('tickets').update({ statut: newStatus }).eq('id', ticketId)
    if (!error) {
      const oldStatus = tickets.find(t => t.id === ticketId)?.statut
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, statut: newStatus } : t))
      // Update KPI
      setKpi(prev => ({
        ...prev,
        openTickets: prev.openTickets + (newStatus === 'open' ? 1 : 0) - (oldStatus === 'open' ? 1 : 0)
      }))
    } else {
      alert("Erreur lors de la mise à jour du ticket")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-950/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Panneau de Contrôle Administrateur Supabase</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Administration FrenchCasino V2
          </h1>
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors">
          <Activity className="w-4 h-4" />
          Rafraîchir les données
        </button>
      </div>

      {/* Tabs Navigation Admin */}
      <div className="flex overflow-x-auto gap-2 border-b border-surface-border pb-2 scrollbar-hide">
        {[
          { id: 'kpi', label: 'KPIs Globaux', icon: Activity },
          { id: 'affiliates', label: 'Gestion Affiliés', icon: Users },
          { id: 'casinos', label: 'Gestion Casinos', icon: Plus },
          { id: 'payouts', label: 'Paiements & Exports', icon: CreditCard },
          { id: 'support', label: 'Tickets Support', icon: Clock },
          { id: 'logs', label: 'Logs & Alertes', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon
          const active = adminTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 relative ${
                active
                  ? 'bg-red-600 text-white shadow-lg'
                  : tab.id === 'support' && kpi.openTickets > 0
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-surface-card border border-transparent hover:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'support' && kpi.openTickets > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-red-500" />
        </div>
      ) : (
        <>
          {/* 1. KPIS GLOBAUX */}
          {adminTab === 'kpi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <span className="text-slate-400 text-xs block relative z-10">Affiliés Actifs</span>
                <span className="text-3xl font-bold font-mono text-white relative z-10">{kpi.activeAffiliates}</span>
                <span className="text-[11px] text-emerald block relative z-10">
                  {kpi.pendingAffiliates > 0 ? `+${kpi.pendingAffiliates} en attente de validation` : 'Tous validés'}
                </span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <DollarSign className="w-12 h-12 text-gold" />
                </div>
                <span className="text-slate-400 text-xs block relative z-10">Gains Distribués / Dus</span>
                <span className="text-3xl font-bold font-mono text-gold relative z-10">{kpi.totalCommissions.toLocaleString()} €</span>
                <span className="text-[11px] text-gold block relative z-10">Global historique</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-red-900/50 bg-red-950/10 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CreditCard className="w-12 h-12 text-red-400" />
                </div>
                <span className="text-slate-400 text-xs block relative z-10">Payouts en Attente</span>
                <span className="text-3xl font-bold font-mono text-red-400 relative z-10">{kpi.pendingPayouts}</span>
                <span className="text-[11px] text-red-400 block relative z-10">Montant total : {kpi.pendingPayoutsAmount.toLocaleString()} €</span>
              </div>
            </div>
          )}

          {/* 2. GESTION DES AFFILIÉS */}
          {adminTab === 'affiliates' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Gestion des Inscriptions & Taux Commission</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-surface/50 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Affilié & Email</th>
                      <th className="p-4">Code / Lien</th>
                      <th className="p-4 text-center">Taux RevShare</th>
                      <th className="p-4 text-right">Gains Totaux</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4">Actions Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {affiliates.length === 0 ? (
                      <tr><td colSpan={6} className="p-4 text-center text-slate-500 font-mono">Aucun affilié trouvé.</td></tr>
                    ) : affiliates.map((aff) => (
                      <tr key={aff.id} className="hover:bg-surface/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{aff.profiles?.full_name || 'Sans Nom'}</div>
                          <div className="font-mono text-[10px] text-slate-400">{aff.profiles?.email || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-300 font-mono text-[11px] rounded border border-purple-800/50">
                            {aff.referral_code}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleUpdateCommissionRate(aff.id, aff.commission_rate)}
                            className="font-mono font-bold text-emerald hover:text-emerald-300 hover:underline cursor-pointer px-2 py-1 rounded bg-emerald/10 border border-emerald/20 transition-all"
                            title="Modifier le taux"
                          >
                            {(aff.commission_rate * 100).toFixed(0)}%
                          </button>
                        </td>
                        <td className="p-4 font-mono text-gold font-bold text-right">{(Number(aff.total_earned) || 0).toLocaleString()} €</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            aff.status === 'active' ? 'bg-emerald/20 text-emerald border border-emerald/30' : 
                            aff.status === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 
                            'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}>
                            {aff.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {aff.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateAffiliateStatus(aff.id, 'active')}
                                className="p-1.5 rounded-lg bg-emerald/20 text-emerald hover:bg-emerald/30 text-[11px] px-3 font-bold transition-colors border border-emerald/30"
                              >
                                Valider
                              </button>
                            )}
                            {aff.status === 'active' && (
                              <button
                                onClick={() => setCommissionModal({ isOpen: true, affiliateId: aff.id, affiliateName: aff.profiles?.full_name || 'Inconnu' })}
                                className="p-1.5 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 text-[11px] px-3 font-bold transition-colors border border-gold/30 flex items-center gap-1"
                              >
                                <DollarSign className="w-3 h-3" /> Commission
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateAffiliateStatus(aff.id, aff.status === 'suspended' ? 'active' : 'suspended')}
                              className="p-1.5 rounded-lg bg-red-950/50 text-red-400 hover:bg-red-900 text-[11px] px-3 font-bold transition-colors border border-red-900/50"
                            >
                              {aff.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. GESTION DES CASINOS (CRUD) */}
          {adminTab === 'casinos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center glass-panel p-4 rounded-xl border border-slate-800">
                <h3 className="font-display font-bold text-lg text-white">Casinos Référencés sur la Vitrine</h3>
                <button 
                  onClick={() => setCasinoModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-primary-hover shadow-purple-glow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Casino</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {casinos.length === 0 ? (
                  <p className="text-slate-400 font-mono text-sm p-4">Aucun casino trouvé dans la base.</p>
                ) : casinos.map((casino) => (
                  <div key={casino.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base flex items-center gap-2">
                          {casino.name}
                          {!casino.is_active && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-500">Inactif</span>}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">{casino.slug}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-gold bg-gold/10 border border-gold/20 px-2 py-1 rounded">Ordre: #{casino.ordre_classement}</span>
                    </div>
                    
                    <div className="space-y-1.5 text-[11px]">
                      <p className="text-slate-300"><span className="text-slate-500">Licence:</span> {casino.licence}</p>
                      <p className="text-emerald font-semibold"><span className="text-slate-500 font-normal">Sans dépôt:</span> {casino.bonus_sans_depot}</p>
                      <p className="text-purple-300 font-semibold"><span className="text-slate-500 font-normal">Commission:</span> {casino.bonus_depot}</p>
                      <p className="text-blue-300 font-semibold"><span className="text-slate-500 font-normal">Min. Dépôt:</span> {casino.minimum_depot || 'Non défini'}</p>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-800/60 mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors">
                        <Edit className="w-3 h-3" /> Éditer
                      </button>
                      <button className="flex-1 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/50 text-xs font-semibold text-red-400 hover:bg-red-900 flex items-center justify-center gap-1.5 transition-colors">
                        <Trash2 className="w-3 h-3" /> {casino.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. GESTION DES PAIEMENTS */}
          {adminTab === 'payouts' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-lg text-white">Demandes de Retrait & Paiements</h3>
                <button className="px-3 py-1.5 rounded-lg bg-surface border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 hover:text-white transition-colors">
                  <Download className="w-4 h-4 text-gold" />
                  <span>Export CSV Comptabilité</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-surface/50 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Date Demande</th>
                      <th className="p-4">Affilié</th>
                      <th className="p-4 text-right">Montant</th>
                      <th className="p-4">Coordonnées (IBAN)</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4">Action Sécurisée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {payouts.length === 0 ? (
                      <tr><td colSpan={6} className="p-4 text-center text-slate-500 font-mono">Aucune demande de paiement.</td></tr>
                    ) : payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-surface/30 transition-colors">
                        <td className="p-4 font-mono text-slate-400">
                          {new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{p.affiliates?.profiles?.full_name || 'Inconnu'}</div>
                          <div className="font-mono text-[10px] text-slate-500">{p.affiliates?.profiles?.email}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-gold text-right text-sm">
                          {(Number(p.montant_demande) || 0).toLocaleString()} €
                        </td>
                        <td className="p-4">
                          {p.affiliates?.iban ? (
                            <span className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                              {p.affiliates.iban}
                            </span>
                          ) : (
                            <span className="text-red-400 text-[10px] italic">Non renseigné</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            p.statut === 'paid' ? 'bg-emerald/20 text-emerald border border-emerald/30' : 
                            p.statut === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 
                            'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}>
                            {p.statut}
                          </span>
                        </td>
                        <td className="p-4">
                          {p.statut === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdatePayoutStatus(p.id, p.affiliates?.profiles?.email, p.affiliates?.profiles?.full_name, p.montant_demande, 'paid')}
                                className="px-3 py-1.5 rounded bg-emerald/90 hover:bg-emerald text-white font-bold text-[11px] transition-colors shadow-lg shadow-emerald/20"
                              >
                                Marquer Payé (Envoie Email)
                              </button>
                              <button
                                onClick={() => handleUpdatePayoutStatus(p.id, p.affiliates?.profiles?.email, p.affiliates?.profiles?.full_name, p.montant_demande, 'rejected')}
                                className="px-3 py-1.5 rounded bg-red-900/80 hover:bg-red-900 text-white font-bold text-[11px] transition-colors"
                              >
                                Refuser
                              </button>
                            </div>
                          )}
                          {p.statut === 'paid' && p.processed_at && (
                            <span className="text-[10px] text-emerald font-mono">Traité le {new Date(p.processed_at).toLocaleDateString('fr-FR')}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Tchat & Support */}
          {adminTab === 'support' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Tickets Support des Affiliés</h3>
              
              <div className="overflow-x-auto rounded-xl border border-slate-800/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-surface/50 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Affilié</th>
                      <th className="p-4">Sujet du ticket</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4">Actions Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tickets.length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-center text-slate-500 font-mono">Aucun ticket.</td></tr>
                    ) : tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-surface/30 transition-colors">
                        <td className="p-4 font-mono text-slate-400">
                          {new Date(t.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{t.affiliates?.profiles?.full_name || 'Inconnu'}</div>
                          <div className="font-mono text-[10px] text-slate-500">{t.affiliates?.profiles?.email}</div>
                        </td>
                        <td className="p-4 font-bold text-white max-w-xs truncate" title={t.sujet}>
                          {t.sujet}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            t.statut === 'answered' ? 'bg-emerald/20 text-emerald border border-emerald/30' : 
                            t.statut === 'closed' ? 'bg-slate-800 text-slate-400 border border-slate-700' : 
                            'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}>
                            {t.statut === 'open' ? 'Nouveau' : t.statut === 'answered' ? 'Répondu' : 'Fermé'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {t.statut === 'open' && (
                              <button
                                onClick={() => handleUpdateTicketStatus(t.id, 'answered')}
                                className="px-3 py-1.5 rounded bg-emerald/90 hover:bg-emerald text-white font-bold text-[11px] transition-colors"
                              >
                                Marquer Répondu
                              </button>
                            )}
                            {t.statut !== 'closed' && (
                              <button
                                onClick={() => handleUpdateTicketStatus(t.id, 'closed')}
                                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors"
                              >
                                Fermer
                              </button>
                            )}
                            {t.statut === 'closed' && (
                              <button
                                onClick={() => handleUpdateTicketStatus(t.id, 'open')}
                                className="px-3 py-1.5 rounded bg-red-900/80 hover:bg-red-900 text-white font-bold text-[11px] transition-colors"
                              >
                                Rouvrir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. LOGS D'ACTIVITÉ */}
          {adminTab === 'logs' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center py-20 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-red-900 mb-2" />
              <h3 className="font-display font-bold text-xl text-white">Audit Logs d&apos;Administration</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Historique des actions critiques (changements de RIB, validations de paiements, suspensions) avec archivage sécurisé. Module en cours d&apos;activation.
              </p>
            </div>
          )}

        </>
      )}

      {/* Commission Modal */}
      {commissionModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setCommissionModal({ ...commissionModal, isOpen: false })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2 font-display flex items-center gap-2">
              <DollarSign className="text-gold w-6 h-6" /> Ajouter Commission
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Créditez manuellement le solde de l&apos;affilié <strong className="text-white">{commissionModal.affiliateName}</strong> suite à un dépôt vérifié.
            </p>
            
            <form onSubmit={handleAddCommission} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant de la Commission (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={commissionAmount}
                  onChange={e => setCommissionAmount(e.target.value)}
                  placeholder="Ex: 50.00"
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Note / Référence du Dépôt</label>
                <input
                  type="text"
                  required
                  value={commissionNote}
                  onChange={e => setCommissionNote(e.target.value)}
                  placeholder="Ex: Dépôt 100€ Joueur X (Cresus)"
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créditer l\'Affilié'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Casino Modal */}
      {casinoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setCasinoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2 font-display flex items-center gap-2">
              <Plus className="text-primary w-6 h-6" /> Nouveau Casino Partenaire
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Ce casino sera instantanément visible sur la plateforme et les affiliés auront leur lien généré.
            </p>
            
            <form onSubmit={handleAddCasino} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Nom du Casino *</label>
                  <input
                    type="text"
                    required
                    value={newCasino.name}
                    onChange={e => {
                      const name = e.target.value
                      setNewCasino({ ...newCasino, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') })
                    }}
                    placeholder="Ex: Cresus Casino"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Slug (Automatique) *</label>
                  <input
                    type="text"
                    required
                    value={newCasino.slug}
                    onChange={e => setNewCasino({ ...newCasino, slug: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-400 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Votre Lien d&apos;Affiliation Maître *</label>
                <input
                  type="url"
                  required
                  value={newCasino.lien_affilie}
                  onChange={e => setNewCasino({ ...newCasino, lien_affilie: e.target.value })}
                  placeholder="https://tracker-casino.com/ref?id=VOTRE_CODE_ADMIN"
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gold font-mono focus:outline-none focus:border-gold"
                />
                <p className="text-[10px] text-slate-500">C'est ce lien qui recevra les clics finaux avec le sous-id affilié.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Montant de la Commission</label>
                  <input
                    type="text"
                    value={newCasino.bonus_depot}
                    onChange={e => setNewCasino({ ...newCasino, bonus_depot: e.target.value })}
                    placeholder="Ex: 50€ CPA ou 40% RevShare"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Bonus Sans Dépôt</label>
                  <input
                    type="text"
                    value={newCasino.bonus_sans_depot}
                    onChange={e => setNewCasino({ ...newCasino, bonus_sans_depot: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col justify-center">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCasino.remboursement_depot}
                      onChange={e => setNewCasino({ ...newCasino, remboursement_depot: e.target.checked })}
                      className="rounded border-slate-700 text-gold focus:ring-gold bg-[#0a0a0f]"
                    />
                    Remboursement Dépôt (Oui/Non)
                  </label>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Conditions de Commission</label>
                  <input
                    type="text"
                    value={newCasino.commission_conditions}
                    onChange={e => setNewCasino({ ...newCasino, commission_conditions: e.target.value })}
                    placeholder="Ex: Par dépôt nouveau inscrit"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant Minimum de Dépôt *</label>
                <input
                  type="text"
                  required
                  value={newCasino.minimum_depot}
                  onChange={e => setNewCasino({ ...newCasino, minimum_depot: e.target.value })}
                  placeholder="Ex: 20€"
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingCasino}
                className="w-full py-3.5 mt-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-purple-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingCasino ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ajouter le Casino'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
