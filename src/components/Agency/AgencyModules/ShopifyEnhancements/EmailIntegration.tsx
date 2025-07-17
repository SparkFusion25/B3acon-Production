import React, { useState } from 'react';
import { Mail, Users, Zap, BarChart3, Settings, Gift, Calendar, Target, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import klaviyoService from '../../../../lib/klaviyoService';

interface EmailForm {
  id: string;
  name: string;
  title: string;
  description: string;
  fields: FormField[];
  incentive?: {
    type: 'discount' | 'freebie' | 'vip-access' | 'content';
    value: string;
    code?: string;
  };
  design: {
    theme: 'minimal' | 'modern' | 'elegant' | 'playful';
    primaryColor: string;
    position: 'popup' | 'inline' | 'slide-in' | 'exit-intent';
    size: 'small' | 'medium' | 'large';
  };
  targeting: {
    pages: string[];
    devices: string[];
    newVisitors: boolean;
    returningVisitors: boolean;
    timeDelay?: number;
  };
  integration: {
    platform: 'klaviyo' | 'shopify' | 'both';
    listId?: string;
    automationId?: string;
  };
  analytics: {
    impressions: number;
    submissions: number;
    conversionRate: number;
  };
}

interface FormField {
  id: string;
  type: 'email' | 'text' | 'phone' | 'select' | 'checkbox';
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface EmailCampaign {
  id: string;
  name: string;
  type: 'welcome' | 'abandoned-cart' | 'promotional' | 'newsletter';
  status: 'active' | 'paused' | 'draft';
  subject: string;
  content: string;
  listId: string;
  scheduling?: {
    sendTime?: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  analytics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

const EmailIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('forms');
  const [emailForms, setEmailForms] = useState<EmailForm[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [klaviyoConnected, setKlaviyoConnected] = useState(false);
  const [klaviyoLists, setKlaviyoLists] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const [newForm, setNewForm] = useState<Partial<EmailForm>>({
    name: '',
    title: '',
    description: '',
    fields: [
      { id: '1', type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true }
    ],
    design: {
      theme: 'modern',
      primaryColor: '#3B82F6',
      position: 'popup',
      size: 'medium'
    },
    targeting: {
      pages: ['all'],
      devices: ['desktop', 'mobile'],
      newVisitors: true,
      returningVisitors: true
    },
    integration: {
      platform: 'klaviyo'
    },
    analytics: {
      impressions: 0,
      submissions: 0,
      conversionRate: 0
    }
  });

  const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({
    name: '',
    type: 'welcome',
    status: 'draft',
    subject: '',
    content: '',
    analytics: {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    }
  });

  const connectKlaviyo = async () => {
    setIsConnecting(true);
    try {
      const isValid = await klaviyoService.validateApiKey();
      if (isValid) {
        setKlaviyoConnected(true);
        const lists = await klaviyoService.getLists();
        setKlaviyoLists(lists);
        toast.success('Klaviyo connected successfully!');
      } else {
        toast.error('Invalid Klaviyo API key. Please check your configuration.');
      }
    } catch (error) {
      toast.error('Failed to connect to Klaviyo. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateForm = () => {
    if (!newForm.name || !newForm.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    const form: EmailForm = {
      ...newForm as EmailForm,
      id: Date.now().toString()
    };

    setEmailForms(prev => [...prev, form]);
    setIsCreatingForm(false);
    toast.success('Email form created successfully!');
    
    // Reset form
    setNewForm({
      name: '',
      title: '',
      description: '',
      fields: [
        { id: '1', type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true }
      ],
      design: {
        theme: 'modern',
        primaryColor: '#3B82F6',
        position: 'popup',
        size: 'medium'
      },
      targeting: {
        pages: ['all'],
        devices: ['desktop', 'mobile'],
        newVisitors: true,
        returningVisitors: true
      },
      integration: {
        platform: 'klaviyo'
      },
      analytics: {
        impressions: 0,
        submissions: 0,
        conversionRate: 0
      }
    });
  };

  const addFormField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter value',
      required: false
    };
    
    setNewForm(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField]
    }));
  };

  const updateFormField = (index: number, field: Partial<FormField>) => {
    setNewForm(prev => ({
      ...prev,
      fields: prev.fields?.map((f, i) => i === index ? { ...f, ...field } : f) || []
    }));
  };

  const removeFormField = (index: number) => {
    setNewForm(prev => ({
      ...prev,
      fields: prev.fields?.filter((_, i) => i !== index) || []
    }));
  };

  const renderFormsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Signup Forms</h3>
        <button
          onClick={() => setIsCreatingForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Mail className="w-4 h-4" />
          <span>Create Form</span>
        </button>
      </div>

      {emailForms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Forms Yet</h3>
          <p className="text-gray-600 mb-4">Create your first email signup form to start capturing leads</p>
          <button
            onClick={() => setIsCreatingForm(true)}
            className="px-6 py-2 bg-signal-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emailForms.map((form) => (
            <div key={form.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{form.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    form.integration.platform === 'klaviyo' ? 'bg-purple-100 text-purple-800' :
                    form.integration.platform === 'shopify' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {form.integration.platform}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{form.title}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{form.analytics.impressions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{form.analytics.conversionRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Conversion</div>
                  </div>
                </div>

                {form.incentive && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {form.incentive.type === 'discount' ? `${form.incentive.value} OFF` : 
                         form.incentive.type === 'freebie' ? 'Free Gift' :
                         form.incentive.type === 'vip-access' ? 'VIP Access' : 'Free Content'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    form.design.theme === 'modern' ? 'bg-blue-100 text-blue-800' :
                    form.design.theme === 'minimal' ? 'bg-gray-100 text-gray-800' :
                    form.design.theme === 'elegant' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {form.design.theme}
                  </span>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
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

  const renderFormBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Create Email Signup Form</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreatingForm(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateForm}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Create Form
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Form Details</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Name</label>
                <input
                  type="text"
                  value={newForm.name}
                  onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Newsletter Signup"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newForm.title}
                  onChange={(e) => setNewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Get 10% OFF Your First Order!"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newForm.description}
                  onChange={(e) => setNewForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Join our newsletter and get exclusive offers..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Form Fields</h4>
            
            <div className="space-y-4">
              {newForm.fields?.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm text-gray-700">Field {index + 1}</span>
                    {index > 0 && (
                      <button
                        onClick={() => removeFormField(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateFormField(index, { type: e.target.value as any })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="email">Email</option>
                        <option value="text">Text</option>
                        <option value="phone">Phone</option>
                        <option value="select">Select</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Required</label>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateFormField(index, { required: e.target.checked })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateFormField(index, { label: e.target.value })}
                      placeholder="Field Label"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                      placeholder="Placeholder Text"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
              
              <button
                onClick={addFormField}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                + Add Field
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Incentive (Optional)</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incentive Type</label>
                <select
                  value={newForm.incentive?.type || ''}
                  onChange={(e) => setNewForm(prev => ({
                    ...prev,
                    incentive: e.target.value ? { type: e.target.value as any, value: '' } : undefined
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="">No Incentive</option>
                  <option value="discount">Discount Code</option>
                  <option value="freebie">Free Gift</option>
                  <option value="vip-access">VIP Access</option>
                  <option value="content">Free Content</option>
                </select>
              </div>

              {newForm.incentive && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newForm.incentive.type === 'discount' ? 'Discount Value' : 'Incentive Description'}
                  </label>
                  <input
                    type="text"
                    value={newForm.incentive.value}
                    onChange={(e) => setNewForm(prev => ({
                      ...prev,
                      incentive: prev.incentive ? { ...prev.incentive, value: e.target.value } : undefined
                    }))}
                    placeholder={
                      newForm.incentive.type === 'discount' ? '10% or $20' :
                      newForm.incentive.type === 'freebie' ? 'Free shipping on first order' :
                      newForm.incentive.type === 'vip-access' ? 'Early access to sales' :
                      'Free eBook guide'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview & Integration */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Live Preview</h4>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className={`bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto ${
                newForm.design?.size === 'small' ? 'max-w-sm' :
                newForm.design?.size === 'large' ? 'max-w-lg' : 'max-w-md'
              }`}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {newForm.title || 'Form Title'}
                  </h3>
                  <p className="text-gray-600">
                    {newForm.description || 'Form description will appear here'}
                  </p>
                </div>

                {newForm.incentive && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {newForm.incentive.value || 'Special Offer'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {newForm.fields?.map((field, index) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent">
                          <option>{field.placeholder}</option>
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-gray-700">{field.placeholder}</span>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                        />
                      )}
                    </div>
                  ))}
                  
                  <button
                    style={{ backgroundColor: newForm.design?.primaryColor || '#3B82F6' }}
                    className="w-full py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Integration Settings</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={newForm.integration?.platform}
                  onChange={(e) => setNewForm(prev => ({
                    ...prev,
                    integration: { ...prev.integration!, platform: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="klaviyo">Klaviyo Only</option>
                  <option value="shopify">Shopify Only</option>
                  <option value="both">Both Platforms</option>
                </select>
              </div>

              {(newForm.integration?.platform === 'klaviyo' || newForm.integration?.platform === 'both') && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Klaviyo Connection</label>
                    {klaviyoConnected ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">Not Connected</span>
                      </div>
                    )}
                  </div>
                  
                  {!klaviyoConnected ? (
                    <button
                      onClick={connectKlaviyo}
                      disabled={isConnecting}
                      className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      <span>{isConnecting ? 'Connecting...' : 'Connect Klaviyo'}</span>
                    </button>
                  ) : (
                    <select
                      value={newForm.integration?.listId || ''}
                      onChange={(e) => setNewForm(prev => ({
                        ...prev,
                        integration: { ...prev.integration!, listId: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    >
                      <option value="">Select Klaviyo List</option>
                      {klaviyoLists.map((list) => (
                        <option key={list.id} value={list.id}>{list.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
        <button
          onClick={() => setIsCreatingCampaign(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {emailCampaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Campaigns Yet</h3>
          <p className="text-gray-600 mb-4">Create automated email campaigns to nurture your leads</p>
          <button
            onClick={() => setIsCreatingCampaign(true)}
            className="px-6 py-2 bg-signal-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emailCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{campaign.subject}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{campaign.analytics.sent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {campaign.analytics.sent > 0 ? (campaign.analytics.opened / campaign.analytics.sent * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-xs text-gray-500">Open Rate</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    campaign.type === 'welcome' ? 'bg-blue-100 text-blue-800' :
                    campaign.type === 'abandoned-cart' ? 'bg-orange-100 text-orange-800' :
                    campaign.type === 'promotional' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {campaign.type.replace('-', ' ')}
                  </span>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Email Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Total Subscribers</h4>
              <p className="text-2xl font-bold text-gray-900">8,547</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Emails Sent</h4>
              <p className="text-2xl font-bold text-gray-900">24,891</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+8% from last month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Target className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Avg Open Rate</h4>
              <p className="text-2xl font-bold text-gray-900">23.4%</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+2.1% from last month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Revenue</h4>
              <p className="text-2xl font-bold text-gray-900">$12,340</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+15% from last month</p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'forms', label: 'Signup Forms', icon: Mail },
    { id: 'campaigns', label: 'Campaigns', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Integration</h2>
          <p className="text-gray-600">Capture leads and nurture customers with powerful email marketing</p>
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
        {(isCreatingForm || isCreatingCampaign) ? (
          <>
            {isCreatingForm && renderFormBuilder()}
            {isCreatingCampaign && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Campaign builder coming soon</p>
              </div>
            )}
          </>
        ) : (
          <>
            {activeTab === 'forms' && renderFormsList()}
            {activeTab === 'campaigns' && renderCampaigns()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Email settings coming soon</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailIntegration;