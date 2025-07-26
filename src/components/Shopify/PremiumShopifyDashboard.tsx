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
  const [premiumWidgets, setPremiumWidgets] = useState([
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

  // Handler Functions for All Buttons and Actions
  const handleWidgetToggle = (widgetId: string) => {
    setPremiumWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, isActive: !widget.isActive }
          : widget
      )
    );
    alert(`Widget ${widgetId} ${premiumWidgets.find(w => w.id === widgetId)?.isActive ? 'deactivated' : 'activated'} successfully!`);
  };

  const handleWidgetConfigure = (widgetName: string) => {
    alert(`Opening configuration for ${widgetName}...\n\nThis would open a detailed configuration modal with:\n• Widget settings\n• Display options\n• Trigger conditions\n• Performance tracking`);
  };

  const handleInstallWidget = (widgetName: string) => {
    alert(`Installing ${widgetName}...\n\nThis would:\n• Add widget to your store\n• Configure initial settings\n• Start trial period\n• Enable performance tracking`);
  };

  const handleAIToolConfigure = (toolName: string) => {
    switch(toolName) {
      case 'AI Popup Generator':
        alert(`Configuring AI Popup Generator...\n\n✅ Features to configure:\n• Choose AI character (Assistant, Expert, Friend, Advisor)\n• Set popup triggers (exit intent, time delay, scroll %)\n• Customize messages and offers\n• A/B testing settings`);
        break;
      case 'AI Content Writer':
        alert(`Configuring AI Content Writer...\n\n✅ Features to configure:\n• Blog post templates\n• Product description styles\n• SEO optimization settings\n• Brand voice and tone\n• Content approval workflow`);
        break;
      case 'AI Chat Assistant':
        alert(`Configuring AI Chat Assistant...\n\n✅ Features to configure:\n• Customer support flows\n• FAQ database\n• Escalation rules\n• Response templates\n• Integration with help desk`);
        break;
      case 'AI Image Generator':
        alert(`Configuring AI Image Generator...\n\n✅ Features to configure:\n• Image styles and templates\n• Brand guidelines\n• Auto-generation rules\n• Product image templates\n• Social media formats`);
        break;
      default:
        alert(`Opening configuration for ${toolName}...`);
    }
  };

  const handleSEOAction = (action: string, toolName: string) => {
    switch(action) {
      case 'analyze':
        alert(`Starting SEO Analysis for ${toolName}...\n\n🔍 Analyzing:\n• Meta titles and descriptions\n• Header structure (H1-H6)\n• Image alt tags\n• Internal linking\n• Page speed\n• Mobile optimization\n\nResults will be available in 2-3 minutes.`);
        break;
      case 'track':
        alert(`Setting up keyword tracking...\n\n📊 Features:\n• Add target keywords\n• Monitor ranking positions\n• Track competitor rankings\n• Historical performance\n• Ranking alerts`);
        break;
      case 'optimize':
        alert(`Starting speed optimization...\n\n⚡ Optimizing:\n• Image compression\n• Code minification\n• Caching setup\n• CDN configuration\n• Database optimization`);
        break;
      case 'generate':
        alert(`Generating schema markup...\n\n📋 Available schemas:\n• Product schema\n• Review schema\n• Organization schema\n• Breadcrumb schema\n• FAQ schema`);
        break;
      default:
        alert(`Executing ${action} for ${toolName}...`);
    }
  };

  const handleSocialMediaAction = (platform: string, action: string) => {
    switch(action) {
      case 'manage':
        alert(`Opening ${platform} management...\n\n📱 Features:\n• Schedule posts\n• View analytics\n• Manage comments\n• Create campaigns\n• Track engagement`);
        break;
      case 'connect':
        alert(`Connecting to ${platform}...\n\nThis would:\n• Open OAuth flow\n• Request necessary permissions\n• Store connection tokens\n• Sync account data\n• Enable posting capabilities`);
        break;
      default:
        alert(`Executing ${action} for ${platform}...`);
    }
  };

  const handleEmailAction = (action: string, campaignName?: string) => {
    switch(action) {
      case 'create':
        alert(`Creating new email campaign...\n\n📧 Campaign builder:\n• Choose template\n• Design email\n• Set audience\n• Schedule send\n• Track performance`);
        break;
      case 'view':
        alert(`Opening ${campaignName} campaign...\n\n📊 Campaign details:\n• Performance metrics\n• Audience insights\n• A/B test results\n• Revenue attribution\n• Optimization suggestions`);
        break;
      case 'edit':
        alert(`Editing ${campaignName}...\n\n✏️ Edit options:\n• Update content\n• Modify audience\n• Change schedule\n• A/B testing\n• Performance optimization`);
        break;
      default:
        alert(`Executing ${action} for email marketing...`);
    }
  };

  const handleContentAction = (action: string, type: string) => {
    switch(action) {
      case 'generate':
        if (type === 'blog') {
          alert(`Generating blog post...\n\n✍️ Blog generator:\n• Enter topic/keywords\n• Choose writing style\n• Set word count\n• SEO optimization\n• Auto-publish option`);
        } else {
          alert(`Generating product description...\n\n🛍️ Description generator:\n• Product features\n• Target audience\n• Tone and style\n• SEO keywords\n• Multiple variations`);
        }
        break;
      case 'create':
        alert(`Creating ${type}...\n\n📝 Content creator:\n• Rich text editor\n• Template library\n• SEO suggestions\n• Preview modes\n• Publishing workflow`);
        break;
      default:
        alert(`Executing ${action} for ${type}...`);
    }
  };

  const handleResearchAction = (action: string) => {
    switch(action) {
      case 'start':
        alert(`Starting product research...\n\n🔍 Research tools:\n• Market trend analysis\n• Competitor research\n• Demand validation\n• Profit calculators\n• Supplier database\n• Risk assessment`);
        break;
      case 'analyze':
        alert(`Analyzing market trends...\n\n📈 Analysis includes:\n• Search volume trends\n• Seasonal patterns\n• Competition levels\n• Price analysis\n• Growth potential`);
        break;
      default:
        alert(`Executing ${action} for product research...`);
    }
  };

  const handleStudioAction = (action: string) => {
    switch(action) {
      case 'open':
        alert(`Opening Creative Studio...\n\n🎨 Studio features:\n• Asset library\n• Design templates\n• Image editor\n• Brand guidelines\n• Collaboration tools\n• Export options`);
        break;
      case 'upload':
        alert(`Opening file uploader...\n\n📁 Upload features:\n• Drag & drop files\n• Bulk upload\n• Auto-organization\n• Format conversion\n• Compression\n• Metadata tagging`);
        break;
      default:
        alert(`Executing ${action} for creative studio...`);
    }
  };

  const handleIntegrationAction = (integration: string, action: string) => {
    switch(action) {
      case 'configure':
        alert(`Configuring ${integration} integration...\n\n⚙️ Configuration:\n• API settings\n• Data sync options\n• Webhook setup\n• Field mapping\n• Security settings`);
        break;
      case 'test':
        alert(`Testing ${integration} connection...\n\n🧪 Testing:\n• API connectivity\n• Data flow\n• Error handling\n• Performance\n• Security validation\n\nConnection test successful! ✅`);
        break;
      case 'disconnect':
        alert(`Disconnecting ${integration}...\n\n⚠️ This will:\n• Remove API access\n• Stop data sync\n• Disable features\n• Archive existing data\n\nAre you sure you want to disconnect?`);
        break;
      default:
        alert(`Executing ${action} for ${integration}...`);
    }
  };

  const handleTeamAction = (action: string, memberName?: string) => {
    switch(action) {
      case 'invite':
        alert(`Inviting team member...\n\n👥 Invitation process:\n• Enter email address\n• Select role/permissions\n• Set access levels\n• Send invitation\n• Track acceptance`);
        break;
      case 'edit':
        alert(`Editing ${memberName}...\n\n✏️ Edit options:\n• Change role\n• Update permissions\n• Modify access levels\n• Update profile\n• Reset password`);
        break;
      case 'remove':
        alert(`Removing ${memberName}...\n\n⚠️ This will:\n• Revoke access\n• Remove permissions\n• Archive activity\n• Send notification\n\nConfirm removal?`);
        break;
      default:
        alert(`Executing ${action} for team management...`);
    }
  };

  const handleBillingAction = (action: string, plan?: string) => {
    switch(action) {
      case 'manage':
        alert(`Opening billing management...\n\n💳 Billing features:\n• View invoices\n• Update payment method\n• Download receipts\n• Usage reports\n• Subscription details`);
        break;
      case 'upgrade':
        alert(`Upgrading to ${plan}...\n\n🚀 Upgrade benefits:\n• More features\n• Higher limits\n• Priority support\n• Advanced analytics\n• White-label options`);
        break;
      case 'cancel':
        alert(`Canceling subscription...\n\n⚠️ Cancellation:\n• Access until period end\n• Data export option\n• Feedback collection\n• Retention offers\n• Confirmation required`);
        break;
      default:
        alert(`Executing ${action} for billing...`);
    }
  };

  const handleSettingsAction = (action: string, setting?: string) => {
    switch(action) {
      case 'save':
        alert(`Saving settings...\n\n✅ Settings saved:\n• Auto-optimization: Enabled\n• Analytics tracking: Enabled\n• Mobile optimization: Enabled\n• Notifications: Updated\n• Security: Enhanced`);
        break;
      case 'reset':
        alert(`Resetting settings...\n\n🔄 This will:\n• Restore defaults\n• Clear customizations\n• Reset preferences\n• Maintain data\n\nConfirm reset?`);
        break;
      case 'export':
        alert(`Exporting data...\n\n📊 Export options:\n• Analytics data\n• Customer data\n• Product data\n• Campaign data\n• Settings backup`);
        break;
      default:
        alert(`Executing ${action} for settings...`);
    }
  };

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

      {/* Mobile Optimized Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-3 sm:px-0">
        {dashboardMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">{metric.title}</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold truncate">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <span className="text-xs sm:text-sm text-green-600">{metric.change}</span>
                    <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 text-green-600" />
                    <span className="text-xs text-gray-500 hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-100 mt-2 sm:mt-0 self-end sm:self-auto">
                  <metric.icon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
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
                       <Switch 
                         checked={widget.isActive} 
                         onCheckedChange={() => handleWidgetToggle(widget.id)}
                       />
                       <Button 
                         size="sm" 
                         variant="outline" 
                         className="flex-1"
                         onClick={() => handleWidgetConfigure(widget.name)}
                       >
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
              
              <div className="flex gap-3">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleSettingsAction('save')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSettingsAction('reset')}
                >
                  Reset to Default
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSettingsAction('export')}
                >
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Individual render functions for each section
  const renderAITools = () => (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-600">AI Tools</CardTitle>
          <CardDescription className="text-sm sm:text-base">AI-powered automation tools for your store</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "AI Popup Generator", description: "Smart popups with 4 AI characters", status: "Active", conversions: 234 },
              { name: "AI Content Writer", description: "Blog posts and product descriptions", status: "Active", conversions: 156 },
              { name: "AI Chat Assistant", description: "Customer support automation", status: "Paused", conversions: 89 },
              { name: "AI Image Generator", description: "Product and marketing images", status: "Active", conversions: 312 }
            ].map((tool, index) => (
              <Card key={index} className="border shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                    <h3 className="font-semibold text-sm sm:text-base">{tool.name}</h3>
                    <Badge variant={tool.status === 'Active' ? 'default' : 'secondary'} className="text-xs self-start sm:self-auto">
                      {tool.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">{tool.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs sm:text-sm text-gray-500">{tool.conversions} conversions</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAIToolConfigure(tool.name)}
                      className="text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Configure
                    </Button>
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
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-600">SEO Tools</CardTitle>
          <CardDescription className="text-sm sm:text-base">Search engine optimization and ranking tools</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {[
              { name: "SEO Analyzer", description: "Analyze your store's SEO performance", score: 85, status: "Good", action: "analyze" },
              { name: "Keyword Tracker", description: "Track keyword rankings", keywords: 24, rank: 3.2, action: "track" },
              { name: "Site Speed Monitor", description: "Monitor page load speeds", speed: "2.1s", score: 92, action: "optimize" },
              { name: "Schema Generator", description: "Generate structured data", schemas: 12, status: "Active", action: "generate" }
            ].map((tool, index) => (
              <Card key={index} className="border shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">{tool.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">{tool.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                    <div className="text-xs sm:text-sm text-gray-500">
                      {tool.score && `Score: ${tool.score}%`}
                      {tool.keywords && `${tool.keywords} keywords tracked`}
                      {tool.speed && `Load time: ${tool.speed}`}
                      {tool.schemas && `${tool.schemas} schemas active`}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSEOAction(tool.action, tool.name)}
                      className="text-xs sm:text-sm w-full sm:w-auto"
                    >
                      {tool.action === 'analyze' ? 'Analyze' : 
                       tool.action === 'track' ? 'Track Keywords' :
                       tool.action === 'optimize' ? 'Optimize' : 'Generate'}
                    </Button>
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
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-600">Social Media</CardTitle>
          <CardDescription className="text-sm sm:text-base">Social media management and scheduling</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border shadow-md">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Facebook</h3>
                <p className="text-sm text-gray-600 mb-3 sm:mb-4">Connected • 1.2K followers</p>
                <Button 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                  onClick={() => handleSocialMediaAction('Facebook', 'manage')}
                >
                  Manage Posts
                </Button>
              </CardContent>
            </Card>
            <Card className="border shadow-md">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Instagram</h3>
                <p className="text-sm text-gray-600 mb-3 sm:mb-4">Connected • 2.8K followers</p>
                <Button 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                  onClick={() => handleSocialMediaAction('Instagram', 'manage')}
                >
                  Manage Posts
                </Button>
              </CardContent>
            </Card>
            <Card className="border shadow-md">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Twitter</h3>
                <p className="text-sm text-gray-600 mb-3 sm:mb-4">Not connected</p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-xs sm:text-sm" 
                  className="w-full"
                  onClick={() => handleSocialMediaAction('Twitter', 'connect')}
                >
                  Connect
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmailMarketing = () => (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-blue-600">Email Marketing</CardTitle>
              <CardDescription className="text-sm sm:text-base">Email campaigns and automation with Klaviyo integration</CardDescription>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              onClick={() => handleEmailAction('create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="text-sm">New Campaign</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {emailCampaigns.map((campaign, index) => (
              <Card key={index} className="border shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                    <h3 className="font-semibold text-sm sm:text-base">{campaign.name}</h3>
                    <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="text-xs self-start sm:self-auto">
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Sent</p>
                      <p className="font-semibold text-sm sm:text-base">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Opened</p>
                      <p className="font-semibold text-sm sm:text-base">{campaign.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Clicked</p>
                      <p className="font-semibold text-sm sm:text-base">{campaign.clicked.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Revenue</p>
                      <p className="font-semibold text-sm sm:text-base">${campaign.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => handleEmailAction('view', campaign.name)}
                    >
                      View Campaign
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="flex-1"
                      onClick={() => handleEmailAction('edit', campaign.name)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentCreation = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Content Creation</CardTitle>
          <CardDescription>AI-powered content generation tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Blog Post Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create SEO-optimized blog posts</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleContentAction('generate', 'blog')}
                >
                  Generate Post
                </Button>
              </CardContent>
            </Card>
            <Card className="border shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Product Descriptions</h3>
                <p className="text-sm text-gray-600 mb-4">AI-generated product descriptions</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleContentAction('generate', 'description')}
                >
                  Create Description
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductResearch = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Product Research</CardTitle>
          <CardDescription>Market analysis and product insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Product Research Tools</h2>
            <p className="text-gray-600 mb-6">Analyze market trends and discover winning products</p>
            <div className="flex gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleResearchAction('start')}
              >
                Start Research
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleResearchAction('analyze')}
              >
                Analyze Trends
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCreativeStudio = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Creative Studio</CardTitle>
          <CardDescription>Asset management and design tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Creative Studio</h2>
            <p className="text-gray-600 mb-6">Manage your creative assets and design templates</p>
            <div className="flex gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleStudioAction('open')}
              >
                Open Studio
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleStudioAction('upload')}
              >
                Upload Assets
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrations = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Integrations</CardTitle>
          <CardDescription>Connect with third-party services and APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Shopify", status: "Connected", description: "Store data and products" },
              { name: "Klaviyo", status: "Connected", description: "Email marketing automation" },
              { name: "Google Analytics", status: "Pending", description: "Track website performance" }
            ].map((integration, index) => (
              <Card key={index} className="border shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{integration.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                      {integration.status}
                    </Badge>
                    <div className="flex gap-2">
                      {integration.status === 'Connected' ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleIntegrationAction(integration.name, 'configure')}
                          >
                            Configure
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleIntegrationAction(integration.name, 'test')}
                          >
                            Test
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleIntegrationAction(integration.name, 'configure')}
                        >
                          Setup
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamManagement = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Team Management</CardTitle>
          <CardDescription>Manage team members and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center py-6">
              <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Team Management</h2>
              <p className="text-gray-600 mb-6">Invite team members and manage their access</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleTeamAction('invite')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
            
            {/* Current Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "John Smith", role: "Admin", email: "john@example.com", status: "Active" },
                { name: "Sarah Johnson", role: "Editor", email: "sarah@example.com", status: "Active" },
                { name: "Mike Wilson", role: "Viewer", email: "mike@example.com", status: "Pending" }
              ].map((member, index) => (
                <Card key={index} className="border shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{member.role}</Badge>
                          <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTeamAction('edit', member.name)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTeamAction('remove', member.name)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingPlans = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Billing & Plans</CardTitle>
          <CardDescription>Subscription management and billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center py-6">
              <CreditCard className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Current Plan: Pro</h2>
              <p className="text-gray-600 mb-6">Manage your subscription and billing information</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleBillingAction('manage')}
              >
                Manage Billing
              </Button>
            </div>
            
            {/* Available Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Starter", price: "$29/month", features: ["5 Widgets", "Basic Analytics", "Email Support"], current: false },
                { name: "Pro", price: "$99/month", features: ["Unlimited Widgets", "Advanced Analytics", "Priority Support", "Team Management"], current: true },
                { name: "Enterprise", price: "$299/month", features: ["White Label", "Custom Integrations", "Dedicated Support", "Advanced Security"], current: false }
              ].map((plan, index) => (
                <Card key={index} className={`border shadow-md ${plan.current ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {plan.current && <Badge className="mb-2">Current Plan</Badge>}
                      <p className="text-2xl font-bold text-blue-600 mb-4">{plan.price}</p>
                      <ul className="text-sm text-gray-600 space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i}>• {feature}</li>
                        ))}
                      </ul>
                      {plan.current ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleBillingAction('cancel')}
                        >
                          Cancel Plan
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleBillingAction('upgrade', plan.name)}
                        >
                          Upgrade to {plan.name}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Content switching for sidebar navigation
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderMainDashboard();
      case 'widgets':
        return renderMainDashboard(); // Will show widgets tab
      case 'analytics':
        return renderMainDashboard(); // Will show analytics tab
      case 'marketplace':
        return renderMainDashboard(); // Will show marketplace tab
      case 'settings':
        return renderMainDashboard(); // Will show settings tab
      case 'ai-tools':
        return renderAITools();
      case 'seo-tools':
        return renderSEOTools();
      case 'social-media':
        return renderSocialMedia();
      case 'email-marketing':
        return renderEmailMarketing();
      case 'content-creation':
        return renderContentCreation();
      case 'product-research':
        return renderProductResearch();
      case 'creative-studio':
        return renderCreativeStudio();
      case 'integrations':
        return renderIntegrations();
      case 'team-management':
        return renderTeamManagement();
      case 'billing-plans':
        return renderBillingPlans();
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

  // Main Dashboard Content Area
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 flex flex-col">
          {/* Mobile Optimized Header */}
          <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-40 shadow-elegant">
            <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-blue-600 truncate">
                    {activeTab === 'overview' ? 'Dashboard Overview' :
                     activeTab === 'widgets' ? 'Premium Widgets' :
                     activeTab === 'analytics' ? 'Analytics' :
                     activeTab === 'marketplace' ? 'Marketplace' :
                     activeTab === 'settings' ? 'Settings' :
                     activeTab === 'ai-tools' ? 'AI Tools' :
                     activeTab === 'seo-tools' ? 'SEO Tools' :
                     activeTab === 'social-media' ? 'Social Media' :
                     activeTab === 'email-marketing' ? 'Email Marketing' :
                     activeTab === 'content-creation' ? 'Content Creation' :
                     activeTab === 'product-research' ? 'Product Research' :
                     activeTab === 'creative-studio' ? 'Creative Studio' :
                     activeTab === 'integrations' ? 'Integrations' :
                     activeTab === 'team-management' ? 'Team Management' :
                     activeTab === 'billing-plans' ? 'Billing & Plans' :
                     'Dashboard'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {shopInfo?.domain || 'Loading store information...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Badge variant="secondary" className="bg-green-100 text-green-700 hidden sm:flex">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="hidden md:inline">All Systems Operational</span>
                  <span className="md:hidden">Online</span>
                </Badge>
                <div className="w-2 h-2 bg-green-500 rounded-full sm:hidden"></div>
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {error && (
              <div className="max-w-7xl mx-auto p-3 sm:p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <h3 className="text-red-800 font-medium text-sm sm:text-base">⚠️ Error Loading Data</h3>
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PremiumShopifyDashboard;
