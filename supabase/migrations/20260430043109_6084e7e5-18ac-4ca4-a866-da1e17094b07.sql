UPDATE auth.users
SET email = 'admin@joannaholidays.uk',
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('email', 'admin@joannaholidays.uk'),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE id = '1d02ca14-d923-4b5a-bcd3-5b130212e8d0';

UPDATE public.profiles
SET email = 'admin@joannaholidays.uk', updated_at = now()
WHERE user_id = '1d02ca14-d923-4b5a-bcd3-5b130212e8d0';