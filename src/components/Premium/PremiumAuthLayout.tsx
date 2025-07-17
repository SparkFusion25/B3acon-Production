import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  CheckCircle,
  Shield,
  Star,
  TrendingUp,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/premium-b3acon-design-system.css';
import '../../styles/auth-layout.css';

// Demo Login Component
const DemoLoginButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      
      // Auto-fill demo credentials
      const demoCredentials = {
        email: 'demo@b3acon.com',
        password: 'demo123456'
      };
      
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would create the demo account if it doesn't exist
      // and handle the authentication with your backend
      
      // For now, redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Demo login failed:', error);
      alert('Demo login temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-gray-400">Or</span>
        </div>
      </div>
      
      <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="mt-4 w-full bg-white/10 text-white py-3 px-4 rounded-xl font-medium hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-all border border-white/20 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Setting up demo...</span>
          </div>
        ) : (
          <span>🚀 Try Demo Account (Full Access)</span>
        )}
      </button>
      
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">
          Demo account includes sample data and full feature access
        </p>
      </div>
    </div>
  );
};

interface FeatureHighlightProps {
  icon: string;
  title: string;
  description: string;
}

interface CompanyLogoProps {
  name: string;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 animate-fade-in">
    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const CompanyLogo: React.FC<CompanyLogoProps> = ({ name }) => (
  <div className="h-8 px-4 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium">
    {name.toUpperCase()}
  </div>
);

interface PremiumInputProps {
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  success?: boolean;
}

const PremiumInput: React.FC<PremiumInputProps> = ({ 
  label, 
  type, 
  placeholder, 
  icon, 
  value, 
  onChange, 
  error, 
  success 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="text-gray-400">{icon}</div>
        </div>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10 pr-${type === 'password' ? '10' : '4'}
            ${error ? 'border-red-500' : success ? 'border-emerald-500' : ''}
          `}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300" />
            )}
          </button>
        )}
        {(error || success) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {error ? (
              <div className="w-5 h-5 text-red-500">❌</div>
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

interface PremiumButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  children, 
  type = 'button',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  onClick
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        btn-premium btn-${variant} btn-${size} ${className}
        ${loading ? 'opacity-75' : ''}
      `}
    >
      {loading && (
        <div className="spinner-premium w-4 h-4 mr-2"></div>
      )}
      {children}
    </button>
  );
};

interface PremiumAuthLayoutProps {
  children: React.ReactNode;
  type?: 'login' | 'signup';
}

const PremiumAuthLayout: React.FC<PremiumAuthLayoutProps> = ({ children, type = 'login' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* CENTERED CONTAINER */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT SIDE - Branding (EQUAL WIDTH) */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="max-w-lg mx-auto lg:mx-0">
                          {/* Logo */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">⚡</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">B3ACON</h1>
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
            
                {/* Value Proposition */}
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                  The Complete Business Intelligence Platform
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Unify your CRM, marketing automation, SEO tools, and business analytics 
                  in one powerful platform trusted by <span className="text-emerald-400 font-semibold">10,000+</span> businesses.
                </p>
                
                {/* Feature Highlights */}
                <div className="space-y-4">
                  <FeatureHighlight 
                    icon="🚀" 
                    title="247% Average Revenue Growth"
                    description="Our clients see massive growth within 90 days"
                  />
                  <FeatureHighlight 
                    icon="⚡" 
                    title="All-in-One Platform"
                    description="Replace 15+ tools with one unified solution"
                  />
                  <FeatureHighlight 
                    icon="🔒" 
                    title="Enterprise Security"
                    description="Bank-grade security with SOC 2 compliance"
                  />
                </div>
            
            {/* Stats */}
            <div className={`mt-12 grid grid-cols-3 gap-6 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">10,000+</div>
                <div className="text-gray-400 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">247%</div>
                <div className="text-gray-400 text-sm">Avg Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>
        
            {/* RIGHT SIDE - Auth Form (EQUAL WIDTH) */}
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md">
                {/* Glass Card with CONSISTENT SIZING */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
                  {children}
                </div>
            
                {/* Social Proof */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm mb-3">Trusted by industry leaders</p>
                  <div className="flex justify-center space-x-4 opacity-60">
                    <div className="text-white text-xs font-medium px-3 py-1 bg-white/10 rounded">TechStars</div>
                    <div className="text-white text-xs font-medium px-3 py-1 bg-white/10 rounded">Y Combinator</div>
                    <div className="text-white text-xs font-medium px-3 py-1 bg-white/10 rounded">Forbes</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

// Premium Login Form Component
export const PremiumLoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: {email?: string; password?: string} = {};
    if (!credentials.email) newErrors.email = 'Email is required';
    if (!credentials.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PremiumAuthLayout type="login">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-300">Sign in to your B3ACON dashboard</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <PremiumInput 
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="w-5 h-5" />}
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          error={errors.email}
        />
        
        <PremiumInput 
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<Lock className="w-5 h-5" />}
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          error={errors.password}
        />
        
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="sr-only" />
            <div className="relative">
              <div className="w-4 h-4 bg-white/20 border border-white/40 rounded"></div>
              <CheckCircle className="w-3 h-3 text-white absolute inset-0.5 opacity-0" />
            </div>
            <span className="ml-2 text-sm text-gray-300">Remember me</span>
          </label>
          
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Forgot password?
          </Link>
        </div>
        
        <PremiumButton 
          type="submit" 
          loading={loading}
          className="w-full"
          variant="primary"
          size="large"
        >
          <span>Sign In to Dashboard</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </PremiumButton>
        
        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Start free trial
            </Link>
          </p>
        </div>
      </form>
      
      {/* Demo Login Button */}
      <DemoLoginButton />
    </PremiumAuthLayout>
  );
};

// Premium Signup Form Component
export const PremiumSignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({ email: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PremiumAuthLayout type="signup">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Join B3ACON</h2>
        <p className="text-gray-300">Start your 14-day free trial today</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <PremiumInput 
            label="First Name"
            type="text"
            placeholder="John"
            icon={<User className="w-5 h-5" />}
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            error={errors.firstName}
          />
          <PremiumInput 
            label="Last Name"
            type="text"
            placeholder="Doe"
            icon={<User className="w-5 h-5" />}
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            error={errors.lastName}
          />
        </div>
        
        <PremiumInput 
          label="Email Address"
          type="email"
          placeholder="john@company.com"
          icon={<Mail className="w-5 h-5" />}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          error={errors.email}
        />
        
        <PremiumInput 
          label="Company (Optional)"
          type="text"
          placeholder="Your company name"
          icon={<TrendingUp className="w-5 h-5" />}
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
        />
        
        <PremiumInput 
          label="Password"
          type="password"
          placeholder="Create a strong password"
          icon={<Lock className="w-5 h-5" />}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          error={errors.password}
        />
        
        <PremiumInput 
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={<Shield className="w-5 h-5" />}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          error={errors.confirmPassword}
        />
        
        <PremiumButton 
          type="submit" 
          loading={loading}
          className="w-full"
          variant="primary"
          size="large"
        >
          <span>Start Free Trial</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </PremiumButton>
        
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </PremiumAuthLayout>
  );
};

export default PremiumAuthLayout;