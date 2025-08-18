'use client';

import { parseEther, encodeFunctionData } from 'viem';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { Business } from '../../types/localbase';
import { SmartContractService } from '../../services/smartContract';
import { CONTRACT_CONFIG } from '../../config/contract';
import { LocalBasePaymentABI } from '../../contracts/LocalBasePayment.abi';

interface PaymentTransactionProps {
  business: Business;
  amount: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentTransaction({ 
  business, 
  amount, 
  onSuccess, 
  onError 
}: PaymentTransactionProps) {
  const handleOnStatus = (status: LifecycleStatus) => {
    console.log('Payment transaction status:', status);
    
    if (status.statusName === 'success') {
      console.log('✅ Payment successful!', status);
      if (onSuccess) {
        onSuccess();
      }
    } else if (status.statusName === 'error') {
      console.error('❌ Payment failed:', status);
      if (onError) {
        const errorMessage = typeof status.statusData?.error === 'string' 
          ? status.statusData.error 
          : 'Payment failed';
        onError(errorMessage);
      }
    }
  };

  // Smart contract integration: Use real LocalBasePayment contract if enabled
  const calls = SmartContractService.isEnabled() ? [
    {
      to: CONTRACT_CONFIG.CONTRACT_ADDRESS as `0x${string}`,
      value: parseEther(amount),
      data: encodeFunctionData({
        abi: LocalBasePaymentABI,
        functionName: 'payBusiness',
        args: [business.id]
      })
    }
  ] : [
    // Fallback to direct payment for demo mode
    {
      to: business.owner as `0x${string}`,
      value: parseEther(amount),
      data: '0x' as const,
    },
  ];

  return (
    <div className="w-full">
      {/* Smart Contract Integration Status */}
      {SmartContractService.isEnabled() && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-blue-700 font-medium">
              Real Smart Contract Mode
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Payment will be processed through LocalBasePayment contract on Base Sepolia
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Contract: {CONTRACT_CONFIG.CONTRACT_ADDRESS.slice(0, 10)}...
          </p>
        </div>
      )}
      
      <Transaction
        chainId={84532} // Base Sepolia
        calls={calls}
        onStatus={handleOnStatus}
      >
        <TransactionButton
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          text={SmartContractService.isEnabled() 
            ? `Pay ${amount} ETH via Smart Contract` 
            : `Pay ${amount} ETH`
          }
        />
        <TransactionSponsor />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
