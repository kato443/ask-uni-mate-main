-- Helper function to allow admins to delete users securely
-- This securely deletes from auth.users (which will cascade to other tables like profiles)

CREATE OR REPLACE FUNCTION delete_admin_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can delete users';
  END IF;

  -- Delete from auth.users (This automatically cascades to profiles and messages)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;
