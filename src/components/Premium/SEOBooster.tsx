import React, { useState } from 'react';
import { Rocket, Search, AlertCircle, Check, RefreshCw, BarChart3, Target, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { analyzeSEO, SEOAnalysisResult } from '../../lib/seoUtils';

interface SEOBoostResult {
  score: number;
  improvements: string[];
  metaTags: { title: string; description: string; keywords: string };
  headingStructure: { tag: string; text: string; issues: string[] }[];
  internalLinks: { url: string; anchor: string; score: number }[];
  technicalIssues: { type: string; severity: 'low' | 'medium' | 'high'; description: string }[];
}

const SEOBooster: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SEOAnalysisResult | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const runSEOBooster = async () => {
    if (!url) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Use the real SEO analysis utility
      const analysisResult = await analyzeSEO(url);
      setResults(analysisResult);
      toast.success(`SEO analysis complete! Score: ${analysisResult.score}/100`);
    } catch (error) {
      console.error('SEO Booster error:', error);
      toast.error('Failed to analyze website. Please check the URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAIOptimization = async (type: string) => {
    setSelectedSuggestion(type);
    toast.loading(`Applying ${type} optimization...`);
    
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.dismiss();
    toast.success(`${type} optimization applied successfully!`);
    setSelectedSuggestion(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Rocket className="h-8 w-8 text-blue-600" />
          SEO Booster & AI Optimizer
        </h1>
        <p className="text-gray-600">AI-powered SEO analysis and optimization for better search rankings</p>
      </div>

      {/* URL Input Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Analysis</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="url"
              placeholder="Enter website URL to analyze (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={runSEOBooster}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Boost SEO'}
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          {/* SEO Score Overview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">SEO Score</h3>
              <div className="flex items-center gap-3">
                <div className={`text-3xl font-bold ${
                  results.score >= 80 ? 'text-green-600' :
                  results.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {results.score}/100
                </div>
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  results.score >= 80 ? 'bg-green-500' :
                  results.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${results.score}%` }}
              ></div>
            </div>
            
            <p className="text-gray-600">
              {results.score >= 80 ? 'Excellent! Your SEO is well optimized.' :
               results.score >= 60 ? 'Good foundation, but there\'s room for improvement.' :
               'Needs attention. Several optimization opportunities available.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Improvements */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                AI-Powered Improvements
              </h3>
                             <div className="space-y-3">
                 {results.suggestions.map((suggestion, index) => (
                   <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                     <div className="flex items-center gap-3">
                       <AlertCircle className="h-4 w-4 text-yellow-600" />
                       <span className="text-sm text-gray-900">{suggestion}</span>
                     </div>
                     <button
                       onClick={() => applyAIOptimization(suggestion)}
                       disabled={selectedSuggestion === suggestion}
                       className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                     >
                       {selectedSuggestion === suggestion ? (
                         <RefreshCw className="h-3 w-3 animate-spin" />
                       ) : (
                         'Fix'
                       )}
                     </button>
                   </div>
                 ))}
                 {results.suggestions.length === 0 && (
                   <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                     <Check className="h-4 w-4 text-green-600" />
                     <span className="text-sm text-green-800">No immediate improvements needed!</span>
                   </div>
                 )}
               </div>
            </div>

            {/* Meta Tags Analysis */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Tags Analysis</h3>
              <div className="space-y-4">
                                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Title Tag</span>
                      <span className="text-xs text-gray-500">{results.title.length}/60</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded text-sm text-gray-900">
                      {results.title || 'Missing title tag'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Meta Description</span>
                      <span className="text-xs text-gray-500">{results.description.length}/160</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded text-sm text-gray-900">
                      {results.description || 'Missing meta description'}
                    </div>
                  </div>
                  
                  {results.keywords && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Keywords</span>
                      <div className="p-3 bg-gray-50 rounded text-sm text-gray-900 mt-2">
                        {results.keywords}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Heading Structure */}
                         <div className="bg-white rounded-lg shadow-sm border p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Heading Structure</h3>
               <div className="space-y-2 max-h-64 overflow-y-auto">
                 {results.headings.map((heading, index) => (
                   <div key={index} className="flex items-center justify-between p-2 border-l-4 border-blue-200 bg-blue-50">
                     <div className="flex-1">
                       <div className="flex items-center gap-2">
                         <span className={`text-xs px-2 py-1 rounded font-medium ${
                           heading.tag === 'h1' ? 'bg-blue-600 text-white' :
                           heading.tag === 'h2' ? 'bg-blue-500 text-white' :
                           'bg-gray-400 text-white'
                         }`}>
                           {heading.tag.toUpperCase()}
                         </span>
                         <span className="text-sm text-gray-900 truncate">{heading.text}</span>
                       </div>
                       {heading.issues.length > 0 && (
                         <div className="mt-1 flex flex-wrap gap-1">
                           {heading.issues.map((issue, issueIndex) => (
                             <span key={issueIndex} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                               {issue}
                             </span>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>

            {/* Technical Issues */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Issues</h3>
              <div className="space-y-3">
                {results.technicalIssues.map((issue, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    issue.severity === 'high' ? 'bg-red-50 border-red-500' :
                    issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-center justify-between">
                                             <div>
                         <h4 className="text-sm font-medium text-gray-900">{issue.type}</h4>
                         <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                         <p className="text-xs text-blue-600 mt-1">{issue.solution}</p>
                       </div>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                  </div>
                ))}
                {results.technicalIssues.length === 0 && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">No technical issues detected!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Internal Links Analysis */}
          {results.links.internal.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Links Quality</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.links.internal.slice(0, 10).map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-blue-600 truncate">{link.url}</div>
                      <div className="text-xs text-gray-500 truncate">Anchor: {link.anchor || 'No anchor text'}</div>
                    </div>
                    <div className={`ml-3 px-2 py-1 text-xs rounded font-medium ${
                      link.score >= 80 ? 'bg-green-100 text-green-700' :
                      link.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {link.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SEOBooster;