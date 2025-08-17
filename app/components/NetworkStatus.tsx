'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { AlertCircle, Check, ArrowRightLeft } from 'lucide-react';

export function NetworkStatus() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (!isConnected) return null;

  const isCorrectNetwork = chainId === baseSepolia.id;
  const currentNetworkName = chainId === 1 ? 'Ethereum Mainnet' : 
                            chainId === 84532 ? 'Base Sepolia' : 
                            `Network ${chainId}`;

  const handleSwitchNetwork = () => {
    switchChain({ chainId: baseSepolia.id });
  };

  if (isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
        <Check className="w-4 h-4" />
        <span>Base Sepolia</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{currentNetworkName}</span>
      </div>
      <button
        onClick={handleSwitchNetwork}
        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
      >
        <ArrowRightLeft className="w-3 h-3" />
        Switch to Base
      </button>
    </div>
  );
}
