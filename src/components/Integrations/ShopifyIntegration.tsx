import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Mail, 
  Megaphone, 
  Star, 
  Settings,
  BarChart3,
  Eye,
  Save,
  Play
} from 'lucide-react';

const ShopifyIntegration = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ai-popups', label: 'AI Popups', icon: Sparkles },
    { id: 'email-integration', label: 'Email Capture', icon: Mail },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'reviews', label: 'Review Management', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const features = [
    {
      title: 'AI Popup Generator',
      description: 'Create intelligent popups with AI-powered triggers and personalized messaging',
      icon: Sparkles,
      color: 'bg-purple-500',
      stats: { popups: 12, conversions: '8.4%', revenue: '$2,847' }
    },
    {
      title: 'Email Integration',
      description: 'Seamless Klaviyo integration with smart capture forms and automation',
      icon: Mail,
      color: 'bg-blue-500',
      stats: { subscribers: 1247, growth: '+23%', campaigns: 8 }
    },
    {
      title: 'Smart Announcements',
      description: 'Automated holiday and sales announcements with perfect timing',
      icon: Megaphone,
      color: 'bg-orange-500',
      stats: { announcements: 5, engagement: '12.3%', clicks: 892 }
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-popups':
        return <AiPopupDemo />;
      case 'email-integration':
        return <EmailIntegrationDemo />;
      case 'announcements':
        return <AnnouncementDemo />;
      default:
        return (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Shopify Store Connected</h2>
                    <p className="text-gray-600">mystore.myshopify.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${feature.color} p-3 rounded-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {Object.entries(feature.stats).map(([key, value], statIndex) => (
                      <div key={statIndex} className="text-center">
                        <p className="text-lg font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('ai-popups')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <Sparkles className="w-8 h-8 text-purple-500 mb-2" />
                  <p className="font-medium text-gray-900">Create AI Popup</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('email-integration')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <Mail className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="font-medium text-gray-900">Setup Email Capture</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('announcements')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <Megaphone className="w-8 h-8 text-orange-500 mb-2" />
                  <p className="font-medium text-gray-900">Create Announcement</p>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Shopify Integration</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600 font-medium">Connected</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Demo components for different tabs
const AiPopupDemo = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">AI Popup Generator</h2>
      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save className="w-4 h-4" />
          <span>Save Campaign</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Play className="w-4 h-4" />
          <span>Launch</span>
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose AI Character</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Alex', personality: 'Professional', avatar: '👔' },
            { name: 'Maya', personality: 'Friendly', avatar: '😊' },
            { name: 'Zoe', personality: 'Playful', avatar: '🎨' },
            { name: 'Sage', personality: 'Helpful', avatar: '🤓' }
          ].map((character, index) => (
            <div key={index} className="p-4 border-2 border-purple-500 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl mb-2">{character.avatar}</div>
              <div className="font-medium text-gray-900">{character.name}</div>
              <div className="text-sm text-purple-600">{character.personality}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-blue-500" />
          Live Preview
        </h3>
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-48">
          <div className="max-w-sm w-full p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h4 className="font-bold text-lg mb-2">Special Offer Just for You!</h4>
            <p className="text-sm mb-4 opacity-90">Get 15% off your first order when you subscribe to our newsletter.</p>
            <button className="w-full py-2 px-4 rounded-lg font-medium bg-white text-gray-900 hover:bg-gray-100 transition-colors">
              Claim Offer
            </button>
            <p className="text-xs mt-2 opacity-75">Code: WELCOME15</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EmailIntegrationDemo = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Email Integration</h2>
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-green-900">Klaviyo Connected</div>
            <div className="text-sm text-green-600">API key configured and active</div>
          </div>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-2xl font-bold text-gray-900">3,247</div>
        <div className="text-sm text-gray-600">Total Subscribers</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-2xl font-bold text-green-600">+156</div>
        <div className="text-sm text-gray-600">This Week</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-2xl font-bold text-blue-600">24.7%</div>
        <div className="text-sm text-gray-600">Open Rate</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-2xl font-bold text-purple-600">3.8%</div>
        <div className="text-sm text-gray-600">Click Rate</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-2xl font-bold text-green-600">$12,847</div>
        <div className="text-sm text-gray-600">Revenue</div>
      </div>
    </div>
  </div>
);

const AnnouncementDemo = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Announcement Manager</h2>
      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save className="w-4 h-4" />
          <span>Save Draft</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Play className="w-4 h-4" />
          <span>Go Live</span>
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Holiday Templates</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Black Friday', bg: '#000000', text: '#ffffff' },
            { name: 'Cyber Monday', bg: '#1e40af', text: '#ffffff' },
            { name: 'Christmas', bg: '#dc2626', text: '#ffffff' },
            { name: 'New Year', bg: '#7c3aed', text: '#ffffff' },
            { name: "Valentine's", bg: '#ec4899', text: '#ffffff' },
            { name: 'Summer Sale', bg: '#f59e0b', text: '#ffffff' }
          ].map((template, index) => (
            <div key={index} className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
              <div 
                className="w-full h-12 rounded-md mb-2 flex items-center justify-center"
                style={{ backgroundColor: template.bg }}
              >
                <div 
                  className="text-xs font-medium"
                  style={{ color: template.text }}
                >
                  {template.name}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">{template.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-blue-500" />
          Live Preview
        </h3>
        <div className="bg-gray-100 rounded-lg p-4 min-h-48">
          <div className="w-full p-4 rounded-lg shadow-lg bg-black text-white">
            <div className="text-center">
              <h4 className="font-bold text-lg mb-2">Black Friday Sale - 50% OFF Everything!</h4>
              <p className="text-sm mb-4 opacity-90">Biggest sale of the year! Use code BLACKFRIDAY50 for 50% off sitewide.</p>
              <button className="px-6 py-2 rounded-lg font-medium transition-colors bg-orange-500 text-white">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ShopifyIntegration;