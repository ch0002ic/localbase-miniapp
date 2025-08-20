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
import { useToastContext } from '../ToastProvider';

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
  const toast = useToastContext();
  // Debug logging for payment amount
  console.log('💰 PaymentTransaction Debug:', { 
    businessName: business.name, 
    paymentAmount: amount, 
    paymentValueInWei: parseEther(amount).toString(),
    smartContractEnabled: SmartContractService.isEnabled()
  });

  const handleOnStatus = (status: LifecycleStatus) => {
    console.log('Payment transaction status:', status);
    
    if (status.statusName === 'success') {
      console.log('✅ Payment successful!', status);
      toast.success(`Payment of ${amount} ETH sent to ${business.name}!`);
      if (onSuccess) {
        onSuccess();
      }
    } else if (status.statusName === 'error') {
      console.log('Payment failed with status:', status);
      
      // Better error handling with null checks
      let errorMessage = 'Payment failed';
      
      if (status.statusData && typeof status.statusData === 'object') {
        // Handle different error types
        const errorData = status.statusData as { error?: string; message?: string; code?: string | number };
        
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (errorData.code) {
          // Handle specific error codes (can be string or number)
          const code = String(errorData.code);
          if (code === 'INSUFFICIENT_FUNDS' || errorMessage.toLowerCase().includes('insufficient')) {
            errorMessage = 'Insufficient ETH balance. Please get Base Sepolia ETH from the faucets at the top of the page and try again.';
          } else if (code === 'USER_REJECTED' || code === '4001') {
            errorMessage = 'Transaction was cancelled by user.';
          } else {
            errorMessage = `Payment failed (Code: ${code})`;
          }
        } else {
          errorMessage = 'Payment failed. Please try again.';
        }
      } else {
        // Handle case where statusData is empty or null
        errorMessage = 'Payment failed. Please check your wallet connection and try again.';
      }
      
      console.warn('Processed error message:', errorMessage);
      
      // Only call onError for actual errors, not user cancellations
      if (onError && !errorMessage.includes('cancelled')) {
        onError(errorMessage);
      }
      
      // Show toast for user-friendly error feedback
      if (!errorMessage.includes('cancelled')) {
        toast.error(errorMessage);
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
