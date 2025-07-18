import React, { useState } from 'react';
import { Zap, Settings, Palette, Code, Eye, Copy, Check, ArrowRight, ArrowLeft, Sparkles, Target, Clock, MousePointer, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PowerBuyFeatures {
  customerRecognition: boolean;
  abandonedCartRecovery: boolean;
  smartRecommendations: boolean;
  oneClickCheckout: boolean;
  behavioralTriggers: boolean;
}

interface ButtonDesign {
  text: string;
  size: 'small' | 'medium' | 'large';
  color: string;
  backgroundColor: string;
  borderRadius: number;
  position: 'bottom-right' | 'bottom-left' | 'floating' | 'inline';
}

interface AITriggers {
  cartAbandonmentDelay: number;
  scrollPercentage: number;
  timeOnPage: number;
  exitIntent: boolean;
  returnVisitor: boolean;
}

const PowerBuyAI: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [features, setFeatures] = useState<PowerBuyFeatures>({
    customerRecognition: true,
    abandonedCartRecovery: true,
    smartRecommendations: true,
    oneClickCheckout: false,
    behavioralTriggers: true
  });
  
  const [buttonDesign, setButtonDesign] = useState<ButtonDesign>({
    text: 'Buy Now with AI',
    size: 'medium',
    color: '#FFFFFF',
    backgroundColor: '#6366F1',
    borderRadius: 8,
    position: 'bottom-right'
  });
  
  const [aiTriggers, setAiTriggers] = useState<AITriggers>({
    cartAbandonmentDelay: 30,
    scrollPercentage: 70,
    timeOnPage: 45,
    exitIntent: true,
    returnVisitor: true
  });
  
  const [embedCode, setEmbedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEmbedCode = () => {
    const code = `<!-- B3ACON PowerBuy AI Button -->
<script>
(function() {
  window.B3ACON_POWERBUY = {
    features: ${JSON.stringify(features, null, 2)},
    design: ${JSON.stringify(buttonDesign, null, 2)},
    triggers: ${JSON.stringify(aiTriggers, null, 2)},
    storeId: 'your-store-id'
  };
  
  var script = document.createElement('script');
  script.src = 'https://cdn.b3acon.com/powerbuy-ai.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>
<!-- End B3ACON PowerBuy AI Button -->`;
    
    setEmbedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Embed code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 3) {
        generateEmbedCode();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return Settings;
      case 2: return Palette;
      case 3: return Target;
      case 4: return Code;
      default: return Settings;
    }
  };

  const renderStepHeader = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">PowerBuy AI Button</h2>
            <p className="text-gray-600">Intelligent conversion optimization for your store</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Step {currentStep} of 4</div>
          <div className="text-lg font-semibold text-gray-900">
            {currentStep === 1 && 'Features Selection'}
            {currentStep === 2 && 'Button Customization'}
            {currentStep === 3 && 'AI Triggers'}
            {currentStep === 4 && 'Embed Code'}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between mt-4">
        {[1, 2, 3, 4].map((step) => {
          const StepIcon = getStepIcon(step);
          return (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step <= currentStep 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <StepIcon className="w-4 h-4" />
              </div>
              <div className={`text-xs mt-1 ${
                step <= currentStep ? 'text-indigo-600' : 'text-gray-400'
              }`}>
                Step {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Choose AI Features</h3>
        <p className="text-gray-600 mb-6">Select which AI capabilities you want to enable for your store</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              key: 'customerRecognition',
              title: 'AI Customer Recognition',
              description: 'Identifies returning customers automatically',
              impact: '+12% Customer Retention'
            },
            {
              key: 'abandonedCartRecovery',
              title: 'Abandoned Cart Recovery',
              description: 'Smart intervention when customers hesitate',
              impact: '-23% Cart Abandonment'
            },
            {
              key: 'smartRecommendations',
              title: 'Smart Recommendations',
              description: 'ML-powered product suggestions',
              impact: '+31% Average Order Value'
            },
            {
              key: 'oneClickCheckout',
              title: 'One-Click Checkout',
              description: 'Streamlined purchase flow',
              impact: '+47% Conversion Rate'
            },
            {
              key: 'behavioralTriggers',
              title: 'Behavioral Triggers',
              description: 'Real-time user behavior analysis',
              impact: '+19% Engagement'
            }
          ].map((feature) => (
            <div 
              key={feature.key}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                features[feature.key as keyof PowerBuyFeatures] 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setFeatures({
                ...features,
                [feature.key]: !features[feature.key as keyof PowerBuyFeatures]
              })}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      features[feature.key as keyof PowerBuyFeatures]
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {features[feature.key as keyof PowerBuyFeatures] && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                  <div className="text-xs text-green-600 font-semibold">{feature.impact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Customize Button Design</h3>
        <p className="text-gray-600 mb-6">Design your PowerBuy button to match your brand</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Design Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={buttonDesign.text}
                onChange={(e) => setButtonDesign({...buttonDesign, text: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <select
                value={buttonDesign.size}
                onChange={(e) => setButtonDesign({...buttonDesign, size: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={buttonDesign.color}
                    onChange={(e) => setButtonDesign({...buttonDesign, color: e.target.value})}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttonDesign.color}
                    onChange={(e) => setButtonDesign({...buttonDesign, color: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={buttonDesign.backgroundColor}
                    onChange={(e) => setButtonDesign({...buttonDesign, backgroundColor: e.target.value})}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttonDesign.backgroundColor}
                    onChange={(e) => setButtonDesign({...buttonDesign, backgroundColor: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius: {buttonDesign.borderRadius}px</label>
              <input
                type="range"
                min="0"
                max="20"
                value={buttonDesign.borderRadius}
                onChange={(e) => setButtonDesign({...buttonDesign, borderRadius: Number(e.target.value)})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select
                value={buttonDesign.position}
                onChange={(e) => setButtonDesign({...buttonDesign, position: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="floating">Floating Center</option>
                <option value="inline">Inline with Products</option>
              </select>
            </div>
          </div>
          
          {/* Live Preview */}
          <div className="bg-gray-100 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Live Preview</h4>
            <div className="bg-white rounded-lg p-8 min-h-[300px] relative">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                <h5 className="font-semibold text-gray-900">Sample Product</h5>
                <p className="text-gray-600">$29.99</p>
              </div>
              
              <button
                style={{
                  color: buttonDesign.color,
                  backgroundColor: buttonDesign.backgroundColor,
                  borderRadius: `${buttonDesign.borderRadius}px`,
                  fontSize: buttonDesign.size === 'small' ? '14px' : buttonDesign.size === 'large' ? '18px' : '16px',
                  padding: buttonDesign.size === 'small' ? '8px 16px' : buttonDesign.size === 'large' ? '16px 32px' : '12px 24px'
                }}
                className="flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transition-shadow"
              >
                <Sparkles className="w-4 h-4" />
                <span>{buttonDesign.text}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Configure AI Triggers</h3>
        <p className="text-gray-600 mb-6">Set when the AI should intervene to boost conversions</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cart Abandonment Delay: {aiTriggers.cartAbandonmentDelay}s
              </label>
              <input
                type="range"
                min="10"
                max="120"
                value={aiTriggers.cartAbandonmentDelay}
                onChange={(e) => setAiTriggers({...aiTriggers, cartAbandonmentDelay: Number(e.target.value)})}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Trigger AI intervention after cart inactivity</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scroll Trigger: {aiTriggers.scrollPercentage}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={aiTriggers.scrollPercentage}
                onChange={(e) => setAiTriggers({...aiTriggers, scrollPercentage: Number(e.target.value)})}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Show recommendations when user scrolls to this point</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time on Page: {aiTriggers.timeOnPage}s
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={aiTriggers.timeOnPage}
                onChange={(e) => setAiTriggers({...aiTriggers, timeOnPage: Number(e.target.value)})}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Activate AI after this time on product page</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="exitIntent"
                  checked={aiTriggers.exitIntent}
                  onChange={(e) => setAiTriggers({...aiTriggers, exitIntent: e.target.checked})}
                  className="w-5 h-5 text-indigo-600"
                />
                <div>
                  <label htmlFor="exitIntent" className="font-medium text-gray-900">Exit Intent Detection</label>
                  <p className="text-sm text-gray-600">Show AI popup when user moves cursor to leave</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="returnVisitor"
                  checked={aiTriggers.returnVisitor}
                  onChange={(e) => setAiTriggers({...aiTriggers, returnVisitor: e.target.checked})}
                  className="w-5 h-5 text-indigo-600"
                />
                <div>
                  <label htmlFor="returnVisitor" className="font-medium text-gray-900">Return Visitor Recognition</label>
                  <p className="text-sm text-gray-600">Special offers for returning customers</p>
                </div>
              </div>
            </div>
            
            {/* Performance Predictions */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-3">Expected Performance</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-blue-600 font-semibold">+47%</div>
                  <div className="text-blue-800">Conversion Rate</div>
                </div>
                <div>
                  <div className="text-blue-600 font-semibold">+31%</div>
                  <div className="text-blue-800">Order Value</div>
                </div>
                <div>
                  <div className="text-blue-600 font-semibold">-23%</div>
                  <div className="text-blue-800">Cart Abandonment</div>
                </div>
                <div>
                  <div className="text-blue-600 font-semibold">+12%</div>
                  <div className="text-blue-800">Customer LTV</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Embed Code Generated</h3>
        <p className="text-gray-600 mb-6">Copy this code and paste it into your Shopify theme files</p>
        
        <div className="space-y-6">
          {/* Installation Instructions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Installation Instructions</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Copy the embed code below</li>
              <li>Go to your Shopify Admin → Online Store → Themes</li>
              <li>Click "Actions" → "Edit code" on your active theme</li>
              <li>Open the <code className="bg-gray-100 px-1 rounded">theme.liquid</code> file</li>
              <li>Paste the code before the closing <code className="bg-gray-100 px-1 rounded">&lt;/head&gt;</code> tag</li>
              <li>Save the file and the PowerBuy AI Button will be active</li>
            </ol>
          </div>
          
          {/* Embed Code */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">Embed Code</h4>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
              {embedCode}
            </pre>
          </div>
          
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">PowerBuy AI Setup Complete!</h4>
                <p className="text-green-700">Your intelligent conversion optimizer is ready to boost sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="flex items-center justify-between pt-8 border-t border-gray-200">
      <button
        onClick={prevStep}
        disabled={currentStep === 1}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
          currentStep === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>
      
      <div className="text-center">
        <div className="text-sm text-gray-500">
          {currentStep === 1 && 'Choose your AI features'}
          {currentStep === 2 && 'Customize button appearance'}
          {currentStep === 3 && 'Configure behavioral triggers'}
          {currentStep === 4 && 'Copy embed code'}
        </div>
      </div>
      
      <button
        onClick={nextStep}
        disabled={currentStep === 4}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
          currentStep === 4
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        <span>{currentStep === 4 ? 'Complete' : 'Next'}</span>
        {currentStep !== 4 && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {renderStepHeader()}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        
        {renderNavigation()}
      </div>
    </div>
  );
};

export default PowerBuyAI;