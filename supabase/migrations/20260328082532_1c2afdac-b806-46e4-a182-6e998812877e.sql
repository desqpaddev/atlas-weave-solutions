
CREATE POLICY "Authenticated users can submit leads"
ON public.leads FOR INSERT TO authenticated
WITH CHECK (full_name IS NOT NULL AND full_name <> '' AND source = 'website');
