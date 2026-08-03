import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Image from 'next/image'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Client Supabase avec clés d'administration pour éviter les erreurs RLS (Row Level Security)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
})

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: casino } = await supabase
    .from('casinos')
    .select('name, description, logo')
    .eq('slug', params.slug)
    .single()

  if (!casino) {
    return { title: 'Casino non trouvé' }
  }

  return {
    title: `Jouer sur ${casino.name} - Offre Exclusive`,
    description: `Profitez d'un bonus exclusif et testé par notre équipe sur ${casino.name}. Cliquez pour réclamer votre offre.`,
    openGraph: {
      title: `Jouer sur ${casino.name} - Offre Exclusive FrenchCasino`,
      description: `Découvrez ${casino.name}, l'un de nos casinos certifiés. Profitez d'avantages uniques en passant par notre lien partenaire !`,
      images: [{ url: casino.logo || 'https://frenchcasino.net/og-default.jpg' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Offre Exclusive - ${casino.name}`,
      description: `Cliquez ici pour récupérer votre bonus sur ${casino.name}`,
    }
  }
}

export default async function GoPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const slug = params.slug
  const refCode = typeof searchParams.ref === 'string' ? searchParams.ref : null

  // 1. Récupérer le lien maître
  const { data: casino } = await supabase
    .from('casinos')
    .select('id, slug, lien_affilie, name')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!casino) {
    redirect('/')
  }

  let finalLink = casino.lien_affilie

  // 3. Traitement du code affilié pour les commissions
  if (refCode) {
    try {
      console.log(`[TRACKING] Processing click for ref: ${refCode}, slug: ${slug}`)
      
      const cleanRef = refCode.trim()
      let { data: affSelect } = await supabase
        .from('affiliates')
        .select('id')
        .eq('referral_code', cleanRef)
        .maybeSingle()

      if (!affSelect) {
        const { data: affSelectFallback } = await supabase
          .from('affiliates')
          .select('id')
          .or(`referral_code.ilike.${cleanRef},referral_code.ilike.FR-${cleanRef}`)
          .limit(1)
          .maybeSingle()
        affSelect = affSelectFallback
      }

      if (affSelect) {
        await supabase.from('casino_clicks').insert({
          affiliate_id: affSelect.id,
          casino_id: casino.id,
        })
      }
    } catch (trackErr) {
      console.error('[TRACKING ERROR]', trackErr)
    }

    // On passe le code affilié à la plateforme du casino si demandé (remplacement de la balise {ref})
    if (finalLink.includes('{ref}')) {
      finalLink = finalLink.replace('{ref}', refCode)
    } else {
      const paramSeparator = finalLink.includes('?') ? '&' : '?'
      finalLink = `${finalLink}${paramSeparator}subid=${refCode}`
    }
  }

  // Redirection Serveur (HTTP 307) ultra rapide et fiable pour le tracking partenaire !
  // Cela garantit que le "Referer" est transmis au casino partenaire.
  redirect(finalLink)
}
