-- Create Joanna Holidays company
INSERT INTO public.companies (name, slug, currency, email)
VALUES ('Joanna Holidays', 'joanna-holidays', 'USD', 'desqpad@gmail.com');

-- Assign company to user profile
UPDATE public.profiles
SET company_id = (SELECT id FROM public.companies WHERE slug = 'joanna-holidays')
WHERE user_id = '1d02ca14-d923-4b5a-bcd3-5b130212e8d0';

-- Upgrade role to company_admin
UPDATE public.user_roles
SET role = 'company_admin'
WHERE user_id = '1d02ca14-d923-4b5a-bcd3-5b130212e8d0' AND role = 'customer';