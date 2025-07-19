import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag,
  Settings,
  BarChart3,
  Eye,
  Edit3,
  Trash2,
  Crown,
  AlertCircle,
  CheckCircle,
  Calendar,
  Mail,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import { useMobileNavigation } from '../../hooks/useMobileNavigation';
import '../../styles/premium-design-system.css';

interface User {
  id: string;
  shopUrl: string;
  email: string;
  plan: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
  revenue: number;
}

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  activeTrials: number;
  conversionRate: number;
  churnRate: number;
}

const ShopifyAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useShopifyAuth();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileNavigation();
  
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedView, setSelectedView] = useState('overview');

  // Check admin access
  const isAdmin = user?.email === 'admin@b3acon.com' || user?.plan === 'enterprise';

  useEffect(() => {
    if (!isAdmin) {
      setError('Access denied. Admin privileges required.');
      return;
    }
    
    loadAdminData();
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls - replace with real data in production
      const mockUsers: User[] = [
        {
          id: 'user-1',
          shopUrl: 'fashion-store.myshopify.com',
          email: 'fashion@store.com',
          plan: 'pro',
          status: 'active',
          createdAt: '2024-01-15',
          lastLogin: '2025-01-17',
          revenue: 2340
        },
        {
          id: 'user-2', 
          shopUrl: 'tech-gadgets.myshopify.com',
          email: 'tech@gadgets.com',
          plan: 'starter',
          status: 'active',
          createdAt: '2024-02-20',
          lastLogin: '2025-01-16',
          revenue: 890
        },
        {
          id: 'user-3',
          shopUrl: 'home-decor.myshopify.com', 
          email: 'home@decor.com',
          plan: 'trial',
          status: 'trial',
          createdAt: '2025-01-10',
          lastLogin: '2025-01-17',
          revenue: 0
        },
        {
          id: 'user-4',
          shopUrl: 'fitness-gear.myshopify.com',
          email: 'fitness@gear.com', 
          plan: 'enterprise',
          status: 'active',
          createdAt: '2023-11-05',
          lastLogin: '2025-01-17',
          revenue: 5670
        }
      ];

      const mockStats: AdminStats = {
        totalUsers: mockUsers.length,
        activeSubscriptions: mockUsers.filter(u => u.status === 'active').length,
        monthlyRevenue: mockUsers.reduce((sum, u) => sum + u.revenue, 0),
        activeTrials: mockUsers.filter(u => u.plan === 'trial').length,
        conversionRate: 73.5,
        churnRate: 2.1
      };

      setUsers(mockUsers);
      setStats(mockStats);
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Admin data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
      navigate('/shopify/login');
    }
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      trial: 'bg-yellow-100 text-yellow-800',
      starter: 'bg-blue-100 text-blue-800',
      pro: 'bg-green-100 text-green-800', 
      enterprise: 'bg-purple-100 text-purple-800'
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have admin privileges to access this page.</p>
          <button
            onClick={() => navigate('/shopify/dashboard')}
            className="btn-premium btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="premium-loader w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Navigation Toggle */}
      <button
        onClick={toggleMobileMenu}
        className="mobile-nav-toggle md:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay active" onClick={closeMobileMenu} />
      )}

      <div className="app-container">
        <div className="main-content">
          
          {/* Admin Sidebar */}
          <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center mb-8">
                <Shield className="w-8 h-8 text-primary-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">B3ACON Admin</h1>
              </div>

              {/* Admin User Info */}
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <Crown className="w-6 h-6 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-purple-900">Admin User</p>
                    <p className="text-sm text-purple-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {adminNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedView(item.id);
                      closeMobileMenu();
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedView === item.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="mt-auto pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="content-area">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, subscriptions, and system settings</p>
            </div>

            {/* Overview Stats */}
            {selectedView === 'overview' && stats && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center">
                      <Calendar className="w-8 h-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Trials</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeTrials}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h3>
                    <div className="flex items-center">
                      <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                      <span className="text-2xl font-bold text-green-600">{stats.conversionRate}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Trial to paid conversion rate</p>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Rate</h3>
                    <div className="flex items-center">
                      <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                      <span className="text-2xl font-bold text-red-600">{stats.churnRate}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Monthly customer churn rate</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Management */}
            {selectedView === 'users' && (
              <div className="glass-card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                  <p className="text-gray-600">Manage user accounts and subscriptions</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Shop
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.shopUrl}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(user.plan)}`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${user.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics View */}
            {selectedView === 'analytics' && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
                <p className="text-gray-600">Detailed analytics and reporting coming soon...</p>
              </div>
            )}

            {/* Settings View */}
            {selectedView === 'settings' && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
                <p className="text-gray-600">Admin settings and configuration options coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyAdmin;