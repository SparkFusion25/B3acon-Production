import React, { useState } from 'react';
import { Package, Search, MapPin, Calendar, Clock, Truck, Ship, Plane, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ShipmentTracker: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber) {
      toast.error('Please enter a tracking number');
      return;
    }
    
    setIsTracking(true);
    
    try {
      // In a real implementation, we would make an API call to track the shipment
      // For now, we'll simulate the tracking process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample tracking data
      const mockShipment = {
        tracking_number: trackingNumber,
        carrier: carrier || 'FedEx',
        status: 'in_transit',
        estimated_delivery: '2025-02-15',
        origin: {
          city: 'Shanghai',
          country: 'China',
          postal_code: '200000'
        },
        destination: {
          city: 'Los Angeles',
          country: 'United States',
          postal_code: '90001'
        },
        shipment_date: '2025-02-01',
        service_type: 'International Priority',
        weight: '15.5 kg',
        package_count: 2,
        events: [
          {
            date: '2025-02-01T10:30:00Z',
            location: 'Shanghai, China',
            status: 'Shipment picked up',
            description: 'Shipment picked up by carrier'
          },
          {
            date: '2025-02-02T14:15:00Z',
            location: 'Shanghai, China',
            status: 'Departed facility',
            description: 'Shipment has left the origin facility'
          },
          {
            date: '2025-02-03T08:45:00Z',
            location: 'Hong Kong, China',
            status: 'Arrived at facility',
            description: 'Shipment has arrived at transit facility'
          },
          {
            date: '2025-02-04T02:20:00Z',
            location: 'Hong Kong, China',
            status: 'Departed facility',
            description: 'Shipment has left the transit facility'
          },
          {
            date: '2025-02-05T18:10:00Z',
            location: 'Anchorage, United States',
            status: 'Arrived at facility',
            description: 'Shipment has arrived at transit facility'
          },
          {
            date: '2025-02-06T03:45:00Z',
            location: 'Anchorage, United States',
            status: 'Departed facility',
            description: 'Shipment has left the transit facility'
          },
          {
            date: '2025-02-07T09:30:00Z',
            location: 'Los Angeles, United States',
            status: 'Arrived at destination',
            description: 'Shipment has arrived at destination facility'
          },
          {
            date: '2025-02-07T14:20:00Z',
            location: 'Los Angeles, United States',
            status: 'Customs clearance',
            description: 'Shipment is undergoing customs clearance'
          }
        ]
      };
      
      setShipment(mockShipment);
      toast.success('Shipment found');
    } catch (error) {
      console.error('Error tracking shipment:', error);
      toast.error('Failed to track shipment');
    } finally {
      setIsTracking(false);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Shipment picked up':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'Departed facility':
        return <Truck className="w-5 h-5 text-green-500" />;
      case 'Arrived at facility':
        return <MapPin className="w-5 h-5 text-purple-500" />;
      case 'Customs clearance':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'Arrived at destination':
        return <MapPin className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getTransportIcon = (location: string) => {
    if (location.includes('Shanghai') || location.includes('Hong Kong')) {
      return <Ship className="w-5 h-5 text-blue-500" />;
    } else if (location.includes('Anchorage')) {
      return <Plane className="w-5 h-5 text-purple-500" />;
    } else {
      return <Truck className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Shipment Tracker</h3>
      </div>
      
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Coming Soon</h4>
            <p className="text-blue-800">
              The Shipment Tracker is currently in development and will be available soon. This tool will allow you to track shipments across multiple carriers and view detailed shipment information.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-6">Track Your Shipment</h4>
        
        <form onSubmit={handleTrack} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder="Enter tracking number"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carrier (Optional)</label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="">Auto Detect</option>
              <option value="fedex">FedEx</option>
              <option value="ups">UPS</option>
              <option value="dhl">DHL</option>
              <option value="usps">USPS</option>
              <option value="maersk">Maersk</option>
              <option value="msc">MSC</option>
              <option value="cosco">COSCO</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isTracking || !trackingNumber}
            className="w-full py-3 bg-gradient-to-r from-signal-blue to-beacon-orange text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isTracking ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Tracking...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Track Shipment</span>
              </>
            )}
          </button>
        </form>
        
        {shipment && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="font-medium text-gray-900">Shipment Details</h5>
                <p className="text-sm text-gray-600">Tracking #{shipment.tracking_number}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {shipment.status === 'in_transit' ? 'In Transit' :
                 shipment.status === 'delivered' ? 'Delivered' :
                 shipment.status === 'pending' ? 'Pending' : 'Unknown'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <h6 className="font-medium text-gray-900">Shipment Route</h6>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium text-gray-900">{shipment.origin.city}, {shipment.origin.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-medium text-gray-900">{shipment.destination.city}, {shipment.destination.country}</p>
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full mb-3">
                    <div className="absolute top-0 left-0 h-2 bg-signal-blue rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{shipment.shipment_date}</span>
                    <span>Estimated: {shipment.estimated_delivery}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <Package className="w-5 h-5 text-gray-400 mr-2" />
                  <h6 className="font-medium text-gray-900">Shipment Info</h6>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Carrier:</span>
                    <span className="font-medium text-gray-900">{shipment.carrier}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-gray-900">{shipment.service_type}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-gray-900">{shipment.weight}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Packages:</span>
                    <span className="font-medium text-gray-900">{shipment.package_count}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <h6 className="font-medium text-gray-900">Tracking History</h6>
              </div>
              <div className="space-y-4">
                {shipment.events.map((event: any, index: number) => (
                  <div key={index} className="relative">
                    {index < shipment.events.length - 1 && (
                      <div className="absolute top-6 left-2.5 w-0.5 h-full bg-gray-200"></div>
                    )}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-5 h-5 rounded-full bg-white border-2 border-signal-blue flex items-center justify-center">
                          {index === 0 && <div className="w-2 h-2 bg-signal-blue rounded-full"></div>}
                        </div>
                      </div>
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {getStatusIcon(event.status)}
                            <span className="font-medium text-gray-900 ml-2">{event.status}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <Clock className="w-4 h-4 ml-2 mr-1" />
                            <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                          <span className="ml-2">{getTransportIcon(event.location)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {!shipment && !isTracking && (
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Track Your Shipment</h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Enter your tracking number to get real-time updates on your shipment's location and status.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 max-w-md mx-auto">
              <p className="flex items-center">
                <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  Try entering any tracking number to see a sample tracking result.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentTracker;