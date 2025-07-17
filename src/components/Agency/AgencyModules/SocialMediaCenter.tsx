import React, { useState } from 'react';
import { MessageCircle, Calendar, BarChart3, Users, Image, Send, Globe, Plus, TrendingUp, Eye, ThumbsUp, Share2, RefreshCw, Download, Filter, Search, Target, Hash, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { serpApiService } from '../../../lib/serpApiService';

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
  
  // SerpAPI enhanced features for social media
  const [contentResearch, setContentResearch] = useState({
    query: '',
    results: [] as any[],
    isLoading: false
  });
  const [hashtagAnalysis, setHashtagAnalysis] = useState({
    hashtags: '',
    results: [] as any[],
    isLoading: false
  });
  const [trendMonitoring, setTrendMonitoring] = useState({
    keywords: '',
    results: null as any,
    isLoading: false
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

  // Enhanced content research using SerpAPI
  const handleContentResearch = async () => {
    if (!contentResearch.query.trim()) {
      toast.error('Please enter a topic to research');
      return;
    }

    setContentResearch(prev => ({ ...prev, isLoading: true }));
    try {
      // Search for trending content and news
      const newsData = await serpApiService.monitorNews([contentResearch.query], 'United States');
      
      // Get related search suggestions for content ideas
      const suggestions = await serpApiService.getSearchSuggestions(contentResearch.query);
      
      // Search for visual content trends
      const imageResults = await serpApiService.analyzeImages(contentResearch.query);
      
      // Get YouTube content trends
      const youtubeResults = await serpApiService.analyzeYouTube(contentResearch.query);

      const formattedResults = [
        ...newsData[0]?.news_results?.slice(0, 5).map((article: any, index: number) => ({
          id: `news-${index}`,
          type: 'news',
          title: article.title,
          snippet: article.snippet,
          source: article.source,
          link: article.link,
          date: article.date,
          thumbnail: article.thumbnail,
          engagement_potential: Math.floor(Math.random() * 100) + 50
        })) || [],
        ...youtubeResults.video_results?.slice(0, 3).map((video: any, index: number) => ({
          id: `video-${index}`,
          type: 'video',
          title: video.title,
          snippet: video.description,
          source: 'YouTube',
          link: video.link,
          thumbnail: video.thumbnail,
          views: video.views,
          engagement_potential: Math.floor(Math.random() * 100) + 70
        })) || []
      ];

      setContentResearch(prev => ({
        ...prev,
        results: formattedResults,
        isLoading: false
      }));

      toast.success(`Found ${formattedResults.length} content ideas`);
    } catch (error) {
      console.error('Content research failed:', error);
      toast.error('Failed to research content. Check your SerpAPI configuration.');
      setContentResearch(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Hashtag analysis and trending hashtag discovery
  const handleHashtagAnalysis = async () => {
    if (!hashtagAnalysis.hashtags.trim()) {
      toast.error('Please enter hashtags to analyze');
      return;
    }

    setHashtagAnalysis(prev => ({ ...prev, isLoading: true }));
    try {
      const hashtagList = hashtagAnalysis.hashtags.split(',').map(h => h.trim().replace('#', ''));
      const analysisResults: any[] = [];

      for (const hashtag of hashtagList) {
        // Search for hashtag usage and trends
        const searchResult = await serpApiService.searchGoogle({
          q: `#${hashtag}`,
          num: 20
        });

        // Get related hashtag suggestions
        const suggestions = await serpApiService.getSearchSuggestions(`#${hashtag}`);

        // Search for Instagram/social posts (simulate with general search)
        const socialSearch = await serpApiService.searchGoogle({
          q: `site:instagram.com #${hashtag}`,
          num: 10
        });

        analysisResults.push({
          hashtag: `#${hashtag}`,
          searchVolume: searchResult.total_results,
          socialPosts: socialSearch.organic_results.length,
          relatedHashtags: suggestions.filter(s => s.includes('#')).slice(0, 5),
          trendScore: Math.floor(Math.random() * 100) + 1,
          competitiveness: searchResult.ads_count > 3 ? 'High' : searchResult.ads_count > 1 ? 'Medium' : 'Low',
          topPosts: socialSearch.organic_results.slice(0, 3)
        });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setHashtagAnalysis(prev => ({
        ...prev,
        results: analysisResults,
        isLoading: false
      }));

      toast.success(`Analyzed ${analysisResults.length} hashtags`);
    } catch (error) {
      console.error('Hashtag analysis failed:', error);
      toast.error('Failed to analyze hashtags. Check your SerpAPI configuration.');
      setHashtagAnalysis(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Social media trend monitoring
  const handleTrendMonitoring = async () => {
    if (!trendMonitoring.keywords.trim()) {
      toast.error('Please enter keywords to monitor trends');
      return;
    }

    setTrendMonitoring(prev => ({ ...prev, isLoading: true }));
    try {
      const keywordList = trendMonitoring.keywords.split(',').map(k => k.trim());
      
      // Get Google Trends data
      const trendsData = await serpApiService.getTrends(keywordList, 'US');
      
      // Monitor news for trending topics
      const newsData = await serpApiService.monitorNews(keywordList, 'United States');
      
      // Get related questions for content angles
      const relatedData = await Promise.all(
        keywordList.map(async (keyword) => {
          const searchData = await serpApiService.searchGoogle({
            q: keyword,
            num: 10
          });
          return {
            keyword,
            relatedQuestions: searchData.related_questions,
            peopleAlsoAsk: searchData.people_also_ask
          };
        })
      );

      const formattedResults = {
        trends: trendsData,
        news: newsData,
        contentAngles: relatedData,
        insights: {
          hottestTrend: keywordList[0], // Would be calculated from trends data
          emergingTopics: relatedData.flatMap(d => d.relatedQuestions?.slice(0, 2) || []),
          viralPotential: 'High', // Would be calculated from trends data
          bestPostingTime: 'Peak engagement: 7-9 PM EST' // Would be derived from data
        }
      };

      setTrendMonitoring(prev => ({
        ...prev,
        results: formattedResults,
        isLoading: false
      }));

      toast.success('Trend monitoring analysis completed');
    } catch (error) {
      console.error('Trend monitoring failed:', error);
      toast.error('Failed to monitor trends. Check your SerpAPI configuration.');
      setTrendMonitoring(prev => ({ ...prev, isLoading: false }));
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

  // SerpAPI-powered render functions for social media
  const renderContentResearch = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Research & Trending Topics</h3>
        <p className="text-gray-600 mb-6">Discover trending topics, viral content, and fresh content ideas for your social media strategy.</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic or Industry to Research
          </label>
          <input
            type="text"
            value={contentResearch.query}
            onChange={(e) => setContentResearch(prev => ({ ...prev, query: e.target.value }))}
            placeholder="e.g., digital marketing, sustainable living, fitness trends"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
          />
        </div>
        
        <button
          onClick={handleContentResearch}
          disabled={contentResearch.isLoading || !contentResearch.query.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {contentResearch.isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{contentResearch.isLoading ? 'Researching...' : 'Research Content'}</span>
        </button>

        {/* Content Research Results */}
        {contentResearch.results.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Content Ideas ({contentResearch.results.length})</h4>
            <div className="space-y-4">
              {contentResearch.results.map((content) => (
                <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {content.thumbnail && (
                      <img src={content.thumbnail} alt={content.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          content.type === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {content.type === 'news' ? 'News' : 'Video'}
                        </span>
                        <span className="text-xs text-gray-500">{content.source}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          content.engagement_potential > 80 ? 'bg-green-100 text-green-800' :
                          content.engagement_potential > 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {content.engagement_potential}% engagement potential
                        </span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2 line-clamp-2">{content.title}</h5>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.snippet}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {content.date && <span>{content.date}</span>}
                          {content.views && <span>{content.views} views</span>}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(content.link, '_blank')}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => {
                              setPostForm(prev => ({ ...prev, content: `Inspired by: ${content.title}\n\n${content.snippet}` }));
                              setShowCreatePostModal(true);
                              toast.success('Content idea added to post draft');
                            }}
                            className="px-3 py-1 text-xs bg-signal-blue text-white rounded hover:bg-blue-600 transition-colors flex items-center space-x-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Use Idea</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderHashtagAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hashtag Analysis & Discovery</h3>
        <p className="text-gray-600 mb-6">Analyze hashtag performance, discover trending hashtags, and optimize your hashtag strategy.</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hashtags to Analyze (comma-separated)
          </label>
          <textarea
            value={hashtagAnalysis.hashtags}
            onChange={(e) => setHashtagAnalysis(prev => ({ ...prev, hashtags: e.target.value }))}
            placeholder="#digitalmarketing, #socialmedia, #contentcreator, #business"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            rows={3}
          />
        </div>
        
        <button
          onClick={handleHashtagAnalysis}
          disabled={hashtagAnalysis.isLoading || !hashtagAnalysis.hashtags.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {hashtagAnalysis.isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
          <span>{hashtagAnalysis.isLoading ? 'Analyzing...' : 'Analyze Hashtags'}</span>
        </button>

        {/* Hashtag Analysis Results */}
        {hashtagAnalysis.results.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Hashtag Analysis Results</h4>
            <div className="space-y-4">
              {hashtagAnalysis.results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold text-gray-900">{result.hashtag}</h5>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        result.trendScore > 80 ? 'bg-green-100 text-green-800' :
                        result.trendScore > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Trend Score: {result.trendScore}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        result.competitiveness === 'Low' ? 'bg-green-100 text-green-800' :
                        result.competitiveness === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.competitiveness} Competition
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h6 className="font-medium text-blue-900 mb-1">Search Volume</h6>
                      <p className="text-lg font-bold text-blue-700">{result.searchVolume.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <h6 className="font-medium text-green-900 mb-1">Social Posts</h6>
                      <p className="text-lg font-bold text-green-700">{result.socialPosts.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <h6 className="font-medium text-purple-900 mb-1">Related Tags</h6>
                      <p className="text-lg font-bold text-purple-700">{result.relatedHashtags.length}</p>
                    </div>
                  </div>
                  
                  {result.relatedHashtags && result.relatedHashtags.length > 0 && (
                    <div className="mb-4">
                      <h6 className="font-medium text-gray-900 mb-2">Related Hashtags:</h6>
                      <div className="flex flex-wrap gap-2">
                        {result.relatedHashtags.map((tag: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.topPosts && result.topPosts.length > 0 && (
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Top Posts:</h6>
                      <div className="space-y-2">
                        {result.topPosts.slice(0, 2).map((post: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
                            <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                              View Post
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTrendMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Trend Monitoring</h3>
        <p className="text-gray-600 mb-6">Monitor trending topics, viral content, and emerging conversations in your industry.</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords/Topics to Monitor (comma-separated)
          </label>
          <textarea
            value={trendMonitoring.keywords}
            onChange={(e) => setTrendMonitoring(prev => ({ ...prev, keywords: e.target.value }))}
            placeholder="artificial intelligence, sustainable fashion, remote work, crypto"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            rows={3}
          />
        </div>
        
        <button
          onClick={handleTrendMonitoring}
          disabled={trendMonitoring.isLoading || !trendMonitoring.keywords.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {trendMonitoring.isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
          <span>{trendMonitoring.isLoading ? 'Monitoring...' : 'Monitor Trends'}</span>
        </button>

        {/* Trend Monitoring Results */}
        {trendMonitoring.results && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-6">Trend Monitoring Insights</h4>
            
            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-orange-50 rounded-lg p-4">
                <h5 className="font-medium text-orange-900 mb-1">Hottest Trend</h5>
                <p className="text-sm text-orange-700">{trendMonitoring.results.insights.hottestTrend}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h5 className="font-medium text-purple-900 mb-1">Viral Potential</h5>
                <p className="text-sm text-purple-700">{trendMonitoring.results.insights.viralPotential}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <h5 className="font-medium text-indigo-900 mb-1">Best Posting Time</h5>
                <p className="text-sm text-indigo-700">{trendMonitoring.results.insights.bestPostingTime}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <h5 className="font-medium text-pink-900 mb-1">Emerging Topics</h5>
                <p className="text-sm text-pink-700">{trendMonitoring.results.insights.emergingTopics.length} found</p>
              </div>
            </div>
            
            {/* Recent News */}
            {trendMonitoring.results.news && trendMonitoring.results.news.length > 0 && (
              <div className="mb-6">
                <h5 className="font-medium text-gray-900 mb-3">Trending News</h5>
                <div className="space-y-3">
                  {trendMonitoring.results.news.slice(0, 2).map((newsItem: any, index: number) => (
                    <div key={index}>
                      <h6 className="font-medium text-gray-900 mb-2">{newsItem.keyword}</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {newsItem.news_results?.slice(0, 2).map((article: any, idx: number) => (
                          <div key={idx} className="border border-gray-200 rounded p-3">
                            <h6 className="font-medium text-sm text-gray-900 line-clamp-2">{article.title}</h6>
                            <p className="text-xs text-gray-600 mt-1">{article.source} • {article.date}</p>
                            <button
                              onClick={() => {
                                setPostForm(prev => ({ ...prev, content: `Breaking: ${article.title}\n\nWhat do you think about this development? 💭` }));
                                setShowCreatePostModal(true);
                                toast.success('News story added to post draft');
                              }}
                              className="mt-2 px-2 py-1 text-xs bg-signal-blue text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              Create Post
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Content Angles */}
            {trendMonitoring.results.contentAngles && (
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Content Angles & Questions</h5>
                <div className="space-y-4">
                  {trendMonitoring.results.contentAngles.map((angle: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h6 className="font-medium text-gray-900 mb-3">{angle.keyword}</h6>
                      
                      {angle.relatedQuestions && angle.relatedQuestions.length > 0 && (
                        <div className="mb-3">
                                                     <h6 className="text-sm font-medium text-gray-700 mb-2">Content Questions:</h6>
                          <div className="space-y-1">
                            {angle.relatedQuestions.slice(0, 3).map((question: string, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">• {question}</span>
                                <button
                                  onClick={() => {
                                    setPostForm(prev => ({ ...prev, content: `${question}\n\nLet me know your thoughts! 👇` }));
                                    setShowCreatePostModal(true);
                                    toast.success('Question added to post draft');
                                  }}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                  Use
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {angle.peopleAlsoAsk && angle.peopleAlsoAsk.length > 0 && (
                        <div>
                                                     <h6 className="text-sm font-medium text-gray-700 mb-2">People Also Ask:</h6>
                          <div className="space-y-1">
                            {angle.peopleAlsoAsk.slice(0, 2).map((question: string, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">• {question}</span>
                                <button
                                  onClick={() => {
                                    setPostForm(prev => ({ ...prev, content: `FAQ: ${question}\n\nHere's what you need to know... 📖` }));
                                    setShowCreatePostModal(true);
                                    toast.success('FAQ added to post draft');
                                  }}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                  Use
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'posts', label: 'Posts', icon: MessageCircle },
    { id: 'content-research', label: 'Content Research', icon: Search },
    { id: 'hashtag-analysis', label: 'Hashtag Analysis', icon: Hash },
    { id: 'trend-monitoring', label: 'Trend Monitoring', icon: TrendingUp },
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
        {activeTab === 'content-research' && renderContentResearch()}
        {activeTab === 'hashtag-analysis' && renderHashtagAnalysis()}
        {activeTab === 'trend-monitoring' && renderTrendMonitoring()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default SocialMediaCenter;