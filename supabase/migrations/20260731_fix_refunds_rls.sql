-- Migration: Fix Row Level Security policies for refund_requests
-- Goal: Allow administrators (users with role = 'admin') to view and edit all refund requests.

-- 1. Allow admins to select any refund requests
DROP POLICY IF EXISTS "Users can view their own refund requests" ON public.refund_requests;
CREATE POLICY "Users can view their own refund requests" 
  ON public.refund_requests FOR SELECT 
  USING (auth.uid() = affiliate_id OR public.is_admin());

-- 2. Allow admins to update refund requests (to approve/reject them)
DROP POLICY IF EXISTS "Admins can update refund requests" ON public.refund_requests;
CREATE POLICY "Admins can update refund requests" 
  ON public.refund_requests FOR UPDATE 
  USING (public.is_admin());
