'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  MousePointerClick,
  DollarSign,
  CheckCircle2,
  Copy,
  QrCode,
  CreditCard,
  MessageSquare,
  Users,
  Send,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { CASINOS_MOCK } from '@/lib/data/casinos'

const GRAPH_DATA = [
  { day: 'Lun', clics: 120, conversions: 8, commissions: 320 },
  { day: 'Mar', clics: 190, conversions: 14, commissions: 560 },
  { day: 'Mer', clics: 240, conversions: 18, commissions: 720 },
  { day: 'Jeu', clics: 310, conversions: 22, commissions: 880 },
  { day: 'Ven', clics: 450, conversions: 35, commissions: 1400 },
  { day: 'Sam', clics: 680, conversions: 52, commissions: 2100 },
  { day: 'Dim', clics: 540, conversions: 41, commissions: 1650 },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'stats' | 'commissions' | 'payout' | 'iban' | 'support' | 'recruitment'>('overview')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  // State IBAN Masqué
  const [showFullIban, setShowFullIban] = useState(false)
  const [ibanForm, setIbanForm] = useState({
    holder: 'Gabin (FrenchCasino)',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BNPAFRPPXXX',
  })
  const [ibanSaved, setIbanSaved] = useState(false)

  // State Payout Form
  const [payoutAmount, setPayoutAmount] = useState('500')
  const [payoutSuccess, setPayoutSuccess] = useState(false)

  // State Support Chat
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [tickets, setTickets] = useState([
    { id: 't1', subject: 'Ajustement Taux RevShare', status: 'Répondu', date: '22/07/2026', messages: 3 },
    { id: 't2', subject: 'Validation Retrait Juillet', status: 'Ouvert', date: '24/07/2026', messages: 1 },
  ])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleSaveIban = (e: React.FormEvent) => {
    e.preventDefault()
    setIbanSaved(true)
    setTimeout(() => setIbanSaved(false), 3000)
  }

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Notification Telegram Admin
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payout_request',
          message: `Montant demandé : <b>${payoutAmount} €</b>\n\nConnectez-vous à l'espace Admin pour valider le virement.`
        })
      })
    } catch (err) {
      console.error(err)
    }

    setPayoutSuccess(true)
    setTimeout(() => setPayoutSuccess(false), 4000)
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject || !ticketMessage) return
    setTickets([
      { id: `t${Date.now()}`, subject: ticketSubject, status: 'Ouvert', date: 'Aujourd\'hui', messages: 1 },
      ...tickets
    ])
    
    // Notification Telegram Admin
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_ticket',
          message: `Sujet : <b>${ticketSubject}</b>\nMessage : <i>${ticketMessage}</i>\n\nConnectez-vous à l'espace Admin pour répondre.`
        })
      })
    } catch (err) {
      console.error(err)
    }

    setTicketSubject('')
    setTicketMessage('')
  }

  const maskedIban = ibanForm.iban ? `${ibanForm.iban.slice(0, 4)} •••• •••• •••• •••• ${ibanForm.iban.slice(-4)}` : ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Compte Affilié Vérifié — Statut Actif (30% RevShare)</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Tableau de Bord Affilié
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface p-3 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Solde Disponible</span>
            <span className="text-xl font-bold font-mono text-gradient-gold">1 420.00 €</span>
          </div>
          <button
            onClick={() => setActiveTab('payout')}
            className="px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all"
          >
            Demander un Retrait
          </button>
        </div>
      </div>

      {/* Navigation Onglets */}
      <div className="flex overflow-x-auto gap-2 border-b border-surface-border pb-2">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
          { id: 'links', label: 'Mes Liens & QR', icon: Copy },
          { id: 'stats', label: 'Statistiques Recharts', icon: MousePointerClick },
          { id: 'commissions', label: 'Commissions', icon: DollarSign },
          { id: 'payout', label: 'Demandes de Paiement', icon: CreditCard },
          { id: 'iban', label: 'Mon IBAN', icon: Lock },
          { id: 'support', label: 'Support & Tchat', icon: MessageSquare },
          { id: 'recruitment', label: 'Recruter (Filleuls)', icon: Users },
        ].map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                active
                  ? 'bg-primary text-white shadow-purple-glow'
                  : 'text-slate-400 hover:text-white hover:bg-surface-card'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TABS CONTENT */}

      {/* 1. VUE D'ENSEMBLE */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Cards KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Clics Totaux (Mois)</span>
                <MousePointerClick className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-2xl font-bold font-mono text-white">2 530</span>
              <span className="text-[11px] text-emerald flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +18.4% ce mois
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Conversions Joueurs</span>
                <Zap className="w-4 h-4 text-gold" />
              </div>
              <span className="text-2xl font-bold font-mono text-gradient-gold">190</span>
              <span className="text-[11px] text-slate-400">Taux conv. 7.5%</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Commissions du Mois</span>
                <DollarSign className="w-4 h-4 text-emerald" />
              </div>
              <span className="text-2xl font-bold font-mono text-emerald">7 630.00 €</span>
              <span className="text-[11px] text-slate-400">30% RevShare fixe</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Solde Prêt à Retirer</span>
                <CreditCard className="w-4 h-4 text-gold" />
              </div>
              <span className="text-2xl font-bold font-mono text-gradient-gold">1 420.00 €</span>
              <span className="text-[11px] text-emerald">Min 100€ (Atteint)</span>
            </div>
          </div>

          {/* Graphique Aperçu */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Performance 7 Derniers Jours</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GRAPH_DATA}>
                  <defs>
                    <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2c2845" />
                  <XAxis dataKey="day" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#12111c', borderColor: '#2c2845', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="commissions" stroke="#7C3AED" fillOpacity={1} fill="url(#colorComm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. MES LIENS & QR CODE */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-display font-bold text-lg text-white">Générateur de Liens d&apos;Affiliation</h3>
            <p className="text-xs text-slate-400">
              Copiez vos liens trackés uniques pour chaque casino partenaire. Chaque clic et inscription sera crédité à votre compte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CASINOS_MOCK.map((casino) => {
              const linkUrl = `https://frenchcasino.net/api/track?ref=AFF_GABIN_${casino.slug}`
              return (
                <div key={casino.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{casino.name}</span>
                    <span className="text-[10px] bg-primary/20 text-primary-light px-2 py-0.5 rounded font-mono">
                      Code: AFF_GABIN
                    </span>
                  </div>

                  <div className="bg-surface p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs text-slate-300 font-mono">
                    <span className="truncate max-w-[260px]">{linkUrl}</span>
                    <button
                      onClick={() => copyToClipboard(linkUrl, casino.id)}
                      className="px-2.5 py-1 rounded bg-primary text-white text-[11px] font-sans hover:bg-primary-hover transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedCode === casino.id ? 'Copie !' : 'Copier'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. STATISTIQUES RECHARTS */}
      {activeTab === 'stats' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="font-display font-bold text-lg text-white">Statistiques Détaillées (Clics vs Conversions)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GRAPH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2c2845" />
                <XAxis dataKey="day" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#12111c', borderColor: '#2c2845', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="clics" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} />
                <Area type="monotone" dataKey="conversions" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. HISTORIQUE COMMISSIONS */}
      {activeTab === 'commissions' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Historique des Commissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Période</th>
                  <th className="p-3">Casino</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-3 font-mono">Juillet 2026</td>
                  <td className="p-3 font-bold text-white">MonteCryptos Royal</td>
                  <td className="p-3 font-mono font-bold text-gold">450.00 €</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald/20 text-emerald">Validé</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-mono">Juillet 2026</td>
                  <td className="p-3 font-bold text-white">Cresus Elite</td>
                  <td className="p-3 font-mono font-bold text-gold">970.00 €</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald/20 text-emerald">Validé</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DEMANDE DE PAIEMENT */}
      {activeTab === 'payout' && (
        <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-gold/30 space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl text-white">Formulaire de Demande de Retrait</h3>
            <p className="text-xs text-slate-400">Solde minimum requis : 100.00 € (Votre solde actuel : 1 420.00 €)</p>
          </div>

          {payoutSuccess && (
            <div className="p-4 rounded-xl bg-emerald/20 border border-emerald/40 text-emerald text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Demande de virement de {payoutAmount}€ soumise à l&apos;équipe financière avec succès !</span>
            </div>
          )}

          <form onSubmit={handleRequestPayout} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Montant à retirer (€)</label>
              <input
                type="number"
                min="100"
                max="1420"
                required
                value={payoutAmount}
                onChange={e => setPayoutAmount(e.target.value)}
                className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Mode de Paiement Préféré</label>
              <select className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold">
                <option value="iban">Virement Bancaire (IBAN en ligne)</option>
                <option value="crypto">USDT / Crypto Wallet</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all"
            >
              Confirmer la Demande de Paiement
            </button>
          </form>
        </div>
      )}

      {/* 6. MON IBAN (SÉCURISÉ) */}
      {activeTab === 'iban' && (
        <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-gold" />
              Coordonnées Bancaires (IBAN / BIC)
            </h3>
            <p className="text-xs text-slate-400">Vos coordonnées bancaires sont chiffrées en base de données.</p>
          </div>

          {ibanSaved && (
            <div className="p-3.5 rounded-xl bg-emerald/20 border border-emerald/40 text-emerald text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Coordonnées bancaires enregistrées avec succès !</span>
            </div>
          )}

          <form onSubmit={handleSaveIban} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Titulaire du Compte</label>
              <input
                type="text"
                required
                value={ibanForm.holder}
                onChange={e => setIbanForm({...ibanForm, holder: e.target.value})}
                className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Numéro IBAN</label>
                <button
                  type="button"
                  onClick={() => setShowFullIban(!showFullIban)}
                  className="text-[11px] text-primary-light flex items-center gap-1 hover:underline"
                >
                  {showFullIban ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showFullIban ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              <input
                type="text"
                required
                value={showFullIban ? ibanForm.iban : maskedIban}
                onChange={e => setIbanForm({...ibanForm, iban: e.target.value})}
                className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Code BIC / SWIFT</label>
              <input
                type="text"
                required
                value={ibanForm.bic}
                onChange={e => setIbanForm({...ibanForm, bic: e.target.value})}
                className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-purple-glow transition-all"
            >
              Enregistrer mon IBAN
            </button>
          </form>
        </div>
      )}

      {/* 7. SUPPORT & TCHAT */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Ouvrir un Ticket de Support</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Sujet de votre question..."
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
              <textarea
                required
                rows={4}
                placeholder="Expliquez votre demande à notre équipe d'administration..."
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                className="w-full bg-surface border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-purple-glow transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le Message</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Vos Tickets en Cours</h3>
            <div className="space-y-3">
              {tickets.map(t => (
                <div key={t.id} className="bg-surface p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.subject}</h4>
                    <span className="text-[11px] text-slate-400">Créé le {t.date} • {t.messages} message(s)</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    t.status === 'Répondu' ? 'bg-emerald/20 text-emerald' : 'bg-gold/20 text-gold'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. RECRUTER (SOUS-AFFILIÉS) */}
      {activeTab === 'recruitment' && (
        <div className="glass-panel p-8 rounded-2xl border border-gold/30 space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-white">Programme de Parrainage Sous-Affiliés</h3>
            <p className="text-xs text-slate-400">
              Invitez d&apos;autres créateurs à rejoindre FrenchCasino via votre lien de parrainage unique. Vous percevrez une commission bonus sur l&apos;ensemble de leurs résultats.
            </p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-gold truncate">
              https://frenchcasino.net/devenir-affilie?parent=AFF_GABIN_MASTER
            </span>
            <button
              onClick={() => copyToClipboard('https://frenchcasino.net/devenir-affilie?parent=AFF_GABIN_MASTER', 'parent')}
              className="px-4 py-2 rounded-lg bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-colors"
            >
              {copiedCode === 'parent' ? 'Copié !' : 'Copier Mon Lien'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
