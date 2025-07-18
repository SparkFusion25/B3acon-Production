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
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/premium-b3acon-design-system.css';

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
            input-glass pl-10 pr-${type === 'password' ? '10' : '4'} py-3
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
    <div className="min-h-screen bg-gradient-auth relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16">
          <div className="max-w-lg">
            {/* Logo */}
            <div className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">B3ACON</h1>
              </div>
              <div className="w-16 h-1 bg-gradient-primary rounded-full"></div>
            </div>
            
            {/* Value Proposition */}
            <div className={`mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                The Complete Business Intelligence Platform
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Unify your CRM, marketing automation, SEO tools, and business analytics 
                in one powerful platform trusted by <span className="font-semibold text-emerald-400">10,000+</span> businesses.
              </p>
            </div>
            
            {/* Feature Highlights */}
            <div className={`space-y-6 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
        
        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Glass Card */}
            <div className={`card-glass-dark p-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {children}
            </div>
            
            {/* Social Proof */}
            <div className={`mt-8 text-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-gray-400 text-sm mb-4">Trusted by industry leaders</p>
              <div className="flex justify-center space-x-6 opacity-60">
                <CompanyLogo name="techstars" />
                <CompanyLogo name="y combinator" />
                <CompanyLogo name="forbes" />
              </div>
              <div className="flex items-center justify-center space-x-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-400 text-sm">4.9/5 from 2,847 reviews</span>
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
  const { login, loginDemo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
      await login(credentials.email, credentials.password, 'agency');
      // Navigation will be handled by the useEffect when isAuthenticated changes
    } catch (error) {
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginDemo();
      // Navigation will be handled by the useEffect when isAuthenticated changes
    } catch (error) {
      setErrors({ email: 'Demo login failed. Please try again.' });
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
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>
        </div>

        <PremiumButton 
          type="button" 
          onClick={handleDemoLogin}
          loading={loading}
          className="w-full"
          variant="outline"
          size="large"
        >
          <span>🚀 Try Demo Account - Full Access</span>
        </PremiumButton>
        
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Start free trial
            </Link>
          </p>
        </div>
      </form>
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
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await signup(formData.email, formData.password, fullName, formData.company || '', 'agency');
      // Navigation will be handled by the useEffect when isAuthenticated changes
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