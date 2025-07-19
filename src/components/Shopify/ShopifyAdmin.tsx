import React, { useState } from 'react';
import { 
  Settings, 
  DollarSign, 
  Users, 
  BarChart3, 
  ToggleLeft, 
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Mail,
  Bell,
  Globe,
  Shield,
  Zap,
  Store,
  TrendingUp,
  Sparkles,
  Database,
  CreditCard,
  Lock
} from 'lucide-react';
import '../../styles/premium-design-system.css';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  trialDays: number;
  isActive: boolean;
}

interface AppMetrics {
  activeInstalls: number;
  churnRate: number;
  apiUsage: number;
  revenue: number;
  growth: number;
}

const ShopifyAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [metrics] = useState<AppMetrics>({
    activeInstalls: 12847,
    churnRate: 2.3,
    apiUsage: 1250000,
    revenue: 285000,
    growth: 15.2
  });

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
    {
      id: 'trial',
      name: 'Free Trial',
      description: 'Perfect for testing all features',
      price: 0,
      period: '14 days',
      features: [
        'SEO Analysis for 50 pages',
        'Basic internal linking',
        'Shopify integration',
        'Email support'
      ],
      trialDays: 14,
      isActive: true
    },
    {
      id: 'growth',
      name: 'Growth Tier',
      description: 'For growing eCommerce stores',
      price: 29,
      period: 'month',
      features: [
        'SEO Analysis for 500 pages',
        'Advanced internal linking',
        'Amazon + Shopify sync',
        'Priority support',
        'Custom reporting'
      ],
      trialDays: 14,
      isActive: true
    },
    {
      id: 'pro',
      name: 'Pro Agency',
      description: 'For agencies managing multiple stores',
      price: 99,
      period: 'month',
      features: [
        'Unlimited page analysis',
        'White-label reporting',
        'Multi-store management',
        'API access',
        'Dedicated account manager'
      ],
      trialDays: 14,
      isActive: true
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    announcementBar: {
      enabled: true,
      message: '🎉 New feature: Amazon sync is now available!',
      type: 'info' as 'info' | 'warning' | 'success'
    },
    features: {
      seoAnalyzer: true,
      internalLinking: true,
      amazonSync: true,
      siteSpeed: false,
      rankTracker: true
    },
    webhooks: {
      klaviyo: 'https://api.klaviyo.com/webhooks/b3acon',
      slack: 'https://hooks.slack.com/services/...'
    }
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'plans', label: 'Pricing Plans', icon: DollarSign },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'features', label: 'Feature Control', icon: ToggleLeft },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'App Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          B3ACON App <span className="text-gradient-primary">Admin Portal</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Manage your Shopify app, monitor performance, and control user access
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 metric-card-emerald">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="text-emerald-600 text-sm font-semibold">
              +{metrics.growth}%
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Active Installs</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeInstalls.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card p-6 metric-card-blue">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-blue-600 text-sm font-semibold">
              +{metrics.growth}%
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</p>
            <p className="text-3xl font-bold text-gray-900">${(metrics.revenue / 1000).toFixed(0)}K</p>
          </div>
        </div>

        <div className="glass-card p-6 metric-card-purple">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="text-purple-600 text-sm font-semibold">
              -0.3%
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">API Usage</p>
            <p className="text-3xl font-bold text-gray-900">{(metrics.apiUsage / 1000000).toFixed(1)}M</p>
          </div>
        </div>

        <div className="glass-card p-6 metric-card-pink">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-pink-600 text-sm font-semibold">
              -{metrics.churnRate}%
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Churn Rate</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.churnRate}%</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('plans')}
            className="btn-premium btn-outline p-4 h-auto flex flex-col items-center space-y-2"
          >
            <DollarSign className="w-8 h-8 text-indigo-600" />
            <span className="font-medium">Manage Pricing</span>
            <span className="text-sm text-gray-600">Update plans and pricing</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className="btn-premium btn-outline p-4 h-auto flex flex-col items-center space-y-2"
          >
            <Users className="w-8 h-8 text-purple-600" />
            <span className="font-medium">User Management</span>
            <span className="text-sm text-gray-600">View and manage users</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('features')}
            className="btn-premium btn-outline p-4 h-auto flex flex-col items-center space-y-2"
          >
            <ToggleLeft className="w-8 h-8 text-emerald-600" />
            <span className="font-medium">Feature Control</span>
            <span className="text-sm text-gray-600">Enable/disable features</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPricingPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pricing Plans Management</h2>
        <button 
          onClick={() => setShowAddPlan(true)}
          className="btn-premium btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add New Plan
        </button>
      </div>

      <div className="grid gap-6">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    plan.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Trial Period:</span>
                    <div className="font-medium text-gray-900">{plan.trialDays} days</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Feature Toggle Management</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Plugins</h3>
        <div className="space-y-4">
          {Object.entries(globalSettings.features).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'seoAnalyzer' && 'On-page audit and structured data detection'}
                  {key === 'internalLinking' && 'AI-powered internal link suggestions'}
                  {key === 'amazonSync' && 'Cross-platform inventory synchronization'}
                  {key === 'siteSpeed' && 'Core Web Vitals monitoring'}
                  {key === 'rankTracker' && 'Keyword position tracking'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      [key]: e.target.checked
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">App Analytics</h2>
        <button className="btn-secondary">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="b3acon-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 counter-animate">
                {metrics.activeInstalls.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Active Installs</div>
            </div>
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.churnRate}%</div>
              <div className="text-sm text-gray-600">Churn Rate</div>
            </div>
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(metrics.apiUsage / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">API Calls</div>
            </div>
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${(metrics.revenue / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-lime-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">+{metrics.growth}%</div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
        <div className="space-y-4">
          {pricingPlans.filter(p => p.isActive).map((plan) => (
            <div key={plan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{plan.name}</div>
                <div className="text-sm text-gray-600">${plan.price}/{plan.period}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {Math.floor(Math.random() * 1000 + 500)} subscribers
                </div>
                <div className="text-sm text-green-600">
                  ${(plan.price * Math.floor(Math.random() * 1000 + 500)).toLocaleString()} revenue
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Global Settings</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Announcement Bar
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Enable Announcement</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={globalSettings.announcementBar.enabled}
                onChange={(e) => setGlobalSettings(prev => ({
                  ...prev,
                  announcementBar: {
                    ...prev.announcementBar,
                    enabled: e.target.checked
                  }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={globalSettings.announcementBar.message}
              onChange={(e) => setGlobalSettings(prev => ({
                ...prev,
                announcementBar: {
                  ...prev.announcementBar,
                  message: e.target.value
                }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Webhook Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klaviyo Webhook URL
            </label>
            <input
              type="url"
              value={globalSettings.webhooks.klaviyo}
              onChange={(e) => setGlobalSettings(prev => ({
                ...prev,
                webhooks: {
                  ...prev.webhooks,
                  klaviyo: e.target.value
                }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
              placeholder="https://api.klaviyo.com/webhooks/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slack Webhook URL
            </label>
            <input
              type="url"
              value={globalSettings.webhooks.slack}
              onChange={(e) => setGlobalSettings(prev => ({
                ...prev,
                webhooks: {
                  ...prev.webhooks,
                  slack: e.target.value
                }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-premium btn-primary">
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
      
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Total Users:</span>
            <span className="font-bold text-indigo-600">{metrics.activeInstalls.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            { store: 'techgear.myshopify.com', plan: 'Growth', status: 'active', revenue: '$89/mo' },
            { store: 'beautybrand.myshopify.com', plan: 'Pro', status: 'active', revenue: '$199/mo' },
            { store: 'fashionstore.myshopify.com', plan: 'Starter', status: 'trial', revenue: '$0/mo' },
          ].map((user, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.store}</div>
                  <div className="text-sm text-gray-600">{user.plan} Plan</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
                <span className="font-semibold text-gray-900">{user.revenue}</span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'plans':
        return renderPricingPlans();
      case 'users':
        return renderUserManagement();
      case 'features':
        return renderFeatures();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-primary">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-8xl">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">B3ACON</h1>
                <p className="text-sm text-gray-600">Admin Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-sm font-medium">Admin Access</span>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-8xl py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/60 text-gray-600 hover:bg-white/80'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ShopifyAdmin;