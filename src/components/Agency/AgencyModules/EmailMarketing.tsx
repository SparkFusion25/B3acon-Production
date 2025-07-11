import React, { useState } from 'react';
import { Mail, Users, Send, BarChart3, Zap, Eye, MousePointer } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmailMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  
  const handleCreateCampaign = () => {
    toast.success('Creating new email campaign');
  };
  
  const handleCreateList = () => {
    toast.success('Creating new email list');
  };
  
  const handleCreateAutomation = () => {
    toast.success('Creating new email automation');
  };
  
  const handleAddProvider = () => {
    toast.success('Adding new email provider');
  };
  
  const handleViewReport = (campaignId: number) => {
    toast.success(`Viewing report for campaign #${campaignId}`);
  };
  
  const handleDuplicateCampaign = (campaignId: number) => {
    toast.success(`Duplicating campaign #${campaignId}`);
  };

  const campaigns = [
    {
      id: 1,
      name: 'January Newsletter',
      subject: 'New Year, New Marketing Strategies',
      status: 'sent',
      campaign_type: 'newsletter',
      client: 'TechCorp Solutions',
      sent_at: '2024-01-15T10:00:00',
      stats: {
        total_sent: 2500,
        delivered: 2450,
        opened: 1225,
        clicked: 245,
        open_rate: 50.0,
        click_rate: 10.0
      }
    },
    {
      id: 2,
      name: 'Product Launch Announcement',
      subject: 'Introducing Our Revolutionary New Service',
      status: 'scheduled',
      campaign_type: 'promotional',
      client: 'RetailMax Inc',
      scheduled_at: '2024-01-25T14:00:00',
      stats: {
        total_sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        open_rate: 0,
        click_rate: 0
      }
    },
    {
      id: 3,
      name: 'Welcome Series - Part 1',
      subject: 'Welcome to Our Community!',
      status: 'sending',
      campaign_type: 'automated',
      client: 'FinanceFlow',
      stats: {
        total_sent: 150,
        delivered: 148,
        opened: 89,
        clicked: 23,
        open_rate: 60.1,
        click_rate: 15.5
      }
    }
  ];

  const emailLists = [
    {
      id: 1,
      name: 'Newsletter Subscribers',
      client: 'TechCorp Solutions',
      subscriber_count: 2500,
      active_subscribers: 2350,
      growth_rate: 12.5,
      created_at: '2023-06-15'
    },
    {
      id: 2,
      name: 'Product Updates',
      client: 'RetailMax Inc',
      subscriber_count: 1800,
      active_subscribers: 1720,
      growth_rate: 8.3,
      created_at: '2023-08-22'
    },
    {
      id: 3,
      name: 'VIP Customers',
      client: 'FinanceFlow',
      subscriber_count: 450,
      active_subscribers: 435,
      growth_rate: 15.7,
      created_at: '2023-09-10'
    }
  ];

  const automations = [
    {
      id: 1,
      name: 'Welcome Series',
      trigger_type: 'signup',
      status: 'active',
      client: 'TechCorp Solutions',
      steps: 5,
      stats: {
        total_triggered: 450,
        completed: 320,
        conversion_rate: 25.5,
        revenue_generated: 12500
      }
    },
    {
      id: 2,
      name: 'Abandoned Cart Recovery',
      trigger_type: 'abandoned_cart',
      status: 'active',
      client: 'RetailMax Inc',
      steps: 3,
      stats: {
        total_triggered: 280,
        completed: 89,
        conversion_rate: 18.2,
        revenue_generated: 8900
      }
    }
  ];

  const providers = [
    {
      id: 1,
      name: 'klaviyo',
      display_name: 'Klaviyo',
      is_connected: true,
      last_sync: '2024-01-20T10:30:00',
      clients_using: 3
    },
    {
      id: 2,
      name: 'constant_contact',
      display_name: 'Constant Contact',
      is_connected: true,
      last_sync: '2024-01-20T09:15:00',
      clients_using: 2
    },
    {
      id: 3,
      name: 'mailchimp',
      display_name: 'Mailchimp',
      is_connected: false,
      last_sync: null,
      clients_using: 0
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      sent: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      paused: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
        <button 
          onClick={handleCreateCampaign}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Send className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Campaigns</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{campaigns.length}</div>
          <p className="text-sm text-green-600">↗ +2 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Emails Sent</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {campaigns.reduce((sum, c) => sum + c.stats.total_sent, 0).toLocaleString()}
          </div>
          <p className="text-sm text-green-600">↗ +15% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Avg Open Rate</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {(campaigns.reduce((sum, c) => sum + c.stats.open_rate, 0) / campaigns.length).toFixed(1)}%
          </div>
          <p className="text-sm text-green-600">↗ +2.3% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Avg Click Rate</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <MousePointer className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {(campaigns.reduce((sum, c) => sum + c.stats.click_rate, 0) / campaigns.length).toFixed(1)}%
          </div>
          <p className="text-sm text-green-600">↗ +1.2% this month</p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.subject}</p>
                  <p className="text-xs text-gray-500">Client: {campaign.client}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Sent:</span>
                <div className="font-medium text-gray-900">{campaign.stats.total_sent.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Delivered:</span>
                <div className="font-medium text-gray-900">{campaign.stats.delivered.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Opened:</span>
                <div className="font-medium text-gray-900">{campaign.stats.opened.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Clicked:</span>
                <div className="font-medium text-gray-900">{campaign.stats.clicked.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Open Rate:</span>
                <div className="font-medium text-green-600">{campaign.stats.open_rate}%</div>
              </div>
              <div>
                <span className="text-gray-600">Click Rate:</span>
                <div className="font-medium text-blue-600">{campaign.stats.click_rate}%</div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4">
              <button 
                onClick={() => handleViewReport(campaign.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                View Report
              </button>
              <button 
                onClick={() => handleDuplicateCampaign(campaign.id)}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
              >
                Duplicate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLists = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Lists</h3>
        <button 
          onClick={handleCreateList}
          className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Users className="w-4 h-4 mr-2" />
          Create List
        </button>
      </div>

      <div className="space-y-4">
        {emailLists.map((list) => (
          <div key={list.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{list.name}</h4>
                  <p className="text-sm text-gray-600">Client: {list.client}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{list.subscriber_count.toLocaleString()}</div>
                <div className="text-sm text-gray-600">subscribers</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Active Subscribers:</span>
                <div className="font-medium text-green-600">{list.active_subscribers.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Growth Rate:</span>
                <div className="font-medium text-blue-600">+{list.growth_rate}%</div>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <div className="font-medium text-gray-900">
                  {new Date(list.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                Manage Subscribers
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                Export List
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutomations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Automations</h3>
        <button 
          onClick={handleCreateAutomation}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Zap className="w-4 h-4 mr-2" />
          Create Automation
        </button>
      </div>

      <div className="space-y-4">
        {automations.map((automation) => (
          <div key={automation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{automation.name}</h4>
                  <p className="text-sm text-gray-600">Trigger: {automation.trigger_type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">Client: {automation.client}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                automation.status === 'active' ? 'bg-green-100 text-green-800' :
                automation.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {automation.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600">Steps:</span>
                <div className="font-medium text-gray-900">{automation.steps}</div>
              </div>
              <div>
                <span className="text-gray-600">Triggered:</span>
                <div className="font-medium text-gray-900">{automation.stats.total_triggered.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <div className="font-medium text-green-600">{automation.stats.completed.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Conversion:</span>
                <div className="font-medium text-blue-600">{automation.stats.conversion_rate}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">Revenue Generated: </span>
                <span className="font-medium text-green-600">${automation.stats.revenue_generated.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                  Edit Flow
                </button>
                <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProviders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Service Providers</h3>
        <button 
          onClick={handleAddProvider}
          className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Mail className="w-4 h-4 mr-2" />
          Add Provider
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  provider.is_connected ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{provider.display_name}</h4>
                  <p className="text-sm text-gray-600">{provider.clients_using} clients using</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                provider.is_connected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  provider.is_connected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {provider.is_connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {provider.last_sync && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(provider.last_sync).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                provider.is_connected 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}>
                {provider.is_connected ? 'Disconnect' : 'Connect'}
              </button>
              {provider.is_connected && (
                <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  Configure
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Provider Integration Guide */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Integration Features</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Klaviyo Integration</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Advanced segmentation</li>
              <li>• Behavioral triggers</li>
              <li>• E-commerce tracking</li>
              <li>• Predictive analytics</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Constant Contact Integration</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Drag-and-drop editor</li>
              <li>• Event management</li>
              <li>• Social media integration</li>
              <li>• Reporting & analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: Mail },
    { id: 'lists', label: 'Lists', icon: Users },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'providers', label: 'Providers', icon: BarChart3 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Marketing Hub</h2>
        <p className="text-gray-600">Manage campaigns, lists, and automations across multiple providers</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-signal-blue text-signal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'lists' && renderLists()}
        {activeTab === 'automations' && renderAutomations()}
        {activeTab === 'providers' && renderProviders()}
      </div>
    </div>
  );
};

export default EmailMarketing;