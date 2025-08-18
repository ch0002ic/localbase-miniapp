'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { BusinessDirectory } from './components/business/BusinessDirectory';
import { NFTRewards } from './components/loyalty/NFTRewards';
import { CommunityFeed } from './components/social/CommunityFeed';
import { NetworkStatus } from './components/NetworkStatus';
import { SmartContractStatus } from './components/SmartContractStatus';
import { FundingHelper } from './components/FundingHelper';
import { HackathonStatus } from './components/HackathonStatus';

export default function LocalBase() {
  const [activeTab, setActiveTab] = useState('discover');
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);
  
  const tabs = [
    { id: 'discover', label: 'Discover', icon: '🏪' },
    { id: 'rewards', label: 'Rewards', icon: '🏆' },
    { id: 'community', label: 'Community', icon: '👥' },
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <h1 className="text-xl font-bold text-blue-600">LocalBase</h1>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Beta</span>
            {context && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                🚀 MiniKit
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* MiniKit Context Info */}
            {context && (
              <div className="text-xs text-gray-600 hidden md:block">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  FID: {context.user?.fid || 'N/A'}
                </span>
              </div>
            )}
            <NetworkStatus />
            <SmartContractStatus />
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-8 w-8" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </header>

      {/* Hackathon Status Banner */}
      <div className="max-w-6xl mx-auto px-4">
        <HackathonStatus />
      </div>

      {/* Funding Helper Banner */}
      <div className="max-w-6xl mx-auto px-4">
        <FundingHelper />
      </div>
      
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full">
        {activeTab === 'discover' && <BusinessDirectory />}
        {activeTab === 'rewards' && <NFTRewards />}
        {activeTab === 'community' && <CommunityFeed />}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t p-4 text-center text-gray-600">
        <p>LocalBase - Bringing communities together onchain 🚀</p>
        <p className="text-xs mt-1">Built for NTU x Base Web3 Hackathon</p>
      </footer>
    </div>
  );
}
