import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Vérifier si l'utilisateur est bien un admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 })
    }

    const token = process.env.TELEGRAM_BOT_TOKEN
    const channelId = process.env.TELEGRAM_CHANNEL_ID

    if (!token || !channelId) {
      return NextResponse.json({ success: false, error: 'Telegram configuration is missing' }, { status: 500 })
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.description || 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Message envoyé au canal avec succès' })
  } catch (error: any) {
    console.error('Error broadcasting to telegram:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 })
  }
}
