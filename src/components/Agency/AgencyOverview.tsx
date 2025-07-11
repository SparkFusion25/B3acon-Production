import React from 'react';
import { Users, DollarSign, TrendingUp, Target, Calendar, AlertCircle, CheckCircle, Clock, BarChart3, MessageCircle } from 'lucide-react';
import type { AgencyOverviewData } from '../../types/agency';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { toast } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

interface AgencyOverviewProps {
  data: AgencyOverviewData;
}

const AgencyOverview: React.FC<AgencyOverviewProps> = ({ data }) => {
  const { data: supabaseData, loading, error } = useSupabaseData();

  // Comprehensive debug information
  const debugInfo = {
    hasSupabaseUrl: !!(import.meta as any).env?.VITE_SUPABASE_URL,
    hasSupabaseKey: !!(import.meta as any).env?.VITE_SUPABASE_ANON_KEY,
    supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL?.substring(0, 30) + '...',
    timestamp: new Date().toISOString(),
    nodeEnv: (import.meta as any).env?.MODE,
    allEnvVars: Object.keys((import.meta as any).env || {}).filter((key: string) => key.startsWith('VITE_')),
    dataLoaded: {
      clients: supabaseData.clients.length,
      leads: supabaseData.leads.length,
      affiliates: supabaseData.affiliates.length,
      emailCampaigns: supabaseData.emailCampaigns.length,
      landingPages: supabaseData.landingPages.length
    }
  };

  console.log('🔧 AgencyOverview Debug:', { loading, error, supabaseData, debugInfo });

  // Show connection status
  const connectionStatus = () => {
    if (loading) return '🔄 Connecting to database...';
    if (error) return `❌ Database error: ${error}`;
    return `✅ Connected! Found ${supabaseData.clients.length} clients, ${supabaseData.leads.length} leads`;
  };

  const handleQuickAction = (action: string) => {
    toast.success(`Action triggered: ${action}`);
  };

  const handleQuickAction = (action: string) => {
    toast.success(`Action triggered: ${action}`);
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Enhanced debug info */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-3">🔧 B3ACON System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1 font-mono text-blue-800">
            <div><strong>Environment:</strong> {debugInfo.nodeEnv}</div>
            <div><strong>Supabase URL:</strong> {debugInfo.hasSupabaseUrl ? '✅ Found' : '❌ Missing'}</div>
            <div><strong>Supabase Key:</strong> {debugInfo.hasSupabaseKey ? '✅ Found' : '❌ Missing'}</div>
            <div><strong>Loading:</strong> {loading ? '🔄 Yes' : '✅ No'}</div>
            <div><strong>Error:</strong> {error ? `❌ ${error}` : '✅ None'}</div>
          </div>
          <div className="space-y-1 font-mono text-green-800">
            <div><strong>📊 Data Loaded:</strong></div>
            <div>• Clients: {debugInfo.dataLoaded.clients}</div>
            <div>• Leads: {debugInfo.dataLoaded.leads}</div>
            <div>• Affiliates: {debugInfo.dataLoaded.affiliates}</div>
            <div>• Email Campaigns: {debugInfo.dataLoaded.emailCampaigns}</div>
            <div>• Landing Pages: {debugInfo.dataLoaded.landingPages}</div>
          </div>
        </div>
        
        {!loading && !error && (
          <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
            <strong>🎉 SUCCESS:</strong> Database connected and {Object.values(debugInfo.dataLoaded).reduce((a, b) => a + b, 0)} records loaded!
          </div>
        )}
      </div>
      
      {/* Show sample data preview if loaded */}
      {!loading && !error && supabaseData.clients.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">📋 Sample Data Preview</h3>
          <div className="text-sm text-green-800 space-y-1">
            <div><strong>Latest Client:</strong> {(supabaseData.clients[0] as any)?.name || 'None'}</div>
            <div><strong>Latest Lead:</strong> {(supabaseData.leads[0] as any)?.name || 'None'}</div>
            <div><strong>Latest Affiliate:</strong> {(supabaseData.affiliates[0] as any)?.name || 'None'}</div>
          </div>
        </div>
      )}

      {/* Environment Variables Check */}
      {(!debugInfo.hasSupabaseUrl || !debugInfo.hasSupabaseKey) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-900 mb-2">❌ Configuration Error</h3>
          <div className="text-sm text-red-800 space-y-1">
            <div>Supabase URL: {debugInfo.hasSupabaseUrl ? '✅ Set' : '❌ Missing'}</div>
            <div>Supabase Key: {debugInfo.hasSupabaseKey ? '✅ Set' : '❌ Missing'}</div>
            <div className="mt-2 p-2 bg-red-100 rounded">
              <strong>Action Required:</strong> Please set up your Supabase environment variables in Netlify.
            </div>
          </div>
        </div>
      )}

      {/* Database Connection Status */}
      <div className={`mb-6 p-4 rounded-lg border ${
        loading ? 'bg-blue-50 border-blue-200' :
        error ? 'bg-red-50 border-red-200' :
        'bg-green-50 border-green-200'
      }`}>
        <h3 className="font-medium text-gray-900 mb-2">Database Connection Status</h3>
        <p className="text-sm text-gray-700 font-mono">{connectionStatus()}</p>
        {!loading && !error && (
          <div className="mt-2 text-xs text-gray-600">
            <div>• Email Campaigns: {supabaseData.emailCampaigns.length}</div>
            <div>• Landing Pages: {supabaseData.landingPages.length}</div>
            <div>• Affiliates: {supabaseData.affiliates.length}</div>
          </div>
        )}
        {error && (
          <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded text-sm">
            <strong className="text-red-900">Troubleshooting Steps:</strong>
            <ol className="mt-1 text-red-800 list-decimal list-inside space-y-1">
              <li>Check that your Supabase project is active</li>
              <li>Verify environment variables are set in Netlify</li>
              <li>Ensure your database tables exist</li>
            </ol>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Clients</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{data.totalClients}</div>
          <p className="text-sm text-green-600">↗ +{data.clientGrowth}% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">${data.monthlyRevenue.toLocaleString()}</div>
          <p className="text-sm text-green-600">↗ +{data.revenueGrowth}% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Projects</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{data.activeProjects}</div>
          <p className="text-sm text-blue-600">Across all clients</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Team Utilization</h3>
           <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{data.teamUtilization}%</div>
          <p className="text-sm text-yellow-600">Optimal range: 75-85%</p>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Recent Activity</h3>
          <div className="space-y-3 lg:space-y-4">
            {data.recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 ${
                  activity.type === 'client' ? 'bg-blue-500' :
                  activity.type === 'project' ? 'bg-green-500' :
                  activity.type === 'billing' ? 'bg-purple-500' :
                  'bg-orange-500'
                } rounded-full flex items-center justify-center flex-shrink-0`}>
                  {activity.type === 'client' && <Users className="w-4 h-4 text-white" />}
                  {activity.type === 'project' && <Target className="w-4 h-4 text-white" />}
                  {activity.type === 'billing' && <DollarSign className="w-4 h-4 text-white" />}
                  {activity.type === 'team' && <TrendingUp className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Alerts & Notifications</h3>
          <div className="space-y-3 lg:space-y-4">
            {data.alerts.map((alert: any, index: number) => (
              <div key={index} className={`p-4 rounded-lg border ${
                alert.priority === 'high' ? 'bg-red-50 border-red-200' :
                alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.priority === 'high' ? 'bg-red-500' :
                    alert.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}>
                    {alert.priority === 'high' && <AlertCircle className="w-4 h-4 text-white" />}
                    {alert.priority === 'medium' && <Clock className="w-4 h-4 text-white" />}
                    {alert.priority === 'low' && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <button 
            onClick={() => handleQuickAction('Add New Client')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            onClick={() => handleQuickAction('Add New Client')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Users className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="font-medium text-sm lg:text-base">Add New Client</span>
          </button>
          <button 
            onClick={() => handleQuickAction('Create Project')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            onClick={() => handleQuickAction('Create Project')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Target className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="font-medium text-sm lg:text-base">Create Project</span>
          </button>
          <button 
            onClick={() => handleQuickAction('Schedule Meeting')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            onClick={() => handleQuickAction('Schedule Meeting')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="font-medium text-sm lg:text-base">Schedule Meeting</span>
          </button>
          <button 
            onClick={() => handleQuickAction('Generate Invoice')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            onClick={() => handleQuickAction('Generate Invoice')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="font-medium text-sm lg:text-base">Generate Invoice</span>
          </button>
        </div>
      </div>
      
      {/* Additional Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <button 
            onClick={() => handleQuickAction('View SEO Report')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            onClick={() => handleQuickAction('View SEO Report')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-signal-blue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="font-medium text-sm lg:text-base">View SEO Report</span>
          </button>
          <button 
            onClick={() => handleQuickAction('Schedule Posts')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            onClick={() => handleQuickAction('Schedule Posts')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-beacon-orange to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="font-medium text-sm lg:text-base">Schedule Posts</span>
          </button>
          <button 
            onClick={() => handleQuickAction('Review Campaigns')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            onClick={() => handleQuickAction('Review Campaigns')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Target className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="font-medium text-sm lg:text-base">Review Campaigns</span>
          </button>
          <button 
            onClick={() => handleQuickAction('Amazon Analytics')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            onClick={() => handleQuickAction('Amazon Analytics')}
            className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-gradient-to-r from-beacon-orange to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="font-medium text-sm lg:text-base">Amazon Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyOverview;