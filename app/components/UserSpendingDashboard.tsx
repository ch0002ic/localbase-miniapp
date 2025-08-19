'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { SmartContractService } from '../services/smartContract';
import { DollarSign, TrendingUp, Activity, Loader2 } from 'lucide-react';

export function UserSpendingDashboard() {
  const [totalSpent, setTotalSpent] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const loadUserSpending = async () => {
      if (!isConnected || !address || !SmartContractService.isEnabled()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const spent = await SmartContractService.getUserTotalSpent(address);
        setTotalSpent(spent);
      } catch (error) {
        console.error('Failed to load user spending:', error);
        setTotalSpent('0');
      } finally {
        setLoading(false);
      }
    };

    loadUserSpending();
    
    // Refresh spending every 30 seconds
    const interval = setInterval(loadUserSpending, 30000);
    return () => clearInterval(interval);
  }, [address, isConnected]);

  if (!isConnected || !SmartContractService.isEnabled()) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700">Loading spending data...</span>
        </div>
      </div>
    );
  }

  const spentValue = parseFloat(totalSpent);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-blue-900">Total Spent</div>
            <div className="text-lg font-bold text-blue-800">
              {spentValue.toFixed(4)} ETH
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-blue-600">OnChain Verified</div>
          <div className="flex items-center text-sm text-blue-700">
            <Activity className="w-4 h-4 mr-1" />
            <span>Live Data</span>
          </div>
        </div>
      </div>
      
      {spentValue > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex items-center justify-between text-xs text-blue-600">
            <span>Supporting local businesses onchain</span>
            <span className="flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Real transactions
            </span>
          </div>
        </div>
      )}
      
      {spentValue === 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-600">
            💡 Start making payments to local businesses to see your spending stats!
          </p>
        </div>
      )}
    </div>
  );
}
