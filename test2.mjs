import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://pxbngvmnfsxvbmvxnbsq.supabase.co', 'sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2');

async function run() {
  const { data: affData, error: affErr } = await supabase
    .from('affiliates')
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `);
    
  console.log('affErr:', affErr);
  console.log('affData length:', affData ? affData.length : 0);
}

run();
