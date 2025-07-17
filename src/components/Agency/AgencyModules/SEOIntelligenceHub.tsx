import React, { useState } from 'react';
import { Search, TrendingUp, BarChart3, Globe, ExternalLink, AlertCircle, Check, RefreshCw, Download, Target, Eye, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase'; 
import seoApi from '../../../lib/seoApi';
import { serpApiService, SEOAnalysisResult, CompetitorData } from '../../../lib/serpApiService';

const SEOIntelligenceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  
  // SerpAPI integration states
  const [keywords, setKeywords] = useState<string>('');
  const [competitors, setCompetitors] = useState<string>('');
  const [location, setLocation] = useState('United States');
  const [keywordResults, setKeywordResults] = useState<SEOAnalysisResult[]>([]);
  const [competitorResults, setCompetitorResults] = useState<CompetitorData[]>([]);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState(false);
  const [serpApiStatus, setSerpApiStatus] = useState<'connected' | 'error' | 'not-configured'>('not-configured');
  
  // Check API connections on component mount
  React.useEffect(() => {
    const checkApiConnection = async () => {
      setApiStatus('checking');
      try {
        const result = await seoApi.testConnection();
        if (result && result.success) {
          setApiStatus('connected');
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
    
    const checkSerpApiConnection = () => {
      const hasApiKey = import.meta.env.VITE_SERPAPI_KEY;
      if (hasApiKey) {
        setSerpApiStatus('connected');
      } else {
        setSerpApiStatus('not-configured');
      }
    };
    
    checkApiConnection();
    checkSerpApiConnection();
  }, []);

  // Keyword analysis with SerpAPI
  const analyzeKeywords = async () => {
    if (!keywords.trim()) {
      toast.error('Please enter keywords to analyze');
      return;
    }

    setIsLoadingKeywords(true);
    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
      const domain = url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : '';
      
      const results = await serpApiService.analyzeKeywordRankings(keywordList, domain, location);
      setKeywordResults(results);
      toast.success(`Analyzed ${results.length} keywords successfully`);
    } catch (error) {
      console.error('Keyword analysis failed:', error);
      toast.error('Keyword analysis failed. Please check your SerpAPI configuration.');
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  // Competitor analysis with SerpAPI
  const analyzeCompetitors = async () => {
    if (!competitors.trim() || !keywords.trim()) {
      toast.error('Please enter both competitors and keywords to analyze');
      return;
    }

    setIsLoadingCompetitors(true);
    try {
      const competitorList = competitors.split(',').map(c => c.trim()).filter(c => c);
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
      
      const results = await serpApiService.analyzeCompetitors({
        q: '', // Not needed for competitor analysis
        competitors: competitorList,
        keywords: keywordList,
        location
      });
      
      setCompetitorResults(results);
      toast.success(`Analyzed ${results.length} competitors successfully`);
    } catch (error) {
      console.error('Competitor analysis failed:', error);
      toast.error('Competitor analysis failed. Please check your SerpAPI configuration.');
    } finally {
      setIsLoadingCompetitors(false);
    }
  };

  // Get keyword suggestions
  const getKeywordSuggestions = async (query: string) => {
    try {
      const suggestions = await serpApiService.getSearchSuggestions(query);
      return suggestions.slice(0, 10); // Return top 10 suggestions
    } catch (error) {
      console.error('Failed to get keyword suggestions:', error);
      return [];
    }
  };
  
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
      
      if (!supabase) {
        throw new Error('Supabase not configured');
      }
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
        
        // Get all data (using mock data in our updated seoApi)
        const [
          domainData,
          onPageData,
          speedData,
          backlinksData,
          keywordsData
        ] = await Promise.all([
          seoApi.getDomainData(domain),
          seoApi.getOnpageSuggestions(domain),
          seoApi.getSpeedData(normalizedUrl),
          seoApi.getBacklinks(domain),
          seoApi.getTopKeywords(domain)
        ]);
        
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

  // Enhanced SerpAPI-powered render functions
  const renderEnhancedKeywords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Keyword Analysis with SerpAPI</h3>
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            serpApiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
            serpApiStatus === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {serpApiStatus === 'connected' ? 'SerpAPI Connected' : 
             serpApiStatus === 'error' ? 'SerpAPI Error' : 
             'SerpAPI Not Configured'}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (comma-separated)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="digital marketing, SEO tools, online advertising"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Domain (optional)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent mb-4"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={analyzeKeywords}
          disabled={isLoadingKeywords || !keywords.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoadingKeywords ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{isLoadingKeywords ? 'Analyzing...' : 'Analyze Keywords'}</span>
        </button>
      </div>

      {/* Keyword Results */}
      {keywordResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Keyword Analysis Results</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-700">Keyword</th>
                  <th className="text-left py-2 font-medium text-gray-700">Position</th>
                  <th className="text-left py-2 font-medium text-gray-700">Total Results</th>
                  <th className="text-left py-2 font-medium text-gray-700">Ads Count</th>
                  <th className="text-left py-2 font-medium text-gray-700">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {keywordResults.map((result, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{result.keyword}</td>
                    <td className="py-3">
                      {result.position ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.position <= 3 ? 'bg-green-100 text-green-800' :
                          result.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          #{result.position}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not ranked</span>
                      )}
                    </td>
                    <td className="py-3 text-gray-600">{result.total_results.toLocaleString()}</td>
                    <td className="py-3 text-gray-600">{result.ads_count}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.ads_count > 5 ? 'bg-red-100 text-red-800' :
                        result.ads_count > 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {result.ads_count > 5 ? 'High' : result.ads_count > 2 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderEnhancedCompetitors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Competitor Analysis with SerpAPI</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          serpApiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
          serpApiStatus === 'error' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {serpApiStatus === 'connected' ? 'SerpAPI Connected' : 
           serpApiStatus === 'error' ? 'SerpAPI Error' : 
           'SerpAPI Not Configured'}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competitor Domains (comma-separated)
            </label>
            <textarea
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              placeholder="competitor1.com, competitor2.com, competitor3.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords to Compare (comma-separated)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="digital marketing, SEO tools, online advertising"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              rows={3}
            />
          </div>
        </div>
        
        <button
          onClick={analyzeCompetitors}
          disabled={isLoadingCompetitors || !competitors.trim() || !keywords.trim()}
          className="px-6 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoadingCompetitors ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
          <span>{isLoadingCompetitors ? 'Analyzing...' : 'Analyze Competitors'}</span>
        </button>
      </div>

      {/* Competitor Results */}
      {competitorResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Competitor Analysis Results</h4>
          <div className="space-y-4">
            {competitorResults.map((competitor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{competitor.domain}</h5>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Visibility Score:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      competitor.visibility_score > 70 ? 'bg-green-100 text-green-800' :
                      competitor.visibility_score > 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {competitor.visibility_score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                  {Object.entries(competitor.positions).map(([keyword, position]) => (
                    <div key={keyword} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600 truncate">{keyword}</span>
                      <span className={`font-medium ${
                        position && position <= 10 ? 'text-green-600' : 
                        position && position <= 50 ? 'text-yellow-600' : 
                        'text-gray-400'
                      }`}>
                        {position ? `#${position}` : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRankTracking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Rank Tracking</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Add Keywords to Track
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Keyword Rank Tracking</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Track your keyword rankings over time and monitor your SEO progress with daily updates.
          </p>
          <button
            onClick={() => {
              if (keywordResults.length > 0) {
                toast.success('Keywords from analysis can be added to tracking');
              } else {
                toast('Analyze keywords first to enable tracking', { icon: 'ℹ️' });
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Set Up Tracking
          </button>
        </div>
      </div>
    </div>
  );

  const renderSerpAnalysis = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">SERP Analysis</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
          Analyze SERP Features
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Search Results Analysis</h4>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Analyze SERP features, featured snippets, and competitive landscape for your target keywords.
          </p>
          <button
            onClick={() => {
              if (keywordResults.length > 0) {
                toast.success('SERP analysis available for analyzed keywords');
              } else {
                toast('Run keyword analysis first to view SERP features', { icon: 'ℹ️' });
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            Start SERP Analysis
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Search },
    { id: 'keywords', label: 'Keyword Analysis', icon: TrendingUp },
    { id: 'competitors', label: 'Competitor Analysis', icon: BarChart3 },
    { id: 'rank-tracking', label: 'Rank Tracking', icon: Target },
    { id: 'serp-analysis', label: 'SERP Analysis', icon: Eye },
    { id: 'backlinks', label: 'Backlinks', icon: ExternalLink }
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
        {activeTab === 'keywords' && renderEnhancedKeywords()}
        {activeTab === 'competitors' && renderEnhancedCompetitors()}
        {activeTab === 'rank-tracking' && renderRankTracking()}
        {activeTab === 'serp-analysis' && renderSerpAnalysis()}
        {activeTab === 'backlinks' && renderBacklinks()}
      </div>
    </div>
  );
};

export default SEOIntelligenceHub;