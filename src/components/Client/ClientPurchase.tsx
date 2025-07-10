import React, { useState } from 'react';
import { Package, Check, Star, ArrowRight, CreditCard, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { stripePromise, stripeHelpers } from '../../lib/stripe';

const ClientPurchase: React.FC = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

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
      recommended: false,
      priceId: 'price_starter'
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
      recommended: true,
      priceId: 'price_professional'
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
      recommended: false,
      priceId: 'price_enterprise'
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
      ],
      priceId: 'price_email_marketing'
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
      ],
      priceId: 'price_landing_pages'
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
      ],
      priceId: 'price_advanced_analytics'
    },
    {
      id: 'ai-assistant',
      name: 'AI Marketing Assistant',
      price: 800,
      description: 'AI-powered marketing recommendations and automation',
      features: [
        'Content generation',
        'Campaign optimization',
        'Audience insights',
        'Predictive analytics'
      ],
      priceId: 'price_ai_assistant'
    }
  ];

  const handlePurchase = async (item: any, type: 'plan' | 'service') => {
    try {
      setIsProcessing(true);
      
      // Create a checkout session
      const { sessionId, url } = await stripeHelpers.createCheckoutSession(
        item.priceId, // This would be your actual Stripe price ID
        `${window.location.origin}/purchase/success?type=${type}&id=${item.id}`,
        `${window.location.origin}/purchase/cancel`
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
      console.error('Error purchasing item:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Services</h2>
        <p className="text-gray-600">Upgrade your plan or add new marketing services</p>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-gradient-to-r from-signal-blue to-beacon-orange rounded-xl p-6 mb-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Your Current Plan: Professional</h3>
            <p className="text-blue-100">$4,200/month • Renews on February 15, 2024</p>
          </div>
          <button className="px-4 py-2 bg-white text-signal-blue font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 self-start">
            <CreditCard className="w-4 h-4" />
            <span>Manage Subscription</span>
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
          <p className="text-sm text-gray-600">Choose the plan that fits your needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-xl shadow-sm border ${
                plan.recommended ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'
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
                onClick={() => handlePurchase(plan, 'plan')}
                disabled={isProcessing || plan.id === 'professional'}
                className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                  plan.id === 'professional' 
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-signal-blue to-beacon-orange text-white hover:shadow-lg'
                }`}
              >
                {plan.id === 'professional' ? (
                  <span>Current Plan</span>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isProcessing ? 'Processing...' : plan.id === 'starter' ? 'Downgrade' : 'Upgrade'}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Additional Services</h3>
          <p className="text-sm text-gray-600">Enhance your marketing strategy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              
              <button 
                onClick={() => handlePurchase(service, 'service')}
                disabled={isProcessing}
                className="w-full py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Purchase'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Process */}
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-signal-blue to-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">1</div>
            <h4 className="font-medium text-gray-900 mb-2">Choose Your Services</h4>
            <p className="text-sm text-gray-600">Select the plan or services that best fit your marketing needs</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">2</div>
            <h4 className="font-medium text-gray-900 mb-2">Secure Checkout</h4>
            <p className="text-sm text-gray-600">Complete your purchase with our secure payment system</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-beacon-orange to-red-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">3</div>
            <h4 className="font-medium text-gray-900 mb-2">Immediate Access</h4>
            <p className="text-sm text-gray-600">Get instant access to your new services and start growing your business</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPurchase;