-- Migration to create the page_views table for visitor tracking
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer TEXT,
    search_terms TEXT,
    country TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert tracking logs
CREATE POLICY "Enable insert for all users" ON public.page_views
    FOR INSERT WITH CHECK (true);

-- Policy to allow only admins to read page views
CREATE POLICY "Enable read for admins" ON public.page_views
    FOR SELECT USING (public.is_admin());
