
-- Add DELETE policies for leads, customers, agents, bookings
CREATE POLICY "Admins can delete leads" ON public.leads
FOR DELETE TO authenticated
USING (
  (company_id = get_user_company_id(auth.uid()))
  AND (has_role(auth.uid(), 'company_admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
);

CREATE POLICY "Admins can delete customers" ON public.customers
FOR DELETE TO authenticated
USING (
  (company_id = get_user_company_id(auth.uid()))
  AND (has_role(auth.uid(), 'company_admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
);

CREATE POLICY "Admins can delete agents" ON public.agents
FOR DELETE TO authenticated
USING (
  (company_id = get_user_company_id(auth.uid()))
  AND (has_role(auth.uid(), 'company_admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
);

CREATE POLICY "Admins can delete bookings" ON public.bookings
FOR DELETE TO authenticated
USING (
  (company_id = get_user_company_id(auth.uid()))
  AND (has_role(auth.uid(), 'company_admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
);

CREATE POLICY "Admins can update payments" ON public.payments
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = payments.booking_id
    AND b.company_id = get_user_company_id(auth.uid())
    AND (has_role(auth.uid(), 'company_admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

CREATE POLICY "Admins can delete payments" ON public.payments
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = payments.booking_id
    AND b.company_id = get_user_company_id(auth.uid())
    AND (has_role(auth.uid(), 'company_admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

-- Also allow leads status update by agents
CREATE POLICY "Agents can delete leads" ON public.leads
FOR DELETE TO authenticated
USING (
  (company_id = get_user_company_id(auth.uid()))
  AND has_role(auth.uid(), 'travel_agent'::app_role)
);
