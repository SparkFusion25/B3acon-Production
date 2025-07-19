import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3, 
  Search, 
  MousePointer, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Play,
  Users,
  Crown,
  Eye,
  Lock
} from 'lucide-react';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import '../../styles/premium-design-system.css';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  features: string[];
  requiredPlan: 'trial' | 'starter' | 'pro' | 'enterprise';
}

const PremiumShopifyAppLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useShopifyAuth();
  const [shopUrl, setShopUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeService, setActiveService] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/shopify/dashboard');
    }
  }, [user, navigate]);

  const keyServices: Service[] = [
    {
      id: 'seo-optimization',
      title: 'AI-Powered SEO Tools',
      description: 'Boost your store rankings with intelligent keyword research, competitor analysis, and automated optimization.',
      icon: Search,
      gradient: 'from-emerald-500 to-teal-500',
      features: ['Keyword Research', 'Competitor Analysis', 'Technical SEO Audit', 'Rank Tracking'],
      requiredPlan: 'starter'
    },
    {
      id: 'conversion-analytics',
      title: 'Advanced Analytics Suite',
      description: 'Deep insights into customer behavior, conversion funnels, and revenue optimization strategies.',
      icon: BarChart3,
      gradient: 'from-blue-500 to-indigo-500',
      features: ['Revenue Analytics', 'Customer Insights', 'Conversion Tracking', 'Performance Reports'],
      requiredPlan: 'pro'
    },
    {
      id: 'marketing-automation',
      title: 'Smart Marketing Automation',
      description: 'Automated email campaigns, abandoned cart recovery, and personalized customer journeys.',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      features: ['Email Campaigns', 'Cart Recovery', 'Customer Segmentation', 'A/B Testing'],
      requiredPlan: 'pro'
    },
    {
      id: 'popup-builder',
      title: 'High-Converting Popups',
      description: 'Create beautiful, mobile-optimized popups that convert visitors into customers.',
      icon: MousePointer,
      gradient: 'from-orange-500 to-red-500',
      features: ['Drag & Drop Builder', 'Smart Triggers', 'A/B Testing', 'Mobile Optimized'],
      requiredPlan: 'trial'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      store: "Fashion Forward",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      rating: 5,
      text: "B3ACON transformed our Shopify store. Revenue increased 340% in just 3 months!"
    },
    {
      name: "Mike Chen",
      store: "Tech Gadgets Pro", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
      text: "The SEO tools alone paid for the subscription. We're ranking #1 for our target keywords."
    },
    {
      name: "Emma Rodriguez",
      store: "Wellness Essentials",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", 
      rating: 5,
      text: "Amazing automation features. Our abandoned cart recovery rate went from 12% to 67%."
    }
  ];

  const handleShopifyConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopUrl.trim()) {
      setError('Please enter your Shopify store URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate Shopify OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = await login(shopUrl, 'demo_password');
      if (success) {
        navigate('/shopify/dashboard');
      } else {
        setError('Unable to connect to your Shopify store. Please check the URL and try again.');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoStores = [
    'fashion-store.myshopify.com',
    'tech-gadgets.myshopify.com', 
    'wellness-shop.myshopify.com'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-primary">B3ACON</h1>
                <p className="text-xs text-gray-600">Shopify Growth Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/shopify/plans" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Pricing
              </Link>
              <Link to="/shopify/demo" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Live Demo
              </Link>
              <Link to="/support" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">Trusted by 50,000+ Shopify stores</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Grow Your 
                <span className="text-gradient-primary block">Shopify Store</span>
                <span className="text-2xl lg:text-3xl text-gray-600 block mt-2">with AI-Powered Tools</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Increase revenue by up to <strong className="text-emerald-600">340%</strong> with our comprehensive suite of SEO, analytics, and marketing automation tools designed specifically for Shopify.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: TrendingUp, text: '340% Avg Revenue Increase' },
                  { icon: Target, text: '94/100 SEO Score Average' },
                  { icon: Users, text: '50,000+ Happy Merchants' },
                  { icon: Shield, text: '99.9% Uptime Guarantee' }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
                    <benefit.icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => document.getElementById('connect-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-premium btn-primary btn-large group"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="btn-premium btn-outline btn-large group">
                  <Play className="w-4 h-4" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <p className="text-sm text-gray-500">
                ✅ 14-day free trial • ✅ No credit card required • ✅ Full access to all features
              </p>
            </div>

            {/* Right Column - Connect Form */}
            <div className="lg:pl-8">
              <div className="glass-card p-8 max-w-md mx-auto lg:mx-0" id="connect-form">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Store</h2>
                  <p className="text-gray-600">Enter your Shopify store URL to get started</p>
                </div>

                <form onSubmit={handleShopifyConnect} className="space-y-6">
                  <div>
                    <label htmlFor="shopUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      Shopify Store URL
                    </label>
                    <div className="relative">
                      <input
                        id="shopUrl"
                        type="text"
                        value={shopUrl}
                        onChange={(e) => setShopUrl(e.target.value)}
                        placeholder="your-store.myshopify.com"
                        className="input-premium w-full pr-12"
                        disabled={isLoading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-premium btn-primary w-full btn-large"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Connect Store</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">Try with demo store:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {demoStores.map((store) => (
                        <button
                          key={store}
                          type="button"
                          onClick={() => setShopUrl(store)}
                          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                        >
                          {store}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Secure OAuth connection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-gradient-primary">Scale Your Store</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform gives you all the tools successful Shopify merchants use to grow their business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyServices.map((service, index) => (
              <div
                key={service.id}
                className={`group glass-card p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  activeService === service.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.requiredPlan === 'trial' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : service.requiredPlan === 'starter'
                          ? 'bg-blue-100 text-blue-700'
                          : service.requiredPlan === 'pro'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {service.requiredPlan === 'trial' ? 'Free Trial' : `${service.requiredPlan.charAt(0).toUpperCase() + service.requiredPlan.slice(1)} Plan`}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors group">
                        Learn More 
                        <ArrowRight className="w-4 h-4 inline ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Join <span className="text-gradient-primary">50,000+</span> Successful Merchants
            </h2>
            <p className="text-xl text-gray-600">See what our customers are saying about their growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.store}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Scale Your Shopify Store?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of merchants who've transformed their business with B3ACON. 
            Start your free trial today and see results in the first week.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('connect-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-premium bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all group"
            >
              <span>Start Free Trial Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <Link 
              to="/shopify/plans" 
              className="btn-premium btn-outline border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all"
            >
              View Pricing Plans
            </Link>
          </div>
          
          <p className="text-white/80 text-sm mt-6">
            ✅ 14-day free trial • ✅ No setup fees • ✅ Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">B3ACON</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2025 B3ACON. All rights reserved. Made with ❤️ for Shopify merchants.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumShopifyAppLogin;