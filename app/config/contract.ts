// Contract configuration for LocalBase
export const CONTRACT_CONFIG = {
  // Set to true to use real contract, false for mock mode
  USE_REAL_CONTRACT: true, // ✅ ENABLED - Using real deployed contract
  
  // LocalBasePayment contract address - deployed on Base Sepolia
  CONTRACT_ADDRESS: '0xf80B102B28D174b1B90B15a8c496903Aa589e181', // ✅ DEPLOYED - LocalBasePayment contract on Base Sepolia
  
  // Network configuration
  NETWORK: {
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org'
  }
};

// Deployment info for LocalBasePayment contract:
// Deployer Address: 0x51172823b10Adcf3EFBA347bA6f698882186Da6b
// Status: Ready for deployment when needed
// 4. Set USE_REAL_CONTRACT = true
// 5. Restart development server
