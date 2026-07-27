'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveCasino(data: any) {
  const supabase = await createClient()

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

  for (const update of updates) {
    if (update.id && update.id.length > 5) {
      await supabase
        .from('casinos')
        .update({ ordre_classement: update.ordreClassement })
        .eq('id', update.id)
    }
  }

  revalidatePath('/')
  revalidatePath('/top-casino')
  revalidatePath('/bonus-sans-depot')
  revalidatePath('/bonus-depot')
  revalidatePath('/admin/casinos')

  return { success: true }
}
