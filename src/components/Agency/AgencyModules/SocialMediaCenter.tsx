import React, { useState } from 'react';
import { MessageCircle, Calendar, BarChart3, Users, Image, Send, Globe, Plus } from 'lucide-react';
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Social Media Analytics</h3>
            <button 
              onClick={() => toast.success('Exporting analytics report')}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Export Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Total Followers</h4>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">24,850</div>
              <p className="text-sm text-green-600">↗ +5.2% this month</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Facebook</span>
                  <span className="font-medium text-gray-900">12,450</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Instagram</span>
                  <span className="font-medium text-gray-900">8,320</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Twitter</span>
                  <span className="font-medium text-gray-900">4,080</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Engagement Rate</h4>
                <MessageCircle className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">3.8%</div>
              <p className="text-sm text-green-600">↗ +0.6% this month</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Likes</span>
                  <span className="font-medium text-gray-900">12,450</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-medium text-gray-900">3,240</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Shares</span>
                  <span className="font-medium text-gray-900">2,180</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Reach</h4>
                <Globe className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">142,500</div>
              <p className="text-sm text-green-600">↗ +18% this month</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Impressions</span>
                  <span className="font-medium text-gray-900">245,320</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Clicks</span>
                  <span className="font-medium text-gray-900">12,450</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">CTR</span>
                  <span className="font-medium text-gray-900">5.1%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Top Performing Posts</h4>
            
            <div className="space-y-4">
              {[
                {
                  content: 'Excited to announce our new SEO service package! 🚀 Check out our website for more details.',
                  platform: 'Facebook',
                  engagement: { likes: 245, comments: 32, shares: 18 },
                  reach: 12450
                },
                {
                  content: 'Looking for ways to improve your social media strategy? Our latest blog post covers 10 proven tactics!',
                  platform: 'LinkedIn',
                  engagement: { likes: 189, comments: 24, shares: 12 },
                  reach: 8900
                }
              ].map((post, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 mb-2 line-clamp-2">{post.content}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{post.platform}</span>
                    <div className="flex items-center space-x-3">
                      <span>{post.engagement.likes} likes</span>
                      <span>{post.engagement.comments} comments</span>
                      <span>{post.engagement.shares} shares</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-600">Social media analytics and reporting features will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaCenter;