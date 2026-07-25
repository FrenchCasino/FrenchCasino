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
    const { error: insertError } = await supabase.from('commissions').insert({
      affiliate_id: affiliateId,
      montant: amount,
      statut: 'validated',
      periode: note
    })

    if (insertError) throw insertError

    // 2. Mettre à jour le solde total_earned de l'affilié
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('total_earned')
      .eq('id', affiliateId)
      .single()

    if (affiliate) {
      const newTotal = Number(affiliate.total_earned) + Number(amount)
      await supabase
        .from('affiliates')
        .update({ total_earned: newTotal })
        .eq('id', affiliateId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Add Commission Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
