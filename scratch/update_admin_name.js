const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?role=eq.admin`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ full_name: 'FCA-007' })
  });
  
  if (!response.ok) {
    const err = await response.text();
    console.error('Error:', err);
  } else {
    const data = await response.json();
    console.log('Successfully updated:', data);
  }
}

main();
