'use client'

import React, { useState, useEffect } from 'react'
import {
  Banknote,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Building,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react'
import { CASINOS_MOCK } from '@/lib/data/casinos'
import { toast } from 'sonner'

interface DepositDeclaration {
  id: string
  casino_id: string
  amount: number
  status: 'pending' | 'validated' | 'rejected'
  created_at: string
  affiliate_id: string
  affiliates?: {
    id: string
    code: string
    first_name: string
    last_name: string
  }
}

export default function AdminDepositsTab() {
  const [deposits, setDeposits] = useState<DepositDeclaration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/deposits')
      if (!res.ok) throw new Error('Erreur réseau')
      const data = await res.json()
      setDeposits(data)
    } catch (err) {
      toast.error('Erreur lors du chargement des déclarations')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })

      if (!res.ok) throw new Error('Erreur lors de la mise à jour')
      
      toast.success(`Statut mis à jour (${newStatus})`)
      fetchDeposits() // Refresh
    } catch (err) {
      toast.error('Erreur lors de la modification')
    }
  }

  const getCasinoName = (casinoId: string) => {
    const c = CASINOS_MOCK.find(c => c.id === casinoId)
    return c ? c.name : casinoId
  }

  const filteredDeposits = deposits.filter(d => {
    const matchSearch = 
      d.affiliates?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCasinoName(d.casino_id).toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchStatus = filterStatus === 'all' || d.status === filterStatus

    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#0f1016] p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">Déclarations de Dépôts</h2>
            <p className="text-sm text-slate-400">Gérez les demandes de dépôts de vos affiliés</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher (Code, Casino)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="validated">Validés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-[#0f1016] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Affilié</th>
                  <th className="px-6 py-4 font-semibold">Casino</th>
                  <th className="px-6 py-4 font-semibold">Montant</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 opacity-20" />
                        <p>Aucune déclaration trouvée</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDeposits.map((deposit) => (
                    <tr key={deposit.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{deposit.affiliates?.code || 'Inconnu'}</p>
                            <p className="text-xs text-slate-500">{deposit.affiliates?.first_name} {deposit.affiliates?.last_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white">
                          <Building className="w-4 h-4 text-slate-400" />
                          {getCasinoName(deposit.casino_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-lg font-bold text-white">
                          {deposit.amount} €
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(deposit.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {deposit.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" /> En attente
                          </span>
                        )}
                        {deposit.status === 'validated' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Validé
                          </span>
                        )}
                        {deposit.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                            <XCircle className="w-3.5 h-3.5" /> Rejeté
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {deposit.status !== 'validated' && (
                            <button
                              onClick={() => handleUpdateStatus(deposit.id, 'validated')}
                              className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
                              title="Valider"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {deposit.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(deposit.id, 'rejected')}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                              title="Rejeter"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
