import React from 'react';

const Prospecting: React.FC = () => {
  return (
    <div className="prospecting p-6">
      <div className="header mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lead Prospecting</h1>
        <p className="text-gray-600">Find and generate new leads for your business</p>
      </div>

      <div className="tools-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="tool-card bg-white p-6 rounded-lg shadow-lg">
          <div className="tool-icon text-3xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Target Audience Research</h3>
          <p className="text-gray-600 mb-4">Identify your ideal customers and market segments</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Start Research
          </button>
        </div>

        <div className="tool-card bg-white p-6 rounded-lg shadow-lg">
          <div className="tool-icon text-3xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Finder</h3>
          <p className="text-gray-600 mb-4">Find verified email addresses for your prospects</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Find Emails
          </button>
        </div>

        <div className="tool-card bg-white p-6 rounded-lg shadow-lg">
          <div className="tool-icon text-3xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Lead Scoring</h3>
          <p className="text-gray-600 mb-4">Score and prioritize leads using AI</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Score Leads
          </button>
        </div>
      </div>

      <div className="prospecting-stats bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Prospecting Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-item text-center">
            <div className="text-3xl font-bold text-blue-600">247</div>
            <div className="text-sm text-gray-600">Total Prospects</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-3xl font-bold text-green-600">45</div>
            <div className="text-sm text-gray-600">Qualified Leads</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-3xl font-bold text-purple-600">18%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-3xl font-bold text-orange-600">$12,500</div>
            <div className="text-sm text-gray-600">Pipeline Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prospecting;