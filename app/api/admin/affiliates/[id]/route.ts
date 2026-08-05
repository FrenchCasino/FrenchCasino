import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const affiliateId = params.id
    if (!affiliateId) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Ym5ndm1uZnN4dmJtdnhuYnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTMzMTQsImV4cCI6MjEwMDQ4OTMxNH0.BqZfEZXjTuohfsshd8o6QWhP8GKZUh6j3SORTTUS0zQ'
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY

    const cookieStore = cookies()
    const authClient = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignore
          }
        }
      }
    })

    // Vérifier l'autorisation (Admin uniquement)
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { data: profile } = await authClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // Utiliser le service_role client pour forcer la suppression (bypass RLS)
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })

    // Nullify references in parent_affiliate_id to avoid deleting recruited affiliates
    await adminClient.from('affiliates').update({ parent_affiliate_id: null }).eq('parent_affiliate_id', affiliateId)
    
    // Suppression explicite de toutes les tables liées pour éviter les erreurs de clés étrangères
    await adminClient.from('ticket_messages').delete().eq('sender_id', affiliateId)
    await adminClient.from('tickets').delete().eq('affiliate_id', affiliateId)
    await adminClient.from('payout_requests').delete().eq('affiliate_id', affiliateId)
    await adminClient.from('page_views').delete().eq('affiliate_id', affiliateId)
    await adminClient.from('refund_requests').delete().eq('affiliate_id', affiliateId)
    await adminClient.from('casino_reviews').delete().eq('user_id', affiliateId)
    await adminClient.from('casino_clicks').delete().eq('affiliate_id', affiliateId)
    await adminClient.from('recruiter_commissions').delete().eq('affiliate_id', affiliateId)
    await adminClient.from('recruiter_commissions').delete().eq('recruiter_id', affiliateId)
    await adminClient.from('commissions').delete().eq('affiliate_id', affiliateId)
    await adminClient.from('notifications').delete().eq('user_id', affiliateId)
    await adminClient.from('affiliates').delete().eq('id', affiliateId)
    await adminClient.from('profiles').delete().eq('id', affiliateId)

    // Suppression de l'utilisateur dans auth.users
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(affiliateId)
    
    if (deleteUserError) {
      console.error('Failed to delete auth user:', deleteUserError)
      // On continue quand même car les données ont été supprimées
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'affilié:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
