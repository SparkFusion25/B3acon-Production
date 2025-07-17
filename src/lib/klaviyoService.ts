interface KlaviyoConfig {
  apiKey: string;
  baseUrl: string;
}

interface KlaviyoProfile {
  email: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  properties?: Record<string, any>;
}

interface KlaviyoList {
  id: string;
  name: string;
  created: string;
  updated: string;
}

interface KlaviyoMetric {
  id: string;
  name: string;
  integration: {
    object: string;
  };
}

interface EmailCampaign {
  id?: string;
  name: string;
  subject: string;
  from_email: string;
  from_name: string;
  list_id: string;
  template_id?: string;
  content?: {
    html: string;
    text: string;
  };
  send_time?: string;
  is_segmented?: boolean;
}

class KlaviyoService {
  private config: KlaviyoConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_KLAVIYO_API_KEY || '',
      baseUrl: 'https://a.klaviyo.com/api'
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Klaviyo-API-Key ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'revision': '2024-02-15',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Klaviyo API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Klaviyo API request failed:', error);
      throw error;
    }
  }

  // Profile Management
  async createProfile(profile: KlaviyoProfile): Promise<any> {
    return this.makeRequest('/profiles/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: profile
        }
      })
    });
  }

  async getProfile(profileId: string): Promise<any> {
    return this.makeRequest(`/profiles/${profileId}/`);
  }

  async updateProfile(profileId: string, updates: Partial<KlaviyoProfile>): Promise<any> {
    return this.makeRequest(`/profiles/${profileId}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          type: 'profile',
          id: profileId,
          attributes: updates
        }
      })
    });
  }

  async searchProfiles(email: string): Promise<any> {
    const params = new URLSearchParams({
      'filter': `equals(email,"${email}")`
    });
    return this.makeRequest(`/profiles/?${params}`);
  }

  // List Management
  async getLists(): Promise<KlaviyoList[]> {
    const response = await this.makeRequest('/lists/');
    return response.data || [];
  }

  async createList(name: string): Promise<any> {
    return this.makeRequest('/lists/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'list',
          attributes: { name }
        }
      })
    });
  }

  async addProfileToList(listId: string, profileId: string): Promise<any> {
    return this.makeRequest(`/lists/${listId}/relationships/profiles/`, {
      method: 'POST',
      body: JSON.stringify({
        data: [{
          type: 'profile',
          id: profileId
        }]
      })
    });
  }

  async addProfileToListByEmail(listId: string, email: string, additionalData: Partial<KlaviyoProfile> = {}): Promise<any> {
    // First, create or update the profile
    const profileData = {
      email,
      ...additionalData
    };

    try {
      const profileResponse = await this.createProfile(profileData);
      const profileId = profileResponse.data.id;
      
      // Then add to list
      return await this.addProfileToList(listId, profileId);
    } catch (error) {
      // If profile already exists, search for it and add to list
      const searchResponse = await this.searchProfiles(email);
      if (searchResponse.data && searchResponse.data.length > 0) {
        const profileId = searchResponse.data[0].id;
        return await this.addProfileToList(listId, profileId);
      }
      throw error;
    }
  }

  // Email Campaign Management
  async createCampaign(campaign: EmailCampaign): Promise<any> {
    return this.makeRequest('/campaigns/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'campaign',
          attributes: {
            name: campaign.name,
            subject: campaign.subject,
            from_email: campaign.from_email,
            from_name: campaign.from_name,
            list_ids: [campaign.list_id],
            template_id: campaign.template_id,
            content: campaign.content,
            send_time: campaign.send_time,
            is_segmented: campaign.is_segmented || false
          }
        }
      })
    });
  }

  async getCampaigns(): Promise<any> {
    return this.makeRequest('/campaigns/');
  }

  async sendCampaign(campaignId: string): Promise<any> {
    return this.makeRequest(`/campaigns/${campaignId}/send/`, {
      method: 'POST'
    });
  }

  // Segment Management
  async createSegment(name: string, listId: string, definition: any): Promise<any> {
    return this.makeRequest('/segments/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'segment',
          attributes: {
            name,
            list_id: listId,
            definition
          }
        }
      })
    });
  }

  // Flow Management (for automated email sequences)
  async getFlows(): Promise<any> {
    return this.makeRequest('/flows/');
  }

  async triggerFlow(flowId: string, email: string, properties: Record<string, any> = {}): Promise<any> {
    return this.makeRequest('/flow-actions/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'flow-action',
          attributes: {
            flow_id: flowId,
            email,
            properties
          }
        }
      })
    });
  }

  // Metrics and Analytics
  async getMetrics(): Promise<KlaviyoMetric[]> {
    const response = await this.makeRequest('/metrics/');
    return response.data || [];
  }

  async getMetricTimeline(metricId: string, since?: string, until?: string): Promise<any> {
    const params = new URLSearchParams();
    if (since) params.append('since', since);
    if (until) params.append('until', until);
    
    return this.makeRequest(`/metrics/${metricId}/export/?${params}`);
  }

  // Event Tracking
  async trackEvent(event: string, customerProperties: KlaviyoProfile, eventProperties: Record<string, any> = {}): Promise<any> {
    return this.makeRequest('/events/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            metric: { name: event },
            profile: customerProperties,
            properties: eventProperties,
            time: new Date().toISOString()
          }
        }
      })
    });
  }

  // Templates
  async getTemplates(): Promise<any> {
    return this.makeRequest('/templates/');
  }

  async createTemplate(name: string, html: string, text?: string): Promise<any> {
    return this.makeRequest('/templates/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'template',
          attributes: {
            name,
            html,
            text: text || ''
          }
        }
      })
    });
  }

  // Helper Methods
  async validateApiKey(): Promise<boolean> {
    try {
      await this.makeRequest('/accounts/');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAccountInfo(): Promise<any> {
    return this.makeRequest('/accounts/');
  }

  // Bulk Operations
  async bulkCreateProfiles(profiles: KlaviyoProfile[]): Promise<any> {
    const data = profiles.map(profile => ({
      type: 'profile',
      attributes: profile
    }));

    return this.makeRequest('/profile-bulk-import-jobs/', {
      method: 'POST',
      body: JSON.stringify({ data })
    });
  }

  async bulkAddProfilesToList(listId: string, emails: string[]): Promise<any> {
    const profiles = emails.map(email => ({ email }));
    
    // Create profiles first
    const bulkCreateResponse = await this.bulkCreateProfiles(profiles);
    
    // Then add to list
    const data = emails.map(email => ({
      type: 'profile',
      attributes: { email }
    }));

    return this.makeRequest(`/lists/${listId}/profiles/`, {
      method: 'POST',
      body: JSON.stringify({ data })
    });
  }

  // Shopify Integration Helpers
  async createShopifyCustomerSegment(listId: string): Promise<any> {
    const definition = {
      condition_groups: [{
        conditions: [{
          field: 'properties.shopify_customer',
          operator: 'equals',
          value: true
        }]
      }]
    };

    return this.createSegment('Shopify Customers', listId, definition);
  }

  async trackShopifyPurchase(email: string, orderData: any): Promise<any> {
    return this.trackEvent('Placed Order', 
      { email }, 
      {
        '$event_id': orderData.id,
        '$value': orderData.total_price,
        'Total Price': orderData.total_price,
        'Order ID': orderData.order_number,
        'Categories': orderData.line_items?.map((item: any) => item.product_type) || [],
        'Item Names': orderData.line_items?.map((item: any) => item.title) || [],
        'Discount Codes': orderData.discount_codes || []
      }
    );
  }

  async createAbandonedCartFlow(email: string, cartData: any): Promise<any> {
    return this.trackEvent('Started Checkout',
      { email },
      {
        '$event_id': cartData.token,
        '$value': cartData.total_price,
        'Total Price': cartData.total_price,
        'Item Names': cartData.line_items?.map((item: any) => item.title) || [],
        'Categories': cartData.line_items?.map((item: any) => item.product_type) || [],
        'Images': cartData.line_items?.map((item: any) => item.image_url) || []
      }
    );
  }
}

export const klaviyoService = new KlaviyoService();
export default klaviyoService;