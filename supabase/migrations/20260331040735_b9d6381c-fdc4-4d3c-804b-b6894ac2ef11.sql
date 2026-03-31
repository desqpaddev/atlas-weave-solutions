-- Allow customers to view bookings where their email matches metadata
CREATE POLICY "Customers can view own bookings by email"
ON public.bookings FOR SELECT TO authenticated
USING (
  (metadata->>'customer_email') = (auth.jwt()->>'email')
);

-- Allow customers to view payments for their own bookings
CREATE POLICY "Customers can view own payments"
ON public.payments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = payments.booking_id
    AND (b.metadata->>'customer_email') = (auth.jwt()->>'email')
  )
);