import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  Package, 
  Settings, 
  BarChart3,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Save,
  Zap,
  Lock,
  Unlock,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  limitations: {
    products: number;
    users: number;
    reports: string;
    support: string;
  };
  isActive: boolean;
  stripePriceId: string;
  popular?: boolean;
  trial?: {
    enabled: boolean;
    days: number;
  };
}

interface Customer {
  id: string;
  shopDomain: string;
  email: string;
  name: string;
  plan: string;
  status: 'active' | 'trial' | 'canceled' | 'suspended';
  billingPeriod: 'monthly' | 'yearly';
  nextBilling: string;
  mrr: number;
  trialEnds?: string;
  features: string[];
  createdAt: string;
  lastLogin: string;
}

interface FeatureControl {
  id: string;
  name: string;
  description: string;
  availableInPlans: string[];
  isEnabled: boolean;
  category: 'seo' | 'analytics' | 'automation' | 'support' | 'integrations';
}

const ShopifyBillingAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [features, setFeatures] = useState<FeatureControl[]>([]);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    // Sample subscription plans
    setPlans([
      {
        id: 'basic',
        name: 'Basic',
        price: 0,
        period: 'month',
        description: 'Perfect for new stores',
        features: ['seo-basic', 'reports-monthly', 'support-email'],
        limitations: {
          products: 50,
          users: 1,
          reports: 'Monthly',
          support: 'Email only'
        },
        isActive: true,
        stripePriceId: 'price_basic_trial',
        trial: { enabled: true, days: 14 }
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 29,
        period: 'month',
        description: 'For growing businesses',
        features: ['seo-advanced', 'automation', 'reports-weekly', 'support-priority'],
        limitations: {
          products: 500,
          users: 3,
          reports: 'Weekly',
          support: 'Priority chat & email'
        },
        isActive: true,
        stripePriceId: 'price_professional_monthly',
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        period: 'month',
        description: 'For large stores and agencies',
        features: ['seo-enterprise', 'automation-advanced', 'reports-daily', 'support-dedicated'],
        limitations: {
          products: 10000,
          users: 10,
          reports: 'Daily',
          support: 'Dedicated manager'
        },
        isActive: true,
        stripePriceId: 'price_enterprise_monthly'
      }
    ]);

    // Sample customers
    setCustomers([
      {
        id: '1',
        shopDomain: 'techstore.myshopify.com',
        email: 'admin@techstore.com',
        name: 'Tech Store Plus',
        plan: 'professional',
        status: 'active',
        billingPeriod: 'monthly',
        nextBilling: '2024-01-15',
        mrr: 29,
        features: ['seo-advanced', 'automation', 'reports-weekly'],
        createdAt: '2023-12-01',
        lastLogin: '2024-01-02'
      },
      {
        id: '2',
        shopDomain: 'fashionstore.myshopify.com',
        email: 'owner@fashionstore.com',
        name: 'Fashion Forward',
        plan: 'basic',
        status: 'trial',
        billingPeriod: 'monthly',
        nextBilling: '2024-01-10',
        mrr: 0,
        trialEnds: '2024-01-10',
        features: ['seo-basic'],
        createdAt: '2023-12-27',
        lastLogin: '2024-01-03'
      }
    ]);

    // Sample feature controls
    setFeatures([
      {
        id: 'seo-basic',
        name: 'Basic SEO Optimization',
        description: 'Core SEO features for product optimization',
        availableInPlans: ['basic', 'professional', 'enterprise'],
        isEnabled: true,
        category: 'seo'
      },
      {
        id: 'seo-advanced',
        name: 'Advanced SEO Suite',
        description: 'Advanced SEO tools including schema markup and competitor analysis',
        availableInPlans: ['professional', 'enterprise'],
        isEnabled: true,
        category: 'seo'
      },
      {
        id: 'automation',
        name: 'Internal Link Automation',
        description: 'Automated internal linking for better SEO performance',
        availableInPlans: ['professional', 'enterprise'],
        isEnabled: true,
        category: 'automation'
      },
      {
        id: 'reports-daily',
        name: 'Daily SEO Reports',
        description: 'Daily automated SEO performance reports',
        availableInPlans: ['enterprise'],
        isEnabled: true,
        category: 'analytics'
      },
      {
        id: 'support-dedicated',
        name: 'Dedicated Account Manager',
        description: 'Personal account manager for white-glove support',
        availableInPlans: ['enterprise'],
        isEnabled: true,
        category: 'support'
      }
    ]);
  };

  const handlePlanUpdate = async (planId: string, updates: Partial<SubscriptionPlan>) => {
    setLoading(true);
    try {
      setPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, ...updates } : plan
      ));
      toast.success('Plan updated successfully');
    } catch (error) {
      toast.error('Failed to update plan');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = async (featureId: string, enabled: boolean) => {
    setLoading(true);
    try {
      setFeatures(prev => prev.map(feature =>
        feature.id === featureId ? { ...feature, isEnabled: enabled } : feature
      ));
      toast.success(`Feature ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update feature');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerStatusChange = async (customerId: string, status: Customer['status']) => {
    setLoading(true);
    try {
      setCustomers(prev => prev.map(customer =>
        customer.id === customerId ? { ...customer, status } : customer
      ));
      toast.success('Customer status updated');
    } catch (error) {
      toast.error('Failed to update customer status');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const trialCustomers = customers.filter(c => c.status === 'trial').length;
    const totalMRR = customers.reduce((sum, customer) => sum + customer.mrr, 0);
    const churnRate = customers.filter(c => c.status === 'canceled').length / totalCustomers * 100;

    return { totalCustomers, activeCustomers, trialCustomers, totalMRR, churnRate };
  };

  const metrics = calculateMetrics();

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalCustomers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
              <p className="text-3xl font-bold text-green-600">{metrics.activeCustomers}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-purple-600">${metrics.totalMRR}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trial Users</p>
              <p className="text-3xl font-bold text-orange-600">{metrics.trialCustomers}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Subscriptions</h3>
          <div className="space-y-4">
            {customers.slice(0, 5).map(customer => (
              <div key={customer.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.shopDomain}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    customer.status === 'active' ? 'bg-green-100 text-green-800' :
                    customer.status === 'trial' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {customer.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">${customer.mrr}/mo</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <div className="space-y-4">
            {plans.map(plan => {
              const planCustomers = customers.filter(c => c.plan === plan.id).length;
              const percentage = (planCustomers / customers.length) * 100 || 0;
              return (
                <div key={plan.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{plan.name}</span>
                    <span className="text-sm text-gray-600">{planCustomers} users</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlansManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
        <button 
          onClick={() => setShowAddPlan(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-white rounded-lg shadow-sm border p-6 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="text-center mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${plan.price}
                <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
              </div>
              {plan.trial && (
                <p className="text-sm text-green-600">{plan.trial.days}-day free trial</p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm">
                <span className="font-medium">Products:</span> {plan.limitations.products}
              </div>
              <div className="text-sm">
                <span className="font-medium">Users:</span> {plan.limitations.users}
              </div>
              <div className="text-sm">
                <span className="font-medium">Reports:</span> {plan.limitations.reports}
              </div>
              <div className="text-sm">
                <span className="font-medium">Support:</span> {plan.limitations.support}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlanUpdate(plan.id, { isActive: !plan.isActive })}
                  className={`p-2 rounded ${plan.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  {plan.isActive ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomersManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Customers Management</h2>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.shopDomain}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{customer.plan}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' :
                      customer.status === 'trial' ? 'bg-orange-100 text-orange-800' :
                      customer.status === 'canceled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${customer.mrr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.nextBilling}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCustomerStatusChange(customer.id, 
                          customer.status === 'active' ? 'suspended' : 'active'
                        )}
                        className={`p-1 rounded ${
                          customer.status === 'active' 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {customer.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFeaturesControl = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Features Control</h2>
        <p className="text-gray-600">Manage which features are available for each subscription plan</p>
      </div>

      <div className="space-y-4">
        {Object.entries(
          features.reduce((acc, feature) => {
            if (!acc[feature.category]) acc[feature.category] = [];
            acc[feature.category].push(feature);
            return acc;
          }, {} as Record<string, FeatureControl[]>)
        ).map(([category, categoryFeatures]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
              {category} Features
            </h3>
            <div className="space-y-4">
              {categoryFeatures.map(feature => (
                <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{feature.name}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                    <div className="flex gap-2 mt-2">
                      {feature.availableInPlans.map(planId => (
                        <span key={planId} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {plans.find(p => p.id === planId)?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleFeatureToggle(feature.id, !feature.isEnabled)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        feature.isEnabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        feature.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                    <span className={`text-sm font-medium ${
                      feature.isEnabled ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {feature.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'plans', label: 'Subscription Plans', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'features', label: 'Features Control', icon: Settings },
    { id: 'billing', label: 'Billing Settings', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopify App Admin Portal
          </h1>
          <p className="text-gray-600">
            Manage subscription plans, billing, and feature access for your Shopify app
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'plans' && renderPlansManagement()}
          {activeTab === 'customers' && renderCustomersManagement()}
          {activeTab === 'features' && renderFeaturesControl()}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Billing Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stripe Secret Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk_test_..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Endpoint
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-app.com/webhooks/stripe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopifyBillingAdmin;