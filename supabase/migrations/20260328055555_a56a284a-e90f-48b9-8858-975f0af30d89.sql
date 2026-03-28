
-- =====================================================
-- ENUM TYPES
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'company_admin', 'travel_agent', 'customer');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'quoted', 'negotiating', 'won', 'lost');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');
CREATE TYPE public.booking_type AS ENUM ('flight', 'hotel', 'tour', 'package');
CREATE TYPE public.payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded', 'failed');

-- =====================================================
-- TIMESTAMP TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================================
-- COMPANIES (multi-tenant)
-- =====================================================
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- PROFILES
-- =====================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- USER ROLES (separate table for security)
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user's company
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE user_id = _user_id
$$;

-- =====================================================
-- CUSTOMERS
-- =====================================================
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nationality TEXT,
  passport_number TEXT,
  date_of_birth DATE,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- LEADS
-- =====================================================
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT DEFAULT 'website',
  status lead_status NOT NULL DEFAULT 'new',
  destination TEXT,
  travel_dates TEXT,
  budget NUMERIC(12,2),
  currency TEXT DEFAULT 'USD',
  pax INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- AGENTS
-- =====================================================
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- BOOKINGS
-- =====================================================
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  booking_type booking_type NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  reference_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT,
  check_in DATE,
  check_out DATE,
  pax INTEGER DEFAULT 1,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status payment_status DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- PAYMENTS
-- =====================================================
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  method TEXT,
  transaction_id TEXT,
  status payment_status DEFAULT 'pending',
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Companies: viewable by members
CREATE POLICY "Users can view their company" ON public.companies
  FOR SELECT TO authenticated
  USING (id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Company admins can update their company" ON public.companies
  FOR UPDATE TO authenticated
  USING (id = public.get_user_company_id(auth.uid()) AND (public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'super_admin')));

-- Profiles
CREATE POLICY "Users can view profiles in their company" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- User roles: viewable by self and admins
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'company_admin'));

-- Leads: company scoped
CREATE POLICY "Company members can view leads" ON public.leads
  FOR SELECT TO authenticated
  USING (company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Agents and admins can create leads" ON public.leads
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_id(auth.uid()) AND (public.has_role(auth.uid(), 'travel_agent') OR public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Agents and admins can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_id(auth.uid()) AND (public.has_role(auth.uid(), 'travel_agent') OR public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'super_admin')));

-- Customers: company scoped
CREATE POLICY "Company members can view customers" ON public.customers
  FOR SELECT TO authenticated
  USING (company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Agents and admins can manage customers" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Agents and admins can update customers" ON public.customers
  FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_id(auth.uid()));

-- Agents: company scoped
CREATE POLICY "Company members can view agents" ON public.agents
  FOR SELECT TO authenticated
  USING (company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Company admins can manage agents" ON public.agents
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_id(auth.uid()) AND (public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Company admins can update agents" ON public.agents
  FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_id(auth.uid()) AND (public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'super_admin')));

-- Bookings: company scoped
CREATE POLICY "Company members can view bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Agents and admins can create bookings" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Agents and admins can update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_id(auth.uid()));

-- Payments: accessible via booking company
CREATE POLICY "Company members can view payments" ON public.payments
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_id
    AND (b.company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'super_admin'))
  ));

CREATE POLICY "Agents and admins can create payments" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_id
    AND b.company_id = public.get_user_company_id(auth.uid())
  ));

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_leads_company_id ON public.leads(company_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_assigned_agent ON public.leads(assigned_agent_id);
CREATE INDEX idx_customers_company_id ON public.customers(company_id);
CREATE INDEX idx_agents_company_id ON public.agents(company_id);
CREATE INDEX idx_bookings_company_id ON public.bookings(company_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
