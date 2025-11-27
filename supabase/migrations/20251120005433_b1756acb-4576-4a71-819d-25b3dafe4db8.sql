-- Create a function to insert demo offers for the current user
CREATE OR REPLACE FUNCTION public.insert_demo_offers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the current user's ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to insert demo offers';
  END IF;

  -- Insert 12 diverse demo offers covering all statuses
  
  -- 1. Published Offers (3)
  INSERT INTO public.offers (
    user_id, listing_title, status, offer_type, partner_center_id, website_url,
    short_description, created_at, updated_at
  ) VALUES 
  (
    v_user_id, 
    'CloudSync Pro', 
    'published', 
    'SaaS', 
    'cs-prod-2024-001',
    'https://cloudsync.example.com',
    'Enterprise file synchronization and collaboration platform',
    NOW() - INTERVAL '3 months',
    NOW() - INTERVAL '2 months'
  ),
  (
    v_user_id,
    'DataVault Enterprise',
    'published',
    'Azure Application',
    'dv-ent-2024-045',
    'https://datavault.example.com',
    'Advanced security and backup solution for enterprises',
    NOW() - INTERVAL '2 months',
    NOW() - INTERVAL '1 month'
  ),
  (
    v_user_id,
    'Analytics Dashboard Plus',
    'published',
    'SaaS',
    'adp-prod-2024-089',
    'https://analytics-plus.example.com',
    'Real-time business intelligence and analytics platform',
    NOW() - INTERVAL '6 weeks',
    NOW() - INTERVAL '4 weeks'
  ),
  
  -- 2. In Progress Offers (4)
  (
    v_user_id,
    'ProjectHub Workspace',
    'submitted',
    'SaaS',
    NULL,
    'https://projecthub.example.com',
    'Complete project management and team collaboration tool',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
  ),
  (
    v_user_id,
    'AI Content Generator',
    'in_preview',
    'SaaS',
    NULL,
    'https://ai-content.example.com',
    'AI-powered content creation and marketing automation',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    v_user_id,
    'TeamCollab Suite',
    'in_certification',
    'Azure Application',
    NULL,
    'https://teamcollab.example.com',
    'Integrated suite for team communication and document management',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    v_user_id,
    'SecureAuth Manager',
    'ready_to_publish',
    'SaaS',
    NULL,
    'https://secureauth.example.com',
    'Enterprise authentication and identity management solution',
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '5 hours'
  ),
  
  -- 3. Draft Offers (3)
  (
    v_user_id,
    'CustomerFlow CRM',
    'draft',
    'SaaS',
    NULL,
    'https://customerflow.example.com',
    'Customer relationship management with AI insights',
    NOW() - INTERVAL '1 week',
    NOW() - INTERVAL '2 days'
  ),
  (
    v_user_id,
    NULL,  -- Untitled offer
    'draft',
    'SaaS',
    NULL,
    'https://newproject.example.com',
    NULL,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    v_user_id,
    'Inventory Master',
    'generating',
    'SaaS',
    NULL,
    'https://inventory-master.example.com',
    'Smart inventory tracking and warehouse management',
    NOW() - INTERVAL '3 minutes',
    NOW() - INTERVAL '3 minutes'
  ),
  
  -- 4. Failed Offers (2)
  (
    v_user_id,
    'PaymentPro Gateway',
    'failed',
    'SaaS',
    NULL,
    'https://paymentpro.example.com',
    'Secure payment processing and gateway integration',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    v_user_id,
    'DocuSign Connector',
    'failed',
    'Azure Application',
    NULL,
    'https://docusign-connect.example.com',
    'Digital signature and document workflow automation',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  );
  
  -- Update error messages for failed offers
  UPDATE public.offers 
  SET error_message = 'Validation failed: Invalid webhook URL format. Please ensure the webhook endpoint is publicly accessible and returns a valid response.'
  WHERE user_id = v_user_id AND listing_title = 'PaymentPro Gateway';
  
  UPDATE public.offers 
  SET error_message = 'Certification rejected: Missing required legal documentation. Please upload privacy policy, terms of service, and support documentation.'
  WHERE user_id = v_user_id AND listing_title = 'DocuSign Connector';
  
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.insert_demo_offers() TO authenticated;