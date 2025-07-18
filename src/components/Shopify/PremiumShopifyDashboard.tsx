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
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { shopifyApi } from '../../services/shopifyApi';
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
  const [storeData, setStoreData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Check if store is connected
      const connectedStore = localStorage.getItem('shopify_connected_store');
      
      if (!connectedStore) {
        setError('No store connected. Please connect your Shopify store first.');
        setIsLoading(false);
        return;
      }

      setStoreName(connectedStore);
      
      // Get store connection from Supabase
      const store = await shopifyApi.getConnectedStore(connectedStore);
      
      if (!store) {
        setError('Store connection not found. Please reconnect your store.');
        setIsLoading(false);
        return;
      }

      setIsConnected(true);
      
      // Fetch analytics data
      const analytics = await shopifyApi.getStoreAnalytics(store.domain, store.accessToken);
      setStoreData(analytics);

      // Convert analytics to metrics format
      const revenue = analytics.totalRevenue || 0;
      const orders = analytics.totalOrders || 0;
      const customers = analytics.totalCustomers || 0;
      const avgOrderValue = analytics.averageOrderValue || 0;

      setMetrics([
        {
          value: `$${revenue.toLocaleString()}`,
          change: '+12.5%', // TODO: Calculate real change from historical data
          trend: 'up',
          icon: TrendingUp,
          color: 'emerald',
          description: 'Total Revenue'
        },
        {
          value: orders.toLocaleString(),
          change: `+${Math.round(orders * 0.15)}`, // Rough calculation
          trend: 'up',
          icon: ShoppingBag,
          color: 'blue',
          description: 'Total Orders'
        },
        {
          value: `$${avgOrderValue.toFixed(2)}`,
          change: '+$2.50', // Rough calculation
          trend: 'up',
          icon: Target,
          color: 'purple',
          description: 'Avg Order Value'
        },
        {
          value: customers.toLocaleString(),
          change: `+${Math.round(customers * 0.12)}`, // Rough calculation
          trend: 'up',
          icon: Users,
          color: 'pink',
          description: 'Total Customers'
        }
      ]);
      setIsLoading(false);

    } catch (error) {
      console.error('❌ Error loading store data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load store data');
      setIsLoading(false);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={loadStoreData}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
            <button
              onClick={() => window.location.href = '/shopify/install'}
              className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Reconnect Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-primary">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">B3ACON</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-2 bg-emerald-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-700 text-sm font-medium">
                  {storeName ? `${storeName}.myshopify.com` : 'Loading...'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </div>
  );
};

export default PremiumShopifyDashboard;