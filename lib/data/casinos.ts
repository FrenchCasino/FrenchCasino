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

export const CASINOS_MOCK: Casino[] = [
  {
    id: "c1",
    name: "GoldBet Casino",
    slug: "goldbet-casino",
    logoUrl: "/casinos/goldbet.webp",
    licence: "Curaçao Gaming License",
    noteFiabilite: 4.9,
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
    badgeText: "MEILLEUR CASINO FR",
    highlighted: true
  },
  {
    id: "c2",
    name: "Slott Casino",
    slug: "slott-casino",
    logoUrl: "/casinos/slott.webp",
    licence: "Curaçao eGaming",
    noteFiabilite: 4.8,
    description: "Une plateforme très moderne proposant des jackpots fréquents et un environnement entièrement adapté aux joueurs francophones.",
    bonusSansDepot: null,
    bonusDepot: "200% jusqu'à 20 000€ + 75 FS",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=slott-casino",
    ordreClassement: 2,
    tags: ["Moderne", "Jackpots"],
    pointsForts: [
      "Interface moderne",
      "Jackpots fréquents",
      "Support FR"
    ],
    highlighted: true
  },
  {
    id: "c3",
    name: "Brutal Casino",
    slug: "brutal-casino",
    logoUrl: "/casinos/brutal.webp",
    licence: "Antigua-et-Barbuda",
    noteFiabilite: 4.8,
    description: "Allez droit au but avec un lobby massif et une politique de bonus 100% sans condition de mise.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 1000€ (Sans wager)",
    fraisRetrait: "0%",
    delaiRetrait: "12-24h",
    wager: "Aucun (0x)",
    lienAffilie: "/api/track?casino=brutal-casino",
    ordreClassement: 3,
    tags: ["Sans Wager", "Lobby Massif"],
    pointsForts: [
      "Bonus sans condition",
      "Lobby massif",
      "FR acceptés"
    ],
    badgeText: "SANS WAGER",
    highlighted: true
  },
  {
    id: "c4",
    name: "AllySpin",
    slug: "allyspin",
    logoUrl: "/casinos/allyspin.webp",
    licence: "Anjouan Gaming",
    noteFiabilite: 4.7,
    description: "Des récompenses progressives et des retraits fiables pour les joueurs réguliers.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€ + 100 FS",
    fraisRetrait: "0%",
    delaiRetrait: "2-3 jours",
    wager: "x40",
    lienAffilie: "/api/track?casino=allyspin",
    ordreClassement: 4,
    tags: ["Fidélité"],
    pointsForts: [
      "Fidélité progressive",
      "Retraits stables",
      "FR acceptés"
    ]
  },
  {
    id: "c5",
    name: "OnlySpin",
    slug: "onlyspin",
    logoUrl: "/casinos/onlyspin.webp",
    licence: "Curaçao",
    noteFiabilite: 4.5,
    description: "Le paradis des amateurs de machines à sous avec des free spins tous les jours.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€ + 200 FS",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x35",
    lienAffilie: "/api/track?casino=onlyspin",
    ordreClassement: 5,
    tags: ["Free Spins", "Moderne"],
    pointsForts: [
      "Spins quotidiens",
      "Slots modernes",
      "FR acceptés"
    ]
  },
  {
    id: "c6",
    name: "Spin Dynasty",
    slug: "spin-dynasty",
    logoUrl: "/casinos/spin-dynasty.webp",
    licence: "Curaçao",
    noteFiabilite: 4.4,
    description: "Profitez d'un énorme bonus de dépôt pour explorer un catalogue riche et varié.",
    bonusSansDepot: null,
    bonusDepot: "150% jusqu'à 1500€",
    fraisRetrait: "0%",
    delaiRetrait: "1-2 jours",
    wager: "x40",
    lienAffilie: "/api/track?casino=spin-dynasty",
    ordreClassement: 6,
    tags: ["Gros Bonus"],
    pointsForts: [
      "Gros bonus dépôt",
      "Retraits corrects",
      "FR acceptés"
    ]
  },
  {
    id: "c7",
    name: "GoldenPlay",
    slug: "goldenplay",
    logoUrl: "/casinos/goldenplay.webp",
    licence: "Curaçao",
    noteFiabilite: 4.3,
    description: "L'expérience de jeu dorée avec des bonus réguliers et une grande diversité de titres.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€ + 50 FS",
    fraisRetrait: "0%",
    delaiRetrait: "1-3 jours",
    wager: "x35",
    lienAffilie: "/api/track?casino=goldenplay",
    ordreClassement: 7,
    tags: ["Catalogue"],
    pointsForts: [
      "100% + tours offerts",
      "Catalogue varié",
      "FR acceptés"
    ]
  },
  {
    id: "c8",
    name: "Spinbara",
    slug: "spinbara",
    logoUrl: "/casinos/spinbara.webp",
    licence: "Curaçao",
    noteFiabilite: 4.2,
    description: "Un véritable bar à slots avec des promotions qui tombent chaque semaine.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 300€",
    fraisRetrait: "0%",
    delaiRetrait: "1-3 jours",
    wager: "x40",
    lienAffilie: "/api/track?casino=spinbara",
    ordreClassement: 8,
    tags: ["Promos"],
    pointsForts: [
      "Bar à slots",
      "Promos régulières",
      "FR acceptés"
    ]
  },
  {
    id: "c9",
    name: "SG Casino",
    slug: "sg-casino",
    logoUrl: "/casinos/sg-casino.webp",
    licence: "Curaçao",
    noteFiabilite: 4.1,
    description: "La meilleure sélection de jeux en direct et de game shows.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€ + 200 FS",
    fraisRetrait: "0%",
    delaiRetrait: "2-3 jours",
    wager: "x35",
    lienAffilie: "/api/track?casino=sg-casino",
    ordreClassement: 9,
    tags: ["Casino Live"],
    pointsForts: [
      "Sélection live",
      "Retraits corrects",
      "FR acceptés"
    ]
  },
  {
    id: "c10",
    name: "Lucky Treasure",
    slug: "lucky-treasure",
    logoUrl: "/casinos/lucky-treasure.webp",
    licence: "Curaçao",
    noteFiabilite: 3.8,
    description: "Des bonus alléchants mais un processus de retrait qui demande de la patience.",
    bonusSansDepot: null,
    bonusDepot: "150% jusqu'à 1000€ + 100 FS",
    fraisRetrait: "0%",
    delaiRetrait: "3-5 jours",
    wager: "x40",
    lienAffilie: "/api/track?casino=lucky-treasure",
    ordreClassement: 10,
    tags: ["Gros Bonus"],
    pointsForts: [
      "Paiements lents",
      "Bonus intéressants",
      "FR acceptés"
    ]
  },
  {
    id: "c11",
    name: "i24 Casino",
    slug: "i24-casino",
    logoUrl: "/casinos/i24-casino.webp",
    licence: "Curaçao",
    noteFiabilite: 3.5,
    description: "Essayez le casino sans risque avec un bonus sans dépôt dès l'inscription.",
    bonusSansDepot: "10 € offerts sans dépôt",
    bonusDepot: "100% jusqu'à 200€",
    fraisRetrait: "0%",
    delaiRetrait: "2-5 jours",
    wager: "x50",
    lienAffilie: "/api/track?casino=i24-casino",
    ordreClassement: 11,
    tags: ["Sans Dépôt"],
    pointsForts: [
      "10 € offerts",
      "Conditions à vérifier",
      "FR acceptés"
    ],
    badgeText: "10€ OFFERTS"
  },
  {
    id: "c12",
    name: "MegaWin",
    slug: "megawin",
    logoUrl: "/casinos/megawin.webp",
    licence: "Curaçao",
    noteFiabilite: 3.6,
    description: "Une vaste gamme de machines à sous populaires pour jouer vos 10€ gratuits.",
    bonusSansDepot: "10 € offerts sans dépôt",
    bonusDepot: "100% jusqu'à 300€",
    fraisRetrait: "0%",
    delaiRetrait: "2-4 jours",
    wager: "x45",
    lienAffilie: "/api/track?casino=megawin",
    ordreClassement: 12,
    tags: ["Sans Dépôt", "Populaire"],
    pointsForts: [
      "10 € offerts",
      "Slots populaires",
      "FR acceptés"
    ],
    badgeText: "10€ OFFERTS"
  },
  {
    id: "c13",
    name: "Europe Fortune",
    slug: "europe-fortune",
    logoUrl: "/casinos/europe-fortune.webp",
    licence: "Curaçao",
    noteFiabilite: 3.4,
    description: "Tentez votre chance avec un petit capital gratuit avant de déposer.",
    bonusSansDepot: "10 € offerts sans dépôt",
    bonusDepot: "100% jusqu'à 250€",
    fraisRetrait: "0%",
    delaiRetrait: "2-5 jours",
    wager: "x40",
    lienAffilie: "/api/track?casino=europe-fortune",
    ordreClassement: 13,
    tags: ["Sans Dépôt"],
    pointsForts: [
      "10 € offerts",
      "Retraits moyens",
      "FR acceptés"
    ],
    badgeText: "10€ OFFERTS"
  },
  {
    id: "c14",
    name: "Royal Vinci",
    slug: "royal-vinci",
    logoUrl: "/casinos/royal-vinci.webp",
    licence: "Curaçao",
    noteFiabilite: 3.5,
    description: "Plongez dans un thème royal avec 10€ offerts pour découvrir le catalogue.",
    bonusSansDepot: "10 € offerts sans dépôt",
    bonusDepot: "100% jusqu'à 500€",
    fraisRetrait: "0%",
    delaiRetrait: "3-5 jours",
    wager: "x45",
    lienAffilie: "/api/track?casino=royal-vinci",
    ordreClassement: 14,
    tags: ["Thème Royal", "Sans Dépôt"],
    pointsForts: [
      "10 € offerts",
      "Thème royal",
      "FR acceptés"
    ],
    badgeText: "10€ OFFERTS"
  },
  {
    id: "c15",
    name: "Viggoslots",
    slug: "viggoslots",
    logoUrl: "/casinos/viggoslots.webp",
    licence: "Mountberg Ltd",
    noteFiabilite: 3.7,
    description: "Tous les bonus sont sans wager. Vous encaissez ce que vous gagnez, malgré des retraits un peu lents.",
    bonusSansDepot: "10 Free Spins (Offre VIP)",
    bonusDepot: "100% jusqu'à 400€ + 170 FS (Sans Wager)",
    fraisRetrait: "0%",
    delaiRetrait: "4-7 jours",
    wager: "Aucun (0x)",
    lienAffilie: "/api/track?casino=viggoslots",
    ordreClassement: 15,
    tags: ["Sans Wager"],
    pointsForts: [
      "Sans wager",
      "Paiements lents",
      "FR acceptés"
    ],
    badgeText: "SANS WAGER"
  }
];

export const METHODOLOGIE_NOTATION = [
  {
    critere: "Licence & Régulation",
    poids: "25%",
    description: "Vérification systématique de l'authenticité des licences (Curaçao, MGA, Anjouan) et conformité du générateur de nombres aléatoires (RNG)."
  },
  {
    critere: "Rapidité des Retraits",
    poids: "25%",
    description: "Test réel des retraits (crypto, virement, e-wallet) avec comptabilisation précise du délai de validation de la demande."
  },
  {
    critere: "Transparence des Bonus & Wager",
    poids: "20%",
    description: "Analyse stricte des termes et conditions : plafond de retrait sur bonus, mise maximale autorisée et clarté du wager."
  },
  {
    critere: "Qualité du Service Client",
    poids: "15%",
    description: "Test anonyme du chat en direct et du support mail à différentes heures du jour et de la nuit en français."
  },
  {
    critere: "Retours & Avis de la Communauté",
    poids: "15%",
    description: "Prise en compte des litiges signalés sur notre plateforme et retours d'expérience des joueurs membres."
  }
];
