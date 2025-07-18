import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Affiliate {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  commissionRate: number;
  totalSales: number;
  thisMonth: number;
}

interface Metrics {
  totalAffiliates: number;
  activeAffiliates: number;
  totalRevenue: number;
  avgCommission: number;
  topPerformers: { name: string; revenue: number; }[];
}

const AffiliateSystem: React.FC = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalAffiliates: 0,
    activeAffiliates: 0,
    totalRevenue: 0,
    avgCommission: 0,
    topPerformers: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      // Mock data for now - replace with actual API call
      setMetrics({
        totalAffiliates: 45,
        activeAffiliates: 32,
        totalRevenue: 125690,
        avgCommission: 12.5,
        topPerformers: [
          { name: 'Sarah Johnson', revenue: 15420 },
          { name: 'Mike Chen', revenue: 12350 }
        ]
      });
      
      setAffiliates([
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          status: 'active',
          commissionRate: 15,
          totalSales: 15420,
          thisMonth: 3250
        },
        {
          id: 2,
          name: 'Mike Chen',
          email: 'mike@example.com',
          status: 'active',
          commissionRate: 12,
          totalSales: 12350,
          thisMonth: 2800
        }
      ]);
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="affiliate-loading flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading affiliate data...</p>
      </div>
    );
  }

  return (
    <div className="affiliate-system p-6 max-w-7xl mx-auto">
      <div className="affiliate-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Affiliate Marketing System</h1>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2">
          🤖 AI Recruit Affiliates
        </button>
      </div>

      {/* Mobile-friendly tabs */}
      <div className="mobile-tabs bg-white rounded-xl p-1 mb-8 shadow-lg">
        <div className="flex overflow-x-auto">
          <button 
            className={`tab-btn flex-1 min-w-24 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn flex-1 min-w-24 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'affiliates' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('affiliates')}
          >
            Affiliates
          </button>
          <button 
            className={`tab-btn flex-1 min-w-24 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'campaigns' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('campaigns')}
          >
            Campaigns
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="affiliate-overview">
          <div className="metrics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="metric-card bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="metric-icon text-3xl mr-4 p-3 bg-blue-100 rounded-lg">👥</div>
                <div className="metric-content">
                  <h3 className="text-sm font-medium text-gray-600">Total Affiliates</h3>
                  <div className="metric-value text-2xl font-bold text-gray-800">{metrics.totalAffiliates}</div>
                  <div className="metric-change text-sm text-green-600">+12% this month</div>
                </div>
              </div>
            </div>

            <div className="metric-card bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="metric-icon text-3xl mr-4 p-3 bg-green-100 rounded-lg">💰</div>
                <div className="metric-content">
                  <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                  <div className="metric-value text-2xl font-bold text-gray-800">
                    ${metrics.totalRevenue?.toLocaleString()}
                  </div>
                  <div className="metric-change text-sm text-green-600">+8% this month</div>
                </div>
              </div>
            </div>

            <div className="metric-card bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="metric-icon text-3xl mr-4 p-3 bg-purple-100 rounded-lg">📊</div>
                <div className="metric-content">
                  <h3 className="text-sm font-medium text-gray-600">Active Affiliates</h3>
                  <div className="metric-value text-2xl font-bold text-gray-800">{metrics.activeAffiliates}</div>
                  <div className="metric-change text-sm text-green-600">+5% this month</div>
                </div>
              </div>
            </div>

            <div className="metric-card bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="metric-icon text-3xl mr-4 p-3 bg-orange-100 rounded-lg">🎯</div>
                <div className="metric-content">
                  <h3 className="text-sm font-medium text-gray-600">Avg Commission</h3>
                  <div className="metric-value text-2xl font-bold text-gray-800">{metrics.avgCommission}%</div>
                  <div className="metric-change text-sm text-gray-500">No change</div>
                </div>
              </div>
            </div>
          </div>

          <div className="top-performers bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performers</h3>
            <div className="performer-list space-y-3">
              {metrics.topPerformers?.map((performer, index) => (
                <div key={index} className="performer-item flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="performer-rank bg-blue-100 text-blue-800 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      #{index + 1}
                    </div>
                    <div className="performer-info">
                      <div className="performer-name font-semibold text-gray-800">{performer.name}</div>
                      <div className="performer-revenue text-lg font-bold text-green-600">
                        ${performer.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Affiliates Tab */}
      {activeTab === 'affiliates' && (
        <div className="affiliates-list">
          <div className="list-header flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Active Affiliates</h3>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Add New
            </button>
          </div>

          <div className="affiliates-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliates.map(affiliate => (
              <div key={affiliate.id} className="affiliate-card bg-white p-6 rounded-xl shadow-lg">
                <div className="affiliate-header flex justify-between items-center mb-4">
                  <div className="affiliate-name font-semibold text-gray-800">{affiliate.name}</div>
                  <div className={`affiliate-status px-3 py-1 rounded-full text-xs font-medium ${
                    affiliate.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {affiliate.status}
                  </div>
                </div>
                <div className="affiliate-details space-y-2 mb-4">
                  <div className="detail-item flex justify-between">
                    <span className="detail-label text-gray-600">Email:</span>
                    <span className="detail-value font-medium text-gray-800">{affiliate.email}</span>
                  </div>
                  <div className="detail-item flex justify-between">
                    <span className="detail-label text-gray-600">Commission:</span>
                    <span className="detail-value font-medium text-gray-800">{affiliate.commissionRate}%</span>
                  </div>
                  <div className="detail-item flex justify-between">
                    <span className="detail-label text-gray-600">Total Sales:</span>
                    <span className="detail-value font-medium text-gray-800">
                      ${affiliate.totalSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-item flex justify-between">
                    <span className="detail-label text-gray-600">This Month:</span>
                    <span className="detail-value font-medium text-gray-800">
                      ${affiliate.thisMonth.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="affiliate-actions flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="campaigns-section">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Affiliate Campaigns</h3>
          <div className="campaigns-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="campaign-card bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Summer Sale Campaign</h4>
              <p className="text-gray-600 mb-4">15% commission on all summer products</p>
              <div className="campaign-stats flex gap-4 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">12 Affiliates</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">$25K Revenue</span>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200">
                View Campaign
              </button>
            </div>
            
            <div className="campaign-card bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Back to School</h4>
              <p className="text-gray-600 mb-4">20% commission on electronics</p>
              <div className="campaign-stats flex gap-4 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">8 Affiliates</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">$18K Revenue</span>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200">
                View Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateSystem;