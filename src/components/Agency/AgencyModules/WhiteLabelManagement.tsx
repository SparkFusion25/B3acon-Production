import React, { useState } from 'react';
import { Building, Palette, Settings, Users } from 'lucide-react';

const WhiteLabelManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partners');

  const renderPartners = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">White Label Partners</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">White Label Management</h4>
          <p className="text-gray-600 mb-4">Manage your white label partners and their custom branding.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Add Partner
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'partners', label: 'Partners', icon: Building },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">White Label Management</h2>
        <p className="text-gray-600">Manage white label partnerships and custom branding</p>
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
        {activeTab === 'partners' && renderPartners()}
        {activeTab === 'branding' && (
          <div className="text-center py-12">
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Branding Coming Soon</h3>
            <p className="text-gray-600">Custom branding tools will be available soon.</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
            <p className="text-gray-600">White label settings will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteLabelManagement;