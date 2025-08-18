'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { X, Copy, Check } from 'lucide-react';

export function FundingHelper() {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const { address, isConnected } = useAccount();

  if (!isVisible || !isConnected) return null;

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl shadow-lg animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-red-600 text-xl animate-bounce">�</div>
            <h3 className="text-lg font-bold text-red-900">URGENT: Need Base Sepolia ETH for Testing? (v2.0)</h3>
          </div>
          
          <div className="mb-4 p-3 bg-red-100 rounded-lg border border-red-300">
            <p className="text-sm font-semibold text-red-800 mb-2">
              🔍 ETH Balance Depleted? You likely spent your 0.05 ETH on previous transactions!
            </p>
            <p className="text-xs text-red-700 mb-2">
              • Each payment costs ETH (amount + gas fees)
              • Failed transactions also consume gas
              • Testnet ETH gets spent just like real ETH
            </p>
            <p className="text-xs font-bold text-red-800">
              💡 Solution: Get more test ETH from faucets (most allow daily requests)
            </p>
          </div>
          
          {/* Wallet Address */}
          <div className="mb-4 p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs text-blue-700 font-medium block mb-1">
                  Your Wallet Address:
                </label>
                <code className="text-sm text-gray-700 font-mono">
                  {address?.slice(0, 20)}...{address?.slice(-10)}
                </code>
              </div>
              <button
                onClick={copyAddress}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <p className="text-sm text-blue-700 mb-4">
            Get free test ETH from these faucets to make payments:
          </p>
          
                    <div className="grid md:grid-cols-2 gap-3 mb-4">
            <a 
              href="https://www.alchemy.com/faucets/base-sepolia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors group"
            >
              <span className="mr-2">🔧</span>
              <span>Alchemy Faucet</span>
              <span className="ml-2 text-xs opacity-75">(0.1 ETH daily)</span>
            </a>
            <a 
              href="https://faucet.quicknode.com/base/sepolia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors group"
            >
              <span className="mr-2">⚡</span>
              <span>QuickNode Faucet</span>
              <span className="ml-2 text-xs opacity-75">(0.05 ETH daily)</span>
            </a>
          </div>
          
          {/* Additional Faucets */}
          <div className="grid md:grid-cols-3 gap-2 mb-4">
            <a 
              href="https://faucet.triangleplatform.com/base/sepolia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-center bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              Triangle Faucet
            </a>
            <a 
              href="https://faucet.chainstack.com/base-testnet-faucet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-center bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              Chainstack Faucet
            </a>
            <a 
              href="https://sepolia.basescan.org/address/0xa96D798B2979Ba2bcBa26579C54276481c06c403" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-center bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              Check TX History
            </a>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong className="text-blue-900">Quick Setup:</strong>
              <div className="mt-1 text-xs space-y-1">
                <div>1. Copy your wallet address above</div>
                <div>2. Visit any faucet and paste your address</div>
                <div>3. Request ETH (usually takes 1-2 minutes)</div>
                <div>4. Refresh this page and start making payments!</div>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 text-blue-400 hover:text-blue-600 transition-colors"
          title="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
