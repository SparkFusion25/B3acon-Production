import { serpApiService } from './serpApiService';

interface ShopifyStoreData {
  id: string;
  domain: string;
  shopName: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    address1?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
  analytics: {
    estimatedRevenue?: string;
    trafficRank?: number;
    monthlyVisitors?: number;
    technologies?: string[];
    apps?: ShopifyApp[];
    lastUpdated?: string;
  };
  business: {
    industry?: string;
    employeeCount?: string;
    foundedYear?: number;
    businessModel?: string;
  };
  marketing: {
    hasEmailMarketing?: boolean;
    hasSeo?: boolean;
    hasPaidAds?: boolean;
    hasInfluencerMarketing?: boolean;
    marketingTools?: string[];
  };
  leadScore: number;
  prospectingNotes?: string[];
}

interface ShopifyApp {
  name: string;
  category: string;
  description?: string;
  pricing?: string;
}

interface ProspectingFilters {
  industry?: string[];
  location?: string;
  revenueRange?: {
    min?: number;
    max?: number;
  };
  employeeRange?: {
    min?: number;
    max?: number;
  };
  technologies?: string[];
  hasEmailMarketing?: boolean;
  hasPaidAds?: boolean;
  excludeDomains?: string[];
}

interface ProspectingResults {
  stores: ShopifyStoreData[];
  totalFound: number;
  searchQuery: string;
  filters: ProspectingFilters;
  timestamp: string;
}

class ShopifyProspectingService {
  private readonly shopifyDomainPatterns = [
    '.myshopify.com',
    'powered by shopify',
    'shopify-section',
    'Shopify.theme',
    'shopify.com/s/files',
    'cdn.shopify.com'
  ];

  private readonly industryKeywords = {
    fashion: ['clothing', 'apparel', 'fashion', 'style', 'boutique', 'wear'],
    beauty: ['cosmetics', 'beauty', 'skincare', 'makeup', 'fragrance'],
    home: ['home decor', 'furniture', 'kitchen', 'bedding', 'garden'],
    electronics: ['electronics', 'gadgets', 'tech', 'computers', 'mobile'],
    health: ['health', 'wellness', 'fitness', 'supplements', 'organic'],
    jewelry: ['jewelry', 'watches', 'accessories', 'rings', 'necklaces'],
    sports: ['sports', 'athletic', 'outdoor', 'fitness', 'recreation'],
    food: ['food', 'gourmet', 'snacks', 'beverages', 'organic'],
    pets: ['pet', 'dog', 'cat', 'animal', 'pet supplies'],
    books: ['books', 'education', 'learning', 'publishing']
  };

  // Main prospecting method using SerpAPI
  async findShopifyStores(
    searchTerms: string[],
    filters: ProspectingFilters = {},
    maxResults: number = 50
  ): Promise<ProspectingResults> {
    const stores: ShopifyStoreData[] = [];
    const searchQuery = searchTerms.join(' OR ');

    try {
      // Search for Shopify stores using multiple approaches
      const searchMethods = [
        this.searchByTechnology(searchTerms, filters),
        this.searchByIndustry(searchTerms, filters),
        this.searchByLocation(searchTerms, filters),
        this.searchByCompetitors(searchTerms, filters)
      ];

      const results = await Promise.allSettled(searchMethods);
      
      // Combine and deduplicate results
      const allStores = new Map<string, ShopifyStoreData>();
      
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          for (const store of result.value) {
            if (!allStores.has(store.domain)) {
              allStores.set(store.domain, store);
            }
          }
        }
      }

      // Convert to array and apply filters
      const filteredStores = Array.from(allStores.values())
        .filter(store => this.passesFilters(store, filters))
        .slice(0, maxResults);

      // Enrich store data
      const enrichedStores = await Promise.all(
        filteredStores.map(store => this.enrichStoreData(store))
      );

      return {
        stores: enrichedStores,
        totalFound: enrichedStores.length,
        searchQuery,
        filters,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Shopify prospecting failed:', error);
      throw new Error('Failed to find Shopify stores. Please check your search parameters.');
    }
  }

  // Search by Shopify technology indicators
  private async searchByTechnology(searchTerms: string[], filters: ProspectingFilters): Promise<ShopifyStoreData[]> {
    const stores: ShopifyStoreData[] = [];
    
    // Search for Shopify-powered sites
    for (const term of searchTerms) {
      const queries = [
        `"${term}" site:myshopify.com`,
        `"${term}" "powered by shopify"`,
        `"${term}" inurl:collections OR inurl:products`,
        `"${term}" "shopify-section"`
      ];

      for (const query of queries) {
        try {
          const searchResult = await serpApiService.searchGoogle({
            q: query,
            num: 20,
            gl: filters.location || 'us'
          });

          if (searchResult.organic_results) {
            for (const result of searchResult.organic_results) {
              const store = await this.parseSearchResult(result);
              if (store && this.isShopifyStore(result)) {
                stores.push(store);
              }
            }
          }
        } catch (error) {
          console.error(`Technology search failed for query: ${query}`, error);
        }
      }
    }

    return this.deduplicateStores(stores);
  }

  // Search by industry keywords
  private async searchByIndustry(searchTerms: string[], filters: ProspectingFilters): Promise<ShopifyStoreData[]> {
    const stores: ShopifyStoreData[] = [];
    
    if (filters.industry && filters.industry.length > 0) {
      for (const industry of filters.industry) {
        const keywords = this.industryKeywords[industry as keyof typeof this.industryKeywords] || [industry];
        
        for (const keyword of keywords) {
          const query = `"${keyword}" online store "add to cart" -amazon -ebay -alibaba`;
          
          try {
            const searchResult = await serpApiService.searchGoogle({
              q: query,
              num: 15,
              gl: filters.location || 'us'
            });

            if (searchResult.organic_results) {
              for (const result of searchResult.organic_results) {
                const store = await this.parseSearchResult(result);
                if (store && this.isShopifyStore(result)) {
                  store.business.industry = industry;
                  stores.push(store);
                }
              }
            }
          } catch (error) {
            console.error(`Industry search failed for: ${industry}`, error);
          }
        }
      }
    }

    return this.deduplicateStores(stores);
  }

  // Search by location
  private async searchByLocation(searchTerms: string[], filters: ProspectingFilters): Promise<ShopifyStoreData[]> {
    const stores: ShopifyStoreData[] = [];
    
    if (filters.location) {
      for (const term of searchTerms) {
        const query = `"${term}" "${filters.location}" online store -amazon -marketplace`;
        
        try {
          const searchResult = await serpApiService.searchGoogle({
            q: query,
            num: 15,
            gl: filters.location.toLowerCase().replace(/\s+/g, '').slice(0, 2) || 'us'
          });

          if (searchResult.organic_results) {
            for (const result of searchResult.organic_results) {
              const store = await this.parseSearchResult(result);
              if (store && this.isShopifyStore(result)) {
                stores.push(store);
              }
            }
          }
        } catch (error) {
          console.error(`Location search failed for: ${filters.location}`, error);
        }
      }
    }

    return this.deduplicateStores(stores);
  }

  // Search by analyzing competitors
  private async searchByCompetitors(searchTerms: string[], filters: ProspectingFilters): Promise<ShopifyStoreData[]> {
    const stores: ShopifyStoreData[] = [];
    
    for (const term of searchTerms) {
      const query = `"similar to" OR "competitors of" "${term}" ecommerce store`;
      
      try {
        const searchResult = await serpApiService.searchGoogle({
          q: query,
          num: 10,
          gl: filters.location || 'us'
        });

        if (searchResult.organic_results) {
          for (const result of searchResult.organic_results) {
            // Extract competitor URLs from content
            const competitorUrls = this.extractUrlsFromText(result.snippet || '');
            
            for (const url of competitorUrls) {
              if (await this.isShopifyDomain(url)) {
                const store = await this.createStoreFromUrl(url);
                if (store) {
                  stores.push(store);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Competitor search failed for: ${term}`, error);
      }
    }

    return this.deduplicateStores(stores);
  }

  // Parse search result into store data
  private async parseSearchResult(result: any): Promise<ShopifyStoreData | null> {
    try {
      const domain = new URL(result.link).hostname;
      const store: ShopifyStoreData = {
        id: this.generateStoreId(domain),
        domain,
        shopName: result.title || domain,
        description: result.snippet,
        analytics: {
          lastUpdated: new Date().toISOString(),
          technologies: [],
          apps: []
        },
        business: {},
        marketing: {},
        leadScore: 0
      };

      // Calculate initial lead score
      store.leadScore = this.calculateLeadScore(store, result);

      return store;
    } catch (error) {
      console.error('Failed to parse search result:', error);
      return null;
    }
  }

  // Check if a URL/result is from a Shopify store
  private isShopifyStore(result: any): boolean {
    const text = `${result.link} ${result.title} ${result.snippet}`.toLowerCase();
    return this.shopifyDomainPatterns.some(pattern => text.includes(pattern));
  }

  private async isShopifyDomain(url: string): Promise<boolean> {
    try {
      const domain = new URL(url).hostname;
      
      // Check if it's a myshopify.com domain
      if (domain.includes('.myshopify.com')) {
        return true;
      }

      // Check for Shopify indicators in the page
      const searchQuery = `site:${domain} "powered by shopify" OR "shopify-section"`;
      const result = await serpApiService.searchGoogle({
        q: searchQuery,
        num: 1
      });

      return result.organic_results && result.organic_results.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Enrich store data with additional information
  private async enrichStoreData(store: ShopifyStoreData): Promise<ShopifyStoreData> {
    try {
      // Get additional business information
      const businessInfo = await this.getBusinessInformation(store.domain);
      if (businessInfo) {
        store.email = businessInfo.email;
        store.phone = businessInfo.phone;
        store.address = businessInfo.address;
        store.social = businessInfo.social;
        store.business = { ...store.business, ...businessInfo.business };
      }

      // Analyze marketing tools and presence
      const marketingAnalysis = await this.analyzeMarketingTools(store.domain);
      store.marketing = { ...store.marketing, ...marketingAnalysis };

      // Estimate traffic and revenue
      const trafficData = await this.estimateTrafficAndRevenue(store.domain);
      store.analytics = { ...store.analytics, ...trafficData };

      // Recalculate lead score with enriched data
      store.leadScore = this.calculateEnhancedLeadScore(store);

      // Add prospecting notes
      store.prospectingNotes = this.generateProspectingNotes(store);

      return store;
    } catch (error) {
      console.error(`Failed to enrich store data for ${store.domain}:`, error);
      return store;
    }
  }

  // Get business information using various sources
  private async getBusinessInformation(domain: string): Promise<any> {
    try {
      // Search for contact information
      const queries = [
        `site:${domain} "contact us" OR "about us"`,
        `site:${domain} email OR phone OR address`,
        `"${domain}" contact information`,
        `"${domain}" company information`
      ];

      const results = await Promise.all(
        queries.map(q => serpApiService.searchGoogle({ q, num: 3 }))
      );

      const businessInfo: any = {
        business: {},
        social: {}
      };

      // Extract information from search results
      for (const result of results) {
        if (result.organic_results) {
          for (const item of result.organic_results) {
            const text = `${item.title} ${item.snippet}`.toLowerCase();
            
            // Extract email
            const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (emailMatch && !businessInfo.email) {
              businessInfo.email = emailMatch[1];
            }

            // Extract phone
            const phoneMatch = text.match(/(\+?[\d\s\-\(\)]{10,})/);
            if (phoneMatch && !businessInfo.phone) {
              businessInfo.phone = phoneMatch[1].trim();
            }

            // Extract social media
            if (text.includes('facebook.com/') && !businessInfo.social.facebook) {
              const fbMatch = text.match(/facebook\.com\/([a-zA-Z0-9.]+)/);
              if (fbMatch) businessInfo.social.facebook = `https://facebook.com/${fbMatch[1]}`;
            }

            if (text.includes('instagram.com/') && !businessInfo.social.instagram) {
              const igMatch = text.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
              if (igMatch) businessInfo.social.instagram = `https://instagram.com/${igMatch[1]}`;
            }
          }
        }
      }

      return businessInfo;
    } catch (error) {
      console.error(`Failed to get business info for ${domain}:`, error);
      return null;
    }
  }

  // Analyze marketing tools and digital presence
  private async analyzeMarketingTools(domain: string): Promise<any> {
    try {
      const marketing = {
        hasEmailMarketing: false,
        hasSeo: false,
        hasPaidAds: false,
        hasInfluencerMarketing: false,
        marketingTools: [] as string[]
      };

      // Check for email marketing indicators
      const emailMarketingQuery = `site:${domain} "newsletter" OR "subscribe" OR "klaviyo" OR "mailchimp"`;
      const emailResult = await serpApiService.searchGoogle({
        q: emailMarketingQuery,
        num: 5
      });

      if (emailResult.organic_results && emailResult.organic_results.length > 0) {
        marketing.hasEmailMarketing = true;
        marketing.marketingTools.push('Email Marketing');
      }

      // Check for SEO efforts
      const seoQuery = `site:${domain} blog OR "seo" OR "content marketing"`;
      const seoResult = await serpApiService.searchGoogle({
        q: seoQuery,
        num: 5
      });

      if (seoResult.organic_results && seoResult.organic_results.length > 2) {
        marketing.hasSeo = true;
        marketing.marketingTools.push('SEO/Content Marketing');
      }

      // Check for paid advertising
      const adsQuery = `"${domain}" Google Ads OR Facebook Ads OR Instagram Ads`;
      const adsResult = await serpApiService.searchGoogle({
        q: adsQuery,
        num: 3
      });

      if (adsResult.organic_results && adsResult.organic_results.length > 0) {
        marketing.hasPaidAds = true;
        marketing.marketingTools.push('Paid Advertising');
      }

      return marketing;
    } catch (error) {
      console.error(`Marketing analysis failed for ${domain}:`, error);
      return {
        hasEmailMarketing: false,
        hasSeo: false,
        hasPaidAds: false,
        hasInfluencerMarketing: false,
        marketingTools: []
      };
    }
  }

  // Estimate traffic and revenue
  private async estimateTrafficAndRevenue(domain: string): Promise<any> {
    try {
      // Use search volume and competition as proxies for traffic
      const brandQuery = `"${domain.replace('.com', '').replace('.myshopify', '')}"`;
      const brandResult = await serpApiService.searchGoogle({
        q: brandQuery,
        num: 10
      });

      const analytics = {
        estimatedRevenue: 'Unknown',
        trafficRank: 0,
        monthlyVisitors: 0,
        technologies: ['Shopify'] as string[]
      };

      // Estimate based on search results and competition
      const organicResults = brandResult.organic_results?.length || 0;
      const hasMultiplePages = organicResults > 5;
      
      if (hasMultiplePages) {
        analytics.estimatedRevenue = '$10K-$50K/month';
        analytics.monthlyVisitors = 5000;
      } else if (organicResults > 2) {
        analytics.estimatedRevenue = '$1K-$10K/month';
        analytics.monthlyVisitors = 1000;
      } else {
        analytics.estimatedRevenue = '<$1K/month';
        analytics.monthlyVisitors = 100;
      }

      return analytics;
    } catch (error) {
      console.error(`Traffic estimation failed for ${domain}:`, error);
      return {
        estimatedRevenue: 'Unknown',
        trafficRank: 0,
        monthlyVisitors: 0,
        technologies: ['Shopify']
      };
    }
  }

  // Calculate lead score based on various factors
  private calculateLeadScore(store: ShopifyStoreData, searchResult?: any): number {
    let score = 50; // Base score

    // Domain quality
    if (store.domain.includes('.myshopify.com')) {
      score += 20; // Confirmed Shopify store
    }

    // Content quality
    if (store.description && store.description.length > 100) {
      score += 10;
    }

    // Search result relevance
    if (searchResult) {
      if (searchResult.title.toLowerCase().includes('store') || 
          searchResult.title.toLowerCase().includes('shop')) {
        score += 15;
      }
    }

    return Math.min(score, 100);
  }

  private calculateEnhancedLeadScore(store: ShopifyStoreData): number {
    let score = this.calculateLeadScore(store);

    // Contact information available
    if (store.email) score += 15;
    if (store.phone) score += 10;

    // Marketing sophistication
    if (store.marketing.hasEmailMarketing) score += 20;
    if (store.marketing.hasSeo) score += 15;
    if (store.marketing.hasPaidAds) score += 10;

    // Business size indicators
    if (store.analytics.monthlyVisitors && store.analytics.monthlyVisitors > 1000) score += 10;
    if (store.analytics.estimatedRevenue?.includes('10K')) score += 15;
    if (store.analytics.estimatedRevenue?.includes('50K')) score += 25;

    // Social media presence
    const socialCount = Object.keys(store.social || {}).length;
    score += socialCount * 5;

    return Math.min(score, 100);
  }

  // Generate actionable prospecting notes
  private generateProspectingNotes(store: ShopifyStoreData): string[] {
    const notes: string[] = [];

    // Marketing opportunities
    if (!store.marketing.hasEmailMarketing) {
      notes.push('🎯 Email marketing opportunity - No newsletter detected');
    }
    if (!store.marketing.hasSeo) {
      notes.push('📈 SEO improvement potential - Limited content marketing');
    }
    if (!store.marketing.hasPaidAds) {
      notes.push('💰 Paid advertising opportunity - No visible ad campaigns');
    }

    // Business insights
    if (store.analytics.estimatedRevenue && store.analytics.estimatedRevenue.includes('<$1K')) {
      notes.push('🚀 Growth stage business - High potential for marketing ROI');
    }
    if (store.analytics.estimatedRevenue && store.analytics.estimatedRevenue.includes('$10K')) {
      notes.push('💎 Established business - Ready for advanced marketing strategies');
    }

    // Contact strategy
    if (store.email) {
      notes.push(`📧 Direct contact available - ${store.email}`);
    } else {
      notes.push('🔍 Contact research needed - No public email found');
    }

    // Industry insights
    if (store.business.industry) {
      notes.push(`🏷️ Industry: ${store.business.industry} - Tailor pitch accordingly`);
    }

    return notes;
  }

  // Utility methods
  private deduplicateStores(stores: ShopifyStoreData[]): ShopifyStoreData[] {
    const seen = new Set<string>();
    return stores.filter(store => {
      if (seen.has(store.domain)) {
        return false;
      }
      seen.add(store.domain);
      return true;
    });
  }

  private passesFilters(store: ShopifyStoreData, filters: ProspectingFilters): boolean {
    // Exclude domains
    if (filters.excludeDomains && filters.excludeDomains.includes(store.domain)) {
      return false;
    }

    // Industry filter
    if (filters.industry && filters.industry.length > 0 && store.business.industry) {
      if (!filters.industry.includes(store.business.industry)) {
        return false;
      }
    }

    // Marketing filters
    if (filters.hasEmailMarketing !== undefined && 
        store.marketing.hasEmailMarketing !== filters.hasEmailMarketing) {
      return false;
    }

    if (filters.hasPaidAds !== undefined && 
        store.marketing.hasPaidAds !== filters.hasPaidAds) {
      return false;
    }

    return true;
  }

  private extractUrlsFromText(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s<>"']+/g;
    return text.match(urlRegex) || [];
  }

  private generateStoreId(domain: string): string {
    return `shopify-${domain.replace(/[^a-zA-Z0-9]/g, '-')}`;
  }

  private async createStoreFromUrl(url: string): Promise<ShopifyStoreData | null> {
    try {
      const domain = new URL(url).hostname;
      return {
        id: this.generateStoreId(domain),
        domain,
        shopName: domain,
        analytics: {
          lastUpdated: new Date().toISOString(),
          technologies: ['Shopify'],
          apps: []
        },
        business: {},
        marketing: {},
        leadScore: 50
      };
    } catch (error) {
      return null;
    }
  }

  // Export prospects to various formats
  async exportProspects(stores: ShopifyStoreData[], format: 'csv' | 'json' = 'csv'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(stores, null, 2);
    }

    // CSV export
    const headers = [
      'Domain', 'Shop Name', 'Email', 'Phone', 'Industry', 'Estimated Revenue',
      'Monthly Visitors', 'Lead Score', 'Has Email Marketing', 'Has SEO', 'Has Paid Ads',
      'Marketing Tools', 'Prospecting Notes'
    ];

    const rows = stores.map(store => [
      store.domain,
      store.shopName,
      store.email || '',
      store.phone || '',
      store.business.industry || '',
      store.analytics.estimatedRevenue || '',
      store.analytics.monthlyVisitors || '',
      store.leadScore,
      store.marketing.hasEmailMarketing ? 'Yes' : 'No',
      store.marketing.hasSeo ? 'Yes' : 'No',
      store.marketing.hasPaidAds ? 'Yes' : 'No',
      store.marketing.marketingTools?.join('; ') || '',
      store.prospectingNotes?.join('; ') || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Get industry suggestions based on popular Shopify categories
  getIndustrySuggestions(): string[] {
    return Object.keys(this.industryKeywords);
  }

  // Validate prospecting parameters
  validateProspectingParams(searchTerms: string[], filters: ProspectingFilters): string[] {
    const errors: string[] = [];

    if (!searchTerms || searchTerms.length === 0) {
      errors.push('At least one search term is required');
    }

    if (searchTerms.some(term => term.length < 2)) {
      errors.push('Search terms must be at least 2 characters long');
    }

    if (filters.revenueRange) {
      if (filters.revenueRange.min && filters.revenueRange.max && 
          filters.revenueRange.min > filters.revenueRange.max) {
        errors.push('Revenue range minimum cannot be greater than maximum');
      }
    }

    return errors;
  }
}

export const shopifyProspectingService = new ShopifyProspectingService();
export default shopifyProspectingService;
export type { ShopifyStoreData, ProspectingFilters, ProspectingResults };