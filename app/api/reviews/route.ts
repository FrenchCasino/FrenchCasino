import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies, headers } from 'next/headers'

// Initialiser le client Supabase avec la clé service_role pour outrepasser RLS si besoin, 
// ou la clé anon pour respecter les règles (ici on va insérer via anon et RLS s'occupera du reste)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: Request) {
  try {
    const { casinoSlug, rating, comment, userName } = await request.json()

    if (!casinoSlug || !rating || !comment || !userName) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La note doit être comprise entre 1 et 5' }, { status: 400 })
    }

    if (comment.length > 500) {
      return NextResponse.json({ error: 'Le commentaire est trop long' }, { status: 400 })
    }

    // Protection Anti-Spam basique avec un cookie
    const cookieStore = cookies()
    const spamCookieName = `review_sent_${casinoSlug}`
    const hasReviewed = cookieStore.get(spamCookieName)

    if (hasReviewed) {
      return NextResponse.json({ error: 'Vous avez déjà donné votre avis sur ce casino.' }, { status: 429 })
    }

    // Récupérer l'IP pour le hash
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const ip_hash = Buffer.from(ip).toString('base64')

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const { error } = await supabase
      .from('casino_reviews')
      .insert({
        casino_slug: casinoSlug,
        rating: Number(rating),
        comment: comment.trim(),
        user_name: userName.trim(),
        ip_hash,
        status: 'published' // Par défaut publié, l'admin pourra le modérer (passer à 'hidden' ou supprimer)
      })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement de l\'avis.' }, { status: 500 })
    }

    // Set le cookie anti-spam pour 30 jours
    const response = NextResponse.json({ success: true })
    response.cookies.set(spamCookieName, '1', { maxAge: 60 * 60 * 24 * 30 })

    return response

  } catch (err: any) {
    console.error('Review API error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
