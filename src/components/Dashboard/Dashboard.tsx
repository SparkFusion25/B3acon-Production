import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardMetrics {
  totalRevenue: number;
  seoScore: number;
  conversionRate: number;
  totalVisitors: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 47293,
    seoScore: 94,
    conversionRate: 4.2,
    totalVisitors: 12847
  });

  return (
    <div className="dashboard p-6">
      <div className="dashboard-header mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="metric-card bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="metric-icon text-3xl mr-4">📈</div>
            <div className="metric-content">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <div className="metric-value text-2xl font-bold text-gray-800">
                ${metrics.totalRevenue.toLocaleString()}
              </div>
              <div className="metric-change text-sm text-green-600">+12.5% ↗</div>
            </div>
          </div>
        </div>

        <div className="metric-card bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="metric-icon text-3xl mr-4">🔍</div>
            <div className="metric-content">
              <h3 className="text-sm font-medium text-gray-600">SEO Score</h3>
              <div className="metric-value text-2xl font-bold text-gray-800">
                {metrics.seoScore}/100
              </div>
              <div className="metric-change text-sm text-green-600">+8 points ↗</div>
            </div>
          </div>
        </div>

        <div className="metric-card bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="metric-icon text-3xl mr-4">👁️</div>
            <div className="metric-content">
              <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
              <div className="metric-value text-2xl font-bold text-gray-800">
                {metrics.conversionRate}%
              </div>
              <div className="metric-change text-sm text-green-600">+0.8% ↗</div>
            </div>
          </div>
        </div>

        <div className="metric-card bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="metric-icon text-3xl mr-4">👥</div>
            <div className="metric-content">
              <h3 className="text-sm font-medium text-gray-600">Total Visitors</h3>
              <div className="metric-value text-2xl font-bold text-gray-800">
                {metrics.totalVisitors.toLocaleString()}
              </div>
              <div className="metric-change text-sm text-green-600">+1,203 ↗</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="activity-list space-y-4">
            <div className="activity-item flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="activity-icon text-xl mr-3">🛍️</span>
                <div className="activity-content">
                  <p className="font-medium text-gray-800">New order from John D.</p>
                  <span className="activity-time text-sm text-gray-500">2 minutes ago</span>
                </div>
              </div>
              <span className="activity-value font-semibold text-green-600">$156.99</span>
            </div>
            <div className="activity-item flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="activity-icon text-xl mr-3">📊</span>
                <div className="activity-content">
                  <p className="font-medium text-gray-800">SEO ranking improved</p>
                  <span className="activity-time text-sm text-gray-500">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic Sources</h3>
          <div className="traffic-sources space-y-3">
            <div className="source-item flex items-center justify-between">
              <div className="flex items-center">
                <span className="source-color w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                <span className="source-label">Organic Search</span>
              </div>
              <span className="source-percentage font-semibold">45%</span>
            </div>
            <div className="source-item flex items-center justify-between">
              <div className="flex items-center">
                <span className="source-color w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                <span className="source-label">Social Media</span>
              </div>
              <span className="source-percentage font-semibold">25%</span>
            </div>
            <div className="source-item flex items-center justify-between">
              <div className="flex items-center">
                <span className="source-color w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                <span className="source-label">Direct</span>
              </div>
              <span className="source-percentage font-semibold">20%</span>
            </div>
            <div className="source-item flex items-center justify-between">
              <div className="flex items-center">
                <span className="source-color w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                <span className="source-label">Email</span>
              </div>
              <span className="source-percentage font-semibold">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;