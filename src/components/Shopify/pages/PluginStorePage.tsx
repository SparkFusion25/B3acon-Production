import React, { useState } from 'react';
import { Zap, Star, Download, Eye, Settings, Type, Users, ShoppingBag, BarChart3, Mail, Target, Gift } from 'lucide-react';
import ShopifyAppLayout from '../ShopifyAppLayout';

interface Plugin {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<any>;
  category: string;
  rating: number;
  installs: string;
  price: string;
  features: string[];
  status: 'available' | 'installed' | 'coming_soon';
  preview?: string;
}

const PluginStorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const plugins: Plugin[] = [
    {
      id: 'typewriter',
      name: 'Typewriter Effect',
      description: 'Create engaging animated text that captures attention',
      longDescription: 'Advanced typewriter animation with customizable colors, fonts, and speeds. Perfect for hero sections and product announcements.',
      icon: Type,
      category: 'design',
      rating: 4.9,
      installs: '2.1k',
      price: 'Premium',
      features: ['Gradient text effects', 'Multiple animation styles', 'Mobile responsive', 'Easy customization'],
      status: 'available'
    },
    {
      id: 'reviews',
      name: 'Review Management System',
      description: 'Automate review collection and display beautiful testimonials',
      longDescription: 'Comprehensive review system with automated email requests, multiple display styles, and integration with major review platforms.',
      icon: Star,
      category: 'conversion',
      rating: 4.8,
      installs: '1.8k',
      price: 'Premium',
      features: ['Auto review requests', 'Multi-platform integration', 'Custom email templates', 'Advanced filtering'],
      status: 'available'
    },
    {
      id: 'loyalty-rewards',
      name: 'Loyalty Rewards Program',
      description: 'Build customer loyalty with automated reward points and incentives',
      longDescription: 'Complete loyalty program system with customizable reward rates, automated email notifications, and comprehensive analytics to increase customer retention.',
      icon: Gift,
      category: 'marketing',
      rating: 4.9,
      installs: '2.3k',
      price: 'Premium',
      features: ['Custom reward rates', 'Email automation', 'Multi-provider integration', 'Real-time analytics'],
      status: 'available'
    },
    {
      id: 'powerbuy-ai',
      name: 'PowerBuy AI Button',
      description: 'Intelligent buy button with AI-powered conversion optimization',
      longDescription: 'Revolutionary AI-powered buy button that recognizes customers, recovers abandoned carts, provides smart recommendations, and optimizes conversions in real-time.',
      icon: Zap,
      category: 'conversion',
      rating: 4.9,
      installs: '1.8k',
      price: 'Premium',
      features: ['AI customer recognition', 'Abandoned cart recovery', 'Smart recommendations', 'One-click checkout'],
      status: 'available'
    },
    {
      id: 'affiliate-marketing',
      name: 'Affiliate Marketing System',
      description: 'Complete affiliate management platform with AI-powered recruitment',
      longDescription: 'Comprehensive affiliate marketing system with AI-powered affiliate recruitment, automated tracking, commission management, and advanced analytics to scale your business exponentially.',
      icon: Users,
      category: 'marketing',
      rating: 4.9,
      installs: '1.5k',
      price: 'Premium',
      features: ['AI affiliate recruitment', 'Automated tracking', 'Commission management', 'Real-time analytics'],
      status: 'available'
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics Dashboard',
      description: 'Deep insights into customer behavior and sales performance',
      longDescription: 'Comprehensive analytics with heat maps, conversion funnels, and predictive insights to optimize your store performance.',
      icon: BarChart3,
      category: 'analytics',
      rating: 4.7,
      installs: '900+',
      price: 'Premium',
      features: ['Heat map tracking', 'Conversion funnels', 'Predictive analytics', 'Custom reports'],
      status: 'coming_soon'
    },
    {
      id: 'email-automation',
      name: 'Email Marketing Automation',
      description: 'Automated email campaigns that increase customer retention',
      longDescription: 'Advanced email marketing with smart segmentation, automated workflows, and performance tracking.',
      icon: Mail,
      category: 'marketing',
      rating: 4.6,
      installs: '1.2k',
      price: 'Premium',
      features: ['Smart segmentation', 'Drip campaigns', 'A/B testing', 'Performance analytics'],
      status: 'coming_soon'
    },
    {
      id: 'conversion-optimizer',
      name: 'Conversion Rate Optimizer',
      description: 'AI-powered tools to maximize your store conversions',
      longDescription: 'Machine learning algorithms analyze user behavior and automatically optimize your store for higher conversions.',
      icon: Target,
      category: 'conversion',
      rating: 4.9,
      installs: '650+',
      price: 'Premium',
      features: ['AI optimization', 'Smart recommendations', 'Exit-intent popups', 'Real-time testing'],
      status: 'coming_soon'
    },
    {
      id: 'inventory-manager',
      name: 'Smart Inventory Manager',
      description: 'Intelligent inventory management with demand forecasting',
      longDescription: 'Predictive inventory management that prevents stockouts and reduces holding costs with AI-driven demand forecasting.',
      icon: ShoppingBag,
      category: 'management',
      rating: 4.5,
      installs: '980+',
      price: 'Premium',
      features: ['Demand forecasting', 'Auto-reordering', 'Low stock alerts', 'Supplier integration'],
      status: 'coming_soon'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Plugins', count: plugins.length },
    { id: 'design', label: 'Design & UI', count: plugins.filter(p => p.category === 'design').length },
    { id: 'conversion', label: 'Conversion', count: plugins.filter(p => p.category === 'conversion').length },
    { id: 'marketing', label: 'Marketing', count: plugins.filter(p => p.category === 'marketing').length },
    { id: 'analytics', label: 'Analytics', count: plugins.filter(p => p.category === 'analytics').length },
    { id: 'management', label: 'Management', count: plugins.filter(p => p.category === 'management').length }
  ];

  const filteredPlugins = plugins.filter(plugin => {
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'installed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Installed</span>;
      case 'coming_soon':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <ShopifyAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plugin Store</h1>
            <p className="text-gray-600">Extend your store with powerful plugins designed to boost conversions</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Featured Plugins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlugins.map(plugin => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>

        {filteredPlugins.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No plugins found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </ShopifyAppLayout>
  );
};

const PluginCard: React.FC<{ plugin: Plugin }> = ({ plugin }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleInstall = () => {
    if (plugin.status === 'available') {
      // Navigate to plugin configuration page
      window.location.href = `/shopify/plugins/${plugin.id}`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Plugin Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <plugin.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{plugin.name}</h3>
              {getStatusBadge(plugin.status)}
            </div>
            <p className="text-sm text-gray-600 mb-3">{plugin.description}</p>
            
            {/* Rating and Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{plugin.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{plugin.installs}</span>
              </div>
              <span className="font-medium text-blue-600">{plugin.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plugin Features */}
      <div className="p-6">
        <div className="space-y-2 mb-4">
          {plugin.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
              {feature}
            </div>
          ))}
          {plugin.features.length > 3 && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showDetails ? 'Show less' : `+${plugin.features.length - 3} more features`}
            </button>
          )}
        </div>

        {showDetails && (
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
            {plugin.features.slice(3).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                {feature}
              </div>
            ))}
            <p className="text-sm text-gray-600 mt-3">{plugin.longDescription}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {plugin.status === 'available' ? (
            <>
              <button
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </>
          ) : plugin.status === 'installed' ? (
            <>
              <button
                onClick={handleInstall}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-100 text-gray-400 py-2 px-4 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PluginStorePage;