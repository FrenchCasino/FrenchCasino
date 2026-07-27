'use client'

import { useState } from 'react'
import { Casino } from '@/lib/data/casinos'
import { saveCasino, deleteCasino, updateCasinoOrder } from './actions'
import { Plus, Edit2, Trash2, Save, X, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'

export default function CasinosManager({ initialCasinos }: { initialCasinos: Casino[] }) {
  const [casinos, setCasinos] = useState<Casino[]>(initialCasinos)
  const [editing, setEditing] = useState<Casino | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (casino: Casino) => {
    setEditing({ ...casino })
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    setIsLoading(true);
    const newCasinos = [...casinos];
    const current = newCasinos[index];
    const prev = newCasinos[index - 1];
    
    // Swap order
    const currentOrder = current.ordreClassement;
    current.ordreClassement = prev.ordreClassement;
    prev.ordreClassement = currentOrder;
    
    // Swap array position for immediate UI update
    newCasinos[index] = prev;
    newCasinos[index - 1] = current;
    setCasinos(newCasinos);
    
    try {
      await updateCasinoOrder([
        { id: current.id, ordreClassement: current.ordreClassement },
        { id: prev.id, ordreClassement: prev.ordreClassement }
      ]);
    } catch (e: any) {
      alert("Erreur lors de la sauvegarde de l'ordre.");
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
    
    // Swap order
    const currentOrder = current.ordreClassement;
    current.ordreClassement = next.ordreClassement;
    next.ordreClassement = currentOrder;
    
    // Swap array position
    newCasinos[index] = next;
    newCasinos[index + 1] = current;
    setCasinos(newCasinos);
    
    try {
      await updateCasinoOrder([
        { id: current.id, ordreClassement: current.ordreClassement },
        { id: next.id, ordreClassement: next.ordreClassement }
      ]);
    } catch (e: any) {
      alert("Erreur lors de la sauvegarde de l'ordre.");
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
      licence: 'Curaçao',
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
      alert("Enregistré avec succès ! La modification est en ligne.")
      window.location.reload()
    } catch (e: any) {
      alert("Erreur lors de la sauvegarde: " + e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (id.length < 5) {
      alert("Impossible de supprimer une donnée mock.")
      return
    }
    if (confirm("Êtes-vous sûr de vouloir supprimer ce casino ?")) {
      setIsLoading(true)
      try {
        await deleteCasino(id)
        alert("Supprimé avec succès.")
        window.location.reload()
      } catch (e: any) {
        alert("Erreur: " + e.message)
      } finally {
        setIsLoading(false)
      }
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

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Bonus de Dépôt</label>
            <input type="text" value={editing.bonusDepot} onChange={e => setEditing({...editing, bonusDepot: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Bonus Sans Dépôt</label>
            <input type="text" value={editing.bonusSansDepot || ''} onChange={e => setEditing({...editing, bonusSansDepot: e.target.value})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Ordre de classement (1 = Premier)</label>
            <input type="number" value={editing.ordreClassement} onChange={e => setEditing({...editing, ordreClassement: Number(e.target.value)})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Note Fiabilité (ex: 4.8)</label>
            <input type="number" step="0.1" value={editing.noteFiabilite} onChange={e => setEditing({...editing, noteFiabilite: Number(e.target.value)})} className="w-full bg-surface-border text-white px-3 py-2 rounded-lg text-sm" />
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
      <button onClick={handleCreate} className="w-full py-3 border border-dashed border-slate-600 text-slate-300 hover:text-white hover:bg-surface-border rounded-xl flex items-center justify-center gap-2 font-medium transition-colors">
        <Plus className="w-5 h-5" /> Ajouter un nouveau Casino
      </button>

      <div className="space-y-2">
        {casinos.map((casino, index) => (
          <div key={casino.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-border hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-xl font-black text-slate-600 w-8 text-center">
                #{casino.ordreClassement}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{casino.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">{casino.bonusDepot} {casino.bonusSansDepot && `+ ${casino.bonusSansDepot}`}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 mr-2">
                <button onClick={() => handleMoveUp(index)} disabled={index === 0 || isLoading} className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => handleMoveDown(index)} disabled={index === casinos.length - 1 || isLoading} className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
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
