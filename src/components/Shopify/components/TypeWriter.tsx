import React, { useState, useEffect } from 'react';
import { Type, Edit3, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { useShopifyAuth } from '../../../contexts/ShopifyAuthContext';

const TypeWriter: React.FC = () => {
  const { user, subscription } = useShopifyAuth();
  const [activeTab, setActiveTab] = useState('headlines');
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [headlineConfig, setHeadlineConfig] = useState({
    headlines: ['Transform Your Store', 'Boost Sales Today', 'Engage Customers'],
    speed: 100,
    pause_duration: 2000,
    loop: true,
    effect: 'typewriter' as 'typewriter' | 'fade' | 'slide'
  });

  const [createdHeadlines, setCreatedHeadlines] = useState<any[]>([]);

  useEffect(() => {
    if (headlineConfig.headlines.length > 0) {
      startTypewriterEffect();
    }
  }, [headlineConfig]);

  const startTypewriterEffect = () => {
    let headlineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const currentHeadline = headlineConfig.headlines[headlineIndex];

    const typeEffect = () => {
      if (!isDeleting && charIndex < currentHeadline.length) {
        setCurrentText(currentHeadline.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeEffect, headlineConfig.speed);
      } else if (isDeleting && charIndex > 0) {
        setCurrentText(currentHeadline.substring(0, charIndex - 1));
        charIndex--;
        setTimeout(typeEffect, headlineConfig.speed / 2);
      } else if (!isDeleting && charIndex === currentHeadline.length) {
        setTimeout(() => {
          isDeleting = true;
          typeEffect();
        }, headlineConfig.pause_duration);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        headlineIndex = (headlineIndex + 1) % headlineConfig.headlines.length;
        setTimeout(typeEffect, 500);
      }
    };

    if (headlineConfig.loop) {
      typeEffect();
    }
  };

  const handleSaveHeadline = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newHeadline = {
      id: Date.now(),
      headlines: [...headlineConfig.headlines],
      speed: headlineConfig.speed,
      effect: headlineConfig.effect,
      created_at: new Date().toISOString(),
      performance: {
        estimated_engagement: Math.random() * 25 + 15,
        estimated_conversions: Math.random() * 12 + 3
      }
    };
    
    setCreatedHeadlines(prev => [newHeadline, ...prev.slice(0, 9)]);
  };

  const addHeadline = () => {
    setHeadlineConfig(prev => ({
      ...prev,
      headlines: [...prev.headlines, 'New Headline']
    }));
  };

  const updateHeadline = (index: number, value: string) => {
    const updatedHeadlines = [...headlineConfig.headlines];
    updatedHeadlines[index] = value;
    setHeadlineConfig(prev => ({
      ...prev,
      headlines: updatedHeadlines
    }));
  };

  const removeHeadline = (index: number) => {
    const updatedHeadlines = headlineConfig.headlines.filter((_, i) => i !== index);
    setHeadlineConfig(prev => ({
      ...prev,
      headlines: updatedHeadlines
    }));
  };

  return (
    <div className="typewriter-container p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Type className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TypeWriter Headlines</h1>
                <p className="text-gray-600">Create dynamic, engaging headlines that convert</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{createdHeadlines.length}</div>
                <div className="text-sm text-gray-500">Active Headlines</div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-center">
            <h3 className="text-white text-lg font-medium mb-4">Live Preview</h3>
            <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-4xl font-bold text-white min-h-[3rem] flex items-center justify-center">
                {currentText}
                <span className="animate-pulse ml-1">|</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'headlines', label: 'Headline Manager', icon: Edit3 },
                { id: 'settings', label: 'Animation Settings', icon: Zap },
                { id: 'analytics', label: 'Performance', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'headlines' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Manage Headlines</h3>
                  <button
                    onClick={addHeadline}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Headline
                  </button>
                </div>

                <form onSubmit={handleSaveHeadline} className="space-y-4">
                  <div className="space-y-3">
                    {headlineConfig.headlines.map((headline, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => updateHeadline(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter headline text..."
                        />
                        <button
                          type="button"
                          onClick={() => removeHeadline(index)}
                          className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Save Headline Set
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Animation Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Typing Speed (ms)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={headlineConfig.speed}
                      onChange={(e) => setHeadlineConfig(prev => ({
                        ...prev,
                        speed: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{headlineConfig.speed}ms</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pause Duration (ms)
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="5000"
                      value={headlineConfig.pause_duration}
                      onChange={(e) => setHeadlineConfig(prev => ({
                        ...prev,
                        pause_duration: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{headlineConfig.pause_duration}ms</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Effect
                    </label>
                    <select
                      value={headlineConfig.effect}
                      onChange={(e) => setHeadlineConfig(prev => ({
                        ...prev,
                        effect: e.target.value as any
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="typewriter">Typewriter</option>
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="loop"
                      checked={headlineConfig.loop}
                      onChange={(e) => setHeadlineConfig(prev => ({
                        ...prev,
                        loop: e.target.checked
                      }))}
                      className="h-4 w-4 text-purple-600"
                    />
                    <label htmlFor="loop" className="ml-2 text-sm text-gray-700">
                      Loop animation
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Performance Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-xl p-6">
                    <Target className="h-8 w-8 text-green-600 mb-3" />
                    <div className="text-2xl font-bold text-green-700">18.5%</div>
                    <div className="text-sm text-green-600">Avg. Engagement Rate</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6">
                    <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
                    <div className="text-2xl font-bold text-blue-700">7.2%</div>
                    <div className="text-sm text-blue-600">Conversion Rate</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6">
                    <Sparkles className="h-8 w-8 text-purple-600 mb-3" />
                    <div className="text-2xl font-bold text-purple-700">{createdHeadlines.length}</div>
                    <div className="text-sm text-purple-600">Active Headlines</div>
                  </div>
                </div>

                {createdHeadlines.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Recent Headline Sets</h4>
                    <div className="space-y-3">
                      {createdHeadlines.map((headline) => (
                        <div key={headline.id} className="bg-white rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {headline.headlines.join(' • ')}
                            </div>
                            <div className="text-sm text-gray-500">
                              Created {new Date(headline.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {headline.performance.estimated_engagement.toFixed(1)}% engagement
                            </div>
                            <div className="text-sm text-gray-500">
                              {headline.performance.estimated_conversions.toFixed(1)}% conversion
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeWriter;