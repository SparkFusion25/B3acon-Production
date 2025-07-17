import React, { useState, useEffect } from 'react';
import { 
  Play,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  ShoppingBag,
  BarChart3,
  Target,
  Award,
  Shield,
  Clock
} from 'lucide-react';
import '../../styles/premium-design-system.css';

const PremiumShopifyLanding = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [stats, setStats] = useState({
    stores: 0,
    revenue: 0,
    growth: 0
  });

  useEffect(() => {
    setIsLoaded(true);
    
    // Animate counters
    const animateCounter = (target: number, setter: (value: number) => void, duration: number = 2000) => {
      let start = 0;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setter(Math.floor(start + (target - start) * easeOut));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    setTimeout(() => {
      animateCounter(50000, (value) => setStats(prev => ({ ...prev, stores: value })));
      animateCounter(247, (value) => setStats(prev => ({ ...prev, growth: value })));
      animateCounter(2400000, (value) => setStats(prev => ({ ...prev, revenue: value })));
    }, 500);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "AI-Powered SEO Optimization",
      description: "Automatically optimize your store for search engines with our advanced AI algorithms that analyze and improve your content, meta tags, and structure.",
      benefit: "300% average traffic increase",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Target,
      title: "Smart Conversion Analytics",
      description: "Deep insights into customer behavior with heatmaps, funnel analysis, and conversion optimization recommendations powered by machine learning.",
      benefit: "4.2x higher conversion rates",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Automated Marketing Workflows",
      description: "Set up intelligent email campaigns, abandoned cart recovery, and personalized product recommendations that run on autopilot.",
      benefit: "85% marketing automation",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Revenue Intelligence Dashboard",
      description: "Real-time revenue tracking, profit optimization suggestions, and predictive analytics to maximize your store's financial performance.",
      benefit: "$2.4M+ revenue generated",
      color: "from-orange-500 to-red-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, EcoStyle",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face",
      content: "B3ACON transformed our Shopify store completely. Revenue increased 347% in just 3 months!",
      rating: 5,
      growth: "+347%"
    },
    {
      name: "Michael Rodriguez",
      role: "CEO, TechGear Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      content: "The SEO optimization is incredible. We're now ranking #1 for our main keywords.",
      rating: 5,
      growth: "+580%"
    },
    {
      name: "Emily Johnson",
      role: "Marketing Director, BeautyBrand",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      content: "Best investment we've made. The automated workflows save us 20+ hours per week.",
      rating: 5,
      growth: "+295%"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: 29,
      period: "month",
      description: "Perfect for new stores getting started",
      features: [
        "SEO optimization for 100 products",
        "Basic analytics dashboard",
        "Email support",
        "Core automation features"
      ],
      popular: false,
      trial: 14
    },
    {
      name: "Growth",
      price: 79,
      period: "month",
      description: "For growing stores ready to scale",
      features: [
        "SEO optimization for 1,000 products",
        "Advanced analytics & insights",
        "Priority support",
        "Full automation suite",
        "A/B testing tools",
        "Custom integrations"
      ],
      popular: true,
      trial: 14
    },
    {
      name: "Enterprise",
      price: 199,
      period: "month",
      description: "For large stores and agencies",
      features: [
        "Unlimited SEO optimization",
        "White-label dashboard",
        "Dedicated account manager",
        "Custom development",
        "API access",
        "Multi-store management"
      ],
      popular: false,
      trial: 30
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 font-primary">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-pink-400 to-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">B3ACON</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <button className="btn-premium btn-outline">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-indigo-200 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Award className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 font-semibold">Shopify App Store Editor's Choice</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-gradient-primary">Supercharge Your</span>
              <br />
              <span className="text-gray-900">Shopify Store Growth</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              AI-powered SEO optimization, automated marketing workflows, and advanced analytics that 
              <span className="text-gradient-success font-semibold"> increase revenue by 247% on average</span>
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button 
                className="btn-premium btn-primary btn-large group"
                onClick={() => window.location.href = '/shopify/install'}
              >
                <span className="relative z-10">Start 14-Day Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="btn-premium btn-outline btn-large group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch 2-Min Demo
              </button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">
                  {stats.stores.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Successful Stores</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient-success mb-2">
                  {stats.growth}%
                </div>
                <div className="text-gray-600 font-medium">Average Growth</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">
                  ${(stats.revenue / 1000000).toFixed(1)}M+
                </div>
                <div className="text-gray-600 font-medium">Revenue Generated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative z-10 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-600 mb-8">Trusted by leading Shopify stores worldwide</p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-600 font-medium">4.9/5 from 2,847 reviews</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">Shopify Plus</div>
              <div className="text-sm text-gray-500">Verified Partner</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">SOC 2</div>
              <div className="text-sm text-gray-500">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">GDPR</div>
              <div className="text-sm text-gray-500">Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section id="features" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to <span className="text-gradient-primary">Dominate</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful AI-driven tools designed specifically for Shopify stores to boost rankings, 
              increase conversions, and maximize revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`glass-card p-8 transition-all duration-500 ${
                  currentFeature === index ? 'scale-105 shadow-2xl' : ''
                }`}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <span className="text-emerald-600 font-semibold">{feature.benefit}</span>
                  </div>
                  
                  <button className="text-indigo-600 font-semibold inline-flex items-center group">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="relative z-10 py-32 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by <span className="text-gradient-primary">50,000+</span> Store Owners
            </h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              See what successful Shopify merchants are saying about B3ACON
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card-dark p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-white mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-indigo-300 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold text-lg">{testimonial.growth}</div>
                    <div className="text-indigo-300 text-sm">Revenue Growth</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="text-gradient-primary">Growth Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with a free trial, scale as you grow. No setup fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`glass-card p-8 relative ${
                  plan.popular ? 'scale-105 ring-2 ring-indigo-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                  <div className="mt-4 text-sm text-emerald-600 font-semibold">
                    {plan.trial}-day free trial
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full btn-premium ${
                    plan.popular ? 'btn-primary' : 'btn-outline'
                  } btn-large`}
                  onClick={() => window.location.href = '/shopify/install'}
                >
                  Start {plan.trial}-Day Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Store?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join 50,000+ successful Shopify stores using B3ACON to dominate their markets. 
            Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button 
              className="btn-premium bg-white text-indigo-600 hover:bg-gray-50 btn-large"
              onClick={() => window.location.href = '/shopify/install'}
            >
              <ShoppingBag className="w-5 h-5" />
              Install B3ACON Now
            </button>
            
            <button className="btn-premium btn-outline border-white text-white hover:bg-white hover:text-indigo-600 btn-large">
              <Users className="w-5 h-5" />
              View Live Demo
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-indigo-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumShopifyLanding;