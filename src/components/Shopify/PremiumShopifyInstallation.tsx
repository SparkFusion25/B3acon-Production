import React, { useState, useEffect } from 'react';
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
      description: 'Perfect for small stores',
      features: [
        'SEO optimization for 100 products',
        'Basic analytics',
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
      description: 'Best for growing businesses',
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
          // Installation complete - redirect to Shopify Admin instead of dashboard
          setTimeout(() => {
            window.location.href = '/shopify/admin';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="container-ultra-wide">
        <div className="glass-card-dark p-6 sm:p-8 lg:p-12 xl:p-16">
          <div className="text-center mb-8 lg:mb-12 xl:mb-16 text-scale-ultra">
            <div className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 text-white" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-4">
              Welcome to <span className="text-gradient-primary">B3ACON</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-indigo-200 mb-8 lg:mb-12 max-w-4xl xl:max-w-5xl mx-auto leading-relaxed">
              Transform your Shopify store with AI-powered optimization that increases revenue by 247% on average
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 mb-8 lg:mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center p-4 xl:p-6">
                  <div className="w-12 h-12 xl:w-16 xl:h-16 mx-auto mb-3 bg-white/10 rounded-xl flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 xl:w-8 xl:h-8 text-indigo-300" />
                  </div>
                  <p className="text-sm xl:text-base text-indigo-200">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 xl:p-10 mb-8">
            <h2 className="text-2xl xl:text-3xl font-bold text-white mb-6 xl:mb-8 text-center">
              Connect Your Shopify Store
            </h2>
            
            <div className="max-w-lg xl:max-w-xl mx-auto">
              <label className="block text-indigo-200 text-sm xl:text-base font-medium mb-3">
                Your Shopify Store URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="mystore.myshopify.com"
                  className="input-premium text-center text-lg xl:text-xl w-full h-12 xl:h-14"
                />
                <div className="absolute right-3 xl:right-4 top-1/2 transform -translate-y-1/2">
                  <Store className="w-5 h-5 xl:w-6 xl:h-6 text-gray-400" />
                </div>
              </div>
              <p className="text-xs xl:text-sm text-indigo-300 mt-2 text-center">
                We'll securely connect to your store via OAuth
              </p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={startInstallation}
              className="btn-premium btn-primary btn-large mx-auto group text-lg xl:text-xl px-8 xl:px-12 py-4 xl:py-5"
              disabled={!storeUrl.trim()}
            >
              <Shield className="w-5 h-5 xl:w-6 xl:h-6 mr-2" />
              <span>Connect Securely</span>
              <ArrowRight className="w-5 h-5 xl:w-6 xl:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-indigo-300 text-sm xl:text-base mt-4 xl:mt-6">
              🔒 Secure OAuth connection • 🚀 Setup takes 2 minutes • ✨ Start optimizing immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstallationProgress = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 sm:p-6 lg:p-8">
      <div className="container-ultra-wide pt-12 sm:pt-20 xl:pt-24">
        {/* Progress Header */}
        <div className="text-center mb-8 sm:mb-12 xl:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
            Setting Up Your Store Optimization
          </h1>
          <p className="text-indigo-200 text-base sm:text-lg xl:text-xl">
            Please wait while we configure B3ACON for your store
          </p>
        </div>

        {/* Progress Steps */}
        <div className="glass-card-dark p-6 sm:p-8 xl:p-12 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8 xl:mb-12 space-y-6 lg:space-y-0 lg:space-x-4 xl:space-x-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center max-w-48">
                  <div className={`w-16 h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                    step.status === 'completed' 
                      ? 'bg-emerald-500 border-emerald-500 text-white scale-110' :
                    step.status === 'active' 
                      ? 'bg-indigo-500 border-indigo-500 text-white animate-pulse' :
                    'bg-transparent border-gray-500 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-8 h-8 xl:w-10 xl:h-10" />
                    ) : step.status === 'active' ? (
                      <RefreshCw className="w-8 h-8 xl:w-10 xl:h-10 animate-spin" />
                    ) : (
                      <step.icon className="w-8 h-8 xl:w-10 xl:h-10" />
                    )}
                  </div>
                  <h3 className="text-white font-semibold mt-4 text-base xl:text-lg">{step.title}</h3>
                  <p className="text-indigo-200 text-sm xl:text-base mt-2">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block h-1 flex-1 mx-4 xl:mx-8 rounded transition-all duration-500 ${
                    steps[index + 1].status === 'completed' || (steps[index + 1].status === 'active' && step.status === 'completed')
                      ? 'bg-emerald-500' 
                      : 'bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Current Step Details */}
          <div className="text-center">
            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-indigo-500 rounded-full mx-auto mb-4 xl:mb-6 flex items-center justify-center">
              <Clock className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg xl:text-xl">
              {steps[currentStep]?.title || 'Installation Complete'}
            </h3>
            <p className="text-indigo-200 text-base xl:text-lg">
              {currentStep < steps.length 
                ? `${steps[currentStep]?.description}...`
                : 'Redirecting to your B3ACON Admin Dashboard...'
              }
            </p>
          </div>
        </div>

        {/* Success Message */}
        {currentStep >= steps.length && (
          <div className="text-center">
            <div className="w-20 h-20 xl:w-24 xl:h-24 bg-emerald-500 rounded-full mx-auto mb-6 xl:mb-8 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 xl:w-12 xl:h-12 text-white" />
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4">Installation Complete!</h2>
            <p className="text-emerald-200 mb-6 text-lg xl:text-xl">
              Welcome to B3ACON! Redirecting to your admin dashboard...
            </p>
            <div className="animate-spin w-8 h-8 xl:w-10 xl:h-10 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );

  return isInstalling ? renderInstallationProgress() : renderWelcomeScreen();
};

export default PremiumShopifyInstallation;