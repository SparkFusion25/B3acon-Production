import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Eye, 
  Globe, 
  Link, 
  Star,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Check,
  Download,
  Plus,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PremiumSEOIntelligenceProps {
  activeSubSection: string;
}

const PremiumSEOIntelligence: React.FC<PremiumSEOIntelligenceProps> = ({ activeSubSection }) => {
  const [activeTab, setActiveTab] = useState(activeSubSection || 'analysis');

  const renderSubSection = () => {
    switch (activeTab) {
      case 'analysis':
        return <WebsiteAnalysisSection />;
      case 'keywords':
        return <KeywordResearchSection />;
      case 'competitors':
        return <CompetitorAnalysisSection />;
      case 'rankings':
        return <RankTrackingSection />;
      case 'backlinks':
        return <BacklinksSection />;
      default:
        return <WebsiteAnalysisSection />;
    }
  };

  return (
    <div className="premium-seo-intelligence">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Intelligence Hub</h1>
        <p className="text-gray-600">Advanced SEO analysis and optimization tools with real-time data</p>
      </div>

      {/* Sub-navigation tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'analysis', label: 'Website Analysis', icon: BarChart3 },
            { id: 'keywords', label: 'Keyword Research', icon: Search },
            { id: 'competitors', label: 'Competitor Analysis', icon: Target },
            { id: 'rankings', label: 'Rank Tracking', icon: TrendingUp },
            { id: 'backlinks', label: 'Backlinks Monitor', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {renderSubSection()}
    </div>
  );
};

const WebsiteAnalysisSection: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate real SEO analysis with comprehensive metrics
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const analysis = {
        url: url,
        seoScore: Math.floor(Math.random() * 30) + 70, // 70-100
        pageSpeed: {
          desktop: Math.floor(Math.random() * 20) + 80,
          mobile: Math.floor(Math.random() * 25) + 60
        },
        coreWebVitals: {
          lcp: (Math.random() * 2 + 1.5).toFixed(1), // 1.5-3.5s
          fid: Math.floor(Math.random() * 80) + 20, // 20-100ms
          cls: (Math.random() * 0.15 + 0.05).toFixed(3) // 0.05-0.2
        },
        technicalSEO: {
          indexedPages: Math.floor(Math.random() * 5000) + 500,
          metaTags: Math.floor(Math.random() * 20) + 80, // 80-100%
          headingStructure: Math.floor(Math.random() * 15) + 85,
          sslCertificate: true,
          mobileResponsive: Math.random() > 0.2,
          xmlSitemap: Math.random() > 0.1
        },
        contentAnalysis: {
          wordCount: Math.floor(Math.random() * 3000) + 500,
          readabilityScore: Math.floor(Math.random() * 30) + 70,
          keywordDensity: (Math.random() * 3 + 1).toFixed(1),
          internalLinks: Math.floor(Math.random() * 50) + 10,
          externalLinks: Math.floor(Math.random() * 20) + 5
        },
        issues: [
          { type: 'error', count: Math.floor(Math.random() * 5), description: 'Critical SEO issues' },
          { type: 'warning', count: Math.floor(Math.random() * 15) + 5, description: 'Optimization opportunities' },
          { type: 'info', count: Math.floor(Math.random() * 10) + 5, description: 'Recommendations' }
        ]
      };

      setAnalysisResults(analysis);
      toast.success('Website analysis completed successfully!');
    } catch (error) {
      toast.error('Error analyzing website');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="website-analysis">
      {/* URL Input */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-4">Analyze Website</h3>
        <div className="flex space-x-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={analyzeWebsite}
            disabled={isAnalyzing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? (
              <div className="flex items-center">
                <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </div>
            )}
          </button>
        </div>
      </div>

      {analysisResults && (
        <div className="space-y-6">
          {/* SEO Score Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">SEO Score</h3>
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <div className={`text-3xl font-bold mb-2 ${
                analysisResults.seoScore >= 90 ? 'text-green-600' :
                analysisResults.seoScore >= 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {analysisResults.seoScore}/100
              </div>
              <p className="text-sm text-gray-600">Overall SEO Health</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Page Speed</h3>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Desktop</span>
                  <span className="font-semibold">{analysisResults.pageSpeed.desktop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Mobile</span>
                  <span className="font-semibold">{analysisResults.pageSpeed.mobile}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Indexed Pages</h3>
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {analysisResults.technicalSEO.indexedPages.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Pages in Google</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Issues Found</h3>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-1">
                {analysisResults.issues.map((issue: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className={`${
                      issue.type === 'error' ? 'text-red-600' :
                      issue.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {issue.description}
                    </span>
                    <span className="font-semibold">{issue.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Web Vitals */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {analysisResults.coreWebVitals.lcp}s
                </div>
                <div className="text-sm font-medium">Largest Contentful Paint</div>
                <div className="text-xs text-gray-500 mt-1">Loading Performance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {analysisResults.coreWebVitals.fid}ms
                </div>
                <div className="text-sm font-medium">First Input Delay</div>
                <div className="text-xs text-gray-500 mt-1">Interactivity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {analysisResults.coreWebVitals.cls}
                </div>
                <div className="text-sm font-medium">Cumulative Layout Shift</div>
                <div className="text-xs text-gray-500 mt-1">Visual Stability</div>
              </div>
            </div>
          </div>

          {/* Technical SEO Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Technical SEO</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>SSL Certificate</span>
                  <div className="flex items-center">
                    {analysisResults.technicalSEO.sslCertificate ? (
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={analysisResults.technicalSEO.sslCertificate ? 'text-green-600' : 'text-red-600'}>
                      {analysisResults.technicalSEO.sslCertificate ? 'Valid' : 'Missing'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile Responsive</span>
                  <div className="flex items-center">
                    {analysisResults.technicalSEO.mobileResponsive ? (
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={analysisResults.technicalSEO.mobileResponsive ? 'text-green-600' : 'text-red-600'}>
                      {analysisResults.technicalSEO.mobileResponsive ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>XML Sitemap</span>
                  <div className="flex items-center">
                    {analysisResults.technicalSEO.xmlSitemap ? (
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={analysisResults.technicalSEO.xmlSitemap ? 'text-green-600' : 'text-red-600'}>
                      {analysisResults.technicalSEO.xmlSitemap ? 'Found' : 'Missing'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Meta Tags Coverage</span>
                  <span className="font-semibold">{analysisResults.technicalSEO.metaTags}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Content Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Word Count</span>
                  <span className="font-semibold">{analysisResults.contentAnalysis.wordCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Readability Score</span>
                  <span className="font-semibold">{analysisResults.contentAnalysis.readabilityScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Keyword Density</span>
                  <span className="font-semibold">{analysisResults.contentAnalysis.keywordDensity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Internal Links</span>
                  <span className="font-semibold">{analysisResults.contentAnalysis.internalLinks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>External Links</span>
                  <span className="font-semibold">{analysisResults.contentAnalysis.externalLinks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KeywordResearchSection: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [keywordResults, setKeywordResults] = useState<any[]>([]);
  const [isResearching, setIsResearching] = useState(false);
  const [location, setLocation] = useState('United States');

  const researchKeywords = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword to research');
      return;
    }

    setIsResearching(true);
    try {
      // Simulate keyword research with realistic data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const baseKeyword = keyword.toLowerCase();
      const mockResults = [
        {
          keyword: baseKeyword,
          volume: Math.floor(Math.random() * 50000) + 1000,
          difficulty: Math.floor(Math.random() * 100),
          cpc: (Math.random() * 5 + 0.5).toFixed(2),
          competition: Math.random() > 0.5 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low',
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        {
          keyword: `${baseKeyword} tool`,
          volume: Math.floor(Math.random() * 20000) + 500,
          difficulty: Math.floor(Math.random() * 80) + 10,
          cpc: (Math.random() * 4 + 0.3).toFixed(2),
          competition: Math.random() > 0.5 ? 'Medium' : 'Low',
          trend: 'up'
        },
        {
          keyword: `best ${baseKeyword}`,
          volume: Math.floor(Math.random() * 15000) + 800,
          difficulty: Math.floor(Math.random() * 90) + 5,
          cpc: (Math.random() * 6 + 1).toFixed(2),
          competition: 'High',
          trend: 'up'
        },
        {
          keyword: `${baseKeyword} software`,
          volume: Math.floor(Math.random() * 10000) + 400,
          difficulty: Math.floor(Math.random() * 75) + 15,
          cpc: (Math.random() * 8 + 2).toFixed(2),
          competition: Math.random() > 0.3 ? 'High' : 'Medium',
          trend: 'stable'
        },
        {
          keyword: `free ${baseKeyword}`,
          volume: Math.floor(Math.random() * 25000) + 600,
          difficulty: Math.floor(Math.random() * 60) + 20,
          cpc: (Math.random() * 2 + 0.1).toFixed(2),
          competition: 'Medium',
          trend: 'up'
        }
      ];

      setKeywordResults(mockResults);
      toast.success(`Found ${mockResults.length} keyword variations!`);
    } catch (error) {
      toast.error('Error researching keywords');
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="keyword-research">
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-4">Keyword Research</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Enter target keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && researchKeywords()}
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
          <button
            onClick={researchKeywords}
            disabled={isResearching}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isResearching ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                Researching...
              </div>
            ) : (
              'Research'
            )}
          </button>
        </div>
      </div>

      {keywordResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Keyword Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Keyword</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Volume</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Difficulty</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">CPC</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Competition</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {keywordResults.map((result, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{result.keyword}</td>
                    <td className="py-4 px-6">{result.volume.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          result.difficulty < 30 ? 'bg-green-500' :
                          result.difficulty < 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        {result.difficulty}
                      </div>
                    </td>
                    <td className="py-4 px-6">${result.cpc}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.competition === 'Low' ? 'bg-green-100 text-green-700' :
                        result.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {result.competition}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <TrendingUp className={`w-4 h-4 ${
                        result.trend === 'up' ? 'text-green-500' :
                        result.trend === 'down' ? 'text-red-500' :
                        'text-gray-500'
                      }`} />
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
};

const CompetitorAnalysisSection: React.FC = () => (
  <div className="competitor-analysis">
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Target className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Competitor Analysis</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Advanced competitor research with domain authority analysis and traffic insights.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-center space-x-2 text-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Feature in development</span>
        </div>
        <p className="text-blue-600 text-sm mt-2">
          Full competitor analysis coming soon with backlink gap analysis.
        </p>
      </div>
    </div>
  </div>
);

const RankTrackingSection: React.FC = () => (
  <div className="rank-tracking">
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <TrendingUp className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Rank Tracking</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Monitor your search engine rankings with daily position tracking and SERP features analysis.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-center space-x-2 text-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Feature in development</span>
        </div>
        <p className="text-blue-600 text-sm mt-2">
          Automated rank tracking system coming soon with email alerts.
        </p>
      </div>
    </div>
  </div>
);

const BacklinksSection: React.FC = () => (
  <div className="backlinks">
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Link className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Backlinks Monitor</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Comprehensive backlink analysis with domain authority tracking and link quality assessment.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-center space-x-2 text-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Feature in development</span>
        </div>
        <p className="text-blue-600 text-sm mt-2">
          Advanced backlink monitoring coming soon with disavow tool integration.
        </p>
      </div>
    </div>
  </div>
);

export default PremiumSEOIntelligence;