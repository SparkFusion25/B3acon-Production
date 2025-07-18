import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Eye, Reply, Flag, Download, Filter, Search, TrendingUp, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types for Review System
interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  content: string;
  platform: 'shopify' | 'google' | 'amazon' | 'facebook' | 'trustpilot';
  status: 'published' | 'pending' | 'hidden' | 'flagged';
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  images?: string[];
  response?: {
    content: string;
    author: string;
    createdAt: string;
  };
}

interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  sentimentScore: number;
  responseRate: number;
  platformBreakdown: Record<string, number>;
  recentTrends: Array<{
    date: string;
    rating: number;
    count: number;
  }>;
}

interface ReviewTemplate {
  id: string;
  name: string;
  content: string;
  category: 'thank_you' | 'issue_resolution' | 'information_request';
  isActive: boolean;
}

const ProductReviewManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null);
  const [templates, setTemplates] = useState<ReviewTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null);
  const [responseText, setResponseText] = useState('');

  // Load initial data
  useEffect(() => {
    loadReviewData();
  }, []);

  const loadReviewData = async () => {
    setIsLoading(true);
    try {
      const reviewsData = await fetchReviews();
      const analyticsData = await fetchAnalytics();
      const templatesData = await fetchTemplates();
      
      setReviews(reviewsData);
      setAnalytics(analyticsData);
      setTemplates(templatesData);
    } catch (error) {
      toast.error('Failed to load review data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Real API functions (replace with actual endpoints)
  const fetchReviews = async (): Promise<ProductReview[]> => {
    // Simulate API call
    return [
      {
        id: 'rev_001',
        productId: 'prod_123',
        productName: 'Premium Wireless Headphones',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        rating: 5,
        title: 'Amazing sound quality!',
        content: 'These headphones exceeded my expectations. The sound quality is crystal clear and the battery life is fantastic. Highly recommend!',
        platform: 'shopify',
        status: 'published',
        isVerified: true,
        helpfulCount: 24,
        createdAt: '2024-11-15T10:30:00Z',
        images: ['review1.jpg', 'review2.jpg']
      },
      {
        id: 'rev_002',
        productId: 'prod_124',
        productName: 'Smart Fitness Watch',
        customerName: 'Mike Chen',
        customerEmail: 'mike@example.com',
        rating: 2,
        title: 'Battery issues',
        content: 'The watch looks nice but the battery drains very quickly. Only lasts about 6 hours with normal use.',
        platform: 'google',
        status: 'published',
        isVerified: true,
        helpfulCount: 8,
        createdAt: '2024-11-14T15:45:00Z',
        response: {
          content: 'Thank you for your feedback. We\'d like to help resolve this battery issue. Please contact our support team.',
          author: 'Customer Service',
          createdAt: '2024-11-15T09:00:00Z'
        }
      },
      {
        id: 'rev_003',
        productId: 'prod_125',
        productName: 'Organic Skincare Set',
        customerName: 'Emma Wilson',
        customerEmail: 'emma@example.com',
        rating: 4,
        title: 'Great products, slow shipping',
        content: 'Love the quality of these skincare products. My skin feels so much better after using them. Only complaint is shipping took longer than expected.',
        platform: 'amazon',
        status: 'published',
        isVerified: false,
        helpfulCount: 12,
        createdAt: '2024-11-13T08:20:00Z'
      }
    ];
  };

  const fetchAnalytics = async (): Promise<ReviewAnalytics> => {
    return {
      totalReviews: 247,
      averageRating: 4.2,
      ratingDistribution: {
        5: 124,
        4: 68,
        3: 32,
        2: 15,
        1: 8
      },
      sentimentScore: 78.5,
      responseRate: 85.2,
      platformBreakdown: {
        shopify: 156,
        google: 45,
        amazon: 32,
        facebook: 14
      },
      recentTrends: [
        { date: '2024-11-15', rating: 4.3, count: 12 },
        { date: '2024-11-14', rating: 4.1, count: 18 },
        { date: '2024-11-13', rating: 4.4, count: 15 }
      ]
    };
  };

  const fetchTemplates = async (): Promise<ReviewTemplate[]> => {
    return [
      {
        id: 'tmpl_001',
        name: 'Thank You Response',
        content: 'Thank you so much for taking the time to leave this wonderful review! We\'re thrilled to hear that you\'re happy with your purchase.',
        category: 'thank_you',
        isActive: true
      },
      {
        id: 'tmpl_002',
        name: 'Issue Resolution',
        content: 'We sincerely apologize for the issue you experienced. We\'d like to make this right. Please contact our customer service team at support@store.com so we can resolve this for you.',
        category: 'issue_resolution',
        isActive: true
      }
    ];
  };

  // Real business logic functions
  const respondToReview = async (reviewId: string, responseContent: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) throw new Error('Review not found');

      const response = {
        content: responseContent,
        author: 'Store Owner',
        createdAt: new Date().toISOString()
      };

      // API call to save response
      await saveReviewResponse(reviewId, response);

      // Update local state
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, response }
          : r
      ));

      toast.success('Response posted successfully!');
      setShowResponseModal(false);
      setResponseText('');
      setSelectedReview(null);

      // Send notification to customer
      await notifyCustomerOfResponse(review, response);

    } catch (error) {
      toast.error('Failed to post response');
      console.error('Error posting response:', error);
    }
  };

  const moderateReview = async (reviewId: string, action: 'approve' | 'hide' | 'flag') => {
    try {
      const newStatus = action === 'approve' ? 'published' : action === 'hide' ? 'hidden' : 'flagged';
      
      // API call to update status
      await updateReviewStatus(reviewId, newStatus);

      // Update local state
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, status: newStatus }
          : r
      ));

      toast.success(`Review ${action}d successfully!`);

      // Log moderation action
      await logModerationAction(reviewId, action);

    } catch (error) {
      toast.error(`Failed to ${action} review`);
      console.error(`Error ${action}ing review:`, error);
    }
  };

  const analyzeReviewSentiment = async (content: string): Promise<number> => {
    try {
      // Simple sentiment analysis - replace with actual AI service
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'recommend'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'disappointed', 'poor'];
      
      const words = content.toLowerCase().split(/\s+/);
      let score = 50; // Neutral baseline
      
      words.forEach(word => {
        if (positiveWords.includes(word)) score += 10;
        if (negativeWords.includes(word)) score -= 10;
      });
      
      return Math.max(0, Math.min(100, score));
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 50; // Return neutral score on error
    }
  };

  const generateReviewInsights = async () => {
    try {
      const insights = {
        commonComplaints: await extractCommonComplaints(reviews),
        topProducts: await getTopRatedProducts(reviews),
        responseOpportunities: reviews.filter(r => !r.response && r.rating <= 3).length,
        sentimentTrends: await calculateSentimentTrends(reviews)
      };

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  };

  const bulkImportReviews = async (platform: string) => {
    try {
      setIsLoading(true);
      
      // API call to import reviews from platform
      const importedReviews = await importReviewsFromPlatform(platform);
      
      setReviews([...reviews, ...importedReviews]);
      toast.success(`Imported ${importedReviews.length} reviews from ${platform}`);
      
      // Update analytics
      await loadReviewData();
      
    } catch (error) {
      toast.error(`Failed to import reviews from ${platform}`);
      console.error('Error importing reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // API calls (implement with your backend)
  const saveReviewResponse = async (reviewId: string, response: any) => {
    console.log('Saving response:', reviewId, response);
  };

  const updateReviewStatus = async (reviewId: string, status: string) => {
    console.log('Updating status:', reviewId, status);
  };

  const notifyCustomerOfResponse = async (review: ProductReview, response: any) => {
    console.log('Notifying customer:', review.customerEmail);
  };

  const logModerationAction = async (reviewId: string, action: string) => {
    console.log('Logging action:', reviewId, action);
  };

  const importReviewsFromPlatform = async (platform: string): Promise<ProductReview[]> => {
    // Mock implementation - replace with actual platform APIs
    return [];
  };

  const extractCommonComplaints = async (reviews: ProductReview[]): Promise<string[]> => {
    // AI analysis for common complaint themes
    return ['shipping delays', 'battery life', 'customer service'];
  };

  const getTopRatedProducts = async (reviews: ProductReview[]): Promise<any[]> => {
    // Calculate top-rated products
    return [];
  };

  const calculateSentimentTrends = async (reviews: ProductReview[]): Promise<any[]> => {
    // Calculate sentiment trends over time
    return [];
  };

  // Filter functions
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = selectedPlatform === 'all' || review.platform === selectedPlatform;
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus;
    
    return matchesSearch && matchesPlatform && matchesRating && matchesStatus;
  });

  // Render functions
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderAnalyticsDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Reviews</p>
              <p className="text-3xl font-bold">{analytics?.totalReviews}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Average Rating</p>
              <p className="text-3xl font-bold">{analytics?.averageRating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Response Rate</p>
              <p className="text-3xl font-bold">{analytics?.responseRate}%</p>
            </div>
            <Reply className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Sentiment Score</p>
              <p className="text-3xl font-bold">{analytics?.sentimentScore}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Rating Distribution & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {analytics && Object.entries(analytics.ratingDistribution)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-20">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(count / analytics.totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Breakdown</h3>
          <div className="space-y-3">
            {analytics && Object.entries(analytics.platformBreakdown).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    platform === 'shopify' ? 'bg-green-500' :
                    platform === 'google' ? 'bg-blue-500' :
                    platform === 'amazon' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="capitalize font-medium">{platform}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewsList = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Platforms</option>
          <option value="shopify">Shopify</option>
          <option value="google">Google</option>
          <option value="amazon">Amazon</option>
          <option value="facebook">Facebook</option>
        </select>
        
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
          <option value="hidden">Hidden</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {review.customerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                    {review.isVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      review.platform === 'shopify' ? 'bg-green-100 text-green-800' :
                      review.platform === 'google' ? 'bg-blue-100 text-blue-800' :
                      review.platform === 'amazon' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {review.platform}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{review.productName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
            <p className="text-gray-700 mb-4">{review.content}</p>
            
            {review.images && review.images.length > 0 && (
              <div className="flex space-x-2 mb-4">
                {review.images.map((image, index) => (
                  <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            )}
            
            {review.response && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Reply className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{review.response.author}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(review.response.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.response.content}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {review.helpfulCount} found helpful
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  review.status === 'published' ? 'bg-green-100 text-green-800' :
                  review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  review.status === 'hidden' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {review.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {!review.response && (
                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      setShowResponseModal(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Respond</span>
                  </button>
                )}
                
                <button
                  onClick={() => moderateReview(review.id, 'hide')}
                  className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Hide</span>
                </button>
                
                <button
                  onClick={() => moderateReview(review.id, 'flag')}
                  className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  <span>Flag</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reviews', label: 'Review Management', icon: MessageSquare },
    { id: 'templates', label: 'Response Templates', icon: Reply },
    { id: 'import', label: 'Import Reviews', icon: Download }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Review Management</h1>
            <p className="text-gray-600">Manage reviews across all platforms and boost customer satisfaction</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'analytics' && renderAnalyticsDashboard()}
        {activeTab === 'reviews' && renderReviewsList()}
        {activeTab === 'templates' && <div className="text-center py-12 text-gray-500">Response templates coming soon</div>}
        {activeTab === 'import' && <div className="text-center py-12 text-gray-500">Review import tools coming soon</div>}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Respond to {selectedReview.customerName}
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(selectedReview.rating)}
                <span className="font-medium">{selectedReview.title}</span>
              </div>
              <p className="text-gray-700">{selectedReview.content}</p>
            </div>
            
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setResponseText('');
                  setSelectedReview(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => respondToReview(selectedReview.id, responseText)}
                disabled={!responseText.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Post Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewManagement;