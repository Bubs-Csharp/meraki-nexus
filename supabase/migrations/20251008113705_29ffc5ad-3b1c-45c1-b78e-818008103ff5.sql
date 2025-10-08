-- Fix infinite recursion in profiles RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Managers can view profiles in their company" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies without recursion
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Managers can view profiles in their company"
ON public.profiles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'property_manager'::user_role) 
  AND EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.id = auth.uid()
      AND p.company_id = profiles.company_id
  )
);

CREATE POLICY "Super admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'::user_role));