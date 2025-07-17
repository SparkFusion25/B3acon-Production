import React, { useState } from 'react';
import { Bot, Zap, Eye, Target, Clock, MousePointer, Settings, Play, Pause, BarChart3, Download, Upload, Palette, MessageCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PopupTrigger {
  type: 'exit-intent' | 'time-based' | 'scroll-based' | 'cart-abandonment' | 'page-visit';
  value?: number;
  conditions?: string[];
}

interface AiCharacter {
  id: string;
  name: string;
  avatar: string;
  personality: 'friendly' | 'professional' | 'playful' | 'helpful';
  description: string;
}

interface ConversationStep {
  id: string;
  type: 'greeting' | 'question' | 'offer' | 'closing';
  message: string;
  options?: string[];
  actions?: {
    type: 'discount' | 'redirect' | 'collect-email' | 'product-suggest';
    value?: string;
  }[];
}

interface PopupDesign {
  theme: 'modern' | 'minimal' | 'vibrant' | 'elegant';
  primaryColor: string;
  secondaryColor: string;
  position: 'center' | 'bottom-right' | 'bottom-left' | 'slide-in';
  size: 'small' | 'medium' | 'large';
  animation: 'fade' | 'slide' | 'bounce' | 'pulse';
}

interface PopupCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  character: AiCharacter;
  triggers: PopupTrigger[];
  conversation: ConversationStep[];
  design: PopupDesign;
  targeting: {
    pages?: string[];
    audience?: string;
    devices?: string[];
    timeRange?: {
      start: string;
      end: string;
    };
  };
  analytics: {
    impressions: number;
    interactions: number;
    conversions: number;
    revenue: number;
  };
}

const AiPopupGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<PopupCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<PopupCampaign | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Pre-defined AI characters
  const availableCharacters: AiCharacter[] = [
    {
      id: 'alex',
      name: 'Alex',
      avatar: '👨‍💼',
      personality: 'professional',
      description: 'Professional and knowledgeable assistant'
    },
    {
      id: 'maya',
      name: 'Maya',
      avatar: '👩‍🦰',
      personality: 'friendly',
      description: 'Warm and approachable helper'
    },
    {
      id: 'zoe',
      name: 'Zoe',
      avatar: '🤖',
      personality: 'playful',
      description: 'Fun and energetic AI companion'
    },
    {
      id: 'sage',
      name: 'Sage',
      avatar: '👨‍🎓',
      personality: 'helpful',
      description: 'Wise and informative guide'
    }
  ];

  const [newCampaign, setNewCampaign] = useState<Partial<PopupCampaign>>({
    name: '',
    status: 'draft',
    character: availableCharacters[0],
    triggers: [{ type: 'exit-intent' }],
    conversation: [
      {
        id: '1',
        type: 'greeting',
        message: 'Hi there! I noticed you\'re browsing our products. Can I help you find something special?',
        options: ['Yes, show me deals', 'I\'m just looking', 'Help me choose']
      }
    ],
    design: {
      theme: 'modern',
      primaryColor: '#3B82F6',
      secondaryColor: '#F3F4F6',
      position: 'bottom-right',
      size: 'medium',
      animation: 'slide'
    },
    targeting: {
      pages: ['all'],
      devices: ['desktop', 'mobile']
    },
    analytics: {
      impressions: 0,
      interactions: 0,
      conversions: 0,
      revenue: 0
    }
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name) {
      toast.error('Please enter a campaign name');
      return;
    }

    const campaign: PopupCampaign = {
      id: Date.now().toString(),
      ...newCampaign as PopupCampaign
    };

    setCampaigns(prev => [...prev, campaign]);
    setIsCreating(false);
    setNewCampaign({
      name: '',
      status: 'draft',
      character: availableCharacters[0],
      triggers: [{ type: 'exit-intent' }],
      conversation: [],
      design: {
        theme: 'modern',
        primaryColor: '#3B82F6',
        secondaryColor: '#F3F4F6',
        position: 'bottom-right',
        size: 'medium',
        animation: 'slide'
      },
      targeting: {},
      analytics: {
        impressions: 0,
        interactions: 0,
        conversions: 0,
        revenue: 0
      }
    });

    toast.success('Popup campaign created successfully!');
  };

  const handleToggleCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
    toast.success('Campaign status updated');
  };

  const renderCampaignsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">AI Popup Campaigns</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Popup Campaigns Yet</h3>
          <p className="text-gray-600 mb-4">Create your first AI popup to start engaging customers</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-2 bg-signal-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{campaign.character.avatar}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-500">{campaign.character.name}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{campaign.analytics.impressions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{(campaign.analytics.conversions / Math.max(campaign.analytics.impressions, 1) * 100).toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Conversion</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleToggleCampaign(campaign.id)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      campaign.status === 'active' 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => setSelectedCampaign(campaign)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCampaignBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Create AI Popup Campaign</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateCampaign}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Create Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campaign Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Campaign Settings</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Summer Sale Popup"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Character</label>
                <div className="grid grid-cols-2 gap-3">
                  {availableCharacters.map((character) => (
                    <button
                      key={character.id}
                      onClick={() => setNewCampaign(prev => ({ ...prev, character }))}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        newCampaign.character?.id === character.id
                          ? 'border-signal-blue bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{character.avatar}</span>
                        <span className="font-medium text-sm">{character.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">{character.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
                <select
                  value={newCampaign.triggers?.[0]?.type || 'exit-intent'}
                  onChange={(e) => setNewCampaign(prev => ({
                    ...prev,
                    triggers: [{ type: e.target.value as any }]
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="exit-intent">Exit Intent</option>
                  <option value="time-based">Time Based</option>
                  <option value="scroll-based">Scroll Based</option>
                  <option value="cart-abandonment">Cart Abandonment</option>
                  <option value="page-visit">Page Visit</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Design & Appearance</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {['modern', 'minimal', 'vibrant', 'elegant'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setNewCampaign(prev => ({
                        ...prev,
                        design: { ...prev.design!, theme: theme as any }
                      }))}
                      className={`p-3 border rounded-lg text-sm capitalize transition-colors ${
                        newCampaign.design?.theme === theme
                          ? 'border-signal-blue bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select
                    value={newCampaign.design?.position || 'bottom-right'}
                    onChange={(e) => setNewCampaign(prev => ({
                      ...prev,
                      design: { ...prev.design!, position: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  >
                    <option value="center">Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="slide-in">Slide In</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={newCampaign.design?.size || 'medium'}
                    onChange={(e) => setNewCampaign(prev => ({
                      ...prev,
                      design: { ...prev.design!, size: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Builder */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Conversation Flow</h4>
            
            <div className="space-y-4">
              {newCampaign.conversation?.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm text-gray-700">Step {index + 1}</span>
                    <select
                      value={step.type}
                      onChange={(e) => {
                        const updatedConversation = [...(newCampaign.conversation || [])];
                        updatedConversation[index] = { ...step, type: e.target.value as any };
                        setNewCampaign(prev => ({ ...prev, conversation: updatedConversation }));
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="greeting">Greeting</option>
                      <option value="question">Question</option>
                      <option value="offer">Offer</option>
                      <option value="closing">Closing</option>
                    </select>
                  </div>
                  
                  <textarea
                    value={step.message}
                    onChange={(e) => {
                      const updatedConversation = [...(newCampaign.conversation || [])];
                      updatedConversation[index] = { ...step, message: e.target.value };
                      setNewCampaign(prev => ({ ...prev, conversation: updatedConversation }));
                    }}
                    placeholder="Enter the AI message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    rows={3}
                  />
                  
                  {step.options && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Response Options</label>
                      {step.options.map((option, optionIndex) => (
                        <input
                          key={optionIndex}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const updatedConversation = [...(newCampaign.conversation || [])];
                            const updatedOptions = [...step.options!];
                            updatedOptions[optionIndex] = e.target.value;
                            updatedConversation[index] = { ...step, options: updatedOptions };
                            setNewCampaign(prev => ({ ...prev, conversation: updatedConversation }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-1"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )) || (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-4">No conversation steps yet</p>
                  <button
                    onClick={() => setNewCampaign(prev => ({
                      ...prev,
                      conversation: [{
                        id: '1',
                        type: 'greeting',
                        message: 'Hi there! How can I help you today?',
                        options: ['Show me deals', 'I need help', 'Just browsing']
                      }]
                    }))}
                    className="px-4 py-2 bg-signal-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add First Step
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Live Preview</h4>
            
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
              <div className={`bg-white rounded-lg shadow-lg p-4 max-w-sm ${
                newCampaign.design?.size === 'small' ? 'w-64' :
                newCampaign.design?.size === 'large' ? 'w-80' : 'w-72'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xl">{newCampaign.character?.avatar}</span>
                  <div>
                    <div className="font-medium text-sm">{newCampaign.character?.name}</div>
                    <div className="text-xs text-gray-500">Online now</div>
                  </div>
                </div>
                
                {newCampaign.conversation && newCampaign.conversation.length > 0 ? (
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm">{newCampaign.conversation[0].message}</p>
                    </div>
                    
                    {newCampaign.conversation[0].options && (
                      <div className="space-y-2">
                        {newCampaign.conversation[0].options.map((option, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-3 py-2 border border-gray-200 rounded hover:bg-gray-50 text-sm"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Add conversation steps to see preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Popup Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Total Impressions</h4>
              <p className="text-2xl font-bold text-gray-900">12,456</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+23% from last week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Conversions</h4>
              <p className="text-2xl font-bold text-gray-900">847</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+18% from last week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Conversion Rate</h4>
              <p className="text-2xl font-bold text-gray-900">6.8%</p>
            </div>
          </div>
          <p className="text-sm text-red-600">-2% from last week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Revenue</h4>
              <p className="text-2xl font-bold text-gray-900">$15,230</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+31% from last week</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Campaign Performance</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Impressions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Conversions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <span>{campaign.character.avatar}</span>
                      <span className="font-medium">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{campaign.analytics.impressions.toLocaleString()}</td>
                  <td className="py-3 px-4">{campaign.analytics.conversions.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {(campaign.analytics.conversions / Math.max(campaign.analytics.impressions, 1) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 font-medium text-green-600">
                    ${campaign.analytics.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'characters', label: 'Characters', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Popup Generator</h2>
          <p className="text-gray-600">Create intelligent popups that engage customers and boost conversions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-signal-blue text-signal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {isCreating ? renderCampaignBuilder() : (
          <>
            {activeTab === 'campaigns' && renderCampaignsList()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'characters' && (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Character management coming soon</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Global settings coming soon</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AiPopupGenerator;