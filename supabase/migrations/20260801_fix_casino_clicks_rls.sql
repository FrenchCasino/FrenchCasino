-- Ensure full access for admins and read access for owners
DROP POLICY IF EXISTS "Enable full access for admins" ON public.casino_clicks;
DROP POLICY IF EXISTS "Enable read for affiliate owner" ON public.casino_clicks;
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.casino_clicks;

CREATE POLICY "Enable insert for everyone" ON public.casino_clicks
    FOR INSERT WITH CHECK (true);

-- L'admin (via role = 'admin') ou l'affilié propriétaire peuvent lire
CREATE POLICY "Enable read for affiliate owner and admins" ON public.casino_clicks
    FOR SELECT USING (
        auth.uid() = affiliate_id OR 
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

CREATE POLICY "Enable all for admins" ON public.casino_clicks
    FOR ALL USING (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );
