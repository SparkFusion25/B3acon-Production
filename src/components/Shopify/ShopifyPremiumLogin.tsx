import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  TrendingUp, 
  Search, 
  BarChart3, 
  Target, 
  Zap,
  Crown,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Store,
  Users,
  Globe
} from 'lucide-react';
import { useShopifyAuth, ShopifyAuthProvider } from '../../contexts/ShopifyAuthContext';
import '../../styles/premium-design-system.css';

const ShopifyLoginContent: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useShopifyAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Shopify-specific demo accounts
  const shopifyDemoUsers = [
    {
      label: 'Shopify Admin',
      email: 'admin@b3acon.com',
      password: 'B3acon_Admin_2025!',
      shopUrl: 'b3acon-admin.myshopify.com',
      plan: 'enterprise',
      role: 'admin',
      badge: 'Enterprise',
      color: 'from-purple-600 to-pink-600'
    },
    {
      label: 'Pro Store Owner',
      email: 'pro@shopify.com',
      password: 'ProUser2025',
      shopUrl: 'pro-store.myshopify.com',
      plan: 'pro',
      role: 'user',
      badge: 'Pro Plan',
      color: 'from-blue-600 to-purple-600'
    },
    {
      label: 'Trial Store',
      email: 'trial@shopify.com',
      password: 'TrialUser2025',
      shopUrl: 'trial-store.myshopify.com',
      plan: 'trial',
      role: 'user',
      badge: '14-Day Trial',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Find matching demo user
      const user = shopifyDemoUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        setError('Invalid credentials. Please use demo accounts or try again.');
        return;
      }

      // Track login event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'shopify_login', {
          method: 'email',
          user_plan: user.plan,
          shop_url: user.shopUrl
        });
      }

      // Create subscription object
      const subscription = {
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
        navigate('/shopify/dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (user: typeof shopifyDemoUsers[0]) => {
    setFormData({
      email: user.email,
      password: user.password
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features & Benefits */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center p-12">
          <div className="max-w-lg mx-auto">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">B3ACON</h1>
                <p className="text-purple-200 text-sm">for Shopify</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Supercharge Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Shopify Store</span>
            </h2>

            <p className="text-gray-300 text-xl mb-12 leading-relaxed">
              Advanced SEO, analytics, and growth tools designed specifically for Shopify merchants. 
              Boost rankings, increase conversions, and scale your business.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Advanced SEO Tools</h3>
                  <p className="text-gray-400">Keyword research, competitor analysis, technical audits, and rank tracking for Shopify stores.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Revenue Analytics</h3>
                  <p className="text-gray-400">Deep insights into traffic, conversions, customer behavior, and product performance.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Growth Automation</h3>
                  <p className="text-gray-400">Automated email campaigns, abandoned cart recovery, and intelligent product recommendations.</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">15,000+</div>
                  <div className="text-sm text-gray-400">Shopify Stores</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">247%</div>
                  <div className="text-sm text-gray-400">Avg Revenue Growth</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">4.9/5</div>
                  <div className="text-sm text-gray-400">Store Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">B3ACON</h1>
                <p className="text-purple-200 text-sm">for Shopify</p>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-300">Sign in to your Shopify dashboard</p>
              </div>

              {/* Demo Account Buttons */}
              <div className="space-y-3 mb-8">
                <p className="text-sm text-gray-300 text-center mb-4">Quick Demo Login:</p>
                {shopifyDemoUsers.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemoCredentials(user)}
                    className={`w-full p-3 rounded-xl bg-gradient-to-r ${user.color} text-white font-medium hover:scale-105 transition-all duration-200 flex items-center justify-between group`}
                  >
                    <div className="flex items-center space-x-3">
                      <Store className="w-5 h-5" />
                      <span>{user.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{user.badge}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Or sign in manually</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center space-x-2">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have a Shopify store?{' '}
                  <button
                    onClick={() => navigate('/shopify/install?plan=trial')}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Start Free Trial
                  </button>
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with auth provider wrapper
const ShopifyPremiumLogin: React.FC = () => {
  return (
    <ShopifyAuthProvider>
      <ShopifyLoginContent />
    </ShopifyAuthProvider>
  );
};

export default ShopifyPremiumLogin;