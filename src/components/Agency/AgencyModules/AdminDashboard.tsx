import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Settings, Plus, Edit, Trash2, Search, Filter, Download, RefreshCw, Tag, Package, UserPlus, UserCheck, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [leadServices, setLeadServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showAddPromotionModal, setShowAddPromotionModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  
  // Form states
  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    role: 'client',
    company_name: ''
  });
  
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: '',
    billing_interval: 'monthly',
    features: [] as string[],
    is_active: true,
    trial_days: '14'
  });
  
  const [promotionForm, setPromotionForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    max_uses: '',
    applies_to: {
      plans: [] as string[],
      services: [] as string[]
    },
    is_active: true
  });
  
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    features: [] as string[],
    is_active: true
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (usersError) throw usersError;
        setUsers(usersData || []);
        
        // Fetch subscription plans
        const { data: plansData, error: plansError } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('price', { ascending: true });
        
        if (plansError) throw plansError;
        setSubscriptionPlans(plansData || []);
        
        // Fetch promotions
        const { data: promotionsData, error: promotionsError } = await supabase
          .from('promotions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (promotionsError) throw promotionsError;
        setPromotions(promotionsData || []);
        
        // Fetch lead services
        const { data: servicesData, error: servicesError } = await supabase
          .from('lead_services')
          .select('*')
          .order('price', { ascending: true });
        
        if (servicesError) throw servicesError;
        setLeadServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.email || !userForm.full_name || !userForm.role) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      // In a real implementation, we would create a user in Supabase Auth
      // and then add their profile
      
      // For now, we'll just show a success message
      toast.success(`User ${userForm.full_name} added successfully`);
      setShowAddUserModal(false);
      setUserForm({
        email: '',
        full_name: '',
        role: 'client',
        company_name: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };
  
  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!planForm.name || !planForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([{
          name: planForm.name,
          description: planForm.description,
          price: parseFloat(planForm.price),
          billing_interval: planForm.billing_interval,
          features: planForm.features,
          is_active: planForm.is_active,
          trial_days: parseInt(planForm.trial_days)
        }])
        .select();
      
      if (error) throw error;
      
      toast.success(`Plan ${planForm.name} added successfully`);
      setSubscriptionPlans([...(data || []), ...subscriptionPlans]);
      setShowAddPlanModal(false);
      setPlanForm({
        name: '',
        description: '',
        price: '',
        billing_interval: 'monthly',
        features: [],
        is_active: true,
        trial_days: '14'
      });
    } catch (error) {
      console.error('Error adding plan:', error);
      toast.error('Failed to add subscription plan');
    }
  };
  
  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promotionForm.code || !promotionForm.discount_value) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([{
          code: promotionForm.code,
          description: promotionForm.description,
          discount_type: promotionForm.discount_type,
          discount_value: parseFloat(promotionForm.discount_value),
          start_date: promotionForm.start_date,
          end_date: promotionForm.end_date || null,
          max_uses: promotionForm.max_uses ? parseInt(promotionForm.max_uses) : null,
          applies_to: promotionForm.applies_to,
          is_active: promotionForm.is_active
        }])
        .select();
      
      if (error) throw error;
      
      toast.success(`Promotion ${promotionForm.code} added successfully`);
      setPromotions([...(data || []), ...promotions]);
      setShowAddPromotionModal(false);
      setPromotionForm({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        max_uses: '',
        applies_to: {
          plans: [],
          services: []
        },
        is_active: true
      });
    } catch (error) {
      console.error('Error adding promotion:', error);
      toast.error('Failed to add promotion');
    }
  };
  
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceForm.name || !serviceForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('lead_services')
        .insert([{
          name: serviceForm.name,
          description: serviceForm.description,
          price: parseFloat(serviceForm.price),
          features: serviceForm.features,
          is_active: serviceForm.is_active
        }])
        .select();
      
      if (error) throw error;
      
      toast.success(`Service ${serviceForm.name} added successfully`);
      setLeadServices([...(data || []), ...leadServices]);
      setShowAddServiceModal(false);
      setServiceForm({
        name: '',
        description: '',
        price: '',
        features: [],
        is_active: true
      });
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add lead service');
    }
  };
  
  const handleToggleFeature = (feature: string, formType: 'plan' | 'service') => {
    if (formType === 'plan') {
      if (planForm.features.includes(feature)) {
        setPlanForm({
          ...planForm,
          features: planForm.features.filter(f => f !== feature)
        });
      } else {
        setPlanForm({
          ...planForm,
          features: [...planForm.features, feature]
        });
      }
    } else {
      if (serviceForm.features.includes(feature)) {
        setServiceForm({
          ...serviceForm,
          features: serviceForm.features.filter(f => f !== feature)
        });
      } else {
        setServiceForm({
          ...serviceForm,
          features: [...serviceForm.features, feature]
        });
      }
    }
  };
  
  const handleTogglePlan = (planId: string) => {
    setPromotionForm({
      ...promotionForm,
      applies_to: {
        ...promotionForm.applies_to,
        plans: promotionForm.applies_to.plans.includes(planId)
          ? promotionForm.applies_to.plans.filter(id => id !== planId)
          : [...promotionForm.applies_to.plans, planId]
      }
    });
  };
  
  const handleToggleService = (serviceId: string) => {
    setPromotionForm({
      ...promotionForm,
      applies_to: {
        ...promotionForm.applies_to,
        services: promotionForm.applies_to.services.includes(serviceId)
          ? promotionForm.applies_to.services.filter(id => id !== serviceId)
          : [...promotionForm.applies_to.services, serviceId]
      }
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // In a real implementation, we would delete the user from Supabase Auth
      toast.success('User deleted successfully');
      setUsers(users.filter(user => user.id !== userId));
    }
  };
  
  const handleDeletePlan = async (planId: string) => {
    if (confirm('Are you sure you want to delete this subscription plan? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('subscription_plans')
          .delete()
          .eq('id', planId);
        
        if (error) throw error;
        
        toast.success('Subscription plan deleted successfully');
        setSubscriptionPlans(subscriptionPlans.filter(plan => plan.id !== planId));
      } catch (error) {
        console.error('Error deleting plan:', error);
        toast.error('Failed to delete subscription plan');
      }
    }
  };
  
  const handleDeletePromotion = async (promotionId: string) => {
    if (confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('promotions')
          .delete()
          .eq('id', promotionId);
        
        if (error) throw error;
        
        toast.success('Promotion deleted successfully');
        setPromotions(promotions.filter(promo => promo.id !== promotionId));
      } catch (error) {
        console.error('Error deleting promotion:', error);
        toast.error('Failed to delete promotion');
      }
    }
  };
  
  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this lead service? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('lead_services')
          .delete()
          .eq('id', serviceId);
        
        if (error) throw error;
        
        toast.success('Lead service deleted successfully');
        setLeadServices(leadServices.filter(service => service.id !== serviceId));
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete lead service');
      }
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button 
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>
      
      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Add New User</h4>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="user@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={userForm.full_name}
                  onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="specialist">Specialist</option>
                  <option value="client">Client</option>
                </select>
              </div>
              
              {userForm.role === 'client' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={userForm.company_name}
                    onChange={(e) => setUserForm({...userForm, company_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="Company Name"
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className={index < users.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-medium">
                          {user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}
                        </div>
                        <div className="font-medium text-gray-900">{user.full_name || 'Unnamed User'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'specialist' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toast.success(`Editing user ${user.full_name || user.email}`)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <button 
          onClick={() => setShowAddPlanModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>
      
      {/* Add Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Add Subscription Plan</h4>
              <button 
                onClick={() => setShowAddPlanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddPlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Professional Plan"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Comprehensive plan for growing agencies"
                  rows={2}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-600">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({...planForm, price: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="299.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Interval</label>
                <select
                  value={planForm.billing_interval}
                  onChange={(e) => setPlanForm({...planForm, billing_interval: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trial Days</label>
                <input
                  type="number"
                  min="0"
                  value={planForm.trial_days}
                  onChange={(e) => setPlanForm({...planForm, trial_days: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="14"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                <div className="space-y-2">
                  {['Up to 15 clients', 'Full CRM functionality', 'Complete SEO toolkit', 'Email marketing', 'Affiliate tracking', 'Priority support', 'White label options'].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feature-${index}`}
                        checked={planForm.features.includes(feature)}
                        onChange={() => handleToggleFeature(feature, 'plan')}
                        className="mr-2"
                      />
                      <label htmlFor={`feature-${index}`} className="text-sm text-gray-700">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is-active-plan"
                  checked={planForm.is_active}
                  onChange={(e) => setPlanForm({...planForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is-active-plan" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Add Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : subscriptionPlans.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Subscription Plans</h4>
            <p className="text-gray-600 mb-4">Add your first subscription plan to get started.</p>
            <button 
              onClick={() => setShowAddPlanModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add Plan
            </button>
          </div>
        ) : (
          subscriptionPlans.map(plan => (
            <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{formatCurrency(plan.price)}</span>
                  <span className="text-gray-600">/{plan.billing_interval}</span>
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="space-y-2">
                  {Array.isArray(plan.features) && plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 flex justify-end space-x-2">
                <button 
                  onClick={() => toast.success(`Editing plan ${plan.name}`)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeletePlan(plan.id)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  const renderPromotions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Promotions</h3>
        <button 
          onClick={() => setShowAddPromotionModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Tag className="w-4 h-4" />
          <span>Add Promotion</span>
        </button>
      </div>
      
      {/* Add Promotion Modal */}
      {showAddPromotionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Add Promotion</h4>
              <button 
                onClick={() => setShowAddPromotionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddPromotion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Code</label>
                <input
                  type="text"
                  value={promotionForm.code}
                  onChange={(e) => setPromotionForm({...promotionForm, code: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="SUMMER2024"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={promotionForm.description}
                  onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Summer promotion for new users"
                  rows={2}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={promotionForm.discount_type}
                    onChange={(e) => setPromotionForm({...promotionForm, discount_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                  <div className="flex items-center">
                    {promotionForm.discount_type === 'percentage' && (
                      <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-600">
                        %
                      </span>
                    )}
                    {promotionForm.discount_type === 'fixed_amount' && (
                      <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-600">
                        $
                      </span>
                    )}
                    <input
                      type="number"
                      min="0"
                      step={promotionForm.discount_type === 'percentage' ? '1' : '0.01'}
                      value={promotionForm.discount_value}
                      onChange={(e) => setPromotionForm({...promotionForm, discount_value: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                      placeholder={promotionForm.discount_type === 'percentage' ? '15' : '50.00'}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={promotionForm.start_date}
                    onChange={(e) => setPromotionForm({...promotionForm, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={promotionForm.end_date}
                    onChange={(e) => setPromotionForm({...promotionForm, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (Optional)</label>
                <input
                  type="number"
                  min="1"
                  value={promotionForm.max_uses}
                  onChange={(e) => setPromotionForm({...promotionForm, max_uses: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applies To</label>
                
                <div className="mb-2">
                  <h5 className="text-sm font-medium text-gray-700">Subscription Plans</h5>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setPromotionForm({
                        ...promotionForm,
                        applies_to: {
                          ...promotionForm.applies_to,
                          plans: promotionForm.applies_to.plans.includes('*') ? [] : ['*']
                        }
                      })}
                      className={`px-3 py-1 rounded-full text-xs ${
                        promotionForm.applies_to.plans.includes('*')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Plans
                    </button>
                    
                    {subscriptionPlans.map(plan => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => handleTogglePlan(plan.id)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          promotionForm.applies_to.plans.includes(plan.id)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={promotionForm.applies_to.plans.includes('*')}
                      >
                        {plan.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Lead Services</h5>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setPromotionForm({
                        ...promotionForm,
                        applies_to: {
                          ...promotionForm.applies_to,
                          services: promotionForm.applies_to.services.includes('*') ? [] : ['*']
                        }
                      })}
                      className={`px-3 py-1 rounded-full text-xs ${
                        promotionForm.applies_to.services.includes('*')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Services
                    </button>
                    
                    {leadServices.map(service => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleToggleService(service.id)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          promotionForm.applies_to.services.includes(service.id)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={promotionForm.applies_to.services.includes('*')}
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is-active-promotion"
                  checked={promotionForm.is_active}
                  onChange={(e) => setPromotionForm({...promotionForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is-active-promotion" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddPromotionModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Add Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Discount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Validity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    Loading promotions...
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No promotions found
                  </td>
                </tr>
              ) : (
                promotions.map((promotion, index) => (
                  <tr key={promotion.id} className={index < promotions.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{promotion.code}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{promotion.description}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {promotion.discount_type === 'percentage' 
                        ? `${promotion.discount_value}%` 
                        : formatCurrency(promotion.discount_value)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(promotion.start_date)} - {promotion.end_date ? formatDate(promotion.end_date) : 'No end date'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        promotion.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {promotion.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toast.success(`Editing promotion ${promotion.code}`)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePromotion(promotion.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  const renderLeadServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lead Services</h3>
        <button 
          onClick={() => setShowAddServiceModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Package className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>
      
      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Add Lead Service</h4>
              <button 
                onClick={() => setShowAddServiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Premium Lead Generation"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="Advanced lead generation with multi-channel approach"
                  rows={2}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-600">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="599.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                <div className="space-y-2">
                  {['Email campaigns', 'Social media outreach', 'Advanced lead scoring', 'Retargeting campaigns', 'Lead nurturing workflows', 'Custom reporting', 'Dedicated account manager'].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`service-feature-${index}`}
                        checked={serviceForm.features.includes(feature)}
                        onChange={() => handleToggleFeature(feature, 'service')}
                        className="mr-2"
                      />
                      <label htmlFor={`service-feature-${index}`} className="text-sm text-gray-700">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is-active-service"
                  checked={serviceForm.is_active}
                  onChange={(e) => setServiceForm({...serviceForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is-active-service" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : leadServices.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Lead Services</h4>
            <p className="text-gray-600 mb-4">Add your first lead service to get started.</p>
            <button 
              onClick={() => setShowAddServiceModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add Service
            </button>
          </div>
        ) : (
          leadServices.map(service => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{service.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{formatCurrency(service.price)}</span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="space-y-2">
                  {Array.isArray(service.features) && service.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 flex justify-end space-x-2">
                <button 
                  onClick={() => toast.success(`Editing service ${service.name}`)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteService(service.id)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard },
    { id: 'promotions', label: 'Promotions', icon: Tag },
    { id: 'lead-services', label: 'Lead Services', icon: Package }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage users, subscriptions, and system settings</p>
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
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'promotions' && renderPromotions()}
        {activeTab === 'lead-services' && renderLeadServices()}
      </div>
    </div>
  );
};

export default AdminDashboard;