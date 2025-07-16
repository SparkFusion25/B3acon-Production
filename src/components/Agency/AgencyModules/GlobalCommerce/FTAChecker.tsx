import React, { useState } from 'react';
import { FileCheck, Search, Info, Check, X, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FTAChecker: React.FC = () => {
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [checkTimeoutId, setCheckTimeoutId] = useState<number | null>(null);
  
  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originCountry || !destinationCountry || !hsCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsChecking(true);
    
    try {
      // Clear any existing timeout
      if (checkTimeoutId !== null) {
        clearTimeout(checkTimeoutId);
      }
      
      // In a real implementation, we would make an API call to check FTA eligibility
      // For now, we'll simulate the check process
      const newTimeoutId = window.setTimeout(() => {
        // Sample results based on countries and HS code
        const mockResults = {
          origin_country: originCountry,
          destination_country: destinationCountry,
          hs_code: hsCode,
          product_description: 'Portable automatic data processing machines, weighing not more than 10 kg, consisting of at least a central processing unit, a keyboard and a display',
          agreements: [
            {
              name: 'USMCA (United States-Mexico-Canada Agreement)',
              eligible: originCountry === 'US' && destinationCountry === 'CA' || originCountry === 'CA' && destinationCountry === 'US',
              normal_duty_rate: '0%',
              preferential_duty_rate: '0%',
              requirements: [
                'Regional Value Content (RVC) of at least 60%',
                'Certificate of Origin required',
                'Direct shipment between parties'
              ]
            },
            {
              name: 'US-Korea Free Trade Agreement (KORUS)',
              eligible: originCountry === 'US' && destinationCountry === 'KR' || originCountry === 'KR' && destinationCountry === 'US',
              normal_duty_rate: '8%',
              preferential_duty_rate: '0%',
              requirements: [
                'Product must be originating according to KORUS rules',
                'Certificate of Origin required',
                'Direct shipment between parties'
              ]
            },
            {
              name: 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership (CPTPP)',
              eligible: ['CA', 'JP', 'AU', 'NZ', 'SG', 'MX'].includes(originCountry) && ['CA', 'JP', 'AU', 'NZ', 'SG', 'MX'].includes(destinationCountry),
              normal_duty_rate: '5%',
              preferential_duty_rate: '0%',
              requirements: [
                'Product must be originating according to CPTPP rules',
                'Certificate of Origin required',
                'Direct shipment between parties'
              ]
            }
          ]
        };
        
        setResults(mockResults);
        toast.success('FTA eligibility check completed');
        setIsChecking(false);
      }, 1500);
      
      // Store the timeout ID
      setCheckTimeoutId(newTimeoutId);
    } catch (error) {
      console.error('Error checking FTA eligibility:', error);
      toast.error('Failed to check FTA eligibility');
      setIsChecking(false);
    } finally {
      // Cleanup is handled in the timeout callback
    }
  };
  
  const handleExportResults = () => {
    if (!results) return;
    
    // In a real implementation, we would generate a PDF or CSV file
    toast.success('Exporting FTA eligibility results');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">FTA Eligibility Checker</h3>
        {results && (
          <button 
            onClick={handleExportResults}
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
              The FTA Eligibility Checker is currently in development and will be available soon. This tool will help you determine if your products qualify for preferential duty rates under various Free Trade Agreements.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Check FTA Eligibility</h4>
        
        <form onSubmit={handleCheck} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin Country *</label>
              <select
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                required
              >
                <option value="">Select Origin Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="AU">Australia</option>
                <option value="NZ">New Zealand</option>
                <option value="SG">Singapore</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country *</label>
              <select
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                required
              >
                <option value="">Select Destination Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="AU">Australia</option>
                <option value="NZ">New Zealand</option>
                <option value="SG">Singapore</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HS Code *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                placeholder="e.g., 8471.30"
                required
              />
              <button 
                type="button"
                onClick={() => toast.success('Opening HS Code Finder')}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-10 digit HS code for your product. Don't know your HS code? Use our HS Code Finder.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isChecking}
            className="w-full py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isChecking ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-5 h-5" />
                <span>Check FTA Eligibility</span>
              </>
            )}
          </button>
        </form>
        
        {results && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Eligibility Results</h4>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Origin Country</p>
                  <p className="font-medium text-gray-900">{results.origin_country}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Destination Country</p>
                  <p className="font-medium text-gray-900">{results.destination_country}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">HS Code</p>
                  <p className="font-medium text-gray-900">{results.hs_code}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Product Description</p>
                  <p className="font-medium text-gray-900">{results.product_description}</p>
                </div>
              </div>
            </div>
            
            <h5 className="font-medium text-gray-900 mb-3">Applicable Trade Agreements</h5>
            <div className="space-y-4">
              {results.agreements.map((agreement: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  agreement.eligible ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="font-medium text-gray-900">{agreement.name}</h6>
                    {agreement.eligible ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Eligible
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium flex items-center">
                        <X className="w-3 h-3 mr-1" />
                        Not Eligible
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Normal Duty Rate</p>
                      <p className="font-medium text-gray-900">{agreement.normal_duty_rate}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Preferential Duty Rate</p>
                      <p className={`font-medium ${agreement.eligible ? 'text-green-600' : 'text-gray-400'}`}>
                        {agreement.preferential_duty_rate}
                      </p>
                    </div>
                  </div>
                  
                  {agreement.eligible && (
                    <div>
                      <p className="text-xs text-gray-700 font-medium mb-1">Requirements:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {agreement.requirements.map((req: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    To claim preferential duty rates under an FTA, you must ensure your product meets all origin requirements and provide the necessary documentation.
                  </p>
                  <button 
                    onClick={() => toast.success('Opening documentation guide')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                  >
                    View Documentation Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!results && !isChecking && (
          <div className="text-center py-8">
            <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">FTA Eligibility Checker</h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Determine if your products qualify for preferential duty rates under Free Trade Agreements (FTAs) between countries.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 max-w-md mx-auto">
              <p className="flex items-center">
                <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  Try selecting US and Canada with HS code 8471.30 to see a sample result.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FTAChecker;