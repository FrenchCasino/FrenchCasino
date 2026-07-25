import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const url = new URL(request.url)
  const slug = params.slug
  const refCode = url.searchParams.get('ref')

  const cookieStore = cookies()
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2'

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
      .select('id, lien_affilie')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (!casino) {
      // Si le casino n'existe pas ou n'est plus actif, rediriger vers l'accueil
      return NextResponse.redirect(new URL('/', request.url))
    }

    let finalLink = casino.lien_affilie

    // 2. Si on a un code affilié (ref), on logge le clic
    if (refCode) {
      // Chercher l'affilié correspondant
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('id')
        .eq('referral_code', refCode)
        .eq('status', 'active') // Optionnel: compter les clics que pour les affiliés actifs
        .single()

      if (affiliate) {
        // Enregistrer le clic dans la nouvelle table de tracking
        await supabase.from('casino_clicks').insert({
          affiliate_id: affiliate.id,
          casino_id: casino.id,
        })

        // On peut rajouter le "ref" en paramètre pour le casino (subid)
        // Vérifie si le lien a déjà des paramètres (?) ou non
        const paramSeparator = finalLink.includes('?') ? '&' : '?'
        finalLink = `${finalLink}${paramSeparator}subid=${refCode}`
      }
    }

    // 3. Rediriger l'utilisateur vers le vrai lien du casino
    return NextResponse.redirect(finalLink)

  } catch (err) {
    console.error('Redirect Error:', err)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
