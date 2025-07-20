import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, TrendingUp, Filter, Plus, Eye, BarChart3 } from 'lucide-react';
import { useShopifyAuth } from '../../../contexts/ShopifyAuthContext';

const ReviewManager: React.FC = () => {
  const { user, subscription } = useShopifyAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reviews, setReviews] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock review data
  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        product: 'Premium Wireless Headphones',
        customer: 'John D.',
        rating: 5,
        title: 'Excellent sound quality!',
        content: 'These headphones exceeded my expectations. The bass is incredible and they\'re very comfortable.',
        date: '2024-01-15',
        status: 'published',
        platform: 'shopify',
        helpful: 12,
        verified: true
      },
      {
        id: 2,
        product: 'Smart Fitness Watch',
        customer: 'Sarah M.',
        rating: 4,
        title: 'Great features, minor issues',
        content: 'Love the health tracking features, but the battery life could be better.',
        date: '2024-01-14',
        status: 'pending',
        platform: 'google',
        helpful: 8,
        verified: true
      },
      {
        id: 3,
        product: 'Organic Coffee Beans',
        customer: 'Mike R.',
        rating: 5,
        title: 'Best coffee ever!',
        content: 'Rich flavor, perfect roast. Will definitely order again.',
        date: '2024-01-13',
        status: 'published',
        platform: 'amazon',
        helpful: 15,
        verified: false
      }
    ];
    setReviews(mockReviews);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'shopify': return 'bg-purple-100 text-purple-800';
      case 'google': return 'bg-blue-100 text-blue-800';
      case 'amazon': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews
    .filter(review => filterStatus === 'all' || review.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest': return b.rating - a.rating;
        case 'lowest': return a.rating - b.rating;
        default: return 0;
      }
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">REVIEW Manager</h1>
            <p className="text-gray-600">Manage customer reviews across all platforms</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'reviews', label: 'All Reviews', icon: MessageSquare },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Filter }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-gray-900">4.7</div>
                {renderStars(5)}
              </div>
              <p className="text-xs text-green-600">+0.2 from last month</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">23</div>
              <p className="text-xs text-yellow-600">Requires attention</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
                <ThumbsUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">87%</div>
              <p className="text-xs text-green-600">+5% from last month</p>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-gray-900">{review.customer}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{review.content}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getPlatformColor(review.platform)}`}>
                      {review.platform}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>

              <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                <Plus className="w-4 h-4" />
                Request Review
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {renderStars(review.rating)}
                      <div>
                        <h3 className="font-medium text-gray-900">{review.title}</h3>
                        <p className="text-sm text-gray-600">by {review.customer} • {review.product}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(review.status)}`}>
                        {review.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getPlatformColor(review.platform)}`}>
                        {review.platform}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{review.date}</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {review.helpful} helpful
                      </span>
                      {review.verified && (
                        <span className="text-green-600 font-medium">✓ Verified Purchase</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {review.status === 'pending' && (
                        <>
                          <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                            Approve
                          </button>
                          <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                            Reject
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${[70, 20, 5, 3, 2][5-rating]}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {[70, 20, 5, 3, 2][5-rating]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Performance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Performance</h3>
              <div className="space-y-4">
                {[
                  { platform: 'Shopify', rating: 4.8, reviews: 456, color: 'bg-purple-500' },
                  { platform: 'Google', rating: 4.6, reviews: 342, color: 'bg-blue-500' },
                  { platform: 'Amazon', rating: 4.7, reviews: 289, color: 'bg-orange-500' }
                ].map((platform) => (
                  <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="font-medium text-gray-900">{platform.platform}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{platform.rating} ⭐</span>
                      <span>{platform.reviews} reviews</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Trends</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Review trends chart would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Auto-publish 5-star reviews</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                  <span className="ml-2 text-sm text-gray-700">Require moderation for reviews below 3 stars</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Send email notifications for new reviews</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                  <span className="ml-2 text-sm text-gray-700">Enable review request automation</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Integration</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xs">S</span>
                  </div>
                  <span className="font-medium text-gray-900">Shopify</span>
                </div>
                <span className="text-sm text-green-600">Connected</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">G</span>
                  </div>
                  <span className="font-medium text-gray-900">Google My Business</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">Connect</button>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-xs">A</span>
                  </div>
                  <span className="font-medium text-gray-900">Amazon</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">Connect</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManager;