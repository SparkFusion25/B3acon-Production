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
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching clients:', error);
        // Check if table doesn't exist
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log('⚠️ Clients table does not exist, database setup required');
          throw new Error('TABLE_NOT_EXISTS');
        }
        throw new Error(`Failed to fetch clients: ${error.message}`);
      }
      
      console.log('✅ Clients fetched:', data?.length || 0);
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message === 'TABLE_NOT_EXISTS') {
        throw err;
      }
      console.error('❌ Database error fetching clients:', err);
      throw err;
    }
  },

  // Get all leads
  async getLeads() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching leads from Supabase...');
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching leads:', error);
        // Check if table doesn't exist
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log('⚠️ Leads table does not exist, database setup required');
          throw new Error('TABLE_NOT_EXISTS');
        }
        throw new Error(`Failed to fetch leads: ${error.message}`);
      }
      
      console.log('✅ Leads fetched:', data?.length || 0);
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message === 'TABLE_NOT_EXISTS') {
        throw err;
      }
      console.error('❌ Database error fetching leads:', err);
      throw err;
    }
  },

  // Get all affiliates
  async getAffiliates() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching affiliates from Supabase...');
    
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching affiliates:', error);
        // Check if table doesn't exist
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log('⚠️ Affiliates table does not exist, database setup required');
          throw new Error('TABLE_NOT_EXISTS');
        }
        throw new Error(`Failed to fetch affiliates: ${error.message}`);
      }
      
      console.log('✅ Affiliates fetched:', data?.length || 0);
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message === 'TABLE_NOT_EXISTS') {
        throw err;
      }
      console.error('❌ Database error fetching affiliates:', err);
      throw err;
    }
  },

  // Get email campaigns
  async getEmailCampaigns() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching email campaigns from Supabase...');
    
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching email campaigns:', error);
        // Check if table doesn't exist
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log('⚠️ Email campaigns table does not exist, database setup required');
          throw new Error('TABLE_NOT_EXISTS');
        }
        throw new Error(`Failed to fetch email campaigns: ${error.message}`);
      }
      
      console.log('✅ Email campaigns fetched:', data?.length || 0);
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message === 'TABLE_NOT_EXISTS') {
        throw err;
      }
      console.error('❌ Database error fetching email campaigns:', err);
      throw err;
    }
  },

  // Get landing pages
  async getLandingPages() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables');
    }

    console.log('📊 Fetching landing pages from Supabase...');
    
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching landing pages:', error);
        // Check if table doesn't exist
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log('⚠️ Landing pages table does not exist, database setup required');
          throw new Error('TABLE_NOT_EXISTS');
        }
        throw new Error(`Failed to fetch landing pages: ${error.message}`);
      }
      
      console.log('✅ Landing pages fetched:', data?.length || 0);
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message === 'TABLE_NOT_EXISTS') {
        throw err;
      }
      console.error('❌ Database error fetching landing pages:', err);
      throw err;
    }
  },

  // Test connection
  async testConnection() {
    if (!supabase) {
      throw new Error('Supabase not configured - missing environment variables. Check your .env file.');
    }

    console.log('🔍 Testing Supabase connection...');
    
    try {
      // Try a simple query to test the connection - use a table that should exist
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        // If profiles table doesn't exist either, just test auth
        console.warn('⚠️ Tables not found, testing basic connection...');
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
          throw new Error(`Connection test failed: ${authError.message}`);
        }
        console.log('✅ Basic Supabase connection successful (tables need setup)');
        return true;
      }
      
      console.log('✅ Supabase connection successful!', data);
      return true;
    } catch (err) {
      console.error('❌ Connection test error:', err);
      throw err;
    }
  }
};