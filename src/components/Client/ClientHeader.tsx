import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../Layout/NotificationBell';

interface ClientHeaderProps {
  currentModule: string;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ currentModule }) => {
  const { user } = useAuth();

  const getModuleName = (module: string) => {
    const names = {
      overview: 'Dashboard Overview',
      services: 'My Services',
      projects: 'Active Projects',
      reports: 'Performance Reports',
      billing: 'Billing & Invoices',
      settings: 'Account Settings',
      support: 'Help & Support'
    };
    return names[module as keyof typeof names] || 'Client Portal';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4 lg:ml-56 xl:ml-64">
      <div className="flex items-center justify-between">
        <div className="ml-12 lg:ml-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{getModuleName(currentModule)}</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Welcome back, {user?.name}</p>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent w-48 lg:w-64"
            />
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* User Profile */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                alt={user?.name}
                className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover"
              />
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-gray-900 text-xs lg:text-sm">{user?.name}</p>
                <p className="text-gray-500 capitalize text-xs">{user?.subscription || 'Professional'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;