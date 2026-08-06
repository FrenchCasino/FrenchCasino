import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  const { data, error } = await supabase.from('affiliates').select('*').limit(1)
  console.log('Affiliates:', data ? 'Exists' : error)
  
  const { data: d2, error: e2 } = await supabase.from('deposits').select('*').limit(1)
  console.log('Deposits:', d2 ? 'Exists' : e2)
  
  const { data: d3, error: e3 } = await supabase.from('deposit_declarations').select('*').limit(1)
  console.log('Deposit Declarations:', d3 ? 'Exists' : e3)
}

checkTables()
