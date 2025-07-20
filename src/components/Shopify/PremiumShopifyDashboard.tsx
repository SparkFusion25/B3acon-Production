import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  Settings, 
  Bell,
  User,
  Store,
  TrendingUp,
  Target,
  Mail,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShoppingBag,
  Eye,
  ChevronDown,
  Filter,
  Calendar,
  Download,
  Sparkles,
  Bot,
  MessageSquare,
  Star,
  PenTool,
  Palette,
  PlugZap,
  CreditCard,
  RefreshCw,
  Activity,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Globe,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Menu,
  X
} from 'lucide-react';
import '../../styles/premium-design-system.css';

interface MetricData {
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface RealtimeMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

interface ActiveCampaign {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'draft';
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  startDate: string;
}

interface RecentActivity {
  id: string;
  action: string;
  target: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
  icon: React.ComponentType<any>;
}

const PremiumShopifyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  
  // Real-time dashboard state
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetric[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<ActiveCampaign[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // Comprehensive Navigation Structure
  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'blue' },
    { id: 'ai-tools', label: 'AI Tools', icon: Bot, color: 'purple' },
    { id: 'seo-tools', label: 'SEO Tools', icon: Search, color: 'green' },
    { id: 'social-media', label: 'Social Media', icon: MessageSquare, color: 'pink' },
    { id: 'review-management', label: 'Review Management', icon: Star, color: 'yellow' },
    { id: 'email-marketing', label: 'Email Marketing', icon: Mail, color: 'blue' },
    { id: 'content-creation', label: 'Content Creation', icon: PenTool, color: 'indigo' },
    { id: 'product-research', label: 'Product Research', icon: ShoppingBag, color: 'orange' },
    { id: 'analytics-reports', label: 'Analytics & Reports', icon: TrendingUp, color: 'emerald' },
    { id: 'creative-studio', label: 'Creative Studio', icon: Palette, color: 'rose' },
    { id: 'integrations', label: 'Integrations', icon: PlugZap, color: 'cyan' },
    { id: 'team-management', label: 'Team Management', icon: Users, color: 'violet' },
    { id: 'billing-plans', label: 'Billing & Plans', icon: CreditCard, color: 'amber' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ];

  // Initialize dashboard data
  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      updateRealtimeMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Simulate loading real data
    setTimeout(() => {
      setMetrics([
        {
          value: '$47,293',
          change: '+12.5%',
          trend: 'up',
          icon: DollarSign,
          color: 'emerald',
          description: 'Total Revenue'
        },
        {
          value: '94/100',
          change: '+8 points',
          trend: 'up',
          icon: Target,
          color: 'blue',
          description: 'SEO Score'
        },
        {
          value: '4.2%',
          change: '+0.8%',
          trend: 'up',
          icon: Eye,
          color: 'purple',
          description: 'Conversion Rate'
        },
        {
          value: '12,847',
          change: '+1,203',
          trend: 'up',
          icon: Users,
          color: 'pink',
          description: 'Total Visitors'
        }
      ]);

      setRealtimeMetrics([
        { id: '1', name: 'Active Campaigns', value: 8, target: 10, status: 'good', lastUpdated: '2 mins ago' },
        { id: '2', name: 'SEO Tasks', value: 12, target: 15, status: 'warning', lastUpdated: '5 mins ago' },
        { id: '3', name: 'Social Posts', value: 25, target: 30, status: 'good', lastUpdated: '1 min ago' },
        { id: '4', name: 'Reviews Managed', value: 43, target: 50, status: 'good', lastUpdated: '3 mins ago' }
      ]);

      setActiveCampaigns([
        {
          id: '1',
          name: 'Holiday Sale AI Popup',
          type: 'AI Popup',
          status: 'active',
          performance: { impressions: 12847, clicks: 1234, conversions: 156, revenue: 8947 },
          startDate: '2024-01-15'
        },
        {
          id: '2',
          name: 'SEO Content Optimization',
          type: 'SEO Campaign',
          status: 'active',
          performance: { impressions: 25430, clicks: 2341, conversions: 234, revenue: 12456 },
          startDate: '2024-01-10'
        },
        {
          id: '3',
          name: 'Social Media Boost',
          type: 'Social Campaign',
          status: 'active',
          performance: { impressions: 18923, clicks: 1876, conversions: 187, revenue: 5634 },
          startDate: '2024-01-12'
        }
      ]);

      setRecentActivities([
        {
          id: '1',
          action: 'AI Popup Campaign launched',
          target: 'Holiday Sale Collection',
          time: '2 minutes ago',
          type: 'success',
          icon: Bot
        },
        {
          id: '2',
          action: 'SEO optimization completed',
          target: '12 product pages',
          time: '15 minutes ago',
          type: 'success',
          icon: Search
        },
        {
          id: '3',
          action: 'Social media posts scheduled',
          target: 'Instagram & Facebook',
          time: '30 minutes ago',
          type: 'info',
          icon: MessageSquare
        },
        {
          id: '4',
          action: 'Review response generated',
          target: 'Google My Business',
          time: '1 hour ago',
          type: 'success',
          icon: Star
        },
        {
          id: '5',
          action: 'Email campaign sent',
          target: '2,847 subscribers',
          time: '2 hours ago',
          type: 'success',
          icon: Mail
        }
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const updateRealtimeMetrics = () => {
    setRealtimeMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, metric.value + Math.floor(Math.random() * 3 - 1)),
      lastUpdated: 'Just now'
    })));
  };

  // Dashboard Overview Section - Fully Functional
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah! 👋</h1>
            <p className="text-indigo-100 text-lg">Your store is performing 23% better than last month</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">All systems operational</span>
              </div>
              <div className="text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Store className="w-6 h-6" />
              <span className="font-semibold">techstore.myshopify.com</span>
            </div>
            <button 
              onClick={() => window.open('https://techstore.myshopify.com', '_blank')}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { action: 'Create AI Popup', icon: Bot, color: 'purple', onClick: () => setActiveTab('ai-tools') },
          { action: 'Run SEO Scan', icon: Search, color: 'green', onClick: () => setActiveTab('seo-tools') },
          { action: 'Schedule Posts', icon: MessageSquare, color: 'pink', onClick: () => setActiveTab('social-media') },
          { action: 'Manage Reviews', icon: Star, color: 'yellow', onClick: () => setActiveTab('review-management') }
        ].map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="glass-card p-6 text-center hover:shadow-lg transition-all group"
          >
            <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-6 h-6 text-${item.color}-600`} />
            </div>
            <p className="font-medium text-gray-900">{item.action}</p>
          </button>
        ))}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{metric.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Metrics */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 text-blue-500 mr-2" />
            Real-time Metrics
          </h3>
          <button 
            onClick={updateRealtimeMetrics}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {realtimeMetrics.map((metric) => (
            <div key={metric.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{metric.name}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  metric.status === 'good' ? 'bg-green-500' :
                  metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500">/ {metric.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(metric.value / metric.target) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{metric.lastUpdated}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Campaigns & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Campaigns */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Active Campaigns</h3>
            <button 
              onClick={() => setActiveTab('ai-tools')}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-600">{campaign.type} • Started {campaign.startDate}</p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Impressions</p>
                    <p className="font-medium">{campaign.performance.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Clicks</p>
                    <p className="font-medium">{campaign.performance.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Conversions</p>
                    <p className="font-medium">{campaign.performance.conversions}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-medium text-green-600">${campaign.performance.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'info' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.target}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Analytics</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
              <p className="text-gray-600">Interactive revenue chart</p>
              <p className="text-sm text-gray-500">Real-time data visualization</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {[
              { name: 'Organic Search', value: 45, color: '#6366F1' },
              { name: 'Social Media', value: 25, color: '#EC4899' },
              { name: 'Direct Traffic', value: 20, color: '#10B981' },
              { name: 'Email Marketing', value: 10, color: '#F59E0B' }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="font-medium text-gray-700">{source.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{source.value}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Placeholder sections for other tabs (will be implemented in subsequent steps)
  const renderPlaceholderSection = (title: string, icon: React.ComponentType<any>, description: string) => (
    <div className="space-y-6">
      <div className="text-center py-12">
        {React.createElement(icon, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" })}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <p className="text-sm text-blue-600">Coming in next implementation phase...</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'ai-tools':
        return renderPlaceholderSection('AI Tools', Bot, 'AI-powered automation and content generation tools');
      case 'seo-tools':
        return renderPlaceholderSection('SEO Tools', Search, 'Complete SEO optimization and analysis suite');
      case 'social-media':
        return renderPlaceholderSection('Social Media', MessageSquare, 'Social media management and scheduling platform');
      case 'review-management':
        return renderPlaceholderSection('Review Management', Star, 'Multi-platform review management system');
      case 'email-marketing':
        return renderPlaceholderSection('Email Marketing', Mail, 'Advanced email campaigns and automation');
      case 'content-creation':
        return renderPlaceholderSection('Content Creation', PenTool, 'Content creation tools and typewriter plugins');
      case 'product-research':
        return renderPlaceholderSection('Product Research', ShoppingBag, 'Market analysis and competitor research');
      case 'analytics-reports':
        return renderPlaceholderSection('Analytics & Reports', TrendingUp, 'Comprehensive analytics and reporting');
      case 'creative-studio':
        return renderPlaceholderSection('Creative Studio', Palette, 'Asset management and design tools');
      case 'integrations':
        return renderPlaceholderSection('Integrations', PlugZap, 'Third-party integrations and APIs');
      case 'team-management':
        return renderPlaceholderSection('Team Management', Users, 'Team collaboration and user management');
      case 'billing-plans':
        return renderPlaceholderSection('Billing & Plans', CreditCard, 'Subscription and payment management');
      case 'settings':
        return renderPlaceholderSection('Settings', Settings, 'App configuration and preferences');
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">B3ACON</h1>
                  <p className="text-sm text-gray-500">Shopify Dashboard</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{tab.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {navigationTabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-600">
                  {activeTab === 'dashboard' ? 'Store performance overview and metrics' : 
                   `Manage your ${navigationTabs.find(tab => tab.id === activeTab)?.label.toLowerCase()}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">techstore.myshopify.com</span>
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>
              
              <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900">
                <User className="w-5 h-5" />
                <span className="hidden sm:block text-sm">Sarah Chen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumShopifyDashboard;