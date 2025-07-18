import React, { useState } from 'react';

const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customers');

  const mockCustomers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      totalOrders: 15,
      totalSpent: 2450,
      lastOrder: '2024-01-10'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      totalOrders: 8,
      totalSpent: 1200,
      lastOrder: '2024-01-08'
    }
  ];

  const mockLeads = [
    {
      id: 1,
      name: 'Mike Johnson',
      email: 'mike@potential.com',
      source: 'Website',
      status: 'Hot Lead'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      source: 'Social Media',
      status: 'Warm Lead'
    }
  ];

  return (
    <div className="crm p-6">
      <div className="header mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer Relationship Management</h1>
        <p className="text-gray-600">Manage your customers and leads effectively</p>
      </div>

      <div className="tabs bg-white rounded-lg p-1 mb-8 shadow-lg">
        <div className="flex">
          <button 
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'customers' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
          <button 
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'leads' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('leads')}
          >
            Leads
          </button>
          <button 
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'analytics' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'customers' && (
        <div className="customers-section">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Customer Database</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Customer
            </button>
          </div>
          
          <div className="customers-grid space-y-4">
            {mockCustomers.map(customer => (
              <div key={customer.id} className="customer-card bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{customer.name}</h4>
                    <p className="text-gray-600">{customer.email}</p>
                    <div className="mt-2 flex gap-4">
                      <span className="text-sm text-gray-500">Orders: {customer.totalOrders}</span>
                      <span className="text-sm text-gray-500">Spent: ${customer.totalSpent}</span>
                      <span className="text-sm text-gray-500">Last Order: {customer.lastOrder}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors">
                      Edit
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="leads-section">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Lead Management</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Lead
            </button>
          </div>
          
          <div className="leads-grid space-y-4">
            {mockLeads.map(lead => (
              <div key={lead.id} className="lead-card bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{lead.name}</h4>
                    <p className="text-gray-600">{lead.email}</p>
                    <div className="mt-2 flex gap-4">
                      <span className="text-sm text-gray-500">Source: {lead.source}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        lead.status === 'Hot Lead' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                      Convert
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      Follow Up
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Customer Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="metric-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Customers</h4>
              <div className="text-3xl font-bold text-blue-600">1,245</div>
              <div className="text-sm text-green-600">+12% this month</div>
            </div>
            
            <div className="metric-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Customer Lifetime Value</h4>
              <div className="text-3xl font-bold text-green-600">$1,850</div>
              <div className="text-sm text-green-600">+8% this month</div>
            </div>
            
            <div className="metric-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Lead Conversion Rate</h4>
              <div className="text-3xl font-bold text-purple-600">24%</div>
              <div className="text-sm text-green-600">+3% this month</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;