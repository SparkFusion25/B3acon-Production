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
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  Crown,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Plus,
  Camera,
  Star,
  Users,
  Clock,
  Shield
} from 'lucide-react';

// Shopify App Bridge imports (these would be actual imports in production)
declare global {
  interface Window {
    ShopifyApp: any;
  }
}

interface ShopifyAppProps {
  shop: string;
  host: string;
}

const ShopifyApp: React.FC<ShopifyAppProps> = ({ shop, host }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'images' | 'seo' | 'upgrade'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<'free' | 'starter' | 'professional' | 'enterprise'>('free');
  
  // Mock data for the embedded app
  const [storeData, setStoreData] = useState({
    totalProducts: 156,
    imagesOptimized: 45,
    seoScore: 78,
    pageSpeed: 67,
    keywords: 23,
    monthlyVisitors: 12500
  });

  const [recentOptimizations, setRecentOptimizations] = useState([
    { id: 1, product: 'Premium Headphones', improvement: '65%', type: 'image' },
    { id: 2, product: 'Wireless Charger', improvement: '42%', type: 'seo' },
    { id: 3, product: 'Phone Case Set', improvement: '58%', type: 'image' }
  ]);

  useEffect(() => {
    // Initialize Shopify App Bridge (mock for now)
    if (typeof window !== 'undefined' && window.ShopifyApp) {
      const app = window.ShopifyApp.createApp({
        apiKey: process.env.SHOPIFY_API_KEY,
        host: host,
        forceRedirect: true
      });
    }
  }, [host]);

  const handleOptimizeImages = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStoreData(prev => ({
        ...prev,
        imagesOptimized: prev.imagesOptimized + 15
      }));
      setIsLoading(false);
    }, 2000);
  };

  const handleUpgrade = (plan: string) => {
    // In production, this would trigger Shopify's billing API
    window.open(`https://b3acon.com/upgrade?plan=${plan}&shop=${shop}`, '_blank');
  };

  const handleFullPlatformUpgrade = () => {
    window.open(`https://app.b3acon.com/signup?source=shopify&shop=${shop}`, '_blank');
  };

  const getFeatureStatus = (feature: string) => {
    const limits = {
      free: { images: 10, keywords: 5, reports: 1 },
      starter: { images: 100, keywords: 25, reports: 5 },
      professional: { images: 1000, keywords: 200, reports: 'unlimited' },
      enterprise: { images: 'unlimited', keywords: 'unlimited', reports: 'unlimited' }
    };
    return limits[subscription];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">B3ACON SEO Optimizer</h1>
              <p className="text-gray-600">Smart optimization for {shop}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription === 'free' ? 'bg-gray-100 text-gray-800' :
              subscription === 'starter' ? 'bg-blue-100 text-blue-800' :
              subscription === 'professional' ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {subscription.charAt(0).toUpperCase() + subscription.slice(1)} Plan
            </div>
            
            {subscription === 'free' && (
              <button
                onClick={() => setActiveTab('upgrade')}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'images', label: 'Image Optimizer', icon: ImageIcon },
            { id: 'seo', label: 'SEO Analysis', icon: TrendingUp },
            { id: 'upgrade', label: 'Upgrade', icon: Crown }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">SEO Score</p>
                  <p className="text-3xl font-bold text-gray-900">{storeData.seoScore}/100</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${storeData.seoScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Images Optimized</p>
                  <p className="text-3xl font-bold text-gray-900">{storeData.imagesOptimized}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {storeData.totalProducts - storeData.imagesOptimized} remaining
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Speed</p>
                  <p className="text-3xl font-bold text-gray-900">{storeData.pageSpeed}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">+12% this month</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Optimizations</h3>
            <div className="space-y-3">
              {recentOptimizations.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {item.type === 'image' ? (
                      <Camera className="w-5 h-5 text-green-600" />
                    ) : (
                      <Search className="w-5 h-5 text-blue-600" />
                    )}
                    <span className="font-medium text-gray-900">{item.product}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-medium">+{item.improvement}</span>
                    <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleOptimizeImages}
                disabled={isLoading}
                className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mr-2" />
                ) : (
                  <Zap className="w-5 h-5 text-blue-600 mr-2" />
                )}
                {isLoading ? 'Optimizing...' : 'Optimize All Images'}
              </button>
              
              <button
                onClick={() => setActiveTab('seo')}
                className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Run SEO Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Image Optimization</h3>
              <div className="text-sm text-gray-500">
                Limit: {getFeatureStatus('images').images} images/month
              </div>
            </div>

            {subscription === 'free' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800">You've reached your free plan limit. Upgrade to optimize more images.</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Product Image {i + 1}</span>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        i < 3 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {i < 3 ? 'Optimized' : 'Pending'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Original: {Math.floor(Math.random() * 500 + 200)}KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className="font-medium">Meta Description</span>
                  </div>
                  <span className="text-sm text-gray-600">Needs Work</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="font-medium">HTTPS</span>
                  </div>
                  <span className="text-sm text-gray-600">Secure</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Top Keywords</h4>
                  <div className="space-y-2">
                    {['ecommerce store', 'online shopping', 'premium products'].map((keyword, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{keyword}</span>
                        <span className="text-sm font-medium text-gray-900">#{Math.floor(Math.random() * 50 + 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {subscription === 'free' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Unlock Advanced SEO Analysis</h4>
                    <p className="text-sm text-blue-700">Get detailed competitor analysis, keyword tracking, and more.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('upgrade')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upgrade Tab */}
      {activeTab === 'upgrade' && (
        <div className="space-y-6">
          {/* Full Platform Promotion */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Unlock the Full B3ACON Platform</h2>
                <p className="text-purple-100 mb-4">
                  Get access to global commerce tools, CRM, social media management, and 20+ additional modules.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Multi-client management
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    White-label solutions
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Agency dashboard
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={handleFullPlatformUpgrade}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
                >
                  Upgrade to Full Platform
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
                <p className="text-xs text-purple-200 mt-2">Starting at $99/month</p>
              </div>
            </div>
          </div>

          {/* Shopify App Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 29.99,
                features: [
                  'Up to 100 images/month',
                  'Basic SEO analysis',
                  'Core Web Vitals',
                  '25 keyword tracking',
                  'Email support'
                ]
              },
              {
                name: 'Professional',
                price: 79.99,
                popular: true,
                features: [
                  'Up to 1,000 images/month',
                  'Advanced SEO analysis',
                  'Competitor analysis',
                  '200 keyword tracking',
                  'Priority support',
                  'Custom reporting'
                ]
              },
              {
                name: 'Enterprise',
                price: 199.99,
                features: [
                  'Unlimited images',
                  'Full SEO suite',
                  'Advanced competitor intel',
                  'Unlimited keywords',
                  'Dedicated manager',
                  'API access'
                ]
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-sm border-2 p-6 relative ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.name.toLowerCase())}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {subscription === 'free' ? 'Start Free Trial' : 'Switch Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopifyApp;