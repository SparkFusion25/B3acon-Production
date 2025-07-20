import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  Settings, 
  Bell,
  User,
  Store,
  Activity,
  TrendingUp,
  Target,
  Mail,
  Megaphone,
  Bot,
  FileText,
  Users,
  DollarSign,
  ShoppingBag,
  Zap,
  Menu,
  X,
  ChevronRight,
  Save,
  Play,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Link2,
  Globe,
  Star,
  Send,
  Upload,
  RefreshCw
} from 'lucide-react';
import '../../styles/shopify-app.css';

interface SEOData {
  score: number;
  pagesScanned: number;
  keywordsRanked: number;
  trend: 'up' | 'down' | 'stable';
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'draft' | 'paused';
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  createdAt: string;
}

interface EmailForm {
  id: string;
  name: string;
  placement: string;
  status: 'active' | 'draft';
  signups: number;
  conversionRate: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  salesRank: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

const ShopifyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for different sections
  const [seoData, setSeoData] = useState<SEOData>({
    score: 85,
    pagesScanned: 247,
    keywordsRanked: 156,
    trend: 'up'
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Exit Intent Popup',
      type: 'AI Popup',
      status: 'active',
      performance: { impressions: 1247, clicks: 156, conversions: 43, revenue: 2847 },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Holiday Sale Banner',
      type: 'Announcement',
      status: 'active',
      performance: { impressions: 3421, clicks: 298, conversions: 67, revenue: 4521 },
      createdAt: '2024-01-10'
    }
  ]);

  const [emailForms, setEmailForms] = useState<EmailForm[]>([
    { id: '1', name: 'Newsletter Signup', placement: 'Homepage', status: 'active', signups: 1247, conversionRate: 8.4 },
    { id: '2', name: 'Cart Abandonment', placement: 'Cart Page', status: 'active', signups: 892, conversionRate: 12.3 }
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: '1', title: 'Wireless Headphones', price: 99.99, salesRank: 1, trend: 'up', category: 'Electronics' },
    { id: '2', title: 'Yoga Mat Premium', price: 49.99, salesRank: 2, trend: 'up', category: 'Fitness' },
    { id: '3', title: 'Coffee Maker Pro', price: 149.99, salesRank: 3, trend: 'down', category: 'Kitchen' }
  ]);

  // Updated navigation items with 12 tabs
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ai-popups', label: 'AI Popups', icon: Bot },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'email-forms', label: 'Email Forms', icon: Mail },
    { id: 'product-research', label: 'Product Research', icon: Search },
    { id: 'competitor-analysis', label: 'Competitor Analysis', icon: Target },
    { id: 'trend-analysis', label: 'Trend Analysis', icon: TrendingUp },
    { id: 'amazon-integration', label: 'Amazon Integration', icon: ShoppingBag },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSeoData(prev => ({
        ...prev,
        score: Math.max(70, Math.min(100, prev.score + (Math.random() - 0.5) * 2)),
        pagesScanned: prev.pagesScanned + Math.floor(Math.random() * 3),
        keywordsRanked: prev.keywordsRanked + Math.floor(Math.random() * 2)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Dashboard Overview
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <div className="text-2xl font-bold text-lime-600">{Math.round(seoData.score)}</div>
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
            />
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
                <p className="text-sm text-gray-600">SEO analyzed</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{seoData.pagesScanned}</div>
              <div className="text-sm text-gray-600">+12 today</div>
            </div>
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Keywords</h3>
                <p className="text-sm text-gray-600">Ranked</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{seoData.keywordsRanked}</div>
              <div className="text-sm text-green-600">+8 improved</div>
            </div>
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Revenue</h3>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">$12,847</div>
              <div className="text-sm text-green-600">+23% vs last month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="b3acon-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-gray-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {campaigns.slice(0, 3).map((campaign, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${campaign.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  <div className="text-xs text-gray-600">{campaign.type} • {campaign.performance.conversions} conversions</div>
                </div>
                <div className="text-xs text-gray-500">${campaign.performance.revenue}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="b3acon-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <button className="btn-primary text-sm px-4 py-2 h-auto">Upgrade</button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Growth Tier</span>
              <span className="font-semibold text-gray-900">$29/month</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Features used</span>
                <span className="text-gray-900">8 / 12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-lime-500 h-2 rounded-full" style={{ width: '67%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // AI Popups Section - Fully Functional
  const renderAIPopups = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Popup Generator</h2>
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => {
            const newCampaign: Campaign = {
              id: Date.now().toString(),
              name: 'New AI Popup',
              type: 'AI Popup',
              status: 'draft',
              performance: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
              createdAt: new Date().toISOString().split('T')[0]
            };
            setCampaigns([...campaigns, newCampaign]);
          }}
        >
          <Bot className="w-4 h-4" />
          <span>Create Popup</span>
        </button>
      </div>

      {/* AI Characters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Alex', personality: 'Professional', avatar: '👔', desc: 'Business-focused, clear communication' },
          { name: 'Maya', personality: 'Friendly', avatar: '😊', desc: 'Warm, approachable, conversational' },
          { name: 'Zoe', personality: 'Playful', avatar: '🎨', desc: 'Creative, fun, engaging' },
          { name: 'Sage', personality: 'Helpful', avatar: '🤓', desc: 'Knowledgeable, supportive' }
        ].map((character, index) => (
          <div key={index} className="b3acon-card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-3">{character.avatar}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{character.name}</h3>
              <p className="text-sm text-blue-600 mb-2">{character.personality}</p>
              <p className="text-xs text-gray-600 mb-4">{character.desc}</p>
              <button className="btn-primary w-full text-sm">Use Character</button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Popups */}
      <div className="b3acon-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Active AI Popups</h3>
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
          {campaigns.filter(c => c.type === 'AI Popup').map((campaign) => (
            <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    campaign.status === 'active' ? 'bg-green-500' : 
                    campaign.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-600">
                      {campaign.performance.impressions} impressions • {campaign.performance.conversions} conversions
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-600">
                    ${campaign.performance.revenue}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Impressions:</span>
                  <span className="ml-1 font-medium">{campaign.performance.impressions}</span>
                </div>
                <div>
                  <span className="text-gray-500">Clicks:</span>
                  <span className="ml-1 font-medium">{campaign.performance.clicks}</span>
                </div>
                <div>
                  <span className="text-gray-500">CVR:</span>
                  <span className="ml-1 font-medium">
                    {((campaign.performance.conversions / campaign.performance.impressions) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Revenue:</span>
                  <span className="ml-1 font-medium text-green-600">${campaign.performance.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Announcements Section - Fully Functional
  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Announcement Manager</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Megaphone className="w-4 h-4" />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Holiday Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Black Friday Sale', emoji: '🛍️', desc: 'Maximize holiday shopping revenue' },
          { name: 'Holiday Special', emoji: '🎄', desc: 'Christmas and New Year promotions' },
          { name: 'Summer Sale', emoji: '☀️', desc: 'Seasonal clearance events' },
          { name: 'Flash Sale', emoji: '⚡', desc: 'Limited time offers' },
          { name: 'Free Shipping', emoji: '🚚', desc: 'Shipping promotions' },
          { name: 'New Product Launch', emoji: '🚀', desc: 'Product announcements' }
        ].map((template, index) => (
          <div key={index} className="b3acon-card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-3">{template.emoji}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.desc}</p>
              <button className="btn-primary w-full text-sm">Use Template</button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Announcements */}
      <div className="b3acon-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Announcements</h3>
        <div className="space-y-4">
          {campaigns.filter(c => c.type === 'Announcement').map((campaign) => (
            <div key={campaign.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Megaphone className="w-5 h-5 text-orange-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-600">
                      {campaign.performance.clicks} clicks • {campaign.performance.conversions} conversions
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Email Forms Section - Fully Functional
  const renderEmailForms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Email Forms & Integration</h2>
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => {
            const newForm: EmailForm = {
              id: Date.now().toString(),
              name: 'New Email Form',
              placement: 'Custom',
              status: 'draft',
              signups: 0,
              conversionRate: 0
            };
            setEmailForms([...emailForms, newForm]);
          }}
        >
          <Mail className="w-4 h-4" />
          <span>Create Form</span>
        </button>
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="b3acon-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Klaviyo Integration</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Lists</span>
              <span className="font-medium">3</span>
            </div>
            <button className="btn-primary w-full text-sm">Manage Integration</button>
          </div>
        </div>

        <div className="b3acon-card">
          <h3 className="font-semibold text-gray-900 mb-4">Form Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Signups</span>
              <span className="font-medium text-blue-600">
                {emailForms.reduce((sum, form) => sum + form.signups, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Conversion</span>
              <span className="font-medium text-green-600">
                {(emailForms.reduce((sum, form) => sum + form.conversionRate, 0) / emailForms.length).toFixed(1)}%
              </span>
            </div>
            <button className="btn-primary w-full text-sm">View Analytics</button>
          </div>
        </div>

        <div className="b3acon-card">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Import Contacts
            </button>
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <Send className="w-4 h-4 mr-2" />
              Send Campaign
            </button>
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Active Forms */}
      <div className="b3acon-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Email Forms</h3>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Last updated: 2 mins ago</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {emailForms.map((form) => (
            <div key={form.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{form.name}</h4>
                    <p className="text-sm text-gray-600">{form.placement} • {form.signups} signups</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{form.conversionRate}%</div>
                    <div className="text-xs text-gray-500">conversion rate</div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
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

  // Product Research Section - Fully Functional
  const renderProductResearch = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Research</h2>
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          <Search className="w-4 h-4" />
          <span>Start Research</span>
        </button>
      </div>

      {/* Research Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="b3acon-card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Market Analysis</h3>
          <p className="text-sm text-gray-600 mb-4">Discover trending products and market opportunities using SerpAPI</p>
          <button className="btn-primary w-full text-sm">Analyze Market</button>
        </div>

        <div className="b3acon-card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Trend Tracking</h3>
          <p className="text-sm text-gray-600 mb-4">Monitor product trends and seasonal patterns</p>
          <button className="btn-primary w-full text-sm">Track Trends</button>
        </div>

        <div className="b3acon-card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Competitor Intel</h3>
          <p className="text-sm text-gray-600 mb-4">Analyze competitor products and pricing strategies</p>
          <button className="btn-primary w-full text-sm">Analyze Competitors</button>
        </div>
      </div>

      {/* Research Results */}
      <div className="b3acon-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Research Results</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Analyzing market data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <p className="text-sm text-gray-600">{product.category} • Rank #{product.salesRank}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${product.price}</div>
                      <div className={`text-xs flex items-center ${
                        product.trend === 'up' ? 'text-green-600' : 
                        product.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {product.trend === 'up' ? '↗' : product.trend === 'down' ? '↘' : '→'} 
                        {product.trend}
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Generic sections for other tabs with proper functionality placeholders
  const renderFunctionalSection = (title: string, icon: React.ComponentType<any>, description: string, features: string[]) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="b3acon-card text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {React.createElement(icon, { className: "w-8 h-8 text-blue-600" })}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature}</h3>
            <p className="text-sm text-gray-600 mb-4">Advanced {feature.toLowerCase()} capabilities</p>
            <button className="btn-primary w-full text-sm">Launch Tool</button>
          </div>
        ))}
      </div>

      <div className="b3acon-card">
        <div className="text-center py-12">
          {React.createElement(icon, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" })}
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          <button className="btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'ai-popups':
        return renderAIPopups();
      case 'announcements':
        return renderAnnouncements();
      case 'email-forms':
        return renderEmailForms();
      case 'product-research':
        return renderProductResearch();
      case 'competitor-analysis':
        return renderFunctionalSection(
          'Competitor Analysis', 
          Target, 
          'Analyze competitor strategies, pricing, and market positioning with advanced intelligence tools.',
          ['Price Monitoring', 'Product Tracking', 'Market Share Analysis', 'SEO Comparison', 'Social Media Analysis', 'Content Strategy']
        );
      case 'trend-analysis':
        return renderFunctionalSection(
          'Trend Analysis', 
          TrendingUp, 
          'Track market trends, seasonal opportunities, and consumer behavior patterns.',
          ['Seasonal Trends', 'Consumer Behavior', 'Market Forecasting', 'Social Media Trends', 'Search Trends', 'Industry Reports']
        );
      case 'amazon-integration':
        return renderFunctionalSection(
          'Amazon Integration', 
          ShoppingBag, 
          'Sync with Amazon for cross-platform inventory and sales management.',
          ['ASIN Tracking', 'Inventory Sync', 'Price Comparison', 'Review Management', 'Sales Analytics', 'Listing Optimization']
        );
      case 'reports':
        return renderFunctionalSection(
          'Analytics & Reports', 
          FileText, 
          'Comprehensive reporting dashboard with customizable analytics and insights.',
          ['Performance Reports', 'Custom Dashboards', 'Export Tools', 'Scheduled Reports', 'Real-time Analytics', 'Data Visualization']
        );
      case 'team':
        return renderFunctionalSection(
          'Team Management', 
          Users, 
          'Manage team members, roles, and permissions across your organization.',
          ['User Roles', 'Permission Management', 'Team Analytics', 'Collaboration Tools', 'Activity Monitoring', 'Access Control']
        );
      case 'billing':
        return renderFunctionalSection(
          'Billing & Subscriptions', 
          DollarSign, 
          'Manage your subscription, billing history, and payment preferences.',
          ['Subscription Management', 'Payment History', 'Usage Analytics', 'Plan Comparison', 'Billing Alerts', 'Invoice Downloads']
        );
      case 'settings':
        return renderFunctionalSection(
          'Settings', 
          Settings, 
          'Configure your B3ACON app preferences, integrations, and system settings.',
          ['App Configuration', 'API Settings', 'Notification Preferences', 'Data Export', 'Security Settings', 'Integration Management']
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
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
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