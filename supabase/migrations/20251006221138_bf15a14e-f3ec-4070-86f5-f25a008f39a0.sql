-- CRITICAL SECURITY FIX: Create separate user_roles table
-- This prevents privilege escalation by separating role management

-- Create user_roles table using the existing user_role enum
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
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

-- Create helper function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'property_manager' THEN 2
      WHEN 'property_runner' THEN 3
      WHEN 'property_owner' THEN 4
    END
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Property managers can view roles in their company"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'property_manager') 
    AND EXISTS (
      SELECT 1 FROM profiles p1
      JOIN profiles p2 ON p1.company_id = p2.company_id
      WHERE p1.id = auth.uid() AND p2.id = user_roles.user_id
    )
  );

-- Update handle_new_user function to create role entry in user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role user_role;
BEGIN
  -- Get role from metadata, default to property_owner
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'property_owner'::user_role
  );
  
  -- Insert into profiles
  INSERT INTO profiles (id, role, first_name, last_name, company_id)
  VALUES (
    NEW.id,
    user_role,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    (NEW.raw_user_meta_data->>'company_id')::uuid
  );
  
  -- Insert into user_roles (secure role storage)
  INSERT INTO user_roles (user_id, role, created_by)
  VALUES (NEW.id, user_role, NEW.id);
  
  RETURN NEW;
END;
$$;

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, created_by)
SELECT id, role, id
FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Update RLS policies to use has_role function for better security
DROP POLICY IF EXISTS "Owners can view their own properties" ON public.properties;
CREATE POLICY "Owners can view their own properties"
  ON public.properties
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() 
    OR manager_id = auth.uid() 
    OR runner_id = auth.uid() 
    OR public.has_role(auth.uid(), 'super_admin')
  );

DROP POLICY IF EXISTS "Owners can update their own properties" ON public.properties;
CREATE POLICY "Owners can update their own properties"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid() 
    OR manager_id = auth.uid() 
    OR public.has_role(auth.uid(), 'super_admin')
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);