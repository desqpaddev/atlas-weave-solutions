
-- Allow public (anonymous) to view active packages
CREATE POLICY "Anyone can view active packages" ON public.packages
FOR SELECT TO anon
USING (is_active = true);

-- Allow public (anonymous) to view active tours
CREATE POLICY "Anyone can view active tours" ON public.tours
FOR SELECT TO anon
USING (is_active = true);

-- Allow public (anonymous) to view open departures
CREATE POLICY "Anyone can view open departures" ON public.tour_departures
FOR SELECT TO anon
USING (status = 'open');
