'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  Download,
  Loader2,
  MessageSquare,
  Send,
  CornerDownRight,
  Building,
  ExternalLink,
  CheckSquare,
  Square,
  Handshake,
  Percent
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CASINOS_MOCK } from '@/lib/data/casinos'

export default function AdminDashboardPage() {
  const [adminTab, setAdminTab] = useState<'kpi' | 'affiliates' | 'casinos' | 'partners' | 'payouts' | 'support' | 'telegram' | 'logs'>('kpi')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // State
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [payouts, setPayouts] = useState<any[]>([])
  const [casinos, setCasinos] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [recruiters, setRecruiters] = useState<any[]>([])

  // Partenaires State & Modals
  const [partners, setPartners] = useState<any[]>([
    {
      id: 'p1',
      name: 'NetPartners Affiliate Network',
      dashboard_url: 'https://netpartners.com/login',
      cpa_commission: '120€ / Joueur',
      rs_commission: '45% RS',
      casinos_relies: ['GoldBet Casino', 'EuropeFortune', 'Atefia Casino']
    },
    {
      id: 'p2',
      name: 'DriveAffiliates Global',
      dashboard_url: 'https://go.driveaffiliates.com/login',
      cpa_commission: '150€ / Joueur',
      rs_commission: '40% RS',
      casinos_relies: ['Brutal Casino', 'MegaWin Casino', 'Slott Casino']
    },
    {
      id: 'p3',
      name: 'WePay Affiliate Hub',
      dashboard_url: 'https://track.wepayaffiliate.com/login',
      cpa_commission: '100€ / Joueur',
      rs_commission: '35% RS',
      casinos_relies: ['Europe777', 'i24slots', 'Royal Vincit']
    }
  ])

  const [partnerModal, setPartnerModal] = useState<{isOpen: boolean, editingId: string | null}>({isOpen: false, editingId: null})
  const [newPartner, setNewPartner] = useState({
    name: '',
    dashboard_url: '',
    cpa_commission: '',
    rs_commission: '',
    casinos_relies: [] as string[]
  })
  
  const [kpi, setKpi] = useState({
    activeAffiliates: 0,
    pendingAffiliates: 0,
    totalCommissions: 0,
    pendingPayouts: 0,
    pendingPayoutsAmount: 0,
    openTickets: 0,
  })

  // Commission Modal state
  const [commissionModal, setCommissionModal] = useState<{isOpen: boolean, affiliateId: string, affiliateName: string}>({ isOpen: false, affiliateId: '', affiliateName: '' })
  const [commissionAmount, setCommissionAmount] = useState('')
  const [commissionNote, setCommissionNote] = useState('Dépôt Joueur')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Casino Modal state
  const [casinoModal, setCasinoModal] = useState<{isOpen: boolean, editingId: string | null}>({isOpen: false, editingId: null})
  const [newCasino, setNewCasino] = useState<any>({
    name: '',
    slug: '',
    lien_affilie: '',
    logo_url: '',
    bonus_depot: '100% jusqu\'à 500€',
    bonus_sans_depot: 'Aucun',
    licence: 'Curaçao',
    remboursement_depot: false,
    commission_conditions: 'Nouveau inscrit seulement',
    minimum_depot: '20€',
    ordre_classement: 1,
    visible_affiliate: true
  })
  const [isSubmittingCasino, setIsSubmittingCasino] = useState(false)

  // Chat Modal state
  const [chatModal, setChatModal] = useState<{isOpen: boolean, ticketId: string, ticketSubject: string, affiliateName: string}>({ isOpen: false, ticketId: '', ticketSubject: '', affiliateName: '' })
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newChatMessage, setNewChatMessage] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [adminId, setAdminId] = useState<string | null>(null)
  
  // Telegram State
  const [telegramMessage, setTelegramMessage] = useState('')
  const [isSendingTelegram, setIsSendingTelegram] = useState(false)

  const handleSendTelegramBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!telegramMessage.trim()) return

    setIsSendingTelegram(true)
    try {
      const res = await fetch('/api/telegram/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: telegramMessage })
      })
      const data = await res.json()
      if (data.success) {
        alert("Message envoyé au canal avec succès !")
        setTelegramMessage('')
      } else {
        alert("Erreur lors de l'envoi : " + data.error)
      }
    } catch (err) {
      alert("Erreur réseau")
    } finally {
      setIsSendingTelegram(false)
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setAdminId(user.id)

      // Load Affiliates with Profiles
      const { data: affData, error: affErr } = await supabase
        .from('affiliates').select(`
          *,
          profiles!affiliates_id_fkey (
            full_name,
            email,
            role
          )
        `)
        
      const { data: recData } = await supabase.from('profiles').select('*').eq('role', 'recruiter')
      if (recData) setRecruiters(recData)
  
      
      if (affErr) console.error("Error loading affiliates:", affErr)
      else setAffiliates(affData || [])

      // Load Payouts with Affiliate Profile Info
      const { data: payData, error: payErr } = await supabase
        .from('payout_requests')
        .select(`
          *,
          affiliates (
            iban,
            profiles (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (payErr) console.error("Error loading payouts:", payErr)
      else setPayouts(payData || [])

      // Load Casinos
      const { data: casData, error: casErr } = await supabase
        .from('casinos')
        .select('*')
        .order('ordre_classement', { ascending: true })
      
      if (casErr) console.error("Error loading casinos:", casErr)
      else {
        const mapped = (casData || []).map((c: any) => {
          const localVis = typeof window !== 'undefined' ? (localStorage.getItem(`casino_vis_aff_${c.id}`) || localStorage.getItem(`casino_vis_aff_${c.slug}`)) : null;
          return {
            ...c,
            visible_affiliate: localVis !== null ? localVis === 'true' : c.visible_affiliate !== false
          };
        });
        setCasinos(mapped);
      }

      // Load Tickets
      const { data: tksData, error: tksErr } = await supabase
        .from('tickets')
        .select(`
          *,
          affiliates (
            profiles (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (tksErr) console.error("Error loading tickets:", tksErr)
      else setTickets(tksData || [])

      // Calculate KPIs
      if (affData && payData && tksData) {
        setKpi({
          activeAffiliates: affData.filter(a => a.status === 'active').length,
          pendingAffiliates: affData.filter(a => a.status === 'pending').length,
          totalCommissions: affData.reduce((acc, a) => acc + (Number(a.total_earned) || 0), 0),
          pendingPayouts: payData.filter(p => p.statut === 'pending').length,
          pendingPayoutsAmount: payData.filter(p => p.statut === 'pending').reduce((acc, p) => acc + (Number(p.montant_demande) || 0), 0),
          openTickets: tksData.filter(t => t.statut === 'open').length,
        })
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Actions Affiliés
  const handleAssignRecruiter = async (affiliateId: string, recruiterId: string) => {
    try {
      await supabase.from('affiliates').update({ recruiter_id: recruiterId || null }).eq('id', affiliateId)
      loadData()
    } catch (err) {}
  }
  
  const handleUpdateRole = async (profileId: string, newRole: string) => {
    try {
      await supabase.from('profiles').update({ role: newRole }).eq('id', profileId)
      loadData()
    } catch (err) {}
  }

  const handleUpdateAffiliateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('affiliates').update({ status: newStatus }).eq('id', id)
    if (!error) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, status: newStatus } : a))
      // Mettre à jour les KPIs locaux si besoin
      setKpi(prev => ({
        ...prev,
        activeAffiliates: newStatus === 'active' ? prev.activeAffiliates + 1 : prev.activeAffiliates - 1,
        pendingAffiliates: newStatus === 'pending' ? prev.pendingAffiliates + 1 : prev.pendingAffiliates - 1
      }))
    } else {
      alert("Erreur lors de la mise à jour du statut")
    }
  }

  const handleUpdateCommissionRate = async (id: string, currentRate: number) => {
    const newRateStr = prompt("Nouveau taux de commission (ex: 0.35 pour 35%)", currentRate.toString())
    if (!newRateStr) return
    const newRate = parseFloat(newRateStr)
    if (isNaN(newRate) || newRate < 0 || newRate > 1) {
      alert("Taux invalide. Doit être entre 0 et 1.")
      return
    }
    const { error } = await supabase.from('affiliates').update({ commission_rate: newRate }).eq('id', id)
    if (!error) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, commission_rate: newRate } : a))
    } else {
      alert("Erreur lors de la mise à jour du taux")
    }
  }

  // Handle Manual Commission Submission
  const handleAddCommission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commissionAmount) return
    
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateId: commissionModal.affiliateId,
          amount: parseFloat(commissionAmount),
          periode: commissionNote
        })
      })
      const data = await res.json()
      if (data.success) {
        alert("Commission ajoutée avec succès !")
        setCommissionModal({ isOpen: false, affiliateId: '', affiliateName: '' })
        setCommissionAmount('')
        loadData() // Recharge les KPIs et Affiliés
      } else {
        alert("Erreur: " + data.error)
      }
    } catch (err) {
      alert("Erreur réseau")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Add / Edit Casino
  const handleAddCasino = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCasino.name || !newCasino.slug || !newCasino.lien_affilie) {
      alert("Veuillez remplir les champs obligatoires (Nom, Slug, Lien)")
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
        commission_conditions: newCasino.commission_conditions,
        minimum_depot: newCasino.minimum_depot,
        ordre_classement: Number(newCasino.ordre_classement),
        visible_affiliate: newCasino.visible_affiliate
      }

      if (casinoModal.editingId) {
        const res = await supabase.from('casinos').update(casinoData).eq('id', casinoModal.editingId)
        error = res.error
      } else {
        const res = await supabase.from('casinos').insert([{ ...casinoData, is_active: true }])
        error = res.error
      }

      if (error) {
        if (error.code === '42703' || error.code === 'PGRST204' || (error.message && error.message.includes('visible_affiliate'))) {
          // Column visible_affiliate might not exist in SQL DB yet, fallback without it so update succeeds
          const { visible_affiliate, ...fallbackData } = casinoData
          let fallbackRes;
          if (casinoModal.editingId) {
            fallbackRes = await supabase.from('casinos').update(fallbackData).eq('id', casinoModal.editingId)
          } else {
            fallbackRes = await supabase.from('casinos').insert([{ ...fallbackData, is_active: true }])
          }

          if (fallbackRes.error) {
            alert("Erreur : " + fallbackRes.error.message)
          } else {
            alert(`Casino ${casinoModal.editingId ? 'modifié' : 'ajouté'} avec succès ! La modification du classement est en ligne.`)
          }
        } else {
          alert("Erreur : " + error.message)
        }
      } else {
        alert(`Casino ${casinoModal.editingId ? 'modifié' : 'ajouté'} avec succès ! La modification du classement est en ligne.`)
      }

      // Persist visible_affiliate in localStorage fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(`casino_vis_aff_${newCasino.slug}`, String(newCasino.visible_affiliate))
        if (casinoModal.editingId) {
          localStorage.setItem(`casino_vis_aff_${casinoModal.editingId}`, String(newCasino.visible_affiliate))
        }
      }

      setCasinoModal({isOpen: false, editingId: null})
      setNewCasino({ name: '', slug: '', lien_affilie: '', logo_url: '', bonus_depot: '100% jusqu\'à 500€', bonus_sans_depot: 'Aucun', licence: 'Curaçao', remboursement_depot: false, commission_conditions: 'Nouveau inscrit seulement', minimum_depot: '20€', ordre_classement: 1, visible_affiliate: true })
      loadData()
    } catch (err) {
      alert("Erreur réseau")
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
      logo_url: casino.logo_url || casino.logoUrl || '',
      bonus_depot: casino.bonus_depot || '',
      bonus_sans_depot: casino.bonus_sans_depot || '',
      licence: casino.licence || '',
      remboursement_depot: casino.remboursement_depot || false,
      commission_conditions: casino.commission_conditions || '',
      minimum_depot: casino.minimum_depot || '',
      ordre_classement: casino.ordre_classement || 1,
      visible_affiliate: casino.visible_affiliate !== false
    })
    setCasinoModal({isOpen: true, editingId: casino.id})
  }

  // Load saved partners from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('french_casino_partners')
    if (saved) {
      try {
        setPartners(JSON.parse(saved))
      } catch(e) {}
    }
  }, [])

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPartner.name || !newPartner.dashboard_url) {
      alert("Veuillez renseigner au moins le nom et le lien du dashboard.")
      return
    }

    let updated: any[]
    if (partnerModal.editingId) {
      updated = partners.map(p => p.id === partnerModal.editingId ? { ...newPartner, id: p.id } : p)
    } else {
      updated = [...partners, { ...newPartner, id: 'partner_' + Date.now() }]
    }

    setPartners(updated)
    localStorage.setItem('french_casino_partners', JSON.stringify(updated))
    setPartnerModal({ isOpen: false, editingId: null })
  }

  const handleDeletePartner = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce partenaire ?")) {
      const updated = partners.filter(p => p.id !== id)
      setPartners(updated)
      localStorage.setItem('french_casino_partners', JSON.stringify(updated))
    }
  }

  const toggleCasinoInPartner = (casinoName: string) => {
    setNewPartner(prev => {
      const exists = prev.casinos_relies.includes(casinoName)
      return {
        ...prev,
        casinos_relies: exists 
          ? prev.casinos_relies.filter(c => c !== casinoName)
          : [...prev.casinos_relies, casinoName]
      }
    })
  }

  const openCreatePartnerModal = () => {
    setNewPartner({
      name: '',
      dashboard_url: '',
      cpa_commission: '',
      rs_commission: '',
      casinos_relies: []
    })
    setPartnerModal({ isOpen: true, editingId: null })
  }

  const openEditPartnerModal = (partner: any) => {
    setNewPartner({
      name: partner.name || '',
      dashboard_url: partner.dashboard_url || '',
      cpa_commission: partner.cpa_commission || '',
      rs_commission: partner.rs_commission || '',
      casinos_relies: partner.casinos_relies || []
    })
    setPartnerModal({ isOpen: true, editingId: partner.id })
  }

  const handleToggleCasinoActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('casinos').update({ is_active: !currentStatus }).eq('id', id)
    if (!error) {
      setCasinos(casinos.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c))
    } else {
      alert("Erreur lors de la modification du statut du casino")
    }
  }

  const handleUpdatePayoutStatus = async (payoutId: string, affiliateEmail: string, affiliateName: string, amount: number, newStatus: string) => {
    if (!confirm(`Confirmez-vous le passage au statut '${newStatus}' pour ce virement de ${amount}€ ?`)) return

    const { error } = await supabase.from('payout_requests').update({ 
      statut: newStatus,
      processed_at: new Date().toISOString()
    }).eq('id', payoutId)

    if (!error) {
      setPayouts(payouts.map(p => p.id === payoutId ? { ...p, statut: newStatus } : p))
      
      // Trigger notification email via notre route API
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'payout',
            email: affiliateEmail,
            name: affiliateName,
            amount: amount,
            status: newStatus
          })
        })
      } catch (err) {
        console.error("Email API Error:", err)
      }
    } else {
      alert("Erreur lors de la mise à jour du paiement")
    }
  }

  // Actions Support Tickets
  const handleUpdateTicketStatus = async (id: string, newStatus: string) => {
    const oldTicket = tickets.find(t => t.id === id)
    const oldStatus = oldTicket?.statut

    const { error } = await supabase.from('support_tickets').update({ statut: newStatus }).eq('id', id)
    if (!error) {
      setTickets(tickets.map(t => t.id === id ? { ...t, statut: newStatus } : t))
      setKpi(prev => ({
        ...prev,
        openTickets: prev.openTickets + (newStatus === 'open' ? 1 : 0) - (oldStatus === 'open' ? 1 : 0)
      }))
    } else {
      alert("Erreur lors de la mise à jour du ticket")
    }
  }

  const openChatModal = async (ticket: any) => {
    setChatModal({ isOpen: true, ticketId: ticket.id, ticketSubject: ticket.sujet, affiliateName: ticket.affiliates?.profiles?.full_name || 'Inconnu' })
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
    if (!newChatMessage.trim() || !adminId) return
    setIsSendingMessage(true)
    
    const { error } = await supabase.from('ticket_messages').insert([{
      ticket_id: chatModal.ticketId,
      sender_id: adminId,
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
      
      if (tickets.find(t => t.id === chatModal.ticketId)?.statut === 'open') {
        handleUpdateTicketStatus(chatModal.ticketId, 'answered')
      }
    } else {
      alert("Erreur lors de l'envoi du message")
    }
    
    setIsSendingMessage(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-950/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Panneau de Contrôle Administrateur Supabase</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Administration FrenchCasino V2
          </h1>
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors">
          <Activity className="w-4 h-4" />
          Rafraîchir les données
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Menu Latéral Admin (Sidebar) */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2 lg:sticky lg:top-24">
          {[
            { id: 'kpi', label: 'KPIs Globaux', icon: Activity },
            { id: 'affiliates', label: 'Gestion Affiliés', icon: Users },
            { id: 'casinos', label: 'Gestion Casinos', icon: Plus },
            { id: 'partners', label: 'Mes Partenaires', icon: Building },
            { id: 'payouts', label: 'Paiements & Exports', icon: CreditCard },
            { id: 'support', label: 'Tickets Support', icon: Clock },
            { id: 'telegram', label: 'Diffusion Telegram', icon: Send },
            { id: 'logs', label: 'Logs & Alertes', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon
            const active = adminTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 w-full text-left relative ${
                  active
                    ? 'bg-red-600 text-white shadow-lg'
                    : tab.id === 'support' && kpi.openTickets > 0
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/50'
                      : 'text-slate-400 hover:text-white hover:bg-surface-card border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'support' && kpi.openTickets > 0 && (
                  <span className="absolute right-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="flex-1 w-full min-w-0">

          {/* TELEGRAM BROADCAST TAB */}
          {adminTab === 'telegram' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-surface-border bg-surface relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                  <Send className="w-5 h-5 text-blue-400" />
                  Diffuser un message (Telegram)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 relative z-10">
                  <button 
                    onClick={() => setTelegramMessage("🎰 <b>Nouvelle Promo Commission !</b>\n\nChers affiliés, nous venons de booster les commissions sur [Nom du Casino].\n\nProfitez-en pour envoyer du trafic dès maintenant !\n\nL'équipe FrenchCasino")}
                    className="p-4 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-xl mb-2 block">🎰</span>
                    <h3 className="font-bold text-white text-sm mb-1">Nouvelle Promo</h3>
                    <p className="text-[10px] text-slate-400">Hausse de commission CPA/RS</p>
                  </button>

                  <button 
                    onClick={() => setTelegramMessage("🆕 <b>Nouveau Casino Intégré !</b>\n\nBonne nouvelle, [Nom du Casino] est maintenant disponible sur votre tableau de bord.\n\nRécupérez vite votre lien et commencez l'acquisition !\n\nL'équipe FrenchCasino")}
                    className="p-4 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-xl mb-2 block">🆕</span>
                    <h3 className="font-bold text-white text-sm mb-1">Nouveau Casino</h3>
                    <p className="text-[10px] text-slate-400">Annonce d'une nouvelle marque</p>
                  </button>

                  <button 
                    onClick={() => setTelegramMessage("🔥 <b>Boostez vos troupes !</b>\n\nLe mois se termine bientôt ! Continuez vos efforts pour atteindre les paliers VIP et débloquer vos primes bonus.\n\nBon courage à tous ! 💪")}
                    className="p-4 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-xl mb-2 block">🔥</span>
                    <h3 className="font-bold text-white text-sm mb-1">Booster les troupes</h3>
                    <p className="text-[10px] text-slate-400">Message de motivation fin de mois</p>
                  </button>

                  <button 
                    onClick={() => setTelegramMessage("💰 <b>Rappel : Demandes de Paiement</b>\n\nN'oubliez pas, les demandes de paiement pour ce mois-ci se terminent le [Date].\n\nRendez-vous sur votre tableau de bord pour valider votre facture.\n\nL'équipe FrenchCasino")}
                    className="p-4 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-xl mb-2 block">💰</span>
                    <h3 className="font-bold text-white text-sm mb-1">Rappel Paiement</h3>
                    <p className="text-[10px] text-slate-400">Facturation & encaissements</p>
                  </button>

                  <button 
                    onClick={() => setTelegramMessage("🏆 <b>Félicitations aux meilleurs !</b>\n\nBravo à notre top 3 de la semaine pour leurs performances exceptionnelles. Vos commissions viennent d'être validées !\n\nÀ qui le tour ? 😉")}
                    className="p-4 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-xl mb-2 block">🏆</span>
                    <h3 className="font-bold text-white text-sm mb-1">Félicitations</h3>
                    <p className="text-[10px] text-slate-400">Récompenser les Tops Affiliés</p>
                  </button>
                  
                  <button 
                    onClick={() => setTelegramMessage("🚨 <b>Qualité du Trafic</b>\n\nPetit rappel important : tout trafic frauduleux ou non conforme sera pénalisé.\n\nNous surveillons de près la qualité des joueurs envoyés, merci de respecter nos conditions !\n\nL'équipe FrenchCasino")}
                    className="p-4 bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-xl mb-2 block">🚨</span>
                    <h3 className="font-bold text-white text-sm mb-1">Qualité & Règles</h3>
                    <p className="text-[10px] text-slate-400">Alerte Fraude ou KPI</p>
                  </button>
                </div>

                <form onSubmit={handleSendTelegramBroadcast} className="relative z-10">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-300">Message (Supporte le HTML Telegram &lt;b&gt;, &lt;i&gt;, &lt;a href=""&gt;)</label>
                      <div className="flex gap-1">
                        {['🎰', '🔥', '💰', '🏆', '🚨', '🆕', '💸', '💎', '🚀', '🎁', '📈', '✅', '⚠️', '🎉', '🤑'].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setTelegramMessage(prev => prev + emoji)}
                            className="w-6 h-6 flex items-center justify-center text-sm bg-slate-800 hover:bg-slate-700 hover:text-xl rounded transition-all"
                            title="Ajouter l'émoji"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea 
                      value={telegramMessage}
                      onChange={(e) => setTelegramMessage(e.target.value)}
                      className="w-full h-48 bg-[#0a0a0f] border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y font-mono text-sm"
                      placeholder="Saisissez votre message ici..."
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSendingTelegram || !telegramMessage.trim()}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingTelegram ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Envoyer à tous les affiliés (Canal)</>}
                  </button>
                </form>
              </div>
            </div>
          )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-red-500" />
        </div>
      ) : (
        <>
          {/* 1. KPIS GLOBAUX */}
          {adminTab === 'kpi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <span className="text-slate-400 text-xs block relative z-10">Affiliés Actifs</span>
                <span className="text-3xl font-bold font-mono text-white relative z-10">{kpi.activeAffiliates}</span>
                <span className="text-[11px] text-emerald block relative z-10">
                  {kpi.pendingAffiliates > 0 ? `+${kpi.pendingAffiliates} en attente de validation` : 'Tous validés'}
                </span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <DollarSign className="w-12 h-12 text-gold" />
                </div>
                <span className="text-slate-400 text-xs block relative z-10">Gains Distribués / Dus</span>
                <span className="text-3xl font-bold font-mono text-gold relative z-10">{kpi.totalCommissions.toLocaleString()} €</span>
                <span className="text-[11px] text-gold block relative z-10">Global historique</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-red-900/50 bg-red-950/10 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CreditCard className="w-12 h-12 text-red-400" />
                </div>
                <span className="text-slate-400 text-xs block relative z-10">Payouts en Attente</span>
                <span className="text-3xl font-bold font-mono text-red-400 relative z-10">{kpi.pendingPayouts}</span>
                <span className="text-[11px] text-red-400 block relative z-10">Montant total : {kpi.pendingPayoutsAmount.toLocaleString()} €</span>
              </div>
            </div>
          )}

          {/* 2. GESTION DES AFFILIÉS */}
          {adminTab === 'affiliates' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Gestion des Inscriptions & Taux Commission</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-surface/50 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Affilié & Email</th>
                      <th className="p-4">Contacts</th>
                      <th className="p-4">Recruteur Assigné</th>
                      <th className="p-4">Code / Lien</th>
                      <th className="p-4 text-center">Taux CPA</th>
                      <th className="p-4 text-right">Gains Totaux</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4">Actions Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {affiliates.length === 0 ? (
                      <tr><td colSpan={6} className="p-4 text-center text-slate-500 font-mono">Aucun affilié trouvé.</td></tr>
                    ) : affiliates.map((aff) => (
                      <tr key={aff.id} className="hover:bg-surface/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{aff.profiles?.full_name || 'Sans Nom'} <span className="text-[10px] bg-slate-800 px-1 rounded ml-1">{aff.profiles?.role}</span></div>
                          <div className="font-mono text-[10px] text-slate-400">{aff.profiles?.email || 'N/A'}</div>
                          {aff.profiles?.role !== 'recruiter' && (
                             <button onClick={() => handleUpdateRole(aff.id, 'recruiter')} className="text-[9px] text-gold hover:underline mt-1 block">Passer Recruteur</button>
                          )}
                          {aff.profiles?.role === 'recruiter' && (
                             <button onClick={() => handleUpdateRole(aff.id, 'affiliate')} className="text-[9px] text-slate-400 hover:underline mt-1 block">Retirer Recruteur</button>
                          )}
                        </td>
                        <td className="p-4 text-[10px] text-slate-400">
                          {aff.contact_telegram && <div className="text-blue-400">TG: {aff.contact_telegram}</div>}
                          {aff.contact_whatsapp && <div className="text-green-400">WA: {aff.contact_whatsapp}</div>}
                          {aff.contact_phone && <div>Tel: {aff.contact_phone}</div>}
                        </td>
                        <td className="p-4">
                          <select 
                            value={aff.recruiter_id || ''}
                            onChange={(e) => handleAssignRecruiter(aff.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-[11px] rounded px-2 py-1 text-slate-300 max-w-[120px]"
                          >
                            <option value="">Aucun</option>
                            {recruiters.map(r => (
                              <option key={r.id} value={r.id}>{r.full_name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-300 font-mono text-[11px] rounded border border-purple-800/50">
                            {aff.referral_code}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleUpdateCommissionRate(aff.id, aff.commission_rate)}
                            className="font-mono font-bold text-emerald hover:text-emerald-300 hover:underline cursor-pointer px-2 py-1 rounded bg-emerald/10 border border-emerald/20 transition-all"
                            title="Modifier le taux"
                          >
                            {(aff.commission_rate * 100).toFixed(0)}%
                          </button>
                        </td>
                        <td className="p-4 font-mono text-gold font-bold text-right">{(Number(aff.total_earned) || 0).toLocaleString()} €</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            aff.status === 'active' ? 'bg-emerald/20 text-emerald border border-emerald/30' : 
                            aff.status === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 
                            'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}>
                            {aff.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {aff.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateAffiliateStatus(aff.id, 'active')}
                                className="p-1.5 rounded-lg bg-emerald/20 text-emerald hover:bg-emerald/30 text-[11px] px-3 font-bold transition-colors border border-emerald/30"
                              >
                                Valider
                              </button>
                            )}
                            {aff.status === 'active' && (
                              <button
                                onClick={() => setCommissionModal({ isOpen: true, affiliateId: aff.id, affiliateName: aff.profiles?.full_name || 'Inconnu' })}
                                className="p-1.5 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 text-[11px] px-3 font-bold transition-colors border border-gold/30 flex items-center gap-1"
                              >
                                <DollarSign className="w-3 h-3" /> Commission
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateAffiliateStatus(aff.id, aff.status === 'suspended' ? 'active' : 'suspended')}
                              className="p-1.5 rounded-lg bg-red-950/50 text-red-400 hover:bg-red-900 text-[11px] px-3 font-bold transition-colors border border-red-900/50"
                            >
                              {aff.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
                            </button>
                          </div>
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
                <button 
                  onClick={() => {
                    setNewCasino({ name: '', slug: '', lien_affilie: '', bonus_depot: '100% jusqu\'à 500€', bonus_sans_depot: 'Aucun', licence: 'Curaçao', remboursement_depot: false, commission_conditions: 'Nouveau inscrit seulement', minimum_depot: '20€', ordre_classement: 1 })
                    setCasinoModal({isOpen: true, editingId: null})
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-primary-hover shadow-purple-glow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Casino</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {casinos.length === 0 ? (
                  <p className="text-slate-400 font-mono text-sm p-4">Aucun casino trouvé dans la base.</p>
                ) : casinos.map((casino) => (
                  <div key={casino.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base flex items-center gap-2">
                          {casino.name}
                          {!casino.is_active && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-500">Inactif</span>}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">{casino.slug}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-gold bg-gold/10 border border-gold/30 px-2 py-1 rounded shadow-sm">
                        Rang Top Casino: #{casino.ordre_classement || 1}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 text-[11px]">
                      <p className="text-slate-300"><span className="text-slate-500">Licence:</span> {casino.licence}</p>
                      <p className="text-emerald font-semibold"><span className="text-slate-500 font-normal">Sans dépôt:</span> {casino.bonus_sans_depot}</p>
                      <p className="text-purple-300 font-semibold"><span className="text-slate-500 font-normal">Commission:</span> {casino.bonus_depot}</p>
                      <p className="text-blue-300 font-semibold"><span className="text-slate-500 font-normal">Min. Dépôt:</span> {casino.minimum_depot || 'Non défini'}</p>
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleAffiliateVisibility(casino)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer hover:brightness-125 ${casino.visible_affiliate !== false ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-red-950/40 text-red-400 border border-red-900/50'}`}
                          title="Cliquer pour masquer ou afficher ce casino aux affiliés"
                        >
                          {casino.visible_affiliate !== false ? '✓ Visible Espace Affilié (Cliquer pour masquer)' : '✕ Masqué Espace Affilié (Cliquer pour afficher)'}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-800/60 mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditCasinoModal(casino)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit className="w-3 h-3" /> Éditer
                      </button>
                      <button 
                        onClick={() => handleToggleCasinoActive(casino.id, casino.is_active)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/50 text-xs font-semibold text-red-400 hover:bg-red-900 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> {casino.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3.5. GESTION DES PARTENAIRES */}
          {adminTab === 'partners' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-5 rounded-xl border border-slate-800">
                <div>
                  <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-gold" />
                    <span>Plateformes Partenaires & Réseaux (Affiliate Networks)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Gérez vos comptes partenaires externes, accédez rapidement à leurs dashboards (ouverture dans un nouvel onglet), configurez vos taux CPA & RS et attribuez les casinos reliés du Top Casino.
                  </p>
                </div>
                <button 
                  onClick={openCreatePartnerModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-gold text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-gold-glow shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Partenaire</span>
                </button>
              </div>

              <div className="space-y-4">
                {partners.length === 0 ? (
                  <div className="p-8 glass-panel rounded-xl text-center text-slate-400 space-y-2">
                    <Building className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold">Aucun partenaire configuré pour le moment.</p>
                    <p className="text-xs text-slate-500">Cliquez sur "Ajouter un Partenaire" pour créer votre premier compte d'affiliation.</p>
                  </div>
                ) : partners.map((partner) => (
                  <div 
                    key={partner.id} 
                    className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-gold/40 transition-all shadow-lg grid grid-cols-1 xl:grid-cols-12 items-center gap-4 overflow-hidden group"
                  >
                    {/* Colonne 1 : Nom du Partenaire & Statut (xl:col-span-3) */}
                    <div className="xl:col-span-3 flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/50 text-gold shrink-0 group-hover:scale-105 transition-transform">
                        <Building className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-sm sm:text-base leading-tight truncate group-hover:text-gold transition-colors">
                          {partner.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Actif
                          </span>
                          <span className="text-slate-600 text-xs shrink-0">•</span>
                          <a 
                            href={partner.dashboard_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition-colors truncate"
                          >
                            <span>Dashboard</span>
                            <ExternalLink className="w-3 h-3 text-gold shrink-0" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Colonne 2 : Badges Commissions CPA & RS (xl:col-span-3) */}
                    <div className="xl:col-span-3 flex items-center gap-2">
                      <div className="flex-1 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-left min-w-0">
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
                          CPA
                        </span>
                        <p className="text-xs font-mono font-bold text-emerald-400 truncate">{partner.cpa_commission || 'Non défini'}</p>
                      </div>

                      <div className="flex-1 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-left min-w-0">
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                          <Percent className="w-3 h-3 text-gold shrink-0" />
                          RS
                        </span>
                        <p className="text-xs font-mono font-bold text-gold truncate">{partner.rs_commission || 'Non défini'}</p>
                      </div>
                    </div>

                    {/* Colonne 3 : Casinos Reliés (xl:col-span-3) */}
                    <div className="xl:col-span-3 min-w-0 pr-2">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Handshake className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          Casinos Reliés
                        </span>
                        <span className="font-mono text-gold text-[10px] bg-gold/10 px-1.5 py-0.5 rounded-full">({partner.casinos_relies?.length || 0})</span>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-14 overflow-y-auto pr-1">
                        {partner.casinos_relies && partner.casinos_relies.length > 0 ? (
                          partner.casinos_relies.map((cName: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[10px] font-medium text-slate-200 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                              {cName}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Aucun casino coché</span>
                        )}
                      </div>
                    </div>

                    {/* Colonne 4 : Actions (xl:col-span-3) — Alignée à Droite */}
                    <div className="xl:col-span-3 flex items-center justify-end gap-2 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-800/80 shrink-0">
                      <button 
                        onClick={() => openEditPartnerModal(partner)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Edit className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Éditer</span>
                      </button>

                      <button 
                        onClick={() => handleDeletePartner(partner.id)}
                        className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-xs font-semibold text-red-400 hover:text-white flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Supprimer</span>
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
                <h3 className="font-display font-bold text-lg text-white">Demandes de Retrait & Paiements</h3>
                <button className="px-3 py-1.5 rounded-lg bg-surface border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 hover:text-white transition-colors">
                  <Download className="w-4 h-4 text-gold" />
                  <span>Export CSV Comptabilité</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-surface/50 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Date Demande</th>
                      <th className="p-4">Affilié</th>
                      <th className="p-4 text-right">Montant</th>
                      <th className="p-4">Coordonnées (IBAN)</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4">Action Sécurisée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {payouts.length === 0 ? (
                      <tr><td colSpan={6} className="p-4 text-center text-slate-500 font-mono">Aucune demande de paiement.</td></tr>
                    ) : payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-surface/30 transition-colors">
                        <td className="p-4 font-mono text-slate-400">
                          {new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{p.affiliates?.profiles?.full_name || 'Inconnu'}</div>
                          <div className="font-mono text-[10px] text-slate-500">{p.affiliates?.profiles?.email}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-gold text-right text-sm">
                          {(Number(p.montant_demande) || 0).toLocaleString()} €
                        </td>
                        <td className="p-4">
                          {p.affiliates?.iban ? (
                            <span className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                              {p.affiliates.iban}
                            </span>
                          ) : (
                            <span className="text-red-400 text-[10px] italic">Non renseigné</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            p.statut === 'paid' ? 'bg-emerald/20 text-emerald border border-emerald/30' : 
                            p.statut === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 
                            'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}>
                            {p.statut}
                          </span>
                        </td>
                        <td className="p-4">
                          {p.statut === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdatePayoutStatus(p.id, p.affiliates?.profiles?.email, p.affiliates?.profiles?.full_name, p.montant_demande, 'paid')}
                                className="px-3 py-1.5 rounded bg-emerald/90 hover:bg-emerald text-white font-bold text-[11px] transition-colors shadow-lg shadow-emerald/20"
                              >
                                Marquer Payé (Envoie Email)
                              </button>
                              <button
                                onClick={() => handleUpdatePayoutStatus(p.id, p.affiliates?.profiles?.email, p.affiliates?.profiles?.full_name, p.montant_demande, 'rejected')}
                                className="px-3 py-1.5 rounded bg-red-900/80 hover:bg-red-900 text-white font-bold text-[11px] transition-colors"
                              >
                                Refuser
                              </button>
                            </div>
                          )}
                          {p.statut === 'paid' && p.processed_at && (
                            <span className="text-[10px] text-emerald font-mono">Traité le {new Date(p.processed_at).toLocaleDateString('fr-FR')}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Tchat & Support */}
          {adminTab === 'support' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Tickets Support des Affiliés</h3>
              
              <div className="overflow-x-auto rounded-xl border border-slate-800/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-surface/50 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Affilié</th>
                      <th className="p-4">Sujet du ticket</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4">Actions Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tickets.length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-center text-slate-500 font-mono">Aucun ticket.</td></tr>
                    ) : tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-surface/30 transition-colors">
                        <td className="p-4 font-mono text-slate-400">
                          {new Date(t.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{t.affiliates?.profiles?.full_name || 'Inconnu'}</div>
                          <div className="font-mono text-[10px] text-slate-500">{t.affiliates?.profiles?.email}</div>
                        </td>
                        <td className="p-4 font-bold text-white max-w-xs truncate" title={t.sujet}>
                          {t.sujet}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            t.statut === 'answered' ? 'bg-emerald/20 text-emerald border border-emerald/30' : 
                            t.statut === 'closed' ? 'bg-slate-800 text-slate-400 border border-slate-700' : 
                            'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}>
                            {t.statut === 'open' ? 'Nouveau' : t.statut === 'answered' ? 'Répondu' : 'Fermé'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openChatModal(t)}
                              className="px-3 py-1.5 rounded bg-blue-600/90 hover:bg-blue-600 text-white font-bold text-[11px] transition-colors flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" /> Ouvrir Tchat
                            </button>
                            {t.statut !== 'closed' && (
                              <button
                                onClick={() => handleUpdateTicketStatus(t.id, 'closed')}
                                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors"
                              >
                                Fermer
                              </button>
                            )}
                            {t.statut === 'closed' && (
                              <button
                                onClick={() => handleUpdateTicketStatus(t.id, 'open')}
                                className="px-3 py-1.5 rounded bg-red-900/80 hover:bg-red-900 text-white font-bold text-[11px] transition-colors"
                              >
                                Rouvrir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. LOGS D'ACTIVITÉ */}
          {adminTab === 'logs' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center py-20 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-red-900 mb-2" />
              <h3 className="font-display font-bold text-xl text-white">Audit Logs d&apos;Administration</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Historique des actions critiques (changements de RIB, validations de paiements, suspensions) avec archivage sécurisé. Module en cours d&apos;activation.
              </p>
            </div>
          )}

        </>
      )}
        </div>
      </div>

      {/* Commission Modal */}
      {commissionModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setCommissionModal({ ...commissionModal, isOpen: false })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2 font-display flex items-center gap-2">
              <DollarSign className="text-gold w-6 h-6" /> Ajouter Commission
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Créditez manuellement le solde de l&apos;affilié <strong className="text-white">{commissionModal.affiliateName}</strong> suite à un dépôt vérifié.
            </p>
            
            <form onSubmit={handleAddCommission} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant de la Commission (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={commissionAmount}
                  onChange={e => setCommissionAmount(e.target.value)}
                  placeholder="Ex: 50.00"
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Note / Référence du Dépôt</label>
                <input
                  type="text"
                  required
                  value={commissionNote}
                  onChange={e => setCommissionNote(e.target.value)}
                  placeholder="Ex: Dépôt 100€ Joueur X (Cresus)"
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créditer l\'Affilié'}
              </button>
            </form>
          </div>
        </div>
      )}

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Montant de la Commission</label>
                  <input
                    type="text"
                    value={newCasino.bonus_depot}
                    onChange={e => setNewCasino({ ...newCasino, bonus_depot: e.target.value })}
                    placeholder="Ex: 50€ CPA"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Bonus Sans Dépôt</label>
                  <input
                    type="text"
                    value={newCasino.bonus_sans_depot}
                    onChange={e => setNewCasino({ ...newCasino, bonus_sans_depot: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Conditions de Commission</label>
                  <input
                    type="text"
                    value={newCasino.commission_conditions}
                    onChange={e => setNewCasino({ ...newCasino, commission_conditions: e.target.value })}
                    placeholder="Ex: Par dépôt nouveau inscrit"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
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

      {/* Chat Modal */}
      {chatModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-0 rounded-2xl max-w-2xl w-full shadow-2xl relative flex flex-col h-[80vh] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-surface/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="text-blue-500 w-5 h-5" /> Ticket: {chatModal.ticketSubject}
                </h3>
                <p className="text-xs text-slate-400">Affilié: <strong className="text-slate-200">{chatModal.affiliateName}</strong></p>
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
                  const isAdmin = msg.sender_id === adminId
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        isAdmin 
                          ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-br-sm' 
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm'
                      }`}>
                        <div className="text-[10px] opacity-50 font-bold mb-1 flex justify-between gap-4">
                          <span>{isAdmin ? 'Vous (Admin)' : chatModal.affiliateName}</span>
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
                  className="flex-1 bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSendingMessage}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter / Modifier Partenaire */}
      {partnerModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="text-gold w-5 h-5" />
                {partnerModal.editingId ? 'Modifier le Partenaire' : 'Ajouter un Nouveau Partenaire'}
              </h3>
              <button 
                onClick={() => setPartnerModal({ isOpen: false, editingId: null })}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nom de la Plateforme / Partenaire *</label>
                <input
                  type="text"
                  required
                  value={newPartner.name}
                  onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="Ex: NetPartners, DriveAffiliates..."
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Lien direct vers le Dashboard Partenaire *</label>
                <input
                  type="url"
                  required
                  value={newPartner.dashboard_url}
                  onChange={e => setNewPartner({ ...newPartner, dashboard_url: e.target.value })}
                  placeholder="https://partenaire-dashboard.com/login"
                  className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gold font-mono focus:outline-none focus:border-gold"
                />
                <p className="text-[10px] text-slate-500">Un clic sur "Dashboard" ouvrira automatiquement ce lien dans un nouvel onglet.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Commission CPA (ex: 120€ / CPA)</label>
                  <input
                    type="text"
                    value={newPartner.cpa_commission}
                    onChange={e => setNewPartner({ ...newPartner, cpa_commission: e.target.value })}
                    placeholder="Ex: 120€ CPA"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Commission RS (ex: 45% RS)</label>
                  <input
                    type="text"
                    value={newPartner.rs_commission}
                    onChange={e => setNewPartner({ ...newPartner, rs_commission: e.target.value })}
                    placeholder="Ex: 45% RS"
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gold font-mono focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Sélection des Casinos reliés (Checkboxes) */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Casinos Reliés (Cochez les casinos gérés par ce partenaire) :</span>
                  <span className="text-[10px] text-gold font-mono">{newPartner.casinos_relies.length} coché(s)</span>
                </label>

                <div className="bg-[#0a0a0f] border border-slate-800 p-3 rounded-xl max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(casinos.length > 0 ? casinos : CASINOS_MOCK).map((c: any) => {
                    const casinoName = c.name
                    const isChecked = newPartner.casinos_relies.includes(casinoName)
                    return (
                      <label 
                        key={c.id || c.slug}
                        onClick={() => toggleCasinoInPartner(casinoName)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                          isChecked 
                            ? 'bg-purple-950/60 border-purple-500/50 text-white font-semibold' 
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-gold shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{casinoName}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPartnerModal({ isOpen: false, editingId: null })}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-500 to-gold hover:brightness-110 shadow-gold-glow transition-all"
                >
                  {partnerModal.editingId ? 'Enregistrer les Modifications' : 'Créer le Partenaire'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
