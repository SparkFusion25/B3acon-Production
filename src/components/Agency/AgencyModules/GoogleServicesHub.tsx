import React, { useState } from 'react';
import { Search, BarChart3, Target, TrendingUp } from 'lucide-react';

const GoogleServicesHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Google Analytics</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Google Analytics Integration</h4>
          <p className="text-gray-600 mb-4">Connect your Google Analytics account to view comprehensive website analytics.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Connect Google Analytics
          </button>
        </div>
      </div>
    </div>
  );

  const renderSearchConsole = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Search Console</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Google Search Console</h4>
          <p className="text-gray-600 mb-4">Monitor your website's search performance and optimize for better rankings.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
            Connect Search Console
          </button>
        </div>
      </div>
    </div>
  );

  const renderAds = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Google Ads</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Google Ads Management</h4>
          <p className="text-gray-600 mb-4">Manage your Google Ads campaigns and track performance metrics.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
            Connect Google Ads
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'search', label: 'Search Console', icon: Search },
    { id: 'ads', label: 'Google Ads', icon: Target }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Services Hub</h2>
        <p className="text-gray-600">Integrate and manage all your Google marketing tools</p>
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
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'search' && renderSearchConsole()}
        {activeTab === 'ads' && renderAds()}
      </div>
    </div>
  );
};

export default GoogleServicesHub;