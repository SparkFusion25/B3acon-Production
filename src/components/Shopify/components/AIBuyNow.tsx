import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap, Target, TrendingUp, Brain, Sparkles } from 'lucide-react';
import { useShopifyAuth } from '../../../contexts/ShopifyAuthContext';

const AIBuyNow: React.FC = () => {
  const { user, subscription } = useShopifyAuth();
  const [activeTab, setActiveTab] = useState('generator');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedButtons, setGeneratedButtons] = useState<any[]>([]);

  const [buttonConfig, setButtonConfig] = useState({
    product_name: '',
    target_audience: 'general',
    urgency_level: 'medium',
    personalization: true,
    ai_copy: true,
    smart_timing: true,
    dynamic_pricing: false
  });

  const handleGenerateButton = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const newButton = {
        id: Date.now(),
        product: buttonConfig.product_name,
        copy: generateAICopy(buttonConfig),
        style: generateStyle(buttonConfig),
        performance: {
          estimated_ctr: Math.random() * 15 + 5,
          estimated_conversion: Math.random() * 8 + 2
        }
      };
      
      setGeneratedButtons(prev => [newButton, ...prev.slice(0, 4)]);
      setIsGenerating(false);
    }, 2000);
  };

  const generateAICopy = (config: any) => {
    const copies = [
      `🚀 Get ${config.product_name} Now - Limited Time!`,
      `💫 Smart Buy: ${config.product_name} - AI Recommended`,
      `⚡ Instant ${config.product_name} - Perfect for You!`,
      `🎯 ${config.product_name} - Personalized Just for You`,
      `✨ Buy ${config.product_name} - Trending Now!`
    ];
    return copies[Math.floor(Math.random() * copies.length)];
  };

  const generateStyle = (config: any) => {
    const styles = [
      'gradient-primary',
      'gradient-success',
      'gradient-warning',
      'gradient-purple',
      'premium-glow'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI BUY NOW Generator</h1>
            <p className="text-gray-600">Create high-converting buy buttons with AI optimization</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'generator', label: 'AI Generator', icon: Brain },
            { id: 'templates', label: 'Templates', icon: Sparkles },
            { id: 'analytics', label: 'Performance', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* AI Generator Tab */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Configuration</h3>
              
              <form onSubmit={handleGenerateButton} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={buttonConfig.product_name}
                    onChange={(e) => setButtonConfig({...buttonConfig, product_name: e.target.value})}
                    placeholder="Enter product name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={buttonConfig.target_audience}
                    onChange={(e) => setButtonConfig({...buttonConfig, target_audience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="general">General Audience</option>
                    <option value="millennials">Millennials</option>
                    <option value="gen-z">Gen Z</option>
                    <option value="professionals">Professionals</option>
                    <option value="parents">Parents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={buttonConfig.urgency_level}
                    onChange={(e) => setButtonConfig({...buttonConfig, urgency_level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low Urgency</option>
                    <option value="medium">Medium Urgency</option>
                    <option value="high">High Urgency</option>
                  </select>
                </div>

                {/* AI Features */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">AI Features</h4>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={buttonConfig.personalization}
                      onChange={(e) => setButtonConfig({...buttonConfig, personalization: e.target.checked})}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">AI Personalization</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={buttonConfig.ai_copy}
                      onChange={(e) => setButtonConfig({...buttonConfig, ai_copy: e.target.checked})}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">AI Copy Generation</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={buttonConfig.smart_timing}
                      onChange={(e) => setButtonConfig({...buttonConfig, smart_timing: e.target.checked})}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Smart Timing</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={buttonConfig.dynamic_pricing}
                      onChange={(e) => setButtonConfig({...buttonConfig, dynamic_pricing: e.target.checked})}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Dynamic Pricing Display</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !buttonConfig.product_name}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating AI Button...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate AI Buy Button
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Generated Buttons Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Buttons</h3>
              
              {generatedButtons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No buttons generated yet. Create your first AI button!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedButtons.map((button) => (
                    <div key={button.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {button.product}
                        </span>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>CTR: {button.performance.estimated_ctr.toFixed(1)}%</span>
                          <span>Conv: {button.performance.estimated_conversion.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <button className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
                        button.style === 'gradient-primary' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                        button.style === 'gradient-success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        button.style === 'gradient-warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        button.style === 'gradient-purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg hover:shadow-xl'
                      } transform hover:scale-105 transition-all duration-200`}>
                        {button.copy}
                      </button>
                      
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 text-xs py-1 px-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                          Copy Code
                        </button>
                        <button className="flex-1 text-xs py-1 px-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200">
                          Install
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((template) => (
            <div key={template} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-2">Template {template}</h3>
              <p className="text-sm text-gray-600 mb-4">Pre-designed AI buy button template</p>
              
              <button className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md mb-3">
                🚀 Buy Now - AI Optimized!
              </button>
              
              <button className="w-full text-sm py-1 px-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Click-through Rate</span>
                <span className="font-medium">12.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium">4.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue Per Click</span>
                <span className="font-medium">$2.34</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Buttons</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm">AI Smart Button #1</span>
                <span className="text-sm font-medium text-green-600">+23% CTR</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm">Personalized CTA #2</span>
                <span className="text-sm font-medium text-green-600">+18% CTR</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm">Dynamic Button #3</span>
                <span className="text-sm font-medium text-green-600">+15% CTR</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBuyNow;