-- Migration to create the partners table
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    dashboard_url TEXT NOT NULL,
    cpa_commission TEXT,
    rs_commission TEXT,
    casinos_relies TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Allow admins to perform all operations
CREATE POLICY "Enable all actions for admins" ON public.partners
    FOR ALL USING (public.is_admin());

-- Seed initial default partners
INSERT INTO public.partners (name, dashboard_url, cpa_commission, rs_commission, casinos_relies)
VALUES 
('NetPartners Affiliate Network', 'https://netpartners.com/login', '120€ / Joueur', '45% RS', ARRAY['GoldBet Casino', 'EuropeFortune', 'Atefia Casino']),
('DriveAffiliates Global', 'https://go.driveaffiliates.com/login', '150€ / Joueur', '40% RS', ARRAY['Brutal Casino', 'MegaWin Casino', 'Slott Casino']),
('WePay Affiliate Hub', 'https://track.wepayaffiliate.com/login', '100€ / Joueur', '35% RS', ARRAY['Europe777', 'i24slots', 'Royal Vincit'])
ON CONFLICT DO NOTHING;
