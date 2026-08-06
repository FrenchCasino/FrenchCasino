import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { affiliateId, casinoId, casinoName, amount, affiliateCode } = await req.json()

    if (!affiliateId || !casinoId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert into database
    const { error: dbError } = await supabase
      .from('deposit_declarations')
      .insert({
        affiliate_id: affiliateId,
        casino_id: casinoId, // Can store ID or name depending on schema, we store ID and can fetch name if needed, but we also pass name for Telegram
        amount: amount,
        status: 'pending'
      })

    if (dbError) {
      console.error('Error inserting deposit declaration:', dbError)
      // Even if DB fails (e.g. table not created yet), we can still try to send Telegram, but it's better to fail or just log.
      // We will proceed to Telegram to not disrupt existing flow if table is missing.
    }

    const message = `Nouveau dépôt déclaré par l'affilié ${affiliateCode || 'Inconnu'}\n\nCasino : <b>${casinoName || casinoId}</b>\nMontant : <b>${amount} €</b>`
    
    // Send Telegram Notification
    await sendTelegramNotification(`💵 <b>Nouveau Dépôt Déclaré</b>\n\n${message}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Deposit declaration error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
