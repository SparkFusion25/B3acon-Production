import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Search, Target, MessageCircle } from 'lucide-react';

const ClientReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports = [
    {
      id: 'seo-performance',
      name: 'SEO Performance',
      description: 'Detailed analysis of your search engine rankings and traffic',
      lastUpdated: '2024-01-20',
      metrics: [
        { name: 'Organic Traffic', value: '12,450', change: '+18%', trend: 'up' },
        { name: 'Keyword Rankings', value: '245', change: '+32', trend: 'up' },
        { name: 'Backlinks', value: '1,872', change: '+124', trend: 'up' },
        { name: 'Domain Authority', value: '42', change: '+3', trend: 'up' }
      ],
      icon: Search
    },
    {
      id: 'ppc-performance',
      name: 'PPC Campaign Performance',
      description: 'Analysis of your paid advertising campaigns',
      lastUpdated: '2024-01-19',
      metrics: [
        { name: 'Impressions', value: '245,320', change: '+22%', trend: 'up' },
        { name: 'Clicks', value: '12,450', change: '+15%', trend: 'up' },
        { name: 'CTR', value: '5.1%', change: '+0.8%', trend: 'up' },
        { name: 'Conversions', value: '342', change: '+28%', trend: 'up' }
      ],
      icon: Target
    },
    {
      id: 'social-performance',
      name: 'Social Media Performance',
      description: 'Analysis of your social media engagement and growth',
      lastUpdated: '2024-01-18',
      metrics: [
        { name: 'Followers', value: '24,850', change: '+5.2%', trend: 'up' },
        { name: 'Engagement', value: '3.8%', change: '+0.6%', trend: 'up' },
        { name: 'Reach', value: '142,500', change: '+18%', trend: 'up' },
        { name: 'Conversions', value: '185', change: '+12%', trend: 'up' }
      ],
      icon: MessageCircle
    }
  ];

  const getReportById = (id: string) => {
    return reports.find(report => report.id === id);
  };

  const renderReportDetails = () => {
    if (!selectedReport) return null;
    
    const report = getReportById(selectedReport);
    if (!report) return null;
    
    const Icon = report.icon;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
              <p className="text-sm text-gray-600">Last updated: {report.lastUpdated}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {report.metrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend === 'up' ? '↗' : '↘'} {metric.change}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Detailed charts and analysis will appear here</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Reports</h2>
        <p className="text-gray-600">View detailed reports on your marketing performance</p>
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
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {timeRange === '7d' ? 'Jan 14 - Jan 20, 2024' :
               timeRange === '30d' ? 'Dec 22, 2023 - Jan 20, 2024' :
               timeRange === '90d' ? 'Oct 23, 2023 - Jan 20, 2024' :
               'Jan 21, 2023 - Jan 20, 2024'}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Report Details */}
      {renderReportDetails()}

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;
          
          return (
            <div 
              key={report.id}
              onClick={() => setSelectedReport(isSelected ? null : report.id)}
              className={`bg-white rounded-xl shadow-sm border ${
                isSelected ? 'border-signal-blue ring-2 ring-signal-blue' : 'border-gray-200'
              } p-6 cursor-pointer hover:shadow-md transition-all`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-xs text-gray-500">Updated: {report.lastUpdated}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">
                    {report.metrics[0].change} {report.metrics[0].name}
                  </span>
                </div>
                <button className="text-signal-blue hover:text-blue-700 text-sm font-medium">
                  {isSelected ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientReports;