
-- Drop the overly permissive policy and replace with a more restrictive one
DROP POLICY "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a lead with required fields" ON public.leads
FOR INSERT TO anon
WITH CHECK (
  full_name IS NOT NULL AND full_name <> '' AND
  source = 'website'
);
