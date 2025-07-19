import React, { useState, useEffect } from 'react';
import { 
  Home,
  Users,
  Database,
  Globe,
  BarChart3,
  Share,
  Search,
  ShoppingBag,
  Settings,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  Plus,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  Target,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/premium-b3acon-design-system.css';
import PremiumSEOIntelligence from './PremiumSEOIntelligence';

interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon: React.ComponentType<any>;
  permissions: string[];
  badge?: string | number;
  children?: NavigationItem[];
}

interface MetricData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  className = '',
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn-premium btn-${variant} btn-${size} ${className}`}
    >
      {children}
    </button>
  );
};

const PremiumSidebar: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({ collapsed, onToggle }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['crm', 'global-commerce', 'seo']);
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: Home,
      permissions: []
    },
    {
      id: 'clients',
      label: 'Client Management',
      route: '/dashboard/clients',
      icon: Users,
      permissions: [],
      badge: 247
    },
    {
      id: 'crm',
      label: 'CRM Hub',
      route: '/dashboard/crm',
      icon: Database,
      permissions: [],
      children: [
        { id: 'deals', label: 'Deals Pipeline', route: '/dashboard/crm/deals', icon: Target, permissions: [], badge: 12 },
        { id: 'contacts', label: 'Contacts', route: '/dashboard/crm/contacts', icon: Users, permissions: [] },
        { id: 'leads', label: 'Leads', route: '/dashboard/crm/leads', icon: TrendingUp, permissions: [], badge: 48 },
        { id: 'activities', label: 'Activities', route: '/dashboard/crm/activities', icon: Sparkles, permissions: [] }
      ]
    },
    {
      id: 'team',
      label: 'Team Management',
      route: '/dashboard/team',
      icon: Users,
      permissions: []
    },
    {
      id: 'global-commerce',
      label: 'Global Commerce',
      route: '/dashboard/global-commerce',
      icon: Globe,
      permissions: [],
      children: [
        { id: 'landed-cost', label: 'Landed Cost Calculator', route: '/dashboard/global-commerce/landed-cost', icon: Target, permissions: [] },
        { id: 'freight-rates', label: 'Freight Rates', route: '/dashboard/global-commerce/freight-rates', icon: TrendingUp, permissions: [] },
        { id: 'shipment-tracker', label: 'Shipment Tracker', route: '/dashboard/global-commerce/shipment-tracker', icon: Eye, permissions: [] },
        { id: 'tariff-calculator', label: 'Tariff Calculator', route: '/dashboard/global-commerce/tariffs', icon: BarChart3, permissions: [] },
        { id: 'hs-code-lookup', label: 'HS Code Lookup', route: '/dashboard/global-commerce/hs-codes', icon: Search, permissions: [] }
      ]
    },
    {
      id: 'seo',
      label: 'SEO Intelligence',
      route: '/dashboard/seo',
      icon: BarChart3,
      permissions: [],
      children: [
        { id: 'website-analysis', label: 'Website Analysis', route: '/dashboard/seo/analysis', icon: BarChart3, permissions: [] },
        { id: 'keyword-research', label: 'Keyword Research', route: '/dashboard/seo/keywords', icon: Search, permissions: [] },
        { id: 'competitor-analysis', label: 'Competitor Analysis', route: '/dashboard/seo/competitors', icon: Target, permissions: [] },
        { id: 'rank-tracking', label: 'Rank Tracking', route: '/dashboard/seo/rankings', icon: TrendingUp, permissions: [] },
        { id: 'backlinks', label: 'Backlinks Monitor', route: '/dashboard/seo/backlinks', icon: Eye, permissions: [] }
      ]
    },
    {
      id: 'social',
      label: 'Social Media',
      route: '/dashboard/social',
      icon: Share,
      permissions: [],
      children: [
        { id: 'connected-accounts', label: 'Connected Accounts', route: '/dashboard/social/accounts', icon: Users, permissions: [] },
        { id: 'create-posts', label: 'Create Posts', route: '/dashboard/social/create', icon: Plus, permissions: [] },
        { id: 'content-calendar', label: 'Content Calendar', route: '/dashboard/social/calendar', icon: Calendar, permissions: [] },
        { id: 'analytics', label: 'Analytics', route: '/dashboard/social/analytics', icon: BarChart3, permissions: [] }
      ]
    },
    {
      id: 'lead-prospecting',
      label: 'Lead Prospecting',
      route: '/dashboard/lead-prospecting',
      icon: Search,
      permissions: [],
      badge: 'NEW'
    },
    {
      id: 'shopify',
      label: 'Shopify Integration',
      route: '/dashboard/shopify',
      icon: ShoppingBag,
      permissions: []
    },
    {
      id: 'admin',
      label: 'Admin',
      route: '/dashboard/admin',
      icon: Settings,
      permissions: [],
      children: [
        { id: 'users', label: 'User Management', route: '/dashboard/admin/users', icon: Users, permissions: [] },
        { id: 'subscriptions', label: 'Subscription Plans', route: '/dashboard/admin/subscriptions', icon: BarChart3, permissions: [] },
        { id: 'billing', label: 'Billing Management', route: '/dashboard/admin/billing', icon: Target, permissions: [] },
        { id: 'settings', label: 'System Settings', route: '/dashboard/admin/settings', icon: Settings, permissions: [] },
        { id: 'analytics', label: 'Admin Analytics', route: '/dashboard/admin/analytics', icon: BarChart3, permissions: [] }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const NavigationItem: React.FC<{ item: NavigationItem; level?: number }> = ({ item, level = 0 }) => {
    const isActive = location.pathname === item.route;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div>
        <Link
          to={item.route}
          onClick={() => hasChildren ? toggleExpanded(item.id) : undefined}
          className={`
            nav-item group w-full text-left
            ${level > 0 ? 'ml-6 text-sm' : ''}
            ${isActive ? 'active' : ''}
          `}
        >
          <div className="flex items-center flex-1">
            <item.icon className="icon flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="truncate">{item.label}</span>
                <div className="ml-auto flex items-center space-x-2">
                  {item.badge && (
                    <span className={`
                      px-2 py-1 text-xs font-semibold rounded-full
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : item.badge === 'NEW' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                  {hasChildren && (
                    <ChevronRight 
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </Link>
        
        {hasChildren && !collapsed && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavigationItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      nav-premium fixed left-0 top-0 h-full z-40
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">B3ACON</span>
          </div>
        )}
        
        <button 
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </nav>
      
      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">Alex Johnson</div>
              <div className="text-xs text-gray-500 truncate">Premium Plan</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PremiumTopBar: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Alex Johnson</div>
              <div className="text-xs text-gray-500">Premium Account</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ metric: MetricData; index: number }> = ({ metric, index }) => {
  return (
    <div 
      className={`card-premium metric-card metric-card-${metric.color} p-6 transition-all duration-500 animate-slide-in-up`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xl">
          {metric.icon}
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
        <p className="text-gray-600 text-sm font-medium mb-1">{metric.title}</p>
        <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
      </div>
    </div>
  );
};

const PremiumChart: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <PremiumButton variant="ghost" size="small">
            <Filter className="w-4 h-4" />
          </PremiumButton>
          <PremiumButton variant="ghost" size="small">
            <Download className="w-4 h-4" />
          </PremiumButton>
        </div>
      </div>
      
      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <p className="text-gray-600">Interactive chart will be rendered here</p>
          <p className="text-sm text-gray-500">Using Recharts with premium styling</p>
        </div>
      </div>
    </div>
  );
};

const RecentActivityFeed: React.FC = () => {
  const activities = [
    {
      action: 'New deal created',
      target: 'TechCorp Solutions - $45,000',
      time: '2 minutes ago',
      type: 'success',
      icon: Target
    },
    {
      action: 'Client meeting scheduled',
      target: 'Q4 Strategy Review - GlobalTech',
      time: '15 minutes ago',
      type: 'info',
      icon: Calendar
    },
    {
      action: 'SEO optimization completed',
      target: 'Product page improvements',
      time: '1 hour ago',
      type: 'success',
      icon: TrendingUp
    },
    {
      action: 'New lead assigned',
      target: 'Manufacturing Lead - $12K potential',
      time: '3 hours ago',
      type: 'info',
      icon: Users
    }
  ];

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
          Recent Activity
        </h3>
        <PremiumButton variant="ghost" size="small">
          View All
        </PremiumButton>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
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
  );
};

const QuickActionsDashboard: React.FC = () => {
  const actions = [
    { label: 'Add New Client', icon: Plus, color: 'primary' },
    { label: 'Create Deal', icon: Target, color: 'success' },
    { label: 'Schedule Meeting', icon: Calendar, color: 'warning' },
    { label: 'Generate Report', icon: BarChart3, color: 'primary' }
  ];

  return (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <action.icon className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const PremiumDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [metrics, setMetrics] = useState<MetricData[]>([]);

  const renderMainContent = () => {
    const currentPath = location.pathname;
    
    // Route to specific components based on path
    if (currentPath.startsWith('/dashboard/seo')) {
      return <PremiumSEOIntelligence />;
    }
    
    // Default dashboard view
    return (
      <>
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Good morning, <span className="text-gradient-primary">Alex! 👋</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Your business is growing <span className="font-semibold text-emerald-600">+23%</span> this month
              </p>
            </div>
            
            <div className="flex space-x-3">
              <PremiumButton variant="outline" size="medium">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </PremiumButton>
              <PremiumButton variant="primary" size="medium">
                <Plus className="w-4 h-4 mr-2" />
                Add New Client
              </PremiumButton>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} index={index} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <PremiumChart 
              title="Revenue Analytics"
              subtitle="Last 12 months performance"
            />
          </div>
          <div>
            <PremiumChart 
              title="Traffic Sources"
              subtitle="This month breakdown"
            />
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivityFeed />
          <QuickActionsDashboard />
        </div>
      </>
    );
  };

  useEffect(() => {
    // Simulate loading metrics
    setMetrics([
      {
        title: 'Total Revenue',
        value: '$284,590',
        change: '+23.1%',
        trend: 'up',
        icon: '💰',
        color: 'success'
      },
      {
        title: 'Active Clients',
        value: '1,247',
        change: '+12.3%',
        trend: 'up',
        icon: '👥',
        color: 'primary'
      },
      {
        title: 'Conversion Rate',
        value: '4.8%',
        change: '+0.4%',
        trend: 'up',
        icon: '🎯',
        color: 'warning'
      },
      {
        title: 'SEO Score',
        value: '94/100',
        change: '+8',
        trend: 'up',
        icon: '📈',
        color: 'success'
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Sidebar - ALWAYS VISIBLE */}
      <PremiumSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Navigation Bar */}
        <PremiumTopBar />
        
        {/* Dashboard Content */}
        <main className="p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default PremiumDashboard;