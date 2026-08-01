import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { slug, refCode } = await request.json()

    if (!slug || !refCode) {
      return NextResponse.json({ error: 'Missing slug or refCode' }, { status: 400 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    // Utilisation du client d'administration Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }
    })

    // 1. Récupérer le casino
    const { data: casino } = await supabase
      .from('casinos')
      .select('id, slug')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (!casino) {
      return NextResponse.json({ error: 'Casino not found' }, { status: 444 })
    }

    // 2. Trouver l'affilié correspondant au code parrain
    let affiliateId: string | null = null

    const { data: affSelect, error: affErr } = await supabase
      .from('affiliates')
      .select('id')
      .or(`referral_code.ilike.${refCode},referral_code.ilike.FR-${refCode},referral_code.ilike.%${refCode}%`)
      .limit(1)
      .maybeSingle()

    if (affSelect) {
      affiliateId = affSelect.id
    }

    if (!affiliateId) {
      console.log(`[TRACKING API] Affiliate NOT FOUND for ref: ${refCode}`)
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
    }

    // 3. Insérer le clic dans casino_clicks
    const { data: inserted, error: insertError } = await supabase
      .from('casino_clicks')
      .insert({
        affiliate_id: affiliateId,
        casino_id: casino.id,
        casino_slug: casino.slug,
      })
      .select()

    if (insertError) {
      console.error('[TRACKING API] Insert Error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, inserted })
  } catch (err: any) {
    console.error('[TRACKING API] Internal Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
