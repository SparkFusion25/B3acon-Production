import React, { useState } from 'react';
import { 
  Home,
  ShoppingCart,
  Package,
  FolderOpen,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  X,
  Zap,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ClientSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ activeModule, onModuleChange }) => {
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, gradient: 'from-signal-blue to-beacon-orange' },
    { id: 'services', label: 'My Services', icon: ShoppingCart, gradient: 'from-signal-blue to-blue-600' },
    { id: 'purchase', label: 'Purchase Services', icon: Package, gradient: 'from-beacon-orange to-pink-500' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, gradient: 'from-beacon-orange to-orange-600' },
    { id: 'reports', label: 'Reports', icon: BarChart3, gradient: 'from-signal-blue to-purple-600' },
    { id: 'billing', label: 'Billing', icon: CreditCard, gradient: 'from-beacon-orange to-red-500' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-signal-blue to-gray-600' },
    { id: 'support', label: 'Support', icon: HelpCircle, gradient: 'from-beacon-orange to-pink-500' }
  ];

  const handleMenuItemClick = (itemId: string) => {
    onModuleChange(itemId);
    setIsMobileMenuOpen(false);
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
              <p className="text-gray-300 text-xs lg:text-sm">Client Portal</p>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-3 bg-slate-gray rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium text-sm">{user?.name}</p>
                <p className="text-gray-300 text-xs capitalize">{user?.subscription || 'Professional'} Plan</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              
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

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-slate-gray">
            <button 
              onClick={logout}
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

export default ClientSidebar;