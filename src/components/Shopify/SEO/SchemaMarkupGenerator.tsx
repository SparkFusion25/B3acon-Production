import React, { useState, useEffect } from 'react';
import { 
  Code, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Download, 
  Upload,
  Eye,
  Settings,
  Zap,
  FileText,
  Globe,
  ShoppingBag,
  Star,
  Users,
  MapPin,
  Calendar,
  Play
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SchemaType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'product' | 'organization' | 'content' | 'local' | 'ecommerce';
  required: string[];
  optional: string[];
  example: object;
}

interface GeneratedSchema {
  id: string;
  type: string;
  title: string;
  schema: object;
  isValid: boolean;
  validationErrors: string[];
  appliedTo: string[];
  createdAt: string;
  lastModified: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

const SchemaMarkupGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedSchemaType, setSelectedSchemaType] = useState<string>('product');
  const [schemaData, setSchemaData] = useState<Record<string, any>>({});
  const [generatedSchemas, setGeneratedSchemas] = useState<GeneratedSchema[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'json' | 'preview'>('json');

  const schemaTypes: SchemaType[] = [
    {
      id: 'product',
      name: 'Product',
      description: 'Schema for individual products with pricing, reviews, and availability',
      icon: ShoppingBag,
      category: 'product',
      required: ['name', 'description', 'price', 'currency'],
      optional: ['brand', 'category', 'image', 'availability', 'reviews', 'rating'],
      example: {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "Premium Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "brand": "TechBrand",
        "price": "199.99",
        "currency": "USD",
        "availability": "InStock",
        "image": "https://example.com/headphones.jpg"
      }
    },
    {
      id: 'organization',
      name: 'Organization',
      description: 'Schema for business/company information',
      icon: Users,
      category: 'organization',
      required: ['name', 'url'],
      optional: ['logo', 'description', 'address', 'contactPoint', 'sameAs'],
      example: {
        "@context": "https://schema.org/",
        "@type": "Organization",
        "name": "TechStore Inc.",
        "url": "https://techstore.com",
        "logo": "https://techstore.com/logo.png",
        "description": "Premium technology products and accessories"
      }
    },
    {
      id: 'localBusiness',
      name: 'Local Business',
      description: 'Schema for local businesses with location and hours',
      icon: MapPin,
      category: 'local',
      required: ['name', 'address'],
      optional: ['telephone', 'openingHours', 'image', 'priceRange', 'geo'],
      example: {
        "@context": "https://schema.org/",
        "@type": "LocalBusiness",
        "name": "TechStore Downtown",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Main St",
          "addressLocality": "New York",
          "addressRegion": "NY",
          "postalCode": "10001"
        }
      }
    },
    {
      id: 'review',
      name: 'Review',
      description: 'Schema for product or service reviews',
      icon: Star,
      category: 'content',
      required: ['itemReviewed', 'reviewRating', 'author'],
      optional: ['datePublished', 'reviewBody'],
      example: {
        "@context": "https://schema.org/",
        "@type": "Review",
        "itemReviewed": {
          "@type": "Product",
          "name": "Premium Wireless Headphones"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "John Doe"
        }
      }
    },
    {
      id: 'breadcrumb',
      name: 'Breadcrumb List',
      description: 'Schema for navigation breadcrumbs',
      icon: Globe,
      category: 'content',
      required: ['itemListElement'],
      optional: [],
      example: {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://example.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Electronics",
            "item": "https://example.com/electronics"
          }
        ]
      }
    },
    {
      id: 'event',
      name: 'Event',
      description: 'Schema for events and gatherings',
      icon: Calendar,
      category: 'content',
      required: ['name', 'startDate', 'location'],
      optional: ['endDate', 'description', 'performer', 'offers'],
      example: {
        "@context": "https://schema.org/",
        "@type": "Event",
        "name": "Tech Product Launch",
        "startDate": "2024-02-15T19:00",
        "location": {
          "@type": "Place",
          "name": "Convention Center",
          "address": "123 Event St, City, State"
        }
      }
    }
  ];

  useEffect(() => {
    loadSampleSchemas();
  }, []);

  const loadSampleSchemas = () => {
    const sampleSchemas: GeneratedSchema[] = [
      {
        id: '1',
        type: 'product',
        title: 'Premium Wireless Headphones Schema',
        schema: schemaTypes.find(t => t.id === 'product')?.example || {},
        isValid: true,
        validationErrors: [],
        appliedTo: ['/products/wireless-headphones', '/collections/audio'],
        createdAt: '2024-01-01T10:00:00Z',
        lastModified: '2024-01-02T15:30:00Z'
      },
      {
        id: '2',
        type: 'organization',
        title: 'Company Information Schema',
        schema: schemaTypes.find(t => t.id === 'organization')?.example || {},
        isValid: true,
        validationErrors: [],
        appliedTo: ['site-wide'],
        createdAt: '2024-01-01T10:00:00Z',
        lastModified: '2024-01-01T10:00:00Z'
      }
    ];
    setGeneratedSchemas(sampleSchemas);
  };

  const generateSchema = async () => {
    setIsGenerating(true);
    try {
      const selectedType = schemaTypes.find(t => t.id === selectedSchemaType);
      if (!selectedType) return;

      // Validate required fields
      const missingFields = selectedType.required.filter(field => !schemaData[field]);
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Generate schema
      const schema = {
        "@context": "https://schema.org/",
        "@type": selectedType.name,
        ...schemaData
      };

      // Validate schema
      const validation = validateSchema(schema);

      const newSchema: GeneratedSchema = {
        id: Date.now().toString(),
        type: selectedSchemaType,
        title: `${selectedType.name} Schema - ${schemaData.name || 'Untitled'}`,
        schema: schema,
        isValid: validation.isValid,
        validationErrors: validation.errors,
        appliedTo: [],
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      setGeneratedSchemas(prev => [newSchema, ...prev]);
      setSchemaData({});
      toast.success('Schema generated successfully!');
    } catch (error) {
      toast.error('Failed to generate schema');
    } finally {
      setIsGenerating(false);
    }
  };

  const validateSchema = (schema: object): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basic validation
    if (!schema['@context']) {
      errors.push('Missing @context property');
    }

    if (!schema['@type']) {
      errors.push('Missing @type property');
    }

    // Type-specific validation
    const schemaType = schema['@type'] as string;
    const typeConfig = schemaTypes.find(t => t.name === schemaType);

    if (typeConfig) {
      typeConfig.required.forEach(field => {
        if (!schema[field]) {
          errors.push(`Missing required field: ${field}`);
        }
      });

      typeConfig.optional.forEach(field => {
        if (!schema[field]) {
          suggestions.push(`Consider adding optional field: ${field}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  };

  const copyToClipboard = (schema: object) => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    toast.success('Schema copied to clipboard!');
  };

  const downloadSchema = (schema: GeneratedSchema) => {
    const blob = new Blob([JSON.stringify(schema.schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema.type}-schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const applySchemaToPages = async (schemaId: string, pages: string[]) => {
    try {
      setGeneratedSchemas(prev => prev.map(schema =>
        schema.id === schemaId
          ? { ...schema, appliedTo: [...new Set([...schema.appliedTo, ...pages])] }
          : schema
      ));
      toast.success(`Schema applied to ${pages.length} pages`);
    } catch (error) {
      toast.error('Failed to apply schema');
    }
  };

  const renderGenerator = () => {
    const selectedType = schemaTypes.find(t => t.id === selectedSchemaType);
    
    return (
      <div className="space-y-6">
        {/* Schema Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Schema Type</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemaTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedSchemaType(type.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedSchemaType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">{type.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      type.category === 'product' ? 'bg-green-100 text-green-800' :
                      type.category === 'organization' ? 'bg-blue-100 text-blue-800' :
                      type.category === 'content' ? 'bg-purple-100 text-purple-800' :
                      type.category === 'local' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {type.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Schema Form */}
        {selectedType && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configure {selectedType.name} Schema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required Fields */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Required Fields</h4>
                <div className="space-y-4">
                  {selectedType.required.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field} *
                      </label>
                      <input
                        type="text"
                        value={schemaData[field] || ''}
                        onChange={(e) => setSchemaData(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={`Enter ${field}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Optional Fields</h4>
                <div className="space-y-4">
                  {selectedType.optional.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={schemaData[field] || ''}
                        onChange={(e) => setSchemaData(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={`Enter ${field}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Example Preview */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Example Output</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(selectedType.example, null, 2)}
                </pre>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-6">
              <button
                onClick={generateSchema}
                disabled={isGenerating || selectedType.required.some(field => !schemaData[field])}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Generate Schema
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSchemasList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Generated Schemas</h3>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Schema
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {generatedSchemas.map(schema => (
          <div key={schema.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{schema.title}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-500">
                    Type: <span className="font-medium">{schema.type}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    Created: {new Date(schema.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    {schema.isValid ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Valid</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">Invalid</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(schema.schema)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  title="Copy to Clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => downloadSchema(schema)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                  title="Test Schema"
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Validation Errors */}
            {!schema.isValid && schema.validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-medium text-red-800 mb-2">Validation Errors:</h5>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {schema.validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applied To */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Applied To:</h5>
              <div className="flex flex-wrap gap-2">
                {schema.appliedTo.map((page, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {page}
                  </span>
                ))}
                {schema.appliedTo.length === 0 && (
                  <span className="text-sm text-gray-500">Not applied to any pages</span>
                )}
              </div>
            </div>

            {/* Schema Preview */}
            <div className="border rounded-lg">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                <h5 className="font-medium text-gray-900">Schema Code</h5>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('json')}
                    className={`px-3 py-1 text-sm rounded ${
                      previewMode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setPreviewMode('preview')}
                    className={`px-3 py-1 text-sm rounded ${
                      previewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              <div className="p-4">
                {previewMode === 'json' ? (
                  <pre className="text-sm text-gray-700 overflow-x-auto max-h-64">
                    {JSON.stringify(schema.schema, null, 2)}
                  </pre>
                ) : (
                  <div className="text-sm text-gray-700">
                    <div className="space-y-2">
                      <div><strong>Type:</strong> {schema.schema['@type']}</div>
                      {Object.entries(schema.schema).map(([key, value]) => {
                        if (key === '@context' || key === '@type') return null;
                        return (
                          <div key={key}>
                            <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => applySchemaToPages(schema.id, ['/products/example'])}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                Apply to Pages
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                Edit Schema
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTesting = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schema Testing & Validation</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test URL or Paste Schema JSON
            </label>
            <textarea
              placeholder="Paste your schema JSON here or enter a URL to test..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Test with Google
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Validate Schema
            </button>
          </div>
        </div>

        {/* Testing Results */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-800">Schema Valid!</h4>
          </div>
          <p className="text-sm text-green-700">
            Your schema markup is valid and follows Google's structured data guidelines.
          </p>
        </div>
      </div>

      {/* Schema Testing Tools */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">External Testing Tools</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://search.google.com/test/rich-results"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Google Rich Results Test</h4>
                <p className="text-sm text-gray-600">Test how your schema appears in Google search</p>
              </div>
            </div>
          </a>

          <a
            href="https://validator.schema.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Schema.org Validator</h4>
                <p className="text-sm text-gray-600">Official schema markup validator</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'generator', label: 'Schema Generator', icon: Code },
    { id: 'schemas', label: 'My Schemas', icon: FileText },
    { id: 'testing', label: 'Testing & Validation', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">JSON-LD & Schema Markup</h2>
          <p className="text-gray-600">Generate and manage structured data for better search visibility</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'generator' && renderGenerator()}
      {activeTab === 'schemas' && renderSchemasList()}
      {activeTab === 'testing' && renderTesting()}
    </div>
  );
};

export default SchemaMarkupGenerator;