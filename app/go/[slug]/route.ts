import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Simple in-memory cache to prevent basic bot spam per instance
const ipCache = new Map<string, number>()
const MIN_DELAY = 1000 * 60 * 10 // 10 minutes

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const url = new URL(request.url)
  const slug = params.slug
  const refCode = url.searchParams.get('ref')

  const cookieStore = cookies()
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
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

    // 2. Si on a un code affilié (ref), on logge le clic de manière sécurisée (try/catch)
    if (refCode) {
      try {
        console.log(`[TRACKING] Processing click for ref: ${refCode}, slug: ${slug}`)
        const ip = request.headers.get('x-forwarded-for') || 'unknown'
        const cacheKey = `${ip}_${slug}_${refCode}`
        const lastClick = ipCache.get(cacheKey)
        const hasClickedCookie = cookieStore.get(`clk_${slug}`)

        console.log(`[TRACKING] IP: ${ip}, lastClick: ${lastClick}, hasClickedCookie: ${hasClickedCookie}`)

        // On loggue uniquement si pas de clic récent (IP) ET pas de cookie
        if (!hasClickedCookie && (!lastClick || Date.now() - lastClick > MIN_DELAY)) {
          // Appeler la fonction RPC pour contourner la RLS et récupérer l'ID
          const { data: affiliateId, error: rpcError } = await supabase.rpc('get_affiliate_id_by_ref', {
            p_ref: refCode
          })

          console.log(`[TRACKING] RPC Result:`, { affiliateId, rpcError })

          if (affiliateId) {
            ipCache.set(cacheKey, Date.now())
            
            // Enregistrer le clic dans la nouvelle table de tracking
            const { error: insertError } = await supabase.from('casino_clicks').insert({
              affiliate_id: affiliateId,
              casino_slug: casino.slug,
            })

            console.log(`[TRACKING] Insert Result:`, { insertError })

            // Set cookie to prevent tracking again for 24h
            response.cookies.set(`clk_${slug}`, '1', { maxAge: 60 * 60 * 24 })
          } else {
            console.log(`[TRACKING] Affiliate NOT FOUND for ref: ${refCode}`)
          }
        } else {
          console.log(`[TRACKING] Click ignored due to rate limit or cookie`)
        }
      } catch (trackErr) {
        // En cas d'erreur de base de données sur le tracking, on log mais on ne bloque pas la redirection
        console.error('[TRACKING ERROR] Failed to log click:', trackErr)
      }

      // On ajoute toujours le "ref" en paramètre pour le casino (subid)
      const paramSeparator = finalLink.includes('?') ? '&' : '?'
      finalLink = `${finalLink}${paramSeparator}subid=${refCode}`
      // Update redirect location with subid
      response = NextResponse.redirect(finalLink)
    }

    // 3. Rediriger l'utilisateur vers le vrai lien du casino
    return response

  } catch (err) {
    console.error('Redirect Error:', err)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
