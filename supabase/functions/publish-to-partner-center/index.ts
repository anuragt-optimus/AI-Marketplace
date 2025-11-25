import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log('Publishing offer to Partner Center (MOCK):', offerId);

    // MOCK: Simulate Partner Center API call
    // In production, this would:
    // 1. Authenticate with Microsoft Partner Center API
    // 2. Create or update the offer listing
    // 3. Upload assets (icons, screenshots)
    // 4. Submit for review
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock Partner Center ID
    const mockPartnerCenterId = `pc-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Update offer status to draft_created
    const { error: updateError } = await supabase
      .from('offers')
      .update({
        status: 'draft_created',
        partner_center_id: mockPartnerCenterId
      })
      .eq('id', offerId);

    if (updateError) {
      console.error('Error updating offer status:', updateError);
      throw new Error('Failed to update offer status');
    }

    console.log('Draft created successfully on Partner Center (MOCK):', mockPartnerCenterId);

    return new Response(
      JSON.stringify({ 
        success: true,
        partnerCenterId: mockPartnerCenterId,
        message: 'Draft created successfully on Partner Center (using mock integration)',
        note: 'Add MICROSOFT_PARTNER_CENTER_* secrets to enable real Partner Center integration'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

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
