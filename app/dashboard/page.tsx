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
  EyeOff,
  XCircle,
  Loader2,
  AlertCircle
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
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

function getVipInfo(total: number) {
  if (total >= 10000) return { name: 'Diamond', icon: '💎', color: 'text-cyan-400', bg: 'bg-cyan-900/30', border: 'border-cyan-500/50', next: null, nextName: null, progress: 100 };
  if (total >= 5000) return { name: 'Gold', icon: '🥇', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-500/50', next: 10000, nextName: 'Diamond', progress: (total / 10000) * 100 };
  if (total >= 1000) return { name: 'Silver', icon: '🥈', color: 'text-slate-300', bg: 'bg-slate-700/30', border: 'border-slate-500/50', next: 5000, nextName: 'Gold', progress: (total / 5000) * 100 };
  return { name: 'Bronze', icon: '🥉', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-500/50', next: 1000, nextName: 'Silver', progress: (total / 1000) * 100 };
}

export default function DashboardPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'stats' | 'commissions' | 'payout' | 'iban' | 'support' | 'recruitment'>('overview')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  // Real data state
  const [loadingData, setLoadingData] = useState(true)
  const [affiliateCode, setAffiliateCode] = useState<string>('EN_ATTENTE')
  const [affiliateId, setAffiliateId] = useState<string | null>(null)
  const [affiliateStatus, setAffiliateStatus] = useState<string>('pending')
  const [adminMessage, setAdminMessage] = useState<string | null>(null)
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1)
  const [casinosList, setCasinosList] = useState<any[]>([])
  const [clicksData, setClicksData] = useState<Record<string, number>>({})
  
  const [totalClicks, setTotalClicks] = useState(0)
  const [commissionsList, setCommissionsList] = useState<any[]>([])
  const [monthlyCommissions, setMonthlyCommissions] = useState(0)
  const [soldeMoisEnCours, setSoldeMoisEnCours] = useState(0)
  const [soldeDisponible, setSoldeDisponible] = useState(0)
  const [totalHistoricalValid, setTotalHistoricalValid] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])
  const [ticketsList, setTicketsList] = useState<any[]>([])

  // Refund form state
  const [refundForm, setRefundForm] = useState({ casinoId: '', amount: '', proofFile: null as File | null })
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false)

  React.useEffect(() => {
    async function loadAffiliateData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
      if (profile?.role === 'admin' || profile?.role === 'recruiter') {
        // Un admin ou un recruteur testant le dashboard affilié bypass le statut pending si pas d'infos contraires
        setAffiliateStatus('active')
        setAffiliateCode('MODE_TEST')
      }

      // Load Casinos for everyone (affiliates and admins)
      let casData: any[] | null = null
      const res = await supabase
        .from('casinos')
        .select('id, name, slug, remboursement_depot, commission_conditions, commission_cpa, bonus_depot, minimum_depot, visible_affiliate')
        .eq('is_active', true)
      
      if (res.error) {
        const { data: fallbackData } = await supabase
          .from('casinos')
          .select('id, name, slug, remboursement_depot, commission_conditions, commission_cpa, bonus_depot, minimum_depot')
          .eq('is_active', true)
        casData = fallbackData
      } else {
        casData = res.data
      }
      
      if (casData) {
        setCasinosList(casData.filter((c: any) => c.visible_affiliate !== false))
      }

      let affData: any = null
      const affRes = await supabase
        .from('affiliates')
        .select('id, referral_code, status, onboarding_completed, iban_holder, iban, bic, admin_message')
        .eq('id', user.id)
        .single()
      
      if (affRes.error) {
        const fallbackAffRes = await supabase
          .from('affiliates')
          .select('id, referral_code, status, onboarding_completed, iban_holder, iban, bic')
          .eq('id', user.id)
          .single()
        affData = fallbackAffRes.data
      } else {
        affData = affRes.data
      }
      
      if (affData) {
        setAffiliateCode(affData.referral_code)
        setAffiliateId(affData.id)
        setAffiliateStatus(affData.status)
        setAdminMessage(affData.admin_message || null)
        
        // Handle postgres error gracefully if column doesn't exist yet by defaulting to false
        setOnboardingCompleted(affData.onboarding_completed === true)
        
        if (affData.iban) {
          setIbanForm({
            holder: affData.iban_holder || '',
            iban: affData.iban || '',
            bic: affData.bic || ''
          })
        } else if (profile?.full_name) {
          setIbanForm(prev => ({ ...prev, holder: profile.full_name }))
        }

        // Load Clicks
        const { data: clicks } = await supabase
          .from('casino_clicks')
          .select('casino_id, created_at')
          .eq('affiliate_id', affData.id)
        
        // Load Commissions
        const { data: comms } = await supabase
          .from('commissions')
          .select('*')
          .eq('affiliate_id', affData.id)
          .order('created_at', { ascending: false })

        // Load Payouts
        const { data: payouts } = await supabase
          .from('payout_requests')
          .select('*')
          .eq('affiliate_id', affData.id)

        // Load Tickets
        const { data: tks } = await supabase
          .from('tickets')
          .select('*')
          .eq('affiliate_id', affData.id)
          .order('created_at', { ascending: false })

        if (tks) setTicketsList(tks)

        // Process Clicks
        let currentClicks = 0
        const counts: Record<string, number> = {}
        const clicksByDay: Record<string, number> = {}

        if (clicks) {
          currentClicks = clicks.length
          clicks.forEach(c => {
            counts[c.casino_id] = (counts[c.casino_id] || 0) + 1
            const date = new Date(c.created_at)
            const day = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')
            clicksByDay[day] = (clicksByDay[day] || 0) + 1
          })
          setClicksData(counts)
          setTotalClicks(currentClicks)
        }

        // Process Commissions
        let currentMonthly = 0
        let pastCommissions = 0
        let totalValid = 0
        const commsByDay: Record<string, number> = {}
        
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        if (comms) {
          setCommissionsList(comms)
          comms.forEach(c => {
            if (c.statut === 'validated' || c.statut === 'paid') {
              const amount = Number(c.montant)
              totalValid += amount
              
              const date = new Date(c.created_at)
              if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                currentMonthly += amount
              } else {
                pastCommissions += amount
              }

              const day = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')
              commsByDay[day] = (commsByDay[day] || 0) + amount
            }
          })
          setMonthlyCommissions(currentMonthly)
          setSoldeMoisEnCours(currentMonthly)
          setTotalHistoricalValid(totalValid)
        }

        // Process Payouts
        let totalPaidOrPending = 0
        if (payouts) {
          payouts.forEach(p => {
            if (p.statut !== 'rejected') {
              totalPaidOrPending += Number(p.montant_demande)
            }
          })
        }

        setSoldeDisponible(Math.max(0, pastCommissions - totalPaidOrPending))

        // Build Chart Data (Last 7 days roughly based on weekday)
        const days = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']
        const finalChart = days.map(d => ({
          day: d.charAt(0).toUpperCase() + d.slice(1, 3),
          clics: clicksByDay[d] || 0,
          commissions: commsByDay[d] || 0
        }))
        setChartData(finalChart)
      }
      
      setLoadingData(false)
    }
    loadAffiliateData()
  }, [])
  
  // State IBAN Masqué
  const [showFullIban, setShowFullIban] = useState(false)
  const [ibanForm, setIbanForm] = useState({
    holder: 'Gabin (FrenchCasino)',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BNPAFRPPXXX',
  })
  const [ibanSaved, setIbanSaved] = useState(false)

  // State Payout Form
  const [payoutAmount, setPayoutAmount] = useState('250')
  const [payoutSuccess, setPayoutSuccess] = useState(false)

  // State Support Chat
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')

  // Chat Modal State
  const [chatModal, setChatModal] = useState<{isOpen: boolean, ticketId: string, ticketSubject: string}>({ isOpen: false, ticketId: '', ticketSubject: '' })
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newChatMessage, setNewChatMessage] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // Deposit Declaration Modal State
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [depositForm, setDepositForm] = useState({ casinoId: '', amount: '' })
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleSaveIban = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const ibanStr = ibanForm.iban.replace(/\s+/g, '').toUpperCase()
    
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(ibanStr)) {
      toast.error("Le format de l'IBAN est invalide.")
      return
    }

    if (!affiliateId) {
      if (affiliateCode === 'MODE_TEST') {
        setIbanForm(prev => ({ ...prev, iban: ibanStr }))
        setIbanSaved(true)
        toast.success('Mode Test: IBAN simulé avec succès.')
        setTimeout(() => setIbanSaved(false), 3000)
        return
      }
      return
    }

    const { error } = await supabase
      .from('affiliates')
      .update({
        iban_holder: ibanForm.holder,
        iban: ibanStr,
        bic: ibanForm.bic
      })
      .eq('id', affiliateId)

    if (error) {
      toast.error('Erreur lors de la sauvegarde : ' + error.message)
      return
    }

    setIbanForm(prev => ({ ...prev, iban: ibanStr }))
    setIbanSaved(true)
    toast.success('IBAN enregistré avec succès.')
    setTimeout(() => setIbanSaved(false), 3000)
  }

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = Number(payoutAmount)
    if (amount < 100) {
      toast.error('Le montant minimum de retrait est de 100 €.')
      return
    }
    if (amount > soldeDisponible) {
      toast.error('Fonds insuffisants.')
      return
    }
    if (!affiliateId) return

    // Insert payout request
    await supabase.from('payout_requests').insert([{
      affiliate_id: affiliateId,
      montant_demande: amount,
      statut: 'pending'
    }])
    
    // Notification Telegram Admin
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payout_request',
          message: `Montant demandé : <b>${amount} €</b>\n\nConnectez-vous à l'espace Admin pour valider le virement.`
        })
      })
    } catch (err) {
      console.error(err)
    }

    setSoldeDisponible(prev => prev - amount)
    setPayoutSuccess(true)
    setTimeout(() => setPayoutSuccess(false), 4000)
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject || !ticketMessage || !affiliateId) return
    
    const newTicketData = {
      affiliate_id: affiliateId,
      sujet: ticketSubject,
      statut: 'open'
    }
    
    const { data: newTicket } = await supabase.from('tickets').insert([newTicketData]).select().single()
    
    if (newTicket) {
      setTicketsList([newTicket, ...ticketsList])
    }
    
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

  const openChatModal = async (ticket: any) => {
    setChatModal({ isOpen: true, ticketId: ticket.id, ticketSubject: ticket.sujet })
    setChatMessages([])
    
    const { data: messages } = await supabase
      .from('ticket_messages')
      .select('*, profiles(full_name, role)')
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true })
      
    if (messages) setChatMessages(messages)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChatMessage.trim() || !affiliateId) return
    setIsSendingMessage(true)
    
    const { error } = await supabase.from('ticket_messages').insert([{
      ticket_id: chatModal.ticketId,
      sender_id: affiliateId,
      message: newChatMessage
    }])
    
    if (!error) {
      const { data: messages } = await supabase
        .from('ticket_messages')
        .select('*, profiles(full_name, role)')
        .eq('ticket_id', chatModal.ticketId)
        .order('created_at', { ascending: true })
        
      if (messages) setChatMessages(messages)
      setNewChatMessage('')
      
      await supabase.from('tickets').update({ statut: 'open' }).eq('id', chatModal.ticketId)
      setTicketsList(ticketsList.map(t => t.id === chatModal.ticketId ? { ...t, statut: 'open' } : t))
      
      try {
        await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_ticket',
            message: `Nouvelle réponse sur le ticket : <b>${chatModal.ticketSubject}</b>\n\nConnectez-vous à l'espace Admin pour répondre.`
          })
        })
      } catch (err) {}
    } else {
      toast.error("Erreur lors de l'envoi du message")
    }
    
    setIsSendingMessage(false)
  }

  const handleDeclareDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!depositForm.casinoId || !depositForm.amount || !affiliateId) return
    setIsSubmittingDeposit(true)

    const casino = casinosList.find(c => c.id === depositForm.casinoId)
    const casinoName = casino ? casino.name : depositForm.casinoId

    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'deposit_declaration',
          message: `Nouveau dépôt déclaré par l'affilié ${affiliateCode}\n\nCasino : <b>${casinoName}</b>\nMontant : <b>${depositForm.amount} €</b>`
        })
      })
      toast.success('Déclaration de dépôt envoyée avec succès.')
      setDepositModalOpen(false)
      setDepositForm({ casinoId: '', amount: '' })
    } catch (err) {
      toast.error("Erreur lors de l'envoi de la déclaration.")
    }

    setIsSubmittingDeposit(false)
  }

  const maskedIban = ibanForm.iban ? `${ibanForm.iban.slice(0, 4)} •••• •••• •••• •••• ${ibanForm.iban.slice(-4)}` : ''

  const [isOnboardingSaving, setIsOnboardingSaving] = useState(false)
  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ibanForm.holder || !ibanForm.iban || !ibanForm.bic) {
      toast.error('Veuillez remplir tous les champs bancaires.')
      return
    }
    
    const ibanStr = ibanForm.iban.replace(/\s+/g, '').toUpperCase()
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(ibanStr)) {
      toast.error("Le format de l'IBAN est invalide.")
      return
    }

    if (!affiliateId) {
      if (affiliateCode === 'MODE_TEST') {
        toast.success("Mode Test: IBAN simulé avec succès.")
        setOnboardingCompleted(true)
        return
      }
      toast.error('Erreur: Compte affilié introuvable.')
      return
    }
    
    setIsOnboardingSaving(true)
    const { error } = await supabase
      .from('affiliates')
      .update({
        iban_holder: ibanForm.holder,
        iban: ibanStr,
        bic: ibanForm.bic,
        onboarding_completed: true
      })
      .eq('id', affiliateId)
      
    if (error) {
      toast.error('Erreur lors de la sauvegarde : ' + error.message)
      setIsOnboardingSaving(false)
      return
    }

    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'iban_completed',
          message: `L'affilié <b>${ibanForm.holder}</b> (${affiliateId}) vient de renseigner ses coordonnées bancaires avec succès.`
        })
      })
    } catch (err) {}
    
    setOnboardingCompleted(true)
    setIsOnboardingSaving(false)
  }

  if (loadingData) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (affiliateStatus === 'pending') {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center max-w-lg space-y-6 glass-panel p-8 sm:p-12 rounded-3xl border border-gold/30">
          <div className="w-16 h-16 mx-auto bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Compte en cours d'examen</h1>
          <p className="text-slate-400">
            Votre compte affilié a bien été créé, mais il doit d'abord être validé par un administrateur. 
            Vous serez contacté très prochainement pour un bref entretien avant l'activation de vos accès.
          </p>
          <div className="pt-4">
            <span className="inline-block px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm font-mono border border-slate-700">
              Statut : EN ATTENTE
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (affiliateStatus === 'active' && !onboardingCompleted) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gold/30 space-y-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="text-center space-y-3 relative z-10">
            <h1 className="font-display text-3xl font-extrabold text-white">
              Bienvenue sur French<span className="text-gradient-gold">Casino</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Votre compte a été validé ! Pour finaliser votre inscription et accéder à votre tableau de bord, veuillez compléter ces deux étapes rapides.
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Étape 1 : Telegram */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${onboardingStep === 1 ? 'border-primary bg-primary/5 shadow-purple-glow' : 'border-slate-800 bg-surface/50 opacity-50'}`}>
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Send className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-display font-bold text-lg text-white">Étape 1 : Rejoindre le Canal Telegram</h3>
                  <p className="text-sm text-slate-400">
                    Obligatoire pour suivre nos annonces, les concours affiliés et être informé des paiements de commissions.
                  </p>
                </div>
                <a 
                  href="https://t.me/+-a9LF-suXS81NTk0" 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => setOnboardingStep(2)}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm text-center transition-colors shadow-lg shadow-blue-900/50"
                >
                  Rejoindre le canal
                </a>
              </div>
            </div>

            {/* Étape 2 : IBAN */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${onboardingStep === 2 ? 'border-gold bg-gold/5 shadow-gold-glow' : 'border-slate-800 bg-surface/50 opacity-50 pointer-events-none'}`}>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-emerald/20 text-emerald flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Étape 2 : Vos coordonnées bancaires</h3>
                    <p className="text-sm text-slate-400">
                      Renseignez votre IBAN pour que nous puissions vous virer vos commissions chaque mois.
                    </p>
                  </div>

                  <form onSubmit={handleCompleteOnboarding} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Titulaire du compte</label>
                      <input
                        type="text"
                        required
                        value={ibanForm.holder}
                        onChange={e => setIbanForm({ ...ibanForm, holder: e.target.value })}
                        placeholder="Ex: Jean Dupont"
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">IBAN</label>
                        <input
                          type="text"
                          required
                          value={ibanForm.iban}
                          onChange={e => setIbanForm({ ...ibanForm, iban: e.target.value })}
                          placeholder="FR76 ...."
                          className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold uppercase"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Code BIC/SWIFT</label>
                        <input
                          type="text"
                          required
                          value={ibanForm.bic}
                          onChange={e => setIbanForm({ ...ibanForm, bic: e.target.value })}
                          placeholder="Ex: BNPAFRPP"
                          className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold uppercase"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isOnboardingSaving}
                      className="w-full mt-4 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isOnboardingSaving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Enregistrer et accéder au Dashboard</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    )
  }

  const currentDay = new Date().getDate()
  const isPayoutWindow = currentDay >= 15 && currentDay <= 20
  const canRequestPayout = isPayoutWindow && soldeDisponible >= 100

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-surface-border relative overflow-hidden">
        {/* Decorative VIP glow */}
        <div className={`absolute top-0 right-1/2 w-64 h-64 blur-3xl pointer-events-none ${getVipInfo(totalHistoricalValid).bg} opacity-20`} />
        
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Compte Affilié Vérifié — Statut Actif</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Tableau de Bord
            </h1>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${getVipInfo(totalHistoricalValid).border} ${getVipInfo(totalHistoricalValid).bg}`}>
              <span className="text-base">{getVipInfo(totalHistoricalValid).icon}</span>
              <span className={`text-sm font-bold uppercase tracking-wider ${getVipInfo(totalHistoricalValid).color}`}>
                {getVipInfo(totalHistoricalValid).name}
              </span>
            </div>
          </div>
          
          {/* Progress Bar to next VIP */}
          {getVipInfo(totalHistoricalValid).next && (
            <div className="mt-4 w-full max-w-sm">
              <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                <span>Total Généré : {totalHistoricalValid.toFixed(0)}€</span>
                <span>Prochain Rang : {getVipInfo(totalHistoricalValid).next}€</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className={`h-full ${getVipInfo(totalHistoricalValid).bg.replace('/30', '')} transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(100, getVipInfo(totalHistoricalValid).progress)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Plus que {(getVipInfo(totalHistoricalValid).next! - totalHistoricalValid).toFixed(0)}€ pour le rang {getVipInfo(totalHistoricalValid).nextName} !
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {affiliateCode === 'MODE_TEST' && (
            <button
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                  const refCode = 'ADMIN_' + Math.random().toString(36).substring(2, 6).toUpperCase()
                  await supabase.from('affiliates').insert({
                    id: user.id,
                    referral_code: refCode,
                    status: 'active'
                  })
                  window.location.reload()
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase shadow-lg shadow-emerald-900/50 transition-colors"
            >
              Créer Vrai Profil
            </button>
          )}
          <div className="bg-surface p-3 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Solde Disponible</span>
            <span className="text-xl font-bold font-mono text-gradient-gold">{soldeDisponible.toFixed(2)} €</span>
          </div>
          <button
            onClick={() => setDepositModalOpen(true)}
            className="px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-purple-glow transition-all"
          >
            Dépôt Membre Effectué
          </button>
          <button
            onClick={() => setActiveTab('payout')}
            className="px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all"
          >
            Demander un Retrait
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Menu Latéral (Sidebar) */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2 lg:sticky lg:top-24">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
            { id: 'links', label: 'Mes Liens & QR', icon: Copy },
            { id: 'stats', label: 'Statistiques', icon: MousePointerClick },
            { id: 'commissions', label: 'Commissions', icon: DollarSign },
            { id: 'payout', label: 'Paiements', icon: CreditCard },
            { id: 'iban', label: 'Mon IBAN', icon: Lock },
            { id: 'support', label: 'Support & Tchat', icon: MessageSquare },
          ].map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 w-full text-left ${
                  active
                    ? 'bg-primary text-white shadow-purple-glow'
                    : 'text-slate-400 hover:text-white hover:bg-surface-card border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TABS CONTENT */}
        <div className="flex-1 w-full min-w-0">
          
          {adminMessage && (
            <div className="mb-8 p-4 md:p-6 rounded-2xl glass-panel border border-purple-500/30 bg-purple-900/10 shadow-purple-glow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-purple-300">Nouveau message de votre Manager</h3>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{adminMessage}</p>
                </div>
              </div>
            </div>
          )}


      {/* 1. VUE D'ENSEMBLE */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Cards KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Clics Totaux</span>
                <MousePointerClick className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-2xl font-bold font-mono text-white">{totalClicks}</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Commissions (Total)</span>
                <Zap className="w-4 h-4 text-gold" />
              </div>
              <span className="text-2xl font-bold font-mono text-gradient-gold">{commissionsList.length}</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Mois en Cours</span>
                <DollarSign className="w-4 h-4 text-emerald" />
              </div>
              <span className="text-2xl font-bold font-mono text-emerald">{soldeMoisEnCours.toFixed(2)} €</span>
              <span className="text-[10px] text-emerald/80">Sera débloqué le mois prochain</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Solde Prêt à Retirer</span>
                <CreditCard className="w-4 h-4 text-gold" />
              </div>
              <span className="text-2xl font-bold font-mono text-gradient-gold">{soldeDisponible.toFixed(2)} €</span>
              <span className="text-[11px] text-emerald">Min 250€</span>
            </div>
          </div>

          {/* Graphique Aperçu */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Performance 7 Derniers Jours</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
            {casinosList.length === 0 ? (
              <p className="text-slate-400 text-sm">Chargement de vos liens ou aucun casino disponible...</p>
            ) : casinosList.map((casino) => {
              // URL Tracking interne (Redirection dynamique)
              const linkUrl = `${window.location.origin}/go/${casino.slug}?ref=${affiliateCode}`
              const clickCount = clicksData[casino.id] || 0

              return (
                <div key={casino.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{casino.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-primary/20 text-primary-light px-2 py-0.5 rounded font-mono">
                        {clickCount} Clic{clickCount > 1 ? 's' : ''}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        Code: {affiliateCode}
                      </span>
                    </div>
                  </div>
                  
                  {(casino.commission_conditions || casino.remboursement_depot || casino.commission_cpa || casino.bonus_depot || casino.minimum_depot) && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {casino.commission_cpa && (
                        <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded font-mono border border-gold/30 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {casino.commission_cpa}
                        </span>
                      )}
                      {casino.minimum_depot && (
                        <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-800/50">
                          Min: {casino.minimum_depot}
                        </span>
                      )}
                      {casino.remboursement_depot && (
                        <span className="text-[10px] bg-emerald/20 text-emerald px-2 py-0.5 rounded font-mono border border-emerald/30">
                          Remboursement Dépôt: Oui
                        </span>
                      )}
                      {casino.commission_conditions && (
                        <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-800/50">
                          {casino.commission_conditions}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="bg-surface p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs text-slate-300 font-mono">
                    <span className="truncate max-w-[260px] text-[10px] text-primary-light">{linkUrl}</span>
                    <button
                      onClick={() => copyToClipboard(linkUrl, casino.id)}
                      className="px-2.5 py-1 rounded bg-primary text-white text-[11px] font-sans hover:bg-primary-hover transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedCode === casino.id ? 'Copié !' : 'Copier'}
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
              <AreaChart data={chartData}>
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
                {commissionsList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-slate-500">Aucune commission enregistrée.</td>
                  </tr>
                ) : commissionsList.map(c => {
                  const isPaid = c.statut === 'paid'
                  const isValid = c.statut === 'validated'
                  return (
                    <tr key={c.id}>
                      <td className="p-3 font-mono">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="p-3 font-bold text-white">{c.periode || 'N/A'}</td>
                      <td className="p-3 font-mono font-bold text-gold">{c.montant} €</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded ${
                          isPaid ? 'bg-purple-900/40 text-purple-400' :
                          isValid ? 'bg-emerald/20 text-emerald' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {isPaid ? 'Payé' : isValid ? 'Validé' : 'En attente'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DEMANDE DE PAIEMENT */}
      {activeTab === 'payout' && (
        <div className="space-y-6">
          {/* Payout form */}
          <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-gold/30 space-y-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">Formulaire de Demande de Retrait</h3>
              <p className="text-xs text-slate-400">Solde minimum requis : 100.00 € (Votre solde actuel : {soldeDisponible.toFixed(2)} €)</p>
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
                  max={soldeDisponible}
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
                disabled={!canRequestPayout}
                className={`w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  canRequestPayout 
                    ? 'text-black bg-gold hover:bg-gold-light shadow-gold-glow' 
                    : 'text-slate-400 bg-slate-800/80 cursor-not-allowed border border-slate-700'
                }`}
              >
                {canRequestPayout ? 'Confirmer la Demande de Paiement' : (soldeDisponible < 100 && isPayoutWindow) ? 'Solde insuffisant' : 'Paiements fermés'}
              </button>
              
              {!isPayoutWindow && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Les soldes disponibles peuvent être retirés uniquement <strong>entre le 15 et le 20 du mois</strong>. En dehors de cette période, les demandes sont bloquées pour comptabilité.</p>
                </div>
              )}
              {isPayoutWindow && soldeDisponible < 100 && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Votre solde débloqué est inférieur au minimum requis de <strong>100€</strong>.</p>
                </div>
              )}
            </form>
          </div>

          {/* Refund request form */}
          <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-purple-500/30 space-y-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                Demande de Remboursement de Dépôt
              </h3>
              <p className="text-xs text-slate-400">Vous avez effectué un dépôt dans un casino partenaire ? Soumettez votre demande avec une preuve pour être remboursé.</p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!refundForm.casinoId || !refundForm.amount || !refundForm.proofFile || !affiliateId) {
                  toast.error('Veuillez remplir tous les champs et joindre une preuve.')
                  return
                }
                setIsSubmittingRefund(true)
                try {
                  // Upload the proof file
                  const fileExt = refundForm.proofFile.name.split('.').pop()
                  const fileName = `${affiliateId}/${Date.now()}.${fileExt}`
                  const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('proofs')
                    .upload(fileName, refundForm.proofFile, { upsert: true })
                  
                  if (uploadError) {
                    toast.error('Erreur lors de l\'envoi du fichier : ' + uploadError.message)
                    setIsSubmittingRefund(false)
                    return
                  }
                  
                  const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(fileName)

                  const casino = casinosList.find(c => c.id === refundForm.casinoId)
                  const casinoName = casino ? casino.name : refundForm.casinoId

                  const { error: insertError } = await supabase.from('refund_requests').insert([{
                    affiliate_id: affiliateId,
                    casino_name: casinoName,
                    amount: Number(refundForm.amount),
                    proof_url: publicUrl,
                    status: 'pending'
                  }])

                  if (insertError) {
                    toast.error('Erreur lors de l\'envoi de la demande : ' + insertError.message)
                  } else {
                    try {
                      await fetch('/api/telegram', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          type: 'refund_request',
                          message: `Casino : <b>${casinoName}</b>\nMontant : <b>${refundForm.amount} €</b>\nAffilié ID : ${affiliateId}\n\n<i>Connectez-vous pour voir la preuve de dépôt et valider la demande.</i>`
                        })
                      })
                    } catch (err) {}
                    toast.success('Demande de remboursement envoyée avec succès ! L\'équipe vous recontactera.')
                    setRefundForm({ casinoId: '', amount: '', proofFile: null })
                  }
                } catch (err: any) {
                  toast.error('Erreur réseau : ' + err.message)
                } finally {
                  setIsSubmittingRefund(false)
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Casino concerné</label>
                <select
                  required
                  value={refundForm.casinoId}
                  onChange={e => setRefundForm({ ...refundForm, casinoId: e.target.value })}
                  className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">-- Sélectionner un casino --</option>
                  {casinosList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant du dépôt (€)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={refundForm.amount}
                  onChange={e => setRefundForm({ ...refundForm, amount: e.target.value })}
                  placeholder="Ex: 200"
                  className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Preuve de dépôt (capture d&apos;écran / PDF)</label>
                <div className="relative">
                  <input
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={e => setRefundForm({ ...refundForm, proofFile: e.target.files?.[0] || null })}
                    className="w-full bg-surface border border-dashed border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-600/30 file:text-purple-200 hover:file:bg-purple-600/50 cursor-pointer"
                  />
                </div>
                {refundForm.proofFile && (
                  <p className="text-[11px] text-emerald flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Fichier sélectionné : {refundForm.proofFile.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingRefund}
                className="w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-primary hover:brightness-110 shadow-purple-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingRefund ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</> : 'Soumettre ma Demande de Remboursement'}
              </button>
            </form>
          </div>
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
              {ticketsList.length === 0 ? (
                <p className="text-slate-500 text-sm">Aucun ticket pour le moment.</p>
              ) : ticketsList.map(t => (
                <div key={t.id} className="bg-surface p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.sujet}</h4>
                    <span className="text-[11px] text-slate-400">Créé le {new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      t.statut === 'answered' || t.statut === 'closed' ? 'bg-emerald/20 text-emerald' : 'bg-gold/20 text-gold'
                    }`}>
                      {t.statut === 'open' ? 'Ouvert' : t.statut === 'closed' ? 'Fermé' : 'Répondu'}
                    </span>
                    <button
                      onClick={() => openChatModal(t)}
                      className="px-3 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> Tchat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



        </div>
      </div>

      {/* Chat Modal */}
      {chatModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-0 rounded-2xl max-w-2xl w-full shadow-2xl relative flex flex-col h-[80vh] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-surface/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="text-primary w-5 h-5" /> {chatModal.ticketSubject}
                </h3>
              </div>
              <button 
                onClick={() => setChatModal({ ...chatModal, isOpen: false })}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0f]">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500 text-sm font-mono">Aucun message pour le moment.</p>
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isAffiliate = msg.sender_id === affiliateId
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAffiliate ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        isAffiliate 
                          ? 'bg-primary/20 border border-primary/30 text-white rounded-br-sm' 
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm'
                      }`}>
                        <div className="text-[10px] opacity-50 font-bold mb-1 flex justify-between gap-4">
                          <span>{isAffiliate ? 'Vous' : 'Support (Admin)'}</span>
                          <span>{new Date(msg.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-800 bg-surface/50">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Écrivez votre réponse..."
                  value={newChatMessage}
                  onChange={e => setNewChatMessage(e.target.value)}
                  className="flex-1 bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={isSendingMessage}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setDepositModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <h3 className="text-xl font-display font-bold text-white mb-2 flex items-center gap-2">
              <DollarSign className="text-emerald w-5 h-5" /> Déclarer un Dépôt
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Indiquez le casino et le montant du dépôt effectué par votre membre. Cette information sera transmise directement à l'administrateur pour vérification.
            </p>

            <form onSubmit={handleDeclareDeposit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Sélectionnez le Casino</label>
                <select 
                  required
                  value={depositForm.casinoId}
                  onChange={(e) => setDepositForm({...depositForm, casinoId: e.target.value})}
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>-- Choisir un casino --</option>
                  {casinosList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant du Dépôt (€)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Ex: 50"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingDeposit}
                className="w-full py-3.5 mt-2 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingDeposit ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Envoyer la Déclaration'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
