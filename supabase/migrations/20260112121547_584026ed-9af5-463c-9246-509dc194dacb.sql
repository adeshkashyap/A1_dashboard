-- Create enum types for statuses and roles
CREATE TYPE public.property_status AS ENUM ('available', 'sold', 'rented', 'under_negotiation');
CREATE TYPE public.property_type AS ENUM ('apartment', 'villa', 'plot', 'commercial', 'office', 'warehouse');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'interested', 'negotiating', 'closed_won', 'closed_lost');
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'agent', 'viewer');

-- Profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'agent',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL DEFAULT 'apartment',
  status property_status NOT NULL DEFAULT 'available',
  price DECIMAL(15, 2),
  area_sqft INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  address TEXT,
  city TEXT,
  locality TEXT,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  amenities TEXT[],
  images TEXT[],
  featured_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  owner_name TEXT,
  owner_phone TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clients/Leads table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  lead_status lead_status NOT NULL DEFAULT 'new',
  budget_min DECIMAL(15, 2),
  budget_max DECIMAL(15, 2),
  preferred_locations TEXT[],
  preferred_property_types property_type[],
  notes TEXT,
  source TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Interactions/Activity log for clients
CREATE TABLE public.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'call', 'whatsapp', 'visit', 'email', 'note'
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- WhatsApp message templates
CREATE TABLE public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Message send history
CREATE TABLE public.message_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
  message_content TEXT NOT NULL,
  sent_via TEXT DEFAULT 'whatsapp',
  sent_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- Activity log for dashboard
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT, -- 'property', 'client', 'message'
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin or manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'manager')
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles policies (only admins can manage roles)
CREATE POLICY "Authenticated users can view roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Properties policies (all authenticated can view, agents+ can manage)
CREATE POLICY "Authenticated users can view properties" ON public.properties FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create properties" ON public.properties FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own properties or admins/managers can update all" ON public.properties FOR UPDATE TO authenticated 
  USING (created_by = auth.uid() OR public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admins/managers can delete properties" ON public.properties FOR DELETE TO authenticated 
  USING (public.is_admin_or_manager(auth.uid()));

-- Clients policies
CREATE POLICY "Authenticated users can view clients" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update assigned or created clients, admins all" ON public.clients FOR UPDATE TO authenticated 
  USING (created_by = auth.uid() OR assigned_to = auth.uid() OR public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admins/managers can delete clients" ON public.clients FOR DELETE TO authenticated 
  USING (public.is_admin_or_manager(auth.uid()));

-- Interactions policies
CREATE POLICY "Authenticated users can view interactions" ON public.interactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create interactions" ON public.interactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own interactions" ON public.interactions FOR UPDATE TO authenticated USING (created_by = auth.uid());

-- Message templates policies
CREATE POLICY "Authenticated users can view templates" ON public.message_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create templates" ON public.message_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own templates or admins all" ON public.message_templates FOR UPDATE TO authenticated 
  USING (created_by = auth.uid() OR public.is_admin_or_manager(auth.uid()));

-- Message history policies
CREATE POLICY "Authenticated users can view message history" ON public.message_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create message history" ON public.message_history FOR INSERT TO authenticated WITH CHECK (true);

-- Activity log policies
CREATE POLICY "Authenticated users can view activity log" ON public.activity_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create activity log" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON public.message_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email);
  
  -- Assign default 'agent' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'agent');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();