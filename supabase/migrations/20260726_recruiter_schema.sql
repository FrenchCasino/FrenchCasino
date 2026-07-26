-- 1. Modify role check constraint in profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role in ('affiliate', 'admin', 'recruiter'));

-- 2. Add contact fields to affiliates table
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS contact_telegram text;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS contact_whatsapp text;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS recruiter_id uuid REFERENCES public.profiles(id);

-- 3. Add RLS policy for recruiters to view their assigned affiliates (if needed later)
DROP POLICY IF EXISTS "Recruiters can view assigned affiliates" ON public.affiliates;
CREATE POLICY "Recruiters can view assigned affiliates" ON public.affiliates
  FOR SELECT USING (auth.uid() = recruiter_id);

-- 4. Update the trigger to automatically insert into affiliates with the new contact fields
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_referral_code text;
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Affilié FrenchCasino'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'affiliate')
  );

  -- Only create affiliate record if role is affiliate (or recruiter could also have one if needed, but for now affiliate)
  if coalesce(new.raw_user_meta_data->>'role', 'affiliate') = 'affiliate' then
    new_referral_code := 'FR-' || upper(substr(md5(random()::text), 1, 6));
    
    insert into public.affiliates (
      id, 
      referral_code, 
      status, 
      contact_telegram, 
      contact_whatsapp, 
      contact_phone
    )
    values (
      new.id,
      new_referral_code,
      'pending',
      new.raw_user_meta_data->>'contact_telegram',
      new.raw_user_meta_data->>'contact_whatsapp',
      new.raw_user_meta_data->>'contact_phone'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;
