import React from 'react';
import ShopifyAppLayout from '../ShopifyAppLayout';
import ReviewSystemBuilder from '../plugins/ReviewSystemBuilder';

const ReviewSystemPage: React.FC = () => {
  return (
    <ShopifyAppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Management System</h1>
            <p className="text-gray-600">Automate review collection and showcase customer testimonials</p>
          </div>
        </div>
        
        <ReviewSystemBuilder />
      </div>
    </ShopifyAppLayout>
  );
};

export default ReviewSystemPage;