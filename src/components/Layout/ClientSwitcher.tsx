import React, { useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAgencyData } from '../../data/mockAgencyData';

const ClientSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentClientId, switchToClient, switchToAgency, userType } = useAuth();

  const currentClient = mockAgencyData.clients.find(client => client.id === currentClientId);

  if (userType === 'agency' && !currentClientId) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-signal-blue focus:border-transparent"
      >
        {currentClient && (
          <>
            <img
              src={currentClient.logo || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop'}
              alt={currentClient.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">{currentClient.name}</span>
          </>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {userType === 'agency' && (
              <button
                onClick={() => {
                  switchToAgency();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Back to Agency Dashboard</span>
              </button>
            )}
            
            {userType === 'agency' && <div className="border-t border-gray-200 my-2"></div>}
            
            {mockAgencyData.clients.map((client) => (
              <button
                key={client.id}
                onClick={() => {
                  switchToClient(client.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors ${
                  currentClientId === client.id ? 'bg-blue-50 border border-signal-blue' : ''
                }`}
              >
                <img
                  src={client.logo || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop'}
                  alt={client.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{client.subscription}</div>
                </div>
                {client.status === 'active' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSwitcher;