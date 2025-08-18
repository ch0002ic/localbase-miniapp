'use client';

import { AlertTriangle } from 'lucide-react';
import { CONTRACT_CONFIG } from '../config/contract';

export function MockModeBanner() {
  if (CONTRACT_CONFIG.USE_REAL_CONTRACT) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-sm font-medium text-green-800">
              Real Contract Active
            </p>
            <p className="text-xs text-green-700">
              Connected to deployed contract at {CONTRACT_CONFIG.CONTRACT_ADDRESS.slice(0, 10)}... on Base Sepolia
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800">
            Demo Mode Active
          </p>
          <p className="text-xs text-yellow-700 mb-2">
            Transactions are simulated for demonstration. No real funds will be transferred.
          </p>
          <div className="text-xs text-yellow-600">
            <strong>To enable real transactions:</strong>
            <br />
            1. Get Base Sepolia ETH for: <code className="bg-yellow-100 px-1 rounded">0x51172823b10Adcf3EFBA347bA6f698882186Da6b</code>
            <br />
            2. Run deployment script in contracts folder
            <br />
            3. Update contract configuration
          </div>
        </div>
      </div>
    </div>
  );
}
