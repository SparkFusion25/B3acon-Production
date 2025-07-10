import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  CreditCard, 
  MessageCircle, 
  Settings,
  Home,
  TrendingUp,
  Zap,
  UserCheck,
  Search,
  Palette,
  Building,
  ShoppingBag,
  Users as AffiliateIcon,
  Mail,
  Layout,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AgencySidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const AgencySidebar: React.FC<AgencySidebarProps> = ({ activeModule, onModuleChange }) => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  console.log('AgencySidebar rendering with activeModule:', activeModule);

  const menuItems = [
    { id: 'overview', label: 'Agency Overview', icon: Home, gradient: 'from-signal-blue to-beacon-orange' },
    { id: 'clients', label: 'Client Management', icon: Users, gradient: 'from-signal-blue to-blue-600' },
    { id: 'crm', label: 'CRM Hub', icon: Target, gradient: 'from-beacon-orange to-orange-600' },
    { id: 'team', label: 'Team Management', icon: UserCheck, gradient: 'from-signal-blue to-purple-600' },
    { id: 'google', label: 'Google Services', icon: Search, gradient: 'from-beacon-orange to-red-500' },
    { id: 'seo', label: 'SEO Intelligence', icon: TrendingUp, gradient: 'from-signal-blue to-cyan-500' },
    { id: 'social', label: 'Social Media Center', icon: MessageCircle, gradient: 'from-beacon-orange to-pink-500' },
    { id: 'shopify', label: 'Shopify Integration', icon: ShoppingBag, gradient: 'from-signal-blue to-green-600' },
    { id: 'creative', label: 'Creative Studio', icon: Palette, gradient: 'from-beacon-orange to-purple-500' },
    { id: 'affiliate', label: 'Affiliate Marketing', icon: AffiliateIcon, gradient: 'from-signal-blue to-beacon-orange' },
    { id: 'email', label: 'Email Marketing', icon: Mail, gradient: 'from-beacon-orange to-red-500' },
    { id: 'landing', label: 'Landing Pages', icon: Layout, gradient: 'from-signal-blue to-purple-600' },
    { id: 'whitelabel', label: 'White Label', icon: Building, gradient: 'from-signal-blue to-beacon-orange' },
    { id: 'billing', label: 'Billing Overview', icon: CreditCard, gradient: 'from-beacon-orange to-red-500' },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3, gradient: 'from-signal-blue to-purple-600' }
  ];

  console.log('Menu items array:', menuItems);
  console.log('Total menu items:', menuItems.length);
  
  // Force a visual indicator that the new code is loaded
  useEffect(() => {
    console.log('🚀 NEW SIDEBAR CODE LOADED - All menu items should be visible!');
    console.log('Menu items:', menuItems.map(item => item.label));
  }, []);

  const handleMenuItemClick = (itemId: string) => {
    console.log('Menu item clicked:', itemId);
    onModuleChange(itemId);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-jet-black text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 z-40 h-full bg-jet-black border-r border-slate-gray
        transition-transform duration-300 ease-in-out
        w-64 lg:w-56 xl:w-64
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-3 lg:p-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-gray">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base lg:text-lg">B3ACON</h1>
              <p className="text-gray-300 text-xs lg:text-sm">Agency Command</p>
            </div>
          </div>

          {/* Debug Info - Only show in development */}
          {(import.meta as any).env?.DEV && (
            <div className="mb-4 p-2 bg-red-600 rounded text-xs text-white">
              <div>🚀 NEW CODE ACTIVE</div>
              <div>Items: {menuItems.length}</div>
              <div>Active: {activeModule}</div>
              <div>Time: {new Date().toLocaleTimeString()}</div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              
              console.log(`Rendering menu item ${index + 1}:`, item.label, 'Active:', isActive);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:py-3 rounded-lg transition-all duration-200 text-left ${
                    isActive 
                      ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                      : 'text-gray-300 hover:bg-slate-gray hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="font-medium text-xs lg:text-sm truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Settings & Logout */}
          <div className="mt-4 pt-4 border-t border-slate-gray space-y-1">
            <button className="w-full flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:py-3 text-gray-300 hover:bg-slate-gray hover:text-white rounded-lg transition-all duration-200">
              <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-medium text-xs lg:text-sm">Settings</span>
            </button>
            <button 
              onClick={() => {
                console.log('Logout clicked');
                logout();
              }}
              className="w-full flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:py-3 text-gray-300 hover:bg-beacon-orange hover:text-white rounded-lg transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-medium text-xs lg:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgencySidebar;