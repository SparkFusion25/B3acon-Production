import { getJson } from 'serpapi';
import { toast } from 'react-hot-toast';

interface SerpApiConfig {
  api_key: string;
  timeout?: number;
}

interface SerpApiParams {
  q: string;
  location?: string;
  hl?: string;
  gl?: string;
  google_domain?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  num?: number;
  start?: number;
  safe?: 'active' | 'off';
  filter?: '0' | '1';
  cr?: string;
  lr?: string;
  tbs?: string;
}

interface CompetitorAnalysisParams extends SerpApiParams {
  competitors: string[];
  keywords: string[];
}

interface SEOAnalysisResult {
  keyword: string;
  position?: number;
  url?: string;
  title?: string;
  snippet?: string;
  total_results: number;
  related_questions: string[];
  people_also_ask: string[];
  ads_count: number;
  organic_results: any[];
  search_metadata: any;
}

interface CompetitorData {
  domain: string;
  positions: { [keyword: string]: number | null };
  visibility_score: number;
  top_pages: any[];
}

class SerpApiService {
  private config: SerpApiConfig;

  constructor() {
    this.config = {
      api_key: import.meta.env.VITE_SERPAPI_KEY || '',
      timeout: 60000
    };
  }

  private async makeRequest(engine: string, params: any): Promise<any> {
    try {
      if (!this.config.api_key) {
        throw new Error('SerpAPI key not configured');
      }

      const searchParams = {
        engine,
        api_key: this.config.api_key,
        timeout: this.config.timeout,
        ...params
      };

      const response = await getJson(searchParams);
      return response;
    } catch (error) {
      console.error('SerpAPI request failed:', error);
      throw error;
    }
  }

  // Google Search API methods
  async searchGoogle(params: SerpApiParams): Promise<SEOAnalysisResult> {
    try {
      const response = await this.makeRequest('google', params);
      
      return {
        keyword: params.q,
        position: this.findPosition(response.organic_results, params.q),
        url: response.organic_results?.[0]?.link,
        title: response.organic_results?.[0]?.title,
        snippet: response.organic_results?.[0]?.snippet,
        total_results: parseInt(response.search_information?.total_results?.replace(/,/g, '') || '0'),
        related_questions: response.related_questions?.map((q: any) => q.question) || [],
        people_also_ask: response.people_also_ask?.map((q: any) => q.question) || [],
        ads_count: response.ads?.length || 0,
        organic_results: response.organic_results || [],
        search_metadata: response.search_metadata
      };
    } catch (error) {
      console.error('Google search failed:', error);
      throw error;
    }
  }

  // Keyword ranking analysis
  async analyzeKeywordRankings(keywords: string[], domain: string, location = 'United States'): Promise<SEOAnalysisResult[]> {
    const results: SEOAnalysisResult[] = [];
    
    for (const keyword of keywords) {
      try {
        const searchResult = await this.searchGoogle({
          q: keyword,
          location,
          num: 100 // Get top 100 results to check rankings
        });

        // Find domain position in results
        const position = this.findDomainPosition(searchResult.organic_results, domain);
        
        results.push({
          ...searchResult,
          position: position || undefined,
          keyword
        });

        // Rate limiting to avoid hitting API limits
        await this.delay(1000);
      } catch (error) {
        console.error(`Failed to analyze keyword: ${keyword}`, error);
        results.push({
          keyword,
          total_results: 0,
          related_questions: [],
          people_also_ask: [],
          ads_count: 0,
          organic_results: [],
          search_metadata: {}
        });
      }
    }

    return results;
  }

  // Competitor analysis
  async analyzeCompetitors(params: CompetitorAnalysisParams): Promise<CompetitorData[]> {
    const competitorData: CompetitorData[] = [];

    for (const competitor of params.competitors) {
      const positions: { [keyword: string]: number | null } = {};
      let totalVisibilityScore = 0;

      for (const keyword of params.keywords) {
        try {
          const searchResult = await this.searchGoogle({
            q: keyword,
            location: params.location,
            num: 50
          });

          const position = this.findDomainPosition(searchResult.organic_results, competitor);
          positions[keyword] = position;
          
          // Calculate visibility score (higher position = lower score)
          if (position && position <= 10) {
            totalVisibilityScore += (11 - position) * 10;
          }

          await this.delay(500);
        } catch (error) {
          console.error(`Failed to analyze competitor ${competitor} for keyword ${keyword}:`, error);
          positions[keyword] = null;
        }
      }

      competitorData.push({
        domain: competitor,
        positions,
        visibility_score: totalVisibilityScore / params.keywords.length,
        top_pages: []
      });
    }

    return competitorData;
  }

  // Google Trends integration
  async getTrends(keywords: string[], location = 'US'): Promise<any> {
    try {
      const response = await this.makeRequest('google_trends', {
        q: keywords.join(','),
        geo: location,
        time: '12m' // Last 12 months
      });

      return response;
    } catch (error) {
      console.error('Google Trends request failed:', error);
      throw error;
    }
  }

  // Local SEO analysis
  async analyzeLocalSEO(business_name: string, location: string): Promise<any> {
    try {
      const response = await this.makeRequest('google_local', {
        q: business_name,
        location
      });

      return {
        local_results: response.local_results || [],
        knowledge_graph: response.knowledge_graph,
        search_metadata: response.search_metadata
      };
    } catch (error) {
      console.error('Local SEO analysis failed:', error);
      throw error;
    }
  }

  // Google Shopping analysis for e-commerce
  async analyzeShopping(product_query: string, location = 'United States'): Promise<any> {
    try {
      const response = await this.makeRequest('google_shopping', {
        q: product_query,
        location
      });

      return {
        shopping_results: response.shopping_results || [],
        search_metadata: response.search_metadata
      };
    } catch (error) {
      console.error('Shopping analysis failed:', error);
      throw error;
    }
  }

  // Google Images analysis for visual content research
  async analyzeImages(query: string, safe = 'active'): Promise<any> {
    try {
      const response = await this.makeRequest('google_images', {
        q: query,
        safe
      });

      return {
        images_results: response.images_results || [],
        search_metadata: response.search_metadata
      };
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw error;
    }
  }

  // Google News monitoring
  async monitorNews(keywords: string[], location = 'United States'): Promise<any> {
    try {
      const newsData = [];
      
      for (const keyword of keywords) {
        const response = await this.makeRequest('google_news', {
          q: keyword,
          location,
          hl: 'en',
          gl: 'us'
        });

        newsData.push({
          keyword,
          news_results: response.news_results || [],
          search_metadata: response.search_metadata
        });

        await this.delay(500);
      }

      return newsData;
    } catch (error) {
      console.error('News monitoring failed:', error);
      throw error;
    }
  }

  // YouTube SEO analysis
  async analyzeYouTube(query: string): Promise<any> {
    try {
      const response = await this.makeRequest('youtube', {
        search_query: query
      });

      return {
        video_results: response.video_results || [],
        search_metadata: response.search_metadata
      };
    } catch (error) {
      console.error('YouTube analysis failed:', error);
      throw error;
    }
  }

  // Helper methods
  private findPosition(organic_results: any[], query: string): number | undefined {
    if (!organic_results) return undefined;
    
    const index = organic_results.findIndex(result => 
      result.title?.toLowerCase().includes(query.toLowerCase()) ||
      result.snippet?.toLowerCase().includes(query.toLowerCase())
    );
    
    return index !== -1 ? index + 1 : undefined;
  }

  private findDomainPosition(organic_results: any[], domain: string): number | null {
    if (!organic_results) return null;
    
    const index = organic_results.findIndex(result => 
      result.link?.includes(domain)
    );
    
    return index !== -1 ? index + 1 : null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Batch processing for multiple keywords
  async batchAnalyzeKeywords(keywords: string[], options: Partial<SerpApiParams> = {}): Promise<SEOAnalysisResult[]> {
    const results: SEOAnalysisResult[] = [];
    const batchSize = 5; // Process in batches to avoid rate limits
    
    for (let i = 0; i < keywords.length; i += batchSize) {
      const batch = keywords.slice(i, i + batchSize);
      const batchPromises = batch.map(keyword => 
        this.searchGoogle({ q: keyword, ...options })
      );
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Rate limiting between batches
        if (i + batchSize < keywords.length) {
          await this.delay(2000);
        }
      } catch (error) {
        console.error('Batch processing failed:', error);
        // Continue with individual processing for failed batch
        for (const keyword of batch) {
          try {
            const result = await this.searchGoogle({ q: keyword, ...options });
            results.push(result);
            await this.delay(1000);
          } catch (individualError) {
            console.error(`Failed to process keyword: ${keyword}`, individualError);
          }
        }
      }
    }
    
    return results;
  }

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const response = await this.makeRequest('google_autocomplete', {
        q: query
      });

      return response.suggestions || [];
    } catch (error) {
      console.error('Search suggestions failed:', error);
      return [];
    }
  }

  // Related searches
  async getRelatedSearches(query: string, location = 'United States'): Promise<string[]> {
    try {
      const response = await this.searchGoogle({ q: query, location });
      return response.related_questions || [];
    } catch (error) {
      console.error('Related searches failed:', error);
      return [];
    }
  }
}

export const serpApiService = new SerpApiService();
export type { SEOAnalysisResult, CompetitorData, SerpApiParams, CompetitorAnalysisParams };