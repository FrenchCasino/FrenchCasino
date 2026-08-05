
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testDelete() {
  // Insert dummy casino
  const { data: casino, error: insertError } = await supabase
    .from('casinos')
    .insert([{ name: 'Test Casino To Delete', slug: 'test-casino-to-delete', lien_affilie: 'https://test.com' }])
    .select()
    .single();

  if (insertError) {
    console.error('Insert error:', insertError);
    return;
  }
  console.log('Inserted dummy casino:', casino.id);

  // Try delete
  const { error: deleteError } = await supabase
    .from('casinos')
    .delete()
    .eq('id', casino.id);

  if (deleteError) {
    console.error('Delete error:', deleteError);
  } else {
    console.log('Delete successful!');
  }
}

testDelete();
