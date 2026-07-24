'use client'

import React, { useState } from 'react'
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
  Download
} from 'lucide-react'
import { CASINOS_MOCK } from '@/lib/data/casinos'

export default function AdminDashboardPage() {
  const [adminTab, setAdminTab] = useState<'kpi' | 'affiliates' | 'casinos' | 'payouts' | 'support' | 'blog' | 'logs'>('kpi')

  // Mock list Affiliés
  const [affiliates, setAffiliates] = useState([
    { id: '1', name: 'Gabin (Master)', email: 'gabin@frenchcasino.net', code: 'AFF_GABIN', status: 'active', rate: 0.35, earned: 12450 },
    { id: '2', name: 'Alexandre Streamer', email: 'alex@twitch.tv', code: 'AFF_ALEX', status: 'pending', rate: 0.30, earned: 850 },
    { id: '3', name: 'CasinoClub FR', email: 'contact@casinoclub.fr', code: 'AFF_CLUB', status: 'active', rate: 0.40, earned: 34200 },
  ])

  // Mock Payout Requests
  const [payouts, setPayouts] = useState([
    { id: 'p1', affiliateName: 'Gabin (Master)', amount: 1420, date: '24/07/2026', method: 'IBAN (FR76 •••• 1234)', status: 'pending' },
    { id: 'p2', affiliateName: 'CasinoClub FR', amount: 4500, date: '20/07/2026', method: 'USDT (TRX...9x)', status: 'paid' },
  ])

  // Mock Activity Logs
  const [logs] = useState([
    { id: 'l1', action: 'Modification Taux Commission AFF_GABIN à 35%', admin: 'SuperAdmin', timestamp: '24/07/2026 21:40' },
    { id: 'l2', action: 'Validation Demande Payout p2 (4500€)', admin: 'SuperAdmin', timestamp: '20/07/2026 14:15' },
  ])

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setAffiliates(affiliates.map(a => a.id === id ? { ...a, status: newStatus } : a))
  }

  const handleApprovePayout = (id: string) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'paid' } : p))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-950/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Panneau de Contrôle Administrateur Restreint</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Administration FrenchCasino V2
          </h1>
        </div>
      </div>

      {/* Tabs Navigation Admin */}
      <div className="flex overflow-x-auto gap-2 border-b border-surface-border pb-2">
        {[
          { id: 'kpi', label: 'KPIs Globaux', icon: Activity },
          { id: 'affiliates', label: 'Gestion Affiliés', icon: Users },
          { id: 'casinos', label: 'Gestion Casinos (CRUD)', icon: Plus },
          { id: 'payouts', label: 'Paiements & Exports', icon: CreditCard },
          { id: 'support', label: 'Support & Moderation', icon: Clock },
          { id: 'logs', label: 'Logs d\'Activité', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon
          const active = adminTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                active
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-surface-card'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ADMIN TABS CONTENT */}

      {/* 1. KPIS GLOBAUX */}
      {adminTab === 'kpi' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-slate-400 text-xs block">Affiliés Actifs</span>
            <span className="text-3xl font-bold font-mono text-white">48</span>
            <span className="text-[11px] text-emerald block">+3 en attente de validation</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-slate-400 text-xs block">Clics Globaux (Mois)</span>
            <span className="text-3xl font-bold font-mono text-purple-400">142 800</span>
            <span className="text-[11px] text-slate-400 block">Sur tous les liens affiliés</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-slate-400 text-xs block">Commissions Dues (Mois)</span>
            <span className="text-3xl font-bold font-mono text-gold">28 450.00 €</span>
            <span className="text-[11px] text-gold block">À distribuer aux affiliés</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-slate-400 text-xs block">Payouts en Attente</span>
            <span className="text-3xl font-bold font-mono text-red-400">1</span>
            <span className="text-[11px] text-red-400 block">Montant : 1 420.00 €</span>
          </div>
        </div>
      )}

      {/* 2. GESTION DES AFFILIÉS */}
      {adminTab === 'affiliates' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Gestion des Inscriptions & Taux Commission</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Affilié</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Code Referral</th>
                  <th className="p-3">Taux RevShare</th>
                  <th className="p-3">Gains Totaux</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {affiliates.map((aff) => (
                  <tr key={aff.id}>
                    <td className="p-3 font-bold text-white">{aff.name}</td>
                    <td className="p-3 font-mono">{aff.email}</td>
                    <td className="p-3 font-mono text-gold">{aff.code}</td>
                    <td className="p-3 font-mono font-bold">{(aff.rate * 100).toFixed(0)}%</td>
                    <td className="p-3 font-mono text-emerald">{aff.earned.toLocaleString()} €</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        aff.status === 'active' ? 'bg-emerald/20 text-emerald' : 'bg-gold/20 text-gold'
                      }`}>
                        {aff.status}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      {aff.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(aff.id, 'active')}
                          className="p-1 rounded bg-emerald/20 text-emerald hover:bg-emerald/30 text-[11px] px-2 font-bold"
                        >
                          Valider
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(aff.id, aff.status === 'suspended' ? 'active' : 'suspended')}
                        className="p-1 rounded bg-red-950 text-red-400 hover:bg-red-900 text-[11px] px-2 font-bold"
                      >
                        {aff.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
                      </button>
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
            <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-primary-hover">
              <Plus className="w-4 h-4" />
              <span>Ajouter un Casino</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CASINOS_MOCK.map((casino) => (
              <div key={casino.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-base">{casino.name}</h4>
                  <span className="text-xs font-mono text-gold">Ordre : #{casino.ordreClassement}</span>
                </div>
                <p className="text-xs text-slate-400 truncate">{casino.bonusDepot}</p>
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button className="px-3 py-1 rounded bg-surface border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1">
                    <Edit className="w-3 h-3" /> Édition
                  </button>
                  <button className="px-3 py-1 rounded bg-red-950 border border-red-900 text-xs text-red-400 hover:bg-red-900 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Désactiver
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
            <h3 className="font-display font-bold text-lg text-white">Demandes de Retrait à Approuver</h3>
            <button className="px-3 py-1.5 rounded-lg bg-surface border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 hover:text-white">
              <Download className="w-4 h-4 text-gold" />
              <span>Export CSV Comptabilité</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Affilié</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Moyen & Coordonnées</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-white">{p.affiliateName}</td>
                    <td className="p-3 font-mono font-bold text-gold">{p.amount.toLocaleString()} €</td>
                    <td className="p-3 font-mono text-slate-400">{p.method}</td>
                    <td className="p-3 font-mono text-slate-400">{p.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.status === 'paid' ? 'bg-emerald/20 text-emerald' : 'bg-gold/20 text-gold'
                      }`}>
                        {p.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                    <td className="p-3">
                      {p.status === 'pending' && (
                        <button
                          onClick={() => handleApprovePayout(p.id)}
                          className="px-3 py-1 rounded bg-emerald hover:bg-emerald-600 text-white font-bold text-xs"
                        >
                          Marquer Payé
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. LOGS D'ACTIVITÉ */}
      {adminTab === 'logs' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Logs d&apos;Activité Admin & Audit Trail</h3>
          <div className="space-y-2 font-mono text-xs">
            {logs.map(log => (
              <div key={log.id} className="p-3 rounded-lg bg-surface border border-slate-800 flex justify-between items-center text-slate-300">
                <span>[{log.timestamp}] <strong>{log.admin}</strong> : {log.action}</span>
                <span className="text-[10px] text-slate-400">ID: {log.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
