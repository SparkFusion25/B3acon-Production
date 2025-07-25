import { useState, useEffect } from 'react';
import { createShopifyAPI, getShopifyConfig } from '../utils/shopifyAPI';
import { createSerpAPI, getSerpAPIConfig } from '../utils/serpAPI';
import { createKlaviyoAPI, getKlaviyoConfig } from '../utils/klaviyoAPI';
import toast from 'react-hot-toast';

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  organicTraffic: number;
  emailSubscribers: number;
  seoScore: number;
  activePopups: number;
}

interface ProductData {
  id: number;
  title: string;
  handle: string;
  status: string;
  price: string;
  inventory: number;
  images: any[];
}

interface OrderData {
  id: number;
  name: string;
  total_price: string;
  created_at: string;
  customer: any;
}

interface KeywordRanking {
  keyword: string;
  position: number;
  volume: number;
  difficulty: string;
  trend: 'up' | 'down' | 'stable';
}

interface EmailCampaign {
  id: string;
  name: string;
  status: string;
  sent: number;
  opened: number;
  clicked: number;
  revenue: number;
}

export const useShopifyData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard data state
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    organicTraffic: 0,
    emailSubscribers: 0,
    seoScore: 0,
    activePopups: 0,
  });

  const [products, setProducts] = useState<ProductData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [keywordRankings, setKeywordRankings] = useState<KeywordRanking[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [shopInfo, setShopInfo] = useState<any>(null);

  // API instances
  // API instances with error handling
  let shopifyAPI: any = null;
  let serpAPI: any = null;
  let klaviyoAPI: any = null;

  try {
    shopifyAPI = createShopifyAPI(getShopifyConfig());
  } catch (error) {
    console.warn('Shopify API not configured, using fallback data');
  }

  try {
    serpAPI = createSerpAPI(getSerpAPIConfig());
  } catch (error) {
    console.warn('SerpAPI not configured, using fallback data');
  }

  try {
    klaviyoAPI = createKlaviyoAPI(getKlaviyoConfig());
  } catch (error) {
    console.warn('Klaviyo API not configured, using fallback data');
  }

  // Fetch shop information
  const fetchShopInfo = async () => {
    try {
      const shop = await shopifyAPI.getShopInfo();
      setShopInfo(shop);
      return shop;
    } catch (error) {
      console.error('Error fetching shop info:', error);
      // Use fallback data if API fails
      setShopInfo({
        name: 'Tech Store',
        domain: 'techstore.myshopify.com',
        email: 'admin@techstore.com',
        currency: 'USD',
      });
    }
  };

  // Fetch products data
  const fetchProducts = async () => {
    try {
      const shopifyProducts = await shopifyAPI.getProducts(50);
      const processedProducts = shopifyProducts.map(product => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        status: product.status,
        price: product.variants[0]?.price || '0.00',
        inventory: product.variants[0]?.inventory_quantity || 0,
        images: product.images,
      }));
      setProducts(processedProducts);
      return processedProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use fallback data
      setProducts([
        {
          id: 1,
          title: 'Wireless Bluetooth Headphones',
          handle: 'wireless-headphones',
          status: 'active',
          price: '99.99',
          inventory: 25,
          images: [],
        },
        {
          id: 2,
          title: 'Smart Fitness Watch',
          handle: 'fitness-watch',
          status: 'active',
          price: '299.99',
          inventory: 12,
          images: [],
        },
      ]);
    }
  };

  // Fetch orders data
  const fetchOrders = async () => {
    try {
      const shopifyOrders = await shopifyAPI.getOrders(100);
      setOrders(shopifyOrders);
      return shopifyOrders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  // Fetch SEO data
  const fetchSEOData = async (domain: string) => {
    try {
      const keywords = ['wireless headphones', 'bluetooth speakers', 'tech accessories'];
      const rankingPromises = keywords.map(keyword => 
        serpAPI.getKeywordRankings(keyword, domain)
      );
      
      const rankings = await Promise.all(rankingPromises);
      const processedRankings = rankings.flat().map(ranking => ({
        keyword: ranking.keyword,
        position: ranking.position,
        volume: Math.floor(Math.random() * 10000) + 1000, // Mock volume
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as any,
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
      }));
      
      setKeywordRankings(processedRankings);
      return processedRankings;
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      // Use fallback data
      setKeywordRankings([
        {
          keyword: 'wireless headphones',
          position: 3,
          volume: 18100,
          difficulty: 'Medium',
          trend: 'up',
        },
        {
          keyword: 'bluetooth speakers',
          position: 7,
          volume: 9900,
          difficulty: 'Hard',
          trend: 'stable',
        },
      ]);
    }
  };

  // Fetch email marketing data
  const fetchEmailData = async () => {
    try {
      const campaigns = await klaviyoAPI.getCampaigns();
      const lists = await klaviyoAPI.getLists();
      
      const processedCampaigns = campaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.attributes.name,
        status: campaign.attributes.status,
        sent: Math.floor(Math.random() * 5000) + 1000, // Mock data
        opened: Math.floor(Math.random() * 2000) + 500,
        clicked: Math.floor(Math.random() * 500) + 100,
        revenue: Math.floor(Math.random() * 10000) + 2000,
      }));
      
      setEmailCampaigns(processedCampaigns);
      
      // Calculate total subscribers
      const totalSubscribers = lists.reduce((sum, list) => sum + list.attributes.profile_count, 0);
      return { campaigns: processedCampaigns, subscribers: totalSubscribers };
    } catch (error) {
      console.error('Error fetching email data:', error);
      // Use fallback data
      setEmailCampaigns([
        {
          id: '1',
          name: 'Welcome Series',
          status: 'sent',
          sent: 2450,
          opened: 1120,
          clicked: 234,
          revenue: 8750,
        },
      ]);
      return { campaigns: [], subscribers: 0 };
    }
  };

  // Calculate dashboard metrics
  const calculateMetrics = (ordersData: OrderData[], emailData: any) => {
    const totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    const totalOrders = ordersData.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Mock conversion rate calculation
    const conversionRate = Math.random() * 3 + 2; // 2-5%
    
    // Mock organic traffic
    const organicTraffic = Math.floor(Math.random() * 10000) + 5000;
    
    // Mock SEO score
    const seoScore = Math.floor(Math.random() * 20) + 80; // 80-100
    
    // Mock active popups
    const activePopups = Math.floor(Math.random() * 5) + 3;

    setMetrics({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      conversionRate,
      organicTraffic,
      emailSubscribers: emailData.subscribers,
      seoScore,
      activePopups,
    });
  };

  // Main data fetching function
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use fallback data for demo purposes until APIs are activated
      setShopInfo({ domain: 'demo-store.myshopify.com', name: 'Demo Store' });
      
      setProducts([
        {
          id: 1,
          title: 'Wireless Bluetooth Headphones',
          handle: 'wireless-headphones',
          status: 'active',
          price: '99.99',
          inventory: 25,
          images: [],
        },
        {
          id: 2,
          title: 'Smart Fitness Watch',
          handle: 'fitness-watch',
          status: 'active',
          price: '299.99',
          inventory: 12,
          images: [],
        },
        {
          id: 3,
          title: 'Premium Coffee Beans',
          handle: 'premium-coffee',
          status: 'active',
          price: '24.99',
          inventory: 50,
          images: [],
        },
      ]);

      setOrders([
        {
          id: 1001,
          name: '#1001',
          total_price: '99.99',
          created_at: new Date().toISOString(),
          customer: { first_name: 'John', last_name: 'Doe' },
        },
        {
          id: 1002,
          name: '#1002',
          total_price: '299.99',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          customer: { first_name: 'Jane', last_name: 'Smith' },
        },
      ]);

      setKeywordRankings([
        { keyword: 'wireless headphones', position: 3, volume: 12000, difficulty: 'Medium', trend: 'up' },
        { keyword: 'bluetooth earbuds', position: 7, volume: 8500, difficulty: 'High', trend: 'stable' },
        { keyword: 'fitness tracker', position: 5, volume: 15000, difficulty: 'Low', trend: 'up' },
      ]);

      setEmailCampaigns([
        {
          id: 'camp1',
          name: 'Welcome Series',
          status: 'active',
          sent: 1250,
          opened: 875,
          clicked: 156,
          revenue: 2340,
        },
        {
          id: 'camp2',
          name: 'Holiday Sale',
          status: 'paused',
          sent: 2100,
          opened: 1470,
          clicked: 294,
          revenue: 5680,
        },
      ]);

      // Calculate demo metrics
      const totalRevenue = 24650;
      const totalOrders = 450;
      const avgOrderValue = totalRevenue / totalOrders;
      const conversionRate = 6.8;

      setMetrics({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        conversionRate,
        organicTraffic: 12500,
        emailSubscribers: 3400,
        seoScore: 85,
        activePopups: 4,
      });

      console.log('✅ Demo data loaded successfully');
    } catch (error) {
      console.error('Error loading demo data:', error);
      setError('Failed to load demo data');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh specific data types
  const refreshProducts = () => fetchProducts();
  const refreshOrders = () => fetchOrders();
  const refreshSEO = () => shopInfo?.domain && fetchSEOData(shopInfo.domain);
  const refreshEmail = () => fetchEmailData();

  // Initial data load
  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    // Data
    metrics,
    products,
    orders,
    keywordRankings,
    emailCampaigns,
    shopInfo,
    
    // State
    isLoading,
    error,
    
    // Actions
    fetchAllData,
    refreshProducts,
    refreshOrders,
    refreshSEO,
    refreshEmail,
  };
};

export default useShopifyData;