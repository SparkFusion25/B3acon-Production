import axios from 'axios';

const KLAVIYO_API_BASE_URL = 'https://a.klaviyo.com/api';
const KLAVIYO_API_VERSION = '2024-02-15';

interface KlaviyoConfig {
  privateApiKey: string;
  publicApiKey: string;
}

interface KlaviyoProfile {
  id: string;
  type: string;
  attributes: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    external_id?: string;
    location?: any;
    properties?: any;
  };
}

interface KlaviyoList {
  id: string;
  type: string;
  attributes: {
    name: string;
    created: string;
    updated: string;
    profile_count: number;
  };
}

interface KlaviyoCampaign {
  id: string;
  type: string;
  attributes: {
    name: string;
    status: string;
    archived: boolean;
    audiences: any;
    send_options: any;
    tracking_options: any;
    send_strategy: any;
    created_at: string;
    scheduled_at?: string;
    updated_at: string;
  };
}

interface KlaviyoSegment {
  id: string;
  type: string;
  attributes: {
    name: string;
    definition: any;
    created: string;
    updated: string;
    profile_count: number;
  };
}

class KlaviyoAPI {
  private privateApiKey: string;
  private publicApiKey: string;

  constructor(config: KlaviyoConfig) {
    this.privateApiKey = config.privateApiKey;
    this.publicApiKey = config.publicApiKey;
  }

  private getHeaders() {
    return {
      'Authorization': `Klaviyo-API-Key ${this.privateApiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'revision': KLAVIYO_API_VERSION,
    };
  }

  // Profile Management
  async createProfile(profileData: Partial<KlaviyoProfile['attributes']>): Promise<KlaviyoProfile> {
    try {
      const response = await axios.post(
        `${KLAVIYO_API_BASE_URL}/profiles/`,
        {
          data: {
            type: 'profile',
            attributes: profileData,
          },
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating Klaviyo profile:', error);
      throw error;
    }
  }

  async getProfile(profileId: string): Promise<KlaviyoProfile> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/profiles/${profileId}/`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Klaviyo profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId: string, profileData: Partial<KlaviyoProfile['attributes']>): Promise<KlaviyoProfile> {
    try {
      const response = await axios.patch(
        `${KLAVIYO_API_BASE_URL}/profiles/${profileId}/`,
        {
          data: {
            type: 'profile',
            id: profileId,
            attributes: profileData,
          },
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating Klaviyo profile:', error);
      throw error;
    }
  }

  async getProfiles(limit: number = 100): Promise<KlaviyoProfile[]> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/profiles/?page[size]=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Klaviyo profiles:', error);
      throw error;
    }
  }

  // List Management
  async getLists(): Promise<KlaviyoList[]> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/lists/`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Klaviyo lists:', error);
      throw error;
    }
  }

  async createList(name: string): Promise<KlaviyoList> {
    try {
      const response = await axios.post(
        `${KLAVIYO_API_BASE_URL}/lists/`,
        {
          data: {
            type: 'list',
            attributes: {
              name,
            },
          },
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating Klaviyo list:', error);
      throw error;
    }
  }

  async addProfileToList(listId: string, profileId: string): Promise<void> {
    try {
      await axios.post(
        `${KLAVIYO_API_BASE_URL}/lists/${listId}/relationships/profiles/`,
        {
          data: [
            {
              type: 'profile',
              id: profileId,
            },
          ],
        },
        {
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('Error adding profile to Klaviyo list:', error);
      throw error;
    }
  }

  // Campaign Management
  async getCampaigns(): Promise<KlaviyoCampaign[]> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/campaigns/`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Klaviyo campaigns:', error);
      throw error;
    }
  }

  async createCampaign(campaignData: any): Promise<KlaviyoCampaign> {
    try {
      const response = await axios.post(
        `${KLAVIYO_API_BASE_URL}/campaigns/`,
        {
          data: {
            type: 'campaign',
            attributes: campaignData,
          },
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating Klaviyo campaign:', error);
      throw error;
    }
  }

  async sendCampaign(campaignId: string, scheduledAt?: string): Promise<void> {
    try {
      const sendData: any = {
        data: {
          type: 'campaign-send-job',
          attributes: {
            send_strategy: {
              method: scheduledAt ? 'scheduled' : 'immediate',
            },
          },
        },
      };

      if (scheduledAt) {
        sendData.data.attributes.send_strategy.options_static = {
          datetime: scheduledAt,
        };
      }

      await axios.post(
        `${KLAVIYO_API_BASE_URL}/campaigns/${campaignId}/send/`,
        sendData,
        {
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('Error sending Klaviyo campaign:', error);
      throw error;
    }
  }

  // Segment Management
  async getSegments(): Promise<KlaviyoSegment[]> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/segments/`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Klaviyo segments:', error);
      throw error;
    }
  }

  // Event Tracking
  async trackEvent(profileId: string, eventName: string, properties?: any): Promise<void> {
    try {
      await axios.post(
        `${KLAVIYO_API_BASE_URL}/events/`,
        {
          data: {
            type: 'event',
            attributes: {
              properties: {
                ...properties,
                $email: profileId, // Assuming profileId is email for tracking
              },
              metric: {
                data: {
                  type: 'metric',
                  attributes: {
                    name: eventName,
                  },
                },
              },
            },
          },
        },
        {
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('Error tracking Klaviyo event:', error);
      throw error;
    }
  }

  // Analytics
  async getCampaignAnalytics(campaignId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/campaigns/${campaignId}/campaign-messages/`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      throw error;
    }
  }

  async getListAnalytics(listId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/lists/${listId}/profiles/`,
        {
          headers: this.getHeaders(),
        }
      );
      return {
        profileCount: response.data.data.length,
        profiles: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching list analytics:', error);
      throw error;
    }
  }

  // Flow Management (Email Automation)
  async getFlows(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/flows/`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Klaviyo flows:', error);
      throw error;
    }
  }

  // Email Templates
  async getTemplates(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE_URL}/templates/`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Klaviyo templates:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const createKlaviyoAPI = (config: KlaviyoConfig) => new KlaviyoAPI(config);

// Default configuration from environment variables
export const getKlaviyoConfig = (): KlaviyoConfig => ({
  privateApiKey: import.meta.env.VITE_KLAVIYO_API_KEY || '',
  publicApiKey: import.meta.env.VITE_KLAVIYO_PUBLIC_KEY || '',
});

export default KlaviyoAPI;