import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Star, Shield, ArrowRight } from 'lucide-react';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import { SUBSCRIPTION_PLANS } from '../../utils/subscriptionUtils';
import '../../styles/premium-design-system.css';

const SubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useShopifyAuth();
  
  const shopUrl = searchParams.get('shop') || '';
  const selectedPlan = searchParams.get('plan') || 'trial';
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const enhancedPlans = {
    trial: {
      ...SUBSCRIPTION_PLANS.trial,
      popular: true,
      badge: 'Most Popular',
      color: 'green'
    },
    starter: {
      ...SUBSCRIPTION_PLANS.starter,
      popular: false,
      badge: 'Great Value',
      color: 'blue'
    },
    pro: {
      ...SUBSCRIPTION_PLANS.pro,
      popular: false,
      badge: 'Best Features',
      color: 'purple'
    },
    enterprise: {
      ...SUBSCRIPTION_PLANS.enterprise,
      popular: false,
      badge: 'Full Access',
      color: 'gold'
    }
  };

  const handleSubscribe = async (planId: string) => {
    setIsSubscribing(true);
    
    try {
      // Get or create subscription
      let subscription = JSON.parse(localStorage.getItem('shopify_subscription') || '{}');
      
      // Update subscription with selected plan
      subscription = {
        ...subscription,
        plan: planId,
        planData: enhancedPlans[planId as keyof typeof enhancedPlans],
        billingCycle,
        updatedAt: new Date().toISOString()
      };

      // Save updated subscription
      localStorage.setItem('shopify_subscription', JSON.stringify(subscription));

      // Track subscription completion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'subscription_completed', {
          plan: planId,
          shop_url: shopUrl,
          billing_cycle: billingCycle
        });
      }

      // Login user with subscription data
      await login(shopUrl, planId, subscription);

      // Navigate to dashboard with welcome message
      navigate('/shopify/dashboard?welcome=true&new_signup=true');
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const getPrice = (planId: string) => {
    const plan = enhancedPlans[planId as keyof typeof enhancedPlans];
    if (planId === 'trial') return 0;
    
    const monthlyPrice = plan.price;
    const yearlyPrice = monthlyPrice * 10; // 20% discount
    
    return billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;
  };

  const getPlanColor = (color: string) => {
    const colors = {
      green: 'border-green-200 bg-green-50',
      blue: 'border-blue-200 bg-blue-50', 
      purple: 'border-purple-200 bg-purple-50',
      gold: 'border-yellow-200 bg-yellow-50'
    };
    return colors[color as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  const getBadgeColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800', 
      gold: 'bg-yellow-100 text-yellow-800'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Centered Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Perfect plan for <strong className="text-primary-600">{shopUrl}</strong>
            </p>
            <p className="text-gray-500">
              Start with a free trial, upgrade anytime. No setup fees, cancel anytime.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(enhancedPlans).map(([planId, plan]) => {
              const isSelected = selectedPlan === planId;
              const price = getPrice(planId);

              return (
                <div
                  key={planId}
                  className={`relative bg-white rounded-2xl border-2 p-8 transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? 'border-primary-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className={`px-4 py-1 rounded-full text-xs font-medium ${getBadgeColor(plan.color)}`}>
                        <Star className="w-3 h-3 inline mr-1" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">${price}</span>
                        <span className="text-gray-600 ml-1">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && planId !== 'trial' && (
                        <p className="text-sm text-green-600 mt-1">
                          Save ${plan.price * 2}/year
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          {feature.replace(/_/g, ' ')}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Limits */}
                  {plan.limits && (
                    <div className="mb-6 text-xs text-gray-500 space-y-1">
                      {Object.entries(plan.limits).slice(0, 2).map(([key, value]) => (
                        <div key={key}>
                          {key.replace(/_/g, ' ')}: {value}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(planId)}
                    disabled={isSubscribing}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSubscribing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Setting up...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {planId === 'trial' ? (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Start Free Trial
                          </>
                        ) : (
                          <>
                            <Crown className="w-5 h-5 mr-2" />
                            Choose {plan.name}
                          </>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Security & Support Info */}
          <div className="text-center">
            <div className="inline-flex items-center text-sm text-gray-600 mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Secure checkout • 14-day money-back guarantee • Cancel anytime
            </div>
            
            <div className="text-xs text-gray-500">
              Questions? Contact our support team at{' '}
              <a href="mailto:support@b3acon.com" className="text-primary-600 hover:text-primary-700">
                support@b3acon.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;