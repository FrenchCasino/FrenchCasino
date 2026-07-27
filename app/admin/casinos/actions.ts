'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveCasino(data: any) {
  const supabase = await createClient()
  await supabase.auth.getUser()

  // Convert fields for DB insertion (camelCase to snake_case)
  const dbData = {
    name: data.name,
    slug: data.slug,
    logo_url: data.logoUrl,
    licence: data.licence,
    note_fiabilite: Number(data.noteFiabilite),
    description: data.description,
    bonus_sans_depot: data.bonusSansDepot || null,
    bonus_depot: data.bonusDepot,
    frais_retrait: data.fraisRetrait,
    delai_retrait: data.delaiRetrait,
    wager: data.wager,
    lien_affilie: data.lienAffilie,
    ordre_classement: Number(data.ordreClassement),
    tags: data.tags || [],
    points_forts: data.pointsForts || [],
    badge_text: data.badgeText || null,
    highlighted: Boolean(data.highlighted),
    is_active: true
  }

  let result;
  
  // Update if ID exists and is not 'c' something (our mock ids) or empty
  if (data.id && data.id.length > 5) {
    result = await supabase
      .from('casinos')
      .update(dbData)
      .eq('id', data.id)
  } else {
    // Insert new
    result = await supabase
      .from('casinos')
      .insert([dbData])
  }

  if (result.error) {
    throw new Error(result.error.message)
  }

  revalidatePath('/')
  revalidatePath('/top-casino')
  revalidatePath('/bonus-sans-depot')
  revalidatePath('/bonus-depot')
  revalidatePath('/admin/casinos')

  return { success: true }
}

export async function deleteCasino(id: string) {
  if (!id || id.length < 5) return { success: false, error: "Invalid ID" }
  
  const supabase = await createClient()
  await supabase.auth.getUser()
  const result = await supabase
    .from('casinos')
    .delete()
    .eq('id', id)

  if (result.error) {
    throw new Error(result.error.message)
  }

  revalidatePath('/')
  revalidatePath('/top-casino')
  revalidatePath('/bonus-sans-depot')
  revalidatePath('/bonus-depot')
  revalidatePath('/admin/casinos')

  return { success: true }
}

export async function updateCasinoOrder(updates: { id: string, ordreClassement: number }[]) {
  const supabase = await createClient()
  await supabase.auth.getUser()

  for (const update of updates) {
    if (update.id && update.id.length > 5) {
      const { data, error } = await supabase
        .from('casinos')
        .update({ ordre_classement: update.ordreClassement })
        .eq('id', update.id)
        .select()
      
      if (error) {
        console.error("Update error for casino", update.id, error)
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        console.error("No rows updated for casino", update.id)
        throw new Error(`Impossible de modifier (RLS bloqué ou ID introuvable)`)
      }
    }
  }

  revalidatePath('/')
  revalidatePath('/top-casino')
  revalidatePath('/bonus-sans-depot')
  revalidatePath('/bonus-depot')
  revalidatePath('/admin/casinos')

  return { success: true }
}

export async function autoFixLogos() {
  const supabase = await createClient()
  await supabase.auth.getUser()

  const updates = [
    { slug: 'goldbet-casino', url: 'https://consumersiteimages.trustpilot.net/business-units/66f1b6ead36fdcc4d52b3599-198x149-2x.avif' },
    { slug: 'megawin-casino', url: 'https://media.tn.bet/logo/megawin-logo.jpg' },
    { slug: 'slott-casino', url: 'https://igamingfuture.com/wp-content/uploads/2024/07/image001-80-1024x683.jpg' },
    { slug: 'betory-casino', url: 'https://d1yabsjhm5ni78.cloudfront.net/media/betory.com/icons/main_icon_1772453740.png' },
    { slug: 'evospin', url: 'https://foundtreasure.org/wp-content/uploads/2021/05/evospin-casino-logo.png' },
    { slug: 'spin-dynasty', url: 'https://www.ambianceloisirs.fr/logos/spindynasty.png' },
    { slug: 'goldenplay', url: 'https://goldenplaycasino-fr.com/kited695858/goldenplay-casino-logo1.BcD1Fva6_Z1qhOrb.webp' },
    { slug: 'gunsbet', url: 'https://img.stargambling.net/2023/10/rae3za-gunsbet-casino-logo.png' },
    { slug: 'brutal-casino', url: 'https://media.tn.bet/logo/brutal-casino-logo.jpg' },
    { slug: 'king-chance', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYs9ohTDJDNzFtK8nhHW5JTm3Y2DVHzBonQniXbcE3L8pTK40oD8xdv_Gs&s=10' },
    { slug: 'mr-baron', url: 'https://media.tn.bet/logo/mrbaron-casino-logo.jpg' },
    { slug: 'europe777', url: 'https://europe777-casino.fr/wp-content/uploads/2026/03/europe777-casino-logo.png' },
    { slug: 'lucky-treasure', url: 'https://jeux.ca/content/cms-images/d228560744f34ad2ac8d3edc0866007ca52b8339-600x240.webp' },
    { slug: 'i24slots', url: 'https://media.tn.bet/logo/i24slots-logo.jpg' },
    { slug: 'europefortune', url: 'https://media.tn.bet/logo/europe-fortune-logo.jpg' },
    { slug: 'royal-vincit', url: 'https://media.tn.bet/logo/royal-vincit-logo.jpg' },
    { slug: 'atefia-casino', url: 'https://playplinkoau.com/assets/img/casinos/atefia.svg' },
    { slug: 'spinfin', url: 'https://media.tn.bet/logo/spinfin-logo.jpg' },
    { slug: 'x3bet', url: 'https://media.tn.bet/logo/x3bet-casino-logo.jpg' },
    { slug: 'sg-casino', url: 'https://media.tn.bet/logo/sg-casino-logo.jpg' },
    { slug: 'allyspin', url: 'https://www.google.com/s2/favicons?domain=allyspin.com&sz=128' },
    { slug: 'onlyspin', url: 'https://www.google.com/s2/favicons?domain=onlyspin.com&sz=128' },
    { slug: 'spinbara', url: 'https://www.google.com/s2/favicons?domain=spinbara.com&sz=128' },
    { slug: 'viggoslots', url: 'https://www.google.com/s2/favicons?domain=viggoslots.com&sz=128' }
  ]

  for (const up of updates) {
    await supabase.from('casinos').update({ logo_url: up.url }).eq('slug', up.slug)
  }

  revalidatePath('/')
  revalidatePath('/top-casino')
  revalidatePath('/admin/casinos')
  
  return { success: true }
}
