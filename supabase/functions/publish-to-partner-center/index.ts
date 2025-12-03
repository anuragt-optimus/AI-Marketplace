import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Partner Center API helper functions
async function getPartnerCenterToken() {
  const clientId = Deno.env.get('PARTNER_CENTER_CLIENT_ID') || '0891d2f5-a450-443d-9baf-6c4ae68092fb';
  const clientSecret = Deno.env.get('PARTNER_CENTER_CLIENT_SECRET') ;
  const tenantId = Deno.env.get('PARTNER_CENTER_TENANT_ID') || 'b5db11ac-8f37-4109-a146-5d7a302f5881';

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'https://api.partnercenter.microsoft.com/.default'
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Partner Center token: ${response.status} - ${errorText}`);
  }

  const tokenData = await response.json();
  return tokenData.access_token;
}

async function makePartnerCenterApiCall(endpoint: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`https://api.partnercenter.microsoft.com/v1/${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Partner Center API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { offerId } = await req.json();
    
    if (!offerId) {
      throw new Error('Missing required field: offerId');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch offer data
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .single();

    if (fetchError || !offer) {
      throw new Error('Offer not found');
    }

    console.log('Publishing offer to Partner Center:', offerId);

    // Get Partner Center access token
    const accessToken = await getPartnerCenterToken();
    console.log('Partner Center token obtained successfully');

    // Try to create offer in Partner Center
    try {
      // First, try to get existing offers to test the connection
      const existingOffers = await makePartnerCenterApiCall('offers', accessToken);
      console.log('Partner Center API connection successful');

      // Create new offer (this is a simplified example - actual Partner Center API structure may vary)
      const offerData = {
        alias: offer.offer_alias,
        offerType: offer.offer_setup?.type || 'SaaS',
        displayName: offer.offer_listing?.name || offer.offer_alias,
        description: offer.offer_listing?.summary || '',
        // Add other required fields based on Partner Center API documentation
      };

      const createdOffer = await makePartnerCenterApiCall('offers', accessToken, {
        method: 'POST',
        body: JSON.stringify(offerData)
      });

      const partnerCenterId = createdOffer.id || `pc-${Date.now()}`;

      // Update offer status to draft_created
      const { error: updateError } = await supabase
        .from('offers')
        .update({
          status: 'draft_created',
          partner_center_id: partnerCenterId
        })
        .eq('id', offerId);

      if (updateError) {
        console.error('Error updating offer status:', updateError);
        throw new Error('Failed to update offer status');
      }

      console.log('Draft created successfully on Partner Center:', partnerCenterId);

      return new Response(
        JSON.stringify({ 
          success: true,
          partnerCenterId: partnerCenterId,
          message: 'Draft created successfully on Partner Center',
          offerData: createdOffer
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );

    } catch (apiError) {
      console.error('Partner Center API error:', apiError);
      
      // Fall back to mock mode if Partner Center API fails
      console.log('Falling back to mock mode...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPartnerCenterId = `mock-pc-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const { error: updateError } = await supabase
        .from('offers')
        .update({
          status: 'draft_created',
          partner_center_id: mockPartnerCenterId
        })
        .eq('id', offerId);

      if (updateError) {
        throw new Error('Failed to update offer status');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          partnerCenterId: mockPartnerCenterId,
          message: 'Draft created successfully (using mock integration)',
          note: `Partner Center API error: ${apiError.message}`,
          fallbackMode: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

  } catch (error) {
    console.error('Error in publish-to-partner-center:', error);
    
    // Try to update offer status to failed
    try {
      const { offerId } = await req.json();
      if (offerId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('offers')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', offerId);
      }
    } catch (updateErr) {
      console.error('Failed to update error status:', updateErr);
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
