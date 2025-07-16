import React, { useState } from 'react';
import { DollarSign, Truck, Package, AlertCircle, Info, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LandedCostEstimator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const handleCalculate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      toast.success('Landed cost calculation complete');
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Landed Cost Estimator</h3>
        {showResults && (
          <button 
            onClick={() => toast.success('Exporting calculation results')}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        )}
      </div>
      
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Coming Soon</h4>
            <p className="text-blue-800">
              The Landed Cost Estimator is currently in development and will be available soon. This tool will provide comprehensive landed cost calculations including duties, taxes, shipping, insurance, and handling fees.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Comprehensive Landed Cost Calculation</h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Calculate the true total cost of importing goods, including all fees, taxes, and handling costs.
          </p>
          <button 
            onClick={handleCalculate}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="inline-block mr-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Calculating...
              </>
            ) : (
              'Preview Landed Cost Calculator'
            )}
          </button>
        </div>
      </div>
      
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Sample Calculation</h4>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Product Value:</span>
                  <span className="font-medium text-gray-900">$10,000.00</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Freight Cost:</span>
                  <span className="font-medium text-gray-900">$1,200.00</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Insurance:</span>
                  <span className="font-medium text-gray-900">$150.00</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Import Duty (5.3%):</span>
                  <span className="font-medium text-gray-900">$601.90</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">VAT/Sales Tax (20%):</span>
                  <span className="font-medium text-gray-900">$2,390.38</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customs Clearance Fee:</span>
                  <span className="font-medium text-gray-900">$150.00</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Handling Fees:</span>
                  <span className="font-medium text-gray-900">$75.00</span>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg text-white">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Landed Cost:</span>
                  <span className="font-bold text-xl">$14,567.28</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Cost Breakdown</h4>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Product Cost</span>
                <span className="text-sm font-medium text-gray-900">68.6%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '68.6%' }}></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Shipping & Insurance</span>
                <span className="text-sm font-medium text-gray-900">9.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '9.3%' }}></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Duties</span>
                <span className="text-sm font-medium text-gray-900">4.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '4.1%' }}></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Taxes</span>
                <span className="text-sm font-medium text-gray-900">16.4%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '16.4%' }}></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Fees</span>
                <span className="text-sm font-medium text-gray-900">1.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '1.5%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Key Insights</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Taxes represent a significant portion (16.4%) of your landed cost</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Consider FTA eligibility to potentially reduce or eliminate the 4.1% duty</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Shipping costs could be optimized with different carrier options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandedCostEstimator;