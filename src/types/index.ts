// Database Models
export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  subscription_plan: 'starter' | 'growth' | 'pro';
  created_at: string;
  updated_at: string;
  avatar?: string;
  total_spent?: number;
  last_activity?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  source: 'website' | 'referral' | 'social' | 'email' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  created_at: string;
  updated_at: string;
  notes?: string;
  assigned_to?: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  commission_rate: number;
  total_earnings: number;
  referral_code: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
  payment_method?: string;
  last_payout?: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'archived';
  recipients_count: number;
  open_rate?: number;
  click_rate?: number;
  created_at: string;
  updated_at: string;
  scheduled_at?: string;
  sent_at?: string;
}

export interface LandingPage {
  id: string;
  name: string;
  url: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  conversions: number;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
  template_id?: string;
  custom_css?: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  user_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff: boolean;
  created_at: string;
  attachments?: string[];
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  preview_url?: string;
  css_variables: Record<string, string>;
  created_at: string;
  updated_at: string;
  is_default: boolean;
}

export interface AmazonProduct {
  asin: string;
  title: string;
  price: string;
  image_url: string;
  rating: number;
  review_count: number;
  availability: string;
  category: string;
  brand?: string;
  description?: string;
}

export interface CreativeAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  format: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'specialist' | 'client';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  last_login?: string;
  avatar?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  code: string;
  start_date: string;
  end_date: string;
  usage_limit?: number;
  used_count: number;
  status: 'active' | 'inactive' | 'expired';
}

export interface LeadService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  provider: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  score: number;
  source: string;
  created_at: string;
}

export interface Database {
  id: string;
  name: string;
  description: string;
  record_count: number;
  categories: string[];
  last_updated: string;
  access_level: 'free' | 'premium' | 'enterprise';
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date: string;
  end_date?: string;
  target_audience: string;
  budget: number;
  spent: number;
  leads_generated: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignStep {
  id: string;
  campaign_id: string;
  step_number: number;
  title: string;
  description: string;
  type: 'email' | 'sms' | 'call' | 'task';
  delay_days: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface HSCodeResult {
  code: string;
  description: string;
  chapter: string;
  section: string;
  duty_rate?: string;
  additional_info?: string;
}

// API Response Types
export interface SupabaseDataResponse {
  clients: Client[];
  leads: Lead[];
  affiliates: Affiliate[];
  emailCampaigns: EmailCampaign[];
  landingPages: LandingPage[];
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  company: string;
  type: 'agency' | 'client';
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}