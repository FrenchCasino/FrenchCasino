const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCasinos() {
  const { data: casinos, error } = await supabase.from('casinos').select('name');
  if (error) {
    console.error(error);
    return;
  }
  casinos.forEach(c => {
    console.log(`"${c.name}"`);
  });
}

checkCasinos();
