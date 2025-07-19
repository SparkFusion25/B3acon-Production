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
  Menu,
  X,
  Lock,
  Crown
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

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

const PremiumShopifyDashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('7d');
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('growth');
  const [shopUrl, setShopUrl] = useState<string>('demo-store.myshopify.com');
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Check for proper Shopify authentication and plan
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');
    const plan = urlParams.get('plan');
    
    // In real implementation, verify this is coming from Shopify admin
    if (!shop) {
      // Redirect to installation if no shop parameter
      window.location.href = '/shopify/install';
      return;
    }
    
    if (!plan) {
      // Redirect to plan selection if no plan
      window.location.href = `/shopify/plans?shop=${shop}`;
      return;
    }
    
    setShopUrl(shop);
    setUserPlan(plan);
    setIsAuthorized(true);
    
    // Simulate loading and data fetching
    setTimeout(() => {
      setMetrics([
        {
          value: '$47,293',
          change: '+12.5%',
          trend: 'up',
          icon: TrendingUp,
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
      setIsLoading(false);
    }, 1000);
  }, []);

  const revenueData: ChartData[] = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 4500 },
    { name: 'Fri', value: 6000 },
    { name: 'Sat', value: 5500 },
    { name: 'Sun', value: 7000 }
  ];

  const trafficSourcesData: ChartData[] = [
    { name: 'Organic Search', value: 45, fill: '#6366F1' },
    { name: 'Social Media', value: 25, fill: '#EC4899' },
    { name: 'Direct', value: 20, fill: '#10B981' },
    { name: 'Email', value: 10, fill: '#F59E0B' }
  ];

  const recentActivities = [
    {
      action: 'SEO optimization completed',
      target: 'Product: Wireless Headphones',
      time: '2 minutes ago',
      type: 'success',
      icon: Search
    },
    {
      action: 'New high-value keyword ranked',
      target: 'Keyword: "premium bluetooth headphones"',
      time: '15 minutes ago',
      type: 'success',
      icon: TrendingUp
    },
    {
      action: 'Conversion rate improved',
      target: 'Product page optimization',
      time: '1 hour ago',
      type: 'info',
      icon: Target
    },
    {
      action: 'Email campaign launched',
      target: 'Black Friday preview',
      time: '3 hours ago',
      type: 'info',
      icon: Mail
    }
  ];

  const topProducts = [
    {
      name: 'Wireless Bluetooth Headphones',
      revenue: '$12,450',
      growth: '+23%',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop'
    },
    {
      name: 'Smart Fitness Watch',
      revenue: '$8,930',
      growth: '+18%',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'
    },
    {
      name: 'Portable Phone Charger',
      revenue: '$6,720',
      growth: '+15%',
      image: 'https://images.unsplash.com/photo-1609592308919-55c0ac344eaa?w=80&h=80&fit=crop'
    }
  ];

  const MetricCard = ({ metric, index }: { metric: MetricData; index: number }) => {
    const colorClasses = {
      emerald: 'from-emerald-400 to-emerald-600',
      blue: 'from-blue-400 to-blue-600',
      purple: 'from-purple-400 to-purple-600',
      pink: 'from-pink-400 to-pink-600'
    };

    return (
      <div 
        className={`glass-card metric-card metric-card-${metric.color} p-6 transition-all duration-500 hover:scale-105`}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[metric.color as keyof typeof colorClasses]} flex items-center justify-center`}>
            <metric.icon className="w-6 h-6 text-white" />
          </div>
          
          <div className={`flex items-center space-x-1 text-sm font-semibold ${
            metric.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
          }`}>
            {metric.trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{metric.change}</span>
          </div>
        </div>
        
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{metric.description}</p>
          <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
        </div>
      </div>
    );
  };

  const SkeletonMetric = () => (
    <div className="glass-card p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
        <div className="w-24 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Feature access control based on plan
  const hasFeatureAccess = (feature: string) => {
    const planFeatures = {
      starter: ['basic-analytics', 'email-support', 'seo-basic'],
      growth: ['basic-analytics', 'advanced-analytics', 'email-support', 'priority-support', 'seo-basic', 'seo-advanced', 'ab-testing'],
      pro: ['basic-analytics', 'advanced-analytics', 'email-support', 'priority-support', 'dedicated-support', 'seo-basic', 'seo-advanced', 'ab-testing', 'api-access', 'white-label']
    };
    
    return planFeatures[userPlan as keyof typeof planFeatures]?.includes(feature) || false;
  };

  const LockedFeature = ({ title, description, requiredPlan }: { title: string; description: string; requiredPlan: string }) => (
    <div className="glass-card p-6 relative">
      <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-600 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          <button 
            onClick={() => window.location.href = `/shopify/plans?shop=${shopUrl}&upgrade=${requiredPlan}`}
            className="btn-premium btn-primary btn-small"
          >
            <Crown className="w-4 h-4" />
            Upgrade to {requiredPlan}
          </button>
        </div>
      </div>
    </div>
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-primary">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-8xl">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">B3ACON</span>
              </div>
              
              <div className="hidden sm:flex items-center space-x-2 bg-emerald-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-700 text-sm font-medium hidden md:inline">{shopUrl}</span>
                <span className="text-emerald-700 text-sm font-medium md:hidden">Connected</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-indigo-100 px-3 py-1 rounded-full">
                <Crown className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-700 text-sm font-medium capitalize">{userPlan} Plan</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              {/* Navigation Menu */}
              <div className="hidden lg:flex items-center space-x-6">
                <button 
                  onClick={() => setActiveSection('overview')}
                  className={`font-medium transition-colors ${activeSection === 'overview' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveSection('analytics')}
                  className={`font-medium transition-colors ${activeSection === 'analytics' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Analytics
                </button>
                <button 
                  onClick={() => setActiveSection('products')}
                  className={`font-medium transition-colors ${activeSection === 'products' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Products
                </button>
                <button 
                  onClick={() => setActiveSection('seo')}
                  className={`font-medium transition-colors ${activeSection === 'seo' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  SEO Tools
                </button>
                <button 
                  onClick={() => setActiveSection('settings')}
                  className={`font-medium transition-colors ${activeSection === 'settings' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Settings
                </button>
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Sarah Chen</div>
                  <div className="text-xs text-gray-500">Store Owner</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="space-y-4">
                <button 
                  onClick={() => {setActiveSection('overview'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'overview' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-gray-900">Overview</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('analytics'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'analytics' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-gray-900">Analytics</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('products'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'products' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Products</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('seo'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'seo' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <Search className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-gray-900">SEO Tools</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('settings'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'settings' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Settings</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-8xl py-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {activeSection === 'overview' && <>Welcome back, <span className="text-gradient-primary">Sarah! 👋</span></>}
                {activeSection === 'analytics' && <>Analytics <span className="text-gradient-primary">Dashboard</span></>}
                {activeSection === 'products' && <>Product <span className="text-gradient-primary">Management</span></>}
                {activeSection === 'seo' && <>SEO <span className="text-gradient-primary">Tools</span></>}
                {activeSection === 'settings' && <>Account <span className="text-gradient-primary">Settings</span></>}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                {activeSection === 'overview' && 'Your store is performing 23% better than last month'}
                {activeSection === 'analytics' && 'Monitor your store performance and track key metrics'}
                {activeSection === 'products' && 'Manage your product catalog and SEO optimization'}
                {activeSection === 'seo' && 'Optimize your store for search engines and boost rankings'}
                {activeSection === 'settings' && 'Configure your account preferences and app settings'}
              </p>
            </div>
            
            <div className="flex sm:hidden md:flex items-center space-x-3">
              <button className="btn-premium btn-outline">
                <Calendar className="w-4 h-4" />
                Last 7 days
              </button>
              <button className="btn-premium btn-outline">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Section Content */}
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default PremiumShopifyDashboard;