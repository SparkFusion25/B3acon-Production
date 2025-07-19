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
  Zap
} from 'lucide-react';
import '../../styles/shopify-app.css';

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
  const [activeTab, setActiveTab] = useState('plans');
  const [showAddPlan, setShowAddPlan] = useState(false);

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
    { id: 'plans', label: 'Pricing Plans', icon: DollarSign },
    { id: 'features', label: 'Features', icon: ToggleLeft },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderPricingPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pricing Plans Management</h2>
        <button 
          onClick={() => setShowAddPlan(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add New Plan
        </button>
      </div>

      <div className="grid gap-6">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
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
        <button className="btn-primary">
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'plans':
        return renderPricingPlans();
      case 'features':
        return renderFeatures();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderPricingPlans();
    }
  };

  return (
    <div className="b3acon-app min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">B3ACON Admin</h1>
                <p className="text-sm text-gray-600">Shopify App Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Admin Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex flex-wrap space-x-4 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-lime-500 text-lime-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ShopifyAdmin;