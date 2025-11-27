import { supabase } from '@/integrations/supabase/client';

interface PartnerCenterApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}


class PartnerCenterApiService {
  private graphToken: string | null = null;
  private tokenExpiry: Date | null = null;

  // Get Microsoft Graph token for Partner Center operations
  private async getGraphToken(): Promise<string> {
    // Check if we have a valid token
    if (this.graphToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      console.log('Using cached Microsoft Graph token');
      return this.graphToken;
    }

    try {
      console.log('Getting new Microsoft Graph token...');
      
      // Call Supabase Edge Function to get token securely
      const { data, error } = await supabase.functions.invoke('get-graph-token');

      if (error) {
        throw new Error(error.message || 'Failed to get token from backend');
      }

      if (data?.access_token) {
        this.graphToken = data.access_token;
        // Set expiry to 5 minutes before actual expiry for safety
        this.tokenExpiry = new Date(Date.now() + (data.expires_in - 300) * 1000);
        console.log('Microsoft Graph token obtained successfully');
        return this.graphToken;
      } else {
        throw new Error('Invalid token response');
      }

    } catch (error) {
      console.error('Error getting Microsoft Graph token:', error);
      throw error;
    }
  }

  // Use Supabase Edge Function instead of direct API calls
  async callPartnerCenterFunction(functionName: string, payload: any): Promise<PartnerCenterApiResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) {
        console.error(`Supabase function ${functionName} error:`, error);
        throw new Error(error.message || `Failed to call ${functionName}`);
      }

      return {
        success: true,
        data: data,
        message: data?.message
      };
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate marketplace listing with Microsoft Graph integration
  async generateMarketplaceListing(websiteUrl: string, offerAlias: string, offerType: string): Promise<PartnerCenterApiResponse> {
    try {
      console.log('🚀 Starting marketplace listing generation...');
      console.log('📝 Parameters:', { websiteUrl, offerAlias, offerType });
      
      // Step 1: Get Microsoft Graph token
      const token = await this.getGraphToken();
      console.log('✅ Microsoft Graph token obtained');

      // Step 2: Call marketplace generation function
      const result = await this.callPartnerCenterFunction('generate-marketplace-listing', {
        websiteUrl,
        offerAlias,
        offerType,
        graphToken: token
      });

      console.log('✅ Marketplace listing generation completed:', result);
      return result;

    } catch (error) {
      console.error('❌ Marketplace listing generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async publishToPartnerCenter(offerId: string): Promise<PartnerCenterApiResponse> {
    return this.callPartnerCenterFunction('publish-to-partner-center', { offerId });
  }

  // Mock methods for development (these would call Partner Center via Supabase functions)
  async getOffers(): Promise<PartnerCenterApiResponse> {
    console.log('Getting offers via Partner Center...');
    
    // For now, return mock data since we don't have a dedicated function for this
    // In production, you'd create a separate Supabase function for getting offers
    return {
      success: true,
      data: {
        offers: [
          { id: 'mock-offer-1', name: 'Sample Offer 1', status: 'draft' },
          { id: 'mock-offer-2', name: 'Sample Offer 2', status: 'live' }
        ]
      },
      message: 'Mock offers retrieved successfully'
    };
  }

  async getOffer(offerId: string): Promise<PartnerCenterApiResponse> {
    console.log(`Getting offer ${offerId} via Partner Center...`);
    
    return {
      success: true,
      data: {
        id: offerId,
        name: `Mock Offer ${offerId}`,
        status: 'draft'
      },
      message: 'Mock offer retrieved successfully'
    };
  }

  async createOffer(offerData: any): Promise<PartnerCenterApiResponse> {
    console.log('Creating offer via Partner Center...', offerData);
    
    // This would call a Supabase function that handles offer creation
    return {
      success: true,
      data: {
        id: `mock-${Date.now()}`,
        ...offerData
      },
      message: 'Mock offer created successfully'
    };
  }

  async updateOffer(offerId: string, offerData: any): Promise<PartnerCenterApiResponse> {
    console.log(`Updating offer ${offerId} via Partner Center...`, offerData);
    
    return {
      success: true,
      data: {
        id: offerId,
        ...offerData
      },
      message: 'Mock offer updated successfully'
    };
  }

  async getOfferStatus(offerId: string): Promise<PartnerCenterApiResponse> {
    console.log(`Getting offer status for ${offerId}...`);
    
    return {
      success: true,
      data: {
        id: offerId,
        status: 'draft',
        lastUpdated: new Date().toISOString()
      },
      message: 'Mock offer status retrieved successfully'
    };
  }
}

export const partnerCenterApi = new PartnerCenterApiService();
