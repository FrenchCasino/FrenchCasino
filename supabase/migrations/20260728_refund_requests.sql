-- Table for refund requests
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE CASCADE,
  casino_name text NOT NULL,
  amount numeric NOT NULL,
  proof_url text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

-- Policies for refund_requests
CREATE POLICY "Users can insert their own refund requests" 
  ON public.refund_requests FOR INSERT 
  WITH CHECK (auth.uid() = affiliate_id);

CREATE POLICY "Users can view their own refund requests" 
  ON public.refund_requests FOR SELECT 
  USING (auth.uid() = affiliate_id);

-- Note: Admins must use a service role or bypass RLS to read all requests,
-- or we can add a policy if admins have a specific role, but the current admin logic
-- seems to rely on the service role key or full access.

-- Storage setup for 'proofs' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proofs', 'proofs', true)
ON CONFLICT (id) DO NOTHING;

-- RLS sur storage.objects est activé par défaut dans Supabase, pas besoin de le modifier

-- Allow public read access to proofs
CREATE POLICY "Public Access to proofs" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'proofs');

-- Allow authenticated users to upload files to 'proofs'
CREATE POLICY "Auth Users can upload proofs" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'proofs' AND 
  auth.role() = 'authenticated'
);
