import React, { useState } from 'react';
import { Plus, ShoppingCart, Check, Star, ArrowRight, Zap, Target, BarChart3, MessageCircle, Search, Palette, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { stripePromise, stripeHelpers } from '../../lib/stripe';

const ClientServices: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('current');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentServices = [
    {
      id: 1,
      name: 'SEO Optimization',
      description: 'Complete search engine optimization with keyword tracking and content optimization',
      price: 1200,
      status: 'active',
      performance: 94,
      nextBilling: '2024-02-15',
      features: ['Keyword Research', 'On-page SEO', 'Technical SEO', 'Monthly Reports'],
      icon: Search
    },
    {
      id: 2,
      name: 'PPC Management',
      description: 'Google Ads and Facebook Ads campaign management and optimization',
      price: 1500,
      status: 'active',
      performance: 87,
      nextBilling: '2024-02-15',
      features: ['Campaign Setup', 'Bid Management', 'A/B Testing', 'Performance Tracking'],
      icon: Target
    },
    {
      id: 3,
      name: 'Social Media Management',
      description: 'Content creation, posting, and community management across platforms',
      price: 800,
      status: 'active',
      performance: 91,
      nextBilling: '2024-02-15',
      features: ['Content Creation', 'Daily Posting', 'Community Management', 'Analytics'],
      icon: MessageCircle
    }
  ];

  const availableServices = [
    {
      id: 4,
      name: 'Email Marketing',
      description: 'Automated email campaigns and newsletter management',
      price: 600,
      popular: false,
      features: ['Campaign Design', 'Automation', 'List Management', 'Analytics'],
      icon: MessageCircle
    },
    {
      id: 5,
      name: 'Landing Page Builder',
      description: 'Custom landing pages with conversion optimization',
      price: 400,
      popular: true,
      features: ['Custom Design', 'A/B Testing', 'Conversion Tracking', 'Mobile Optimized'],
      icon: Palette
    },
    {
      id: 6,
      name: 'Advanced Analytics',
      description: 'Comprehensive reporting and business intelligence',
      price: 500,
      popular: false,
      features: ['Custom Dashboards', 'ROI Tracking', 'Competitor Analysis', 'Monthly Reviews'],
      icon: BarChart3
    },
    {
      id: 7,
      name: 'Marketing Automation',
      description: 'Advanced workflow automation and lead nurturing',
      price: 900,
      popular: true,
      features: ['Lead Scoring', 'Workflow Automation', 'CRM Integration', 'Personalization'],
      icon: Zap
    }
  ];

  const addOns = [
    {
      id: 'extra-keywords',
      name: 'Additional Keywords',
      description: 'Track 50 additional keywords',
      price: 100,
      type: 'monthly'
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      description: '24/7 priority customer support',
      price: 200,
      type: 'monthly'
    },
    {
      id: 'custom-reports',
      name: 'Custom Reports',
      description: 'Branded monthly reports',
      price: 150,
      type: 'monthly'
    }
  ];

  const handlePurchaseService = async (service: any) => {
    try {
      setIsProcessing(true);
      
      // Create a checkout session
      const { sessionId, url } = await stripeHelpers.createCheckoutSession(
        `price_${service.id}`, // This would be your actual Stripe price ID
        `${window.location.origin}/services/success`,
        `${window.location.origin}/services/cancel`
      );
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error redirecting to checkout:', error);
        }
      } else {
        // Fallback if Stripe isn't loaded
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error purchasing service:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderCurrentServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Active Services</h3>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold text-gray-900">${currentServices.reduce((sum, s) => sum + s.price, 0)}/month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentServices.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-green-600 font-medium">Active</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${service.price}</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{service.description}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Performance</span>
                  <span className={`text-sm font-bold ${getPerformanceColor(service.performance)}`}>
                    {service.performance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-signal-blue to-beacon-orange h-2 rounded-full"
                    style={{ width: `${service.performance}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">Next billing: {service.nextBilling}</span>
                <button className="text-signal-blue hover:text-blue-700 text-sm font-medium">
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAvailableServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Available Services</h3>
        <p className="text-sm text-gray-600">Expand your marketing reach</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableServices.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              {service.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-gradient-to-r from-beacon-orange to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${service.price}</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAddOns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Service Add-Ons</h3>
        <p className="text-sm text-gray-600">Enhance your existing services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addOns.map((addon) => (
          <div key={addon.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{addon.name}</h4>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">${addon.price}</p>
                <p className="text-xs text-gray-500">per {addon.type}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                activeTab === tab.id ? 'bg-signal-blue text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'current' && renderCurrentServices()}
        {activeTab === 'available' && renderAvailableServices()}
        {activeTab === 'addons' && renderAddOns()}
        {activeTab === 'purchase' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
              <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Manage Billing</span>
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Purchase History</h4>
              <p className="text-gray-600 mb-4">View your recent purchases and subscription changes.</p>
              <p className="text-sm text-gray-500">No recent purchases found.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientServices;