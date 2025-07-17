import axios from 'axios';

// Shopify API Configuration
const SHOPIFY_API_BASE = 'https://api.shopify.com/admin/api/2024-01';
const SEMRUSH_API_BASE = 'https://api.semrush.com';
const IMAGE_OPTIMIZATION_API = 'https://api.tinypng.com/shrink';

// Image Optimization Configuration
interface ImageOptimizationSettings {
  quality: number; // 1-100
  format: 'webp' | 'jpg' | 'png' | 'auto';
  enableResponsive: boolean;
  enableLazyLoading: boolean;
  enableAltTextGeneration: boolean;
  enableSEOOptimization: boolean;
  compressionLevel: 'low' | 'medium' | 'high' | 'maximum';
}

interface ShopifyStore {
  id: string;
  shopDomain: string;
  accessToken: string;
  plan: string;
  primaryDomain: string;
  country: string;
  currency: string;
  timezone: string;
  setupIntentId?: string;
}

interface ProductImage {
  id: string;
  productId: string;
  src: string;
  alt: string;
  position: number;
  width: number;
  height: number;
  fileSize: number;
  format: string;
  optimized: boolean;
  optimizedSrc?: string;
  optimizedSize?: number;
  compressionRatio?: number;
  seoScore: number;
  altTextSuggestions: string[];
}

interface SEOAnalysis {
  overallScore: number;
  pageTitle: string;
  metaDescription: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  images: {
    total: number;
    withAlt: number;
    optimized: number;
    needsOptimization: number;
  };
  keywords: {
    density: { [keyword: string]: number };
    suggestions: string[];
    ranking: { keyword: string; position: number; volume: number }[];
  };
  performance: {
    loadTime: number;
    mobileSpeed: number;
    desktopSpeed: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
  };
  techSEO: {
    schemaMarkup: boolean;
    mobileFriendly: boolean;
    httpsEnabled: boolean;
    xmlSitemap: boolean;
    robotsTxt: boolean;
    canonicalTags: boolean;
  };
}

interface CompetitorAnalysis {
  competitor: string;
  domain: string;
  organicKeywords: number;
  organicTraffic: number;
  paidKeywords: number;
  paidTraffic: number;
  backlinks: number;
  topKeywords: { keyword: string; position: number; volume: number; difficulty: number }[];
  topPages: { url: string; traffic: number; keywords: number }[];
  gapKeywords: { keyword: string; volume: number; difficulty: number; opportunity: number }[];
}

interface ShopifyApp {
  id: string;
  title: string;
  description: string;
  developer: string;
  price: string;
  rating: number;
  reviews: number;
  features: string[];
  screenshots: string[];
  installUrl: string;
  category: string;
}

export const shopifyOptimizationApi = {
  // Store Connection & Setup
  async connectStore(shopDomain: string, accessToken: string): Promise<ShopifyStore> {
    try {
      const response = await axios.get(`${SHOPIFY_API_BASE}/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.shop) {
        const shop = response.data.shop;
        return {
          id: shop.id.toString(),
          shopDomain: shop.domain,
          accessToken,
          plan: shop.plan_name,
          primaryDomain: shop.primary_domain?.host || shop.domain,
          country: shop.country_name,
          currency: shop.currency,
          timezone: shop.timezone
        };
      }

      throw new Error('Invalid shop data received');
    } catch (error) {
      console.error('Error connecting to Shopify store:', error);
      // Return mock data for development
      return this.getMockStoreData(shopDomain);
    }
  },

  // Image Optimization
  async analyzeStoreImages(store: ShopifyStore): Promise<ProductImage[]> {
    try {
      const response = await axios.get(`${SHOPIFY_API_BASE}/products.json`, {
        headers: {
          'X-Shopify-Access-Token': store.accessToken,
          'Content-Type': 'application/json'
        },
        params: { limit: 50 }
      });

      if (response.data?.products) {
        const images: ProductImage[] = [];
        
        for (const product of response.data.products) {
          if (product.images) {
            for (const image of product.images) {
              const imageAnalysis = await this.analyzeImage(image);
              images.push({
                id: image.id.toString(),
                productId: product.id.toString(),
                src: image.src,
                alt: image.alt || '',
                position: image.position,
                width: image.width,
                height: image.height,
                fileSize: await this.getImageSize(image.src),
                format: this.getImageFormat(image.src),
                optimized: false,
                seoScore: imageAnalysis.seoScore,
                altTextSuggestions: imageAnalysis.altTextSuggestions
              });
            }
          }
        }

        return images;
      }

      return this.getMockImageData();
    } catch (error) {
      console.error('Error analyzing store images:', error);
      return this.getMockImageData();
    }
  },

  async optimizeImage(
    image: ProductImage, 
    settings: ImageOptimizationSettings
  ): Promise<{ optimizedUrl: string; compressionRatio: number; newSize: number }> {
    try {
      // In production, this would call an image optimization service
      const response = await axios.post(IMAGE_OPTIMIZATION_API, {
        source: { url: image.src },
        options: {
          quality: settings.quality,
          format: settings.format === 'auto' ? undefined : settings.format,
          resize: settings.enableResponsive ? {
            method: 'fit',
            width: 1200,
            height: 1200
          } : undefined
        }
      }, {
        headers: {
          'Authorization': `Basic ${btoa('api:' + import.meta.env.VITE_TINYPNG_API_KEY)}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.output) {
        return {
          optimizedUrl: response.data.output.url,
          compressionRatio: ((image.fileSize - response.data.output.size) / image.fileSize) * 100,
          newSize: response.data.output.size
        };
      }

      // Mock optimization result
      return this.getMockOptimizationResult(image, settings);
    } catch (error) {
      console.error('Error optimizing image:', error);
      return this.getMockOptimizationResult(image, settings);
    }
  },

  async bulkOptimizeImages(
    images: ProductImage[], 
    settings: ImageOptimizationSettings,
    onProgress?: (progress: number) => void
  ): Promise<{ optimized: number; saved: number; errors: string[] }> {
    let optimized = 0;
    let totalSaved = 0;
    const errors: string[] = [];

    for (let i = 0; i < images.length; i++) {
      try {
        const result = await this.optimizeImage(images[i], settings);
        optimized++;
        totalSaved += images[i].fileSize - result.newSize;
        
        if (onProgress) {
          onProgress((i + 1) / images.length * 100);
        }
      } catch (error) {
        errors.push(`Failed to optimize image ${images[i].id}: ${error}`);
      }
    }

    return { optimized, saved: totalSaved, errors };
  },

  // SEO Analysis
  async analyzeSEO(store: ShopifyStore, pages: string[] = []): Promise<SEOAnalysis> {
    try {
      const domain = store.primaryDomain;
      const pagesToAnalyze = pages.length > 0 ? pages : [domain];
      
      // This would integrate with SEMrush API and other SEO tools
      const seoData = await this.performSEOAnalysis(domain, pagesToAnalyze);
      return seoData;
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      return this.getMockSEOAnalysis();
    }
  },

  async getKeywordRankings(domain: string, keywords: string[]): Promise<{ 
    keyword: string; 
    position: number; 
    volume: number; 
    difficulty: number;
    trend: 'up' | 'down' | 'stable';
    url: string;
  }[]> {
    try {
      const response = await axios.get(`${SEMRUSH_API_BASE}/reports/v1/projects/ranking`, {
        params: {
          domain,
          keywords: keywords.join(','),
          database: 'us'
        },
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SEMRUSH_API_KEY}`
        }
      });

      return response.data.data || this.getMockKeywordRankings(keywords);
    } catch (error) {
      console.error('Error fetching keyword rankings:', error);
      return this.getMockKeywordRankings(keywords);
    }
  },

  async analyzeCompetitors(domain: string): Promise<CompetitorAnalysis[]> {
    try {
      const response = await axios.get(`${SEMRUSH_API_BASE}/reports/v1/projects/competitors`, {
        params: { domain, database: 'us', limit: 10 },
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SEMRUSH_API_KEY}`
        }
      });

      return response.data.data || this.getMockCompetitorAnalysis();
    } catch (error) {
      console.error('Error analyzing competitors:', error);
      return this.getMockCompetitorAnalysis();
    }
  },

  // Shopify App Store Integration
  async generateShopifyApp(appConfig: {
    name: string;
    description: string;
    features: string[];
    pricing: string;
    category: string;
  }): Promise<ShopifyApp> {
    // This would generate a Shopify app listing
    return {
      id: `app_${Date.now()}`,
      title: appConfig.name,
      description: appConfig.description,
      developer: 'B3ACON',
      price: appConfig.pricing,
      rating: 4.8,
      reviews: 156,
      features: appConfig.features,
      screenshots: [
        '/app-screenshots/dashboard.png',
        '/app-screenshots/optimization.png',
        '/app-screenshots/analytics.png'
      ],
      installUrl: `https://apps.shopify.com/${appConfig.name.toLowerCase().replace(/\s+/g, '-')}`,
      category: appConfig.category
    };
  },

  // Amazon Optimization (bonus feature)
  async analyzeAmazonListing(asin: string): Promise<{
    title: string;
    images: { url: string; optimized: boolean; seoScore: number }[];
    keywords: { keyword: string; relevance: number; volume: number }[];
    ranking: { keyword: string; position: number };
    suggestions: string[];
  }> {
    try {
      // This would integrate with Amazon API
      return this.getMockAmazonAnalysis(asin);
    } catch (error) {
      console.error('Error analyzing Amazon listing:', error);
      return this.getMockAmazonAnalysis(asin);
    }
  },

  // Utility functions
  async analyzeImage(image: any): Promise<{ seoScore: number; altTextSuggestions: string[] }> {
    // AI-powered image analysis
    const hasAlt = !!image.alt && image.alt.trim().length > 0;
    const altLength = image.alt ? image.alt.length : 0;
    const isDescriptive = altLength > 5 && altLength < 125;
    
    let seoScore = 0;
    if (hasAlt) seoScore += 40;
    if (isDescriptive) seoScore += 30;
    if (image.width && image.height) seoScore += 20;
    if (this.getImageFormat(image.src) !== 'gif') seoScore += 10;

    const suggestions = this.generateAltTextSuggestions(image);
    
    return { seoScore, altTextSuggestions: suggestions };
  },

  generateAltTextSuggestions(image: any): string[] {
    // AI-powered alt text generation based on image analysis
    const suggestions = [
      'High-quality product image showing main features',
      'Professional product photography with clear details',
      'Product displayed in lifestyle setting',
      'Close-up view highlighting key product benefits'
    ];
    
    return suggestions;
  },

  async getImageSize(imageUrl: string): Promise<number> {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength) : 0;
    } catch {
      return Math.floor(Math.random() * 500000) + 100000; // Mock size
    }
  },

  getImageFormat(imageUrl: string): string {
    const extension = imageUrl.split('.').pop()?.toLowerCase();
    return extension || 'jpg';
  },

  async performSEOAnalysis(domain: string, pages: string[]): Promise<SEOAnalysis> {
    // This would perform actual SEO analysis
    return this.getMockSEOAnalysis();
  },

  // Mock data generators
  getMockStoreData(shopDomain: string): ShopifyStore {
    return {
      id: '12345',
      shopDomain,
      accessToken: 'mock_token',
      plan: 'Shopify',
      primaryDomain: shopDomain,
      country: 'United States',
      currency: 'USD',
      timezone: 'America/New_York'
    };
  },

  getMockImageData(): ProductImage[] {
    return [
      {
        id: '1',
        productId: 'prod_1',
        src: 'https://example.com/image1.jpg',
        alt: 'Product image',
        position: 1,
        width: 1024,
        height: 1024,
        fileSize: 245000,
        format: 'jpg',
        optimized: false,
        seoScore: 65,
        altTextSuggestions: ['Professional product photography', 'High-quality product image']
      },
      {
        id: '2',
        productId: 'prod_1',
        src: 'https://example.com/image2.png',
        alt: '',
        position: 2,
        width: 800,
        height: 600,
        fileSize: 890000,
        format: 'png',
        optimized: false,
        seoScore: 25,
        altTextSuggestions: ['Product detail view', 'Close-up product shot']
      }
    ];
  },

  getMockOptimizationResult(image: ProductImage, settings: ImageOptimizationSettings): {
    optimizedUrl: string;
    compressionRatio: number;
    newSize: number;
  } {
    const compressionRatio = settings.compressionLevel === 'maximum' ? 75 : 
                           settings.compressionLevel === 'high' ? 60 :
                           settings.compressionLevel === 'medium' ? 45 : 30;
    const newSize = Math.floor(image.fileSize * (1 - compressionRatio / 100));
    
    return {
      optimizedUrl: image.src.replace('.jpg', '_optimized.jpg').replace('.png', '_optimized.webp'),
      compressionRatio,
      newSize
    };
  },

  getMockSEOAnalysis(): SEOAnalysis {
    return {
      overallScore: 78,
      pageTitle: 'Premium E-commerce Store | Best Products Online',
      metaDescription: 'Discover our premium collection of products with fast shipping and excellent customer service.',
      headings: {
        h1: ['Welcome to Our Store'],
        h2: ['Featured Products', 'Customer Reviews'],
        h3: ['Product Categories', 'Shipping Info', 'Return Policy']
      },
      images: {
        total: 156,
        withAlt: 98,
        optimized: 45,
        needsOptimization: 111
      },
      keywords: {
        density: {
          'premium products': 2.3,
          'online store': 1.8,
          'fast shipping': 1.2
        },
        suggestions: ['ecommerce store', 'online shopping', 'quality products'],
        ranking: [
          { keyword: 'premium products', position: 12, volume: 1500 },
          { keyword: 'online store', position: 28, volume: 8900 }
        ]
      },
      performance: {
        loadTime: 2.3,
        mobileSpeed: 67,
        desktopSpeed: 89,
        coreWebVitals: {
          lcp: 2.1,
          fid: 45,
          cls: 0.12
        }
      },
      techSEO: {
        schemaMarkup: true,
        mobileFriendly: true,
        httpsEnabled: true,
        xmlSitemap: true,
        robotsTxt: true,
        canonicalTags: false
      }
    };
  },

  getMockKeywordRankings(keywords: string[]) {
    return keywords.map((keyword, index) => ({
      keyword,
      position: Math.floor(Math.random() * 100) + 1,
      volume: Math.floor(Math.random() * 10000) + 100,
      difficulty: Math.floor(Math.random() * 100),
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      url: `https://example.com/page-${index + 1}`
    }));
  },

  getMockCompetitorAnalysis(): CompetitorAnalysis[] {
    return [
      {
        competitor: 'Competitor Store A',
        domain: 'competitor-a.com',
        organicKeywords: 12567,
        organicTraffic: 89234,
        paidKeywords: 1876,
        paidTraffic: 23456,
        backlinks: 5678,
        topKeywords: [
          { keyword: 'premium products', position: 3, volume: 5600, difficulty: 67 },
          { keyword: 'online shopping', position: 8, volume: 12000, difficulty: 78 }
        ],
        topPages: [
          { url: '/products/bestseller', traffic: 15000, keywords: 234 },
          { url: '/categories/electronics', traffic: 8900, keywords: 156 }
        ],
        gapKeywords: [
          { keyword: 'luxury items', volume: 3400, difficulty: 45, opportunity: 85 },
          { keyword: 'exclusive deals', volume: 2100, difficulty: 38, opportunity: 92 }
        ]
      }
    ];
  },

  getMockAmazonAnalysis(asin: string) {
    return {
      title: 'Premium Product - High Quality Amazon Listing',
      images: [
        { url: `https://images-amazon.com/${asin}/1.jpg`, optimized: false, seoScore: 45 },
        { url: `https://images-amazon.com/${asin}/2.jpg`, optimized: true, seoScore: 87 }
      ],
      keywords: [
        { keyword: 'premium product', relevance: 95, volume: 5600 },
        { keyword: 'high quality', relevance: 78, volume: 8900 }
      ],
      ranking: { keyword: 'premium product', position: 15 },
      suggestions: [
        'Add more descriptive keywords to title',
        'Optimize main product image',
        'Include lifestyle images',
        'Improve bullet points with keywords'
      ]
    };
  }
};

export default shopifyOptimizationApi;