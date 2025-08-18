'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { SmartContractService } from '../services/smartContract';
import { CONTRACT_CONFIG } from '../config/contract';
import { Shield, ExternalLink, Info } from 'lucide-react';

export function SmartContractStatus() {
  const [contractInfo, setContractInfo] = useState<{
    enabled: boolean;
    initialized: boolean;
    userSpent: string;
  }>({
    enabled: false,
    initialized: false,
    userSpent: '0'
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const loadContractInfo = async () => {
      const enabled = SmartContractService.isEnabled();
      
      if (enabled && isConnected && address) {
        try {
          console.log('🔄 Loading contract info for address:', address);
          const initialized = await SmartContractService.initialize();
          
          if (initialized) {
            const userSpent = await SmartContractService.getUserTotalSpent(address);
            console.log('✅ Contract info loaded successfully');
            
            setContractInfo({
              enabled,
              initialized: true,
              userSpent
            });
          } else {
            console.warn('⚠️ Contract initialization failed');
            setContractInfo({
              enabled,
              initialized: false,
              userSpent: '0'
            });
          }
        } catch (error) {
          console.error('❌ Failed to load contract info:', error);
          setContractInfo({
            enabled,
            initialized: false,
            userSpent: '0'
          });
        }
      } else {
        setContractInfo({
          enabled,
          initialized: false,
          userSpent: '0'
        });
      }
    };

    loadContractInfo();
  }, [address, isConnected]);

  if (!contractInfo.enabled) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-800 font-medium">Demo Mode</span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          Using local storage for demo purposes. Real blockchain transactions are disabled.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-sm text-green-800 font-medium">
            Smart Contract Mode Active
          </span>
        </div>
        <button className="text-green-600 hover:text-green-700">
          <Info className="w-4 h-4" />
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2 border-t border-green-200 pt-3">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-green-700 font-medium">Network:</span>
              <p className="text-green-600">{CONTRACT_CONFIG.NETWORK.name}</p>
            </div>
            <div>
              <span className="text-green-700 font-medium">Status:</span>
              <p className="text-green-600">
                {contractInfo.initialized ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
          
          {isConnected && address && (
            <div className="text-xs">
              <span className="text-green-700 font-medium">Your Total Spent:</span>
              <p className="text-green-600">{contractInfo.userSpent} ETH</p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-green-200">
            <div className="text-xs">
              <span className="text-green-700 font-medium">Contract:</span>
              <p className="text-green-600 font-mono">
                {CONTRACT_CONFIG.CONTRACT_ADDRESS.slice(0, 10)}...
              </p>
            </div>
            <a
              href={`https://sepolia.basescan.org/address/${CONTRACT_CONFIG.CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-green-600 hover:text-green-700"
            >
              <span className="text-xs">View</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="bg-green-100 rounded p-2 text-xs text-green-700">
            <p className="font-medium mb-1">Real Blockchain Features:</p>
            <ul className="space-y-0.5 text-green-600">
              <li>• On-chain business registration</li>
              <li>• Smart contract payments</li>
              <li>• Transparent transaction tracking</li>
              <li>• Immutable business records</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
