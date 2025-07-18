import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/seo-tools', label: 'SEO Tools', icon: '🔍' },
    { path: '/live-tracking', label: 'Live Tracking', icon: '📦' },
    { path: '/crm', label: 'CRM', icon: '👥' },
    { path: '/prospecting', label: 'Prospecting', icon: '🎯' },
    { path: '/affiliate-system', label: 'Affiliates', icon: '🤝' },
    { path: '/admin', label: 'Admin Panel', icon: '⚙️' }
  ];

  const handleLogout = () => {
    logout();
    // Do NOT redirect here - let the AuthContext handle it
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="b3acon-navigation hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-white md:border-r md:border-gray-200 md:shadow-lg md:z-50 md:block">
        <div className="nav-header p-6 border-b border-gray-200">
          <div className="nav-logo flex items-center gap-3 mb-4">
            <span className="logo-icon text-2xl">⚡</span>
            <span className="logo-text text-xl font-bold text-gray-800">B3ACON</span>
          </div>
          <div className="nav-user">
            <span className="user-name text-sm text-gray-600 block mb-2">
              {user?.name || 'User'}
            </span>
            <button 
              className="logout-btn text-sm text-red-600 hover:text-red-800 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="nav-menu p-4">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'active bg-blue-100 text-blue-700 border-l-4 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span className="nav-icon text-lg">{item.icon}</span>
              <span className="nav-label font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="mobile-navigation md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex overflow-x-auto">
          {menuItems.slice(0, 5).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 min-w-16 flex flex-col items-center py-2 px-1 transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-600'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="mobile-header md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="logo-icon text-2xl">⚡</span>
            <span className="logo-text text-xl font-bold text-gray-800">B3ACON</span>
          </div>
          <button 
            className="logout-btn text-sm text-red-600 hover:text-red-800 transition-colors px-3 py-1 rounded border border-red-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
};

export default Navigation;