'use client';

import { useState } from 'react';
import { parseEther } from 'viem';
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
  const [transactionId, setTransactionId] = useState<string>('');

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

  const calls = [
    {
      to: business.owner as `0x${string}`,
      value: parseEther(amount),
      data: '0x' as const,
    },
  ];

  return (
    <div className="w-full">
      <Transaction
        chainId={84532} // Base Sepolia
        calls={calls}
        onStatus={handleOnStatus}
      >
        <TransactionButton
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          text={`Pay ${amount} ETH`}
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
