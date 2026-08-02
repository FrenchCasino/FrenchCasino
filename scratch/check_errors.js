const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Ym5ndm1uZnN4dmJtdnhuYnNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDkxMzMxNCwiZXhwIjoyMTAwNDg5MzE0fQ.sFc6B9FOKeUneLNyu66dJXXlH6lDOEL4z7HD0wbmMSE'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function test() {
  console.log("--- TEST PAYOUT_REQUESTS FIXED ---")
  const { data: payData, error: payErr } = await supabase
    .from('payout_requests')
    .select(`
      *,
      affiliates (
        profiles!affiliates_id_fkey (
          full_name,
          email
        )
      )
    `)
  if (payErr) {
    console.error("Payouts Error:", payErr)
  } else {
    console.log("Payouts loaded successfully, count:", payData.length)
  }

  console.log("\n--- TEST TICKETS FIXED ---")
  const { data: tksData, error: tksErr } = await supabase
    .from('tickets')
    .select(`
      *,
      affiliates (
        profiles!affiliates_id_fkey (
          full_name,
          email
        )
      )
    `)
  if (tksErr) {
    console.error("Tickets Error:", tksErr)
  } else {
    console.log("Tickets loaded successfully, count:", tksData.length)
  }

  console.log("\n--- TEST REFUND REQUESTS FIXED ---")
  const { data: refData, error: refErr } = await supabase
    .from('refund_requests')
    .select(`
      *,
      affiliates (
        profiles!affiliates_id_fkey (
          full_name,
          email
        )
      )
    `)
  if (refErr) {
    console.error("Refunds Error:", refErr)
  } else {
    console.log("Refunds loaded successfully, count:", refData.length)
  }
}

test()
