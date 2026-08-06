'use client'

import React, { useState } from 'react'
import { Plus, Award, Eye, EyeOff, Edit, Power, Trash2, XCircle, Loader2, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '@/components/ui/ConfirmModal'
import { FlagIcon } from '@/components/ui/FlagIcon'

export default function AdminCasinosTab({ 
  casinos, 
  setCasinos, 
  loadData,
  supabase
}: { 
  casinos: any[], 
  setCasinos: (c: any[]) => void, 
  loadData: () => void,
  supabase: any
}) {
  const { confirm, ConfirmDialog } = useConfirm()
  const [isSubmittingCasino, setIsSubmittingCasino] = useState(false)
  const [casinoModal, setCasinoModal] = useState<{isOpen: boolean, editingId: string | null}>({isOpen: false, editingId: null})
  const [newCasino, setNewCasino] = useState({
    name: '',
    slug: '',
    lien_affilie: '',
    logo_url: '',
    bonus_depot: '100% jusqu\'à 500€',
    bonus_sans_depot: 'Aucun',
    licence: 'Curaçao',
    remboursement_depot: false,
    minimum_depot: '20€',
    ordre_classement: 1,
    visible_affiliate: true,
    allowed_countries: [] as string[]
  })

  // Handle Add / Edit Casino
  const handleAddCasino = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCasino.name || !newCasino.slug || !newCasino.lien_affilie) {
      toast.error('Veuillez remplir les champs obligatoires (Nom, Slug, Lien)')
      return
    }

    setIsSubmittingCasino(true)
    try {
      let error;
      const casinoData = {
        name: newCasino.name,
        slug: newCasino.slug,
        lien_affilie: newCasino.lien_affilie,
        logo_url: newCasino.logo_url || '/casinos/placeholder.webp',
        bonus_depot: newCasino.bonus_depot,
        bonus_sans_depot: newCasino.bonus_sans_depot,
        licence: newCasino.licence,
        remboursement_depot: newCasino.remboursement_depot,
        minimum_depot: newCasino.minimum_depot,
        ordre_classement: Number(newCasino.ordre_classement),
        visible_affiliate: newCasino.visible_affiliate,
        allowed_countries: newCasino.allowed_countries
      }

      if (casinoModal.editingId) {
        const res = await supabase.from('casinos').update(casinoData).eq('id', casinoModal.editingId)
        error = res.error
      } else {
        const res = await supabase.from('casinos').insert([{ ...casinoData, is_active: true }])
        error = res.error
      }

      if (error) {
        if (error.code === '42703' || error.code === 'PGRST204' || (error.message && (error.message.includes('visible_affiliate') || error.message.includes('allowed_countries')))) {
          // Columns might not exist in SQL DB yet, fallback without them so update succeeds
          const { visible_affiliate, allowed_countries, ...fallbackData } = casinoData
          let fallbackRes;
          if (casinoModal.editingId) {
            fallbackRes = await supabase.from('casinos').update(fallbackData).eq('id', casinoModal.editingId)
          } else {
            fallbackRes = await supabase.from('casinos').insert([{ ...fallbackData, is_active: true }])
          }

          if (fallbackRes.error) {
            toast.error('Erreur : ' + fallbackRes.error.message)
          } else {
            toast.success(`Casino ${casinoModal.editingId ? 'modifié' : 'ajouté'} avec succès !`)
            if (!casinoModal.editingId) {
              const { data: profiles } = await supabase.from('profiles').select('id').eq('role', 'affiliate')
              if (profiles && profiles.length > 0) {
                const notifs = profiles.map((p: any) => ({
                  user_id: p.id,
                  title: 'Nouveau Casino Partenaire ! 🎰',
                  message: `Le casino ${newCasino.name} est disponible. Récupérez vos liens !`,
                  type: 'casino'
                }))
                await supabase.from('notifications').insert(notifs)
              }
            }
          }
        } else {
          toast.error('Erreur : ' + error.message)
        }
      } else {
        toast.success(`Casino ${casinoModal.editingId ? 'modifié' : 'ajouté'} avec succès !`)
        if (!casinoModal.editingId) {
          const { data: profiles } = await supabase.from('profiles').select('id').eq('role', 'affiliate')
          if (profiles && profiles.length > 0) {
            const notifs = profiles.map((p: any) => ({
              user_id: p.id,
              title: 'Nouveau Casino Partenaire ! 🎰',
              message: `Le casino ${newCasino.name} est disponible. Récupérez vos liens !`,
              type: 'casino'
            }))
            await supabase.from('notifications').insert(notifs)
          }
        }
      }

      // Persist visible_affiliate in localStorage fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(`casino_vis_aff_${newCasino.slug}`, String(newCasino.visible_affiliate))
        if (casinoModal.editingId) {
          localStorage.setItem(`casino_vis_aff_${casinoModal.editingId}`, String(newCasino.visible_affiliate))
        }
      }

      setCasinoModal({isOpen: false, editingId: null})
      setNewCasino({ name: '', slug: '', lien_affilie: '', logo_url: '', bonus_depot: '100% jusqu\'à 500€', bonus_sans_depot: 'Aucun', licence: 'Curaçao', remboursement_depot: false, minimum_depot: '20€', ordre_classement: 1, visible_affiliate: true, allowed_countries: [] })
      loadData()
    } catch (err) {
      toast.error('Erreur réseau')
    } finally {
      setIsSubmittingCasino(false)
    }
  }

  const handleToggleAffiliateVisibility = async (casino: any) => {
    const currentVis = casino.visible_affiliate !== false
    const newVis = !currentVis

    if (typeof window !== 'undefined') {
      localStorage.setItem(`casino_vis_aff_${casino.id}`, String(newVis))
      localStorage.setItem(`casino_vis_aff_${casino.slug}`, String(newVis))
    }

    setCasinos(casinos.map(c => c.id === casino.id ? { ...c, visible_affiliate: newVis } : c))

    try {
      await supabase.from('casinos').update({ visible_affiliate: newVis }).eq('id', casino.id)
    } catch (e) {}
  }

  const openEditCasinoModal = (casino: any) => {
    setNewCasino({
      name: casino.name,
      slug: casino.slug,
      lien_affilie: casino.lien_affilie,
      logo_url: casino.logo_url || '',
      bonus_depot: casino.bonus_depot || '',
      bonus_sans_depot: casino.bonus_sans_depot || '',
      licence: casino.licence || 'Curaçao',
      remboursement_depot: casino.remboursement_depot || false,
      minimum_depot: casino.minimum_depot || '20€',
      ordre_classement: casino.ordre_classement || 1,
      visible_affiliate: casino.visible_affiliate !== false,
      allowed_countries: casino.allowed_countries || []
    })
    setCasinoModal({isOpen: true, editingId: casino.id})
  }

  const handleToggleCasinoActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('casinos').update({ is_active: !currentStatus }).eq('id', id)
    if (!error) {
      setCasinos(casinos.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c))
      toast.success(`Casino ${!currentStatus ? 'activé' : 'désactivé'} avec succès.`)
    } else {
      toast.error('Erreur lors de la modification du statut du casino')
    }
  }

  const handleDeleteCasino = async (id: string) => {
    const ok = await confirm({
      title: 'Supprimer ce casino ?',
      message: 'Cette action est irréversible et retirera le casino immédiatement du site ainsi que de la vitrine.',
      confirmLabel: 'Supprimer définitivement',
      variant: 'danger',
    })
    if (!ok) return

    const { error } = await supabase.from('casinos').delete().eq('id', id)
    if (!error) {
      setCasinos(casinos.filter(c => c.id !== id))
      toast.success('Casino supprimé avec succès.')
    } else {
      toast.error('Erreur lors de la suppression : ' + error.message)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">Casinos Référencés</h3>
              <p className="text-xs text-slate-400 mt-1">Gérez le catalogue des casinos affichés sur la vitrine.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setNewCasino({ name: '', slug: '', lien_affilie: '', logo_url: '', bonus_depot: '100% jusqu\'à 500€', bonus_sans_depot: 'Aucun', licence: 'Curaçao', remboursement_depot: false, minimum_depot: '20€', ordre_classement: 1, visible_affiliate: true, allowed_countries: [] })
              setCasinoModal({isOpen: true, editingId: null})
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-purple-glow hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" />
            Ajouter un Casino
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {casinos.length === 0 ? (
            <p className="text-slate-400 font-mono text-sm p-4">Aucun casino trouvé dans la base.</p>
          ) : casinos.map((casino) => (
            <div key={casino.id} className="glass-panel p-4 rounded-xl border border-slate-800/60 hover:border-slate-700 space-y-4 relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-black/20">
              
              {/* Header: Title and Rank */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    {casino.name}
                    {!casino.is_active && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                        Inactif
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">{casino.slug}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-gold/20 to-amber-500/10 border border-gold/30 shadow-sm">
                  <Award className="w-3.5 h-3.5 text-gold" />
                  <span className="text-xs font-bold text-gold">#{casino.ordre_classement || 1}</span>
                </div>
              </div>
              
              {/* Grid Stats */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                <div className="space-y-1 text-xs">
                  <p className="text-slate-400 flex justify-between"><span>Dépôt Min:</span> <span className="text-white font-semibold ml-2">{casino.minimum_depot}</span></p>
                  <p className="text-slate-400 flex justify-between"><span>Bonus:</span> <span className="text-emerald-400 font-semibold ml-2 truncate" title={casino.bonus_depot}>{casino.bonus_depot}</span></p>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800/50 flex gap-1.5 items-center text-xs">
                  <span className="text-slate-500">Pays:</span>
                  <div className="flex gap-1.5 items-center">
                    {(casino.allowed_countries || []).includes('FR') && <FlagIcon country="FR" />}
                    {(casino.allowed_countries || []).includes('BE') && <FlagIcon country="BE" />}
                    {(casino.allowed_countries || []).includes('LU') && <FlagIcon country="LU" />}
                  </div>
                  {!(casino.allowed_countries && casino.allowed_countries.length > 0) && <span className="text-slate-500 italic text-[10px]">Non défini</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleAffiliateVisibility(casino)}
                  className={`w-full px-3 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${casino.visible_affiliate !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'}`}
                >
                  {casino.visible_affiliate !== false ? (
                    <><Eye className="w-3.5 h-3.5" /> Visible pour les affiliés</>
                  ) : (
                    <><EyeOff className="w-3.5 h-3.5" /> Masqué pour les affiliés</>
                  )}
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditCasinoModal(casino)}
                    className="flex-1 px-3 py-2 rounded-lg bg-surface border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 flex items-center justify-center gap-1.5 transition-all"
                    title="Éditer le casino"
                  >
                    <Edit className="w-3.5 h-3.5" /> Éditer
                  </button>
                  <button 
                    onClick={() => handleToggleCasinoActive(casino.id, casino.is_active)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      casino.is_active 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                    title={casino.is_active ? 'Désactiver le casino' : 'Activer le casino'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCasino(casino.id)}
                    className="px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Casino Modal */}
      {casinoModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setCasinoModal({isOpen: false, editingId: null})}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2 font-display flex items-center gap-2">
              <Plus className="text-primary w-6 h-6" /> {casinoModal.editingId ? 'Modifier le Casino' : 'Nouveau Casino Partenaire'}
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">URL du Logo (Image)</label>
                <input
                  type="url"
                  value={newCasino.logo_url}
                  onChange={e => setNewCasino({ ...newCasino, logo_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Bonus de Dépôt (Joueurs)</label>
                  <input
                    type="text"
                    value={newCasino.bonus_depot}
                    onChange={e => setNewCasino({ ...newCasino, bonus_depot: e.target.value })}
                    placeholder="Ex: 100% jusqu'à 500€"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Bonus Sans Dépôt (Joueurs)</label>
                <input
                  type="text"
                  value={newCasino.bonus_sans_depot}
                  onChange={e => setNewCasino({ ...newCasino, bonus_sans_depot: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Numéro de Classement & Visibilité Espace Affilié */}
              <div className="grid grid-cols-2 gap-4 bg-purple-950/20 p-3 rounded-xl border border-purple-800/30">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gold flex items-center justify-between">
                    <span>N° Classement (Top Casino) *</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCasino.ordre_classement}
                    onChange={e => setNewCasino({ ...newCasino, ordre_classement: Number(e.target.value) })}
                    placeholder="Ex: 1 (Premier)"
                    className="w-full bg-[#0a0a0f] border border-gold/50 rounded-xl px-4 py-2 text-sm text-gold font-mono font-bold focus:outline-none focus:border-gold"
                  />
                  <p className="text-[10px] text-slate-400">Position 1 = En tête du site public.</p>
                </div>

                <div className="space-y-1.5 flex flex-col justify-center">
                  <label className="text-xs font-semibold text-emerald-400 flex items-center gap-2 cursor-pointer bg-[#0a0a0f] p-2.5 rounded-xl border border-emerald-900/50">
                    <input
                      type="checkbox"
                      checked={newCasino.visible_affiliate}
                      onChange={e => setNewCasino({ ...newCasino, visible_affiliate: e.target.checked })}
                      className="rounded border-slate-700 text-emerald-400 focus:ring-emerald-400 bg-[#0a0a0f]"
                    />
                    <span>Visible Espace Affilié</span>
                  </label>
                  <p className="text-[10px] text-slate-400">Si coché, apparaît dans le tableau affilié.</p>
                </div>
              </div>

              {/* Pays Autorisés */}
              <div className="space-y-2 pt-2 pb-2">
                <label className="text-xs font-semibold text-slate-300">Pays Autorisés</label>
                <div className="flex gap-4 p-3 bg-[#0a0a0f] border border-slate-700 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      className="accent-primary w-4 h-4"
                      checked={newCasino.allowed_countries?.includes('FR')}
                      onChange={(e) => {
                        const current = newCasino.allowed_countries || []
                        if (e.target.checked) setNewCasino({ ...newCasino, allowed_countries: [...current, 'FR'] })
                        else setNewCasino({ ...newCasino, allowed_countries: current.filter(c => c !== 'FR') })
                      }}
                    />
                    <div className="flex items-center gap-1.5">
                      <FlagIcon country="FR" />
                      <span>France</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      className="accent-primary w-4 h-4"
                      checked={newCasino.allowed_countries?.includes('BE')}
                      onChange={(e) => {
                        const current = newCasino.allowed_countries || []
                        if (e.target.checked) setNewCasino({ ...newCasino, allowed_countries: [...current, 'BE'] })
                        else setNewCasino({ ...newCasino, allowed_countries: current.filter(c => c !== 'BE') })
                      }}
                    />
                    <div className="flex items-center gap-1.5">
                      <FlagIcon country="BE" />
                      <span>Belgique</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      className="accent-primary w-4 h-4"
                      checked={newCasino.allowed_countries?.includes('LU')}
                      onChange={(e) => {
                        const current = newCasino.allowed_countries || []
                        if (e.target.checked) setNewCasino({ ...newCasino, allowed_countries: [...current, 'LU'] })
                        else setNewCasino({ ...newCasino, allowed_countries: current.filter(c => c !== 'LU') })
                      }}
                    />
                    <div className="flex items-center gap-1.5">
                      <FlagIcon country="LU" />
                      <span>Luxembourg</span>
                    </div>
                  </label>
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
                {isSubmittingCasino ? <Loader2 className="w-5 h-5 animate-spin" /> : casinoModal.editingId ? 'Enregistrer les Modifications' : 'Ajouter le Casino'}
              </button>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog />
    </>
  )
}
