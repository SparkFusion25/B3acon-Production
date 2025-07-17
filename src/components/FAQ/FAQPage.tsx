import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  BookOpen,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Phone,
  Mail,
  ArrowRight,
  Filter,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Settings,
  CreditCard,
  Users,
  Globe,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import { FAQItem, FAQCategory } from '../../types/blog';

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>([]);

  // Mock data
  const categories: FAQCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      slug: 'getting-started',
      description: 'Basic setup and onboarding questions',
      icon: 'BookOpen',
      color: 'bg-blue-500',
      order: 1,
      isPublished: true,
      itemCount: 8,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'billing-pricing',
      name: 'Billing & Pricing',
      slug: 'billing-pricing',
      description: 'Payment, subscription, and pricing questions',
      icon: 'CreditCard',
      color: 'bg-green-500',
      order: 2,
      isPublished: true,
      itemCount: 12,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'features',
      name: 'Features & Tools',
      slug: 'features',
      description: 'How to use B3ACON features and tools',
      icon: 'Zap',
      color: 'bg-purple-500',
      order: 3,
      isPublished: true,
      itemCount: 15,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'integrations',
      name: 'Integrations',
      slug: 'integrations',
      description: 'Connecting with third-party services',
      icon: 'Globe',
      color: 'bg-orange-500',
      order: 4,
      isPublished: true,
      itemCount: 10,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'account-security',
      name: 'Account & Security',
      slug: 'account-security',
      description: 'Account management and security settings',
      icon: 'Shield',
      color: 'bg-red-500',
      order: 5,
      isPublished: true,
      itemCount: 6,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'analytics-reporting',
      name: 'Analytics & Reporting',
      slug: 'analytics-reporting',
      description: 'Understanding your data and reports',
      icon: 'BarChart3',
      color: 'bg-indigo-500',
      order: 6,
      isPublished: true,
      itemCount: 9,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  const faqs: FAQItem[] = [
    // Getting Started
    {
      id: '1',
      question: 'How do I get started with B3ACON?',
      answer: 'Getting started with B3ACON is simple! First, sign up for a free account on our website. Once registered, you\'ll be guided through our quick 5-minute onboarding process where you can connect your Shopify store, Amazon account, or other platforms. Our setup wizard will help you configure your first project and start analyzing your data immediately.',
      categoryId: 'getting-started',
      category: categories[0],
      order: 1,
      isPublished: true,
      helpfulCount: 156,
      notHelpfulCount: 8,
      tags: ['onboarding', 'setup', 'account'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      question: 'What platforms does B3ACON integrate with?',
      answer: 'B3ACON integrates with 200+ platforms including Shopify, Amazon, eBay, WooCommerce, Magento, Google Analytics, Facebook Ads, Google Ads, Mailchimp, Klaviyo, and many more. We also provide REST API access for custom integrations. New integrations are added regularly based on user requests.',
      categoryId: 'integrations',
      category: categories[3],
      order: 1,
      isPublished: true,
      helpfulCount: 234,
      notHelpfulCount: 12,
      tags: ['integrations', 'platforms', 'api'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '3',
      question: 'How much does B3ACON cost?',
      answer: 'B3ACON offers flexible pricing plans to suit businesses of all sizes. We have a free plan that includes basic features for up to 2 projects, a Professional plan at $49/month for growing businesses, and Enterprise plans starting at $199/month with advanced features and priority support. All paid plans include a 14-day free trial with no credit card required.',
      categoryId: 'billing-pricing',
      category: categories[1],
      order: 1,
      isPublished: true,
      helpfulCount: 189,
      notHelpfulCount: 23,
      tags: ['pricing', 'plans', 'cost'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '4',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your B3ACON subscription at any time without any cancellation fees. Your account will remain active until the end of your current billing period, and you\'ll continue to have access to all features during that time. You can easily cancel from your account settings or by contacting our support team.',
      categoryId: 'billing-pricing',
      category: categories[1],
      order: 2,
      isPublished: true,
      helpfulCount: 167,
      notHelpfulCount: 5,
      tags: ['cancellation', 'subscription', 'billing'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '5',
      question: 'How does the SEO analysis feature work?',
      answer: 'Our SEO analysis feature provides comprehensive insights into your website\'s search engine optimization. It analyzes your pages for technical SEO issues, content optimization opportunities, keyword rankings, backlink profiles, and competitor comparisons. The tool generates actionable recommendations with priority scores to help you improve your search visibility step by step.',
      categoryId: 'features',
      category: categories[2],
      order: 1,
      isPublished: true,
      helpfulCount: 198,
      notHelpfulCount: 15,
      tags: ['seo', 'analysis', 'features'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '6',
      question: 'Is my data secure with B3ACON?',
      answer: 'Absolutely! Data security is our top priority. We use enterprise-grade encryption (AES-256) for data in transit and at rest, maintain SOC 2 Type II compliance, and follow strict data protection protocols. Your data is stored in secure, geo-redundant data centers with 24/7 monitoring. We never share your data with third parties and you maintain full ownership of your information.',
      categoryId: 'account-security',
      category: categories[4],
      order: 1,
      isPublished: true,
      helpfulCount: 145,
      notHelpfulCount: 3,
      tags: ['security', 'data protection', 'privacy'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '7',
      question: 'How often is data updated in B3ACON?',
      answer: 'Data update frequency depends on your subscription plan and the type of data. Real-time data (like website traffic) is updated every 15 minutes. E-commerce data from platforms like Shopify is synced every hour. SEO rankings are updated daily, while social media metrics are refreshed every 4 hours. Enterprise plans can request more frequent updates for critical metrics.',
      categoryId: 'analytics-reporting',
      category: categories[5],
      order: 1,
      isPublished: true,
      helpfulCount: 112,
      notHelpfulCount: 8,
      tags: ['data', 'updates', 'frequency'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '8',
      question: 'Can I export my data and reports?',
      answer: 'Yes! B3ACON allows you to export your data and reports in multiple formats including PDF, CSV, Excel, and JSON. You can schedule automated reports to be sent to your email or team members on a daily, weekly, or monthly basis. The API also allows programmatic access to all your data for custom integrations and advanced analysis.',
      categoryId: 'analytics-reporting',
      category: categories[5],
      order: 2,
      isPublished: true,
      helpfulCount: 134,
      notHelpfulCount: 6,
      tags: ['export', 'reports', 'data'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '9',
      question: 'Do you offer customer support?',
      answer: 'We provide comprehensive customer support through multiple channels. Free plan users have access to our knowledge base and community forum. Paid plan users get email support with 2-hour response time, live chat support during business hours, and phone support. Enterprise customers receive dedicated account managers and priority support with 1-hour response SLAs.',
      categoryId: 'getting-started',
      category: categories[0],
      order: 2,
      isPublished: true,
      helpfulCount: 178,
      notHelpfulCount: 11,
      tags: ['support', 'help', 'contact'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '10',
      question: 'Can I manage multiple stores or websites?',
      answer: 'Yes! B3ACON is designed to handle multiple stores, websites, and accounts from a single dashboard. You can connect multiple Shopify stores, Amazon accounts, websites, and social media profiles. Each property is tracked separately with its own analytics, while the unified dashboard gives you a bird\'s-eye view of your entire digital presence.',
      categoryId: 'features',
      category: categories[2],
      order: 2,
      isPublished: true,
      helpfulCount: 156,
      notHelpfulCount: 9,
      tags: ['multiple stores', 'management', 'dashboard'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  useEffect(() => {
    let filtered = faqs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.categoryId === selectedCategory);
    }

    setFilteredFAQs(filtered);
  }, [searchQuery, selectedCategory]);

  const toggleExpanded = (faqId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedItems(newExpanded);
  };

  const handleHelpful = (faqId: string, helpful: boolean) => {
    // In a real app, this would make an API call
    console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      BookOpen, CreditCard, Zap, Globe, Shield, BarChart3, Settings, Users
    };
    return icons[iconName] || HelpCircle;
  };

  const popularFAQs = faqs.filter(faq => faq.helpfulCount > 150).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-signal-blue to-beacon-orange text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-blue-100" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Find answers to common questions about B3ACON features, pricing, and getting started
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border-0 shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{faqs.length}</p>
            <p className="text-gray-600">Total Questions</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Tag className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            <p className="text-gray-600">Categories</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">< 2 min</p>
            <p className="text-gray-600">Avg. Read Time</p>
          </div>
        </div>
      </div>

      {/* Popular Questions */}
      {!searchQuery && !selectedCategory && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Most Popular Questions</h2>
            <p className="text-gray-600">Quick answers to our most frequently asked questions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <span className="text-xs text-gray-500 ml-2">{faq.helpfulCount} helpful</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{faq.answer}</p>
                <button 
                  onClick={() => toggleExpanded(faq.id)}
                  className="text-signal-blue hover:text-beacon-orange font-medium flex items-center"
                >
                  Read full answer
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-600">Find answers organized by topic</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => setSelectedCategory('')}
            className={`p-6 rounded-xl text-left transition-all duration-200 ${
              !selectedCategory
                ? 'bg-gradient-to-r from-signal-blue to-beacon-orange text-white shadow-lg'
                : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <HelpCircle className="w-8 h-8" />
              <span className={`text-xs px-2 py-1 rounded-full ${
                !selectedCategory ? 'bg-white bg-opacity-20' : 'bg-gray-100'
              }`}>
                All
              </span>
            </div>
            <h3 className="font-semibold mb-2">All Categories</h3>
            <p className={`text-sm ${!selectedCategory ? 'text-blue-100' : 'text-gray-600'}`}>
              Browse all questions
            </p>
          </button>

          {categories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl text-left transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="w-8 h-8" />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                  }`}>
                    {category.itemCount}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className={`text-sm ${
                  selectedCategory === category.id ? 'text-white text-opacity-80' : 'text-gray-600'
                }`}>
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCategory 
                  ? `${categories.find(c => c.id === selectedCategory)?.name} Questions`
                  : searchQuery 
                    ? `Search Results for "${searchQuery}"`
                    : 'All Questions'
                }
              </h3>
              <span className="text-gray-500 text-sm">
                {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFAQs.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any questions matching your search. Try different keywords or browse categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="text-signal-blue hover:text-beacon-orange font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="p-6">
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 ${faq.category.color} text-white rounded-full text-xs`}>
                          {faq.category.name}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {faq.helpfulCount} helpful
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedItems.has(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {expandedItems.has(faq.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {faq.answer}
                        </p>
                      </div>

                      {faq.tags.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm font-medium text-gray-700 mb-2">Related topics:</p>
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs cursor-pointer hover:bg-gray-200"
                                onClick={() => setSearchQuery(tag)}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          Was this helpful?
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleHelpful(faq.id, true)}
                            className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Yes
                          </button>
                          <button
                            onClick={() => handleHelpful(faq.id, false)}
                            className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get detailed help via email support</p>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Send Email
              </button>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Speak directly with our experts</p>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;