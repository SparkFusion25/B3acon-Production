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
  Crown,
  Globe,
  Plus,
  Edit,
  Save,
  CreditCard,
  FileText,
  HelpCircle,
  MessageSquare,
  Bookmark,
  Activity,
  RefreshCw,
  Database,
  Link,
  Clipboard,
  CheckSquare,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  GitBranch,
  Workflow
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

  // Render section content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewSection();
      case 'analytics':
        return renderAnalyticsSection();
      case 'products':
        return renderProductsSection();
      case 'seo':
        return renderSEOSection();
      case 'campaigns':
        return renderCampaignsSection();
      case 'automations':
        return renderAutomationsSection();
      case 'reports':
        return renderReportsSection();
      case 'integrations':
        return renderIntegrationsSection();
      case 'support':
        return renderSupportSection();
      case 'settings':
        return renderSettingsSection();
      default:
        return renderOverviewSection();
    }
  };

  // Overview Section (Original Dashboard Content)
  const renderOverviewSection = () => (
    <div>
      {/* Time Frame Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['24h', '7d', '30d', '90d'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
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
  );

  // Analytics Section
  const renderAnalyticsSection = () => (
    <div className="space-y-8">
      {/* Advanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-blue-600 text-sm font-semibold">+15.3%</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900">3.24%</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-emerald-600 text-sm font-semibold">+28.7%</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">AOV (Average Order Value)</p>
            <p className="text-3xl font-bold text-gray-900">$127.50</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-purple-600 text-sm font-semibold">+12.1%</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Customer Lifetime Value</p>
            <p className="text-3xl font-bold text-gray-900">$892</p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Charts */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Trends</h3>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Advanced Analytics Dashboard</p>
            <p className="text-sm text-gray-500">Detailed performance metrics and trends would be displayed here</p>
          </div>
        </div>
      </div>

      {/* Analytics Insights */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Insights</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Revenue Growth</h4>
              <p className="text-gray-600">Your store's revenue has increased by 23% compared to last month, primarily driven by improved SEO rankings.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-emerald-50 rounded-lg">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Conversion Optimization</h4>
              <p className="text-gray-600">Product page optimizations have resulted in a 15.3% increase in conversion rates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Products Section
  const renderProductsSection = () => (
    <div className="space-y-8">
      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div className="text-purple-600 text-sm font-semibold">+12</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">247</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="text-emerald-600 text-sm font-semibold">98%</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">SEO Optimized</p>
            <p className="text-3xl font-bold text-gray-900">242</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-blue-600 text-sm font-semibold">+5.2%</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Avg. Rating</p>
            <p className="text-3xl font-bold text-gray-900">4.8</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-orange-600 text-sm font-semibold">87%</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">In Stock</p>
            <p className="text-3xl font-bold text-gray-900">215</p>
          </div>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Product Catalog</h3>
          <div className="flex items-center space-x-2">
            <button className="btn-premium btn-outline btn-small">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="btn-premium btn-primary btn-small">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Wireless Bluetooth Headphones', sku: 'WBH-001', price: '$89.99', seo: 95, status: 'active' },
            { name: 'Smart Fitness Watch', sku: 'SFW-002', price: '$199.99', seo: 88, status: 'active' },
            { name: 'Portable Phone Charger', sku: 'PPC-003', price: '$24.99', seo: 92, status: 'draft' },
            { name: 'Premium Coffee Maker', sku: 'PCM-004', price: '$149.99', seo: 78, status: 'active' }
          ].map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{product.price}</div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-emerald-600">{product.seo}%</div>
                  <div className="text-sm text-gray-600">SEO Score</div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Bulk SEO Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-premium btn-outline p-4 h-auto flex flex-col items-center space-y-2">
            <Search className="w-8 h-8 text-emerald-600" />
            <span className="font-medium">Optimize All Products</span>
            <span className="text-sm text-gray-600">Auto-generate SEO content</span>
          </button>
          
          <button className="btn-premium btn-outline p-4 h-auto flex flex-col items-center space-y-2">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="font-medium">Update Meta Tags</span>
            <span className="text-sm text-gray-600">Batch update descriptions</span>
          </button>
          
          <button className="btn-premium btn-outline p-4 h-auto flex flex-col items-center space-y-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <span className="font-medium">Analyze Performance</span>
            <span className="text-sm text-gray-600">Generate product reports</span>
          </button>
        </div>
      </div>
    </div>
  );

  // SEO Section
  const renderSEOSection = () => (
    <div className="space-y-8">
      {/* SEO Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="text-emerald-600 text-sm font-semibold">+8 pts</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Overall SEO Score</p>
            <p className="text-3xl font-bold text-gray-900">94/100</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-blue-600 text-sm font-semibold">+127</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Keywords Ranking</p>
            <p className="text-3xl font-bold text-gray-900">1,024</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-purple-600 text-sm font-semibold">+23%</div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Organic Traffic</p>
            <p className="text-3xl font-bold text-gray-900">12.4K</p>
          </div>
        </div>
      </div>

      {/* SEO Tools */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">SEO Tools & Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <Search className="w-6 h-6 text-emerald-600" />
              <h4 className="font-semibold text-gray-900">Keyword Research</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Find high-performing keywords for your products</p>
            <button className="btn-premium btn-primary btn-small">Launch Tool</button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Rank Tracker</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Monitor your search engine rankings</p>
            <button className="btn-premium btn-primary btn-small">View Rankings</button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Content Optimizer</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">AI-powered content optimization</p>
            <button className="btn-premium btn-primary btn-small">Optimize Now</button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <Globe className="w-6 h-6 text-indigo-600" />
              <h4 className="font-semibold text-gray-900">Site Audit</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Complete technical SEO analysis</p>
            <button className="btn-premium btn-primary btn-small">Run Audit</button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-gray-900">Competitor Analysis</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Analyze competitor strategies</p>
            <button className="btn-premium btn-primary btn-small">Analyze</button>
          </div>

          {!hasFeatureAccess('white-label') && (
            <LockedFeature 
              title="Schema Markup" 
              description="Advanced structured data for better search visibility" 
              requiredPlan="Pro" 
            />
          )}
        </div>
      </div>

      {/* Recent SEO Activities */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent SEO Activities</h3>
        <div className="space-y-4">
          {[
            { action: 'Keyword ranking improved', keyword: '"wireless headphones"', change: '+5 positions', time: '2 hours ago' },
            { action: 'Product page optimized', product: 'Smart Fitness Watch', improvement: '+12 SEO score', time: '4 hours ago' },
            { action: 'New backlink acquired', source: 'tech-reviews.com', authority: 'DA 68', time: '1 day ago' },
            { action: 'Meta description updated', pages: '15 product pages', status: 'Completed', time: '2 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">
                    {activity.keyword && `Keyword: ${activity.keyword}`}
                    {activity.product && `Product: ${activity.product}`}
                    {activity.source && `Source: ${activity.source}`}
                    {activity.pages && `Updated: ${activity.pages}`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-emerald-600">
                  {activity.change || activity.improvement || activity.authority || activity.status}
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Settings Section
  const renderSettingsSection = () => (
    <div className="space-y-8">
      {/* Account Settings */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input 
                type="text" 
                defaultValue="TechGear Pro" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store URL</label>
              <input 
                type="text" 
                defaultValue={shopUrl} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input 
              type="email" 
              defaultValue="admin@techgearpro.com" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Subscription Plan</h3>
        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg mb-4">
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8 text-indigo-600" />
            <div>
              <div className="font-semibold text-gray-900 capitalize">{userPlan} Plan</div>
              <div className="text-sm text-gray-600">Active subscription</div>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = `/shopify/plans?shop=${shopUrl}&current=${userPlan}`}
            className="btn-premium btn-primary"
          >
            Manage Plan
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">500</div>
            <div className="text-sm text-gray-600">Products Remaining</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">14</div>
            <div className="text-sm text-gray-600">Days Until Renewal</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">$79</div>
            <div className="text-sm text-gray-600">Monthly Cost</div>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">App Preferences</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-600">Receive updates about SEO improvements</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto SEO Optimization</div>
              <div className="text-sm text-gray-600">Automatically optimize new products</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Weekly Reports</div>
              <div className="text-sm text-gray-600">Receive weekly performance summaries</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="btn-premium btn-primary">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-200">
        <h3 className="text-xl font-bold text-red-600 mb-6">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Reset SEO Data</div>
              <div className="text-sm text-gray-600">Clear all SEO optimization data and start fresh</div>
            </div>
            <button className="btn-premium btn-outline border-red-300 text-red-600 hover:bg-red-50">
              Reset Data
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Uninstall App</div>
              <div className="text-sm text-gray-600">Permanently remove B3ACON from your store</div>
            </div>
            <button className="btn-premium bg-red-600 text-white hover:bg-red-700">
              Uninstall
            </button>
          </div>
        </div>
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
                  onClick={() => setActiveSection('campaigns')}
                  className={`font-medium transition-colors ${activeSection === 'campaigns' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Campaigns
                </button>
                <button 
                  onClick={() => setActiveSection('automations')}
                  className={`font-medium transition-colors ${activeSection === 'automations' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Automations
                </button>
                <button 
                  onClick={() => setActiveSection('reports')}
                  className={`font-medium transition-colors ${activeSection === 'reports' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Reports
                </button>
                <button 
                  onClick={() => setActiveSection('integrations')}
                  className={`font-medium transition-colors ${activeSection === 'integrations' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Integrations
                </button>
                <button 
                  onClick={() => setActiveSection('support')}
                  className={`font-medium transition-colors ${activeSection === 'support' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  Support
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
              
              <nav className="space-y-4 max-h-96 overflow-y-auto">
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
                  onClick={() => {setActiveSection('campaigns'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'campaigns' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <Target className="w-5 h-5 text-pink-600" />
                  <span className="font-medium text-gray-900">Campaigns</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('automations'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'automations' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">Automations</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('reports'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'reports' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Reports</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('integrations'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'integrations' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <Globe className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Integrations</span>
                </button>
                <button 
                  onClick={() => {setActiveSection('support'); setIsMobileMenuOpen(false);}}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeSection === 'support' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <Users className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900">Support</span>
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
                {activeSection === 'campaigns' && <>Marketing <span className="text-gradient-primary">Campaigns</span></>}
                {activeSection === 'automations' && <>Smart <span className="text-gradient-primary">Automations</span></>}
                {activeSection === 'reports' && <>Advanced <span className="text-gradient-primary">Reports</span></>}
                {activeSection === 'integrations' && <>App <span className="text-gradient-primary">Integrations</span></>}
                {activeSection === 'support' && <>Help & <span className="text-gradient-primary">Support</span></>}
                {activeSection === 'settings' && <>Account <span className="text-gradient-primary">Settings</span></>}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                {activeSection === 'overview' && 'Your store is performing 23% better than last month'}
                {activeSection === 'analytics' && 'Monitor your store performance and track key metrics'}
                {activeSection === 'products' && 'Manage your product catalog and SEO optimization'}
                {activeSection === 'seo' && 'Optimize your store for search engines and boost rankings'}
                {activeSection === 'campaigns' && 'Create and manage targeted marketing campaigns to boost sales'}
                {activeSection === 'automations' && 'Set up automated workflows to optimize your store continuously'}
                {activeSection === 'reports' && 'Generate detailed reports and export performance data'}
                {activeSection === 'integrations' && 'Connect with third-party tools and services'}
                {activeSection === 'support' && 'Get help, access documentation, and manage support tickets'}
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