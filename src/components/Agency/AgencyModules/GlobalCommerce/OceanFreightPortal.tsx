import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  MapPin, 
  Clock, 
  Package, 
  FileText, 
  Download, 
  Share2, 
  Mail, 
  Eye, 
  Calendar,
  Anchor,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Truck,
  Plane,
  Building,
  Phone,
  Globe,
  RefreshCw,
  Filter,
  Search,
  Plus,
  ArrowRight,
  Camera,
  Minus,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import oceanFreightApi, { VesselTracking, FreightRate, OCEAN_CARRIERS } from '../../../../lib/oceanFreightApi';

// Document Types for Shipping
const SHIPPING_DOCUMENTS = {
  BOL: { name: 'Bill of Lading', icon: FileText, color: 'bg-blue-500' },
  COMMERCIAL_INVOICE: { name: 'Commercial Invoice', icon: FileText, color: 'bg-green-500' },
  PACKING_LIST: { name: 'Packing List', icon: Package, color: 'bg-purple-500' },
  CERTIFICATE_ORIGIN: { name: 'Certificate of Origin', icon: FileText, color: 'bg-orange-500' },
  INSURANCE_POLICY: { name: 'Insurance Policy', icon: FileText, color: 'bg-red-500' },
  CUSTOMS_DECLARATION: { name: 'Customs Declaration', icon: Building, color: 'bg-indigo-500' },
  DELIVERY_ORDER: { name: 'Delivery Order', icon: Truck, color: 'bg-yellow-500' },
  WEIGHT_CERTIFICATE: { name: 'Weight Certificate', icon: FileText, color: 'bg-gray-500' },
  PHYTOSANITARY: { name: 'Phytosanitary Certificate', icon: FileText, color: 'bg-teal-500' },
  DANGEROUS_GOODS: { name: 'Dangerous Goods Declaration', icon: AlertTriangle, color: 'bg-red-600' }
};

interface ShippingDocument {
  id: string;
  type: keyof typeof SHIPPING_DOCUMENTS;
  fileName: string;
  uploadDate: string;
  size: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  downloadUrl: string;
  previewUrl?: string;
}

interface TrackingData {
  containerNumber: string;
  bookingReference: string;
  vesselTracking?: VesselTracking;
  documents: ShippingDocument[];
  milestones: {
    id: string;
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'current' | 'pending';
    location: string;
  }[];
  contacts: {
    shipper: ContactInfo;
    consignee: ContactInfo;
    notify: ContactInfo;
    agent: ContactInfo;
  };
}

interface ContactInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

const OceanFreightPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'track' | 'rates' | 'book' | 'documents'>('track');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [vesselTracking, setVesselTracking] = useState<VesselTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ShippingDocument | null>(null);
  const [emailModal, setEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    subject: '',
    message: '',
    includeDocuments: [] as string[],
    includeTracking: true
  });

  // Track container/booking
  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setLoading(true);
    try {
      // Simulate tracking data fetch
      const mockTrackingData: TrackingData = {
        containerNumber: trackingNumber,
        bookingReference: `BKG${trackingNumber.slice(-6)}`,
        vesselTracking: await oceanFreightApi.trackVessel(`MV MAERSK ${trackingNumber.slice(-3)}`),
        documents: [
          {
            id: '1',
            type: 'BOL',
            fileName: `BOL_${trackingNumber}.pdf`,
            uploadDate: '2024-01-15',
            size: '2.3 MB',
            status: 'approved',
            downloadUrl: '/docs/bol.pdf',
            previewUrl: '/docs/bol_preview.jpg'
          },
          {
            id: '2',
            type: 'COMMERCIAL_INVOICE',
            fileName: `CI_${trackingNumber}.pdf`,
            uploadDate: '2024-01-15',
            size: '1.8 MB',
            status: 'approved',
            downloadUrl: '/docs/commercial_invoice.pdf'
          },
          {
            id: '3',
            type: 'PACKING_LIST',
            fileName: `PL_${trackingNumber}.pdf`,
            uploadDate: '2024-01-15',
            size: '1.2 MB',
            status: 'approved',
            downloadUrl: '/docs/packing_list.pdf'
          },
          {
            id: '4',
            type: 'CERTIFICATE_ORIGIN',
            fileName: `CO_${trackingNumber}.pdf`,
            uploadDate: '2024-01-14',
            size: '0.9 MB',
            status: 'submitted',
            downloadUrl: '/docs/certificate_origin.pdf'
          }
        ],
        milestones: [
          {
            id: '1',
            title: 'Booking Confirmed',
            description: 'Shipment booking confirmed with carrier',
            date: '2024-01-10T10:00:00Z',
            status: 'completed',
            location: 'Shanghai, China'
          },
          {
            id: '2',
            title: 'Container Loaded',
            description: 'Container loaded at origin port',
            date: '2024-01-12T14:30:00Z',
            status: 'completed',
            location: 'Port of Shanghai'
          },
          {
            id: '3',
            title: 'Vessel Departed',
            description: 'Vessel departed from origin port',
            date: '2024-01-13T08:00:00Z',
            status: 'completed',
            location: 'Port of Shanghai'
          },
          {
            id: '4',
            title: 'In Transit',
            description: 'Container in transit to destination',
            date: '2024-01-15T12:00:00Z',
            status: 'current',
            location: 'Pacific Ocean'
          },
          {
            id: '5',
            title: 'Vessel Arrival',
            description: 'Expected arrival at destination port',
            date: '2024-01-28T06:00:00Z',
            status: 'pending',
            location: 'Port of Los Angeles'
          }
        ],
        contacts: {
          shipper: {
            name: 'John Zhang',
            company: 'Shanghai Export Co.',
            email: 'john.zhang@shanghaiexport.com',
            phone: '+86 21 1234 5678',
            address: '123 Huangpu Road, Shanghai, China'
          },
          consignee: {
            name: 'Mike Johnson',
            company: 'LA Import LLC',
            email: 'mike@laimport.com',
            phone: '+1 310 555 0123',
            address: '456 Harbor Blvd, Los Angeles, CA 90021'
          },
          notify: {
            name: 'Sarah Wilson',
            company: 'Trade Logistics Inc.',
            email: 'sarah@tradelogistics.com',
            phone: '+1 310 555 0456',
            address: '789 Commerce St, Los Angeles, CA 90021'
          },
          agent: {
            name: 'B3ACON Logistics',
            company: 'B3ACON',
            email: 'support@b3acon.com',
            phone: '+1 800 B3ACON',
            address: 'Global Headquarters'
          }
        }
      };

      setTrackingData(mockTrackingData);
      setVesselTracking(mockTrackingData.vesselTracking || null);
      toast.success('Tracking information loaded successfully');
    } catch (error) {
      toast.error('Failed to load tracking information');
    } finally {
      setLoading(false);
    }
  };

  // Download document
  const handleDownloadDocument = (document: ShippingDocument) => {
    // In production, this would download the actual file
    toast.success(`Downloading ${document.fileName}`);
    // Simulate file download
    const link = document.createElement('a');
    link.href = document.downloadUrl;
    link.download = document.fileName;
    link.click();
  };

  // Preview document
  const handlePreviewDocument = (document: ShippingDocument) => {
    setSelectedDocument(document);
  };

  // Email tracking information
  const handleEmailShare = () => {
    setEmailModal(true);
    setEmailData({
      ...emailData,
      subject: `Shipment Tracking: ${trackingData?.containerNumber}`,
      message: `Dear Team,\n\nPlease find the tracking information for shipment ${trackingData?.containerNumber}.\n\nBest regards,\nB3ACON Logistics Team`
    });
  };

  // Send email
  const handleSendEmail = async () => {
    if (!emailData.to.trim()) {
      toast.error('Please enter recipient email');
      return;
    }

    try {
      // In production, this would call an email API
      toast.success('Tracking information sent successfully');
      setEmailModal(false);
      setEmailData({
        to: '',
        cc: '',
        subject: '',
        message: '',
        includeDocuments: [],
        includeTracking: true
      });
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  // Refresh tracking data
  const handleRefresh = () => {
    if (trackingNumber) {
      handleTrack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Ship className="w-8 h-8 text-blue-600 mr-3" />
              Ocean Freight Portal
            </h1>
            <p className="text-gray-600 mt-1">Track containers, manage documents, and monitor vessel movements</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'track', label: 'Track Shipment', icon: Search },
                             { id: 'rates', label: 'Get Rates', icon: DollarSign },
              { id: 'book', label: 'Book Shipment', icon: Plus },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tracking Tab */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter container number, booking reference, or B/L number..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                />
              </div>
              <button
                onClick={handleTrack}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Track
              </button>
            </div>
          </div>

          {/* Tracking Results */}
          {trackingData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Tracking Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Shipment Status</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleEmailShare}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Share via email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowMap(!showMap)}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        {showMap ? 'Hide' : 'Show'} Map
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Container Number</p>
                      <p className="font-semibold text-gray-900">{trackingData.containerNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Booking Reference</p>
                      <p className="font-semibold text-gray-900">{trackingData.bookingReference}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    {trackingData.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === 'completed' 
                              ? 'bg-green-100 text-green-600' 
                              : milestone.status === 'current'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {milestone.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : milestone.status === 'current' ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(milestone.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {milestone.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Map View */}
                {showMap && vesselTracking && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Navigation className="w-5 h-5 text-blue-600 mr-2" />
                      Live Vessel Tracking
                    </h3>
                    
                    {/* Map Container */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                      {/* Simulated Map Background */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="w-full h-full bg-gradient-to-r from-blue-200 via-green-200 to-blue-200"></div>
                      </div>
                      
                      {/* Vessel Position */}
                      <div className="relative z-10 text-center">
                        <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500 max-w-sm">
                          <div className="flex items-center justify-center mb-2">
                            <Ship className="w-8 h-8 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">{vesselTracking.vesselName}</h4>
                          <p className="text-sm text-gray-600">Voyage: {vesselTracking.voyage}</p>
                          <p className="text-sm text-gray-600">Status: {vesselTracking.status}</p>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Current Position</p>
                            <p className="text-sm font-medium">{vesselTracking.currentPosition.port || 'At Sea'}</p>
                            <p className="text-xs text-gray-500">
                              {vesselTracking.currentPosition.lat.toFixed(4)}°N, {vesselTracking.currentPosition.lng.toFixed(4)}°E
                            </p>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Next Port</p>
                            <p className="text-sm font-medium">{vesselTracking.nextPort.name}</p>
                            <p className="text-xs text-gray-500">
                              ETA: {new Date(vesselTracking.estimatedArrival).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Map Controls */}
                      <div className="absolute top-4 right-4 space-y-2">
                        <button className="p-2 bg-white shadow-md rounded-lg hover:bg-gray-50">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white shadow-md rounded-lg hover:bg-gray-50">
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Live Indicator */}
                      <div className="absolute top-4 left-4 flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        LIVE
                      </div>
                    </div>

                    {/* Vessel Details */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Speed</div>
                        <div className="font-semibold">14.2 knots</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Course</div>
                        <div className="font-semibold">285°</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Distance to Port</div>
                        <div className="font-semibold">1,247 nm</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Weather</div>
                        <div className="font-semibold">Clear</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Documents */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    Shipping Documents
                  </h3>
                  
                  <div className="space-y-3">
                    {trackingData.documents.map((doc) => {
                      const DocIcon = SHIPPING_DOCUMENTS[doc.type].icon;
                      return (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 ${SHIPPING_DOCUMENTS[doc.type].color} text-white rounded-lg`}>
                              <DocIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {SHIPPING_DOCUMENTS[doc.type].name}
                              </p>
                              <p className="text-xs text-gray-500">{doc.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.previewUrl && (
                              <button
                                onClick={() => handlePreviewDocument(doc)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              className="p-1 text-gray-400 hover:text-green-600"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contacts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-2" />
                    Key Contacts
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(trackingData.contacts).map(([role, contact]) => (
                      <div key={role} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <p className="text-sm font-medium text-gray-900 capitalize">{role}</p>
                        <p className="text-sm text-gray-600">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.company}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {contact.email}
                          </a>
                          <span className="text-gray-300">|</span>
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Share Tracking Information</h3>
              <button
                onClick={() => setEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
                  <input
                    type="email"
                    value={emailData.to}
                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="recipient@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
                  <input
                    type="email"
                    value={emailData.cc}
                    onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="cc@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include Documents</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {trackingData?.documents.map((doc) => (
                    <label key={doc.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={emailData.includeDocuments.includes(doc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEmailData({
                              ...emailData,
                              includeDocuments: [...emailData.includeDocuments, doc.id]
                            });
                          } else {
                            setEmailData({
                              ...emailData,
                              includeDocuments: emailData.includeDocuments.filter(id => id !== doc.id)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{SHIPPING_DOCUMENTS[doc.type].name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={emailData.includeTracking}
                    onChange={(e) => setEmailData({ ...emailData, includeTracking: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Include tracking details and timeline</span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setEmailModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 h-5/6">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {SHIPPING_DOCUMENTS[selectedDocument.type].name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="p-2 text-gray-400 hover:text-green-600"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 h-full overflow-auto">
              {selectedDocument.previewUrl ? (
                <img
                  src={selectedDocument.previewUrl}
                  alt="Document preview"
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Preview not available</p>
                    <p className="text-sm text-gray-500">Click download to view the document</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OceanFreightPortal;