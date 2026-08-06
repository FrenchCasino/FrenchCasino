import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const { data: deposits, error } = await supabase
      .from('deposit_declarations')
      .select(`
        id,
        casino_id,
        amount,
        status,
        created_at,
        affiliate_id,
        affiliates (
          id,
          code,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching deposit declarations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(deposits)
  } catch (error) {
    console.error('API Error (admin/deposits):', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    const { error } = await supabase
      .from('deposit_declarations')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating deposit declaration:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error (admin/deposits PATCH):', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
