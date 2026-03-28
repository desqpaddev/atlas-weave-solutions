
-- Allow anonymous users to submit leads (booking inquiries from website)
CREATE POLICY "Anyone can submit a lead" ON public.leads
FOR INSERT TO anon
WITH CHECK (true);
