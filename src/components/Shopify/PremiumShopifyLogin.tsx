import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Lock,
  User,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import '../../styles/premium-design-system.css';

interface LoginCredentials {
  email: string;
  password: string;
}

const PremiumShopifyLogin = () => {
  const navigate = useNavigate();
  const { login } = useShopifyAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAnimated, setIsAnimated] = useState(false);

  // Demo users with different plan access levels
  const demoUsers = [
    {
      email: 'admin@b3acon.com',
      password: 'B3acon_Admin_2025!',
      plan: 'enterprise',
      shopUrl: 'admin-store.myshopify.com',
      name: 'Admin User'
    },
    {
      email: 'trial@demo.com',
      password: 'Trial123!',
      plan: 'trial',
      shopUrl: 'trial-store.myshopify.com',
      name: 'Trial User'
    },
    {
      email: 'pro@demo.com',
      password: 'Pro123!',
      plan: 'pro',
      shopUrl: 'pro-store.myshopify.com',
      name: 'Pro User'
    }
  ];

  React.useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check credentials against demo users
    const user = demoUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      // Track login event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'login', {
          method: 'email',
          user_plan: user.plan
        });
      }

      // Login user with their plan
      login(user.shopUrl, user.plan);
      
      // Navigate to appropriate dashboard
      if (user.email === 'admin@b3acon.com') {
        navigate('/shopify/admin');
      } else {
        navigate('/shopify/dashboard');
      }
    } else {
      setLoginError('Invalid email or password. Please try the demo credentials.');
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (loginError) setLoginError('');
  };

  const fillDemoCredentials = (userType: string) => {
    const user = demoUsers.find(u => u.email.startsWith(userType));
    if (user) {
      setCredentials({
        email: user.email,
        password: user.password
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Login Container */}
      <div className={`w-full max-w-md transition-all duration-1000 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-gradient-primary">B3ACON</span>
          </h1>
          <p className="text-indigo-200">Sign in to your Shopify optimization dashboard</p>
        </div>

        {/* Login Form */}
        <div className="glass-card-dark p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-premium w-full pl-12"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="input-premium w-full pl-12 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{loginError}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium btn-primary btn-large w-full group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-400" />
            Demo Accounts
          </h3>
          <div className="space-y-3">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => fillDemoCredentials(user.email.split('@')[0])}
                className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="text-xs text-indigo-300">{user.email}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    user.plan === 'enterprise' 
                      ? 'bg-purple-500/20 text-purple-300'
                      : user.plan === 'pro'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {user.plan}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">What's Inside</h3>
          <div className="space-y-3">
            {[
              'Advanced SEO Analytics & Optimization',
              'AI-Powered Product Recommendations',
              'Real-Time Performance Monitoring',
              'Automated Marketing Campaigns'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-indigo-200 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumShopifyLogin;