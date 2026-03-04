
-- Add two_factor_enabled to profiles
ALTER TABLE public.profiles ADD COLUMN two_factor_enabled boolean NOT NULL DEFAULT false;

-- Create verification codes table
CREATE TABLE public.verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own codes"
  ON public.verification_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own codes"
  ON public.verification_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own codes"
  ON public.verification_codes FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for quick lookup
CREATE INDEX idx_verification_codes_user_id ON public.verification_codes (user_id, used, expires_at);
