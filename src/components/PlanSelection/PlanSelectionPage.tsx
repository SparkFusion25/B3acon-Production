import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Globe, 
  ArrowRight, 
  Info, 
  CreditCard, 
  Shield, 
  Package, 
  Search, 
  BarChart3, 
  ShoppingBag,
  Check, 
  Star, 
  Zap, 
  Users, 
  TrendingUp,
  Mail,
  Layout,
  FileCheck,
  DollarSign,
  Calendar,
  FileText,
  Code,
  Edit
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PlanSelectionPageProps {
  viewOnly?: boolean;
}

const PlanSelectionPage: React.FC<PlanSelectionPageProps> = ({ viewOnly = false }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Plan data with Stripe product IDs
  const plans = [
    {
      id: 'starter_free',
      name: 'Free Starter',
      price: 0,
      stripeProductId: 'prod_FREE', // Stripe product ID
      stripePriceId: 'price_FREE', // Stripe price ID
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
      stripeProductId: 'prod_GROWTH', // Stripe product ID
      stripePriceId: 'price_12345G', // Stripe price ID
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
      stripeProductId: 'prod_PRO', // Stripe product ID
      stripePriceId: 'price_12345P', // Stripe price ID
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
      stripeProductId: 'prod_ENT', // Stripe product ID
      stripePriceId: '', // Custom pricing
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
    'growth': ['tariff-calculator', 'hs-codes', 'crm', 'shipping', 'email', 'landing', 'social-scheduler-tool'],
    'pro_trader': ['tariff-calculator', 'hs-codes', 'crm', 'shipping', 'email', 'landing', 'compliance', 'fta', 'landed_cost', 'google', 'seo', 'shopify', 'social-scheduler-tool', 'seo-content-gap-tool', 'shipment-tracking-pro'],
    'enterprise': ['tariff-calculator', 'hs-codes', 'crm', 'shipping', 'email', 'landing', 'compliance', 'fta', 'landed_cost', 'google', 'seo', 'shopify', 'whitelabel', 'social-scheduler-tool', 'seo-content-gap-tool', 'shipment-tracking-pro', 'api-access-/-webhooks', 'ai-blog-writer']
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
    , 'social-scheduler-tool': { name: 'Social Scheduler', icon: Calendar },
    'seo-content-gap-tool': { name: 'SEO Content Gap', icon: FileText },
    'shipment-tracking-pro': { name: 'Shipment Tracking Pro', icon: Package },
    'api-access-/-webhooks': { name: 'API Access', icon: Code },
    'ai-blog-writer': { name: 'AI Blog Writer', icon: Edit }
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
        if (!viewOnly) {
          toast.success('Free plan activated! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          toast.success('Free plan selected. Sign up to activate!');
        }
        return;
      }

      // For Enterprise plan, redirect to contact sales page
      if (plan.id === 'enterprise') {
        if (!viewOnly) {
          navigate('/contact-sales');
        } else {
          toast.success('Enterprise plan requires contacting sales');
        }
        return;
      }

      // For paid plans, redirect to Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // In a real implementation, we would create a checkout session on the server
      if (!viewOnly) {
        toast.success(`Redirecting to checkout for ${plan.name} plan...`);
        
        // Simulate redirect to Stripe checkout
        setTimeout(() => {
          // After successful payment, user would be redirected to dashboard
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.success(`${plan.name} plan selected. Sign up to subscribe!`);
      }
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
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">B3ACON</h1>
                <p className="text-slate-600 text-sm">Global Commerce Command Center</p>
              </div>
            </Link>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{viewOnly ? "Our Plans & Pricing" : "Choose Your Plan"}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {viewOnly ? 
              "Compare our plans and find the perfect fit for your business needs." :
              "Select the plan that best fits your business needs. All plans include a 14-day free trial."
            }
          </p>
          
          {viewOnly && (
            <div className="mt-6">
              <Link 
                to="/signup" 
                className="px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all inline-block"
              >
                Start Free Trial
              </Link>
            </div>
          )}
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
                    if (!viewOnly) {
                      e.stopPropagation();
                      handleSelectPlan(plan.id);
                    }
                  }}
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    selectedPlan === plan.id
                      ? `bg-gradient-to-r ${plan.color} text-white`
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.id === 'enterprise' ? 'Contact Sales' : viewOnly ? 'View Details' : 'Select Plan'}
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
          {!viewOnly ? (
            <button
              onClick={handleContinue}
              disabled={!selectedPlan || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
          ) : (
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionPage;