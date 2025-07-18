import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  BarChart3, 
  Search, 
  Mail, 
  TrendingUp, 
  Target, 
  ShoppingBag,
  Settings,
  Zap,
  ChevronDown,
  ChevronRight,
  Bell,
  User,
  Store,
  Home,
  FileText,
  Users,
  Globe,
  Star,
  Gift
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
  badge?: string;
  comingSoon?: boolean;
}

interface ShopifyAppLayoutProps {
  children: React.ReactNode;
  storeName?: string;
  isConnected?: boolean;
}

const ShopifyAppLayout: React.FC<ShopifyAppLayoutProps> = ({ 
  children, 
  storeName = "Demo Store",
  isConnected = true 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    plugins: true,
    seo: false,
    email: false,
    analytics: false,
    conversion: false,
    products: false,
    integrations: false,
    settings: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/shopify/dashboard',
      icon: Home
    },
    {
      name: 'Store Plugins',
      href: '/shopify/plugins',
      icon: Zap,
      children: [
        { name: 'Plugin Store', href: '/shopify/plugins/store', icon: ShoppingBag },
        { name: 'Typewriter Effect', href: '/shopify/plugins/typewriter', icon: Target },
        { name: 'Review System', href: '/shopify/plugins/reviews', icon: Star },
        { name: 'Loyalty Rewards', href: '/shopify/plugins/loyalty-rewards', icon: Gift, badge: 'NEW' },
        { name: 'Installed Plugins', href: '/shopify/plugins/installed', icon: Settings }
      ]
    },
    {
      name: 'SEO Optimization',
      href: '/shopify/seo',
      icon: Search,
      children: [
        { name: 'SEO Analysis', href: '/shopify/seo/analysis', icon: BarChart3 },
        { name: 'Keyword Research', href: '/shopify/seo/keywords', icon: Search },
        { name: 'Content Optimization', href: '/shopify/seo/content', icon: FileText },
        { name: 'Technical SEO', href: '/shopify/seo/technical', icon: Settings },
        { name: 'SEO Reports', href: '/shopify/seo/reports', icon: TrendingUp }
      ]
    },
    {
      name: 'Email Marketing',
      href: '/shopify/email',
      icon: Mail,
      children: [
        { name: 'Email Campaigns', href: '/shopify/email/campaigns', icon: Mail },
        { name: 'Automation Flows', href: '/shopify/email/automation', icon: Zap },
        { name: 'Email Templates', href: '/shopify/email/templates', icon: FileText },
        { name: 'Subscriber Lists', href: '/shopify/email/lists', icon: Users },
        { name: 'Email Analytics', href: '/shopify/email/analytics', icon: BarChart3 }
      ]
    },
    {
      name: 'Analytics & Reports',
      href: '/shopify/analytics',
      icon: BarChart3,
      children: [
        { name: 'Sales Analytics', href: '/shopify/analytics/sales', icon: TrendingUp },
        { name: 'Customer Insights', href: '/shopify/analytics/customers', icon: Users },
        { name: 'Product Performance', href: '/shopify/analytics/products', icon: ShoppingBag },
        { name: 'Traffic Analysis', href: '/shopify/analytics/traffic', icon: Globe },
        { name: 'Custom Reports', href: '/shopify/analytics/custom', icon: FileText }
      ]
    },
    {
      name: 'Conversion Optimization',
      href: '/shopify/conversion',
      icon: Target,
      children: [
        { name: 'A/B Testing', href: '/shopify/conversion/ab-testing', icon: Target },
        { name: 'Landing Pages', href: '/shopify/conversion/landing', icon: FileText },
        { name: 'Checkout Optimization', href: '/shopify/conversion/checkout', icon: ShoppingBag },
        { name: 'Pop-ups & Banners', href: '/shopify/conversion/popups', icon: Zap },
        { name: 'Conversion Reports', href: '/shopify/conversion/reports', icon: BarChart3 }
      ]
    },
    {
      name: 'Product Management',
      href: '/shopify/products',
      icon: ShoppingBag,
      children: [
        { name: 'Product Catalog', href: '/shopify/products/catalog', icon: ShoppingBag },
        { name: 'Inventory Management', href: '/shopify/products/inventory', icon: BarChart3 },
        { name: 'Bulk Operations', href: '/shopify/products/bulk', icon: Zap },
        { name: 'Product Optimization', href: '/shopify/products/optimization', icon: Target },
        { name: 'Product Analytics', href: '/shopify/products/analytics', icon: TrendingUp }
      ]
    },
    {
      name: 'Integrations',
      href: '/shopify/integrations',
      icon: Zap,
      children: [
        { name: 'Connected Apps', href: '/shopify/integrations/apps', icon: Zap },
        { name: 'API Connections', href: '/shopify/integrations/api', icon: Settings },
        { name: 'Webhooks', href: '/shopify/integrations/webhooks', icon: Globe },
        { name: 'Data Sync', href: '/shopify/integrations/sync', icon: BarChart3 },
        { name: 'Third-party Tools', href: '/shopify/integrations/tools', icon: FileText }
      ]
    },
    {
      name: 'Settings',
      href: '/shopify/settings',
      icon: Settings,
      children: [
        { name: 'App Configuration', href: '/shopify/settings/config', icon: Settings },
        { name: 'User Permissions', href: '/shopify/settings/permissions', icon: Users },
        { name: 'Billing & Plans', href: '/shopify/settings/billing', icon: FileText },
        { name: 'Support', href: '/shopify/settings/support', icon: Globe }
      ]
    }
  ];

  const sectionKeys = {
    'Store Plugins': 'plugins',
    'SEO Optimization': 'seo',
    'Email Marketing': 'email',
    'Analytics & Reports': 'analytics',
    'Conversion Optimization': 'conversion',
    'Product Management': 'products',
    'Integrations': 'integrations',
    'Settings': 'settings'
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent 
              navigation={navigation} 
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              sectionKeys={sectionKeys}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-80">
          <SidebarContent 
            navigation={navigation} 
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            sectionKeys={sectionKeys}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Store connection indicator */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {isConnected ? `Connected to ${storeName}` : 'Store Disconnected'}
                  </span>
                </div>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">Profile</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - PROPERLY CENTERED */}
        <main className="flex-1 max-w-none overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar content component
const SidebarContent: React.FC<{
  navigation: NavigationItem[];
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  sectionKeys: Record<string, string>;
}> = ({ navigation, expandedSections, toggleSection, sectionKeys }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">B3ACON</h1>
            <p className="text-xs text-gray-500">Shopify App</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleSection(sectionKeys[item.name])}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {expandedSections[sectionKeys[item.name]] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedSections[sectionKeys[item.name]] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.name}</span>
                        {child.comingSoon && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            Soon
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <a
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default ShopifyAppLayout;