import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  try {
    if (!SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ error: 'Supabase key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { path, referrer, visitorId, search } = body

    if (!path || !visitorId) {
      return NextResponse.json({ error: 'Missing path or visitorId' }, { status: 400 })
    }

    // Extract headers
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const country = request.headers.get('x-vercel-ip-country') || 'FR' // Default to FR if local/not Vercel

    // Extract SEO / Search terms
    let searchTerms = null
    if (search) {
      const params = new URLSearchParams(search)
      searchTerms = params.get('utm_term') || params.get('utm_source') || params.get('q') || null
    }

    // Clean up referrer
    let cleanReferrer = referrer || 'Direct'
    if (cleanReferrer.includes('google.')) {
      cleanReferrer = 'Google SEO'
    } else if (cleanReferrer.includes('bing.')) {
      cleanReferrer = 'Bing SEO'
    } else if (cleanReferrer.includes('yahoo.')) {
      cleanReferrer = 'Yahoo SEO'
    } else if (cleanReferrer.includes('facebook.com') || cleanReferrer.includes('instagram.com')) {
      cleanReferrer = 'Social Media'
    } else if (cleanReferrer.includes(request.headers.get('host') || '')) {
      // Internal navigation, we don't count it as a new external referrer, but let's keep track
      cleanReferrer = 'Internal'
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })

    const { error } = await adminClient.from('page_views').insert([{
      visitor_id: visitorId,
      path,
      referrer: cleanReferrer,
      search_terms: searchTerms,
      country,
      user_agent: userAgent
    }])

    if (error) {
      console.error('Failed to insert page view:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Analytics track error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
