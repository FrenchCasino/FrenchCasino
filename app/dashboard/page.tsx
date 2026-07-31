'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  MousePointerClick,
  DollarSign,
  CheckCircle2,
  Copy,
  Bell,
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
  AlertCircle,
  Download,
  Trophy,
  Megaphone
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
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'stats' | 'commissions' | 'payout' | 'iban' | 'support' | 'recruitment' | 'marketing'>('overview')
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
  
  const [totalClicks, setTotalClicks] = useState<number>(0)
  const [statsEPC, setStatsEPC] = useState<number>(0)
  const [statsCR, setStatsCR] = useState<number>(0)
  const [statsTopCasino, setStatsTopCasino] = useState<string>('N/A')
  const [statsCommsByCasino, setStatsCommsByCasino] = useState<Record<string, number>>({})
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isMasterUser, setIsMasterUser] = useState<boolean>(false)
  const [commissionsList, setCommissionsList] = useState<any[]>([])
  const [monthlyCommissions, setMonthlyCommissions] = useState(0)
  const [soldeMoisEnCours, setSoldeMoisEnCours] = useState(0)
  const [soldeDisponible, setSoldeDisponible] = useState(0)
  const [totalHistoricalValid, setTotalHistoricalValid] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])
  const [ticketsList, setTicketsList] = useState<any[]>([])
  
  // Custom Time Range Filter for Stats
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d')
  const [rawClicksList, setRawClicksList] = useState<any[]>([])
  const [payoutsList, setPayoutsList] = useState<any[]>([])
  const [refundsList, setRefundsList] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadNotifCount, setUnreadNotifCount] = useState(0)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [selectedRefundForTimeline, setSelectedRefundForTimeline] = useState<any | null>(null)

  // Refund form state
  const [refundForm, setRefundForm] = useState({ casinoId: '', amount: '', proofFile: null as File | null })
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false)
  const [marketingCasino, setMarketingCasino] = useState<string>('generic')

  // Resolving details for marketing copy
  let resolvedCasinoName = "Casino Partenaire"
  let resolvedLinkUrl = "[VOTRE_LIEN_D_AFFILIE]"
  let resolvedMinDepot = "10€"
  let resolvedBonusSansDepot = "10€ offerts"
  let resolvedBonusDepot = "100% jusqu'à 500€"
  let resolvedRemboursement = "Remboursement garanti"

  if (marketingCasino !== 'generic') {
    const selectedC = casinosList.find(c => c.id === marketingCasino)
    if (selectedC) {
      resolvedCasinoName = selectedC.name
      resolvedLinkUrl = isMasterUser && selectedC.lien_affilie
        ? selectedC.lien_affilie
        : (typeof window !== 'undefined' ? `${window.location.origin}/go/${selectedC.slug}?ref=${affiliateCode}` : `/go/${selectedC.slug}?ref=${affiliateCode}`)
      resolvedMinDepot = selectedC.minimum_depot || "10€"
      resolvedBonusSansDepot = selectedC.bonus_sans_depot || "10€ sans dépôt"
      resolvedBonusDepot = selectedC.bonus_depot || "100% jusqu'à 500€"
      resolvedRemboursement = selectedC.remboursement_depot ? "100% remboursé en cas de perte" : "Remboursement éligible"
    }
  }

  const getTemplateText = (type: string) => {
    switch (type) {
      case 'sans_depot_1':
        return `🎁 **100% GRATUIT : ${resolvedBonusSansDepot} OFFERTS !** 🎁\n\nPas envie de déposer de l'argent ? Pas de soucis ! **${resolvedCasinoName}** t'offre **${resolvedBonusSansDepot}** totalement gratuits pour tester leur casino.\n\n💥 **Pourquoi en profiter ?**\n- Zéro risque de perte 💸\n- Création de compte en 30 secondes chrono ⏱️\n- Gains réels possibles !\n\n👇 **Récupère ton bonus gratuit maintenant :**\n🔗 ${resolvedLinkUrl}\n\n*Offre réservée aux nouveaux joueurs. 18+*`
      case 'sans_depot_2':
        return `🚨 **EXCLUSIVITÉ SANS DÉPÔT SUR ${resolvedCasinoName.toUpperCase()}** 🚨\n\nTu veux jouer gratuitement et tenter de monter une bankroll à partir de rien ? Suis les étapes :\n\n1️⃣ Clique sur le lien ci-dessous ⬇️\n2️⃣ Remplis l'inscription rapide\n3️⃣ Profite de tes **${resolvedBonusSansDepot}** sur les meilleures machines !\n\nLien exclusif de l'offre :\n👉 ${resolvedLinkUrl}\n\n⚠️ *Profite-en vite avant que le casino ne retire l'offre !*`
      
      case 'depot_min_script':
        return `🎬 **SCRIPT VIDÉO (TikTok / Reels / Shorts)**\n\n🗣️ *[Face caméra de manière dynamique]* :\n"Arrête de croire qu'il faut poser 100€ pour t'amuser et tenter de gagner au casino en ligne ! Regarde ça..."\n\n📱 *[Montrer l'écran de ton téléphone ou filmer l'interface de ${resolvedCasinoName}]* :\n"Sur **${resolvedCasinoName}**, le dépôt minimum est de seulement **${resolvedMinDepot}**. Oui, tu as bien entendu : un petit billet de ${resolvedMinDepot} suffit pour débloquer toutes les machines à sous et les jeux en direct comme le Crazy Time ou la Roulette !"\n\n🗣️ *[Face caméra]* :\n"Le lien sécurisé est juste ici si tu veux tester la plateforme sans te ruiner. Fais-toi plaisir, mais joue avec modération !"\n\n🔗 **Lien en bio / description :** ${resolvedLinkUrl}`
      case 'depot_min_post':
        return `💸 **CASINO PETIT BUDGET - DÉPÔT MINIMUM : ${resolvedMinDepot}** 💸\n\nPas besoin d'avoir un énorme budget pour jouer ! **${resolvedCasinoName}** accepte les dépôts dès **${resolvedMinDepot}** !\n\n🔥 **Ce qui t'attend sur la plateforme :**\n- Plus de 3000 jeux certifiés 🎰\n- Dépôt rapide et ultra-sécurisé 💳\n- Idéal pour tester sans stress !\n\n👇 **Inscris-toi et commence à jouer avec seulement ${resolvedMinDepot} :**\n🔗 ${resolvedLinkUrl}\n\n*18+ | Les jeux d'argent comportent des risques.*`

      case 'depot_boost_1':
        return `🚀 **BOOSTE TON DÉPART : ${resolvedBonusDepot}** 🚀\n\nTu veux maximiser tes chances de faire un gros retrait ? **${resolvedCasinoName}** double ton dépôt de bienvenue avec une offre exclusive de **${resolvedBonusDepot}** !\n\n💎 **Pourquoi jouer sur ${resolvedCasinoName} ?**\n- Les fournisseurs les plus populaires (Pragmatic, Hacksaw...) 🎰\n- Retraits sécurisés validés ultra rapidement ⚡\n- Un support client à ton écoute 24h/24 🇫🇷\n\n👉 **Prends ton bonus de bienvenue et démarre fort ici :**\n🔗 ${resolvedLinkUrl}`
      case 'depot_boost_2':
        return `🔥 **C'EST LE MOMENT DE TESTER ${resolvedCasinoName.toUpperCase()} !** 🔥\n\nProfite d'un bonus de bienvenue de **${resolvedBonusDepot}** sur ton premier dépôt !\n\nPlus d'excuse, le casino est fiable, rapide, et les jeux payent fort en ce moment.\n\nClique ici pour t'inscrire et recevoir ton bonus :\n👉 ${resolvedLinkUrl}`

      case 'remboursement_1':
        return `🛡️ **JOUE SANS RISQUE : 100% REMBOURSÉ SI TU PERDS !** 🛡️\n\nTu hésites encore ? On a négocié pour toi l'offre ultime sur **${resolvedCasinoName}** !\n\n💥 **Le concept est super simple :**\n- Tu t'inscris avec notre lien exclusif\n- Tu fais ton dépôt et tu joues\n- Si tu gagnes, tu retires tes gains 💰\n- Si tu perds, **on te rembourse ton dépôt** ! Tu ne peux pas perdre !\n\n👉 **Inscris-toi maintenant pour activer ton assurance de jeu :**\n🔗 ${resolvedLinkUrl}`
      case 'remboursement_2':
        return `🤝 **ALERTE OFFRE SÉCURISÉE - REMBOURSEMENT GARANTI** 🤝\n\nPour toute inscription sur **${resolvedCasinoName}** via notre lien exclusif, bénéficie d'un remboursement de ton dépôt en cas de session perdante.\n\nComment faire ? C'est très simple :\n1️⃣ Crée ton compte ici : ${resolvedLinkUrl}\n2️⃣ Fais ton dépôt de départ\n3️⃣ Si la chance n'est pas au rendez-vous, déclare ton dépôt dans ton espace membre et reçois ton remboursement !\n\nJouez en toute sérénité :\n🔗 ${resolvedLinkUrl}`

      default:
        return ""
    }
  }

  const renderMarketingCard = (title: string, content: string, helpText: string) => {
    const uniqueId = `mkt_${title.replace(/[^a-zA-Z0-9]/g, '_')}`
    return (
      <div className="bg-[#0f0f15] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h5 className="font-bold text-sm text-white">{title}</h5>
            <span className="text-[10px] text-slate-400 font-normal italic">{helpText}</span>
          </div>
          <div className="bg-surface p-3.5 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed relative">
            {content}
          </div>
        </div>
        <button
          onClick={() => copyToClipboard(content, uniqueId)}
          className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-purple-glow transition-all flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          <span>{copiedCode === uniqueId ? 'Copié !' : 'Copier la Publication'}</span>
        </button>
      </div>
    )
  }

  React.useEffect(() => {
    async function loadAffiliateData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setIsMasterUser(user.email === 'gabin77700@gmail.com')

      const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
      if (profile?.role === 'admin' || profile?.role === 'recruiter') {
        // Un admin ou un recruteur testant le dashboard affilié
        setAffiliateStatus('active')
        setIsAdmin(true)
      }

      // Load Casinos for everyone (affiliates and admins)
      let casData: any[] | null = null
      const res = await supabase
        .from('casinos')
        .select('id, name, slug, remboursement_depot, commission_conditions, commission_cpa, bonus_depot, minimum_depot, visible_affiliate, lien_affilie')
        .eq('is_active', true)
      
      if (res.error) {
        const { data: fallbackData } = await supabase
          .from('casinos')
          .select('id, name, slug, remboursement_depot, commission_conditions, commission_cpa, bonus_depot, minimum_depot, lien_affilie')
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
          
        if (fallbackAffRes.error) {
          const superFallback = await supabase
            .from('affiliates')
            .select('id, referral_code, status')
            .eq('id', user.id)
            .single()
          affData = superFallback.data
        } else {
          affData = fallbackAffRes.data
        }
      } else {
        affData = affRes.data
      }
      
      if (affData) {
        setAffiliateCode(affData.referral_code)
        setAffiliateId(affData.id)
        setAffiliateStatus(affData.status)
        setAdminMessage(affData.admin_message || null)
        
        if (profile?.role === 'admin') {
          setOnboardingCompleted(true)
        } else {
          setOnboardingCompleted(affData.onboarding_completed === true)
        }
        
        if (affData.iban) {
          setIbanForm({
            holder: affData.iban_holder || '',
            iban: affData.iban || '',
            bic: affData.bic || ''
          })
        } else if (profile?.full_name) {
          setIbanForm(prev => ({ ...prev, holder: profile.full_name }))
        }

        // Load Clicks (using casino_slug from schema)
        const { data: clicks, error: clicksErr } = await supabase
          .from('casino_clicks')
          .select('casino_slug, created_at')
          .eq('affiliate_id', affData.id)
        
        if (clicksErr) console.error('Error loading dashboard clicks:', clicksErr)
        if (clicks) setRawClicksList(clicks)

        // Load Commissions
        const { data: comms } = await supabase
          .from('commissions')
          .select('*')
          .eq('affiliate_id', affData.id)
          .order('created_at', { ascending: false })

        if (comms) setCommissionsList(comms)

        // Load Payouts
        const { data: payouts } = await supabase
          .from('payout_requests')
          .select('*')
          .eq('affiliate_id', affData.id)
        
        if (payouts) setPayoutsList(payouts)

        // Load Tickets
        const { data: tks } = await supabase
          .from('tickets')
          .select('*')
          .eq('affiliate_id', affData.id)
          .order('created_at', { ascending: false })

        if (tks) setTicketsList(tks)

        // Load Refund Requests
        const { data: refunds } = await supabase
          .from('refund_requests')
          .select('*')
          .eq('affiliate_id', affData.id)
          .order('created_at', { ascending: false })

        if (refunds) setRefundsList(refunds)

        // Load Notifications
        const { data: notifs } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (notifs) {
          setNotifications(notifs)
          setUnreadNotifCount(notifs.filter((n: any) => !n.is_read).length)
        }

        // Load Leaderboard from secure RPC
        const { data: topAffs } = await supabase
          .rpc('get_top_affiliates_leaderboard')
        
        if (topAffs) setLeaderboard(topAffs)
      }
      
      setLoadingData(false)
    }
    loadAffiliateData()
  }, [])

  // Dynamic statistics calculator based on timeRange
  React.useEffect(() => {
    if (loadingData) return

    const now = new Date()
    let filteredClicks = rawClicksList
    let filteredComms = commissionsList

    if (timeRange === '7d') {
      const limit = new Date()
      limit.setDate(now.getDate() - 7)
      filteredClicks = rawClicksList.filter(c => new Date(c.created_at) >= limit)
      filteredComms = commissionsList.filter(c => new Date(c.created_at) >= limit)
    } else if (timeRange === '30d') {
      const limit = new Date()
      limit.setDate(now.getDate() - 30)
      filteredClicks = rawClicksList.filter(c => new Date(c.created_at) >= limit)
      filteredComms = commissionsList.filter(c => new Date(c.created_at) >= limit)
    }

    // Process Clicks counts by casino
    const counts: Record<string, number> = {}
    filteredClicks.forEach(c => {
      const slug = c.casino_slug || 'autre'
      counts[slug] = (counts[slug] || 0) + 1
    })
    setClicksData(counts)
    setTotalClicks(filteredClicks.length)

    // Process Commissions
    let currentMonthly = 0
    let pastCommissions = 0
    let totalValid = 0
    let totalConversions = 0
    const commsCountByCasino: Record<string, number> = {}
    
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    filteredComms.forEach(c => {
      if (c.statut === 'validated' || c.statut === 'paid') {
        const amount = Number(c.montant)
        totalValid += amount
        totalConversions += 1
        
        const date = new Date(c.created_at)
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          currentMonthly += amount
        } else {
          pastCommissions += amount
        }
        
        const key = c.casino_slug || c.casino_name || 'Inconnu'
        commsCountByCasino[key] = (commsCountByCasino[key] || 0) + 1
      }
    })

    // Compute monthly and general commissions totals
    // If not filtered (all time), pastCommissions represents all commissions
    // Solde Disponible calculation always uses all historical commissions minus payouts
    let allValidCommsAmount = 0
    let allMonthlyCommsAmount = 0
    commissionsList.forEach(c => {
      if (c.statut === 'validated' || c.statut === 'paid') {
        const amount = Number(c.montant)
        allValidCommsAmount += amount
        const date = new Date(c.created_at)
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          allMonthlyCommsAmount += amount
        }
      }
    })

    setMonthlyCommissions(allMonthlyCommsAmount)
    setSoldeMoisEnCours(allMonthlyCommsAmount)
    setTotalHistoricalValid(allValidCommsAmount)
    setStatsCommsByCasino(commsCountByCasino)

    // EPC and CR calculation
    if (filteredClicks.length > 0) {
      setStatsCR((totalConversions / filteredClicks.length) * 100)
      setStatsEPC(totalValid / filteredClicks.length)
    } else {
      setStatsCR(0)
      setStatsEPC(0)
    }

    // Top Casino
    let bestCasino = 'N/A'
    let maxComms = 0
    Object.keys(commsCountByCasino).forEach(cas => {
      if (commsCountByCasino[cas] > maxComms) {
        maxComms = commsCountByCasino[cas]
        bestCasino = cas
      }
    })
    setStatsTopCasino(bestCasino)

    // Process Payouts for Solde Disponible
    let totalPaidOrPending = 0
    payoutsList.forEach(p => {
      if (p.statut !== 'rejected') {
        totalPaidOrPending += Number(p.montant_demande)
      }
    })
    // Solde disponible = Total Validated commissions (past months) - payout requests
    const pastValidCommsAmount = allValidCommsAmount - allMonthlyCommsAmount
    setSoldeDisponible(Math.max(0, pastValidCommsAmount - totalPaidOrPending))

    // Build Chart Data (Daily breakdown)
    const rangeDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 15
    const chart = []

    for (let i = rangeDays - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      
      const dayStart = new Date(date)
      dayStart.setHours(0,0,0,0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23,59,59,999)

      const dayClicks = rawClicksList.filter(c => {
        const d = new Date(c.created_at)
        return d >= dayStart && d <= dayEnd
      }).length

      const dayComms = commissionsList.filter(c => {
        const d = new Date(c.created_at)
        return d >= dayStart && d <= dayEnd && (c.statut === 'validated' || c.statut === 'paid')
      }).reduce((acc, curr) => acc + Number(curr.montant), 0)

      chart.push({
        day: dateStr,
        clics: dayClicks,
        commissions: dayComms
      })
    }
    setChartData(chart)

  }, [timeRange, rawClicksList, commissionsList, payoutsList, loadingData])
  
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

  const handleMarkAllNotifsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    if (!error) {
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadNotifCount(0)
      toast.success('Toutes les notifications ont été marquées comme lues.')
    }
  }

  const handleMarkNotifRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    if (!error) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadNotifCount(prev => Math.max(0, prev - 1))
    }
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
    // Reload payouts list
    if (affiliateId) {
      const { data: payouts } = await supabase.from('payout_requests').select('*').eq('affiliate_id', affiliateId)
      if (payouts) setPayoutsList(payouts)
    }
    setTimeout(() => setPayoutSuccess(false), 4000)
  }

  // CSV Export Utils
  const downloadCSV = (headers: string[], rows: any[][], filename: string) => {
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(val => {
        if (val === null || val === undefined) return '';
        const str = String(val).replace(/"/g, '""');
        return str.includes(';') || str.includes('\n') || str.includes('"') ? `"${str}"` : str;
      }).join(';'))
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCommissions = () => {
    if (commissionsList.length === 0) return toast.error("Aucune commission à exporter.");
    const headers = ["Date", "Casino/Période", "Montant", "Statut"];
    const rows = commissionsList.map(c => [
      new Date(c.created_at).toLocaleDateString(),
      c.periode || 'N/A',
      `${c.montant} €`,
      c.statut
    ]);
    downloadCSV(headers, rows, `commissions_frenchcasino_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPayouts = () => {
    if (payoutsList.length === 0) return toast.error("Aucun retrait à exporter.");
    const headers = ["Date Demande", "Montant", "Statut"];
    const rows = payoutsList.map(p => [
      new Date(p.created_at).toLocaleDateString(),
      `${p.montant_demande} €`,
      p.statut
    ]);
    downloadCSV(headers, rows, `retraits_frenchcasino_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportRefunds = () => {
    if (refundsList.length === 0) return toast.error("Aucun remboursement à exporter.");
    const headers = ["Date Demande", "Casino", "Montant", "Statut"];
    const rows = refundsList.map(r => [
      new Date(r.created_at).toLocaleDateString(),
      r.casino_name,
      `${r.amount} €`,
      r.status
    ]);
    downloadCSV(headers, rows, `remboursements_frenchcasino_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportClicksStats = () => {
    if (chartData.length === 0) return toast.error("Aucune statistique à exporter.");
    const headers = ["Date", "Clics", "Commissions"];
    const rows = chartData.map(d => [d.day, d.clics, `${d.commissions} €`]);
    downloadCSV(headers, rows, `performances_frenchcasino_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
  };

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
          {!affiliateId && isAdmin && (
            <button
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                  const refCode = 'ADMIN_' + Math.random().toString(36).substring(2, 6).toUpperCase()
                  await supabase.from('affiliates').upsert({
                    id: user.id,
                    referral_code: refCode,
                    status: 'active'
                  }, { onConflict: 'id' })
                  window.location.reload()
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase shadow-lg shadow-emerald-900/50 transition-colors"
            >
              Créer Vrai Profil
            </button>
          )}
          {/* Cloche de Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-3 rounded-xl bg-surface border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 relative transition-all cursor-pointer flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-surface animate-pulse" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2.5 w-80 bg-[#0f0f15] border border-slate-800 rounded-2xl shadow-xl z-50 p-4 space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-sm">Notifications ({unreadNotifCount})</span>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={handleMarkAllNotifsRead}
                      className="text-[10px] text-gold hover:underline font-semibold"
                    >
                      Tout lire
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2.5 divide-y divide-slate-800/40">
                  {notifications.length === 0 ? (
                    <p className="text-slate-500 text-center py-4 italic">Aucune notification.</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkNotifRead(n.id)}
                        className={`pt-2.5 first:pt-0 flex flex-col gap-0.5 cursor-pointer group ${!n.is_read ? 'opacity-100' : 'opacity-60'}`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className={`font-bold text-[11px] ${!n.is_read ? 'text-white' : 'text-slate-300'} group-hover:text-gold transition-colors`}>
                            {n.title}
                          </span>
                          {!n.is_read && (
                            <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-slate-400 text-[10px] leading-normal">{n.message}</p>
                        <span className="text-[9px] text-slate-600 font-mono mt-0.5">
                          {new Date(n.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
            { id: 'marketing', label: 'Kit Marketing', icon: Megaphone },
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
            <div className="mb-8 p-4 md:p-6 rounded-2xl glass-panel border-2 border-emerald-500/50 bg-emerald-900/20 shadow-lg shadow-emerald-900/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-1 mt-1">
                  <h3 className="text-sm font-bold text-emerald-400 tracking-wide uppercase">Message de votre Manager</h3>
                  <p className="text-base font-medium text-white whitespace-pre-wrap leading-relaxed">{adminMessage}</p>
                </div>
              </div>
            </div>
          )}


      {/* 1. VUE D'ENSEMBLE */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Cards KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Clics</span>
                <MousePointerClick className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-xl font-bold font-mono text-white">{totalClicks}</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Taux Conv.</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald" />
              </div>
              <span className="text-xl font-bold font-mono text-emerald">{statsCR.toFixed(1)}%</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs" title="Gain par Clic (Earnings Per Click)">
                <span>EPC (Moyen)</span>
                <DollarSign className="w-3.5 h-3.5 text-gold" />
              </div>
              <span className="text-xl font-bold font-mono text-gradient-gold">{statsEPC.toFixed(2)} €</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Top Casino</span>
              </div>
              <span className="text-[13px] font-bold text-white uppercase tracking-wider truncate block mt-1">{statsTopCasino}</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1 relative overflow-hidden">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Mois Actuel</span>
              </div>
              <span className="text-xl font-bold font-mono text-emerald">{soldeMoisEnCours.toFixed(0)} €</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Solde Dispo</span>
              </div>
              <span className="text-xl font-bold font-mono text-gradient-gold">{soldeDisponible.toFixed(0)} €</span>
            </div>
          </div>

          {/* Graphique & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graphique Aperçu */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="font-display font-bold text-lg text-white">
                  Performance {timeRange === '7d' ? '7 Derniers Jours' : timeRange === '30d' ? '30 Derniers Jours' : 'Globale'}
                </h3>
                <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 self-start sm:self-auto shrink-0">
                  {(['7d', '30d', 'all'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        timeRange === range
                          ? 'bg-primary text-white shadow-purple-glow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {range === '7d' ? '7j' : range === '30d' ? '30j' : 'Tout'}
                    </button>
                  ))}
                </div>
              </div>
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

            {/* Leaderboard */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold shrink-0" />
                Classement Affiliés
              </h3>
              <p className="text-xs text-slate-400">Les 5 meilleurs affiliés du site (anonymisé).</p>
              
              <div className="space-y-3 pt-2">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs">
                    Aucun classement disponible.
                  </div>
                ) : leaderboard.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-slate-800/60 hover:border-slate-800 transition-all">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-gold/20 text-gold border border-gold/30' :
                        idx === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                        idx === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-600/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {item.rank}
                      </span>
                      <span className="font-mono text-xs text-slate-200">{item.ref_code}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-gold">{Number(item.total_earned).toLocaleString()} €</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Statistiques Détaillées par Casino */}
          {Object.keys(clicksData).length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Répartition par Casino</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Casino</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Clics</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">CPA Validés</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Taux Conv.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {Object.keys(clicksData).sort((a, b) => clicksData[b] - clicksData[a]).map(slug => {
                      const clics = clicksData[slug] || 0
                      const convs = statsCommsByCasino[slug] || 0
                      const cr = clics > 0 ? ((convs / clics) * 100).toFixed(1) : '0.0'
                      return (
                        <tr key={slug} className="hover:bg-slate-800/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-white capitalize">{slug}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-300">{clics}</td>
                          <td className="py-3 px-4 text-right font-mono text-emerald">{convs}</td>
                          <td className="py-3 px-4 text-right font-mono text-gold">{cr}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
            <div className="mt-2 p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg flex gap-3 items-start">
              <span className="text-blue-400 mt-0.5">💡</span>
              <p className="text-[11px] text-blue-300/80 leading-relaxed">
                <strong className="text-blue-300">Astuce Pro : Tracking multi-sources (Sub-ID)</strong><br />
                Vous pouvez ajouter <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400">&subid=tiktok</code> ou <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400">&subid=telegram</code> à la fin de vos liens pour différencier la provenance de vos clics dans vos futures campagnes !
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {casinosList.length === 0 ? (
              <p className="text-slate-400 text-sm">Chargement de vos liens ou aucun casino disponible...</p>
            ) : casinosList.map((casino) => {
              // URL Tracking interne (Redirection dynamique) ou Lien Maître direct pour Gabin
              const linkUrl = isMasterUser && casino.lien_affilie
                ? casino.lien_affilie
                : `${window.location.origin}/go/${casino.slug}?ref=${affiliateCode}`
              const clickCount = clicksData[casino.slug] || 0

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-display font-bold text-lg text-white">Statistiques Clics & Conversions</h3>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                {(['7d', '30d', 'all'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      timeRange === range
                        ? 'bg-primary text-white shadow-purple-glow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {range === '7d' ? '7j' : range === '30d' ? '30j' : 'Tout'}
                  </button>
                ))}
              </div>
              <button
                onClick={handleExportClicksStats}
                className="px-3 py-1.5 rounded-lg bg-surface border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-gold" />
                <span>Exporter CSV</span>
              </button>
            </div>
          </div>
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
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-white">Historique des Commissions</h3>
            <button
              onClick={handleExportCommissions}
              className="px-3 py-1.5 rounded-lg bg-surface border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gold" />
              <span>Exporter CSV</span>
            </button>
          </div>
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

          {/* Historique des transactions */}
          <div className="max-w-xl md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Payouts list */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-bold text-sm text-white">Vos Retraits</h4>
                <button
                  onClick={handleExportPayouts}
                  className="px-2.5 py-1 rounded bg-surface hover:text-white border border-slate-800 text-slate-400 text-[10px] transition-all flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-gold" />
                  <span>Exporter</span>
                </button>
              </div>
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[9px] uppercase">
                      <th className="pb-2">Date</th>
                      <th className="pb-2 text-right">Montant</th>
                      <th className="pb-2 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {payoutsList.length === 0 ? (
                      <tr><td colSpan={3} className="py-4 text-center text-slate-500">Aucun retrait.</td></tr>
                    ) : payoutsList.map(p => (
                      <tr key={p.id}>
                        <td className="py-2.5 text-slate-300 font-mono">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="py-2.5 text-right text-white font-mono font-semibold">{p.montant_demande} €</td>
                        <td className="py-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            p.statut === 'paid' ? 'bg-emerald/20 text-emerald' : 
                            p.statut === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'
                          }`}>{p.statut}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Refunds list */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-bold text-sm text-white">Vos Remboursements</h4>
                <button
                  onClick={handleExportRefunds}
                  className="px-2.5 py-1 rounded bg-surface hover:text-white border border-slate-800 text-slate-400 text-[10px] transition-all flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-gold" />
                  <span>Exporter</span>
                </button>
              </div>
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[9px] uppercase">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Casino</th>
                      <th className="pb-2 text-right">Montant</th>
                      <th className="pb-2 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {refundsList.length === 0 ? (
                      <tr><td colSpan={4} className="py-4 text-center text-slate-500">Aucun remboursement.</td></tr>
                    ) : refundsList.map(r => (
                      <tr 
                        key={r.id}
                        onClick={() => setSelectedRefundForTimeline(selectedRefundForTimeline?.id === r.id ? null : r)}
                        className="hover:bg-surface/50 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 text-slate-300 font-mono">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="py-2.5 text-white truncate max-w-[80px]">{r.casino_name}</td>
                        <td className="py-2.5 text-right text-white font-mono font-semibold">{r.amount} €</td>
                        <td className="py-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            r.status === 'paid' ? 'bg-emerald/20 text-emerald' :
                            r.status === 'approved' ? 'bg-purple-500/20 text-purple-400' :
                            r.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'
                          }`}>{
                            r.status === 'paid' ? 'Remboursé' :
                            r.status === 'approved' ? 'Validé' :
                            r.status === 'pending' ? 'En attente' : 'Refusé'
                          }</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Timeline Détails pour le remboursement sélectionné */}
          {selectedRefundForTimeline && (
            <div className="max-w-xl md:max-w-4xl mx-auto mt-6 glass-panel p-5 rounded-xl border border-purple-500/30 bg-purple-950/5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div>
                  <h5 className="font-bold text-white text-sm">Suivi du Remboursement : {selectedRefundForTimeline.casino_name}</h5>
                  <p className="text-[10px] text-slate-400">Demande soumise le {new Date(selectedRefundForTimeline.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="font-bold font-mono text-gold text-sm">{Number(selectedRefundForTimeline.amount).toFixed(2)} €</span>
              </div>

              {/* Timeline Steps */}
              <div className="flex items-center justify-between max-w-md mx-auto pt-3 relative">
                {/* Progress Line */}
                <div className="absolute left-4 right-4 top-4 h-0.5 bg-slate-800 -z-10" />
                <div 
                  className="absolute left-4 top-4 h-0.5 bg-emerald transition-all duration-500 -z-10" 
                  style={{ 
                    width: selectedRefundForTimeline.status === 'paid' ? '100%' : 
                           selectedRefundForTimeline.status === 'approved' ? '50%' : '0%' 
                  }} 
                />

                {/* Step 1: Soumis */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-[9px] font-bold text-slate-300">Soumis</span>
                </div>

                {/* Step 2: Validé */}
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    selectedRefundForTimeline.status === 'approved' || selectedRefundForTimeline.status === 'paid'
                      ? 'bg-emerald text-white'
                      : selectedRefundForTimeline.status === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-900 border border-slate-700 text-slate-500'
                  }`}>
                    {selectedRefundForTimeline.status === 'rejected' ? '✕' : '2'}
                  </div>
                  <span className={`text-[9px] font-bold ${
                    selectedRefundForTimeline.status === 'rejected' ? 'text-red-400' : 'text-slate-300'
                  }`}>
                    {selectedRefundForTimeline.status === 'rejected' ? 'Refusé' : 'Validé'}
                  </span>
                </div>

                {/* Step 3: Remboursé */}
                {selectedRefundForTimeline.status !== 'rejected' && (
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      selectedRefundForTimeline.status === 'paid'
                        ? 'bg-gold text-slate-950 shadow-gold-glow'
                        : 'bg-slate-900 border border-slate-700 text-slate-500'
                    }`}>
                      💸
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">Remboursé</span>
                  </div>
                )}
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center">
                {selectedRefundForTimeline.status === 'pending' && (
                  <p>⏳ Votre demande est bien reçue et en cours de validation par notre équipe d'administration.</p>
                )}
                {selectedRefundForTimeline.status === 'approved' && (
                  <p>✅ Votre demande est approuvée ! L'administrateur va procéder au virement bancaire ou crypto sous peu.</p>
                )}
                {selectedRefundForTimeline.status === 'paid' && (
                  <div className="space-y-2">
                    <p>🎉 Le remboursement a bien été effectué et validé par l'administrateur !</p>
                    {selectedRefundForTimeline.payment_proof_url && (
                      <a 
                        href={selectedRefundForTimeline.payment_proof_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold text-slate-950 font-bold text-[10px] uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
                      >
                        Télécharger la preuve de paiement
                      </a>
                    )}
                  </div>
                )}
                {selectedRefundForTimeline.status === 'rejected' && (
                  <div className="space-y-1.5">
                    <p className="text-red-400 font-bold">Votre demande a été refusée.</p>
                    {selectedRefundForTimeline.admin_note && (
                      <p className="italic text-slate-500">Motif : {selectedRefundForTimeline.admin_note}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
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

      {/* 7b. KIT MARKETING */}
      {activeTab === 'marketing' && (
        <div className="space-y-6">
          {/* Header Block */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Megaphone className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Kit de Communication & Marketing</h3>
                <p className="text-xs text-slate-400">
                  Prêt-à-publier : copiez des templates rédigés par des experts et commencez à générer des clics.
                </p>
              </div>
            </div>
            
            {/* Casino selector for personalization */}
            <div className="mt-4 p-4 bg-surface rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-300 block">Personnalisation Dynamique</span>
                <span className="text-[11px] text-slate-400 block">Choisissez un casino pour insérer automatiquement vos liens de parrainage et conditions dans les textes :</span>
              </div>
              <select
                value={marketingCasino}
                onChange={(e) => setMarketingCasino(e.target.value)}
                className="bg-[#0f0f15] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary max-w-xs w-full"
              >
                <option value="generic">🎲 Lien & Casino Générique (Placeholder)</option>
                {casinosList.map(c => (
                  <option key={c.id} value={c.id}>🎰 {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Marketing templates categories */}
          <div className="grid grid-cols-1 gap-8">
            {/* Category: Bonus Sans Dépôt */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-lg">🎁</span>
                <h4 className="font-display font-bold text-base text-white">Templates : Bonus Sans Dépôt</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMarketingCard(
                  "Post Telegram / Twitter - Punchy 🔥",
                  getTemplateText('sans_depot_1'),
                  "Idéal pour attirer rapidement sans risques."
                )}
                {renderMarketingCard(
                  "Post Réseaux Sociaux - Étape par étape 📝",
                  getTemplateText('sans_depot_2'),
                  "Idéal pour expliquer comment s'inscrire."
                )}
              </div>
            </div>

            {/* Category: Casino Dépôt Minimum */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-lg">💰</span>
                <h4 className="font-display font-bold text-base text-white">Templates : Petit Budget & Dépôt Minimum</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMarketingCard(
                  "Post TikTok / Reels - Script Vidéo 🎬",
                  getTemplateText('depot_min_script'),
                  "Script oral à haute voix pour une vidéo TikTok/Reels."
                )}
                {renderMarketingCard(
                  "Post Telegram / Discord - Spécial Micro-Budget 💸",
                  getTemplateText('depot_min_post'),
                  "Pour les joueurs voulant tester avec 10€ ou moins."
                )}
              </div>
            </div>

            {/* Category: Bonus Dépôt */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-lg">🚀</span>
                <h4 className="font-display font-bold text-base text-white">Templates : Offres de Bienvenue / Boost Dépôt</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMarketingCard(
                  "Post VIP / High-Roller 💎",
                  getTemplateText('depot_boost_1'),
                  "Présentation axée sur le bonus de bienvenue."
                )}
                {renderMarketingCard(
                  "Post Story / Discord court ⚡",
                  getTemplateText('depot_boost_2'),
                  "Format court et efficace pour des rappels."
                )}
              </div>
            </div>

            {/* Category: Remboursement Dépôt */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-lg">🛡️</span>
                <h4 className="font-display font-bold text-base text-white">Templates : Offres de Remboursement / Assurances</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMarketingCard(
                  "Post 'Zéro Risque' / Cashback 💥",
                  getTemplateText('remboursement_1'),
                  "Promouvoir le remboursement du dépôt en cas de perte."
                )}
                {renderMarketingCard(
                  "Post Exclusif Telegram de Rassurance 🤝",
                  getTemplateText('remboursement_2'),
                  "Explication rassurante sur le processus de remboursement."
                )}
              </div>
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
