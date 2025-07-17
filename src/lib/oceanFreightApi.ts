import axios from 'axios';

// Ocean Freight API Configuration
const API_BASE_URL = 'https://api.searates.com/v2';
const FREIGHTOS_API_URL = 'https://api.freightos.com/v1';
const API_KEY = import.meta.env.VITE_SEARATES_API_KEY || 'demo_key';

// Major Ocean Carriers
export const OCEAN_CARRIERS = {
  MAERSK: { code: 'MAEU', name: 'Maersk Line', logo: '/carriers/maersk.png' },
  MSC: { code: 'MSCU', name: 'Mediterranean Shipping Company', logo: '/carriers/msc.png' },
  CMA_CGM: { code: 'CMDU', name: 'CMA CGM', logo: '/carriers/cmacgm.png' },
  COSCO: { code: 'COSU', name: 'COSCO SHIPPING', logo: '/carriers/cosco.png' },
  HAPAG_LLOYD: { code: 'HLCU', name: 'Hapag-Lloyd', logo: '/carriers/hapag.png' },
  ONE: { code: 'ONEY', name: 'Ocean Network Express', logo: '/carriers/one.png' },
  EVERGREEN: { code: 'EGLV', name: 'Evergreen Line', logo: '/carriers/evergreen.png' },
  YANG_MING: { code: 'YMLU', name: 'Yang Ming', logo: '/carriers/yangming.png' },
  PIL: { code: 'PILU', name: 'Pacific International Lines', logo: '/carriers/pil.png' },
  HMM: { code: 'HDMU', name: 'HMM', logo: '/carriers/hmm.png' }
};

// Container Types
export const CONTAINER_TYPES = {
  '20DC': { name: '20ft Dry Container', capacity: '33.2 CBM', maxWeight: '28,230 kg' },
  '40DC': { name: '40ft Dry Container', capacity: '67.7 CBM', maxWeight: '28,750 kg' },
  '40HC': { name: '40ft High Cube', capacity: '76.3 CBM', maxWeight: '28,750 kg' },
  '20RF': { name: '20ft Refrigerated', capacity: '28.3 CBM', maxWeight: '27,400 kg' },
  '40RF': { name: '40ft Refrigerated', capacity: '59.3 CBM', maxWeight: '28,080 kg' },
  '20OT': { name: '20ft Open Top', capacity: '32.4 CBM', maxWeight: '28,230 kg' },
  '40OT': { name: '40ft Open Top', capacity: '65.9 CBM', maxWeight: '28,750 kg' },
  '20FR': { name: '20ft Flat Rack', capacity: 'Variable', maxWeight: '28,230 kg' },
  '40FR': { name: '40ft Flat Rack', capacity: 'Variable', maxWeight: '40,000 kg' }
};

// Interfaces
export interface Port {
  code: string;
  name: string;
  country: string;
  countryCode: string;
  timezone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface FreightRate {
  id: string;
  carrier: keyof typeof OCEAN_CARRIERS;
  carrierName: string;
  serviceType: string;
  validFrom: string;
  validTo: string;
  origin: Port;
  destination: Port;
  transitTime: number; // days
  frequency: string; // weekly, bi-weekly
  containerRates: {
    [key in keyof typeof CONTAINER_TYPES]?: {
      oceanFreight: number;
      currency: string;
      localCharges: {
        origin: number;
        destination: number;
      };
      totalCost: number;
    };
  };
  cutOffDates: {
    documentation: string;
    cargoGateIn: string;
    vgmCutOff: string;
  };
  vessel: {
    name: string;
    voyage: string;
    etd: string; // estimated time of departure
    eta: string; // estimated time of arrival
  };
  bookingTerms: string;
  reliability: number; // 0-100 percentage
}

export interface BookingRequest {
  origin: string;
  destination: string;
  containerType: keyof typeof CONTAINER_TYPES;
  quantity: number;
  cargoDescription: string;
  grossWeight: number;
  shipper: {
    name: string;
    address: string;
    contact: string;
    email: string;
  };
  consignee: {
    name: string;
    address: string;
    contact: string;
    email: string;
  };
  preferredCarrier?: keyof typeof OCEAN_CARRIERS;
  preferredSailing?: string;
  specialRequirements?: string[];
}

export interface VesselTracking {
  vesselName: string;
  voyage: string;
  carrier: string;
  currentPosition: {
    lat: number;
    lng: number;
    port?: string;
  };
  status: 'sailing' | 'at_port' | 'anchored' | 'delayed';
  nextPort: Port;
  estimatedArrival: string;
  containers: string[]; // container numbers on vessel
  route: {
    port: Port;
    eta: string;
    etd: string;
    status: 'completed' | 'current' | 'upcoming';
  }[];
}

// Ocean Freight API Service
export const oceanFreightApi = {
  // Get freight rates between ports
  async getFreightRates(
    originPort: string,
    destinationPort: string,
    containerType: keyof typeof CONTAINER_TYPES,
    cargoWeight?: number
  ): Promise<FreightRate[]> {
    try {
      // In production, this would call multiple carrier APIs
      const response = await axios.get(`${API_BASE_URL}/freight-rates`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: {
          origin: originPort,
          destination: destinationPort,
          container_type: containerType,
          cargo_weight: cargoWeight
        }
      });

      if (response.data) {
        return response.data.rates;
      }

      // Mock data for development
      return this.getMockFreightRates(originPort, destinationPort, containerType);
    } catch (error) {
      console.error('Error fetching freight rates:', error);
      return this.getMockFreightRates(originPort, destinationPort, containerType);
    }
  },

  // Search ports by name or code
  async searchPorts(query: string): Promise<Port[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ports/search`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        params: { q: query, limit: 10 }
      });

      return response.data.ports || this.getMockPorts(query);
    } catch (error) {
      console.error('Error searching ports:', error);
      return this.getMockPorts(query);
    }
  },

  // Get container availability
  async getContainerAvailability(
    port: string,
    containerType: keyof typeof CONTAINER_TYPES,
    date: string
  ): Promise<{ available: number; depot: string; condition: string }[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/container-availability`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        params: { port, container_type: containerType, date }
      });

      return response.data.availability || this.getMockAvailability();
    } catch (error) {
      console.error('Error fetching container availability:', error);
      return this.getMockAvailability();
    }
  },

  // Create booking request
  async createBooking(bookingData: BookingRequest): Promise<{
    bookingReference: string;
    status: string;
    estimatedCost: number;
    currency: string;
  }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      // Return mock booking for development
      return {
        bookingReference: `BKG${Date.now()}`,
        status: 'pending_confirmation',
        estimatedCost: 2850,
        currency: 'USD'
      };
    }
  },

  // Track vessel
  async trackVessel(vesselName: string, voyage?: string): Promise<VesselTracking | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vessel-tracking`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        params: { vessel: vesselName, voyage }
      });

      return response.data.tracking || this.getMockVesselTracking(vesselName);
    } catch (error) {
      console.error('Error tracking vessel:', error);
      return this.getMockVesselTracking(vesselName);
    }
  },

  // Get sailing schedules
  async getSailingSchedules(
    originPort: string,
    destinationPort: string,
    fromDate: string,
    toDate: string
  ): Promise<{
    carrier: string;
    service: string;
    vessel: string;
    voyage: string;
    etd: string;
    eta: string;
    transitTime: number;
    frequency: string;
  }[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/sailing-schedules`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        params: { origin: originPort, destination: destinationPort, from: fromDate, to: toDate }
      });

      return response.data.schedules || this.getMockSchedules();
    } catch (error) {
      console.error('Error fetching sailing schedules:', error);
      return this.getMockSchedules();
    }
  },

  // Mock data generators for development
  getMockFreightRates(origin: string, destination: string, containerType: keyof typeof CONTAINER_TYPES): FreightRate[] {
    const carriers = Object.keys(OCEAN_CARRIERS) as (keyof typeof OCEAN_CARRIERS)[];
    
    return carriers.slice(0, 5).map((carrier, index) => ({
      id: `rate_${carrier}_${Date.now()}_${index}`,
      carrier,
      carrierName: OCEAN_CARRIERS[carrier].name,
      serviceType: 'Standard',
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      origin: {
        code: origin,
        name: `Port of ${origin}`,
        country: 'Country',
        countryCode: 'CC',
        timezone: 'UTC+0',
        coordinates: { lat: 0, lng: 0 }
      },
      destination: {
        code: destination,
        name: `Port of ${destination}`,
        country: 'Country',
        countryCode: 'CC',
        timezone: 'UTC+0',
        coordinates: { lat: 0, lng: 0 }
      },
      transitTime: 14 + Math.floor(Math.random() * 14),
      frequency: 'Weekly',
      containerRates: {
        [containerType]: {
          oceanFreight: 1500 + Math.floor(Math.random() * 1000),
          currency: 'USD',
          localCharges: {
            origin: 300 + Math.floor(Math.random() * 200),
            destination: 400 + Math.floor(Math.random() * 300)
          },
          totalCost: 2200 + Math.floor(Math.random() * 800)
        }
      },
      cutOffDates: {
        documentation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        cargoGateIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        vgmCutOff: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      vessel: {
        name: `MV ${carrier} ${Math.floor(Math.random() * 1000)}`,
        voyage: `${Math.floor(Math.random() * 100)}W`,
        etd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        eta: new Date(Date.now() + (10 + 14 + Math.floor(Math.random() * 14)) * 24 * 60 * 60 * 1000).toISOString()
      },
      bookingTerms: 'Standard terms and conditions apply',
      reliability: 85 + Math.floor(Math.random() * 15)
    }));
  },

  getMockPorts(query: string): Port[] {
    const commonPorts = [
      { code: 'SGSIN', name: 'Singapore', country: 'Singapore', countryCode: 'SG' },
      { code: 'CNSHA', name: 'Shanghai', country: 'China', countryCode: 'CN' },
      { code: 'USLAX', name: 'Los Angeles', country: 'United States', countryCode: 'US' },
      { code: 'NLRTM', name: 'Rotterdam', country: 'Netherlands', countryCode: 'NL' },
      { code: 'CNQIN', name: 'Qingdao', country: 'China', countryCode: 'CN' },
      { code: 'USNYC', name: 'New York', country: 'United States', countryCode: 'US' },
      { code: 'DEHAM', name: 'Hamburg', country: 'Germany', countryCode: 'DE' },
      { code: 'HKHKG', name: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK' }
    ];

    return commonPorts
      .filter(port => 
        port.name.toLowerCase().includes(query.toLowerCase()) ||
        port.code.toLowerCase().includes(query.toLowerCase())
      )
      .map(port => ({
        ...port,
        timezone: 'UTC+0',
        coordinates: { lat: 0, lng: 0 }
      }));
  },

  getMockAvailability() {
    return [
      { available: 25, depot: 'Main Terminal', condition: 'New' },
      { available: 15, depot: 'Secondary Depot', condition: 'Good' },
      { available: 8, depot: 'Inland Depot', condition: 'Fair' }
    ];
  },

  getMockVesselTracking(vesselName: string): VesselTracking {
    return {
      vesselName,
      voyage: '001W',
      carrier: 'MAERSK',
      currentPosition: {
        lat: 1.3521,
        lng: 103.8198,
        port: 'Singapore'
      },
      status: 'at_port',
      nextPort: {
        code: 'CNSHA',
        name: 'Shanghai',
        country: 'China',
        countryCode: 'CN',
        timezone: 'UTC+8',
        coordinates: { lat: 31.2304, lng: 121.4737 }
      },
      estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      containers: ['MAEU1234567', 'MAEU2345678', 'MAEU3456789'],
      route: [
        {
          port: {
            code: 'SGSIN',
            name: 'Singapore',
            country: 'Singapore',
            countryCode: 'SG',
            timezone: 'UTC+8',
            coordinates: { lat: 1.3521, lng: 103.8198 }
          },
          eta: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          etd: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'current'
        }
      ]
    };
  },

  getMockSchedules() {
    return [
      {
        carrier: 'MAERSK',
        service: 'AE1',
        vessel: 'MAERSK SENTOSA',
        voyage: '001W',
        etd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        eta: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        transitTime: 14,
        frequency: 'Weekly'
      }
    ];
  }
};

export default oceanFreightApi;