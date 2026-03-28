
CREATE POLICY "Customers can create bookings from website v2"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK (title IS NOT NULL AND title <> '' AND reference_number IS NOT NULL);
