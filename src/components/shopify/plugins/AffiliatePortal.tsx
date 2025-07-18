import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AffiliateData {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
  totalEarnings: number;
  monthlyEarnings: number;
  totalClicks: number;
  monthlyClicks: number;
  conversionRate: number;
  pendingPayout: number;
  nextPayoutDate: string;
  joinDate: string;
  status: 'active' | 'pending' | 'suspended';
}

interface LinkData {
  id: string;
  url: string;
  shortUrl: string;
  campaign: string;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
}

interface PayoutHistory {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'processing' | 'pending';
  method: string;
}

const AffiliatePortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'links' | 'analytics' | 'payouts' | 'marketing'>('dashboard');
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  // New link creation form
  const [newLinkForm, setNewLinkForm] = useState({
    url: '',
    campaign: '',
    description: ''
  });

  useEffect(() => {
    loadAffiliateData();
  }, [timeframe]);

  const loadAffiliateData = async () => {
    // Simulate API call - replace with real API
    setTimeout(() => {
      setAffiliateData(mockAffiliateData);
      setLinks(mockLinks);
      setPayoutHistory(mockPayoutHistory);
      setLoading(false);
    }, 1000);
  };

  const generateNewLink = async () => {
    if (!newLinkForm.url) return;

    const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newLink: LinkData = {
      id: Date.now().toString(),
      url: newLinkForm.url,
      shortUrl: `https://track.b3acon.com/${trackingCode}`,
      campaign: newLinkForm.campaign || 'General',
      clicks: 0,
      conversions: 0,
      revenue: 0,
      createdAt: new Date().toISOString()
    };

    setLinks([newLink, ...links]);
    setNewLinkForm({ url: '', campaign: '', description: '' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const DashboardTab = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border-l-4 border-green-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${affiliateData?.totalEarnings?.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-green-600">
                <span className="text-sm font-medium">↗ +12.5% this month</span>
              </div>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-blue-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {affiliateData?.totalClicks?.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-blue-600">
                <span className="text-sm font-medium">↗ +8.3% this month</span>
              </div>
            </div>
            <div className="text-4xl">👆</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-purple-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {affiliateData?.conversionRate?.toFixed(1)}%
              </p>
              <div className="flex items-center mt-2 text-purple-600">
                <span className="text-sm font-medium">↗ +2.1% this month</span>
              </div>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-orange-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Payout</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${affiliateData?.pendingPayout?.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-orange-600">
                <span className="text-sm font-medium">Next: {affiliateData?.nextPayoutDate}</span>
              </div>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Performance Overview</h3>
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

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">🚀 Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-300"
            onClick={() => setActiveTab('links')}
          >
            <div className="text-2xl mb-2">🔗</div>
            <div className="font-semibold">Generate New Link</div>
            <div className="text-sm opacity-80">Create tracking links</div>
          </button>
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-300"
            onClick={() => setActiveTab('marketing')}
          >
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold">Marketing Materials</div>
            <div className="text-sm opacity-80">Download assets</div>
          </button>
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-300"
            onClick={() => setActiveTab('payouts')}
          >
            <div className="text-2xl mb-2">💸</div>
            <div className="font-semibold">Request Payout</div>
            <div className="text-sm opacity-80">Withdraw earnings</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Recent Activity</h3>
        <div className="space-y-4">
          {mockRecentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
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
  );

  const LinksTab = () => (
    <div className="space-y-8">
      {/* Link Generator */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Generate New Tracking Link</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product/Page URL
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://store.com/products/example"
                value={newLinkForm.url}
                onChange={(e) => setNewLinkForm({...newLinkForm, url: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summer Sale 2025"
                value={newLinkForm.campaign}
                onChange={(e) => setNewLinkForm({...newLinkForm, campaign: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Notes about this link..."
                rows={3}
                value={newLinkForm.description}
                onChange={(e) => setNewLinkForm({...newLinkForm, description: e.target.value})}
              />
            </div>

            <button
              onClick={generateNewLink}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Generate Tracking Link
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Pro Tips</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Use descriptive campaign names to track performance</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Share links on multiple platforms for better reach</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Include personal recommendations in your posts</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Track which content performs best for optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Tracking Links</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {link.shortUrl}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {link.url}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{link.campaign}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{link.clicks}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{link.conversions}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${link.revenue}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(link.shortUrl)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Copy Link"
                      >
                        📋
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Analytics">
                        📊
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

  const PayoutsTab = () => (
    <div className="space-y-8">
      {/* Payout Request */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">💸 Request Payout</h2>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              ${affiliateData?.pendingPayout?.toLocaleString()}
            </div>
            <div className="text-gray-600">Available for Payout</div>
            <div className="text-sm text-gray-500 mt-2">
              Minimum payout: $50 • Commission rate: {affiliateData?.commissionRate}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>PayPal - user@email.com</option>
              <option>Bank Transfer - ****1234</option>
              <option>Add New Payment Method</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Withdraw
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
              max={affiliateData?.pendingPayout}
            />
          </div>
        </div>

        <button className="w-full mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
          Request Payout
        </button>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{payout.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${payout.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payout.method}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payout.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MarketingTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📦 Marketing Materials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketingAssets.map((asset) => (
            <div key={asset.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <div className="text-center">
                <div className="text-4xl mb-3">{asset.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{asset.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
                <div className="text-xs text-gray-500 mb-4">
                  {asset.formats.join(', ')} • {asset.sizes.join(', ')}
                </div>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Download Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading your affiliate dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">🤝 Affiliate Portal</h1>
              <p className="text-gray-600 mt-1">Welcome back, {affiliateData?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Status: <span className={`font-bold ${
                  affiliateData?.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {affiliateData?.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Commission: <span className="font-bold text-blue-600">{affiliateData?.commissionRate}%</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'links', label: 'Link Generator', icon: '🔗' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'payouts', label: 'Payouts', icon: '💸' },
              { id: 'marketing', label: 'Marketing Materials', icon: '📦' },
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
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'links' && <LinksTab />}
        {activeTab === 'payouts' && <PayoutsTab />}
        {activeTab === 'marketing' && <MarketingTab />}
      </div>
    </div>
  );
};

// Mock Data
const mockAffiliateData: AffiliateData = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah@example.com',
  commissionRate: 15,
  totalEarnings: 8540,
  monthlyEarnings: 1200,
  totalClicks: 5420,
  monthlyClicks: 890,
  conversionRate: 4.2,
  pendingPayout: 650,
  nextPayoutDate: 'Dec 31, 2024',
  joinDate: '2024-01-15',
  status: 'active'
};

const mockLinks: LinkData[] = [
  {
    id: '1',
    url: 'https://store.com/products/summer-dress',
    shortUrl: 'https://track.b3acon.com/SARAH123',
    campaign: 'Summer Sale 2025',
    clicks: 245,
    conversions: 12,
    revenue: 890,
    createdAt: '2024-12-01'
  },
  {
    id: '2',
    url: 'https://store.com/products/winter-coat',
    shortUrl: 'https://track.b3acon.com/SARAH456',
    campaign: 'Winter Collection',
    clicks: 189,
    conversions: 8,
    revenue: 560,
    createdAt: '2024-11-15'
  }
];

const mockPayoutHistory: PayoutHistory[] = [
  {
    id: '1',
    amount: 450,
    date: '2024-11-30',
    status: 'completed',
    method: 'PayPal'
  },
  {
    id: '2',
    amount: 320,
    date: '2024-10-31',
    status: 'completed',
    method: 'PayPal'
  },
  {
    id: '3',
    amount: 180,
    date: '2024-12-15',
    status: 'processing',
    method: 'Bank Transfer'
  }
];

const mockRecentActivity = [
  {
    id: '1',
    description: 'New sale: Summer Dress Collection',
    amount: 89,
    timestamp: '2 hours ago',
    icon: '💰'
  },
  {
    id: '2',
    description: 'Link clicked 15 times today',
    timestamp: '4 hours ago',
    icon: '👆'
  },
  {
    id: '3',
    description: 'Commission rate increased to 15%',
    timestamp: '1 day ago',
    icon: '📈'
  }
];

const marketingAssets = [
  {
    id: '1',
    name: 'Social Media Pack',
    description: 'Instagram and Facebook ready graphics',
    icon: '📱',
    formats: ['PNG', 'JPG'],
    sizes: ['1080x1080', '1200x630']
  },
  {
    id: '2',
    name: 'Banner Ads',
    description: 'Website banner advertisements',
    icon: '🖼️',
    formats: ['PNG', 'GIF'],
    sizes: ['728x90', '300x250', '160x600']
  },
  {
    id: '3',
    name: 'Email Templates',
    description: 'Professional email designs',
    icon: '📧',
    formats: ['HTML', 'Sketch'],
    sizes: ['600px width']
  }
];

const performanceChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Earnings ($)',
      data: [1200, 1900, 1500, 2200, 1800, 2400],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    },
    {
      label: 'Clicks',
      data: [450, 620, 580, 720, 650, 890],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
};

export default AffiliatePortal;