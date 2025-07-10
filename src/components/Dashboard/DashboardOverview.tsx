import React from 'react';
import { BarChart3, Users, DollarSign, TrendingUp, Target, MessageCircle, ShoppingCart } from 'lucide-react';
import StatsCard from './StatsCard';
import type { DashboardStats } from '../../types/dashboard';

interface DashboardOverviewProps {
  stats: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  const statsCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toLocaleString(),
      change: '+12.5%',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      trend: 'up' as const
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects.toLocaleString(),
      change: '+8.2%',
      icon: Target,
      gradient: 'from-green-500 to-teal-500',
      trend: 'up' as const
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats.monthlyRevenue / 1000).toFixed(0)}K`,
      change: '+18.5%',
      icon: DollarSign,
      gradient: 'from-purple-500 to-pink-500',
      trend: 'up' as const
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate}%`,
      change: '+5.3%',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      trend: 'up' as const
    }
  ];

  return (
    <div className="p-6 ml-64">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Command Center Overview</h2>
        <p className="text-gray-600">Your digital marketing intelligence at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">View SEO Report</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Schedule Posts</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            <Target className="w-5 h-5" />
            <span className="font-medium">Review Campaigns</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Amazon Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-signal-blue rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">SEO audit completed for TechCorp</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-beacon-orange rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">5 posts scheduled for this week</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-signal-blue rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">PPC campaign optimization completed</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;