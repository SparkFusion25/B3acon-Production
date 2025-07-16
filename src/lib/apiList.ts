/**
 * API List for Global Commerce Module
 * 
 * This file contains information about all external APIs required for the
 * Global Commerce functionality, including authentication methods, endpoints,
 * and usage limits.
 */

export const apiList = {
  // Shipment Tracking
  aftership: {
    name: 'AfterShip',
    description: 'Used for tracking shipments across multiple carriers',
    website: 'https://www.aftership.com/',
    auth_method: 'API Key (Header: X-API-Key)',
    base_url: 'https://api.aftership.com/v4/',
    endpoints: {
      trackings: '/trackings',
      tracking_by_id: '/trackings/:slug/:tracking_number',
      carriers: '/couriers'
    },
    free_tier: {
      available: true,
      limits: '100 shipments/month'
    },
    paid_tier: {
      starting_price: '$9/month',
      limits: 'Varies by plan'
    }
  },
  
  // Freight Rates
  freightos: {
    name: 'Freightos WebCargo',
    description: 'Used for freight rate estimation and booking',
    website: 'https://www.freightos.com/',
    auth_method: 'API Key + Secret',
    base_url: 'https://api.freightos.com/v1/',
    endpoints: {
      rates: '/rates',
      bookings: '/bookings'
    },
    free_tier: {
      available: false
    },
    paid_tier: {
      starting_price: 'Custom pricing',
      limits: 'Unlimited'
    }
  },
  
  // Tariff & Tax Calculation
  avalara: {
    name: 'Avalara',
    description: 'Used for tariff and tax calculation',
    website: 'https://www.avalara.com/',
    auth_method: 'Basic Auth (Username + Password)',
    base_url: 'https://rest.avatax.com/api/v2/',
    endpoints: {
      tax_rates: '/taxrates',
      tax_calculation: '/transactions/create'
    },
    free_tier: {
      available: false
    },
    paid_tier: {
      starting_price: 'Custom pricing',
      limits: 'Based on transaction volume'
    }
  },
  
  // HS Code Lookup
  trade_gov: {
    name: 'Trade.gov',
    description: 'Used for HS code lookup and FTA eligibility',
    website: 'https://developer.trade.gov/',
    auth_method: 'API Key (Query Parameter)',
    base_url: 'https://api.trade.gov/v1/',
    endpoints: {
      hs_codes: '/ita_taxonomies/search',
      fta_tariffs: '/tariff_rates/search'
    },
    free_tier: {
      available: true,
      limits: '1,000 calls/day'
    },
    paid_tier: {
      available: false
    }
  },
  
  // Compliance Checking
  compliance_api: {
    name: 'Restricted Party Screening API',
    description: 'Used for compliance checking against restricted party lists',
    website: 'https://www.trade.gov/consolidated-screening-list',
    auth_method: 'API Key (Query Parameter)',
    base_url: 'https://api.trade.gov/consolidated_screening_list/v1/',
    endpoints: {
      search: '/search'
    },
    free_tier: {
      available: true,
      limits: '1,000 calls/day'
    },
    paid_tier: {
      available: false
    }
  },
  
  // Parcel Shipping
  easypost: {
    name: 'EasyPost',
    description: 'Used for parcel shipping rates and label generation',
    website: 'https://www.easypost.com/',
    auth_method: 'API Key (Header: Authorization)',
    base_url: 'https://api.easypost.com/v2/',
    endpoints: {
      shipments: '/shipments',
      rates: '/rates',
      trackers: '/trackers'
    },
    free_tier: {
      available: true,
      limits: 'Limited functionality'
    },
    paid_tier: {
      starting_price: 'Pay as you go',
      limits: 'Unlimited'
    }
  },
  
  // EU TARIC Database
  eu_taric: {
    name: 'EU TARIC',
    description: 'European Union Integrated Tariff Database',
    website: 'https://ec.europa.eu/taxation_customs/dds2/taric/',
    auth_method: 'No API available - data is scraped or manually updated',
    base_url: 'N/A',
    endpoints: {
      notes: 'No public API - data is maintained in our database'
    },
    free_tier: {
      available: true,
      limits: 'Public access to web interface'
    },
    paid_tier: {
      available: false
    }
  },
  
  // US International Trade Commission
  usitc: {
    name: 'USITC HTS',
    description: 'US Harmonized Tariff Schedule',
    website: 'https://hts.usitc.gov/',
    auth_method: 'No API available - data is scraped or manually updated',
    base_url: 'N/A',
    endpoints: {
      notes: 'No public API - data is maintained in our database'
    },
    free_tier: {
      available: true,
      limits: 'Public access to web interface'
    },
    paid_tier: {
      available: false
    }
  }
};

export default apiList;