// Landing Page Builder Types
export interface LandingPage {
  id: string;
  name: string;
  title: string;
  description?: string;
  slug: string;
  domain?: string;
  status: 'draft' | 'published' | 'archived';
  template_id?: string;
  client_id?: string;
  content: LandingPageContent;
  seo: LandingPageSEO;
  settings: LandingPageSettings;
  analytics: LandingPageAnalytics;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface LandingPageContent {
  sections: LandingPageSection[];
  global_styles: Record<string, any>;
  custom_css?: string;
  custom_js?: string;
}

export interface LandingPageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'contact' | 'custom';
  order: number;
  visible: boolean;
  content: Record<string, any>;
  styles: Record<string, any>;
  animations?: Record<string, any>;
}

export interface LandingPageSEO {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots: string;
  schema_markup?: Record<string, any>;
}

export interface LandingPageSettings {
  favicon?: string;
  google_analytics_id?: string;
  facebook_pixel_id?: string;
  custom_tracking_codes?: string[];
  password_protection?: {
    enabled: boolean;
    password: string;
  };
  redirect_after_conversion?: string;
  thank_you_page?: string;
}

export interface LandingPageAnalytics {
  total_views: number;
  unique_visitors: number;
  conversions: number;
  conversion_rate: number;
  bounce_rate: number;
  avg_time_on_page: number;
  traffic_sources: TrafficSource[];
  device_breakdown: DeviceBreakdown;
  geographic_data: GeographicData[];
}

export interface TrafficSource {
  source: string;
  visitors: number;
  conversions: number;
  conversion_rate: number;
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface GeographicData {
  country: string;
  visitors: number;
  conversions: number;
}

export interface LandingPageTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'business' | 'ecommerce' | 'saas' | 'agency' | 'event' | 'custom';
  thumbnail: string;
  preview_url?: string;
  content: LandingPageContent;
  is_premium: boolean;
  usage_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface LandingPageForm {
  id: string;
  landing_page_id: string;
  name: string;
  fields: FormField[];
  settings: FormSettings;
  integrations: FormIntegration[];
  submissions: FormSubmission[];
  analytics: FormAnalytics;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: Record<string, any>;
  options?: string[];
  order: number;
}

export interface FormSettings {
  submit_button_text: string;
  success_message: string;
  error_message: string;
  redirect_url?: string;
  email_notifications: {
    enabled: boolean;
    recipients: string[];
    subject: string;
  };
  auto_responder: {
    enabled: boolean;
    subject: string;
    message: string;
  };
}

export interface FormIntegration {
  id: string;
  type: 'email_marketing' | 'crm' | 'webhook' | 'zapier';
  provider: string;
  configuration: Record<string, any>;
  is_active: boolean;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  data: Record<string, any>;
  ip_address: string;
  user_agent: string;
  referrer?: string;
  submitted_at: string;
  status: 'new' | 'processed' | 'spam';
}

export interface FormAnalytics {
  total_submissions: number;
  conversion_rate: number;
  abandonment_rate: number;
  avg_completion_time: number;
  field_analytics: FieldAnalytics[];
}

export interface FieldAnalytics {
  field_id: string;
  completion_rate: number;
  avg_time_to_complete: number;
  error_rate: number;
}