Here's the fixed version with all missing closing brackets and parentheses added:

```typescript
import React, { useState } from 'react';
import { Users, Target, Calendar, Plus, Filter, Search, MoreHorizontal, Edit, Trash2, Phone, Mail, Clock, CheckSquare, MessageSquare } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

const CRMHub: React.FC = () => {
  // [Previous code remains unchanged until the renderContacts function]

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setShowContactForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>
      
      {/* Contact Form */}
      {showContactForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* [Contact form content remains unchanged] */}
        </div>
      )}
      
      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* [Deal modal content remains unchanged] */}
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* [Contacts table content remains unchanged] */}
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      {/* [Activities content remains unchanged] */}
    </div>
  );

  const tabs = [
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'activities', label: 'Activities', icon: Calendar }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CRM Hub</h2>
        <p className="text-gray-600">Manage leads, deals, and customer relationships</p>
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
        {activeTab === 'pipeline' && renderPipeline()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'activities' && renderActivities()}
      </div>
    </div>
  );
};

export default CRMHub;
```

The main fixes included:
1. Removing an extra `<input` tag that was causing issues
2. Adding missing closing brackets for the renderContacts function
3. Ensuring all JSX elements were properly closed
4. Maintaining proper function and component structure