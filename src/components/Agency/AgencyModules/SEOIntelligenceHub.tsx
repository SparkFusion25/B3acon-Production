import React, { useState } from 'react';
import { Search, TrendingUp, BarChart3, Globe, ExternalLink, AlertCircle, Check, RefreshCw, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import seoApi from '../../../lib/seoApi';

const SEOIntelligenceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  
  // Check API connection on component mount
  React.useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const result = await seoApi.testSeoApi();
        if (result.success) {
        
          console.log('SEO API connected successfully');
        } else {
          setApiStatus('error');
          console.error('SEO API connection failed');
        }
      } catch (error) {
        setApiStatus('error');
        console.error('SEO API connection error:', error);
      }
    };
    
    checkApiConnection();
  }, []);
  
  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Please enter a URL to analyze');
      return;
    }
    
    // Normalize URL if needed
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    setIsAnalyzing(true);
    
    try {
      // First check if we already have analysis for this domain
      const domain = new URL(normalizedUrl).hostname;
      
      const { data: existingAnalysis, error } = await supabase
        .from('seo_analysis')
        .select('*')
        .eq('domain', domain)
        .single();
      
      if (!error && existingAnalysis) {
        setAnalysisResults(existingAnalysis.results);
        toast.success(`Loaded existing analysis for ${domain}`);
      } else {
        // Perform new analysis
        toast.loading('Analyzing website...');
        
        // Get domain data
        const domainData = await seoApi.getDomainData(domain);
        
        // Get on-page analysis with suggestions
        const onPageData = await seoApi.getOnpageSuggestions(domain);
        
        // Get speed data
        const speedData = await seoApi.getSpeedData(normalizedUrl);
        
        // Get backlinks
        const backlinksData = await seoApi.getBacklinks(domain);
        
        // Get top keywords
        const keywordsData = await seoApi.getTopKeywords(domain);
        
        // Combine results
        const results = {
          domain,
          url: normalizedUrl,
          timestamp: new Date().toISOString(),
          domain_data: domainData,
          onpage: onPageData,
          speed: speedData, 
          backlinks: backlinksData,
          keywords: keywordsData
        };
        
        // Save to database
        const { error: saveError } = await supabase
          .from('seo_analysis')
          .insert({
            domain,
            results
          });
        
        if (saveError) {
          console.error('Error saving analysis:', saveError);
        }
        
        setAnalysisResults(results);
        toast.dismiss();
        toast.success(`Analysis complete for ${domain}`);
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast.dismiss();
      toast.error('Failed to analyze website');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleExportReport = () => {
    if (!analysisResults) {
      toast.error('No analysis results to export');
      return;
    }
    
    // In a real implementation, we would generate a PDF or CSV report
    toast.success('Exporting SEO report...');
    
    // Simulate download delay
    setTimeout(() => {
      toast.success('Report downloaded successfully');
    }, 2000);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">SEO Overview</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
            apiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
            apiStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            <span className={`w-2 h-2 ${
              apiStatus === 'connected' ? 'bg-green-500' : 
              apiStatus === 'checking' ? 'bg-yellow-500' : 
              'bg-red-500'
            } rounded-full mr-2`}></span>
            {apiStatus === 'connected' ? 'API Connected' : 
             apiStatus === 'checking' ? 'Checking API' : 
             'API Error'}
          </span>
          {apiStatus === 'connected' && (
            <span className="text-xs text-gray-500">default-application_10799181</span>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Website URL</label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {analysisResults ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Analysis Results for {analysisResults.domain}</h4>
              <button
                onClick={handleExportReport}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h5 className="font-medium text-gray-900">Domain Authority</h5>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResults.domain_data?.domain_authority || 'N/A'}
                </div>
                <p className="text-sm text-gray-600">
                  {analysisResults.domain_data?.domain_authority > 50 ? 'Excellent' : 
                   analysisResults.domain_data?.domain_authority > 30 ? 'Good' : 
                   analysisResults.domain_data?.domain_authority > 10 ? 'Fair' : 'Needs improvement'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h5 className="font-medium text-gray-900">Page Speed</h5>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResults.speed?.performance?.desktop || 'N/A'}/100
                </div>
                <p className="text-sm text-gray-600">
                  {analysisResults.speed?.performance?.desktop > 90 ? 'Excellent' : 
                   analysisResults.speed?.performance?.desktop > 70 ? 'Good' : 
                   analysisResults.speed?.performance?.desktop > 50 ? 'Fair' : 'Needs improvement'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ExternalLink className="w-5 h-5 text-purple-500" />
                  <h5 className="font-medium text-gray-900">Backlinks</h5>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResults.backlinks?.total?.toLocaleString() || 'N/A'}
                </div>
                <p className="text-sm text-gray-600">
                  From {analysisResults.backlinks?.unique_domains?.toLocaleString() || 'N/A'} unique domains
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">SEO Issues</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResults.onpage?.issues?.critical > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <h5 className="font-medium text-red-900">Critical Issues</h5>
                    </div>
                    <p className="text-sm text-red-800">
                      {analysisResults.onpage?.issues?.critical} critical issues found that need immediate attention
                    </p>
                  </div>
                )}
                
                {analysisResults.onpage?.issues?.warnings > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <h5 className="font-medium text-yellow-900">Warnings</h5>
                    </div>
                    <p className="text-sm text-yellow-800">
                      {analysisResults.onpage?.issues?.warnings} warnings that should be addressed
                    </p>
                  </div>
                )}
                
                {analysisResults.onpage?.issues?.notices > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      <h5 className="font-medium text-blue-900">Notices</h5>
                    </div>
                    <p className="text-sm text-blue-800">
                      {analysisResults.onpage?.issues?.notices} notices to consider for optimization
                    </p>
                  </div>
                )}
                
                {(!analysisResults.onpage?.issues?.critical && !analysisResults.onpage?.issues?.warnings && !analysisResults.onpage?.issues?.notices) && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <h5 className="font-medium text-green-900">No Issues</h5>
                    </div>
                    <p className="text-sm text-green-800">
                      No significant SEO issues found on this website
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {analysisResults.onpage?.suggestions && analysisResults.onpage.suggestions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Improvement Suggestions</h4>
                
                <div className="space-y-2">
                  {analysisResults.onpage.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="w-5 h-5 text-signal-blue flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Enter a URL to Analyze</h4>
            <p className="text-gray-600 max-w-md mx-auto">
              Get a comprehensive SEO analysis including domain authority, page speed, backlinks, and improvement suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderKeywords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Keyword Tracking</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Add Keywords
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Keyword Tracking</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Track your keyword rankings over time and monitor your SEO progress.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Set Up Keyword Tracking
          </button>
        </div>
      </div>
    </div>
  );

  const renderBacklinks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Backlink Analysis</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Export Report
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <ExternalLink className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Backlink Analysis</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Analyze your backlink profile and discover new link building opportunities.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Analyze Backlinks
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Competitor Analysis</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Add Competitor
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Competitor Analysis</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Track your competitors' SEO performance and identify opportunities to outrank them.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Set Up Competitor Tracking
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Search },
    { id: 'keywords', label: 'Keywords', icon: TrendingUp },
    { id: 'backlinks', label: 'Backlinks', icon: ExternalLink },
    { id: 'competitors', label: 'Competitors', icon: BarChart3 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Intelligence</h2>
        <p className="text-gray-600">Analyze and improve your search engine performance</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-signal-blue text-signal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'keywords' && renderKeywords()}
        {activeTab === 'backlinks' && renderBacklinks()}
        {activeTab === 'competitors' && renderCompetitors()}
      </div>
    </div>
  );
};

export default SEOIntelligenceHub;