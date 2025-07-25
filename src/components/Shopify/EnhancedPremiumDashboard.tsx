import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Bot, 
  DollarSign, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Zap,
  Globe,
  Star,
  ArrowUpRight,
  Plus,
  Settings,
  Target,
  Eye,
  Package,
  Play,
  MousePointer,
  Camera,
  Activity,
  ShoppingCart,
  RefreshCw,
  Download,
  Edit
} from 'lucide-react';
import useShopifyData from '../../hooks/useShopifyData';
import { toast } from 'react-hot-toast';

interface PremiumWidget {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: any;
  category: string;
  pricing: string;
  monthlyPrice: number;
  features: string[];
  isActive: boolean;
  isNew?: boolean;
  isPro?: boolean;
  performance?: {
    conversions: number;
    revenue: number;
    impressions: number;
    ctr: number;
  };
}

const EnhancedPremiumDashboard = () => {
  const { 
    metrics: liveMetrics, 
    products, 
    orders, 
    keywordRankings, 
    emailCampaigns, 
    shopInfo, 
    isLoading, 
    error, 
    fetchAllData,
    refreshProducts,
    refreshOrders,
    refreshSEO,
    refreshEmail
  } = useShopifyData();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Premium Widgets Data
  const [premiumWidgets, setPremiumWidgets] = useState<PremiumWidget[]>([
    {
      id: "ai-shopper-assistant",
      name: "AI Smart Shopper Assistant™",
      description: "NLP-powered search with voice support",
      longDescription: "Live, embedded product assistant powered by natural language search. NLP-powered search tied to store catalog. Triggers upsell, bundle logic, and FAQs. Optionally supports voice search.",
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
      longDescription: "Floating AI badge shows predicted purchase likelihood based on user behavior. Example text: '🔥 92% Match – People like you buy this'. Pulls user session behavior to calculate in-session score.",
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
      longDescription: "Hover/click reveals quick explainer with image, microvideo, or GIF. Display 3D product views or animated callouts. Integrates with media content in product metafields.",
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
      longDescription: "Gamified 'build your bundle' interface with auto-discount logic. Drag and drop bundles from selected SKUs. Automatically calculates discounted price. Shows 'you saved $X' and progress bar to free gift.",
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
      longDescription: "Instagram-style story viewer to showcase product benefits visually. Tap-through cards showing key product features, reviews, or use cases. Live CTAs inside each story.",
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
      longDescription: "Visual inventory urgency bar with scarcity language. Animated progress bar with scarcity language. Text examples: 'Only 3 left!' or 'Selling fast: 22 bought today'. Auto-pulls inventory data from Shopify.",
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
      longDescription: "Personalized popup based on what user viewed and time spent. Logic: detect exit intent + viewed product history. Trigger offer or quiz based on interest. Example: 'Still thinking about the blue joggers? Take 10% off.'",
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
      longDescription: "Post-purchase widget to collect photo or video content. Automatically triggered after delivery date. Incentivized prompt: 'Get $5 store credit for a 10-second video'. Uploaded to merchant's UGC dashboard.",
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
      longDescription: "Visual heatmap overlay showing click and scroll behavior (Merchant preview only). Merchant can activate and preview via their dashboard. Filters: mobile/desktop, new vs returning visitors. Useful for store optimization.",
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
      longDescription: "Cart-based suggestion widget powered by NLP and AI sentiment. 'Don't forget the case for your iPhone 15'. Renders based on cart contents and common bundles. Recommends based on user behavior and buying patterns.",
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

  // Categories for filtering
  const categories = ["All", "AI Tools", "Conversion", "Product Display", "Sales Tools", "Social Commerce", "Urgency Tools", "Retention", "Content Generation", "Analytics"];

  // Convert live metrics to dashboard format
  const metrics = [
    {
      title: "Total Revenue",
      value: `$${liveMetrics.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600',
      description: 'Total Revenue'
    },
    {
      title: "Active Widgets",
      value: premiumWidgets.filter(w => w.isActive).length.toString(),
      change: '+2',
      trend: 'up' as const,
      icon: Bot,
      color: 'text-blue-600',
      description: 'Active Widgets'
    },
    {
      title: "Widget Revenue",
      value: `$${premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.revenue || 0), 0).toLocaleString()}`,
      change: '+18.4%',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-purple-600',
      description: 'Widget Generated Revenue'
    },
    {
      title: "Conversion Rate", 
      value: `${liveMetrics.conversionRate.toFixed(1)}%`,
      change: '+0.4%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-orange-600',
      description: 'Overall Conversion Rate'
    }
  ];

  // Widget management functions
  const toggleWidget = (widgetId: string) => {
    setPremiumWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isActive: !widget.isActive }
        : widget
    ));
    
    const widget = premiumWidgets.find(w => w.id === widgetId);
    toast.success(
      `${widget?.name} ${widget?.isActive ? 'deactivated' : 'activated'} successfully!`,
      { duration: 3000 }
    );
  };

  const configureWidget = (widgetId: string) => {
    const widget = premiumWidgets.find(w => w.id === widgetId);
    toast.success(`Opening configuration for ${widget?.name}`, { duration: 2000 });
  };

  const installWidget = (widgetId: string) => {
    const widget = premiumWidgets.find(w => w.id === widgetId);
    toast.success(`Installing ${widget?.name} for ${widget?.pricing}`, { duration: 3000 });
    toggleWidget(widgetId);
  };

  // Filter widgets
  const filteredWidgets = selectedCategory === "All" 
    ? premiumWidgets 
    : premiumWidgets.filter(widget => widget.category === selectedCategory);

  const activeWidgets = premiumWidgets.filter(w => w.isActive);
  const totalMonthlySpend = activeWidgets.reduce((sum, widget) => sum + widget.monthlyPrice, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg">Loading premium dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">⚠️ Error Loading Data</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchAllData} className="bg-gradient-primary text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">B3</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  B3ACON Premium Dashboard
                </h1>
                <p className="text-muted-foreground">
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
            <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Widget
            </Button>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-elegant glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm text-green-600">{metric.change}</span>
                      <ArrowUpRight className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary/10">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 glass-card">
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
                <Card className="border-0 shadow-elegant glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Active Premium Widgets
                    </CardTitle>
                    <CardDescription>
                      Widgets currently generating revenue for your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeWidgets.slice(0, 5).map((widget) => (
                        <div key={widget.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-white/50 to-white/30">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary/10">
                              <widget.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{widget.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-100 text-green-700">Active</Badge>
                                <span className="text-sm text-muted-foreground">{widget.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">${widget.performance?.revenue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{widget.performance?.conversions} conversions</p>
                            <p className="text-sm text-primary">{widget.performance?.ctr}% CTR</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Summary */}
              <div className="space-y-6">
                <Card className="border-0 shadow-elegant glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Widget Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600 mb-2">
                        ${premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.revenue || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">Total widget revenue this month</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Monthly Cost:</span>
                          <span className="font-medium">${totalMonthlySpend}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>ROI:</span>
                          <span className="font-medium text-green-600">
                            {Math.round((premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.revenue || 0), 0) / Math.max(totalMonthlySpend, 1)) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-elegant glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Total Impressions:</span>
                        <span className="font-medium">
                          {premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.impressions || 0), 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Conversions:</span>
                        <span className="font-medium">
                          {premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.conversions || 0), 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. CTR:</span>
                        <span className="font-medium">
                          {(premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.ctr || 0), 0) / Math.max(activeWidgets.length, 1)).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            {/* Widget Management Interface */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Premium Widgets</h2>
                <p className="text-muted-foreground">Manage your AI-powered marketing widgets</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gradient-primary text-white">
                  {activeWidgets.length} Active
                </Badge>
                <Badge variant="outline">
                  {premiumWidgets.length} Total Available
                </Badge>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-gradient-primary text-white" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWidgets.map((widget) => {
                const IconComponent = widget.icon;
                return (
                  <Card key={widget.id} className="relative group hover:shadow-premium transition-all duration-300 border-0 glass-card">
                    {widget.isNew && (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white z-10 shadow-glow">
                        NEW
                      </Badge>
                    )}
                    {widget.isPro && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge variant="secondary" className="bg-gradient-primary text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          PRO
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-primary/10">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold line-clamp-1">
                              {widget.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {widget.category}
                              </Badge>
                              <span className="text-sm font-medium text-primary">
                                {widget.pricing}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={widget.isActive}
                          onCheckedChange={() => toggleWidget(widget.id)}
                          className="ml-2"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm">
                        {widget.description}
                      </CardDescription>

                      <div className="text-xs text-muted-foreground">
                        {widget.longDescription}
                      </div>

                      {widget.isActive && widget.performance && (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border">
                          <h4 className="text-sm font-medium mb-2">Performance This Month:</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Revenue:</span>
                              <span className="font-medium text-green-600 ml-1">${widget.performance.revenue.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Conversions:</span>
                              <span className="font-medium ml-1">{widget.performance.conversions}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Impressions:</span>
                              <span className="font-medium ml-1">{widget.performance.impressions.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CTR:</span>
                              <span className="font-medium text-primary ml-1">{widget.performance.ctr}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Features:</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {widget.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-primary rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                          {widget.features.length > 3 && (
                            <li className="text-primary">+{widget.features.length - 3} more features</li>
                          )}
                        </ul>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => configureWidget(widget.id)}
                          disabled={!widget.isActive}
                          className="flex-1"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        {widget.isActive ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => toggleWidget(widget.id)}
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => installWidget(widget.id)}
                            className="bg-gradient-primary text-white"
                          >
                            Install
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredWidgets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No widgets found in this category.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-elegant glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Revenue Analytics</CardTitle>
                        <CardDescription>Widget performance over the last 30 days</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Advanced analytics chart</p>
                        <p className="text-sm text-muted-foreground">Showing widget revenue trends</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-elegant glass-card">
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {premiumWidgets
                        .filter(w => w.isActive)
                        .sort((a, b) => (b.performance?.revenue || 0) - (a.performance?.revenue || 0))
                        .slice(0, 5)
                        .map((widget, index) => (
                          <div key={widget.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                              <widget.icon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium truncate">{widget.name}</span>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              ${widget.performance?.revenue.toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-elegant glass-card">
                  <CardHeader>
                    <CardTitle>Monthly Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Widget Revenue:</span>
                        <span className="font-medium text-green-600">
                          ${premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.revenue || 0), 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Spend:</span>
                        <span className="font-medium">${totalMonthlySpend}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Net Profit:</span>
                        <span className="font-medium text-green-600">
                          ${(premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.revenue || 0), 0) - totalMonthlySpend).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">ROI:</span>
                        <span className="font-medium text-primary">
                          {Math.round((premiumWidgets.filter(w => w.isActive).reduce((sum, w) => sum + (w.performance?.revenue || 0), 0) / Math.max(totalMonthlySpend, 1)) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Widget Marketplace */}
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Widget Marketplace</h2>
              <p className="text-muted-foreground mb-6">Discover more AI-powered widgets to boost your store performance</p>
              <Button className="bg-gradient-primary text-white shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Browse Marketplace
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Settings */}
            <Card className="border-0 shadow-elegant glass-card">
              <CardHeader>
                <CardTitle>Widget Settings</CardTitle>
                <CardDescription>Configure global settings for all widgets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Auto-optimization</label>
                    <p className="text-sm text-muted-foreground">Automatically optimize widget performance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Analytics Tracking</label>
                    <p className="text-sm text-muted-foreground">Track detailed widget analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Mobile Optimization</label>
                    <p className="text-sm text-muted-foreground">Optimize widgets for mobile devices</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button className="bg-gradient-primary text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedPremiumDashboard;