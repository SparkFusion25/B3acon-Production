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
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  Type,
  Star,
  Brain,
  DollarSign
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopifyAuthProvider, useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import FeatureGate from '../Common/FeatureGate';
import { hasAccess } from '../../utils/subscriptionUtils';
import { useMobileNavigation } from '../../hooks/useMobileNavigation';
import AIBuyNow from './components/AIBuyNow';
import TypewriterEffect from './components/TypewriterEffect';
import ReviewManager from './components/ReviewManager';
import AffiliateMarketing from '../Agency/AgencyModules/AffiliateMarketing';
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

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/shopify/login');
      return;
    }
  }, [user, navigate]);

  // Show loading or login redirect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
      icon: ShoppingBag,
      title: 'New Order #12345',
      description: 'Premium wireless headphones - $299.99',
      time: '2 minutes ago',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: User,
      title: 'New Customer Signup',
      description: 'sarah.johnson@email.com joined',
      time: '15 minutes ago',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Milestone',
      description: 'Monthly target achieved 🎉',
      time: '1 hour ago',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const topProducts = [
    { name: 'Premium Wireless Headphones', sales: 234, revenue: '$23,400', growth: '+12%' },
    { name: 'Smart Fitness Watch', sales: 189, revenue: '$18,900', growth: '+8%' },
    { name: 'Organic Coffee Beans', sales: 156, revenue: '$3,120', growth: '+15%' }
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
      id: 'ai-buy-now', 
      label: 'AI BUY NOW', 
      icon: Brain, 
      href: '/shopify/ai-buy-now',
      requiredPlan: 'pro'
    },
    { 
      id: 'typewriter', 
      label: 'TYPEWRITER', 
      icon: Type, 
      href: '/shopify/typewriter',
      requiredPlan: 'starter'
    },
    { 
      id: 'review-manager', 
      label: 'REVIEW', 
      icon: Star, 
      href: '/shopify/reviews',
      requiredPlan: 'trial'
    },
    { 
      id: 'affiliate', 
      label: 'Affiliate', 
      icon: Users, 
      href: '/shopify/affiliate',
      requiredPlan: 'pro'
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
              {/* Main Navigation Item */}
              <div
                className={`group flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : accessible
                    ? 'hover:bg-white/60 text-gray-700'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (!accessible) {
                    openUpgradeModal(item.requiredPlan);
                    return;
                  }
                  
                  if (item.children) {
                    toggleExpanded(item.id);
                  } else {
                    handleNavigation(item.href);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${
                    !accessible ? 'opacity-50' : ''
                  }`} />
                  <span className={`font-medium ${
                    !accessible ? 'opacity-50' : ''
                  }`}>
                    {item.label}
                  </span>
                  {!accessible && (
                    <Lock className="w-4 h-4 opacity-50" />
                  )}
                </div>
                
                {item.children && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    expandedItems.includes(item.id) ? 'rotate-180' : ''
                  } ${!accessible ? 'opacity-50' : ''}`} />
                )}
              </div>

              {/* Sub-navigation for items with children */}
              {item.children && expandedItems.includes(item.id) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map((child) => {
                    const childAccessible = isFeatureAccessible(item.requiredPlan);
                    const childActive = location.pathname === child.route;
                    
                    return (
                      <div
                        key={child.id}
                        className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
                          childActive
                            ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500'
                            : childAccessible
                            ? 'text-gray-600 hover:bg-white/40'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (!childAccessible) {
                            openUpgradeModal(item.requiredPlan);
                            return;
                          }
                          handleNavigation(child.route);
                        }}
                      >
                        <span className={`text-sm ${
                          !childAccessible ? 'opacity-50' : ''
                        }`}>
                          {child.label}
                        </span>
                        {!childAccessible && (
                          <Lock className="w-3 h-3 ml-auto opacity-50" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = (href: string) => {
    navigate(href);
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
    
    // New Component Content
    else if (path.includes('/ai-buy-now')) {
      return <AIBuyNow />;
    } else if (path.includes('/typewriter')) {
      return <TypewriterEffect />;
    } else if (path.includes('/reviews')) {
      return <ReviewManager />;
    } else if (path.includes('/affiliate')) {
      return <AffiliateMarketing />;
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
          value: '$12,345',
          change: '+23%',
          trend: 'up',
          icon: DollarSign,
          color: 'from-green-400 to-emerald-500',
          description: 'Monthly Revenue'
        },
        {
          value: '2,459',
          change: '+18%',
          trend: 'up',
          icon: Users,
          color: 'from-blue-400 to-indigo-500',
          description: 'Total Visitors'
        },
        {
          value: '3.2%',
          change: '+0.8%',
          trend: 'up',
          icon: TrendingUp,
          color: 'from-purple-400 to-pink-500',
          description: 'Conversion Rate'
        },
        {
          value: '148',
          change: '+12%',
          trend: 'up',
          icon: ShoppingBag,
          color: 'from-orange-400 to-red-500',
          description: 'Total Orders'
        }
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="premium-dashboard bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200/60 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:z-0`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">B3ACON</h2>
                <p className="text-xs text-gray-500">Shopify Dashboard</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 flex-1 overflow-y-auto">
          <Navigation />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{user?.shopUrl?.split('.')[0] || 'Store Owner'}</h4>
              <p className="text-xs text-gray-500">{user?.email || user?.shopUrl}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Help & Support</span>
            </button>
            
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span>Sign Out</span>
            </button>
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
          {renderContent()}
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
            Welcome back, <span className="text-gradient-primary">Store Owner! 👋</span>
          </h1>
          <p className="text-gray-600 text-lg">Your store is performing great this month</p>
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

    {/* Placeholder for main dashboard content */}
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Overview</h3>
      <p className="text-gray-600">Welcome to your Shopify dashboard. Use the navigation menu to access different features:</p>
      <ul className="mt-4 space-y-2 text-gray-600">
        <li>• <strong>AI BUY NOW:</strong> Create AI-powered buy buttons</li>
        <li>• <strong>TYPEWRITER:</strong> Add dynamic typewriter text effects</li>
        <li>• <strong>REVIEW:</strong> Manage customer reviews across platforms</li>
        <li>• <strong>Affiliate:</strong> Set up affiliate marketing programs</li>
        <li>• <strong>SEO Tools:</strong> Optimize your store for search engines</li>
        <li>• <strong>Analytics:</strong> Track performance and insights</li>
      </ul>
    </div>
  </>
);

// SEO render functions
const renderSEOWebsiteAnalysis = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
      Website Analysis
    </h2>
    <FeatureGate 
      requiredPlan="starter" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Comprehensive website analysis and SEO audit tools.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderSEOKeywordResearch = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
      Keyword Research
    </h2>
    <FeatureGate 
      requiredPlan="starter" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Advanced keyword research and opportunity discovery.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderSEOCompetitorAnalysis = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
      Competitor Analysis
    </h2>
    <FeatureGate 
      requiredPlan="starter" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Analyze competitor strategies and performance.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderSEORankTracking = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
      Rank Tracking
    </h2>
    <FeatureGate 
      requiredPlan="starter" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Track keyword rankings and SERP positions.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderSEOBacklinks = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
      Backlinks Monitor
    </h2>
    <FeatureGate 
      requiredPlan="starter" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Monitor and analyze your backlink profile.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderSEOTechnicalAudit = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
      Technical Audit
    </h2>
    <FeatureGate 
      requiredPlan="starter" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Technical SEO analysis and recommendations.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderSEOContentOptimizer = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
      Content Optimizer
    </h2>
    <FeatureGate 
      requiredPlan="starter" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Optimize content for better search rankings.</p>
      </div>
    </FeatureGate>
  </div>
);

// Analytics render functions
const renderAnalyticsTraffic = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
      Traffic Analytics
    </h2>
    <FeatureGate 
      requiredPlan="pro" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Detailed traffic analysis and visitor insights.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderAnalyticsConversions = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
      Conversion Tracking
    </h2>
    <FeatureGate 
      requiredPlan="pro" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Advanced conversion tracking and funnel analysis.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderAnalyticsRevenue = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
      Revenue Reports
    </h2>
    <FeatureGate 
      requiredPlan="pro" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Comprehensive revenue tracking and forecasting.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderAnalyticsCustomers = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
      Customer Analytics
    </h2>
    <FeatureGate 
      requiredPlan="pro" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Deep insights into customer behavior and segments.</p>
      </div>
    </FeatureGate>
  </div>
);

const renderAnalyticsProducts = () => (
  <div className="premium-dashboard-content">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
      Product Analytics
    </h2>
    <FeatureGate 
      requiredPlan="starter" 
      lockType="overlay"
    >
      <div className="glass-card p-6">
        <p className="text-gray-600">Analyze product performance and optimization opportunities.</p>
      </div>
    </FeatureGate>
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