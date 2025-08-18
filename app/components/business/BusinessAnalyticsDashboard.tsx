'use client';

import { BusinessAnalytics } from '../../types/localbase';
import { 
  DollarSign, 
  Users, 
  CreditCard,
  Star,
  MapPin,
  BarChart3,
  PieChart
} from 'lucide-react';

interface BusinessAnalyticsDashboardProps {
  analytics: BusinessAnalytics;
}

export function BusinessAnalyticsDashboard({ analytics }: BusinessAnalyticsDashboardProps) {
  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalTransactions}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.uniqueCustomers}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.reviewStats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Transaction Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Peak Hours
          </h3>
          <div className="space-y-3">
            {analytics.peakHours.map((hour) => (
              <div key={hour.hour} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {hour.hour}:00 - {hour.hour + 1}:00
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(hour.transactions / Math.max(...analytics.peakHours.map(h => h.transactions))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{hour.transactions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Payment Methods
          </h3>
          <div className="space-y-3">
            {analytics.topPaymentMethods.map((method) => (
              <div key={method.method} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{method.method}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(method.count / Math.max(...analytics.topPaymentMethods.map(m => m.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{method.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(analytics.averageTransactionValue)}
            </p>
            <p className="text-sm text-gray-600">Average Transaction</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {((analytics.returningCustomers / analytics.uniqueCustomers) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Returning Customers</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {analytics.reviewStats.totalReviews}
            </p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
        </div>
      </div>

      {/* Review Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Review Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <span className="text-sm w-8">{rating}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: analytics.reviewStats.totalReviews > 0 
                      ? `${((analytics.reviewStats.ratingDistribution[rating] || 0) / analytics.reviewStats.totalReviews) * 100}%`
                      : '0%'
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">
                {analytics.reviewStats.ratingDistribution[rating] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Data */}
      {analytics.geographicData && analytics.geographicData.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Customer Locations
          </h3>
          <div className="space-y-3">
            {analytics.geographicData.slice(0, 5).map((location) => (
              <div key={location.location} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{location.location}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(location.customers / Math.max(...analytics.geographicData.map(l => l.customers))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{location.customers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
