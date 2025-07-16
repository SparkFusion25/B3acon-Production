import React, { useState, useEffect } from 'react';
import { Users, Package, Tag, Settings, Plus, Edit, Trash2, Save, X, Check, DollarSign, Percent, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [leadServices, setLeadServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [userForm, setUserForm] = useState({
    id: '',
    email: '',
    full_name: '',
    role: 'client',
    company_name: '',
    is_active: true
  });
  const [planForm, setPlanForm] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    billing_interval: 'monthly',
    features: [] as string[],
    is_active: true,
    trial_days: 14
  });
  const [promotionForm, setPromotionForm] = useState({
    id: '',
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 10,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    max_uses: 100,
    is_active: true
  });
  const [serviceForm, setServiceForm] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    features: [] as string[],
    is_active: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (userError) throw userError;
        setUsers(userData || []);
        
        // Fetch subscription plans
        const { data: planData, error: planError } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('price', { ascending: true });
        
        if (planError) throw planError;
        setSubscriptionPlans(planData || []);
        
        // Fetch promotions
        const { data: promoData, error: promoError } = await supabase
          .from('promotions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (promoError) throw promoError;
        setPromotions(promoData || []);
        
        // Fetch lead services
        const { data: serviceData, error: serviceError } = await supabase
          .from('lead_services')
          .select('*')
          .order('price', { ascending: true });
        
        if (serviceError) throw serviceError;
        setLeadServices(serviceData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        
        // Set mock data if database tables don't exist yet
        setUsers([
          { id: '1', email: 'admin@example.com', full_name: 'Admin User', role: 'admin', company_name: 'B3ACON', is_active: true },
          { id: '2', email: 'manager@example.com', full_name: 'Manager User', role: 'manager', company_name: 'B3ACON', is_active: true },
          { id: '3', email: 'client@example.com', full_name: 'Client User', role: 'client', company_name: 'Client Company', is_active: true }
        ]);
        
        setSubscriptionPlans([
          { id: '1', name: 'Starter', description: 'Basic plan for small businesses', price: 49, billing_interval: 'monthly', features: ['Basic CRM', '5 users', 'Email support'], is_active: true, trial_days: 14 },
          { id: '2', name: 'Professional', description: 'Advanced plan for growing businesses', price: 99, billing_interval: 'monthly', features: ['Full CRM', '10 users', 'Priority support', 'API access'], is_active: true, trial_days: 14 },
          { id: '3', name: 'Enterprise', description: 'Complete solution for large businesses', price: 199, billing_interval: 'monthly', features: ['Enterprise CRM', 'Unlimited users', 'Dedicated support', 'Custom integrations'], is_active: true, trial_days: 14 }
        ]);
        
        setPromotions([
          { id: '1', code: 'WELCOME20', description: 'Welcome discount', discount_type: 'percentage', discount_value: 20, start_date: '2024-01-01', end_date: '2024-12-31', max_uses: 100, current_uses: 0, is_active: true },
          { id: '2', code: 'SUMMER2024', description: 'Summer promotion', discount_type: 'percentage', discount_value: 15, start_date: '2024-06-01', end_date: '2024-08-31', max_uses: 200, current_uses: 0, is_active: true }
        ]);
        
        setLeadServices([
          { id: '1', name: 'Basic Lead Generation', description: 'Entry-level lead generation service', price: 299, features: ['Basic targeting', 'Up to 20 leads/month', 'Email support'], is_active: true },
          { id: '2', name: 'Pro Lead Generation', description: 'Advanced lead generation service', price: 599, features: ['Advanced targeting', 'Up to 50 leads/month', 'Lead qualification', 'Priority support'], is_active: true },
          { id: '3', name: 'Enterprise Lead Generation', description: 'Custom lead generation solution', price: 999, features: ['Custom targeting', 'Unlimited leads', 'Advanced qualification', 'Dedicated account manager'], is_active: true }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            email: userForm.email,
            full_name: userForm.full_name,
            role: userForm.role,
            company_name: userForm.company_name
          })
          .eq('id', editingId);
        
        if (error) throw error;
        
        setUsers(users.map(user => 
          user.id === editingId ? { ...user, ...userForm } : user
        ));
        
        toast.success('User updated successfully');
      } else {
        // Create new user (in a real app, this would involve auth.signUp)
        const newUser = {
          ...userForm,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        
        setUsers([newUser, ...users]);
        toast.success('User created successfully');
      }
      
      setShowUserModal(false);
      setEditingId(null);
      setUserForm({
        id: '',
        email: '',
        full_name: '',
        role: 'client',
        company_name: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };
  
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing plan
        const { error } = await supabase
          .from('subscription_plans')
          .update({
            name: planForm.name,
            description: planForm.description,
            price: planForm.price,
            billing_interval: planForm.billing_interval,
            features: planForm.features,
            is_active: planForm.is_active,
            trial_days: planForm.trial_days
          })
          .eq('id', editingId);
        
        if (error) throw error;
        
        setSubscriptionPlans(subscriptionPlans.map(plan => 
          plan.id === editingId ? { ...plan, ...planForm } : plan
        ));
        
        toast.success('Subscription plan updated successfully');
      } else {
        // Create new plan
        const { data, error } = await supabase
          .from('subscription_plans')
          .insert({
            name: planForm.name,
            description: planForm.description,
            price: planForm.price,
            billing_interval: planForm.billing_interval,
            features: planForm.features,
            is_active: planForm.is_active,
            trial_days: planForm.trial_days
          })
          .select();
        
        if (error) throw error;
        
        if (data) {
          setSubscriptionPlans([...subscriptionPlans, data[0]]);
        }
        
        toast.success('Subscription plan created successfully');
      }
      
      setShowPlanModal(false);
      setEditingId(null);
      setPlanForm({
        id: '',
        name: '',
        description: '',
        price: 0,
        billing_interval: 'monthly',
        features: [],
        is_active: true,
        trial_days: 14
      });
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save subscription plan');
    }
  };
  
  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing promotion
        const { error } = await supabase
          .from('promotions')
          .update({
            code: promotionForm.code,
            description: promotionForm.description,
            discount_type: promotionForm.discount_type,
            discount_value: promotionForm.discount_value,
            start_date: promotionForm.start_date,
            end_date: promotionForm.end_date || null,
            max_uses: promotionForm.max_uses,
            is_active: promotionForm.is_active
          })
          .eq('id', editingId);
        
        if (error) throw error;
        
        setPromotions(promotions.map(promo => 
          promo.id === editingId ? { ...promo, ...promotionForm } : promo
        ));
        
        toast.success('Promotion updated successfully');
      } else {
        // Create new promotion
        const { data, error } = await supabase
          .from('promotions')
          .insert({
            code: promotionForm.code,
            description: promotionForm.description,
            discount_type: promotionForm.discount_type,
            discount_value: promotionForm.discount_value,
            start_date: promotionForm.start_date,
            end_date: promotionForm.end_date || null,
            max_uses: promotionForm.max_uses,
            current_uses: 0,
            is_active: promotionForm.is_active
          })
          .select();
        
        if (error) throw error;
        
        if (data) {
          setPromotions([...promotions, data[0]]);
        }
        
        toast.success('Promotion created successfully');
      }
      
      setShowPromotionModal(false);
      setEditingId(null);
      setPromotionForm({
        id: '',
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 10,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        max_uses: 100,
        is_active: true
      });
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error('Failed to save promotion');
    }
  };
  
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing service
        const { error } = await supabase
          .from('lead_services')
          .update({
            name: serviceForm.name,
            description: serviceForm.description,
            price: serviceForm.price,
            features: serviceForm.features,
            is_active: serviceForm.is_active
          })
          .eq('id', editingId);
        
        if (error) throw error;
        
        setLeadServices(leadServices.map(service => 
          service.id === editingId ? { ...service, ...serviceForm } : service
        ));
        
        toast.success('Lead service updated successfully');
      } else {
        // Create new service
        const { data, error } = await supabase
          .from('lead_services')
          .insert({
            name: serviceForm.name,
            description: serviceForm.description,
            price: serviceForm.price,
            features: serviceForm.features,
            is_active: serviceForm.is_active
          })
          .select();
        
        if (error) throw error;
        
        if (data) {
          setLeadServices([...leadServices, data[0]]);
        }
        
        toast.success('Lead service created successfully');
      }
      
      setShowServiceModal(false);
      setEditingId(null);
      setServiceForm({
        id: '',
        name: '',
        description: '',
        price: 0,
        features: [],
        is_active: true
      });
    } catch (error) {
      console.error('Error saving lead service:', error);
      toast.error('Failed to save lead service');
    }
  };
  
  const handleEditUser = (user: any) => {
    setEditingId(user.id);
    setUserForm({
      id: user.id,
      email: user.email,
      full_name: user.full_name || '',
      role: user.role || 'client',
      company_name: user.company_name || '',
      is_active: user.is_active !== false
    });
    setShowUserModal(true);
  };
  
  const handleEditPlan = (plan: any) => {
    setEditingId(plan.id);
    setPlanForm({
      id: plan.id,
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      billing_interval: plan.billing_interval || 'monthly',
      features: plan.features || [],
      is_active: plan.is_active !== false,
      trial_days: plan.trial_days || 14
    });
    setShowPlanModal(true);
  };
  
  const handleEditPromotion = (promo: any) => {
    setEditingId(promo.id);
    setPromotionForm({
      id: promo.id,
      code: promo.code,
      description: promo.description || '',
      discount_type: promo.discount_type || 'percentage',
      discount_value: promo.discount_value,
      start_date: promo.start_date ? new Date(promo.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      end_date: promo.end_date ? new Date(promo.end_date).toISOString().split('T')[0] : '',
      max_uses: promo.max_uses || 100,
      is_active: promo.is_active !== false
    });
    setShowPromotionModal(true);
  };
  
  const handleEditService = (service: any) => {
    setEditingId(service.id);
    setServiceForm({
      id: service.id,
      name: service.name,
      description: service.description || '',
      price: service.price,
      features: service.features || [],
      is_active: service.is_active !== false
    });
    setShowServiceModal(true);
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };
  
  const handleDeletePlan = async (planId: string) => {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      try {
        const { error } = await supabase
          .from('subscription_plans')
          .delete()
          .eq('id', planId);
        
        if (error) throw error;
        
        setSubscriptionPlans(subscriptionPlans.filter(plan => plan.id !== planId));
        toast.success('Subscription plan deleted successfully');
      } catch (error) {
        console.error('Error deleting plan:', error);
        toast.error('Failed to delete subscription plan');
      }
    }
  };
  
  const handleDeletePromotion = async (promoId: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      try {
        const { error } = await supabase
          .from('promotions')
          .delete()
          .eq('id', promoId);
        
        if (error) throw error;
        
        setPromotions(promotions.filter(promo => promo.id !== promoId));
        toast.success('Promotion deleted successfully');
      } catch (error) {
        console.error('Error deleting promotion:', error);
        toast.error('Failed to delete promotion');
      }
    }
  };
  
  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this lead service?')) {
      try {
        const { error } = await supabase
          .from('lead_services')
          .delete()
          .eq('id', serviceId);
        
        if (error) throw error;
        
        setLeadServices(leadServices.filter(service => service.id !== serviceId));
        toast.success('Lead service deleted successfully');
      } catch (error) {
        console.error('Error deleting lead service:', error);
        toast.error('Failed to delete lead service');
      }
    }
  };
  
  const handleAddFeature = (type: 'plan' | 'service') => {
    if (type === 'plan') {
      setPlanForm({
        ...planForm,
        features: [...planForm.features, '']
      });
    } else {
      setServiceForm({
        ...serviceForm,
        features: [...serviceForm.features, '']
      });
    }
  };
  
  const handleUpdateFeature = (type: 'plan' | 'service', index: number, value: string) => {
    if (type === 'plan') {
      const updatedFeatures = [...planForm.features];
      updatedFeatures[index] = value;
      setPlanForm({
        ...planForm,
        features: updatedFeatures
      });
    } else {
      const updatedFeatures = [...serviceForm.features];
      updatedFeatures[index] = value;
      setServiceForm({
        ...serviceForm,
        features: updatedFeatures
      });
    }
  };
  
  const handleRemoveFeature = (type: 'plan' | 'service', index: number) => {
    if (type === 'plan') {
      const updatedFeatures = [...planForm.features];
      updatedFeatures.splice(index, 1);
      setPlanForm({
        ...planForm,
        features: updatedFeatures
      });
    } else {
      const updatedFeatures = [...serviceForm.features];
      updatedFeatures.splice(index, 1);
      setServiceForm({
        ...serviceForm,
        features: updatedFeatures
      });
    }
  };
  
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button 
          onClick={() => {
            setEditingId(null);
            setUserForm({
              id: '',
              email: '',
              full_name: '',
              role: 'client',
              company_name: '',
              is_active: true
            });
            setShowUserModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>
      
      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit User' : 'Add User'}
              </h4>
              <button 
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
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
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="specialist">Specialist</option>
                  <option value="client">Client</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={userForm.company_name}
                  onChange={(e) => setUserForm({...userForm, company_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is-active"
                  checked={userForm.is_active}
                  onChange={(e) => setUserForm({...userForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is-active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingId ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Company</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className={index < users.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-medium">
                          {user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.full_name || 'Unnamed User'}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'specialist' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role || 'client'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.company_name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
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
  
  const renderSubscriptionPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <button 
          onClick={() => {
            setEditingId(null);
            setPlanForm({
              id: '',
              name: '',
              description: '',
              price: 0,
              billing_interval: 'monthly',
              features: [],
              is_active: true,
              trial_days: 14
            });
            setShowPlanModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>
      
      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Subscription Plan' : 'Add Subscription Plan'}
              </h4>
              <button 
                onClick={() => setShowPlanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="e.g. Professional Plan"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  rows={2}
                  placeholder="Brief description of the plan"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={planForm.price}
                      onChange={(e) => setPlanForm({...planForm, price: parseFloat(e.target.value)})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
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
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trial Days</label>
                <input
                  type="number"
                  min="0"
                  value={planForm.trial_days}
                  onChange={(e) => setPlanForm({...planForm, trial_days: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    type="button"
                    onClick={() => handleAddFeature('plan')}
                    className="text-signal-blue hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Feature
                  </button>
                </div>
                
                <div className="space-y-2">
                  {planForm.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleUpdateFeature('plan', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                        placeholder="e.g. Unlimited users"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature('plan', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {planForm.features.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No features added yet</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="plan-is-active"
                  checked={planForm.is_active}
                  onChange={(e) => setPlanForm({...planForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="plan-is-active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingId ? 'Update Plan' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-signal-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subscription plans...</p>
          </div>
        ) : subscriptionPlans.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Subscription Plans</h4>
            <p className="text-gray-600 mb-4">Create your first subscription plan to get started.</p>
            <button 
              onClick={() => {
                setEditingId(null);
                setPlanForm({
                  id: '',
                  name: '',
                  description: '',
                  price: 0,
                  billing_interval: 'monthly',
                  features: [],
                  is_active: true,
                  trial_days: 14
                });
                setShowPlanModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Create Plan
            </button>
          </div>
        ) : (
          subscriptionPlans.map(plan => (
            <div key={plan.id} className={`bg-white rounded-xl shadow-sm border ${
              plan.is_active !== false ? 'border-gray-200' : 'border-gray-200 opacity-60'
            } overflow-hidden`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditPlan(plan)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.billing_interval}</span>
                </div>
                
                {plan.description && (
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                )}
                
                <div className="space-y-2 mb-4">
                  {(plan.features || []).map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {plan.trial_days} day trial
                  </span>
                </div>
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
          onClick={() => {
            setEditingId(null);
            setPromotionForm({
              id: '',
              code: '',
              description: '',
              discount_type: 'percentage',
              discount_value: 10,
              start_date: new Date().toISOString().split('T')[0],
              end_date: '',
              max_uses: 100,
              is_active: true
            });
            setShowPromotionModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Promotion</span>
        </button>
      </div>
      
      {/* Promotion Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Promotion' : 'Add Promotion'}
              </h4>
              <button 
                onClick={() => setShowPromotionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSavePromotion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Code</label>
                <input
                  type="text"
                  value={promotionForm.code}
                  onChange={(e) => setPromotionForm({...promotionForm, code: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="e.g. SUMMER2024"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={promotionForm.description}
                  onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="e.g. Summer promotion"
                />
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
                  <div className="relative">
                    {promotionForm.discount_type === 'percentage' ? (
                      <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    )}
                    <input
                      type="number"
                      min="0"
                      step={promotionForm.discount_type === 'percentage' ? '1' : '0.01'}
                      value={promotionForm.discount_value}
                      onChange={(e) => setPromotionForm({...promotionForm, discount_value: parseFloat(e.target.value)})}
                      className={`w-full ${promotionForm.discount_type === 'percentage' ? 'pr-10' : 'pl-10'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent`}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Uses</label>
                <input
                  type="number"
                  min="1"
                  value={promotionForm.max_uses}
                  onChange={(e) => setPromotionForm({...promotionForm, max_uses: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="promo-is-active"
                  checked={promotionForm.is_active}
                  onChange={(e) => setPromotionForm({...promotionForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="promo-is-active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPromotionModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingId ? 'Update Promotion' : 'Add Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Promotions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Discount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Validity</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Uses</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading promotions...
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No promotions found
                  </td>
                </tr>
              ) : (
                promotions.map((promo, index) => (
                  <tr key={promo.id} className={index < promotions.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{promo.code}</div>
                      <div className="text-sm text-gray-600">{promo.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      {promo.discount_type === 'percentage' ? (
                        <span className="font-medium text-gray-900">{promo.discount_value}% off</span>
                      ) : (
                        <span className="font-medium text-gray-900">${promo.discount_value} off</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(promo.start_date).toLocaleDateString()}</span>
                        {promo.end_date && (
                          <>
                            <span>-</span>
                            <span>{new Date(promo.end_date).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {promo.current_uses || 0} / {promo.max_uses || 'Unlimited'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        promo.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {promo.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPromotion(promo)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePromotion(promo.id)}
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
          onClick={() => {
            setEditingId(null);
            setServiceForm({
              id: '',
              name: '',
              description: '',
              price: 0,
              features: [],
              is_active: true
            });
            setShowServiceModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>
      
      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Lead Service' : 'Add Lead Service'}
              </h4>
              <button 
                onClick={() => setShowServiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder="e.g. Basic Lead Generation"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  rows={2}
                  placeholder="Brief description of the service"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({...serviceForm, price: parseFloat(e.target.value)})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    type="button"
                    onClick={() => handleAddFeature('service')}
                    className="text-signal-blue hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Feature
                  </button>
                </div>
                
                <div className="space-y-2">
                  {serviceForm.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleUpdateFeature('service', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                        placeholder="e.g. Basic targeting"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature('service', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {serviceForm.features.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No features added yet</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="service-is-active"
                  checked={serviceForm.is_active}
                  onChange={(e) => setServiceForm({...serviceForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="service-is-active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingId ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-signal-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lead services...</p>
          </div>
        ) : leadServices.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Lead Services</h4>
            <p className="text-gray-600 mb-4">Create your first lead service to get started.</p>
            <button 
              onClick={() => {
                setEditingId(null);
                setServiceForm({
                  id: '',
                  name: '',
                  description: '',
                  price: 0,
                  features: [],
                  is_active: true
                });
                setShowServiceModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Create Service
            </button>
          </div>
        ) : (
          leadServices.map(service => (
            <div key={service.id} className={`bg-white rounded-xl shadow-sm border ${
              service.is_active !== false ? 'border-gray-200' : 'border-gray-200 opacity-60'
            } overflow-hidden`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900">{service.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditService(service)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${service.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                {service.description && (
                  <p className="text-gray-600 mb-4">{service.description}</p>
                )}
                
                <div className="space-y-2 mb-4">
                  {(service.features || []).map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toast.success(`${service.name} would be assigned to a client`)}
                    className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                  >
                    Assign to Client
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'plans', label: 'Subscription Plans', icon: Package },
    { id: 'promotions', label: 'Promotions', icon: Tag },
    { id: 'lead-services', label: 'Lead Services', icon: Settings }
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
        {activeTab === 'plans' && renderSubscriptionPlans()}
        {activeTab === 'promotions' && renderPromotions()}
        {activeTab === 'lead-services' && renderLeadServices()}
      </div>
    </div>
  );
};

export default AdminDashboard;