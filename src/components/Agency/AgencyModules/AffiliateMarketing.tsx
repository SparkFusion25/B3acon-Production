import React, { useState } from 'react';
import { Users, Link, DollarSign, TrendingUp, Gift, CreditCard, Eye, Copy, Check, Mail, Send, Plus, Download, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AffiliateMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('affiliates');
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    company: '',
    commission_rate: 10,
    tier: 'bronze' as 'bronze' | 'silver' | 'gold' | 'platinum'
  });
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState({
    affiliate_id: '',
    campaign_name: '',
    original_url: 'https://b3acon.com',
    expires_at: ''
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    affiliate_ids: [] as string[],
    payment_method: 'paypal',
    payment_date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const handleInviteAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteForm.name || !inviteForm.email) {
      toast.error('Name and email are required');
      return;
    }
    
    // Generate a random referral code
    const referralCode = `${inviteForm.name.split(' ')[0].toUpperCase()}${Math.floor(Math.random() * 10000)}`;
    
    // In a real implementation, we would save the affiliate to the database
    // and send an invitation email
    
    toast.success(`Invitation sent to ${inviteForm.email}`);
    setShowInviteModal(false);
    setInviteForm({
      name: '',
      email: '',
      company: '',
      commission_rate: 10,
      tier: 'bronze'
    });
  };
  
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkForm.affiliate_id || !linkForm.campaign_name) {
      toast.error('Affiliate and campaign name are required');
      return;
    }
    
    // Generate a tracking URL
    const trackingUrl = `https://b3acon.com/ref/${linkForm.affiliate_id.toLowerCase()}/${linkForm.campaign_name.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(trackingUrl).then(() => {
      toast.success('Affiliate link generated and copied to clipboard');
      setShowGenerateLinkModal(false);
      setLinkForm({
        affiliate_id: '',
        campaign_name: '',
        original_url: 'https://b3acon.com',
        expires_at: ''
      });
    }).catch(() => {
      toast.error('Failed to copy link to clipboard');
    });
  };
  
  const handleProcessPayments = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentForm.affiliate_ids.length === 0) {
      toast.error('Please select at least one affiliate');
      return;
    }
    
    // In a real implementation, we would process payments through a payment gateway
    
    toast.success(`Processing payments for ${paymentForm.affiliate_ids.length} affiliates`);
    setShowPaymentModal(false);
    setPaymentForm({
      affiliate_ids: [],
      payment_method: 'paypal',
      payment_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };
  
  const handleExportReport = () => {
    toast.success('Exporting affiliate report');
  };
  
  const handleViewAffiliate = (affiliateId: number) => {
    toast.success(`Viewing affiliate #${affiliateId} details`);
  };
  
  const toggleAffiliateSelection = (affiliateId: string) => {
    if (paymentForm.affiliate_ids.includes(affiliateId)) {
      setPaymentForm({
        ...paymentForm,
        affiliate_ids: paymentForm.affiliate_ids.filter(id => id !== affiliateId)
      });
    } else {
      setPaymentForm({
        ...paymentForm,
        affiliate_ids: [...paymentForm.affiliate_ids, affiliateId]
      });
    }
  };

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
        <button 
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Users className="w-4 h-4 mr-2" />
          Invite Affiliate
        </button>
      </div>
      
      {/* Invite Affiliate Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Invite Affiliate Partner</h4>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleInviteAffiliate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={inviteForm.company}
                  onChange={(e) => setInviteForm({...inviteForm, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Company Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={inviteForm.commission_rate}
                  onChange={(e) => setInviteForm({...inviteForm, commission_rate: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                <select
                  value={inviteForm.tier}
                  onChange={(e) => setInviteForm({...inviteForm, tier: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                      <button 
                        onClick={() => handleViewAffiliate(affiliate.id)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
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
        <button 
          onClick={() => setShowGenerateLinkModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Link className="w-4 h-4 mr-2" />
          Generate Link
        </button>
      </div>
      
      {/* Generate Link Modal */}
      {showGenerateLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Generate Affiliate Link</h4>
              <button 
                onClick={() => setShowGenerateLinkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleGenerateLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate</label>
                <select
                  value={linkForm.affiliate_id}
                  onChange={(e) => setLinkForm({...linkForm, affiliate_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  required
                >
                  <option value="">Select Affiliate</option>
                  {affiliates.map(affiliate => (
                    <option key={affiliate.id} value={affiliate.referral_code}>
                      {affiliate.name} ({affiliate.referral_code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={linkForm.campaign_name}
                  onChange={(e) => setLinkForm({...linkForm, campaign_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Summer2025"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original URL</label>
                <input
                  type="url"
                  value={linkForm.original_url}
                  onChange={(e) => setLinkForm({...linkForm, original_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="https://b3acon.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={linkForm.expires_at}
                  onChange={(e) => setLinkForm({...linkForm, expires_at: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowGenerateLinkModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Link className="w-4 h-4" />
                  <span>Generate Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        <button 
          onClick={() => setShowPaymentModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Process Payments
        </button>
      </div>
      
      {/* Process Payments Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Process Affiliate Payments</h4>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleProcessPayments} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Affiliates</label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {affiliates.map(affiliate => (
                    <div key={affiliate.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        id={`affiliate-${affiliate.id}`}
                        checked={paymentForm.affiliate_ids.includes(affiliate.id.toString())}
                        onChange={() => toggleAffiliateSelection(affiliate.id.toString())}
                        className="mr-2"
                      />
                      <label htmlFor={`affiliate-${affiliate.id}`} className="flex-1 cursor-pointer">
                        <div className="font-medium text-gray-900">{affiliate.name}</div>
                        <div className="text-sm text-gray-600">${affiliate.total_earnings.toLocaleString()} earned</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({...paymentForm, payment_method: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={paymentForm.payment_date}
                  onChange={(e) => setPaymentForm({...paymentForm, payment_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  rows={3}
                  placeholder="Additional payment details or notes"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentForm.affiliate_ids.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Process Payments</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        <button 
          onClick={handleExportReport}
          className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
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