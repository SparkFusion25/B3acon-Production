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
  MessageCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ClientSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ activeModule, onModuleChange }) => {
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(() => {
      logout();
    }, 1000);
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
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:py-3 text-gray-300 hover:bg-beacon-orange hover:text-white rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-medium text-xs lg:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notifications</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableNotifications"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="enableNotifications">Enable notifications</label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success('Settings saved');
                  setShowSettingsModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientSidebar;