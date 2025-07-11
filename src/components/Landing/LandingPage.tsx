import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Zap, BarChart3, Users, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">B3ACON</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#comparison" className="text-gray-600 hover:text-gray-900">Comparison</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Marketing Command Center
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                B3ACON provides a comprehensive suite of digital marketing tools to help agencies scale their operations, manage clients, and drive results.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all text-center">
                  Start Free 14-Day Trial
                </Link>
                <a href="#demo" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-center">
                  Watch Demo
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="B3ACON Dashboard" 
                className="rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All-in-One Marketing Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your digital marketing operations in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6 text-signal-blue" />,
                title: 'Advanced Analytics',
                description: 'Comprehensive reporting and insights across all marketing channels.'
              },
              {
                icon: <Users className="w-6 h-6 text-beacon-orange" />,
                title: 'Client Management',
                description: 'Streamline client onboarding, communication, and project management.'
              },
              {
                icon: <Zap className="w-6 h-6 text-signal-blue" />,
                title: 'Marketing Automation',
                description: 'Automate repetitive tasks and focus on strategy and growth.'
              },
              {
                icon: <Shield className="w-6 h-6 text-beacon-orange" />,
                title: 'White Label Ready',
                description: 'Rebrand the platform with your logo, colors, and domain.'
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-signal-blue" />,
                title: 'SEO Intelligence',
                description: 'Track rankings, analyze competitors, and optimize content.'
              },
              {
                icon: <ArrowRight className="w-6 h-6 text-beacon-orange" />,
                title: 'Multi-Channel Campaigns',
                description: 'Manage campaigns across social, email, PPC, and more.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your agency's needs and scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$49',
                description: 'Perfect for freelancers and small agencies',
                features: [
                  'Up to 5 clients',
                  'Basic analytics',
                  'Email support',
                  'Client portal',
                  'SEO tools',
                  'Social media management'
                ],
                cta: 'Start Free Trial',
                highlighted: false
              },
              {
                name: 'Professional',
                price: '$149',
                description: 'Ideal for growing agencies',
                features: [
                  'Up to 20 clients',
                  'Advanced analytics',
                  'Priority support',
                  'White label options',
                  'All marketing tools',
                  'API access'
                ],
                cta: 'Start Free Trial',
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: '$349',
                description: 'For established agencies with multiple teams',
                features: [
                  'Unlimited clients',
                  'Custom reporting',
                  'Dedicated account manager',
                  'Full white label',
                  'Advanced security',
                  'Custom integrations'
                ],
                cta: 'Contact Sales',
                highlighted: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-sm border ${
                  plan.highlighted ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'
                } p-8 relative`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-signal-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.highlighted 
                    ? 'bg-gradient-to-r from-signal-blue to-beacon-orange text-white hover:shadow-lg' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose B3ACON?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we compare to other marketing platforms in the market.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-gray-900 font-bold">Features</th>
                  <th className="px-6 py-4 text-center text-gray-900 font-bold">B3ACON</th>
                  <th className="px-6 py-4 text-center text-gray-900 font-bold">Competitor A</th>
                  <th className="px-6 py-4 text-center text-gray-900 font-bold">Competitor B</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'All-in-one platform', b3acon: true, compA: false, compB: false },
                  { feature: 'White label options', b3acon: true, compA: true, compB: false },
                  { feature: 'Client portal', b3acon: true, compA: true, compB: true },
                  { feature: 'SEO intelligence', b3acon: true, compA: false, compB: true },
                  { feature: 'Social media management', b3acon: true, compA: true, compB: true },
                  { feature: 'Email marketing', b3acon: true, compA: false, compB: true },
                  { feature: 'Landing page builder', b3acon: true, compA: false, compB: false },
                  { feature: 'Affiliate marketing', b3acon: true, compA: false, compB: false },
                  { feature: 'Unlimited clients (Enterprise)', b3acon: true, compA: false, compB: false },
                  { feature: 'API access', b3acon: true, compA: true, compB: false }
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-gray-900 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.b3acon ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.compA ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.compB ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Marketing Agencies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about B3ACON.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "B3ACON has transformed how we manage our clients. The all-in-one platform saves us countless hours every week.",
                author: "Sarah Johnson",
                role: "CEO, Digital Spark Agency",
                image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                quote: "The white label features allowed us to offer a client portal under our own brand. Our clients love the transparency.",
                author: "Michael Chen",
                role: "Director, Growth Partners",
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                quote: "The SEO intelligence tools alone are worth the investment. We've seen dramatic improvements in our clients' rankings.",
                author: "Emily Rodriguez",
                role: "SEO Manager, Elevate Digital",
                image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center space-x-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-signal-blue to-beacon-orange">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your agency?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of agencies already using B3ACON to scale their operations and deliver better results for their clients.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="px-8 py-4 bg-white text-signal-blue rounded-lg hover:shadow-lg transition-all text-lg font-medium">
              Start Your Free Trial
            </Link>
            <a href="#demo" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all text-lg font-medium">
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">B3ACON</span>
              </div>
              <p className="text-gray-400 mb-6">
                The complete digital marketing command center for agencies.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Reviews</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 B3ACON. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;