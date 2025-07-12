import { useState, useEffect } from 'react';
import { dbHelpers } from '../lib/supabase';
import { mockAgencyData } from '../data/mockAgencyData';

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
          console.log('⚠️ Supabase not configured, using mock data');
          setError('Supabase not configured. Please check environment variables.');
          setData({
            clients: mockAgencyData.clients || [],
            leads: mockAgencyData.leads || [],
            affiliates: mockAgencyData.affiliates || [],
            emailCampaigns: mockAgencyData.emailCampaigns || [],
            landingPages: mockAgencyData.landingPages || []
          });
          return;
        }

        // Test connection first - if this fails, use mock data
        try {
          await dbHelpers.testConnection();
        } catch (connectionError) {
          console.log('⚠️ Database connection failed, using mock data');
          setError('Database not accessible. Using demo data. Please complete Supabase setup from SETUP_STAGE_1.md');
          setData({
            clients: mockAgencyData.clients || [],
            leads: mockAgencyData.leads || [],
            affiliates: mockAgencyData.affiliates || [],
            emailCampaigns: mockAgencyData.emailCampaigns || [],
            landingPages: mockAgencyData.landingPages || []
          });
          return;
        }

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
        const hasTableErrors = results.some(result => {
          if (result.status === 'rejected') {
            const error = result.reason;
            const errorMessage = error?.message || '';
            return errorMessage === 'TABLE_NOT_EXISTS';
          }
          return false;
        });

        if (hasTableErrors) {
          console.log('⚠️ Database tables not found, using mock data');
          setError('Database not fully configured. Using demo data. Please complete Supabase setup from SETUP_STAGE_1.md');
          
          // Use mock data when tables don't exist
          setData({
            clients: mockAgencyData.clients || [],
            leads: mockAgencyData.leads || [],
            affiliates: mockAgencyData.affiliates || [],
            emailCampaigns: mockAgencyData.emailCampaigns || [],
            landingPages: mockAgencyData.landingPages || []
          });
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
            const errorMessage = result.reason?.message || '';
            if (errorMessage !== 'TABLE_NOT_EXISTS') {
              console.warn(`⚠️ Failed to load ${tables[index]}:`, result.reason);
            }
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
        
        // Use mock data on error
        setData({
          clients: mockAgencyData.clients || [],
          leads: mockAgencyData.leads || [],
          affiliates: mockAgencyData.affiliates || [],
          emailCampaigns: mockAgencyData.emailCampaigns || [],
          landingPages: mockAgencyData.landingPages || []
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};