import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Download, Filter } from 'lucide-react';

interface MetricData {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

interface ReportData {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual';
  generatedDate: string;
  downloadUrl: string;
}

interface AnalyticsData {
  metrics: MetricData[];
  chartData: ChartData;
  recentReports: ReportData[];
}

const PerformanceAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'reports'>('overview');

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockData: AnalyticsData = {
          metrics: [
            {
              id: '1',
              name: 'Total Revenue',
              value: 125000,
              change: 12.5,
              changeType: 'increase',
              period: 'vs last month'
            },
            {
              id: '2',
              name: 'Active Clients',
              value: 48,
              change: 8.3,
              changeType: 'increase',
              period: 'vs last month'
            },
            {
              id: '3',
              name: 'Project Completion Rate',
              value: 94.2,
              change: -2.1,
              changeType: 'decrease',
              period: 'vs last month'
            },
            {
              id: '4',
              name: 'Client Satisfaction',
              value: 4.8,
              change: 0.3,
              changeType: 'increase',
              period: 'vs last month'
            }
          ],
          chartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Revenue',
                data: [85000, 92000, 78000, 105000, 118000, 125000],
                color: '#3B82F6'
              },
              {
                label: 'Clients',
                data: [35, 38, 42, 45, 46, 48],
                color: '#10B981'
              }
            ]
          },
          recentReports: [
            {
              id: '1',
              title: 'Q1 2024 Performance Report',
              type: 'quarterly',
              generatedDate: '2024-04-01',
              downloadUrl: '#'
            },
            {
              id: '2',
              title: 'March 2024 Monthly Report',
              type: 'monthly',
              generatedDate: '2024-04-01',
              downloadUrl: '#'
            },
            {
              id: '3',
              title: '2023 Annual Report',
              type: 'annual',
              generatedDate: '2024-01-15',
              downloadUrl: '#'
            }
          ]
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data available</h3>
        <p className="mt-1 text-sm text-gray-500">Unable to load performance analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600">Track your agency's performance and growth metrics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'detailed', name: 'Detailed Analytics', icon: PieChart },
            { id: 'reports', name: 'Reports', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.metrics.map((metric) => (
              <div key={metric.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.name.includes('Revenue') ? formatCurrency(metric.value) : 
                       metric.name.includes('Rate') || metric.name.includes('Satisfaction') ? 
                       `${metric.value}${metric.name.includes('Satisfaction') ? '/5' : '%'}` : 
                       metric.value}
                    </p>
                  </div>
                  <div className={`flex items-center ${
                    metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.changeType === 'increase' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {formatPercentage(metric.change)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{metric.period}</p>
              </div>
            ))}
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Performance Trends</h3>
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </button>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Chart visualization would appear here</p>
                <p className="text-xs text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analytics Tab */}
      {activeView === 'detailed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                {[
                  { service: 'Web Development', amount: 45000, percentage: 36 },
                  { service: 'Digital Marketing', amount: 35000, percentage: 28 },
                  { service: 'SEO Services', amount: 25000, percentage: 20 },
                  { service: 'Consulting', amount: 20000, percentage: 16 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                      <span className="text-sm text-gray-700">{item.service}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</p>
                      <p className="text-xs text-gray-500">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Client Distribution</h3>
              <div className="space-y-3">
                {[
                  { type: 'Enterprise', count: 12, percentage: 25 },
                  { type: 'Mid-Market', count: 18, percentage: 37.5 },
                  { type: 'Small Business', count: 18, percentage: 37.5 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-600 mr-3"></div>
                      <span className="text-sm text-gray-700">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{item.count} clients</p>
                      <p className="text-xs text-gray-500">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeView === 'reports' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Generate New Report
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{report.title}</p>
                      <p className="text-sm text-gray-500">
                        Generated on {new Date(report.generatedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.type === 'annual' ? 'bg-purple-100 text-purple-800' :
                      report.type === 'quarterly' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                    <button className="flex items-center text-blue-600 hover:text-blue-900 text-sm font-medium">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceAnalytics;