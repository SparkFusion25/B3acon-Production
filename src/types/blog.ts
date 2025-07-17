export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  postCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  title: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  isActive: boolean;
  postCount: number;
  joinedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  categoryId: string;
  category: BlogCategory;
  authorId: string;
  author: BlogAuthor;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt: string | null;
  scheduledAt: string | null;
  readingTime: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  parentId?: string;
  replies?: BlogComment[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  categoriesCount: number;
  authorsCount: number;
  monthlyViews: { month: string; views: number }[];
  topPosts: { id: string; title: string; views: number }[];
  topCategories: { id: string; name: string; posts: number }[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'sales' | 'support' | 'partnership' | 'demo';
  status: 'new' | 'replied' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  category: FAQCategory;
  order: number;
  isPublished: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isPublished: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  id: string;
  email: string;
  name?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  source: 'blog' | 'landing' | 'dashboard' | 'footer';
  tags: string[];
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface BlogSearchFilters {
  query?: string;
  categoryId?: string;
  authorId?: string;
  tags?: string[];
  status?: BlogPost['status'];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: any;
}