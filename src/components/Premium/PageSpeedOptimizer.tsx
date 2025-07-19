import React, { useState } from 'react';
import { Zap, Clock, TrendingUp, AlertCircle, Check, RefreshCw, Monitor, Smartphone, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { analyzePageSpeed, PageSpeedResult } from '../../lib/seoUtils';

const PageSpeedOptimizer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PageSpeedResult | null>(null);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');

  const runPageSpeedAnalysis = async () => {
    if (!url) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const speedResults = await analyzePageSpeed(url);
      setResults(speedResults);
      toast.success('Page speed analysis complete!');
    } catch (error) {
      console.error('Page Speed Analysis error:', error);
      toast.error('Failed to analyze page speed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const currentResults = results ? results[activeDevice] : null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Zap className="h-8 w-8 text-green-600" />
          Page Speed Optimizer
        </h1>
        <p className="text-gray-600">Analyze and optimize your website's performance with real Core Web Vitals data</p>
      </div>

      {/* URL Input Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="url"
              placeholder="Enter website URL to analyze (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={runPageSpeedAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Speed'}
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Device Toggle */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveDevice('desktop')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    activeDevice === 'desktop'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </button>
                <button
                  onClick={() => setActiveDevice('mobile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    activeDevice === 'mobile'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </button>
              </div>
            </div>

            {/* Performance Score */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-200"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${currentResults!.score}, 100`}
                    className={getScoreColor(currentResults!.score)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(currentResults!.score)}`}>
                    {currentResults!.score}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {activeDevice === 'desktop' ? 'Desktop' : 'Mobile'} Performance Score
              </h3>
              <p className="text-gray-600 mt-1">
                {currentResults!.score >= 90 ? 'Good' : 
                 currentResults!.score >= 50 ? 'Needs Improvement' : 'Poor'}
              </p>
            </div>
          </div>

          {/* Core Web Vitals */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Core Web Vitals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentResults!.fcp.toFixed(1)}s</div>
                <div className="text-sm text-gray-600">First Contentful Paint</div>
                <div className={`text-xs mt-1 px-2 py-1 rounded ${
                  currentResults!.fcp <= 1.8 ? 'bg-green-100 text-green-700' :
                  currentResults!.fcp <= 3.0 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentResults!.fcp <= 1.8 ? 'Good' : currentResults!.fcp <= 3.0 ? 'Needs Work' : 'Poor'}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentResults!.lcp.toFixed(1)}s</div>
                <div className="text-sm text-gray-600">Largest Contentful Paint</div>
                <div className={`text-xs mt-1 px-2 py-1 rounded ${
                  currentResults!.lcp <= 2.5 ? 'bg-green-100 text-green-700' :
                  currentResults!.lcp <= 4.0 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentResults!.lcp <= 2.5 ? 'Good' : currentResults!.lcp <= 4.0 ? 'Needs Work' : 'Poor'}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentResults!.cls.toFixed(3)}</div>
                <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
                <div className={`text-xs mt-1 px-2 py-1 rounded ${
                  currentResults!.cls <= 0.1 ? 'bg-green-100 text-green-700' :
                  currentResults!.cls <= 0.25 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentResults!.cls <= 0.1 ? 'Good' : currentResults!.cls <= 0.25 ? 'Needs Work' : 'Poor'}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentResults!.tti.toFixed(1)}s</div>
                <div className="text-sm text-gray-600">Time to Interactive</div>
                <div className={`text-xs mt-1 px-2 py-1 rounded ${
                  currentResults!.tti <= 3.8 ? 'bg-green-100 text-green-700' :
                  currentResults!.tti <= 7.3 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentResults!.tti <= 3.8 ? 'Good' : currentResults!.tti <= 7.3 ? 'Needs Work' : 'Poor'}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Comparison */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Desktop vs Mobile Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Desktop</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(results.desktop.score)}`}>
                    {results.desktop.score}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>FCP:</span>
                    <span className="font-medium">{results.desktop.fcp.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LCP:</span>
                    <span className="font-medium">{results.desktop.lcp.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CLS:</span>
                    <span className="font-medium">{results.desktop.cls.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TTI:</span>
                    <span className="font-medium">{results.desktop.tti.toFixed(1)}s</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Mobile</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(results.mobile.score)}`}>
                    {results.mobile.score}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>FCP:</span>
                    <span className="font-medium">{results.mobile.fcp.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LCP:</span>
                    <span className="font-medium">{results.mobile.lcp.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CLS:</span>
                    <span className="font-medium">{results.mobile.cls.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TTI:</span>
                    <span className="font-medium">{results.mobile.tti.toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Opportunities */}
          {results.opportunities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Optimization Opportunities</h3>
              <div className="space-y-4">
                {results.opportunities.map((opportunity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{opportunity.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Potential Savings: {opportunity.savings}
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Tips */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Speed Optimization</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Enable gzip compression
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Optimize and compress images
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Minify CSS, JavaScript, and HTML
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Use a content delivery network (CDN)
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Core Web Vitals</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Implement lazy loading for images
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Preload critical resources
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Optimize server response times
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Minimize layout shifts
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Export Report */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Export Performance Report</h3>
                <p className="text-gray-600">Download a comprehensive performance analysis report</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSpeedOptimizer;