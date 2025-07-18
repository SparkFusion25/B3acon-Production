import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Brain, 
  ShoppingCart, 
  Target, 
  Users, 
  BarChart3,
  Settings,
  Copy,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  ArrowRight,
  Star,
  TrendingUp,
  Mail,
  MessageSquare,
  Gift,
  Crown,
  Sparkles
} from 'lucide-react';

const PowerBuyAIButton = () => {
  const [setupStep, setSetupStep] = useState('features');
  const [buttonConfig, setButtonConfig] = useState({
    text: 'Buy Now with AI',
    style: 'gradient',
    size: 'large',
    position: 'product-page',
    aiFeatures: {
      customerRecognition: true,
      abandonedCartRecovery: true,
      smartRecommendations: true,
      oneClickCheckout: true,
      behavioralTriggers: true
    },
    customization: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      borderRadius: '12',
      animation: 'pulse'
    },
    triggers: {
      cartAbandonment: 30,
      hesitationDelay: 10,
      exitIntent: true
    }
  });
  
  const [embedCode, setEmbedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const aiFeatures = [
    {
      id: 'customerRecognition',
      name: 'Smart Customer Recognition',
      description: 'AI identifies returning customers and personalizes their experience',
      icon: <Brain className="w-6 h-6" />,
      benefits: ['30% faster checkout', 'Personalized product suggestions', 'VIP customer detection']
    },
    {
      id: 'abandonedCartRecovery',
      name: 'Abandoned Cart Recovery',
      description: 'Detects when customers hesitate and sends smart recovery messages',
      icon: <ShoppingCart className="w-6 h-6" />,
      benefits: ['25% cart recovery rate', 'Smart timing algorithms', 'Personalized offers']
    },
    {
      id: 'smartRecommendations',
      name: 'AI Purchase Suggestions',
      description: 'Machine learning powered product recommendations',
      icon: <Target className="w-6 h-6" />,
      benefits: ['40% higher AOV', 'Cross-sell optimization', 'Inventory management']
    },
    {
      id: 'oneClickCheckout',
      name: 'One-Click Checkout',
      description: 'Streamlined purchase flow with saved customer data',
      icon: <Zap className="w-6 h-6" />,
      benefits: ['70% faster checkout', 'Reduced cart abandonment', 'Mobile optimized']
    },
    {
      id: 'behavioralTriggers',
      name: 'Behavioral Triggers',
      description: 'Custom actions based on real-time user behavior analysis',
      icon: <BarChart3 className="w-6 h-6" />,
      benefits: ['Real-time personalization', 'Exit-intent detection', 'Urgency creation']
    }
  ];

  const buttonStyles = [
    { id: 'gradient', name: 'AI Gradient', preview: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'neon', name: 'Neon Glow', preview: 'bg-blue-500 shadow-lg shadow-blue-500/50' },
    { id: 'minimal', name: 'Minimal', preview: 'bg-gray-900 border border-gray-700' },
    { id: 'rounded', name: 'Rounded', preview: 'bg-green-500 rounded-full' }
  ];

  const buttonSizes = [
    { id: 'small', name: 'Small', class: 'px-4 py-2 text-sm' },
    { id: 'medium', name: 'Medium', class: 'px-6 py-3 text-base' },
    { id: 'large', name: 'Large', class: 'px-8 py-4 text-lg' },
    { id: 'xl', name: 'Extra Large', class: 'px-10 py-5 text-xl' }
  ];

  useEffect(() => {
    if (setupStep === 'embed') {
      generateEmbedCode();
    }
  }, [setupStep, buttonConfig]);

  const generateEmbedCode = () => {
    const storeId = 'YOUR_STORE_ID';
    const config = btoa(JSON.stringify(buttonConfig));
    
    const code = `<!-- B3ACON PowerBuy AI Button -->
<script type="text/javascript">
(function(w,d,s,l,i){
  w[l]=w[l]||[];w[l].push({'powerbuy.start':
  new Date().getTime(),event:'powerbuy.js'});
  var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://cdn.b3acon.com/powerbuy/v1/button.js?id='+i+'&config=${config}';
  f.parentNode.insertBefore(j,f);
})(window,document,'script','powerBuyLayer','${storeId}');
</script>

<!-- Button Container -->
<div id="powerbuy-ai-button" data-store-id="${storeId}"></div>

<style>
.powerbuy-button {
  background: linear-gradient(135deg, ${buttonConfig.customization.primaryColor}, ${buttonConfig.customization.secondaryColor});
  border-radius: ${buttonConfig.customization.borderRadius}px;
  animation: ${buttonConfig.customization.animation} 2s infinite;
}
</style>`;

    setEmbedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const FeaturesStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">PowerBuy AI Features</h2>
        <p className="text-gray-600 text-lg">Choose which AI features to enable for your buy button</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {aiFeatures.map((feature) => (
          <div
            key={feature.id}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              buttonConfig.aiFeatures[feature.id as keyof typeof buttonConfig.aiFeatures]
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setButtonConfig(prev => ({
              ...prev,
              aiFeatures: {
                ...prev.aiFeatures,
                [feature.id]: !prev.aiFeatures[feature.id as keyof typeof prev.aiFeatures]
              }
            }))}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${
                buttonConfig.aiFeatures[feature.id as keyof typeof buttonConfig.aiFeatures]
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-1">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-500">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setSetupStep('customization')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          Customize Button
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const CustomizationStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Customize Your AI Button</h2>
        <p className="text-gray-600 text-lg">Design the perfect buy button for your store</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Button Text</label>
            <input
              type="text"
              value={buttonConfig.text}
              onChange={(e) => setButtonConfig(prev => ({...prev, text: e.target.value}))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Buy Now with AI"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Button Style</label>
            <div className="grid grid-cols-2 gap-3">
              {buttonStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setButtonConfig(prev => ({...prev, style: style.id}))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    buttonConfig.style === style.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-12 ${style.preview} rounded-lg mb-2`}></div>
                  <div className="text-sm font-medium">{style.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Button Size</label>
            <div className="grid grid-cols-2 gap-3">
              {buttonSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setButtonConfig(prev => ({...prev, size: size.id}))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    buttonConfig.size === size.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{size.name}</div>
                  <div className="text-xs text-gray-500">{size.class}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <input
                type="color"
                value={buttonConfig.customization.primaryColor}
                onChange={(e) => setButtonConfig(prev => ({
                  ...prev,
                  customization: {...prev.customization, primaryColor: e.target.value}
                }))}
                className="w-full h-12 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <input
                type="color"
                value={buttonConfig.customization.secondaryColor}
                onChange={(e) => setButtonConfig(prev => ({
                  ...prev,
                  customization: {...prev.customization, secondaryColor: e.target.value}
                }))}
                className="w-full h-12 rounded-lg border border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-gray-600 mb-3">Desktop View:</div>
              <button
                className={`${buttonSizes.find(s => s.id === buttonConfig.size)?.class} bg-gradient-to-r text-white font-semibold rounded-lg transition-all hover:shadow-lg`}
                style={{
                  background: `linear-gradient(135deg, ${buttonConfig.customization.primaryColor}, ${buttonConfig.customization.secondaryColor})`,
                  borderRadius: `${buttonConfig.customization.borderRadius}px`
                }}
              >
                <Zap className="w-4 h-4 mr-2 inline" />
                {buttonConfig.text}
              </button>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-gray-600 mb-3">Mobile View:</div>
              <button
                className="w-full py-3 px-4 bg-gradient-to-r text-white font-semibold rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${buttonConfig.customization.primaryColor}, ${buttonConfig.customization.secondaryColor})`
                }}
              >
                <Smartphone className="w-4 h-4 mr-2 inline" />
                {buttonConfig.text}
              </button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">AI Features Active:</h4>
              <div className="space-y-1">
                {Object.entries(buttonConfig.aiFeatures).map(([key, enabled]) => (
                  enabled && (
                    <div key={key} className="flex items-center text-sm text-blue-700">
                      <Sparkles className="w-3 h-3 mr-2" />
                      {aiFeatures.find(f => f.id === key)?.name}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setSetupStep('features')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Back to Features
        </button>
        <button
          onClick={() => setSetupStep('triggers')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          Configure AI Triggers
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const TriggersStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Behavioral Triggers</h2>
        <p className="text-gray-600 text-lg">Configure when and how AI interventions occur</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Cart Abandonment</h3>
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-gray-600">Trigger after (seconds):</label>
            <input
              type="number"
              value={buttonConfig.triggers.cartAbandonment}
              onChange={(e) => setButtonConfig(prev => ({
                ...prev,
                triggers: {...prev.triggers, cartAbandonment: parseInt(e.target.value)}
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="10"
              max="300"
            />
            <p className="text-xs text-gray-500">AI will intervene if user doesn't complete purchase</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Hesitation Detection</h3>
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-gray-600">Detect after (seconds):</label>
            <input
              type="number"
              value={buttonConfig.triggers.hesitationDelay}
              onChange={(e) => setButtonConfig(prev => ({
                ...prev,
                triggers: {...prev.triggers, hesitationDelay: parseInt(e.target.value)}
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="5"
              max="60"
            />
            <p className="text-xs text-gray-500">AI detects when users pause before buying</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Target className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Exit Intent</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={buttonConfig.triggers.exitIntent}
                onChange={(e) => setButtonConfig(prev => ({
                  ...prev,
                  triggers: {...prev.triggers, exitIntent: e.target.checked}
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Enable exit-intent detection</span>
            </label>
            <p className="text-xs text-gray-500">AI triggers when user tries to leave page</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Performance Boost</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+47%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+31%</div>
            <div className="text-sm text-gray-600">Average Order Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">-23%</div>
            <div className="text-sm text-gray-600">Cart Abandonment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">+12%</div>
            <div className="text-sm text-gray-600">Customer Lifetime Value</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setSetupStep('customization')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Back to Customization
        </button>
        <button
          onClick={() => setSetupStep('embed')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          Generate Embed Code
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const EmbedStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Installation Code</h2>
        <p className="text-gray-600 text-lg">Copy and paste this code into your Shopify theme</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Embed Code</h3>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copySuccess ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <pre className="text-green-400 text-sm overflow-x-auto">
          <code>{embedCode}</code>
        </pre>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-3">Installation Instructions</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Copy the embed code above</li>
            <li>2. Go to your Shopify admin → Online Store → Themes</li>
            <li>3. Click "Actions" → "Edit code"</li>
            <li>4. Find your product page template (usually product.liquid)</li>
            <li>5. Paste the code where you want the button to appear</li>
            <li>6. Save and test on your store</li>
          </ol>
        </div>

        <div className="p-6 bg-green-50 rounded-xl">
          <h3 className="font-semibold text-green-900 mb-3">AI Features Activated</h3>
          <div className="space-y-2 text-sm text-green-800">
            {Object.entries(buttonConfig.aiFeatures).map(([key, enabled]) => (
              enabled && (
                <div key={key} className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  {aiFeatures.find(f => f.id === key)?.name}
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setSetupStep('triggers')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Back to Triggers
        </button>
        <button
          onClick={() => setSetupStep('success')}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          Complete Setup
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const SuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">PowerBuy AI Button Activated!</h2>
        <p className="text-gray-600 text-lg">Your intelligent buy button is ready to boost conversions</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Expected Results</h3>
            <p className="text-sm text-gray-600">
              Up to 47% increase in conversion rates with AI-powered optimization and behavioral triggers.
            </p>
          </div>
          
          <div className="text-center">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">AI Learning</h3>
            <p className="text-sm text-gray-600">
              The AI will learn from your customers and continuously improve performance.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Performance Tracking</h4>
          </div>
          <p className="text-sm text-gray-600">
            Monitor your PowerBuy AI performance in the B3ACON dashboard with real-time analytics and conversion tracking.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setSetupStep('features')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Create Another Button
        </button>
        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          View Analytics
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-8 h-8 text-white" />
                <h1 className="text-3xl font-bold">PowerBuy AI Button</h1>
              </div>
              <p className="text-blue-100 text-lg">Intelligent buy button with AI-powered conversion optimization</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">+47%</div>
              <div className="text-blue-200 text-sm">Conversion Boost</div>
            </div>
          </div>
        </div>

        {setupStep !== 'success' && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {['features', 'customization', 'triggers', 'embed'].map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    setupStep === step 
                      ? 'bg-blue-600 text-white' 
                      : ['features', 'customization', 'triggers', 'embed'].indexOf(setupStep) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {['features', 'customization', 'triggers', 'embed'].indexOf(setupStep) > index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-1 rounded ${
                      ['features', 'customization', 'triggers', 'embed'].indexOf(setupStep) > index
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
          {setupStep === 'features' && <FeaturesStep />}
          {setupStep === 'customization' && <CustomizationStep />}
          {setupStep === 'triggers' && <TriggersStep />}
          {setupStep === 'embed' && <EmbedStep />}
          {setupStep === 'success' && <SuccessStep />}
        </div>
      </div>
    </div>
  );
};

export default PowerBuyAIButton;