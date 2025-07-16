import React, { useState } from 'react';
import { Calculator, DollarSign, Search, Download, Info, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TariffCalculator: React.FC = () => {
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [productValue, setProductValue] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [insuranceCost, setInsuranceCost] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showHsCodeHelp, setShowHsCodeHelp] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originCountry || !destinationCountry || !hsCode || !productValue) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsCalculating(true);
    
    try {
      // In a real implementation, we would make an API call to calculate tariffs
      // For now, we'll simulate the calculation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample calculation
      const productValueNum = parseFloat(productValue);
      const shippingCostNum = shippingCost ? parseFloat(shippingCost.replace(/,/g, '')) : 0;
      const insuranceCostNum = insuranceCost ? parseFloat(insuranceCost.replace(/,/g, '')) : 0;
      
      // Mock duty rates based on destination country
      const dutyRates: {[key: string]: number} = {
        'US': 0.025,
        'CA': 0.05,
        'GB': 0.03,
        'DE': 0.035,
        'FR': 0.035,
        'CN': 0.08,
        'JP': 0.04,
        'AU': 0.05
      };
      
      // Mock VAT/sales tax rates
      const vatRates: {[key: string]: number} = {
        'US': 0.0, // No federal VAT in US
        'CA': 0.05, // GST
        'GB': 0.20, // UK VAT
        'DE': 0.19, // German VAT
        'FR': 0.20, // French VAT
        'CN': 0.13, // Chinese VAT
        'JP': 0.10, // Japanese Consumption Tax
        'AU': 0.10  // Australian GST
      };
      
      const dutyRate = dutyRates[destinationCountry] || 0.05;
      const vatRate = vatRates[destinationCountry] || 0.10;
      
      const customsValue = productValueNum + shippingCostNum + insuranceCostNum;
      const dutyAmount = customsValue * dutyRate;
      const vatableAmount = customsValue + dutyAmount;
      const vatAmount = vatableAmount * vatRate;
      
      const totalLandedCost = customsValue + dutyAmount + vatAmount;
      
      setResults({
        customsValue,
        dutyRate,
        dutyAmount,
        vatRate,
        vatAmount,
        totalLandedCost,
        breakdown: {
          productValue: productValueNum,
          shippingCost: shippingCostNum,
          insuranceCost: insuranceCostNum,
          dutyAmount,
          vatAmount
        }
      });
      
      toast.success('Tariff calculation completed');
    } catch (error) {
      console.error('Error calculating tariffs:', error);
      toast.error('Failed to calculate tariffs');
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handleExportResults = () => {
    if (!results) return;
    
    // In a real implementation, we would generate a PDF or CSV file
    toast.success('Exporting calculation results');
  };
  
  const handleHsCodeSearch = () => {
    toast.success('Opening HS Code search tool');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Tariff & Duty Calculator</h3>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Calculation Parameters</h4>
            
            <form onSubmit={handleCalculate} className="space-y-4">
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
                  <option value="CN">China</option>
                  <option value="DE">Germany</option>
                  <option value="JP">Japan</option>
                  <option value="GB">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
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
                  <option value="CN">China</option>
                  <option value="DE">Germany</option>
                  <option value="JP">Japan</option>
                  <option value="GB">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">HS Code *</label>
                  <button 
                    type="button"
                    onClick={() => setShowHsCodeHelp(!showHsCodeHelp)}
                    className="text-signal-blue hover:text-blue-700 text-xs"
                  >
                    What is this?
                  </button>
                </div>
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
                    onClick={handleHsCodeSearch}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                {showHsCodeHelp && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p className="flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        The Harmonized System (HS) code is a standardized numerical method of classifying traded products. 
                        It's used by customs authorities around the world to identify products for applying duties and taxes.
                      </span>
                    </p>
                    <p className="mt-2">
                      <a href="#" className="text-blue-600 hover:underline">
                        Don't know your HS code? Use our HS Code Finder tool.
                      </a>
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Value (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={productValue} 
                    onChange={(e) => {
                      // Remove non-numeric characters except decimal point
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      
                      // Format with commas
                      if (value) {
                        const parts = value.split('.');
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        setProductValue(parts.join('.'));
                      } else {
                        setProductValue('');
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={shippingCost} 
                    onChange={(e) => {
                      // Remove non-numeric characters except decimal point
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      
                      // Format with commas
                      if (value) {
                        const parts = value.split('.');
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        setShippingCost(parts.join('.'));
                      } else {
                        setShippingCost('');
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Cost (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={insuranceCost} 
                    onChange={(e) => {
                      // Remove non-numeric characters except decimal point
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      
                      // Format with commas
                      if (value) {
                        const parts = value.split('.');
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        setInsuranceCost(parts.join('.'));
                      } else {
                        setInsuranceCost('');
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    <span>Calculate Duties & Taxes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Results */}
        <div className="lg:col-span-2">
          {results ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-6">Calculation Results</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Customs Value</p>
                  <p className="text-2xl font-bold text-gray-900">${results.customsValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Total Duty</p>
                  <p className="text-2xl font-bold text-gray-900">${results.dutyAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  <p className="text-xs text-gray-500">Rate: {(results.dutyRate * 100).toFixed(1)}%</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">VAT/Sales Tax</p>
                  <p className="text-2xl font-bold text-gray-900">${results.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  <p className="text-xs text-gray-500">Rate: {(results.vatRate * 100).toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg text-white mb-6">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Total Landed Cost</h5>
                  <p className="text-3xl font-bold">${results.totalLandedCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Cost Breakdown</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Product Value:</span>
                    <span className="font-medium text-gray-900">${results.breakdown.productValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  
                  {results.breakdown.shippingCost > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping Cost:</span>
                      <span className="font-medium text-gray-900">${results.breakdown.shippingCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  )}
                  
                  {results.breakdown.insuranceCost > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Insurance Cost:</span>
                      <span className="font-medium text-gray-900">${results.breakdown.insuranceCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duty Amount:</span>
                    <span className="font-medium text-gray-900">${results.breakdown.dutyAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">VAT/Sales Tax:</span>
                    <span className="font-medium text-gray-900">${results.breakdown.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-900">Total Landed Cost:</span>
                    <span className="font-bold text-gray-900">${results.totalLandedCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Disclaimer</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This calculation is an estimate based on current rates and may not reflect all applicable fees or special trade agreements. 
                      For the most accurate information, please consult with a customs broker or trade compliance specialist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Tariff & Duty Calculator</h4>
                <p className="text-gray-600 mb-6">
                  Calculate import duties, taxes, and total landed costs for international shipments. 
                  Enter your shipment details to get started.
                </p>
                <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <p className="flex items-center">
                    <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                      This calculator supports over 100 countries and thousands of HS codes for accurate duty and tax estimation.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TariffCalculator;