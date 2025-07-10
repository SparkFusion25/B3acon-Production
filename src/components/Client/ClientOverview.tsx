import React from 'react';
import { BarChart3, DollarSign, TrendingUp, Target, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ClientOverview: React.FC = () => {
  return (
    <div className="p-4 lg:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Services</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">5</div>
          <p className="text-sm text-green-600">↗ +1 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Monthly Investment</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">$4,200</div>
          <p className="text-sm text-blue-600">Professional Plan</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Performance Score</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">94%</div>
          <p className="text-sm text-green-600">Above target</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">ROI</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-red-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">285%</div>
          <p className="text-sm text-green-600">↗ +18% this month</p>
        </div>
      </div>

      {/* Services Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Active Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Services</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">SEO Optimization</p>
                  <p className="text-sm text-gray-600">Keywords ranking improved</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">PPC Campaigns</p>
                  <p className="text-sm text-gray-600">Google & Facebook Ads</p>
                </div>
              </div>
              <span className="text-blue-600 font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Social Media</p>
                  <p className="text-sm text-gray-600">Content & engagement</p>
                </div>
              </div>
              <span className="text-purple-600 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-signal-blue rounded-full flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">SEO report generated</p>
                <p className="text-xs text-gray-500">Your monthly SEO performance report is ready</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-beacon-orange rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Campaign optimization completed</p>
                <p className="text-xs text-gray-500">PPC campaigns have been optimized for better performance</p>
                <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Social media posts scheduled</p>
                <p className="text-xs text-gray-500">This week's content calendar has been published</p>
                <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Monthly strategy review</p>
                <p className="text-xs text-gray-500">Scheduled for tomorrow at 2:00 PM</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Content approval needed</p>
                <p className="text-xs text-gray-500">Review social media posts for next week</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Campaign budget review</p>
                <p className="text-xs text-gray-500">Q1 budget allocation discussion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Updates</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Performance Goal Achieved</p>
                  <p className="text-xs text-green-700">Your SEO rankings have exceeded the target by 15%</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">New Feature Available</p>
                  <p className="text-xs text-blue-700">Landing page builder is now available in your plan</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Invoice Due Soon</p>
                  <p className="text-xs text-yellow-700">Your next payment is due in 5 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;