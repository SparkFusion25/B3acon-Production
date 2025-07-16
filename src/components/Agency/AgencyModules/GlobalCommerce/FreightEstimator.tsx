import React, { useState } from 'react';
import { Truck, Ship, Plane, DollarSign, Info, Package, MapPin, Calendar, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FreightEstimator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [estimatorTimeoutId, setEstimatorTimeoutId] = useState<number | null>(null);
  
  const handleCalculate = () => {
    setIsLoading(true);
    
    // Clear any existing timeout
    if (estimatorTimeoutId !== null) {
      clearTimeout(estimatorTimeoutId);
    }
    
    // Simulate API call
    const newTimeoutId = window.setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      toast.success('Freight rate calculation complete');
    }, 1500);
    
    // Store the timeout ID
    setEstimatorTimeoutId(newTimeoutId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Freight Rate Estimator</h3>
        {showResults && (
          <button 
            onClick={() => toast.success('Exporting freight rates')}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Rates</span>
          </button>
        )}
      </div>
      
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Coming Soon</h4>
            <p className="text-blue-800">
              The Freight Rate Estimator is currently in development and will be available soon. This tool will provide real-time freight rates for ocean, air, and ground shipping across global trade lanes.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Compare Freight Rates</h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Compare rates across multiple carriers and shipping modes to find the best option for your shipments.
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
              'Preview Freight Estimator'
            )}
          </button>
        </div>
      </div>
      
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Ocean Freight</h4>
                <p className="text-sm text-gray-600">15-20 days transit time</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Base Rate:</span>
                <span className="font-medium text-gray-900">$1,850.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Fuel Surcharge:</span>
                <span className="font-medium text-gray-900">$275.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Documentation:</span>
                <span className="font-medium text-gray-900">$95.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Terminal Handling:</span>
                <span className="font-medium text-gray-900">$180.00</span>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-xl">$2,400.00</span>
              </div>
            </div>
            
            <button 
              onClick={() => toast.success('Ocean freight quote selected')}
              className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Select Quote
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Air Freight</h4>
                <p className="text-sm text-gray-600">3-5 days transit time</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Base Rate:</span>
                <span className="font-medium text-gray-900">$4,250.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Fuel Surcharge:</span>
                <span className="font-medium text-gray-900">$850.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Security Fee:</span>
                <span className="font-medium text-gray-900">$125.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Handling:</span>
                <span className="font-medium text-gray-900">$275.00</span>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-xl">$5,500.00</span>
              </div>
            </div>
            
            <button 
              onClick={() => toast.success('Air freight quote selected')}
              className="w-full mt-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Select Quote
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Ground Freight</h4>
                <p className="text-sm text-gray-600">7-10 days transit time</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Base Rate:</span>
                <span className="font-medium text-gray-900">$2,150.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Fuel Surcharge:</span>
                <span className="font-medium text-gray-900">$325.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Border Crossing:</span>
                <span className="font-medium text-gray-900">$175.00</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Insurance:</span>
                <span className="font-medium text-gray-900">$150.00</span>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-xl">$2,800.00</span>
              </div>
            </div>
            
            <button 
              onClick={() => toast.success('Ground freight quote selected')}
              className="w-full mt-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Select Quote
            </button>
          </div>
        </div>
      )}
      
      {showResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Shipment Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <Package className="w-5 h-5 text-gray-400 mr-2" />
                <h6 className="font-medium text-gray-900">Cargo Details</h6>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Cargo Type:</span>
                  <span className="font-medium text-gray-900">General Merchandise</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium text-gray-900">500 kg</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-medium text-gray-900">2.5 CBM</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Packaging:</span>
                  <span className="font-medium text-gray-900">Palletized</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <h6 className="font-medium text-gray-900">Route Information</h6>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Origin:</span>
                  <span className="font-medium text-gray-900">Shanghai, China</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium text-gray-900">Los Angeles, USA</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Incoterm:</span>
                  <span className="font-medium text-gray-900">FOB Shanghai</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Ready Date:</span>
                  <span className="font-medium text-gray-900">Feb 15, 2025</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Rate Validity</p>
                <p className="text-xs text-yellow-700 mt-1">
                  These rates are valid for 7 days and subject to equipment and space availability. 
                  Rates do not include destination charges, customs clearance, or duties and taxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreightEstimator;