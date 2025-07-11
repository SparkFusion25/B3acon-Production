import React, { useState } from 'react';
import { Zap, Mail, Lock, Users, Building, Github, Facebook } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'agency' | 'client'>('agency');
  const [isLoading, setIsLoading] = useState(false);
  const [showSocialLogin, setShowSocialLogin] = useState(false);
  const { login, loginWithSocial } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, loginType);
    } catch (error) {
      console.error('Login failed:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-jet-black via-slate-gray to-jet-black flex items-center justify-center p-4">
      <Link to="/" className="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors">
        ← Back to Home
      </Link>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">B3ACON</h1>
              <p className="text-gray-300 text-sm">Digital Marketing Command Center</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setLoginType('agency')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                loginType === 'agency'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white hover:bg-signal-blue/20'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">Agency</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('client')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                loginType === 'client'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white hover:bg-signal-blue/20'
              }`}
            >
              <Building className="w-4 h-4" />
              <span className="font-medium">Client</span>
            </button>
          </div>
        </div>

        <div className="mb-4 text-center">
          <button
            type="button"
            onClick={() => setShowSocialLogin(!showSocialLogin)}
            className="text-gray-300 text-sm hover:text-white transition-colors"
          >
            {showSocialLogin ? 'Use email instead' : 'Or sign in with social accounts'}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {loginType === 'agency' ? 'Agency Login' : 'Client Portal'}
          </h2>

          {showSocialLogin ? (
            <div className="space-y-4">
              <button
                type="button"
                className="w-full py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
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
                className="w-full py-3 bg-[#1877F2] text-white font-medium rounded-lg hover:bg-[#166FE5] transition-all flex items-center justify-center space-x-2"
                disabled={isLoading}
                onClick={() => handleSocialLogin('facebook')}
              >
                <Facebook className="w-5 h-5" />
                <span>Continue with Facebook</span>
              </button>

              <button
                type="button"
                className="w-full py-3 bg-[#24292e] text-white font-medium rounded-lg hover:bg-[#1b1f23] transition-all flex items-center justify-center space-x-2"
                disabled={isLoading}
                onClick={() => handleSocialLogin('github')}
              >
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder={loginType === 'agency' ? 'sarah@sparkdigital.com' : 'john@techcorp.com'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-300 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p className="cursor-pointer hover:text-white transition-colors" onClick={() => {
                setEmail('sarah@sparkdigital.com');
                setPassword('password');
                setLoginType('agency');
              }}><strong>Agency:</strong> sarah@sparkdigital.com / password</p>
              <p className="cursor-pointer hover:text-white transition-colors" onClick={() => {
                setEmail('john@techcorp.com');
                setPassword('password');
                setLoginType('client');
              }}><strong>Client:</strong> john@techcorp.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
