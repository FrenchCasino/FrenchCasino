const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  const response = await fetch(`${supabaseUrl}/rest/v1/affiliates?select=id,referral_code,status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey
    }
  });
  
  const data = await response.json();
  console.log(data);
}

main();
