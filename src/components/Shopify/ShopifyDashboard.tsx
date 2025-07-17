import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  Plug, 
  CreditCard, 
  Settings, 
  Bell,
  User,
  Store,
  Activity,
  TrendingUp,
  Link2,
  ShoppingBag,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  Target,
  Globe
} from 'lucide-react';
import '../../styles/shopify-app.css';

interface SEOData {
  score: number;
  pagesScanned: number;
  keywordsRanked: number;
  trend: 'up' | 'down' | 'stable';
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'active' | 'disabled' | 'setup';
  category: string;
}

const ShopifyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [seoData, setSeoData] = useState<SEOData>({
    score: 85,
    pagesScanned: 247,
    keywordsRanked: 156,
    trend: 'up'
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'seo-reports', label: 'My SEO Reports', icon: Search },
    { id: 'plugins', label: 'Plugins', icon: Plug },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const plugins: Plugin[] = [
    {
      id: 'seo-analyzer',
      name: 'SEO Analyzer',
      description: 'On-page audit, structured data detection, title/description length tool',
      icon: Search,
      status: 'active',
      category: 'SEO'
    },
    {
      id: 'internal-link',
      name: 'Internal Link Engine',
      description: 'Suggests links between products, blogs, collections',
      icon: Link2,
      status: 'active',
      category: 'SEO'
    },
    {
      id: 'rank-tracker',
      name: 'Rank Tracker',
      description: 'Keyword position graph, traffic forecast',
      icon: TrendingUp,
      status: 'active',
      category: 'Analytics'
    },
    {
      id: 'amazon-sync',
      name: 'Amazon Sync Panel',
      description: 'Displays linked ASINs and performance',
      icon: ShoppingBag,
      status: 'setup',
      category: 'Integration'
    },
    {
      id: 'site-speed',
      name: 'Site Speed Monitor',
      description: 'Real-time Core Web Vitals + GTMetrix style reporting',
      icon: Zap,
      status: 'disabled',
      category: 'Performance'
    }
  ];

  const recentActivity = [
    { action: 'SEO scan completed', page: 'Product: Blue Widgets', time: '2 mins ago', status: 'success' },
    { action: 'Internal link suggestion', page: 'Blog: SEO Tips', time: '15 mins ago', status: 'info' },
    { action: 'Keyword ranking update', page: '12 keywords improved', time: '1 hour ago', status: 'success' },
    { action: 'Amazon sync failed', page: 'Product: Red Gadgets', time: '2 hours ago', status: 'error' },
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSeoData(prev => ({
        ...prev,
        score: prev.score + (Math.random() - 0.5) * 2,
        pagesScanned: prev.pagesScanned + Math.floor(Math.random() * 3),
        keywordsRanked: prev.keywordsRanked + Math.floor(Math.random() * 2)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Panel */}
      <div className="bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome Back, MyStore!</h1>
            <p className="text-lime-100">Your store is performing well. Here's your SEO overview.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Store className="w-8 h-8" />
            <div className="text-right">
              <div className="text-sm opacity-90">Connected Store</div>
              <div className="font-semibold">mystore.myshopify.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="b3acon-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-lime-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">SEO Score</h3>
                <p className="text-sm text-gray-600">Overall performance</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-lime-600 counter-animate">{Math.round(seoData.score)}</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5 this week
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-lime-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${seoData.score}%` }}
            ></div>
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pages Scanned</h3>
                <p className="text-sm text-gray-600">SEO analyzed pages</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 counter-animate">{seoData.pagesScanned}</div>
              <div className="text-sm text-gray-600">+12 today</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Last scan: 2 minutes ago</div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Keywords Ranked</h3>
                <p className="text-sm text-gray-600">Tracking positions</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 counter-animate">{seoData.keywordsRanked}</div>
              <div className="text-sm text-green-600">+8 improved</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Next update in 4 hours</div>
        </div>
      </div>

      {/* Plugin Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="b3acon-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-gray-600" />
            Plugin Activity Log
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'success' ? 'bg-green-500' : 
                  item.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.action}</div>
                  <div className="text-xs text-gray-600">{item.page}</div>
                </div>
                <div className="text-xs text-gray-500">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
              Current Plan
            </h3>
            <button className="btn-primary text-sm px-4 py-2 h-auto">
              Upgrade
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Growth Tier</span>
              <span className="font-semibold text-gray-900">$29/month</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pages analyzed</span>
                <span className="text-gray-900">247 / 500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-lime-500 h-2 rounded-full" style={{ width: '49.4%' }}></div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Next billing: December 15, 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlugins = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Plugin Management</h2>
        <button className="btn-primary">
          <Plug className="w-4 h-4" />
          Browse More Plugins
        </button>
      </div>

      <div className="grid gap-6">
        {plugins.map((plugin) => (
          <div key={plugin.id} className="plugin-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <plugin.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{plugin.name}</h3>
                    <span className={`plugin-status ${plugin.status}`}>
                      {plugin.status === 'active' && <CheckCircle className="w-3 h-3" />}
                      {plugin.status === 'setup' && <AlertCircle className="w-3 h-3" />}
                      {plugin.status === 'disabled' && <Clock className="w-3 h-3" />}
                      {plugin.status.charAt(0).toUpperCase() + plugin.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{plugin.description}</p>
                  <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">
                    {plugin.category}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    plugin.status === 'active' 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'btn-primary'
                  }`}
                >
                  {plugin.status === 'active' ? 'Open' : plugin.status === 'setup' ? 'Setup' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'plugins':
        return renderPlugins();
      case 'seo-reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">SEO Reports</h2>
            <div className="b3acon-card">
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">SEO Reports Coming Soon</h3>
                <p className="text-gray-600">Detailed SEO analysis and reporting features are in development.</p>
              </div>
            </div>
          </div>
        );
      case 'subscriptions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
            <div className="b3acon-card">
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription Settings</h3>
                <p className="text-gray-600">Manage your billing and subscription preferences.</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="b3acon-card">
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">App Settings</h3>
                <p className="text-gray-600">Configure your B3ACON app preferences and integrations.</p>
              </div>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="b3acon-app min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className={`nav-sidebar ${sidebarCollapsed ? 'collapsed' : ''} fixed lg:relative z-40`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-gray-900" />
              </div>
              {!sidebarCollapsed && <span className="text-xl font-bold">B3ACON</span>}
            </div>
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden text-white"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">mystore.myshopify.com</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900">
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default ShopifyDashboard;