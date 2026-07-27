import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function check() {
  const { data: profile } = await supabase.from('profiles').select('*').eq('email', 'gabin77700@gmail.com').single()
  console.log("Profile:", profile)

  if (profile) {
    const { data: aff } = await supabase.from('affiliates').select('*').eq('id', profile.id).single()
    console.log("Affiliate:", aff)
  }
}

check()
