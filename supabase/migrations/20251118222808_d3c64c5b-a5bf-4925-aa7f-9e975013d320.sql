-- Create offers table with all required fields
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  offer_type TEXT NOT NULL,
  
  -- Input data
  website_url TEXT NOT NULL,
  web_app_link TEXT,
  manifest_file_url TEXT,
  documentation_urls TEXT[],
  
  -- Generated content
  listing_title TEXT,
  short_description TEXT,
  long_description TEXT,
  key_features JSONB,
  use_cases JSONB,
  pricing_draft JSONB,
  legal_copy TEXT,
  icon_assets TEXT[],
  screenshots TEXT[],
  plan_details JSONB,
  fulfillment_manifest JSONB,
  private_offer_templates JSONB,
  
  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'review', 'publishing', 'live', 'failed')),
  partner_center_id TEXT,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own offers"
  ON public.offers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create offers"
  ON public.offers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own offers"
  ON public.offers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own offers"
  ON public.offers FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for offer documentation
INSERT INTO storage.buckets (id, name, public)
VALUES ('offer-docs', 'offer-docs', false);

-- Storage policies
CREATE POLICY "Users can upload own docs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'offer-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'offer-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own docs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'offer-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for offers table
ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;