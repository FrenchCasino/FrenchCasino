'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Building,
  Plus,
  ExternalLink,
  DollarSign,
  Percent,
  Handshake,
  Edit,
  Trash2,
  XCircle,
  CheckSquare,
  Square
} from 'lucide-react'
import { useConfirm } from '@/components/ui/ConfirmModal'
import { CASINOS_MOCK } from '@/lib/data/casinos'

export default function AdminPartnersTab({ casinos }: { casinos: any[] }) {
  const { confirm, ConfirmDialog } = useConfirm()
  const [partners, setPartners] = useState<any[]>([])
  
  const [partnerModal, setPartnerModal] = useState<{isOpen: boolean, editingId: string | null}>({isOpen: false, editingId: null})
  const [newPartner, setNewPartner] = useState({
    name: '',
    dashboard_url: '',
    cpa_commission: '',
    rs_commission: '',
    casinos_relies: [] as string[]
  })

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      const partnersRes = await fetch('/api/admin/partners')
      if (partnersRes.ok) {
        const partnersData = await partnersRes.json()
        
        // Migration automatique depuis le localStorage s'il existe et si la base de données est vide
        const localPartnersStr = localStorage.getItem('french_casino_partners')
        if (localPartnersStr && partnersData.length === 0) {
          try {
            const localPartners = JSON.parse(localPartnersStr)
            if (Array.isArray(localPartners) && localPartners.length > 0) {
              console.log("Migration des partenaires depuis le localStorage vers Supabase...")
              for (const p of localPartners) {
                await fetch('/api/admin/partners', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: p.name,
                    dashboard_url: p.dashboard_url,
                    cpa_commission: p.cpa_commission,
                    rs_commission: p.rs_commission,
                    casinos_relies: p.casinos_relies || []
                  })
                })
              }
              // Recharger les partenaires après la migration
              const newRes = await fetch('/api/admin/partners')
              if (newRes.ok) {
                const newData = await newRes.json()
                setPartners(newData)
              }
              // Optionnel: nettoyer le localStorage après migration
              // localStorage.removeItem('french_casino_partners')
              return
            }
          } catch (e) {
            console.error("Erreur lors de la migration du localStorage:", e)
          }
        }
        
        setPartners(partnersData)
      }
    } catch (err) {
      console.error("Error loading partners:", err)
    }
  }

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPartner.name || !newPartner.dashboard_url) {
      toast.error('Veuillez renseigner au moins le nom et le lien du dashboard.')
      return
    }

    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: partnerModal.editingId,
          ...newPartner
        })
      })

      if (res.ok) {
        toast.success(`Partenaire ${partnerModal.editingId ? 'modifié' : 'ajouté'} avec succès !`)
        setPartnerModal({ isOpen: false, editingId: null })
        loadPartners()
      } else {
        toast.error('Erreur lors de la sauvegarde : ' + await res.text())
      }
    } catch (err) {
      toast.error('Erreur réseau')
    }
  }

  const handleDeletePartner = async (id: string) => {
    const ok = await confirm({
      title: 'Supprimer ce partenaire',
      message: 'Voulez-vous vraiment supprimer ce partenaire ? Cette action est irréversible.',
      confirmLabel: 'Supprimer',
      variant: 'danger',
    })
    if (!ok) return

    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Partenaire supprimé avec succès.')
        loadPartners()
      } else {
        toast.error('Erreur lors de la suppression : ' + await res.text())
      }
    } catch (err) {
      toast.error('Erreur réseau')
    }
  }

  const toggleCasinoInPartner = (casinoName: string) => {
    setNewPartner(prev => {
      const exists = prev.casinos_relies.includes(casinoName)
      return {
        ...prev,
        casinos_relies: exists 
          ? prev.casinos_relies.filter(c => c !== casinoName)
          : [...prev.casinos_relies, casinoName]
      }
    })
  }

  const openCreatePartnerModal = () => {
    setNewPartner({
      name: '',
      dashboard_url: '',
      cpa_commission: '',
      rs_commission: '',
      casinos_relies: []
    })
    setPartnerModal({ isOpen: true, editingId: null })
  }

  const openEditPartnerModal = (partner: any) => {
    setNewPartner({
      name: partner.name || '',
      dashboard_url: partner.dashboard_url || '',
      cpa_commission: partner.cpa_commission || '',
      rs_commission: partner.rs_commission || '',
      casinos_relies: (partner.casinos_relies || []).filter((cName: string) => casinos.some(c => c.name === cName))
    })
    setPartnerModal({ isOpen: true, editingId: partner.id })
  }

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30 shrink-0">
              <Building className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Plateformes Partenaires & Réseaux
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Gérez vos comptes partenaires externes, accédez rapidement à leurs dashboards, configurez vos taux CPA & RS et attribuez les casinos reliés.
              </p>
            </div>
          </div>
          <button 
            onClick={openCreatePartnerModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-gold text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-[1.02] shadow-gold-glow shrink-0 transition-transform"
          >
            <Plus className="w-4 h-4" />
            Ajouter un Partenaire
          </button>
        </div>

        <div className="space-y-4">
          {partners.length === 0 ? (
            <div className="p-8 glass-panel rounded-xl text-center text-slate-400 space-y-2">
              <Building className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold">Aucun partenaire configuré pour le moment.</p>
              <p className="text-xs text-slate-500">Cliquez sur "Ajouter un Partenaire" pour créer votre premier compte d'affiliation.</p>
            </div>
          ) : partners.map((partner) => (
            <div 
              key={partner.id} 
              className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-gold/40 transition-all shadow-lg grid grid-cols-1 xl:grid-cols-12 items-center gap-4 overflow-hidden group"
            >
              {/* Colonne 1 : Nom du Partenaire & Statut (xl:col-span-3) */}
              <div className="xl:col-span-3 flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/50 text-gold shrink-0 group-hover:scale-105 transition-transform">
                  <Building className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm sm:text-base leading-tight truncate group-hover:text-gold transition-colors">
                    {partner.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Actif
                    </span>
                    <span className="text-slate-600 text-xs shrink-0">•</span>
                    <a 
                      href={partner.dashboard_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition-colors truncate"
                    >
                      <span>Dashboard</span>
                      <ExternalLink className="w-3 h-3 text-gold shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Colonne 2 : Badges Commissions CPA & RS (xl:col-span-3) */}
              <div className="xl:col-span-3 flex items-center gap-2">
                <div className="flex-1 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-left min-w-0">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
                    CPA
                  </span>
                  <p className="text-xs font-mono font-bold text-emerald-400 truncate">{partner.cpa_commission || 'Non défini'}</p>
                </div>

                <div className="flex-1 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-left min-w-0">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    <Percent className="w-3 h-3 text-gold shrink-0" />
                    RS
                  </span>
                  <p className="text-xs font-mono font-bold text-gold truncate">{partner.rs_commission || 'Non défini'}</p>
                </div>
              </div>

              {/* Colonne 3 : Casinos Reliés (xl:col-span-3) */}
              <div className="xl:col-span-3 min-w-0 pr-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Handshake className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    Casinos Reliés
                  </span>
                  <span className="font-mono text-gold text-[10px] bg-gold/10 px-1.5 py-0.5 rounded-full">
                    ({(partner.casinos_relies || []).filter((cName: string) => casinos.some(c => c.name === cName)).length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-14 overflow-y-auto pr-1">
                  {(partner.casinos_relies || []).filter((cName: string) => casinos.some(c => c.name === cName)).length > 0 ? (
                    (partner.casinos_relies || []).filter((cName: string) => casinos.some(c => c.name === cName)).map((cName: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[10px] font-medium text-slate-200 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                        {cName}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Aucun casino coché</span>
                  )}
                </div>
              </div>

              {/* Colonne 4 : Actions (xl:col-span-3) — Alignée à Droite */}
              <div className="xl:col-span-3 flex items-center justify-end gap-2 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-800/80 shrink-0">
                <button 
                  onClick={() => openEditPartnerModal(partner)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1 transition-colors shrink-0"
                >
                  <Edit className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Éditer</span>
                </button>

                <button 
                  onClick={() => handleDeletePartner(partner.id)}
                  className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-xs font-semibold text-red-400 hover:text-white flex items-center gap-1 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {partnerModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="text-gold w-5 h-5" />
                {partnerModal.editingId ? 'Modifier le Partenaire' : 'Ajouter un Nouveau Partenaire'}
              </h3>
              <button 
                onClick={() => setPartnerModal({ isOpen: false, editingId: null })}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nom de la Plateforme / Partenaire *</label>
                <input
                  type="text"
                  required
                  value={newPartner.name}
                  onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="Ex: NetPartners, DriveAffiliates..."
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Lien direct vers le Dashboard Partenaire *</label>
                <input
                  type="url"
                  required
                  value={newPartner.dashboard_url}
                  onChange={e => setNewPartner({ ...newPartner, dashboard_url: e.target.value })}
                  placeholder="https://partenaire-dashboard.com/login"
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gold font-mono focus:outline-none focus:border-gold"
                />
                <p className="text-[10px] text-slate-500">Un clic sur "Dashboard" ouvrira automatiquement ce lien dans un nouvel onglet.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Commission CPA (ex: 120€ / CPA)</label>
                  <input
                    type="text"
                    value={newPartner.cpa_commission}
                    onChange={e => setNewPartner({ ...newPartner, cpa_commission: e.target.value })}
                    placeholder="Ex: 120€ CPA"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Commission RS (ex: 45% RS)</label>
                  <input
                    type="text"
                    value={newPartner.rs_commission}
                    onChange={e => setNewPartner({ ...newPartner, rs_commission: e.target.value })}
                    placeholder="Ex: 45% RS"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gold font-mono focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Casinos Reliés (Cochez les casinos gérés par ce partenaire) :</span>
                  <span className="text-[10px] text-gold font-mono">{newPartner.casinos_relies.length} coché(s)</span>
                </label>

                <div className="bg-[#0a0a0f] border border-slate-800 p-3 rounded-xl max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(casinos.length > 0 ? casinos : CASINOS_MOCK).map((c: any) => {
                    const casinoName = c.name
                    const isChecked = newPartner.casinos_relies.includes(casinoName)
                    return (
                      <label 
                        key={c.id || c.slug}
                        onClick={() => toggleCasinoInPartner(casinoName)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                          isChecked 
                            ? 'bg-purple-950/60 border-purple-500/50 text-white font-semibold' 
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-gold shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{casinoName}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPartnerModal({ isOpen: false, editingId: null })}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-500 to-gold hover:brightness-110 shadow-gold-glow transition-all"
                >
                  {partnerModal.editingId ? 'Enregistrer les Modifications' : 'Créer le Partenaire'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
