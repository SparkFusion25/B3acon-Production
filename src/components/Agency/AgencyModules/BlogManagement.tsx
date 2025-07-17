import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  Search, 
  Filter,
  Save,
  X,
  Image as ImageIcon,
  Tag,
  User,
  BarChart3,
  TrendingUp,
  Clock,
  Globe,
  Target,
  Users,
  Zap,
  BookOpen,
  Settings,
  Lightbulb,
  Upload,
  FileText,
  Hash,
  AlignLeft,
  Type,
  Link,
  Bold,
  Italic,
  List,
  Quote,
  Code
} from 'lucide-react';
import { BlogPost, BlogCategory, BlogStats, BlogSearchFilters } from '../../../types/blog';
import { toast } from 'react-hot-toast';

const BlogManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories' | 'analytics' | 'settings'>('posts');
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [searchFilters, setSearchFilters] = useState<BlogSearchFilters>({
    query: '',
    status: 'published',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  // Mock data
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'The Complete Guide to Shopify SEO: Boost Your Store Rankings in 2024',
      slug: 'complete-shopify-seo-guide-2024',
      excerpt: 'Master Shopify SEO with our comprehensive guide. Learn advanced techniques, tools, and strategies to dominate search rankings and drive organic traffic.',
      content: '<h2>Introduction</h2><p>Shopify SEO is crucial for e-commerce success...</p>',
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
    }
  ]);

  const [categories, setCategories] = useState<BlogCategory[]>([
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
    }
  ]);

  const [stats] = useState<BlogStats>({
    totalPosts: 45,
    publishedPosts: 38,
    draftPosts: 7,
    totalViews: 124567,
    totalComments: 892,
    categoriesCount: 6,
    authorsCount: 4,
    monthlyViews: [
      { month: 'Jan', views: 12000 },
      { month: 'Feb', views: 15000 },
      { month: 'Mar', views: 18000 },
      { month: 'Apr', views: 22000 },
      { month: 'May', views: 28000 },
      { month: 'Jun', views: 35000 }
    ],
    topPosts: [
      { id: '1', title: 'Complete Shopify SEO Guide', views: 2847 },
      { id: '2', title: 'Amazon FBA Success', views: 1923 },
      { id: '3', title: 'Global Commerce Trends', views: 1654 }
    ],
    topCategories: [
      { id: 'seo-optimization', name: 'SEO Optimization', posts: 15 },
      { id: 'global-commerce', name: 'Global Commerce', posts: 12 },
      { id: 'analytics', name: 'Analytics', posts: 11 }
    ]
  });

  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    imageAlt: '',
    categoryId: '',
    tags: '',
    status: 'draft' as const,
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    scheduledAt: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    color: 'bg-blue-500',
    icon: 'BookOpen'
  });

  const iconOptions = [
    { value: 'TrendingUp', label: 'Trending Up', component: TrendingUp },
    { value: 'Target', label: 'Target', component: Target },
    { value: 'Globe', label: 'Globe', component: Globe },
    { value: 'Users', label: 'Users', component: Users },
    { value: 'Zap', label: 'Zap', component: Zap },
    { value: 'BarChart3', label: 'Bar Chart', component: BarChart3 },
    { value: 'BookOpen', label: 'Book Open', component: BookOpen },
    { value: 'Settings', label: 'Settings', component: Settings },
    { value: 'Lightbulb', label: 'Lightbulb', component: Lightbulb }
  ];

  const colorOptions = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500',
    'bg-orange-500', 'bg-teal-500'
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost: BlogPost = {
      id: editingPost?.id || Date.now().toString(),
      ...postForm,
      slug: postForm.slug || postForm.title.toLowerCase().replace(/\s+/g, '-'),
      category: categories.find(c => c.id === postForm.categoryId)!,
      author: {
        id: '1',
        name: 'Current User',
        email: 'user@b3acon.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?auto=format&fit=crop&w=150&q=80',
        bio: 'Content Creator',
        title: 'Editor',
        socialLinks: {},
        isActive: true,
        postCount: 1,
        joinedAt: '2024-01-01'
      },
      authorId: '1',
      tags: postForm.tags.split(',').map(tag => tag.trim()),
      publishedAt: postForm.status === 'published' ? new Date().toISOString() : null,
      readingTime: Math.ceil(postForm.content.length / 1000),
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      seoKeywords: postForm.seoKeywords.split(',').map(keyword => keyword.trim()),
      createdAt: editingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? newPost : p));
      toast.success('Post updated successfully');
    } else {
      setPosts([newPost, ...posts]);
      toast.success('Post created successfully');
    }

    resetPostForm();
    setShowPostEditor(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCategory: BlogCategory = {
      id: editingCategory?.id || Date.now().toString(),
      ...categoryForm,
      slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      postCount: editingCategory?.postCount || 0,
      isActive: true,
      createdAt: editingCategory?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? newCategory : c));
      toast.success('Category updated successfully');
    } else {
      setCategories([...categories, newCategory]);
      toast.success('Category created successfully');
    }

    resetCategoryForm();
    setShowCategoryModal(false);
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      imageAlt: '',
      categoryId: '',
      tags: '',
      status: 'draft',
      isFeatured: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      scheduledAt: ''
    });
    setEditingPost(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      color: 'bg-blue-500',
      icon: 'BookOpen'
    });
    setEditingCategory(null);
  };

  const editPost = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      imageAlt: post.imageAlt,
      categoryId: post.categoryId,
      tags: post.tags.join(', '),
      status: post.status,
      isFeatured: post.isFeatured,
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      seoKeywords: post.seoKeywords?.join(', ') || '',
      scheduledAt: post.scheduledAt || ''
    });
    setShowPostEditor(true);
  };

  const editCategory = (category: BlogCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      icon: category.icon
    });
    setShowCategoryModal(true);
  };

  const deletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
      toast.success('Post deleted successfully');
    }
  };

  const deleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success('Category deleted successfully');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-1">Create and manage your blog content</p>
          </div>
          <button
            onClick={() => setShowPostEditor(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'posts', label: 'Posts', icon: FileText },
              { id: 'categories', label: 'Categories', icon: Tag },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchFilters.query}
                    onChange={(e) => setSearchFilters({...searchFilters, query: e.target.value})}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters({...searchFilters, status: e.target.value as any})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {posts.length} post{posts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={post.featuredImage}
                          alt={post.imageAlt}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500">{post.excerpt.substring(0, 60)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.category.color} text-white`}>
                        {post.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className="text-sm text-gray-900">{post.author.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.viewCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => editPost(post)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = iconOptions.find(icon => icon.value === category.icon)?.component || BookOpen;
                return (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editCategory(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{category.postCount} posts</span>
                      <span className="text-xs">{formatDate(category.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.publishedPosts}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comments</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalComments}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Views</h3>
              <div className="space-y-3">
                {stats.monthlyViews.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(month.views / 35000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-16 text-right">
                        {month.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Posts</h3>
              <div className="space-y-4">
                {stats.topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                      <p className="text-sm text-gray-500">{post.views.toLocaleString()} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Editor Modal */}
      {showPostEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h3>
              <button
                onClick={() => {
                  setShowPostEditor(false);
                  resetPostForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={postForm.slug}
                    onChange={(e) => setPostForm({...postForm, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <div className="border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
                    <button type="button" className="p-1 text-gray-600 hover:text-gray-800">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 text-gray-600 hover:text-gray-800">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 text-gray-600 hover:text-gray-800">
                      <List className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 text-gray-600 hover:text-gray-800">
                      <Link className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 text-gray-600 hover:text-gray-800">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                    rows={12}
                    className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none resize-none"
                    placeholder="Write your post content here..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={postForm.featuredImage}
                    onChange={(e) => setPostForm({...postForm, featuredImage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
                  <input
                    type="text"
                    value={postForm.imageAlt}
                    onChange={(e) => setPostForm({...postForm, imageAlt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={postForm.categoryId}
                    onChange={(e) => setPostForm({...postForm, categoryId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={postForm.status}
                    onChange={(e) => setPostForm({...postForm, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seo, shopify, ecommerce"
                  />
                </div>
              </div>

              {/* SEO Fields */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={postForm.seoTitle}
                      onChange={(e) => setPostForm({...postForm, seoTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">{postForm.seoTitle.length}/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                    <textarea
                      value={postForm.seoDescription}
                      onChange={(e) => setPostForm({...postForm, seoDescription: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">{postForm.seoDescription.length}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={postForm.seoKeywords}
                      onChange={(e) => setPostForm({...postForm, seoKeywords: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="shopify seo, ecommerce optimization"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={postForm.isFeatured}
                    onChange={(e) => setPostForm({...postForm, isFeatured: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Mark as featured post
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPostEditor(false);
                      resetPostForm();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  resetCategoryForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCategoryForm({...categoryForm, color})}
                      className={`w-8 h-8 rounded-full ${color} ${
                        categoryForm.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    resetCategoryForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;