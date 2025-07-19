import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Lock, 
  Star,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Search,
  Target,
  Users,
  Award,
  Sparkles
} from 'lucide-react';
import '../../styles/premium-design-system.css';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limits: {
    products: number | 'unlimited';
    stores: number;
    support: string;
  };
  popular: boolean;
  trial: number;
}

const ShopifyPlanSelection = () => {
  const [selectedPlan, setSelectedPlan] = useState('growth');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const pricingPlans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      period: 'month',
      description: 'Perfect for small stores getting started',
      features: [
        'SEO optimization for 500 products',
        'Basic analytics dashboard',
        'Email support',
        'Core automation features',
        'Shopify integration'
      ],
      limits: {
        products: 500,
        stores: 1,
        support: 'Email'
      },
      popular: false,
      trial: 14
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 79,
      period: 'month',
      description: 'For growing stores ready to scale - Pay upfront to start',
      features: [
        'SEO optimization for 2,500 products',
        'Advanced analytics & insights',
        'Priority support',
        'Full automation suite',
        'A/B testing tools',
        'Custom integrations',
        'Performance monitoring'
      ],
      limits: {
        products: 2500,
        stores: 1,
        support: 'Priority'
      },
      popular: true,
      trial: 0
    },
    {
      id: 'pro',
      name: 'Pro Agency',
      price: 199,
      period: 'month',
      description: 'For agencies and large stores - Pay upfront to start',
      features: [
        'Unlimited SEO optimization',
        'White-label dashboard',
        'Dedicated account manager',
        'Custom development',
        'API access',
        'Multi-store management',
        'Advanced reporting'
      ],
      limits: {
        products: 'unlimited',
        stores: 5,
        support: 'Dedicated'
      },
      popular: false,
      trial: 30
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(true);
    
    // Simulate API call for subscription setup
    setTimeout(() => {
      // In real implementation, this would:
      // 1. Create Shopify subscription
      // 2. Set up user permissions
      // 3. Initialize app features based on plan
      
      // Redirect to dashboard with plan context
      const storeUrl = new URLSearchParams(window.location.search).get('shop') || 'demo-store';
      window.location.href = `/shopify/dashboard?shop=${storeUrl}&plan=${planId}`;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-primary">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-8xl">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">B3ACON</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm font-medium">Installation Complete</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-8xl py-16">
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-indigo-200 mb-8">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-600 font-medium">Choose Your Plan</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Select Your <span className="text-gradient-primary">Growth Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that best fits your store's needs. Start with a free trial and upgrade anytime.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {pricingPlans.map((plan, index) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`glass-card p-8 cursor-pointer transition-all duration-300 relative ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-indigo-500 shadow-xl scale-105' 
                  : 'hover:shadow-lg hover:scale-105'
              } ${plan.popular ? 'border-indigo-200' : ''}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-left">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Products:</span>
                      <span className="font-medium">{plan.limits.products === 'unlimited' ? 'Unlimited' : plan.limits.products.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stores:</span>
                      <span className="font-medium">{plan.limits.stores}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support:</span>
                      <span className="font-medium">{plan.limits.support}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading}
                  className={`w-full btn-premium ${
                    plan.popular ? 'btn-primary' : 'btn-outline'
                  } btn-large group ${selectedPlan === plan.id ? 'animate-pulse' : ''}`}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Setting up...
                    </div>
                  ) : (
                    <>
                      Start {plan.trial}-Day Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={`text-center transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Secure billing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 rating</span>
            </div>
          </div>
          
          <p className="text-gray-500 max-w-2xl mx-auto">
            All plans include a free trial period. No setup fees or hidden charges. 
            Your subscription will be managed through your Shopify admin panel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopifyPlanSelection;