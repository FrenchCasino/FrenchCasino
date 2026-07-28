UPDATE public.casinos SET commission_cpa = bonus_depot, bonus_depot = '100% jusqu''à 5000€ + 500 FS' WHERE name = 'SpinLynx' AND bonus_depot ILIKE '%Commission%';
UPDATE public.casinos SET commission_cpa = bonus_depot, bonus_depot = '200% jusqu''à 20000€ + 75 FS' WHERE name = 'Slott Casino' AND bonus_depot ILIKE '%Commission%';
UPDATE public.casinos SET commission_cpa = bonus_depot, bonus_depot = '100% jusqu''à 5050€' WHERE name = 'GoldBet Casino' AND bonus_depot ILIKE '%Commission%';
UPDATE public.casinos SET commission_cpa = bonus_depot, bonus_depot = '300% jusqu''à 3000€ + 100 FS' WHERE name = 'MegaWin Casino' AND bonus_depot ILIKE '%Commission%';
UPDATE public.casinos SET commission_cpa = bonus_depot, bonus_depot = '150% jusqu''à 750€' WHERE name = 'Betory Casino' AND bonus_depot ILIKE '%Commission%';
UPDATE public.casinos SET commission_cpa = bonus_depot, bonus_depot = '200% jusqu''à 500€ + 50 FS' WHERE name = 'Spin Dynasty' AND bonus_depot ILIKE '%Commission%';
UPDATE public.casinos SET commission_cpa = bonus_depot, bonus_depot = '100% jusqu''à 10000€ + 120 FS' WHERE name = 'King Chance' AND bonus_depot ILIKE '%Commission%';
UPDATE public.casinos SET commission_cpa = bonus_depot, bonus_depot = '250% jusqu''à 2000€ + 35 FS' WHERE name = 'Mr Baron Casino' AND bonus_depot ILIKE '%Commission%';

-- Pour tous les autres casinos qui ont encore "Commission" dans le champ bonus_depot, on applique un bonus générique
UPDATE public.casinos 
SET commission_cpa = bonus_depot, 
    bonus_depot = '100% jusqu''à 500€' 
WHERE bonus_depot ILIKE '%Commission%';
