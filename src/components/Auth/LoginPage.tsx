import React, { useState } from 'react';
import { Globe, Mail, Lock, Users, Building, Github, Facebook, Truck, FileCheck, Package, BarChart3, Search, UserPlus, Linkedin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginType, setLoginType] = useState<'agency' | 'client'>('agency');
  const [isLoading, setIsLoading] = useState(false);
  const [showSocialLogin, setShowSocialLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const { login, loginWithSocial, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        // Call the signup function
        await signup(email, password, name, company, loginType);
        toast.success('Account created successfully! Redirecting to plan selection...');
        
        // Redirect to plan selection page after a short delay
        setTimeout(() => {
          navigate('/select-plan');
        }, 1500);
      } else {
        await login(email, password, loginType);
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setIsLoading(true);
    try {
      await loginWithSocial(provider, loginType);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Features for the commerce platform
  const platformFeatures = [
    { title: "Global Trade Intelligence", icon: Globe, color: "from-blue-500 to-cyan-500" },
    { title: "Freight & Tariff Tools", icon: Truck, color: "from-green-500 to-teal-500", animate: true },
    { title: "HS Code Lookup + FTA Matching", icon: FileCheck, color: "from-purple-500 to-indigo-500", animate: true },
    { title: "Shipment Tracking", icon: Package, color: "from-amber-500 to-orange-500", animate: true },
    { title: "AI-powered Marketing + CRM", icon: BarChart3, color: "from-red-500 to-pink-500", animate: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-green-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      <Link to="/" className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 transition-colors">
        ← Back to Home
      </Link>

      <div className="flex flex-col md:flex-row max-w-6xl w-full gap-8 z-10">
        {/* Welcome panel with features - now visible on all screens */}
        <div className="hidden md:flex flex-col flex-1 text-gray-800 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-xl">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">B3ACON</h1>
                <p className="text-gray-600 text-sm">Global Commerce Command Center</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mt-8 mb-2 text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                The Global Commerce Command Center
              </span><span className="animate-pulse">|</span>
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              One Command Center. Every Global Trade Advantage.
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            {platformFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-4 transform transition-all hover:scale-105 hover:shadow-lg border border-gray-200 ${feature.animate ? 'animate-pulse-glow' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={() => navigate('/features')}
              className="px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all animate-pulse-glow"
            >
              Explore Our Platform
            </button>
            <button 
              onClick={() => {
                setIsSignUp(true);
                setShowSocialLogin(false);
              }}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-all"
            >
              View Plans
            </button>
            </div>
          </div>
        </div>

        {/* Login form */}
        <div className="max-w-md w-full">
          <div className="text-center mb-8 md:hidden">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">B3ACON</h1>
                <p className="text-gray-600 text-sm">Global Commerce Command Center</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 shadow-md backdrop-blur-sm rounded-xl p-1 mb-4">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setLoginType('agency')}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                  loginType === 'agency'
                    ? 'bg-signal-blue text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">Agency</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginType('client')}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                  loginType === 'client'
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building className="w-4 h-4" />
                <span className="font-medium">Client</span>
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 mb-4 shadow-lg">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                  !isSignUp
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                  isSignUp
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span className="font-medium">Sign Up</span>
              </button>
            </div>
          </div>

          <div className="mb-2 text-center">
            <button
              type="button"
              onClick={() => setShowSocialLogin(!showSocialLogin)}
              className="text-slate-700 text-xs hover:text-slate-900 transition-colors"
            >
              {showSocialLogin ? 'Use email instead' : 'Or sign in with social accounts'}
            </button>
          </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 text-center">
            {isSignUp 
              ? (loginType === 'agency' ? 'Create Agency Account' : 'Create Client Account')
              : (loginType === 'agency' ? 'Agency Login' : 'Client Portal')
            }
          </h2>

          {showSocialLogin ? (
            <div className="space-y-4">
              <button
                type="button"
                className="w-full py-2 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
                disabled={isLoading}
                onClick={() => handleSocialLogin('google')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className="w-full py-2 bg-[#0077B5] text-white font-medium rounded-lg hover:bg-[#006699] transition-all flex items-center justify-center space-x-2"
                disabled={isLoading}
                onClick={() => handleSocialLogin('linkedin')}
              >
                <Linkedin className="w-5 h-5" />
                <span>Continue with LinkedIn</span>
              </button>

              <button
                type="button"
                className="w-full py-2 bg-[#1877F2] text-white font-medium rounded-lg hover:bg-[#166FE5] transition-all flex items-center justify-center space-x-2"
                disabled={isLoading}
                onClick={() => handleSocialLogin('facebook')}
              >
                <Facebook className="w-5 h-5" />
                <span>Continue with Facebook</span>
              </button>

              <button
                type="button"
                className="w-full py-2 bg-[#24292e] text-white font-medium rounded-lg hover:bg-[#1b1f23] transition-all flex items-center justify-center space-x-2"
                disabled={isLoading}
                onClick={() => handleSocialLogin('github')}
              >
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder={loginType === 'agency' ? 'sarah@sparkdigital.com' : 'john@techcorp.com'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-700 mb-1">Demo Credentials:</p>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="cursor-pointer hover:text-slate-900 transition-colors" onClick={() => {
                setEmail('sarah@sparkdigital.com');
                setPassword('password');
                setLoginType('agency');
              }}><strong>Agency:</strong> sarah@sparkdigital.com / password</p>
              <p className="cursor-pointer hover:text-slate-900 transition-colors" onClick={() => {
                setEmail('john@techcorp.com');
                setPassword('password');
                setLoginType('client');
              }}><strong>Client:</strong> john@techcorp.com / password</p>
            </div>
          </div>
          
          {!isSignUp && (
            <div className="mt-3 text-center">
              <a href="#" className="text-xs text-slate-600 hover:text-slate-900 transition-colors">
                Forgot password?
              </a>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <Link to="/agency/login" className="text-xs text-slate-600 hover:text-slate-900 transition-colors">
              Agency Portal Login
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;