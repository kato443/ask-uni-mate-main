
-- Add is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Helper function: returns true when the calling user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE user_id = auth.uid()),
    false
  );
$$;

-- Allow admins to read ALL profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- Allow admins to read ALL messages
CREATE POLICY "Admins can view all messages"
ON public.messages FOR SELECT
USING (public.is_admin());

-- Allow admins to read ALL conversations
CREATE POLICY "Admins can view all conversations"
ON public.conversations FOR SELECT
USING (public.is_admin());
