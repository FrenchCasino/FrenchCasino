import { NextResponse } from 'next/server'
import { sendWelcomeAffiliateEmail, sendPayoutNotificationEmail } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, email, name, amount, status } = body

    if (!email) {
      return NextResponse.json({ error: 'Adresse email manquante' }, { status: 400 })
    }

    if (type === 'welcome') {
      const result = await sendWelcomeAffiliateEmail({ email, name: name || 'Affilié' })
      return NextResponse.json(result)
    }

    if (type === 'payout') {
      const result = await sendPayoutNotificationEmail({
        email,
        name: name || 'Affilié',
        amount: amount || 100,
        status: status || 'pending',
      })
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Type d\'email non reconnu' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du traitement de l\'email' }, { status: 500 })
  }
}
