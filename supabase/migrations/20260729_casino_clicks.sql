-- Migration for casino_clicks table
CREATE TABLE IF NOT EXISTS public.casino_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    casino_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.casino_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for everyone" ON public.casino_clicks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for affiliate owner" ON public.casino_clicks
    FOR SELECT USING (auth.uid() = affiliate_id);

CREATE POLICY "Enable full access for admins" ON public.casino_clicks
    FOR ALL USING (public.is_admin());
