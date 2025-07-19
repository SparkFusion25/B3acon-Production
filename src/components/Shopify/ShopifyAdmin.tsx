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
  Home,
  Package,
  CreditCard,
  TrendingUp,
  Activity
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

  const adminNavItems = [
    { 
      id: 'plans', 
      label: 'Pricing Plans', 
      icon: CreditCard,
      href: '/shopify/admin/plans',
      description: 'Manage subscription plans and pricing'
    },
    { 
      id: 'features', 
      label: 'Feature Toggles', 
      icon: ToggleLeft,
      href: '/shopify/admin/features',
      description: 'Enable/disable app features'
    },
    { 
      id: 'analytics', 
      label: 'App Analytics', 
      icon: Activity,
      href: '/shopify/admin/analytics', 
      description: 'View app performance metrics'
    },
    { 
      id: 'settings', 
      label: 'Global Settings', 
      icon: Settings,
      href: '/shopify/admin/settings',
      description: 'Configure app-wide settings'
    },
  ];

  const handleNavigation = (navItem) => {
    setActiveTab(navItem.id);
    // In a real app, you would use react-router here:
    // navigate(navItem.href);
  };

  const renderPricingPlans = () => (
    <div className="space-y-8">
      <div className="glass-card-dark p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-indigo-400" />
              Pricing Plans Management
            </h2>
            <p className="text-indigo-200">Configure subscription plans and pricing for your Shopify app</p>
          </div>
          <button 
            onClick={() => setShowAddPlan(true)}
            className="btn-premium btn-primary btn-large group"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>Add New Plan</span>
          </button>
        </div>

        <div className="grid gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className="glass-card p-6 border border-white/10 hover:border-indigo-500/30 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      plan.isActive 
                        ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30' 
                        : 'bg-gray-500/20 text-gray-600 border border-gray-500/30'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gradient-primary">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500 text-lg">/{plan.period}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-gray-500 font-medium">Trial Period:</span>
                      <div className="px-3 py-1 bg-indigo-500/20 text-indigo-600 text-sm font-medium rounded-lg inline-block">
                        {plan.trialDays} days free
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-indigo-500" />
                      Features:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <button className="btn-premium btn-ghost btn-small group" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn-premium btn-ghost btn-small group" title="Edit Plan">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn-premium btn-ghost btn-small text-red-600 hover:bg-red-50 group" title="Delete Plan">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-8">
      <div className="glass-card-dark p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <ToggleLeft className="w-6 h-6 mr-3 text-indigo-400" />
            Feature Toggle Management
          </h2>
          <p className="text-indigo-200">Enable or disable features across all Shopify app installations</p>
        </div>
        
        <div className="glass-card p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-indigo-500" />
            SEO Plugins & Tools
          </h3>
          <div className="space-y-4">
            {Object.entries(globalSettings.features).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 capitalize mb-1">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div className="glass-card-dark p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-indigo-400" />
              App Analytics Dashboard
            </h2>
            <p className="text-indigo-200">Real-time performance metrics and insights</p>
          </div>
          <button className="btn-premium btn-outline btn-large group">
            <Download className="w-5 h-5 mr-2" />
            <span>Export Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gradient-primary mb-1">
              {metrics.activeInstalls.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Active Installs</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gradient-primary mb-1">{metrics.churnRate}%</div>
            <div className="text-sm text-gray-600">Churn Rate</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gradient-primary mb-1">
              {(metrics.apiUsage / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">API Calls</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gradient-primary mb-1">
              ${(metrics.revenue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gradient-success mb-1">+{metrics.growth}%</div>
            <div className="text-sm text-gray-600">Growth Rate</div>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-indigo-500" />
            Revenue Breakdown by Plan
          </h3>
          <div className="space-y-4">
            {pricingPlans.filter(p => p.isActive).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <div className="font-semibold text-gray-900">{plan.name}</div>
                  <div className="text-sm text-gray-600">${plan.price}/{plan.period}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {Math.floor(Math.random() * 1000 + 500)} subscribers
                  </div>
                  <div className="text-sm font-medium text-emerald-600">
                    ${(plan.price * Math.floor(Math.random() * 1000 + 500)).toLocaleString()} revenue
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div className="glass-card-dark p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-indigo-400" />
            Global Settings
          </h2>
          <p className="text-indigo-200">Configure global app settings and integrations</p>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-indigo-500" />
              Announcement Bar
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="font-semibold text-gray-900">Enable Announcement</span>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Announcement Message
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
                  className="input-premium w-full"
                  rows={3}
                  placeholder="Enter announcement message..."
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-indigo-500" />
              Webhook Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="input-premium w-full"
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
                  className="input-premium w-full"
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn-premium btn-primary btn-large group">
              <Save className="w-5 h-5 mr-2" />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="flex">
        {/* Left Sidebar - Like App Dashboard */}
        <div className="w-80 min-h-screen glass-card-dark border-r border-white/10">
          {/* Admin Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Admin Portal</h2>
                <p className="text-xs text-indigo-300">App Management</p>
              </div>
            </div>
          </div>

          {/* Admin Navigation */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                Admin Functions
              </h3>
            </div>
            <nav className="space-y-2">
              {adminNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                    }`}
                    title={item.description}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      {!isActive && (
                        <div className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Admin Status */}
          <div className="mt-auto p-6 border-t border-white/10">
            <div className="flex items-center space-x-3 px-4 py-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div>
                <div className="text-sm font-medium text-emerald-300">Admin Access</div>
                <div className="text-xs text-emerald-400">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Like App Dashboard */}
        <div className="flex-1">
          {/* Top Header */}
          <div className="glass-card-dark border-b border-white/10 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    <span className="text-gradient-primary">B3ACON</span> Admin Dashboard
                  </h1>
                  <p className="text-indigo-200">Shopify App Management & Analytics</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-indigo-200 text-sm">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area with Consistent Centering */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyAdmin;