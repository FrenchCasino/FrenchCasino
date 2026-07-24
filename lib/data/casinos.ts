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
    name: "MonteCryptos Royal",
    slug: "montecryptos-royal",
    logoUrl: "/casinos/montecryptos.webp",
    licence: "Curaçao Gaming License 8048/JAZ",
    noteFiabilite: 4.9,
    description: "Le casino référence en France. Retraits crypto & virement ultra-rapides en moins de 2 heures. Plus de 4000 jeux et support 24/7 en français.",
    bonusSansDepot: "20 Tours Gratuits à l'inscription (sans dépôt)",
    bonusDepot: "100% jusqu'à 500€ + 100 Free Spins",
    fraisRetrait: "0%",
    delaiRetrait: "< 2 Heures",
    wager: "x30",
    lienAffilie: "/api/track?casino=montecryptos-royal",
    ordreClassement: 1,
    tags: ["Crypto", "Retrait Instantané", "Sans Dépôt"],
    pointsForts: [
      "Licence certifiée & vérifiée",
      "Retraits validés en moins de 2h",
      "Bonus sans dépôt exclusif FrenchCasino",
      "Support chat 24/7 en français"
    ],
    badgeText: "N°1 RATING FIABILITÉ 2026",
    highlighted: true
  },
  {
    id: "c2",
    name: "Cresus Elite",
    slug: "cresus-elite",
    logoUrl: "/casinos/cresus.webp",
    licence: "Master Gaming License 5536/JAZ",
    noteFiabilite: 4.8,
    description: "Une réputation légendaire sur le marché francophone. Aucun wager sur les bonus de dépôt, vos gains sont immédiatement retirables !",
    bonusSansDepot: null,
    bonusDepot: "200% jusqu'à 500€ (SANS WAGER)",
    fraisRetrait: "0%",
    delaiRetrait: "24 Heures",
    wager: "Aucun (0x)",
    lienAffilie: "/api/track?casino=cresus-elite",
    ordreClassement: 2,
    tags: ["Sans Wager", "VIP", "Populaire"],
    pointsForts: [
      "Absence totale de Wager sur les gains",
      "Programme VIP d'exception",
      "Plus de 10 ans d'ancienneté irréprochable"
    ],
    badgeText: "SANS WAGER",
    highlighted: true
  },
  {
    id: "c3",
    name: "LuckyJack Premium",
    slug: "luckyjack-premium",
    logoUrl: "/casinos/luckyjack.webp",
    licence: "Anjouan Gaming Board OL-2024",
    noteFiabilite: 4.7,
    description: "Design futuriste et offres explosives. 15€ offerts sans carte ni dépôt à la confirmation de compte email.",
    bonusSansDepot: "15€ Gratuits Cash sans dépôt",
    bonusDepot: "150% jusqu'à 1000€ + 50 Spins",
    fraisRetrait: "0%",
    delaiRetrait: "Instant (Crypto / Interac)",
    wager: "x35",
    lienAffilie: "/api/track?casino=luckyjack-premium",
    ordreClassement: 3,
    tags: ["Cash Gratuit", "Crypto", "High Roller"],
    pointsForts: [
      "15€ cash sans dépôt immédiat",
      "Catalogue Pragmatic Play & Evolution complet",
      "Offre VIP dédiée aux High Rollers"
    ],
    badgeText: "15€ SANS DÉPÔT",
    highlighted: true
  },
  {
    id: "c4",
    name: "Tortuga Treasure",
    slug: "tortuga-treasure",
    logoUrl: "/casinos/tortuga.webp",
    licence: "Curaçao eGaming License 1668/JAZ",
    noteFiabilite: 4.6,
    description: "Plongez dans l'univers des pirates. Offre de bienvenue sur mesure avec choix entre statut Capitaine ou VIP.",
    bonusSansDepot: "10 Spins sans dépôt",
    bonusDepot: "120% jusqu'à 1200€ ou 700€ Fixe VIP",
    fraisRetrait: "0%",
    delaiRetrait: "24-48h",
    wager: "x40",
    lienAffilie: "/api/track?casino=tortuga-treasure",
    ordreClassement: 4,
    tags: ["Thématique", "Bonus Modulable"],
    pointsForts: [
      "Accompagnement VIP sur-mesure",
      "Tournois quotidiens à gros cash-prizes",
      "Interface ultra fluide sur mobile"
    ]
  },
  {
    id: "c5",
    name: "Azur Palace",
    slug: "azur-palace",
    logoUrl: "/casinos/azur.webp",
    licence: "Mountberg Ltd 1668/JAZ",
    noteFiabilite: 4.5,
    description: "L'élégance de la Côte d'Azur. Cashback hebdomadaire sans condition et promotions régulières chaque weekend.",
    bonusSansDepot: null,
    bonusDepot: "100% jusqu'à 500€ + 20 Free Spins",
    fraisRetrait: "0%",
    delaiRetrait: "24h",
    wager: "x30",
    lienAffilie: "/api/track?casino=azur-palace",
    ordreClassement: 5,
    tags: ["Cashback", "Classique"],
    pointsForts: [
      "10% de cashback chaque lundi",
      "Équipe de support francophone chaleureuse",
      "Retraits rapides et fiables"
    ]
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
