// Affiliate Marketing Types
export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  commission_rate: number;
  total_earnings: number;
  total_referrals: number;
  conversion_rate: number;
  payment_method: 'paypal' | 'bank_transfer' | 'check';
  payment_details: Record<string, any>;
  referral_code: string;
  joined_date: string;
  last_activity: string;
  notes?: string;
}

export interface AffiliateLink {
  id: string;
  affiliate_id: string;
  campaign_name: string;
  original_url: string;
  tracking_url: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission_earned: number;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface AffiliateCommission {
  id: string;
  affiliate_id: string;
  referral_id: string;
  amount: number;
  commission_rate: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  transaction_date: string;
  payment_date?: string;
  notes?: string;
}

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  client_name: string;
  client_email: string;
  service_type: string;
  deal_value: number;
  commission_amount: number;
  status: 'lead' | 'qualified' | 'converted' | 'lost';
  referral_date: string;
  conversion_date?: string;
  tracking_data: Record<string, any>;
}

export interface AffiliatePayment {
  id: string;
  affiliate_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed';
  commissions_included: string[];
  notes?: string;
}