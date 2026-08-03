'use client'

import React, { useState, useEffect } from 'react'
import { Eye, Download, Send, DollarSign, XCircle, Loader2, RefreshCw, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '@/components/ui/ConfirmModal'

export function getVipInfo(total: number) {
  if (total >= 10000) return { name: 'Diamond', icon: '💎', color: 'text-cyan-400', bg: 'bg-cyan-900/30', border: 'border-cyan-500/50' };
  if (total >= 5000) return { name: 'Platinum', icon: '👑', color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-500/50' };
  if (total >= 1000) return { name: 'Gold', icon: '🏆', color: 'text-amber-400', bg: 'bg-amber-900/30', border: 'border-amber-500/50' };
  if (total >= 500) return { name: 'Silver', icon: '🥈', color: 'text-slate-300', bg: 'bg-slate-800', border: 'border-slate-500/50' };
  return { name: 'Bronze', icon: '🥉', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-500/50' };
}

const Row = ({ label, value, mono = false, color = "text-white" }: { label: string, value: React.ReactNode, mono?: boolean, color?: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
    <span className="text-xs text-slate-400">{label}</span>
    <span className={`text-sm font-semibold ${mono ? 'font-mono' : ''} ${color}`}>{value}</span>
  </div>
)

export default function AdminAffiliatesTab({
  affiliates,
  setAffiliates,
  recruiters,
  kpi,
  setKpi,
  loadData,
  supabase,
  downloadCSVAdmin
}: {
  affiliates: any[],
  setAffiliates: (a: any[]) => void,
  recruiters: any[],
  kpi: any,
  setKpi: any,
  loadData: () => void,
  supabase: any,
  downloadCSVAdmin: (headers: string[], rows: any[][], filename: string) => void
}) {
  const { confirm } = useConfirm()

  const [selectedAff, setSelectedAff] = useState<any>(null)
  const [selectedAffStats, setSelectedAffStats] = useState<{
    loading: boolean;
    totalClicks: number;
    conversionRate: number;
    clicksByCasino: Record<string, { clicks: number, commissions: number }>;
    recentCommissions: any[];
  } | null>(null)
  
  const [commissionModal, setCommissionModal] = useState<{isOpen: boolean, affiliateId: string, affiliateName: string}>({ isOpen: false, affiliateId: '', affiliateName: '' })
  const [commissionAmount, setCommissionAmount] = useState('')
  const [commissionType, setCommissionType] = useState<'add' | 'deduct'>('add')
  const [commissionNote, setCommissionNote] = useState('Dépôt Joueur')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [telegramMessage, setTelegramMessage] = useState('')
  const [isSendingTelegram, setIsSendingTelegram] = useState(false)
  const [isAdminMessageSaving, setIsAdminMessageSaving] = useState(false)

  useEffect(() => {
    if (!selectedAff) {
      setSelectedAffStats(null)
      return
    }

    async function fetchAffStats() {
      if (!selectedAff?.id) return;
      setSelectedAffStats({ loading: true, totalClicks: 0, conversionRate: 0, clicksByCasino: {}, recentCommissions: [] })
      
      try {
        let clicksData = []
        try {
          const res = await fetch(`/api/admin/clicks?affiliate_id=${selectedAff.id}`)
          if (res.ok) {
            clicksData = await res.json()
          }
        } catch (err) {
          console.error('Error loading clicks from API:', err)
        }

        const { data: commsData, error: commsErr } = await supabase
          .from('commissions')
          .select('*')
          .eq('affiliate_id', selectedAff.id)
          .order('created_at', { ascending: false })

        if (commsErr) console.error('Error loading commissions:', commsErr)
        
        const clicks: any[] = clicksData || []
        const comms: any[] = commsData || []

        const totalClicks = clicks.length
        const validComms = comms.filter((c: any) => c.statut === 'validated' || c.statut === 'paid')
        const totalConversions = validComms.length
        const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

        const statsByCasino: Record<string, { clicks: number, commissions: number }> = {}
        
        clicks.forEach((c: any) => {
          const slug = c.casino_slug || c.casino_id || 'général'
          if (!statsByCasino[slug]) statsByCasino[slug] = { clicks: 0, commissions: 0 }
          statsByCasino[slug].clicks += 1
        })

        validComms.forEach((c: any) => {
          const key = c.casino_slug || c.casino_name || 'général'
          if (!statsByCasino[key]) statsByCasino[key] = { clicks: 0, commissions: 0 }
          statsByCasino[key].commissions += 1
        })

        setSelectedAffStats({
          loading: false,
          totalClicks: clicks.length,
          conversionRate,
          clicksByCasino: statsByCasino,
          recentCommissions: comms.slice(0, 5)
        })
      } catch (err) {
        console.error('Error in fetchAffStats:', err)
        setSelectedAffStats({
          loading: false,
          totalClicks: 0,
          conversionRate: 0,
          clicksByCasino: {},
          recentCommissions: []
        })
      }
    }

    fetchAffStats()
  }, [selectedAff?.id, supabase])

  const handleSaveAdminMessage = async (affiliateId: string, message: string) => {
    setIsAdminMessageSaving(true)
    const { error } = await supabase
      .from('affiliates')
      .update({ admin_message: message || null })
      .eq('id', affiliateId)
    
    setIsAdminMessageSaving(false)
    if (error) {
      toast.error('Erreur lors de la sauvegarde du message')
    } else {
      toast.success(message ? 'Message publié sur le dashboard !' : 'Message retiré.')
      setSelectedAff({ ...selectedAff, admin_message: message || null })
    }
  }

  const handleAssignRecruiter = async (affiliateId: string, recruiterId: string) => {
    try {
      await supabase.from('affiliates').update({ recruiter_id: recruiterId || null }).eq('id', affiliateId)
      loadData()
    } catch (err) {}
  }
  
  const handleUpdateRole = async (profileId: string, newRole: string) => {
    try {
      await supabase.from('profiles').update({ role: newRole }).eq('id', profileId)
      loadData()
    } catch (err) {}
  }

  const handleUpdateAffiliateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('affiliates').update({ status: newStatus }).eq('id', id)
    if (!error) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, status: newStatus } : a))
      setKpi((prev: any) => ({
        ...prev,
        activeAffiliates: newStatus === 'active' ? prev.activeAffiliates + 1 : prev.activeAffiliates - 1,
        pendingAffiliates: newStatus === 'pending' ? prev.pendingAffiliates + 1 : prev.pendingAffiliates - 1
      }))
      toast.success(`Statut mis à jour : ${newStatus}`)
    } else {
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  const handleDeleteAffiliate = async (id: string) => {
    const ok = await confirm({
      title: 'Suppression Définitive',
      message: 'Êtes-vous sûr de vouloir supprimer DÉFINITIVEMENT cet affilié ? Toutes ses données, clics et commissions seront perdus à jamais.',
      confirmLabel: 'Supprimer définitivement',
      cancelLabel: 'Annuler',
      variant: 'danger'
    })
    
    if (!ok) return
    
    try {
      toast.loading('Suppression en cours...')
      const res = await fetch(`/api/admin/affiliates/${id}`, { method: 'DELETE' })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de la suppression')
      }
      
      toast.dismiss()
      toast.success('Affilié et toutes ses données supprimés avec succès')
      setAffiliates(affiliates.filter(a => a.id !== id))
      setSelectedAff(null)
      loadData()
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message || 'Erreur lors de la suppression')
    }
  }

  const handleUpdateCommissionRate = async (id: string, currentRate: number) => {
    const newRateStr = window.prompt("Nouveau taux de commission (ex: 0.35 pour 35%)", currentRate.toString())
    if (!newRateStr) return
    const newRate = parseFloat(newRateStr)
    if (isNaN(newRate) || newRate < 0 || newRate > 1) {
      toast.error('Taux invalide. Doit être entre 0 et 1.')
      return
    }
    const { error } = await supabase.from('affiliates').update({ commission_rate: newRate }).eq('id', id)
    if (!error) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, commission_rate: newRate } : a))
      toast.success(`Taux mis à jour : ${(newRate * 100).toFixed(0)}%`)
    } else {
      toast.error('Erreur lors de la mise à jour du taux')
    }
  }

  const handleUpdateTotalEarned = async (id: string, currentEarned: number) => {
    const newEarnedStr = window.prompt("Nouveaux gains cumulés de l'affilié (€) - Sert pour le classement", currentEarned.toString())
    if (newEarnedStr === null) return
    const newEarned = parseFloat(newEarnedStr)
    if (isNaN(newEarned) || newEarned < 0) {
      toast.error('Montant invalide.')
      return
    }
    const { error } = await supabase.from('affiliates').update({ total_earned: newEarned }).eq('id', id)
    if (!error) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, total_earned: newEarned } : a))
      toast.success(`Gains mis à jour : ${newEarned} €`)
      return newEarned
    } else {
      toast.error('Erreur lors de la mise à jour des gains')
    }
  }

  const handleAddCommission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commissionAmount) return
    
    setIsSubmitting(true)
    try {
      const amount = parseFloat(commissionAmount)
      const finalAmount = commissionType === 'deduct' ? -Math.abs(amount) : Math.abs(amount)

      const res = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateId: commissionModal.affiliateId,
          amount: finalAmount,
          periode: commissionNote
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(commissionType === 'deduct' ? 'Commission déduite avec succès !' : 'Commission ajoutée avec succès !')
        setCommissionModal({ isOpen: false, affiliateId: '', affiliateName: '' })
        setCommissionAmount('')
        setCommissionType('add')
        loadData()
      } else {
        toast.error('Erreur : ' + data.error)
      }
    } catch (err) {
      toast.error('Erreur réseau')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExportAffiliates = () => {
    if (affiliates.length === 0) return toast.error("Aucun affilié à exporter.");
    const headers = [
      "Nom", "Email", "Rôle", "Taux de commission", "Total accumulé (€)", "Statut", "IBAN Titulaire", "IBAN", "BIC"
    ];
    const rows = affiliates.map(aff => [
      aff.profiles?.full_name || 'Sans nom',
      aff.profiles?.email || '',
      aff.profiles?.role || 'affiliate',
      aff.commission_rate,
      aff.total_earned,
      aff.status,
      aff.iban_holder || '',
      aff.iban || '',
      aff.bic || ''
    ]);
    downloadCSVAdmin(headers, rows, `affilies_frenchcasino_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleSendTelegramBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!telegramMessage.trim()) return

    setIsSendingTelegram(true)
    try {
      const res = await fetch('/api/telegram/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: telegramMessage })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Message envoyé au canal avec succès !')
        setTelegramMessage('')
      } else {
        toast.error("Erreur lors de l'envoi : " + data.error)
      }
    } catch (err) {
      toast.error('Erreur réseau')
    } finally {
      setIsSendingTelegram(false)
    }
  }

  // If an affiliate is selected, show the overlay UI
  if (selectedAff) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 bg-surface/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedAff(null)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              ← Retour aux affiliés
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary uppercase text-lg">
                {(selectedAff.profiles?.full_name || '?')[0]}
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <span>{selectedAff.profiles?.full_name || 'Sans Nom'}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-normal">{selectedAff.profiles?.role}</span>
                </h1>
                <p className="text-xs text-slate-500">{selectedAff.profiles?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const copy = { ...selectedAff };
                setSelectedAff(null);
                setTimeout(() => setSelectedAff(copy), 50);
              }}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Rafraîchir les statistiques de cet affilié"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Actualiser Stats</span>
            </button>
            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              selectedAff.status === 'active' ? 'bg-emerald/20 text-emerald border border-emerald/30' :
              selectedAff.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>{selectedAff.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity & Technical Info */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-surface/30">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Identité & Technique
              </h3>
              <div className="space-y-1">
                <Row label="ID Unique" value={selectedAff.id} mono />
                <Row label="Email" value={selectedAff.profiles?.email || 'N/A'} mono />
                <Row label="Rôle Actuel" value={selectedAff.profiles?.role || 'N/A'} />
                
                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-xs text-slate-400">Gains Historiques (Classement)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gold font-bold font-mono text-sm">{(Number(selectedAff.total_earned) || 0).toLocaleString()} €</span>
                    <button 
                      onClick={async () => {
                        const newEarned = await handleUpdateTotalEarned(selectedAff.id, Number(selectedAff.total_earned) || 0)
                        if (newEarned !== undefined) {
                          setSelectedAff({ ...selectedAff, total_earned: newEarned })
                        }
                      }}
                      className="text-slate-500 hover:text-white"
                      title="Modifier les gains manuellement"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-xs text-slate-400">Commission (CPA)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{(selectedAff.commission_rate * 100).toFixed(0)}%</span>
                    <button 
                      onClick={() => handleUpdateCommissionRate(selectedAff.id, selectedAff.commission_rate)}
                      className="text-slate-500 hover:text-white"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <Row label="Telegram" value={selectedAff.contact_telegram || '—'} color="text-blue-400" />
                <Row label="WhatsApp" value={selectedAff.contact_whatsapp || '—'} color="text-green-400" />
                <Row label="Téléphone" value={selectedAff.contact_phone || '—'} />
                
                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-xs text-slate-400">Code Parrainage</span>
                  <span className="font-mono text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-800/50 text-[11px]">{selectedAff.referral_code}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-xs text-slate-400">Recruteur Assigné</span>
                  <select 
                    value={selectedAff.recruiter_id || ''}
                    onChange={(e) => {
                      handleAssignRecruiter(selectedAff.id, e.target.value)
                      setSelectedAff({ ...selectedAff, recruiter_id: e.target.value })
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="">Aucun</option>
                    {recruiters.map(r => (
                      <option key={r.id} value={r.id}>{r.full_name}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-surface/30">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Coordonnées Bancaires
              </h3>
              <div className="space-y-1">
                {selectedAff.iban ? (
                  <>
                    <Row label="Titulaire" value={selectedAff.iban_holder || 'N/A'} color="text-gold" />
                    <Row label="IBAN" value={selectedAff.iban} mono />
                    {selectedAff.bic && <Row label="BIC" value={selectedAff.bic} mono />}
                  </>
                ) : (
                  <p className="text-xs text-slate-500 font-mono text-center py-4">Aucun IBAN renseigné</p>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-surface/30">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Gestion Rapide
              </h3>
              <div className="space-y-2">
                
                {selectedAff.status === 'pending' && (
                  <button 
                    onClick={() => { handleUpdateAffiliateStatus(selectedAff.id, 'active'); setSelectedAff({ ...selectedAff, status: 'active' }) }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition-all"
                  >
                    Approuver l'affilié
                  </button>
                )}

                {selectedAff.status === 'active' && (
                  <button 
                    onClick={() => setCommissionModal({ isOpen: true, affiliateId: selectedAff.id, affiliateName: selectedAff.profiles?.full_name || 'Inconnu' })}
                    className="w-full py-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold text-xs hover:bg-gold/20 transition-all flex justify-center items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" /> Modifier Solde Commission
                  </button>
                )}

                <div className="pt-4 border-t border-slate-800/50 mt-4 space-y-2">
                  {selectedAff.profiles?.role !== 'recruiter' ? (
                    <button 
                      onClick={() => { handleUpdateRole(selectedAff.id, 'recruiter'); setSelectedAff({ ...selectedAff, profiles: { ...selectedAff.profiles, role: 'recruiter' } }) }}
                      className="w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                    >
                      Promouvoir en Recruteur
                    </button>
                  ) : (
                    <button 
                      onClick={() => { handleUpdateRole(selectedAff.id, 'affiliate'); setSelectedAff({ ...selectedAff, profiles: { ...selectedAff.profiles, role: 'affiliate' } }) }}
                      className="w-full py-2 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-700 border border-slate-700 transition-all"
                    >
                      Rétrograder en Affilié
                    </button>
                  )}

                  <button 
                    onClick={() => { handleUpdateAffiliateStatus(selectedAff.id, selectedAff.status === 'suspended' ? 'active' : 'suspended'); setSelectedAff({ ...selectedAff, status: selectedAff.status === 'suspended' ? 'active' : 'suspended' }) }}
                    className="w-full py-2 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-semibold hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                  >
                    {selectedAff.status === 'suspended' ? '↩ Réactiver' : '⊘ Suspendre'}
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteAffiliate(selectedAff.id)}
                    className="w-full py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 border border-red-500/20 transition-all"
                  >
                    Supprimer DÉFINITIVEMENT
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-surface/30 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Synthèse des Performances
              </h3>
              
              {selectedAffStats?.loading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                      <span className="block text-xs font-semibold text-slate-400 mb-1">Clics Totaux</span>
                      <span className="block text-3xl font-extrabold font-mono text-cyan-400">{selectedAffStats?.totalClicks || 0}</span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                      <span className="block text-xs font-semibold text-slate-400 mb-1">Conversion (FTD)</span>
                      <span className="block text-3xl font-extrabold font-mono text-purple-400">
                        {selectedAffStats?.conversionRate.toFixed(2) || 0}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Répartition par Casino (Clics / Dépôts)</h4>
                    {Object.keys(selectedAffStats?.clicksByCasino || {}).length === 0 ? (
                      <p className="text-xs text-slate-500 font-mono italic">Aucune donnée de clic enregistrée.</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(selectedAffStats?.clicksByCasino || {}).map(([casinoSlug, data]: [string, any]) => (
                          <div key={casinoSlug} className="flex justify-between items-center p-3 bg-[#0a0a0f] border border-slate-800/80 rounded-lg">
                            <span className="font-semibold text-white capitalize text-sm">{casinoSlug}</span>
                            <div className="flex gap-4 font-mono text-xs">
                              <span className="text-slate-400"><strong className="text-cyan-400">{data.clicks}</strong> clics</span>
                              <span className="text-slate-400"><strong className="text-gold">{data.commissions}</strong> FTD</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Dernières Commissions Générées</h4>
                    {selectedAffStats?.recentCommissions && selectedAffStats.recentCommissions.length > 0 ? (
                      <div className="space-y-2">
                        {selectedAffStats.recentCommissions.map((c: any) => (
                          <div key={c.id} className="flex justify-between items-center p-3 bg-[#0a0a0f] border border-slate-800/80 rounded-lg text-xs">
                            <span className="text-slate-400">{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
                            <span className="font-semibold text-white">{c.periode || 'N/A'}</span>
                            <span className={`font-mono font-bold ${c.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {c.amount > 0 ? '+' : ''}{c.amount} €
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-mono italic">Aucune commission historique.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-surface/30">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Message Dashboard Affilié
              </h3>
              <p className="text-xs text-slate-400 mb-4">Ce message s'affichera tout en haut du tableau de bord de cet affilié spécifiquement.</p>
              
              <div className="space-y-3">
                <textarea
                  value={selectedAff.admin_message || ''}
                  onChange={(e) => setSelectedAff({ ...selectedAff, admin_message: e.target.value })}
                  placeholder="Ex: Attention, la qualité de votre trafic est mauvaise..."
                  className="w-full h-24 bg-[#0a0a0f] border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  disabled={isAdminMessageSaving}
                  onClick={() => handleSaveAdminMessage(selectedAff.id, selectedAff.admin_message)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isAdminMessageSaving ? 'Sauvegarde...' : 'Enregistrer le message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Affiliate List view
  return (
    <>
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4 relative">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">Gestion des Affiliés</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAffiliates}
              className="px-3 py-1.5 rounded-lg bg-surface border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Exporter CSV</span>
            </button>
            <span className="text-xs text-slate-500 font-mono">{affiliates.length} membre(s)</span>
          </div>
        </div>

        <div className="space-y-2">
          {affiliates.length === 0 ? (
            <p className="text-slate-500 font-mono text-sm p-4 text-center">Aucun affilié trouvé.</p>
          ) : affiliates.map((aff) => (
            <div
              key={aff.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-sm font-bold text-primary uppercase">
                  {(aff.profiles?.full_name || '?')[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm truncate flex items-center gap-2">
                    <span>{aff.profiles?.full_name || 'Sans Nom'}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal">{aff.profiles?.role}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${getVipInfo(Number(aff.total_earned) || 0).border} ${getVipInfo(Number(aff.total_earned) || 0).bg} ${getVipInfo(Number(aff.total_earned) || 0).color}`}>
                      {getVipInfo(Number(aff.total_earned) || 0).icon} {getVipInfo(Number(aff.total_earned) || 0).name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{aff.profiles?.email || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs font-bold text-gold hidden sm:block">{(Number(aff.total_earned) || 0).toLocaleString()} €</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  aff.status === 'active' ? 'bg-emerald/20 text-emerald border border-emerald/30' :
                  aff.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {aff.status}
                </span>
                <button
                  onClick={() => setSelectedAff(aff)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-primary/20 border border-slate-700 hover:border-primary/40 text-slate-400 hover:text-primary transition-all flex items-center gap-1 text-xs font-semibold"
                  title="Voir les détails et statistiques"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden md:inline">Détails</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-800/50">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" /> Message Global (Telegram)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <button 
              onClick={() => setTelegramMessage("🚨 <b>Qualité du Trafic</b>\n\nPetit rappel important : tout trafic frauduleux ou non conforme sera pénalisé.\n\nNous surveillons de près la qualité des joueurs envoyés, merci de respecter nos conditions !\n\nL'équipe FrenchCasino")}
              className="p-4 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 rounded-xl text-left transition-colors"
            >
              <span className="text-xl mb-2 block">🚨</span>
              <h3 className="font-bold text-white text-sm mb-1">Qualité & Règles</h3>
              <p className="text-[10px] text-slate-400">Alerte Fraude ou KPI</p>
            </button>
            <button 
              onClick={() => setTelegramMessage("👋 <b>Bienvenue aux nouveaux affiliés !</b>\n\nFrench Casino vous rémunère de la façon suivante :\n\n💰 <b>Commissions (CPA) :</b>\nSi un membre dépose 15€ sur un casino via votre lien de partage, vous remportez de 20€ à 70€ selon la promotion du jour.\n\n🎁 <b>Remboursement des dépôts :</b>\nVous pouvez profiter de nos promotions pour rembourser vos membres lors de leur dépôt ! Vous avez juste à faire une demande de remboursement dans la rubrique \"Paiement\" de votre tableau de bord. Le remboursement interviendra généralement le lendemain du dépôt.\n\n📅 <b>Paiement de vos soldes :</b>\nNous faisons les virements de vos soldes entre le 15 et le 20 du mois suivant.\n<i>Exemple : En septembre, vous avez un solde disponible de 530€. Ce montant sera remis à zéro le 1er octobre et vous pourrez demander le paiement de 530€ (ou moins) à partir du 15 octobre.</i>\n\n❓ Si vous avez des questions, n'hésitez pas à vous adresser à votre recruteur.\n\nL'équipe FrenchCasino")}
              className="p-4 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 rounded-xl text-left transition-colors md:col-span-2 lg:col-span-3"
            >
              <span className="text-xl mb-2 block">👋</span>
              <h3 className="font-bold text-white text-sm mb-1">Bienvenue Nouvel Affilié</h3>
              <p className="text-[10px] text-slate-400">Explication détaillée (Commissions, Remboursements, Virements 15-20)</p>
            </button>
          </div>

          <form onSubmit={handleSendTelegramBroadcast} className="relative z-10">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-300">Message (Supporte le HTML Telegram &lt;b&gt;, &lt;i&gt;, &lt;a href=""&gt;)</label>
                <div className="flex gap-1">
                  {['🎰', '🔥', '💰', '🏆', '🚨', '🆕', '💸', '💎', '🚀', '🎁', '📈', '✅', '⚠️', '🎉', '🤑'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setTelegramMessage(prev => prev + emoji)}
                      className="w-6 h-6 flex items-center justify-center text-sm bg-slate-800 hover:bg-slate-700 hover:text-xl rounded transition-all"
                      title="Ajouter l'émoji"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <textarea 
                value={telegramMessage}
                onChange={(e) => setTelegramMessage(e.target.value)}
                className="w-full h-48 bg-[#0a0a0f] border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y font-mono text-sm"
                placeholder="Saisissez votre message ici..."
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isSendingTelegram || !telegramMessage.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingTelegram ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Envoyer à tous les affiliés (Canal)</>}
            </button>
          </form>
        </div>
      </div>

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
              <DollarSign className={commissionType === 'add' ? "text-gold w-6 h-6" : "text-red-500 w-6 h-6"} /> 
              {commissionType === 'add' ? 'Ajouter Commission' : 'Déduire Commission'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {commissionType === 'add' ? 'Créditez manuellement le solde de l\'affilié' : 'Retirez un montant du solde de l\'affilié'} <strong className="text-white">{commissionModal.affiliateName}</strong>.
            </p>
            
            <form onSubmit={handleAddCommission} className="space-y-4">
              
              <div className="flex bg-[#0a0a0f] border border-slate-700 rounded-xl p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setCommissionType('add')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    commissionType === 'add' ? 'bg-gold/20 text-gold shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  + Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionType('deduct')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    commissionType === 'deduct' ? 'bg-red-500/20 text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  - Déduire
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant ({commissionType === 'add' ? '+' : '-'})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={commissionAmount}
                  onChange={e => setCommissionAmount(e.target.value)}
                  placeholder="Ex: 50.00"
                  className={`w-full bg-[#0a0a0f] border rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none ${
                    commissionType === 'add' ? 'border-slate-700 focus:border-gold' : 'border-red-900/50 focus:border-red-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Note / Raison</label>
                <input
                  type="text"
                  required
                  value={commissionNote}
                  onChange={e => setCommissionNote(e.target.value)}
                  placeholder={commissionType === 'add' ? "Ex: Dépôt 100€ Joueur X" : "Ex: Annulation de paiement / Frais"}
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  commissionType === 'add' 
                    ? 'text-black bg-gold hover:bg-gold-light shadow-gold-glow' 
                    : 'text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                }`}
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> En cours...</> : (commissionType === 'add' ? 'Valider l\'ajout' : 'Valider la déduction')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
