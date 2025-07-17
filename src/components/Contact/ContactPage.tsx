import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  User, 
  Building, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Globe,
  Shield,
  Headphones,
  Users,
  Zap,
  Star,
  MessageSquare,
  Video,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  type: 'general' | 'sales' | 'support' | 'partnership' | 'demo';
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    type: 'general',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      contact: '+1 (555) 123-4567',
      hours: 'Mon-Fri 9AM-6PM EST',
      color: 'bg-blue-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get detailed help via email',
      contact: 'support@b3acon.com',
      hours: 'Response within 2 hours',
      color: 'bg-green-500'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team instantly',
      contact: 'Available 24/7',
      hours: 'Instant response',
      color: 'bg-purple-500'
    },
    {
      icon: Video,
      title: 'Video Consultation',
      description: 'Schedule a screen share session',
      contact: 'Book a meeting',
      hours: 'Flexible scheduling',
      color: 'bg-orange-500'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      country: 'United States',
      address: '123 Innovation Drive, Suite 400\nSan Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@b3acon.com',
      timezone: 'PST',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '45 Tech Square, Level 8\nLondon, EC2A 4DN',
      phone: '+44 20 7123 4567',
      email: 'london@b3acon.com',
      timezone: 'GMT',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      address: '88 Marina Bay Street, Tower 2\nSingapore 018981',
      phone: '+65 6123 4567',
      email: 'singapore@b3acon.com',
      timezone: 'SGT',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const supportTypes = [
    {
      id: 'sales',
      title: 'Sales Inquiry',
      description: 'Learn about our plans and pricing',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      id: 'support',
      title: 'Technical Support',
      description: 'Get help with your account or tools',
      icon: Headphones,
      color: 'bg-blue-500'
    },
    {
      id: 'demo',
      title: 'Request Demo',
      description: 'See B3ACON in action',
      icon: Video,
      color: 'bg-green-500'
    },
    {
      id: 'partnership',
      title: 'Partnership',
      description: 'Explore collaboration opportunities',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      id: 'general',
      title: 'General Inquiry',
      description: 'Other questions or feedback',
      icon: MessageSquare,
      color: 'bg-gray-500'
    }
  ];

  const faqs = [
    {
      question: 'How quickly can I get started with B3ACON?',
      answer: 'You can start using B3ACON immediately after signing up. Our onboarding process takes less than 5 minutes, and our team can help you set up your first project within 24 hours.'
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Yes! We provide custom enterprise solutions tailored to your specific needs, including dedicated support, custom integrations, and white-label options.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer 24/7 chat support, email support with 2-hour response time, phone support during business hours, and video consultations for enterprise clients.'
    },
    {
      question: 'Can I integrate B3ACON with my existing tools?',
      answer: 'Absolutely! B3ACON integrates with 200+ popular tools including Shopify, Amazon, Google Analytics, Facebook Ads, and more. We also provide API access for custom integrations.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        type: 'general',
        message: ''
      });
    }, 3000);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-signal-blue to-beacon-orange text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch with B3ACON
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Ready to transform your business? Our team is here to help you succeed with personalized support and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-signal-blue rounded-lg hover:shadow-lg transition-all duration-200 font-semibold">
                Schedule Demo
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-signal-blue transition-all duration-200 font-semibold">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose How You'd Like to Connect</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're available through multiple channels to provide you with the best support experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{method.description}</p>
              <p className="text-signal-blue font-medium">{method.contact}</p>
              <p className="text-gray-500 text-xs mt-1">{method.hours}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600">Fill out the form below and we'll get back to you within 2 hours</p>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Support Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">What can we help you with?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {supportTypes.map((type) => (
                      <label key={type.id} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type.id}
                          checked={formData.type === type.id}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.type === type.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center">
                            <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center mr-3`}>
                              <type.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{type.title}</p>
                              <p className="text-gray-500 text-xs">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us more about your needs..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information & FAQs */}
          <div className="space-y-8">
            {/* Quick Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-signal-blue mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                    <p className="text-gray-500 text-sm">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-signal-blue mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">support@b3acon.com</p>
                    <p className="text-gray-500 text-sm">Response within 2 hours</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-signal-blue mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">San Francisco, CA</p>
                    <p className="text-gray-500 text-sm">Global offices available</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-signal-blue mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">24/7 Chat Support</p>
                    <p className="text-gray-500 text-sm">Always available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.slice(0, 3).map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
                <div className="pt-4">
                  <button className="text-signal-blue hover:text-beacon-orange font-medium flex items-center">
                    View all FAQs
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Global Offices</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              With offices around the world, we're always here to support your business across all time zones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src={office.image} 
                  alt={`${office.city} office`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{office.city}</h3>
                  <p className="text-gray-600 mb-4">{office.country}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-signal-blue mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 whitespace-pre-line">{office.address}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-signal-blue mr-2" />
                      <p className="text-gray-600">{office.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-signal-blue mr-2" />
                      <p className="text-gray-600">{office.email}</p>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-signal-blue mr-2" />
                      <p className="text-gray-600">Timezone: {office.timezone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using B3ACON to grow their online presence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold">
                Start Free Trial
              </button>
              <button className="px-8 py-3 border-2 border-gray-300 text-white rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 font-semibold">
                Schedule Demo
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;