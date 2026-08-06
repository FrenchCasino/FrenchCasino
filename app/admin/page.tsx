'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  ShieldAlert,
  ShieldCheck,
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
  Percent,
  Eye,
  EyeOff,
  Award,
  RefreshCw,
  TrendingUp,
  Power,
  Globe,
  BarChart3,
  Search
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CASINOS_MOCK } from '@/lib/data/casinos'
import { useConfirm } from '@/components/ui/ConfirmModal'
import AdminPartnersTab from '@/components/admin/AdminPartnersTab'
import AdminStatsTab from '@/components/admin/AdminStatsTab'
import AdminCasinosTab from '@/components/admin/AdminCasinosTab'
import AdminAffiliatesTab from '@/components/admin/AdminAffiliatesTab'
import AdminDepositsTab from '@/components/admin/AdminDepositsTab'

const AdminMessageEditor = ({ affiliate, onSave }: { affiliate: any, onSave: (id: string, msg: string) => Promise<void> }) => {
  const [msg, setMsg] = useState(affiliate.admin_message || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setMsg(affiliate.admin_message || '')
  }, [affiliate.id, affiliate.admin_message])

  const handleSave = async (empty = false) => {
    setIsSaving(true)
    const finalMsg = empty ? '' : msg
    await onSave(affiliate.id, finalMsg)
    if (empty) setMsg('')
    setIsSaving(false)
  }

  return (
    <section className="space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
        <MessageSquare className="w-3 h-3 text-purple-400" /> Bannière Affilié
      </h4>
      <div className="glass-panel rounded-xl p-4 space-y-3 border border-purple-900/30">
        <textarea 
          placeholder="Laisser un message d'alerte sur le tableau de bord de cet affilié..."
          className="w-full bg-slate-900/50 border border-slate-700 text-xs rounded-lg p-3 text-slate-300 min-h-[80px]"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex-1 py-2 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold text-[11px] hover:bg-purple-600/30 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Enregistrement...' : 'Publier le Message'}
          </button>
          {affiliate.admin_message && (
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 transition-colors border border-slate-700 disabled:opacity-50"
              title="Effacer le message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default function AdminDashboardPage() {
  const [adminTab, setAdminTab] = useState<'kpi' | 'stats' | 'site' | 'affiliates' | 'casinos' | 'partners' | 'payouts' | 'refunds' | 'support' | 'deposits' | 'telegram' | 'logs'>('kpi')
  const [siteAnalytics, setSiteAnalytics] = useState<any>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { confirm, ConfirmDialog } = useConfirm()
  const [refundRequests, setRefundRequests] = useState<any[]>([])


  // State
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [payouts, setPayouts] = useState<any[]>([])
  const [casinos, setCasinos] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [recruiters, setRecruiters] = useState<any[]>([])
  


  const [kpi, setKpi] = useState({
    activeAffiliates: 0,
    pendingAffiliates: 0,
    totalCommissions: 0,
    pendingPayouts: 0,
    pendingPayoutsAmount: 0,
    openTickets: 0,
  })



  // Casino Modal state
  const [casinoModal, setCasinoModal] = useState<{isOpen: boolean, editingId: string | null}>({isOpen: false, editingId: null})
  const [newCasino, setNewCasino] = useState<any>({
    name: '',
    slug: '',
    lien_affilie: '',
    logo_url: '',
    commission_cpa: '',
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
  
  // Refund Request Review Modal state
  const [activeRefundRequest, setActiveRefundRequest] = useState<any | null>(null)
  const [adminNoteInput, setAdminNoteInput] = useState('')
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null)
  const [isSubmittingAdminRefund, setIsSubmittingAdminRefund] = useState(false)
  const [viewedTabs, setViewedTabs] = useState<Record<string, boolean>>({})
  const [affClicksBreakdown, setAffClicksBreakdown] = useState<Record<string, Record<string, number>>>({})

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
        toast.success('Message envoyé au canal avec succès !')
        setTelegramMessage('')
      } else {
        toast.error("Erreur lors de l'envoi : " + data.error)
      }
    } catch (err) {
      toast.error('Erreur réseau')
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
  
      
      // Load all clicks count and detailed breakdown per affiliate via API to bypass RLS restrictions
      let allClicks = []
      try {
        const clicksRes = await fetch('/api/admin/clicks')
        if (clicksRes.ok) {
          allClicks = await clicksRes.json()
        } else {
          console.error('[ADMIN] Error fetching casino_clicks from API:', await clicksRes.text())
        }
      } catch (err) {
        console.error('[ADMIN] Network error fetching clicks:', err)
      }
      
      const clickCountsByAff: Record<string, number> = {}
      const clicksTodayByAff: Record<string, number> = {}
      const clicks7dByAff: Record<string, number> = {}
      const clicks30dByAff: Record<string, number> = {}
      const clicksMonthByAff: Record<string, number> = {}
      const breakdownByAff: Record<string, Record<string, number>> = {}

      if (allClicks && allClicks.length > 0) {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        
        const dayStart = new Date(now)
        dayStart.setHours(0,0,0,0)

        const day7 = new Date(now)
        day7.setDate(now.getDate() - 7)

        const day30 = new Date(now)
        day30.setDate(now.getDate() - 30)

        allClicks.forEach((c: any) => {
          if (c.affiliate_id) {
            clickCountsByAff[c.affiliate_id] = (clickCountsByAff[c.affiliate_id] || 0) + 1
            
            if (c.created_at) {
              const clickDate = new Date(c.created_at)
              if (clickDate >= dayStart) clicksTodayByAff[c.affiliate_id] = (clicksTodayByAff[c.affiliate_id] || 0) + 1
              if (clickDate >= day7) clicks7dByAff[c.affiliate_id] = (clicks7dByAff[c.affiliate_id] || 0) + 1
              if (clickDate >= day30) clicks30dByAff[c.affiliate_id] = (clicks30dByAff[c.affiliate_id] || 0) + 1
              if (clickDate.getMonth() === currentMonth && clickDate.getFullYear() === currentYear) {
                clicksMonthByAff[c.affiliate_id] = (clicksMonthByAff[c.affiliate_id] || 0) + 1
              }
            }
            
            const casinoKey = c.casino_slug || c.casino_id || 'général'
            if (!breakdownByAff[c.affiliate_id]) {
              breakdownByAff[c.affiliate_id] = {}
            }
            breakdownByAff[c.affiliate_id][casinoKey] = (breakdownByAff[c.affiliate_id][casinoKey] || 0) + 1
          }
        })
      }
      setAffClicksBreakdown(breakdownByAff)

      if (affErr) {
        console.error("Error loading affiliates:", affErr)
      }

      // Load Payouts with Affiliate Profile Info
      const { data: payData, error: payErr } = await supabase
        .from('payout_requests')
        .select(`
          *,
          affiliates (
            iban,
            profiles!affiliates_id_fkey (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (payErr) {
        console.error("Error loading payouts:", payErr)
      } else {
        setPayouts(payData || [])
      }

      if (!affErr) {
        const enrichedAffs = (affData || []).map((a: any) => {
          const affPayouts = (payData || []).filter(p => p.affiliate_id === a.id && p.statut !== 'rejected')
          const totalPaidOrPending = affPayouts.reduce((acc, curr) => acc + (Number(curr.montant_demande) || 0), 0)
          const solde_reel = Math.max(0, (Number(a.total_earned) || 0) - totalPaidOrPending)

          return {
            ...a,
            total_clicks: clickCountsByAff[a.id] || 0,
            clicks_today: clicksTodayByAff[a.id] || 0,
            clicks_7d: clicks7dByAff[a.id] || 0,
            clicks_30d: clicks30dByAff[a.id] || 0,
            clicks_month: clicksMonthByAff[a.id] || 0,
            solde_reel
          }
        })
        setAffiliates(enrichedAffs)
      }

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
            profiles!affiliates_id_fkey (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (tksErr) console.error("Error loading tickets:", tksErr)
      else setTickets(tksData || [])

      // Load Refund Requests
      const { data: refundData } = await supabase
        .from('refund_requests')
        .select(`
          *,
          affiliates (
            profiles!affiliates_id_fkey (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
      if (refundData) setRefundRequests(refundData)

      // Calculate KPIs
      const validAffData = affData || []
      const validPayData = payData || []
      const validTksData = tksData || []

      setKpi({
        activeAffiliates: validAffData.filter(a => a.status === 'active').length,
        pendingAffiliates: validAffData.filter(a => a.status === 'pending').length,
        totalCommissions: validAffData.reduce((acc, a) => acc + (Number(a.total_earned) || 0), 0),
        pendingPayouts: validPayData.filter(p => p.statut === 'pending').length,
        pendingPayoutsAmount: validPayData.filter(p => p.statut === 'pending').reduce((acc, p) => acc + (Number(p.montant_demande) || 0), 0),
        openTickets: validTksData.filter(t => t.statut === 'open').length,
      })

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const loadAnalytics = useCallback(async () => {
    setLoadingAnalytics(true)
    try {
      const res = await fetch('/api/admin/analytics')
      if (res.ok) {
        const data = await res.json()
        setSiteAnalytics(data)
      } else {
        console.error('Error loading analytics:', await res.text())
      }
    } catch (err) {
      console.error('Network error loading analytics:', err)
    } finally {
      setLoadingAnalytics(false)
    }
  }, [])

  useEffect(() => {
    if (adminTab === 'site') {
      loadAnalytics()
    }
  }, [adminTab, loadAnalytics])






  const hasPendingAction = (tabId: string) => {
    if (viewedTabs[tabId]) return false
    if (tabId === 'affiliates') return affiliates.some(a => a.status === 'pending')
    if (tabId === 'payouts') return payouts.some(p => p.statut === 'pending')
    if (tabId === 'refunds') return refundRequests.some(r => r.status === 'pending')
    if (tabId === 'support') return tickets.some(t => t.statut === 'open')
    return false
  }

  const handleApproveRefund = async (req: any) => {
    try {
      const { error } = await supabase
        .from('refund_requests')
        .update({ status: 'approved' })
        .eq('id', req.id)
      
      if (!error) {
        await supabase.from('notifications').insert({
          user_id: req.affiliate_id,
          title: 'Remboursement validé ! ✅',
          message: `Votre demande de remboursement de ${req.amount} € a été approuvée.`,
          type: 'refund'
        })
        
        setRefundRequests(refundRequests.map(r => r.id === req.id ? { ...r, status: 'approved' } : r))
        setActiveRefundRequest({ ...req, status: 'approved' })
        toast.success('Remboursement approuvé.')
      } else {
        toast.error("Erreur lors de l'approbation.")
      }
    } catch (err) {
      toast.error('Erreur réseau.')
    }
  }

  const handleRejectRefund = async (req: any) => {
    try {
      const { error } = await supabase
        .from('refund_requests')
        .update({ status: 'rejected', admin_note: adminNoteInput })
        .eq('id', req.id)
      
      if (!error) {
        await supabase.from('notifications').insert({
          user_id: req.affiliate_id,
          title: 'Remboursement refusé. ✕',
          message: `Votre demande de remboursement de ${req.amount} € a été refusée.${adminNoteInput ? ` Motif : ${adminNoteInput}` : ''}`,
          type: 'refund'
        })
        
        setRefundRequests(refundRequests.map(r => r.id === req.id ? { ...r, status: 'rejected', admin_note: adminNoteInput } : r))
        setActiveRefundRequest({ ...req, status: 'rejected', admin_note: adminNoteInput })
        setAdminNoteInput('')
        toast.error('Remboursement refusé.')
      } else {
        toast.error('Erreur lors du refus.')
      }
    } catch (err) {
      toast.error('Erreur réseau.')
    }
  }

  const handlePayRefund = async (req: any) => {
    if (!paymentProofFile) {
      toast.error('Veuillez sélectionner un fichier de preuve de paiement.')
      return
    }
    
    setIsSubmittingAdminRefund(true)
    try {
      const fileExt = paymentProofFile.name.split('.').pop()
      const fileName = `admin_payments/${req.id}/${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(fileName, paymentProofFile, { upsert: true })
      
      if (uploadError) {
        toast.error("Erreur lors de l'envoi de la preuve : " + uploadError.message)
        setIsSubmittingAdminRefund(false)
        return
      }
      
      const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(fileName)
      
      const { error } = await supabase
        .from('refund_requests')
        .update({ status: 'paid', payment_proof_url: publicUrl })
        .eq('id', req.id)
      
      if (!error) {
        await supabase.from('notifications').insert({
          user_id: req.affiliate_id,
          title: 'Remboursement payé ! 💸',
          message: `Votre remboursement de ${req.amount} € a été effectué. Preuve de paiement disponible dans votre suivi.`,
          type: 'refund'
        })
        
        setRefundRequests(refundRequests.map(r => r.id === req.id ? { ...r, status: 'paid', payment_proof_url: publicUrl } : r))
        setActiveRefundRequest({ ...req, status: 'paid', payment_proof_url: publicUrl })
        setPaymentProofFile(null)
        toast.success('Remboursement marqué comme payé !')
      } else {
        toast.error('Erreur lors de la mise à jour.')
      }
    } catch (err) {
      toast.error('Erreur réseau.')
    } finally {
      setIsSubmittingAdminRefund(false)
    }
  }



  const handleUpdatePayoutStatus = async (payoutId: string, affiliateEmail: string, affiliateName: string, amount: number, newStatus: string) => {
    const ok = await confirm({
      title: `Mettre à jour ce virement`,
      message: `Confirmez-vous le passage au statut '${newStatus}' pour ce virement de ${amount}€ ?`,
      confirmLabel: 'Confirmer',
      variant: newStatus === 'rejected' ? 'danger' : 'default',
    })
    if (!ok) return

    const { error } = await supabase.from('payout_requests').update({ 
      statut: newStatus,
      processed_at: new Date().toISOString()
    }).eq('id', payoutId)

    if (!error) {
      setPayouts(payouts.map(p => p.id === payoutId ? { ...p, statut: newStatus } : p))
      toast.success(`Virement marqué comme "${newStatus}".`)
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'payout', email: affiliateEmail, name: affiliateName, amount, status: newStatus })
        })
      } catch (err) { console.error('Email API Error:', err) }

      try {
        await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: newStatus === 'paid' ? 'payout_approved' : 'payout_rejected', 
            message: `Affilié : <b>${affiliateName}</b>\nMontant : <b>${amount} €</b>`
          })
        })
      } catch (err) {}
    } else {
      toast.error('Erreur lors de la mise à jour du paiement')
    }
  }

  // Export CSV functions for Admin
  const downloadCSVAdmin = (headers: string[], rows: any[][], filename: string) => {
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

  const handleExportPayouts = () => {
    if (payouts.length === 0) return toast.error("Aucune demande de paiement à exporter.");
    const headers = [
      "Date Demande",
      "Nom de l'affilié",
      "Email de l'affilié",
      "Montant (€)",
      "Titulaire de compte",
      "IBAN",
      "BIC",
      "Statut"
    ];
    const rows = payouts.map(p => [
      new Date(p.created_at).toLocaleDateString(),
      p.affiliates?.profiles?.full_name || 'Inconnu',
      p.affiliates?.profiles?.email || '',
      p.montant_demande,
      p.affiliates?.iban_holder || '',
      p.affiliates?.iban || '',
      p.affiliates?.bic || '',
      p.statut
    ]);
    downloadCSVAdmin(headers, rows, `comptabilite_retraits_frenchcasino_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportAffiliates = () => {
    if (affiliates.length === 0) return toast.error("Aucun affilié à exporter.");
    const headers = [
      "Nom",
      "Email",
      "Rôle",
      "Taux de commission",
      "Total accumulé (€)",
      "Statut",
      "IBAN Titulaire",
      "IBAN",
      "BIC"
    ];
    const rows = affiliates.map(aff => [
      aff.profiles?.full_name || 'Sans nom',
      aff.profiles?.email || '',
      aff.profiles?.role || 'affiliate',
      aff.commission_rate,
      aff.total_earned,
      aff.status,
      aff.iban_holder || '',
      aff.iban || '',
      aff.bic || ''
    ]);
    downloadCSVAdmin(headers, rows, `affilies_frenchcasino_${new Date().toISOString().split('T')[0]}.csv`);
  };

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
      toast.error('Erreur lors de la mise à jour du ticket')
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
      toast.error("Erreur lors de l'envoi du message")
    }
    
    setIsSendingMessage(false)
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <ConfirmDialog />
      
      {/* Header Admin */}
      <div className="relative glass-panel rounded-3xl border border-purple-500/30 bg-surface/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-surface to-gold/10 opacity-60" />
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-primary p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0 hidden sm:flex">
              <div className="w-full h-full bg-surface rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-gold" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                Panneau de Contrôle Administrateur
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Administration <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary">French</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">Casino</span>
              </h1>
            </div>
          </div>
          <button 
            onClick={loadData} 
            className="px-5 py-3 bg-surface border border-slate-700 hover:bg-slate-800 hover:border-purple-500/50 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Activity className="w-4 h-4 text-purple-400" />
            Rafraîchir les données
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Menu Latéral Admin (Sidebar) */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2 lg:sticky lg:top-24">
          {[
            { id: 'kpi', label: 'KPIs Globaux', icon: Activity },
            { id: 'site', label: 'Statistiques Site', icon: Globe },
            { id: 'stats', label: 'Clics Affiliés', icon: TrendingUp },
            { id: 'affiliates', label: 'Gestion Affiliés', icon: Users },
            { id: 'casinos', label: 'Gestion Casinos', icon: Plus },
            { id: 'partners', label: 'Mes Partenaires', icon: Building },
            { id: 'payouts', label: 'Paiements & Exports', icon: CreditCard },
            { id: 'deposits', label: 'Dépôts Déclarés', icon: DollarSign },
            { id: 'refunds', label: 'Remboursements', icon: RefreshCw },
            { id: 'logs', label: 'Logs & Alertes', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon
            const active = adminTab === tab.id
            const pending = hasPendingAction(tab.id)
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setAdminTab(tab.id as any)
                  setViewedTabs(prev => ({ ...prev, [tab.id]: true }))
                }}
                className={`px-5 py-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-3 w-full text-left relative ${
                  active
                    ? 'bg-gradient-to-r from-purple-600/90 to-primary/90 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-500/50 scale-[1.02]'
                    : pending
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/50 animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-surface-card border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {pending && (
                  <span className="absolute right-4 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="flex-1 w-full min-w-0">


      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-gold" />
        </div>
      ) : (
        <>
          {/* 1. KPIS GLOBAUX */}
          {adminTab === 'kpi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden bg-surface/40 hover:border-primary/50 transition-colors group">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Users className="w-32 h-32 text-white" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                  </div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Affiliés Actifs</span>
                </div>
                <span className="text-4xl font-display font-bold text-white relative z-10 block pt-2">{kpi.activeAffiliates}</span>
                <span className="text-xs text-emerald-400 font-medium block relative z-10">
                  {kpi.pendingAffiliates > 0 ? `+${kpi.pendingAffiliates} en attente` : 'Tous validés ✅'}
                </span>
              </div>

              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden bg-surface/40 hover:border-gold/50 transition-colors group">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-32 h-32 text-gold" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                  </div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Gains Distribués</span>
                </div>
                <span className="text-3xl font-display font-bold text-gold relative z-10 block pt-2">{kpi.totalCommissions.toLocaleString()} €</span>
                <span className="text-xs text-gold/70 font-medium block relative z-10">Global historique</span>
              </div>

              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-900/30 space-y-4 relative overflow-hidden bg-amber-950/10 hover:border-amber-500/50 transition-colors group">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-32 h-32 text-amber-500" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                  </div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Payouts en Attente</span>
                </div>
                <span className="text-4xl font-display font-bold text-amber-400 relative z-10 block pt-2">{kpi.pendingPayouts}</span>
                <span className="text-xs text-amber-500 font-medium block relative z-10">Total : {kpi.pendingPayoutsAmount.toLocaleString()} €</span>
              </div>

              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-900/30 space-y-4 relative overflow-hidden bg-purple-950/10 hover:border-purple-500/50 transition-colors group">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Activity className="w-32 h-32 text-purple-400" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                  </div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Clics Réseau</span>
                </div>
                <span className="text-4xl font-display font-bold text-purple-400 relative z-10 block pt-2">
                  {affiliates.reduce((acc, a) => acc + (a.total_clicks || 0), 0)}
                </span>
                <span className="text-xs text-purple-400/70 font-medium block relative z-10">Trafic global</span>
              </div>
            </div>
          )}

          {/* 1.1. STATISTIQUES GLOBALES DU SITE (AUDIENCE & SEO) */}
          {adminTab === 'site' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
                    <Globe className="w-6 h-6 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">
                      Audience, Provenance & SEO
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Suivi des visiteurs uniques, géolocalisation et SEO sur les 30 derniers jours.</p>
                  </div>
                </div>
                <button 
                  onClick={loadAnalytics} 
                  disabled={loadingAnalytics}
                  className="px-5 py-2.5 bg-surface border border-slate-700 hover:bg-slate-800 hover:border-purple-500/50 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                  {loadingAnalytics ? 'Chargement...' : 'Actualiser'}
                </button>
              </div>

              {loadingAnalytics && !siteAnalytics ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
                  <p className="text-sm text-slate-500 font-mono">Récupération des statistiques d'audience...</p>
                </div>
              ) : !siteAnalytics ? (
                <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-3">
                  <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-white">Aucune donnée disponible</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    La table <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-purple-300">page_views</code> n'est pas encore alimentée ou créée en base de données.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* KPI Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                      <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold block">Visiteurs Uniques (30j)</span>
                      <span className="text-3xl font-extrabold font-mono text-white mt-1 block">{siteAnalytics.summary.uniqueVisitors.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">Identifiants de navigation uniques</span>
                    </div>

                    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                      <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold block">Pages Vues (30j)</span>
                      <span className="text-3xl font-extrabold font-mono text-purple-300 mt-1 block">{siteAnalytics.summary.totalViews.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">Trafic brut accumulé</span>
                    </div>

                    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                      <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold block">Aujourd'hui</span>
                      <span className="text-2xl font-extrabold font-mono text-emerald mt-1 block">
                        {siteAnalytics.summary.viewsToday} <span className="text-xs text-slate-500 font-normal">vues</span> / {siteAnalytics.summary.visitorsToday} <span className="text-xs text-slate-500 font-normal">visiteurs</span>
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1.5">Activité temps réel des dernières 24h</span>
                    </div>

                    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                      <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold block">7 Derniers Jours</span>
                      <span className="text-2xl font-extrabold font-mono text-gold mt-1 block">
                        {siteAnalytics.summary.views7Days} <span className="text-xs text-slate-500 font-normal">vues</span> / {siteAnalytics.summary.visitors7Days} <span className="text-xs text-slate-500 font-normal">visiteurs</span>
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1.5">Tendance globale de la semaine</span>
                    </div>
                  </div>

                  {/* 2-Column Layout: Pages & Provenance */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Visited Pages */}
                    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        Pages les plus visitées
                      </h4>
                      <div className="space-y-3">
                        {siteAnalytics.topPages.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">Aucune page consultée enregistrée.</p>
                        ) : (
                          siteAnalytics.topPages.map((page: any, idx: number) => {
                            const percent = siteAnalytics.summary.totalViews > 0 
                              ? (page.count / siteAnalytics.summary.totalViews) * 100 
                              : 0
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-mono text-purple-300 truncate max-w-[280px]" title={page.path}>{page.path}</span>
                                  <span className="font-semibold text-white">{page.count} <span className="text-[10px] text-slate-500 font-normal">vues</span></span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    {/* Geolocation / Top Countries */}
                    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        Provenance Géographique (Top Pays)
                      </h4>
                      <div className="space-y-3">
                        {siteAnalytics.topCountries.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">Aucune géolocalisation enregistrée.</p>
                        ) : (
                          siteAnalytics.topCountries.map((item: any, idx: number) => {
                            const percent = siteAnalytics.summary.totalViews > 0 
                              ? (item.count / siteAnalytics.summary.totalViews) * 100 
                              : 0
                            const flagMap: Record<string, string> = {
                              'FR': '🇫🇷 France',
                              'BE': '🇧🇪 Belgique',
                              'CH': '🇨🇭 Suisse',
                              'CA': '🇨🇦 Canada',
                              'LU': '🇱🇺 Luxembourg',
                              'ES': '🇪🇸 Espagne',
                              'DE': '🇩🇪 Allemagne',
                              'GB': '🇬🇧 Royaume-Uni',
                              'US': '🇺🇸 États-Unis',
                              'IT': '🇮🇹 Italie'
                            }
                            const countryName = flagMap[item.country.toUpperCase()] || `🌐 ${item.country}`
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-300">{countryName}</span>
                                  <span className="font-mono text-white">{item.count} <span className="text-[10px] text-slate-500">({percent.toFixed(1)}%)</span></span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Layout: Sources & SEO Keywords */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Traffic Sources & Referrers */}
                    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald" />
                        Sources de Trafic (Referrers)
                      </h4>
                      <div className="space-y-3">
                        {siteAnalytics.topReferrers.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">Aucun referrer enregistré.</p>
                        ) : (
                          siteAnalytics.topReferrers.map((item: any, idx: number) => {
                            const percent = siteAnalytics.summary.totalViews > 0 
                              ? (item.count / siteAnalytics.summary.totalViews) * 100 
                              : 0
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-medium text-slate-300 truncate max-w-[280px]">{item.referrer}</span>
                                  <span className="font-mono text-emerald">{item.count} <span className="text-[10px] text-slate-500">({percent.toFixed(1)}%)</span></span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-emerald h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    {/* SEO Terms / UTM Campaigns */}
                    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Search className="w-4 h-4 text-gold" />
                        Mots-Clés Recherchés & Campagnes SEO
                      </h4>
                      <div className="space-y-3">
                        {siteAnalytics.topSeoTerms.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">Aucun mot-clé ou campagne UTM tracké sur les liens d'entrée.</p>
                        ) : (
                          siteAnalytics.topSeoTerms.map((item: any, idx: number) => {
                            const percent = siteAnalytics.summary.totalViews > 0 
                              ? (item.count / siteAnalytics.summary.totalViews) * 100 
                              : 0
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-mono text-gold truncate max-w-[280px]" title={item.term}>"{item.term}"</span>
                                  <span className="font-semibold text-white">{item.count} <span className="text-[10px] text-slate-500">({percent.toFixed(1)}%)</span></span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-gold h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Daily Trend Table / Timeline Chart */}
                  <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      Évolution Quotidienne des Visites (7 jours)
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-900">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase">
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 text-center">Pages Vues</th>
                            <th className="px-4 py-3 text-center">Visiteurs Uniques</th>
                            <th className="px-4 py-3">Graphique de Tendance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 bg-surface/10 font-mono">
                          {siteAnalytics.dailyTrend.map((day: any, idx: number) => {
                            // Max views in daily trend to scale progress bar
                            const maxViews = Math.max(...siteAnalytics.dailyTrend.map((d: any) => d.views), 1)
                            const widthPercent = (day.views / maxViews) * 100
                            return (
                              <tr key={idx} className="hover:bg-slate-800/10 transition-colors">
                                <td className="px-4 py-2.5 text-slate-300 font-semibold">{day.date}</td>
                                <td className="px-4 py-2.5 text-center text-white font-bold">{day.views}</td>
                                <td className="px-4 py-2.5 text-center text-purple-300">{day.visitors}</td>
                                <td className="px-4 py-2.5">
                                  <div className="w-full bg-slate-900 rounded h-2 overflow-hidden flex">
                                    <div className="bg-purple-600/80 h-full rounded" style={{ width: `${widthPercent}%` }} />
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 1.5. STATISTIQUES DES AFFILIÉS */}
          {adminTab === 'stats' && (
            <AdminStatsTab 
              affiliates={affiliates}
              casinos={casinos}
              affClicksBreakdown={affClicksBreakdown}

            />
          )}

          {/* 2. GESTION DES AFFILIÉS */}
          {adminTab === 'affiliates' && (
            <AdminAffiliatesTab
              affiliates={affiliates}
              setAffiliates={setAffiliates}
              recruiters={recruiters}
              kpi={kpi}
              setKpi={setKpi}
              loadData={loadData}
              supabase={supabase}
              downloadCSVAdmin={downloadCSVAdmin}
            />
          )}


          {/* 3. GESTION DES CASINOS (CRUD) */}
          {adminTab === 'casinos' && (
            <AdminCasinosTab casinos={casinos} setCasinos={setCasinos} loadData={loadData} supabase={supabase} />
          )}

          {/* REMBOURSEMENTS */}
          {adminTab === 'refunds' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30 shrink-0">
                      <RefreshCw className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-white">
                        Demandes de Remboursement
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Gérez les demandes de remboursement des dépôts de vos joueurs.</p>
                    </div>
                  </div>
                  <button onClick={loadData} className="px-5 py-2.5 bg-surface border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 transition-all hover:scale-[1.02]">
                    <RefreshCw className="w-3.5 h-3.5 text-gold" /> Actualiser
                  </button>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-surface/20">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/80 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800/80 tracking-widest">
                    <tr>
                      <th className="p-4">Affilié</th>
                      <th className="p-4">Casino</th>
                      <th className="p-4">Montant</th>
                      <th className="p-4">Preuve</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {refundRequests.length === 0 ? (
                      <tr><td colSpan={7} className="p-8 text-center text-slate-500 font-mono">Aucune demande de remboursement pour le moment.</td></tr>
                    ) : refundRequests.map((req) => (
                      <tr 
                        key={req.id} 
                        className="hover:bg-surface/30 cursor-pointer transition-colors"
                        onClick={() => setActiveRefundRequest(req)}
                      >
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{req.affiliates?.profiles?.full_name || 'N/A'}</div>
                          <div className="text-[10px] text-slate-500">{req.affiliates?.profiles?.email}</div>
                        </td>
                        <td className="p-4 font-semibold text-purple-300">{req.casino_name}</td>
                        <td className="p-4 font-mono font-bold text-gold">{Number(req.amount).toFixed(2)} €</td>
                        <td className="p-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveRefundRequest(req)
                            }}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 underline text-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Voir & Gérer
                          </button>
                        </td>
                        <td className="p-4 text-[11px] text-slate-400">{req.created_at ? new Date(req.created_at).toLocaleDateString('fr-FR') : 'N/A'}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'paid' ? 'bg-emerald/20 text-emerald border border-emerald/30' :
                            req.status === 'approved' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            req.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {req.status === 'paid' ? 'Remboursé' : req.status === 'approved' ? 'Approuvé' : req.status === 'rejected' ? 'Refusé' : 'En attente'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] text-slate-400 hover:text-white underline font-semibold">Gérer</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3.5. GESTION DES PARTENAIRES */}
          {adminTab === 'partners' && (
            <AdminPartnersTab casinos={casinos} />
          )}

          {adminTab === 'deposits' && (
            <AdminDepositsTab casinos={casinos} />
          )}

          {/* 4. GESTION DES PAIEMENTS */}
          {adminTab === 'payouts' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40 space-y-6">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
                      <CreditCard className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-white">
                        Paiements & Exports
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Gérez les retraits des affiliés et exportez pour la comptabilité.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportPayouts}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-black font-bold text-xs shadow-gold-glow flex items-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV Comptabilité
                  </button>
               </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-surface/20">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800/80 tracking-widest">
                    <tr>
                      <th className="p-4">Date Demande</th>
                      <th className="p-4">Affilié</th>
                      <th className="p-4 text-right">Montant</th>
                      <th className="p-4">Coordonnées (IBAN)</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4 text-right">Action Sécurisée</th>
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
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-surface/40 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shrink-0">
                      <MessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-white">
                        Tickets Support
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Gérez les requêtes d'assistance de vos affiliés.</p>
                    </div>
                  </div>
              </div>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-surface/20">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800/80 tracking-widest">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Affilié</th>
                      <th className="p-4">Sujet du ticket</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4 text-right">Actions Admin</th>
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
            <div className="glass-panel p-10 sm:p-16 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 bg-surface/40">
              <ShieldAlert className="w-16 h-16 text-red-900 mb-2" />
              <h3 className="font-display font-bold text-2xl text-white">Audit Logs d'Administration</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Historique des actions critiques (changements de RIB, validations de paiements, suspensions) avec archivage sécurisé. Module en cours d'activation.
              </p>
            </div>
          )}

        </>
      )}
        </div>
      </div>





      {/* Refund Review Modal */}
      {activeRefundRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-xl w-full shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="text-gold w-5 h-5" /> Demande de Remboursement
              </h3>
              <button 
                onClick={() => {
                  setActiveRefundRequest(null)
                  setAdminNoteInput('')
                  setPaymentProofFile(null)
                }}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-black/20 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block uppercase tracking-wider text-[9px]">Affilié</span>
                <strong className="text-white text-sm">{activeRefundRequest.affiliates?.profiles?.full_name || 'N/A'}</strong>
                <span className="text-slate-500 block text-[10px]">{activeRefundRequest.affiliates?.profiles?.email}</span>
              </div>
              <div className="bg-black/20 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block uppercase tracking-wider text-[9px]">Casino & Montant</span>
                <strong className="text-purple-300 text-sm block">{activeRefundRequest.casino_name}</strong>
                <strong className="text-gold text-sm font-mono">{Number(activeRefundRequest.amount).toFixed(2)} €</strong>
              </div>
            </div>

            {/* Proof Preview */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Preuve d'Inscription / Dépôt</span>
              {activeRefundRequest.proof_url ? (
                <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-black/40 max-h-64 flex items-center justify-center p-2">
                  {activeRefundRequest.proof_url.endsWith('.pdf') ? (
                    <a href={activeRefundRequest.proof_url} target="_blank" rel="noopener noreferrer" className="px-4 py-8 text-blue-400 font-bold hover:underline">
                      📄 Ouvrir le PDF de Preuve
                    </a>
                  ) : (
                    <img 
                      src={activeRefundRequest.proof_url} 
                      alt="Preuve de dépôt" 
                      className="max-w-full max-h-60 object-contain rounded-lg"
                    />
                  )}
                </div>
              ) : (
                <p className="text-slate-500 italic text-xs">Aucune preuve fournie.</p>
              )}
            </div>

            {/* Status-specific actions */}
            <div className="border-t border-slate-800 pt-4 space-y-4">
              {activeRefundRequest.status === 'pending' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Motif du refus (optionnel)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Capture d'écran floue, dépôt non visible..."
                      value={adminNoteInput}
                      onChange={e => setAdminNoteInput(e.target.value)}
                      className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveRefund(activeRefundRequest)}
                      className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-emerald hover:brightness-110 shadow-emerald-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      ✓ Approuver la Demande
                    </button>
                    <button
                      onClick={() => handleRejectRefund(activeRefundRequest)}
                      className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      ✕ Refuser la Demande
                    </button>
                  </div>
                </div>
              )}

              {activeRefundRequest.status === 'approved' && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald/10 border border-emerald/20 text-emerald text-xs rounded-xl text-center font-bold">
                    Demande approuvée. Procédez maintenant au remboursement et importez la preuve de paiement.
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Preuve de paiement de remboursement</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={e => setPaymentProofFile(e.target.files?.[0] || null)}
                      className="w-full bg-[#0a0a0f] border border-dashed border-slate-700 rounded-xl p-3 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-gold/20 file:text-gold hover:file:bg-gold/40 cursor-pointer"
                    />
                    {paymentProofFile && (
                      <p className="text-[11px] text-emerald font-bold">Fichier sélectionné : {paymentProofFile.name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handlePayRefund(activeRefundRequest)}
                    disabled={isSubmittingAdminRefund || !paymentProofFile}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gold hover:brightness-110 shadow-gold-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAdminRefund ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</> : '💸 Confirmer le Paiement & Notifier'}
                  </button>
                </div>
              )}

              {activeRefundRequest.status === 'paid' && (
                <div className="space-y-4">
                  <div className="p-3 bg-gold/10 border border-gold/20 text-gold text-xs rounded-xl text-center font-bold">
                    🎉 Ce remboursement a déjà été payé et clos.
                  </div>
                  {activeRefundRequest.payment_proof_url && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Votre Preuve de Paiement</span>
                      <div className="rounded-xl border border-slate-800 overflow-hidden bg-black/40 max-h-40 flex items-center justify-center p-2">
                        <img 
                          src={activeRefundRequest.payment_proof_url} 
                          alt="Preuve de paiement" 
                          className="max-w-full max-h-36 object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeRefundRequest.status === 'rejected' && (
                <div className="space-y-2">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-bold">
                    ✕ Demande de remboursement refusée.
                  </div>
                  {activeRefundRequest.admin_note && (
                    <p className="text-xs text-slate-400 italic text-center">Motif : "{activeRefundRequest.admin_note}"</p>
                  )}
                </div>
              )}
            </div>
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



      {/* Removed old modal */}

    </div>
  )
}
