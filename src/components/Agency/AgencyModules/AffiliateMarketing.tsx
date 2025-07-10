import React, { useState } from 'react';
import { Users, Link, DollarSign, TrendingUp, Gift, CreditCard, Eye, Copy, Check } from 'lucide-react';

const AffiliateMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('affiliates');
  const [copied, setCopied] = useState(false);

  const affiliates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@marketingpro.com',
      company: 'Marketing Pro Agency',
      status: 'active',
      tier: 'gold',
      commission_rate: 15,
      total_earnings: 12450,
      total_referrals: 8,
      conversion_rate: 12.5,
      referral_code: 'SARAH2024',
      joined_date: '2024-01-15',
      last_activity: '2024-01-20'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@digitalboost.com',
      company: 'Digital Boost',
      status: 'active',
      tier: 'silver',
      commission_rate: 12,
      total_earnings: 8900,
      total_referrals: 6,
      conversion_rate: 10.2,
      referral_code: 'MIKE2024',
      joined_date: '2024-01-10',
      last_activity: '2024-01-19'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily@growthagency.com',
      company: 'Growth Agency',
      status: 'pending',
      tier: 'bronze',
      commission_rate: 10,
      total_earnings: 0,
      total_referrals: 0,
      conversion_rate: 0,
      referral_code: 'EMILY2024',
      joined_date: '2024-01-18',
      last_activity: '2024-01-18'
    }
  ];

  const referrals = [
    {
      id: 1,
      affiliate_name: 'Sarah Johnson',
      client_name: 'TechStart Inc',
      client_email: 'contact@techstart.com',
      service_type: 'SEO Package',
      deal_value: 5000,
      commission_amount: 750,
      status: 'converted',
      referral_date: '2024-01-15',
      conversion_date: '2024-01-18'
    },
    {
      id: 2,
      affiliate_name: 'Mike Chen',
      client_name: 'RetailCorp',
      client_email: 'info@retailcorp.com',
      service_type: 'Social Media Management',
      deal_value: 3000,
      commission_amount: 360,
      status: 'qualified',
      referral_date: '2024-01-16',
      conversion_date: null
    }
  ];

  const commissions = [
    {
      id: 1,
      affiliate_name: 'Sarah Johnson',
      amount: 750,
      commission_rate: 15,
      status: 'approved',
      transaction_date: '2024-01-18',
      payment_date: null,
      client: 'TechStart Inc'
    },
    {
      id: 2,
      affiliate_name: 'Mike Chen',
      amount: 480,
      commission_rate: 12,
      status: 'paid',
      transaction_date: '2024-01-10',
      payment_date: '2024-01-15',
      client: 'BusinessFlow'
    }
  ];

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderAffiliates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Affiliate Management</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          <Users className="w-4 h-4 mr-2" />
          Invite Affiliate
        </button>
      </div>

      {/* Affiliate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Affiliates</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{affiliates.length}</div>
          <p className="text-sm text-green-600">↗ +2 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Earnings</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${affiliates.reduce((sum, a) => sum + a.total_earnings, 0).toLocaleString()}
          </div>
          <p className="text-sm text-green-600">↗ +18% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Referrals</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {affiliates.reduce((sum, a) => sum + a.total_referrals, 0)}
          </div>
          <p className="text-sm text-green-600">↗ +25% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Avg Conversion</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {(affiliates.reduce((sum, a) => sum + a.conversion_rate, 0) / affiliates.length).toFixed(1)}%
          </div>
          <p className="text-sm text-green-600">↗ +2.1% this month</p>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Affiliate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Tier</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Commission</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Earnings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Referrals</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate) => (
                <tr key={affiliate.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-medium">
                        {affiliate.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{affiliate.name}</div>
                        <div className="text-sm text-gray-600">{affiliate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTierColor(affiliate.tier)}`}>
                      {affiliate.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{affiliate.commission_rate}%</td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    ${affiliate.total_earnings.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{affiliate.total_referrals}</td>
                  <td className="py-3 px-4 text-gray-600">{affiliate.conversion_rate}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(affiliate.status)}`}>
                      {affiliate.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => copyToClipboard(`https://b3acon.com/ref/${affiliate.referral_code}`)}
                        className="p-1 text-gray-400 hover:text-green-600"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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

  const renderReferrals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Referral Tracking</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
          <Link className="w-4 h-4 mr-2" />
          Generate Link
        </button>
      </div>

      <div className="space-y-4">
        {referrals.map((referral) => (
          <div key={referral.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{referral.client_name}</h4>
                  <p className="text-sm text-gray-600">Referred by: {referral.affiliate_name}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                referral.status === 'converted' ? 'bg-green-100 text-green-800' :
                referral.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                referral.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {referral.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Service:</span>
                <div className="font-medium text-gray-900">{referral.service_type}</div>
              </div>
              <div>
                <span className="text-gray-600">Deal Value:</span>
                <div className="font-medium text-gray-900">${referral.deal_value.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Commission:</span>
                <div className="font-medium text-green-600">${referral.commission_amount.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Referral Date:</span>
                <div className="font-medium text-gray-900">
                  {new Date(referral.referral_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommissions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Commission Management</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
          <CreditCard className="w-4 h-4 mr-2" />
          Process Payments
        </button>
      </div>

      <div className="space-y-4">
        {commissions.map((commission) => (
          <div key={commission.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{commission.affiliate_name}</h4>
                  <p className="text-sm text-gray-600">Client: {commission.client}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                commission.status === 'paid' ? 'bg-green-100 text-green-800' :
                commission.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                commission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {commission.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Amount:</span>
                <div className="font-medium text-gray-900">${commission.amount.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Rate:</span>
                <div className="font-medium text-gray-900">{commission.commission_rate}%</div>
              </div>
              <div>
                <span className="text-gray-600">Transaction Date:</span>
                <div className="font-medium text-gray-900">
                  {new Date(commission.transaction_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Payment Date:</span>
                <div className="font-medium text-gray-900">
                  {commission.payment_date ? new Date(commission.payment_date).toLocaleDateString() : 'Pending'}
                </div>
              </div>
            </div>

            {commission.status === 'approved' && (
              <div className="flex items-center justify-end space-x-2 mt-4">
                <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                  Pay Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all">
          <CreditCard className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Payment Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Schedule</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent">
              <option>Monthly</option>
              <option>Bi-weekly</option>
              <option>Weekly</option>
              <option>Manual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout</label>
            <input
              type="number"
              placeholder="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Method</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent">
              <option>PayPal</option>
              <option>Bank Transfer</option>
              <option>Check</option>
              <option>Stripe</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent">
              <option>Net 30</option>
              <option>Net 15</option>
              <option>Net 7</option>
              <option>Immediate</option>
            </select>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-900 mb-2">Automated Payment Features</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Automatic commission calculations</li>
            <li>• Scheduled payment processing</li>
            <li>• Tax document generation</li>
            <li>• Payment tracking and reporting</li>
            <li>• Multi-currency support</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'affiliates', label: 'Affiliates', icon: Users },
    { id: 'referrals', label: 'Referrals', icon: Gift },
    { id: 'commissions', label: 'Commissions', icon: DollarSign },
    { id: 'payments', label: 'Payments', icon: CreditCard }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Affiliate Marketing Hub</h2>
        <p className="text-gray-600">Recruit, manage, and reward affiliate partners</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-signal-blue text-signal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'affiliates' && renderAffiliates()}
        {activeTab === 'referrals' && renderReferrals()}
        {activeTab === 'commissions' && renderCommissions()}
        {activeTab === 'payments' && renderPayments()}
      </div>
    </div>
  );
};

export default AffiliateMarketing;