import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Clock, 
  ArrowRight, 
  TrendingUp,
  BookOpen,
  Zap,
  Target,
  Globe,
  Settings,
  Users,
  BarChart3,
  Lightbulb,
  Star,
  Share2,
  Heart,
  MessageCircle,
  Tag
} from 'lucide-react';
import { BlogPost, BlogCategory, BlogSearchFilters } from '../../types/blog';

interface BlogPageProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  featuredPost?: BlogPost;
}

const BlogPage: React.FC<BlogPageProps> = ({ posts, categories, featuredPost }) => {
  const [searchFilters, setSearchFilters] = useState<BlogSearchFilters>({
    query: '',
    categoryId: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 9
  });
  
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Complete Guide to Shopify SEO: Boost Your Store Rankings in 2024',
      slug: 'complete-shopify-seo-guide-2024',
      excerpt: 'Master Shopify SEO with our comprehensive guide. Learn advanced techniques, tools, and strategies to dominate search rankings and drive organic traffic.',
      content: '',
      featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Shopify SEO optimization dashboard',
      categoryId: 'seo-optimization',
      category: {
        id: 'seo-optimization',
        name: 'SEO Optimization',
        slug: 'seo-optimization',
        description: 'Advanced SEO strategies and techniques',
        color: 'bg-blue-500',
        icon: 'TrendingUp',
        postCount: 15,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      authorId: '1',
      author: {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah@b3acon.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?auto=format&fit=crop&w=150&q=80',
        bio: 'SEO Expert & Digital Marketing Strategist',
        title: 'Head of SEO',
        socialLinks: { twitter: '@sarahchen', linkedin: 'sarahchen' },
        isActive: true,
        postCount: 24,
        joinedAt: '2023-06-01'
      },
      tags: ['shopify', 'seo', 'ecommerce', 'optimization'],
      status: 'published',
      publishedAt: '2024-01-15T10:00:00Z',
      scheduledAt: null,
      readingTime: 12,
      viewCount: 2847,
      likeCount: 156,
      shareCount: 89,
      isFeatured: true,
      seoTitle: 'Complete Shopify SEO Guide 2024 | B3ACON',
      seoDescription: 'Master Shopify SEO with proven strategies. Boost rankings, drive traffic, and increase sales.',
      seoKeywords: ['shopify seo', 'ecommerce optimization', 'search engine optimization'],
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Amazon FBA Success: How to Optimize Product Listings for Maximum Visibility',
      slug: 'amazon-fba-product-listing-optimization',
      excerpt: 'Discover the secrets to creating high-converting Amazon listings. Learn keyword research, image optimization, and ranking strategies.',
      content: '',
      featuredImage: 'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Amazon FBA optimization tools',
      categoryId: 'amazon-optimization',
      category: {
        id: 'amazon-optimization',
        name: 'Amazon Optimization',
        slug: 'amazon-optimization',
        description: 'Amazon selling strategies and tips',
        color: 'bg-orange-500',
        icon: 'Target',
        postCount: 8,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      authorId: '2',
      author: {
        id: '2',
        name: 'Marcus Rodriguez',
        email: 'marcus@b3acon.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        bio: 'Amazon FBA Expert & E-commerce Consultant',
        title: 'Senior Amazon Specialist',
        socialLinks: { twitter: '@marcusrodz', linkedin: 'marcusrodriguez' },
        isActive: true,
        postCount: 18,
        joinedAt: '2023-08-15'
      },
      tags: ['amazon', 'fba', 'product-listing', 'keyword-research'],
      status: 'published',
      publishedAt: '2024-01-12T14:30:00Z',
      scheduledAt: null,
      readingTime: 8,
      viewCount: 1923,
      likeCount: 124,
      shareCount: 67,
      isFeatured: false,
      createdAt: '2024-01-08T12:00:00Z',
      updatedAt: '2024-01-12T14:30:00Z'
    },
    {
      id: '3',
      title: 'Global Commerce Trends 2024: What E-commerce Businesses Need to Know',
      slug: 'global-commerce-trends-2024',
      excerpt: 'Stay ahead of the curve with our analysis of emerging global commerce trends, cross-border strategies, and market opportunities.',
      content: '',
      featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Global commerce analytics dashboard',
      categoryId: 'global-commerce',
      category: {
        id: 'global-commerce',
        name: 'Global Commerce',
        slug: 'global-commerce',
        description: 'International trade and commerce insights',
        color: 'bg-green-500',
        icon: 'Globe',
        postCount: 12,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      authorId: '3',
      author: {
        id: '3',
        name: 'Elena Kowalski',
        email: 'elena@b3acon.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        bio: 'Global Trade Expert & Market Analyst',
        title: 'Director of Global Commerce',
        socialLinks: { twitter: '@elenakowalski', linkedin: 'elenakowalski' },
        isActive: true,
        postCount: 15,
        joinedAt: '2023-05-20'
      },
      tags: ['global-commerce', 'trends', 'cross-border', 'analytics'],
      status: 'published',
      publishedAt: '2024-01-10T09:00:00Z',
      scheduledAt: null,
      readingTime: 15,
      viewCount: 1654,
      likeCount: 98,
      shareCount: 45,
      isFeatured: false,
      createdAt: '2024-01-05T16:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z'
    }
  ];

  const mockCategories: BlogCategory[] = [
    {
      id: 'seo-optimization',
      name: 'SEO Optimization',
      slug: 'seo-optimization',
      description: 'Advanced SEO strategies and techniques',
      color: 'bg-blue-500',
      icon: 'TrendingUp',
      postCount: 15,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'amazon-optimization',
      name: 'Amazon Optimization',
      slug: 'amazon-optimization',
      description: 'Amazon selling strategies and tips',
      color: 'bg-orange-500',
      icon: 'Target',
      postCount: 8,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'global-commerce',
      name: 'Global Commerce',
      slug: 'global-commerce',
      description: 'International trade and commerce insights',
      color: 'bg-green-500',
      icon: 'Globe',
      postCount: 12,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'agency-tools',
      name: 'Agency Tools',
      slug: 'agency-tools',
      description: 'Tools and strategies for agencies',
      color: 'bg-purple-500',
      icon: 'Users',
      postCount: 6,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'automation',
      name: 'Automation',
      slug: 'automation',
      description: 'Workflow automation and efficiency',
      color: 'bg-yellow-500',
      icon: 'Zap',
      postCount: 9,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      slug: 'analytics',
      description: 'Data analysis and insights',
      color: 'bg-indigo-500',
      icon: 'BarChart3',
      postCount: 11,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  useEffect(() => {
    // Filter posts based on search criteria
    let filtered = mockPosts;

    if (searchFilters.query) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchFilters.query!.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchFilters.query!.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchFilters.query!.toLowerCase()))
      );
    }

    if (searchFilters.categoryId) {
      filtered = filtered.filter(post => post.categoryId === searchFilters.categoryId);
    }

    setFilteredPosts(filtered);
  }, [searchFilters]);

  const handleSearch = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query, page: 1 }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSearchFilters(prev => ({ 
      ...prev, 
      categoryId: categoryId === prev.categoryId ? '' : categoryId, 
      page: 1 
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      TrendingUp, Target, Globe, Users, Zap, BarChart3, BookOpen, Settings, Lightbulb
    };
    return icons[iconName] || BookOpen;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-signal-blue to-beacon-orange text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              B3ACON Insights
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Stay ahead with expert insights on SEO, e-commerce optimization, and global commerce trends
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, guides, and insights..."
                  value={searchFilters.query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border-0 shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleCategoryFilter('')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                !searchFilters.categoryId
                  ? 'bg-gradient-to-r from-signal-blue to-beacon-orange text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {mockCategories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    searchFilters.categoryId === category.id
                      ? `${category.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                  <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                    {category.postCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {mockPosts[0] && !searchFilters.query && !searchFilters.categoryId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={mockPosts[0].featuredImage}
                  alt={mockPosts[0].imageAlt}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="flex items-center mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className={`ml-3 px-3 py-1 ${mockPosts[0].category.color} text-white rounded-full text-sm font-medium`}>
                    {mockPosts[0].category.name}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {mockPosts[0].title}
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {mockPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img
                      src={mockPosts[0].author.avatar}
                      alt={mockPosts[0].author.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{mockPosts[0].author.name}</p>
                      <p className="text-gray-500 text-sm">{mockPosts[0].author.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(mockPosts[0].publishedAt!)}
                  </div>
                </div>
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold">
                  Read Full Article
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {searchFilters.categoryId 
              ? `${mockCategories.find(c => c.id === searchFilters.categoryId)?.name} Articles`
              : searchFilters.query 
                ? `Search Results for "${searchFilters.query}"`
                : 'Latest Articles'
            }
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={post.featuredImage}
                  alt={post.imageAlt}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 ${post.category.color} text-white rounded-full text-sm font-medium`}>
                    {post.category.name}
                  </span>
                </div>
                {post.isFeatured && (
                  <div className="absolute top-4 right-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-signal-blue transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{post.author.name}</p>
                      <p className="text-gray-500 text-xs">{post.author.title}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishedAt!)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readingTime} min read
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-sm">{post.viewCount}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-sm">{post.likeCount}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">12</span>
                    </div>
                  </div>
                  <button className="text-signal-blue hover:text-beacon-orange font-medium flex items-center">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                {post.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with B3ACON Insights</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest SEO tips, e-commerce strategies, and industry insights delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-r-lg hover:shadow-lg transition-all duration-200 font-semibold">
                Subscribe
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Join 10,000+ professionals. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;