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
  X,
  Image,
  Facebook,
  Instagram,
  Twitter,
  Calendar,
  Hash,
  BarChart,
  Send,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Reply,
  Filter
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Real-time dashboard state
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetric[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<ActiveCampaign[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // AI Tools state
  const [activeAITab, setActiveAITab] = useState('popup-generator');
  const [popupCampaigns, setPopupCampaigns] = useState([
    {
      id: '1',
      name: 'Holiday Exit Intent',
      character: 'Maya',
      trigger: 'Exit Intent',
      status: 'active',
      performance: { impressions: 15420, clicks: 1854, conversions: 234, revenue: 12847 },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Welcome Popup',
      character: 'Alex',
      trigger: 'Time Based',
      status: 'active',
      performance: { impressions: 8930, clicks: 892, conversions: 134, revenue: 7456 },
      createdAt: '2024-01-12'
    }
  ]);

  const [contentProjects, setContentProjects] = useState([
    {
      id: '1',
      type: 'Blog Post',
      title: 'Top 10 Holiday Gift Ideas for Tech Lovers',
      status: 'completed',
      wordCount: 1247,
      seoScore: 94,
      createdAt: '2024-01-16'
    },
    {
      id: '2',
      type: 'Product Description',
      title: 'Wireless Bluetooth Headphones',
      status: 'in-progress',
      wordCount: 156,
      seoScore: 87,
      createdAt: '2024-01-16'
    }
  ]);

  const [chatAssistants, setChatAssistants] = useState([
    {
      id: '1',
      name: 'Customer Support Bot',
      type: 'Support',
      status: 'active',
      conversations: 1247,
      satisfaction: 4.8,
      responseTime: '2.3s'
    },
    {
      id: '2',
      name: 'Lead Qualification Bot',
      type: 'Sales',
      status: 'active',
      conversations: 892,
      satisfaction: 4.6,
      responseTime: '1.8s'
    }
  ]);

  const [imageProjects, setImageProjects] = useState([
    {
      id: '1',
      type: 'Product Image',
      title: 'Headphones Product Shot',
      status: 'completed',
      dimensions: '1200x1200',
      style: 'Professional',
      createdAt: '2024-01-16'
    },
    {
      id: '2',
      type: 'Social Media',
      title: 'Instagram Story Template',
      status: 'generating',
      dimensions: '1080x1920',
      style: 'Modern',
      createdAt: '2024-01-16'
    }
  ]);

  // SEO Tools state (moved to proper location at top of component)
  const [activeSEOTab, setActiveSEOTab] = useState('seo-analyzer');
  const [seoAnalysisForm, setSeoAnalysisForm] = useState({
    url: '',
    keyword: '',
    competitor: ''
  });
  const [linkBuildingForm, setLinkBuildingForm] = useState({
    sourceUrl: '',
    targetUrl: '',
    anchorText: '',
    linkType: 'internal'
  });
  const [rankTrackerForm, setRankTrackerForm] = useState({
    keyword: '',
    location: 'United States',
    device: 'desktop'
  });
  const [keywordResearchForm, setKeywordResearchForm] = useState({
    seedKeyword: '',
    location: 'United States',
    language: 'English'
  });
  const [siteSpeedForm, setSiteSpeedForm] = useState({
    url: '',
    device: 'desktop'
  });
  const [schemaForm, setSchemaForm] = useState({
    type: 'Product',
    title: '',
    description: ''
  });
  const [imageCompressionForm, setImageCompressionForm] = useState({
    selectedFiles: [],
    quality: 80,
    format: 'JPEG',
    maxWidth: 1920,
    maxHeight: 1080
  });
  const [seoReports, setSeoReports] = useState([
    {
      id: '1',
      url: 'https://techstore.myshopify.com',
      keyword: 'wireless headphones',
      score: 87,
      status: 'completed',
      issues: 3,
      suggestions: 8,
      createdAt: '2024-01-16'
    },
    {
      id: '2',
      url: 'https://techstore.myshopify.com/products/bluetooth-speakers',
      keyword: 'bluetooth speakers',
      score: 92,
      status: 'completed',
      issues: 1,
      suggestions: 4,
      createdAt: '2024-01-15'
    }
  ]);
  const [internalLinks, setInternalLinks] = useState([
    {
      id: '1',
      sourceUrl: '/products/headphones',
      targetUrl: '/collections/audio',
      anchorText: 'audio collection',
      linkType: 'internal',
      status: 'active',
      clicks: 234,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      sourceUrl: '/blog/tech-trends',
      targetUrl: '/products/wireless-speakers',
      anchorText: 'wireless speakers',
      linkType: 'internal',
      status: 'active',
      clicks: 156,
      createdAt: '2024-01-14'
    }
  ]);
  const [trackedKeywords, setTrackedKeywords] = useState([
    {
      id: '1',
      keyword: 'wireless headphones',
      position: 3,
      previousPosition: 5,
      volume: 18100,
      difficulty: 'Medium',
      location: 'United States',
      device: 'desktop',
      lastUpdate: '2024-01-16'
    },
    {
      id: '2',
      keyword: 'bluetooth speakers',
      position: 7,
      previousPosition: 8,
      volume: 12300,
      difficulty: 'High',
      location: 'United States',
      device: 'desktop',
      lastUpdate: '2024-01-16'
    }
  ]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([
    {
      id: '1',
      keyword: 'wireless bluetooth headphones',
      volume: 22100,
      difficulty: 'Medium',
      cpc: '$1.25',
      competition: 'High',
      trend: 'up'
    },
    {
      id: '2',
      keyword: 'noise cancelling headphones',
      volume: 18300,
      difficulty: 'Hard',
      cpc: '$2.10',
      competition: 'High',
      trend: 'stable'
    }
  ]);
  const [speedReports, setSpeedReports] = useState([
    {
      id: '1',
      url: 'https://techstore.myshopify.com',
      device: 'desktop',
      score: 87,
      fcp: '1.2s',
      lcp: '2.1s',
      cls: '0.05',
      status: 'completed',
      createdAt: '2024-01-16'
    }
  ]);
  const [schemaMarkups, setSchemaMarkups] = useState([
    {
      id: '1',
      type: 'Product',
      title: 'Wireless Bluetooth Headphones',
      status: 'active',
      pages: 15,
      createdAt: '2024-01-15'
    }
  ]);
  const [imageCompressions, setImageCompressions] = useState([
    {
      id: '1',
      fileName: 'product-images-batch-1.jpg',
      originalSize: 3420,
      compressedSize: 1240,
      quality: 85,
      format: 'JPEG',
      status: 'completed',
      createdAt: '2024-01-16'
    },
    {
      id: '2',
      fileName: 'hero-banner-collection.png',
      originalSize: 5680,
      compressedSize: 2100,
      quality: 80,
      format: 'WebP',
      status: 'completed',
      createdAt: '2024-01-15'
    }
  ]);

  // Social Media state
  const [activeSocialTab, setActiveSocialTab] = useState('scheduler');
  const [socialPosts, setSocialPosts] = useState([
    {
      id: '1',
      content: 'Check out our new wireless headphones! 🎧 Perfect for music lovers',
      platforms: ['instagram', 'facebook', 'twitter'],
      scheduledTime: '2024-01-17T10:00:00Z',
      status: 'scheduled',
      hashtags: '#music #headphones #tech',
      mediaType: 'image',
      engagement: { likes: 234, shares: 45, comments: 23 },
      createdAt: '2024-01-16'
    },
    {
      id: '2',
      content: 'Flash sale this weekend! 50% off all bluetooth speakers 🔥',
      platforms: ['instagram', 'facebook'],
      scheduledTime: '2024-01-18T14:30:00Z',
      status: 'published',
      hashtags: '#sale #speakers #discount',
      mediaType: 'video',
      engagement: { likes: 567, shares: 123, comments: 89 },
      createdAt: '2024-01-15'
    }
  ]);
  const [socialAnalytics, setSocialAnalytics] = useState([
    {
      platform: 'Instagram',
      followers: 12340,
      engagement: 4.8,
      reach: 45230,
      posts: 156,
      growth: '+12%'
    },
    {
      platform: 'Facebook',
      followers: 8920,
      engagement: 3.2,
      reach: 23450,
      posts: 89,
      growth: '+8%'
    },
    {
      platform: 'Twitter',
      followers: 5670,
      engagement: 2.1,
      reach: 12340,
      posts: 234,
      growth: '+5%'
    }
  ]);
  const [postForm, setPostForm] = useState({
    content: '',
    platforms: [],
    scheduledTime: '',
    hashtags: '',
    mediaType: 'image'
  });

  // Review Management state
  const [activeReviewTab, setActiveReviewTab] = useState('dashboard');
  const [reviews, setReviews] = useState([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      rating: 5,
      title: 'Amazing wireless headphones!',
      content: 'These headphones exceeded my expectations. Great sound quality and comfortable fit. Highly recommend!',
      product: 'Wireless Bluetooth Headphones',
      platform: 'Shopify',
      date: '2024-01-16',
      status: 'published',
      response: '',
      helpful: 12,
      verified: true
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      customerEmail: 'mike.chen@email.com',
      rating: 4,
      title: 'Good speakers, fast delivery',
      content: 'Sound quality is excellent and delivery was super fast. Only minor issue is the bass could be slightly stronger.',
      product: 'Bluetooth Speaker Pro',
      platform: 'Google',
      date: '2024-01-15',
      status: 'published',
      response: 'Thank you for your feedback! We\'re glad you enjoyed the fast delivery. We\'ll consider your bass feedback for future models.',
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      customerName: 'Anonymous User',
      customerEmail: 'user@email.com',
      rating: 2,
      title: 'Not as described',
      content: 'Product arrived damaged and customer service was slow to respond. Disappointed with the experience.',
      product: 'USB-C Cable',
      platform: 'Amazon',
      date: '2024-01-14',
      status: 'pending',
      response: '',
      helpful: 3,
      verified: false
    }
  ]);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 847,
    averageRating: 4.3,
    responseRate: 89,
    pendingReviews: 23,
    thisMonth: 156
  });
  const [responseForm, setResponseForm] = useState({
    reviewId: '',
    message: '',
    template: ''
  });
  const [reviewFilters, setReviewFilters] = useState({
    rating: 'all',
    platform: 'all',
    status: 'all',
    verified: 'all'
  });

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="glass-card p-4 sm:p-6">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

  // SEO Tools handlers (moved before render functions for accessibility)
  const handleSEOAnalysis = () => {
    if (!seoAnalysisForm.url.trim()) {
      alert('Please enter a URL to analyze');
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      url: seoAnalysisForm.url,
      keyword: seoAnalysisForm.keyword || 'general analysis',
      score: Math.floor(Math.random() * 30) + 70,
      status: 'analyzing' as const,
      issues: Math.floor(Math.random() * 5) + 1,
      suggestions: Math.floor(Math.random() * 10) + 5,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSeoReports([newReport, ...seoReports]);
    
    setTimeout(() => {
      setSeoReports(prev => prev.map(r => 
        r.id === newReport.id ? { ...r, status: 'completed' } : r
      ));
    }, 4000);

    setSeoAnalysisForm({ url: '', keyword: '', competitor: '' });
    alert(`✅ SEO analysis started for "${newReport.url}"! Analysis will complete in a few seconds.`);
  };

  const handleCreateInternalLink = () => {
    if (!linkBuildingForm.sourceUrl.trim() || !linkBuildingForm.targetUrl.trim()) {
      alert('Please enter both source and target URLs');
      return;
    }

    const newLink = {
      id: Date.now().toString(),
      sourceUrl: linkBuildingForm.sourceUrl,
      targetUrl: linkBuildingForm.targetUrl,
      anchorText: linkBuildingForm.anchorText || 'click here',
      linkType: linkBuildingForm.linkType,
      status: 'active' as const,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInternalLinks([newLink, ...internalLinks]);
    setLinkBuildingForm({ sourceUrl: '', targetUrl: '', anchorText: '', linkType: 'internal' });
    alert(`✅ Internal link created: "${newLink.sourceUrl}" → "${newLink.targetUrl}"`);
  };

  const handleTrackKeyword = () => {
    if (!rankTrackerForm.keyword.trim()) {
      alert('Please enter a keyword to track');
      return;
    }

    const newKeyword = {
      id: Date.now().toString(),
      keyword: rankTrackerForm.keyword,
      position: Math.floor(Math.random() * 20) + 1,
      previousPosition: Math.floor(Math.random() * 25) + 1,
      volume: Math.floor(Math.random() * 50000) + 1000,
      difficulty: ['Easy', 'Medium', 'Hard', 'Very Hard'][Math.floor(Math.random() * 4)],
      location: rankTrackerForm.location,
      device: rankTrackerForm.device,
      lastUpdate: new Date().toISOString().split('T')[0]
    };

    setTrackedKeywords([newKeyword, ...trackedKeywords]);
    setRankTrackerForm({ keyword: '', location: 'United States', device: 'desktop' });
    alert(`✅ Now tracking keyword "${newKeyword.keyword}" - Current position: #${newKeyword.position}`);
  };

  const handleDeleteSEOReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this SEO report?')) {
      setSeoReports(prev => prev.filter(r => r.id !== reportId));
      alert('✅ SEO report deleted successfully');
    }
  };

  const handleToggleLink = (linkId: string) => {
    setInternalLinks(prev => prev.map(l => 
      l.id === linkId ? { 
        ...l, 
        status: l.status === 'active' ? 'inactive' : 'active' 
      } : l
    ));
  };

  const handleDeleteLink = (linkId: string) => {
    if (confirm('Are you sure you want to delete this internal link?')) {
      setInternalLinks(prev => prev.filter(l => l.id !== linkId));
      alert('✅ Internal link deleted successfully');
    }
  };

  const handleDeleteKeyword = (keywordId: string) => {
    if (confirm('Are you sure you want to stop tracking this keyword?')) {
      setTrackedKeywords(prev => prev.filter(k => k.id !== keywordId));
      alert('✅ Keyword tracking stopped');
    }
  };

  const handleKeywordResearch = () => {
    if (!keywordResearchForm.seedKeyword.trim()) {
      alert('Please enter a seed keyword');
      return;
    }

    const suggestions = [
      `${keywordResearchForm.seedKeyword} reviews`,
      `best ${keywordResearchForm.seedKeyword}`,
      `${keywordResearchForm.seedKeyword} price`,
      `${keywordResearchForm.seedKeyword} comparison`,
      `buy ${keywordResearchForm.seedKeyword}`
    ].map((keyword, index) => ({
      id: Date.now().toString() + index,
      keyword,
      volume: Math.floor(Math.random() * 50000) + 1000,
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      cpc: `$${(Math.random() * 3 + 0.5).toFixed(2)}`,
      competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
    }));

    setKeywordSuggestions([...suggestions, ...keywordSuggestions]);
    setKeywordResearchForm({ seedKeyword: '', location: 'United States', language: 'English' });
    alert(`✅ Found ${suggestions.length} keyword suggestions for "${keywordResearchForm.seedKeyword}"`);
  };

  const handleSiteSpeedTest = () => {
    if (!siteSpeedForm.url.trim()) {
      alert('Please enter a URL to test');
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      url: siteSpeedForm.url,
      device: siteSpeedForm.device,
      score: Math.floor(Math.random() * 30) + 70,
      fcp: `${(Math.random() * 2 + 0.8).toFixed(1)}s`,
      lcp: `${(Math.random() * 3 + 1.5).toFixed(1)}s`,
      cls: `${(Math.random() * 0.1).toFixed(2)}`,
      status: 'testing' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSpeedReports([newReport, ...speedReports]);
    
    setTimeout(() => {
      setSpeedReports(prev => prev.map(r => 
        r.id === newReport.id ? { ...r, status: 'completed' } : r
      ));
    }, 3000);

    setSiteSpeedForm({ url: '', device: 'desktop' });
    alert(`✅ Speed test started for "${newReport.url}"! Results in a few seconds.`);
  };

  const handleGenerateSchema = () => {
    if (!schemaForm.title.trim()) {
      alert('Please enter a title for the schema markup');
      return;
    }

    const newSchema = {
      id: Date.now().toString(),
      type: schemaForm.type,
      title: schemaForm.title,
      status: 'active' as const,
      pages: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSchemaMarkups([newSchema, ...schemaMarkups]);
    setSchemaForm({ type: 'Product', title: '', description: '' });
    alert(`✅ ${schemaForm.type} schema markup generated for "${newSchema.title}"`);
  };

  const handleImageCompression = () => {
    if (!imageCompressionForm.selectedFiles.length) {
      alert('Please select images to compress');
      return;
    }

    const newCompression = {
      id: Date.now().toString(),
      fileName: `${imageCompressionForm.selectedFiles.length} images`,
      originalSize: Math.floor(Math.random() * 5000) + 1000,
      compressedSize: Math.floor(Math.random() * 2000) + 300,
      quality: imageCompressionForm.quality,
      format: imageCompressionForm.format,
      status: 'processing' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setImageCompressions([newCompression, ...imageCompressions]);
    
    setTimeout(() => {
      setImageCompressions(prev => prev.map(r => 
        r.id === newCompression.id ? { ...r, status: 'completed' } : r
      ));
    }, 3000);

    setImageCompressionForm({
      selectedFiles: [],
      quality: 80,
      format: 'JPEG',
      maxWidth: 1920,
      maxHeight: 1080
    });
    
    const savings = ((newCompression.originalSize - newCompression.compressedSize) / newCompression.originalSize * 100).toFixed(1);
    alert(`✅ Image compression started! Expected savings: ${savings}%`);
  };

  // Social Media handlers
  const handleCreatePost = () => {
    if (!postForm.content.trim()) {
      alert('Please enter post content');
      return;
    }
    if (!postForm.platforms.length) {
      alert('Please select at least one platform');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      content: postForm.content,
      platforms: postForm.platforms,
      scheduledTime: postForm.scheduledTime || new Date().toISOString(),
      status: postForm.scheduledTime ? 'scheduled' : 'published',
      hashtags: postForm.hashtags,
      mediaType: postForm.mediaType,
      engagement: { likes: 0, shares: 0, comments: 0 },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSocialPosts([newPost, ...socialPosts]);
    setPostForm({
      content: '',
      platforms: [],
      scheduledTime: '',
      hashtags: '',
      mediaType: 'image'
    });

    const platforms = newPost.platforms.join(', ');
    alert(`✅ Post ${newPost.status} successfully on ${platforms}!`);
  };

  const handleDeletePost = (postId) => {
    setSocialPosts(socialPosts.filter(post => post.id !== postId));
    alert('✅ Post deleted successfully!');
  };

  const handlePublishPost = (postId) => {
    setSocialPosts(socialPosts.map(post => 
      post.id === postId ? { ...post, status: 'published' } : post
    ));
    alert('✅ Post published successfully!');
  };

  // Review Management handlers
  const handleRespondToReview = () => {
    if (!responseForm.message.trim()) {
      alert('Please enter a response message');
      return;
    }

    const updatedReviews = reviews.map(review => 
      review.id === responseForm.reviewId 
        ? { ...review, response: responseForm.message, status: 'published' }
        : review
    );

    setReviews(updatedReviews);
    setResponseForm({ reviewId: '', message: '', template: '' });
    alert('✅ Response posted successfully!');
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    alert('✅ Review deleted successfully!');
  };

  const handleFlagReview = (reviewId) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'flagged' }
        : review
    );
    setReviews(updatedReviews);
    alert('🚩 Review flagged for moderation!');
  };

  const handleMarkHelpful = (reviewId) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    );
    setReviews(updatedReviews);
  };

  const getFilteredReviews = () => {
    return reviews.filter(review => {
      if (reviewFilters.rating !== 'all' && review.rating.toString() !== reviewFilters.rating) return false;
      if (reviewFilters.platform !== 'all' && review.platform.toLowerCase() !== reviewFilters.platform) return false;
      if (reviewFilters.status !== 'all' && review.status !== reviewFilters.status) return false;
      if (reviewFilters.verified !== 'all' && review.verified.toString() !== reviewFilters.verified) return false;
      return true;
    });
  };

  // Review Management render functions
  const renderReviewDashboard = () => (
    <div className="space-y-8">
      {/* Review Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {[
          { label: 'Total Reviews', value: reviewStats.totalReviews.toLocaleString(), icon: MessageCircle, color: 'blue' },
          { label: 'Average Rating', value: `${reviewStats.averageRating}/5`, icon: Star, color: 'yellow' },
          { label: 'Response Rate', value: `${reviewStats.responseRate}%`, icon: Reply, color: 'green' },
          { label: 'Pending Reviews', value: reviewStats.pendingReviews, icon: AlertTriangle, color: 'orange' },
          { label: 'This Month', value: reviewStats.thisMonth, icon: Calendar, color: 'purple' }
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 text-center">
            <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600`} />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Rating Distribution */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Rating Distribution</h3>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = Math.floor(Math.random() * 40) + (6 - rating) * 10;
            return (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reviews Preview */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Reviews</h3>
          <button 
            onClick={() => setActiveReviewTab('reviews')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All Reviews →
          </button>
        </div>
        
        <div className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.customerName}</span>
                    {review.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <h6 className="font-medium text-gray-900 mb-1">{review.title}</h6>
                  <p className="text-sm text-gray-600 mb-2">{review.content.substring(0, 100)}...</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{review.product}</span>
                    <span>{review.platform}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  review.status === 'published' ? 'bg-green-100 text-green-800' :
                  review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {review.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewList = () => (
    <div className="space-y-8">
      {/* Filters */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Filter Reviews</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={reviewFilters.rating}
              onChange={(e) => setReviewFilters({...reviewFilters, rating: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select
              value={reviewFilters.platform}
              onChange={(e) => setReviewFilters({...reviewFilters, platform: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Platforms</option>
              <option value="shopify">Shopify</option>
              <option value="google">Google</option>
              <option value="amazon">Amazon</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={reviewFilters.status}
              onChange={(e) => setReviewFilters({...reviewFilters, status: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verified</label>
            <select
              value={reviewFilters.verified}
              onChange={(e) => setReviewFilters({...reviewFilters, verified: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Reviews</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {getFilteredReviews().map((review) => (
          <div key={review.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-900">{review.customerName}</span>
                  {review.verified && <CheckCircle className="w-5 h-5 text-green-500" />}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    review.status === 'published' ? 'bg-green-100 text-green-800' :
                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {review.status}
                  </span>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-3">{review.content}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <span>Product: {review.product}</span>
                  <span>Platform: {review.platform}</span>
                  <span>Date: {review.date}</span>
                  <span className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful} helpful</span>
                  </span>
                </div>

                {review.response && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Your Response:</p>
                    <p className="text-blue-800">{review.response}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button 
                  onClick={() => setResponseForm({...responseForm, reviewId: review.id})}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                  title="Respond"
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleMarkHelpful(review.id)}
                  className="text-green-600 hover:text-green-800 transition-colors p-2"
                  title="Mark Helpful"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleFlagReview(review.id)}
                  className="text-orange-600 hover:text-orange-800 transition-colors p-2"
                  title="Flag Review"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-2"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Response Form */}
            {responseForm.reviewId === review.id && (
              <div className="border-t pt-4">
                <h5 className="font-medium text-gray-900 mb-3">Respond to Review</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                    <select
                      value={responseForm.template}
                      onChange={(e) => {
                        const templates = {
                          'thank-you': 'Thank you for your wonderful review! We\'re thrilled to hear you\'re happy with your purchase.',
                          'apologize': 'We sincerely apologize for the inconvenience. Please contact our support team so we can make this right.',
                          'feedback': 'Thank you for your feedback! We appreciate all input as it helps us improve our products and services.'
                        };
                        setResponseForm({
                          ...responseForm, 
                          template: e.target.value,
                          message: templates[e.target.value] || ''
                        });
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">Select Template</option>
                      <option value="thank-you">Thank You Response</option>
                      <option value="apologize">Apologetic Response</option>
                      <option value="feedback">Feedback Acknowledgment</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                    <textarea
                      value={responseForm.message}
                      onChange={(e) => setResponseForm({...responseForm, message: e.target.value})}
                      placeholder="Write your response to this review..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleRespondToReview}
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all"
                    >
                      Post Response
                    </button>
                    <button
                      onClick={() => setResponseForm({reviewId: '', message: '', template: ''})}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviewManagement = () => {
    const reviewTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'reviews', label: 'All Reviews', icon: MessageCircle },
      { id: 'analytics', label: 'Analytics', icon: TrendingUp }
    ];

    return (
      <div className="space-y-8">
        {/* Review Management Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {reviewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReviewTab(tab.id)}
              className={`px-4 py-3 rounded-t-lg font-medium transition-colors flex items-center space-x-2 touch-manipulation ${
                activeReviewTab === tab.id
                  ? 'bg-yellow-50 text-yellow-700 border-b-2 border-yellow-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Review Management Content */}
        {activeReviewTab === 'dashboard' && renderReviewDashboard()}
        {activeReviewTab === 'reviews' && renderReviewList()}
        {activeReviewTab === 'analytics' && (
          <div className="glass-card p-6 text-center">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Review Analytics</h3>
            <p className="text-gray-600">Detailed review trends, sentiment analysis, and performance metrics coming soon!</p>
          </div>
        )}
      </div>
    );
  };

  // SEO Tools render functions (moved outside for React compatibility)
  const renderSEOAnalyzer = () => (
      <div className="space-y-8">
        {/* SEO Analysis Form */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">SEO Analysis</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL *</label>
                <input
                  type="url"
                  value={seoAnalysisForm.url}
                  onChange={(e) => setSeoAnalysisForm({...seoAnalysisForm, url: e.target.value})}
                  placeholder="https://yourstore.myshopify.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Keyword (optional)</label>
                <input
                  type="text"
                  value={seoAnalysisForm.keyword}
                  onChange={(e) => setSeoAnalysisForm({...seoAnalysisForm, keyword: e.target.value})}
                  placeholder="e.g., wireless headphones"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competitor URL (optional)</label>
                <input
                  type="url"
                  value={seoAnalysisForm.competitor}
                  onChange={(e) => setSeoAnalysisForm({...seoAnalysisForm, competitor: e.target.value})}
                  placeholder="https://competitor.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <button
                onClick={handleSEOAnalysis}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Analyze SEO</span>
              </button>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Complete analysis takes 3-4 seconds
              </p>
            </div>
          </div>
        </div>

        {/* SEO Reports */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">SEO Analysis Reports</h4>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="text-sm border border-gray-300 rounded px-3 py-1">
                <option>All Reports</option>
                <option>Completed</option>
                <option>Analyzing</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {seoReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      report.status === 'completed' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
                    }`} />
                    <div>
                      <h6 className="font-medium text-gray-900">{report.url}</h6>
                      <p className="text-sm text-gray-600">Keyword: {report.keyword}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        report.score >= 90 ? 'text-green-600' : 
                        report.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{report.score}</div>
                      <p className="text-xs text-gray-600">SEO Score</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => alert(`📊 Viewing detailed report for ${report.url}`)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSEOReport(report.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">{report.issues}</div>
                    <p className="text-xs text-gray-600">Issues Found</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{report.suggestions}</div>
                    <p className="text-xs text-gray-600">Suggestions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-600">{report.createdAt}</div>
                    <p className="text-xs text-gray-600">Analyzed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  const renderInternalLinks = () => (
      <div className="space-y-8">
        {/* Link Creation Form */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Create Internal Link</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source URL *</label>
                <input
                  type="text"
                  value={linkBuildingForm.sourceUrl}
                  onChange={(e) => setLinkBuildingForm({...linkBuildingForm, sourceUrl: e.target.value})}
                  placeholder="/products/headphones"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target URL *</label>
                <input
                  type="text"
                  value={linkBuildingForm.targetUrl}
                  onChange={(e) => setLinkBuildingForm({...linkBuildingForm, targetUrl: e.target.value})}
                  placeholder="/collections/audio"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anchor Text</label>
                <input
                  type="text"
                  value={linkBuildingForm.anchorText}
                  onChange={(e) => setLinkBuildingForm({...linkBuildingForm, anchorText: e.target.value})}
                  placeholder="audio collection"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <button
                onClick={handleCreateInternalLink}
                className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">Create Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Internal Links List */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Internal Links</h4>
          
          <div className="space-y-4">
            {internalLinks.map((link) => (
              <div key={link.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        link.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="font-medium text-gray-900">{link.anchorText}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {link.sourceUrl} → {link.targetUrl}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {link.clicks} clicks • Created {link.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleToggleLink(link.id)}
                      className={`transition-colors ${
                        link.status === 'active' 
                          ? 'text-yellow-600 hover:text-yellow-800' 
                          : 'text-green-600 hover:text-green-800'
                      }`}
                      title={link.status === 'active' ? 'Deactivate Link' : 'Activate Link'}
                    >
                      {link.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Link"
                    >
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

  const renderRankTracker = () => (
      <div className="space-y-8">
        {/* Keyword Tracking Form */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Track New Keyword</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keyword *</label>
                <input
                  type="text"
                  value={rankTrackerForm.keyword}
                  onChange={(e) => setRankTrackerForm({...rankTrackerForm, keyword: e.target.value})}
                  placeholder="wireless headphones"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={rankTrackerForm.location}
                    onChange={(e) => setRankTrackerForm({...rankTrackerForm, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Device</label>
                  <select
                    value={rankTrackerForm.device}
                    onChange={(e) => setRankTrackerForm({...rankTrackerForm, device: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <button
                onClick={handleTrackKeyword}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Track Keyword</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tracked Keywords */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Tracked Keywords</h4>
          
          <div className="space-y-4">
            {trackedKeywords.map((keyword) => (
              <div key={keyword.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h6 className="font-medium text-gray-900">{keyword.keyword}</h6>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        keyword.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        keyword.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        keyword.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {keyword.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {keyword.location} • {keyword.device} • Volume: {keyword.volume.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold flex items-center space-x-1 ${
                        keyword.position < keyword.previousPosition ? 'text-green-600' : 
                        keyword.position > keyword.previousPosition ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <span>#{keyword.position}</span>
                        {keyword.position < keyword.previousPosition && <ArrowUpRight className="w-4 h-4" />}
                        {keyword.position > keyword.previousPosition && <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <p className="text-xs text-gray-600">Current Position</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteKeyword(keyword.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Stop Tracking"
                    >
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

  const renderKeywordResearch = () => (
    <div className="space-y-8">
      {/* Keyword Research Form */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Keyword Research</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seed Keyword *</label>
              <input
                type="text"
                value={keywordResearchForm.seedKeyword}
                onChange={(e) => setKeywordResearchForm({...keywordResearchForm, seedKeyword: e.target.value})}
                placeholder="wireless headphones"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={keywordResearchForm.location}
                  onChange={(e) => setKeywordResearchForm({...keywordResearchForm, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={keywordResearchForm.language}
                  onChange={(e) => setKeywordResearchForm({...keywordResearchForm, language: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <button
              onClick={handleKeywordResearch}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span className="font-medium">Research Keywords</span>
            </button>
          </div>
        </div>
      </div>

      {/* Keyword Suggestions */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Keyword Suggestions</h4>
        
        <div className="space-y-4">
          {keywordSuggestions.map((keyword) => (
            <div key={keyword.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h6 className="font-medium text-gray-900">{keyword.keyword}</h6>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>Volume: {keyword.volume.toLocaleString()}</span>
                    <span>CPC: {keyword.cpc}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      keyword.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      keyword.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {keyword.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSiteSpeedMonitor = () => (
    <div className="space-y-8">
      {/* Speed Test Form */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Site Speed Test</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL *</label>
              <input
                type="url"
                value={siteSpeedForm.url}
                onChange={(e) => setSiteSpeedForm({...siteSpeedForm, url: e.target.value})}
                placeholder="https://yourstore.myshopify.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
              <select
                value={siteSpeedForm.device}
                onChange={(e) => setSiteSpeedForm({...siteSpeedForm, device: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <button
              onClick={handleSiteSpeedTest}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Run Speed Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Speed Reports */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Speed Test Results</h4>
        
        <div className="space-y-4">
          {speedReports.map((report) => (
            <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h6 className="font-medium text-gray-900">{report.url}</h6>
                  <p className="text-sm text-gray-600">{report.device} • {report.createdAt}</p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    report.score >= 90 ? 'text-green-600' : 
                    report.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{report.score}</div>
                  <p className="text-xs text-gray-600">Performance Score</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{report.fcp}</div>
                  <p className="text-xs text-gray-600">First Contentful Paint</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{report.lcp}</div>
                  <p className="text-xs text-gray-600">Largest Contentful Paint</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{report.cls}</div>
                  <p className="text-xs text-gray-600">Cumulative Layout Shift</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchemaMarkupGenerator = () => (
    <div className="space-y-8">
      {/* Schema Generation Form */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Generate Schema Markup</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schema Type</label>
              <select
                value={schemaForm.type}
                onChange={(e) => setSchemaForm({...schemaForm, type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Product">Product</option>
                <option value="Article">Article</option>
                <option value="Organization">Organization</option>
                <option value="LocalBusiness">Local Business</option>
                <option value="Review">Review</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={schemaForm.title}
                onChange={(e) => setSchemaForm({...schemaForm, title: e.target.value})}
                placeholder="Product/Article/Business name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={schemaForm.description}
                onChange={(e) => setSchemaForm({...schemaForm, description: e.target.value})}
                placeholder="Brief description for the schema markup"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <button
              onClick={handleGenerateSchema}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Generate Schema</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Schema Markups */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Generated Schema Markups</h4>
        
        <div className="space-y-4">
          {schemaMarkups.map((schema) => (
            <div key={schema.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      {schema.type}
                    </span>
                    <h6 className="font-medium text-gray-900">{schema.title}</h6>
                  </div>
                  <p className="text-sm text-gray-600">
                    {schema.pages} pages • Created {schema.createdAt}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => alert(`📋 Schema markup code for "${schema.title}" would be displayed here`)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View Schema Code"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderImageCompression = () => (
    <div className="space-y-8">
      {/* Image Compression Form */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Image Compression Tool</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImageCompressionForm({...imageCompressionForm, selectedFiles: files});
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  Choose Files
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality (%)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={imageCompressionForm.quality}
                  onChange={(e) => setImageCompressionForm({...imageCompressionForm, quality: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{imageCompressionForm.quality}%</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                <select
                  value={imageCompressionForm.format}
                  onChange={(e) => setImageCompressionForm({...imageCompressionForm, format: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="JPEG">JPEG</option>
                  <option value="PNG">PNG</option>
                  <option value="WebP">WebP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Width (px)</label>
                <input
                  type="number"
                  value={imageCompressionForm.maxWidth}
                  onChange={(e) => setImageCompressionForm({...imageCompressionForm, maxWidth: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Height (px)</label>
                <input
                  type="number"
                  value={imageCompressionForm.maxHeight}
                  onChange={(e) => setImageCompressionForm({...imageCompressionForm, maxHeight: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            {imageCompressionForm.selectedFiles.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Selected Files</h5>
                <p className="text-sm text-blue-700">{imageCompressionForm.selectedFiles.length} images selected</p>
                <ul className="text-xs text-blue-600 mt-2 space-y-1">
                  {imageCompressionForm.selectedFiles.slice(0, 3).map((file, index) => (
                    <li key={index} className="truncate">{file.name}</li>
                  ))}
                  {imageCompressionForm.selectedFiles.length > 3 && (
                    <li>...and {imageCompressionForm.selectedFiles.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
            
            <button
              onClick={handleImageCompression}
              disabled={!imageCompressionForm.selectedFiles.length}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image className="w-5 h-5" />
              <span className="font-medium">Compress Images</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compression History */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Compression History</h4>
        
        <div className="space-y-4">
          {imageCompressions.map((compression) => {
            const savings = ((compression.originalSize - compression.compressedSize) / compression.originalSize * 100).toFixed(1);
            return (
              <div key={compression.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        compression.status === 'completed' ? 'bg-green-100 text-green-800' :
                        compression.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {compression.status}
                      </span>
                      <h6 className="font-medium text-gray-900">{compression.fileName}</h6>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <p>Original: {compression.originalSize}KB</p>
                      <p>Compressed: {compression.compressedSize}KB</p>
                      <p className="text-green-600 font-medium">Saved: {savings}%</p>
                      <p>Quality: {compression.quality}% | {compression.format}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Created {compression.createdAt}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => alert(`💾 Downloading compressed ${compression.fileName}...`)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download Compressed Image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Social Media render functions
  const renderSocialScheduler = () => (
    <div className="space-y-8">
      {/* Post Creation Form */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Create Social Media Post</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Content *</label>
              <textarea
                value={postForm.content}
                onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                placeholder="What's happening? Share your thoughts..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">{postForm.content.length}/280 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platforms *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink' },
                  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue' },
                  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'cyan' }
                ].map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => {
                      const platforms = postForm.platforms.includes(platform.id)
                        ? postForm.platforms.filter(p => p !== platform.id)
                        : [...postForm.platforms, platform.id];
                      setPostForm({...postForm, platforms});
                    }}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                      postForm.platforms.includes(platform.id)
                        ? `border-${platform.color}-500 bg-${platform.color}-50`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <platform.icon className={`w-6 h-6 ${
                      postForm.platforms.includes(platform.id) ? `text-${platform.color}-600` : 'text-gray-500'
                    }`} />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
              <input
                type="text"
                value={postForm.hashtags}
                onChange={(e) => setPostForm({...postForm, hashtags: e.target.value})}
                placeholder="#socialmedia #marketing #shopify"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                <select
                  value={postForm.mediaType}
                  onChange={(e) => setPostForm({...postForm, mediaType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="carousel">Carousel</option>
                  <option value="story">Story</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule (Optional)</label>
                <input
                  type="datetime-local"
                  value={postForm.scheduledTime}
                  onChange={(e) => setPostForm({...postForm, scheduledTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h5 className="font-medium text-pink-900 mb-2">Post Preview</h5>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-800">{postForm.content || 'Your post content will appear here...'}</p>
                {postForm.hashtags && (
                  <p className="text-sm text-blue-600 mt-2">{postForm.hashtags}</p>
                )}
              </div>
              <p className="text-xs text-pink-600 mt-2">
                Will post to: {postForm.platforms.length ? postForm.platforms.join(', ') : 'No platforms selected'}
              </p>
            </div>

            <button
              onClick={handleCreatePost}
              disabled={!postForm.content.trim() || !postForm.platforms.length}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">
                {postForm.scheduledTime ? 'Schedule Post' : 'Publish Now'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Recent Posts</h4>
        
        <div className="space-y-4">
          {socialPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                    <div className="flex space-x-1">
                      {post.platforms.map((platform) => {
                        const PlatformIcon = platform === 'instagram' ? Instagram : 
                                           platform === 'facebook' ? Facebook : Twitter;
                        return (
                          <PlatformIcon key={platform} className="w-4 h-4 text-gray-500" />
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-gray-800 mb-2">{post.content}</p>
                  {post.hashtags && (
                    <p className="text-sm text-blue-600 mb-2">{post.hashtags}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{post.engagement.likes} likes</span>
                    <span>{post.engagement.shares} shares</span>
                    <span>{post.engagement.comments} comments</span>
                    <span>Created {post.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {post.status === 'scheduled' && (
                    <button 
                      onClick={() => handlePublishPost(post.id)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Publish Now"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Post"
                  >
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

  const renderSocialAnalytics = () => (
    <div className="space-y-8">
      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {socialAnalytics.map((platform) => {
          const PlatformIcon = platform.platform === 'Instagram' ? Instagram : 
                             platform.platform === 'Facebook' ? Facebook : Twitter;
          return (
            <div key={platform.platform} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <PlatformIcon className="w-8 h-8 text-gray-700" />
                  <h3 className="text-lg font-semibold">{platform.platform}</h3>
                </div>
                <span className={`text-sm font-medium ${
                  platform.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {platform.growth}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-medium">{platform.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engagement</span>
                  <span className="font-medium">{platform.engagement}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reach</span>
                  <span className="font-medium">{platform.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-medium">{platform.posts}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engagement Metrics */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Engagement Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Followers', value: '26,930', change: '+8.5%', icon: Users },
            { label: 'Avg Engagement', value: '3.4%', change: '+0.3%', icon: BarChart },
            { label: 'Total Reach', value: '81,020', change: '+12%', icon: Eye },
            { label: 'Posts This Month', value: '479', change: '+15%', icon: Calendar }
          ].map((metric) => (
            <div key={metric.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <metric.icon className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
              <p className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Best Performing Posts */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Posts</h4>
        
        <div className="space-y-4">
          {socialPosts.filter(post => post.status === 'published').map((post) => (
            <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{post.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{post.engagement.likes} likes</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <RefreshCw className="w-4 h-4" />
                      <span>{post.engagement.shares} shares</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.engagement.comments} comments</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {((post.engagement.likes + post.engagement.shares + post.engagement.comments) / 100 * 3.2).toFixed(1)}% engagement
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSocialMedia = () => {
    const socialTabs = [
      { id: 'scheduler', label: 'Post Scheduler', icon: Calendar },
      { id: 'analytics', label: 'Analytics', icon: BarChart },
      { id: 'hashtags', label: 'Hashtag Research', icon: Hash }
    ];

    return (
      <div className="space-y-8">
        {/* Social Media Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {socialTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSocialTab(tab.id)}
              className={`px-4 py-3 rounded-t-lg font-medium transition-colors flex items-center space-x-2 touch-manipulation ${
                activeSocialTab === tab.id
                  ? 'bg-pink-50 text-pink-700 border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Social Media Content */}
        {activeSocialTab === 'scheduler' && renderSocialScheduler()}
        {activeSocialTab === 'analytics' && renderSocialAnalytics()}
        {activeSocialTab === 'hashtags' && (
          <div className="glass-card p-6 text-center">
            <Hash className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Hashtag Research Tool</h3>
            <p className="text-gray-600">Advanced hashtag analytics and trending research coming soon!</p>
          </div>
        )}
      </div>
    );
  };

  // SEO Tools main function (placed after sub-functions for proper hoisting)
  const renderSEOTools = () => {
    const seoToolTabs = [
      { id: 'seo-analyzer', label: 'SEO Analyzer', icon: Search },
      { id: 'internal-links', label: 'Internal Link Engine', icon: Globe },
      { id: 'rank-tracker', label: 'Rank Tracker', icon: TrendingUp },
      { id: 'keyword-research', label: 'Keyword Research', icon: Target },
      { id: 'site-speed', label: 'Site Speed Monitor', icon: Activity },
      { id: 'schema-markup', label: 'Schema Markup Generator', icon: Settings },
      { id: 'image-compression', label: 'Image Compression', icon: Image }
    ];

    return (
      <div className="space-y-8">
        {/* SEO Tools Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {seoToolTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSEOTab(tab.id)}
              className={`px-4 py-3 rounded-t-lg font-medium transition-colors flex items-center space-x-2 touch-manipulation ${
                activeSEOTab === tab.id
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* SEO Tool Content */}
        {activeSEOTab === 'seo-analyzer' && renderSEOAnalyzer()}
        {activeSEOTab === 'internal-links' && renderInternalLinks()}
        {activeSEOTab === 'rank-tracker' && renderRankTracker()}
        {activeSEOTab === 'keyword-research' && renderKeywordResearch()}
        {activeSEOTab === 'site-speed' && renderSiteSpeedMonitor()}
        {activeSEOTab === 'schema-markup' && renderSchemaMarkupGenerator()}
        {activeSEOTab === 'image-compression' && renderImageCompression()}
      </div>
    );
  };

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

  // AI Tools state for actual functionality (moved to component level)
  const [selectedCharacter, setSelectedCharacter] = useState('maya');
  const [selectedTrigger, setSelectedTrigger] = useState('exit-intent');
  const [popupForm, setPopupForm] = useState({
    name: '',
    message: '',
    buttonText: 'Get Started',
    discount: '',
    delay: 5
  });
  const [contentForm, setContentForm] = useState({
    type: 'Blog Post',
    topic: '',
    keywords: '',
    tone: 'Professional',
    length: 'Medium'
  });
  const [assistantForm, setAssistantForm] = useState({
    name: '',
    type: 'Support',
    greeting: 'Hi! How can I help you today?',
    language: 'English'
  });
  const [imageForm, setImageForm] = useState({
    prompt: '',
    style: 'Professional',
    dimensions: '1200x1200',
    quality: 'High'
  });

  // AI Tools Section - Fully Functional Implementation
  const renderAITools = () => {

    const aiToolTabs = [
      { id: 'popup-generator', label: 'AI Popup Generator', icon: Bot },
      { id: 'content-writer', label: 'AI Content Writer', icon: PenTool },
      { id: 'chat-assistant', label: 'AI Chat Assistant', icon: MessageSquare },
      { id: 'image-generator', label: 'AI Image Generator', icon: Palette }
    ];

    const aiCharacters = [
      { id: 'alex', name: 'Alex', personality: 'Professional', avatar: '👔', description: 'Business-focused, clear communication' },
      { id: 'maya', name: 'Maya', personality: 'Friendly', avatar: '😊', description: 'Warm, approachable, conversational' },
      { id: 'zoe', name: 'Zoe', personality: 'Playful', avatar: '🎨', description: 'Creative, fun, engaging' },
      { id: 'sage', name: 'Sage', personality: 'Helpful', avatar: '🤓', description: 'Knowledgeable, supportive, detailed' }
    ];

    const triggerTypes = [
      { id: 'exit-intent', name: 'Exit Intent', description: 'Show when user is about to leave', icon: '🚪' },
      { id: 'time-based', name: 'Time Based', description: 'Show after specific time on page', icon: '⏰' },
      { id: 'scroll-based', name: 'Scroll Based', description: 'Show after scrolling percentage', icon: '📜' },
      { id: 'cart-abandonment', name: 'Cart Abandonment', description: 'Show when items added but not purchased', icon: '🛒' }
    ];

  // Functional handlers for actual processing (moved to component level)
  const handleCreatePopup = () => {
    if (!popupForm.name.trim()) {
      alert('Please enter a popup name');
      return;
    }
    
    const aiCharacters = [
      { id: 'alex', name: 'Alex', personality: 'Professional', avatar: '👔', description: 'Business-focused, clear communication' },
      { id: 'maya', name: 'Maya', personality: 'Friendly', avatar: '😊', description: 'Warm, approachable, conversational' },
      { id: 'zoe', name: 'Zoe', personality: 'Playful', avatar: '🎨', description: 'Creative, fun, engaging' },
      { id: 'sage', name: 'Sage', personality: 'Helpful', avatar: '🤓', description: 'Knowledgeable, supportive, detailed' }
    ];
    
    const newCampaign = {
      id: Date.now().toString(),
      name: popupForm.name,
      character: selectedCharacter,
      trigger: selectedTrigger,
      status: 'active' as const,
      performance: { 
        impressions: Math.floor(Math.random() * 1000) + 100, 
        clicks: Math.floor(Math.random() * 100) + 10, 
        conversions: Math.floor(Math.random() * 20) + 2, 
        revenue: Math.floor(Math.random() * 1000) + 100 
      },
      createdAt: new Date().toISOString().split('T')[0],
      config: {
        message: popupForm.message,
        buttonText: popupForm.buttonText,
        discount: popupForm.discount,
        delay: popupForm.delay
      }
    };
    
    setPopupCampaigns([...popupCampaigns, newCampaign]);
    setPopupForm({ name: '', message: '', buttonText: 'Get Started', discount: '', delay: 5 });
    alert(`✅ Popup "${newCampaign.name}" created successfully! Character: ${aiCharacters.find(c => c.id === selectedCharacter)?.name}`);
  };

  const handleGenerateContent = () => {
    if (!contentForm.topic.trim()) {
      alert('Please enter a content topic');
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      type: contentForm.type,
      title: contentForm.topic,
      status: 'in-progress' as const,
      wordCount: Math.floor(Math.random() * 1500) + 500,
      seoScore: Math.floor(Math.random() * 30) + 70,
      createdAt: new Date().toISOString().split('T')[0],
      config: {
        keywords: contentForm.keywords,
        tone: contentForm.tone,
        length: contentForm.length
      }
    };

    setContentProjects([...contentProjects, newProject]);
    
    // Simulate content generation progress
    setTimeout(() => {
      setContentProjects(prev => prev.map(p => 
        p.id === newProject.id ? { ...p, status: 'completed' } : p
      ));
    }, 3000);

    setContentForm({ type: 'Blog Post', topic: '', keywords: '', tone: 'Professional', length: 'Medium' });
    alert(`✅ Content generation started for "${newProject.title}"! It will be ready in a few seconds.`);
  };

  const handleCreateAssistant = () => {
    if (!assistantForm.name.trim()) {
      alert('Please enter an assistant name');
      return;
    }

    const newAssistant = {
      id: Date.now().toString(),
      name: assistantForm.name,
      type: assistantForm.type,
      status: 'active' as const,
      conversations: 0,
      satisfaction: 0,
      responseTime: '0s',
      config: {
        greeting: assistantForm.greeting,
        language: assistantForm.language
      }
    };

    setChatAssistants([...chatAssistants, newAssistant]);
    setAssistantForm({ name: '', type: 'Support', greeting: 'Hi! How can I help you today?', language: 'English' });
    alert(`✅ Chat Assistant "${newAssistant.name}" created and activated!`);
  };

  const handleGenerateImage = () => {
    if (!imageForm.prompt.trim()) {
      alert('Please enter an image description');
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      type: 'Generated Image',
      title: imageForm.prompt,
      status: 'generating' as const,
      dimensions: imageForm.dimensions,
      style: imageForm.style,
      createdAt: new Date().toISOString().split('T')[0],
      config: {
        prompt: imageForm.prompt,
        quality: imageForm.quality
      }
    };

    setImageProjects([...imageProjects, newProject]);
    
    // Simulate image generation
    setTimeout(() => {
      setImageProjects(prev => prev.map(p => 
        p.id === newProject.id ? { ...p, status: 'completed' } : p
      ));
    }, 5000);

    setImageForm({ prompt: '', style: 'Professional', dimensions: '1200x1200', quality: 'High' });
    alert(`✅ Image generation started! "${newProject.title}" will be ready in a few seconds.`);
  };

  const handleEditCampaign = (campaignId: string) => {
    const campaign = popupCampaigns.find(c => c.id === campaignId);
    if (campaign) {
      const newName = prompt('Enter new popup name:', campaign.name);
      if (newName && newName.trim()) {
        setPopupCampaigns(prev => prev.map(c => 
          c.id === campaignId ? { ...c, name: newName.trim() } : c
        ));
        alert(`✅ Campaign updated to "${newName.trim()}"`);
      }
    }
  };

  const handleToggleCampaign = (campaignId: string) => {
    setPopupCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { 
        ...c, 
        status: c.status === 'active' ? 'paused' : 'active' 
      } : c
    ));
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setPopupCampaigns(prev => prev.filter(c => c.id !== campaignId));
      alert('✅ Campaign deleted successfully');
    }
  };

  const handleToggleAssistant = (assistantId: string) => {
    setChatAssistants(prev => prev.map(a => 
      a.id === assistantId ? { 
        ...a, 
        status: a.status === 'active' ? 'inactive' : 'active' 
      } : a
    ));
  };

  const handleDownloadContent = (projectId: string) => {
    const project = contentProjects.find(p => p.id === projectId);
    if (project) {
      alert(`📥 Downloading "${project.title}" (${project.wordCount} words, SEO Score: ${project.seoScore})`);
    }
  };

  const handleViewImage = (projectId: string) => {
    const project = imageProjects.find(p => p.id === projectId);
    if (project) {
      alert(`🖼️ Viewing "${project.title}" (${project.dimensions}, ${project.style} style)`);
    }
  };

    // AI Popup Generator
    const renderPopupGenerator = () => (
      <div className="space-y-8">
        {/* Popup Creation Form */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Create New AI Popup</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Popup Name *</label>
                <input
                  type="text"
                  value={popupForm.name}
                  onChange={(e) => setPopupForm({...popupForm, name: e.target.value})}
                  placeholder="e.g., Holiday Sale Popup"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Popup Message</label>
                <textarea
                  value={popupForm.message}
                  onChange={(e) => setPopupForm({...popupForm, message: e.target.value})}
                  placeholder="Your special offer message..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={popupForm.buttonText}
                    onChange={(e) => setPopupForm({...popupForm, buttonText: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                  <input
                    type="text"
                    value={popupForm.discount}
                    onChange={(e) => setPopupForm({...popupForm, discount: e.target.value})}
                    placeholder="e.g., 15"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  value={popupForm.delay}
                  onChange={(e) => setPopupForm({...popupForm, delay: parseInt(e.target.value)})}
                  min="1"
                  max="60"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* AI Character Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose AI Character</h4>
              <div className="grid grid-cols-2 gap-3">
                {aiCharacters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => setSelectedCharacter(character.id)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedCharacter === character.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{character.avatar}</div>
                      <h5 className="font-medium text-gray-900 text-sm">{character.name}</h5>
                      <p className="text-xs text-purple-600">{character.personality}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Trigger Selection */}
              <h4 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Select Trigger</h4>
              <div className="space-y-2">
                {triggerTypes.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => setSelectedTrigger(trigger.id)}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      selectedTrigger === trigger.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{trigger.icon}</span>
                      <div>
                        <h6 className="font-medium text-gray-900 text-sm">{trigger.name}</h6>
                        <p className="text-xs text-gray-600">{trigger.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreatePopup}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <Bot className="w-5 h-5" />
                <span className="font-medium">Create AI Popup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Active Popup Campaigns</h4>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="text-sm border border-gray-300 rounded px-3 py-1">
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Paused</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {popupCampaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-500' : 
                      campaign.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <h5 className="font-medium text-gray-900">{campaign.name}</h5>
                      <p className="text-sm text-gray-600">{campaign.character} character • {campaign.trigger}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditCampaign(campaign.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit Campaign"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleToggleCampaign(campaign.id)}
                      className={`transition-colors ${
                        campaign.status === 'active' 
                          ? 'text-yellow-600 hover:text-yellow-800' 
                          : 'text-green-600 hover:text-green-800'
                      }`}
                      title={campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                    >
                      {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
      </div>
    );

    // AI Content Writer
    const renderContentWriter = () => (
      <div className="space-y-8">
        {/* Content Generation Form */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Generate AI Content</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={contentForm.type}
                  onChange={(e) => setContentForm({...contentForm, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Blog Post">📝 Blog Post</option>
                  <option value="Product Description">🛍️ Product Description</option>
                  <option value="Meta Description">🔍 Meta Description</option>
                  <option value="Social Media">📱 Social Media</option>
                  <option value="Email Subject">📧 Email Subject</option>
                  <option value="Ad Copy">📢 Ad Copy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic/Title *</label>
                <input
                  type="text"
                  value={contentForm.topic}
                  onChange={(e) => setContentForm({...contentForm, topic: e.target.value})}
                  placeholder="e.g., Best Wireless Headphones for 2024"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (optional)</label>
                <input
                  type="text"
                  value={contentForm.keywords}
                  onChange={(e) => setContentForm({...contentForm, keywords: e.target.value})}
                  placeholder="wireless headphones, bluetooth, audio quality"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={contentForm.tone}
                    onChange={(e) => setContentForm({...contentForm, tone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Casual">Casual</option>
                    <option value="Persuasive">Persuasive</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                  <select
                    value={contentForm.length}
                    onChange={(e) => setContentForm({...contentForm, length: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Short">Short (250-500 words)</option>
                    <option value="Medium">Medium (500-1000 words)</option>
                    <option value="Long">Long (1000+ words)</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateContent}
                className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
              >
                <PenTool className="w-5 h-5" />
                <span className="font-medium">Generate Content</span>
              </button>
            </div>

            {/* Content Templates */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h4>
              <div className="space-y-3">
                {[
                  { name: 'Product Launch Announcement', topic: 'Announcing our new wireless headphones', type: 'Blog Post' },
                  { name: 'Holiday Sale Blog Post', topic: 'Best Holiday Tech Deals 2024', type: 'Blog Post' },
                  { name: 'How-to Guide', topic: 'How to Choose the Perfect Headphones', type: 'Blog Post' },
                  { name: 'Customer Success Story', topic: 'How TechCorp Improved Productivity', type: 'Blog Post' },
                  { name: 'Feature Comparison', topic: 'Wireless vs Wired Headphones Comparison', type: 'Blog Post' },
                  { name: 'Industry Trends', topic: 'Audio Technology Trends in 2024', type: 'Blog Post' }
                ].map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setContentForm({...contentForm, topic: template.topic, type: template.type})}
                    className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
                  >
                    <h6 className="font-medium text-gray-900 text-sm">{template.name}</h6>
                    <p className="text-xs text-gray-600 mt-1">{template.topic}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Projects */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Recent Content Projects</h4>
            <button className="text-blue-600 font-medium text-sm hover:text-blue-700">View All</button>
          </div>

          <div className="space-y-4">
            {contentProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      project.type === 'Blog Post' ? 'bg-blue-100 text-blue-800' :
                      project.type === 'Product Description' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {project.type}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{project.title}</h5>
                      <p className="text-sm text-gray-600">{project.wordCount} words • SEO Score: {project.seoScore}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'completed' ? 'bg-green-500' :
                      project.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <button 
                      onClick={() => alert(`✏️ Editing "${project.title}" - Content editor would open here`)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit Content"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDownloadContent(project.id)}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                      title="Download Content"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Created: {project.createdAt}</span>
                  <span>•</span>
                  <span className="capitalize">{project.status.replace('-', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Templates */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Product Launch Announcement',
              'Holiday Sale Blog Post',
              'How-to Guide Template',
              'Customer Success Story',
              'Feature Comparison',
              'Industry Trends Article'
            ].map((template, index) => (
              <button key={index} className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <h6 className="font-medium text-gray-900 mb-1">{template}</h6>
                <p className="text-sm text-gray-600">Ready-to-use template</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    // AI Chat Assistant
    const renderChatAssistant = () => (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">AI Chat Assistant</h3>
            <p className="text-gray-600">Automate customer support with intelligent chatbots</p>
          </div>
          <button 
            onClick={() => {
              const newAssistant = {
                id: Date.now().toString(),
                name: 'New Chat Assistant',
                type: 'Support',
                status: 'inactive' as const,
                conversations: 0,
                satisfaction: 0,
                responseTime: '0s'
              };
              setChatAssistants([...chatAssistants, newAssistant]);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Assistant</span>
          </button>
        </div>

        {/* Assistant Creation Form */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Create New Assistant</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assistant Name *</label>
                <input
                  type="text"
                  value={assistantForm.name}
                  onChange={(e) => setAssistantForm({...assistantForm, name: e.target.value})}
                  placeholder="e.g., Customer Support Bot"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={assistantForm.type}
                  onChange={(e) => setAssistantForm({...assistantForm, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Support">💬 Customer Support</option>
                  <option value="Sales">🎯 Lead Qualification</option>
                  <option value="Order">📦 Order Assistant</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Greeting Message</label>
                <textarea
                  value={assistantForm.greeting}
                  onChange={(e) => setAssistantForm({...assistantForm, greeting: e.target.value})}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleCreateAssistant}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
              >
                Create Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Active Assistants */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Active Chat Assistants</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="w-4 h-4" />
              <span>Live Status</span>
            </div>
          </div>

          <div className="space-y-4">
            {chatAssistants.map((assistant) => (
              <div key={assistant.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      assistant.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    <div>
                      <h5 className="font-medium text-gray-900">{assistant.name}</h5>
                      <p className="text-sm text-gray-600">{assistant.type} Assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleToggleAssistant(assistant.id)}
                      className={`transition-colors ${
                        assistant.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                      }`}
                      title={assistant.status === 'active' ? 'Deactivate Assistant' : 'Activate Assistant'}
                    >
                      {assistant.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Conversations</p>
                    <p className="font-medium">{assistant.conversations.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Satisfaction</p>
                    <p className="font-medium flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      {assistant.satisfaction}/5
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg Response</p>
                    <p className="font-medium">{assistant.responseTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Configuration */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Configuration Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="font-medium text-gray-900 mb-3">Response Settings</h6>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Speed</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Instant</option>
                    <option>1-2 seconds</option>
                    <option>3-5 seconds</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fallback to Human</span>
                  <button className="w-10 h-6 bg-blue-600 rounded-full p-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h6 className="font-medium text-gray-900 mb-3">Integration</h6>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shopify Integration</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Notifications</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    // AI Image Generator
    const renderImageGenerator = () => (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">AI Image Generator</h3>
            <p className="text-gray-600">Create stunning visuals with AI-powered image generation</p>
          </div>
          <button 
            onClick={() => {
              const newProject = {
                id: Date.now().toString(),
                type: 'Product Image',
                title: 'New Image Project',
                status: 'draft' as const,
                dimensions: '1200x1200',
                style: 'Professional',
                createdAt: new Date().toISOString().split('T')[0]
              };
              setImageProjects([...imageProjects, newProject]);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Image</span>
          </button>
        </div>

        {/* Image Generation Form */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Generate AI Image</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Description *</label>
                <textarea
                  value={imageForm.prompt}
                  onChange={(e) => setImageForm({...imageForm, prompt: e.target.value})}
                  placeholder="e.g., Professional product photo of wireless headphones on white background"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                  <select
                    value={imageForm.style}
                    onChange={(e) => setImageForm({...imageForm, style: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Modern">Modern</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Creative">Creative</option>
                    <option value="Vintage">Vintage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                  <select
                    value={imageForm.dimensions}
                    onChange={(e) => setImageForm({...imageForm, dimensions: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="1200x1200">1200x1200 (Square)</option>
                    <option value="1920x1080">1920x1080 (Landscape)</option>
                    <option value="1080x1920">1080x1920 (Portrait)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <button
                onClick={handleGenerateImage}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
              >
                <Palette className="w-5 h-5" />
                <span className="font-medium">Generate Image</span>
              </button>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Image generation typically takes 3-5 seconds
              </p>
            </div>
          </div>
        </div>

        {/* Generation Settings */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Image Generation Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Professional</option>
                <option>Modern</option>
                <option>Minimalist</option>
                <option>Creative</option>
                <option>Vintage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>1200x1200 (Square)</option>
                <option>1920x1080 (Landscape)</option>
                <option>1080x1920 (Portrait)</option>
                <option>1200x630 (Social)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>High (Slow)</option>
                <option>Medium (Balanced)</option>
                <option>Fast (Quick)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Recent Image Projects</h4>
            <button className="text-blue-600 font-medium text-sm hover:text-blue-700">View Gallery</button>
          </div>

          <div className="space-y-4">
            {imageProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Palette className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{project.title}</h5>
                      <p className="text-sm text-gray-600">{project.type} • {project.dimensions} • {project.style}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'completed' ? 'bg-green-500' :
                      project.status === 'generating' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    <button 
                      onClick={() => alert(`💾 Downloading "${project.title}" - Image file would download here`)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleViewImage(project.id)}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                      title="View Image"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Created: {project.createdAt}</span>
                  <span>•</span>
                  <span className="capitalize">{project.status}</span>
                  {project.status === 'generating' && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Style Gallery */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Style Gallery</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Professional', 'Modern', 'Minimalist', 'Creative', 'Vintage', 'Artistic',
              'Corporate', 'Playful', 'Elegant', 'Bold', 'Soft', 'Dynamic'
            ].map((style, index) => (
              <button key={index} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 hover:from-blue-100 hover:to-purple-100 transition-all">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <p className="text-xs font-medium text-gray-700">{style}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    const renderAITabContent = () => {
      switch (activeAITab) {
        case 'popup-generator':
          return renderPopupGenerator();
        case 'content-writer':
          return renderContentWriter();
        case 'chat-assistant':
          return renderChatAssistant();
        case 'image-generator':
          return renderImageGenerator();
        default:
          return renderPopupGenerator();
      }
    };

    return (
      <div className="space-y-8">
        {/* AI Tools Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Tools Dashboard</h2>
              <p className="text-gray-600">Comprehensive AI-powered tools for your Shopify store</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">AI Services Online</span>
            </div>
          </div>

          {/* AI Tools Tab Navigation */}
          <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {aiToolTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAITab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeAITab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* AI Tool Content */}
        {renderAITabContent()}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'ai-tools':
        return renderAITools();
      case 'seo-tools':
        return renderSEOTools();
      case 'social-media':
        return renderSocialMedia();
      case 'review-management':
        return renderReviewManagement();
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navigationTabs.slice(0, 4).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center py-2 px-1 text-xs transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="truncate">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
          {/* More Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center py-2 px-1 text-xs transition-colors ${
              mobileMenuOpen
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="truncate">More</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className={`${
        sidebarCollapsed ? 'w-16' : 'w-72'
      } bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 ${
        mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'
      } lg:block lg:relative`}>
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
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                if (window.innerWidth < 1024) {
                  setMobileMenuOpen(false);
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (window.innerWidth < 1024) {
                    setMobileMenuOpen(false);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg transition-all touch-manipulation ${
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
      <div className="lg:flex lg:flex-1">
        <div className="flex-1 flex flex-col lg:ml-0"
             style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (sidebarCollapsed ? '64px' : '288px') : '0' }}>
                  {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {navigationTabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    {activeTab === 'dashboard' ? 'Store performance overview and metrics' : 
                     `Manage your ${navigationTabs.find(tab => tab.id === activeTab)?.label.toLowerCase()}`}
                  </p>
                </div>
              </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">techstore.myshopify.com</span>
              </div>
              
              <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>
              
              <button className="flex items-center space-x-2 p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation">
                <User className="w-5 h-5" />
                <span className="hidden md:block text-sm">Sarah Chen</span>
              </button>
            </div>
          </div>
        </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-auto pb-20 lg:pb-6">
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

      {/* Mobile More Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-16 bg-white border-t border-gray-200 z-40 lg:hidden">
          <div className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 p-4">
                             {navigationTabs.slice(4).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumShopifyDashboard;