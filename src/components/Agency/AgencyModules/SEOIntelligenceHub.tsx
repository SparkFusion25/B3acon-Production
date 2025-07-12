import React, { useState } from 'react';
import { Search, BarChart3, TrendingUp, Link as LinkIcon, AlertCircle, CheckCircle, ExternalLink, Download, Plus, Edit, Trash2, Globe, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

const SEOIntelligenceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('domain');
  const [domainUrl, setDomainUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [keyword, setKeyword] = useState('');
  const [isSearchingKeyword, setIsSearchingKeyword] = useState(false);
  const [keywordResults, setKeywordResults] = useState<any[]>([]);
  const [trackedKeywords, setTrackedKeywords] = useState<any[]>([
    { id: 1, keyword: 'digital marketing agency', position: 12, change: 3, volume: 8100, difficulty: 67, url: 'https://example.com/services' },
    { id: 2, keyword: 'seo services', position: 8, change: -2, volume: 6600, difficulty: 72, url: 'https://example.com/seo' },
    { id: 3, keyword: 'social media marketing', position: 15, change: 5, volume: 9200, difficulty: 65, url: 'https://example.com/social' }
  ]);
  const [backlinks, setBacklinks] = useState<any[]>([
    { id: 1, source: 'business.com', url: 'https://business.com/marketing', authority: 78, anchor: 'digital marketing services', dofollow: true, discovered: '2024-01-15' },
    { id: 2, source: 'marketingweek.com', url: 'https://marketingweek.com/agencies', authority: 85, anchor: 'top agencies', dofollow: true, discovered: '2024-01-10' },
    { id: 3, source: 'techblog.io', url: 'https://techblog.io/marketing-tools', authority: 62, anchor: 'marketing tools', dofollow: false, discovered: '2024-01-05' }
  ]);
  const [siteAudit, setSiteAudit] = useState<any>({
    score: 78,
    errors: 3,
    warnings: 8,
    passed: 42,
    issues: [
      { type: 'error', message: 'Missing meta descriptions on 3 pages', pages: ['https://example.com/blog', 'https://example.com/services', 'https://example.com/about'] },
      { type: 'error', message: '4 broken links detected', pages: ['https://example.com/resources'] },
      { type: 'error', message: '2 pages with duplicate content', pages: ['https://example.com/products', 'https://example.com/shop'] },
      { type: 'warning', message: 'Slow page load time (>3s) on 5 pages', pages: ['https://example.com/gallery'] },
      { type: 'warning', message: 'Images missing alt text on 8 pages', pages: ['https://example.com/blog/post1'] }
    ]
  });
  const [competitors, setCompetitors] = useState<any[]>([
    { id: 1, domain: 'competitor1.com', traffic: 45000, keywords: 3200, backlinks: 12500, authority: 72 },
    { id: 2, domain: 'competitor2.com', traffic: 38000, keywords: 2800, backlinks: 9800, authority: 68 },
    { id: 3, domain: 'competitor3.com', traffic: 52000, keywords: 4100, backlinks: 15200, authority: 75 }
  ]);
  
  const handleDomainAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainUrl) {
      toast.error('Please enter a domain URL');
      return;
    }
    
    // Validate URL format
    try {
      new URL(domainUrl.startsWith('http') ? domainUrl : `https://${domainUrl}`);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Normalize the domain URL
      const normalizedUrl = domainUrl.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      // Check if we already have analysis for this domain
      const { data: existingAnalysis, error: fetchError } = await supabase
        .from('seo_analysis')
        .select('*')
        .eq('domain', normalizedUrl)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching domain analysis:', fetchError);
      }
      
      if (existingAnalysis) {
        setAnalysisResults(existingAnalysis.results);
        toast.success(`Analysis loaded for ${normalizedUrl}`);
      } else {
        // Simulate API call to analyze domain
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock analysis results
        const mockResults = {
          domain: normalizedUrl,
          authority: Math.floor(Math.random() * 50) + 30,
          traffic: Math.floor(Math.random() * 50000) + 10000,
          keywords: Math.floor(Math.random() * 3000) + 500,
          backlinks: Math.floor(Math.random() * 10000) + 1000,
          issues: {
            errors: Math.floor(Math.random() * 10),
            warnings: Math.floor(Math.random() * 20),
            notices: Math.floor(Math.random() * 30)
          },
          performance: {
            desktop: Math.floor(Math.random() * 40) + 60,
            mobile: Math.floor(Math.random() * 30) + 50
          },
          competitors: [
            'competitor1.com',
            'competitor2.com',
            'competitor3.com'
          ],
          top_keywords: [
            { keyword: 'example keyword 1', position: 3, volume: 1200 },
            { keyword: 'example keyword 2', position: 8, volume: 880 },
            { keyword: 'example keyword 3', position: 12, volume: 590 }
          ]
        };
        
        // Save analysis to database
        const { error: insertError } = await supabase
          .from('seo_analysis')
          .insert({
            domain: normalizedUrl,
            results: mockResults
          });
        
        if (insertError) {
          console.error('Error saving domain analysis:', insertError);
          toast.error('Failed to save analysis results');
        }
        
        setAnalysisResults(mockResults);
        toast.success(`Analysis completed for ${normalizedUrl}`);
      }
    } catch (error) {
      console.error('Error during domain analysis:', error);
      toast.error('Failed to analyze domain');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleKeywordSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword) {
      toast.error('Please enter a keyword');
      return;
    }
    
    setIsSearchingKeyword(true);
    
    try {
      // Simulate API call to search for keyword data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock keyword results
      const mockResults = [
        {
          keyword: keyword,
          volume: Math.floor(Math.random() * 10000) + 500,
          difficulty: Math.floor(Math.random() * 70) + 30,
          cpc: (Math.random() * 5).toFixed(2),
          competition: (Math.random() * 0.9).toFixed(2),
          trend: [65, 70, 68, 72, 75, 78, 80]
        },
        {
          keyword: `best ${keyword}`,
          volume: Math.floor(Math.random() * 5000) + 200,
          difficulty: Math.floor(Math.random() * 60) + 20,
          cpc: (Math.random() * 4).toFixed(2),
          competition: (Math.random() * 0.8).toFixed(2),
          trend: [45, 48, 52, 55, 58, 60, 62]
        },
        {
          keyword: `${keyword} services`,
          volume: Math.floor(Math.random() * 3000) + 100,
          difficulty: Math.floor(Math.random() * 50) + 20,
          cpc: (Math.random() * 3).toFixed(2),
          competition: (Math.random() * 0.7).toFixed(2),
          trend: [30, 32, 35, 38, 42, 45, 48]
        }
      ];
      
      setKeywordResults(mockResults);
      toast.success(`Found keyword data for "${keyword}"`);
    } catch (error) {
      console.error('Error during keyword search:', error);
      toast.error('Failed to search for keyword');
    } finally {
      setIsSearchingKeyword(false);
    }
  };
  
  const handleTrackKeyword = (keywordData: any) => {
    // Check if keyword is already tracked
    if (trackedKeywords.some(k => k.keyword.toLowerCase() === keywordData.keyword.toLowerCase())) {
      toast.error(`"${keywordData.keyword}" is already being tracked`);
      return;
    }
    
    // Add keyword to tracked keywords
    const newKeyword = {
      id: Date.now(),
      keyword: keywordData.keyword,
      position: Math.floor(Math.random() * 30) + 1,
      change: 0,
      volume: keywordData.volume,
      difficulty: keywordData.difficulty,
      url: `https://example.com/${keywordData.keyword.replace(/\s+/g, '-').toLowerCase()}`
    };
    
    setTrackedKeywords([...trackedKeywords, newKeyword]);
    toast.success(`Now tracking "${keywordData.keyword}"`);
  };
  
  const handleRemoveKeyword = (keywordId: number) => {
    setTrackedKeywords(trackedKeywords.filter(k => k.id !== keywordId));
    toast.success('Keyword removed from tracking');
  };
  
  const handleRunAudit = () => {
    toast.success('Site audit in progress...');
    
    // Simulate audit running
    setTimeout(() => {
      // Update audit with new random data
      const newAudit = {
        score: Math.floor(Math.random() * 20) + 70,
        errors: Math.floor(Math.random() * 5) + 1,
        warnings: Math.floor(Math.random() * 10) + 5,
        passed: Math.floor(Math.random() * 10) + 40,
        issues: siteAudit.issues
      };
      
      setSiteAudit(newAudit);
      toast.success('Site audit completed successfully');
    }, 3000);
  };
  
  const handleAddCompetitor = () => {
    const domain = prompt('Enter competitor domain:');
    if (!domain) return;
    
    // Validate domain format
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domain)) {
      toast.error('Please enter a valid domain');
      return;
    }
    
    // Check if competitor is already added
    if (competitors.some(c => c.domain.toLowerCase() === domain.toLowerCase())) {
      toast.error(`"${domain}" is already in your competitors list`);
      return;
    }
    
    // Add new competitor with random data
    const newCompetitor = {
      id: Date.now(),
      domain,
      traffic: Math.floor(Math.random() * 50000) + 10000,
      keywords: Math.floor(Math.random() * 3000) + 500,
      backlinks: Math.floor(Math.random() * 10000) + 1000,
      authority: Math.floor(Math.random() * 30) + 50
    };
    
    setCompetitors([...competitors, newCompetitor]);
    toast.success(`Added "${domain}" to competitors`);
  };
  
  const handleRemoveCompetitor = (competitorId: number) => {
    setCompetitors(competitors.filter(c => c.id !== competitorId));
    toast.success('Competitor removed from tracking');
  };

  const renderDomainAnalyzer = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Domain Analyzer</h3>
        <div className="flex items-center space-x-2">
          {analysisResults && (
            <button 
              onClick={() => toast.success('Exporting analysis report')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleDomainAnalysis} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Domain to Analyze</label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={domainUrl}
                onChange={(e) => setDomainUrl(e.target.value)}
                placeholder="example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing || !domainUrl}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Domain</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        {analysisResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Analysis Results for {analysisResults.domain}</h4>
              <a 
                href={`https://${analysisResults.domain}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-signal-blue hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Visit Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Domain Authority</div>
                <div className="text-2xl font-bold text-gray-900">{analysisResults.authority}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Organic Traffic</div>
                <div className="text-2xl font-bold text-gray-900">{analysisResults.traffic.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Ranking Keywords</div>
                <div className="text-2xl font-bold text-gray-900">{analysisResults.keywords.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Backlinks</div>
                <div className="text-2xl font-bold text-gray-900">{analysisResults.backlinks.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Issues Found</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700">Errors</span>
                    </div>
                    <span className="font-medium text-red-700">{analysisResults.issues.errors}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-700">Warnings</span>
                    </div>
                    <span className="font-medium text-yellow-700">{analysisResults.issues.warnings}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-blue-700">Notices</span>
                    </div>
                    <span className="font-medium text-blue-700">{analysisResults.issues.notices}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Performance</h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Desktop</span>
                      <span className="text-sm font-medium text-gray-900">{analysisResults.performance.desktop}/100</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full" 
                        style={{ width: `${analysisResults.performance.desktop}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Mobile</span>
                      <span className="text-sm font-medium text-gray-900">{analysisResults.performance.mobile}/100</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-full" 
                        style={{ width: `${analysisResults.performance.mobile}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Top Keywords</h5>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Keyword</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Position</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResults.top_keywords.map((kw: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="px-4 py-2 text-gray-900">{kw.keyword}</td>
                        <td className="px-4 py-2 text-gray-900">{kw.position}</td>
                        <td className="px-4 py-2 text-gray-900">{kw.volume.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {!analysisResults && !isAnalyzing && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Enter a domain to analyze</h4>
            <p className="text-gray-600">Get comprehensive SEO insights for any website</p>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderKeywordResearch = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Keyword Research</h3>
        <div className="flex items-center space-x-2">
          {keywordResults.length > 0 && (
            <button 
              onClick={() => toast.success('Exporting keyword data')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleKeywordSearch} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search for Keyword</label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="digital marketing"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearchingKeyword || !keyword}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {isSearchingKeyword ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        {keywordResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Keyword Results</h4>
            
            {keywordResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{result.keyword}</h5>
                  <button
                    onClick={() => handleTrackKeyword(result)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Track</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-600">Search Volume</span>
                    <div className="font-medium text-gray-900">{result.volume.toLocaleString()}/mo</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">Difficulty</span>
                    <div className="font-medium text-gray-900">{result.difficulty}/100</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">CPC</span>
                    <div className="font-medium text-gray-900">${result.cpc}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">Competition</span>
                    <div className="font-medium text-gray-900">{result.competition}</div>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-600">Search Trend</span>
                  <div className="h-8 flex items-end space-x-1 mt-1">
                    {result.trend.map((value: number, i: number) => (
                      <div 
                        key={i}
                        className="bg-blue-500 rounded-t w-full"
                        style={{ height: `${value}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {keywordResults.length === 0 && !isSearchingKeyword && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Search for a keyword</h4>
            <p className="text-gray-600">Get search volume, difficulty, and more</p>
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
          onClick={() => toast.success('Refreshing keyword rankings')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Refresh Rankings</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-medium text-gray-900">Tracked Keywords</h4>
          <div className="text-sm text-gray-600">
            {trackedKeywords.length} keywords tracked
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keyword</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Position</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Change</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Volume</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Difficulty</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trackedKeywords.map((kw) => (
                <tr key={kw.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{kw.keyword}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      kw.position <= 3 ? 'bg-green-100 text-green-800' :
                      kw.position <= 10 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {kw.position}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {kw.change > 0 ? (
                        <>
                          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-600">+{kw.change}</span>
                        </>
                      ) : kw.change < 0 ? (
                        <>
                          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                          <span className="text-red-600">{kw.change}</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-600">0</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{kw.volume.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            kw.difficulty < 30 ? 'bg-green-500' :
                            kw.difficulty < 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${kw.difficulty}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{kw.difficulty}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a 
                      href={kw.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <span className="truncate max-w-[150px]">{kw.url}</span>
                      <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleRemoveKeyword(kw.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {trackedKeywords.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No keywords tracked yet</h4>
            <p className="text-gray-600">Search for keywords and add them to tracking</p>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderBacklinks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Backlink Analysis</h3>
        <button 
          onClick={() => toast.success('Refreshing backlink data')}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <LinkIcon className="w-4 h-4" />
          <span>Refresh Backlinks</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Backlinks</div>
            <div className="text-2xl font-bold text-gray-900">1,872</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Referring Domains</div>
            <div className="text-2xl font-bold text-gray-900">245</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Dofollow Links</div>
            <div className="text-2xl font-bold text-gray-900">1,458</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">New (Last 30 Days)</div>
            <div className="text-2xl font-bold text-gray-900">124</div>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-4">Top Backlinks</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Authority</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Anchor Text</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Discovered</th>
              </tr>
            </thead>
            <tbody>
              {backlinks.map((link) => (
                <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{link.source}</td>
                  <td className="px-4 py-3">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <span className="truncate max-w-[150px]">{link.url}</span>
                      <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-signal-blue to-beacon-orange flex items-center justify-center text-white font-medium mr-2">
                        {link.authority}
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            link.authority >= 70 ? 'bg-green-500' :
                            link.authority >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${link.authority}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{link.anchor}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      link.dofollow ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {link.dofollow ? 'Dofollow' : 'Nofollow'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{new Date(link.discovered).toLocaleDateString()}</td>
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
          onClick={handleRunAudit}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Run Audit</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-medium text-gray-900">Audit Results</h4>
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-signal-blue to-beacon-orange flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
              {siteAudit.score}
            </div>
            <div className="text-sm font-medium text-gray-900">Overall Score</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl font-bold mx-auto mb-2">
              {siteAudit.errors}
            </div>
            <div className="text-sm font-medium text-red-700">Errors</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-xl font-bold mx-auto mb-2">
              {siteAudit.warnings}
            </div>
            <div className="text-sm font-medium text-yellow-700">Warnings</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold mx-auto mb-2">
              {siteAudit.passed}
            </div>
            <div className="text-sm font-medium text-green-700">Passed</div>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-4">Issues to Fix</h4>
        
        <div className="space-y-4">
          {siteAudit.issues.map((issue: any, index: number) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                issue.type === 'error' ? 'bg-red-50 border border-red-200' :
                issue.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {issue.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : issue.type === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <h5 className={`font-medium ${
                    issue.type === 'error' ? 'text-red-700' :
                    issue.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {issue.message}
                  </h5>
                  <div className="mt-2 space-y-1">
                    {issue.pages.map((page: string, i: number) => (
                      <a 
                        key={i}
                        href={page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <span className="truncate">{page}</span>
                        <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                      </a>
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
        <h3 className="text-lg font-semibold text-gray-900">Competitor Research</h3>
        <button 
          onClick={handleAddCompetitor}
          className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Competitor</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Competitor Analysis</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Domain</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Traffic</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Keywords</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Backlinks</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Authority</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor) => (
                <tr key={competitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a 
                      href={`https://${competitor.domain}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {competitor.domain}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{competitor.traffic.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-900">{competitor.keywords.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-900">{competitor.backlinks.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-signal-blue to-beacon-orange flex items-center justify-center text-white font-medium mr-2">
                        {competitor.authority}
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            competitor.authority >= 70 ? 'bg-green-500' :
                            competitor.authority >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${competitor.authority}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toast.success(`Analyzing ${competitor.domain}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleRemoveCompetitor(competitor.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {competitors.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No competitors added yet</h4>
            <p className="text-gray-600">Add competitors to track and compare performance</p>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'domain', label: 'Domain Analyzer', icon: Globe },
    { id: 'keywords', label: 'Keyword Research', icon: Search },
    { id: 'rankings', label: 'Rankings', icon: TrendingUp },
    { id: 'backlinks', label: 'Backlinks', icon: LinkIcon },
    { id: 'audit', label: 'Site Audit', icon: CheckCircle },
    { id: 'competitors', label: 'Competitors', icon: BarChart3 }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Intelligence</h2>
        <p className="text-gray-600">Comprehensive SEO tools and insights for your websites</p>
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
        {activeTab === 'domain' && renderDomainAnalyzer()}
        {activeTab === 'keywords' && renderKeywordResearch()}
        {activeTab === 'rankings' && renderRankings()}
        {activeTab === 'backlinks' && renderBacklinks()}
        {activeTab === 'audit' && renderSiteAudit()}
        {activeTab === 'competitors' && renderCompetitors()}
      </div>
    </div>
  );
};

export default SEOIntelligenceHub;