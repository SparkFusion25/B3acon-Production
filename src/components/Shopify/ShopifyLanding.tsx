import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Link2, 
  ShoppingBag, 
  Zap, 
  BarChart3, 
  Settings,
  Star,
  ChevronRight,
  CheckCircle,
  Play,
  ExternalLink,
  Users,
  TrendingUp,
  Globe
} from 'lucide-react';
import '../../styles/shopify-app.css';

const ShopifyLanding = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "B3ACON transformed our SEO strategy. We saw a 300% increase in organic traffic within 3 months.",
      author: "Sarah Johnson",
      store: "Fashion Forward Co.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=60&h=60&fit=crop&crop=face"
    },
    {
      quote: "The internal linking automation saved us 20 hours per week. Revenue increased 45% quarter over quarter.",
      author: "Mike Chen",
      store: "Tech Gadgets Plus",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      quote: "Amazon sync feature is a game-changer. Managing inventory across platforms is now seamless.",
      author: "Emma Rodriguez",
      store: "Home & Garden Paradise",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  const features = [
    {
      icon: Search,
      title: "SEO Score Tracking",
      description: "Real-time SEO analysis with actionable insights and automated optimization suggestions for every page.",
      stats: "Average 300% traffic increase"
    },
    {
      icon: Link2,
      title: "Internal Linking Automation",
      description: "AI-powered internal linking between products, collections, and blog posts to boost page authority.",
      stats: "20+ hours saved weekly"
    },
    {
      icon: ShoppingBag,
      title: "Amazon + Shopify Visibility",
      description: "Sync inventory, track performance, and optimize listings across both platforms from one dashboard.",
      stats: "45% revenue growth"
    }
  ];

  const pricingPlans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "14 days",
      description: "Perfect for testing all features",
      features: [
        "SEO Analysis for 50 pages",
        "Basic internal linking",
        "Shopify integration",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Growth Tier",
      price: "$29",
      period: "per month",
      description: "For growing eCommerce stores",
      features: [
        "SEO Analysis for 500 pages",
        "Advanced internal linking",
        "Amazon + Shopify sync",
        "Priority support",
        "Custom reporting"
      ],
      cta: "Choose Growth",
      popular: true
    },
    {
      name: "Pro Agency",
      price: "$99",
      period: "per month",
      description: "For agencies managing multiple stores",
      features: [
        "Unlimited page analysis",
        "White-label reporting",
        "Multi-store management",
        "API access",
        "Dedicated account manager"
      ],
      cta: "Go Pro",
      popular: false
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="b3acon-app min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Simplify, Analyze, Grow with B3ACON
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your Command Center for eCommerce Growth. Automate SEO, optimize internal linking, 
              and sync Amazon + Shopify for maximum visibility and revenue.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="btn-primary text-lg px-8 py-4 h-auto"
              onClick={() => scrollToSection('pricing')}
            >
              <Play className="w-5 h-5" />
              Get Started Free
            </button>
            <button 
              className="btn-secondary text-lg px-8 py-4 h-auto bg-white/10 border-white/20 text-white hover:bg-white hover:text-gray-900"
              onClick={() => window.location.href = '/shopify/install'}
            >
              <ExternalLink className="w-5 h-5" />
              Install via Shopify
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-lime-400 counter-animate">50K+</div>
              <div className="text-gray-400">Stores Trust B3ACON</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-lime-400 counter-animate">300%</div>
              <div className="text-gray-400">Average Traffic Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-lime-400 counter-animate">$2.4M+</div>
              <div className="text-gray-400">Additional Revenue Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-main mb-4">
              Everything You Need to Dominate eCommerce
            </h2>
            <p className="text-xl text-subtle max-w-2xl mx-auto">
              Powerful tools designed specifically for Shopify stores to boost SEO, 
              increase conversions, and maximize revenue.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <div key={index} className="b3acon-card text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-lime-400 to-lime-600 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-main mb-4">{feature.title}</h3>
                <p className="text-subtle mb-6 leading-relaxed">{feature.description}</p>
                <div className="inline-flex items-center text-lime-600 font-semibold">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-main mb-4">
              Choose Your Growth Plan
            </h2>
            <p className="text-xl text-subtle">
              Start free, upgrade as you scale. No long-term contracts, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.popular ? 'featured' : ''}`}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-main mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-main">{plan.price}</span>
                    <span className="text-subtle">/{plan.period}</span>
                  </div>
                  <p className="text-subtle">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-lime-600 mr-3 flex-shrink-0" />
                      <span className="text-main">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => scrollToSection('install')}
                >
                  {plan.cta}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Slider */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by 50,000+ Shopify Stores
            </h2>
            <p className="text-xl text-gray-300">
              See what store owners are saying about B3ACON
            </p>
          </div>

          <div className="relative">
            <div className="text-center">
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl font-medium mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].author}
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left">
                  <div className="font-semibold text-white">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-gray-400">
                    {testimonials[currentTestimonial].store}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-lime-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Installation CTA */}
      <section id="install" className="py-20 px-6 bg-gradient-to-r from-lime-400 to-lime-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Store?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 50,000+ successful Shopify stores using B3ACON to dominate their markets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn-primary bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 h-auto"
              onClick={() => window.location.href = '/shopify/install'}
            >
              <ShoppingBag className="w-5 h-5" />
              Install B3ACON App
            </button>
            <button 
              className="btn-secondary border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4 h-auto"
              onClick={() => window.open('/dashboard', '_self')}
            >
              <Users className="w-5 h-5" />
              View Live Demo
            </button>
          </div>

          <div className="mt-8 text-sm opacity-75">
            ✓ 14-day free trial • ✓ No setup fees • ✓ Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gray-900" />
                </div>
                <span className="text-xl font-bold">B3ACON</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your Command Center for eCommerce Growth
              </p>
              <div className="flex space-x-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Global Support 24/7</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API Docs</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 B3ACON. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <span className="text-gray-400">Trusted by</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Shopify Plus Partners</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShopifyLanding;