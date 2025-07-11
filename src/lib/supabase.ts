import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Connection Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'MISSING',
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
  timestamp: new Date().toISOString()
});

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing from environment variables');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing from environment variables');
}

// Create client even if env vars are missing (for development)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database helper functions with better error handling
export const dbHelpers = {
  // Check if Supabase is properly configured
  isConfigured() {
    const configured = !!supabase;
    console.log('🔧 Supabase configured:', configured);
    return configured;
  },

  // Get all clients
  async getClients() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching clients from Supabase...');
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching clients:', error);
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }
    
    console.log('✅ Clients fetched:', data?.length || 0);
    return data || [];
  },

  // Get all leads
  async getLeads() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching leads from Supabase...');
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching leads:', error);
      throw new Error(`Failed to fetch leads: ${error.message}`);
    }
    
    console.log('✅ Leads fetched:', data?.length || 0);
    return data || [];
  },

  // Get all affiliates
  async getAffiliates() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching affiliates from Supabase...');
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching affiliates:', error);
      throw new Error(`Failed to fetch affiliates: ${error.message}`);
    }
    
    console.log('✅ Affiliates fetched:', data?.length || 0);
    return data || [];
  },

  // Get email campaigns
  async getEmailCampaigns() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching email campaigns from Supabase...');
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching email campaigns:', error);
      throw new Error(`Failed to fetch email campaigns: ${error.message}`);
    }
    
    console.log('✅ Email campaigns fetched:', data?.length || 0);
    return data || [];
  },

  // Get landing pages
  async getLandingPages() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching landing pages from Supabase...');
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching landing pages:', error);
      throw new Error(`Failed to fetch landing pages: ${error.message}`);
    }
    
    console.log('✅ Landing pages fetched:', data?.length || 0);
    return data || [];
  },

  // Test connection
  async testConnection() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables. Check your .env file.');
    }

    console.log('🔍 Testing Supabase connection...');
    
    try {
      // Try a simple query to test the connection
      const { data, error } = await supabase
        .from('clients')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ Connection test failed:', error.message);
        throw new Error(`Connection test failed: ${error.message}`);
      }
      
      console.log('✅ Supabase connection successful!', data);
      return true;
    } catch (err) {
      console.error('❌ Connection test error:', err);
      throw err;
    }
  }
};