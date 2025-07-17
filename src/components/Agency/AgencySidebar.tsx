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
  Globe,
  UserCheck,
  Search,
  Palette,
  Building,
  ShoppingBag,
  Users as AffiliateIcon,
  Mail,
  Layout,
  Menu,
  X,
  Shield,
  Briefcase,
  Truck,
  FileCheck,
  Package,
  DollarSign,
  ShieldCheck,
  Ship,
  Store
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface AgencySidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const AgencySidebar: React.FC<AgencySidebarProps> = ({ activeModule, onModuleChange }) => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  console.log('AgencySidebar rendering with activeModule:', activeModule);

  // Check if user is admin
  useEffect(() => {
    // In a real implementation, this would check the user's role from auth context
    // For now, we'll use localStorage for demo purposes
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Command Center', icon: Home, gradient: 'from-signal-blue to-beacon-orange' },
    { id: 'clients', label: 'Client Management', icon: Users, gradient: 'from-signal-blue to-blue-600' },
    { id: 'crm', label: 'CRM Hub', icon: Target, gradient: 'from-beacon-orange to-orange-600' },
    { id: 'team', label: 'Team Management', icon: UserCheck, gradient: 'from-signal-blue to-purple-600' },
    { id: 'global-commerce', label: 'Global Commerce', icon: Globe, gradient: 'from-green-500 to-teal-500', premium: true },
    { id: 'tariff-calculator', label: 'Tariff Calculator', icon: DollarSign, gradient: 'from-blue-500 to-cyan-500', premium: true },
    { id: 'compliance', label: 'Compliance Checker', icon: ShieldCheck, gradient: 'from-red-500 to-pink-500', premium: true },
    { id: 'shipping', label: 'Shipping Tools', icon: Truck, gradient: 'from-amber-500 to-orange-500', premium: true },
    { id: 'hs-codes', label: 'HS Code Lookup', icon: Search, gradient: 'from-purple-500 to-indigo-500', premium: true },
    { id: 'ocean-freight', label: 'Ocean Freight Portal', icon: Ship, gradient: 'from-blue-600 to-indigo-600', premium: true },
    { id: 'google', label: 'Google Services', icon: Search, gradient: 'from-beacon-orange to-red-500' },
    { id: 'seo', label: 'SEO Intelligence', icon: TrendingUp, gradient: 'from-signal-blue to-cyan-500' },
    { id: 'shopify-seo', label: 'Shopify SEO Optimizer', icon: Store, gradient: 'from-green-500 to-emerald-600', premium: true },
    { id: 'amazon-seo', label: 'Amazon SEO Optimizer', icon: Store, gradient: 'from-orange-500 to-amber-600', premium: true },
    { id: 'social', label: 'Social Media Center', icon: MessageCircle, gradient: 'from-beacon-orange to-pink-500' },
    { id: 'shopify', label: 'Shopify Integration', icon: ShoppingBag, gradient: 'from-signal-blue to-green-600' },
    { id: 'creative', label: 'Creative Studio', icon: Palette, gradient: 'from-beacon-orange to-purple-500' },
    { id: 'affiliate', label: 'Affiliate Marketing', icon: AffiliateIcon, gradient: 'from-signal-blue to-beacon-orange' },
    { id: 'email', label: 'Email Marketing', icon: Mail, gradient: 'from-beacon-orange to-red-500' },
    { id: 'prospecting', label: 'Lead Prospecting', icon: Briefcase, gradient: 'from-green-500 to-teal-500' },
    { id: 'landing', label: 'Landing Pages', icon: Layout, gradient: 'from-signal-blue to-purple-600' },
    { id: 'whitelabel', label: 'White Label', icon: Building, gradient: 'from-signal-blue to-beacon-orange', premium: true },
    { id: 'admin', label: 'Admin Dashboard', icon: Shield, gradient: 'from-purple-500 to-pink-500' },
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

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    toast.success('Settings panel coming soon');
  };

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(() => {
      logout();
    }, 1000);
  };
  
  const handleToggleAdmin = () => {
    const newAdminStatus = !isAdmin;
    localStorage.setItem('isAdmin', String(newAdminStatus));
    setIsAdmin(newAdminStatus);
    toast.success(newAdminStatus ? 'Admin access enabled' : 'Admin access disabled');
    window.location.reload(); // Refresh to update access
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
              <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base lg:text-lg">B3ACON</h1>
              <p className="text-gray-300 text-xs lg:text-sm">Global Commerce</p>
            </div>
          </div>

          {/* Debug Info - Only show in development */}
          {(import.meta as any).env?.DEV && (
            <div className="mb-4 p-2 bg-red-600 rounded text-xs text-white">
              <div>🚀 {isAdmin ? 'ADMIN MODE' : 'USER MODE'}</div>
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
              
              // Check if this is a premium feature that should be restricted
              const isPremiumLocked = item.premium && !isAdmin; // Lock premium features for non-admin users
              
              console.log(`Rendering menu item ${index + 1}:`, item.label, 'Active:', isActive);
              
              return (
                <button
                  key={item.id}
                  onClick={() => isPremiumLocked ? toast.error('Upgrade your plan to access this feature') : handleMenuItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 rounded-lg transition-all duration-200 text-left group ${
                    isActive 
                      ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                      : isPremiumLocked 
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-gray-300 hover:bg-slate-gray hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <Icon className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="font-medium text-xs lg:text-sm truncate">{item.label}</span>
                    {isPremiumLocked && (
                      <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                        Pro
                      </span>
                    )}
                  </div>
                  {isPremiumLocked && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Upgrade
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Settings & Logout */}
          <div className="mt-auto pt-4 border-t border-slate-gray space-y-1">
            <button 
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:py-3 text-gray-300 hover:bg-slate-gray hover:text-white rounded-lg transition-all duration-200"
            >
              <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-medium text-xs lg:text-sm">Settings</span>
            </button>
            <button 
              onClick={handleToggleAdmin}
              className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:py-3 rounded-lg transition-all duration-200 ${
                isAdmin 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-gray hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-medium text-xs lg:text-sm">{isAdmin ? 'Disable Admin' : 'Enable Admin'}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:py-3 text-gray-300 hover:bg-beacon-orange hover:text-white rounded-lg transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-medium text-xs lg:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            
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

export default AgencySidebar;