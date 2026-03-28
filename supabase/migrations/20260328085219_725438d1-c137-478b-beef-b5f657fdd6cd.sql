
-- Allow authenticated users (customers) to insert bookings from the website
CREATE POLICY "Customers can create bookings from website"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK (true);
