import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Image as ImageIcon, 
  TrendingUp, 
  Search, 
  Target, 
  Zap, 
  Download, 
  Eye, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Globe, 
  Camera, 
  Layers,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  ExternalLink,
  Upload,
  FileText,
  Award,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import shopifyOptimizationApi from '../../../lib/shopifyOptimizationApi';

interface ConnectedStore {
  id: string;
  shopDomain: string;
  plan: string;
  primaryDomain: string;
  country: string;
  currency: string;
  lastSync: string;
  status: 'connected' | 'syncing' | 'error';
}

const ShopifySEODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'images' | 'seo' | 'competitors' | 'apps'>('overview');
  const [connectedStores, setConnectedStores] = useState<ConnectedStore[]>([]);
  const [selectedStore, setSelectedStore] = useState<ConnectedStore | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectionData, setConnectionData] = useState({ shopDomain: '', accessToken: '' });

  // Image Optimization State
  const [images, setImages] = useState<any[]>([]);
  const [optimizationSettings, setOptimizationSettings] = useState({
    quality: 85,
    format: 'auto' as const,
    enableResponsive: true,
    enableLazyLoading: true,
    enableAltTextGeneration: true,
    enableSEOOptimization: true,
    compressionLevel: 'high' as const
  });
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // SEO Analysis State
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);
  const [keywordRankings, setKeywordRankings] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);

  useEffect(() => {
    // Load mock connected stores
    const mockStores: ConnectedStore[] = [
      {
        id: '1',
        shopDomain: 'my-awesome-store.myshopify.com',
        plan: 'Shopify Plus',
        primaryDomain: 'awesomestore.com',
        country: 'United States',
        currency: 'USD',
        lastSync: new Date().toISOString(),
        status: 'connected'
      }
    ];
    setConnectedStores(mockStores);
    setSelectedStore(mockStores[0]);
  }, []);

  // Connect Shopify Store
  const handleConnectStore = async () => {
    if (!connectionData.shopDomain || !connectionData.accessToken) {
      toast.error('Please provide both shop domain and access token');
      return;
    }

    setLoading(true);
    try {
      const store = await shopifyOptimizationApi.connectStore(
        connectionData.shopDomain,
        connectionData.accessToken
      );

      const newStore: ConnectedStore = {
        id: store.id,
        shopDomain: store.shopDomain,
        plan: store.plan,
        primaryDomain: store.primaryDomain,
        country: store.country,
        currency: store.currency,
        lastSync: new Date().toISOString(),
        status: 'connected'
      };

      setConnectedStores([...connectedStores, newStore]);
      setSelectedStore(newStore);
      setShowConnectModal(false);
      toast.success('Store connected successfully!');
    } catch (error) {
      toast.error('Failed to connect store');
    } finally {
      setLoading(false);
    }
  };

  // Load store data
  const loadStoreData = async (store: ConnectedStore) => {
    setLoading(true);
    try {
      // Load images
      const storeImages = await shopifyOptimizationApi.analyzeStoreImages({
        id: store.id,
        shopDomain: store.shopDomain,
        accessToken: 'mock_token',
        plan: store.plan,
        primaryDomain: store.primaryDomain,
        country: store.country,
        currency: store.currency,
        timezone: 'UTC'
      });
      setImages(storeImages);

      // Load SEO analysis
      const analysis = await shopifyOptimizationApi.analyzeSEO({
        id: store.id,
        shopDomain: store.shopDomain,
        accessToken: 'mock_token',
        plan: store.plan,
        primaryDomain: store.primaryDomain,
        country: store.country,
        currency: store.currency,
        timezone: 'UTC'
      });
      setSeoAnalysis(analysis);

      // Load keyword rankings
      const rankings = await shopifyOptimizationApi.getKeywordRankings(
        store.primaryDomain,
        ['ecommerce', 'online store', 'products']
      );
      setKeywordRankings(rankings);

      // Load competitor analysis
      const competitorData = await shopifyOptimizationApi.analyzeCompetitors(store.primaryDomain);
      setCompetitors(competitorData);

    } catch (error) {
      toast.error('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  // Optimize images
  const handleBulkOptimization = async () => {
    if (!selectedStore || images.length === 0) return;

    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      const result = await shopifyOptimizationApi.bulkOptimizeImages(
        images,
        optimizationSettings,
        (progress) => setOptimizationProgress(progress)
      );

      toast.success(`Optimized ${result.optimized} images, saved ${(result.saved / 1024 / 1024).toFixed(2)} MB`);
      
      // Reload images to show updated status
      loadStoreData(selectedStore);
    } catch (error) {
      toast.error('Bulk optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    if (selectedStore) {
      loadStoreData(selectedStore);
    }
  }, [selectedStore]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Store className="w-8 h-8 text-blue-600 mr-3" />
              Shopify SEO Optimizer
            </h1>
            <p className="text-gray-600 mt-1">Smart image optimization & enterprise SEO analytics for Shopify stores</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Store
            </button>
          </div>
        </div>

        {/* Store Selector */}
        {connectedStores.length > 0 && (
          <div className="flex items-center space-x-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Selected Store:</label>
            <select
              value={selectedStore?.id || ''}
              onChange={(e) => {
                const store = connectedStores.find(s => s.id === e.target.value);
                setSelectedStore(store || null);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {connectedStores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.primaryDomain} ({store.plan})
                </option>
              ))}
            </select>
            <div className={`w-2 h-2 rounded-full ${
              selectedStore?.status === 'connected' ? 'bg-green-500' : 
              selectedStore?.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'images', label: 'Image Optimizer', icon: ImageIcon },
              { id: 'seo', label: 'SEO Analysis', icon: TrendingUp },
              { id: 'competitors', label: 'Competitors', icon: Target },
              { id: 'apps', label: 'Shopify Apps', icon: Store }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && selectedStore && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <ImageIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{images.length}</div>
                  <div className="text-sm text-gray-600">Total Images</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {images.filter(img => img.optimized).length}
                  </div>
                  <div className="text-sm text-gray-600">Optimized</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {seoAnalysis?.overallScore || 0}
                  </div>
                  <div className="text-sm text-gray-600">SEO Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {keywordRankings.filter(k => k.position <= 10).length}
                  </div>
                  <div className="text-sm text-gray-600">Top 10 Keywords</div>
                </div>
              </div>
            </div>

            {/* SEO Overview */}
            {seoAnalysis && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Health Check</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="font-medium">Page Title</span>
                    </div>
                    <span className="text-sm text-gray-600">Optimized</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                      <span className="font-medium">Images Alt Text</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {seoAnalysis.images.withAlt}/{seoAnalysis.images.total} optimized
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="font-medium">Mobile Friendly</span>
                    </div>
                    <span className="text-sm text-gray-600">Passed</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                      <span className="font-medium">Page Speed</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {seoAnalysis.performance.mobileSpeed}/100
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleBulkOptimization}
                  disabled={isOptimizing || images.length === 0}
                  className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Optimizing... {Math.round(optimizationProgress)}%
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize All Images
                    </>
                  )}
                </button>
                <button
                  onClick={() => selectedStore && loadStoreData(selectedStore)}
                  className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Analysis
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View SEO Report
                </button>
              </div>
            </div>

            {/* Recent Keywords */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Keywords</h3>
              <div className="space-y-3">
                {keywordRankings.slice(0, 5).map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{keyword.keyword}</div>
                      <div className="text-sm text-gray-500">Vol: {keyword.volume}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(keyword.trend)}
                      <span className="font-medium text-gray-900">#{keyword.position}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Optimizer Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          {/* Optimization Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 text-blue-600 mr-2" />
              Optimization Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={optimizationSettings.quality}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    quality: parseInt(e.target.value)
                  })}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{optimizationSettings.quality}%</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  value={optimizationSettings.format}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    format: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="auto">Auto (Best)</option>
                  <option value="webp">WebP</option>
                  <option value="jpg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compression</label>
                <select
                  value={optimizationSettings.compressionLevel}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    compressionLevel: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="low">Low (Highest Quality)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Recommended)</option>
                  <option value="maximum">Maximum</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4">
              {[
                { key: 'enableResponsive', label: 'Responsive Images' },
                { key: 'enableLazyLoading', label: 'Lazy Loading' },
                { key: 'enableAltTextGeneration', label: 'Auto Alt Text' },
                { key: 'enableSEOOptimization', label: 'SEO Optimization' }
              ].map((option) => (
                <label key={option.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={optimizationSettings[option.key as keyof typeof optimizationSettings] as boolean}
                    onChange={(e) => setOptimizationSettings({
                      ...optimizationSettings,
                      [option.key]: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {images.filter(img => img.optimized).length}/{images.length} optimized
                </span>
                <button
                  onClick={handleBulkOptimization}
                  disabled={isOptimizing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Optimize All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {image.format.toUpperCase()} • {(image.fileSize / 1024).toFixed(0)}KB
                      </span>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        image.optimized 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {image.optimized ? 'Optimized' : 'Needs Optimization'}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-600 mb-1">SEO Score</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            image.seoScore >= 80 ? 'bg-green-500' :
                            image.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${image.seoScore}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{image.seoScore}/100</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Optimize
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO Analysis Tab */}
      {activeTab === 'seo' && seoAnalysis && (
        <div className="space-y-6">
          {/* SEO Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">SEO Analysis</h3>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{seoAnalysis.overallScore}</div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Load Time</span>
                    <span className="font-medium">{seoAnalysis.performance.loadTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile Speed</span>
                    <span className="font-medium">{seoAnalysis.performance.mobileSpeed}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Desktop Speed</span>
                    <span className="font-medium">{seoAnalysis.performance.desktopSpeed}/100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Technical SEO</h4>
                <div className="space-y-3">
                  {Object.entries(seoAnalysis.techSEO).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      {value ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Content</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">H1 Tags</span>
                    <span className="font-medium">{seoAnalysis.headings.h1.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">H2 Tags</span>
                    <span className="font-medium">{seoAnalysis.headings.h2.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Images with Alt</span>
                    <span className="font-medium">
                      {seoAnalysis.images.withAlt}/{seoAnalysis.images.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Rankings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Rankings</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Keyword</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Volume</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Difficulty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordRankings.slice(0, 10).map((keyword, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{keyword.keyword}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          keyword.position <= 3 ? 'bg-green-100 text-green-800' :
                          keyword.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          #{keyword.position}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{keyword.volume.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">{keyword.difficulty}%</td>
                      <td className="py-3 px-4">{getTrendIcon(keyword.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Competitors Tab */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          {competitors.map((competitor, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{competitor.competitor}</h3>
                  <p className="text-gray-600">{competitor.domain}</p>
                </div>
                <a
                  href={`https://${competitor.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Site
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {competitor.organicKeywords.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Organic Keywords</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {competitor.organicTraffic.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Organic Traffic</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {competitor.backlinks.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Backlinks</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {competitor.gapKeywords.length}
                  </div>
                  <div className="text-sm text-gray-600">Keyword Gaps</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Top Keywords</h4>
                  <div className="space-y-2">
                    {competitor.topKeywords.slice(0, 5).map((keyword, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{keyword.keyword}</span>
                        <span className="text-sm text-gray-600">#{keyword.position}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Keyword Opportunities</h4>
                  <div className="space-y-2">
                    {competitor.gapKeywords.slice(0, 5).map((keyword, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">{keyword.keyword}</span>
                        <span className="text-sm text-green-600">{keyword.opportunity}% opp</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shopify Apps Tab */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Your Own Shopify App</h3>
            <p className="text-gray-600 mb-6">
              Create a custom Shopify app with B3ACON's SEO optimization tools for your clients.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create App Listing
            </button>
          </div>

          {/* Sample App Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'B3ACON Smart Image Optimizer',
                description: 'Automatically optimize all your product images for better SEO and faster loading',
                price: '$29/month',
                rating: 4.8,
                reviews: 156,
                features: ['Auto image compression', 'SEO optimization', 'Bulk processing', 'Alt text generation']
              },
              {
                name: 'B3ACON SEO Analyzer',
                description: 'Complete SEO analysis and optimization suite for Shopify stores',
                price: '$49/month',
                rating: 4.9,
                reviews: 243,
                features: ['Keyword tracking', 'Competitor analysis', 'Technical SEO', 'Performance monitoring']
              },
              {
                name: 'B3ACON Store Optimizer',
                description: 'All-in-one optimization suite combining images, SEO, and performance',
                price: '$79/month',
                rating: 4.7,
                reviews: 89,
                features: ['Image optimization', 'SEO analysis', 'Speed optimization', 'Conversion tracking']
              }
            ].map((app, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{app.name}</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(app.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">{app.rating} ({app.reviews})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{app.price}</div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{app.description}</p>
                
                <div className="space-y-2 mb-4">
                  {app.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Install App
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connect Store Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Connect Shopify Store</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Domain</label>
                <input
                  type="text"
                  placeholder="mystore.myshopify.com"
                  value={connectionData.shopDomain}
                  onChange={(e) => setConnectionData({ ...connectionData, shopDomain: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <input
                  type="password"
                  placeholder="shpat_..."
                  value={connectionData.accessToken}
                  onChange={(e) => setConnectionData({ ...connectionData, accessToken: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Need help getting your access token?</p>
                <a href="#" className="text-blue-600 hover:underline">View our setup guide</a>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectStore}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Store'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopifySEODashboard;