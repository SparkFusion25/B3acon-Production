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
  BarChart3
} from 'lucide-react';
import '../../styles/shopify-app.css';

interface InstallationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration: number;
}

const ShopifyInstallation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('growth');

  const installationSteps: InstallationStep[] = [
    {
      id: 'oauth',
      title: 'Shopify OAuth Redirect',
      description: 'Connecting to your Shopify store securely',
      icon: Shield,
      status: 'pending',
      duration: 2000
    },
    {
      id: 'permissions',
      title: 'Permissions Grant',
      description: 'Authorizing B3ACON to access your store data',
      icon: CheckCircle,
      status: 'pending',
      duration: 3000
    },
    {
      id: 'data-pull',
      title: 'Store Data Pull',
      description: 'Importing your products, pages, and SEO data',
      icon: Database,
      status: 'pending',
      duration: 5000
    },
    {
      id: 'plan-selection',
      title: 'Choose Subscription Plan',
      description: 'Select the plan that fits your store needs',
      icon: CreditCard,
      status: 'pending',
      duration: 0 // Manual step
    },
    {
      id: 'setup',
      title: 'Complete Setup',
      description: 'Finalizing your B3ACON configuration',
      icon: Settings,
      status: 'pending',
      duration: 2000
    }
  ];

  const [steps, setSteps] = useState(installationSteps);

  const pricingPlans = [
    {
      id: 'trial',
      name: 'Free Trial',
      price: '$0',
      period: '14 days',
      description: 'Perfect for testing all features',
      features: [
        'SEO Analysis for 50 pages',
        'Basic internal linking',
        'Shopify integration',
        'Email support'
      ],
      popular: false,
      trialDays: 14
    },
    {
      id: 'growth',
      name: 'Growth Tier',
      price: '$29',
      period: 'per month',
      description: 'For growing eCommerce stores',
      features: [
        'SEO Analysis for 500 pages',
        'Advanced internal linking',
        'Amazon + Shopify sync',
        'Priority support',
        'Custom reporting'
      ],
      popular: true,
      trialDays: 14
    },
    {
      id: 'pro',
      name: 'Pro Agency',
      price: '$99',
      period: 'per month',
      description: 'For agencies managing multiple stores',
      features: [
        'Unlimited page analysis',
        'White-label reporting',
        'Multi-store management',
        'API access',
        'Dedicated account manager'
      ],
      popular: false,
      trialDays: 14
    }
  ];

  const requiredPermissions = [
    { name: 'Read products', description: 'To analyze product pages for SEO optimization' },
    { name: 'Read pages', description: 'To scan and optimize your store pages' },
    { name: 'Read themes', description: 'To integrate SEO improvements into your theme' },
    { name: 'Read navigation', description: 'To optimize internal linking structure' },
    { name: 'Read script tags', description: 'To install tracking and optimization scripts' }
  ];

  useEffect(() => {
    if (isInstalling && currentStep < steps.length - 1) {
      const currentStepData = steps[currentStep];
      
      // Skip manual steps
      if (currentStepData.duration === 0) {
        return;
      }

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
        }
      }, currentStepData.duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isInstalling, steps.length]);

  const startInstallation = () => {
    setIsInstalling(true);
    setCurrentStep(0);
  };

  const continueToNextStep = () => {
    if (currentStep === 3) { // Plan selection step
      setSteps(prev => prev.map((step, index) => 
        index === 3 
          ? { ...step, status: 'completed' }
          : step
      ));
      setCurrentStep(4);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'oauth':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Shopify Store</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              B3ACON needs secure access to your Shopify store to provide SEO analysis and optimization features.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Required Permissions:</h3>
              <div className="space-y-3">
                {requiredPermissions.map((permission, index) => (
                  <div key={index} className="flex items-start space-x-3 text-left">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{permission.name}</div>
                      <div className="text-sm text-gray-600">{permission.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={startInstallation}
              className="btn-primary text-lg px-8 py-4 h-auto"
              disabled={isInstalling}
            >
              {isInstalling ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  Connect to Shopify
                </>
              )}
            </button>
          </div>
        );

      case 'plan-selection':
        return (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-gray-600">
                Start with a 14-day free trial on any plan. Upgrade or cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`pricing-card cursor-pointer ${
                    selectedPlan === plan.id ? 'featured' : ''
                  } ${plan.popular ? 'ring-2 ring-lime-400' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                    <div className="mt-2 text-sm text-lime-600 font-medium">
                      {plan.trialDays}-day free trial
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`w-4 h-4 rounded-full border-2 mx-auto ${
                    selectedPlan === plan.id 
                      ? 'bg-lime-500 border-lime-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPlan === plan.id && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button 
                onClick={continueToNextStep}
                className="btn-primary text-lg px-8 py-4 h-auto"
              >
                Start {pricingPlans.find(p => p.id === selectedPlan)?.trialDays}-Day Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500 mt-2">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        );

      case 'setup':
        if (steps[4].status === 'completed') {
          return (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to B3ACON! 🎉
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your store is now connected and ready for SEO optimization. Let's start improving your search rankings!
              </p>

              <div className="bg-lime-50 border border-lime-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <h3 className="font-semibold text-lime-900 mb-2">What's Next?</h3>
                <ul className="text-sm text-lime-800 space-y-1">
                  <li>• Initial SEO scan will complete in 5-10 minutes</li>
                  <li>• You'll receive optimization recommendations</li>
                  <li>• Internal linking suggestions will be generated</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/integrations/shopify-dashboard'}
                  className="btn-primary text-lg px-8 py-4 h-auto"
                >
                  <BarChart3 className="w-5 h-5" />
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => window.open('https://help.b3acon.com/getting-started', '_blank')}
                  className="btn-secondary text-lg px-8 py-4 h-auto"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Getting Started Guide
                </button>
              </div>
            </div>
          );
        }
        break;

      default:
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <step.icon className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h2>
            <p className="text-gray-600 mb-8">{step.description}</p>
            <div className="flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="b3acon-app min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-xl font-bold">B3ACON</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Shopify Installation</span>
          </div>
        </div>
      </div>

      {/* Installation Progress */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.status === 'completed' ? 'bg-lime-500 border-lime-500 text-white' :
                  step.status === 'active' ? 'bg-blue-500 border-blue-500 text-white' :
                  step.status === 'error' ? 'bg-red-500 border-red-500 text-white' :
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : step.status === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : step.status === 'active' ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-colors ${
                    step.status === 'completed' ? 'bg-lime-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {renderStepContent()}
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Need help? <a href="mailto:support@b3acon.com" className="text-lime-600 hover:text-lime-700">Contact our support team</a>
        </div>
      </div>
    </div>
  );
};

export default ShopifyInstallation;