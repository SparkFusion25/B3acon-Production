import React from 'react';
import { Bell, Search, ChevronDown, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AgencyHeaderProps {
  currentModule: string;
}

const AgencyHeader: React.FC<AgencyHeaderProps> = ({ currentModule }) => {
  const { user } = useAuth();

  const getModuleName = (module: string) => {
    const names = {
      overview: 'Agency Overview',
      crm: 'CRM Hub',
      clients: 'Client Management',
      team: 'Team Management',
      google: 'Google Services',
      seo: 'SEO Intelligence',
      social: 'Social Media Center',
      shopify: 'Shopify Integration',
      creative: 'Creative Studio',
      whitelabel: 'White Label',
      affiliate: 'Affiliate Marketing',
      email: 'Email Marketing',
      landing: 'Landing Pages',
      billing: 'Billing Overview',
      analytics: 'Performance Analytics'
    };
    return names[module as keyof typeof names] || 'Dashboard';
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
              placeholder="Search clients, projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48 lg:w-64"
            />
          </div>

          {/* Quick Actions - Hidden on small screens */}
          <button className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all">
            <Users className="w-4 h-4" />
            <span className="font-medium">Add Client</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

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
                <p className="text-gray-500 capitalize text-xs">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AgencyHeader;