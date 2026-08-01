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
          casino_slug: casino.slug,
        })
      }
    } catch (trackErr) {
      console.error('[TRACKING ERROR]', trackErr)
    }

    // On passe le code affilié à la plateforme du casino (très important pour les commissions)
    const paramSeparator = finalLink.includes('?') ? '&' : '?'
    finalLink = `${finalLink}${paramSeparator}subid=${refCode}`
  }

  return (
    <html lang="fr">
      <head>
        <meta httpEquiv="refresh" content={`1;url=${finalLink}`} />
      </head>
      <body className="bg-[#0f0f17] text-white min-h-screen flex flex-col items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center gap-6 p-8 text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display text-white">Redirection en cours...</h1>
            <p className="text-slate-400">Nous vous redirigeons vers {casino.name} en toute sécurité.</p>
          </div>
        </div>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `setTimeout(function() { window.location.replace("${finalLink}"); }, 500);`
          }}
        />
      </body>
    </html>
  )
}
