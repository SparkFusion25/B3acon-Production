import React, { useState } from 'react';
import { 
  ShoppingBag,
  Store,
  Zap,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Globe,
  CheckCircle,
  Star
} from 'lucide-react';
import '../../styles/premium-design-system.css';

interface LoginFormData {
  storeUrl: string;
  email: string;
  password: string;
}

const ShopifyLogin = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    storeUrl: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.storeUrl.trim()) {
      newErrors.storeUrl = 'Store URL is required';
    } else if (!formData.storeUrl.includes('.myshopify.com') && !formData.storeUrl.includes('shopify.com')) {
      newErrors.storeUrl = 'Please enter a valid Shopify store URL';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard on successful login
      window.location.href = '/shopify/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatStoreUrl = (url: string) => {
    // Auto-format store URL
    let formatted = url.toLowerCase().trim();
    if (formatted && !formatted.includes('.myshopify.com')) {
      formatted = formatted.replace(/^https?:\/\//, '').replace(/\/$/, '');
      if (!formatted.includes('.')) {
        formatted = `${formatted}.myshopify.com`;
      }
    }
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">B3ACON</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connect Your Shopify Store</h1>
          <p className="text-indigo-200">Access your B3ACON dashboard and start optimizing your store</p>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <div className="flex items-center space-x-2 text-indigo-200">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Secure</span>
          </div>
          <div className="flex items-center space-x-2 text-indigo-200">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Trusted by 50k+ stores</span>
          </div>
          <div className="flex items-center space-x-2 text-indigo-200">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span className="text-sm">4.9/5 Rating</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 backdrop-blur-xl bg-white/10 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store URL Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Store className="w-4 h-4 inline mr-2" />
                Shopify Store URL
              </label>
              <input
                type="text"
                value={formData.storeUrl}
                onChange={(e) => handleInputChange('storeUrl', formatStoreUrl(e.target.value))}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${
                  errors.storeUrl ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="yourstore.myshopify.com"
              />
              {errors.storeUrl && (
                <p className="mt-1 text-sm text-red-300">{errors.storeUrl}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="store-owner@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all pr-12 ${
                    errors.password ? 'border-red-400' : 'border-white/20'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-200 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-premium btn-primary btn-large bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Access B3ACON Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <div className="text-sm text-indigo-200">
              Don't have an account?{' '}
              <a 
                href="/shopify/install" 
                className="text-white hover:text-indigo-300 font-medium transition-colors"
              >
                Install B3ACON
              </a>
            </div>
            
            <div className="text-xs text-indigo-300">
              <a href="#" className="hover:text-white transition-colors">
                Forgot password?
              </a>
              {' • '}
              <a href="#" className="hover:text-white transition-colors">
                Need help?
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-8 text-center">
          <p className="text-indigo-200 text-sm mb-4">Join thousands of successful Shopify stores</p>
          <div className="flex items-center justify-center space-x-8 text-xs text-indigo-300">
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>Global reach</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Instant setup</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Bank-grade security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyLogin;