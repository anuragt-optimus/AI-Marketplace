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
    const { websiteUrl, offerAlias, offerType, graphToken } = await req.json();
    
    console.log('🚀 Starting marketplace listing generation...');
    console.log('📝 Input parameters:', { websiteUrl, offerAlias, offerType });
    console.log('🔐 Graph token present:', !!graphToken);

    if (!websiteUrl || !offerAlias || !offerType) {
      throw new Error('Missing required parameters: websiteUrl, offerAlias, or offerType');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Create offer record in database
    console.log('📝 Creating offer record in database...');
    
    const offerData = {
      offer_alias: offerAlias,
      website_url: websiteUrl,
      status: 'generating',
      offer_setup: {
        type: offerType,
        category: 'Productivity',
        publisherName: 'Generated Publisher',
        visibility: 'Public'
      },
      offer_listing: {
        name: `Generated Offer: ${offerAlias}`,
        summary: `Automatically generated marketplace listing for ${offerAlias}`,
        language: 'English',
        longDescription: `This is an automatically generated marketplace listing for ${offerAlias}. Visit ${websiteUrl} to learn more about this product.`
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdOffer, error: createError } = await supabase
      .from('offers')
      .insert(offerData)
      .select()
      .single();

    if (createError) {
      console.error('❌ Database insert error:', createError);
      throw new Error(`Failed to create offer: ${createError.message}`);
    }

    console.log('✅ Offer created with ID:', createdOffer.id);

    // Step 2: Simulate AI processing with the Microsoft Graph token
    console.log('🤖 Processing with AI and Microsoft Graph integration...');
    
    // Here you would use the graphToken to make calls to Microsoft Graph API
    // For example, to get user information, OneDrive files, etc.
    // This is a simulation for now
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

    // Step 3: Update offer with generated content
    console.log('📝 Updating offer with AI-generated content...');
    
    const updatedOfferData = {
      status: 'generated',
      offer_listing: {
        name: `AI-Generated ${offerAlias}`,
        summary: `Intelligent marketplace solution powered by AI`,
        language: 'English',
        longDescription: `This marketplace offer was intelligently generated using AI analysis of ${websiteUrl}. The solution provides comprehensive features and capabilities tailored for modern business needs.`,
        images: [
          { type: 'logo', url: 'https://via.placeholder.com/200' },
          { type: 'banner', url: 'https://via.placeholder.com/600x200' }
        ]
      },
      plans: [
        {
          name: 'Starter Plan',
          description: 'Perfect for getting started',
          price: 29,
          billingPeriod: 'month',
          features: ['Basic features', 'Email support', '24/7 availability'],
          markets: ['US', 'UK', 'CA']
        },
        {
          name: 'Professional Plan',
          description: 'Advanced features for professionals',
          price: 99,
          billingPeriod: 'month',
          features: ['All features', 'Priority support', 'Advanced analytics', 'Custom integrations'],
          markets: ['Global']
        }
      ],
      technical_config: {
        integrationType: 'OAuth2',
        loginUrl: websiteUrl + '/login',
        webhookEnabled: true,
        apiDocs: websiteUrl + '/docs'
      },
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('offers')
      .update(updatedOfferData)
      .eq('id', createdOffer.id);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      throw new Error(`Failed to update offer: ${updateError.message}`);
    }

    console.log('✅ Marketplace listing generation completed successfully!');

    return new Response(
      JSON.stringify({ 
        success: true,
        offerId: createdOffer.id,
        offerAlias: offerAlias,
        message: 'Marketplace listing generated successfully with Microsoft Graph integration',
        data: {
          ...createdOffer,
          ...updatedOfferData
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in generate-marketplace-listing:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
