'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { SmartContractService } from '../../services/smartContract';
import { Business } from '../../types/localbase';
import { DollarSign, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface WithdrawFundsProps {
  business: Business;
  onSuccess?: () => void;
}

export function WithdrawFunds({ business, onSuccess }: WithdrawFundsProps) {
  const [loading, setLoading] = useState(false);
  const [availableFunds, setAvailableFunds] = useState<string>('0');
  const [lastWithdrawal, setLastWithdrawal] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  // Load available funds from smart contract
  useEffect(() => {
    const loadAvailableFunds = async () => {
      if (!SmartContractService.isEnabled() || !business.id) return;

      try {
        // Get business info from smart contract to see totalReceived
        const businessInfo = await SmartContractService.getBusinessInfo(business.id);
        if (businessInfo) {
          setAvailableFunds(businessInfo.totalReceived);
        }
      } catch (error) {
        console.error('Failed to load available funds:', error);
        setAvailableFunds('0');
      }
    };

    loadAvailableFunds();
    
    // Refresh funds every 10 seconds
    const interval = setInterval(loadAvailableFunds, 10000);
    return () => clearInterval(interval);
  }, [business.id]);

  const handleWithdraw = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!SmartContractService.isEnabled()) {
      alert('Smart contract mode is not enabled');
      return;
    }

    if (parseFloat(availableFunds) <= 0) {
      alert('No funds available to withdraw');
      return;
    }

    setLoading(true);
    try {
      console.log(`💰 Withdrawing funds for business: ${business.name}`);
      
      const txHash = await SmartContractService.withdrawPayments(business.id);
      setLastWithdrawal(txHash);
      
      // Update available funds to 0 since we withdrew everything
      setAvailableFunds('0');
      
      alert(`✅ Withdrawal successful!\n\nTransaction: ${txHash}\n\nFunds have been sent to your wallet.`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
      
      let errorMessage = 'Withdrawal failed. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('No payments to withdraw')) {
          errorMessage = 'No payments available to withdraw.';
        } else if (error.message.includes('Not business owner')) {
          errorMessage = 'Only the business owner can withdraw funds.';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was cancelled by user.';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient ETH for gas fees.';
        }
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!SmartContractService.isEnabled()) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">Fund withdrawal requires smart contract mode</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Business Funds
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-500">Available to Withdraw</div>
          <div className="text-2xl font-bold text-green-600">
            {parseFloat(availableFunds).toFixed(4)} ETH
          </div>
        </div>
      </div>

      {/* Withdrawal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-700 font-medium">Total Transactions</div>
          <div className="text-xl font-bold text-blue-900">
            {business.totalTransactions}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-700 font-medium">Business Revenue</div>
          <div className="text-xl font-bold text-green-900">
            {parseFloat(availableFunds).toFixed(4)} ETH
          </div>
        </div>
      </div>

      {/* Withdrawal Action */}
      <div className="space-y-4">
        {parseFloat(availableFunds) > 0 ? (
          <button
            onClick={handleWithdraw}
            disabled={loading || !isConnected}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              loading || !isConnected
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Withdrawal...</span>
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                <span>Withdraw {parseFloat(availableFunds).toFixed(4)} ETH</span>
              </>
            )}
          </button>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No funds available to withdraw</p>
            <p className="text-sm text-gray-500 mt-1">
              Funds will appear here after customers make payments
            </p>
          </div>
        )}

        {!isConnected && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-700">
              Please connect your wallet to withdraw funds.
            </p>
          </div>
        )}
      </div>

      {/* Last Withdrawal Info */}
      {lastWithdrawal && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Recent Withdrawal Successful
            </span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Transaction: {lastWithdrawal.slice(0, 10)}...{lastWithdrawal.slice(-10)}
          </p>
          <a
            href={`https://sepolia.basescan.org/tx/${lastWithdrawal}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-600 hover:text-green-800 underline"
          >
            View on BaseScan →
          </a>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-xs text-gray-500">
        <p>
          💡 <strong>How it works:</strong> Customer payments accumulate in the smart contract. 
          As the business owner, you can withdraw all accumulated funds to your wallet at any time.
        </p>
        <p className="mt-1">
          ⛽ <strong>Gas fees:</strong> Withdrawal transactions require a small amount of ETH for gas fees.
        </p>
      </div>
    </div>
  );
}
