import React, { useState, useEffect } from 'react';
import { DealsTable } from './PremiumDataTable';
import { Plus, Target, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import '../../styles/premium-b3acon-design-system.css';

interface Deal {
  id: string;
  title: string;
  client_name: string;
  value: number;
  currency: string;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expected_close_date: string;
  created_at: string;
  owner: string;
}

const CRMDealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDeal, setShowAddDeal] = useState(false);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockDeals: Deal[] = [
      {
        id: '1',
        title: 'Enterprise Software License',
        client_name: 'TechCorp Solutions',
        value: 45000,
        currency: 'USD',
        stage: 'negotiation',
        probability: 75,
        expected_close_date: '2024-02-15',
        created_at: '2024-01-10',
        owner: 'Alex Johnson'
      },
      {
        id: '2',
        title: 'Digital Marketing Audit',
        client_name: 'GlobalTech Industries',
        value: 12500,
        currency: 'USD',
        stage: 'proposal',
        probability: 60,
        expected_close_date: '2024-02-28',
        created_at: '2024-01-15',
        owner: 'Sarah Chen'
      },
      {
        id: '3',
        title: 'Cloud Migration Project',
        client_name: 'StartupXYZ',
        value: 28000,
        currency: 'USD',
        stage: 'discovery',
        probability: 25,
        expected_close_date: '2024-03-15',
        created_at: '2024-01-20',
        owner: 'Mike Rodriguez'
      },
      {
        id: '4',
        title: 'Annual Support Contract',
        client_name: 'MegaCorp Ltd',
        value: 67000,
        currency: 'USD',
        stage: 'closed_won',
        probability: 100,
        expected_close_date: '2024-01-30',
        created_at: '2024-01-05',
        owner: 'Alex Johnson'
      },
      {
        id: '5',
        title: 'Website Redesign',
        client_name: 'LocalBusiness Inc',
        value: 8500,
        currency: 'USD',
        stage: 'proposal',
        probability: 45,
        expected_close_date: '2024-02-20',
        created_at: '2024-01-12',
        owner: 'Emily Davis'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setDeals(mockDeals);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddDeal = () => {
    setShowAddDeal(true);
    console.log('Opening add deal modal...');
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(deal => deal.stage === 'closed_won');
  const averageDealSize = deals.length > 0 ? totalValue / deals.length : 0;
  const winRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;

  const MetricCard: React.FC<{
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string;
    change?: string;
  }> = ({ title, value, icon: Icon, color, change }) => (
    <div className={`card-premium metric-card p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className="text-emerald-600 text-sm font-semibold">{change}</div>
        )}
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sales Pipeline
              </h1>
              <p className="text-gray-600 text-lg">
                Track and manage your sales opportunities
              </p>
            </div>
            
            <button
              onClick={handleAddDeal}
              className="btn-premium btn-primary btn-large"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Deal
            </button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Pipeline Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={DollarSign}
            color="from-emerald-500 to-green-600"
            change="+23%"
          />
          <MetricCard
            title="Active Deals"
            value={deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length.toString()}
            icon={Target}
            color="from-blue-500 to-indigo-600"
            change="+5"
          />
          <MetricCard
            title="Average Deal Size"
            value={`$${averageDealSize.toLocaleString()}`}
            icon={TrendingUp}
            color="from-purple-500 to-pink-600"
            change="+12%"
          />
          <MetricCard
            title="Win Rate"
            value={`${winRate.toFixed(1)}%`}
            icon={Users}
            color="from-orange-500 to-red-600"
            change="+2.3%"
          />
        </div>

        {/* Deals Table */}
        <div className="animate-fade-in">
          {loading ? (
            <div className="card-premium p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <DealsTable
              data={deals}
              onAddDeal={handleAddDeal}
            />
          )}
        </div>

        {/* Pipeline Stages Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pipeline by Stage
            </h3>
            <div className="space-y-4">
              {['discovery', 'proposal', 'negotiation', 'closed_won'].map((stage) => {
                const stageDeals = deals.filter(deal => deal.stage === stage);
                const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
                const percentage = totalValue > 0 ? (stageValue / totalValue) * 100 : 0;
                
                return (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        stage === 'discovery' ? 'bg-gray-400' :
                        stage === 'proposal' ? 'bg-blue-400' :
                        stage === 'negotiation' ? 'bg-amber-400' :
                        'bg-emerald-400'
                      }`}></div>
                      <span className="font-medium text-gray-700 capitalize">
                        {stage.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${stageValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stageDeals.length} deals ({percentage.toFixed(0)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {deals.slice(0, 4).map((deal) => (
                <div key={deal.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{deal.title}</p>
                    <p className="text-sm text-gray-600">{deal.client_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Expected close: {new Date(deal.expected_close_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${deal.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{deal.probability}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDealsPage;