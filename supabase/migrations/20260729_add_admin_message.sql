-- Migration to add admin_message column to affiliates table
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS admin_message TEXT;
