export interface Casino {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  licence: string;
  noteFiabilite: number; // Sur 5.0
  description: string;
  bonusSansDepot: string | null;
  bonusDepot: string;
  fraisRetrait: string;
  delaiRetrait: string;
  wager: string;
  lienAffilie: string;
  ordreClassement: number;
  tags: string[];
  pointsForts: string[];
  badgeText?: string;
  highlighted?: boolean;
  visible_affiliate?: boolean;
}

export const METHODOLOGIE_NOTATION = [
  { critere: "Licence & Sécurité", poids: "30%", description: "Vérification des licences officielles (Curaçao, MGA, etc.) et du cryptage SSL." },
  { critere: "Vitesse des Retraits", poids: "25%", description: "Tests réels de retrait via crypto et virement bancaire. Pénalité si > 48h." },
  { critere: "Conditions de Bonus", poids: "25%", description: "Analyse du wager, limites de retrait et termes abusifs cachés." },
  { critere: "Support Client", poids: "20%", description: "Test de réactivité du live chat en français à différentes heures." }
]

export const CASINOS_MOCK: Casino[] = [
  // PODIUM (Index 0, 1, 2)
  {
    id: "c1",
    name: "GoldBet Casino",
    slug: "goldbet-casino",
    logoUrl: "https://consumersiteimages.trustpilot.net/business-units/66f1b6ead36fdcc4d52b3599-198x149-2x.avif",
    licence: "Curaçao",
    noteFiabilite: 4.85,
    description: "Le choix numéro 1 pour les joueurs français. Des retraits ultra rapides et un support disponible à toute heure.",
    bonusSansDepot: "10€ offert ou 100 Tours",
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "< 2 Heures",
    wager: "x35",
    lienAffilie: "https://gbgo.net/r/PBD25V8GB",
    ordreClassement: 1,
    tags: ["Top Choix", "VIP", "Rapide"],
    pointsForts: [
      "Retraits ultra rapides",
      "Support 24/7",
      "Bonus VIP",
      "FR acceptés"
    ],
    badgeText: "MEILLEUR CASINO FR 2026",
    highlighted: true
  },
  {
    id: "c6",
    name: "EuropeFortune",
    slug: "europefortune",
    logoUrl: "https://media.tn.bet/logo/europe-fortune-logo.jpg",
    licence: "Curaçao",
    noteFiabilite: 4.6,
    description: "Un casino européen offrant un bonus de départ sans dépôt.",
    bonusSansDepot: "10€ offert",
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x35",
    lienAffilie: "https://garagebanana.com/api/v3/offer/2?affiliate_id=1122&url_id=2&free_1=/registration&free_2=fr&free_3=101122",
    ordreClassement: 2,
    tags: ["Sans Dépôt"],
    pointsForts: [
      "10€ offerts",
      "Casino européen",
      "FR"
    ],
    highlighted: true
  },
  {
    id: "c17",
    name: "Atefia Casino",
    slug: "atefia-casino",
    logoUrl: "https://playplinkoau.com/assets/img/casinos/atefia.svg",
    licence: "Curaçao",
    noteFiabilite: 4.8,
    description: "Nouveau venu dans le top avec des offres exceptionnelles.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x35",
    lienAffilie: "https://go.driveaffiliates.com/visit/?bta=35988&nci=5465",
    ordreClassement: 3,
    tags: ["Populaire"],
    pointsForts: [
      "Gros bonus",
      "Jeux variés",
      "FR acceptés"
    ],
    highlighted: true
  },
  
  // SUITE DU CLASSEMENT
  {
    id: "c18",
    name: "Spinfin",
    slug: "spinfin",
    logoUrl: "https://media.tn.bet/logo/spinfin-logo.jpg",
    licence: "Curaçao",
    noteFiabilite: 4.75,
    description: "Profitez d'une expérience de jeu unique et de retraits rapides.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 300€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x40",
    lienAffilie: "https://go.driveaffiliates.com/visit/?bta=35988&nci=5356",
    ordreClassement: 4,
    tags: ["Nouveau"],
    pointsForts: [
      "Expérience unique",
      "Retraits rapides",
      "FR"
    ]
  },
  {
    id: "c19",
    name: "X3Bet",
    slug: "x3bet",
    logoUrl: "https://media.tn.bet/logo/x3bet-casino-logo.jpg",
    licence: "Curaçao",
    noteFiabilite: 4.7,
    description: "Idéal pour les amateurs de paris et de casino.",
    bonusSansDepot: null,
    bonusDepot: "150% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x35",
    lienAffilie: "https://go.driveaffiliates.com/visit/?bta=35988&nci=5370",
    ordreClassement: 5,
    tags: ["Mixte"],
    pointsForts: [
      "Paris & Casino",
      "Fiable",
      "FR"
    ]
  },
  {
    id: "c8",
    name: "Royal Vincit",
    slug: "royal-vincit",
    logoUrl: "https://media.tn.bet/logo/royal-vincit-logo.jpg",
    licence: "Curaçao",
    noteFiabilite: 4.5,
    description: "Un thème royal avec des bonus sans dépôt pour commencer.",
    bonusSansDepot: "10€ offert",
    bonusDepot: "150% jusqu'à 750€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x40",
    lienAffilie: "https://garagebanana.com/api/v3/offer/3?affiliate_id=1122&url_id=3&free_1=/registration&free_2=fr&free_3=101122",
    ordreClassement: 6,
    tags: ["Thème"],
    pointsForts: [
      "10€ offerts",
      "Thème royal",
      "FR"
    ]
  },
  {
    id: "c2",
    name: "MegaWin Casino",
    slug: "megawin-casino",
    logoUrl: "https://media.tn.bet/logo/megawin-logo.jpg",
    licence: "Curaçao",
    noteFiabilite: 4.8,
    description: "Une plateforme très moderne proposant des avantages VIP exceptionnels et un bonus gratuit à l'inscription.",
    bonusSansDepot: "10€ offert",
    bonusDepot: "150% jusqu'à 1000€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x40",
    lienAffilie: "https://garagebanana.com/api/v3/offer/1?affiliate_id=1122&url_id=1&free_1=/registration&free_2=fr&free_3=101122",
    ordreClassement: 7,
    tags: ["Sans Dépôt", "VIP"],
    pointsForts: [
      "10€ sans dépôt",
      "VIP 8 niveaux",
      "Support FR",
      "FR acceptés"
    ]
  },
  {
    id: "c7",
    name: "i24slots",
    slug: "i24slots",
    logoUrl: "https://media.tn.bet/logo/i24slots-logo.jpg",
    licence: "Curaçao",
    noteFiabilite: 4.5,
    description: "Slots populaires et bonus gratuit.",
    bonusSansDepot: "10€ offert",
    bonusDepot: "100% jusqu'à 300€",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x40",
    lienAffilie: "https://garagebanana.com/api/v3/offer/4?affiliate_id=1122&url_id=4&free_1=/registration&free_2=fr&free_3=101122",
    ordreClassement: 8,
    tags: ["Sans Dépôt"],
    pointsForts: [
      "10€ offerts",
      "Slots populaires",
      "FR"
    ]
  },
  {
    id: "c3",
    name: "Slott Casino",
    slug: "slott-casino",
    logoUrl: "https://igamingfuture.com/wp-content/uploads/2024/07/image001-80-1024x683.jpg",
    licence: "Curaçao eGaming",
    noteFiabilite: 4.75,
    description: "La plus grande bibliothèque de jeux du marché francophone avec un bonus de bienvenue massif.",
    bonusSansDepot: "10€ offert en telechargeant leur application",
    bonusDepot: "200% bienvenue",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x35",
    lienAffilie: "https://9behi4y9oh.com/?serial=56068&creative_id=881&anid=",
    ordreClassement: 9,
    tags: ["Jeux", "Massif"],
    pointsForts: [
      "200% bienvenue",
      "12 000+ jeux",
      "FR acceptés"
    ]
  },
  {
    id: "c4",
    name: "Brutal Casino",
    slug: "brutal-casino",
    logoUrl: "https://media.tn.bet/logo/brutal-casino-logo.jpg",
    licence: "Antigua-et-Barbuda",
    noteFiabilite: 4.8,
    description: "Allez droit au but avec un lobby massif et une politique de bonus 100% sans condition de mise.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 1000€",
    fraisRetrait: "0%",
    delaiRetrait: "12h",
    wager: "Aucun (0x)",
    lienAffilie: "https://record.igpartners.xyz/_TFykjqGpDgqU9J4xpxpxGmNd7ZgqdRLk/1/",
    ordreClassement: 10,
    tags: ["Sans Wager"],
    pointsForts: [
      "Sans wager",
      "Retrait 12h",
      "FR"
    ]
  },
  {
    id: "c5",
    name: "AllySpin",
    slug: "allyspin",
    logoUrl: "https://www.lionbonuses.com/wp-content/uploads/Allyspin_1.webp",
    licence: "Anjouan Gaming",
    noteFiabilite: 4.7,
    description: "Des récompenses progressives et des retraits fiables pour les joueurs réguliers.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x40",
    lienAffilie: "/api/track?casino=allyspin",
    ordreClassement: 11,
    tags: ["Fidélité"],
    pointsForts: [
      "Fidélité progressive",
      "Retraits stables",
      "FR"
    ]
  },
  {
    id: "c9",
    name: "Betory Casino",
    slug: "betory-casino",
    logoUrl: "https://d1yabsjhm5ni78.cloudfront.net/media/betory.com/icons/main_icon_1772453740.png",
    licence: "Curaçao",
    noteFiabilite: 4.4,
    description: "Nouveau casino 2026 avec plus de 6000 jeux.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 400€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x35",
    lienAffilie: "https://betorytrackers.com/dw3fkikte",
    ordreClassement: 12,
    tags: ["Nouveau"],
    pointsForts: [
      "Nouveau 2026",
      "+6000 jeux",
      "FR"
    ]
  },
  {
    id: "c10",
    name: "OnlySpin",
    slug: "onlyspin",
    logoUrl: "https://casinodoc.org/wp-content/uploads/2026/02/onlyspins-logo-illustration-.webp",
    licence: "Curaçao",
    noteFiabilite: 4.3,
    description: "Le paradis des amateurs de machines à sous.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=onlyspin",
    ordreClassement: 13,
    tags: ["Spins"],
    pointsForts: [
      "Spins quotidiens",
      "Slots modernes",
      "FR"
    ]
  },
  {
    id: "c11",
    name: "Spin Dynasty",
    slug: "spin-dynasty",
    logoUrl: "https://www.ambianceloisirs.fr/logos/spindynasty.png",
    licence: "Curaçao",
    noteFiabilite: 4.2,
    description: "Gros bonus de dépôt et des conditions raisonnables.",
    bonusSansDepot: null,
    bonusDepot: "150% jusqu'à 1500€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x40",
    lienAffilie: "https://www.superspindynasty.com/signup/?affid=379",
    ordreClassement: 14,
    tags: ["Gros Bonus"],
    pointsForts: [
      "Gros bonus dépôt",
      "Retraits corrects",
      "FR"
    ]
  },
  {
    id: "c12",
    name: "GoldenPlay",
    slug: "goldenplay",
    logoUrl: "https://goldenplaycasino-fr.com/kited695858/goldenplay-casino-logo1.BcD1Fva6_Z1qhOrb.webp",
    licence: "Curaçao",
    noteFiabilite: 4.1,
    description: "Catalogue varié et tours gratuits.",
    bonusSansDepot: null,
    bonusDepot: "100% + tours",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x35",
    lienAffilie: "https://record.gplaynetopartners.com/_chpRvYKHhFimUmMYroJyWGNd7ZgqdRLk/1/?pg=1&cid=&payload=",
    ordreClassement: 15,
    tags: ["Varié"],
    pointsForts: [
      "100% + tours offerts",
      "Catalogue varié",
      "FR"
    ]
  },
  {
    id: "c13",
    name: "Spinbara",
    slug: "spinbara",
    logoUrl: "https://media.tn.bet/logo/spinbara-casino-logo.jpeg",
    licence: "Curaçao",
    noteFiabilite: 4.0,
    description: "Promotions régulières et très grand nombre de jeux.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 300€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x40",
    lienAffilie: "/api/track?casino=spinbara",
    ordreClassement: 16,
    tags: ["Promos"],
    pointsForts: [
      "Bar à slots",
      "Promos régulières",
      "FR"
    ]
  },
  {
    id: "c14",
    name: "SG Casino",
    slug: "sg-casino",
    logoUrl: "https://media.tn.bet/logo/sg-casino-logo.jpg",
    licence: "Curaçao",
    noteFiabilite: 3.9,
    description: "Idéal pour les jeux en direct.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=sg-casino",
    ordreClassement: 17,
    tags: ["Live"],
    pointsForts: [
      "Sélection live",
      "Retraits corrects",
      "FR"
    ]
  },
  {
    id: "c15",
    name: "Lucky Treasure",
    slug: "lucky-treasure",
    logoUrl: "https://jeux.ca/content/cms-images/d228560744f34ad2ac8d3edc0866007ca52b8339-600x240.webp",
    licence: "Curaçao",
    noteFiabilite: 3.8,
    description: "Paiements un peu plus lents mais d'excellents bonus.",
    bonusSansDepot: "55 tours offert",
    bonusDepot: "150% jusqu'à 10 000€",
    fraisRetrait: "0%",
    delaiRetrait: "3-5 jours",
    wager: "x30",
    lienAffilie: "https://www.goluckytreasure.com/signup?affid=7290",
    ordreClassement: 18,
    tags: ["Bonus"],
    pointsForts: [
      "Paiements lents",
      "Bonus intéressants",
      "FR"
    ]
  },
  {
    id: "c16",
    name: "Viggoslots",
    slug: "viggoslots",
    logoUrl: "https://jeux.ca/wp-content/uploads/2023/03/Viggoslots-1.png.webp",
    licence: "Mountberg",
    noteFiabilite: 3.5,
    description: "Des offres sans wager mais des retraits parfois retardés.",
    bonusSansDepot: null,
    bonusDepot: "100% Sans Wager",
    fraisRetrait: "0%",
    delaiRetrait: "3-5 jours",
    wager: "Aucun (0x)",
    lienAffilie: "/api/track?casino=viggoslots",
    ordreClassement: 19,
    tags: ["Sans Wager"],
    pointsForts: [
      "Sans wager",
      "Paiements lents",
      "FR"
    ]
  },
  
  // EXTRA CASINOS (Not in Top 19 but mapped)
  {
    id: "c20",
    name: "Evospin",
    slug: "evospin",
    logoUrl: "https://foundtreasure.org/wp-content/uploads/2021/05/evospin-casino-logo.png",
    licence: "Curaçao",
    noteFiabilite: 4.4,
    description: "Design intergalactique avec un catalogue énorme.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 300€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x40",
    lienAffilie: "https://evospinlink.com/h3t9102hs",
    ordreClassement: 20,
    tags: ["Jeux"],
    pointsForts: [
      "Design spatial",
      "Retraits rapides",
      "FR"
    ]
  },
  {
    id: "c21",
    name: "GunsBet",
    slug: "gunsbet",
    logoUrl: "https://img.stargambling.net/2023/10/rae3za-gunsbet-casino-logo.png",
    licence: "Curaçao",
    noteFiabilite: 4.5,
    description: "Plongez dans l'univers du Far West avec d'excellents bonus.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 300€ + 100 FS",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x40",
    lienAffilie: "https://gunsbetlink.com/hwka1tuff",
    ordreClassement: 21,
    tags: ["Far West"],
    pointsForts: [
      "Thème western",
      "Tours gratuits",
      "FR"
    ]
  },
  {
    id: "c22",
    name: "King Chance",
    slug: "king-chance",
    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYs9ohTDJDNzFtK8nhHW5JTm3Y2DVHzBonQniXbcE3L8pTK40oD8xdv_Gs&s=10",
    licence: "Curaçao",
    noteFiabilite: 4.6,
    description: "Le royaume des bonus gratuits et des gros jackpots.",
    bonusSansDepot: "20€ offert",
    bonusDepot: "100% jusqu'à 10 000€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x40",
    lienAffilie: "https://www.kingschancemax.com/signup?affid=3859",
    ordreClassement: 22,
    tags: ["VIP"],
    pointsForts: [
      "Gros montants",
      "Jeux variés",
      "FR"
    ]
  },
  {
    id: "c23",
    name: "Mr Baron Casino",
    slug: "mr-baron",
    logoUrl: "https://media.tn.bet/logo/mrbaron-casino-logo.jpg",
    licence: "Curaçao",
    noteFiabilite: 4.4,
    description: "Une atmosphère distinguée et des offres sur-mesure.",
    bonusSansDepot: "12€ offert",
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x35",
    lienAffilie: "https://track.wepayaffiliate.com/visit/?bta=35372&brand=mrbaroncasino",
    ordreClassement: 23,
    tags: ["Elégant"],
    pointsForts: [
      "Ambiance unique",
      "Support dédié",
      "FR"
    ]
  },
  {
    id: "c24",
    name: "Europe777",
    slug: "europe777",
    logoUrl: "https://europe777-casino.fr/wp-content/uploads/2026/03/europe777-casino-logo.png",
    licence: "Curaçao",
    noteFiabilite: 4.3,
    description: "Casino orienté marché européen avec bonus d'inscription gratuit.",
    bonusSansDepot: "10€ offert",
    bonusDepot: "100% jusqu'à 400€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x40",
    lienAffilie: "https://track.wepayaffiliate.com/visit/?bta=35372&brand=europe777",
    ordreClassement: 24,
    tags: ["Européen"],
    pointsForts: [
      "Joueurs FR",
      "Support français",
      "FR"
    ]
  }
]

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function getCasinos(): Promise<Casino[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxbngvmnfsxvbmvxnbsq.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2'
    
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    
    const { data, error } = await supabase
      .from('casinos')
      .select('*')
      .order('ordre_classement', { ascending: true })

    if (error || !data || data.length < 3) {
      console.error("Supabase casinos error or empty, using mock:", error)
      return CASINOS_MOCK
    }

    return data.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      logoUrl: c.logo_url,
      licence: c.licence,
      noteFiabilite: Number(c.note_fiabilite),
      description: c.description,
      bonusSansDepot: c.bonus_sans_depot,
      bonusDepot: c.bonus_depot,
      fraisRetrait: c.frais_retrait,
      delaiRetrait: c.delai_retrait,
      wager: c.wager,
      lienAffilie: c.lien_affilie,
      ordreClassement: c.ordre_classement,
      tags: c.tags || [],
      pointsForts: c.points_forts || [],
      badgeText: c.badge_text,
      highlighted: c.highlighted,
      visible_affiliate: c.visible_affiliate !== false
    }))
  } catch (e) {
    console.error("Supabase error, fallback to mock:", e)
    return CASINOS_MOCK
  }
}
