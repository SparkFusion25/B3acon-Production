import React, { useState, useEffect } from 'react';
import { Shield, Settings, Users, Globe, Layout, Edit, Save, Plus, Trash2, Image, Type } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [landingPageSettings, setLandingPageSettings] = useState<any>({
    headlines: [],
    main_headline: 'The Global Commerce Command Center',
    background_image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    cta_primary: 'Start Free Trial',
    cta_secondary: 'See Plans',
    cta_tertiary: 'Book Demo'
  });
  const [globalCommerceSettings, setGlobalCommerceSettings] = useState<any>({
    api_keys: {
      aftership: '',
      freightos: '',
      avalara: ''
    },
    plugin_access: {
      tariff_calculator: 'starter',
      landed_cost: 'pro',
      compliance_checker: 'pro',
      freight_estimator: 'starter',
      shipment_tracker: 'enterprise',
      hs_code_finder: 'starter',
      fta_checker: 'pro'
    },
    landing_visuals: {
      show_global_trade: true,
      show_freight_tariff: true,
      show_hs_code: true,
      show_shipment_tracking: true,
      show_ai_marketing: true,
      typewriter_speed: 100,
      animation_speed: 'medium',
      color_scheme: 'blue-orange'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newHeadline, setNewHeadline] = useState('');

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Get landing page settings
        const { data: landingData, error: landingError } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'landing_page')
          .single();
        
        if (landingError) {
          console.error('Error fetching landing page settings:', landingError);
        } else if (landingData && landingData.value) {
          setLandingPageSettings(landingData.value);
        }
        
        // Get global commerce settings
        const { data: commerceData, error: commerceError } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'global_commerce_settings')
          .single();
        
        if (commerceError) {
          console.error('Error fetching global commerce settings:', commerceError);
        } else if (commerceData && commerceData.value) {
          setGlobalCommerceSettings(commerceData.value);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSaveLandingSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ value: landingPageSettings })
        .eq('key', 'landing_page');
      
      if (error) {
        throw error;
      }
      
      toast.success('Landing page settings saved successfully');
    } catch (error) {
      console.error('Error saving landing page settings:', error);
      toast.error('Failed to save landing page settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCommerceSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ value: globalCommerceSettings })
        .eq('key', 'global_commerce_settings');
      
      if (error) {
        throw error;
      }
      
      toast.success('Global commerce settings saved successfully');
    } catch (error) {
      console.error('Error saving global commerce settings:', error);
      toast.error('Failed to save global commerce settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHeadline = () => {
    if (!newHeadline) {
      toast.error('Please enter a headline');
      return;
    }
    
    setLandingPageSettings({
      ...landingPageSettings,
      headlines: [...landingPageSettings.headlines, newHeadline]
    });
    
    setNewHeadline('');
  };

  const handleRemoveHeadline = (index: number) => {
    const updatedHeadlines = [...landingPageSettings.headlines];
    updatedHeadlines.splice(index, 1);
    
    setLandingPageSettings({
      ...landingPageSettings,
      headlines: updatedHeadlines
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string, field: string) => {
    if (section === 'landing') {
      setLandingPageSettings({
        ...landingPageSettings,
        [field]: e.target.value
      });
    } else if (section === 'commerce') {
      // Handle nested objects for API keys
      if (field.startsWith('api_')) {
        const apiKey = field.replace('api_', '');
        setGlobalCommerceSettings({
          ...globalCommerceSettings,
          api_keys: {
            ...globalCommerceSettings.api_keys,
            [apiKey]: e.target.value
          }
        });
      }
    }
  };

  const handlePluginAccessChange = (plugin: string, level: string) => {
    setGlobalCommerceSettings({
      ...globalCommerceSettings,
      plugin_access: {
        ...globalCommerceSettings.plugin_access,
        [plugin]: level
      }
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Admin Dashboard</h3>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('landing')}
            className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Layout className="w-5 h-5 text-blue-600" />
              <h5 className="font-medium text-blue-900">Landing Page Control Panel</h5>
            </div>
            <p className="text-sm text-blue-700">
              Customize the landing page content and appearance
            </p>
          </button>
          
          <button 
            onClick={() => setActiveTab('commerce')}
            className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Globe className="w-5 h-5 text-green-600" />
              <h5 className="font-medium text-green-900">Global Commerce Settings</h5>
            </div>
            <p className="text-sm text-green-700">
              Manage API keys and plugin access levels
            </p>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <h5 className="font-medium text-purple-900">User Management</h5>
            </div>
            <p className="text-sm text-purple-700">
              Manage users, roles, and permissions
            </p>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">System Status</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-900">Database Connection</span>
            </div>
            <span className="text-green-600 font-medium">Connected</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-900">Authentication Service</span>
            </div>
            <span className="text-green-600 font-medium">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-900">Storage Service</span>
            </div>
            <span className="text-green-600 font-medium">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-900">External APIs</span>
            </div>
            <span className="text-yellow-600 font-medium">Partial</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLandingPageSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Landing Page Settings</h3>
        <button 
          onClick={handleSaveLandingSettings}
          disabled={isSaving}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Main Content</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Headline</label>
            <input
              type="text"
              value={landingPageSettings.main_headline || ''}
              onChange={(e) => handleInputChange(e, 'landing', 'main_headline')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="The Ultimate Marketing Command Center"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
            <input
              type="text"
              value={landingPageSettings.background_image || ''}
              onChange={(e) => handleInputChange(e, 'landing', 'background_image')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary CTA Button</label>
            <input
              type="text"
              value={landingPageSettings.cta_primary || ''}
              onChange={(e) => handleInputChange(e, 'landing', 'cta_primary')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="Start Free Trial"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary CTA Button</label>
            <input
              type="text"
              value={landingPageSettings.cta_secondary || ''}
              onChange={(e) => handleInputChange(e, 'landing', 'cta_secondary')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="See Plans"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tertiary CTA Button</label>
            <input
              type="text"
              value={landingPageSettings.cta_tertiary || ''}
              onChange={(e) => handleInputChange(e, 'landing', 'cta_tertiary')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="Book Demo"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Typewriter Headlines (Global Commerce Focus)</h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newHeadline}
              onChange={(e) => setNewHeadline(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="Add new headline"
            />
            <button 
              onClick={handleAddHeadline}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {landingPageSettings.headlines && landingPageSettings.headlines.map((headline: string, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">{headline}</span>
              <button 
                onClick={() => handleRemoveHeadline(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {(!landingPageSettings.headlines || landingPageSettings.headlines.length === 0) && (
            <div className="p-4 text-center text-gray-500">
              No headlines added yet. Add some headlines for the typewriter effect.
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h4 className="font-medium text-gray-900 mb-4">Featured Sections Visibility</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Global Trade Intelligence</h5>
              <p className="text-sm text-gray-600">Show global trade feature card</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={globalCommerceSettings.landing_visuals?.show_global_trade !== false}
                onChange={() => setGlobalCommerceSettings({
                  ...globalCommerceSettings,
                  landing_visuals: {
                    ...globalCommerceSettings.landing_visuals,
                    show_global_trade: !globalCommerceSettings.landing_visuals?.show_global_trade
                  }
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Freight & Tariff Tools</h5>
              <p className="text-sm text-gray-600">Show freight and tariff feature card</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={globalCommerceSettings.landing_visuals?.show_freight_tariff !== false}
                onChange={() => setGlobalCommerceSettings({
                  ...globalCommerceSettings,
                  landing_visuals: {
                    ...globalCommerceSettings.landing_visuals,
                    show_freight_tariff: !globalCommerceSettings.landing_visuals?.show_freight_tariff
                  }
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">HS Code Lookup + FTA Matching</h5>
              <p className="text-sm text-gray-600">Show HS code and FTA feature card</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={globalCommerceSettings.landing_visuals?.show_hs_code !== false}
                onChange={() => setGlobalCommerceSettings({
                  ...globalCommerceSettings,
                  landing_visuals: {
                    ...globalCommerceSettings.landing_visuals,
                    show_hs_code: !globalCommerceSettings.landing_visuals?.show_hs_code
                  }
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Shipment Tracking</h5>
              <p className="text-sm text-gray-600">Show shipment tracking feature card</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={globalCommerceSettings.landing_visuals?.show_shipment_tracking !== false}
                onChange={() => setGlobalCommerceSettings({
                  ...globalCommerceSettings,
                  landing_visuals: {
                    ...globalCommerceSettings.landing_visuals,
                    show_shipment_tracking: !globalCommerceSettings.landing_visuals?.show_shipment_tracking
                  }
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">AI-powered Marketing + CRM</h5>
              <p className="text-sm text-gray-600">Show AI marketing feature card</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={globalCommerceSettings.landing_visuals?.show_ai_marketing !== false}
                onChange={() => setGlobalCommerceSettings({
                  ...globalCommerceSettings,
                  landing_visuals: {
                    ...globalCommerceSettings.landing_visuals,
                    show_ai_marketing: !globalCommerceSettings.landing_visuals?.show_ai_marketing
                  }
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h4 className="font-medium text-gray-900 mb-4">Visual Settings</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Animation Speed</label>
            <select
              value={globalCommerceSettings.landing_visuals?.animation_speed || 'medium'}
              onChange={(e) => setGlobalCommerceSettings({
                ...globalCommerceSettings,
                landing_visuals: {
                  ...globalCommerceSettings.landing_visuals,
                  animation_speed: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typewriter Speed (ms)</label>
            <input
              type="number"
              value={globalCommerceSettings.landing_visuals?.typewriter_speed || 100}
              onChange={(e) => setGlobalCommerceSettings({
                ...globalCommerceSettings,
                landing_visuals: {
                  ...globalCommerceSettings.landing_visuals,
                  typewriter_speed: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              min="50"
              max="500"
              step="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color Scheme</label>
            <select
              value={globalCommerceSettings.landing_visuals?.color_scheme || 'blue-orange'}
              onChange={(e) => setGlobalCommerceSettings({
                ...globalCommerceSettings,
                landing_visuals: {
                  ...globalCommerceSettings.landing_visuals,
                  color_scheme: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="blue-orange">Blue-Orange (Default)</option>
              <option value="purple-pink">Purple-Pink</option>
              <option value="green-blue">Green-Blue</option>
              <option value="red-orange">Red-Orange</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGlobalCommerceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Global Commerce Settings</h3>
        <button 
          onClick={handleSaveCommerceSettings}
          disabled={isSaving}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">API Keys</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AfterShip API Key</label>
            <input
              type="password"
              value={globalCommerceSettings.api_keys?.aftership || ''}
              onChange={(e) => handleInputChange(e, 'commerce', 'api_aftership')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="Enter AfterShip API key"
            />
            <p className="text-xs text-gray-500 mt-1">Used for shipment tracking</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Freightos API Key</label>
            <input
              type="password"
              value={globalCommerceSettings.api_keys?.freightos || ''}
              onChange={(e) => handleInputChange(e, 'commerce', 'api_freightos')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="Enter Freightos API key"
            />
            <p className="text-xs text-gray-500 mt-1">Used for freight rate estimation</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avalara API Key</label>
            <input
              type="password"
              value={globalCommerceSettings.api_keys?.avalara || ''}
              onChange={(e) => handleInputChange(e, 'commerce', 'api_avalara')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="Enter Avalara API key"
            />
            <p className="text-xs text-gray-500 mt-1">Used for tariff and tax calculation</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Plugin Access Levels</h4>
        
        <div className="space-y-4">
          {Object.entries(globalCommerceSettings.plugin_access || {}).map(([plugin, level]) => (
            <div key={plugin} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">{plugin.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              <select
                value={level as string}
                onChange={(e) => handlePluginAccessChange(plugin, e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              >
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">User Management</h4>
          <p className="text-gray-600 mb-4">Manage users, roles, and permissions</p>
          <button 
            onClick={() => toast.success('User management coming soon')}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            View Users
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'landing', label: 'Landing Page Control', icon: Layout },
    { id: 'commerce', label: 'Global Commerce', icon: Globe },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-signal-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage system settings and configurations</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'landing' && renderLandingPageSettings()}
        {activeTab === 'commerce' && renderGlobalCommerceSettings()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">System Settings</h4>
            <p className="text-gray-600 mb-4">Configure system-wide settings</p>
            <button 
              onClick={() => toast.success('System settings coming soon')}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              View Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;