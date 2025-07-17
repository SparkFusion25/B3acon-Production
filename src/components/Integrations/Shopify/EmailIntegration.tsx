import React, { useState } from 'react';
import { Mail, Settings, BarChart, Eye, Save, Send } from 'lucide-react';

const EmailIntegration = () => {
  const [activeTab, setActiveTab] = useState('forms');
  const [formConfig, setFormConfig] = useState({
    title: 'Join Our Newsletter',
    description: 'Get exclusive offers and updates delivered to your inbox.',
    buttonText: 'Subscribe Now',
    incentiveType: 'discount',
    incentiveValue: '15% OFF',
    klaviyoListId: 'main-newsletter',
    placement: 'footer'
  });

  const incentiveTypes = [
    { id: 'discount', label: 'Discount Code', example: '15% OFF' },
    { id: 'freegift', label: 'Free Gift', example: 'Free Sample Kit' },
    { id: 'vipaccess', label: 'VIP Access', example: 'Early Access to Sales' },
    { id: 'content', label: 'Free Content', example: 'Style Guide PDF' }
  ];

  const formPlacements = [
    { id: 'footer', label: 'Footer', description: 'Bottom of every page' },
    { id: 'popup', label: 'Popup', description: 'Exit-intent or timed' },
    { id: 'sidebar', label: 'Sidebar', description: 'Side of product pages' },
    { id: 'checkout', label: 'Checkout', description: 'During checkout process' }
  ];

  const mockStats = {
    totalSubscribers: 3247,
    weeklyGrowth: 156,
    openRate: 24.7,
    clickRate: 3.8,
    revenue: 12847
  };

  const mockCampaigns = [
    { id: 1, name: 'Welcome Series', type: 'Automated', subscribers: 1247, openRate: 28.5 },
    { id: 2, name: 'Weekly Newsletter', type: 'Campaign', subscribers: 3247, openRate: 22.1 },
    { id: 3, name: 'Abandoned Cart', type: 'Automated', subscribers: 892, openRate: 31.2 },
    { id: 4, name: 'Product Launch', type: 'Campaign', subscribers: 2156, openRate: 26.8 }
  ];

  const renderFormBuilder = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Configuration */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
                <input
                  type="text"
                  value={formConfig.title}
                  onChange={(e) => setFormConfig({ ...formConfig, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formConfig.description}
                  onChange={(e) => setFormConfig({ ...formConfig, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={formConfig.buttonText}
                  onChange={(e) => setFormConfig({ ...formConfig, buttonText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Incentive Offer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incentive Type</label>
                <select
                  value={formConfig.incentiveType}
                  onChange={(e) => setFormConfig({ ...formConfig, incentiveType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {incentiveTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incentive Value</label>
                <input
                  type="text"
                  value={formConfig.incentiveValue}
                  onChange={(e) => setFormConfig({ ...formConfig, incentiveValue: e.target.value })}
                  placeholder={incentiveTypes.find(t => t.id === formConfig.incentiveType)?.example}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Placement</h3>
            <div className="space-y-3">
              {formPlacements.map((placement) => (
                <button
                  key={placement.id}
                  onClick={() => setFormConfig({ ...formConfig, placement: placement.id })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formConfig.placement === placement.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{placement.label}</div>
                  <div className="text-sm text-gray-600">{placement.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-blue-500" />
            Live Preview
          </h3>
          <div className="bg-gray-100 rounded-lg p-4 min-h-96 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{formConfig.title}</h4>
              <p className="text-gray-600 mb-4">{formConfig.description}</p>
              
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled
                />
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {formConfig.buttonText}
                </button>
              </div>
              
              {formConfig.incentiveValue && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="text-sm text-green-600 font-medium">
                      🎁 Special Offer: {formConfig.incentiveValue}
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-gray-900">{mockStats.totalSubscribers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Subscribers</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">+{mockStats.weeklyGrowth}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-blue-600">{mockStats.openRate}%</div>
          <div className="text-sm text-gray-600">Open Rate</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-purple-600">{mockStats.clickRate}%</div>
          <div className="text-sm text-gray-600">Click Rate</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">${mockStats.revenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Revenue</div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Subscribers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Open Rate</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.type === 'Automated' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {campaign.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{campaign.subscribers.toLocaleString()}</td>
                  <td className="py-3 px-4 font-medium text-green-600">{campaign.openRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Klaviyo Integration</h3>
        <div className="space-y-4">
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default List</label>
            <select
              value={formConfig.klaviyoListId}
              onChange={(e) => setFormConfig({ ...formConfig, klaviyoListId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="main-newsletter">Main Newsletter</option>
              <option value="vip-customers">VIP Customers</option>
              <option value="product-updates">Product Updates</option>
              <option value="special-offers">Special Offers</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Welcome Series</div>
              <div className="text-sm text-gray-600">Send welcome emails to new subscribers</div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Abandoned Cart Recovery</div>
              <div className="text-sm text-gray-600">Target cart abandoners with email sequence</div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Segment by Purchase History</div>
              <div className="text-sm text-gray-600">Automatically segment based on buying behavior</div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Email Integration</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Send className="w-4 h-4" />
            <span>Test Form</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'forms', label: 'Form Builder', icon: Mail },
            { id: 'analytics', label: 'Analytics', icon: BarChart },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'forms' && renderFormBuilder()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default EmailIntegration;