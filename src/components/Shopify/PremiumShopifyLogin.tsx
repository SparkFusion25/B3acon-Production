import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import '../../styles/premium-design-system.css';

const PremiumShopifyLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useShopifyAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Demo user accounts
  const demoUsers = [
    {
      email: 'admin@b3acon.com',
      password: 'B3acon_Admin_2025!',
      shopUrl: 'b3acon-admin.myshopify.com',
      plan: 'enterprise',
      role: 'admin'
    },
    {
      email: 'pro@shopify.com', 
      password: 'ProUser2025',
      shopUrl: 'pro-store.myshopify.com',
      plan: 'pro',
      role: 'user'
    },
    {
      email: 'trial@shopify.com',
      password: 'TrialUser2025', 
      shopUrl: 'trial-store.myshopify.com',
      plan: 'trial',
      role: 'user'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Find user in demo accounts
      const user = demoUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Track successful login
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'login', {
          method: 'email',
          plan: user.plan,
          user_role: user.role
        });
      }

      // Login user with subscription data
      const subscription = {
        id: `sub_${user.email.split('@')[0]}`,
        userId: `user_${user.email.split('@')[0]}`,
        plan: user.plan,
        status: 'active',
        email: user.email,
        shopUrl: user.shopUrl,
        trialEndsAt: user.plan === 'trial' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null,
        createdAt: new Date().toISOString()
      };

      await login(user.shopUrl, user.plan, subscription);

      // Redirect based on user role
      if (user.role === 'admin' || user.email === 'admin@b3acon.com') {
        navigate('/shopify/admin');
      } else {
        const isNewSignup = new URLSearchParams(window.location.search).get('signup') === 'true';
        const redirectUrl = isNewSignup 
          ? '/shopify/dashboard?welcome=true' 
          : '/shopify/dashboard';
        navigate(redirectUrl);
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'pro' | 'trial') => {
    const user = demoUsers.find(u => 
      userType === 'admin' ? u.role === 'admin' : u.plan === userType
    );
    
    if (user) {
      setFormData({
        email: user.email,
        password: user.password
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Centered Login Container */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to your B3ACON dashboard</p>
          </div>

          {/* Login Form Card */}
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-premium pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="input-premium pl-10"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-premium btn-primary btn-large w-full"
              >
                {isLoading ? (
                  <>
                    <div className="premium-loader w-5 h-5 mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Demo Account Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Quick Demo Access:</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="w-full text-left px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                >
                  <span className="font-medium text-purple-900">Admin Account</span>
                  <br />
                  <span className="text-purple-600">admin@b3acon.com</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('pro')}
                  className="w-full text-left px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <span className="font-medium text-blue-900">Pro User</span>
                  <br />
                  <span className="text-blue-600">pro@shopify.com</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('trial')}
                  className="w-full text-left px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  <span className="font-medium text-green-900">Trial User</span>
                  <br />
                  <span className="text-green-600">trial@shopify.com</span>
                </button>
              </div>
            </div>

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-2">
              <a 
                href="/shopify" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                ← Back to Landing Page
              </a>
              <div className="text-gray-500 text-xs">
                Don't have an account? <a href="/shopify/install?plan=trial" className="text-primary-600 hover:text-primary-700">Start Free Trial</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumShopifyLogin;