import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Tag, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Save,
  DollarSign,
  Percent,
  Calendar,
  CheckCircle,
  AlertCircle,
  Target,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [leadServices, setLeadServices] = useState<any[]>([]);
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  
  const [userForm, setUserForm] = useState({
    id: '',
    email: '',
    full_name: '',
    role: 'client',
    company: '',
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
    discount_value: 0,
    start_date: '',
    end_date: '',
    max_uses: 0,
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
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Helper functions
  const logAdminAction = async (action: string, data: any) => {
    try {
      await fetch('/api/admin/audit-log', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          data,
          timestamp: new Date().toISOString(),
          adminId: localStorage.getItem('userId')
        })
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  const sendWelcomeEmail = async (user: any) => {
    try {
      await fetch('/api/admin/send-welcome-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: user.full_name,
          role: user.role
        })
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  };

  const resetUserForm = () => {
    setUserForm({
      id: '',
      email: '',
      full_name: '',
      role: 'client',
      company: '',
      is_active: true
    });
    setEditingId(null);
  };

  const resetPlanForm = () => {
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
    setEditingId(null);
  };

  const validatePlanForm = () => {
    if (!planForm.name.trim()) {
      toast.error('Plan name is required');
      return false;
    }
    if (planForm.price < 0) {
      toast.error('Price must be a positive number');
      return false;
    }
    if (planForm.trial_days < 0) {
      toast.error('Trial days must be a positive number');
      return false;
    }
    return true;
  };
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Real API calls to fetch admin data
      const token = localStorage.getItem('accessToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch users
      try {
        const usersResponse = await fetch('/api/admin/users', { headers });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        } else {
          // Fallback to mock data if API fails
          setUsers(getMockUsers());
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        setUsers(getMockUsers());
      }

      // Fetch subscription plans
      try {
        const plansResponse = await fetch('/api/admin/plans', { headers });
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          setSubscriptionPlans(plansData);
        } else {
          setSubscriptionPlans(getMockPlans());
        }
      } catch (error) {
        console.error('Failed to load plans:', error);
        setSubscriptionPlans(getMockPlans());
      }

      // Fetch promotions
      try {
        const promotionsResponse = await fetch('/api/admin/promotions', { headers });
        if (promotionsResponse.ok) {
          const promotionsData = await promotionsResponse.json();
          setPromotions(promotionsData);
        } else {
          setPromotions(getMockPromotions());
        }
      } catch (error) {
        console.error('Failed to load promotions:', error);
        setPromotions(getMockPromotions());
      }

      // Fetch lead services
      try {
        const servicesResponse = await fetch('/api/admin/services', { headers });
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setLeadServices(servicesData);
        } else {
          setLeadServices(getMockServices());
        }
      } catch (error) {
        console.error('Failed to load services:', error);
        setLeadServices(getMockServices());
      }

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
      
      // Load mock data as fallback
      setUsers(getMockUsers());
      setSubscriptionPlans(getMockPlans());
      setPromotions(getMockPromotions());
      setLeadServices(getMockServices());
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data functions for fallback
  const getMockUsers = () => [
    {
      id: '1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin',
      company: 'B3ACON',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          email: 'manager@example.com',
          full_name: 'Manager User',
          role: 'manager',
          company: 'B3ACON',
          is_active: true,
          created_at: '2024-01-02T00:00:00Z'
        },
        {
          id: '3',
          email: 'client@example.com',
          full_name: 'Client User',
          role: 'client',
          company: 'Client Company',
          is_active: true,
          created_at: '2024-01-03T00:00:00Z'
        }
      ];

      const getMockPlans = () => [
        {
          id: '1',
          name: 'Starter',
          description: 'Basic plan for small businesses',
          price: 49.99,
          billing_interval: 'monthly',
          features: ['Basic CRM', '5 users', 'Email support'],
          is_active: true,
          trial_days: 14,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Professional',
          description: 'Advanced plan for growing businesses',
          price: 99.99,
          billing_interval: 'monthly',
          features: ['Full CRM', '15 users', 'Priority support', 'Advanced analytics'],
          is_active: true,
          trial_days: 14,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Enterprise',
          description: 'Complete solution for large businesses',
          price: 199.99,
          billing_interval: 'monthly',
          features: ['Enterprise CRM', 'Unlimited users', 'Dedicated support', 'Custom integrations'],
          is_active: true,
          trial_days: 30,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      const getMockPromotions = () => [
        {
          id: '1',
          code: 'WELCOME20',
          description: 'Welcome discount for new users',
          discount_type: 'percentage',
          discount_value: 20,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          max_uses: 100,
          current_uses: 45,
          is_active: true,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          code: 'SUMMER50',
          description: 'Summer sale discount',
          discount_type: 'percentage',
          discount_value: 50,
          start_date: '2024-06-01',
          end_date: '2024-08-31',
          max_uses: 200,
          current_uses: 0,
          is_active: true,
          created_at: '2024-01-15T00:00:00Z'
        }
      ];

      const getMockServices = () => [
        {
          id: '1',
          name: 'Basic Lead Generation',
          description: 'Entry-level lead generation service',
          price: 199.99,
          features: ['Basic targeting', 'Up to 50 leads/month', 'Email delivery'],
          is_active: true,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Premium Lead Generation',
          description: 'Advanced lead generation with detailed targeting',
          price: 499.99,
          features: ['Advanced targeting', 'Up to 200 leads/month', 'Email & SMS delivery', 'Lead scoring'],
          is_active: true,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
  
  // User management functions
  const handleAddUser = () => {
    setEditingId(null);
    setUserForm({
      id: '',
      email: '',
      full_name: '',
      role: 'client',
      company: '',
      is_active: true
    });
    setShowUserModal(true);
  };
  
  const handleEditUser = (user: any) => {
    setEditingId(user.id);
    setUserForm({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      company: user.company,
      is_active: user.is_active
    });
    setShowUserModal(true);
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setIsLoading(true);
      
      // Real API call to delete user
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
        
        // Log admin action
        await logAdminAction('user_deleted', { userId, userEmail: users.find(u => u.id === userId)?.email });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.email || !userForm.full_name) {
      toast.error('Email and name are required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (editingId) {
        // Update existing user
        const response = await fetch(`/api/admin/users/${editingId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userForm)
        });
        
        if (response.ok) {
          const updatedUser = await response.json();
          setUsers(users.map(user => 
            user.id === editingId ? updatedUser : user
          ));
          toast.success('User updated successfully');
          
          // Log admin action
          await logAdminAction('user_updated', { userId: editingId, changes: userForm });
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to update user');
        }
      } else {
        // Add new user
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...userForm,
            created_at: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          const newUser = await response.json();
          setUsers([...users, newUser]);
          toast.success('User added successfully');
          
          // Send welcome email
          await sendWelcomeEmail(newUser);
          
          // Log admin action
          await logAdminAction('user_created', { userId: newUser.id, userEmail: newUser.email });
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to create user');
        }
      }
      
      setShowUserModal(false);
      resetUserForm();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Subscription plan management functions
  const handleAddPlan = () => {
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
  };
  
  const handleEditPlan = (plan: any) => {
    setEditingId(plan.id);
    setPlanForm({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billing_interval: plan.billing_interval,
      features: plan.features,
      is_active: plan.is_active,
      trial_days: plan.trial_days
    });
    setShowPlanModal(true);
  };
  
  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return;
    
    try {
      setIsLoading(true);
      
      // Check if plan has active subscribers
      const response = await fetch(`/api/admin/plans/${planId}/subscribers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const { activeSubscribers } = await response.json();
        
        if (activeSubscribers > 0) {
          toast.error(`Cannot delete plan with ${activeSubscribers} active subscribers. Please migrate them first.`);
          return;
        }
      }
      
      // Delete the plan
      const deleteResponse = await fetch(`/api/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (deleteResponse.ok) {
        setSubscriptionPlans(subscriptionPlans.filter(plan => plan.id !== planId));
        toast.success('Subscription plan deleted successfully');
        
        // Log admin action
        await logAdminAction('plan_deleted', { planId, planName: subscriptionPlans.find(p => p.id === planId)?.name });
      } else {
        const error = await deleteResponse.json();
        toast.error(error.message || 'Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePlanForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (editingId) {
        // Update existing plan
        const response = await fetch(`/api/admin/plans/${editingId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(planForm)
        });
        
        if (response.ok) {
          const updatedPlan = await response.json();
          setSubscriptionPlans(subscriptionPlans.map(plan => 
            plan.id === editingId ? updatedPlan : plan
          ));
          toast.success('Subscription plan updated successfully');
          
          // Sync with Stripe if configured
          await syncPlanWithStripe(updatedPlan);
          
          // Log admin action
          await logAdminAction('plan_updated', { planId: editingId, changes: planForm });
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to update plan');
        }
      } else {
        // Add new plan
        const response = await fetch('/api/admin/plans', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...planForm,
            created_at: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          const newPlan = await response.json();
          setSubscriptionPlans([...subscriptionPlans, newPlan]);
          toast.success('Subscription plan added successfully');
          
          // Create corresponding Stripe product and price
          await createStripeProduct(newPlan);
          
          // Log admin action
          await logAdminAction('plan_created', { planId: newPlan.id, planName: newPlan.name });
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to create plan');
        }
      }
      
      setShowPlanModal(false);
      resetPlanForm();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save plan');
    } finally {
      setIsLoading(false);
    }
  };

  // Stripe integration functions
  const syncPlanWithStripe = async (plan: any) => {
    try {
      await fetch('/api/admin/stripe/sync-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plan)
      });
    } catch (error) {
      console.error('Failed to sync plan with Stripe:', error);
    }
  };

  const createStripeProduct = async (plan: any) => {
    try {
      const response = await fetch('/api/admin/stripe/create-product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: plan.name,
          description: plan.description,
          price: plan.price,
          interval: plan.billing_interval
        })
      });

      if (response.ok) {
        const { productId, priceId } = await response.json();
        
        // Update plan with Stripe IDs
        await fetch(`/api/admin/plans/${plan.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stripe_product_id: productId,
            stripe_price_id: priceId
          })
        });
      }
    } catch (error) {
      console.error('Failed to create Stripe product:', error);
    }
  };
  
  const handleAddFeature = () => {
    const feature = prompt('Enter feature:');
    if (feature) {
      setPlanForm({
        ...planForm,
        features: [...planForm.features, feature]
      });
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setPlanForm({
      ...planForm,
      features: planForm.features.filter((_, i) => i !== index)
    });
  };
  
  // Promotion management functions
  const handleAddPromotion = () => {
    setEditingId(null);
    setPromotionForm({
      id: '',
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      max_uses: 0,
      is_active: true
    });
    setShowPromotionModal(true);
  };
  
  const handleEditPromotion = (promotion: any) => {
    setEditingId(promotion.id);
    setPromotionForm({
      id: promotion.id,
      code: promotion.code,
      description: promotion.description,
      discount_type: promotion.discount_type,
      discount_value: promotion.discount_value,
      start_date: promotion.start_date,
      end_date: promotion.end_date || '',
      max_uses: promotion.max_uses || 0,
      is_active: promotion.is_active
    });
    setShowPromotionModal(true);
  };
  
  const handleDeletePromotion = (promotionId: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(promotion => promotion.id !== promotionId));
      toast.success('Promotion deleted successfully');
    }
  };
  
  const handleSavePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promotionForm.code || promotionForm.discount_value <= 0) {
      toast.error('Code and discount value are required');
      return;
    }
    
    if (editingId) {
      // Update existing promotion
      setPromotions(promotions.map(promotion => 
        promotion.id === editingId ? { ...promotion, ...promotionForm } : promotion
      ));
      toast.success('Promotion updated successfully');
    } else {
      // Add new promotion
      const newPromotion = {
        ...promotionForm,
        id: Date.now().toString(),
        current_uses: 0,
        created_at: new Date().toISOString()
      };
      setPromotions([...promotions, newPromotion]);
      toast.success('Promotion added successfully');
    }
    
    setShowPromotionModal(false);
  };
  
  // Lead service management functions
  const handleAddService = () => {
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
  };
  
  const handleEditService = (service: any) => {
    setEditingId(service.id);
    setServiceForm({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      features: service.features,
      is_active: service.is_active
    });
    setShowServiceModal(true);
  };
  
  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this lead service?')) {
      setLeadServices(leadServices.filter(service => service.id !== serviceId));
      toast.success('Lead service deleted successfully');
    }
  };
  
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceForm.name || serviceForm.price <= 0) {
      toast.error('Name and price are required');
      return;
    }
    
    if (editingId) {
      // Update existing service
      setLeadServices(leadServices.map(service => 
        service.id === editingId ? { ...service, ...serviceForm } : service
      ));
      toast.success('Lead service updated successfully');
    } else {
      // Add new service
      const newService = {
        ...serviceForm,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      setLeadServices([...leadServices, newService]);
      toast.success('Lead service added successfully');
    }
    
    setShowServiceModal(false);
  };
  
  const handleAddServiceFeature = () => {
    const feature = prompt('Enter feature:');
    if (feature) {
      setServiceForm({
        ...serviceForm,
        features: [...serviceForm.features, feature]
      });
    }
  };
  
  const handleRemoveServiceFeature = (index: number) => {
    setServiceForm({
      ...serviceForm,
      features: serviceForm.features.filter((_, i) => i !== index)
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      specialist: 'bg-green-100 text-green-800',
      client: 'bg-purple-100 text-purple-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  
  const getDiscountTypeColor = (type: string) => {
    return type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };
  
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button 
          onClick={handleAddUser}
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
                ×
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
                  value={userForm.company}
                  onChange={(e) => setUserForm({...userForm, company: e.target.value})}
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
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">{user.full_name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
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
  
  const renderSubscriptionPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        <button 
          onClick={handleAddPlan}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>
      
      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Plan' : 'Add Subscription Plan'}
              </h4>
              <button 
                onClick={() => setShowPlanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {planForm.features.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">No features added</p>
                  ) : (
                    planForm.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
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
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{plan.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(plan.price)}</div>
              <p className="text-sm text-gray-600">per {plan.billing_interval}</p>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
            
            <div className="space-y-2 mb-4">
              {plan.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{plan.trial_days} days trial</span>
              <span>Created: {formatDate(plan.created_at)}</span>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEditPlan(plan)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeletePlan(plan.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderPromotions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Promotions</h3>
        <button 
          onClick={handleAddPromotion}
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
                ×
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
                  placeholder="SUMMER50"
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
                  placeholder="Summer sale discount"
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
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    )}
                    <input
                      type="number"
                      min="0"
                      step={promotionForm.discount_type === 'percentage' ? '1' : '0.01'}
                      max={promotionForm.discount_type === 'percentage' ? '100' : undefined}
                      value={promotionForm.discount_value}
                      onChange={(e) => setPromotionForm({...promotionForm, discount_value: parseFloat(e.target.value)})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (0 for unlimited)</label>
                <input
                  type="number"
                  min="0"
                  value={promotionForm.max_uses}
                  onChange={(e) => setPromotionForm({...promotionForm, max_uses: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="promotion-is-active"
                  checked={promotionForm.is_active}
                  onChange={(e) => setPromotionForm({...promotionForm, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="promotion-is-active" className="text-sm text-gray-700">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {promotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{promotion.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{promotion.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDiscountTypeColor(promotion.discount_type)}`}>
                      {promotion.discount_type === 'percentage' ? `${promotion.discount_value}%` : formatCurrency(promotion.discount_value)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(promotion.start_date)} - {promotion.end_date ? formatDate(promotion.end_date) : 'No end date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.current_uses || 0} / {promotion.max_uses ? promotion.max_uses : '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      promotion.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {promotion.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditPromotion(promotion)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePromotion(promotion.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
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
  
  const renderLeadServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lead Services</h3>
        <button 
          onClick={handleAddService}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>
      
      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Lead Service' : 'Add Lead Service'}
              </h4>
              <button 
                onClick={() => setShowServiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    type="button"
                    onClick={handleAddServiceFeature}
                    className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {serviceForm.features.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">No features added</p>
                  ) : (
                    serviceForm.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceFeature(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
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
      
      {/* Lead Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leadServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{service.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {service.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(service.price)}</div>
              <p className="text-sm text-gray-600">per month</p>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
            
            <div className="space-y-2 mb-4">
              {service.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Created: {formatDate(service.created_at)}</span>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEditService(service)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteService(service.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'plans', label: 'Subscription Plans', icon: Package },
    { id: 'promotions', label: 'Promotions', icon: Tag },
    { id: 'lead-services', label: 'Lead Services', icon: Target }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage users, subscriptions, and system settings</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{users.length}</div>
          <p className="text-sm text-green-600">↗ +2 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Plans</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {subscriptionPlans.filter(plan => plan.is_active).length}
          </div>
          <p className="text-sm text-green-600">All plans active</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Promotions</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {promotions.filter(promo => promo.is_active).length}
          </div>
          <p className="text-sm text-green-600">↗ +1 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Lead Services</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {leadServices.length}
          </div>
          <p className="text-sm text-green-600">All services active</p>
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
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'plans' && renderSubscriptionPlans()}
        {activeTab === 'promotions' && renderPromotions()}
        {activeTab === 'lead-services' && renderLeadServices()}
      </div>
    </div>
  );
};

export default AdminDashboard;