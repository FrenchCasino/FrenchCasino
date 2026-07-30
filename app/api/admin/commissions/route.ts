import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { affiliateId, amount, periode, casinoName } = await request.json()

    if (!affiliateId || !amount) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2'

    const cookieStore = cookies()
    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Vérifier autorisation Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // 1. Ajouter la commission dans la table commissions
    const note = casinoName ? `${periode} (${casinoName})` : periode
    const { data: newComm, error: insertError } = await supabase
      .from('commissions')
      .insert({
        affiliate_id: affiliateId,
        montant: amount,
        statut: 'validated',
        periode: note
      })
      .select('id')
      .single()

    if (insertError) throw insertError

    // 2. Mettre à jour le solde total_earned de l'affilié
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('total_earned, recruiter_id')
      .eq('id', affiliateId)
      .single()

    if (affiliate) {
      const newTotal = Number(affiliate.total_earned) + Number(amount)
      await supabase
        .from('affiliates')
        .update({ total_earned: newTotal })
        .eq('id', affiliateId)

      // 3. Insérer une notification pour l'affilié
      await supabase.from('notifications').insert({
        user_id: affiliateId,
        title: 'Commission validée ! 💰',
        message: `Une commission de ${amount} € a été créditée sur votre solde.`,
        type: 'commission'
      })

      // 4. Si l'affilié a un recruteur et que la commission est positive
      if (affiliate.recruiter_id && Number(amount) > 0) {
        const recruiterAmount = Number(amount) * 0.15

        // Insérer la commission recruteur
        await supabase.from('recruiter_commissions').insert({
          recruiter_id: affiliate.recruiter_id,
          affiliate_id: affiliateId,
          commission_id: newComm.id,
          montant: recruiterAmount
        })

        // Insérer une notification pour le recruteur
        await supabase.from('notifications').insert({
          user_id: affiliate.recruiter_id,
          title: 'Commission de parrainage ! 👑',
          message: `Vous avez reçu ${recruiterAmount.toFixed(2)} € (15%) suite à une commission de votre équipe.`,
          type: 'commission'
        })

        // Mettre à jour le solde total_earned du recruteur
        const { data: recruiterAff } = await supabase
          .from('affiliates')
          .select('total_earned')
          .eq('id', affiliate.recruiter_id)
          .single()

        if (recruiterAff) {
          const newRecTotal = Number(recruiterAff.total_earned) + recruiterAmount
          await supabase
            .from('affiliates')
            .update({ total_earned: newRecTotal })
            .eq('id', affiliate.recruiter_id)
        } else {
          const fallbackReferralCode = 'FR-REC-' + Math.random().toString(36).substring(2, 8).toUpperCase()
          await supabase.from('affiliates').insert({
            id: affiliate.recruiter_id,
            referral_code: fallbackReferralCode,
            status: 'active',
            total_earned: recruiterAmount
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Add Commission Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
