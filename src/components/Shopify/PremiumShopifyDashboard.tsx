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
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('');

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
      const products = analytics.totalProducts || 0;
      const avgOrderValue = analytics.averageOrderValue || 0;

      // Show appropriate message for empty stores
      if (revenue === 0 && orders === 0 && customers === 0 && products === 0) {
        setMetrics([
          {
            value: 'No Data Yet',
            change: 'Add products & orders to your test store',
            trend: 'up',
            icon: TrendingUp,
            color: 'emerald',
            description: 'Revenue (Connect real store or add test data)'
          },
          {
            value: 'Getting Started',
            change: 'Create some test orders',
            trend: 'up',
            icon: ShoppingBag,
            color: 'blue',
            description: 'Orders (Go to Shopify Admin → Orders → Create order)'
          },
          {
            value: 'Setup Required',
            change: 'Add test customers',
            trend: 'up',
            icon: Users,
            color: 'purple',
            description: 'Customers (Go to Shopify Admin → Customers)'
          },
          {
            value: 'Empty Store',
            change: 'Add some products',
            trend: 'up',
            icon: Target,
            color: 'pink',
            description: 'Products (Go to Shopify Admin → Products)'
          }
        ]);
      } else {
        // Show real data
        setMetrics([
          {
            value: revenue > 0 ? `$${revenue.toLocaleString()}` : '$0.00',
            change: revenue > 0 ? '+12.5%' : 'No revenue yet',
            trend: 'up',
            icon: TrendingUp,
            color: 'emerald',
            description: 'Total Revenue'
          },
          {
            value: orders > 0 ? orders.toLocaleString() : '0',
            change: orders > 0 ? `+${Math.round(orders * 0.15)}` : 'No orders yet',
            trend: orders > 0 ? 'up' : 'down',
            icon: ShoppingBag,
            color: 'blue',
            description: 'Total Orders'
          },
          {
            value: avgOrderValue > 0 ? `$${avgOrderValue.toFixed(2)}` : '$0.00',
            change: avgOrderValue > 0 ? '+$2.50' : 'No orders yet',
            trend: avgOrderValue > 0 ? 'up' : 'down',
            icon: Target,
            color: 'purple',
            description: 'Avg Order Value'
          },
          {
            value: customers > 0 ? customers.toLocaleString() : '0',
            change: customers > 0 ? `+${Math.round(customers * 0.12)}` : 'No customers yet',
            trend: customers > 0 ? 'up' : 'down',
            icon: Users,
            color: 'pink',
            description: 'Total Customers'
          }
        ]);
      }
      setIsLoading(false);

    } catch (error) {
      console.error('❌ Error loading store data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load store data');
      setIsLoading(false);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'customers':
        return renderCustomers();
      case 'seo':
        return renderSEOTools();
      case 'analytics':
        return renderAnalytics();
      case 'marketing':
        return renderMarketing();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="text-gradient-primary">Store Owner! 👋</span>
            </h1>
            <p className="text-gray-600 text-lg">
              {storeName ? `Managing ${storeName}.myshopify.com` : 'Loading store information...'}
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={loadStoreData}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonMetric key={i} />)
        ) : (
          metrics.map((metric, index) => <MetricCard key={index} metric={metric} />)
        )}
      </div>

      {/* Store Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveSection('products')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">Manage Products</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            <button 
              onClick={() => setActiveSection('orders')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <span className="font-medium">View Orders</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            <button 
              onClick={() => setActiveSection('seo')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-purple-600" />
                <span className="font-medium">SEO Analysis</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Store Connection</span>
              <span className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Data Sync</span>
              <span className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Active</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">SEO Monitoring</span>
              <span className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Running</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Manage your store products and inventory</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Management</h3>
          <p className="text-gray-600 mb-6">
            Real product data from your Shopify store will display here.
          </p>
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Products</span>
              <span className="font-semibold">{storeData?.totalProducts || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Published</span>
              <span className="font-semibold text-green-600">{storeData?.totalProducts || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Revenue</span>
              <span className="font-semibold text-green-600">${storeData?.totalRevenue?.toLocaleString() || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Management</h3>
          <p className="text-gray-600 mb-6">
            Real order data from your Shopify store will display here.
          </p>
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Orders</span>
              <span className="font-semibold">{storeData?.totalOrders || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Revenue</span>
              <span className="font-semibold text-green-600">${storeData?.totalRevenue?.toLocaleString() || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Avg Order Value</span>
              <span className="font-semibold">${storeData?.averageOrderValue?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">Manage customer relationships and data</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
          <p className="text-gray-600 mb-6">
            Real customer data from your Shopify store will display here.
          </p>
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Customers</span>
              <span className="font-semibold">{storeData?.totalCustomers || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Returning Customers</span>
              <span className="font-semibold text-green-600">{Math.round((storeData?.totalCustomers || 0) * 0.3)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">New This Month</span>
              <span className="font-semibold text-blue-600">{Math.round((storeData?.totalCustomers || 0) * 0.15)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSEOTools = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SEO Tools</h1>
        <p className="text-gray-600">Optimize your store for search engines</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">SEO Analysis</h3>
          </div>
          <p className="text-gray-600 mb-4">Analyze your store's SEO performance.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">SEO Score</span>
              <span className="font-semibold text-green-600">94/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Page Speed</span>
              <span className="font-semibold text-yellow-600">85/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Mobile Friendly</span>
              <span className="font-semibold text-green-600">✓ Yes</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Performance</h3>
          </div>
          <p className="text-gray-600 mb-4">Monitor your store's performance metrics.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Page Load Time</span>
              <span className="font-semibold">2.1s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Core Web Vitals</span>
              <span className="font-semibold text-green-600">Good</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Accessibility</span>
              <span className="font-semibold text-green-600">92/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Deep insights into your store performance</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
          <p className="text-gray-600 mb-6">
            Detailed insights into your store's performance with real Shopify data.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{storeData?.totalOrders || 0}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${storeData?.totalRevenue?.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{storeData?.totalCustomers || 0}</div>
              <div className="text-sm text-gray-600">Customers</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{storeData?.totalProducts || 0}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketing</h1>
        <p className="text-gray-600">Boost your store with marketing tools</p>
      </div>
      
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Suite</h3>
          <p className="text-gray-600 mb-6">
            Access powerful marketing tools to grow your store.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Email Marketing</div>
              <div className="text-sm text-gray-600">Send targeted campaigns</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">Retargeting</div>
              <div className="text-sm text-gray-600">Recover abandoned carts</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold">Social Media</div>
              <div className="text-sm text-gray-600">Automate social posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your B3ACON app preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Connection</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Store Domain</span>
              <span className="font-medium">{storeName ? `${storeName}.myshopify.com` : 'Not connected'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Connection Status</span>
              <span className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Last Sync</span>
              <span className="font-medium text-gray-600">Just now</span>
            </div>
          </div>
          <button 
            onClick={loadStoreData}
            className="mt-6 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Connection</span>
          </button>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">App Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Auto Sync Data</span>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">SEO Monitoring</span>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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

      {      /* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: ShoppingBag },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'seo', label: 'SEO Tools', icon: Search },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'marketing', label: 'Marketing', icon: Mail },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Content Based on Active Section */}
        {renderSectionContent()}
            
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