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
  Sparkles
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
      image: 'https://images.unsplash.com/photo-1609592424770-8e78096fa65c?w=80&h=80&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">B3ACON Dashboard</h1>
                <p className="text-sm text-gray-500">Shopify Store Analytics</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your Shopify store today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select 
                  value={activeTimeframe} 
                  onChange={(e) => setActiveTimeframe(e.target.value)}
                  className="text-sm font-medium bg-transparent border-none focus:outline-none"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              <button className="btn-premium btn-primary btn-small">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 bg-${metric.trend === 'up' ? 'emerald' : 'red'}-100 rounded-full`}>
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className={`w-3 h-3 text-${metric.trend === 'up' ? 'emerald' : 'red'}-600`} />
                    ) : (
                      <ArrowDownRight className={`w-3 h-3 text-${metric.trend === 'up' ? 'emerald' : 'red'}-600`} />
                    )}
                    <span className={`text-xs font-medium text-${metric.trend === 'up' ? 'emerald' : 'red'}-600`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would be here</p>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            <div className="space-y-4">
              {trafficSourcesData.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.fill }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{source.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          backgroundColor: source.fill, 
                          width: `${source.value}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{source.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 bg-${activity.type === 'success' ? 'emerald' : 'blue'}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-4 h-4 text-${activity.type === 'success' ? 'emerald' : 'blue'}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.target}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-semibold text-gray-900">{product.revenue}</span>
                      <span className="text-xs text-emerald-600 font-medium">{product.growth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PremiumShopifyDashboard;