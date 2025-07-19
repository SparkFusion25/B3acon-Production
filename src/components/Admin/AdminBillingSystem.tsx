import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Package, 
  DollarSign, 
  Clock, 
  Users, 
  Settings,
  Shield,
  Zap,
  Crown,
  Target,
  BarChart3,
  Mail,
  Search,
  Sparkles,
  Globe,
  MessageSquare,
  Star,
  Gift,
  Percent
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  basePrice: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  trialDays: number;
  services: string[];
  isActive: boolean;
  discountPercent: number;
}

const AdminBillingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);

  // Available services that can be included in plans
  const [availableServices] = useState<Service[]>([
    { id: 'seo-tools', name: 'SEO Tools & Features', description: 'Complete SEO optimization suite', icon: '🔍', category: 'SEO', basePrice: 29 },
    { id: 'product-reviews', name: 'Product Reviews Management', description: 'Multi-platform review sync and management', icon: '⭐', category: 'Reviews', basePrice: 19 },
    { id: 'campaigns', name: 'Marketing Campaigns', description: 'Advanced campaign creation and management', icon: '📢', category: 'Marketing', basePrice: 39 },
    { id: 'automations', name: 'Automation Builder', description: 'Workflow automation and triggers', icon: '⚡', category: 'Automation', basePrice: 49 },
    { id: 'reports', name: 'Advanced Reports', description: 'Custom reporting and analytics', icon: '📊', category: 'Analytics', basePrice: 25 },
    { id: 'integrations', name: 'Third-party Integrations', description: 'Connect with external platforms', icon: '🔗', category: 'Integrations', basePrice: 15 },
    { id: 'ai-features', name: 'AI-Powered Features', description: 'AI sentiment analysis and optimization', icon: '🤖', category: 'AI', basePrice: 59 },
    { id: 'affiliate', name: 'Affiliate Program Tools', description: 'Complete affiliate management system', icon: '💰', category: 'Affiliate', basePrice: 35 },
    { id: 'email-marketing', name: 'Email Marketing', description: 'Advanced email campaigns and automation', icon: '📧', category: 'Marketing', basePrice: 29 },
    { id: 'social-media', name: 'Social Media Management', description: 'Multi-platform social media tools', icon: '📱', category: 'Social', basePrice: 25 },
    { id: 'inventory', name: 'Inventory Management', description: 'Smart inventory tracking and optimization', icon: '📦', category: 'Operations', basePrice: 19 },
    { id: 'customer-support', name: 'Customer Support Tools', description: 'Help desk and support automation', icon: '🎧', category: 'Support', basePrice: 15 }
  ]);

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'starter',
      name: 'Starter Plan',
      description: 'Perfect for small businesses getting started',
      price: 29,
      billingCycle: 'monthly',
      trialDays: 14,
      services: ['seo-tools', 'product-reviews', 'reports'],
      isActive: true,
      discountPercent: 0
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      description: 'Advanced features for growing businesses',
      price: 79,
      billingCycle: 'monthly',
      trialDays: 14,
      services: ['seo-tools', 'product-reviews', 'campaigns', 'automations', 'reports', 'integrations'],
      isActive: true,
      discountPercent: 0
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'Complete solution for large businesses',
      price: 149,
      billingCycle: 'monthly',
      trialDays: 30,
      services: ['seo-tools', 'product-reviews', 'campaigns', 'automations', 'reports', 'integrations', 'ai-features', 'affiliate', 'email-marketing', 'social-media', 'inventory', 'customer-support'],
      isActive: true,
      discountPercent: 10
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    defaultTrialDays: 14,
    requireCreditCard: true,
    allowDiscounts: true,
    maxDiscountPercent: 50,
    currency: 'USD'
  });

  const handleCreatePlan = () => {
    const newPlan: SubscriptionPlan = {
      id: `plan-${Date.now()}`,
      name: 'New Plan',
      description: 'Custom subscription plan',
      price: 0,
      billingCycle: 'monthly',
      trialDays: globalSettings.defaultTrialDays,
      services: [],
      isActive: false,
      discountPercent: 0
    };
    setEditingPlan(newPlan);
    setShowCreatePlan(true);
  };

  const handleSavePlan = (plan: SubscriptionPlan) => {
    if (showCreatePlan) {
      setSubscriptionPlans([...subscriptionPlans, plan]);
      setShowCreatePlan(false);
    } else {
      setSubscriptionPlans(subscriptionPlans.map(p => p.id === plan.id ? plan : p));
    }
    setEditingPlan(null);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      setSubscriptionPlans(subscriptionPlans.filter(p => p.id !== planId));
    }
  };

  const calculatePlanValue = (serviceIds: string[]) => {
    return serviceIds.reduce((total, serviceId) => {
      const service = availableServices.find(s => s.id === serviceId);
      return total + (service?.basePrice || 0);
    }, 0);
  };

  const renderPlansTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-gray-600">Create and manage your subscription packages</p>
        </div>
        <button 
          onClick={handleCreatePlan}
          className="btn-premium btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className={`glass-card p-6 ${!plan.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{plan.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setEditingPlan(plan)}
                  className="p-2 text-gray-400 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Price:</span>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.billingCycle}</span>
                  {plan.discountPercent > 0 && (
                    <span className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                      -{plan.discountPercent}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Trial Days:</span>
                <span className="font-medium">{plan.trialDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Services:</span>
                <span className="font-medium">{plan.services.length} included</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Value:</span>
                <span className="font-medium text-green-600">${calculatePlanValue(plan.services)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Included Services:</h4>
              <div className="flex flex-wrap gap-1">
                {plan.services.slice(0, 3).map(serviceId => {
                  const service = availableServices.find(s => s.id === serviceId);
                  return service ? (
                    <span key={serviceId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {service.name.split(' ')[0]}
                    </span>
                  ) : null;
                })}
                {plan.services.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    +{plan.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
        <p className="text-gray-600">Manage individual services and their pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableServices.map((service) => (
          <div key={service.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{service.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{service.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{service.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">${service.basePrice}</div>
                <div className="text-xs text-gray-600">base price</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Global Settings</h2>
        <p className="text-gray-600">Configure billing and subscription defaults</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Trial Days</label>
            <input 
              type="number" 
              value={globalSettings.defaultTrialDays}
              onChange={(e) => setGlobalSettings({...globalSettings, defaultTrialDays: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select 
              value={globalSettings.currency}
              onChange={(e) => setGlobalSettings({...globalSettings, currency: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Require Credit Card for Trial</h4>
              <p className="text-sm text-gray-600">Users must provide payment method to start trial</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={globalSettings.requireCreditCard}
                onChange={(e) => setGlobalSettings({...globalSettings, requireCreditCard: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Allow Discounts</h4>
              <p className="text-sm text-gray-600">Enable percentage discounts on plans</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={globalSettings.allowDiscounts}
                onChange={(e) => setGlobalSettings({...globalSettings, allowDiscounts: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {globalSettings.allowDiscounts && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount Percentage</label>
              <input 
                type="number" 
                max="100"
                value={globalSettings.maxDiscountPercent}
                onChange={(e) => setGlobalSettings({...globalSettings, maxDiscountPercent: parseInt(e.target.value)})}
                className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="ml-2 text-gray-600">%</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button className="btn-premium btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  // Plan Editor Modal
  const renderPlanEditor = () => {
    if (!editingPlan) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setEditingPlan(null)} />
          
          <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div className="bg-white px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {showCreatePlan ? 'Create New Plan' : 'Edit Plan'}
                </h3>
                <button 
                  onClick={() => setEditingPlan(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                    <input 
                      type="text" 
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (${globalSettings.currency})</label>
                    <input 
                      type="number" 
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={editingPlan.description}
                    onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                    <select 
                      value={editingPlan.billingCycle}
                      onChange={(e) => setEditingPlan({...editingPlan, billingCycle: e.target.value as 'monthly' | 'yearly'})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trial Days</label>
                    <input 
                      type="number" 
                      value={editingPlan.trialDays}
                      onChange={(e) => setEditingPlan({...editingPlan, trialDays: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
                    <input 
                      type="number" 
                      max={globalSettings.maxDiscountPercent}
                      value={editingPlan.discountPercent}
                      onChange={(e) => setEditingPlan({...editingPlan, discountPercent: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Included Services</label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {availableServices.map((service) => (
                      <label key={service.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={editingPlan.services.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingPlan({...editingPlan, services: [...editingPlan.services, service.id]});
                            } else {
                              setEditingPlan({...editingPlan, services: editingPlan.services.filter(s => s !== service.id)});
                            }
                          }}
                          className="text-blue-600"
                        />
                        <div className="text-lg">{service.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-600">${service.basePrice}/month</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={editingPlan.isActive}
                      onChange={(e) => setEditingPlan({...editingPlan, isActive: e.target.checked})}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Plan is Active</span>
                  </label>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-500">
                    Total Value: ${calculatePlanValue(editingPlan.services)} | Your Price: ${editingPlan.price}
                    {editingPlan.discountPercent > 0 && ` (${editingPlan.discountPercent}% off)`}
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="btn-premium btn-outline btn-small"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleSavePlan(editingPlan)}
                      className="btn-premium btn-primary btn-small"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save Plan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Billing System</h1>
          <p className="text-gray-600">Manage subscription plans, services, and billing settings</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'plans', name: 'Subscription Plans', icon: Package },
                { id: 'services', name: 'Services', icon: Settings },
                { id: 'settings', name: 'Global Settings', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'plans' && renderPlansTab()}
        {activeTab === 'services' && renderServicesTab()}
        {activeTab === 'settings' && renderSettingsTab()}

        {/* Plan Editor Modal */}
        {renderPlanEditor()}
      </div>
    </div>
  );
};

export default AdminBillingSystem;