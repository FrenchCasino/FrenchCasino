import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { sendTelegramNotification } from '@/lib/telegram'

const SECRET_KEY = process.env.TELEGRAM_BOT_TOKEN || process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallback_secret'

function generateHash(code: string, timestamp: number) {
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${code}:${timestamp}`)
    .digest('hex')
}

export async function POST(request: Request) {
  try {
    const { action, code } = await request.json()
    
    // Initialiser Supabase pour vérifier l'identité
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Action: Envoyer le code
    if (action === 'send') {
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString()
      const timestamp = Date.now()
      const hash = generateHash(generatedCode, timestamp)
      const cookieValue = `${hash}:${timestamp}`

      const message = `🔐 <b>Code de Sécurité (2FA)</b>\n\nQuelqu'un tente de se connecter à votre espace Admin.\nCode : <b>${generatedCode}</b>\n\nCe code expire dans 5 minutes.`
      const telegramSuccess = await sendTelegramNotification(message)

      if (!telegramSuccess) {
        return NextResponse.json({ error: 'Erreur Telegram' }, { status: 500 })
      }

      const response = NextResponse.json({ success: true, message: 'Code envoyé' })
      response.cookies.set('admin_2fa_hash', cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 300, // 5 minutes
        path: '/',
      })
      
      return response
    }

    // Action: Vérifier le code
    if (action === 'verify') {
      if (!code || typeof code !== 'string') {
        return NextResponse.json({ error: 'Code manquant' }, { status: 400 })
      }

      const hashCookie = cookieStore.get('admin_2fa_hash')?.value
      if (!hashCookie) {
        return NextResponse.json({ error: 'Code expiré ou invalide' }, { status: 400 })
      }

      const [hash, timestampStr] = hashCookie.split(':')
      const timestamp = parseInt(timestampStr, 10)

      if (Date.now() - timestamp > 5 * 60 * 1000) {
        return NextResponse.json({ error: 'Code expiré' }, { status: 400 })
      }

      const expectedHash = generateHash(code, timestamp)

      if (crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(hash))) {
        const response = NextResponse.json({ success: true })
        // Clear le cookie temporaire
        response.cookies.delete('admin_2fa_hash')
        // Set le cookie validé (24h)
        response.cookies.set('admin_2fa_verified', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400, // 24 heures
          path: '/',
        })
        return response
      } else {
        return NextResponse.json({ error: 'Code incorrect' }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })

  } catch (error) {
    console.error('API 2FA Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
