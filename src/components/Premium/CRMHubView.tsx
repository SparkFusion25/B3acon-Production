import React, { useState } from 'react';
import { Target, Users, TrendingUp, Sparkles, Phone, Mail, Calendar, DollarSign } from 'lucide-react';

interface CRMHubViewProps {
  activeSubSection: string;
}

const CRMHubView: React.FC<CRMHubViewProps> = ({ activeSubSection }) => {
  const [activeTab, setActiveTab] = useState(activeSubSection || 'deals');

  const renderSubSection = () => {
    switch (activeTab) {
      case 'deals':
        return <DealsSection />;
      case 'contacts':
        return <ContactsSection />;
      case 'leads':
        return <LeadsSection />;
      case 'activities':
        return <ActivitiesSection />;
      default:
        return <DealsSection />;
    }
  };

  return (
    <div className="crm-hub">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM Hub</h1>
        <p className="text-gray-600">Manage your customer relationships and sales pipeline</p>
      </div>

      {/* Sub-navigation tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'deals', label: 'Deals Pipeline', icon: Target, badge: 12 },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'leads', label: 'Leads', icon: TrendingUp, badge: 48 },
            { id: 'activities', label: 'Activities', icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {renderSubSection()}
    </div>
  );
};

const DealsSection: React.FC = () => (
  <div className="deals-section">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pipeline Value</h3>
          <DollarSign className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">$425,600</div>
        <p className="text-sm text-gray-600">+18% from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Deals</h3>
          <Target className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">47</div>
        <p className="text-sm text-gray-600">12 closing this week</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Win Rate</h3>
          <TrendingUp className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">68%</div>
        <p className="text-sm text-gray-600">+5% improvement</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Avg Deal Size</h3>
          <DollarSign className="w-5 h-5 text-orange-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">$8,950</div>
        <p className="text-sm text-gray-600">+12% increase</p>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Active Deals Pipeline</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { stage: 'Prospecting', deals: 15, value: '$125,400', color: 'blue' },
            { stage: 'Qualified', deals: 12, value: '$98,200', color: 'yellow' },
            { stage: 'Proposal', deals: 8, value: '$156,000', color: 'purple' },
            { stage: 'Negotiation', deals: 5, value: '$89,500', color: 'green' }
          ].map((stage, index) => (
            <div key={index} className="space-y-3">
              <div className={`bg-${stage.color}-100 text-${stage.color}-700 px-3 py-2 rounded-lg font-medium text-center`}>
                {stage.stage} ({stage.deals})
              </div>
              <div className="space-y-2">
                {Array.from({ length: Math.min(stage.deals, 3) }).map((_, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded border">
                    <div className="font-medium text-sm">Deal #{i + 1}</div>
                    <div className="text-xs text-gray-600">$15,000</div>
                  </div>
                ))}
                {stage.deals > 3 && (
                  <div className="text-center text-sm text-gray-500">
                    +{stage.deals - 3} more deals
                  </div>
                )}
              </div>
              <div className="text-center font-semibold text-gray-700">{stage.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ContactsSection: React.FC = () => (
  <div className="contacts-section">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search contacts..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option>All Contacts</option>
          <option>Hot Prospects</option>
          <option>Customers</option>
          <option>Partners</option>
        </select>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Add Contact
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-sm border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Name</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Company</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Email</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Phone</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'John Smith', company: 'TechCorp Inc', email: 'john@techcorp.com', phone: '+1 (555) 123-4567', status: 'Hot Lead' },
              { name: 'Sarah Johnson', company: 'Marketing Pro', email: 'sarah@marketingpro.com', phone: '+1 (555) 234-5678', status: 'Customer' },
              { name: 'Mike Chen', company: 'StartupXYZ', email: 'mike@startupxyz.com', phone: '+1 (555) 345-6789', status: 'Prospect' }
            ].map((contact, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">{contact.name}</td>
                <td className="py-4 px-6">{contact.company}</td>
                <td className="py-4 px-6">{contact.email}</td>
                <td className="py-4 px-6">{contact.phone}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    contact.status === 'Hot Lead' ? 'bg-red-100 text-red-700' :
                    contact.status === 'Customer' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const LeadsSection: React.FC = () => (
  <div className="leads-section">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New Leads</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">48</div>
        <p className="text-sm text-gray-600">+15 this week</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Qualified Leads</h3>
          <Target className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">23</div>
        <p className="text-sm text-gray-600">48% qualification rate</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Conversion Rate</h3>
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">32%</div>
        <p className="text-sm text-gray-600">+8% improvement</p>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Recent Leads</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[
            { name: 'Alex Rodriguez', company: 'Digital Agency Pro', source: 'Website Form', score: 85, status: 'Hot' },
            { name: 'Emma Wilson', company: 'E-commerce Store', source: 'Google Ads', score: 72, status: 'Warm' },
            { name: 'David Kim', company: 'Tech Startup', source: 'LinkedIn', score: 68, status: 'Cold' }
          ].map((lead, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-gray-600">{lead.company}</div>
                  <div className="text-xs text-gray-500">Source: {lead.source}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">Score: {lead.score}</div>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  lead.status === 'Hot' ? 'bg-red-100 text-red-700' :
                  lead.status === 'Warm' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {lead.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ActivitiesSection: React.FC = () => (
  <div className="activities-section">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold">Recent Activities</h3>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Log Activity
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="space-y-4">
          {[
            { type: 'call', contact: 'John Smith', company: 'TechCorp Inc', activity: 'Called about pricing', time: '2 hours ago', icon: Phone },
            { type: 'email', contact: 'Sarah Johnson', company: 'Marketing Pro', activity: 'Sent proposal follow-up', time: '4 hours ago', icon: Mail },
            { type: 'meeting', contact: 'Mike Chen', company: 'StartupXYZ', activity: 'Demo meeting scheduled', time: '1 day ago', icon: Calendar }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'call' ? 'bg-green-100' :
                activity.type === 'email' ? 'bg-blue-100' :
                'bg-purple-100'
              }`}>
                <activity.icon className={`w-5 h-5 ${
                  activity.type === 'call' ? 'text-green-600' :
                  activity.type === 'email' ? 'text-blue-600' :
                  'text-purple-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{activity.activity}</div>
                <div className="text-sm text-gray-600">
                  {activity.contact} at {activity.company}
                </div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CRMHubView;