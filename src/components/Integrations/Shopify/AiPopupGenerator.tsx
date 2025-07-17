import React, { useState } from 'react';
import { Sparkles, Eye, Settings, BarChart, Save, Play } from 'lucide-react';

interface AiCharacter {
  id: string;
  name: string;
  personality: string;
  avatar: string;
  description: string;
}

interface TriggerType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

const AiPopupGenerator = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('alex');
  const [selectedTrigger, setSelectedTrigger] = useState<string>('exit-intent');
  const [selectedTheme, setSelectedTheme] = useState<string>('modern');
  const [popupContent, setPopupContent] = useState({
    headline: 'Special Offer Just for You!',
    message: 'Get 15% off your first order when you subscribe to our newsletter.',
    buttonText: 'Claim Offer',
    offerCode: 'WELCOME15'
  });

  const aiCharacters: AiCharacter[] = [
    { id: 'alex', name: 'Alex', personality: 'Professional', avatar: '👔', description: 'Business-focused, clear communication' },
    { id: 'maya', name: 'Maya', personality: 'Friendly', avatar: '😊', description: 'Warm, approachable, conversational' },
    { id: 'zoe', name: 'Zoe', personality: 'Playful', avatar: '🎨', description: 'Creative, fun, engaging' },
    { id: 'sage', name: 'Sage', personality: 'Helpful', avatar: '🤓', description: 'Knowledgeable, supportive, detailed' }
  ];

  const triggers: TriggerType[] = [
    { id: 'exit-intent', name: 'Exit Intent', description: 'Show when user is about to leave', icon: () => <span>🚪</span> },
    { id: 'time-based', name: 'Time Based', description: 'Show after specific time on page', icon: () => <span>⏰</span> },
    { id: 'scroll-based', name: 'Scroll Based', description: 'Show after scrolling percentage', icon: () => <span>📜</span> },
    { id: 'cart-abandonment', name: 'Cart Abandonment', description: 'Show when items added but not purchased', icon: () => <span>🛒</span> },
    { id: 'page-visit', name: 'Page Visit', description: 'Show on specific page visits', icon: () => <span>📄</span> }
  ];

  const themes = [
    { id: 'modern', name: 'Modern', preview: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'minimal', name: 'Minimal', preview: 'bg-white border-2 border-gray-200' },
    { id: 'vibrant', name: 'Vibrant', preview: 'bg-gradient-to-r from-pink-500 to-orange-500' },
    { id: 'elegant', name: 'Elegant', preview: 'bg-gradient-to-r from-gray-800 to-gray-600' }
  ];

  const mockStats = {
    impressions: 1247,
    interactions: 156,
    conversions: 43,
    revenue: 2847
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Popup Generator</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="w-4 h-4" />
            <span>Save Campaign</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Play className="w-4 h-4" />
            <span>Launch</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Character Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              Choose AI Character
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {aiCharacters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacter(character.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCharacter === character.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{character.avatar}</div>
                    <div className="font-medium text-gray-900">{character.name}</div>
                    <div className="text-sm text-purple-600">{character.personality}</div>
                    <div className="text-xs text-gray-500 mt-1">{character.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Triggers</h3>
            <div className="space-y-3">
              {triggers.map((trigger) => (
                <button
                  key={trigger.id}
                  onClick={() => setSelectedTrigger(trigger.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTrigger === trigger.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <trigger.icon />
                    <div>
                      <div className="font-medium text-gray-900">{trigger.name}</div>
                      <div className="text-sm text-gray-600">{trigger.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Customization */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popup Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                <input
                  type="text"
                  value={popupContent.headline}
                  onChange={(e) => setPopupContent({ ...popupContent, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={popupContent.message}
                  onChange={(e) => setPopupContent({ ...popupContent, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={popupContent.buttonText}
                    onChange={(e) => setPopupContent({ ...popupContent, buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Code</label>
                  <input
                    type="text"
                    value={popupContent.offerCode}
                    onChange={(e) => setPopupContent({ ...popupContent, offerCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Theme</h3>
            <div className="grid grid-cols-4 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTheme === theme.id
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`w-full h-16 rounded-md mb-2 ${theme.preview}`}></div>
                  <div className="text-sm font-medium text-gray-900">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Analytics */}
        <div className="space-y-6">
          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-500" />
              Live Preview
            </h3>
            <div className="bg-gray-100 rounded-lg p-4 min-h-48 flex items-center justify-center">
              <div className={`max-w-sm w-full p-6 rounded-lg shadow-lg ${
                selectedTheme === 'modern' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' :
                selectedTheme === 'minimal' ? 'bg-white border-2 border-gray-200' :
                selectedTheme === 'vibrant' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' :
                'bg-gradient-to-r from-gray-800 to-gray-600 text-white'
              }`}>
                <h4 className="font-bold text-lg mb-2">{popupContent.headline}</h4>
                <p className="text-sm mb-4 opacity-90">{popupContent.message}</p>
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  selectedTheme === 'minimal' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}>
                  {popupContent.buttonText}
                </button>
                <p className="text-xs mt-2 opacity-75">Code: {popupContent.offerCode}</p>
              </div>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-green-500" />
              Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Impressions</span>
                <span className="font-bold">{mockStats.impressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interactions</span>
                <span className="font-bold">{mockStats.interactions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversions</span>
                <span className="font-bold text-green-600">{mockStats.conversions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-bold text-green-600">${mockStats.revenue.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                  <span className="font-bold text-blue-600">
                    {((mockStats.conversions / mockStats.interactions) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPopupGenerator;