import React, { useState } from 'react';

const LiveTracking: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const mockOrders = [
    {
      id: '12345',
      status: 'In Transit',
      customer: 'John Doe',
      destination: 'New York, NY',
      estimatedDelivery: '2024-01-15'
    },
    {
      id: '12346',
      status: 'Delivered',
      customer: 'Jane Smith',
      destination: 'Los Angeles, CA',
      estimatedDelivery: '2024-01-14'
    }
  ];

  return (
    <div className="live-tracking p-6">
      <div className="header mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Tracking</h1>
        <p className="text-gray-600">Track your orders and packages in real-time</p>
      </div>

      <div className="tracking-input bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Track an Order</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Track
          </button>
        </div>
      </div>

      <div className="orders-list">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Orders</h3>
        <div className="space-y-4">
          {mockOrders.map(order => (
            <div key={order.id} className="order-item bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">Order #{order.id}</h4>
                  <p className="text-gray-600">Customer: {order.customer}</p>
                  <p className="text-gray-600">Destination: {order.destination}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">Est. Delivery: {order.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;