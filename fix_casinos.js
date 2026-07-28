import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pxbngvmnfsxvbmvxnbsq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const bonusDict = {
  "SpinLynx": "100% jusqu'à 5000€ + 500 FS",
  "Slott Casino": "200% jusqu'à 20000€ + 75 FS",
  "GoldBet Casino": "100% jusqu'à 5050€",
  "MegaWin Casino": "300% jusqu'à 3000€ + 100 FS",
  "Betory Casino": "150% jusqu'à 750€",
  "Spin Dynasty": "200% jusqu'à 500€ + 50 FS",
  "King Chance": "100% jusqu'à 10000€ + 120 FS",
  "Mr Baron Casino": "250% jusqu'à 2000€ + 35 FS",
  "GoldenPlay": "100% jusqu'à 500€",
  "Brutal Casino": "100% jusqu'à 500€",
  "GunsBet": "100% jusqu'à 300€ + 100 FS",
  "X3Bet": "100% jusqu'à 500€",
  "Spinfin": "100% jusqu'à 500€",
  "Royal Vincit": "100% jusqu'à 500€",
  "EuropeFortune": "100% jusqu'à 500€",
  "i24slots": "100% jusqu'à 500€",
  "Europe777": "100% jusqu'à 500€",
  "Atefia Casino": "100% jusqu'à 500€"
};

async function run() {
  const { data: casinos, error } = await supabase.from('casinos').select('*');
  if (error) {
    console.error("Error fetching casinos", error);
    return;
  }

  for (const casino of casinos) {
    if (casino.bonus_depot && casino.bonus_depot.toLowerCase().includes('commission')) {
      const commissionAmount = casino.bonus_depot.trim();
      const newBonus = bonusDict[casino.name] || "100% jusqu'à 500€";
      
      console.log(`Updating ${casino.name}: Commission -> ${commissionAmount}, Bonus -> ${newBonus}`);
      
      const { error: updateError } = await supabase.from('casinos')
        .update({
          commission_cpa: commissionAmount,
          bonus_depot: newBonus
        })
        .eq('id', casino.id);
        
      if (updateError) {
        console.error(`Failed to update ${casino.name}`, updateError);
      } else {
        console.log(`Success: ${casino.name}`);
      }
    }
  }
}

run();
