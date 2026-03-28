
-- Tours table
CREATE TABLE public.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id),
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  destination text,
  duration_days integer NOT NULL DEFAULT 1,
  duration_nights integer NOT NULL DEFAULT 0,
  category text DEFAULT 'tour',
  difficulty text DEFAULT 'easy',
  max_group_size integer,
  adult_price numeric NOT NULL DEFAULT 0,
  child_price numeric DEFAULT 0,
  group_price numeric DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  inclusions text[] DEFAULT '{}',
  exclusions text[] DEFAULT '{}',
  highlights text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  cover_image text,
  itinerary jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tour departures (fixed departures)
CREATE TABLE public.tour_departures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id),
  departure_date date NOT NULL,
  return_date date,
  total_seats integer NOT NULL DEFAULT 20,
  booked_seats integer NOT NULL DEFAULT 0,
  waitlist_count integer NOT NULL DEFAULT 0,
  price_override numeric,
  status text NOT NULL DEFAULT 'open',
  booking_cutoff_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Packages table
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id),
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  destination text,
  duration_days integer NOT NULL DEFAULT 1,
  duration_nights integer NOT NULL DEFAULT 0,
  base_price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  includes_flight boolean DEFAULT false,
  includes_hotel boolean DEFAULT false,
  includes_tour boolean DEFAULT false,
  includes_transfer boolean DEFAULT false,
  inclusions text[] DEFAULT '{}',
  exclusions text[] DEFAULT '{}',
  highlights text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  cover_image text,
  itinerary jsonb DEFAULT '[]',
  is_customizable boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_departures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Tours policies
CREATE POLICY "Company members can view tours" ON public.tours
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can create tours" ON public.tours
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Admins can update tours" ON public.tours
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Admins can delete tours" ON public.tours
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

-- Tour departures policies
CREATE POLICY "Company members can view departures" ON public.tour_departures
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can create departures" ON public.tour_departures
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Admins can update departures" ON public.tour_departures
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Admins can delete departures" ON public.tour_departures
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

-- Packages policies
CREATE POLICY "Company members can view packages" ON public.packages
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can create packages" ON public.packages
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Admins can update packages" ON public.packages
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Admins can delete packages" ON public.packages
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) AND (has_role(auth.uid(), 'company_admin') OR has_role(auth.uid(), 'super_admin')));

-- Updated_at triggers
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_departures_updated_at BEFORE UPDATE ON public.tour_departures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
