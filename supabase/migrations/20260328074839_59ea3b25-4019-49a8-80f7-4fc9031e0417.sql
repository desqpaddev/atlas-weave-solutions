-- Allow anon users to read basic company branding info
CREATE POLICY "Anyone can view company branding"
ON public.companies FOR SELECT
TO anon
USING (true);
