import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // Redirection SEO : www vers non-www
    const hostname = request.headers.get('host')
    if (hostname === 'www.frenchcasino.net') {
      return NextResponse.redirect(`https://frenchcasino.net${path}`, 301)
    }

    // Protection des routes /dashboard, /admin, /recruiter
    if (path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/recruiter')) {
      if (!user) {
        const type = path.startsWith('/admin') ? 'admin' : path.startsWith('/recruiter') ? 'recruiter' : 'affiliate'
        return NextResponse.redirect(new URL(`/connexion?type=${type}`, request.url))
      }

      // Récupérer le profil pour vérifier le rôle
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (path.startsWith('/admin')) {
        if (profile?.role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        
        // Vérification du 2FA pour les administrateurs
        if (path !== '/admin/verify') {
          const is2FAVerified = request.cookies.get('admin_2fa_verified')?.value === 'true'
          if (!is2FAVerified) {
            return NextResponse.redirect(new URL('/admin/verify', request.url))
          }
        }
      }
    }
  } catch (err) {
    console.error('Middleware Supabase Error:', err)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
