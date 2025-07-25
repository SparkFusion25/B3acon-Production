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
  
  const [activeTab, setActiveTab] = useState('overview');
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

  // Premium Widgets Data - All 10 Widgets
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [premiumWidgets] = useState([
    {
      id: "ai-shopper-assistant",
      name: "AI Smart Shopper Assistant™",
      description: "NLP-powered search with voice support",
      icon: Bot,
      category: "AI Tools",
      pricing: "$29/month",
      monthlyPrice: 29,
      features: ["Natural Language Search", "Voice Search Support", "Upsell & Bundle Logic", "FAQ Integration", "Custom Avatar & Tone"],
      isActive: false,
      isNew: true,
      isPro: true,
      performance: { conversions: 156, revenue: 4680, impressions: 12400, ctr: 8.4 }
    },
    {
      id: "conversion-predictor",
      name: "Dynamic Conversion Predictor™ Badge",
      description: "Behavioral prediction scoring",
      icon: Target,
      category: "Conversion",
      pricing: "$19/month",
      monthlyPrice: 19,
      features: ["Real-time Behavior Analysis", "Personalized Match Scoring", "Customizable Badge Design", "A/B Testing", "Performance Analytics"],
      isActive: true,
      isPro: true,
      performance: { conversions: 234, revenue: 7020, impressions: 18600, ctr: 12.6 }
    },
    {
      id: "product-explainer",
      name: "Interactive Product Explainer Widget",
      description: "3D views and animated callouts",
      icon: Eye,
      category: "Product Display",
      pricing: "$15/month",
      monthlyPrice: 15,
      features: ["3D Product Views", "Animated Callouts", "Media Integration", "Hover & Click Triggers", "Mobile Optimized"],
      isActive: false,
      performance: { conversions: 89, revenue: 2670, impressions: 8900, ctr: 6.7 }
    },
    {
      id: "bundle-builder",
      name: "Bundle Builder + Smart Discount Flow",
      description: "Gamified bundle creation",
      icon: Package,
      category: "Sales Tools",
      pricing: "$25/month",
      monthlyPrice: 25,
      features: ["Drag & Drop Interface", "Auto-discount Logic", "Savings Calculator", "Progress Indicators", "Free Gift Triggers"],
      isActive: true,
      isPro: true,
      performance: { conversions: 312, revenue: 9360, impressions: 15600, ctr: 15.8 }
    },
    {
      id: "story-viewer",
      name: "Story-Style Product Viewer™",
      description: "Instagram-style product showcases",
      icon: Play,
      category: "Social Commerce",
      pricing: "$22/month",
      monthlyPrice: 22,
      features: ["Instagram-style Interface", "Feature Showcases", "Review Integration", "Live CTAs", "Mobile-first Design"],
      isActive: false,
      isNew: true,
      performance: { conversions: 178, revenue: 5340, impressions: 11200, ctr: 9.2 }
    },
    {
      id: "inventory-pulse",
      name: "Live Inventory Pulse Meter™",
      description: "Real-time scarcity messaging",
      icon: BarChart3,
      category: "Urgency Tools",
      pricing: "$12/month",
      monthlyPrice: 12,
      features: ["Real-time Inventory Sync", "Animated Progress Bars", "Scarcity Messaging", "Purchase Analytics", "Auto-updates"],
      isActive: true,
      performance: { conversions: 445, revenue: 13350, impressions: 22300, ctr: 18.9 }
    },
    {
      id: "exit-intent",
      name: "Intent-Aware Exit Flow™",
      description: "Personalized exit-intent popups",
      icon: MousePointer,
      category: "Retention",
      pricing: "$18/month",
      monthlyPrice: 18,
      features: ["Exit Intent Detection", "Personalized Offers", "Product History Analysis", "Smart Triggers", "Conversion Tracking"],
      isActive: false,
      isPro: true,
      performance: { conversions: 267, revenue: 8010, impressions: 16800, ctr: 13.4 }
    },
    {
      id: "ugc-collector",
      name: "1-Click UGC Collector™",
      description: "Post-purchase content collection",
      icon: Camera,
      category: "Content Generation",
      pricing: "$20/month",
      monthlyPrice: 20,
      features: ["Auto-trigger System", "Incentive Management", "UGC Dashboard", "Photo & Video Support", "Store Credit Integration"],
      isActive: true,
      isNew: true,
      performance: { conversions: 189, revenue: 5670, impressions: 9450, ctr: 14.7 }
    },
    {
      id: "heatmap-trail",
      name: "Smart Heatmap Shopper Trail",
      description: "Click/scroll behavior analytics",
      icon: Activity,
      category: "Analytics",
      pricing: "$35/month",
      monthlyPrice: 35,
      features: ["Click Tracking", "Scroll Behavior", "Device Filtering", "Visitor Segmentation", "Optimization Insights"],
      isActive: false,
      isPro: true,
      performance: { conversions: 0, revenue: 0, impressions: 45600, ctr: 0 }
    },
    {
      id: "cart-booster",
      name: "AI Cart Booster Prompt™",
      description: "NLP-powered cart suggestions",
      icon: ShoppingCart,
      category: "AI Tools",
      pricing: "$24/month",
      monthlyPrice: 24,
      features: ["NLP-powered Suggestions", "Cart Analysis", "Bundle Recommendations", "Behavioral Targeting", "Smart Prompts"],
      isActive: true,
      isPro: true,
      performance: { conversions: 398, revenue: 11940, impressions: 19900, ctr: 16.8 }
    }
  ]);

  const categories = ["All", "AI Tools", "Conversion", "Product Display", "Sales Tools", "Social Commerce", "Urgency Tools", "Retention", "Content Generation", "Analytics"];
  const activeWidgets = premiumWidgets.filter(w => w.isActive);
  const totalMonthlySpend = activeWidgets.reduce((sum, w) => sum + w.monthlyPrice, 0);

  // Convert live metrics to dashboard format
  const dashboardMetrics = [
    {
      title: "Total Revenue",
      value: `$${(metrics?.totalRevenue || 24650).toLocaleString()}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
    },
    {
      title: "Active Widgets",
      value: activeWidgets.length.toString(),
      change: `$${totalMonthlySpend}/month`,
      trend: 'up' as const,
      icon: Zap,
    },
    {
      title: "Conversion Rate",
      value: `${(metrics?.conversionRate || 6.8).toFixed(1)}%`,
      change: '+0.4%',
      trend: 'up' as const,
      icon: Target,
    },
    {
      title: "Monthly Revenue",
      value: `$${Math.round((metrics?.totalRevenue || 24650) / 12).toLocaleString()}`,
      change: '+18.2%',
      trend: 'up' as const,
      icon: TrendingUp,
    }
  ];

  // Main Dashboard Render - Restored Original Structure
  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Store Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">B3</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-blue-600">
                B3ACON Premium Dashboard
              </h1>
              <p className="text-gray-600">
                Store: {shopInfo?.domain || 'Loading...'} • {activeWidgets.length} Active Widgets • ${totalMonthlySpend}/month
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            All Systems Operational
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchAllData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm text-green-600">{metric.change}</span>
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <metric.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Tabs - Original System */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur shadow-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="widgets">Premium Widgets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats & Active Widgets Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Active Premium Widgets
                  </CardTitle>
                  <CardDescription>
                    Widgets currently generating revenue for your store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeWidgets.slice(0, 5).map((widget) => (
                      <div key={widget.id} className="flex items-center justify-between p-4 rounded-lg border bg-white/50">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <widget.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{widget.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-700">Active</Badge>
                              <span className="text-sm text-gray-500">{widget.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${widget.performance.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{widget.performance.conversions} conversions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Performance Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Widgets:</span>
                      <span className="font-medium">{premiumWidgets.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active:</span>
                      <span className="font-medium text-green-600">{activeWidgets.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monthly Spend:</span>
                      <span className="font-medium">${totalMonthlySpend}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ROI:</span>
                      <span className="font-medium text-blue-600">
                        {Math.round((activeWidgets.reduce((sum, w) => sum + (w.performance?.revenue || 0), 0) / Math.max(totalMonthlySpend, 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-blue-600 text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* All 10 Premium Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumWidgets
              .filter(widget => selectedCategory === 'All' || widget.category === selectedCategory)
              .map((widget) => (
                <Card key={widget.id} className="border-0 shadow-lg bg-white/80 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <widget.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{widget.name}</h3>
                          <div className="flex items-center gap-2">
                            {widget.isNew && <Badge variant="secondary" className="bg-blue-100 text-blue-700">New</Badge>}
                            {widget.isPro && <Badge variant="secondary" className="bg-purple-100 text-purple-700">Pro</Badge>}
                            <Badge variant={widget.isActive ? 'default' : 'secondary'} className="bg-green-100 text-green-700">
                              {widget.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{widget.pricing}</p>
                        <p className="text-xs text-gray-500">{widget.category}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{widget.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {widget.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {widget.performance && widget.isActive && (
                      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500">Conversions</p>
                          <p className="font-semibold">{widget.performance.conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Revenue</p>
                          <p className="font-semibold">${widget.performance.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Switch checked={widget.isActive} />
                      <Button size="sm" variant="outline" className="flex-1">
                        {widget.isActive ? 'Configure' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Performance insights and widget analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Analytics charts coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Widget Marketplace</h2>
            <p className="text-gray-600 mb-6">Discover more AI-powered widgets to boost your store performance</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>Configure global settings for all widgets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auto-optimization</label>
                  <p className="text-sm text-gray-500">Automatically optimize widget performance</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Analytics Tracking</label>
                  <p className="text-sm text-gray-500">Track detailed widget analytics</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Mobile Optimization</label>
                  <p className="text-sm text-gray-500">Optimize widgets for mobile devices</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Simple content switching for sidebar navigation
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'overview':
      case 'widgets':
      case 'analytics':
      case 'marketplace':
      case 'settings':
        return renderMainDashboard();
      case 'premium-widgets':
        return renderMainDashboard(); // Will show widgets tab
      default:
        return renderMainDashboard();
    }
  };

  // Removed all the old placeholder sections
  const renderPremiumWidgets = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">
            Premium Widgets Marketplace
          </CardTitle>
          <CardDescription>
            AI-powered widgets to supercharge your store conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "AI Smart Shopper Assistant™", price: "$29/month", description: "NLP-powered search with voice support", features: ["Natural Language Search", "Voice Support", "Upsell Logic"] },
              { name: "Dynamic Conversion Predictor™", price: "$19/month", description: "Behavioral prediction scoring", features: ["Behavioral Analysis", "Purchase Likelihood", "Smart Badges"] },
              { name: "Bundle Builder + Smart Discount", price: "$25/month", description: "Gamified bundle creation", features: ["Bundle Logic", "Smart Discounts", "Gamification"] },
              { name: "Story-Style Product Viewer™", price: "$22/month", description: "Instagram-style showcases", features: ["Story Format", "Swipe Navigation", "Social Proof"] },
              { name: "Live Inventory Pulse Meter™", price: "$12/month", description: "Real-time scarcity messaging", features: ["Live Inventory", "Scarcity Messages", "FOMO Triggers"] }
            ].map((widget, index) => (
              <Card key={index} className="border shadow-md hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{widget.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{widget.description}</p>
                  <ul className="text-xs text-gray-500 mb-4 space-y-1">
                    {widget.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{widget.price}</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Install</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // AI Tools Section
  const renderAITools = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">AI Tools</CardTitle>
          <CardDescription>AI-powered automation tools for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "AI Popup Generator", description: "Smart popups with 4 AI characters", status: "Active", conversions: 234 },
              { name: "AI Content Writer", description: "Blog posts and product descriptions", status: "Active", conversions: 156 },
              { name: "AI Chat Assistant", description: "Customer support automation", status: "Paused", conversions: 89 },
              { name: "AI Image Generator", description: "Product and marketing images", status: "Active", conversions: 312 }
            ].map((tool, index) => (
              <Card key={index} className="border shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{tool.name}</h3>
                    <Badge variant={tool.status === 'Active' ? 'default' : 'secondary'}>
                      {tool.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{tool.conversions} conversions</span>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSEOTools = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">SEO Tools</CardTitle>
          <CardDescription>Search engine optimization and ranking tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "SEO Analyzer", description: "Analyze your store's SEO performance", score: 85, status: "Good" },
              { name: "Keyword Tracker", description: "Track keyword rankings", keywords: 24, rank: 3.2 },
              { name: "Site Speed Monitor", description: "Monitor page load speeds", speed: "2.1s", score: 92 },
              { name: "Schema Generator", description: "Generate structured data", schemas: 12, status: "Active" }
            ].map((tool, index) => (
              <Card key={index} className="border shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {tool.score && `Score: ${tool.score}%`}
                      {tool.keywords && `${tool.keywords} keywords tracked`}
                      {tool.speed && `Load time: ${tool.speed}`}
                      {tool.schemas && `${tool.schemas} schemas active`}
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSocialMedia = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Social Media</CardTitle>
          <CardDescription>Social media management and scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Facebook</h3>
                <p className="text-sm text-gray-600 mb-4">Connected • 1.2K followers</p>
                <Button size="sm" className="w-full">Manage Posts</Button>
              </CardContent>
            </Card>
            <Card className="border shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Instagram</h3>
                <p className="text-sm text-gray-600 mb-4">Connected • 2.8K followers</p>
                <Button size="sm" className="w-full">Manage Posts</Button>
              </CardContent>
            </Card>
            <Card className="border shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Twitter</h3>
                <p className="text-sm text-gray-600 mb-4">Not connected</p>
                <Button size="sm" variant="outline" className="w-full">Connect</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewManagement = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Review Management</CardTitle>
          <CardDescription>Manage and respond to customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { customer: "Sarah M.", rating: 5, comment: "Amazing product! Fast shipping.", time: "2 hours ago", responded: false },
              { customer: "John D.", rating: 4, comment: "Good quality, would recommend.", time: "1 day ago", responded: true },
              { customer: "Lisa K.", rating: 5, comment: "Exactly what I was looking for!", time: "3 days ago", responded: true },
              { customer: "Mike R.", rating: 3, comment: "Decent product, could be better.", time: "1 week ago", responded: false }
            ].map((review, index) => (
              <Card key={index} className="border shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{review.customer}</h3>
                    <div className="flex items-center gap-1">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{review.time}</span>
                    {!review.responded ? (
                      <Button size="sm">Respond</Button>
                    ) : (
                      <Badge variant="secondary">Responded</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmailMarketing = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Email Marketing</CardTitle>
          <CardDescription>Email campaigns and automation with Klaviyo integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emailCampaigns.map((campaign, index) => (
              <Card key={index} className="border shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Sent</p>
                      <p className="font-semibold">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Opened</p>
                      <p className="font-semibold">{campaign.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Clicked</p>
                      <p className="font-semibold">{campaign.clicked.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="font-semibold">${campaign.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-4">View Campaign</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
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
        <AppSidebar userRole="user" activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 flex flex-col">
          {/* Premium Dashboard Header */}
          <header className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 sm:px-6 py-4 shadow-elegant sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />
                <div>
                  <h2 className="text-xl font-bold text-blue-600">
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
                  <Bell className="w-4 w-4" />
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

export default PremiumShopifyDashboard;