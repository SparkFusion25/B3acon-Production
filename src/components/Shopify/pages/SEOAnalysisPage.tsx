import React from 'react';
import { Search, BarChart3, TrendingUp, Target, FileText } from 'lucide-react';
import ShopifyFeaturePage from '../ShopifyFeaturePage';

const SEOAnalysisPage: React.FC = () => {
  const features = [
    {
      title: 'Site Audit',
      description: 'Comprehensive analysis of your store SEO health with actionable recommendations.',
      icon: Search,
      status: 'available' as const
    },
    {
      title: 'Keyword Tracking',
      description: 'Monitor your keyword rankings and track performance over time.',
      icon: TrendingUp,
      status: 'available' as const
    },
    {
      title: 'Competitor Analysis',
      description: 'Analyze competitor SEO strategies and identify opportunities.',
      icon: Target,
      status: 'beta' as const
    },
    {
      title: 'SEO Reporting',
      description: 'Automated SEO reports with insights and growth recommendations.',
      icon: BarChart3,
      status: 'available' as const
    },
    {
      title: 'Content Optimization',
      description: 'AI-powered content suggestions to improve search rankings.',
      icon: FileText,
      status: 'coming_soon' as const
    }
  ];

  return (
    <ShopifyFeaturePage
      title="SEO Analysis"
      description="Optimize your store's search engine visibility with comprehensive SEO tools and analytics."
      icon={Search}
      features={features}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h4 className="font-semibold text-gray-900 mb-2">Current SEO Score</h4>
          <div className="text-3xl font-bold text-emerald-600 mb-2">94/100</div>
          <p className="text-sm text-gray-600">Excellent optimization level</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">Keywords Tracked</h4>
          <div className="text-3xl font-bold text-blue-600 mb-2">247</div>
          <p className="text-sm text-gray-600">Active keyword monitoring</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-2">Average Position</h4>
          <div className="text-3xl font-bold text-purple-600 mb-2">3.2</div>
          <p className="text-sm text-gray-600">Improved by 15% this month</p>
        </div>
      </div>
    </ShopifyFeaturePage>
  );
};

export default SEOAnalysisPage;