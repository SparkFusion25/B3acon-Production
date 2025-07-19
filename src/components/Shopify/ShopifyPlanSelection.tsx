import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Star, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  Clock,
  ArrowRight,
  Package,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import '../../styles/shopify-app.css';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  trial: boolean;
  trialDays?: number;
  stripePriceId?: string;
  limitations?: string[];
}

const ShopifyPlanSelection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'payment' | 'confirmation'>('selection');

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      period: '14-day trial',
      description: 'Perfect for new stores getting started',
      trial: true,
      trialDays: 14,
      features: [
        'SEO optimization for 50 products',
        'Basic internal linking',
        'Monthly SEO reports',
        'Email support',
        'Basic analytics dashboard'
      ],
      limitations: [
        'Limited to 50 products',
        'Basic features only',
        'Email support only'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 29,
      originalPrice: 49,
      period: 'month',
      description: 'Ideal for growing businesses',
      popular: true,
      trial: false,
      stripePriceId: 'price_shopify_professional',
      features: [
        'SEO optimization for 500 products',
        'Advanced internal linking automation',
        'Weekly SEO reports',
        'Priority email & chat support',
        'Advanced analytics & insights',
        'Competitor analysis',
        'Schema markup automation',
        'Page speed optimization'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      originalPrice: 149,
      period: 'month',
      description: 'For large stores and agencies',
      trial: false,
      stripePriceId: 'price_shopify_enterprise',
      features: [
        'Unlimited product optimization',
        'AI-powered content generation',
        'Daily SEO monitoring',
        'Dedicated account manager',
        'Custom integrations',
        'White-label reporting',
        'Multi-store management',
        'Advanced API access',
        'Custom training sessions'
      ]
    }
  ];

  const handlePlanSelection = async (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) return;
    
    // If it's the basic plan with trial, proceed directly to dashboard
    if (plan.trial) {
      setIsProcessing(true);
      try {
        // Simulate account setup
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('14-day trial activated! Welcome to B3ACON!');
        window.location.href = '/shopify/dashboard';
      } catch (error) {
        toast.error('Failed to activate trial. Please try again.');
        setIsProcessing(false);
      }
    } else {
      // For paid plans, proceed to payment
      setPaymentStep('payment');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    const plan = plans.find(p => p.id === selectedPlan);
    
    try {
      // Here you would integrate with Stripe or Shopify Billing API
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      setPaymentStep('confirmation');
      toast.success('Payment successful! Setting up your account...');
      
      // Additional setup time
      setTimeout(() => {
        window.location.href = '/shopify/dashboard';
      }, 2000);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (paymentStep === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
              <p className="text-gray-600">You're one step away from supercharging your Shopify store</p>
            </div>

            {/* Selected Plan Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              {(() => {
                const plan = plans.find(p => p.id === selectedPlan);
                return plan ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{plan.name} Plan</div>
                      <div className="text-sm text-gray-600">{plan.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
                      <div className="text-sm text-gray-600">per {plan.period}</div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Information
                </label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="text-center text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-2" />
                    <p>Secure payment processing</p>
                    <p className="text-xs">Powered by Stripe</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Complete Purchase
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setPaymentStep('selection')}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  ← Back to plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Welcome to B3ACON! We're setting up your account and will redirect you to your dashboard shortly.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="animate-pulse flex items-center justify-center gap-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Setting up your store optimization...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Growth Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start optimizing your Shopify store today. All plans include our core SEO features.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>14-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>10,000+ happy stores</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span>247% average revenue increase</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    {plan.trial ? (
                      <div>
                        <div className="text-4xl font-bold text-green-600 mb-1">FREE</div>
                        <div className="text-lg text-gray-600">{plan.period}</div>
                        <div className="text-sm text-gray-500">Then $29/month</div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {plan.originalPrice && (
                            <span className="text-lg text-gray-400 line-through">${plan.originalPrice}</span>
                          )}
                          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        </div>
                        <div className="text-gray-600">per {plan.period}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations for Basic Plan */}
                {plan.limitations && (
                  <div className="border-t pt-6 mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Plan Limitations:</h4>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                      : plan.trial
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Setting up...
                    </>
                  ) : (
                    <>
                      {plan.trial ? (
                        <>
                          <Clock className="w-5 h-5" />
                          Start Free Trial
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Choose Plan
                        </>
                      )}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {plan.trial && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    No credit card required
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose B3ACON for Your Shopify Store?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant SEO</h4>
              <p className="text-sm text-gray-600">Automated optimization that works 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Proven Results</h4>
              <p className="text-sm text-gray-600">247% average revenue increase</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Setup</h4>
              <p className="text-sm text-gray-600">Install and optimize in under 5 minutes</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Global Ready</h4>
              <p className="text-sm text-gray-600">Multi-language and international SEO</p>
            </div>
          </div>
        </div>

        {/* Security & Trust */}
        <div className="text-center text-sm text-gray-600 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>10,000+ Stores</span>
            </div>
          </div>
          <p>
            Join thousands of successful Shopify store owners who trust B3ACON to grow their business.
            <br />
            Cancel anytime. No hidden fees. Full money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopifyPlanSelection;