'use client'

import React, { useState } from 'react'
import { TrendingUp, MousePointerClick, Activity, Target } from 'lucide-react'

export default function AdminStatsTab({ 
  affiliates, 
  casinos, 
  affClicksBreakdown
}: { 
  affiliates: any[], 
  casinos: any[], 
  affClicksBreakdown: Record<string, Record<string, number>>
}) {
  const [selectedFilterAff1, setSelectedFilterAff1] = useState<string>('ALL')
  const [selectedFilterAff2, setSelectedFilterAff2] = useState<string>('')

  // Compute total clicks across all affiliates for the header
  const globalTotalClicks = affiliates.reduce((acc, a) => acc + (a.total_clicks || 0), 0)

  // Filter logic
  const filteredAffiliates = affiliates.filter(a => {
    if (selectedFilterAff1 === 'ALL') return true;
    if (selectedFilterAff2) return a.id === selectedFilterAff1 || a.id === selectedFilterAff2;
    return a.id === selectedFilterAff1;
  }).sort((a, b) => (b.total_clicks || 0) - (a.total_clicks || 0)) // Sort by clicks descending

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HERO STATS BANNER */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-purple-500/30 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl shadow-purple-900/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest mb-2">
            <Activity className="w-3.5 h-3.5" /> En Direct
          </div>
          <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Performances Clics
          </h3>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Suivez en temps réel l'acquisition de trafic de vos partenaires. Les données sont classées par volume de clics pour identifier rapidement vos meilleurs performeurs.
          </p>
        </div>

        <div className="relative z-10 glass-panel bg-[#0a0a0f]/80 border border-purple-500/30 p-6 sm:p-8 rounded-2xl flex items-center gap-6 min-w-[280px] transform hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <MousePointerClick className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-1">Total Global</div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tighter drop-shadow-md">
              {globalTotalClicks.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-sm font-bold text-white">Cibler des affiliés :</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <select 
            value={selectedFilterAff1} 
            onChange={(e) => setSelectedFilterAff1(e.target.value)}
            className="bg-[#0a0a0f] border border-slate-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium transition-all shadow-sm flex-1 sm:flex-none min-w-[200px]"
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
              className="bg-purple-950/20 border border-purple-500/30 text-sm text-purple-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium transition-all shadow-sm flex-1 sm:flex-none min-w-[200px]"
            >
              <option value="">➕ Comparer avec un autre...</option>
              {affiliates.filter(a => a.id !== selectedFilterAff1).map(a => (
                <option key={a.id} value={a.id}>⚖️ {a.profiles?.full_name || a.profiles?.email || a.id}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* AFFILIATES GRID (Replaces Table) */}
      <div className="grid grid-cols-1 gap-3">
        {filteredAffiliates.map((aff, index) => {
          const detailedClicks = affClicksBreakdown[aff.id] || {}
          const totalClicks = aff.total_clicks || 0
          
          // Determine rank styling
          const isTop3 = selectedFilterAff1 === 'ALL' && index < 3;
          const rankColors = [
            'from-yellow-400 to-amber-600 border-yellow-500/50 shadow-yellow-500/20', // 1st
            'from-slate-300 to-slate-500 border-slate-400/50 shadow-slate-400/20', // 2nd
            'from-orange-400 to-orange-700 border-orange-500/50 shadow-orange-500/20', // 3rd
          ];
          
          const highlightClass = isTop3 
            ? `bg-gradient-to-br ${rankColors[index]} text-white` 
            : 'bg-slate-800 text-slate-400 border-slate-700';

          return (
            <div 
              key={aff.id} 
              className={`glass-panel rounded-2xl border transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20 overflow-hidden ${isTop3 ? 'border-purple-500/30 bg-purple-950/10' : 'border-slate-800'}`}
            >
              <div className="flex flex-col md:flex-row">
                
                {/* Left Section: User Info & Total Clicks */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 border-b md:border-b-0 md:border-r border-slate-800 relative">
                  
                  {/* Rank Badge for Top 3 */}
                  {isTop3 && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
                  )}

                  {/* Avatar & Identité */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base shrink-0 shadow-sm border ${highlightClass}`}>
                      {isTop3 ? `#${index + 1}` : (aff.profiles?.full_name || '?')[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white flex items-center gap-2 mb-0.5">
                        {aff.profiles?.full_name || 'Sans Nom'}
                        {aff.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="Actif"></span>}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mb-1">{aff.profiles?.email}</p>
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[9px] font-mono text-slate-300">
                        Code: <span className="text-purple-400 font-bold ml-1">{aff.referral_code}</span>
                      </div>
                    </div>
                  </div>

                  {/* Spacer on desktop */}
                  <div className="hidden md:block flex-1"></div>

                  {/* Total Clicks BIG Display */}
                  <div className="flex items-center gap-3 bg-[#0a0a0f] py-2 px-4 rounded-xl border border-slate-800 md:min-w-[150px]">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Total Clics</div>
                      <div className="text-2xl font-black font-mono text-white leading-none">
                        {totalClicks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Breakdown per Casino */}
                <div className="flex-[1.2] p-4 sm:p-5 bg-surface/30">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Répartition par Casino <span className="text-slate-600">({Object.keys(detailedClicks).length})</span>
                  </h5>
                  
                  {Object.keys(detailedClicks).length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {Object.entries(detailedClicks)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .map(([casinoKey, count]) => {
                        const casino = casinos.find(c => c.slug === casinoKey || c.id === casinoKey)
                        const name = casino ? casino.name : (casinoKey.charAt(0).toUpperCase() + casinoKey.slice(1).replace(/-/g, ' '))
                        
                        // Calculate percentage for visual bar
                        const percentage = totalClicks > 0 ? Math.round(((count as number) / totalClicks) * 100) : 0;
                        
                        return (
                          <div key={casinoKey} className="group relative bg-[#0a0a0f] border border-slate-700 hover:border-purple-500/50 rounded-lg p-1.5 pr-3 flex items-center gap-2 transition-colors">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 rounded-l-lg overflow-hidden">
                              <div className="absolute bottom-0 left-0 w-full bg-purple-500 transition-all duration-500" style={{ height: `${percentage}%` }}></div>
                            </div>
                            
                            <div className="pl-1.5 flex flex-col justify-center">
                              <span className="text-[10px] font-semibold text-slate-300 leading-tight block mb-0.5">{name}</span>
                              <span className="text-[8px] text-slate-500 font-mono uppercase">{percentage}% trafic</span>
                            </div>
                            
                            <div className="ml-auto bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                              <span className="text-gold font-black font-mono text-[11px] leading-none">{count as number}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-6">
                      <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3">
                        <Activity className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className="text-sm text-slate-500 font-medium">Aucun trafic enregistré</span>
                      <span className="text-xs text-slate-600 mt-1">Cet affilié n'a pas encore généré de clics.</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )
        })}
        
        {filteredAffiliates.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
            <span className="text-slate-400 font-medium">Aucun affilié ne correspond à votre filtre.</span>
          </div>
        )}
      </div>
      
    </div>
  )
}

