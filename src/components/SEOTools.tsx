import React from 'react';

const SEOTools: React.FC = () => {
  return (
    <div className="seo-tools p-6">
      <div className="header mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SEO Tools</h1>
        <p className="text-gray-600">Optimize your store's search engine performance</p>
      </div>

      <div className="tools-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="tool-card bg-white p-6 rounded-lg shadow-lg">
          <div className="tool-icon text-3xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Keyword Research</h3>
          <p className="text-gray-600 mb-4">Find the best keywords for your products</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Start Research
          </button>
        </div>

        <div className="tool-card bg-white p-6 rounded-lg shadow-lg">
          <div className="tool-icon text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">SEO Analysis</h3>
          <p className="text-gray-600 mb-4">Analyze your store's SEO performance</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Run Analysis
          </button>
        </div>

        <div className="tool-card bg-white p-6 rounded-lg shadow-lg">
          <div className="tool-icon text-3xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Optimizer</h3>
          <p className="text-gray-600 mb-4">Optimize your product descriptions</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Optimize Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOTools;