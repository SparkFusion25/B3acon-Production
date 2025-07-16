import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Globe, ArrowRight, Info, CreditCard, Shield, Package, Search, BarChart3, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PlanSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Plan data with Stripe product IDs
  const plans = [
    {
      id: 'starter_free',
      name: 'Free Starter',
      price: 0,
      stripeProductId: 'prod_FREE',
      stripePriceId: 'price_FREE',
      description: 'Basic tools for small businesses just getting started',
      features: [
        'Limited access to all tools (3 uses each)',
        'Tariff Calculator',
        'HS Code Lookup',
        'Basic CRM features',
        'Email support'
      ],
      limitations: [
        'No Google services integration',
        'No SEO tools',
        'No Shopify integration',
        'Limited to 3 clients'
      ],
      trial: true,
      trialDays: 14,
      recommended: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 49.99,
      stripeProductId: 'prod_GROWTH',
      stripePriceId: 'price_12345G',
      description: 'Essential tools for growing businesses',
      features: [
        'Unlimited access to core tools',
        'Tariff & Duty Calculator',
        'HS Code Lookup with AI',
        'Shipment Tracking',
        'CRM Hub',
        'Email Marketing',
        'Priority support'
      ],
      limitations: [
        'Limited Google services',
        'Basic SEO tools only',
        'Up to 15 clients'
      ],
      trial: true,
      trialDays: 14,
      recommended: true,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'pro_trader',
      name: 'Pro Trader',
      price: 149.99,
      stripeProductId: 'prod_PRO',
      stripePriceId: 'price_12345P',
      description: 'Advanced tools for serious global traders',
      features: [
        'All Growth features',
        'Advanced Compliance Checker',
        'FTA Eligibility Tool',
        'Landed Cost Calculator',
        'Full Google services integration',
        'Advanced SEO tools',
        'Shopify integration',
        'Unlimited clients',
        'Priority support with dedicated manager'
      ],
      limitations: [],
      trial: true,
      trialDays: 14,
      recommended: false,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      stripeProductId: 'prod_ENT',
      stripePriceId: '',
      description: 'Custom solutions for large organizations',
      features: [
        'All Pro Trader features',
        'Custom API integrations',
        'White labeling',
        'Dedicated account manager',
        'Custom training and onboarding',
        'SLA guarantees',
        'Advanced analytics and reporting'
      ],
      limitations: [],
      trial: false,
      trialDays: 0,
      recommended: false,
      color: 'from-slate-700 to-slate-800'
    }
  ];

  // Feature availability by plan
  const featuresByPlan = {
    'starter_free': ['tariff-calculator', 'hs-codes', 'crm'],
    'growth': ['tariff-calculator', 'hs-codes', 'crm', 'shipping', 'email', 'landing'],
    'pro_trader': ['tariff-calculator', 'hs-codes', 'crm', 'shipping', 'email', 'landing', 'compliance', 'fta', 'landed_cost', 'google', 'seo', 'shopify'],
    'enterprise': ['tariff-calculator', 'hs-codes', 'crm', 'shipping', 'email', 'landing', 'compliance', 'fta', 'landed_cost', 'google', 'seo', 'shopify', 'whitelabel']
  };

  // Feature icons and names
  const featureDetails = {
    'tariff-calculator': { name: 'Tariff Calculator', icon: CreditCard },
    'hs-codes': { name: 'HS Code Lookup', icon: Search },
    'crm': { name: 'CRM Hub', icon: BarChart3 },
    'shipping': { name: 'Shipment Tracking', icon: Package },
    'email': { name: 'Email Marketing', icon: Mail },
    'landing': { name: 'Landing Pages', icon: Layout },
    'compliance': { name: 'Compliance Checker', icon: Shield },
    'fta': { name: 'FTA Checker', icon: FileCheck },
    'landed_cost': { name: 'Landed Cost Calculator', icon: DollarSign },
    'google': { name: 'Google Services', icon: Search },
    'seo': { name: 'SEO Intelligence', icon: TrendingUp },
    'shopify': { name: 'Shopify Integration', icon: ShoppingBag }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan to continue');
      return;
    }

    setIsLoading(true);

    try {
      const plan = plans.find(p => p.id === selectedPlan);
      
      if (!plan) {
        throw new Error('Selected plan not found');
      }

      // For free plan, create user profile and redirect to dashboard
      if (plan.id === 'starter_free') {
        // In a real implementation, we would create a user profile with the free plan
        toast.success('Free plan activated! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return;
      }

      // For Enterprise plan, redirect to contact sales page
      if (plan.id === 'enterprise') {
        navigate('/contact-sales');
        return;
      }

      // For paid plans, redirect to Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // In a real implementation, we would create a checkout session on the server
      // For now, we'll simulate the redirect
      toast.success(`Redirecting to checkout for ${plan.name} plan...`);
      
      // Simulate redirect to Stripe checkout
      setTimeout(() => {
        // After successful payment, user would be redirected to dashboard
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error processing plan selection:', error);
      toast.error('Failed to process plan selection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">B3ACON</h1>
              <p className="text-slate-600 text-sm">Global Commerce Command Center</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Select the plan that best fits your business needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-lg ${
                selectedPlan === plan.id 
                  ? 'border-signal-blue ring-2 ring-signal-blue/30 transform scale-105' 
                  : 'border-slate-200'
              } ${plan.recommended ? 'lg:transform lg:scale-105' : ''} relative overflow-hidden`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-signal-blue text-white px-4 py-1 text-sm font-medium">
                  Recommended
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h3>
                <div className="mb-4">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                      <span className="text-slate-600">/month</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                  )}
                </div>
                
                <p className="text-slate-600 mb-4">{plan.description}</p>
                
                {plan.trial && (
                  <div className="mb-4 p-2 bg-blue-50 rounded-lg text-blue-800 text-sm flex items-start">
                    <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Includes {plan.trialDays}-day free trial</span>
                  </div>
                )}
                
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className={`w-5 h-5 ${
                        plan.recommended ? 'text-signal-blue' : 'text-green-500'
                      } mr-2 flex-shrink-0`} />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start">
                        <Info className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                        <span className="text-slate-500 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
                  }}
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    selectedPlan === plan.id
                      ? `bg-gradient-to-r ${plan.color} text-white`
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.id === 'enterprise' ? 'Contact Sales' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-12">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Features Comparison</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-left text-slate-600 font-medium">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="py-3 px-4 text-center text-slate-600 font-medium">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(featureDetails).map(([featureId, feature]) => (
                  <tr key={featureId} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-800 font-medium flex items-center">
                      <feature.icon className="w-5 h-5 mr-2 text-slate-500" />
                      {feature.name}
                    </td>
                    {plans.map(plan => (
                      <td key={`${plan.id}-${featureId}`} className="py-3 px-4 text-center">
                        {featuresByPlan[plan.id as keyof typeof featuresByPlan]?.includes(featureId) ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedPlan || isLoading}
            className="px-8 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>Continue with {selectedPlan ? plans.find(p => p.id === selectedPlan)?.name : 'Selected Plan'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionPage;