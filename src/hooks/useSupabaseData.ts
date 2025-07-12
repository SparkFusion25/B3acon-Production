import { useState, useEffect } from 'react';
import { dbHelpers } from '../lib/supabase';

// Custom hook for loading data from Supabase
export const useSupabaseData = () => {
  const [data, setData] = useState({
    clients: [] as any[],
    leads: [] as any[],
    affiliates: [] as any[],
    emailCampaigns: [] as any[],
    landingPages: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Starting data load from Supabase...');

        // First check if Supabase is configured
        if (!dbHelpers.isConfigured()) {
          throw new Error('Supabase not configured. Please check environment variables.');
        }

        // Test connection first
        await dbHelpers.testConnection();

        console.log('🔄 Loading all data tables...');

        // Load all data with individual error handling
        const results = await Promise.allSettled([
          dbHelpers.getClients(),
          dbHelpers.getLeads(),
          dbHelpers.getAffiliates(),
          dbHelpers.getEmailCampaigns(),
          dbHelpers.getLandingPages()
        ]);

        // Check if any requests failed due to missing tables
        const hasTableErrors = results.some(result => 
          result.status === 'rejected' && 
          result.reason?.message?.includes('does not exist')
        );

        if (hasTableErrors) {
          console.log('⚠️ Database tables not found, using mock data');
          setError('Database not fully configured. Using demo data.');
          return;
        }

        const [clientsResult, leadsResult, affiliatesResult, emailCampaignsResult, landingPagesResult] = results;

        setData({
          clients: clientsResult.status === 'fulfilled' ? clientsResult.value : [] as any[],
          leads: leadsResult.status === 'fulfilled' ? leadsResult.value : [] as any[],
          affiliates: affiliatesResult.status === 'fulfilled' ? affiliatesResult.value : [] as any[],
          emailCampaigns: emailCampaignsResult.status === 'fulfilled' ? emailCampaignsResult.value : [] as any[],
          landingPages: landingPagesResult.status === 'fulfilled' ? landingPagesResult.value : [] as any[]
        });

        // Log any individual failures
        results.forEach((result, index) => {
          const tables = ['clients', 'leads', 'affiliates', 'emailCampaigns', 'landingPages'];
          if (result.status === 'rejected') {
            console.warn(`⚠️ Failed to load ${tables[index]}:`, result.reason);
          }
        });

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        console.log(`✅ Data loading completed: ${successCount}/5 tables loaded successfully`);

        // Only set error if ALL requests failed
        if (successCount === 0) {
          throw new Error('Failed to load any data from database');
        }

      } catch (err) {
        console.error('❌ Data loading failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        
        // Set empty data on error
        setData({
          clients: [] as any[],
          leads: [] as any[],
          affiliates: [] as any[],
          emailCampaigns: [] as any[],
          landingPages: [] as any[]
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};