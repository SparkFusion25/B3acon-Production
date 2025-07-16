import React, { useState } from 'react';
import { Package, Search, MapPin, Calendar, Clock, Truck, Ship, Plane, Info, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import terminal49 from '../../../../lib/terminal49';

const ShipmentTracker: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [trackingType, setTrackingType] = useState('tracking');
  const [isTracking, setIsTracking] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [trackingTimeoutId, setTrackingTimeoutId] = useState<number | null>(null);
  
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber && trackingType === 'tracking') {
      toast.error('Please enter a tracking or reference number');
      return;
    }
    
    setIsTracking(true);
    
    try {
      // Call Terminal49 API to track the container
      let response;

      // Clear any existing timeout
      if (trackingTimeoutId !== null) {
        clearTimeout(trackingTimeoutId);
      }
      
      try {
        // Call the Terminal49 API through our wrapper
        if (trackingType === 'tracking') {
          response = await terminal49.trackContainer({
            trackingNumber,
            trackingType: 'container',
            carrier: carrier || undefined
          });
        } else if (trackingType === 'ocean') {
          response = await terminal49.trackContainer({
            trackingNumber,
            trackingType: 'container',
            carrier: carrier || undefined
          });
        } else if (trackingType === 'booking') {
          response = await terminal49.trackContainer({
            trackingNumber,
            trackingType: 'booking',
            carrier: carrier || undefined
          });
        }
        
        // Process the response
        if (response && response.container) {
          setShipment({
            tracking_number: trackingNumber,
            carrier: response.container.carrier,
            status: response.container.status,
            estimated_delivery: response.container.eta,
            current_location: response.container.location,
            events: response.container.events,
            // Add other fields as needed
            origin: {
              city: response.container.events[0]?.location.split(', ')[0] || 'Unknown',
              country: response.container.events[0]?.location.split(', ')[1] || 'Unknown'
            },
            destination: {
              city: 'Destination',
              country: 'Country'
            },
            service_type: 'International Shipping',
            weight: 'N/A',
            package_count: 1
          });
          
          setMapVisible(true);
          toast.success('Shipment found');
          setIsTracking(false);
        } else {
          throw new Error('No shipment data found');
        }
      } catch (apiError) {
        console.error('Error calling Terminal49 API:', apiError);
        throw new Error('Failed to retrieve shipment data from Terminal49');
      }
      
    } catch (error) {
      console.error('Error tracking shipment:', error);
      toast.error('Failed to track shipment');
      setIsTracking(false);
    } finally {
      // Cleanup is handled in the timeout callback
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTrackingType('tracking')}
                className={`py-2 px-3 rounded-lg text-sm font-medium ${
                  trackingType === 'tracking' 
                    ? 'bg-signal-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Tracking #
              </button>
              <button
                type="button"
                onClick={() => setTrackingType('ocean')}
                className={`py-2 px-3 rounded-lg text-sm font-medium ${
                  trackingType === 'ocean' 
                    ? 'bg-signal-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Container/BL #
              </button>
              <button
                type="button"
                onClick={() => setTrackingType('booking')}
                className={`py-2 px-3 rounded-lg text-sm font-medium ${
                  trackingType === 'booking' 
                    ? 'bg-signal-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Booking #
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {trackingType === 'tracking' ? 'Tracking Number' : 
               trackingType === 'ocean' ? 'Container/BL Number' : 'Booking Number'}
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              placeholder={trackingType === 'tracking' ? 'Enter tracking number' : 
                          trackingType === 'ocean' ? 'Enter container or BL number' : 'Enter booking number'}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {trackingType === 'ocean' ? 'Ocean Carrier' : trackingType === 'booking' ? 'Freight Forwarder' : 'Carrier'}
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            >
              <option value="">Auto Detect Carrier</option>
              {trackingType === 'ocean' ? (
                <>
                  <option value="MAERSK">Maersk</option>
                  <option value="MSC">MSC</option>
                  <option value="COSCO">COSCO</option>
                  <option value="CMA">CMA CGM</option>
                  <option value="HAPAG">Hapag Lloyd</option>
                  <option value="OOCL">OOCL</option>
                </>
              ) : trackingType === 'booking' ? (
                <>
                  <option value="DSV">DSV</option>
                  <option value="KUEHNE">Kuehne + Nagel</option>
                  <option value="EXPEDITORS">Expeditors</option>
                  <option value="DHL_GLOBAL">DHL Global Forwarding</option>
                  <option value="DB_SCHENKER">DB Schenker</option>
                </>
              ) : (
                <>
                  <option value="FEDEX">FedEx</option>
                  <option value="UPS">UPS</option>
                  <option value="DHL">DHL</option>
                  <option value="USPS">USPS</option>
                </>
              )}
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
                <p className="text-sm text-gray-600">
                  {trackingType === 'tracking' ? 'Tracking' : 
                   trackingType === 'ocean' ? 'Container/BL' : 'Booking'} #{shipment.tracking_number}
                </p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              
              <div>
                <div className="flex items-center mb-3">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <h6 className="font-medium text-gray-900">Live Map View</h6>
                  <button 
                    onClick={() => setMapVisible(!mapVisible)}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    {mapVisible ? 'Hide Map' : 'Show Map'}
                  </button>
                </div>
                {mapVisible ? (
                  <div className="bg-gray-100 rounded-lg h-64 relative overflow-hidden">
                    {/* This would be replaced with an actual map component in production */}
                    <div className="absolute inset-0 bg-blue-50">
                      {/* Simulated map with origin, destination and current location */}
                      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full" title="Origin: Shanghai"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-red-500 rounded-full" title="Destination: Los Angeles"></div>
                      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" title="Current Location"></div>
                      
                      {/* Simulated route */}
                      <div className="absolute top-1/4 left-1/4 w-[60%] h-[50%] border-2 border-dashed border-blue-400 rounded-full opacity-50"></div>
                      
                      {/* Map labels */}
                      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white px-1 rounded">
                        Current: {shipment.current_location?.description || 'In Transit'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                    <p className="text-gray-500">Click "Show Map" to view shipment location</p>
                  </div>
                )}
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