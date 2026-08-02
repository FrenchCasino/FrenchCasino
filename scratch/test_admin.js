const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Ym5ndm1uZnN4dmJtdnhuYnNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDkxMzMxNCwiZXhwIjoyMTAwNDg5MzE0fQ.sFc6B9FOKeUneLNyu66dJXXlH6lDOEL4z7HD0wbmMSE'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function test() {
  console.log("--- TEST ADMIN PROFILE ---")
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'gabin77700@gmail.com')
    .single()
  
  if (profErr) {
    console.error("Error fetching profile:", profErr)
  } else {
    console.log("Admin Profile in DB:", profile)
  }

  console.log("\n--- TEST REFUND REQUESTS ---")
  const { data: refunds, error: refErr } = await supabase
    .from('refund_requests')
    .select('*')
  
  if (refErr) {
    console.error("Error fetching refunds:", refErr)
  } else {
    console.log(`Found ${refunds ? refunds.length : 0} refund requests:`, refunds)
  }
}

test()
