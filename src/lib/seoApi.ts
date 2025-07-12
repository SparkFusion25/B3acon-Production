// SEO API client for frontend
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Base URL for the SEO API edge function
const SEO_API_BASE_URL = `${SUPABASE_URL}/functions/v1/seo-api`;

// Helper function to make API requests
const fetchWithAuth = async (endpoint: string, params: Record<string, string>) => {
  try {
    // Convert params to URL search params
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    // Make the request to the edge function
    const response = await fetch(`${SEO_API_BASE_URL}/${endpoint}?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in SEO API (${endpoint}):`, error);
    throw error;
  }
};

// SEO API client
export const seoApi = {
  // Onpage SEO analysis
  getOnpageAnalysis: (domain: string) => 
    fetchWithAuth('onpage-analyze', { domain }),
  
  // Page speed data
  getSpeedData: (url: string) => 
    fetchWithAuth('speed-data', { url }),
  
  // Domain data
  getDomainData: (domain: string) => 
    fetchWithAuth('domain-data', { domain }),
  
  // Backlinks
  getBacklinks: (domain: string) => 
    fetchWithAuth('backlinks', { domain }),
  
  // URL specific backlinks
  getUrlBacklinks: (url: string) => 
    fetchWithAuth('url-backlinks', { url }),
  
  // New backlinks
  getNewBacklinks: (domain: string) => 
    fetchWithAuth('new-backlinks', { domain }),
  
  // Poor backlinks
  getPoorBacklinks: (domain: string) => 
    fetchWithAuth('poor-backlinks', { domain }),
  
  // Referral domains
  getReferralDomains: (domain: string) => 
    fetchWithAuth('referral-domains', { domain }),
  
  // Top keywords
  getTopKeywords: (domain: string) => 
    fetchWithAuth('top-keywords', { domain })
};

export default seoApi;