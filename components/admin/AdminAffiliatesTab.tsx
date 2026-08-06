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
  const { confirm, ConfirmDialog } = useConfirm()

  const [selectedAff, setSelectedAff] = useState<any>(null)
  const [commissionModal, setCommissionModal] = useState<{isOpen: boolean, affiliateId: string, affiliateName: string}>({ isOpen: false, affiliateId: '', affiliateName: '' })
  const [commissionAmount, setCommissionAmount] = useState('')
  const [commissionType, setCommissionType] = useState<'add' | 'deduct'>('add')
  const [commissionNote, setCommissionNote] = useState('Dépôt Joueur')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAdminMessageSaving, setIsAdminMessageSaving] = useState(false)

  useEffect(() => {
    // Automatically clean old clicks in the background when the admin tab loads
    fetch('/api/admin/clean-clicks', { method: 'POST' }).catch(console.error)
  }, [])


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

  const handleUpdateCPA = async (id: string, currentRate: number) => {
    const newRateStr = window.prompt("Nouveau CPA (€) par dépôt (ex: 20 ou 50)", currentRate.toString())
    if (!newRateStr) return
    const newRate = parseFloat(newRateStr)
    if (isNaN(newRate) || newRate < 0) {
      toast.error('Montant invalide.')
      return
    }
    const { error } = await supabase.from('affiliates').update({ commission_rate: newRate }).eq('id', id)
    if (!error) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, commission_rate: newRate } : a))
      toast.success(`CPA mis à jour : ${newRate}€`)
    } else {
      toast.error('Erreur lors de la mise à jour du CPA')
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
      "Nom", "Email", "Rôle", "CPA (€)", "Total accumulé (€)", "Solde Actuel (€)", "Statut", "IBAN Titulaire", "IBAN", "BIC"
    ];
    const rows = affiliates.map(aff => [
      aff.profiles?.full_name || 'Sans nom',
      aff.profiles?.email || '',
      aff.profiles?.role || 'affiliate',
      aff.commission_rate,
      aff.total_earned,
      aff.solde_reel,
      aff.status,
      aff.iban_holder || '',
      aff.iban || '',
      aff.bic || ''
    ]);
    downloadCSVAdmin(headers, rows, `affilies_frenchcasino_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // If an affiliate is selected, show the overlay UI
  if (selectedAff) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner Header */}
        <div className="relative glass-panel rounded-3xl border border-slate-800 bg-surface/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-purple-500/5 to-transparent opacity-50" />
          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* User Identity */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center font-display font-bold text-primary uppercase text-4xl">
                  {(selectedAff.profiles?.full_name || '?')[0]}
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="font-display font-bold text-3xl text-white flex items-center justify-center sm:justify-start gap-3">
                  <span>{selectedAff.profiles?.full_name || 'Sans Nom'}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{selectedAff.profiles?.role}</span>
                </h1>
                <p className="text-sm text-slate-400">{selectedAff.profiles?.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    selectedAff.status === 'active' ? 'bg-emerald/20 text-emerald border border-emerald/30' :
                    selectedAff.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>{selectedAff.status}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border flex items-center gap-1.5 ${getVipInfo(Number(selectedAff.total_earned) || 0).border} ${getVipInfo(Number(selectedAff.total_earned) || 0).bg} ${getVipInfo(Number(selectedAff.total_earned) || 0).color}`}>
                    {getVipInfo(Number(selectedAff.total_earned) || 0).icon} VIP {getVipInfo(Number(selectedAff.total_earned) || 0).name}
                  </span>
                </div>
              </div>
            </div>

            {/* Balances */}
            <div className="flex items-center gap-6">
              <div className="text-center md:text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Solde Retirable</p>
                <p className="text-3xl font-display font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                  {(Number(selectedAff.solde_reel) || 0).toLocaleString()} <span className="text-xl">€</span>
                </p>
              </div>
              <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
              <div className="text-center md:text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Gains Classement</p>
                <p className="text-2xl font-display font-bold text-gold opacity-80 flex items-center justify-end gap-2">
                  {(Number(selectedAff.total_earned) || 0).toLocaleString()} <span className="text-lg">€</span>
                  <button 
                    onClick={async () => {
                      const newEarned = await handleUpdateTotalEarned(selectedAff.id, Number(selectedAff.total_earned) || 0)
                      if (newEarned !== undefined) setSelectedAff({ ...selectedAff, total_earned: newEarned })
                    }}
                    className="text-slate-500 hover:text-white"
                  ><Edit className="w-3.5 h-3.5" /></button>
                </p>
              </div>
            </div>

          </div>
          
          {/* Action Bar */}
          <div className="bg-slate-900/80 border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-4">
            <button 
              onClick={() => setSelectedAff(null)}
              className="px-4 py-2 rounded-xl bg-surface border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors"
            >
              ← Retour à la liste
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const copy = { ...selectedAff };
                  setSelectedAff(null);
                  setTimeout(() => setSelectedAff(copy), 50);
                }}
                className="px-4 py-2 rounded-xl bg-surface border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* General Specs */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40 space-y-8 lg:col-span-2">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
              </div>
              Paramètres du compte
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800/50">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">CPA Actuel</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">{selectedAff.commission_rate} €</span>
                  <button onClick={() => handleUpdateCPA(selectedAff.id, selectedAff.commission_rate)} className="text-slate-500 hover:text-white p-1.5 bg-slate-800 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              
              <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800/50">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">Code Parrainage</span>
                <span className="font-mono text-purple-300 bg-purple-900/30 px-3 py-1.5 rounded-lg text-sm border border-purple-800/50 block w-fit">{selectedAff.referral_code}</span>
              </div>
              
              <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800/50">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">Recruteur</span>
                <select 
                  value={selectedAff.recruiter_id || ''}
                  onChange={(e) => {
                    handleAssignRecruiter(selectedAff.id, e.target.value)
                    setSelectedAff({ ...selectedAff, recruiter_id: e.target.value })
                  }}
                  className="bg-surface border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary w-full"
                >
                  <option value="">Aucun</option>
                  {recruiters.map(r => (
                    <option key={r.id} value={r.id}>{r.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800/50">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">ID Unique</span>
                <span className="font-mono text-xs text-slate-400">{selectedAff.id}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contacts</h4>
              <div className="flex flex-wrap gap-3">
                <div className="px-5 py-3 bg-blue-900/10 border border-blue-800/30 rounded-xl flex items-center gap-3 min-w-[200px]">
                  <Send className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="text-[10px] text-blue-400/70 font-bold uppercase block">Telegram</span>
                    <span className="text-sm text-white">{selectedAff.contact_telegram || 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="px-5 py-3 bg-green-900/10 border border-green-800/30 rounded-xl flex items-center gap-3 min-w-[200px]">
                  <span className="w-4 h-4 text-green-400 flex items-center justify-center font-bold text-xs">W</span>
                  <div>
                    <span className="text-[10px] text-green-400/70 font-bold uppercase block">WhatsApp</span>
                    <span className="text-sm text-white">{selectedAff.contact_whatsapp || 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="px-5 py-3 bg-slate-800/30 border border-slate-700/50 rounded-xl flex items-center gap-3 min-w-[200px]">
                  <span className="w-4 h-4 text-slate-400 flex items-center justify-center font-bold text-xs">P</span>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Téléphone</span>
                    <span className="text-sm text-white">{selectedAff.contact_phone || 'Non renseigné'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Message Dashboard Affilié</h4>
               <p className="text-[11px] text-slate-500 mb-4">Ce message s'affichera tout en haut du tableau de bord de cet affilié spécifiquement (ex: rappel de qualité de trafic).</p>
               <div className="flex flex-col sm:flex-row gap-3">
                  <textarea
                    value={selectedAff.admin_message || ''}
                    onChange={(e) => setSelectedAff({ ...selectedAff, admin_message: e.target.value })}
                    placeholder="Tapez un message d'alerte ou d'encouragement..."
                    className="flex-1 min-h-[60px] bg-[#0a0a0f] border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 resize-y"
                  />
                  <button
                    disabled={isAdminMessageSaving}
                    onClick={() => handleSaveAdminMessage(selectedAff.id, selectedAff.admin_message)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isAdminMessageSaving ? 'En cours...' : 'Publier le message'}
                  </button>
               </div>
            </div>
          </div>

          {/* Right Column: Banking & Actions */}
          <div className="space-y-6">
            
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                </div>
                Données Bancaires
              </h3>
              
              <div className="space-y-4">
                {selectedAff.iban ? (
                  <>
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Titulaire du compte</span>
                      <span className="text-sm font-bold text-gold break-words">{selectedAff.iban_holder || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">IBAN</span>
                      <span className="text-xs font-mono text-slate-300 break-all">{selectedAff.iban}</span>
                    </div>
                    {selectedAff.bic && (
                      <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">BIC / SWIFT</span>
                        <span className="text-xs font-mono text-slate-300 break-all">{selectedAff.bic}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-slate-900/30 rounded-2xl p-8 border border-slate-800/30 text-center border-dashed">
                    <p className="text-xs text-slate-500 font-mono">Aucun RIB renseigné par l'affilié.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]"></span>
                </div>
                Actions Rapides
              </h3>
              
              <div className="space-y-3">
                {selectedAff.status === 'pending' && (
                  <button 
                    onClick={() => { handleUpdateAffiliateStatus(selectedAff.id, 'active'); setSelectedAff({ ...selectedAff, status: 'active' }) }}
                    className="w-full py-4 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform"
                  >
                    Approuver l'affilié
                  </button>
                )}

                {selectedAff.status === 'active' && (
                  <button 
                    onClick={() => {
                      setCommissionAmount(selectedAff.commission_rate?.toString() || '0')
                      setCommissionModal({ isOpen: true, affiliateId: selectedAff.id, affiliateName: selectedAff.profiles?.full_name || 'Inconnu' })
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-black font-bold text-sm shadow-gold-glow hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" /> Ajouter Commission
                  </button>
                )}

                <div className="pt-3">
                  {selectedAff.profiles?.role !== 'recruiter' ? (
                    <button 
                      onClick={() => { handleUpdateRole(selectedAff.id, 'recruiter'); setSelectedAff({ ...selectedAff, profiles: { ...selectedAff.profiles, role: 'recruiter' } }) }}
                      className="w-full py-3 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                    >
                      Promouvoir en Recruteur
                    </button>
                  ) : (
                    <button 
                      onClick={() => { handleUpdateRole(selectedAff.id, 'affiliate'); setSelectedAff({ ...selectedAff, profiles: { ...selectedAff.profiles, role: 'affiliate' } }) }}
                      className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Rétrograder en Affilié
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    onClick={() => { handleUpdateAffiliateStatus(selectedAff.id, selectedAff.status === 'suspended' ? 'active' : 'suspended'); setSelectedAff({ ...selectedAff, status: selectedAff.status === 'suspended' ? 'active' : 'suspended' }) }}
                    className="flex-1 py-3 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                  >
                    {selectedAff.status === 'suspended' ? '↩ Réactiver' : '⊘ Suspendre'}
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteAffiliate(selectedAff.id)}
                    className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 border border-red-500/20 transition-colors"
                  >
                    Détruire
                  </button>
                </div>
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
                <span className="font-mono text-xs font-bold text-gold hidden sm:block">{(Number(aff.solde_reel) || 0).toLocaleString()} €</span>
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
      <ConfirmDialog />
    </>
  )
}
