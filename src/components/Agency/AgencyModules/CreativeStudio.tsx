import React, { useState } from 'react';
import { Palette, Image, Video, FileText } from 'lucide-react';

const CreativeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assets');

  const renderAssets = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Creative Assets</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Creative Studio</h4>
          <p className="text-gray-600 mb-4">Manage all your creative assets and brand materials in one place.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Upload Assets
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'assets', label: 'Assets', icon: Image },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'brand', label: 'Brand Kit', icon: Palette }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Creative Studio</h2>
        <p className="text-gray-600">Manage your creative assets and brand materials</p>
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
        {activeTab === 'assets' && renderAssets()}
        {activeTab === 'templates' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Templates Coming Soon</h3>
            <p className="text-gray-600">Creative templates will be available soon.</p>
          </div>
        )}
        {activeTab === 'brand' && (
          <div className="text-center py-12">
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Brand Kit Coming Soon</h3>
            <p className="text-gray-600">Brand management tools will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeStudio;