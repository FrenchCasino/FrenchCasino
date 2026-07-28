-- Update the trigger to automatically insert into affiliates with the new recruiter_id field
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_referral_code text;
  v_recruiter_id uuid;
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Affilié FrenchCasino'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'affiliate')
  );

  -- Only create affiliate record if role is affiliate
  if coalesce(new.raw_user_meta_data->>'role', 'affiliate') = 'affiliate' then
    new_referral_code := 'FR-' || upper(substr(md5(random()::text), 1, 6));
    
    -- Parse recruiter_id safely if it's a valid uuid
    begin
      v_recruiter_id := (new.raw_user_meta_data->>'recruiter_id')::uuid;
    exception when others then
      v_recruiter_id := null;
    end;
    
    insert into public.affiliates (
      id, 
      referral_code, 
      status, 
      contact_telegram, 
      contact_whatsapp, 
      contact_phone,
      recruiter_id
    )
    values (
      new.id,
      new_referral_code,
      'pending',
      new.raw_user_meta_data->>'contact_telegram',
      new.raw_user_meta_data->>'contact_whatsapp',
      new.raw_user_meta_data->>'contact_phone',
      v_recruiter_id
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;
