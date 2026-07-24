import { NextResponse } from 'next/server'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const { type, message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let prefix = '🔔 <b>Notification Admin</b>\n\n'
    
    if (type === 'new_affiliate') {
      prefix = '🎉 <b>Nouvel Affilié Inscript !</b>\n\n'
    } else if (type === 'payout_request') {
      prefix = '💰 <b>Nouvelle Demande de Paiement</b>\n\n'
    } else if (type === 'new_ticket') {
      prefix = '🎫 <b>Nouveau Ticket Support</b>\n\n'
    }

    const fullMessage = `${prefix}${message}`

    const success = await sendTelegramNotification(fullMessage)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to send Telegram notification' }, { status: 500 })
    }
  } catch (error) {
    console.error('API Telegram Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
