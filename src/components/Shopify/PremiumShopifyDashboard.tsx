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
  ChevronRight,
  Filter,
  Calendar,
  Download,
  Sparkles,
  Menu,
  X,
  Home,
  Globe,
  Package,
  CreditCard,
  HelpCircle,
  MessageCircle,
  Lock,
  MousePointer,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopifyAuthProvider, useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import FeatureGate from '../FeatureGate';
import { hasAccess } from '../../utils/subscriptionUtils';
import { useMobileNavigation } from '../../hooks/useMobileNavigation';
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

const DashboardContent = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('7d');
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<string[]>(['seo-tools', 'analytics']);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, subscription, logout } = useShopifyAuth();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, isMobile } = useMobileNavigation();

  // Mock data for dashboard
  const trafficSourcesData = [
    { name: 'Organic Search', value: 45, fill: '#10b981' },
    { name: 'Direct', value: 25, fill: '#3b82f6' },
    { name: 'Social Media', value: 15, fill: '#8b5cf6' },
    { name: 'Email', value: 10, fill: '#f59e0b' },
    { name: 'Paid Ads', value: 5, fill: '#ef4444' }
  ];

  const recentActivities = [
    {
      icon: TrendingUp,
      action: 'SEO optimization completed',
      target: 'Product: Wireless Headphones Pro',
      time: '2 minutes ago',
      type: 'success'
    },
    {
      icon: Target,
      action: 'Keyword rank improved',
      target: '"bluetooth headphones" → Position #3',
      time: '15 minutes ago',
      type: 'success'
    },
    {
      icon: BarChart3,
      action: 'Analytics report generated',
      target: 'Monthly Performance Report',
      time: '1 hour ago',
      type: 'info'
    },
    {
      icon: Mail,
      action: 'Email campaign launched',
      target: 'Holiday Sale Announcement',
      time: '2 hours ago',
      type: 'info'
    }
  ];

  const topProducts = [
    {
      name: 'Wireless Bluetooth Headphones',
      revenue: '$12,847',
      growth: '+23%',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'Smart Fitness Watch',
      revenue: '$8,293',
      growth: '+18%',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'USB-C Charging Cable',
      revenue: '$4,156',
      growth: '+12%',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center'
    }
  ];

  // Navigation menu items with subscription requirements as specified in SYSTEM_SPECS.md
  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/shopify/dashboard',
      requiredPlan: 'trial'
    },
    { 
      id: 'seo-tools', 
      label: 'SEO Tools', 
      icon: Search, 
      href: '/shopify/seo',
      requiredPlan: 'starter',
      children: [
        { id: 'website-analysis', label: 'Website Analysis', route: '/shopify/seo/website-analysis' },
        { id: 'keyword-research', label: 'Keyword Research', route: '/shopify/seo/keyword-research' },
        { id: 'competitor-analysis', label: 'Competitor Analysis', route: '/shopify/seo/competitor-analysis' },
        { id: 'rank-tracking', label: 'Rank Tracking', route: '/shopify/seo/rank-tracking' },
        { id: 'backlinks', label: 'Backlinks Monitor', route: '/shopify/seo/backlinks' },
        { id: 'technical-audit', label: 'Technical Audit', route: '/shopify/seo/technical-audit' },
        { id: 'content-optimizer', label: 'Content Optimizer', route: '/shopify/seo/content-optimizer' }
      ]
    },
    { 
      id: 'popup-builder', 
      label: 'Popup Builder', 
      icon: MousePointer, 
      href: '/shopify/popups',
      requiredPlan: 'trial'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      href: '/shopify/analytics',
      requiredPlan: 'pro',
      children: [
        { id: 'traffic', label: 'Traffic Analytics', route: '/shopify/analytics/traffic' },
        { id: 'conversions', label: 'Conversion Tracking', route: '/shopify/analytics/conversions' },
        { id: 'revenue', label: 'Revenue Reports', route: '/shopify/analytics/revenue' },
        { id: 'customers', label: 'Customer Insights', route: '/shopify/analytics/customers' },
        { id: 'products', label: 'Product Performance', route: '/shopify/analytics/products' }
      ]
    },
    { 
      id: 'automation', 
      label: 'Automation', 
      icon: Zap, 
      href: '/shopify/automation',
      requiredPlan: 'pro',
      children: [
        { id: 'email-campaigns', label: 'Email Campaigns', route: '/shopify/automation/email-campaigns' },
        { id: 'abandoned-cart', label: 'Abandoned Cart', route: '/shopify/automation/abandoned-cart' },
        { id: 'inventory-alerts', label: 'Inventory Alerts', route: '/shopify/automation/inventory-alerts' },
        { id: 'price-rules', label: 'Price Rules', route: '/shopify/automation/price-rules' }
      ]
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      href: '/shopify/settings',
      requiredPlan: 'trial'
    }
  ];

  // Navigation component as specified in SYSTEM_SPECS.md
  const Navigation = () => {
    const { user, subscription } = useShopifyAuth();
    const location = useLocation();
    
    const isFeatureAccessible = (requiredPlan: string) => {
      return hasAccess(subscription?.plan || 'trial', requiredPlan);
    };

    const openUpgradeModal = (requiredPlan: string) => {
      // Track upgrade prompt interaction
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'upgrade_prompt_shown', {
          current_plan: subscription?.plan,
          required_plan: requiredPlan,
          feature: 'navigation'
        });
      }
      
      // Navigate to plans page with upgrade parameter
      navigate(`/shopify/plans?upgrade=${requiredPlan}`);
    };
    
    return (
      <nav className="premium-navigation space-y-2">
        {navigationItems.map((item) => {
          const accessible = isFeatureAccessible(item.requiredPlan);
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href);
          
          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => {
                  if (accessible) {
                    navigate(item.href);
                    closeMobileMenu();
                  } else {
                    openUpgradeModal(item.requiredPlan);
                  }
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-left group touch-target
                  ${isActive && accessible
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : accessible
                    ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    : 'text-gray-400 hover:bg-gray-50 cursor-not-allowed'
                  }
                `}
                aria-label={`Navigate to ${item.label}`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive && accessible ? 'text-white' : accessible ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                
                {!accessible && (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
                
                {item.children && accessible && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {/* Upgrade prompt tooltip for locked features */}
              {!accessible && (
                <div className="absolute left-full ml-2 top-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                    Requires {item.requiredPlan} plan
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  };

  // Navigation helper functions
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = (route: string, itemId?: string) => {
    if (route) {
      navigate(route);
    }
    if (itemId) {
      setActiveModule(itemId);
    }
    closeMobileMenu();
  };

  // Function to render different content based on current route
  const renderContent = () => {
    const path = location.pathname;
    
    // SEO Tools Content
    if (path.includes('/seo/website-analysis')) {
      return renderSEOWebsiteAnalysis();
    } else if (path.includes('/seo/keyword-research')) {
      return renderSEOKeywordResearch();
    } else if (path.includes('/seo/competitor-analysis')) {
      return renderSEOCompetitorAnalysis();
    } else if (path.includes('/seo/rank-tracking')) {
      return renderSEORankTracking();
    } else if (path.includes('/seo/backlinks')) {
      return renderSEOBacklinks();
    } else if (path.includes('/seo/technical-audit')) {
      return renderSEOTechnicalAudit();
    } else if (path.includes('/seo/content-optimizer')) {
      return renderSEOContentOptimizer();
    }
    
    // Analytics Content
    else if (path.includes('/analytics/traffic')) {
      return renderAnalyticsTraffic();
    } else if (path.includes('/analytics/conversions')) {
      return renderAnalyticsConversions();
    } else if (path.includes('/analytics/revenue')) {
      return renderAnalyticsRevenue();
    } else if (path.includes('/analytics/customers')) {
      return renderAnalyticsCustomers();
    } else if (path.includes('/analytics/products')) {
      return renderAnalyticsProducts();
    }
    
    // Default Dashboard Content
    else {
      return renderDashboardContent();
    }
  };

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-primary">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="mobile-nav-toggle lg:hidden fixed top-4 left-4 z-50 touch-target"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay active lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        sidebar fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 shadow-lg
        transition-transform duration-300 ease-in-out
        w-64 lg:w-64
        ${isMobileMenuOpen ? 'open translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl">B3ACON</h1>
              <p className="text-gray-500 text-sm">Shopify Dashboard</p>
            </div>
          </div>

          {/* Store Status */}
          <div className="mb-6 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-700 text-sm font-medium">techstore.myshopify.com</span>
            </div>
          </div>

          {/* Functional Navigation with Feature Gating */}
          <div className="flex-1 overflow-y-auto">
            <Navigation />
          </div>

          {/* User Profile */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.shopUrl?.split('.')[0] || 'Store Owner'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {subscription?.plan === 'trial' ? 'Trial User' : 'Subscriber'}
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to sign out?')) {
                    logout();
                  }
                }}
                className="w-full btn-premium btn-ghost btn-small text-red-600 hover:bg-red-50"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="desktop-header bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Welcome back, <span className="text-gradient-primary">{user?.shopUrl?.split('.')[0] || 'Store Owner'}! 👋</span>
                </h1>
                <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  subscription?.plan === 'trial' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : subscription?.plan === 'enterprise'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {subscription?.plan} Plan
                  {subscription?.plan === 'trial' && subscription?.trialEndsAt && (
                    <span className="ml-1">
                      • {Math.ceil((subscription.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-lg">
                {user?.shopUrl} is performing 23% better than last month
              </p>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
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

        {/* Time Frame Selector */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            {['24h', '7d', '30d', '90d'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setActiveTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTimeframe === timeframe
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/60 text-gray-600 hover:bg-white/80'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? [...Array(4)].map((_, i) => <SkeletonMetric key={i} />)
            : metrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} index={index} />
              ))
          }
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                <p className="text-gray-600">Interactive chart would be rendered here</p>
                <p className="text-sm text-gray-500">Using Recharts or Chart.js</p>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Traffic Sources</h3>
              <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                View Details
              </button>
            </div>
            
            <div className="space-y-4">
              {trafficSourcesData.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: source.fill }}
                    ></div>
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

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                Recent Activity
              </h3>
              <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'success' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-blue-100 text-blue-600'
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

          {/* Top Products */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <ShoppingBag className="w-5 h-5 text-purple-500 mr-2" />
                Top Products
              </h3>
              <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-bold text-gray-900">{product.revenue}</span>
                      <span className="text-emerald-600 text-sm font-semibold">{product.growth}</span>
                    </div>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

// Content render functions for different sections
const renderDashboardContent = () => (
  <>
    {/* Welcome Section */}
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-gradient-primary">Sarah! 👋</span>
          </h1>
          <p className="text-gray-600 text-lg">Your store is performing 23% better than last month</p>
        </div>
        
        <div className="hidden md:flex items-center space-x-3">
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

    {/* Time Frame Selector */}
    <div className="mb-8">
      <div className="flex items-center space-x-2">
        {['24h', '7d', '30d', '90d'].map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setActiveTimeframe(timeframe)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTimeframe === timeframe
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>
    </div>

    {/* Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {isLoading
        ? [...Array(4)].map((_, i) => <SkeletonMetric key={i} />)
        : metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} index={index} />
          ))
      }
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Revenue Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-600">Interactive chart would be rendered here</p>
            <p className="text-sm text-gray-500">Using Recharts or Chart.js</p>
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Traffic Sources</h3>
          <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
            View Details
          </button>
        </div>
        
        <div className="space-y-4">
          {trafficSourcesData.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: source.fill }}
                ></div>
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

    {/* Bottom Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
            Recent Activity
          </h3>
          <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                activity.type === 'success' 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-blue-100 text-blue-600'
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

      {/* Top Products */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="w-5 h-5 text-purple-500 mr-2" />
            Top Products
          </h3>
          <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-bold text-gray-900">{product.revenue}</span>
                  <span className="text-emerald-600 text-sm font-semibold">{product.growth}</span>
                </div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

// SEO Tools Content Renderers
const renderSEOWebsiteAnalysis = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Website SEO Analysis</h1>
      <p className="text-gray-600">Comprehensive analysis of your store's SEO performance and optimization opportunities.</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">SEO Score</h3>
          <Target className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="text-3xl font-bold text-emerald-600 mb-2">94/100</div>
        <p className="text-sm text-gray-600">Excellent optimization</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pages Analyzed</h3>
          <BarChart3 className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
        <p className="text-sm text-gray-600">Total pages scanned</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Issues Found</h3>
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>
        <div className="text-3xl font-bold text-orange-600 mb-2">23</div>
        <p className="text-sm text-gray-600">Optimization opportunities</p>
      </div>
    </div>
    
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Analysis Results</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Meta titles optimized</span>
          </div>
          <span className="text-emerald-600 font-semibold">✓ Completed</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Image alt texts missing</span>
          </div>
          <button className="text-blue-600 font-semibold hover:text-blue-700">Fix Now</button>
        </div>
      </div>
    </div>
  </div>
);

const renderSEOKeywordResearch = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Keyword Research</h1>
      <p className="text-gray-600">Discover high-performing keywords for your products and content strategy.</p>
    </div>
    
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Enter seed keyword or product name..."
          className="input-premium flex-1"
        />
        <button className="btn-premium btn-primary">
          <Search className="w-4 h-4 mr-2" />
          Research
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">2,847</div>
          <div className="text-sm text-gray-600">Keywords Found</div>
        </div>
        <div className="text-center p-4 bg-emerald-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">156</div>
          <div className="text-sm text-gray-600">High Opportunity</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">12.4K</div>
          <div className="text-sm text-gray-600">Avg. Search Volume</div>
        </div>
      </div>
    </div>
    
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Top Keyword Opportunities</h3>
      <div className="overflow-x-auto">
        <table className="table-premium w-full">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Search Volume</th>
              <th>Difficulty</th>
              <th>Opportunity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">bluetooth headphones wireless</td>
              <td>18,500</td>
              <td><span className="status-indicator status-warning">Medium</span></td>
              <td><span className="status-indicator status-success">High</span></td>
              <td><button className="btn-premium btn-ghost btn-small">Optimize</button></td>
            </tr>
            <tr>
              <td className="font-medium">noise cancelling earbuds</td>
              <td>12,400</td>
              <td><span className="status-indicator status-success">Low</span></td>
              <td><span className="status-indicator status-success">High</span></td>
              <td><button className="btn-premium btn-ghost btn-small">Optimize</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Main component with auth provider wrapper
const PremiumShopifyDashboard = () => {
  return (
    <ShopifyAuthProvider>
      <DashboardContent />
    </ShopifyAuthProvider>
  );
};

export default PremiumShopifyDashboard;