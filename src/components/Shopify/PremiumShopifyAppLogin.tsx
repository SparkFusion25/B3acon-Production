import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BarChart3, 
  Zap, 
  MousePointer, 
  ArrowRight, 
  Play, 
  Shield, 
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  Sparkles,
  Globe,
  Crown,
  Target
} from 'lucide-react';
import { useShopifyAuth, ShopifyAuthProvider } from '../../contexts/ShopifyAuthContext';
import '../../styles/premium-design-system.css';

const PremiumShopifyAppLoginContent: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useShopifyAuth();
  const [shopUrl, setShopUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Demo user accounts for quick access
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

  const handleShopifyConnect = async () => {
    if (!shopUrl.trim()) {
      setError('Please enter your Shopify store URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate OAuth connection - use demo user for now
      const demoUser = demoUsers[1]; // Use pro user as default
      
      await login({
        id: 'demo-shopify-user',
        userId: demoUser.shopUrl,
        shopUrl: demoUser.shopUrl,
        email: demoUser.email,
        plan: demoUser.plan as 'trial' | 'starter' | 'pro' | 'enterprise',
        features: []
      });

      navigate('/shopify/dashboard');
    } catch (err) {
      setError('Failed to connect to Shopify. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userIndex: number) => {
    const demoUser = demoUsers[userIndex];
    setIsLoading(true);
    
    try {
      await login({
        id: `demo-user-${userIndex}`,
        userId: demoUser.shopUrl,
        shopUrl: demoUser.shopUrl,
        email: demoUser.email,
        plan: demoUser.plan as 'trial' | 'starter' | 'pro' | 'enterprise',
        features: []
      });
      
      navigate('/shopify/dashboard');
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('connect-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const keyServices = [
    {
      icon: Search,
      title: "AI-Powered SEO Tools",
      description: "Boost rankings, increase conversions, and scale your business.",
      gradient: "from-emerald-400 to-teal-500",
      features: ["AI Content Generation", "Keyword Research", "Technical SEO Audits"],
      plan: "STARTER+"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Suite",
      description: "Deep insights into traffic, conversions, customer behavior, and product performance.",
      gradient: "from-blue-400 to-indigo-500",
      features: ["Real-time Dashboards", "Custom Reports", "Predictive Analytics"],
      plan: "PRO+"
    },
    {
      icon: Zap,
      title: "Smart Marketing Automation",
      description: "Automated email campaigns, abandoned cart recovery, and customer segmentation.",
      gradient: "from-purple-400 to-pink-500",
      features: ["Email Automation", "Cart Recovery", "Customer Journeys"],
      plan: "PRO+"
    },
    {
      icon: MousePointer,
      title: "High-Converting Popups",
      description: "AI-generated popups that capture emails and boost conversions by 25%.",
      gradient: "from-orange-400 to-red-500",
      features: ["AI Character Popups", "Exit Intent", "A/B Testing"],
      plan: "TRIAL+"
    }
  ];

  const benefits = [
    { icon: TrendingUp, text: "340% Avg Revenue Increase", subtext: "Based on 10K+ stores" },
    { icon: Users, text: "50,000+ Stores Trust Us", subtext: "Growing every day" },
    { icon: Shield, text: "99.9% Uptime Guarantee", subtext: "Enterprise-grade reliability" },
    { icon: CheckCircle, text: "14-Day Free Trial", subtext: "No credit card required" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      store: "Chen's Electronics",
      text: "B3ACON increased our sales by 280% in just 3 months. The AI tools are incredible!",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      store: "Rodriguez Fashion Co.",
      text: "The SEO tools helped us rank #1 for our main keywords. Revenue went through the roof!",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Johnson",
      store: "Johnson Home Goods",
      text: "Best investment we've made. The popups alone generated $50K in new sales.",
      rating: 5,
      avatar: "EJ"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                B3ACON
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-gray-600 hover:text-indigo-600 transition-colors">Services</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#demo" className="text-gray-600 hover:text-indigo-600 transition-colors">Demo</a>
              <button className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                Sign In
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/60 backdrop-blur-sm border border-indigo-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
              <span className="text-sm font-medium text-indigo-700">Trusted by 50,000+ Shopify stores</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Grow Your Shopify Store with{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Tools
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Boost your revenue with advanced SEO, smart analytics, automated marketing, and 
              high-converting AI popups. Join thousands of successful store owners.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={scrollToForm}
                className="group flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-semibold text-lg">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-1 text-emerald-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">14-day free trial</span>
                <span className="text-gray-400">•</span>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">No credit card required</span>
              </div>
              <p className="text-sm text-gray-500">
                <Shield className="w-4 h-4 inline mr-1" />
                Secure OAuth connection • 99.9% uptime guarantee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.text}</h3>
              <p className="text-sm text-gray-600">{benefit.subtext}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Services Section */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Scale Your Store
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps you optimize every aspect of your Shopify business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {keyServices.map((service, index) => (
            <div 
              key={index} 
              className="group relative bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold rounded-full">
                      {service.plan}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white/40 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Store Owners Worldwide
            </h2>
            <p className="text-xl text-gray-600">See how B3ACON is transforming Shopify businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.store}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connect Your Store Form */}
      <div id="connect-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Store?</h2>
            <p className="text-xl mb-8 opacity-90">
              Connect your Shopify store in 30 seconds and start your free trial
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="your-store.myshopify.com"
                    value={shopUrl}
                    onChange={(e) => setShopUrl(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/30 transition-all duration-300 text-lg"
                  />
                </div>
                
                {error && (
                  <div className="flex items-center text-red-200 text-sm">
                    <Target className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleShopifyConnect}
                  disabled={isLoading}
                  className="w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    <>Connect Your Store</>
                  )}
                </button>

                <div className="text-center text-white/80 text-sm">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Secure OAuth connection • No passwords stored
                </div>
              </div>

              {/* Quick Demo Access */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-white/80 text-sm mb-4">Quick demo access:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleDemoLogin(0)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm hover:bg-white/30 transition-all duration-300"
                  >
                    Admin Demo
                  </button>
                  <button
                    onClick={() => handleDemoLogin(1)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm hover:bg-white/30 transition-all duration-300"
                  >
                    Pro Demo
                  </button>
                  <button
                    onClick={() => handleDemoLogin(2)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm hover:bg-white/30 transition-all duration-300"
                  >
                    Trial Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">B3ACON</span>
            </div>
            <p className="text-gray-400 mb-6">
              The ultimate digital marketing platform for Shopify stores
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-500">
              © 2025 B3ACON. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PremiumShopifyAppLogin: React.FC = () => {
  return (
    <ShopifyAuthProvider>
      <PremiumShopifyAppLoginContent />
    </ShopifyAuthProvider>
  );
};

export default PremiumShopifyAppLogin;