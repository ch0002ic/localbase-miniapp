'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ExternalLink, Wallet, AlertCircle, Info, Copy, Check } from 'lucide-react';

export function FundingHelper() {
  const [copied, setCopied] = useState(false);
  const { address, isConnected } = useAccount();

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const faucets = [
    {
      name: 'Base Sepolia Faucet',
      url: 'https://www.alchemy.com/faucets/base-sepolia',
      description: 'Official Alchemy faucet for Base Sepolia',
      amount: '0.1 ETH',
      note: 'Requires social login'
    },
    {
      name: 'QuickNode Faucet',
      url: 'https://faucet.quicknode.com/base/sepolia',
      description: 'QuickNode Base Sepolia faucet',
      amount: '0.05 ETH',
      note: 'Daily limit'
    },
    {
      name: 'Base Bridge',
      url: 'https://bridge.base.org/deposit',
      description: 'Bridge ETH from Ethereum mainnet',
      amount: 'Any amount',
      note: 'Requires mainnet ETH'
    }
  ];

  if (!isConnected) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Need Base Sepolia ETH for Testing?
          </h3>
          
          {/* Wallet Address */}
          <div className="mb-3">
            <label className="text-xs text-blue-700 font-medium block mb-1">
              Your Wallet Address:
            </label>
            <div className="flex items-center space-x-2 bg-white rounded border p-2">
              <code className="text-xs text-gray-700 flex-1 font-mono">
                {address?.slice(0, 20)}...{address?.slice(-10)}
              </code>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Faucet Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-blue-800 mb-1">
              Get Free Test ETH:
            </h4>
            {faucets.map((faucet, index) => (
              <div key={index} className="bg-white rounded border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {faucet.name}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {faucet.amount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {faucet.description}
                    </p>
                    {faucet.note && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center">
                        <Info className="w-3 h-3 mr-1" />
                        {faucet.note}
                      </p>
                    )}
                  </div>
                  <a
                    href={faucet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    <span>Get ETH</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
            <p className="font-medium mb-1">Quick Setup:</p>
            <ol className="space-y-0.5 text-blue-700">
              <li>1. Copy your wallet address above</li>
              <li>2. Visit any faucet and paste your address</li>
              <li>3. Wait for ETH to arrive (~1-2 minutes)</li>
              <li>4. Refresh page and try making payments</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
