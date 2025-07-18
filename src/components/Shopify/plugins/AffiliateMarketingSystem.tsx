import React, { useState, useEffect } from 'react';
import { Users, Link, DollarSign, TrendingUp, Gift, CreditCard, Eye, Copy, Check, Mail, Send, Plus, Download, ExternalLink, Search, Filter, BarChart3, Target, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types for Affiliate System
interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  commissionRate: number;
  totalEarnings: number;
  totalReferrals: number;
  conversionRate: number;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  socialMedia: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };
  compatibility: number; // AI compatibility score
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  commissionRate: number;
  status: 'active' | 'paused' | 'ended';
  startDate: string;
  endDate: string;
  clicks: number;
  conversions: number;
  revenue: number;
  affiliateCount: number;
}

interface AffiliateLink {
  id: string;
  affiliateId: string;
  campaignId: string;
  originalUrl: string;
  trackingUrl: string;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
}

interface Payout {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'paypal' | 'stripe' | 'bank_transfer';
  scheduledDate: string;
  completedDate?: string;
}

const AffiliateMarketingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls - replace with real API endpoints
      const affiliatesData = await fetchAffiliates();
      const campaignsData = await fetchCampaigns();
      const linksData = await fetchAffiliateLinks();
      const payoutsData = await fetchPayouts();
      
      setAffiliates(affiliatesData);
      setCampaigns(campaignsData);
      setAffiliateLinks(linksData);
      setPayouts(payoutsData);
    } catch (error) {
      toast.error('Failed to load affiliate data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Real API functions (replace URLs with actual endpoints)
  const fetchAffiliates = async (): Promise<Affiliate[]> => {
    // Replace with actual API call
    return [
      {
        id: 'aff_001',
        name: 'Sarah Johnson',
        email: 'sarah@influencer.com',
        referralCode: 'SARAH2024',
        tier: 'gold',
        commissionRate: 15,
        totalEarnings: 8420.50,
        totalReferrals: 127,
        conversionRate: 8.3,
        status: 'active',
        joinedDate: '2024-01-15',
        socialMedia: {
          instagram: '@sarahstyle',
          youtube: 'SarahLifestyle',
          website: 'sarahjohnson.com'
        },
        compatibility: 94
      },
      {
        id: 'aff_002',
        name: 'Mike Chen',
        email: 'mike@techreview.com',
        referralCode: 'MIKE2024',
        tier: 'platinum',
        commissionRate: 20,
        totalEarnings: 15680.75,
        totalReferrals: 203,
        conversionRate: 12.1,
        status: 'active',
        joinedDate: '2023-11-22',
        socialMedia: {
          youtube: 'TechWithMike',
          website: 'miketech.reviews'
        },
        compatibility: 98
      }
    ];
  };

  const fetchCampaigns = async (): Promise<Campaign[]> => {
    return [
      {
        id: 'camp_001',
        name: 'Black Friday 2024',
        description: 'Special Black Friday promotion with increased commissions',
        commissionRate: 25,
        status: 'active',
        startDate: '2024-11-20',
        endDate: '2024-11-30',
        clicks: 15420,
        conversions: 1847,
        revenue: 124680.50,
        affiliateCount: 45
      },
      {
        id: 'camp_002',
        name: 'New Product Launch',
        description: 'Promote our latest product line',
        commissionRate: 18,
        status: 'active',
        startDate: '2024-10-01',
        endDate: '2024-12-31',
        clicks: 8930,
        conversions: 892,
        revenue: 67840.25,
        affiliateCount: 28
      }
    ];
  };

  const fetchAffiliateLinks = async (): Promise<AffiliateLink[]> => {
    return [
      {
        id: 'link_001',
        affiliateId: 'aff_001',
        campaignId: 'camp_001',
        originalUrl: 'https://store.example.com/products/special-deal',
        trackingUrl: 'https://store.example.com/ref/SARAH2024/special-deal?utm_campaign=bf2024',
        clicks: 892,
        conversions: 74,
        revenue: 4680.50,
        createdAt: '2024-11-01'
      }
    ];
  };

  const fetchPayouts = async (): Promise<Payout[]> => {
    return [
      {
        id: 'payout_001',
        affiliateId: 'aff_001',
        amount: 840.25,
        status: 'completed',
        paymentMethod: 'paypal',
        scheduledDate: '2024-11-01',
        completedDate: '2024-11-01'
      }
    ];
  };

  // Real business logic functions
  const inviteAffiliate = async (affiliateData: Partial<Affiliate>) => {
    try {
      const newAffiliate: Affiliate = {
        id: `aff_${Date.now()}`,
        name: affiliateData.name || '',
        email: affiliateData.email || '',
        referralCode: generateReferralCode(affiliateData.name || ''),
        tier: affiliateData.tier || 'bronze',
        commissionRate: getTierCommissionRate(affiliateData.tier || 'bronze'),
        totalEarnings: 0,
        totalReferrals: 0,
        conversionRate: 0,
        status: 'pending',
        joinedDate: new Date().toISOString().split('T')[0],
        socialMedia: affiliateData.socialMedia || {},
        compatibility: calculateCompatibilityScore(affiliateData)
      };

      // API call to create affiliate
      await createAffiliate(newAffiliate);
      
      setAffiliates([...affiliates, newAffiliate]);
      toast.success(`Invitation sent to ${affiliateData.email}`);
      
      // Send actual invitation email
      await sendInvitationEmail(newAffiliate);
      
    } catch (error) {
      toast.error('Failed to invite affiliate');
      console.error('Error inviting affiliate:', error);
    }
  };

  const generateTrackingLink = async (affiliateId: string, campaignId: string, originalUrl: string) => {
    try {
      const affiliate = affiliates.find(a => a.id === affiliateId);
      if (!affiliate) throw new Error('Affiliate not found');

      const trackingParams = new URLSearchParams({
        ref: affiliate.referralCode,
        campaign: campaignId,
        utm_source: 'affiliate',
        utm_medium: affiliate.referralCode,
        utm_campaign: campaignId
      });

      const trackingUrl = `${originalUrl}?${trackingParams.toString()}`;
      
      const newLink: AffiliateLink = {
        id: `link_${Date.now()}`,
        affiliateId,
        campaignId,
        originalUrl,
        trackingUrl,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        createdAt: new Date().toISOString()
      };

      // API call to save link
      await saveAffiliateLink(newLink);
      
      setAffiliateLinks([...affiliateLinks, newLink]);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(trackingUrl);
      toast.success('Tracking link generated and copied to clipboard!');
      
      return trackingUrl;
    } catch (error) {
      toast.error('Failed to generate tracking link');
      console.error('Error generating link:', error);
      throw error;
    }
  };

  const processPayouts = async (affiliateIds: string[], paymentMethod: string) => {
    try {
      const payoutPromises = affiliateIds.map(async (affiliateId) => {
        const affiliate = affiliates.find(a => a.id === affiliateId);
        if (!affiliate) return;

        const pendingEarnings = calculatePendingEarnings(affiliateId);
        
        if (pendingEarnings <= 0) {
          toast.warning(`${affiliate.name} has no pending earnings`);
          return;
        }

        const payout: Payout = {
          id: `payout_${Date.now()}_${affiliateId}`,
          affiliateId,
          amount: pendingEarnings,
          status: 'processing',
          paymentMethod: paymentMethod as any,
          scheduledDate: new Date().toISOString().split('T')[0]
        };

        // API call to process payout
        await processPayment(payout);
        
        return payout;
      });

      const newPayouts = (await Promise.all(payoutPromises)).filter(Boolean) as Payout[];
      setPayouts([...payouts, ...newPayouts]);
      
      toast.success(`Processing ${newPayouts.length} payouts`);
      
      // Send confirmation emails
      await sendPayoutConfirmationEmails(newPayouts);
      
    } catch (error) {
      toast.error('Failed to process payouts');
      console.error('Error processing payouts:', error);
    }
  };

  // Helper functions
  const generateReferralCode = (name: string): string => {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const namePrefix = cleanName.substring(0, 4).padEnd(4, 'X');
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${namePrefix}${randomSuffix}`;
  };

  const getTierCommissionRate = (tier: string): number => {
    const rates = { bronze: 10, silver: 12, gold: 15, platinum: 20 };
    return rates[tier as keyof typeof rates] || 10;
  };

  const calculateCompatibilityScore = (affiliateData: Partial<Affiliate>): number => {
    let score = 50; // Base score
    
    if (affiliateData.socialMedia?.instagram) score += 15;
    if (affiliateData.socialMedia?.youtube) score += 20;
    if (affiliateData.socialMedia?.tiktok) score += 15;
    if (affiliateData.socialMedia?.website) score += 10;
    
    // Add more scoring logic based on your criteria
    return Math.min(score, 100);
  };

  const calculatePendingEarnings = (affiliateId: string): number => {
    const affiliate = affiliates.find(a => a.id === affiliateId);
    if (!affiliate) return 0;
    
    // Calculate based on recent conversions minus already paid amounts
    const recentEarnings = affiliateLinks
      .filter(link => link.affiliateId === affiliateId)
      .reduce((total, link) => total + (link.revenue * affiliate.commissionRate / 100), 0);
    
    const paidAmount = payouts
      .filter(p => p.affiliateId === affiliateId && p.status === 'completed')
      .reduce((total, p) => total + p.amount, 0);
    
    return Math.max(0, recentEarnings - paidAmount);
  };

  // API calls (implement these with your backend)
  const createAffiliate = async (affiliate: Affiliate) => {
    // POST /api/affiliates
    console.log('Creating affiliate:', affiliate);
  };

  const saveAffiliateLink = async (link: AffiliateLink) => {
    // POST /api/affiliate-links
    console.log('Saving link:', link);
  };

  const processPayment = async (payout: Payout) => {
    // POST /api/payouts
    console.log('Processing payment:', payout);
  };

  const sendInvitationEmail = async (affiliate: Affiliate) => {
    // POST /api/emails/invitation
    console.log('Sending invitation to:', affiliate.email);
  };

  const sendPayoutConfirmationEmails = async (payouts: Payout[]) => {
    // POST /api/emails/payout-confirmation
    console.log('Sending payout confirmations:', payouts);
  };

  // Filter functions
  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || affiliate.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  // Render functions
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Affiliates</p>
              <p className="text-3xl font-bold">{affiliates.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Revenue</p>
              <p className="text-3xl font-bold">
                ${affiliates.reduce((sum, a) => sum + a.totalEarnings, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Active Campaigns</p>
              <p className="text-3xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Conversion Rate</p>
              <p className="text-3xl font-bold">
                {(affiliates.reduce((sum, a) => sum + a.conversionRate, 0) / affiliates.length || 0).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Recent Activity & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {affiliates
              .sort((a, b) => b.totalEarnings - a.totalEarnings)
              .slice(0, 5)
              .map((affiliate, index) => (
                <div key={affiliate.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{affiliate.name}</p>
                    <p className="text-sm text-gray-600">${affiliate.totalEarnings.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{affiliate.totalReferrals} sales</p>
                    <p className="text-xs text-gray-500">{affiliate.conversionRate}% conversion</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Clicks</p>
                    <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conversions</p>
                    <p className="font-semibold">{campaign.conversions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-semibold">${campaign.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAffiliateManagement = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search affiliates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={selectedAffiliates.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-4 h-4" />
            <span>Process Payouts ({selectedAffiliates.length})</span>
          </button>
          
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Affiliate</span>
          </button>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAffiliates(filteredAffiliates.map(a => a.id));
                      } else {
                        setSelectedAffiliates([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAffiliates.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600"
                      checked={selectedAffiliates.includes(affiliate.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAffiliates([...selectedAffiliates, affiliate.id]);
                        } else {
                          setSelectedAffiliates(selectedAffiliates.filter(id => id !== affiliate.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">{affiliate.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
                        <div className="text-sm text-gray-500">{affiliate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      affiliate.tier === 'platinum' ? 'bg-purple-100 text-purple-800' :
                      affiliate.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      affiliate.tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {affiliate.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.commissionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${affiliate.totalEarnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.totalReferrals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.conversionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      affiliate.status === 'active' ? 'bg-green-100 text-green-800' :
                      affiliate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {affiliate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toast.success(`Viewing ${affiliate.name} details`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => generateTrackingLink(affiliate.id, campaigns[0]?.id || '', 'https://store.example.com')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Link className="w-4 h-4" />
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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'affiliates', label: 'Affiliate Management', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'links', label: 'Link Generator', icon: Link },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Affiliate Marketing System</h1>
            <p className="text-gray-600">Manage partners, track performance, and process payouts</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'affiliates' && renderAffiliateManagement()}
        {activeTab === 'campaigns' && <div className="text-center py-12 text-gray-500">Campaign management coming soon</div>}
        {activeTab === 'links' && <div className="text-center py-12 text-gray-500">Link generator coming soon</div>}
        {activeTab === 'payouts' && <div className="text-center py-12 text-gray-500">Payout management coming soon</div>}
        {activeTab === 'analytics' && <div className="text-center py-12 text-gray-500">Analytics dashboard coming soon</div>}
      </div>

      {/* Modals would go here */}
    </div>
  );
};

export default AffiliateMarketingSystem;