import React, { useState } from 'react';
import { CreditCard, DollarSign, Download, Calendar, Plus, Check, ArrowRight, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { stripeHelpers } from '../../lib/stripe';
import { toast } from 'react-hot-toast';

const ClientBilling: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('invoices');
  
  const handleDownloadInvoices = () => {
    toast.success('Downloading all invoices');
  };
  
  const handleViewInvoice = (invoiceId: string) => {
    toast.success(`Viewing invoice ${invoiceId}`);
  };
  
  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
  };

  const handleManageSubscription = async () => {
    try {
      // In a real implementation, we would get the customer ID from the user's profile
      const customerId = 'cus_example123'; // Replace with actual customer ID
      
      // Get customer portal session
      const { url } = await stripeHelpers.getCustomerPortalSession(
        customerId,
        window.location.origin + '/billing'
      );
      
      // Redirect to customer portal
      window.location.href = url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    }
  };
  
  const handleUpdatePlan = async () => {
    try {
      // In a real implementation, we would get the customer ID from the user's profile
      const customerId = 'cus_example123'; // Replace with actual customer ID
      
      // Get customer portal session
      const { url } = await stripeHelpers.getCustomerPortalSession(
        customerId,
        window.location.origin + '/billing'
      );
      
      // Redirect to customer portal
      window.location.href = url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to update subscription plan');
    }
  };
  
  const handleAddPaymentMethod = () => {
    toast.success('Adding new payment method');
  };

  const invoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      dueDate: '2024-01-15',
      amount: 4200,
      status: 'paid',
      services: ['SEO Optimization', 'PPC Management', 'Social Media']
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      dueDate: '2023-12-15',
      amount: 4200,
      status: 'paid',
      services: ['SEO Optimization', 'PPC Management', 'Social Media']
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      dueDate: '2023-11-15',
      amount: 3800,
      status: 'paid',
      services: ['SEO Optimization', 'PPC Management']
    }
  ];

  const subscriptionPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 1200,
      description: 'Essential digital marketing tools for small businesses',
      features: [
        'Basic SEO optimization',
        'Social media management (2 platforms)',
        'Monthly performance reports',
        'Email support'
      ],
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 4200,
      description: 'Comprehensive marketing solution for growing businesses',
      features: [
        'Advanced SEO optimization',
        'PPC campaign management',
        'Social media management (4 platforms)',
        'Content marketing',
        'Weekly performance reports',
        'Priority email & phone support'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 8500,
      description: 'Full-service marketing solution for established businesses',
      features: [
        'Enterprise SEO strategy',
        'Advanced PPC management',
        'Social media management (all platforms)',
        'Content marketing & strategy',
        'Custom reporting dashboard',
        'Dedicated account manager',
        '24/7 priority support'
      ],
      recommended: false
    }
  ];

  const additionalServices = [
    {
      id: 'email-marketing',
      name: 'Email Marketing',
      price: 600,
      description: 'Automated email campaigns and newsletter management',
      features: [
        'Campaign design and setup',
        'Automated workflows',
        'List management',
        'Performance analytics'
      ]
    },
    {
      id: 'landing-pages',
      name: 'Landing Page Builder',
      price: 400,
      description: 'Custom landing pages with conversion optimization',
      features: [
        'Custom design templates',
        'A/B testing',
        'Conversion tracking',
        'Mobile optimization'
      ]
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      price: 500,
      description: 'Comprehensive reporting and business intelligence',
      features: [
        'Custom dashboards',
        'ROI tracking',
        'Competitor analysis',
        'Monthly review calls'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
        <button 
          onClick={handleDownloadInvoices}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download All</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.id}</div>
                      <div className="text-xs text-gray-500">{invoice.services.join(', ')}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{invoice.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{invoice.dueDate}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${invoice.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                      >
                        Download
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

  const renderSubscription = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <button 
          onClick={handleUpdatePlan}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
        >
        </button>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-signal-blue to-beacon-orange rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Your Current Plan: Professional</h3>
            <p className="text-blue-100">Next billing date: February 15, 2024</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">$4,200</p>
            <p className="text-blue-100">per month</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {subscriptionPlans.find(p => p.id === 'professional')?.features.map((feature, index) => (
            <span key={index} className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
              {feature}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-white text-signal-blue px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Change Plan</span>
          </button>
        </div>
      </div>

      {/* Available Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id} 
            className={`bg-white rounded-xl shadow-sm border ${
            onClick={() => handleManageSubscription()}
            } p-6 relative`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 right-6">
                <span className="bg-signal-blue text-white px-3 py-1 rounded-full text-xs font-medium">
                  Recommended
                </span>
              </div>
            )}
            
            <div className="mb-4">
              <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
            
            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleManageSubscription}
                plan.id === 'professional' 
                  ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-signal-blue to-beacon-orange text-white hover:shadow-lg'
              }`}
              disabled={plan.id === 'professional'}
            >
              {plan.id === 'professional' ? (
                <span>Current Plan</span>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>{plan.id === 'starter' ? 'Downgrade' : 'Upgrade'}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdditionalServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Additional Services</h3>
        <p className="text-sm text-gray-600">Enhance your marketing strategy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {additionalServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            </div>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">${service.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
            
            <div className="space-y-3 mb-6">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add to Plan</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
        <button 
          onClick={handleAddPaymentMethod}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment Method</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
              Visa
            </div>
            <div>
              <p className="font-medium text-gray-900">Visa ending in 4242</p>
              <p className="text-sm text-gray-600">Expires 12/2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Default
            </span>
            <button className="text-gray-400 hover:text-gray-600 text-sm font-medium">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'invoices', label: 'Invoices', icon: CreditCard },
    { id: 'subscription', label: 'Subscription Plans', icon: DollarSign },
    { id: 'additional', label: 'Additional Services', icon: Plus },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payments</h2>
        <p className="text-gray-600">Manage your subscription, invoices, and payment methods</p>
      </div>

      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Current Plan</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">Professional</div>
          <p className="text-sm text-gray-600">$4,200/month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Next Payment</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">February 15, 2024</div>
          <p className="text-sm text-gray-600">Auto-payment enabled</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Payment Method</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">Visa •••• 4242</div>
          <p className="text-sm text-gray-600">Expires 12/2025</p>
        </div>
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
        {activeTab === 'invoices' && renderInvoices()}
        {activeTab === 'subscription' && renderSubscription()}
        {activeTab === 'additional' && renderAdditionalServices()}
        {activeTab === 'payment' && renderPaymentMethods()}
      </div>
    </div>
  );
};

export default ClientBilling;