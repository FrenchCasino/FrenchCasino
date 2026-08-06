import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { ARTICLES_DB } from '@/lib/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use direct supabase-js client to avoid cookies() issues in sitemap generation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Ym5ndm1uZnN4dmJtdnhuYnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTMzMTQsImV4cCI6MjEwMDQ4OTMxNH0.BqZfEZXjTuohfsshd8o6QWhP8GKZUh6j3SORTTUS0zQ'
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })
  
  // Fetch active casinos
  const { data: casinos } = await supabase
    .from('casinos')
    .select('slug, created_at')
    .eq('is_active', true)

  const casinoEntries: MetadataRoute.Sitemap = (casinos || []).map((casino) => ({
    url: `https://frenchcasino.net/casino/${casino.slug}`,
    lastModified: casino.created_at ? new Date(casino.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const articleEntries: MetadataRoute.Sitemap = ARTICLES_DB.map((article) => ({
    url: `https://frenchcasino.net/actus/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://frenchcasino.net',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://frenchcasino.net/top-casino',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://frenchcasino.net/bonus-sans-depot',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://frenchcasino.net/bonus-depot',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://frenchcasino.net/actus',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://frenchcasino.net/devenir-affilie',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://frenchcasino.net/litige',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...casinoEntries,
    ...articleEntries,
  ]
}
