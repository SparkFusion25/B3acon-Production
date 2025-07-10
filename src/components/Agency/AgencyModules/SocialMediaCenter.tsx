import React, { useState } from 'react';
import { MessageCircle, Calendar, BarChart3, Users } from 'lucide-react';

const SocialMediaCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const renderPosts = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Social Media Posts</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Social Media Management</h4>
          <p className="text-gray-600 mb-4">Schedule and manage posts across all social media platforms.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Create Post
          </button>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Content Calendar</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Content Calendar</h4>
          <p className="text-gray-600 mb-4">Plan and schedule your social media content in advance.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'posts', label: 'Posts', icon: MessageCircle },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media Center</h2>
        <p className="text-gray-600">Manage all your social media marketing from one place</p>
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
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-600">Social media analytics and reporting features will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaCenter;