import React, { useState } from 'react';
import { TrendingUp, Search, Target, BarChart3, Globe, FileText, Link as LinkIcon, ArrowRight, AlertCircle, CheckCircle, Clock, Zap, Download, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

const SEOIntelligenceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [domainInput, setDomainInput] = useState('');
  const [analyzedDomain, setAnalyzedDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [isSearchingKeywords, setIsSearchingKeywords] = useState(false);
  const [keywordResults, setKeywordResults] = useState<any[]>([]);
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isAnalyzingCompetitor, setIsAnalyzingCompetitor] = useState(false);
  const [competitorResults, setCompetitorResults] = useState<any>(null);
  
  const handleViewDetails = () => {
    toast.success('Viewing detailed SEO analysis');
  };
  
  const handleExportReport = () => {
    toast.success('Exporting SEO report');
  };

  const handleDomainAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput) return;
    
    setIsAnalyzing(true);
    setAnalyzedDomain(domainInput);
    
    try {
      // First check if we have cached results
      const { data: cachedData, error: cacheError } = await supabase
        .from('seo_analysis')
        .select('*')
        .eq('domain', domainInput.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!cacheError && cachedData && cachedData.length > 0) {
        // Use cached data if it's less than 7 days old
        const cacheDate = new Date(cachedData[0].created_at);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 7) {
          setAnalysisResults(cachedData[0].results);
          setIsAnalyzing(false);
          setShowResults(true);
          return;
        }
      }
      
      // If no recent cache, we would call an external API here
      // For now, we'll simulate the API call
      
      // Store the results in the database
      const mockResults = generateMockResults(domainInput);
      setAnalysisResults(mockResults);
      
      await supabase.from('seo_analysis').insert({
        domain: domainInput.toLowerCase(),
        results: mockResults
      });
      
      setIsAnalyzing(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error analyzing domain:', error);
      toast.error('Failed to analyze domain');
      setIsAnalyzing(false);
    }
  };
  
  // Function to generate mock results for demo purposes
  const generateMockResults = (domain: string) => {
    return {
      domain_authority: Math.floor(Math.random() * 60) + 20,
      organic_keywords: Math.floor(Math.random() * 2000) + 500,
      backlinks: Math.floor(Math.random() * 5000) + 1000,
      page_speed: Math.floor(Math.random() * 30) + 70,
      errors: Math.floor(Math.random() * 20),
      warnings: Math.floor(Math.random() * 40) + 10,
      passed: Math.floor(Math.random() * 100) + 100,
      top_keywords: [
        { keyword: 'digital marketing agency', position: Math.floor(Math.random() * 20) + 1, volume: 12400, difficulty: 67, cpc: 15.20, url: '/services' },
        { keyword: 'seo services', position: Math.floor(Math.random() * 20) + 1, volume: 8100, difficulty: 72, cpc: 18.50, url: '/seo-services' },
        { keyword: 'ppc management', position: Math.floor(Math.random() * 20) + 1, volume: 5400, difficulty: 58, cpc: 12.30, url: '/ppc-management' },
        { keyword: 'social media marketing', position: Math.floor(Math.random() * 20) + 1, volume: 9200, difficulty: 64, cpc: 14.80, url: '/social-media' },
        { keyword: 'content marketing strategy', position: Math.floor(Math.random() * 20) + 1, volume: 3800, difficulty: 51, cpc: 9.40, url: '/content-marketing' }
      ]
    };
  };

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordInput) return;
    
    setIsSearchingKeywords(true);
    
    // Simulate API call to search for keywords
    setTimeout(() => {
      const mockResults = [
        { keyword: keywordInput, volume: Math.floor(Math.random() * 10000) + 1000, difficulty: Math.floor(Math.random() * 100), cpc: (Math.random() * 20).toFixed(2), position: Math.floor(Math.random() * 100) },
        { keyword: `${keywordInput} services`, volume: Math.floor(Math.random() * 8000) + 500, difficulty: Math.floor(Math.random() * 100), cpc: (Math.random() * 15).toFixed(2), position: Math.floor(Math.random() * 100) },
        { keyword: `best ${keywordInput}`, volume: Math.floor(Math.random() * 5000) + 300, difficulty: Math.floor(Math.random() * 100), cpc: (Math.random() * 12).toFixed(2), position: Math.floor(Math.random() * 100) },
        { keyword: `${keywordInput} company`, volume: Math.floor(Math.random() * 3000) + 200, difficulty: Math.floor(Math.random() * 100), cpc: (Math.random() * 10).toFixed(2), position: Math.floor(Math.random() * 100) },
        { keyword: `${keywordInput} agency`, volume: Math.floor(Math.random() * 2000) + 100, difficulty: Math.floor(Math.random() * 100), cpc: (Math.random() * 8).toFixed(2), position: Math.floor(Math.random() * 100) },
      ];
      
      setKeywordResults(mockResults);
      setIsSearchingKeywords(false);
      toast.success(`Found ${mockResults.length} keywords related to "${keywordInput}"`);
    }, 1500);
  };
  
  const handleCompetitorAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorUrl) return;
    
    setIsAnalyzingCompetitor(true);
    
    // Simulate API call to analyze competitor
    setTimeout(() => {
      const mockResults = {
        domain: competitorUrl,
        domain_authority: Math.floor(Math.random() * 60) + 20,
        organic_keywords: Math.floor(Math.random() * 2000) + 500,
        backlinks: Math.floor(Math.random() * 5000) + 1000,
        top_keywords: [
          { keyword: 'digital marketing', position: Math.floor(Math.random() * 10) + 1, volume: 12400 },
          { keyword: 'seo services', position: Math.floor(Math.random() * 10) + 1, volume: 8100 },
          { keyword: 'ppc management', position: Math.floor(Math.random() * 10) + 1, volume: 5400 },
        ],
        top_pages: [
          { url: '/services', traffic: Math.floor(Math.random() * 1000) + 500, keywords: Math.floor(Math.random() * 100) + 20 },
          { url: '/about', traffic: Math.floor(Math.random() * 800) + 300, keywords: Math.floor(Math.random() * 50) + 10 },
          { url: '/blog', traffic: Math.floor(Math.random() * 600) + 200, keywords: Math.floor(Math.random() * 80) + 30 },
        ],
        content_gap: [
          { keyword: 'content marketing strategy', volume: 3800, difficulty: 51 },
          { keyword: 'social media marketing tips', volume: 2900, difficulty: 48 },
          { keyword: 'local seo guide', volume: 2200, difficulty: 45 },
        ]
      };
      
      setCompetitorResults(mockResults);
      setIsAnalyzingCompetitor(false);
      toast.success(`Competitor analysis complete for ${competitorUrl}`);
    }, 2000);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleDomainAnalysis} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="Enter domain to analyze (e.g., example.com)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !domainInput}
            className="px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Analyze Domain
              </>
            )}
          </button>
        </form>
      </div>

      {showResults && (
        <>
          {/* Domain Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{analyzedDomain}</h3>
                <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Health: 87/100
                </span>
                <button 
                  onClick={handleViewDetails}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Domain Authority</h4>
                  <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{analysisResults?.domain_authority || 42}/100</div>
                <p className="text-sm text-green-600">↗ +3 this month</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Organic Keywords</h4>
                  <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{analysisResults?.organic_keywords?.toLocaleString() || '1,248'}</div>
                <p className="text-sm text-green-600">↗ +156 this month</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Backlinks</h4>
                  <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{analysisResults?.backlinks?.toLocaleString() || '3,842'}</div>
                <p className="text-sm text-green-600">↗ +215 this month</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Page Speed</h4>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{analysisResults?.page_speed || 78}/100</div>
                <p className="text-sm text-yellow-600">↗ +2 this month</p>
              </div>
            </div>

            {/* Site Audit Summary */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Site Audit Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h5 className="font-medium text-red-800">Errors</h5>
                  </div>
                  <div className="text-2xl font-bold text-red-700 mb-1">{analysisResults?.errors || 12}</div>
                  <p className="text-sm text-red-600">Critical issues to fix</p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <h5 className="font-medium text-yellow-800">Warnings</h5>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700 mb-1">{analysisResults?.warnings || 28}</div>
                  <p className="text-sm text-yellow-600">Issues to address</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h5 className="font-medium text-green-800">Passed</h5>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mb-1">{analysisResults?.passed || 156}</div>
                  <p className="text-sm text-green-600">Checks passed</p>
                </div>
              </div>
            </div>

            {/* Top Keywords */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Top Ranking Keywords</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keyword</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Position</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Volume</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Difficulty</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">CPC</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analysisResults?.top_keywords || []).map((keyword: any, index: number) => (
                      <tr key={index} className={index < 4 ? "border-b border-gray-100" : ""}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{keyword.keyword}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{keyword.position}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{keyword.volume.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{keyword.difficulty}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">${keyword.cpc}</td>
                        <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">{keyword.url}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {!showResults && !isAnalyzing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Enter a domain to analyze</h3>
          <p className="text-gray-600 mb-4">Get comprehensive SEO insights for any website</p>
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">SEO Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Organic Traffic</h4>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">45,230</div>
          <p className="text-sm text-green-600">↗ +18% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Keywords Ranking</h4>
            <Search className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">1,247</div>
          <p className="text-sm text-blue-600">↗ +12% this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Avg Position</h4>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">8.4</div>
          <p className="text-sm text-green-600">↗ +2.1 this month</p>
        </div>
      </div>
    </div>
  );

  const renderKeywords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Keyword Research</h3>
        <button 
          onClick={handleExportReport}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Results</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleKeywordSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Enter keyword to research (e.g., digital marketing)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingKeywords || !keywordInput}
            className="px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
          >
            {isSearchingKeywords ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Research Keyword
              </>
            )}
          </button>
        </form>
        
        {keywordResults.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keyword</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Search Volume</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Difficulty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">CPC</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Current Position</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keywordResults.map((keyword, index) => (
                  <tr key={index} className={index < keywordResults.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{keyword.keyword}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{keyword.volume.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              keyword.difficulty < 30 ? 'bg-green-500' : 
                              keyword.difficulty < 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${keyword.difficulty}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-600">{keyword.difficulty}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">${keyword.cpc}</td>
                    <td className="px-4 py-3 text-sm">
                      {keyword.position ? (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          keyword.position <= 10 ? 'bg-green-100 text-green-800' : 
                          keyword.position <= 30 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {keyword.position}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button 
                        onClick={() => toast.success(`Added "${keyword.keyword}" to tracking`)}
                        className="text-signal-blue hover:text-blue-700 text-sm font-medium"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {keywordResults.length === 0 && !isSearchingKeywords && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Discover Valuable Keywords</h4>
            <p className="text-gray-600 mb-4">Enter a keyword above to research search volume, difficulty, and more.</p>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderRankings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Keyword Rankings</h3>
        <button 
          onClick={handleExportReport}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Rankings</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-medium text-gray-900">Tracked Keywords</h4>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
              All Keywords
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm">
              Top 10
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm">
              Improved
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm">
              Declined
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keyword</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Current Position</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Previous</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Change</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Search Volume</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {[
                { keyword: 'digital marketing agency', position: 3, previous: 5, volume: 12400, url: '/services' },
                { keyword: 'seo services', position: 8, previous: 12, volume: 8100, url: '/seo-services' },
                { keyword: 'ppc management', position: 4, previous: 4, volume: 5400, url: '/ppc-management' },
                { keyword: 'social media marketing', position: 15, previous: 9, volume: 9200, url: '/social-media' },
                { keyword: 'content marketing strategy', position: 7, previous: 11, volume: 3800, url: '/content-marketing' }
              ].map((keyword, index) => (
                <tr key={index} className={index < 4 ? "border-b border-gray-100" : ""}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{keyword.keyword}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      keyword.position <= 3 ? 'bg-green-100 text-green-800' : 
                      keyword.position <= 10 ? 'bg-blue-100 text-blue-800' : 
                      keyword.position <= 20 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {keyword.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{keyword.previous}</td>
                  <td className="px-4 py-3 text-sm">
                    {keyword.previous - keyword.position > 0 ? (
                      <span className="text-green-600">↑ {keyword.previous - keyword.position}</span>
                    ) : keyword.previous - keyword.position < 0 ? (
                      <span className="text-red-600">↓ {Math.abs(keyword.previous - keyword.position)}</span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{keyword.volume.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">{keyword.url}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Today</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  const renderBacklinks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Backlink Analysis</h3>
        <button 
          onClick={handleExportReport}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Total Backlinks</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">3,842</div>
          <p className="text-sm text-green-600">↗ +215 this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Referring Domains</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">428</div>
          <p className="text-sm text-green-600">↗ +32 this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Domain Authority</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">42</div>
          <p className="text-sm text-green-600">↗ +3 this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Dofollow Links</h4>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">2,156</div>
          <p className="text-sm text-green-600">↗ +128 this month</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Top Backlinks</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">DA</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Target URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">First Seen</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { source: 'example.com', da: 78, type: 'dofollow', targetUrl: '/', firstSeen: '3 months ago' },
                { source: 'blog.example.org', da: 65, type: 'dofollow', targetUrl: '/services', firstSeen: '2 months ago' },
                { source: 'news.example.net', da: 72, type: 'nofollow', targetUrl: '/about', firstSeen: '1 month ago' },
                { source: 'directory.example.com', da: 54, type: 'dofollow', targetUrl: '/contact', firstSeen: '2 weeks ago' },
                { source: 'forum.example.org', da: 48, type: 'nofollow', targetUrl: '/blog/post-1', firstSeen: '1 week ago' }
              ].map((backlink, index) => (
                <tr key={index} className={index < 4 ? "border-b border-gray-100" : ""}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{backlink.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{backlink.da}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      backlink.type === 'dofollow' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {backlink.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">{backlink.targetUrl}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{backlink.firstSeen}</td>
                  <td className="px-4 py-3 text-sm">
                    <button 
                      onClick={() => window.open(`https://${backlink.source}`, '_blank')}
                      className="text-signal-blue hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  const renderSiteAudit = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Site Audit</h3>
        <button 
          onClick={() => toast.success('Starting new site audit...')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Run New Audit</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-medium text-gray-900">Site Health</h4>
            <p className="text-sm text-gray-600">Last audit: Today at 9:45 AM</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-green-500">
              <span className="text-xl font-bold text-green-500">87</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h5 className="font-medium text-red-800">Errors</h5>
            </div>
            <div className="text-2xl font-bold text-red-700 mb-1">12</div>
            <p className="text-sm text-red-600">Critical issues to fix</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h5 className="font-medium text-yellow-800">Warnings</h5>
            </div>
            <div className="text-2xl font-bold text-yellow-700 mb-1">28</div>
            <p className="text-sm text-yellow-600">Issues to address</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h5 className="font-medium text-green-800">Passed</h5>
            </div>
            <div className="text-2xl font-bold text-green-700 mb-1">156</div>
            <p className="text-sm text-green-600">Checks passed</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h5 className="font-medium text-gray-900 mb-2">Issues Found</h5>
          
          {[
            { type: 'error', title: 'Broken links detected', description: '5 broken links found on your website', pages: ['/blog/post-3', '/services/seo'] },
            { type: 'error', title: 'Missing meta descriptions', description: '7 pages are missing meta descriptions', pages: ['/about', '/team', '/services/ppc', '/blog/post-2', '/contact'] },
            { type: 'warning', title: 'Slow page load speed', description: '3 pages have load times over 3 seconds', pages: ['/portfolio', '/case-studies', '/resources'] },
            { type: 'warning', title: 'Images missing alt text', description: '12 images are missing alt text', pages: ['/gallery', '/portfolio', '/blog/post-1'] }
          ].map((issue, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                issue.type === 'error' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'
              }`}
            >
              <div className="flex items-start">
                <div className={`mt-0.5 mr-3 ${issue.type === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {issue.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h6 className={`font-medium ${issue.type === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>{issue.title}</h6>
                  <p className={`text-sm ${issue.type === 'error' ? 'text-red-600' : 'text-yellow-600'} mb-2`}>{issue.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {issue.pages.map((page, i) => (
                      <span key={i} className="px-2 py-1 bg-white rounded text-xs text-gray-600 border border-gray-200">
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderCompetitors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Competitor Analysis</h3>
        <button 
          onClick={handleExportReport}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleCompetitorAnalysis} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="Enter competitor domain (e.g., competitor.com)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzingCompetitor || !competitorUrl}
            className="px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
          >
            {isAnalyzingCompetitor ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Analyze Competitor
              </>
            )}
          </button>
        </form>
        
        {competitorResults && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-600">Domain Authority</h5>
                  <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{competitorResults.domain_authority}/100</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-600">Organic Keywords</h5>
                  <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{competitorResults.organic_keywords.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-600">Backlinks</h5>
                  <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{competitorResults.backlinks.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-4">Top Keywords</h5>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keyword</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Position</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitorResults.top_keywords.map((keyword: any, index: number) => (
                        <tr key={index} className={index < competitorResults.top_keywords.length - 1 ? "border-b border-gray-100" : ""}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{keyword.keyword}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              keyword.position <= 3 ? 'bg-green-100 text-green-800' : 
                              keyword.position <= 10 ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {keyword.position}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{keyword.volume.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-4">Top Pages</h5>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">URL</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Traffic</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keywords</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitorResults.top_pages.map((page: any, index: number) => (
                        <tr key={index} className={index < competitorResults.top_pages.length - 1 ? "border-b border-gray-100" : ""}>
                          <td className="px-4 py-3 text-sm font-medium text-blue-600">{page.url}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{page.traffic.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{page.keywords}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-4">Backlink Profile</h5>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Backlinks</p>
                  <p className="text-lg font-bold text-gray-900">{competitorResults.backlink_profile.total.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Referring Domains</p>
                  <p className="text-lg font-bold text-gray-900">{competitorResults.backlink_profile.domains.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Dofollow %</p>
                  <p className="text-lg font-bold text-gray-900">{competitorResults.backlink_profile.dofollow}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Educational Links</p>
                  <p className="text-lg font-bold text-gray-900">{competitorResults.backlink_profile.educational}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Governmental Links</p>
                  <p className="text-lg font-bold text-gray-900">{competitorResults.backlink_profile.governmental}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!competitorResults && !isAnalyzingCompetitor && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Analyze Your Competitors</h4>
            <p className="text-gray-600 mb-4">Enter a competitor's domain to see their SEO metrics and strategy.</p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'keywords', label: 'Keywords', icon: Search },
    { id: 'rankings', label: 'Rankings', icon: TrendingUp },
    { id: 'backlinks', label: 'Backlinks', icon: LinkIcon },
    { id: 'site-audit', label: 'Site Audit', icon: CheckCircle },
    { id: 'competitors', label: 'Competitors', icon: Target }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Intelligence Hub</h2>
        <p className="text-gray-600">Advanced SEO analytics and optimization tools powered by B3ACON</p>
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'keywords' && renderKeywords()}
        {activeTab === 'rankings' && renderRankings()}
        {activeTab === 'backlinks' && renderBacklinks()}
        {activeTab === 'site-audit' && renderSiteAudit()}
        {activeTab === 'competitors' && renderCompetitors()}
      </div>
    </div>
  );
};

export default SEOIntelligenceHub;