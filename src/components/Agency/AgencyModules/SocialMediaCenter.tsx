import React, { useState } from 'react';
import { MessageCircle, Calendar, BarChart3, Users, Image, Send, Globe, Plus, TrendingUp, Eye, ThumbsUp, Share2, RefreshCw, Download, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SocialMediaCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    content: '',
    image: '',
    platforms: [] as string[],
    scheduledDate: ''
  });
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Post created successfully!');
    setShowCreatePostModal(false);
    setPostForm({
      content: '',
      image: '',
      platforms: [],
      scheduledDate: ''
    });
  };
  
  const handlePlatformToggle = (platform: string) => {
    if (postForm.platforms.includes(platform)) {
      setPostForm({
        ...postForm,
        platforms: postForm.platforms.filter(p => p !== platform)
      });
    } else {
      setPostForm({
        ...postForm,
        platforms: [...postForm.platforms, platform]
      });
    }
  };

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Social Media Posts</h3>
        <button 
          onClick={() => setShowCreatePostModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>
      
      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Create Social Media Post</h4>
              <button 
                onClick={() => setShowCreatePostModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Content</label>
                <textarea
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  rows={4}
                  placeholder="What would you like to share?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={postForm.image}
                    onChange={(e) => setPostForm({...postForm, image: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button 
                    type="button"
                    onClick={() => toast.success('Image upload coming soon!')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(platform => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handlePlatformToggle(platform)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        postForm.platforms.includes(platform)
                          ? 'bg-signal-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
                {postForm.platforms.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Please select at least one platform</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (optional)</label>
                <input
                  type="datetime-local"
                  value={postForm.scheduledDate}
                  onChange={(e) => setPostForm({...postForm, scheduledDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!postForm.content || postForm.platforms.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {postForm.scheduledDate ? 'Schedule Post' : 'Post Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Sample Posts */}
      <div className="space-y-4">
        {[
          {
            id: 1,
            content: 'Excited to announce our new SEO service package! 🚀 Check out our website for more details.',
            image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
            platforms: ['Facebook', 'Twitter', 'LinkedIn'],
            status: 'published',
            publishedAt: '2 hours ago',
            engagement: { likes: 24, comments: 5, shares: 8 }
          },
          {
            id: 2,
            content: 'Looking for ways to improve your social media strategy? Our latest blog post covers 10 proven tactics!',
            image: null,
            platforms: ['Twitter', 'LinkedIn'],
            status: 'scheduled',
            publishedAt: 'Tomorrow at 10:00 AM',
            engagement: null
          }
        ].map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">B3ACON Marketing</h4>
                  <p className="text-sm text-gray-500">
                    {post.status === 'published' ? post.publishedAt : `Scheduled for ${post.publishedAt}`}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {post.status === 'published' ? 'Published' : 'Scheduled'}
              </span>
            </div>
            
            <p className="text-gray-800 mb-4">{post.content}</p>
            
            {post.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img src={post.image} alt="Post" className="w-full h-48 object-cover" />
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.platforms.map(platform => (
                <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {platform}
                </span>
              ))}
            </div>
            
            {post.engagement && (
              <div className="flex items-center space-x-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
                <span>{post.engagement.likes} likes</span>
                <span>{post.engagement.comments} comments</span>
                <span>{post.engagement.shares} shares</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Calendar</h3>
        <button 
          onClick={() => setShowCreatePostModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Post</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-medium text-gray-900">July 2025</h4>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              Today
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              Month
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              Week
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-600 text-sm py-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
            <div 
              key={date} 
              className={`border rounded-lg p-2 min-h-[80px] ${
                date === 12 ? 'border-signal-blue bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              } cursor-pointer transition-colors`}
              onClick={() => toast.success(`Viewing posts for July ${date}, 2025`)}
            >
              <div className="text-xs font-medium text-gray-700 mb-1">{date}</div>
              {date === 12 && (
                <div className="bg-signal-blue text-white text-xs p-1 rounded mb-1">
                  2 posts
                </div>
              )}
              {date === 15 && (
                <div className="bg-beacon-orange text-white text-xs p-1 rounded mb-1">
                  1 post
                </div>
              )}
              {date === 20 && (
                <div className="bg-green-500 text-white text-xs p-1 rounded mb-1">
                  3 posts
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Social Media Analytics</h3>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value as any)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  dateRange === range.value
                    ? 'bg-white text-signal-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => toast.success('Exporting analytics report')}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Followers</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">24,850</div>
          <p className="text-sm text-green-600">↗ +5.2% this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Engagement Rate</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">3.8%</div>
          <p className="text-sm text-green-600">↗ +0.6% this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Reach</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">142.5K</div>
          <p className="text-sm text-green-600">↗ +18% this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Conversions</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">185</div>
          <p className="text-sm text-green-600">↗ +12% this month</p>
        </div>
      </div>
      
      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-6">Platform Performance</h4>
          
          <div className="space-y-4">
            {[
              { platform: 'Facebook', followers: 12450, engagement: 2.8, posts: 24, color: 'bg-blue-500' },
              { platform: 'Instagram', followers: 8200, engagement: 4.2, posts: 32, color: 'bg-pink-500' },
              { platform: 'Twitter', followers: 3400, engagement: 1.9, posts: 48, color: 'bg-blue-400' },
              { platform: 'LinkedIn', followers: 800, engagement: 3.5, posts: 16, color: 'bg-blue-700' }
            ].map((platform, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {platform.platform.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-gray-900">{platform.platform}</h5>
                    <span className="text-sm text-gray-600">{platform.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        platform.platform === 'Facebook' ? 'bg-blue-500' :
                        platform.platform === 'Instagram' ? 'bg-pink-500' :
                        platform.platform === 'Twitter' ? 'bg-blue-400' :
                        'bg-blue-700'
                      }`} 
                      style={{ width: `${(platform.followers / 24850) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-600">
                    <span>{platform.engagement}% engagement</span>
                    <span>{platform.posts} posts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-6">Top Performing Posts</h4>
          
          <div className="space-y-4">
            {[
              { platform: 'Instagram', content: 'Check out our new office space! #NewBeginnings', engagement: 845, reach: 4200, date: '3 days ago' },
              { platform: 'Facebook', content: 'We\'re excited to announce our new service offering!', engagement: 632, reach: 3800, date: '1 week ago' },
              { platform: 'LinkedIn', content: 'Join our webinar on digital marketing trends for 2025', engagement: 428, reach: 2100, date: '2 weeks ago' }
            ].map((post, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs text-white ${
                    post.platform === 'Facebook' ? 'bg-blue-500' :
                    post.platform === 'Instagram' ? 'bg-pink-500' :
                    post.platform === 'Twitter' ? 'bg-blue-400' :
                    'bg-blue-700'
                  }`}>
                    {post.platform}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <p className="text-sm text-gray-800 mb-3">{post.content}</p>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{post.engagement.toLocaleString()} engagement</span>
                  <span>{post.reach.toLocaleString()} reach</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Audience Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Audience Insights</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-4">Age Distribution</h5>
            <div className="space-y-3">
              {[
                { age: '18-24', percentage: 15 },
                { age: '25-34', percentage: 38 },
                { age: '35-44', percentage: 27 },
                { age: '45-54', percentage: 12 },
                { age: '55+', percentage: 8 }
              ].map((group, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{group.age}</span>
                    <span className="text-sm text-gray-900">{group.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full" 
                      style={{ width: `${group.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-4">Gender</h5>
            <div className="flex items-center justify-center h-full">
              <div className="w-32 h-32 rounded-full border-8 border-signal-blue relative">
                <div 
                  className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-beacon-orange" 
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">Male: 42%</div>
                    <div className="text-sm font-medium text-gray-900">Female: 58%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-4">Top Locations</h5>
            <div className="space-y-3">
              {[
                { location: 'United States', percentage: 45 },
                { location: 'United Kingdom', percentage: 18 },
                { location: 'Canada', percentage: 12 },
                { location: 'Australia', percentage: 8 },
                { location: 'Germany', percentage: 5 }
              ].map((location, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{location.location}</span>
                    <span className="text-sm text-gray-900">{location.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full" 
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'posts', label: 'Posts', icon: MessageCircle },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media Center</h2>
        <p className="text-gray-600">Manage all your social media marketing from one place</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-signal-blue text-signal-blue'
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
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default SocialMediaCenter;