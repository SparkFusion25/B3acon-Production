import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface Affiliate {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended' | 'banned';
  commissionRate: number;
  totalSales: number;
  thisMonth: number;
  conversionRate: number;
  clickCount: number;
  signupDate: string;
  avatar: string;
  socialMedia: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  performance: {
    earnings: number;
    clicks: number;
    conversions: number;
    topProducts: string[];
  };
}

interface AffiliateMetrics {
  totalAffiliates: number;
  activeAffiliates: number;
  totalRevenue: number;
  totalCommissionsPaid: number;
  averageCommission: number;
  conversionRate: number;
  affiliateGrowth: number;
  revenueGrowth: number;
  campaignGrowth: number;
  commissionChange: number;
  activeCampaigns: number;
  pendingPayouts: number;
  topPerformers: Affiliate[];
  recentActivity: Array<{
    id: string;
    type: 'signup' | 'sale' | 'payout' | 'milestone';
    affiliate: string;
    description: string;
    amount?: number;
    timestamp: string;
    icon: string;
  }>;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  commissionRate: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed';
  affiliatesCount: number;
  totalSales: number;
  targetUrl: string;
}

interface AffiliateLink {
  id: string;
  affiliateId: string;
  originalUrl: string;
  trackingCode: string;
  campaignName: string;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
}

const AffiliateMarketingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'affiliates' | 'campaigns' | 'links' | 'payouts' | 'recruitment' | 'analytics'>('overview');
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [metrics, setMetrics] = useState<AffiliateMetrics | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAIRecruitment, setShowAIRecruitment] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    loadAffiliateData();
  }, [timeframe]);

  const loadAffiliateData = async () => {
    // Simulate API call - replace with real API
    setTimeout(() => {
      setAffiliates(mockAffiliates);
      setMetrics(mockMetrics);
      setCampaigns(mockCampaigns);
      setLinks(mockLinks);
      setLoading(false);
    }, 1000);
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: string;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className={`bg-white rounded-2xl p-6 border-l-4 border-${color}-500 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-sm font-medium">
                {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Affiliates"
          value={metrics?.totalAffiliates || 0}
          change={metrics?.affiliateGrowth}
          icon="👥"
          color="blue"
        />
        <MetricCard
          title="Affiliate Revenue"
          value={`$${(metrics?.totalRevenue || 0).toLocaleString()}`}
          change={metrics?.revenueGrowth}
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Active Campaigns"
          value={metrics?.activeCampaigns || 0}
          change={metrics?.campaignGrowth}
          icon="📢"
          color="purple"
        />
        <MetricCard
          title="Avg Commission"
          value={`${metrics?.averageCommission || 0}%`}
          change={metrics?.commissionChange}
          icon="📊"
          color="indigo"
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Performance Analytics</h3>
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map(period => (
              <button
                key={period}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setTimeframe(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <Line
            data={performanceChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Top Performers & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">🏆 Top Performers</h3>
          <div className="space-y-4">
            {metrics?.topPerformers?.slice(0, 5).map((affiliate, index) => (
              <div key={affiliate.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-sm">
                  {index + 1}
                </div>
                <img
                  src={affiliate.avatar}
                  alt={affiliate.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{affiliate.name}</div>
                  <div className="text-sm text-gray-600">${affiliate.thisMonth.toLocaleString()} this month</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{affiliate.conversionRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">conversion</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Recent Activity</h3>
          <div className="space-y-4">
            {metrics?.recentActivity?.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.description}</div>
                  <div className="text-sm text-gray-600">{activity.timestamp}</div>
                </div>
                {activity.amount && (
                  <div className="font-bold text-green-600">+${activity.amount}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">🚀 Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-300"
            onClick={() => setShowAIRecruitment(true)}
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-semibold">AI Recruit Affiliates</div>
            <div className="text-sm opacity-80">Find perfect partners</div>
          </button>
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-300"
            onClick={() => setActiveTab('campaigns')}
          >
            <div className="text-2xl mb-2">📢</div>
            <div className="font-semibold">Create Campaign</div>
            <div className="text-sm opacity-80">Launch new promotion</div>
          </button>
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-300"
            onClick={() => setActiveTab('payouts')}
          >
            <div className="text-2xl mb-2">💸</div>
            <div className="font-semibold">Process Payouts</div>
            <div className="text-sm opacity-80">Pay affiliates</div>
          </button>
        </div>
      </div>
    </div>
  );

  const AffiliatesTab = () => (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Affiliate Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search affiliates..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setShowAIRecruitment(true)}
          >
            🤖 AI Recruit
          </button>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">This Month</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAffiliates.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={affiliate.avatar}
                        alt={affiliate.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
                        <div className="text-sm text-gray-500">{affiliate.email}</div>
                        <div className="flex space-x-2 mt-1">
                          {affiliate.socialMedia.instagram && (
                            <span className="text-pink-500">📷</span>
                          )}
                          {affiliate.socialMedia.youtube && (
                            <span className="text-red-500">📺</span>
                          )}
                          {affiliate.socialMedia.tiktok && (
                            <span className="text-gray-900">🎵</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      affiliate.status === 'active' ? 'bg-green-100 text-green-800' :
                      affiliate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      affiliate.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {affiliate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.commissionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${affiliate.totalSales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${affiliate.thisMonth.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.conversionRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        👁️
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Edit">
                        ✏️
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Message">
                        💬
                      </button>
                      <button className="text-orange-600 hover:text-orange-900" title="Generate Link">
                        🔗
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AIRecruitmentModal = () => (
    showAIRecruitment && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🤖 AI Affiliate Recruitment</h2>
            <button
              onClick={() => setShowAIRecruitment(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Store Analysis */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Store Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Fashion & Lifestyle</div>
                  <div className="text-sm text-gray-600">Primary Niche</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">18-35</div>
                  <div className="text-sm text-gray-600">Target Age Range</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Female 70%</div>
                  <div className="text-sm text-gray-600">Primary Audience</div>
                </div>
              </div>
            </div>

            {/* AI Recommended Affiliates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 AI Recommended Affiliates</h3>
              <div className="space-y-4">
                {mockAIRecommendations.map((recommendation) => (
                  <div key={recommendation.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img
                        src={recommendation.avatar}
                        alt={recommendation.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{recommendation.name}</h4>
                          <span className="text-sm text-blue-600">@{recommendation.handle}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-lg">{recommendation.platform === 'instagram' ? '📷' : recommendation.platform === 'youtube' ? '📺' : '🎵'}</span>
                            <span className="text-sm text-gray-600">{recommendation.followers} followers</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{recommendation.bio}</p>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <span className="text-green-600">🎯</span>
                            <span className="text-sm text-gray-600">Compatibility: {recommendation.compatibilityScore}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-blue-600">📈</span>
                            <span className="text-sm text-gray-600">Engagement: {recommendation.engagementRate}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-purple-600">💰</span>
                            <span className="text-sm text-gray-600">Suggested: {recommendation.suggestedCommission}%</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Send Invite
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            View Profile
                          </button>
                          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                            Generate Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Bulk Actions</h3>
              <div className="flex space-x-4">
                <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Send Invites to Top 5
                </button>
                <button className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Generate All Messages
                </button>
                <button className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Add to Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const CampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Create New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {campaign.status}
              </span>
              <button className="text-gray-400 hover:text-gray-600">⋮</button>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Commission Rate:</span>
                <span className="text-sm font-medium">{campaign.commissionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Affiliates:</span>
                <span className="text-sm font-medium">{campaign.affiliatesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Sales:</span>
                <span className="text-sm font-medium">${campaign.totalSales.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                Edit
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading Affiliate System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤝 Affiliate Marketing System</h1>
              <p className="text-gray-600 mt-1">Manage your affiliate network and grow your business</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Total Revenue: <span className="font-bold text-green-600">${metrics?.totalRevenue?.toLocaleString()}</span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                🚀 Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'affiliates', label: 'Affiliates', icon: '👥' },
              { id: 'campaigns', label: 'Campaigns', icon: '📢' },
              { id: 'links', label: 'Link Generator', icon: '🔗' },
              { id: 'payouts', label: 'Payouts', icon: '💸' },
              { id: 'recruitment', label: 'AI Recruitment', icon: '🤖' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'affiliates' && <AffiliatesTab />}
        {activeTab === 'campaigns' && <CampaignsTab />}
        {activeTab === 'links' && <LinkGeneratorTab />}
        {activeTab === 'payouts' && <PayoutsTab />}
        {activeTab === 'recruitment' && <RecruitmentTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>

      {/* AI Recruitment Modal */}
      <AIRecruitmentModal />
    </div>
  );
};

// Additional Tab Components
const LinkGeneratorTab = () => {
  const [linkForm, setLinkForm] = useState({
    originalUrl: '',
    campaignName: '',
    utmSource: 'affiliate',
    utmMedium: 'referral',
    utmCampaign: '',
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [selectedAffiliate, setSelectedAffiliate] = useState('');

  const generateLink = () => {
    const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const baseUrl = 'https://track.b3acon.com';
    const link = `${baseUrl}/${trackingCode}?utm_source=${linkForm.utmSource}&utm_medium=${linkForm.utmMedium}&utm_campaign=${linkForm.utmCampaign}`;
    setGeneratedLink(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Affiliate Link Generator</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Affiliate
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedAffiliate}
                onChange={(e) => setSelectedAffiliate(e.target.value)}
              >
                <option value="">Choose an affiliate...</option>
                <option value="sarah">Sarah Chen - @sarahstyle</option>
                <option value="mike">Mike Rodriguez - @mikesfashion</option>
                <option value="emma">Emma Wilson - @emmawears</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product/Page URL
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourstore.com/products/example"
                value={linkForm.originalUrl}
                onChange={(e) => setLinkForm({...linkForm, originalUrl: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summer Sale 2025"
                value={linkForm.campaignName}
                onChange={(e) => setLinkForm({...linkForm, campaignName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UTM Source
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={linkForm.utmSource}
                  onChange={(e) => setLinkForm({...linkForm, utmSource: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UTM Medium
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={linkForm.utmMedium}
                  onChange={(e) => setLinkForm({...linkForm, utmMedium: e.target.value})}
                />
              </div>
            </div>

            <button
              onClick={generateLink}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Generate Tracking Link
            </button>
          </div>

          <div className="space-y-6">
            {generatedLink && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Tracking Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50"
                    value={generatedLink}
                    readOnly
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                    className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                  >
                    📋
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Link Performance Preview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Clicks:</span>
                  <span className="font-medium">250-500/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Conversion Rate:</span>
                  <span className="font-medium">3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projected Revenue:</span>
                  <span className="font-medium text-green-600">$1,200-2,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Affiliate Commission:</span>
                  <span className="font-medium text-blue-600">$120-240</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Optimization Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use descriptive campaign names for better tracking</li>
                <li>• Include discount codes to improve conversion rates</li>
                <li>• Test different UTM parameters for optimization</li>
                <li>• Provide affiliates with promotional materials</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PayoutsTab = () => {
  const [payoutMethod, setPayoutMethod] = useState('bulk');
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">💸 Payout Management</h2>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Process All Payouts
          </button>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Generate Reports
          </button>
        </div>
      </div>

      {/* Payout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">$12,450</div>
            <div className="text-sm text-gray-600 mt-1">Pending Payouts</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">23</div>
            <div className="text-sm text-gray-600 mt-1">Affiliates Due</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">$45,280</div>
            <div className="text-sm text-gray-600 mt-1">Paid This Month</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">$156K</div>
            <div className="text-sm text-gray-600 mt-1">Total Paid</div>
          </div>
        </div>
      </div>

      {/* Payout Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Pending Payouts</h3>
            <div className="flex space-x-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
              >
                <option value="bulk">Bulk Payout</option>
                <option value="individual">Individual Payouts</option>
                <option value="scheduled">Scheduled Payouts</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Affiliate</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Last Payout</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={payout.avatar} alt={payout.name} className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{payout.name}</div>
                        <div className="text-sm text-gray-500">{payout.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    ${payout.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-2">{payout.paymentMethod === 'paypal' ? '💳' : payout.paymentMethod === 'bank' ? '🏦' : '₿'}</span>
                      {payout.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payout.lastPayout}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      payout.status === 'ready' ? 'bg-green-100 text-green-800' :
                      payout.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                        Pay Now
                      </button>
                      <button className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs">
                        Hold
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RecruitmentTab = () => (
  <div className="space-y-8">
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🤖</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Affiliate Recruitment</h2>
      <p className="text-xl text-gray-600 mb-8">Let AI find the perfect affiliates for your brand</p>
      <button
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        onClick={() => setShowAIRecruitment(true)}
      >
        🚀 Start AI Recruitment
      </button>
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold text-gray-900">📈 Advanced Analytics</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Affiliate Performance Distribution</h3>
        <div className="h-64">
          <Doughnut
            data={affiliateDistributionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Commission Trends</h3>
        <div className="h-64">
          <Bar
            data={commissionTrendsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Heatmap</h3>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 28 }, (_, i) => (
          <div
            key={i}
            className={`h-8 rounded ${
              Math.random() > 0.7 ? 'bg-green-500' :
              Math.random() > 0.4 ? 'bg-green-300' :
              Math.random() > 0.2 ? 'bg-green-100' : 'bg-gray-100'
            }`}
            title={`Day ${i + 1}: ${Math.floor(Math.random() * 100)} sales`}
          />
        ))}
      </div>
    </div>
  </div>
);

// Mock Data
const mockAffiliates: Affiliate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    status: 'active',
    commissionRate: 15,
    totalSales: 45600,
    thisMonth: 8900,
    conversionRate: 4.2,
    clickCount: 2100,
    signupDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5cc?w=150',
    socialMedia: {
      instagram: '@sarahstyle',
      youtube: 'SarahStyleTV',
    },
    performance: {
      earnings: 6840,
      clicks: 2100,
      conversions: 89,
      topProducts: ['Summer Dress', 'Sunglasses', 'Sandals'],
    },
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    status: 'active',
    commissionRate: 12,
    totalSales: 32800,
    thisMonth: 5600,
    conversionRate: 3.8,
    clickCount: 1850,
    signupDate: '2024-02-03',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    socialMedia: {
      instagram: '@mikesfashion',
      tiktok: '@mikestyle',
    },
    performance: {
      earnings: 3936,
      clicks: 1850,
      conversions: 70,
      topProducts: ['Sneakers', 'Hoodie', 'Jeans'],
    },
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    status: 'pending',
    commissionRate: 10,
    totalSales: 0,
    thisMonth: 0,
    conversionRate: 0,
    clickCount: 0,
    signupDate: '2024-12-15',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    socialMedia: {
      instagram: '@emmawears',
    },
    performance: {
      earnings: 0,
      clicks: 0,
      conversions: 0,
      topProducts: [],
    },
  },
];

const mockMetrics: AffiliateMetrics = {
  totalAffiliates: 47,
  activeAffiliates: 34,
  totalRevenue: 156780,
  totalCommissionsPaid: 18420,
  averageCommission: 12.5,
  conversionRate: 3.9,
  affiliateGrowth: 23.5,
  revenueGrowth: 45.2,
  campaignGrowth: 12.8,
  commissionChange: 8.3,
  activeCampaigns: 8,
  pendingPayouts: 12450,
  topPerformers: mockAffiliates.slice(0, 3),
  recentActivity: [
    {
      id: '1',
      type: 'sale',
      affiliate: 'Sarah Chen',
      description: 'New sale: Summer Dress Collection',
      amount: 89,
      timestamp: '2 minutes ago',
      icon: '💰',
    },
    {
      id: '2',
      type: 'signup',
      affiliate: 'New Affiliate',
      description: 'Jessica Martinez joined as affiliate',
      timestamp: '15 minutes ago',
      icon: '👋',
    },
    {
      id: '3',
      type: 'milestone',
      affiliate: 'Mike Rodriguez',
      description: 'Reached $5,000 monthly milestone',
      amount: 600,
      timestamp: '1 hour ago',
      icon: '🎉',
    },
  ],
};

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2025',
    description: 'Promote our summer collection with exclusive discounts',
    commissionRate: 15,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'active',
    affiliatesCount: 23,
    totalSales: 45600,
    targetUrl: 'https://store.com/summer-sale',
  },
  {
    id: '2',
    name: 'Back to School',
    description: 'Student-focused campaign with special pricing',
    commissionRate: 12,
    startDate: '2024-08-15',
    endDate: '2024-09-30',
    status: 'active',
    affiliatesCount: 18,
    totalSales: 32100,
    targetUrl: 'https://store.com/back-to-school',
  },
];

const mockLinks: AffiliateLink[] = [
  {
    id: '1',
    affiliateId: '1',
    originalUrl: 'https://store.com/products/summer-dress',
    trackingCode: 'SARAH123',
    campaignName: 'Summer Sale 2025',
    clicks: 245,
    conversions: 12,
    revenue: 890,
    createdAt: '2024-12-01',
  },
];

const mockAIRecommendations = [
  {
    id: '1',
    name: 'Jessica Martinez',
    handle: 'jessicabeauty',
    platform: 'instagram' as const,
    followers: '125K',
    bio: 'Beauty & lifestyle content creator passionate about sustainable fashion and skincare.',
    compatibilityScore: 94,
    engagementRate: 4.2,
    suggestedCommission: 15,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: '2',
    name: 'Alex Thompson',
    handle: 'alexfits',
    platform: 'tiktok' as const,
    followers: '89K',
    bio: 'Fitness enthusiast and fashion lover sharing daily outfit inspiration.',
    compatibilityScore: 91,
    engagementRate: 5.8,
    suggestedCommission: 12,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: '3',
    name: 'Maya Patel',
    handle: 'mayastyle',
    platform: 'youtube' as const,
    followers: '156K',
    bio: 'Fashion hauls, styling tips, and lifestyle vlogs for the modern woman.',
    compatibilityScore: 89,
    engagementRate: 3.9,
    suggestedCommission: 14,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
  },
];

const mockPayouts = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    amount: 684,
    paymentMethod: 'paypal',
    lastPayout: '2024-11-15',
    status: 'ready',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5cc?w=150',
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    amount: 394,
    paymentMethod: 'bank',
    lastPayout: '2024-11-10',
    status: 'processing',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];

// Chart Data
const performanceChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
    {
      label: 'Affiliates',
      data: [15, 25, 22, 35, 42, 47],
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4,
    },
  ],
};

const affiliateDistributionData = {
  labels: ['Top Performers', 'Regular', 'New Affiliates', 'Inactive'],
  datasets: [
    {
      data: [8, 23, 12, 4],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(156, 163, 175, 0.8)',
      ],
      borderWidth: 0,
    },
  ],
};

const commissionTrendsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Commissions Paid ($)',
      data: [1200, 1900, 1500, 2500, 2200, 3000],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 1,
    },
  ],
};

export default AffiliateMarketingSystem;