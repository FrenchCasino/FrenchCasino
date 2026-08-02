const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/["'\r]/g, '');
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

async function getRpcList() {
  const response = await fetch(supabaseUrl + '/rest/v1/?apikey=' + supabaseKey);
  const data = await response.json();
  console.log('Available Paths:');
  Object.keys(data.paths).forEach(p => {
    if (p.startsWith('/rpc/')) {
      console.log(p);
    }
  });
}
getRpcList();
