'use client';

import { BusinessAnalytics } from '../../types/localbase';
import { 
  DollarSign, 
  Users, 
  CreditCard,
  Star,
  MapPin,
  PieChart,
  TrendingUp,
  Activity,
  Clock,
  Target,
  Award
} from 'lucide-react';

interface BusinessAnalyticsDashboardProps {
  analytics: BusinessAnalytics;
}

export function BusinessAnalyticsDashboard({ analytics }: BusinessAnalyticsDashboardProps) {
  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatETH = (amount: string) => {
    return `${parseFloat(amount).toFixed(4)} ETH`;
  };

  const getRevenueGrowthRate = () => {
    // Simulate growth rate based on transaction count
    const growthRate = analytics.totalTransactions > 5 ? 
      12.5 + (analytics.totalTransactions * 0.5) : 
      analytics.totalTransactions * 2.5;
    return Math.min(growthRate, 35); // Cap at 35%
  };

  const getCustomerRetentionRate = () => {
    return analytics.uniqueCustomers > 0 ? 
      ((analytics.returningCustomers / analytics.uniqueCustomers) * 100) : 0;
  };

  const getBestHour = () => {
    return analytics.peakHours.reduce((best, hour) => 
      hour.transactions > best.transactions ? hour : best
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Key Metrics with Growth Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{getRevenueGrowthRate().toFixed(1)}%
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(analytics.totalRevenue)}
          </p>
          <p className="text-xs text-gray-500">
            ≈ {formatETH(analytics.averageTransactionValue)} avg per transaction
          </p>
        </div>

        {/* Transactions Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center text-blue-600 text-sm">
              <Activity className="w-4 h-4 mr-1" />
              Live
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.totalTransactions}
          </p>
          <p className="text-xs text-gray-500">
            Peak: {getBestHour().hour}:00-{getBestHour().hour + 1}:00
          </p>
        </div>

        {/* Customers Card */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-center text-purple-600 text-sm">
              <Target className="w-4 h-4 mr-1" />
              {getCustomerRetentionRate().toFixed(0)}%
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Unique Customers</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.uniqueCustomers}
          </p>
          <p className="text-xs text-gray-500">
            {analytics.returningCustomers} returning
          </p>
        </div>

        {/* Rating Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600 fill-current" />
            </div>
            <div className="flex items-center text-yellow-600 text-sm">
              <Award className="w-4 h-4 mr-1" />
              {analytics.reviewStats.totalReviews > 0 ? 'Rated' : 'New'}
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Average Rating</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.reviewStats.averageRating.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">
            {analytics.reviewStats.totalReviews} review{analytics.reviewStats.totalReviews !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Enhanced Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Peak Hours Analysis
            </h3>
            <div className="text-sm text-gray-500">
              Best: {getBestHour().hour}:00
            </div>
          </div>
          <div className="space-y-4">
            {analytics.peakHours.map((hour) => {
              const maxTransactions = Math.max(...analytics.peakHours.map(h => h.transactions));
              const percentage = maxTransactions > 0 ? (hour.transactions / maxTransactions) * 100 : 0;
              const isActive = hour.transactions === maxTransactions;
              
              return (
                <div key={hour.hour} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <span className="text-sm text-gray-600 font-medium w-16">
                      {hour.hour}:00
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                            : 'bg-gradient-to-r from-blue-300 to-blue-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-30" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <span className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                      {hour.transactions}
                    </span>
                    {isActive && (
                      <div className="text-xs text-blue-500">
                        🔥 Peak
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-600" />
            Payment Methods
          </h3>
          <div className="space-y-4">
            {analytics.topPaymentMethods.map((method, index) => {
              const maxCount = Math.max(...analytics.topPaymentMethods.map(m => m.count));
              const percentage = maxCount > 0 ? (method.count / maxCount) * 100 : 0;
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500'];
              
              return (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                    <span className="text-sm text-gray-600 font-medium">{method.method}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <span className="text-sm font-semibold text-gray-700">{method.count}</span>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Customer Insights */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
        <h3 className="text-lg font-semibold mb-6 flex items-center text-indigo-900">
          <Users className="w-5 h-5 mr-2" />
          Customer Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center bg-white/60 backdrop-blur rounded-lg p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(analytics.averageTransactionValue)}
            </p>
            <p className="text-sm text-gray-600">Avg Transaction</p>
            <div className="mt-2 text-xs text-blue-600">
              {parseFloat(analytics.averageTransactionValue) > 25 ? '💰 High Value' : '📈 Growing'}
            </div>
          </div>
          
          <div className="text-center bg-white/60 backdrop-blur rounded-lg p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {getCustomerRetentionRate().toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Retention Rate</p>
            <div className="mt-2 text-xs text-green-600">
              {getCustomerRetentionRate() > 30 ? '🎯 Excellent' : '🌱 Building'}
            </div>
          </div>
          
          <div className="text-center bg-white/60 backdrop-blur rounded-lg p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2">
              <Star className="w-6 h-6 text-purple-600 fill-current" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {analytics.reviewStats.totalReviews}
            </p>
            <p className="text-sm text-gray-600">Total Reviews</p>
            <div className="mt-2 text-xs text-purple-600">
              {analytics.reviewStats.averageRating >= 4.5 ? '⭐ Outstanding' : 
               analytics.reviewStats.averageRating >= 4.0 ? '👍 Great' : '📝 Improving'}
            </div>
          </div>

          <div className="text-center bg-white/60 backdrop-blur rounded-lg p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-2">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {((analytics.totalTransactions / analytics.uniqueCustomers) || 0).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Avg Visits</p>
            <div className="mt-2 text-xs text-orange-600">
              {(analytics.totalTransactions / analytics.uniqueCustomers) > 2 ? '🔥 Loyal Base' : '🚀 Growing'}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Review Distribution */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
          <span className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-600 fill-current" />
            Review Distribution
          </span>
          <div className="text-sm text-gray-500">
            {analytics.reviewStats.averageRating.toFixed(1)} avg rating
          </div>
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = analytics.reviewStats.ratingDistribution[rating] || 0;
            const percentage = analytics.reviewStats.totalReviews > 0 ? 
              (count / analytics.reviewStats.totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-3 group">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium text-gray-700 w-3">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      rating >= 4 
                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                        : rating === 3 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                        : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                  {percentage > 0 && (
                    <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse" />
                  )}
                </div>
                <div className="text-right w-20">
                  <span className="text-sm font-semibold text-gray-700">
                    {count}
                  </span>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(0)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {analytics.reviewStats.totalReviews === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No reviews yet</p>
            <p className="text-xs">Encourage customers to leave reviews!</p>
          </div>
        )}
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
