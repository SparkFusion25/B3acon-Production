import React, { useState } from 'react';
import { ShieldCheck, Search, AlertCircle, Check, Info, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ComplianceChecker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('entity');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [searchTimeoutId, setSearchTimeoutId] = useState<number | null>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm) {
      toast.error('Please enter a search term');
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Clear any existing timeout
      if (searchTimeoutId !== null) {
        clearTimeout(searchTimeoutId);
      }
      
      // In a real implementation, we would make an API call to check compliance
      // For now, we'll simulate the search process
      const newTimeoutId = window.setTimeout(() => {
        // Sample results based on search term
        if (searchTerm.toLowerCase().includes('restricted')) {
          setResults({
            status: 'match_found',
            matches: [
              {
                entity_name: 'Restricted Trading Company',
                list_name: 'Entity List (EL) - Bureau of Industry and Security',
                match_score: 95,
                address: '123 Restricted St, Sanctioned City, 12345',
                country: 'Restricted Country',
                federal_register_notice: 'Vol. 84, No. 115, 06/14/2019',
                start_date: '2019-06-14',
                remarks: 'Determined to be acting contrary to the national security or foreign policy interests of the United States'
              }
            ]
          });
        } else {
          setResults({
            status: 'no_matches',
            searched_term: searchTerm,
            search_type: searchType,
            timestamp: new Date().toISOString()
          });
        }
        
        toast.success('Compliance check completed');
        setIsSearching(false);
      }, 1500);
      
      // Store the timeout ID
      setSearchTimeoutId(newTimeoutId);
    } catch (error) {
      console.error('Error checking compliance:', error);
      toast.error('Failed to check compliance');
      setIsSearching(false);
    } finally {
      // Cleanup is handled in the timeout callback
    }
  };
  
  const handleExportResults = () => {
    if (!results) return;
    
    // In a real implementation, we would generate a PDF or CSV file
    toast.success('Exporting compliance check results');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Compliance Checker</h3>
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
              The Compliance Checker is currently in development and will be available soon. This tool will allow you to screen entities against global restricted party lists to ensure trade compliance.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Restricted Party Screening</h4>
        
        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="entity"
                  checked={searchType === 'entity'}
                  onChange={() => setSearchType('entity')}
                  className="mr-2"
                />
                <span className="text-gray-700">Entity/Company</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="individual"
                  checked={searchType === 'individual'}
                  onChange={() => setSearchType('individual')}
                  className="mr-2"
                />
                <span className="text-gray-700">Individual</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="vessel"
                  checked={searchType === 'vessel'}
                  onChange={() => setSearchType('vessel')}
                  className="mr-2"
                />
                <span className="text-gray-700">Vessel</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {searchType === 'entity' ? 'Entity/Company Name' : 
               searchType === 'individual' ? 'Individual Name' : 'Vessel Name'}
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                  placeholder={searchType === 'entity' ? 'Enter company name' : 
                              searchType === 'individual' ? 'Enter person name' : 'Enter vessel name'}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Check Compliance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        
        {results && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Search Results</h4>
            
            {results.status === 'no_matches' ? (
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-green-900 mb-1">No Matches Found</h5>
                    <p className="text-green-800">
                      No matches were found for "{results.searched_term}" in the restricted party lists. 
                      This entity appears to be clear for trade based on current data.
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      Search completed on {new Date(results.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-red-900 mb-1">Potential Match Found</h5>
                      <p className="text-red-800">
                        One or more potential matches were found in the restricted party lists. 
                        Review the details below and consider consulting with a compliance expert before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                
                {results.matches.map((match: any, index: number) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Entity Name</p>
                        <p className="font-medium text-gray-900">{match.entity_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">List</p>
                        <p className="font-medium text-gray-900">{match.list_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Match Score</p>
                        <p className="font-medium text-gray-900">{match.match_score}%</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Listed Since</p>
                        <p className="font-medium text-gray-900">{match.start_date}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">{match.address}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Remarks</p>
                        <p className="font-medium text-gray-900">{match.remarks}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      This is a preliminary screening result. For definitive compliance guidance, consult with your legal and compliance teams.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {!results && !isSearching && (
          <div className="text-center py-8">
            <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Restricted Party Screening</h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Screen entities against global restricted party lists to ensure compliance with trade regulations and avoid penalties.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 max-w-md mx-auto">
              <p className="flex items-center">
                <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  Try searching for "Restricted Trading Company" to see a sample match result.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceChecker;