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
    const { offerId, websiteUrl, section, fieldName, currentValue, userFeedback, existingOfferData } = await req.json();
    
    console.log('Regenerating field:', { offerId, section, fieldName });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build context-aware prompt
    const fieldSpecs = getFieldSpecifications(fieldName);
    const prompt = buildPrompt(fieldName, websiteUrl, currentValue, userFeedback, existingOfferData, fieldSpecs);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert Microsoft Partner Center offer content writer. Generate professional, compelling content that meets Partner Center requirements.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedValue = data.choices[0].message.content.trim();

    console.log('Generated value:', generatedValue);

    return new Response(
      JSON.stringify({ generatedValue }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in regenerate-field:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getFieldSpecifications(fieldName: string): any {
  const specs: Record<string, any> = {
    'name': {
      maxLength: 50,
      guidelines: 'Product name should be clear, memorable, and professional. Avoid generic names.',
      examples: ['DataFlow Analytics Pro', 'TeamSync Collaboration Suite']
    },
    'searchSummary': {
      minLength: 50,
      maxLength: 100,
      guidelines: 'Compelling search result snippet that includes key benefit and target audience. Should make users want to click.',
      examples: ['Transform your data into actionable insights with AI-powered analytics designed for enterprise teams']
    },
    'shortDescription': {
      minLength: 100,
      maxLength: 200,
      guidelines: 'Engaging overview highlighting main value proposition. Include what it does and who it\'s for.',
      examples: ['A comprehensive project management solution that helps teams collaborate effectively, track progress, and deliver projects on time.']
    },
    'description': {
      minLength: 200,
      maxLength: 3000,
      guidelines: 'Detailed description with features, benefits, and use cases. Use markdown formatting with bullet points and headers. Structure: Overview, Key Features, Benefits, Use Cases.',
    },
    'gettingStartedInstructions': {
      maxLength: 3000,
      guidelines: 'Clear step-by-step guide. Structure: 1) Installation/Signup, 2) Initial Configuration, 3) First Use. Use numbered lists.',
    },
    'categories.primary': {
      guidelines: 'Select the most relevant primary category based on the product\'s core functionality.',
    },
    'industries': {
      guidelines: 'Select all relevant industries that would benefit from this product. Focus on primary target markets.',
    },
    'planName': {
      maxLength: 50,
      guidelines: 'Plan name should indicate tier level (Basic, Pro, Enterprise) or target audience.',
    },
    'planDescription': {
      maxLength: 500,
      guidelines: 'Brief description of what makes this plan unique and who it\'s for.',
    },
    'planFeatures': {
      guidelines: 'List of features included in this plan. Be specific and use benefit-driven language.',
    }
  };

  return specs[fieldName] || { guidelines: 'Generate appropriate content for this field.' };
}

function buildPrompt(
  fieldName: string,
  websiteUrl: string,
  currentValue: string | null,
  userFeedback: string | null,
  existingOfferData: any,
  fieldSpecs: any
): string {
  let prompt = `Generate content for the "${fieldName}" field of a Microsoft Partner Center offer.\n\n`;
  
  if (websiteUrl) {
    prompt += `Website URL: ${websiteUrl}\n`;
  }
  
  if (existingOfferData) {
    prompt += `\nExisting Offer Context:\n`;
    if (existingOfferData.offer_listing?.name) {
      prompt += `- Offer Name: ${existingOfferData.offer_listing.name}\n`;
    }
    if (existingOfferData.offer_type) {
      prompt += `- Offer Type: ${existingOfferData.offer_type}\n`;
    }
  }
  
  if (currentValue) {
    prompt += `\nCurrent Value:\n${currentValue}\n`;
    prompt += `\nTask: Improve and refine the above content.`;
  } else {
    prompt += `\nTask: Generate new content from scratch.`;
  }
  
  if (userFeedback) {
    prompt += `\n\nUser Feedback: ${userFeedback}`;
    prompt += `\nIncorporate this feedback into your response.`;
  }
  
  prompt += `\n\nField Specifications:\n`;
  if (fieldSpecs.minLength) prompt += `- Minimum length: ${fieldSpecs.minLength} characters\n`;
  if (fieldSpecs.maxLength) prompt += `- Maximum length: ${fieldSpecs.maxLength} characters\n`;
  if (fieldSpecs.guidelines) prompt += `- Guidelines: ${fieldSpecs.guidelines}\n`;
  if (fieldSpecs.examples) prompt += `- Examples: ${fieldSpecs.examples.join(', ')}\n`;
  
  prompt += `\nIMPORTANT: Return ONLY the generated content for this field. Do not include explanations, headers, or any other text. Just the content itself.`;
  
  return prompt;
}
