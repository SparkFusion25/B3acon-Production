import React, { useState } from 'react';
import { TrendingUp, Search, Target, BarChart3, Globe, FileText, Link as LinkIcon, ArrowRight, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SEOIntelligenceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [domainInput, setDomainInput] = useState('');
  const [analyzedDomain, setAnalyzedDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const handleViewDetails = () => {
    toast.success('Viewing detailed SEO analysis');
  };
  
  const handleExportReport = () => {
    toast.success('Exporting SEO report');
  };

  const handleDomainAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput) return;
    
    setIsAnalyzing(true);
    setAnalyzedDomain(domainInput);
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
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
                <div className="text-2xl font-bold text-gray-900 mb-1">42/100</div>
                <p className="text-sm text-green-600">↗ +3 this month</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Organic Keywords</h4>
                  <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">1,248</div>
                <p className="text-sm text-green-600">↗ +156 this month</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Backlinks</h4>
                  <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">3,842</div>
                <p className="text-sm text-green-600">↗ +215 this month</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Page Speed</h4>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">78/100</div>
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
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">digital marketing agency</td>
                      <td className="px-4 py-3 text-sm text-gray-600">8</td>
                      <td className="px-4 py-3 text-sm text-gray-600">12,400</td>
                      <td className="px-4 py-3 text-sm text-gray-600">67</td>
                      <td className="px-4 py-3 text-sm text-gray-600">$15.20</td>
                      <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">/services</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">seo services</td>
                      <td className="px-4 py-3 text-sm text-gray-600">12</td>
                      <td className="px-4 py-3 text-sm text-gray-600">8,100</td>
                      <td className="px-4 py-3 text-sm text-gray-600">72</td>
                      <td className="px-4 py-3 text-sm text-gray-600">$18.50</td>
                      <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">/seo-services</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">ppc management</td>
                      <td className="px-4 py-3 text-sm text-gray-600">5</td>
                      <td className="px-4 py-3 text-sm text-gray-600">5,400</td>
                      <td className="px-4 py-3 text-sm text-gray-600">58</td>
                      <td className="px-4 py-3 text-sm text-gray-600">$12.30</td>
                      <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">/ppc-management</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">social media marketing</td>
                      <td className="px-4 py-3 text-sm text-gray-600">15</td>
                      <td className="px-4 py-3 text-sm text-gray-600">9,200</td>
                      <td className="px-4 py-3 text-sm text-gray-600">64</td>
                      <td className="px-4 py-3 text-sm text-gray-600">$14.80</td>
                      <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">/social-media</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">content marketing strategy</td>
                      <td className="px-4 py-3 text-sm text-gray-600">9</td>
                      <td className="px-4 py-3 text-sm text-gray-600">3,800</td>
                      <td className="px-4 py-3 text-sm text-gray-600">51</td>
                      <td className="px-4 py-3 text-sm text-gray-600">$9.40</td>
                      <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">/content-marketing</td>
                    </tr>
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
      <h3 className="text-lg font-semibold text-gray-900">Keyword Research</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Keyword Research Tools</h4>
          <p className="text-gray-600 mb-4">Advanced keyword research and competitor analysis tools.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all">
            Start Keyword Research
          </button>
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
        {activeTab === 'rankings' && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rankings Coming Soon</h3>
            <p className="text-gray-600">Detailed ranking tracking features will be available soon.</p>
          </div>
        )}
        {activeTab === 'backlinks' && (
          <div className="text-center py-12">
            <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Backlinks Analysis Coming Soon</h3>
            <p className="text-gray-600">Detailed backlink analysis features will be available soon.</p>
          </div>
        )}
        {activeTab === 'site-audit' && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Site Audit Coming Soon</h3>
            <p className="text-gray-600">Detailed site audit features will be available soon.</p>
          </div>
        )}
        {activeTab === 'competitors' && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Competitor Analysis Coming Soon</h3>
            <p className="text-gray-600">Detailed competitor analysis features will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOIntelligenceHub;