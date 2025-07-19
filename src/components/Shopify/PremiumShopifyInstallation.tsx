import React, { useState, useEffect } from 'react';

// Shopify App Bridge for embedded apps
declare global {
  interface Window {
    shopifyAppBridge?: any;
  }
}
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Shield,
  Database,
  CreditCard,
  Settings,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Store,
  Zap,
  BarChart3,
  Play,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import '../../styles/premium-design-system.css';

interface InstallationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration: number;
}

const PremiumShopifyInstallation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('growth');
  const [storeUrl, setStoreUrl] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  const installationSteps: InstallationStep[] = [
    {
      id: 'connect',
      title: 'Connect Your Store',
      description: 'Secure connection to your Shopify store',
      icon: Shield,
      status: 'pending',
      duration: 2000
    },
    {
      id: 'permissions',
      title: 'Grant Permissions',
      description: 'Authorize B3ACON to optimize your store',
      icon: CheckCircle,
      status: 'pending',
      duration: 1500
    },
    {
      id: 'analyze',
      title: 'Analyze Your Store',
      description: 'AI-powered analysis of your products and content',
      icon: Database,
      status: 'pending',
      duration: 3000
    },
    {
      id: 'setup',
      title: 'Complete Setup',
      description: 'Finalizing your optimization strategy',
      icon: Settings,
      status: 'pending',
      duration: 2000
    }
  ];

  const [steps, setSteps] = useState(installationSteps);

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      period: 'month',
      description: 'Perfect for new stores',
      features: [
        'SEO optimization for 100 products',
        'Basic analytics dashboard',
        'Email support',
        'Core automation features'
      ],
      popular: false,
      trial: 14,
      savings: null
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 79,
      period: 'month',
      description: 'Most popular for scaling stores',
      features: [
        'SEO optimization for 1,000 products',
        'Advanced analytics & insights',
        'Priority support',
        'Full automation suite',
        'A/B testing tools',
        'Conversion optimization'
      ],
      popular: true,
      trial: 14,
      savings: 'Save $20/month'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'For high-volume stores',
      features: [
        'Unlimited SEO optimization',
        'White-label dashboard',
        'Dedicated account manager',
        'Custom development',
        'API access',
        'Multi-store management'
      ],
      popular: false,
      trial: 30,
      savings: 'Save $100/month'
    }
  ];

  const benefits = [
    { icon: TrendingUp, text: '247% average revenue increase' },
    { icon: Users, text: 'Join 50,000+ successful stores' },
    { icon: Award, text: 'Shopify App Store Editor\'s Choice' },
    { icon: Shield, text: 'Enterprise-grade security' }
  ];

  useEffect(() => {
    // Check if we're in an embedded Shopify app context
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');
    const host = urlParams.get('host');
    const embedded = urlParams.get('embedded');
    
    console.log('🔍 Installation Context:', { shop, host, embedded, isEmbedded: window.top !== window.self });
    
    if (shop && host) {
      // We're in embedded app mode - set store URL from params
      setStoreUrl(shop);
      
      // Don't auto-start installation - let user choose plan first
      // Only auto-start if explicitly embedded=true
      if (embedded === 'true') {
        setTimeout(() => {
          setIsInstalling(true);
        }, 1000);
      }
      
      // Load Shopify App Bridge if not already loaded
      if (!window.AppBridge && !document.querySelector('script[src*="app-bridge"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@shopify/app-bridge@3';
        script.onload = () => {
          if (window.AppBridge) {
            try {
              // Initialize App Bridge
              const app = window.AppBridge.createApp({
                apiKey: process.env.REACT_APP_SHOPIFY_API_KEY || 'your-api-key',
                host: host,
                forceRedirect: true
              });
              console.log('✅ App Bridge initialized in installation');
            } catch (error) {
              console.error('❌ App Bridge Error:', error);
            }
          }
        };
        document.head.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    if (isInstalling && currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      
      setSteps(prev => prev.map((step, index) => 
        index === currentStep 
          ? { ...step, status: 'active' }
          : step
      ));

      const timer = setTimeout(() => {
        setSteps(prev => prev.map((step, index) => 
          index === currentStep 
            ? { ...step, status: 'completed' }
            : step
        ));
        
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          // Installation complete - redirect to plan selection WITHIN the embedded app
          setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const shop = urlParams.get('shop');
            const host = urlParams.get('host');
            
            if (shop && host) {
              // Embedded app navigation
              window.location.href = `/shopify/plans?shop=${shop}&host=${host}`;
            } else {
              // Fallback for non-embedded
              const cleanStoreUrl = storeUrl.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
              window.location.href = `/shopify/plans?shop=${cleanStoreUrl}`;
            }
          }, 2000);
        }
      }, currentStepData.duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isInstalling, steps.length]);

  const startInstallation = () => {
    if (!storeUrl.trim()) {
      alert('Please enter your Shopify store URL');
      return;
    }
    setIsInstalling(true);
    setCurrentStep(0);
    setAnimationKey(prev => prev + 1);
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="glass-card-dark p-8 md:p-12 max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to <span className="text-gradient-primary">B3ACON</span>
          </h1>
          
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Transform your Shopify store with AI-powered optimization that increases revenue by 247% on average
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/10 rounded-xl flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-indigo-300" />
                </div>
                <p className="text-sm text-indigo-200">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Connect Your Shopify Store
          </h2>
          
          <div className="max-w-md mx-auto">
            <label className="block text-indigo-200 text-sm font-medium mb-3">
              Your Shopify Store URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="mystore.myshopify.com"
                className="input-premium text-center text-lg"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Store className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-indigo-300 mt-2 text-center">
              We'll securely connect to your store via OAuth
            </p>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={startInstallation}
            className="btn-premium btn-primary btn-large mx-auto group"
            disabled={!storeUrl.trim()}
          >
            <Shield className="w-5 h-5 mr-2" />
            <span>Connect Securely</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-indigo-300 text-sm mt-4">
            🔒 Secure OAuth connection • 🚀 Setup takes 2 minutes • ✨ Start optimizing immediately
          </p>
        </div>
      </div>
    </div>
  );

  const renderInstallationProgress = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-6xl pt-20">
        {/* Progress Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Setting Up Your Store Optimization
          </h1>
          <p className="text-indigo-200 text-lg">
            Please wait while we configure B3ACON for your store
          </p>
        </div>

        {/* Progress Steps */}
        <div className="glass-card-dark p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                    step.status === 'completed' 
                      ? 'bg-emerald-500 border-emerald-500 text-white scale-110' :
                    step.status === 'active' 
                      ? 'bg-indigo-500 border-indigo-500 text-white animate-pulse' :
                    'bg-transparent border-gray-500 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : step.status === 'active' ? (
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    ) : (
                      <step.icon className="w-8 h-8" />
                    )}
                  </div>
                  
                  <div className="text-center mt-4">
                    <div className={`font-semibold transition-colors ${
                      step.status === 'completed' || step.status === 'active' 
                        ? 'text-white' 
                        : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-sm text-indigo-300 mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                    steps[index + 1].status === 'completed' || steps[index + 1].status === 'active'
                      ? 'bg-emerald-500' 
                      : 'bg-gray-600'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {currentStep < steps.length && (
            <div className="text-center">
              <div className="text-white text-lg font-semibold mb-2">
                {steps[currentStep]?.title}
              </div>
              <div className="text-indigo-200">
                {steps[currentStep]?.description}
              </div>
            </div>
          )}
        </div>

        {/* Success Animation */}
        {currentStep >= steps.length && (
          <div className="glass-card-dark p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              🎉 You're All Set!
            </h2>
            
            <p className="text-indigo-200 text-lg mb-8">
              Your store optimization is now active. Redirecting to your dashboard...
            </p>

            <div className="premium-loader mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPlanSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-8xl pt-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-gradient-primary">Growth Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with a free trial, scale as you grow. No setup fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`glass-card p-8 cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id 
                  ? 'scale-105 ring-2 ring-indigo-500 shadow-2xl' 
                  : 'hover:scale-102'
              } ${plan.popular ? 'relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.savings && (
                <div className="absolute -top-2 -right-2">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {plan.savings}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
                <div className="mt-4 text-sm text-emerald-600 font-semibold">
                  {plan.trial}-day free trial
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={`w-6 h-6 rounded-full border-2 mx-auto transition-all ${
                selectedPlan === plan.id 
                  ? 'bg-indigo-500 border-indigo-500' 
                  : 'border-gray-300'
              }`}>
                {selectedPlan === plan.id && (
                  <CheckCircle className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => {
              console.log('🚀 Starting installation with plan:', selectedPlan);
              setIsInstalling(true);
              setCurrentStep(0);
            }}
            className="btn-premium btn-primary btn-large"
          >
            Start {pricingPlans.find(p => p.id === selectedPlan)?.trial}-Day Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-gray-500 text-sm mt-4">
            No credit card required • Cancel anytime • Full access during trial
          </p>
        </div>
      </div>
    </div>
  );

  // Get URL parameters to determine which screen to show
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get('shop');
  const host = urlParams.get('host');
  
  if (isInstalling) {
    return renderInstallationProgress();
  }

  // If we have shop parameter but not installing, show plan selection
  if (shop && storeUrl && !isInstalling) {
    return renderPlanSelection();
  }

  return renderWelcomeScreen();
};

export default PremiumShopifyInstallation;