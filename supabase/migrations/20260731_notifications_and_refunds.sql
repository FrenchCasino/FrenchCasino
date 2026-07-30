-- Migration: Notifications System & Enhanced Refund Statuses

-- 1. Update refund_requests table status constraints and columns
ALTER TABLE public.refund_requests DROP CONSTRAINT IF EXISTS refund_requests_status_check;
ALTER TABLE public.refund_requests ADD CONSTRAINT refund_requests_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'paid'));
ALTER TABLE public.refund_requests ADD COLUMN IF NOT EXISTS payment_proof_url text;
ALTER TABLE public.refund_requests ADD COLUMN IF NOT EXISTS admin_note text;

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('commission', 'refund', 'casino', 'system')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);
