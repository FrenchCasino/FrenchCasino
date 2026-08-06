import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { affiliateIds, recruiterId } = body

    if (!affiliateIds || !recruiterId || !Array.isArray(affiliateIds)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }
    })

    // Secure check: verify that all these affiliates actually belong to this recruiter
    const { data: validAffs } = await supabaseAdmin
      .from('affiliates')
      .select('id')
      .eq('recruiter_id', recruiterId)
      .in('id', affiliateIds)

    if (!validAffs || validAffs.length === 0) {
      return NextResponse.json({ clicks: [], commissions: [] })
    }

    const validIds = validAffs.map(a => a.id)

    // Fetch clicks
    const { data: clicks } = await supabaseAdmin
      .from('casino_clicks')
      .select('*')
      .in('affiliate_id', validIds)

    // Fetch commissions
    const { data: comms } = await supabaseAdmin
      .from('commissions')
      .select('*')
      .in('affiliate_id', validIds)

    return NextResponse.json({ 
      clicks: clicks || [], 
      commissions: comms || [] 
    })
  } catch (err: any) {
    console.error('[RECRUITER API] Internal Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
