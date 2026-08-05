const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkPartners() {
  const { data: partners, error } = await supabase.from('partners').select('*');
  if (error) {
    console.error(error);
    return;
  }
  partners.forEach(p => {
    console.log(`Partner: ${p.name}`);
    console.log(`casinos_relies type: ${typeof p.casinos_relies}`);
    console.log(`casinos_relies isArray: ${Array.isArray(p.casinos_relies)}`);
    console.log(`casinos_relies value:`, p.casinos_relies);
    console.log('---');
  });
}

checkPartners();
