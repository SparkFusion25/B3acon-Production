// Email Marketing Types
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  preview_text?: string;
  content: string;
  template_id?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  campaign_type: 'newsletter' | 'promotional' | 'automated' | 'transactional';
  client_id?: string;
  list_ids: string[];
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  stats: EmailCampaignStats;
}

export interface EmailCampaignStats {
  total_sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  spam_complaints: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
}

export interface EmailList {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  subscriber_count: number;
  active_subscribers: number;
  growth_rate: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  custom_fields: EmailCustomField[];
}

export interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  source: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  tags: string[];
  custom_fields: Record<string, any>;
  engagement_score: number;
  last_activity: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'newsletter' | 'promotional' | 'welcome' | 'abandoned_cart' | 'custom';
  html_content: string;
  text_content?: string;
  thumbnail?: string;
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmailAutomation {
  id: string;
  name: string;
  description?: string;
  trigger_type: 'signup' | 'purchase' | 'abandoned_cart' | 'birthday' | 'custom';
  trigger_conditions: Record<string, any>;
  status: 'active' | 'paused' | 'draft';
  client_id?: string;
  steps: EmailAutomationStep[];
  stats: EmailAutomationStats;
  created_at: string;
  updated_at: string;
}

export interface EmailAutomationStep {
  id: string;
  order: number;
  delay_amount: number;
  delay_unit: 'minutes' | 'hours' | 'days' | 'weeks';
  email_template_id: string;
  conditions?: Record<string, any>;
}

export interface EmailAutomationStats {
  total_triggered: number;
  completed: number;
  conversion_rate: number;
  revenue_generated: number;
}

export interface EmailCustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  options?: string[];
  required: boolean;
  default_value?: any;
}

export interface EmailProvider {
  id: string;
  name: 'klaviyo' | 'constant_contact' | 'mailchimp' | 'sendgrid' | 'custom';
  display_name: string;
  api_key?: string;
  api_secret?: string;
  configuration: Record<string, any>;
  is_connected: boolean;
  last_sync: string;
}