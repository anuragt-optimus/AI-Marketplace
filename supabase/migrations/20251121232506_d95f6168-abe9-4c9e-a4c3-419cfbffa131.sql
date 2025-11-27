-- Add offer_alias column
ALTER TABLE public.offers 
ADD COLUMN IF NOT EXISTS offer_alias TEXT;

-- Add structured data columns for all offer sections
ALTER TABLE public.offers 
ADD COLUMN IF NOT EXISTS offer_setup JSONB,
ADD COLUMN IF NOT EXISTS properties JSONB,
ADD COLUMN IF NOT EXISTS offer_listing JSONB,
ADD COLUMN IF NOT EXISTS preview_audience JSONB,
ADD COLUMN IF NOT EXISTS technical_config JSONB,
ADD COLUMN IF NOT EXISTS plans JSONB,
ADD COLUMN IF NOT EXISTS resell_csp JSONB,
ADD COLUMN IF NOT EXISTS supplemental_content JSONB;

-- Add comments explaining the structure
COMMENT ON COLUMN public.offers.offer_alias IS 'Unique identifier for the offer (3-50 chars, lowercase, numbers, hyphens)';
COMMENT ON COLUMN public.offers.offer_setup IS 'JSON containing offer setup configuration';
COMMENT ON COLUMN public.offers.properties IS 'JSON containing offer properties (categories, industries, legal info)';
COMMENT ON COLUMN public.offers.offer_listing IS 'JSON containing marketplace listing details';
COMMENT ON COLUMN public.offers.preview_audience IS 'JSON containing preview audience configuration';
COMMENT ON COLUMN public.offers.technical_config IS 'JSON containing technical configuration (landing page, webhook)';
COMMENT ON COLUMN public.offers.plans IS 'JSON array containing pricing plans';
COMMENT ON COLUMN public.offers.resell_csp IS 'JSON containing reseller CSP configuration';
COMMENT ON COLUMN public.offers.supplemental_content IS 'JSON containing supplemental content (SaaS scenario, subscription IDs)';