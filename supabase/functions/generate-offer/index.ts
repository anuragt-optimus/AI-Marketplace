import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { offerId, websiteUrl, offerType, offerAlias } = await req.json();

    console.log('Starting offer generation:', { offerId, websiteUrl, offerType, offerAlias });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get API key
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Update offer status to generating
    await supabase
      .from('offers')
      .update({ status: 'generating' })
      .eq('id', offerId);

    // Construct comprehensive AI prompt for all sections
    const prompt = `You are a Microsoft Partner Center SaaS offer specialist. Analyze the website at ${websiteUrl} and generate a complete marketplace offer listing.

Generate a JSON response with ALL of the following sections:

1. **Offer Setup**:
   - offerAlias: "${offerAlias}"
   - sellThroughMicrosoft: true/false (default true)
   - licenseManagement: "microsoft" or "partner"
   - usesGraphAPI: true/false (detect if they mention Microsoft Graph API)
   - integratesWithTeamsM365: true/false (detect Teams/M365 integration)
   - marketplaceLinks: [] (find any Microsoft AppSource/Teams store links)

2. **Properties**:
   - categories.primary: select ONE from (Collaboration, Productivity, Sales, Marketing, Customer Service, Finance, HR, IT & Management, Analytics, Industry Solutions)
   - categories.secondary: select up to 2 additional categories
   - industries: [] (e.g., Financial Services, Healthcare, Retail, Manufacturing, etc.)
   - appVersion: "1.0.0" or detect from website
   - privacyPolicyUrl: find privacy policy URL
   - termsOfUseUrl: find terms of service/use URL

3. **Offer Listing** (CRITICAL - High quality content):
   - name: Extract product name (max 50 chars)
   - searchSummary: Write compelling 50-160 char summary for search results
   - shortDescription: Write engaging 2000 char overview highlighting key benefits
   - description: Write detailed 3000 char description with:
     * What the product does
     * Key features (use bullet points)
     * Who it's for
     * Why choose this solution
   - gettingStartedInstructions: Step-by-step guide (max 3000 chars)
   - contacts.support: { name, email } - find support contact info
   - contacts.engineering: { name, email } - find technical contact or use support
   - supportUrl: find support/help URL
   - websiteUrl: "${websiteUrl}"
   - certifications: [] (detect SOC2, ISO27001, GDPR, HIPAA mentions)

4. **Technical Configuration**:
   - landingPageUrl: suggest "${websiteUrl}/marketplace-landing" or similar
   - connectionWebhook: suggest "${websiteUrl}/api/microsoft/webhook" or similar
   - entraAppId: "" (leave empty - manual input required)
   - entraTenantId: "" (leave empty - manual input required)

5. **Plans** (Create 1 default plan):
   - id: "plan-standard"
   - name: "Standard Plan" or detect from pricing page
   - description: Describe what's included in this plan
   - markets: ["US"] (default)
   - pricingModel: "flatRate" or "perUser" (detect from website)
   - price: detect pricing or suggest 99
   - billingPeriod: "monthly", "annual", or "both"
   - freeTrial: { enabled: true/false (detect), duration: 30 }
   - visibility: "public"
   - features: [] (list of features included in this plan)

6. **Resell CSPs**:
   - resellThroughCSP: "all" (default recommendation)

7. **Supplemental Content**:
   - saasScenario: "fullyHosted", "partiallyHosted", or "notHosted" (detect Azure mentions)

IMPORTANT:
- Extract real information from the website when available
- Generate professional, compelling marketing copy
- Use bullet points in descriptions for readability
- All URLs must be valid format
- Email addresses must be valid format
- Be specific and detailed, not generic
- Ensure searchSummary is attention-grabbing for marketplace search results`;

    const tools = [{
      type: "function",
      function: {
        name: "generate_offer_data",
        description: "Generate complete SaaS offer data for Microsoft Partner Center",
        parameters: {
          type: "object",
          properties: {
            offerSetup: {
              type: "object",
              properties: {
                offerAlias: { type: "string" },
                sellThroughMicrosoft: { type: "boolean" },
                licenseManagement: { type: "string", enum: ["microsoft", "partner"] },
                customerLeads: {
                  type: "object",
                  properties: {
                    enabled: { type: "boolean" },
                    isConnected: { type: "boolean" }
                  }
                },
                microsoftIntegrations: {
                  type: "object",
                  properties: {
                    usesGraphAPI: { type: "boolean" },
                    integratesWithTeamsM365: { type: "boolean" },
                    marketplaceLinks: { type: "array", items: { type: "string" } }
                  }
                }
              },
              required: ["offerAlias", "sellThroughMicrosoft", "licenseManagement", "microsoftIntegrations"]
            },
            properties: {
              type: "object",
              properties: {
                categories: {
                  type: "object",
                  properties: {
                    primary: { type: "string" },
                    secondary: { type: "array", items: { type: "string" } }
                  }
                },
                industries: { type: "array", items: { type: "string" } },
                appVersion: { type: "string" },
                legalInfo: {
                  type: "object",
                  properties: {
                    useStandardContract: { type: "boolean" },
                    privacyPolicyUrl: { type: "string" },
                    termsOfUseUrl: { type: "string" }
                  }
                }
              },
              required: ["categories", "legalInfo"]
            },
            offerListing: {
              type: "object",
              properties: {
                name: { type: "string" },
                searchSummary: { type: "string" },
                shortDescription: { type: "string" },
                description: { type: "string" },
                gettingStartedInstructions: { type: "string" },
                contacts: {
                  type: "object",
                  properties: {
                    support: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        email: { type: "string" }
                      }
                    },
                    engineering: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        email: { type: "string" }
                      }
                    }
                  }
                },
                supportUrl: { type: "string" },
                websiteUrl: { type: "string" },
                privacyPolicyUrl: { type: "string" },
                termsOfUseUrl: { type: "string" },
                media: {
                  type: "object",
                  properties: {
                    logos: { type: "object" },
                    screenshots: { type: "array", items: { type: "string" } },
                    videos: { type: "array", items: { type: "string" } }
                  }
                },
                certifications: { type: "array", items: { type: "string" } }
              },
              required: ["name", "searchSummary", "shortDescription", "description", "contacts"]
            },
            technicalConfig: {
              type: "object",
              properties: {
                landingPageUrl: { type: "string" },
                connectionWebhook: { type: "string" },
                entraAppId: { type: "string" },
                entraTenantId: { type: "string" }
              },
              required: ["landingPageUrl", "connectionWebhook"]
            },
            plans: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  description: { type: "string" },
                  markets: { type: "array", items: { type: "string" } },
                  pricingModel: { type: "string", enum: ["flatRate", "perUser"] },
                  price: { type: "number" },
                  billingPeriod: { type: "string", enum: ["monthly", "annual", "both"] },
                  freeTrial: {
                    type: "object",
                    properties: {
                      enabled: { type: "boolean" },
                      duration: { type: "number" }
                    }
                  },
                  visibility: { type: "string", enum: ["public", "private"] },
                  features: { type: "array", items: { type: "string" } }
                },
                required: ["id", "name", "description", "markets", "pricingModel", "price"]
              }
            },
            resellCSP: {
              type: "object",
              properties: {
                resellThroughCSP: { type: "string", enum: ["all", "specific", "none"] },
                specificCSPs: { type: "array", items: { type: "string" } }
              },
              required: ["resellThroughCSP"]
            },
            supplementalContent: {
              type: "object",
              properties: {
                saasScenario: { type: "string", enum: ["fullyHosted", "partiallyHosted", "notHosted"] },
                subscriptionIds: { type: "array", items: { type: "string" } }
              },
              required: ["saasScenario"]
            }
          },
          required: ["offerSetup", "properties", "offerListing", "technicalConfig", "plans", "resellCSP", "supplementalContent"]
        }
      }
    }];

    console.log('Calling Lovable AI API...');

    // Call Lovable AI API
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: tools,
        tool_choice: { type: "function", function: { name: "generate_offer_data" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API request failed: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    // Extract tool call result
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const generatedData = JSON.parse(toolCall.function.arguments);
    console.log('Generated data parsed successfully');

    // Initialize empty media structure
    generatedData.offerListing.media = {
      logos: {},
      screenshots: [],
      videos: []
    };

    // Update offer with all generated data
    const { error: updateError } = await supabase
      .from('offers')
      .update({
        status: 'draft',
        offer_alias: offerAlias,
        offer_setup: generatedData.offerSetup,
        properties: generatedData.properties,
        offer_listing: generatedData.offerListing,
        preview_audience: { previewAudience: [] },
        technical_config: generatedData.technicalConfig,
        plans: generatedData.plans,
        resell_csp: generatedData.resellCSP,
        supplemental_content: generatedData.supplementalContent,
        // Also update legacy fields for backward compatibility
        listing_title: generatedData.offerListing.name,
        short_description: generatedData.offerListing.shortDescription,
        long_description: generatedData.offerListing.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    console.log('Offer generation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        offerId: offerId,
        message: 'Offer generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error generating offer:', error);
    
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
