import React, { useState } from 'react';
import { 
  Gift, 
  Star, 
  Trophy, 
  Crown, 
  Gem, 
  Heart,
  TrendingUp,
  Settings,
  Mail,
  Upload,
  Check,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';

const LoyaltyRewardsPlugin = () => {
  const [setupStep, setSetupStep] = useState('selection');
  const [selectedPlan, setSelectedPlan] = useState('recommended');
  const [rewardConfig, setRewardConfig] = useState({
    name: 'VIP Points',
    percentage: 5,
    description: 'Earn points on every purchase and redeem for discounts!',
    icon: 'star',
    emailProvider: 'shopify'
  });

  const rewardPlans = [
    {
      id: 'basic',
      percentage: 3,
      label: '3% back in points',
      description: 'Perfect for getting started',
      color: 'from-blue-500 to-cyan-500',
      icon: <Star className="w-6 h-6" />,
      popular: false
    },
    {
      id: 'recommended',
      percentage: 5,
      label: '5% back in points',
      description: 'Recommended for most businesses',
      color: 'from-purple-500 to-pink-500',
      icon: <Trophy className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'premium',
      percentage: 10,
      label: '10% back in points',
      description: 'Maximum customer retention',
      color: 'from-yellow-500 to-orange-500',
      icon: <Crown className="w-6 h-6" />,
      popular: false
    }
  ];

  const rewardIcons = [
    { id: 'star', icon: <Star className="w-8 h-8" />, label: 'Star' },
    { id: 'trophy', icon: <Trophy className="w-8 h-8" />, label: 'Trophy' },
    { id: 'crown', icon: <Crown className="w-8 h-8" />, label: 'Crown' },
    { id: 'gem', icon: <Gem className="w-8 h-8" />, label: 'Gem' },
    { id: 'heart', icon: <Heart className="w-8 h-8" />, label: 'Heart' },
    { id: 'gift', icon: <Gift className="w-8 h-8" />, label: 'Gift' }
  ];

  const emailProviders = [
    { id: 'shopify', name: 'Shopify Email', description: 'Built-in Shopify email system', icon: '🛍️' },
    { id: 'mailchimp', name: 'Mailchimp', description: 'Advanced email automation', icon: '🐵' },
    { id: 'klaviyo', name: 'Klaviyo', description: 'E-commerce focused platform', icon: '📧' },
    { id: 'sendgrid', name: 'SendGrid', description: 'Reliable email delivery', icon: '📮' },
    { id: 'b3acon', name: 'B3ACON Email', description: 'Integrated B3ACON email system', icon: '🚀' }
  ];

  const PlanSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Reward Rate</h2>
        <p className="text-gray-600 text-lg">Select how much you want to reward your customers</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {rewardPlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative cursor-pointer bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
              selectedPlan === plan.id
                ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
            )}

            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl text-white mb-4`}>
                {plan.icon}
              </div>
              
              <div className="text-4xl font-bold text-gray-900 mb-2">{plan.percentage}%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">{plan.label}</div>
              <p className="text-gray-600">{plan.description}</p>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Example:</div>
                <div className="font-medium">
                  Customer spends $100 → Earns {plan.percentage * 100} points → ${plan.percentage} discount
                </div>
              </div>
            </div>

            {selectedPlan === plan.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            setRewardConfig(prev => ({
              ...prev,
              percentage: rewardPlans.find(p => p.id === selectedPlan)?.percentage || 5
            }));
            setSetupStep('customization');
          }}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Continue Setup
        </button>
      </div>
    </div>
  );

  const CustomizationStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Customize Your Rewards</h2>
        <p className="text-gray-600 text-lg">Make your loyalty program unique to your brand</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reward Program Name
            </label>
            <input
              type="text"
              value={rewardConfig.name}
              onChange={(e) => setRewardConfig(prev => ({...prev, name: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., VIP Points, Star Rewards, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Description
            </label>
            <textarea
              value={rewardConfig.description}
              onChange={(e) => setRewardConfig(prev => ({...prev, description: e.target.value}))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your rewards program..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Reward Icon
            </label>
            <div className="grid grid-cols-3 gap-3">
              {rewardIcons.map((iconOption) => (
                <button
                  key={iconOption.id}
                  onClick={() => setRewardConfig(prev => ({...prev, icon: iconOption.id}))}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    rewardConfig.icon === iconOption.id
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {iconOption.icon}
                  <div className="text-xs mt-1">{iconOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Or Upload Custom Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600">
                Click to upload or drag and drop
              </div>
              <div className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 2MB
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
          
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Floating Button (bottom right of site):</div>
            <div className="flex justify-end">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg">
                {rewardIcons.find(i => i.id === rewardConfig.icon)?.icon}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-3">Rewards Widget:</div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{rewardConfig.name}</div>
                  <div className="text-xs text-gray-600">{rewardConfig.percentage}% back in points</div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">{rewardConfig.description}</p>
              <div className="text-xs text-gray-500">
                Your Points: 450 • Available: $4.50 off
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setSetupStep('selection')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setSetupStep('email')}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Configure Email
        </button>
      </div>
    </div>
  );

  const EmailSetupStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Configuration</h2>
        <p className="text-gray-600 text-lg">Choose how to send reward notifications to customers</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emailProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => setRewardConfig(prev => ({...prev, emailProvider: provider.id}))}
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              rewardConfig.emailProvider === provider.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-3">{provider.icon}</div>
            <div className="font-semibold text-gray-900 mb-1">{provider.name}</div>
            <div className="text-sm text-gray-600">{provider.description}</div>
            
            {rewardConfig.emailProvider === provider.id && (
              <div className="mt-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Template Preview</h3>
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white mx-auto mb-3">
              <Star className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900">You earned {rewardConfig.name}!</h4>
          </div>
          <div className="text-center text-sm text-gray-600 mb-4">
            Thank you for your recent purchase! You have earned <strong>{rewardConfig.percentage * 20} points</strong> worth <strong>${rewardConfig.percentage}</strong> off your next order.
          </div>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg text-sm font-medium">
            Redeem Your Points
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setSetupStep('customization')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setSetupStep('preview')}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Preview & Install
        </button>
      </div>
    </div>
  );

  const PreviewStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Launch!</h2>
        <p className="text-gray-600 text-lg">Review your loyalty program configuration</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Configuration Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Program Name:</span>
                <span className="font-medium">{rewardConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reward Rate:</span>
                <span className="font-medium">{rewardConfig.percentage}% back in points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email Provider:</span>
                <span className="font-medium">
                  {emailProviders.find(p => p.id === rewardConfig.emailProvider)?.name}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens Next</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Floating button added to your store</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Customers earn points automatically</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Email notifications configured</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Analytics dashboard ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setSetupStep('email')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setSetupStep('installed')}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Install Loyalty Program
        </button>
      </div>
    </div>
  );

  const InstalledStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">You are Ready to Start Rewarding!</h2>
        <p className="text-gray-600 text-lg">Your loyalty program is now active</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Customer Experience</h3>
            <p className="text-sm text-gray-600">
              Customers will earn {rewardConfig.percentage}% back in points, which is {rewardConfig.percentage} points for every $1 they spend.
            </p>
          </div>
          
          <div className="text-center">
            <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Program Integration</h3>
            <p className="text-sm text-gray-600">
              A floating button will appear on your website so customers can access your loyalty program.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Email Notifications Active</h4>
          </div>
          <p className="text-sm text-gray-600">
            Customers will be sent an email every time they earn or redeem points using {emailProviders.find(p => p.id === rewardConfig.emailProvider)?.name}.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setSetupStep('selection')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Setup Another Program
        </button>
        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          View Analytics
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Gift className="w-8 h-8 text-white" />
                <h1 className="text-3xl font-bold">Loyalty Rewards Plugin</h1>
              </div>
              <p className="text-purple-100 text-lg">Build customer loyalty with automated reward points</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">+47%</div>
              <div className="text-purple-200 text-sm">Retention Rate</div>
            </div>
          </div>
        </div>

        {setupStep !== 'installed' && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {['selection', 'customization', 'email', 'preview'].map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    setupStep === step 
                      ? 'bg-purple-600 text-white' 
                      : ['selection', 'customization', 'email', 'preview'].indexOf(setupStep) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {['selection', 'customization', 'email', 'preview'].indexOf(setupStep) > index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-1 rounded ${
                      ['selection', 'customization', 'email', 'preview'].indexOf(setupStep) > index
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {setupStep === 'selection' && <PlanSelectionStep />}
          {setupStep === 'customization' && <CustomizationStep />}
          {setupStep === 'email' && <EmailSetupStep />}
          {setupStep === 'preview' && <PreviewStep />}
          {setupStep === 'installed' && <InstalledStep />}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyRewardsPlugin;