import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Fetch active casinos
  const { data: casinos } = await supabase
    .from('casinos')
    .select('slug, updated_at')
    .eq('visible', true)

  const casinoEntries: MetadataRoute.Sitemap = (casinos || []).map((casino) => ({
    url: `https://frenchcasino.net/casino/${casino.slug}`,
    lastModified: casino.updated_at ? new Date(casino.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
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
  ]
}
