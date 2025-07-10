import React from 'react';
import { 
  Users, 
  Target, 
  ShoppingCart, 
  MessageCircle, 
  FileText,
  Settings,
  Home,
  TrendingUp,
  Zap,
  Palette
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, gradient: 'from-signal-blue to-beacon-orange' },
    { id: 'seo', label: 'SEO Intelligence', icon: TrendingUp, gradient: 'from-signal-blue to-blue-600' },
    { id: 'social', label: 'Social Media', icon: MessageCircle, gradient: 'from-beacon-orange to-orange-600' },
    { id: 'ppc', label: 'Paid Advertising', icon: Target, gradient: 'from-signal-blue to-beacon-orange' },
    { id: 'amazon', label: 'Amazon Suite', icon: ShoppingCart, gradient: 'from-beacon-orange to-red-500' },
    { id: 'crm', label: 'CRM Engine', icon: Users, gradient: 'from-signal-blue to-purple-600' },
    { id: 'files', label: 'Files & Billing', icon: FileText, gradient: 'from-slate-gray to-gray-600' },
    { id: 'creative', label: 'Creative Studio', icon: Palette, gradient: 'from-beacon-orange to-pink-500' }
  ];

  return (
    <div className="w-64 bg-jet-black min-h-screen p-4 fixed left-0 top-0 z-10 border-r border-slate-gray">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-slate-gray">
        <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">B3ACON</h1>
          <p className="text-gray-300 text-sm">Command Center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                  : 'text-gray-300 hover:bg-slate-gray hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-auto pt-8">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-slate-gray hover:text-white rounded-lg transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;