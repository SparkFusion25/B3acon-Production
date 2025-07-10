import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Target, Calendar, Download } from 'lucide-react';

interface AnalyticsData {
  totalClients: number;
  activeProjects: number;
  monthlyRevenue: number;
  teamUtilization: number;
  clientSatisfaction: number;
  projectCompletionRate: number;
  revenueGrowth: number;
  clientRetention: number;
}

interface PerformanceAnalyticsProps {
  analytics: AnalyticsData;
}

const PerformanceAnalytics = ({ analytics }: PerformanceAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const metrics = [
    {
      id: 'revenue',
      name: 'Revenue Growth',
      value: `${analytics.revenueGrowth}%`,
      change: '+18.5%',
      trend: 'up',
      color: 'from-signal-blue to-blue-600'
    },
    {
      id: 'satisfaction',
      name: 'Client Satisfaction',
      value: `${analytics.clientSatisfaction}%`,
      change: '+5.2%',
      trend: 'up',
      color: 'from-beacon-orange to-orange-600'
    },
    {
      id: 'completion',
      name: 'Project Completion',
      value: `${analytics.projectCompletionRate}%`,
      change: '+12.1%',
      trend: 'up',
      color: 'from-signal-blue to-beacon-orange'
    },
    {
      id: 'retention',
      name: 'Client Retention',
      value: `${analytics.clientRetention}%`,
      change: '+3.8%',
      trend: 'up',
      color: 'from-beacon-orange to-red-500'
    }
  ];

  const departmentPerformance = [
    { name: 'SEO', performance: 94, projects: 12, revenue: 45000 },
    { name: 'PPC', performance: 89, projects: 8, revenue: 38000 },
    { name: 'Social Media', performance: 92, projects: 15, revenue: 32000 },
    { name: 'Creative', performance: 87, projects: 6, revenue: 28000 }
  ];

  const clientMetrics = [
    { name: 'TechCorp Solutions', satisfaction: 98, revenue: 8500, projects: 3 },
    { name: 'RetailMax Inc', satisfaction: 94, revenue: 4200, projects: 2 },
    { name: 'FinanceFlow', satisfaction: 91, revenue: 3800, projects: 2 },
    { name: 'EcomStore', satisfaction: 96, revenue: 5200, projects: 4 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h2>
        <p className="text-gray-600">Track your agency's performance and growth metrics</p>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { value: '7d', label: '7 Days' },
                { value: '30d', label: '30 Days' },
                { value: '90d', label: '90 Days' },
                { value: '1y', label: '1 Year' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value as any)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    timeRange === range.value
                      ? 'bg-white text-signal-blue shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedMetric === metric.id ? 'ring-2 ring-signal-blue' : ''
            }`}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
              <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
            <p className="text-sm text-green-600">↗ {metric.change} vs last period</p>
          </div>
        ))}
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Performance</h3>
          <div className="space-y-4">
            {departmentPerformance.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{dept.name}</h4>
                    <p className="text-sm text-gray-600">{dept.projects} active projects</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{dept.performance}%</div>
                  <div className="text-sm text-gray-600">${dept.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Client Satisfaction</h3>
          <div className="space-y-4">
            {clientMetrics.map((client) => (
              <div key={client.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{client.name}</h4>
                    <p className="text-sm text-gray-600">{client.projects} projects • ${client.revenue}/mo</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{client.satisfaction}%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Strong Growth</h4>
            </div>
            <p className="text-sm text-green-800">
              Revenue has increased by 18.5% this month, driven by new client acquisitions and upselling.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">High Efficiency</h4>
            </div>
            <p className="text-sm text-blue-800">
              Team utilization at 82% is within optimal range. Project completion rate improved by 12%.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Opportunity</h4>
            </div>
            <p className="text-sm text-yellow-800">
              Consider expanding the Creative team to handle increased demand and reduce project timelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;