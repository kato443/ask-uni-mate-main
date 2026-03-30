-- Migration: Fix RLS for auto_replies table to allow Insert and Update properly
-- Date: 2026-03-30

DROP POLICY IF EXISTS "Allow admin full access to auto_replies" ON auto_replies;

-- Recreate policy using the secure is_admin() function to prevent context evaluation errors on INSERT
CREATE POLICY "Allow admin full access to auto_replies" ON auto_replies
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
