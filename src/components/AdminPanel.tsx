import React, { useState } from 'react';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('users');

  return (
    <div className="admin-panel p-6">
      <div className="header mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage system settings and user accounts</p>
      </div>

      <div className="admin-navigation bg-white rounded-lg p-1 mb-8 shadow-lg">
        <div className="flex overflow-x-auto">
          <button 
            className={`flex-1 min-w-24 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeSection === 'users' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('users')}
          >
            Users
          </button>
          <button 
            className={`flex-1 min-w-24 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeSection === 'settings' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('settings')}
          >
            Settings
          </button>
          <button 
            className={`flex-1 min-w-24 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeSection === 'analytics' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeSection === 'users' && (
        <div className="users-section">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">User Management</h3>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Add User
            </button>
          </div>
          
          <div className="users-table bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'settings' && (
        <div className="settings-section">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">System Settings</h3>
          
          <div className="settings-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="setting-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input type="text" defaultValue="B3ACON" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input type="email" defaultValue="admin@b3acon.com" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
            </div>

            <div className="setting-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Enable</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Password Strength Requirements</span>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">Configure</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'analytics' && (
        <div className="analytics-section">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">System Analytics</h3>
          
          <div className="analytics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="metric-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h4>
              <div className="text-3xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-green-600">+12% this month</div>
            </div>
            
            <div className="metric-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Active Sessions</h4>
              <div className="text-3xl font-bold text-green-600">342</div>
              <div className="text-sm text-green-600">+5% this hour</div>
            </div>
            
            <div className="metric-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">System Uptime</h4>
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-green-600">Excellent</div>
            </div>
            
            <div className="metric-card bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Storage Used</h4>
              <div className="text-3xl font-bold text-orange-600">68%</div>
              <div className="text-sm text-yellow-600">Monitor closely</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;