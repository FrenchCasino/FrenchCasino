-- Add onboarding_completed flag to track if affiliate has joined Telegram and added IBAN
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
