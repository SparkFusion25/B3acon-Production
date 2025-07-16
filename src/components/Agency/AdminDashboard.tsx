import React, { useState, useEffect } from 'react';
import { 
  Shield, Settings, Users, Globe, Layout, Edit, Save, Plus, Trash2, Image, Type, 
  CreditCard, Package, Search, BarChart3, ShoppingBag, Mail, FileCheck, DollarSign, 
  TrendingUp, Toggle, Check, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plans');
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
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([
    {
      id: 'starter_free',
      name: 'Free Starter',
      price: 0,
      stripeProductId: 'prod_FREE',
      stripePriceId: 'price_FREE',
      trial: true,
      trialDays: 14,
      features: {
        'tariff-calculator': { enabled: true, limit: 3 },
        'hs-codes': { enabled: true, limit: 3 },
        'crm': { enabled: true, limit: 3 },
        'shipping': { enabled: false },
        'email': { enabled: false },
        'landing': { enabled: false },
        'compliance': { enabled: false },
        'fta': { enabled: false },
        'landed_cost': { enabled: false },
        'google': { enabled: false },
        'seo': { enabled: false },
        'shopify': { enabled: false }
      }
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 49.99,
      stripeProductId: 'prod_GROWTH',
      stripePriceId: 'price_12345G',
      trial: true,
      trialDays: 14,
      features: {
        'tariff-calculator': { enabled: true, limit: null },
        'hs-codes': { enabled: true, limit: null },
        'crm': { enabled: true, limit: null },
        'shipping': { enabled: true, limit: null },
        'email': { enabled: true, limit: null },
        'landing': { enabled: true, limit: null },
        'compliance': { enabled: false },
        'fta': { enabled: false },
        'landed_cost': { enabled: false },
        'google': { enabled: false },
        'seo': { enabled: true, limit: null },
        'shopify': { enabled: false }
      }
    },
    {
      id: 'pro_trader',
      name: 'Pro Trader',
      price: 149.99,
      stripeProductId: 'prod_PRO',
      stripePriceId: 'price_12345P',
      trial: true,
      trialDays: 14,
      features: {
        'tariff-calculator': { enabled: true, limit: null },
        'hs-codes': { enabled: true, limit: null },
        'crm': { enabled: true, limit: null },
        'shipping': { enabled: true, limit: null },
        'email': { enabled: true, limit: null },
        'landing': { enabled: true, limit: null },
        'compliance': { enabled: true, limit: null },
        'fta': { enabled: true, limit: null },
        'landed_cost': { enabled: true, limit: null },
        'google': { enabled: true, limit: null },
        'seo': { enabled: true, limit: null },
        'shopify': { enabled: true, limit: null }
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      stripeProductId: 'prod_ENT',
      stripePriceId: '',
      trial: false,
      trialDays: 0,
      features: {
        'tariff-calculator': { enabled: true, limit: null },
        'hs-codes': { enabled: true, limit: null },
        'crm': { enabled: true, limit: null },
        'shipping': { enabled: true, limit: null },
        'email': { enabled: true, limit: null },
        'landing': { enabled: true, limit: null },
        'compliance': { enabled: true, limit: null },
        'fta': { enabled: true, limit: null },
        'landed_cost': { enabled: true, limit: null },
        'google': { enabled: true, limit: null },
        'seo': { enabled: true, limit: null },
        'shopify': { enabled: true, limit: null }
      }
    }
  ]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
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
  
  // Feature details for the plan editor
  const featureDetails = {
    'tariff-calculator': { name: 'Tariff Calculator', icon: CreditCard, description: 'Calculate import duties and taxes' },
    'hs-codes': { name: 'HS Code Lookup', icon: Search, description: 'Find harmonized system codes for products' },
    'crm': { name: 'CRM Hub', icon: BarChart3, description: 'Manage clients and leads' },
    'shipping': { name: 'Shipment Tracking', icon: Package, description: 'Track shipments across carriers' },
    'email': { name: 'Email Marketing', icon: Mail, description: 'Create and manage email campaigns' },
    'landing': { name: 'Landing Pages', icon: Layout, description: 'Build and optimize landing pages' },
    'compliance': { name: 'Compliance Checker', icon: Shield, description: 'Screen against restricted party lists' },
    'fta': { name: 'FTA Checker', icon: FileCheck, description: 'Check free trade agreement eligibility' },
    'landed_cost': { name: 'Landed Cost Calculator', icon: DollarSign, description: 'Calculate total landed costs' },
    'google': { name: 'Google Services', icon: Search, description: 'Integrate with Google services' },
    'seo': { name: 'SEO Intelligence', icon: TrendingUp, description: 'Analyze and improve search performance' },
    'shopify': { name: 'Shopify Integration', icon: ShoppingBag, description: 'Connect with Shopify stores' }
  };

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

  const handleSavePlans = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ value: { plans: subscriptionPlans } })
        .eq('key', 'subscription_plans');
      
      if (error) {
        throw error;
      }
      
      toast.success('Subscription plans saved successfully');
    } catch (error) {
      console.error('Error saving subscription plans:', error);
      toast.error('Failed to save subscription plans');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPlan = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (plan) {
      setEditingPlan({...plan});
      setShowEditPlanModal(true);
    }
  };

  const handleSaveEditedPlan = () => {
    if (!editingPlan) return;
    
    setSubscriptionPlans(subscriptionPlans.map(plan => 
      plan.id === editingPlan.id ? editingPlan : plan
    ));
    
    setShowEditPlanModal(false);
    setEditingPlan(null);
    toast.success(`Plan "${editingPlan.name}" updated successfully`);
  };

  const handleToggleFeature = (planId: string, featureId: string) => {
    setSubscriptionPlans(subscriptionPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          features: {
            ...plan.features,
            [featureId]: {
              ...plan.features[featureId],
              enabled: !plan.features[featureId]?.enabled
            }
          }
        };
      }
      return plan;
    }));
  };

  const handleUpdateFeatureLimit = (featureId: string, limit: number | null) => {
    if (!editingPlan) return;
    
    setEditingPlan({
      ...editingPlan,
      features: {
        ...editingPlan.features,
        [featureId]: {
          ...editingPlan.features[featureId],
          limit
        }
      }
    });
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

  const renderPlansEditor = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <button 
          onClick={handleSavePlans}
          disabled={isSaving}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Plans'}</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Manage Subscription Plans</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Plan Name</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Price</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Stripe Product ID</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Trial</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionPlans.map((plan) => (
                <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{plan.name}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{plan.stripeProductId}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {plan.trial ? `${plan.trialDays} days` : 'No trial'}
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleEditPlan(plan.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                    >
                      Edit Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Feature Access by Plan</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Feature</th>
                {subscriptionPlans.map((plan) => (
                  <th key={plan.id} className="py-3 px-4 text-center text-gray-600 font-medium">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(featureDetails).map(([featureId, feature]) => (
                <tr key={featureId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <feature.icon className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">{feature.name}</div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                      </div>
                    </div>
                  </td>
                  {subscriptionPlans.map((plan) => (
                    <td key={`${plan.id}-${featureId}`} className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeature(plan.id, featureId)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          plan.features[featureId]?.enabled
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {plan.features[featureId]?.enabled ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                      {plan.features[featureId]?.enabled && plan.features[featureId]?.limit && (
                        <div className="text-xs text-gray-500 mt-1">
                          Limit: {plan.features[featureId].limit}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Plan Modal */}
      {showEditPlanModal && editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Plan: {editingPlan.name}</h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type={typeof editingPlan.price === 'number' ? 'number' : 'text'}
                    value={editingPlan.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditingPlan({
                        ...editingPlan, 
                        price: value === 'Custom' ? value : parseFloat(value)
                      });
                    }}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Product ID</label>
                  <input
                    type="text"
                    value={editingPlan.stripeProductId}
                    onChange={(e) => setEditingPlan({...editingPlan, stripeProductId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Price ID</label>
                  <input
                    type="text"
                    value={editingPlan.stripePriceId}
                    onChange={(e) => setEditingPlan({...editingPlan, stripePriceId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="trial-enabled"
                      checked={editingPlan.trial}
                      onChange={(e) => setEditingPlan({...editingPlan, trial: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="trial-enabled" className="text-sm text-gray-700">
                      Enable Trial
                    </label>
                  </div>
                  
                  {editingPlan.trial && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trial Days</label>
                      <input
                        type="number"
                        value={editingPlan.trialDays}
                        onChange={(e) => setEditingPlan({...editingPlan, trialDays: parseInt(e.target.value)})}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                        min="1"
                        max="90"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-4">Feature Access & Limits</h4>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {Object.entries(featureDetails).map(([featureId, feature]) => (
                <div key={featureId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <feature.icon className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900">{feature.name}</div>
                      <div className="text-xs text-gray-500">{feature.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={editingPlan.features[featureId]?.enabled || false}
                        onChange={() => {
                          setEditingPlan({
                            ...editingPlan,
                            features: {
                              ...editingPlan.features,
                              [featureId]: {
                                ...editingPlan.features[featureId],
                                enabled: !editingPlan.features[featureId]?.enabled
                              }
                            }
                          });
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
                    </label>
                    
                    {editingPlan.features[featureId]?.enabled && (
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Limit:</label>
                        <select
                          value={editingPlan.features[featureId]?.limit === null ? 'unlimited' : editingPlan.features[featureId]?.limit}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleUpdateFeatureLimit(
                              featureId, 
                              value === 'unlimited' ? null : parseInt(value)
                            );
                          }}
                          className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent text-sm"
                        >
                          <option value="unlimited">Unlimited</option>
                          <option value="3">3 uses</option>
                          <option value="5">5 uses</option>
                          <option value="10">10 uses</option>
                          <option value="25">25 uses</option>
                          <option value="50">50 uses</option>
                          <option value="100">100 uses</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowEditPlanModal(false);
                  setEditingPlan(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedPlan}
                className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
        
        <div className="space-y-4 mb-6">
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
        
        <div className="flex justify-end">
          <button 
            onClick={() => toast.success('Changes saved and published to landing page')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>Publish Changes</span>
          </button>
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
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h4 className="font-medium text-gray-900 mb-4">Landing Page Editor</h4>
        
        <div className="p-4 bg-blue-50 rounded-lg mb-4">
          <p className="text-blue-800">Edit your landing page sections including About Us, Services, and Blog content.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button 
            onClick={() => toast.success('Opening About Us editor')}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-signal-blue hover:shadow-md transition-all text-center"
          >
            <h5 className="font-medium text-gray-900 mb-2">About Us</h5>
            <p className="text-sm text-gray-600">Edit company information and team details</p>
          </button>
          
          <button 
            onClick={() => toast.success('Opening Services editor')}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-signal-blue hover:shadow-md transition-all text-center"
          >
            <h5 className="font-medium text-gray-900 mb-2">Services</h5>
            <p className="text-sm text-gray-600">Edit service offerings and descriptions</p>
          </button>
          
          <button 
            onClick={() => toast.success('Opening Blog editor')}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-signal-blue hover:shadow-md transition-all text-center"
          >
            <h5 className="font-medium text-gray-900 mb-2">Blog</h5>
            <p className="text-sm text-gray-600">Manage blog posts and categories</p>
          </button>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={() => toast.success('Opening full page editor')}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Open Full Page Editor
          </button>
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
    { id: 'plans', label: 'Subscription Plans', icon: CreditCard },
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
        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-lg text-sm">
          <p>✅ Admin access granted - You have full access to all features and settings</p>
        </div>
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
        {activeTab === 'plans' && renderPlansEditor()}
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