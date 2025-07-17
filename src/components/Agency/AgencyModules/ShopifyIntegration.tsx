import React, { useState } from 'react';
import { ShoppingBag, BarChart3, Package, TrendingUp, Settings, Tag, CreditCard, Users, ShoppingCart, Check, AlertCircle, RefreshCw, Download, ExternalLink, Search, ShoppingBasket, Target, Eye, Zap, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import amazonApi from '../../../lib/amazonApi';
import { serpApiService } from '../../../lib/serpApiService';

const ShopifyIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [shopifyUrl, setShopifyUrl] = useState('');
  const [shopifyApiKey, setShopifyApiKey] = useState('');
  const [shopifyApiSecret, setShopifyApiSecret] = useState('');
  const [shopifyAccessToken, setShopifyAccessToken] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [syncOptions, setSyncOptions] = useState({
    products: true,
    customers: true,
    orders: true,
    inventory: true,
    amazon: false
  });
  const [amazonProducts, setAmazonProducts] = useState<any[]>([]);
  const [isLoadingAmazon, setIsLoadingAmazon] = useState(false);
  const [amazonSearchQuery, setAmazonSearchQuery] = useState('');
  
  // SerpAPI enhanced features
  const [productResearch, setProductResearch] = useState({
    query: '',
    location: 'United States',
    results: [] as any[],
    isLoading: false
  });
  const [competitorAnalysis, setCompetitorAnalysis] = useState({
    competitors: '',
    products: '',
    results: [] as any[],
    isLoading: false
  });
  const [trendAnalysis, setTrendAnalysis] = useState({
    keywords: '',
    results: null as any,
    isLoading: false
  });
  
  const handleConnectShopify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopifyUrl) {
      toast.error('Please enter your Shopify store URL');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // In a real implementation, we would make an API call to connect to Shopify
      // For now, we'll simulate the connection process
      
      // Step 1: Validate the Shopify store URL
      if (!shopifyUrl.includes('.myshopify.com') && !showAdvancedSettings) {
        setShowAdvancedSettings(true);
        setIsConnecting(false);
        toast.error('Please enter a valid Shopify store URL or use advanced settings');
        return;
      }
      
      // Step 2: If using advanced settings, validate API credentials
      if (showAdvancedSettings && (!shopifyApiKey || !shopifyApiSecret)) {
        setIsConnecting(false);
        toast.error('API Key and API Secret are required for advanced connection');
        return;
      }
      
      // Step 3: Simulate API call to connect to Shopify
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 4: Set connection status
      setIsConnected(true);
      setIsConnecting(false);
      toast.success('Connected to Shopify store successfully!');
      
      // Step 5: Simulate initial data sync
      toast.success('Starting initial data sync...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully synced products, customers, and orders');
    } catch (error) {
      console.error('Error connecting to Shopify:', error);
      setIsConnecting(false);
      toast.error('Failed to connect to Shopify store');
    }
  };
  
  const handleSearchAmazon = async () => {
    if (!amazonSearchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    setIsLoadingAmazon(true);
    try {
      const results = await amazonApi.searchProducts(amazonSearchQuery);
      if (results && results.products) {
        setAmazonProducts(results.products);
        toast.success(`Found ${results.products.length} products on Amazon`);
      } else {
        setAmazonProducts([]);
        toast.error('No products found or API error occurred');
      }
    } catch (error) {
      console.error('Error searching Amazon products:', error);
      toast.error('Failed to search Amazon products');
    } finally {
      setIsLoadingAmazon(false);
    }
  };

  // Enhanced SerpAPI Product Research
  const handleProductResearch = async () => {
    if (!productResearch.query.trim()) {
      toast.error('Please enter a product to research');
      return;
    }

    setProductResearch(prev => ({ ...prev, isLoading: true }));
    try {
      // Use SerpAPI Shopping to find product trends and pricing
      const shoppingResults = await serpApiService.analyzeShopping(
        productResearch.query,
        productResearch.location
      );

      // Get related search suggestions for product ideas
      const suggestions = await serpApiService.getSearchSuggestions(productResearch.query);

      // Analyze Google Images for visual trends
      const imageResults = await serpApiService.analyzeImages(productResearch.query);

      const formattedResults = shoppingResults.shopping_results.map((product: any, index: number) => ({
        id: `product-${index}`,
        title: product.title,
        price: product.price,
        source: product.source,
        link: product.link,
        image: product.thumbnail,
        rating: product.rating,
        reviews: product.reviews,
        shipping: product.shipping,
        suggestions: suggestions.slice(0, 5),
        visualTrends: imageResults.images_results?.slice(0, 3) || []
      }));

      setProductResearch(prev => ({
        ...prev,
        results: formattedResults,
        isLoading: false
      }));

      toast.success(`Found ${formattedResults.length} product insights`);
    } catch (error) {
      console.error('Product research failed:', error);
      toast.error('Failed to research products. Check your SerpAPI configuration.');
      setProductResearch(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Competitor Analysis for E-commerce
  const handleCompetitorAnalysis = async () => {
    if (!competitorAnalysis.competitors.trim() || !competitorAnalysis.products.trim()) {
      toast.error('Please enter both competitors and products to analyze');
      return;
    }

    setCompetitorAnalysis(prev => ({ ...prev, isLoading: true }));
    try {
      const competitorList = competitorAnalysis.competitors.split(',').map(c => c.trim());
      const productList = competitorAnalysis.products.split(',').map(p => p.trim());
      
      const analysisResults = [];
      
      for (const competitor of competitorList) {
        for (const product of productList) {
          const searchQuery = `site:${competitor} ${product}`;
          const searchResult = await serpApiService.searchGoogle({
            q: searchQuery,
            num: 10
          });

          // Also check shopping results for the competitor
          const shoppingQuery = `${competitor} ${product}`;
          const shoppingResult = await serpApiService.analyzeShopping(shoppingQuery);

          analysisResults.push({
            competitor,
            product,
            organicResults: searchResult.organic_results.length,
            shoppingPresence: shoppingResult.shopping_results?.length || 0,
            topResult: searchResult.organic_results[0],
            shoppingListings: shoppingResult.shopping_results?.slice(0, 3) || []
          });

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      setCompetitorAnalysis(prev => ({
        ...prev,
        results: analysisResults,
        isLoading: false
      }));

      toast.success(`Analyzed ${analysisResults.length} competitor-product combinations`);
    } catch (error) {
      console.error('Competitor analysis failed:', error);
      toast.error('Failed to analyze competitors. Check your SerpAPI configuration.');
      setCompetitorAnalysis(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Trend Analysis for Product Planning
  const handleTrendAnalysis = async () => {
    if (!trendAnalysis.keywords.trim()) {
      toast.error('Please enter keywords to analyze trends');
      return;
    }

    setTrendAnalysis(prev => ({ ...prev, isLoading: true }));
    try {
      const keywordList = trendAnalysis.keywords.split(',').map(k => k.trim());
      
      // Get Google Trends data
      const trendsData = await serpApiService.getTrends(keywordList, 'US');
      
      // Get related searches and questions
      const relatedData = await Promise.all(
        keywordList.map(async (keyword) => {
          const searchData = await serpApiService.searchGoogle({
            q: keyword,
            num: 10
          });
          return {
            keyword,
            relatedQuestions: searchData.related_questions,
            peopleAlsoAsk: searchData.people_also_ask
          };
        })
      );

      const formattedResults = {
        trends: trendsData,
        relatedSearches: relatedData,
        insights: {
          highestTrend: keywordList[0], // Would be calculated from trends data
          emergingKeywords: relatedData.flatMap(d => d.relatedQuestions?.slice(0, 2) || []),
          seasonalPotential: 'Medium', // Would be calculated from trends data
          competitiveness: 'Moderate' // Would be calculated based on search results
        }
      };

      setTrendAnalysis(prev => ({
        ...prev,
        results: formattedResults,
        isLoading: false
      }));

      toast.success('Trend analysis completed successfully');
    } catch (error) {
      console.error('Trend analysis failed:', error);
      toast.error('Failed to analyze trends. Check your SerpAPI configuration.');
      setTrendAnalysis(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const handleToggleSyncOption = (option: keyof typeof syncOptions) => {
    setSyncOptions({
      ...syncOptions,
      [option]: !syncOptions[option]
    });
  };
  
  const handleSyncNow = () => {
    toast.success('Syncing data from Shopify...');
    
    // Simulate sync process
    setTimeout(() => {
      toast.success('Sync completed successfully!');
    }, 2000);
  };
  
  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect your Shopify store? This will stop all data syncing.')) {
      setIsConnected(false);
      setShopifyUrl('');
      setShopifyApiKey('');
      setShopifyApiSecret('');
      setShopifyAccessToken('');
      toast.success('Disconnected from Shopify store');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Shopify Overview</h3>
        {isConnected && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSyncNow}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync Now</span>
            </button>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Connected
            </span>
          </div>
        )}
      </div>
      
      {!isConnected ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Connect Your Shopify Store</h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Connect your Shopify store to manage e-commerce marketing campaigns, track performance, and sync products.
            </p>

            <form onSubmit={handleConnectShopify} className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Shopify Store URL</label>
                <input
                  type="text"
                  value={shopifyUrl}
                  onChange={(e) => setShopifyUrl(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Example: your-store.myshopify.com</p>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="text-signal-blue hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
              
              {showAdvancedSettings && (
                <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">API Key</label>
                    <input
                      type="text"
                      value={shopifyApiKey}
                      onChange={(e) => setShopifyApiKey(e.target.value)}
                      placeholder="Shopify API Key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">API Secret</label>
                    <input
                      type="password"
                      value={shopifyApiSecret}
                      onChange={(e) => setShopifyApiSecret(e.target.value)}
                      placeholder="Shopify API Secret"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Access Token (Optional)</label>
                    <input
                      type="password"
                      value={shopifyAccessToken}
                      onChange={(e) => setShopifyAccessToken(e.target.value)}
                      placeholder="Shopify Access Token (if available)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2 text-left">Sync Options</h5>
                <div className="space-y-2">
                  {Object.entries(syncOptions).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`sync-${key}`}
                        checked={value}
                        onChange={() => handleToggleSyncOption(key as keyof typeof syncOptions)}
                        className="mr-2"
                      />
                      <label htmlFor={`sync-${key}`} className="text-sm text-gray-700 capitalize">
                        Sync {key}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isConnecting}
                className="w-full px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect Shopify Store'
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Store Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Products</h4>
                <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">124</div>
              <p className="text-sm text-green-600">↗ +8 this month</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Orders</h4>
                <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">87</div>
              <p className="text-sm text-green-600">↗ +12% this month</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Revenue</h4>
                <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$12,450</div>
              <p className="text-sm text-green-600">↗ +18% this month</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Customers</h4>
                <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">342</div>
              <p className="text-sm text-green-600">↗ +8% this month</p>
            </div>
          </div>
          
          {/* Integration Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Integration Status</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Shopify Store</h5>
                    <p className="text-sm text-gray-600">Connected to {shopifyUrl || 'your-store.myshopify.com'}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Auto Sync</h5>
                    <p className="text-sm text-gray-600">Syncs every 30 minutes</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Product Sync</h5>
                    <p className="text-sm text-gray-600">Last synced: 2 hours ago</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Order Tracking</h5>
                    <p className="text-sm text-gray-600">Real-time order monitoring</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Customer Sync</h5>
                    <p className="text-sm text-gray-600">Syncing with CRM</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">In Progress</span>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <span>Disconnect Store</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Products</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button 
            onClick={() => toast.success('Syncing products from Shopify...')}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Sync Products
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Inventory</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: 'Premium T-Shirt', sku: 'TS-001', price: 29.99, inventory: 45, status: 'active' },
                { id: 2, name: 'Wireless Headphones', sku: 'WH-100', price: 89.99, inventory: 12, status: 'active' },
                { id: 3, name: 'Leather Wallet', sku: 'LW-022', price: 49.99, inventory: 28, status: 'active' },
                { id: 4, name: 'Smart Watch', sku: 'SW-300', price: 199.99, inventory: 5, status: 'low_stock' },
                { id: 5, name: 'Fitness Tracker', sku: 'FT-110', price: 79.99, inventory: 0, status: 'out_of_stock' }
              ].map((product, index) => (
                <tr key={product.id} className={index < 4 ? "border-b border-gray-100" : ""}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 text-gray-600">{product.inventory}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' :
                      product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Active' : 
                       product.status === 'low_stock' ? 'Low Stock' : 
                       'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toast.success(`Viewing ${product.name} details`)}
                      className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAmazon = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Amazon Products</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              value={amazonSearchQuery}
              onChange={(e) => setAmazonSearchQuery(e.target.value)}
              placeholder="Search Amazon products..."
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchAmazon()}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button 
            onClick={handleSearchAmazon}
            disabled={isLoadingAmazon}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            {isLoadingAmazon ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      
      {isLoadingAmazon ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-signal-blue"></div>
        </div>
      ) : amazonProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {amazonProducts.map((product, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBasket className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">{product.price}</span>
                  <span className="text-sm text-yellow-600">★ {product.rating || 'N/A'}</span>
                </div>
                <button 
                  onClick={() => toast.success(`Product ${product.asin} would be imported to your store`)}
                  className="w-full mt-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Import to Store
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <ShoppingBasket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Amazon Products</h4>
            <p className="text-gray-600 mb-4">Search for products to import from Amazon.</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Shopify Analytics</h3>
        <button 
          onClick={() => toast.success('Exporting analytics report')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
        >
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Sales Overview</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900">This Month</h5>
                <span className="text-green-600">+18%</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$12,450</div>
              <p className="text-sm text-gray-600">87 orders</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900">Last Month</h5>
                <span className="text-green-600">+12%</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$10,580</div>
              <p className="text-sm text-gray-600">74 orders</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Top Products</h4>
          
          <div className="space-y-3">
            {[
              { name: 'Wireless Headphones', sales: '$1,799.80', units: 20 },
              { name: 'Smart Watch', sales: '$999.95', units: 5 },
              { name: 'Premium T-Shirt', sales: '$899.70', units: 30 },
              { name: 'Leather Wallet', sales: '$749.85', units: 15 }
            ].map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{product.name}</h5>
                  <p className="text-sm text-gray-600">{product.units} units</p>
                </div>
                <span className="font-medium text-gray-900">{product.sales}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Customer Insights</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h5 className="font-medium text-gray-900">New Customers</h5>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">48</div>
            <p className="text-sm text-green-600">+12% this month</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ShoppingCart className="w-5 h-5 text-purple-500" />
              <h5 className="font-medium text-gray-900">Avg. Order Value</h5>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$143.10</div>
            <p className="text-sm text-green-600">+5.2% this month</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-green-500" />
              <h5 className="font-medium text-gray-900">Conversion Rate</h5>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">3.2%</div>
            <p className="text-sm text-green-600">+0.4% this month</p>
          </div>
        </div>
      </div>
    </div>
  );

  // SerpAPI-powered render functions
  const renderProductResearch = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Research & Market Intelligence</h3>
        <p className="text-gray-600 mb-6">Analyze product opportunities, pricing trends, and market demand using real-time data.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product/Category to Research
            </label>
            <input
              type="text"
              value={productResearch.query}
              onChange={(e) => setProductResearch(prev => ({ ...prev, query: e.target.value }))}
              placeholder="e.g., wireless headphones, organic skincare, fitness trackers"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Market
            </label>
            <select
              value={productResearch.location}
              onChange={(e) => setProductResearch(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleProductResearch}
          disabled={productResearch.isLoading || !productResearch.query.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {productResearch.isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{productResearch.isLoading ? 'Researching...' : 'Research Products'}</span>
        </button>

        {/* Product Research Results */}
        {productResearch.results.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Research Results ({productResearch.results.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {productResearch.results.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 mb-3">
                    {product.image && (
                      <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded-lg" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 text-sm line-clamp-2">{product.title}</h5>
                      <p className="text-lg font-bold text-green-600 mt-1">{product.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{product.source}</span>
                    {product.rating && <span>⭐ {product.rating}</span>}
                  </div>
                  
                  {product.suggestions && product.suggestions.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Related Searches:</h6>
                      <div className="flex flex-wrap gap-1">
                        {product.suggestions.slice(0, 3).map((suggestion: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">{suggestion}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => window.open(product.link, '_blank')}
                    className="w-full px-3 py-1 text-xs bg-signal-blue text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Product</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompetitorAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">E-commerce Competitor Analysis</h3>
        <p className="text-gray-600 mb-6">Analyze competitor product listings, pricing strategies, and market presence.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competitor Domains (comma-separated)
            </label>
            <textarea
              value={competitorAnalysis.competitors}
              onChange={(e) => setCompetitorAnalysis(prev => ({ ...prev, competitors: e.target.value }))}
              placeholder="amazon.com, etsy.com, shopify-store.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products to Analyze (comma-separated)
            </label>
            <textarea
              value={competitorAnalysis.products}
              onChange={(e) => setCompetitorAnalysis(prev => ({ ...prev, products: e.target.value }))}
              placeholder="wireless headphones, bluetooth speakers, phone cases"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              rows={3}
            />
          </div>
        </div>
        
        <button
          onClick={handleCompetitorAnalysis}
          disabled={competitorAnalysis.isLoading || !competitorAnalysis.competitors.trim() || !competitorAnalysis.products.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {competitorAnalysis.isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
          <span>{competitorAnalysis.isLoading ? 'Analyzing...' : 'Analyze Competitors'}</span>
        </button>

        {/* Competitor Analysis Results */}
        {competitorAnalysis.results.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Competitor Analysis Results</h4>
            <div className="space-y-4">
              {competitorAnalysis.results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">{result.competitor} - {result.product}</h5>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-600">{result.organicResults} organic results</span>
                      <span className="text-green-600">{result.shoppingPresence} shopping listings</span>
                    </div>
                  </div>
                  
                  {result.topResult && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <h6 className="font-medium text-sm text-gray-900 mb-1">Top Organic Result:</h6>
                      <p className="text-sm text-gray-700 line-clamp-2">{result.topResult.title}</p>
                      <a href={result.topResult.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        {result.topResult.link}
                      </a>
                    </div>
                  )}
                  
                  {result.shoppingListings && result.shoppingListings.length > 0 && (
                    <div>
                      <h6 className="font-medium text-sm text-gray-900 mb-2">Shopping Listings:</h6>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {result.shoppingListings.map((listing: any, idx: number) => (
                          <div key={idx} className="border border-gray-200 rounded p-2 text-sm">
                            <p className="font-medium text-gray-900 line-clamp-1">{listing.title}</p>
                            <p className="text-green-600 font-bold">{listing.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTrendAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trend Analysis</h3>
        <p className="text-gray-600 mb-6">Analyze market trends, seasonal patterns, and emerging opportunities for product planning.</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords/Products to Analyze (comma-separated)
          </label>
          <textarea
            value={trendAnalysis.keywords}
            onChange={(e) => setTrendAnalysis(prev => ({ ...prev, keywords: e.target.value }))}
            placeholder="sustainable fashion, smart home devices, fitness equipment, organic food"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            rows={3}
          />
        </div>
        
        <button
          onClick={handleTrendAnalysis}
          disabled={trendAnalysis.isLoading || !trendAnalysis.keywords.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {trendAnalysis.isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
          <span>{trendAnalysis.isLoading ? 'Analyzing...' : 'Analyze Trends'}</span>
        </button>

        {/* Trend Analysis Results */}
        {trendAnalysis.results && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-6">Trend Analysis Insights</h4>
            
            {/* Insights Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-1">Highest Trend</h5>
                <p className="text-sm text-blue-700">{trendAnalysis.results.insights.highestTrend}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="font-medium text-green-900 mb-1">Seasonal Potential</h5>
                <p className="text-sm text-green-700">{trendAnalysis.results.insights.seasonalPotential}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h5 className="font-medium text-yellow-900 mb-1">Competitiveness</h5>
                <p className="text-sm text-yellow-700">{trendAnalysis.results.insights.competitiveness}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h5 className="font-medium text-purple-900 mb-1">Emerging Keywords</h5>
                <p className="text-sm text-purple-700">{trendAnalysis.results.insights.emergingKeywords.length} found</p>
              </div>
            </div>
            
            {/* Related Searches */}
            {trendAnalysis.results.relatedSearches && (
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Related Search Insights</h5>
                {trendAnalysis.results.relatedSearches.map((data: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h6 className="font-medium text-gray-900 mb-3">{data.keyword}</h6>
                    
                    {data.relatedQuestions && data.relatedQuestions.length > 0 && (
                      <div className="mb-3">
                        <h7 className="text-sm font-medium text-gray-700 mb-2">Related Questions:</h7>
                        <div className="space-y-1">
                          {data.relatedQuestions.slice(0, 3).map((question: string, idx: number) => (
                            <p key={idx} className="text-sm text-gray-600">• {question}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {data.peopleAlsoAsk && data.peopleAlsoAsk.length > 0 && (
                      <div>
                        <h7 className="text-sm font-medium text-gray-700 mb-2">People Also Ask:</h7>
                        <div className="space-y-1">
                          {data.peopleAlsoAsk.slice(0, 3).map((question: string, idx: number) => (
                            <p key={idx} className="text-sm text-gray-600">• {question}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'product-research', label: 'Product Research', icon: Search },
    { id: 'competitor-analysis', label: 'Competitor Analysis', icon: Target },
    { id: 'trend-analysis', label: 'Trend Analysis', icon: TrendingUp },
    { id: 'amazon', label: 'Amazon', icon: ShoppingBasket },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shopify Integration</h2>
        <p className="text-gray-600">Manage your e-commerce marketing and analytics</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-signal-blue text-signal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'product-research' && renderProductResearch()}
        {activeTab === 'competitor-analysis' && renderCompetitorAnalysis()}
        {activeTab === 'trend-analysis' && renderTrendAnalysis()}
        {activeTab === 'amazon' && renderAmazon()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default ShopifyIntegration;