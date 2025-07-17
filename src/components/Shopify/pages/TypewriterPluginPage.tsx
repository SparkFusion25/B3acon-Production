import React from 'react';
import ShopifyAppLayout from '../ShopifyAppLayout';
import TypewriterPluginBuilder from '../plugins/TypewriterPluginBuilder';

const TypewriterPluginPage: React.FC = () => {
  return (
    <ShopifyAppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Typewriter Effect Plugin</h1>
            <p className="text-gray-600">Create engaging animated text that captures your customers' attention</p>
          </div>
        </div>
        
        <TypewriterPluginBuilder />
      </div>
    </ShopifyAppLayout>
  );
};

export default TypewriterPluginPage;