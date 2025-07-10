import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  gradient: string;
  trend: 'up' | 'down';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, gradient, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↗' : '↘'} {change}
            </span>
            <span className="text-gray-500 text-sm ml-1">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg ${
          gradient.includes('purple') || gradient.includes('pink') ? 'bg-gradient-to-r from-signal-blue to-beacon-orange' :
          gradient.includes('blue') || gradient.includes('cyan') ? 'bg-gradient-to-r from-signal-blue to-blue-600' :
          gradient.includes('green') || gradient.includes('teal') ? 'bg-gradient-to-r from-beacon-orange to-green-600' :
          gradient.includes('orange') || gradient.includes('red') ? 'bg-gradient-to-r from-beacon-orange to-red-500' :
          'bg-gradient-to-r from-signal-blue to-beacon-orange'
        } flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;