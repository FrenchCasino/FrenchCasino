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
    logoUrl: "/casinos/goldbet.webp",
    licence: "Curaçao",
    noteFiabilite: 4.85,
    description: "Le choix numéro 1 pour les joueurs français. Des retraits ultra rapides et un support disponible à toute heure.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "< 2 Heures",
    wager: "x35",
    lienAffilie: "/api/track?casino=goldbet-casino",
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
    id: "c2",
    name: "MegaWin Casino",
    slug: "megawin-casino",
    logoUrl: "/casinos/megawin.webp",
    licence: "Curaçao",
    noteFiabilite: 4.8,
    description: "Une plateforme très moderne proposant des avantages VIP exceptionnels et un bonus gratuit à l'inscription.",
    bonusSansDepot: "10€",
    bonusDepot: "150% jusqu'à 1000€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x40",
    lienAffilie: "/api/track?casino=megawin-casino",
    ordreClassement: 2,
    tags: ["Sans Dépôt", "VIP"],
    pointsForts: [
      "10€ sans dépôt",
      "VIP 8 niveaux",
      "Support FR",
      "FR acceptés"
    ],
    highlighted: true
  },
  {
    id: "c3",
    name: "Slott Casino",
    slug: "slott-casino",
    logoUrl: "/casinos/slott.webp",
    licence: "Curaçao eGaming",
    noteFiabilite: 4.75,
    description: "La plus grande bibliothèque de jeux du marché francophone avec un bonus de bienvenue massif.",
    bonusSansDepot: null,
    bonusDepot: "200% bienvenue",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=slott-casino",
    ordreClassement: 3,
    tags: ["Jeux", "Massif"],
    pointsForts: [
      "200% bienvenue",
      "12 000+ jeux",
      "FR acceptés"
    ],
    highlighted: true
  },
  
  // SUITE DU CLASSEMENT (Index 3 à 15)
  {
    id: "c4",
    name: "Brutal Casino",
    slug: "brutal-casino",
    logoUrl: "/casinos/brutal.webp",
    licence: "Antigua-et-Barbuda",
    noteFiabilite: 4.8,
    description: "Allez droit au but avec un lobby massif et une politique de bonus 100% sans condition de mise.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 1000€",
    fraisRetrait: "0%",
    delaiRetrait: "12h",
    wager: "Aucun (0x)",
    lienAffilie: "/api/track?casino=brutal-casino",
    ordreClassement: 4,
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
    logoUrl: "/casinos/allyspin.webp",
    licence: "Anjouan Gaming",
    noteFiabilite: 4.7,
    description: "Des récompenses progressives et des retraits fiables pour les joueurs réguliers.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x40",
    lienAffilie: "/api/track?casino=allyspin",
    ordreClassement: 5,
    tags: ["Fidélité"],
    pointsForts: [
      "Fidélité progressive",
      "Retraits stables",
      "FR"
    ]
  },
  {
    id: "c6",
    name: "EuropeFortune",
    slug: "europefortune",
    logoUrl: "/casinos/europefortune.webp",
    licence: "Curaçao",
    noteFiabilite: 4.6,
    description: "Un casino européen offrant un bonus de départ sans dépôt.",
    bonusSansDepot: "10€",
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=europefortune",
    ordreClassement: 6,
    tags: ["Sans Dépôt"],
    pointsForts: [
      "10€ offerts",
      "Casino européen",
      "FR"
    ]
  },
  {
    id: "c7",
    name: "i24slots",
    slug: "i24slots",
    logoUrl: "/casinos/i24slots.webp",
    licence: "Curaçao",
    noteFiabilite: 4.5,
    description: "Slots populaires et bonus gratuit.",
    bonusSansDepot: "10€",
    bonusDepot: "100% jusqu'à 300€",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x40",
    lienAffilie: "/api/track?casino=i24slots",
    ordreClassement: 7,
    tags: ["Sans Dépôt"],
    pointsForts: [
      "10€ offerts",
      "Slots populaires",
      "FR"
    ]
  },
  {
    id: "c8",
    name: "Royal Vincit",
    slug: "royal-vincit",
    logoUrl: "/casinos/royal-vincit.webp",
    licence: "Curaçao",
    noteFiabilite: 4.5,
    description: "Un thème royal avec des bonus sans dépôt pour commencer.",
    bonusSansDepot: "10€",
    bonusDepot: "150% jusqu'à 750€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x40",
    lienAffilie: "/api/track?casino=royal-vincit",
    ordreClassement: 8,
    tags: ["Thème"],
    pointsForts: [
      "10€ offerts",
      "Thème royal",
      "FR"
    ]
  },
  {
    id: "c9",
    name: "Betory Casino",
    slug: "betory-casino",
    logoUrl: "/casinos/betory.webp",
    licence: "Curaçao",
    noteFiabilite: 4.4,
    description: "Nouveau casino 2026 avec plus de 6000 jeux.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 400€",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x35",
    lienAffilie: "/api/track?casino=betory-casino",
    ordreClassement: 9,
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
    logoUrl: "/casinos/onlyspin.webp",
    licence: "Curaçao",
    noteFiabilite: 4.3,
    description: "Le paradis des amateurs de machines à sous.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=onlyspin",
    ordreClassement: 10,
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
    logoUrl: "/casinos/spin-dynasty.webp",
    licence: "Curaçao",
    noteFiabilite: 4.2,
    description: "Gros bonus de dépôt et des conditions raisonnables.",
    bonusSansDepot: null,
    bonusDepot: "150% jusqu'à 1500€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x40",
    lienAffilie: "/api/track?casino=spin-dynasty",
    ordreClassement: 11,
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
    logoUrl: "/casinos/goldenplay.webp",
    licence: "Curaçao",
    noteFiabilite: 4.1,
    description: "Catalogue varié et tours gratuits.",
    bonusSansDepot: null,
    bonusDepot: "100% + tours",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=goldenplay",
    ordreClassement: 12,
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
    logoUrl: "/casinos/spinbara.webp",
    licence: "Curaçao",
    noteFiabilite: 4.0,
    description: "Promotions régulières et très grand nombre de jeux.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 300€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x40",
    lienAffilie: "/api/track?casino=spinbara",
    ordreClassement: 13,
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
    logoUrl: "/casinos/sg-casino.webp",
    licence: "Curaçao",
    noteFiabilite: 3.9,
    description: "Idéal pour les jeux en direct.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=sg-casino",
    ordreClassement: 14,
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
    logoUrl: "/casinos/lucky-treasure.webp",
    licence: "Curaçao",
    noteFiabilite: 3.8,
    description: "Paiements un peu plus lents mais d'excellents bonus.",
    bonusSansDepot: null,
    bonusDepot: "150% jusqu'à 10 000€",
    fraisRetrait: "0%",
    delaiRetrait: "3-5 jours",
    wager: "x30",
    lienAffilie: "/api/track?casino=lucky-treasure",
    ordreClassement: 15,
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
    logoUrl: "/casinos/viggoslots.webp",
    licence: "Mountberg",
    noteFiabilite: 3.5,
    description: "Des offres sans wager mais des retraits parfois retardés.",
    bonusSansDepot: null,
    bonusDepot: "100% Sans Wager",
    fraisRetrait: "0%",
    delaiRetrait: "3-5 jours",
    wager: "Aucun (0x)",
    lienAffilie: "/api/track?casino=viggoslots",
    ordreClassement: 16,
    tags: ["Sans Wager"],
    pointsForts: [
      "Sans wager",
      "Paiements lents",
      "FR"
    ]
  }
]
