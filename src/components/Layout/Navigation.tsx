import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B3</span>
            </div>
            <span className="text-xl font-bold">B3ACON</span>
            <span className="text-sm text-gray-500">Digital Marketing Command Center</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/integrations/shopify"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/integrations/shopify') 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shopify Integration</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;