'use client'

import React, { useState } from 'react'
import { TrendingUp, DollarSign } from 'lucide-react'

export default function AdminStatsTab({ 
  affiliates, 
  casinos, 
  affClicksBreakdown, 
  setCommissionModal, 
  handleUpdateAffiliateStatus 
}: { 
  affiliates: any[], 
  casinos: any[], 
  affClicksBreakdown: Record<string, Record<string, number>>, 
  setCommissionModal: any, 
  handleUpdateAffiliateStatus: any 
}) {
  const [selectedFilterAff1, setSelectedFilterAff1] = useState<string>('ALL')
  const [selectedFilterAff2, setSelectedFilterAff2] = useState<string>('')

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-purple-500/30 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            Statistiques et Clics des Affiliés en Direct
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Suivi temps réel des clics et répartitions par casino pour chaque membre</p>
        </div>

        {/* Filtre d'Affichage / Comparatif (Tous, 1 seul, ou 2 affiliés) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Filtrer par Affilié :</span>
          <select 
            value={selectedFilterAff1} 
            onChange={(e) => setSelectedFilterAff1(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 font-medium"
          >
            <option value="ALL">🌟 Tous les affiliés ({affiliates.length})</option>
            {affiliates.map(a => (
              <option key={a.id} value={a.id}>👤 {a.profiles?.full_name || a.profiles?.email || a.id}</option>
            ))}
          </select>

          {selectedFilterAff1 !== 'ALL' && (
            <select 
              value={selectedFilterAff2} 
              onChange={(e) => setSelectedFilterAff2(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-purple-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 font-medium"
            >
              <option value="">➕ Comparer avec un 2ème affilié...</option>
              {affiliates.filter(a => a.id !== selectedFilterAff1).map(a => (
                <option key={a.id} value={a.id}>⚖️ {a.profiles?.full_name || a.profiles?.email || a.id}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Tableau principal des performances */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <th className="px-4 py-3.5">Affilié / Email</th>
              <th className="px-4 py-3.5 text-center">Code Parrain</th>
              <th className="px-4 py-3.5 text-center">Clics Totaux</th>
              <th className="px-4 py-3.5">Répartition des Clics par Casino</th>
              <th className="px-4 py-3.5 text-center">Statut</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-surface/30">
            {affiliates
              .filter(a => {
                if (selectedFilterAff1 === 'ALL') return true;
                if (selectedFilterAff2) return a.id === selectedFilterAff1 || a.id === selectedFilterAff2;
                return a.id === selectedFilterAff1;
              })
              .map(aff => {
                const detailedClicks = affClicksBreakdown[aff.id] || {}
                const totalClicks = aff.total_clicks || 0
                return (
                  <tr key={aff.id} className="hover:bg-slate-800/20 transition-colors group">
                    {/* Member Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 shrink-0">
                          {(aff.profiles?.full_name || '?')[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm truncate">{aff.profiles?.full_name || 'Sans Nom'}</div>
                          <div className="text-[11px] text-slate-500 truncate">{aff.profiles?.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-[11px] bg-purple-950/50 text-purple-300 border border-purple-800/40 px-2 py-0.5 rounded">
                        {aff.referral_code}
                      </span>
                    </td>

                    {/* Total Clicks */}
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[13px] font-bold text-purple-200 bg-purple-900/30 px-2.5 py-1 rounded-md border border-purple-500/30 shadow-inner">
                        <span className="text-base opacity-80 leading-none">🖱️</span>
                        <span className="leading-none mt-0.5">{totalClicks}</span>
                      </div>
                    </td>

                    {/* Detailed Breakdown per Casino */}
                    <td className="px-4 py-3">
                      {Object.keys(detailedClicks).length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(detailedClicks).map(([casinoKey, count]) => {
                            const casino = casinos.find(c => c.slug === casinoKey || c.id === casinoKey)
                            const name = casino ? casino.name : (casinoKey.charAt(0).toUpperCase() + casinoKey.slice(1).replace(/-/g, ' '))
                            return (
                              <span key={casinoKey} className="inline-flex items-center gap-1.5 bg-[#0f0f17] border border-slate-700/60 text-slate-300 px-2 py-1 rounded-md text-[10px] font-medium shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_4px_rgba(52,211,153,0.5)]"></span>
                                <span className="opacity-90 leading-none">{name}</span>
                                <span className="bg-slate-800 text-gold font-bold font-mono px-1.5 py-0.5 rounded text-[9px] leading-none">{count as number}</span>
                              </span>
                            )
                          })}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Aucun clic enregistré par casino</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        aff.status === 'active' ? 'bg-emerald/20 text-emerald border border-emerald/30' :
                        aff.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {aff.status}
                      </span>
                    </td>

                    {/* Quick Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {aff.status === 'active' && (
                          <button
                            onClick={() => setCommissionModal({ isOpen: true, affiliateId: aff.id, affiliateName: aff.profiles?.full_name || 'Inconnu' })}
                            className="px-2.5 py-1 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 font-semibold text-[11px] transition-colors flex items-center gap-1"
                            title="Ajouter une commission CPA"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>+ CPA</span>
                          </button>
                        )}
                        {aff.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateAffiliateStatus(aff.id, 'active')}
                            className="px-2.5 py-1 rounded-lg bg-emerald/20 hover:bg-emerald/30 text-emerald border border-emerald/30 font-semibold text-[11px] transition-colors"
                          >
                            Valider
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
