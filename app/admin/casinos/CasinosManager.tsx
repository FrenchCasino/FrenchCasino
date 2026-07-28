'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Casino } from '@/lib/data/casinos'
import { saveCasino, deleteCasino, updateCasinoOrder, autoFixLogos } from './actions'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { useConfirm } from '@/components/ui/ConfirmModal'

export default function CasinosManager({ initialCasinos }: { initialCasinos: Casino[] }) {
  const [casinos, setCasinos] = useState<Casino[]>(initialCasinos)
  const [editing, setEditing] = useState<Casino | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { confirm, ConfirmDialog } = useConfirm()

  useEffect(() => {
    const needsFix = casinos.some(c => c.logoUrl && (c.logoUrl.startsWith('/casinos/') || c.logoUrl.includes('google.com/s2/favicons')));
    if (needsFix) {
      console.log('Fixing logos automatically...');
      autoFixLogos().then(() => {
        window.location.reload();
      });
    }
  }, [casinos]);

  const handleEdit = (casino: Casino) => {
    setEditing({ ...casino })
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    setIsLoading(true);
    const newCasinos = [...casinos];
    const current = newCasinos[index];
    const prev = newCasinos[index - 1];
    const currentOrder = current.ordreClassement;
    current.ordreClassement = prev.ordreClassement;
    prev.ordreClassement = currentOrder;
    newCasinos[index] = prev;
    newCasinos[index - 1] = current;
    setCasinos(newCasinos);
    try {
      await updateCasinoOrder([
        { id: current.id, ordreClassement: current.ordreClassement },
        { id: prev.id, ordreClassement: prev.ordreClassement }
      ]);
    } catch (e: any) {
      toast.error("Erreur lors de la sauvegarde de l'ordre.")
    } finally {
      setIsLoading(false);
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === casinos.length - 1) return;
    setIsLoading(true);
    const newCasinos = [...casinos];
    const current = newCasinos[index];
    const next = newCasinos[index + 1];
    const currentOrder = current.ordreClassement;
    current.ordreClassement = next.ordreClassement;
    next.ordreClassement = currentOrder;
    newCasinos[index] = next;
    newCasinos[index + 1] = current;
    setCasinos(newCasinos);
    try {
      await updateCasinoOrder([
        { id: current.id, ordreClassement: current.ordreClassement },
        { id: next.id, ordreClassement: next.ordreClassement }
      ]);
    } catch (e: any) {
      toast.error("Erreur lors de la sauvegarde de l'ordre.")
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreate = () => {
    setEditing({
      id: '',
      name: '',
      slug: '',
      logoUrl: '/casinos/placeholder.webp',
      licence: 'Curacao',
      noteFiabilite: 4.5,
      description: '',
      bonusSansDepot: null,
      bonusDepot: '',
      fraisRetrait: '0%',
      delaiRetrait: '24h',
      wager: 'x40',
      lienAffilie: '',
      ordreClassement: casinos.length + 1,
      tags: [],
      pointsForts: [],
      badgeText: '',
      highlighted: false
    })
  }

  const handleSave = async () => {
    if (!editing) return
    setIsLoading(true)
    try {
      await saveCasino(editing)
      toast.success("Casino enregistre avec succes ! La modification est en ligne.")
      window.location.reload()
    } catch (e: any) {
      toast.error("Erreur lors de la sauvegarde : " + e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (id.length < 5) {
      toast.error("Impossible de supprimer une donnee systeme.")
      return
    }
    const ok = await confirm({
      title: 'Supprimer ce casino',
      message: 'Etes-vous sur de vouloir supprimer definitivement ce casino ? Cette action est irreversible.',
      confirmLabel: 'Supprimer',
      cancelLabel: 'Annuler',
      variant: 'danger',
    })
    if (!ok) return

    setIsLoading(true)
    try {
      await deleteCasino(id)
      toast.success("Casino supprime avec succes.")
      window.location.reload()
    } catch (e: any) {
      toast.error("Erreur : " + e.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{editing.id ? 'Modifier le Casino' : 'Ajouter un Casino'}</h2>
          <button onClick={() => setEditing(null)} className="p-2 bg-surface rounded hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Nom du Casino</label>
            <input type="text" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Slug (URL)</label>
            <input type="text" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-slate-400">Lien d'affiliation</label>
            <input type="text" value={editing.lienAffilie} onChange={e => setEditing({...editing, lienAffilie: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-slate-400">URL du Logo (Image)</label>
            <input type="text" value={editing.logoUrl} onChange={e => setEditing({...editing, logoUrl: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm font-mono" placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Bonus Depot (Joueur)</label>
            <input type="text" value={editing.bonusDepot} onChange={e => setEditing({...editing, bonusDepot: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Commission Affilie (CPA)</label>
            <input type="text" value={editing.commissionCpa || ''} onChange={e => setEditing({...editing, commissionCpa: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" placeholder="Ex: 50 CPA" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Bonus Sans Depot</label>
            <input type="text" value={editing.bonusSansDepot || ''} onChange={e => setEditing({...editing, bonusSansDepot: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Ordre de classement (1 = Premier)</label>
            <input type="number" value={editing.ordreClassement} onChange={e => setEditing({...editing, ordreClassement: Number(e.target.value)})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Note Fiabilite (ex: 4.8)</label>
            <input type="number" step="0.1" value={editing.noteFiabilite} onChange={e => setEditing({...editing, noteFiabilite: Number(e.target.value)})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5 md:col-span-2 flex flex-col justify-center">
            <label className="text-xs font-semibold text-emerald-400 flex items-center gap-2 cursor-pointer bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/50">
              <input
                type="checkbox"
                checked={editing.visible_affiliate !== false}
                onChange={e => setEditing({ ...editing, visible_affiliate: e.target.checked })}
                className="rounded border-slate-700 text-emerald-400 focus:ring-emerald-400 bg-slate-900"
              />
              <span>Visible Espace Affilie</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="mt-6 w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? 'Sauvegarde...' : <><Save className="w-4 h-4" /> Sauvegarder (En ligne)</>}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ConfirmDialog />
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={handleCreate} className="flex-1 py-3 border border-dashed border-slate-600 text-slate-300 hover:text-white hover:bg-surface-border rounded-xl flex items-center justify-center gap-2 font-medium transition-colors">
          <Plus className="w-5 h-5" /> Ajouter un nouveau Casino
        </button>
        <button
          onClick={async () => {
            setIsLoading(true);
            try {
              await autoFixLogos();
              toast.success("Tous les logos ont ete reinitialises avec succes !")
              window.location.reload();
            } catch(e: any) {
              toast.error("Erreur : " + e.message)
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className="px-4 py-3 bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/50 text-purple-200 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shrink-0"
        >
          Synchroniser Tous Les Logos HD
        </button>
      </div>

      <div className="space-y-2">
        {casinos.map((casino, index) => (
          <div key={casino.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-border hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
              <input
                type="number"
                defaultValue={casino.ordreClassement}
                onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                onBlur={async (e) => {
                  const newVal = parseInt(e.target.value);
                  if (newVal && newVal !== casino.ordreClassement) {
                    setIsLoading(true);
                    try {
                      const updates = [{ id: casino.id, ordreClassement: newVal }];
                      const swappedCasino = casinos.find(c => c.ordreClassement === newVal);
                      if (swappedCasino) updates.push({ id: swappedCasino.id, ordreClassement: casino.ordreClassement });
                      await updateCasinoOrder(updates);
                      window.location.reload();
                    } catch (err) {
                      toast.error("Erreur lors de la mise a jour du classement.")
                    }
                  }
                }}
                disabled={isLoading}
                className="w-16 bg-slate-900 border border-slate-700 text-white font-bold text-center py-2 rounded-lg hover:border-slate-500 focus:border-primary focus:outline-none transition-colors"
                title="Modifier le classement"
              />
              <div>
                <h3 className="font-bold text-white text-lg">{casino.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">{casino.bonusDepot} {casino.bonusSansDepot && `+ ${casino.bonusSansDepot}`}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(casino)} className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(casino.id)} className="p-2 bg-slate-800 hover:bg-red-900/50 text-red-400 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
