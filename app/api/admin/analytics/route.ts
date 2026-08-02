import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Ym5ndm1uZnN4dmJtdnhuYnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTMzMTQsImV4cCI6MjEwMDQ4OTMxNH0.BqZfEZXjTuohfsshd8o6QWhP8GKZUh6j3SORTTUS0zQ'
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY

  const authClient = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: any[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }: any) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // ignore
        }
      }
    }
  })

  // Verify auth
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await authClient.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Service role to bypass any RLS on page_views
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })

  // Query all page_views from the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: views, error } = await adminClient
    .from('page_views')
    .select('path, referrer, search_terms, country, created_at, visitor_id')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rawViews = views || []

  // Perform aggregations in Node
  const totalViews = rawViews.length
  const uniqueVisitors = new Set(rawViews.map(v => v.visitor_id)).size

  // Top Pages
  const pagesMap: Record<string, number> = {}
  rawViews.forEach(v => {
    pagesMap[v.path] = (pagesMap[v.path] || 0) + 1
  })
  const topPages = Object.entries(pagesMap)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // Referrers / Traffic Sources
  const referrersMap: Record<string, number> = {}
  rawViews.forEach(v => {
    const ref = v.referrer || 'Direct'
    referrersMap[ref] = (referrersMap[ref] || 0) + 1
  })
  const topReferrers = Object.entries(referrersMap)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)

  // Countries
  const countriesMap: Record<string, number> = {}
  rawViews.forEach(v => {
    const country = v.country || 'Inconnu'
    countriesMap[country] = (countriesMap[country] || 0) + 1
  })
  const topCountries = Object.entries(countriesMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Search terms / SEO keywords
  const seoTermsMap: Record<string, number> = {}
  rawViews.forEach(v => {
    if (v.search_terms) {
      seoTermsMap[v.search_terms] = (seoTermsMap[v.search_terms] || 0) + 1
    }
  })
  const topSeoTerms = Object.entries(seoTermsMap)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Temporal stats (today, last 7 days, 30 days)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  let viewsToday = 0
  const visitorsTodaySet = new Set<string>()
  let views7Days = 0
  const visitors7DaysSet = new Set<string>()

  rawViews.forEach(v => {
    const date = new Date(v.created_at)
    if (date >= startOfToday) {
      viewsToday++
      visitorsTodaySet.add(v.visitor_id)
    }
    if (date >= sevenDaysAgo) {
      views7Days++
      visitors7DaysSet.add(v.visitor_id)
    }
  })

  // Hourly or Daily trend for chart
  const dailyTrendMap: Record<string, { views: number; visitors: Set<string> }> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    dailyTrendMap[dateStr] = { views: 0, visitors: new Set() }
  }

  rawViews.forEach(v => {
    const date = new Date(v.created_at)
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    if (dailyTrendMap[dateStr]) {
      dailyTrendMap[dateStr].views++
      dailyTrendMap[dateStr].visitors.add(v.visitor_id)
    }
  })

  const dailyTrend = Object.entries(dailyTrendMap).map(([date, data]) => ({
    date,
    views: data.views,
    visitors: data.visitors.size
  }))

  return NextResponse.json({
    summary: {
      totalViews,
      uniqueVisitors,
      viewsToday,
      visitorsToday: visitorsTodaySet.size,
      views7Days,
      visitors7Days: visitors7DaysSet.size
    },
    topPages,
    topReferrers,
    topCountries,
    topSeoTerms,
    dailyTrend
  })
}
