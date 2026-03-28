
-- Allow authenticated users to view active tours (not just anon)
CREATE POLICY "Authenticated can view active tours"
ON public.tours FOR SELECT TO authenticated
USING (is_active = true);

-- Allow authenticated users to view active packages
CREATE POLICY "Authenticated can view active packages"
ON public.packages FOR SELECT TO authenticated
USING (is_active = true);

-- Allow authenticated users to view company branding
CREATE POLICY "Authenticated can view company branding"
ON public.companies FOR SELECT TO authenticated
USING (true);

-- Allow authenticated users to view open departures
CREATE POLICY "Authenticated can view open departures"
ON public.tour_departures FOR SELECT TO authenticated
USING (status = 'open');
