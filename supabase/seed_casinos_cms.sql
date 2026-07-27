-- 1. Ajouter les colonnes manquantes pour le CMS Casinos
alter table public.casinos
  add column if not exists frais_retrait text,
  add column if not exists delai_retrait text,
  add column if not exists wager text,
  add column if not exists tags text[],
  add column if not exists points_forts text[],
  add column if not exists badge_text text,
  add column if not exists highlighted boolean default false;

-- 2. Vider la table pour réimporter proprement depuis zéro 
-- (ATTENTION: on utilise TRUNCATE, cela supprime toutes les données actuelles de la table)
truncate table public.casinos restart identity cascade;

-- 3. Insérer les 24 casinos
insert into public.casinos (
  id, name, slug, logo_url, licence, note_fiabilite, description, bonus_sans_depot, bonus_depot, frais_retrait, delai_retrait, wager, lien_affilie, ordre_classement, tags, points_forts, badge_text, highlighted
) values 
('00000000-0000-0000-0000-000000000001', 'GoldBet Casino', 'goldbet-casino', '/casinos/goldbet.webp', 'Curaçao', 4.85, 'Le choix numéro 1 pour les joueurs français. Des retraits ultra rapides et un support disponible à toute heure.', '10€ offert ou 100 Tours', '100% jusqu''à 500€', '0%', '< 2 Heures', 'x35', 'https://gbgo.net/r/PBD25V8GB', 1, ARRAY['Top Choix', 'VIP', 'Rapide'], ARRAY['Retraits ultra rapides', 'Support 24/7', 'Bonus VIP', 'FR acceptés'], 'MEILLEUR CASINO FR 2026', true),

('00000000-0000-0000-0000-000000000002', 'EuropeFortune', 'europefortune', '/casinos/europefortune.webp', 'Curaçao', 4.6, 'Un casino européen offrant un bonus de départ sans dépôt.', '10€ offert', '100% jusqu''à 500€', '0%', '48h', 'x35', 'https://garagebanana.com/api/v3/offer/2?affiliate_id=1122&url_id=2&free_1=/registration&free_2=fr&free_3=101122', 2, ARRAY['Sans Dépôt'], ARRAY['10€ offerts', 'Casino européen', 'FR'], null, true),

('00000000-0000-0000-0000-000000000003', 'Atefia Casino', 'atefia-casino', '/casinos/atefia.webp', 'Curaçao', 4.8, 'Nouveau venu dans le top avec des offres exceptionnelles.', null, '100% jusqu''à 500€', '0%', '24h', 'x35', 'https://go.driveaffiliates.com/visit/?bta=35988&nci=5465', 3, ARRAY['Populaire'], ARRAY['Gros bonus', 'Jeux variés', 'FR acceptés'], null, true),

('00000000-0000-0000-0000-000000000004', 'Spinfin', 'spinfin', '/casinos/spinfin.webp', 'Curaçao', 4.75, 'Profitez d''une expérience de jeu unique et de retraits rapides.', null, '100% jusqu''à 300€', '0%', '24h', 'x40', 'https://go.driveaffiliates.com/visit/?bta=35988&nci=5356', 4, ARRAY['Nouveau'], ARRAY['Expérience unique', 'Retraits rapides', 'FR'], null, false),

('00000000-0000-0000-0000-000000000005', 'X3Bet', 'x3bet', '/casinos/x3bet.webp', 'Curaçao', 4.7, 'Idéal pour les amateurs de paris et de casino.', null, '150% jusqu''à 500€', '0%', '24-48h', 'x35', 'https://go.driveaffiliates.com/visit/?bta=35988&nci=5370', 5, ARRAY['Mixte'], ARRAY['Paris & Casino', 'Fiable', 'FR'], null, false),

('00000000-0000-0000-0000-000000000006', 'Royal Vincit', 'royal-vincit', '/casinos/royal-vincit.webp', 'Curaçao', 4.5, 'Un thème royal avec des bonus sans dépôt pour commencer.', '10€ offert', '150% jusqu''à 750€', '0%', '48h', 'x40', 'https://garagebanana.com/api/v3/offer/3?affiliate_id=1122&url_id=3&free_1=/registration&free_2=fr&free_3=101122', 6, ARRAY['Thème'], ARRAY['10€ offerts', 'Thème royal', 'FR'], null, false),

('00000000-0000-0000-0000-000000000007', 'MegaWin Casino', 'megawin-casino', '/casinos/megawin.webp', 'Curaçao', 4.8, 'Une plateforme très moderne proposant des avantages VIP exceptionnels et un bonus gratuit à l''inscription.', '10€ offert', '150% jusqu''à 1000€', '0%', '24h', 'x40', 'https://garagebanana.com/api/v3/offer/1?affiliate_id=1122&url_id=1&free_1=/registration&free_2=fr&free_3=101122', 7, ARRAY['Sans Dépôt', 'VIP'], ARRAY['10€ sans dépôt', 'VIP 8 niveaux', 'Support FR', 'FR acceptés'], null, false),

('00000000-0000-0000-0000-000000000008', 'i24slots', 'i24slots', '/casinos/i24slots.webp', 'Curaçao', 4.5, 'Slots populaires et bonus gratuit.', '10€ offert', '100% jusqu''à 300€', '0%', '24-48h', 'x40', 'https://garagebanana.com/api/v3/offer/4?affiliate_id=1122&url_id=4&free_1=/registration&free_2=fr&free_3=101122', 8, ARRAY['Sans Dépôt'], ARRAY['10€ offerts', 'Slots populaires', 'FR'], null, false),

('00000000-0000-0000-0000-000000000009', 'Slott Casino', 'slott-casino', '/casinos/slott.webp', 'Curaçao eGaming', 4.75, 'La plus grande bibliothèque de jeux du marché francophone avec un bonus de bienvenue massif.', '10€ offert en telechargeant leur application', '200% bienvenue', '0%', '24-48h', 'x35', 'https://9behi4y9oh.com/?serial=56068&creative_id=881&anid=', 9, ARRAY['Jeux', 'Massif'], ARRAY['200% bienvenue', '12 000+ jeux', 'FR acceptés'], null, false),

('00000000-0000-0000-0000-000000000010', 'Brutal Casino', 'brutal-casino', '/casinos/brutal.webp', 'Antigua-et-Barbuda', 4.8, 'Allez droit au but avec un lobby massif et une politique de bonus 100% sans condition de mise.', null, '100% jusqu''à 1000€', '0%', '12h', 'Aucun (0x)', 'https://record.igpartners.xyz/_TFykjqGpDgqU9J4xpxpxGmNd7ZgqdRLk/1/', 10, ARRAY['Sans Wager'], ARRAY['Sans wager', 'Retrait 12h', 'FR'], null, false),

('00000000-0000-0000-0000-000000000011', 'AllySpin', 'allyspin', '/casinos/allyspin.webp', 'Anjouan Gaming', 4.7, 'Des récompenses progressives et des retraits fiables pour les joueurs réguliers.', null, '100% jusqu''à 500€', '0%', '24h', 'x40', '/api/track?casino=allyspin', 11, ARRAY['Fidélité'], ARRAY['Fidélité progressive', 'Retraits stables', 'FR'], null, false),

('00000000-0000-0000-0000-000000000012', 'Betory Casino', 'betory-casino', '/casinos/betory.webp', 'Curaçao', 4.4, 'Nouveau casino 2026 avec plus de 6000 jeux.', null, '100% jusqu''à 400€', '0%', '24h', 'x35', 'https://betorytrackers.com/dw3fkikte', 12, ARRAY['Nouveau'], ARRAY['Nouveau 2026', '+6000 jeux', 'FR'], null, false),

('00000000-0000-0000-0000-000000000013', 'OnlySpin', 'onlyspin', '/casinos/onlyspin.webp', 'Curaçao', 4.3, 'Le paradis des amateurs de machines à sous.', null, '100% jusqu''à 500€', '0%', '24-48h', 'x35', '/api/track?casino=onlyspin', 13, ARRAY['Spins'], ARRAY['Spins quotidiens', 'Slots modernes', 'FR'], null, false),

('00000000-0000-0000-0000-000000000014', 'Spin Dynasty', 'spin-dynasty', '/casinos/spin-dynasty.webp', 'Curaçao', 4.2, 'Gros bonus de dépôt et des conditions raisonnables.', null, '150% jusqu''à 1500€', '0%', '48h', 'x40', 'https://www.superspindynasty.com/signup/?affid=379', 14, ARRAY['Gros Bonus'], ARRAY['Gros bonus dépôt', 'Retraits corrects', 'FR'], null, false),

('00000000-0000-0000-0000-000000000015', 'GoldenPlay', 'goldenplay', '/casinos/goldenplay.webp', 'Curaçao', 4.1, 'Catalogue varié et tours gratuits.', null, '100% + tours', '0%', '48h', 'x35', 'https://record.gplaynetopartners.com/_chpRvYKHhFimUmMYroJyWGNd7ZgqdRLk/1/?pg=1&cid=&payload=', 15, ARRAY['Varié'], ARRAY['100% + tours offerts', 'Catalogue varié', 'FR'], null, false),

('00000000-0000-0000-0000-000000000016', 'Spinbara', 'spinbara', '/casinos/spinbara.webp', 'Curaçao', 4.0, 'Promotions régulières et très grand nombre de jeux.', null, '100% jusqu''à 300€', '0%', '48h', 'x40', '/api/track?casino=spinbara', 16, ARRAY['Promos'], ARRAY['Bar à slots', 'Promos régulières', 'FR'], null, false),

('00000000-0000-0000-0000-000000000017', 'SG Casino', 'sg-casino', '/casinos/sg-casino.webp', 'Curaçao', 3.9, 'Idéal pour les jeux en direct.', null, '100% jusqu''à 500€', '0%', '48h', 'x35', '/api/track?casino=sg-casino', 17, ARRAY['Live'], ARRAY['Sélection live', 'Retraits corrects', 'FR'], null, false),

('00000000-0000-0000-0000-000000000018', 'Lucky Treasure', 'lucky-treasure', '/casinos/lucky-treasure.webp', 'Curaçao', 3.8, 'Paiements un peu plus lents mais d''excellents bonus.', '55 tours offert', '150% jusqu''à 10 000€', '0%', '3-5 jours', 'x30', 'https://www.goluckytreasure.com/signup?affid=7290', 18, ARRAY['Bonus'], ARRAY['Paiements lents', 'Bonus intéressants', 'FR'], null, false),

('00000000-0000-0000-0000-000000000019', 'Viggoslots', 'viggoslots', '/casinos/viggoslots.webp', 'Mountberg', 3.5, 'Des offres sans wager mais des retraits parfois retardés.', null, '100% Sans Wager', '0%', '3-5 jours', 'Aucun (0x)', '/api/track?casino=viggoslots', 19, ARRAY['Sans Wager'], ARRAY['Sans wager', 'Paiements lents', 'FR'], null, false),

('00000000-0000-0000-0000-000000000020', 'Evospin', 'evospin', '/casinos/evospin.webp', 'Curaçao', 4.4, 'Design intergalactique avec un catalogue énorme.', null, '100% jusqu''à 300€', '0%', '24h', 'x40', 'https://evospinlink.com/h3t9102hs', 20, ARRAY['Jeux'], ARRAY['Design spatial', 'Retraits rapides', 'FR'], null, false),

('00000000-0000-0000-0000-000000000021', 'GunsBet', 'gunsbet', '/casinos/gunsbet.webp', 'Curaçao', 4.5, 'Plongez dans l''univers du Far West avec d''excellents bonus.', null, '100% jusqu''à 300€ + 100 FS', '0%', '24h', 'x40', 'https://gunsbetlink.com/hwka1tuff', 21, ARRAY['Far West'], ARRAY['Thème western', 'Tours gratuits', 'FR'], null, false),

('00000000-0000-0000-0000-000000000022', 'King Chance', 'king-chance', '/casinos/king-chance.webp', 'Curaçao', 4.6, 'Le royaume des bonus gratuits et des gros jackpots.', '20€ offert', '100% jusqu''à 10 000€', '0%', '48h', 'x40', 'https://www.kingschancemax.com/signup?affid=3859', 22, ARRAY['VIP'], ARRAY['Gros montants', 'Jeux variés', 'FR'], null, false),

('00000000-0000-0000-0000-000000000023', 'Mr Baron Casino', 'mr-baron', '/casinos/mr-baron.webp', 'Curaçao', 4.4, 'Une atmosphère distinguée et des offres sur-mesure.', '12€ offert', '100% jusqu''à 500€', '0%', '24-48h', 'x35', 'https://track.wepayaffiliate.com/visit/?bta=35372&brand=mrbaroncasino', 23, ARRAY['Elégant'], ARRAY['Ambiance unique', 'Support dédié', 'FR'], null, false),

('00000000-0000-0000-0000-000000000024', 'Europe777', 'europe777', '/casinos/europe777.webp', 'Curaçao', 4.3, 'Casino orienté marché européen avec bonus d''inscription gratuit.', '10€ offert', '100% jusqu''à 400€', '0%', '48h', 'x40', 'https://track.wepayaffiliate.com/visit/?bta=35372&brand=europe777', 24, ARRAY['Européen'], ARRAY['Joueurs FR', 'Support français', 'FR'], null, false);
