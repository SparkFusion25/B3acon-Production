import axios from 'axios';

// Terminal49 API configuration
const API_KEY = import.meta.env.VITE_TERMINAL49_API_KEY || 'LQuypbifoKpCGBsxkzbBFsPv';
const BASE_URL = 'https://api.terminal49.com/v3';

// Interface for container tracking response
interface ContainerTrackingResponse {
  container: {
    container_number: string;
    carrier: string;
    status: string;
    eta: string;
    location?: {
      lat: number;
      lon: number;
      port: string;
    };
    events: Array<{
      date: string;
      location: string;
      status: string;
      description: string;
    }>;
  };
}

// Interface for tracking request
interface TrackingRequest {
  trackingNumber: string;
  trackingType: 'container' | 'booking' | 'bl';
  carrier?: string;
}

/**
 * Track a container using Terminal49 API
 * @param params Tracking parameters
 * @returns Container tracking information
 */
export const trackContainer = async (params: TrackingRequest): Promise<ContainerTrackingResponse> => {
  try {
    // Determine the endpoint based on tracking type
    let endpoint;
    switch (params.trackingType) {
      case 'container':
        endpoint = `/containers/${params.trackingNumber}`;
        break;
      case 'booking':
        endpoint = `/bookings/${params.trackingNumber}`;
        break;
      case 'bl':
        endpoint = `/bills_of_lading/${params.trackingNumber}`;
        break;
      default:
        throw new Error('Invalid tracking type');
    }

    // Add carrier parameter if provided
    if (params.carrier && params.carrier !== '') {
      endpoint += `?carrier=${params.carrier}`;
    }

    // Make API request
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error tracking container:', error);
    
    // Return mock data if API call fails
    return getMockTrackingData(params.trackingNumber, params.carrier);
  }
};

/**
 * Get mock tracking data for demo purposes
 * @param trackingNumber Container number
 * @param carrier Optional carrier
 * @returns Mock tracking data
 */
const getMockTrackingData = (trackingNumber: string, carrier?: string): ContainerTrackingResponse => {
  return {
    container: { 
      container_number: trackingNumber,
      carrier: carrier || 'MAERSK',
      status: 'In Transit',
      eta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: {
        lat: 19.4326,
        lon: -155.2453,
        port: 'Pacific Ocean',
      },
      events: [
        {
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Shanghai, China',
          status: 'Departed',
          description: 'Vessel departed from port of origin'
        },
        {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Pacific Ocean',
          status: 'In Transit',
          description: 'Vessel in transit'
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Pacific Ocean, near Hawaii',
          status: 'In Transit',
          description: 'Vessel in transit'
        },
      ]
    }
  };
};

/**
 * Get a list of supported carriers
 * @returns List of carriers
 */
export const getSupportedCarriers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/carriers`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting carriers:', error);
    
    // Return mock carriers if API call fails
    return {
      carriers: [
        { code: 'MAERSK', name: 'Maersk' },
        { code: 'MSC', name: 'MSC' },
        { code: 'CMA', name: 'CMA CGM' },
        { code: 'COSCO', name: 'COSCO' },
        { code: 'HAPAG', name: 'Hapag Lloyd' },
        { code: 'OOCL', name: 'OOCL' },
      ]
    };
  }
};

export default {
  trackContainer,
  getSupportedCarriers
};