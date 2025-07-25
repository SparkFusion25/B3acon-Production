import axios from 'axios';

const SERP_API_BASE_URL = 'https://serpapi.com/search';

interface SerpAPIConfig {
  apiKey: string;
}

interface KeywordData {
  keyword: string;
  position: number;
  title: string;
  link: string;
  snippet: string;
  volume?: number;
  cpc?: number;
  competition?: string;
}

interface SEOAnalysis {
  url: string;
  title: string;
  metaDescription: string;
  h1Tags: string[];
  h2Tags: string[];
  images: number;
  internalLinks: number;
  externalLinks: number;
  score: number;
  issues: string[];
  suggestions: string[];
}

class SerpAPI {
  private apiKey: string;

  constructor(config: SerpAPIConfig) {
    this.apiKey = config.apiKey;
  }

  // Get keyword rankings for a specific domain
  async getKeywordRankings(keyword: string, domain: string, location: string = 'United States'): Promise<KeywordData[]> {
    try {
      const params = {
        engine: 'google',
        q: keyword,
        location,
        hl: 'en',
        gl: 'us',
        api_key: this.apiKey,
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      const results = response.data.organic_results || [];
      
      return results
        .map((result: any, index: number) => ({
          keyword,
          position: index + 1,
          title: result.title,
          link: result.link,
          snippet: result.snippet,
        }))
        .filter((result: KeywordData) => result.link.includes(domain));
    } catch (error) {
      console.error('Error fetching keyword rankings:', error);
      throw error;
    }
  }

  // Get keyword suggestions and search volume
  async getKeywordSuggestions(seedKeyword: string, location: string = 'United States'): Promise<any[]> {
    try {
      const params = {
        engine: 'google_keyword_planner',
        keywords: seedKeyword,
        location,
        api_key: this.apiKey,
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      return response.data.keyword_ideas || [];
    } catch (error) {
      console.error('Error fetching keyword suggestions:', error);
      // Fallback to related searches
      return this.getRelatedSearches(seedKeyword, location);
    }
  }

  // Get related searches as fallback
  async getRelatedSearches(keyword: string, location: string = 'United States'): Promise<any[]> {
    try {
      const params = {
        engine: 'google',
        q: keyword,
        location,
        api_key: this.apiKey,
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      return response.data.related_searches || [];
    } catch (error) {
      console.error('Error fetching related searches:', error);
      throw error;
    }
  }

  // Analyze competitor rankings
  async analyzeCompetitors(keyword: string, location: string = 'United States'): Promise<any[]> {
    try {
      const params = {
        engine: 'google',
        q: keyword,
        location,
        num: 20,
        api_key: this.apiKey,
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      const results = response.data.organic_results || [];
      
      return results.map((result: any, index: number) => ({
        position: index + 1,
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        domain: new URL(result.link).hostname,
      }));
    } catch (error) {
      console.error('Error analyzing competitors:', error);
      throw error;
    }
  }

  // Get search trends
  async getSearchTrends(keyword: string): Promise<any> {
    try {
      const params = {
        engine: 'google_trends',
        q: keyword,
        geo: 'US',
        time: '12-m',
        api_key: this.apiKey,
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      return response.data.interest_over_time || [];
    } catch (error) {
      console.error('Error fetching search trends:', error);
      throw error;
    }
  }

  // Get local SEO data
  async getLocalSEOData(query: string, location: string): Promise<any[]> {
    try {
      const params = {
        engine: 'google_maps',
        q: query,
        ll: location,
        api_key: this.apiKey,
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      return response.data.local_results || [];
    } catch (error) {
      console.error('Error fetching local SEO data:', error);
      throw error;
    }
  }

  // Analyze SERP features
  async analyzeSERPFeatures(keyword: string, location: string = 'United States'): Promise<any> {
    try {
      const params = {
        engine: 'google',
        q: keyword,
        location,
        api_key: this.apiKey,
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      
      return {
        knowledgeGraph: response.data.knowledge_graph || null,
        featuredSnippet: response.data.answer_box || null,
        peopleAlsoAsk: response.data.people_also_ask || [],
        relatedSearches: response.data.related_searches || [],
        shoppingResults: response.data.shopping_results || [],
        newsResults: response.data.news_results || [],
        imageResults: response.data.images_results || [],
      };
    } catch (error) {
      console.error('Error analyzing SERP features:', error);
      throw error;
    }
  }

  // Track multiple keywords
  async trackKeywords(keywords: string[], domain: string, location: string = 'United States'): Promise<KeywordData[]> {
    const results: KeywordData[] = [];
    
    for (const keyword of keywords) {
      try {
        const rankings = await this.getKeywordRankings(keyword, domain, location);
        results.push(...rankings);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error tracking keyword ${keyword}:`, error);
      }
    }
    
    return results;
  }

  // Get search volume data
  async getSearchVolume(keywords: string[]): Promise<any[]> {
    try {
      const params = {
        engine: 'google_ads_keyword_planner',
        keywords: keywords.join(','),
        api_key: this.apiKey,
      };

      const response = await axios.get(SERP_API_BASE_URL, { params });
      return response.data.keyword_ideas || [];
    } catch (error) {
      console.error('Error fetching search volume:', error);
      throw error;
    }
  }
}

// Mock SEO analysis function (would be replaced with actual page analysis)
export const analyzePage = async (url: string): Promise<SEOAnalysis> => {
  // In a real implementation, this would crawl the page and analyze its content
  // For now, return mock data structure
  return {
    url,
    title: 'Sample Page Title',
    metaDescription: 'Sample meta description',
    h1Tags: ['Main Heading'],
    h2Tags: ['Subheading 1', 'Subheading 2'],
    images: 5,
    internalLinks: 12,
    externalLinks: 3,
    score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
    issues: ['Missing alt tags on 2 images', 'Meta description too short'],
    suggestions: ['Add more internal links', 'Optimize images', 'Improve meta description'],
  };
};

// Export singleton instance
export const createSerpAPI = (config: SerpAPIConfig) => new SerpAPI(config);

// Default configuration from environment variables
export const getSerpAPIConfig = (): SerpAPIConfig => ({
  apiKey: import.meta.env.VITE_SERPAPI_KEY || '',
});

export default SerpAPI;