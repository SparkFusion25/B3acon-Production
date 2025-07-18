import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Package, 
  Globe, 
  Search, 
  MapPin, 
  DollarSign, 
  Truck, 
  Ship, 
  Plane,
  Building,
  FileText,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Eye,
  BarChart3,
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface GlobalCommerceHubProps {
  activeSubSection: string;
}

const GlobalCommerceHub: React.FC<GlobalCommerceHubProps> = ({ activeSubSection }) => {
  const [activeTab, setActiveTab] = useState(activeSubSection || 'landed-cost');

  const renderSubSection = () => {
    switch (activeTab) {
      case 'landed-cost':
        return <LandedCostCalculator />;
      case 'freight-rates':
        return <FreightRatesSection />;
      case 'shipment-tracker':
        return <ShipmentTracker />;
      case 'tariff-calculator':
        return <TariffCalculator />;
      case 'hs-code-lookup':
        return <HSCodeLookup />;
      default:
        return <LandedCostCalculator />;
    }
  };

  return (
    <div className="global-commerce-hub">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Commerce Hub</h1>
        <p className="text-gray-600">Comprehensive international trade tools for cost calculation, shipping, and compliance</p>
      </div>

      {/* Sub-navigation tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'landed-cost', label: 'Landed Cost Calculator', icon: Calculator },
            { id: 'freight-rates', label: 'Freight Rates', icon: TrendingUp },
            { id: 'shipment-tracker', label: 'Shipment Tracker', icon: Package },
            { id: 'tariff-calculator', label: 'Tariff Calculator', icon: BarChart3 },
            { id: 'hs-code-lookup', label: 'HS Code Lookup', icon: Search }
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

const LandedCostCalculator: React.FC = () => {
  const [calculation, setCalculation] = useState({
    productValue: '',
    quantity: '1',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    shippingMethod: 'sea',
    originCountry: 'CN',
    destinationCountry: 'US',
    productCategory: '',
    hsCode: ''
  });
  
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateLandedCost = async () => {
    setIsCalculating(true);
    try {
      // Simulate landed cost calculation with real business logic
      const productValue = parseFloat(calculation.productValue) || 0;
      const quantity = parseInt(calculation.quantity) || 1;
      const weight = parseFloat(calculation.weight) || 0;
      
      // Real tariff rates (simplified - would come from API)
      const tariffRates: { [key: string]: number } = {
        'electronics': 0.025,
        'textiles': 0.15,
        'machinery': 0.035,
        'automotive': 0.025,
        'default': 0.05
      };
      
      const tariffRate = tariffRates[calculation.productCategory] || tariffRates.default;
      
      // Calculate components
      const totalProductValue = productValue * quantity;
      const duties = totalProductValue * tariffRate;
      
      // Shipping costs based on method and weight
      const shippingRates: { [key: string]: number } = {
        'sea': 2.5,   // per kg
        'air': 8.5,   // per kg
        'express': 15.0 // per kg
      };
      
      const shippingCost = weight * (shippingRates[calculation.shippingMethod] || shippingRates.sea);
      
      // Additional fees
      const brokerageFee = Math.max(50, totalProductValue * 0.005); // Min $50 or 0.5%
      const handlingFee = 25;
      const documentationFee = 35;
      
      // Insurance (0.3% of product value)
      const insurance = totalProductValue * 0.003;
      
      const totalLandedCost = totalProductValue + duties + shippingCost + brokerageFee + handlingFee + documentationFee + insurance;
      const landedCostPerUnit = totalLandedCost / quantity;
      
      setResults({
        productValue: totalProductValue,
        duties,
        shippingCost,
        brokerageFee,
        handlingFee,
        documentationFee,
        insurance,
        totalLandedCost,
        landedCostPerUnit,
        breakdown: [
          { label: 'Product Value', amount: totalProductValue, percentage: (totalProductValue / totalLandedCost) * 100 },
          { label: 'Duties & Tariffs', amount: duties, percentage: (duties / totalLandedCost) * 100 },
          { label: 'Shipping', amount: shippingCost, percentage: (shippingCost / totalLandedCost) * 100 },
          { label: 'Brokerage', amount: brokerageFee, percentage: (brokerageFee / totalLandedCost) * 100 },
          { label: 'Fees & Insurance', amount: handlingFee + documentationFee + insurance, percentage: ((handlingFee + documentationFee + insurance) / totalLandedCost) * 100 }
        ]
      });
      
      toast.success('Landed cost calculated successfully!');
    } catch (error) {
      toast.error('Error calculating landed cost');
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="landed-cost-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">Product & Shipping Details</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Value (USD)</label>
                <input
                  type="number"
                  value={calculation.productValue}
                  onChange={(e) => setCalculation({ ...calculation, productValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={calculation.quantity}
                  onChange={(e) => setCalculation({ ...calculation, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Weight (kg)</label>
              <input
                type="number"
                value={calculation.weight}
                onChange={(e) => setCalculation({ ...calculation, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5.0"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                <input
                  type="number"
                  value={calculation.dimensions.length}
                  onChange={(e) => setCalculation({ 
                    ...calculation, 
                    dimensions: { ...calculation.dimensions, length: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                <input
                  type="number"
                  value={calculation.dimensions.width}
                  onChange={(e) => setCalculation({ 
                    ...calculation, 
                    dimensions: { ...calculation.dimensions, width: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={calculation.dimensions.height}
                  onChange={(e) => setCalculation({ 
                    ...calculation, 
                    dimensions: { ...calculation.dimensions, height: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
              <select
                value={calculation.shippingMethod}
                onChange={(e) => setCalculation({ ...calculation, shippingMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sea">Sea Freight (Cheapest)</option>
                <option value="air">Air Freight (Faster)</option>
                <option value="express">Express (Fastest)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origin Country</label>
                <select
                  value={calculation.originCountry}
                  onChange={(e) => setCalculation({ ...calculation, originCountry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CN">China</option>
                  <option value="IN">India</option>
                  <option value="VN">Vietnam</option>
                  <option value="TH">Thailand</option>
                  <option value="DE">Germany</option>
                  <option value="IT">Italy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination Country</label>
                <select
                  value={calculation.destinationCountry}
                  onChange={(e) => setCalculation({ ...calculation, destinationCountry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
              <select
                value={calculation.productCategory}
                onChange={(e) => setCalculation({ ...calculation, productCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="textiles">Textiles & Apparel</option>
                <option value="machinery">Machinery</option>
                <option value="automotive">Automotive Parts</option>
                <option value="default">Other</option>
              </select>
            </div>
            
            <button
              onClick={calculateLandedCost}
              disabled={isCalculating || !calculation.productValue || !calculation.weight}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCalculating ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                  Calculating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Landed Cost
                </div>
              )}
            </button>
          </div>
        </div>
        
        {/* Results Display */}
        {results && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-6">Landed Cost Breakdown</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">
                    ${results.totalLandedCost.toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-600">Total Landed Cost</div>
                  <div className="text-lg font-semibold text-blue-800 mt-1">
                    ${results.landedCostPerUnit.toFixed(2)} per unit
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {results.breakdown.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.label}</span>
                    <div className="text-right">
                      <div className="font-semibold">${item.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Tariff rates are estimates and may vary by product classification</p>
                  <p>• Shipping costs are calculated based on weight and method</p>
                  <p>• Additional fees may apply based on specific requirements</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FreightRatesSection: React.FC = () => {
  const [rateQuery, setRateQuery] = useState({
    origin: '',
    destination: '',
    weight: '',
    dimensions: '',
    shippingMode: 'sea'
  });
  const [rates, setRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchRates = async () => {
    setIsLoading(true);
    try {
      // Simulate freight rate search with realistic data
      const mockRates = [
        {
          carrier: 'Maersk Line',
          service: 'AE7 Asia Europe Service',
          mode: 'sea',
          transitTime: '28-35 days',
          rate: '$2,450',
          currency: 'USD',
          container: '20ft FCL',
          frequency: 'Weekly'
        },
        {
          carrier: 'COSCO Shipping',
          service: 'AEU1 Service',
          mode: 'sea',
          transitTime: '30-38 days',
          rate: '$2,280',
          currency: 'USD',
          container: '20ft FCL',
          frequency: 'Weekly'
        },
        {
          carrier: 'DHL Express',
          service: 'Express Worldwide',
          mode: 'air',
          transitTime: '2-3 days',
          rate: '$15.50/kg',
          currency: 'USD',
          container: 'Air Cargo',
          frequency: 'Daily'
        }
      ];
      
      setRates(mockRates);
      toast.success('Freight rates loaded successfully!');
    } catch (error) {
      toast.error('Error loading freight rates');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="freight-rates">
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-4">Search Freight Rates</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder="Origin Port/City"
            value={rateQuery.origin}
            onChange={(e) => setRateQuery({ ...rateQuery, origin: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Destination Port/City"
            value={rateQuery.destination}
            onChange={(e) => setRateQuery({ ...rateQuery, destination: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Weight (kg)"
            value={rateQuery.weight}
            onChange={(e) => setRateQuery({ ...rateQuery, weight: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={rateQuery.shippingMode}
            onChange={(e) => setRateQuery({ ...rateQuery, shippingMode: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="sea">Sea Freight</option>
            <option value="air">Air Freight</option>
            <option value="rail">Rail Freight</option>
            <option value="truck">Truck Freight</option>
          </select>
          <button
            onClick={searchRates}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search Rates'}
          </button>
        </div>
      </div>

      {rates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Available Freight Rates</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Carrier</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Service</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Mode</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Transit Time</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Rate</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Frequency</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{rate.carrier}</td>
                    <td className="py-4 px-6">{rate.service}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        rate.mode === 'sea' ? 'bg-blue-100 text-blue-700' :
                        rate.mode === 'air' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {rate.mode === 'sea' ? <Ship className="w-3 h-3 mr-1" /> :
                         rate.mode === 'air' ? <Plane className="w-3 h-3 mr-1" /> :
                         <Truck className="w-3 h-3 mr-1" />}
                        {rate.mode.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">{rate.transitTime}</td>
                    <td className="py-4 px-6 font-semibold text-green-600">{rate.rate}</td>
                    <td className="py-4 px-6">{rate.frequency}</td>
                    <td className="py-4 px-6">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Get Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const ShipmentTracker: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  const trackShipment = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsTracking(true);
    try {
      // Simulate shipment tracking with realistic data
      const mockTracking = {
        trackingNumber,
        status: 'In Transit',
        carrier: 'DHL Express',
        origin: 'Shanghai, China',
        destination: 'Los Angeles, USA',
        estimatedDelivery: '2024-01-15',
        currentLocation: 'Hong Kong Hub',
        events: [
          {
            date: '2024-01-10 14:30',
            location: 'Shanghai, China',
            status: 'Shipment picked up',
            description: 'Package collected from shipper'
          },
          {
            date: '2024-01-10 18:45',
            location: 'Shanghai Airport',
            status: 'Departed facility',
            description: 'Shipment departed Shanghai facility'
          },
          {
            date: '2024-01-11 02:15',
            location: 'Hong Kong Hub',
            status: 'Arrived at hub',
            description: 'Package arrived at sorting facility'
          },
          {
            date: '2024-01-11 08:30',
            location: 'Hong Kong Hub',
            status: 'In transit',
            description: 'Package processed and awaiting flight'
          }
        ]
      };
      
      setTrackingResult(mockTracking);
      toast.success('Shipment found and tracked successfully!');
    } catch (error) {
      toast.error('Error tracking shipment');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="shipment-tracker">
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-4">Track Your Shipment</h3>
        
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter tracking number (e.g., 1234567890)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && trackShipment()}
          />
          <button
            onClick={trackShipment}
            disabled={isTracking}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isTracking ? (
              <div className="flex items-center">
                <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                Tracking...
              </div>
            ) : (
              <div className="flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Track
              </div>
            )}
          </button>
        </div>
      </div>

      {trackingResult && (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <div className="font-semibold text-gray-900">Status</div>
                <div className="text-blue-600 font-medium">{trackingResult.status}</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <div className="font-semibold text-gray-900">Current Location</div>
                <div className="text-green-600 font-medium">{trackingResult.currentLocation}</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
                <div className="font-semibold text-gray-900">Carrier</div>
                <div className="text-purple-600 font-medium">{trackingResult.carrier}</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <div className="font-semibold text-gray-900">Est. Delivery</div>
                <div className="text-orange-600 font-medium">{trackingResult.estimatedDelivery}</div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-6">Tracking History</h3>
            
            <div className="space-y-4">
              {trackingResult.events.map((event: any, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{event.status}</div>
                      <div className="text-sm text-gray-500">{event.date}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{event.location}</div>
                    <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TariffCalculator: React.FC = () => {
  return (
    <div className="tariff-calculator">
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tariff Calculator</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Advanced tariff calculation system with real-time duty rates and trade agreement analysis.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Feature in development</span>
          </div>
          <p className="text-blue-600 text-sm mt-2">
            Full tariff calculation system coming soon with HTS code integration.
          </p>
        </div>
      </div>
    </div>
  );
};

const HSCodeLookup: React.FC = () => {
  return (
    <div className="hs-code-lookup">
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">HS Code Lookup</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Comprehensive Harmonized System code database with AI-powered product classification.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Feature in development</span>
          </div>
          <p className="text-blue-600 text-sm mt-2">
            HS code classification system coming soon with smart product matching.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalCommerceHub;