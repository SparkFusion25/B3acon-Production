import React, { useState } from 'react';
import { 
  Calculator, 
  Ship, 
  Truck, 
  Package, 
  ArrowRight, 
  DollarSign, 
  Globe, 
  FileText,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TariffCalculatorWidget: React.FC = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    hsCode: '',
    value: '',
    weight: '',
    transportMode: 'ocean'
  });
  const [result, setResult] = useState<{
    tariff: number;
    duty: number;
    vat: number;
    total: number;
    breakdown: { name: string; amount: number; percentage?: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'IN', name: 'India', flag: '🇮🇳' }
  ];

  const calculateTariff = async () => {
    if (!formData.origin || !formData.destination || !formData.value || !formData.hsCode) {
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const value = parseFloat(formData.value);
      const baseRate = 0.08; // 8% base tariff
      const dutyRate = 0.05; // 5% duty
      const vatRate = 0.20; // 20% VAT
      
      const tariff = value * baseRate;
      const duty = value * dutyRate;
      const subtotal = value + tariff + duty;
      const vat = subtotal * vatRate;
      const total = subtotal + vat;

      setResult({
        tariff: tariff,
        duty: duty,
        vat: vat,
        total: total,
        breakdown: [
          { name: 'Goods Value', amount: value },
          { name: 'Import Tariff', amount: tariff, percentage: baseRate * 100 },
          { name: 'Import Duty', amount: duty, percentage: dutyRate * 100 },
          { name: 'VAT/Sales Tax', amount: vat, percentage: vatRate * 100 },
          { name: 'Total Landed Cost', amount: total }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl">
              <Calculator className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Free Tariff & Duty Calculator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate import duties, tariffs, and total landed costs for any shipment. 
            Get instant estimates for 200+ countries with real-time rates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Calculator Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Ship className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Calculate Your Costs</h3>
            </div>

            <div className="space-y-6">
              {/* Transport Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Transport Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ocean', label: 'Ocean', icon: Ship },
                    { id: 'air', label: 'Air', icon: Package },
                    { id: 'land', label: 'Land', icon: Truck }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setFormData({ ...formData, transportMode: mode.id })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.transportMode === mode.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <mode.icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin Country</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select origin...</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination Country</label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select destination...</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* HS Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">HS Code</label>
                <input
                  type="text"
                  placeholder="e.g., 8517.12.00"
                  value={formData.hsCode}
                  onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Don't know your HS Code? <Link to="/signup" className="text-blue-600 hover:underline">Use our HS Code finder</Link>
                </p>
              </div>

              {/* Value & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goods Value (USD)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateTariff}
                disabled={loading || !formData.origin || !formData.destination || !formData.value || !formData.hsCode}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Tariff & Duties
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results & Benefits */}
          <div className="space-y-8">
            {/* Results */}
            {result && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Cost Breakdown</h3>
                </div>

                <div className="space-y-4">
                  {result.breakdown.map((item, index) => (
                    <div key={index} className={`flex justify-between items-center py-3 ${
                      index === result.breakdown.length - 1 ? 'border-t-2 border-gray-200 font-semibold text-lg' : ''
                    }`}>
                      <span className="text-gray-700">
                        {item.name}
                        {item.percentage && (
                          <span className="text-sm text-gray-500 ml-1">({item.percentage}%)</span>
                        )}
                      </span>
                      <span className={index === result.breakdown.length - 1 ? 'text-green-600 font-bold' : 'text-gray-900'}>
                        ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <Shield className="w-4 h-4 inline mr-1" />
                    This is an estimate. Actual rates may vary based on trade agreements, 
                    product classification, and current regulations.
                  </p>
                </div>

                <Link
                  to="/signup"
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center"
                >
                  Get Detailed Report & More Tools
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            )}

            {/* Features */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Choose B3ACON?</h3>
              <div className="space-y-4">
                {[
                  { icon: Globe, title: '200+ Countries', desc: 'Complete global coverage' },
                  { icon: Clock, title: 'Real-Time Rates', desc: 'Always up-to-date tariff data' },
                  { icon: FileText, title: 'Compliance Tools', desc: 'FTA, origin certificates & more' },
                  { icon: TrendingUp, title: 'Cost Optimization', desc: 'Find the most cost-effective routes' },
                  { icon: Users, title: 'Expert Support', desc: '24/7 trade compliance assistance' },
                  { icon: Zap, title: 'Instant Results', desc: 'Get calculations in seconds' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-indigo-100 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-xl">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="font-semibold">4.9/5</span>
                </div>
                <p className="text-indigo-100 text-sm">
                  "B3ACON saved us thousands in unexpected duties and streamlined our entire import process."
                </p>
                <p className="text-indigo-200 text-xs mt-1">- Sarah Chen, Global Supply Chain Manager</p>
              </div>
            </div>

            {/* CTA */}
            {!result && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Get Started with B3ACON Today
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of businesses who trust B3ACON for their global trade operations.
                </p>
                <div className="space-y-3">
                  <Link
                    to="/signup"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    to="/demo"
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Schedule Demo
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffCalculatorWidget;