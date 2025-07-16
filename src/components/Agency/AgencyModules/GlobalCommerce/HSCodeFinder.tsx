import React, { useState } from 'react';
import { Search, FileText, Info, Download, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const HSCodeFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  const [searchTimeoutId, setSearchTimeoutId] = useState<number | null>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm) {
      toast.error('Please enter a product description');
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    setSelectedCode(null);
    
    try {
      // Clear any existing timeout
      if (searchTimeoutId !== null) {
        clearTimeout(searchTimeoutId);
      }
      
      // In a real implementation, we would make an API call to search for HS codes
      // For now, we'll simulate the search process
      const newTimeoutId = window.setTimeout(() => {
        // Sample results based on search term
        const mockResults = [
          {
            code: '8471.30.0100',
            description: 'Portable automatic data processing machines, weighing not more than 10 kg, consisting of at least a central processing unit, a keyboard and a display',
            category: 'Electronics',
            chapter: '84',
            notes: 'Includes laptops, notebooks and sub-notebooks',
            duty_rates: {
              'US': '0%',
              'EU': '0%',
              'CA': '0%',
              'UK': '0%'
            }
          },
          {
            code: '8471.41.0100',
            description: 'Other automatic data processing machines comprising in the same housing at least a central processing unit and an input and output unit',
            category: 'Electronics',
            chapter: '84',
            notes: 'Includes desktop computers',
            duty_rates: {
              'US': '0%',
              'EU': '0%',
              'CA': '0%',
              'UK': '0%'
            }
          },
          {
            code: '8471.50.0100',
            description: 'Processing units other than those of subheading 8471.41 or 8471.49, whether or not containing in the same housing one or two of the following types of unit: storage units, input units, output units',
            category: 'Electronics',
            chapter: '84',
            notes: 'Includes computer processing units',
            duty_rates: {
              'US': '0%',
              'EU': '0%',
              'CA': '0%',
              'UK': '0%'
            }
          }
        ];
        
        setSearchResults(mockResults);
        toast.success(`Found ${mockResults.length} matching HS codes`);
        setIsSearching(false);
      }, 1500);
      
      // Store the timeout ID
      setSearchTimeoutId(newTimeoutId);
    } catch (error) {
      console.error('Error searching HS codes:', error);
      toast.error('Failed to search HS codes');
      setIsSearching(false);
    } finally {
      // Cleanup is handled in the timeout callback
    }
  };
  
  const handleSelectCode = (code: any) => {
    setSelectedCode(code);
    toast.success(`Selected HS code: ${code.code}`);
  };
  
  const handleExportCode = () => {
    if (!selectedCode) return;
    
    // In a real implementation, we would generate a PDF or CSV file
    toast.success(`Exporting HS code ${selectedCode.code} details`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">HS Code Finder</h3>
        {selectedCode && (
          <button 
            onClick={handleExportCode}
            className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export HS Code</span>
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Find the Right HS Code</h4>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                placeholder="Enter product description (e.g., laptop computer)"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchTerm}
              className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Find HS Code</span>
                </>
              )}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Enter a detailed product description for more accurate results. Include material, function, and use case.
          </p>
        </form>
        
        {searchResults.length > 0 && (
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-3">Search Results</h5>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCode && selectedCode.code === result.code 
                      ? 'border-signal-blue bg-blue-50' 
                      : 'border-gray-200 hover:border-signal-blue hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectCode(result)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium text-gray-900">{result.code}</div>
                    {selectedCode && selectedCode.code === result.code && (
                      <Check className="w-5 h-5 text-signal-blue" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Chapter {result.chapter}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded ml-2">
                      {result.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedCode && (
          <div className="border-t border-gray-200 pt-6">
            <h5 className="font-medium text-gray-900 mb-4">HS Code Details</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">HS Code</p>
                <p className="font-medium text-gray-900">{selectedCode.code}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{selectedCode.category}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium text-gray-900">{selectedCode.description}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium text-gray-900">{selectedCode.notes}</p>
              </div>
            </div>
            
            <h5 className="font-medium text-gray-900 mb-3">Duty Rates by Country</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(selectedCode.duty_rates).map(([country, rate]) => (
                <div key={country} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">{country}</p>
                  <p className="font-medium text-gray-900">{rate}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    This HS code may be eligible for preferential duty rates under certain Free Trade Agreements (FTAs). 
                    Use our FTA Checker tool to verify eligibility.
                  </p>
                  <button 
                    onClick={() => toast.success('Opening FTA Checker')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                  >
                    Check FTA Eligibility
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!searchResults.length && !isSearching && (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Find the Right HS Code</h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              The Harmonized System (HS) code is a standardized numerical method of classifying traded products. 
              Enter a product description to find the appropriate HS code.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 max-w-md mx-auto">
              <p className="flex items-center">
                <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  Try searching for "laptop computer" to see sample results.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HSCodeFinder;