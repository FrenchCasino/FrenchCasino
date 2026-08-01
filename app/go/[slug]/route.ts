import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Simple in-memory cache to prevent basic bot spam per instance
const ipCache = new Map<string, number>()

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const url = new URL(request.url)
  const slug = params.slug
  const refCode = url.searchParams.get('ref')

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // Client Supabase pur (évite les restrictions RLS des requêtes client anonymes)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
  })

  try {
    // 1. Récupérer le lien maître du casino via son slug
    const { data: casino } = await supabase
      .from('casinos')
      .select('id, slug, lien_affilie')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (!casino) {
      // Si le casino n'existe pas ou n'est plus actif, rediriger vers l'accueil
      return NextResponse.redirect(new URL('/', request.url))
    }

    let finalLink = casino.lien_affilie

    // Ajouter systématiquement les UTM de redirection pour garantir l'attribution SEO hors-site
    const utmSeparator = finalLink.includes('?') ? '&' : '?'
    finalLink = `${finalLink}${utmSeparator}utm_source=frenchcasino&utm_medium=redirect&utm_campaign=affiliation`

    let response = NextResponse.redirect(finalLink)

    // 2. Si on a un code affilié (ref), on logge le clic de manière sécurisée via l'API interne
    if (refCode) {
      try {
        console.log(`[TRACKING] Processing click for ref: ${refCode}, slug: ${slug}`)
        
        // Trouver l'affilié et insérer le clic via Supabase Direct Admin
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
          const { error: insertError } = await supabase.from('casino_clicks').insert({
            affiliate_id: affSelect.id,
            casino_id: casino.id,
            casino_slug: casino.slug,
          })
          console.log(`[TRACKING] Direct Insert Result for aff ${affSelect.id}:`, { insertError })
        } else {
          console.log(`[TRACKING] Affiliate NOT FOUND for ref: ${cleanRef}`)
        }
      } catch (trackErr) {
        console.error('[TRACKING ERROR] Failed to log click:', trackErr)
      }

      // On ajoute toujours le "ref" en paramètre pour le casino (subid)
      const paramSeparator = finalLink.includes('?') ? '&' : '?'
      finalLink = `${finalLink}${paramSeparator}subid=${refCode}`
      response = NextResponse.redirect(finalLink)
    }

    // 3. Rediriger l'utilisateur vers le vrai lien du casino
    return response

  } catch (err) {
    console.error('Redirect Error:', err)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
