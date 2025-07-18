import React, { useState } from 'react';
import { Search, BarChart3, Target, TrendingUp, Eye, Globe, Link, Star } from 'lucide-react';

interface SEOIntelligenceViewProps {
  activeSubSection: string;
}

const SEOIntelligenceView: React.FC<SEOIntelligenceViewProps> = ({ activeSubSection }) => {
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
    <div className="seo-intelligence">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Intelligence</h1>
        <p className="text-gray-600">Optimize your search engine performance with advanced analytics</p>
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

const WebsiteAnalysisSection: React.FC = () => (
  <div className="website-analysis">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">SEO Score</h3>
          <Globe className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-3xl font-bold text-green-600 mb-2">94/100</div>
        <p className="text-sm text-gray-600">+8 points this month</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Indexed Pages</h3>
          <BarChart3 className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">1,247</div>
        <p className="text-sm text-gray-600">+156 pages indexed</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Core Web Vitals</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-3xl font-bold text-green-600 mb-2">Good</div>
        <p className="text-sm text-gray-600">All metrics passing</p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Website Performance Analysis</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">Page Load Speed</span>
          </div>
          <span className="text-green-600 font-semibold">Excellent (2.1s)</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium">Mobile Responsiveness</span>
          </div>
          <span className="text-yellow-600 font-semibold">Good (needs improvement)</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">SSL Certificate</span>
          </div>
          <span className="text-green-600 font-semibold">Valid</span>
        </div>
      </div>
    </div>
  </div>
);

const KeywordResearchSection: React.FC = () => (
  <div className="keyword-research">
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Enter keyword to research..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Research
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Top Keywords</h3>
        <div className="space-y-3">
          {[
            { keyword: 'digital marketing', volume: '45K', difficulty: 'Medium', position: 3 },
            { keyword: 'SEO tools', volume: '28K', difficulty: 'High', position: 7 },
            { keyword: 'content marketing', volume: '67K', difficulty: 'Low', position: 2 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{item.keyword}</div>
                <div className="text-sm text-gray-600">Volume: {item.volume}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">Pos. {item.position}</div>
                <div className={`text-xs px-2 py-1 rounded ${
                  item.difficulty === 'Low' ? 'bg-green-100 text-green-700' :
                  item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.difficulty}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Keyword Opportunities</h3>
        <div className="space-y-3">
          {[
            { keyword: 'local SEO services', volume: '12K', opportunity: 'High' },
            { keyword: 'SEO audit checklist', volume: '8K', opportunity: 'Medium' },
            { keyword: 'enterprise SEO', volume: '15K', opportunity: 'High' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium">{item.keyword}</div>
                <div className="text-sm text-gray-600">Volume: {item.volume}</div>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-semibold ${
                item.opportunity === 'High' ? 'bg-green-100 text-green-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {item.opportunity} Opportunity
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CompetitorAnalysisSection: React.FC = () => (
  <div className="competitor-analysis">
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-lg font-semibold mb-4">Competitor Overview</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Competitor</th>
              <th className="text-left py-3">Domain Authority</th>
              <th className="text-left py-3">Backlinks</th>
              <th className="text-left py-3">Organic Traffic</th>
              <th className="text-left py-3">Top Keywords</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'competitor1.com', da: 87, backlinks: '125K', traffic: '450K', keywords: 1247 },
              { name: 'competitor2.com', da: 92, backlinks: '200K', traffic: '680K', keywords: 2156 },
              { name: 'competitor3.com', da: 78, backlinks: '89K', traffic: '320K', keywords: 987 }
            ].map((comp, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 font-medium">{comp.name}</td>
                <td className="py-3">{comp.da}</td>
                <td className="py-3">{comp.backlinks}</td>
                <td className="py-3">{comp.traffic}</td>
                <td className="py-3">{comp.keywords}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const RankTrackingSection: React.FC = () => (
  <div className="rank-tracking">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Ranking Progress</h3>
        <div className="space-y-4">
          {[
            { keyword: 'digital marketing', current: 3, previous: 5, change: '+2' },
            { keyword: 'SEO services', current: 7, previous: 9, change: '+2' },
            { keyword: 'content strategy', current: 12, previous: 8, change: '-4' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{item.keyword}</div>
                <div className="text-sm text-gray-600">Position {item.current}</div>
              </div>
              <div className={`px-2 py-1 rounded text-sm font-semibold ${
                item.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {item.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">SERP Features</h3>
        <div className="space-y-3">
          {[
            { feature: 'Featured Snippets', count: 23, status: 'Winning' },
            { feature: 'Local Pack', count: 8, status: 'Appearing' },
            { feature: 'Knowledge Panel', count: 1, status: 'Winning' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{item.feature}</div>
                <div className="text-sm text-gray-600">{item.count} keywords</div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                item.status === 'Winning' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const BacklinksSection: React.FC = () => (
  <div className="backlinks">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Total Backlinks</h3>
          <Link className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">12,847</div>
        <p className="text-sm text-gray-600">+234 this month</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Referring Domains</h3>
          <Globe className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">2,156</div>
        <p className="text-sm text-gray-600">+45 new domains</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Domain Authority</h3>
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">85</div>
        <p className="text-sm text-gray-600">+3 points increase</p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Recent Backlinks</h3>
      <div className="space-y-3">
        {[
          { domain: 'techcrunch.com', da: 95, type: 'Editorial', anchor: 'digital marketing' },
          { domain: 'marketingland.com', da: 87, type: 'Guest Post', anchor: 'SEO tools' },
          { domain: 'searchenginejournal.com', da: 89, type: 'Resource Page', anchor: 'content marketing' }
        ].map((link, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">{link.domain}</div>
              <div className="text-sm text-gray-600">Anchor: "{link.anchor}"</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">DA {link.da}</div>
              <div className="text-xs text-gray-500">{link.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SEOIntelligenceView;