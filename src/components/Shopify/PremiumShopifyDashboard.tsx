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
  Package,
  Copy,
  Upload,
  Send,
  Reply,
  AlertTriangle,
  Bookmark,
  Share,
  Link,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Camera,
  FileText,
  Folder,
  Save,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  BarChart,
  PieChart,
  LineChart,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  Key,
  Code,
  Terminal,
  Cpu,
  HardDrive,
  Network,
  Wifi,
  Bluetooth,
  Phone,
  Video,
  Headphones,
  Mic,
  Speaker,
  VolumeX,
  Volume2,
  Power,
  Battery,
  Sun,
  Moon,
  MapPin,
  Navigation,
  Compass,
  Map,
  Route,
  Car,
  Plane,
  Train,
  Bike,
  Truck,
  Ship,
  Home,
  Building,
  Building2,
  School,
  Hospital,
  Church,
  Store as StoreIcon,
  ShoppingCart,
  CreditCard,
  Wallet,
  Receipt,
  Tag,
  Gift,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Diamond,
  Scissors,
  PaintBucket,
  Brush,
  Pen,
  Pencil,
  Eraser,
  Ruler,
  Calculator,
  Clipboard,
  FileImage,
  FileVideo,
  FileAudio,
  FilePlus,
  FileMinus,
  FileSearch,
  FileCheck,
  FileX,
  FolderPlus,
  FolderMinus,
  FolderOpen,
  Archive,
  Trash,
  Recycle,
  Inbox,
  Outbox,
  MailOpen,
  MailPlus,
  MailMinus,
  MailCheck,
  MailX,
  Flag,
  Bookmark as BookmarkIcon,
  Hash,
  AtSign,
  Percent,
  DollarSign as DollarSignIcon,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  CreditCard as CreditCardIcon,
  Banknote,
  HandCoins,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  BarChart2,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
  Pulse,
  Crosshair,
  MousePointer,
  Move,
  Maximize,
  Minimize,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile,
  Meh,
  Frown,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Handshake,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users as UsersIcon,
  UserCircle,
  Eye as EyeIcon,
  EyeOff,
  Search as SearchIcon,
  Zap as ZapIcon
} from 'lucide-react';

import '../../styles/premium-design-system.css';
import useShopifyData from '../../hooks/useShopifyData';

// Enhanced UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Sidebar Components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface MetricData {
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface RealtimeMetric {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: React.ComponentType<any>;
}

interface ActivityItem {
  id: string;
  type: 'sale' | 'visitor' | 'review' | 'campaign';
  message: string;
  time: string;
  amount?: string;
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  type: string;
  performance: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

const PremiumShopifyDashboard: React.FC = () => {
  const { metrics, products, orders, keywordRankings, emailCampaigns, shopInfo, isLoading, error, fetchAllData, refreshProducts, refreshOrders, refreshSEO, refreshEmail } = useShopifyData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAITool, setSelectedAITool] = useState('popup-generator');
  const [selectedSEOTool, setSelectedSEOTool] = useState('seo-analyzer');
  const [selectedSocialTool, setSelectedSocialTool] = useState('scheduler');
  const [selectedReviewTab, setSelectedReviewTab] = useState('dashboard');

  // Dashboard enhancement data
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetric[]>([
    { label: 'Live Visitors', value: '47', change: '+12%', color: 'green', icon: Eye },
    { label: 'Cart Value', value: '$127', change: '+8%', color: 'blue', icon: ShoppingBag },
    { label: 'Conversion', value: '3.4%', change: '+0.3%', color: 'purple', icon: Target },
    { label: 'Revenue/hr', value: '$890', change: '+15%', color: 'emerald', icon: DollarSign }
  ]);

  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Black Friday Early Bird',
      status: 'active',
      type: 'Popup Campaign',
      performance: { views: 15420, clicks: 2340, conversions: 187, revenue: 12450 }
    },
    {
      id: '2', 
      name: 'Abandoned Cart Recovery',
      status: 'active',
      type: 'Email Series',
      performance: { views: 8760, clicks: 1240, conversions: 94, revenue: 7830 }
    },
    {
      id: '3',
      name: 'First-Time Visitor Welcome',
      status: 'paused',
      type: 'AI Chat',
      performance: { views: 12340, clicks: 890, conversions: 67, revenue: 4290 }
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([
    { id: '1', type: 'sale', message: 'New order #3847 from Sarah M.', time: '2 min ago', amount: '$127.50' },
    { id: '2', type: 'visitor', message: '12 new visitors from Google Ads', time: '5 min ago' },
    { id: '3', type: 'review', message: 'New 5-star review for Wireless Headphones', time: '8 min ago' },
    { id: '4', type: 'campaign', message: 'AI Popup generated 3 new leads', time: '12 min ago' },
    { id: '5', type: 'sale', message: 'Bulk order #3846 from TechCorp Inc.', time: '15 min ago', amount: '$2,340.00' }
  ]);

  // Simple render functions for all sections - preserving existing functionality
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'premium-widgets':
        return renderPremiumWidgets();
      case 'ai-tools':
        return renderAITools();
      case 'seo-tools':
        return renderSEOTools();
      case 'social-media':
        return renderSocialMedia();
      case 'review-management':
        return renderReviewManagement();
      case 'email-marketing':
        return renderEmailMarketing();
      case 'content-creation':
        return renderContentCreation();
      case 'product-research':
        return renderProductResearch();
      case 'analytics-reports':
        return renderAnalyticsReports();
      case 'creative-studio':
        return renderCreativeStudio();
      case 'integrations':
        return renderIntegrations();
      case 'team-management':
        return renderTeamManagement();
      case 'billing-plans':
        return renderBillingPlans();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  // Enhanced Dashboard Overview
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 mb-6">Welcome back! Here's what's happening with your store.</p>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {realtimeMetrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-elegant">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-sm text-${metric.color}-600 mt-1`}>{metric.change}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary/10">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Campaigns */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${campaign.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-gray-600">{campaign.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${campaign.performance.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{campaign.performance.conversions} conversions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Premium Widgets Section
  const renderPremiumWidgets = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-elegant">
        <CardHeader>
          <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
            Premium Widgets Marketplace
          </CardTitle>
          <CardDescription>
            AI-powered widgets to supercharge your store conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "AI Smart Shopper Assistant™", price: "$29/month", description: "NLP-powered search with voice support" },
              { name: "Dynamic Conversion Predictor™", price: "$19/month", description: "Behavioral prediction scoring" },
              { name: "Bundle Builder + Smart Discount", price: "$25/month", description: "Gamified bundle creation" },
              { name: "Story-Style Product Viewer™", price: "$22/month", description: "Instagram-style showcases" },
              { name: "Live Inventory Pulse Meter™", price: "$12/month", description: "Real-time scarcity messaging" }
            ].map((widget, index) => (
              <Card key={index} className="hover:shadow-premium transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{widget.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{widget.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{widget.price}</span>
                    <Button size="sm" className="bg-gradient-primary">Install</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Placeholder render functions for all other sections
  const renderAITools = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">AI Tools</h2>
      <p className="text-gray-600">AI-powered automation tools for your store</p>
    </div>
  );

  const renderSEOTools = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">SEO Tools</h2>
      <p className="text-gray-600">Search engine optimization and ranking tools</p>
    </div>
  );

  const renderSocialMedia = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Social Media</h2>
      <p className="text-gray-600">Social media management and scheduling</p>
    </div>
  );

  const renderReviewManagement = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Review Management</h2>
      <p className="text-gray-600">Manage and respond to customer reviews</p>
    </div>
  );

  const renderEmailMarketing = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Email Marketing</h2>
      <p className="text-gray-600">Email campaigns and automation with Klaviyo integration</p>
    </div>
  );

  const renderContentCreation = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Content Creation</h2>
      <p className="text-gray-600">AI-powered content generation tools</p>
    </div>
  );

  const renderProductResearch = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Product Research</h2>
      <p className="text-gray-600">Market analysis and product insights</p>
    </div>
  );

  const renderAnalyticsReports = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Analytics & Reports</h2>
      <p className="text-gray-600">Performance tracking and detailed reporting</p>
    </div>
  );

  const renderCreativeStudio = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Creative Studio</h2>
      <p className="text-gray-600">Asset management and design tools</p>
    </div>
  );

  const renderIntegrations = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Integrations</h2>
      <p className="text-gray-600">Connect with third-party services and APIs</p>
    </div>
  );

  const renderTeamManagement = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Team Management</h2>
      <p className="text-gray-600">Manage team members and permissions</p>
    </div>
  );

  const renderBillingPlans = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Billing & Plans</h2>
      <p className="text-gray-600">Subscription management and billing information</p>
    </div>
  );

  const renderSettings = () => (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p className="text-gray-600">App configuration and preferences</p>
    </div>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex w-full">
        {/* Debug: Force visible sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r z-50 p-4">
          <div className="text-lg font-bold text-blue-600 mb-4">B3ACON Debug</div>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="block w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('premium-widgets')}
              className="block w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Premium Widgets
            </button>
            <button 
              onClick={() => setActiveTab('ai-tools')}
              className="block w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              AI Tools
            </button>
          </div>
        </div>
        <AppSidebar userRole="user" activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 flex flex-col ml-64">
          {/* Enhanced Premium Top Header */}
          <header className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 sm:px-6 py-4 shadow-elegant sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />
                <div>
                  <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {activeTab === 'dashboard' ? 'Dashboard Overview' : 
                     activeTab === 'premium-widgets' ? 'Premium Widgets' :
                     activeTab === 'ai-tools' ? 'AI Tools' :
                     activeTab === 'seo-tools' ? 'SEO Tools' :
                     activeTab === 'social-media' ? 'Social Media' :
                     activeTab === 'review-management' ? 'Review Management' :
                     activeTab === 'email-marketing' ? 'Email Marketing' :
                     activeTab === 'content-creation' ? 'Content Creation' :
                     activeTab === 'product-research' ? 'Product Research' :
                     activeTab === 'analytics-reports' ? 'Analytics & Reports' :
                     activeTab === 'creative-studio' ? 'Creative Studio' :
                     activeTab === 'integrations' ? 'Integrations' :
                     activeTab === 'team-management' ? 'Team Management' :
                     activeTab === 'billing-plans' ? 'Billing & Plans' :
                     activeTab === 'settings' ? 'Settings' : 'Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {activeTab === 'dashboard' ? 'Store performance overview and metrics' : 
                     `Manage your ${activeTab.replace('-', ' ')}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-green-100 rounded-lg px-3 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">All Systems Operational</span>
                </div>
                
                <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-700">{shopInfo?.domain || 'demo-store.myshopify.com'}</span>
                </div>
                
                {/* Live Data Refresh Button */}
                <Button 
                  onClick={fetchAllData}
                  disabled={isLoading}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="Refresh live data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden md:block ml-2">Refresh</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive">
                    3
                  </Badge>
                </Button>
              </div>
            </div>
          </header>

          {/* Enhanced Main Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-600">Loading dashboard data...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">⚠️ Error Loading Data</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={fetchAllData} className="bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};