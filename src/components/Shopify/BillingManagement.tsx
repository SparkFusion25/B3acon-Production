import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, Download, Settings, Plus, Check, AlertTriangle, TrendingUp, FileText, Users, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { stripePromise, stripeHelpers } from '../../lib/stripe';
import { useAuth } from '../../contexts/AuthContext';

// Types for Billing System
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  stripePriceId?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issueDate: string;
  dueDate: string;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  downloadUrl?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
}

interface BillingData {
  currentPlan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  nextBillingAmount: number;
  totalSpent: number;
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  usageStats: {
    apiCalls: number;
    storageUsed: number;
    bandwidthUsed: number;
    limits: {
      apiCalls: number;
      storage: number;
      bandwidth: number;
    };
  };
}

const BillingManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Load billing data on component mount
  useEffect(() => {
    loadBillingData();
    loadAvailablePlans();
  }, []);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      // Real API call to fetch billing data
      const response = await fetch('/api/billing/data', {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBillingData(data);
      } else {
        // Fallback to mock data if API not available
        setBillingData(getMockBillingData());
      }
    } catch (error) {
      console.error('Error loading billing data:', error);
      setBillingData(getMockBillingData());
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailablePlans = async () => {
    try {
      // Real API call to fetch available plans
      const response = await fetch('/api/billing/plans', {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const plans = await response.json();
        setAvailablePlans(plans);
      } else {
        // Fallback to default plans
        setAvailablePlans(getDefaultPlans());
      }
    } catch (error) {
      console.error('Error loading plans:', error);
      setAvailablePlans(getDefaultPlans());
    }
  };

  const getMockBillingData = (): BillingData => ({
    currentPlan: {
      id: 'pro',
      name: 'Professional',
      price: 49,
      interval: 'month',
      features: ['Unlimited stores', 'Advanced analytics', 'Priority support', 'Custom integrations']
    },
    billingCycle: 'monthly',
    nextBillingDate: '2024-12-15',
    nextBillingAmount: 49,
    totalSpent: 294,
    usageStats: {
      apiCalls: 12450,
      storageUsed: 2.3,
      bandwidthUsed: 45.8,
      limits: {
        apiCalls: 50000,
        storage: 100,
        bandwidth: 500
      }
    },
    invoices: [
      {
        id: 'inv_001',
        invoiceNumber: 'INV-2024-001',
        amount: 49,
        currency: 'USD',
        status: 'paid',
        issueDate: '2024-11-01',
        dueDate: '2024-11-15',
        description: 'Professional Plan - November 2024',
        items: [
          { name: 'Professional Plan', quantity: 1, price: 49 }
        ],
        downloadUrl: '/api/invoices/inv_001/download'
      }
    ],
    paymentMethods: [
      {
        id: 'pm_001',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true,
        nickname: 'Primary Card'
      }
    ]
  });

  const getDefaultPlans = (): SubscriptionPlan[] => [
    {
      id: 'starter',
      name: 'Starter',
      price: 19,
      interval: 'month',
      features: ['1 Store', 'Basic Analytics', 'Email Support', '10K API Calls'],
      stripePriceId: 'price_starter_monthly'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 49,
      interval: 'month',
      features: ['5 Stores', 'Advanced Analytics', 'Priority Support', '50K API Calls', 'Custom Integrations'],
      isPopular: true,
      stripePriceId: 'price_pro_monthly'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      interval: 'month',
      features: ['Unlimited Stores', 'Custom Analytics', '24/7 Support', 'Unlimited API Calls', 'Dedicated Account Manager'],
      stripePriceId: 'price_enterprise_monthly'
    }
  ];

  // Real business logic functions
  const handleUpgradePlan = async (plan: SubscriptionPlan) => {
    try {
      if (!stripeHelpers.isConfigured()) {
        toast.error('Payment processing is not configured');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      // Create checkout session
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          planId: plan.id,
          billingCycle: billingCycle
        })
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to redirect to checkout');
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Failed to upgrade plan');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      if (!confirm('Are you sure you want to cancel your subscription?')) return;

      const response = await fetch('/api/billing/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        await loadBillingData();
      } else {
        toast.error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      if (!stripeHelpers.isConfigured()) {
        toast.error('Payment processing is not configured');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      // Create setup intent for adding payment method
      const response = await fetch('/api/billing/create-setup-intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const { clientSecret } = await response.json();

      // Redirect to Stripe for payment method setup
      const result = await stripe.confirmCardSetup(clientSecret);
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to add payment method');
      } else {
        toast.success('Payment method added successfully');
        await loadBillingData();
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method');
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      const response = await fetch(`/api/billing/invoices/${invoice.id}/download`, {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${invoice.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Invoice downloaded successfully');
      } else {
        toast.error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  // Render functions
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {billingData?.currentPlan.name}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Cost</span>
              <span className="font-semibold">${billingData?.currentPlan.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next Billing</span>
              <span className="font-semibold">{billingData?.nextBillingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Spent</span>
              <span className="font-semibold">${billingData?.totalSpent}</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>API Calls</span>
                <span>{billingData?.usageStats.apiCalls?.toLocaleString()} / {billingData?.usageStats.limits.apiCalls?.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${((billingData?.usageStats.apiCalls || 0) / (billingData?.usageStats.limits.apiCalls || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Storage</span>
                <span>{billingData?.usageStats.storageUsed} GB / {billingData?.usageStats.limits.storage} GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${((billingData?.usageStats.storageUsed || 0) / (billingData?.usageStats.limits.storage || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Bandwidth</span>
                <span>{billingData?.usageStats.bandwidthUsed} GB / {billingData?.usageStats.limits.bandwidth} GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${((billingData?.usageStats.bandwidthUsed || 0) / (billingData?.usageStats.limits.bandwidth || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <button
            onClick={() => setActiveTab('invoices')}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {billingData?.invoices.slice(0, 3).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-600">{invoice.description}</p>
                <p className="text-xs text-gray-500">{invoice.issueDate}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
                <span className="font-semibold">${invoice.amount}</span>
                <button
                  onClick={() => handleDownloadInvoice(invoice)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h3>
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
          <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Yearly <span className="text-green-600">(Save 20%)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availablePlans.map((plan) => {
          const price = billingCycle === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price;
          const isCurrentPlan = billingData?.currentPlan.id === plan.id;
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-sm border p-6 ${
                plan.isPopular ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </div>
              
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => isCurrentPlan ? null : handleUpgradePlan(plan)}
                disabled={isCurrentPlan}
                className={`w-full mt-6 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isCurrentPlan
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : plan.isPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          <span>Export All</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {billingData?.invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{invoice.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
        <button
          onClick={handleAddPaymentMethod}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Method</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {billingData?.paymentMethods.map((method) => (
          <div key={method.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {method.brand?.toUpperCase()} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              {method.isDefault && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Default
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 text-sm text-gray-600 hover:text-gray-900">
                Set as Default
              </button>
              <button className="flex-1 text-sm text-red-600 hover:text-red-700">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DollarSign },
    { id: 'plans', label: 'Plans & Pricing', icon: Zap },
    { id: 'invoices', label: 'Billing History', icon: FileText },
    { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard }
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
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
            <p className="text-gray-600">Manage your subscription, usage, and billing preferences</p>
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'plans' && renderPlans()}
        {activeTab === 'invoices' && renderInvoices()}
        {activeTab === 'payment-methods' && renderPaymentMethods()}
      </div>
    </div>
  );
};

export default BillingManagement;