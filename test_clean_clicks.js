// Removed dotenv require since we use --env-file

async function testCleanClicks() {
  // Mock Next.js Route handlers isn't easy via simple script, but I can just query supabase directly to ensure it works
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  console.log('thirtyDaysAgo:', thirtyDaysAgo);
  
  const { data, error, count } = await supabase
      .from('casino_clicks')
      .delete({ count: 'exact' })
      .lt('created_at', thirtyDaysAgo);
      
  console.log('error:', error);
  console.log('count:', count);
}

testCleanClicks();
